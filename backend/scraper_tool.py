import os
import re
import requests
from typing import Dict, Any, Optional
from bs4 import BeautifulSoup

class AgentWebScraper:
    """
    Intelligent Web Scraping & Content Retrieval Tool.
    Equipped with multi-strategy fetching:
    1. Direct HTTP parsing with User-Agent spoofing and BeautifulSoup.
    2. Jina Reader / Agent-Reach headless markdown extraction (zero-key web browsing).
    """

    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
    }

    @classmethod
    def scrape_url(cls, url: str, max_text_length: int = 2000) -> Dict[str, Any]:
        """
        Scrapes any domain, extracting title, headings, clean text, and metadata.
        """
        if not url.startswith("http://") and not url.startswith("https://"):
            url = f"https://{url}"

        # Strategy 1: Direct BeautifulSoup extraction
        try:
            resp = requests.get(url, headers=cls.HEADERS, timeout=10)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "html.parser")

                # Remove non-content tags
                for tag in soup(["script", "style", "noscript", "svg", "header", "footer"]):
                    tag.decompose()

                title = soup.title.string.strip() if soup.title and soup.title.string else ""
                
                # Meta description
                meta_desc = ""
                desc_tag = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
                if desc_tag and desc_tag.get("content"):
                    meta_desc = desc_tag["content"].strip()

                # Headings
                headings = [h.get_text().strip() for h in soup.find_all(["h1", "h2"]) if h.get_text().strip()][:5]

                # Clean visible text
                text = " ".join(soup.get_text().split())
                truncated_text = text[:max_text_length] + ("..." if len(text) > max_text_length else "")

                return {
                    "status": "SUCCESS",
                    "url": url,
                    "status_code": resp.status_code,
                    "title": title,
                    "description": meta_desc,
                    "headings": headings,
                    "text_preview": truncated_text,
                    "char_count": len(text),
                    "method": "BeautifulSoup Direct Scraper"
                }
        except Exception as e:
            direct_error = str(e)
        else:
            direct_error = f"HTTP {resp.status_code}"

        # Strategy 2: Agent-Reach / Jina Reader zero-key fallback
        try:
            reader_url = f"https://r.jina.ai/{url}"
            resp = requests.get(reader_url, headers={"Accept": "application/json"}, timeout=12)
            if resp.status_code == 200:
                data = resp.json() if "application/json" in resp.headers.get("Content-Type", "") else {"data": {"content": resp.text}}
                content = data.get("data", {}).get("content", resp.text)
                return {
                    "status": "SUCCESS",
                    "url": url,
                    "title": data.get("data", {}).get("title", url),
                    "description": data.get("data", {}).get("description", ""),
                    "text_preview": content[:max_text_length],
                    "char_count": len(content),
                    "method": "Agent-Reach / Jina Reader Engine"
                }
        except Exception as e:
            return {
                "status": "ERROR",
                "url": url,
                "error": f"Scraping failed: {direct_error} | Fallback: {str(e)}"
            }

        return {
            "status": "ERROR",
            "url": url,
            "error": direct_error
        }

if __name__ == "__main__":
    import sys
    test_url = sys.argv[1] if len(sys.argv) > 1 else "https://example.com"
    print(f"Scraping {test_url}...")
    result = AgentWebScraper.scrape_url(test_url)
    print(result)
