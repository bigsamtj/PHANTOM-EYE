"""Reconnaissance Module for Phantom Eye"""

import socket
import subprocess
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from utils.helpers import color, print_status
from utils.config import Config

requests.packages.urllib3.disable_warnings()

COMMON_SUBDOMAINS = [
    "www", "mail", "ftp", "localhost", "webmail", "smtp", "pop", "ns1", "webdisk",
    "ns2", "cpanel", "whm", "autodiscover", "autoconfig", "m", "imap", "test",
    "ns", "blog", "pop3", "dev", "www2", "admin", "forum", "news", "vpn", "ns3",
    "mail2", "new", "mysql", "old", "lists", "support", "mobile", "mx", "static",
    "docs", "beta", "shop", "sql", "secure", "demo", "cp", "calendar", "wiki",
    "web", "media", "email", "images", "img", "www1", "intranet", "portal", "video",
    "sip", "dns2", "api", "cdn", "stats", "dns1", "ns4", "www3", "dns", "search",
    "staging", "server", "mx1", "chat", "wap", "my", "svn", "mail1", "sites",
    "proxy", "ads", "online", "app", "stage"
]

def run_recon(target: str) -> dict:
    results = {
        "whois": {},
        "dns": {},
        "subdomains": [],
        "ports": [],
        "technologies": [],
        "headers": {},
        "ip": None
    }

    try:
        ip = socket.gethostbyname(target)
        results["ip"] = ip
        print_status(f"IP Address     : {ip}", "success")
    except Exception as e:
        print_status(f"IP resolve failed: {e}", "error")
        results["ip"] = "N/A"

    print_status("Running WHOIS...", "info")
    try:
        whois_data = subprocess.check_output(
            ["whois", target], stderr=subprocess.STDOUT, timeout=10
        ).decode(errors="ignore")
        results["whois"]["raw"] = whois_data[:2000]
        print_status("WHOIS data retrieved", "success")
    except Exception:
        results["whois"]["raw"] = "WHOIS query not available or host restricted"
        print_status("WHOIS passive record captured", "warning")

    print_status("Enumerating DNS records...", "info")
    dns_types = ["A", "AAAA", "MX", "NS", "TXT", "CNAME"]
    for rtype in dns_types:
        try:
            out = subprocess.check_output(
                ["dig", "+short", target, rtype],
                stderr=subprocess.STDOUT, timeout=5
            ).decode().strip()
            if out:
                results["dns"][rtype] = out.splitlines()
        except Exception:
            results["dns"][rtype] = []

    # If dig is absent or returns empty, provide resolved A record
    if not results["dns"].get("A") and results["ip"] != "N/A":
        results["dns"]["A"] = [results["ip"]]

    print_status(f"DNS records collected: {list(results['dns'].keys())}", "success")

    print_status("Discovering subdomains...", "info")
    found = set()

    def check_sub(sub):
        full = f"{sub}.{target}"
        try:
            socket.gethostbyname(full)
            return full
        except Exception:
            return None

    with ThreadPoolExecutor(max_workers=Config.THREADS) as executor:
        futures = {executor.submit(check_sub, s): s for s in COMMON_SUBDOMAINS[:30]}
        for future in as_completed(futures):
            res = future.result()
            if res:
                found.add(res)

    results["subdomains"] = sorted(list(found))
    print_status(f"Subdomains found: {len(results['subdomains'])}", "success")
    for s in results["subdomains"][:5]:
        print(color(f"    • {s}", "white"))
    if len(results["subdomains"]) > 5:
        print(color(f"    ... and {len(results['subdomains'])-5} more", "white"))

    print_status("Scanning common ports...", "info")
    common_ports = [21, 22, 25, 53, 80, 110, 143, 443, 445, 993, 3306, 3389, 8080, 8443]
    open_ports = []

    def scan_port(port):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1.2)
            result = sock.connect_ex((results["ip"] if results["ip"] != "N/A" else target, port))
            sock.close()
            if result == 0:
                return port
        except Exception:
            return None
        return None

    if results["ip"] != "N/A":
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = {executor.submit(scan_port, p): p for p in common_ports}
            for future in as_completed(futures):
                res = future.result()
                if res:
                    open_ports.append(res)

    results["ports"] = sorted(open_ports)
    print_status(f"Open ports: {results['ports']}", "success")

    print_status("Fetching HTTP headers & tech...", "info")
    for scheme in ["https", "http"]:
        try:
            url = f"{scheme}://{target}"
            resp = requests.get(
                url, timeout=Config.TIMEOUT,
                headers={"User-Agent": Config.USER_AGENT},
                verify=False, allow_redirects=True
            )
            results["headers"] = dict(resp.headers)
            server = resp.headers.get("Server", "Unknown")
            powered = resp.headers.get("X-Powered-By", "")
            results["technologies"].append(f"Server: {server}")
            if powered:
                results["technologies"].append(f"X-Powered-By: {powered}")
            if "cloudflare" in str(resp.headers).lower():
                results["technologies"].append("Cloudflare")
            print_status(f"HTTP {resp.status_code} - Server: {server}", "success")
            break
        except Exception:
            continue

    return results
