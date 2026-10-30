"""
PHANTOM EYE - Web Application Testing Module (Basic)
"""

import requests
from core.config import Config
from core.target import Target

requests.packages.urllib3.disable_warnings()


# Simple reflection test payloads
XSS_PAYLOADS = [
    "<script>alert(1)</script>",
    "\"><img src=x onerror=alert(1)>",
    "'\"><svg/onload=alert(1)>"
]

SQLI_PAYLOADS = [
    "'",
    "\"",
    "' OR '1'='1",
    "\" OR \"1\"=\"1",
    "1' ORDER BY 1--"
]


def test_reflection(url: str) -> list:
    """Very basic reflection check (placeholder for real testing)"""
    findings = []
    headers = {"User-Agent": Config.USER_AGENT}

    # This is intentionally lightweight for foundation stage
    # Real XSS/SQLi engines will be added later

    try:
        # Just check if the application reflects input in a simple way
        test_url = url + ("&" if "?" in url else "?") + "phantom=eye_test_12345"
        resp = requests.get(test_url, headers=headers, timeout=Config.REQUEST_TIMEOUT, verify=False)

        if "eye_test_12345" in resp.text:
            findings.append({
                "title": "Input Reflection Detected",
                "severity": "info",
                "url": test_url,
                "description": "Application reflects user input. Manual testing for XSS recommended.",
                "module": "web"
            })
    except:
        pass

    return findings


def check_http_methods(url: str) -> list:
    """Check allowed HTTP methods"""
    findings = []
    headers = {"User-Agent": Config.USER_AGENT}

    try:
        resp = requests.options(url, headers=headers, timeout=Config.REQUEST_TIMEOUT, verify=False)
        allow = resp.headers.get("Allow", "")

        dangerous = []
        for method in ["PUT", "DELETE", "TRACE", "CONNECT"]:
            if method in allow.upper():
                dangerous.append(method)

        if dangerous:
            findings.append({
                "title": f"Potentially Dangerous HTTP Methods Enabled",
                "severity": "medium",
                "url": url,
                "description": f"The following methods are allowed: {', '.join(dangerous)}",
                "module": "web"
            })
    except:
        pass

    return findings


def run(target: Target) -> dict:
    """Main web testing function"""
    print(f"{Config.Colors.CYAN}[*] Starting basic web application checks on {target.domain}{Config.Colors.END}")

    results = {
        "findings": []
    }

    base_url = target.url or f"https://{target.domain}"

    # HTTP Methods
    print(f"{Config.Colors.CYAN}[*] Checking HTTP methods...{Config.Colors.END}")
    method_findings = check_http_methods(base_url)
    results["findings"].extend(method_findings)

    # Basic reflection
    print(f"{Config.Colors.CYAN}[*] Checking for input reflection...{Config.Colors.END}")
    reflection_findings = test_reflection(base_url)
    results["findings"].extend(reflection_findings)

    if not results["findings"]:
        print(f"{Config.Colors.GREEN}    [+] No obvious issues found in basic checks{Config.Colors.END}")

    print(f"{Config.Colors.GREEN}[+] Web checks completed — {len(results['findings'])} findings{Config.Colors.END}")
    return results
