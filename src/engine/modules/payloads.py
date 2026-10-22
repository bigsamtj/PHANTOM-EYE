"""Diagnostic Test Vector Catalog Module for Phantom Eye"""

from utils.helpers import print_status

def generate_payloads(target: str, previous_results: dict) -> dict:
    print_status("Compiling diagnostic security assessment test vectors...", "info")

    payloads = {
        "input_reflection": [
            "phantom_eye_canary_01",
            "test_param_reflection_probe",
            "sec_test_input_tag_probe"
        ],
        "boundary_checks": [
            "-1", "0", "99999999", "NaN", "null", "undefined",
            "true", "false", "%00"
        ],
        "header_probes": [
            "X-Forwarded-For: 127.0.0.1",
            "X-Original-URL: /admin",
            "X-Custom-IP-Authorization: 127.0.0.1",
            "Origin: https://evil-attacker.example.com"
        ],
        "api_abuse_checks": [
            "Burst probe: 50 req/sec rate limit verification",
            "Nested depth check: GraphQL query depth > 5",
            "Object boundary: /api/v1/resource/0"
        ],
        "tls_ciphers": [
            "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
            "TLS_AES_256_GCM_SHA384"
        ]
    }

    print_status(f"Diagnostic test categories generated: {len(payloads)}", "success")
    for category, items in payloads.items():
        print_status(f"  • {category.upper():<20} : {len(items)} test patterns", "info")

    return payloads
