# PHANTOM EYE
**Offensive Security Automation Framework**
SYSTEM_OFFSEC • v1.0

## Features

- Full Reconnaissance (WHOIS, DNS, Subdomains, Port Scan, Tech Detect)
- Vulnerability Assessment (Sensitive files, Security Headers)
- OWASP Top 10 Testing + Payloads
- API Security Top 10 Testing
- Payload Generation (XSS, SQLi, LFI, RCE, SSRF, SSTI, XXE, etc.)
- Beautiful TXT Report
- Optional Telegram dump

## Installation

```bash
cd PhantomEye
pip install -r requirements.txt
chmod +x phantomeye.py
```

## Usage

```bash
# Full scan
python3 phantomeye.py BigSam.com

# Specific mode
python3 phantomeye.py BigSam.com -m recon
python3 phantomeye.py BigSam.com -m owasp
python3 phantomeye.py BigSam.com -m api
python3 phantomeye.py BigSam.com -m payload

# Custom output
python3 phantomeye.py BigSam.com -o myreport.txt

# Send report to Telegram
python3 phantomeye.py BigSam.com --telegram BOT_TOKEN --chat-id CHAT_ID

# Quiet + no color
python3 phantomeye.py BigSam.com -q --no-color
```

## Structure

```text
PhantomEye/
├── phantomeye.py
├── requirements.txt
├── modules/
│   ├── recon.py
│   ├── vuln.py
│   ├── owasp.py
│   ├── api_top10.py
│   ├── payloads.py
│   └── report.py
├── utils/
│   ├── banner.py
│   ├── helpers.py
│   └── config.py
└── reports/
```
