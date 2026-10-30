"""
PHANTOM EYE - Core Configuration
"""

import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent
REPORTS_DIR = BASE_DIR.parent / "reports"
PAYLOADS_DIR = BASE_DIR / "payloads"

# Create reports folder if it doesn't exist
REPORTS_DIR.mkdir(exist_ok=True)

class Config:
    # General
    APP_NAME = "PHANTOM EYE"
    VERSION = "2.0.0"
    AUTHOR = "Samuel Adeyinka (Big Sam)"

    # Scanning
    DEFAULT_THREADS = int(os.getenv("DEFAULT_SCAN_THREADS", 20))
    REQUEST_TIMEOUT = 10
    USER_AGENT = "Mozilla/5.0 (PhantomEye/2.0 Security Assessment)"

    # Ports to scan by default
    COMMON_PORTS = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 993, 995, 3306, 3389, 5432, 5900, 8080, 8443]

    # Telegram (can be overridden by CLI or .env)
    TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
    TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

    # Output
    REPORTS_PATH = REPORTS_DIR

    # Colors for terminal
    class Colors:
        HEADER = "\033[95m"
        BLUE = "\033[94m"
        CYAN = "\033[96m"
        GREEN = "\033[92m"
        WARNING = "\033[93m"
        FAIL = "\033[91m"
        END = "\033[0m"
        BOLD = "\033[1m"
        UNDERLINE = "\033[4m"
