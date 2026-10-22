"""Global configuration"""
import os

class Config:
    NO_COLOR = False
    QUIET = False
    THREADS = 10
    USER_AGENT = "Mozilla/5.0 (PhantomEye/1.0; Offensive Security Scanner)"
    TIMEOUT = 10

    # =========================================================================
    # TELEGRAM REPORT DISPATCH CONFIGURATION
    # INPUT YOUR TELEGRAM BOT TOKEN AND CHAT ID DIRECTLY BELOW:
    # Example Token: "123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
    # Example Chat ID: "-1001234567890" or "987654321"
    # =========================================================================
    TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "YOUR_TELEGRAM_BOT_TOKEN_HERE")
    TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "YOUR_TELEGRAM_CHAT_ID_HERE")

