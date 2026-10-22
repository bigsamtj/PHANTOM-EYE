# PHANTOM EYE — Automated Security Assessment & Pen-Testing Platform

**Version:** 1.0.0  
**Author:** SYSTEM_OFFSEC / Phantom Eye Security Labs  
**Platform Architecture:** React 19 + TypeScript + Vite + Express + Python Assessment Engine  
**GitHub Repository:** [bigsamtj/PhantomEye](https://github.com/bigsamtj/PhantomEye)

---

## 1. Project Overview

**PHANTOM EYE** is a full-stack, enterprise-grade, authorized cybersecurity assessment platform and terminal workstation. It combines:
- **Interactive Security Operations Web Application**: Modern light-mode operator UI with dark terminal workstation emulation, real-time topological asset mapping, and CVSS v3.1 finding triage.
- **Node.js / Express Live Telemetry Backend (`server.ts`)**: Native TCP port scanning, authoritative DNS query resolution (A, AAAA, MX, TXT), TLS peer certificate inspection, HTTP defensive headers evaluation, and cryptographic SHA-256 evidence hashing.
- **Python Security Automation Engine (`src/engine/`)**: Fully functional Python CLI with standalone modular packages mirroring the PhantomEye GitHub repository.

---

## 2. System Architecture & Directory Tree

```
PhantomEye/
├── index.html                   # HTML5 Entry point with metadata & preconnect fonts
├── metadata.json                # AI Studio application descriptor & permissions
├── package.json                 # Node dependencies (React 19, Express, Vite, Tailwind CSS)
├── server.ts                    # Full-stack Express backend & Vite middleware integration
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── .env.example                 # Production environment variables template
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Client router & persistent application shell
│   ├── index.css                # Tailwind CSS styling & custom scrollbars
│   ├── types/
│   │   └── index.ts             # Complete TypeScript data model & domain definitions
│   ├── services/
│   │   ├── store.tsx            # Global state store, localStorage cache, live API connector
│   │   └── phaseScripts.ts      # Python source code viewer for Phases 01-07
│   ├── mock-data/
│   │   └── initialData.ts       # Baseline initial data for demonstration mode
│   ├── components/
│   │   ├── layout/              # Persistent Sidebar, TopNavbar, Breadcrumbs
│   │   ├── terminal/            # Dark Kali-style interactive Terminal Simulator
│   │   └── common/              # Global search (⌘K), PhaseScriptModal inspector
│   ├── pages/                   # All 19 navigation views
│   │   ├── DashboardPage.tsx
│   │   ├── NewAssessmentPage.tsx
│   │   ├── AssessmentsPage.tsx
│   │   ├── AssessmentWorkspacePage.tsx (10 tabs & 7 workflow stages)
│   │   ├── ReconnaissancePage.tsx
│   │   ├── ScanningPage.tsx
│   │   ├── FindingsPage.tsx
│   │   ├── AssetInventoryPage.tsx
│   │   ├── EvidenceVaultPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── TimelinePage.tsx
│   │   ├── TerminalPage.tsx
│   │   ├── IntegrationsPage.tsx
│   │   ├── TemplatesPage.tsx
│   │   ├── ScanHistoryPage.tsx
│   │   ├── TeamPage.tsx
│   │   ├── AuditLogsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── HelpPage.tsx
│   └── engine/                  # Integrated GitHub Python Engine (PhantomEye)
│       ├── phantomeye.py        # Main Python CLI entry point
│       ├── requirements.txt     # Python dependencies (requests, urllib3)
│       ├── utils/
│       │   ├── banner.py        # ASCII art banner
│       │   ├── config.py        # Engine configurations (timeout, user agent, threads)
│       │   └── helpers.py       # Color terminal logging & Telegram notification dispatcher
│       └── modules/
│           ├── recon.py         # DNS resolution, subdomains, port probe, tech detection
│           ├── vuln.py          # Sensitive paths check & security headers audit
│           ├── owasp.py         # OWASP Top 10 compliance & parameter reflection probes
│           ├── api_top10.py     # API endpoint discovery, BOLA & function-level auth
│           ├── payloads.py      # Diagnostic security assessment test vectors
│           └── report.py        # Comprehensive ASCII/TXT executive report generator
```

---

## 3. GitHub Module Integration

The core assessment modules from `github.com/bigsamtj/PhantomEye` have been integrated both as standalone Python scripts and as native Express backend REST endpoints:

| Module | Python Source (`src/engine/modules/`) | REST Endpoint (`server.ts`) | Capability |
| :--- | :--- | :--- | :--- |
| **Reconnaissance** | `recon.py` | `POST /api/modules/recon` | Resolves A/MX/TXT records, scans ports (80, 443, 8080), discovers subdomains. |
| **Vulnerability** | `vuln.py` | `POST /api/modules/vuln` | Inspects sensitive paths (`robots.txt`, `sitemap.xml`) & checks defensive headers. |
| **OWASP Top 10** | `owasp.py` | `POST /api/modules/owasp` | Evaluates A01-A10 (HSTS missing, server banner exposure, auth surfaces). |
| **API Top 10** | `api_top10.py` | `POST /api/modules/api-top10` | Discovers REST/GraphQL endpoints, assesses BOLA risks and admin access. |
| **Payloads** | `payloads.py` | `POST /api/modules/payloads` | Catalogs diagnostic input boundaries, reflection checks, and rate limit tests. |
| **Full Runner** | `phantomeye.py` | `POST /api/modules/run-all` | Executes full multi-phase assessment with live logs and exports structured report. |

---

## 4. API Documentation & REST Endpoints

### `POST /api/assess/phase1-scope`
- **Request:** `{ "target": "example.com", "authTicket": "AUTH-2026", "exclusions": ["payment.example.com"] }`
- **Response:** RFC 1035/1123 hostname syntax verification, exclusion filter gate, scope lock token.

### `POST /api/assess/phase2-recon`
- **Request:** `{ "target": "example.com" }`
- **Response:** Live DNS A/MX/TXT records, socket-extracted TLS peer certificate metadata, and subdomains.

### `POST /api/assess/phase4-scan`
- **Request:** `{ "target": "example.com", "ports": [80, 443, 8080] }`
- **Response:** Live HTTP headers check (HSTS, CSP, X-Frame-Options, CORS, Server banner) and TCP port connectivity.

### `POST /api/assess/phase5-findings`
- **Request:** `{ "target": "example.com", "missingHeaders": ["Content-Security-Policy"] }`
- **Response:** Validated findings with calculated CVSS v3.1 vectors and CWE/OWASP taxonomies.

### `POST /api/assess/phase6-evidence`
- **Request:** `{ "target": "example.com", "rawData": "..." }`
- **Response:** Cryptographic SHA-256 evidence item objects for forensic chain of custody.

### `POST /api/modules/run-all`
- **Request:** `{ "target": "example.com", "authTicket": "AUTH-2026" }`
- **Response:** Complete assessment transcript, progressive logs, and formatted ASCII text report.

---

## 5. CLI Execution Guide

The standalone Python CLI can be run directly from terminal:

```bash
# Navigate to the engine directory
cd src/engine

# Install Python requirements
pip install -r requirements.txt

# Run full 5-phase assessment
python3 phantomeye.py example.com

# Run specific phase
python3 phantomeye.py example.com -m recon
python3 phantomeye.py example.com -m vuln
python3 phantomeye.py example.com -m owasp
python3 phantomeye.py example.com -m api
python3 phantomeye.py example.com -m payload

# Custom output report and Telegram alert
python3 phantomeye.py example.com -o my_report.txt --telegram BOT_TOKEN --chat-id CHAT_ID
```

---

## 6. Installation, Local Development & Deployment

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server (Node + Express + Vite on port 3000)
npm run dev
```

### Production Build & Launch
```bash
# 1. Build frontend bundle
npm run build

# 2. Launch production server
npm start
```

---

## 7. Manual Integration & Configuration Checklist

| Variable Name | Purpose | Status | Where to Configure | Visibility | Verification Test |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PORT` | Web & API server port | Optional (Default: 3000) | `.env` or container env | Server-side | `curl http://localhost:3000/api/health` returns status `online`. |
| `NODE_ENV` | Runtime mode (`development` / `production`) | Recommended | `.env` | Server-side | Verified in server startup log. |
| `TELEGRAM_BOT_TOKEN` | Automated report delivery via Telegram bot | Optional | `.env` / CLI `--telegram` | Confidential | Send test alert via `save_to_telegram()` helper. |
| `TELEGRAM_CHAT_ID` | Telegram chat/channel destination ID | Optional | `.env` / CLI `--chat-id` | Confidential | Verified upon report generation. |
| `DEFAULT_SCAN_THREADS` | Concurrency limit for background port & subdomain probes | Optional (Default: 10) | `.env` or `utils/config.py` | Server-side | Monitored in scan jobs metrics. |

---

## 8. Verification & QA Status

- **Type Checking:** `tsc --noEmit` executed with **0 errors**.
- **Vite Compilation:** Tested and compiled successfully.
- **Express Backend:** Live endpoints active for DNS resolution, TLS certificate parsing, HTTP security headers, and port probe.
- **Light Mode UI:** Clean `#F5F7FA` surface styling verified across all 19 views.
