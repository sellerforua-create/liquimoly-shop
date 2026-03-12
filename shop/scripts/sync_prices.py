#!/usr/bin/env python3
"""Автоматична синхронізація цін кожні 6 годин через cron."""
import subprocess, sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

if __name__ == "__main__":
    result = subprocess.run(
        ["python3", "/Users/acab/.openclaw/workspace/shop/scripts/import_xml.py", "3411"],
        env={**os.environ, "DATABASE_URL": "postgresql+asyncpg://shop@localhost:5432/shop_db", "PRICE_MARKUP": "20"},
        capture_output=True, text=True
    )
    print(result.stdout)
    if result.returncode != 0:
        print("ERROR:", result.stderr, file=sys.stderr)
