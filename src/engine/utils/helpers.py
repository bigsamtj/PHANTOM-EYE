"""Helper utilities for Phantom Eye"""

import sys
from utils.config import Config

COLORS = {
    "red": "\033[91m",
    "green": "\033[92m",
    "yellow": "\033[93m",
    "blue": "\033[94m",
    "magenta": "\033[95m",
    "cyan": "\033[96m",
    "white": "\033[97m",
    "reset": "\033[0m"
}

def color(text: str, col: str) -> str:
    if Config.NO_COLOR:
        return text
    code = COLORS.get(col.lower(), COLORS["reset"])
    return f"{code}{text}{COLORS['reset']}"

def print_status(message: str, status_type: str = "info"):
    if Config.QUIET and status_type == "info":
        return
    prefixes = {
        "info": color("[*]", "cyan"),
        "success": color("[+]", "green"),
        "warning": color("[!]", "yellow"),
        "error": color("[-]", "red")
    }
    prefix = prefixes.get(status_type, prefixes["info"])
    print(f"{prefix} {message}")

def save_to_telegram(content: str, bot_token: str, chat_id: str) -> bool:
    if not bot_token or bot_token.startswith("YOUR_") or not chat_id or chat_id.startswith("YOUR_"):
        print_status("Telegram delivery skipped: Bot token or Chat ID is using placeholder values. Update Config in utils/config.py or supply --telegram / --chat-id.", "warning")
        return False
    try:
        import requests
        max_len = 4000
        chunks = [content[i:i+max_len] for i in range(0, len(content), max_len)]
        for i, chunk in enumerate(chunks):
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": f"```\n{chunk}\n```" if i == 0 else chunk,
                "parse_mode": "Markdown"
            }
            res = requests.post(url, json=payload, timeout=12)
            if res.status_code != 200:
                return False
        return True
    except Exception:
        return False
