#!/usr/bin/env python3
"""
PHANTOM EYE - Offensive Security Automation Framework
Full Terminal Version
Author: SYSTEM_OFFSEC
"""

import argparse
import sys
import os
from datetime import datetime

# Add current folder to sys.path so utils and modules can be imported directly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from modules.recon import run_recon
from modules.vuln import run_vuln_assessment
from modules.owasp import run_owasp_top10
from modules.api_top10 import run_api_top10
from modules.payloads import generate_payloads
from modules.report import generate_report
from utils.banner import print_banner
from utils.helpers import color, save_to_telegram
from utils.config import Config

def parse_args():
    parser = argparse.ArgumentParser(
        description="PHANTOM EYE - Offensive Security Automation Framework",
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument("target", help="Target domain or URL (e.g. example.com)")
    parser.add_argument("-m", "--mode", choices=["full", "recon", "vuln", "owasp", "api", "payload"],
                        default="full", help="Scan mode (default: full)")
    parser.add_argument("-o", "--output", help="Custom output report filename")
    parser.add_argument("--telegram", help="Telegram Bot Token (optional)")
    parser.add_argument("--chat-id", help="Telegram Chat ID (optional)")
    parser.add_argument("--threads", type=int, default=10, help="Number of threads (default: 10)")
    parser.add_argument("--no-color", action="store_true", help="Disable colored output")
    parser.add_argument("-q", "--quiet", action="store_true", help="Minimal output")
    return parser.parse_args()


def main():
    args = parse_args()
    Config.NO_COLOR = args.no_color
    Config.QUIET = args.quiet
    Config.THREADS = args.threads

    if not args.quiet:
        print_banner()

    target = args.target.strip().lower().replace("https://", "").replace("http://", "").split("/")[0]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_dir = "reports"
    os.makedirs(report_dir, exist_ok=True)

    report_file = args.output if args.output else f"{report_dir}/{target}_{timestamp}.txt"

    print(color(f"\n[+] Target        : {target}", "cyan"))
    print(color(f"[+] Mode          : {args.mode.upper()}", "cyan"))
    print(color(f"[+] Started       : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", "cyan"))
    print(color(f"[+] Report        : {report_file}\n", "cyan"))
    print("-" * 60)

    results = {
        "target": target,
        "start_time": datetime.now().isoformat(),
        "recon": {},
        "vuln": {},
        "owasp": {},
        "api": {},
        "payloads": {},
        "errors": []
    }

    try:
        if args.mode in ["full", "recon"]:
            print(color("\n[*] Phase 1/5 : Reconnaissance", "yellow"))
            results["recon"] = run_recon(target)

        if args.mode in ["full", "vuln"]:
            print(color("\n[*] Phase 2/5 : Vulnerability Assessment", "yellow"))
            results["vuln"] = run_vuln_assessment(target)

        if args.mode in ["full", "owasp"]:
            print(color("\n[*] Phase 3/5 : OWASP Top 10 Testing", "yellow"))
            results["owasp"] = run_owasp_top10(target)

        if args.mode in ["full", "api"]:
            print(color("\n[*] Phase 4/5 : API Security Top 10", "yellow"))
            results["api"] = run_api_top10(target)

        if args.mode in ["full", "payload"]:
            print(color("\n[*] Phase 5/5 : Diagnostic Vectors Compilation", "yellow"))
            results["payloads"] = generate_payloads(target, results)

        results["end_time"] = datetime.now().isoformat()

        print(color("\n[*] Generating Report...", "yellow"))
        report_content = generate_report(results, report_file)

        print(color(f"\n[✓] Scan completed successfully", "green"))
        print(color(f"[✓] Report saved → {report_file}", "green"))

        # Telegram Dispatch: Use CLI args if provided, otherwise fallback to in-code Config
        telegram_token = args.telegram or (Config.TELEGRAM_BOT_TOKEN if Config.TELEGRAM_BOT_TOKEN and not Config.TELEGRAM_BOT_TOKEN.startswith("YOUR_") else None)
        telegram_chat = args.chat_id or (Config.TELEGRAM_CHAT_ID if Config.TELEGRAM_CHAT_ID and not Config.TELEGRAM_CHAT_ID.startswith("YOUR_") else None)

        if telegram_token and telegram_chat:
            print(color("\n[*] Sending report to Telegram...", "yellow"))
            success = save_to_telegram(report_content, telegram_token, telegram_chat)
            if success:
                print(color("[✓] Report sent to Telegram", "green"))
            else:
                print(color("[!] Failed to send to Telegram", "red"))
        elif args.telegram or args.chat_id:
            print(color("\n[!] Telegram report delivery skipped: both Bot Token and Chat ID are required.", "yellow"))

    except KeyboardInterrupt:
        print(color("\n\n[!] Scan interrupted by user", "red"))
        sys.exit(1)
    except Exception as e:
        print(color(f"\n[!] Critical error: {str(e)}", "red"))
        results["errors"].append(str(e))
        generate_report(results, report_file)
        sys.exit(1)


if __name__ == "__main__":
    main()
