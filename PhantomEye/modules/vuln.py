"""Vulnerability Assessment Module"""

import requests
from urllib.parse import urljoin
from utils.helpers import print_status
from utils.config import Config

requests.packages.urllib3.disable_warnings()

SENSITIVE_PATHS = [
    "/.git/HEAD", "/.git/config", "/.env", "/.svn/entries",
    "/backup.zip", "/backup.tar.gz", "/site.zip", "/db.sql",
    "/phpinfo.php", "/info.php", "/test.php", "/admin", "/admin/",
    "/administrator", "/login", "/wp-admin", "/wp-login.php",
    "/config.php", "/config.js", "/config.json", "/robots.txt",
    "/sitemap.xml", "/.DS_Store", "/server-status", "/server-info",
    "/api", "/api/v1", "/swagger", "/swagger-ui", "/graphql",
    "/debug", "/console", "/.well-known/security.txt"
]

SECURITY_HEADERS = [
    "Content-Security-Policy",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Strict-Transport-Security",
    "Referrer-Policy",
    "Permissions-Policy",
    "X-XSS-Protection"
]

def run_vuln_assessment(target: str) -> dict:
    results = {
        "sensitive_files": [],
        "missing_headers": [],
        "interesting_findings": [],
        "status_codes": {}
    }

    base_urls = [f"https://{target}", f"http://{target}"]

    print_status("Checking sensitive paths...", "info")
    for base in base_urls:
        for path in SENSITIVE_PATHS:
            url = urljoin(base, path)
            try:
                resp = requests.get(
                    url, timeout=6,
                    headers={"User-Agent": Config.USER_AGENT},
                    verify=False, allow_redirects=False
                )
                code = resp.status_code
                results["status_codes"][path] = code

                if code in [200, 301, 302, 403]:
                    if code == 200 and len(resp.content) > 0:
                        results["sensitive_files"].append({
                            "url": url,
                            "status": code,
                            "length": len(resp.content)
                        })
                        print_status(f"Found: {url} [{code}]", "warning")
                    elif code in [301, 302, 403]:
                        results["interesting_findings"].append(f"{url} → {code}")
            except Exception:
                continue
        break

    print_status(f"Sensitive/Interesting paths found: {len(results['sensitive_files']) + len(results['interesting_findings'])}", "success")

    print_status("Analyzing security headers...", "info")
    for base in base_urls:
        try:
            resp = requests.get(base, timeout=8, headers={"User-Agent": Config.USER_AGENT}, verify=False)
            headers = {k.lower(): v for k, v in resp.headers.items()}
            for h in SECURITY_HEADERS:
                if h.lower() not in headers:
                    results["missing_headers"].append(h)
            print_status(f"Missing security headers: {len(results['missing_headers'])}", "success")
            break
        except Exception:
            continue

    return results
