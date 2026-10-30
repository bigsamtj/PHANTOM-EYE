"""
PHANTOM EYE - Orchestrator (The Brain)
This is the main controller that runs the full assessment pipeline.
"""

import time
from datetime import datetime
from .target import Target
from .config import Config


class Orchestrator:
    def __init__(self, target: str, modules: list = None, output_file: str = None):
        self.target = Target(target)
        self.modules = modules or ["recon", "scanning", "vulnerability", "web", "api", "reporting"]
        self.output_file = output_file
        self.results = {
            "target": {},
            "started_at": None,
            "finished_at": None,
            "duration": None,
            "modules": {}
        }
        self.findings = []

    def validate_target(self) -> bool:
        """Validate and resolve the target"""
        if not self.target.is_valid:
            print(f"{Config.Colors.FAIL}[!] Invalid target: {self.target.raw}{Config.Colors.END}")
            return False

        print(f"{Config.Colors.CYAN}[*] Target        : {self.target.domain}{Config.Colors.END}")
        ip = self.target.resolve_ip()
        if ip:
            print(f"{Config.Colors.CYAN}[*] IP Address    : {ip}{Config.Colors.END}")
        else:
            print(f"{Config.Colors.WARNING}[!] Could not resolve IP{Config.Colors.END}")

        self.results["target"] = self.target.info()
        return True

    def run_module(self, module_name: str):
        """Dynamically run a module"""
        try:
            if module_name == "recon":
                from modules.recon import run as run_recon
                result = run_recon(self.target)
            elif module_name == "scanning":
                from modules.scanning import run as run_scanning
                result = run_scanning(self.target)
            elif module_name == "vulnerability":
                from modules.vulnerability import run as run_vuln
                result = run_vuln(self.target)
            elif module_name == "web":
                from modules.web import run as run_web
                result = run_web(self.target)
            elif module_name == "api":
                from modules.api import run as run_api
                result = run_api(self.target)
            elif module_name == "reporting":
                from modules.reporting import run as run_reporting
                result = run_reporting(self.target, self.results, self.findings)
            else:
                print(f"{Config.Colors.WARNING}[!] Unknown module: {module_name}{Config.Colors.END}")
                return None

            self.results["modules"][module_name] = result
            return result

        except ImportError:
            print(f"{Config.Colors.WARNING}[!] Module '{module_name}' not yet implemented{Config.Colors.END}")
            return None
        except Exception as e:
            print(f"{Config.Colors.FAIL}[!] Error in module '{module_name}': {str(e)}{Config.Colors.END}")
            return None

    def run(self):
        """Execute the full assessment pipeline"""
        print(f"\n{Config.Colors.BOLD}{Config.Colors.HEADER}")
        print("=" * 60)
        print(f"   {Config.APP_NAME} v{Config.VERSION}")
        print(f"   Automated Security Assessment")
        print("=" * 60)
        print(f"{Config.Colors.END}")

        if not self.validate_target():
            return False

        self.results["started_at"] = datetime.now().isoformat()
        start_time = time.time()

        print(f"\n{Config.Colors.GREEN}[+] Starting assessment pipeline...{Config.Colors.END}\n")

        for module in self.modules:
            print(f"{Config.Colors.BLUE}{'─' * 50}{Config.Colors.END}")
            print(f"{Config.Colors.BOLD}[*] Running module: {module.upper()}{Config.Colors.END}")
            print(f"{Config.Colors.BLUE}{'─' * 50}{Config.Colors.END}")

            result = self.run_module(module)

            if result and isinstance(result, dict) and "findings" in result:
                self.findings.extend(result["findings"])

            print()

        end_time = time.time()
        self.results["finished_at"] = datetime.now().isoformat()
        self.results["duration"] = round(end_time - start_time, 2)

        print(f"{Config.Colors.GREEN}[+] Assessment completed in {self.results['duration']} seconds{Config.Colors.END}")
        print(f"{Config.Colors.GREEN}[+] Total findings: {len(self.findings)}{Config.Colors.END}")

        return True
