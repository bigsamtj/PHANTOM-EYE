"""
PHANTOM EYE - Screenshot Module (EyeWitness style)
Takes screenshots of live web hosts during assessment
"""

import subprocess
import shutil
from pathlib import Path
from core.config import Config
from core.target import Target


def is_tool_available(tool: str) -> bool:
    return shutil.which(tool) is not None


def run_eyewitness(urls: list, output_dir: str) -> dict:
    """
    Run EyeWitness if installed.
    Fallback: just record the URLs for manual review.
    """
    results = {
        "tool": None,
        "screenshots": [],
        "status": "skipped",
        "message": ""
    }

    if not urls:
        results["message"] = "No live URLs provided"
        return results

    # Write URLs to a temp file
    url_file = Path(output_dir) / "live_urls.txt"
    with open(url_file, "w") as f:
        for url in urls:
            f.write(url + "\n")

    # Prefer EyeWitness
    if is_tool_available("eyewitness"):
        results["tool"] = "eyewitness"
        cmd = [
            "eyewitness",
            "-f", str(url_file),
            "-d", str(Path(output_dir) / "eyewitness"),
            "--web",
            "--no-prompt"
        ]
        try:
            print(f"{Config.Colors.CYAN}[*] Running EyeWitness on {len(urls)} URLs...{Config.Colors.END}")
            subprocess.run(cmd, timeout=300, capture_output=True)
            results["status"] = "completed"
            results["message"] = f"EyeWitness finished. Check {output_dir}/eyewitness"
            print(f"{Config.Colors.GREEN}[+] EyeWitness completed{Config.Colors.END}")
        except Exception as e:
            results["status"] = "failed"
            results["message"] = str(e)
            print(f"{Config.Colors.WARNING}[!] EyeWitness failed: {e}{Config.Colors.END}")

    # Alternative: gowitness
    elif is_tool_available("gowitness"):
        results["tool"] = "gowitness"
        try:
            print(f"{Config.Colors.CYAN}[*] Running gowitness...{Config.Colors.END}")
            subprocess.run([
                "gowitness", "file",
                "-f", str(url_file),
                "-P", str(Path(output_dir) / "gowitness")
            ], timeout=300, capture_output=True)
            results["status"] = "completed"
            results["message"] = "gowitness completed"
            print(f"{Config.Colors.GREEN}[+] gowitness completed{Config.Colors.END}")
        except Exception as e:
            results["status"] = "failed"
            results["message"] = str(e)

    else:
        results["tool"] = "none"
        results["status"] = "skipped"
        results["message"] = "EyeWitness / gowitness not installed. URLs saved for manual review."
        print(f"{Config.Colors.WARNING}[!] No screenshot tool found. Install EyeWitness or gowitness for screenshots.{Config.Colors.END}")
        print(f"{Config.Colors.CYAN}[*] Live URLs saved to: {url_file}{Config.Colors.END}")

    return results


def run(target: Target, live_urls: list = None, output_dir: str = None) -> dict:
    """Main screenshot function"""
    print(f"{Config.Colors.CYAN}[*] Starting screenshot module...{Config.Colors.END}")

    if not live_urls:
        # Default to main target
        live_urls = [target.url or f"https://{target.domain}"]

    if not output_dir:
        output_dir = str(Config.REPORTS_PATH)

    result = run_eyewitness(live_urls, output_dir)
    return result
