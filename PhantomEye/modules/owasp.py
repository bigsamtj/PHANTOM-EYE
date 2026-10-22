
"""Phantom Eye — OWASP Top 10 Testing Module.

Target-driven assessment engine for CLI and web application integration.

Install:
    pip install requests

The caller must supply the target URL explicitly.
Active reflection checks require an exact authorized-host allowlist.
TLS verification remains enabled.
"""

from datetime import datetime, timezone
from urllib.parse import urlparse, urljoin, quote
import ipaddress
import socket
import uuid

import requests

from utils.helpers import print_status
from utils.config import Config


MODULE_VERSION = "2.0.0"
DEFAULT_TIMEOUT = 8
MAX_RESPONSE_BYTES = 1_000_000

XSS_PAYLOADS = [
    "<script>alert('PhantomEye')</script>",
    '"><script>alert(1)</script>',
    "'\"><img src=x onerror=alert(1)>",
]

SQLI_PAYLOADS = [
    "' OR '1'='1",
    "' OR 1=1--",
    '" OR "1"="1',
    "1' ORDER BY 1--+",
    "' UNION SELECT NULL--",
]

# Retained as inventory only. This module does not execute these probes.
LFI_PAYLOADS = [
    "../../../../etc/passwd",
    "/etc/passwd",
    "/proc/self/environ",
]

RCE_PAYLOADS = [
    "; id",
    "| id",
    "$(id)",
]

SSRF_PAYLOADS = [
    "http://127.0.0.1",
    "http://localhost",
    "http://169.254.169.254/latest/meta-data/",
]

OPEN_REDIRECT_PAYLOADS = [
    "//example.invalid",
    "https://example.invalid",
]

AUTH_PATHS = [
    "/login",
    "/admin",
    "/administrator",
    "/wp-login.php",
    "/user/login",
    "/signin",
]

SECURITY_HEADERS = [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
]


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def normalize_target(target: str) -> str:
    """Validate and normalize the explicitly supplied HTTP(S) target."""
    if not isinstance(target, str) or not target.strip():
        raise ValueError("Enter a target URL before starting an assessment.")

    target = target.strip()

    if "://" not in target:
        target = "https://" + target

    parsed = urlparse(target)

    if parsed.scheme.lower() not in ("http", "https"):
        raise ValueError("Only HTTP and HTTPS targets are supported.")

    if not parsed.hostname:
        raise ValueError("The target URL has no valid hostname.")

    if parsed.username or parsed.password:
        raise ValueError("Credentials embedded in URLs are not permitted.")

    if parsed.query or parsed.fragment:
        raise ValueError(
            "Enter a base URL without a query string or fragment."
        )

    try:
        parsed.port  # Trigger validation of malformed ports.
    except ValueError as exc:
        raise ValueError("The target URL contains an invalid port.") from exc

    return target.rstrip("/")


def validate_scope(target: str, authorized_hosts: set[str]) -> bool:
    """Require an exact hostname match before active testing."""
    hostname = urlparse(target).hostname

    return bool(
        hostname
        and hostname.lower()
        in {host.strip().lower() for host in authorized_hosts}
    )


def validate_public_destination(hostname: str) -> None:
    """Reject obvious non-public IP destinations.

    Production deployments must also enforce DNS pinning and network-level
    egress restrictions to mitigate DNS rebinding and resolution races.
    """
    try:
        addresses = {
            ipaddress.ip_address(hostname)
        }
    except ValueError:
        try:
            records = socket.getaddrinfo(
                hostname, None, type=socket.SOCK_STREAM
            )
            addresses = {
                ipaddress.ip_address(record[4][0])
                for record in records
            }
        except socket.gaierror as exc:
            raise ValueError("The target hostname could not be resolved.") from exc

    for address in addresses:
        if not address.is_global:
            raise ValueError(
                "The target resolves to a non-public IP address. "
                "Internal destinations are blocked by this module."
            )


def make_session():
    session = requests.Session()
    session.headers.update({
        "User-Agent": getattr(
            Config, "USER_AGENT", "PhantomEye/2.0"
        ),
        "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
    })
    return session


