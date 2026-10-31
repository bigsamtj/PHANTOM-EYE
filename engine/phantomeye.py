#!/usr/bin/env python3
"""
PHANTOM EYE - Main CLI Entry Point
Automated Security Assessment Platform
Author: Samuel Adeyinka (Big Sam)
"""

import argparse
import sys
import os
from pathlib import Path

# ======================
# Load .env file automatically
# ======================
def load_env():
    """Load environment variables from .env file"""
    # Look for .env in project root (one level above engine/)
    env_path = Path(__file__).resolve().parent.parent / ".env"
    
    if not env_path.exists():
        # Also try current directory
        env_path = Path(".env")
    
    if env_path.exists():
        print(f"[*] Loading configuration from {env_path}")
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                os.environ[key] = value
    else:
        print("[!] .env file not found. Using default/empty values.")

# Load environment before anything else
load_env()

# Add engine to path
sys.path.insert(0, str(Path(__file__).parent))

from core import Orchestrator, Config


def print_banner():
    banner = f"""
{Config.Colors.HEADER}{Config.Colors.BOLD}
██████╗ ██╗  ██╗ █████╗ ███╗   ██╗████████╗ ██████╗ ███╗   ███╗    ███████╗██╗   ██╗███████╗
██╔══██╗██║  ██║██╔══██╗████╗  ██║╚══██╔══╝██╔═══██╗████╗ ████║    ██╔════╝╚██╗ ██╔╝██╔════╝
██████╔╝███████║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║    █████╗   ╚████╔╝ █████╗  
██╔═══╝ ██╔══██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║    ██╔══╝    ╚██╔╝  ██╔══╝  
██║     ██║  ██║██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║    ███████╗   ██║   ███████╗
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝    ╚══════╝   ╚═╝   ╚══════╝
{Config.Colors.END}
{Config.Colors.CYAN}          👁  Automated Security Assessment Platform  👁
                    Version {Config.VERSION} | Author: {Config.AUTHOR}
{Config.Colors.END}
"""
    print(banner)


def main():
    parser = argparse.ArgumentParser(
        description="PHANTOM EYE - Automated Penetration Testing Platform",
        formatter_class=argparse.RawTextHelpFormatter
    )

    parser.add_argument("target", help="Target domain or IP (e.g. example.com)")
    parser.add_argument("-m", "--module", 
                        choices=["recon", "scanning", "vulnerability", "web", "api", "reporting", "full"],
                        default="full",
                        help="Module to run (default: full)")
    parser.add_argument("-o", "--output", help="Custom report filename")
    parser.add_argument("--telegram", help="Telegram Bot Token")
    parser.add_argument("--chat-id", help="Telegram Chat ID")
    parser.add_argument("-q", "--quiet", action="store_true", help="Quiet mode")
    parser.add_argument("--no-color", action="store_true", help="Disable colored output")

    args = parser.parse_args()

    if args.no_color:
        Config.Colors.HEADER = ""
        Config.Colors.BLUE = ""
        Config.Colors.CYAN = ""
        Config.Colors.GREEN = ""
        Config.Colors.WARNING = ""
        Config.Colors.FAIL = ""
        Config.Colors.END = ""
        Config.Colors.BOLD = ""

    if not args.quiet:
        print_banner()

    # Override Telegram settings if provided
    if args.telegram:
        Config.TELEGRAM_BOT_TOKEN = args.telegram
    if args.chat_id:
        Config.TELEGRAM_CHAT_ID = args.chat_id

    # Decide modules
    if args.module == "full":
        modules = ["recon", "scanning", "vulnerability", "web", "api", "reporting"]
    else:
        modules = [args.module]

    # Start Orchestrator
    engine = Orchestrator(
        target=args.target,
        modules=modules,
        output_file=args.output
    )

    success = engine.run()

    if success:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
