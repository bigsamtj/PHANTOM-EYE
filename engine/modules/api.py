"""
PHANTOM EYE - API Security Checks Module (Basic)
"""

import requests
from core.config import Config
from core.target import Target

requests.packages.urllib3.disable_warnings()


COMMON_API_PATHS = [
    "/api",
    "/api/v1",
    "/api/v2",
    "/api/v3",
    "/graphql",
    "/graphiql",
    "/swagger",
    "/swagger.json",
    "/swagger-ui.html",
    "/swagger-ui/",
    "/openapi.json",
    "/api-docs",
    "/v1",
    "/v2",
    "/rest",
    "/api/users",
    "/api/user",
    "/api/admin",
    "/api/login",
    "/api/auth",
    "/api/token",
    "/.well-known/openid-configuration"
]


def discover_api_endpoints(base_url: str) -> list:
    """Discover common API endpoints"""
    found = []
    headers = {"User-Agent": Config.USER_AGENT}

    print(f"{Config.Colors.CYAN}[*] Looking for common API endpoints...{Config.Colors.END}")

    for path in COMMON_API_PATHS:
        url = base_url.rstrip("/") + path
        try:
            resp = requests.get(url, headers=headers, timeout=Config.REQUEST_TIMEOUT, verify=False, allow_redirects=False)

            if resp.status_code in [200, 201, 301, 302, 401, 403]:
                print(f"{Config.Colors.GREEN}    [+] Found: {path} (Status: {resp.status_code}){Config.Colors.END}")
                found.append({
                    "path": path,
                    "url": url,
                    "status_code": resp.status_code
                })
        except:
            continue

    return found


def run(target: Target) -> dict:
    """Main API module"""
    print(f"{Config.Colors.CYAN}[*] Starting API discovery on {target.domain}{Config.Colors.END}")

    results = {
        "endpoints": [],
        "findings": []
    }

    base_url = target.url or f"https://{target.domain}"

    endpoints = discover_api_endpoints(base_url)
    results["endpoints"] = endpoints

    for ep in endpoints:
        severity = "info"
        if ep["status_code"] in [200, 201]:
            severity = "medium"
        if "admin" in ep["path"] or "token" in ep["path"]:
            severity = "high"

        results["findings"].append({
            "title": f"API Endpoint Discovered: {ep['path']}",
            "severity": severity,
            "url": ep["url"],
            "status_code": ep["status_code"],
            "description": f"API-related endpoint responded with HTTP {ep['status_code']}",
            "module": "api"
        })

    print(f"{Config.Colors.GREEN}[+] API discovery completed — {len(endpoints)} endpoints found{Config.Colors.END}")
    return results
