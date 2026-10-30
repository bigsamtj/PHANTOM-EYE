"""
PHANTOM EYE - Telegram Integration
"""

import requests
from core.config import Config


def send_message(text: str, parse_mode: str = "HTML") -> bool:
    """Send a text message to Telegram"""
    token = Config.TELEGRAM_BOT_TOKEN
    chat_id = Config.TELEGRAM_CHAT_ID

    if not token or not chat_id:
        print(f"{Config.Colors.WARNING}[!] Telegram not configured{Config.Colors.END}")
        return False

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": parse_mode,
        "disable_web_page_preview": True
    }

    try:
        response = requests.post(url, json=payload, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f"{Config.Colors.FAIL}[!] Telegram error: {e}{Config.Colors.END}")
        return False


def send_document(file_path: str, caption: str = "") -> bool:
    """Send a file (report) to Telegram"""
    token = Config.TELEGRAM_BOT_TOKEN
    chat_id = Config.TELEGRAM_CHAT_ID

    if not token or not chat_id:
        return False

    url = f"https://api.telegram.org/bot{token}/sendDocument"

    try:
        with open(file_path, "rb") as f:
            files = {"document": f}
            data = {
                "chat_id": chat_id,
                "caption": caption
            }
            response = requests.post(url, data=data, files=files, timeout=30)
            return response.status_code == 200
    except Exception as e:
        print(f"{Config.Colors.FAIL}[!] Failed to send document: {e}{Config.Colors.END}")
        return False


def notify_start(target: str):
    """Notify that assessment has started"""
    message = f"""
👁 <b>PHANTOM EYE</b> — Assessment Started

🎯 <b>Target:</b> <code>{target}</code>
⏱ Status: Running...
"""
    send_message(message.strip())


def notify_complete(target: str, findings_count: int, duration: float, report_path: str = None):
    """Notify that assessment is complete"""
    message = f"""
✅ <b>PHANTOM EYE</b> — Assessment Complete

🎯 <b>Target:</b> <code>{target}</code>
🔍 <b>Findings:</b> {findings_count}
⏱ <b>Duration:</b> {duration}s
"""
    send_message(message.strip())

    if report_path:
        send_document(report_path, caption=f"Report for {target}")
