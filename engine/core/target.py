"""
PHANTOM EYE - Target Handler
"""

import socket
import re
from urllib.parse import urlparse
from .config import Config


class Target:
    def __init__(self, raw_target: str):
        self.raw = raw_target.strip()
        self.domain = None
        self.ip = None
        self.scheme = "https"
        self.port = None
        self.is_valid = False
        self.url = None

        self._parse()

    def _parse(self):
        """Clean and parse the target"""
        target = self.raw

        # Remove protocol if present
        if target.startswith(("http://", "https://")):
            parsed = urlparse(target)
            self.scheme = parsed.scheme
            target = parsed.netloc or parsed.path
            if parsed.port:
                self.port = parsed.port

        # Remove trailing slash and path
        target = target.split("/")[0]
        target = target.strip()

        # Basic domain validation
        domain_regex = r"^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$"
        ip_regex = r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$"

        if re.match(domain_regex, target) or re.match(ip_regex, target):
            self.domain = target
            self.is_valid = True
            self.url = f"{self.scheme}://{self.domain}"
            if self.port:
                self.url += f":{self.port}"
        else:
            self.is_valid = False

    def resolve_ip(self) -> str | None:
        """Resolve domain to IP"""
        if not self.is_valid:
            return None

        try:
            self.ip = socket.gethostbyname(self.domain)
            return self.ip
        except socket.gaierror:
            self.ip = None
            return None

    def __str__(self):
        return self.domain if self.domain else self.raw

    def info(self) -> dict:
        return {
            "raw": self.raw,
            "domain": self.domain,
            "ip": self.ip,
            "scheme": self.scheme,
            "url": self.url,
            "is_valid": self.is_valid
        }