def safe_get(session, url, timeout=DEFAULT_TIMEOUT):
    """GET without automatically following redirects."""
    try:
        response = session.get(
            url,
            timeout=timeout,
            verify=True,
            allow_redirects=False,
            stream=True,
        )

        try:
            chunks = []
            size = 0

            for chunk in response.iter_content(chunk_size=8192):
                if not chunk:
                    continue

                remaining = MAX_RESPONSE_BYTES - size
                if remaining <= 0:
                    break

                chunks.append(chunk[:remaining])
                size += min(len(chunk), remaining)

                if size >= MAX_RESPONSE_BYTES:
                    break

            body = b"".join(chunks).decode(
                response.encoding or "utf-8",
                errors="replace",
            )

            return {
                "ok": True,
                "status_code": response.status_code,
                "url": response.url,
                "headers": dict(response.headers),
                "body": body,
                "truncated": size >= MAX_RESPONSE_BYTES,
                "error": None,
            }
        finally:
            response.close()

    except requests.exceptions.RequestException as exc:
        return {
            "ok": False,
            "status_code": None,
            "url": url,
            "headers": {},
            "body": "",
            "truncated": False,
            "error": str(exc)[:300],
        }


def run_owasp_top10(
    target: str,
    *,
    authorized_hosts=None,
    timeout=DEFAULT_TIMEOUT,
    require_public_target=True,
) -> dict:
    """Run target-driven, non-destructive HTTP security checks.

    Web application example:
        run_owasp_top10(
            submitted_url,
            authorized_hosts={"staging.example.com"},
        )

    Do not trust authorization values supplied solely by the browser.
    The server must enforce user permissions and approved scope.
    """
    base = normalize_target(target)
    parsed = urlparse(base)
    hostname = parsed.hostname.lower()

    if not 1 <= timeout <= 60:
        raise ValueError("Timeout must be between 1 and 60 seconds.")

    if authorized_hosts is None:
        authorized_hosts = set()

    if require_public_target:
        validate_public_destination(hostname)

    results = {
        "tool": "Phantom Eye",
        "module": "OWASP Top 10 Testing Module",
        "version": MODULE_VERSION,
        "target": base,
        "started_at": utc_now(),
        "completed_at": None,
        "summary": {
            "requests_sent": 0,
            "findings_count": 0,
            "potential_findings": 0,
            "errors": 0,
        },
        "checks": {},
        "findings": [],
        "payload_inventory": {
            "xss": XSS_PAYLOADS,
            "sqli": SQLI_PAYLOADS,
            "lfi": LFI_PAYLOADS,
            "rce": RCE_PAYLOADS,
            "ssrf": SSRF_PAYLOADS,
            "open_redirect": OPEN_REDIRECT_PAYLOADS,
        },
        "limitations": {
            "sql_injection": "Not tested by this module.",
            "lfi": "Not tested by this module.",
            "rce": "Not tested by this module.",
            "ssrf": "Not tested by this module.",
            "open_redirect": "Not tested by this module.",
            "access_control": "Requires role-based test identities.",
            "authentication": "Route discovery is informational only.",
            "dependency_audit": "Requires dependency inventory and advisory checks.",
            "logging_monitoring": "Requires application or infrastructure evidence.",
        },
    }

    session = make_session()

    try:
        print_status(f"Target: {base}", "info")
        print_status("Checking baseline HTTP response...", "info")

        baseline = safe_get(session, base + "/", timeout)
        results["summary"]["requests_sent"] += 1

        results["checks"]["baseline"] = {
            "status": "completed" if baseline["ok"] else "error",
            "http_status": baseline["status_code"],
            "error": baseline["error"],
        }

        if not baseline["ok"]:
            results["summary"]["errors"] += 1
        else:
            headers = {
                key.lower(): value
                for key, value in baseline["headers"].items()
            }

            missing_headers = []

            for header in SECURITY_HEADERS:
                if header.lower() not in headers:
                    missing_headers.append(header)

            header_findings = [{
                "id": str(uuid.uuid4()),
                "category": "A05_Security_Misconfiguration",
                "title": f"Header not observed: {header}",
                "severity": "informational",
                "status": "observed",
                "evidence": (
                    "The header was absent from the inspected response."
                ),
                "recommendation": (
                    "Review whether this protection is required for "
                    "the application's architecture."
                ),
            } for header in missing_headers]

            for header in ("server", "x-powered-by"):
                if header in headers:
                    header_findings.append({
                        "id": str(uuid.uuid4()),
                        "category": "A05_Security_Misconfiguration",
                        "title": f"Technology-identifying header: {header}",
                        "severity": "informational",
                        "status": "observed",
                        "evidence": f"{header}: {headers[header][:200]}",
                        "recommendation": (
                            "Consider minimizing unnecessary technology "
                            "disclosure."
                        ),
                    })

            results["findings"].extend(header_findings)
            results["checks"]["security_headers"] = {
                "status": "completed",
                "missing_headers": missing_headers,
                "findings_count": len(header_findings),
            }

        # Only perform active reflection probes for an explicitly
        # allowlisted hostname.
        if validate_scope(base, authorized_hosts):
            print_status("Checking benign input reflection...", "info")

            marker = "PhantomEye_" + uuid.uuid4().hex[:12]
            reflection_results = []

            for param in ("q", "search", "id", "page", "query", "s", "keyword"):
                response = safe_get(
                    session,
                    base + "/?" + param + "=" + quote(marker, safe=""),
                    timeout,
                )
                results["summary"]["requests_sent"] += 1

                if not response["ok"]:
                    results["summary"]["errors"] += 1
                    reflection_results.append({
                        "parameter": param,
                        "status": "inconclusive",
                        "error": response["error"],
                    })
                    continue

                reflected = marker in response["body"]

                reflection_results.append({
                    "parameter": param,
                    "status": (
                        "marker_reflected" if reflected
                        else "not_observed"
                    ),
                    "http_status": response["status_code"],
                    "marker_reflected": reflected,
                })

                if reflected:
                    results["findings"].append({
                        "id": str(uuid.uuid4()),
                        "category": "A03_Injection",
                        "title": f"Input reflection on parameter: {param}",
                        "severity": "low",
                        "status": "potential",
                        "confidence": "low",
                        "evidence": (
                            f"Benign marker reflected in the response for "
                            f"parameter '{param}'. This does not prove XSS."
                        ),
                        "recommendation": (
                            "Inspect the output context and encoding in an "
                            "authorized browser test before classifying XSS."
                        ),
                    })

            results["checks"]["xss_reflection"] = {
                "status": "completed",
                "results": reflection_results,
                "note": (
                    "Reflection is not equivalent to executable XSS."
                ),
            }
        else:
            results["checks"]["xss_reflection"] = {
                "status": "not_tested",
                "reason": (
                    "The hostname was not explicitly authorized in the "
                    "server-configured allowlist."
                ),
            }

        print_status("Discovering common authentication routes...", "info")
        routes = []

        for path in AUTH_PATHS:
            # The request is scoped to the original hostname.
            response = safe_get(
                session,
                urljoin(base + "/", path.lstrip("/")),
                timeout,
            )
            results["summary"]["requests_sent"] += 1

            routes.append({
                "path": path,
                "status": (
                    response["status_code"] if response["ok"] else "error"
                ),
                "redirect_location": response["headers"].get("Location"),
                "error": response["error"],
            })

            if not response["ok"]:
                results["summary"]["errors"] += 1

        results["checks"]["route_discovery"] = {
            "status": "completed",
            "routes": routes,
            "note": (
                "HTTP responses do not prove authentication or access "
                "control vulnerabilities."
            ),
        }

    finally:
        session.close()

    results["summary"]["findings_count"] = len(results["findings"])
    results["summary"]["potential_findings"] = sum(
        1 for finding in results["findings"]
        if finding.get("status") == "potential"
    )
    results["completed_at"] = utc_now()

    print_status("Assessment completed.", "success")
    return results
