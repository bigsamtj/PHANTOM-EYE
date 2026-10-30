"""
PHANTOM EYE - Reconnaissance Module
"""

import socket
import subprocess
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from core.config import Config
from core.target import Target


# Common subdomains for basic brute force
COMMON_SUBDOMAINS = [
    "www", "mail", "ftp", "webmail", "smtp", "pop", "ns1", "ns2", "cpanel", "whm",
    "autodiscover", "m", "imap", "test", "dev", "admin", "portal", "api", "cdn",
    "staging", "app", "blog", "shop", "vpn", "remote", "server", "mx", "cloud",
    "beta", "demo", "secure", "support", "docs", "status", "monitor", "db", "sql"
]


def get_dns_records(domain: str) -> dict:
    """Get basic DNS information"""
    records = {
        "A": [],
        "MX": [],
        "NS": [],
        "TXT": []
    }

    try:
        # A record
        try:
            ip = socket.gethostbyname(domain)
            records["A"].append(ip)
        except:
            pass

        # Using dig if available (more complete)
        for rtype in ["MX", "NS", "TXT"]:
            try:
                output = subprocess.check_output(
                    ["dig", "+short", rtype, domain],
                    stderr=subprocess.DEVNULL,
                    timeout=5
                ).decode().strip()
                if output:
                    records[rtype] = [line.strip() for line in output.splitlines() if line.strip()]
            except:
                pass

    except Exception as e:
        print(f"{Config.Colors.WARNING}[!] DNS lookup error: {e}{Config.Colors.END}")

    return records


def check_subdomain(sub: str, domain: str) -> str | None:
    """Check if a subdomain resolves"""
    full = f"{sub}.{domain}"
    try:
        socket.gethostbyname(full)
        return full
    except:
        return None


def find_subdomains(domain: str) -> list:
    """Basic subdomain discovery"""
    found = set()

    print(f"{Config.Colors.CYAN}[*] Checking common subdomains...{Config.Colors.END}")

    with ThreadPoolExecutor(max_workers=Config.DEFAULT_THREADS) as executor:
        futures = {executor.submit(check_subdomain, sub, domain): sub for sub in COMMON_SUBDOMAINS}
        for future in as_completed(futures):
            result = future.result()
            if result:
                found.add(result)
                print(f"{Config.Colors.GREEN}    [+] {result}{Config.Colors.END}")

    return sorted(list(found))


def get_http_info(url: str) -> dict:
    """Get basic HTTP information"""
    info = {
        "status_code": None,
        "server": None,
        "title": None,
        "headers": {}
    }

    try:
        headers = {"User-Agent": Config.USER_AGENT}
        response = requests.get(url, headers=headers, timeout=Config.REQUEST_TIMEOUT, verify=False, allow_redirects=True)
        info["status_code"] = response.status_code
        info["server"] = response.headers.get("Server", "Unknown")
        info["headers"] = dict(response.headers)

        # Try to extract title
        if "<title>" in response.text.lower():
            start = response.text.lower().find("<title>") + 7
            end = response.text.lower().find("</title>", start)
            if end > start:
                info["title"] = response.text[start:end].strip()[:100]

    except Exception as e:
        info["error"] = str(e)

    return info


def run(target: Target) -> dict:
    """Main recon function"""
    print(f"{Config.Colors.CYAN}[*] Starting reconnaissance on {target.domain}{Config.Colors.END}")

    results = {
        "dns": {},
        "subdomains": [],
        "http": {},
        "findings": []
    }

    # DNS Records
    print(f"{Config.Colors.CYAN}[*] Gathering DNS records...{Config.Colors.END}")
    results["dns"] = get_dns_records(target.domain)

    for rtype, values in results["dns"].items():
        if values:
            print(f"    {rtype}: {', '.join(values[:3])}" + (" ..." if len(values) > 3 else ""))

    # Subdomains
    results["subdomains"] = find_subdomains(target.domain)
    print(f"{Config.Colors.GREEN}[+] Found {len(results['subdomains'])} subdomains{Config.Colors.END}")

    # HTTP Info
    print(f"{Config.Colors.CYAN}[*] Checking HTTP services...{Config.Colors.END}")
    for scheme in ["https", "http"]:
        url = f"{scheme}://{target.domain}"
        info = get_http_info(url)
        if info.get("status_code"):
            results["http"][scheme] = info
            print(f"    {scheme.upper()}: {info['status_code']} | Server: {info.get('server')} | Title: {info.get('title', 'N/A')}")

    print(f"{Config.Colors.GREEN}[+] Reconnaissance completed{Config.Colors.END}")
    return results
