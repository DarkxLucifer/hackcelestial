"""
nugen_align.py

Uploads plain-text domain documents and benchmark evaluations to Nugen Intelligence,
creates an alignment project, polls status, and automatically retrieves full failure
diagnostics (error, stage_failures, degraded) on the detail route.

Features:
- --check-only <alignment_id_or_name>: Query failure details for an existing run
- --corpus-dir <path>: Uploads domain documents (auto-normalizes CRLF to LF)
- --benchmark-file <path>: Uploads benchmark JSON evaluation pairs
- Auto-fetches GET /api/v3/alignment-projects/{id} if a run fails
"""

import argparse
import glob
import os
import sys
import time
import json
from pathlib import Path
import requests

API_BASE = "https://api.nugen.in"


def get_api_key():
    key = os.environ.get("NUGEN_API_KEY")
    if not key:
        env_file = Path(__file__).parent / ".env"
        if env_file.exists():
            for line in env_file.read_text(encoding="utf-8").splitlines():
                if line.startswith("NUGEN_API_KEY="):
                    key = line.split("=", 1)[1].strip().strip('"').strip("'")
                    break
    if not key:
        raise RuntimeError("Set NUGEN_API_KEY environment variable or in .env before running.")
    return key


def check_alignment_details(alignment_id_or_name, api_key):
    headers = {"Authorization": f"Bearer {api_key}"}
    alignment_id = alignment_id_or_name

    # If user passed a project name, resolve to ID via list
    if not alignment_id.startswith("alignment_"):
        print(f"Resolving project name '{alignment_id_or_name}' to ID...")
        r = requests.get(f"{API_BASE}/api/v3/alignment-projects/list", headers=headers, timeout=15)
        if r.status_code == 200:
            for p in r.json().get("alignment_projects", []):
                if p.get("alignment_name") == alignment_id_or_name or alignment_id_or_name in p.get("alignment_name", ""):
                    alignment_id = p["alignment_id"]
                    print(f"  Matched alignment ID: {alignment_id}")
                    break

    print(f"\nFetching detailed diagnostic for: {alignment_id}")
    resp = requests.get(f"{API_BASE}/api/v3/alignment-projects/{alignment_id}", headers=headers, timeout=20)
    if resp.status_code != 200:
        print(f"Failed to fetch detail ({resp.status_code}): {resp.text}")
        return

    data = resp.json()
    print("=" * 70)
    print("NUGEN ALIGNMENT PROJECT DIAGNOSTIC")
    print("=" * 70)
    print(f"Alignment ID    : {data.get('alignment_id')}")
    print(f"Alignment Name  : {data.get('alignment_name')}")
    print(f"Base Model      : {data.get('base_model_id')}")
    print(f"Status          : {data.get('status')}")
    print(f"Error Message   : {data.get('error')}")
    print(f"Stage Failures  : {data.get('stage_failures')}")
    print(f"Degraded Status : {data.get('degraded')}")
    print(f"Document Count  : {data.get('document_count')} -> {data.get('document_ids')}")
    print(f"Benchmark ID    : {data.get('benchmark_id')}")
    print(f"Evaluation ID   : {data.get('evaluation_id')}")
    print(f"Created At      : {data.get('created_at')}")
    print(f"Updated At      : {data.get('updated_at')}")
    print("=" * 70)
    return data


def upload_documents(corpus_dir, api_key):
    files_to_upload = glob.glob(os.path.join(corpus_dir, "**", "*.txt"), recursive=True)
    files_to_upload += glob.glob(os.path.join(corpus_dir, "**", "*.md"), recursive=True)

    if not files_to_upload:
        raise RuntimeError(f"No .txt/.md files found under {corpus_dir}")

    print(f"Found {len(files_to_upload)} files to upload.")
    document_ids = []
    headers = {"Authorization": f"Bearer {api_key}"}

    batch_size = 5
    for i in range(0, len(files_to_upload), batch_size):
        batch = files_to_upload[i : i + batch_size]
        files_payload = []
        opened = []
        try:
            for path in batch:
                # Read, normalize CRLF to plain LF, and prepare byte stream
                with open(path, "rb") as rf:
                    content = rf.read().replace(b"\r\n", b"\n")
                files_payload.append(("files", (os.path.basename(path), content, "text/plain")))

            resp = requests.post(
                f"{API_BASE}/api/v3/documents/create",
                headers=headers,
                files=files_payload,
                data={"categories": ["travel-disruption"] * len(batch)},
                timeout=120,
            )
            if resp.status_code in [200, 201]:
                batch_ids = resp.json().get("document_ids", [])
                document_ids.extend(batch_ids)
                print(f"  Uploaded batch {i // batch_size + 1}: {len(batch_ids)} documents")
            elif resp.status_code == 409:
                # Document already exists; extract document_id
                detail = resp.json().get("detail", {})
                existing_id = detail.get("document_id")
                if existing_id:
                    print(f"  Document already exists on Nugen: {existing_id}")
                    document_ids.append(existing_id)
            else:
                resp.raise_for_status()
        finally:
            for fh in opened:
                fh.close()

    return list(set(document_ids))


