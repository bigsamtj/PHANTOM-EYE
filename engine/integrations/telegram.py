"""
PHANTOM EYE - Telegram Integration (Improved)
"""

import requests
from core.config import Config


def send_message(text: str, parse_mode: str = "HTML") -> bool:
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
        response = requests.post(url, json=payload, timeout=15)
        return response.status_code == 200
    except Exception as e:
        print(f"{Config.Colors.FAIL}[!] Telegram error: {e}{Config.Colors.END}")
        return False


def send_document(file_path: str, caption: str = "") -> bool:
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
                "caption": caption[:1024] if caption else ""
            }
            response = requests.post(url, data=data, files=files, timeout=60)
            return response.status_code == 200
    except Exception as e:
        print(f"{Config.Colors.FAIL}[!] Failed to send document: {e}{Config.Colors.END}")
        return False


def notify_start(target: str):
    message = f"""
👁 <b>PHANTOM EYE</b> — Assessment Started

🎯 <b>Target:</b> <code>{target}</code>
📅 Status: <b>Running full pipeline...</b>

Phases:
• Reconnaissance
• Scanning & Enumeration
• Vulnerability Analysis
• Reporting + Screenshots

You will receive the full report when finished.
"""
    send_message(message.strip())


def notify_complete(target: str, findings_count: int, duration: float, report_path: str = None, extra_info: dict = None):
    extra_info = extra_info or {}

    open_ports = extra_info.get("open_ports", "N/A")
    subdomains = extra_info.get("subdomains", "N/A")
    high_findings = extra_info.get("high", 0)
    medium_findings = extra_info.get("medium", 0)

    message = f"""
✅ <b>PHANTOM EYE</b> — Assessment Complete

🎯 <b>Target:</b> <code>{target}</code>
⏱ <b>Duration:</b> {duration}s

📊 <b>Summary</b>
• Total Findings: <b>{findings_count}</b>
• High Severity: <b>{high_findings}</b>
• Medium Severity: <b>{medium_findings}</b>
• Open Ports: {open_ports}
• Subdomains: {subdomains}

📁 Full HTML + TXT reports are attached.
"""
    send_message(message.strip())

    if report_path:
        caption = f"PHANTOM EYE Report — {target}"
        send_document(report_path, caption=caption)
