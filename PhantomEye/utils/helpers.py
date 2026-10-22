"""Helper functions"""

import requests
from utils.config import Config

COLORS = {
    "red": "\033[91m",
    "green": "\033[92m",
    "yellow": "\033[93m",
    "blue": "\033[94m",
    "cyan": "\033[96m",
    "magenta": "\033[95m",
    "white": "\033[97m",
    "reset": "\033[0m",
    "bold": "\033[1m",
}

def color(text, color_name="white"):
    if Config.NO_COLOR:
        return text
    return f"{COLORS.get(color_name, '')}{text}{COLORS['reset']}"


def save_to_telegram(content: str, bot_token: str, chat_id: str) -> bool:
    if not bot_token or bot_token.startswith("YOUR_") or not chat_id or chat_id.startswith("YOUR_"):
        print_status("Telegram delivery skipped: Bot token or Chat ID is using placeholder values. Update Config in utils/config.py or supply --telegram / --chat-id.", "warning")
        return False
    try:
        max_len = 4000
        chunks = [content[i:i+max_len] for i in range(0, len(content), max_len)]

        for i, chunk in enumerate(chunks):
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": f"```\n{chunk}\n```" if i == 0 else chunk,
                "parse_mode": "Markdown"
            }
            resp = requests.post(url, json=payload, timeout=15)
            if resp.status_code != 200:
                return False
        return True
    except Exception:
        return False


def print_status(msg, status="info"):
    symbols = {
        "info": ("[*]", "cyan"),
        "success": ("[✓]", "green"),
        "warning": ("[!]", "yellow"),
        "error": ("[✗]", "red"),
        "phase": ("[»]", "magenta"),
    }
    sym, col = symbols.get(status, ("[*]", "white"))
    print(color(f"{sym} {msg}", col))
