import uvicorn
import sys
import os

# Ensure project path is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(BASE_DIR, ".env"))
except ImportError:
    pass

if __name__ == "__main__":
    print("=================================================================")
    print("   YATAR RESILIENCE ENGINE — CINEMATIC TRAVEL RECOVERY")
    print("   Serving Full Application (Frontend UI + Backend Engine APIs)")
    print("   URL: http://127.0.0.1:8000")
    print("   Interactive Docs: http://127.0.0.1:8000/docs")
    print("=================================================================")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
