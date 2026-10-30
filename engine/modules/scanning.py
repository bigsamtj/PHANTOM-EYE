"""
PHANTOM EYE - Port & Service Scanning Module
"""

import socket
from concurrent.futures import ThreadPoolExecutor, as_completed
from core.config import Config
from core.target import Target


def check_port(ip: str, port: int, timeout: float = 1.5) -> dict | None:
    """Check if a single port is open"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((ip, port))
        sock.close()

        if result == 0:
            return {
                "port": port,
                "state": "open",
                "service": common_service(port)
            }
    except:
        pass
    return None


def common_service(port: int) -> str:
    """Map common ports to service names"""
    services = {
        21: "FTP",
        22: "SSH",
        23: "Telnet",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        143: "IMAP",
        443: "HTTPS",
        445: "SMB",
        993: "IMAPS",
        995: "POP3S",
        3306: "MySQL",
        3389: "RDP",
        5432: "PostgreSQL",
        5900: "VNC",
        8080: "HTTP-Proxy",
        8443: "HTTPS-Alt"
    }
    return services.get(port, "Unknown")


def run(target: Target) -> dict:
    """Main scanning function"""
    print(f"{Config.Colors.CYAN}[*] Starting port scan on {target.domain}{Config.Colors.END}")

    results = {
        "open_ports": [],
        "findings": []
    }

    ip = target.ip or target.resolve_ip()
    if not ip:
        print(f"{Config.Colors.FAIL}[!] Cannot resolve IP for port scanning{Config.Colors.END}")
        return results

    print(f"{Config.Colors.CYAN}[*] Scanning {len(Config.COMMON_PORTS)} common ports on {ip}...{Config.Colors.END}")

    open_ports = []

    with ThreadPoolExecutor(max_workers=Config.DEFAULT_THREADS) as executor:
        futures = {executor.submit(check_port, ip, port): port for port in Config.COMMON_PORTS}
        for future in as_completed(futures):
            result = future.result()
            if result:
                open_ports.append(result)
                print(f"{Config.Colors.GREEN}    [+] Port {result['port']}/tcp open — {result['service']}{Config.Colors.END}")

    # Sort by port number
    open_ports = sorted(open_ports, key=lambda x: x["port"])
    results["open_ports"] = open_ports

    print(f"{Config.Colors.GREEN}[+] Found {len(open_ports)} open ports{Config.Colors.END}")

    # Create simple findings for interesting ports
    interesting = [21, 23, 445, 3389, 5900]
    for item in open_ports:
        if item["port"] in interesting:
            results["findings"].append({
                "title": f"Open {item['service']} Port ({item['port']})",
                "severity": "medium",
                "description": f"Port {item['port']} ({item['service']}) is open on {ip}",
                "module": "scanning"
            })

    return results
