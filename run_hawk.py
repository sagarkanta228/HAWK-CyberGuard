import os
import sys
import time
import subprocess
import webbrowser
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def start_backend():
    print("[1/3] Starting HAWK Django REST Backend on http://127.0.0.1:8000 ...")
    backend_dir = BASE_DIR / "backend-django"
    env = os.environ.copy()
    env["KMP_DUPLICATE_LIB_OK"] = "TRUE"
    return subprocess.Popen(
        [sys.executable, "manage.py", "runserver", "127.0.0.1:8000"],
        cwd=str(backend_dir),
        env=env
    )

def start_frontend():
    print("[2/3] Starting HAWK Next.js Frontend on http://localhost:3000 ...")
    frontend_dir = BASE_DIR / "frontend-next"
    return subprocess.Popen(
        ["npm.cmd", "run", "dev"],
        cwd=str(frontend_dir),
        shell=True
    )

def main():
    print("=" * 70)
    print("  HAWK: Multi-Vector AI Threat Defense Platform Launcher")
    print("  • PhishX (LightGBM + CharCNN)")
    print("  • EMBER2024 (14 Benchmark Malware Boosters)")
    print("  • DeepGuard (MS-EffGCViT Hybrid Vision)")
    print("  • Database: Neon PostgreSQL")
    print("=" * 70)

    backend_proc = start_backend()
    time.sleep(3)
    frontend_proc = start_frontend()
    time.sleep(4)

    url = "http://localhost:3000"
    print(f"[3/3] Opening browser at {url} ...")
    webbrowser.open(url)

    print("\n[HAWK System Online] Press Ctrl+C to stop both servers.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down HAWK servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Shutdown complete.")

if __name__ == "__main__":
    main()

