"""
PHANTOM EYE - Evidence & Output Manager
"""

import os
from datetime import datetime
from pathlib import Path
from .config import Config


class EvidenceManager:
    def __init__(self, target: str):
        self.target = target.replace("https://", "").replace("http://", "").split("/")[0]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.base_dir = Config.REPORTS_PATH / f"{self.target}_{timestamp}"
        
        # Create folders
        self.dirs = {
            "root": self.base_dir,
            "screenshots": self.base_dir / "screenshots",
            "logs": self.base_dir / "logs",
            "raw": self.base_dir / "raw",
            "reports": self.base_dir / "reports"
        }
        
        for d in self.dirs.values():
            d.mkdir(parents=True, exist_ok=True)

    def path(self, category: str, filename: str) -> Path:
        return self.dirs.get(category, self.dirs["root"]) / filename

    def save_text(self, category: str, filename: str, content: str) -> str:
        file_path = self.path(category, filename)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        return str(file_path)