def upload_benchmark(benchmark_file, benchmark_name, api_key):
    """Uploads benchmark JSON file to Nugen /api/v3/benchmarks/create"""
    headers = {"Authorization": f"Bearer {api_key}"}
    with open(benchmark_file, "rb") as f:
        files = {"file": (os.path.basename(benchmark_file), f, "application/json")}
        data = {"benchmark_name": benchmark_name or "voyage_domain_benchmark"}
        resp = requests.post(
            f"{API_BASE}/api/v3/benchmarks/create",
            headers=headers,
            files=files,
            data=data,
            timeout=60
        )
        if resp.status_code in [200, 201]:
            b_id = resp.json().get("benchmark_id")
            print(f"Benchmark uploaded successfully: {b_id}")
            return b_id
        elif resp.status_code == 409:
            b_id = resp.json().get("detail", {}).get("benchmark_id")
            print(f"Benchmark already exists: {b_id}")
            return b_id
        else:
            print(f"Warning: benchmark upload returned {resp.status_code}: {resp.text}")
            return None


def wait_for_documents_ready(document_ids, api_key, poll_seconds=4, timeout_seconds=300):
    headers = {"Authorization": f"Bearer {api_key}"}
    pending = set(document_ids)
    start = time.time()

    while pending:
        if time.time() - start > timeout_seconds:
            raise TimeoutError(f"Documents still not READY after {timeout_seconds}s: {pending}")

        for doc_id in list(pending):
            resp = requests.get(
                f"{API_BASE}/api/v3/documents/{doc_id}/status", headers=headers, timeout=15
            )
            if resp.status_code == 200:
                status = resp.json().get("status")
                if status == "READY":
                    pending.discard(doc_id)
                elif status in ("FAILED", "ERROR"):
                    raise RuntimeError(f"Document {doc_id} failed processing: {resp.json()}")

        if pending:
            print(f"  Waiting on {len(pending)} documents to finish processing...")
            time.sleep(poll_seconds)

    print("All documents READY.")


def create_alignment(document_ids, alignment_name, base_model, description, api_key, benchmark_id=None):
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "alignment_name": alignment_name,
        "base_model_id": base_model,
        "document_ids": document_ids,
        "description": description,
    }
    if benchmark_id:
        payload["benchmark_id"] = benchmark_id

    resp = requests.post(
        f"{API_BASE}/api/v3/alignment-projects/create",
        headers=headers,
        json=payload,
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()


def poll_alignment_status(alignment_id, api_key, poll_seconds=10, timeout_seconds=1800):
    headers = {"Authorization": f"Bearer {api_key}"}
    start = time.time()

    while True:
        resp = requests.get(
            f"{API_BASE}/api/v3/alignment-projects/{alignment_id}/status",
            headers=headers,
            timeout=20,
        )
        resp.raise_for_status()
        data = resp.json()
        status = data.get("status")
        print(f"  Alignment status: {status}")

        if status in ("COMPLETED", "SUCCEEDED", "READY"):
            return data
        if status in ("FAILED", "ERROR"):
            print("\nAlignment reached FAILED state. Fetching diagnostic failure details...")
            check_alignment_details(alignment_id, api_key)
            raise RuntimeError(f"Alignment failed: {data}")
        if time.time() - start > timeout_seconds:
            raise TimeoutError(f"Alignment still not complete after {timeout_seconds}s")

        time.sleep(poll_seconds)


def main():
    ap = argparse.ArgumentParser(description="Nugen Intelligence Domain Alignment CLI")
    ap.add_argument("--check-only", default=None, help="Check diagnostic error for an existing alignment ID or name")
    ap.add_argument("--corpus-dir", default=None, help="Folder containing .txt / .md files to upload")
    ap.add_argument("--alignment-name", default="Voyage Travel Disruption Alignment")
    ap.add_argument("--base-model", default="llama-v3p2-3b-reasoning")
    ap.add_argument("--description", default="Multi-modal travel resilience & weather twin alignment")
    ap.add_argument("--benchmark-file", default=None, help="Path to benchmark JSON evaluation file")
    ap.add_argument("--benchmark-name", default="voyage_domain_benchmark")
    ap.add_argument("--benchmark-id", default=None)
    args = ap.parse_args()

    api_key = get_api_key()

    if args.check_only:
        check_alignment_details(args.check_only, api_key)
        return

    if not args.corpus_dir:
        print("Error: --corpus-dir or --check-only is required.")
        sys.exit(1)

    print("Step 1: Uploading documents...")
    document_ids = upload_documents(args.corpus_dir, api_key)
    print(f"Documents ready for alignment: {document_ids}")

    print("\nStep 2: Waiting for documents to be READY...")
    wait_for_documents_ready(document_ids, api_key)

    benchmark_id = args.benchmark_id
    if args.benchmark_file and not benchmark_id:
        print("\nStep 2b: Uploading benchmark evaluation file...")
        benchmark_id = upload_benchmark(args.benchmark_file, args.benchmark_name, api_key)

    print("\nStep 3: Creating alignment project...")
    result = create_alignment(
        document_ids,
        args.alignment_name,
        args.base_model,
        args.description,
        api_key,
        benchmark_id=benchmark_id,
    )
    alignment_id = result["alignment_id"]
    print(f"Alignment project created: {alignment_id} (status: {result['status']})")

    print("\nStep 4: Polling alignment status until complete...")
    final = poll_alignment_status(alignment_id, api_key)
    print("\nAlignment complete:")
    print(final)


if __name__ == "__main__":
    main()
