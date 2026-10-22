"""Configuration module for Phantom Eye"""
import os

class Config:
    USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (PhantomEye/1.0)"
    TIMEOUT = 8
    THREADS = 10
    NO_COLOR = False
    QUIET = False

    # =========================================================================
    # TELEGRAM REPORT DISPATCH CONFIGURATION
    # INPUT YOUR TELEGRAM BOT TOKEN AND CHAT ID DIRECTLY BELOW:
    # Example Token: "123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
    # Example Chat ID: "-1001234567890" or "987654321"
    # =========================================================================
    TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "YOUR_TELEGRAM_BOT_TOKEN_HERE")
    TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "YOUR_TELEGRAM_CHAT_ID_HERE")

