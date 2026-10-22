import {
  Assessment,
  Asset,
  Finding,
  EvidenceItem,
  ScanJob,
  TimelineEvent,
  Report,
  Integration,
  AuditEvent,
  AssessmentTemplate,
  User,
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-big-sam',
    name: 'BIG SAM',
    email: 'bigsam@phantomeye.sec',
    role: 'Administrator',
    status: 'Active',
    lastActive: 'Active Now',
  },
];

// BLANK ASSESSMENT AND COLLECTION STATES UPON INITIAL LOAD
export const INITIAL_ASSESSMENTS: Assessment[] = [];
export const INITIAL_ASSETS: Asset[] = [];
export const INITIAL_FINDINGS: Finding[] = [];
export const INITIAL_EVIDENCE: EvidenceItem[] = [];
export const INITIAL_JOBS: ScanJob[] = [];
export const INITIAL_TIMELINE: TimelineEvent[] = [];
export const INITIAL_REPORTS: Report[] = [];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'AUD-001',
    timestamp: new Date().toISOString(),
    actor: 'BIG SAM (bigsam@phantomeye.sec)',
    action: 'ADMIN_SESSION_INITIALIZED',
    resource: 'Phantom Eye Security Command Suite',
    result: 'Success',
    correlationId: 'sess-init-001',
    metadata: {
      role: 'Administrator',
      enforcement: 'Single-Admin Authorized Authority',
      hostTime: new Date().toISOString(),
    },
  },
];

export const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: 'INT-01',
    name: 'Nmap Port & Service Scanner',
    category: 'Network Enumeration',
    purpose: 'Approved low-intensity TCP port scanning and service banner collection within scope.',
    status: 'Connected',
    version: '7.94 (Live Socket Probes)',
    lastHealthCheck: new Date().toISOString(),
    isSimulated: false,
    documentationUrl: 'https://nmap.org',
  },
  {
    id: 'INT-02',
    name: 'Authoritative DNS & RDAP Resolver',
    category: 'Passive Reconnaissance',
    purpose: 'Authoritative DNS A/AAAA/MX/TXT resolution and WHOIS domain registrar queries.',
    status: 'Connected',
    version: 'Node.js dns/promises',
    lastHealthCheck: new Date().toISOString(),
    isSimulated: false,
    documentationUrl: 'https://www.icann.org/rdap',
  },
  {
    id: 'INT-03',
    name: 'Certificate Transparency (crt.sh & TLS Handshake)',
    category: 'Passive Reconnaissance',
    purpose: 'Extracts live peer X.509 certificates and queries CT logs for authorized subdomains.',
    status: 'Connected',
    version: 'TLS v1.3 Engine',
    lastHealthCheck: new Date().toISOString(),
    isSimulated: false,
    documentationUrl: 'https://crt.sh',
  },
  {
    id: 'INT-04',
    name: 'OWASP Top 10 Security Auditor',
    category: 'Web Security',
    purpose: 'Audits missing defense headers (CSP, HSTS), injection points, and API endpoints.',
    status: 'Connected',
    version: 'OWASP Top 10:2021',
    lastHealthCheck: new Date().toISOString(),
    isSimulated: false,
    documentationUrl: 'https://owasp.org',
  },
  {
    id: 'INT-05',
    name: 'Telegram Bot Report Dispatcher',
    category: 'Alert Feeds & Reports',
    purpose: 'Automated executive deliverable and instant vulnerability dispatch via Telegram Bot API.',
    status: 'Authentication Required',
    version: 'Bot API v7.0',
    lastHealthCheck: new Date().toISOString(),
    isSimulated: false,
    documentationUrl: 'https://core.telegram.org/bots/api',
  },
  {
    id: 'INT-06',
    name: 'Cryptographic SHA-256 Forensic Vault',
    category: 'Digital Forensics',
    purpose: 'Calculates forensic SHA-256 digests of all evidence items for chain-of-custody.',
    status: 'Connected',
    version: 'FIPS 140-2 Compatible',
    lastHealthCheck: new Date().toISOString(),
    isSimulated: false,
    documentationUrl: 'https://csrc.nist.gov',
  },
];

export const INITIAL_TEMPLATES: AssessmentTemplate[] = [
  {
    id: 'TMP-01',
    name: 'Passive Reconnaissance',
    description: 'Zero network packet transmission towards target. Gathers OSINT, DNS, WHOIS, and Certificate Transparency data.',
    type: 'Passive Reconnaissance',
    enabledModules: ['DNS Record Collection', 'WHOIS/RDAP', 'Certificate Transparency', 'Public Technology Fingerprinting'],
    defaultLimits: { maxRequestRate: 5, timeoutMinutes: 15 },
    requiredPermissions: ['View OSINT Data'],
    excludedActivities: ['Port Scanning', 'Direct HTTP GET to Host', 'DNS Zone Transfer Probing'],
    reportSections: ['Executive Summary', 'Asset Inventory', 'DNS Records', 'Certificates'],
    estimatedDuration: '2 - 5 minutes',
  },
  {
    id: 'TMP-02',
    name: 'External Attack Surface Assessment',
    description: 'Standard authorized assessment for external perimeter visibility, service headers, TLS configuration, and low-rate port checks.',
    type: 'External Attack Surface Assessment',
    enabledModules: [
      'DNS Record Collection',
      'Certificate Transparency',
      'Passive Subdomain Discovery',
      'HTTP Security Headers',
      'TLS Configuration Review',
      'Approved Low-Intensity Port Scanning',
    ],
    defaultLimits: { maxRequestRate: 15, timeoutMinutes: 45 },
    requiredPermissions: ['Authorized Scope Document', 'Analyst Approval'],
    excludedActivities: ['Denial of Service', 'Exploitation Payloads', 'Authentication Brute Force'],
    reportSections: ['Executive Summary', 'Attack Surface Map', 'Technical Findings', 'Remediation Plan'],
    estimatedDuration: '10 - 25 minutes',
  },
  {
    id: 'TMP-03',
    name: 'Web Security Baseline',
    description: 'Non-destructive review of web application headers, cookies, CSP, CORS, and SSL/TLS configuration.',
    type: 'Web Security Baseline',
    enabledModules: ['HTTP Security Headers', 'TLS Configuration Review', 'Web Technology Identification'],
    defaultLimits: { maxRequestRate: 20, timeoutMinutes: 30 },
    requiredPermissions: ['Authorized Web Domain Scope'],
    excludedActivities: ['SQL Injection Payloads', 'Form Submission Floods', 'Session Hijacking Probes'],
    reportSections: ['Executive Summary', 'Header Audit', 'Vulnerabilities by Severity', 'Remediation Guidance'],
    estimatedDuration: '5 - 15 minutes',
  },
  {
    id: 'TMP-04',
    name: 'API Security Assessment',
    description: 'Inventory of public API endpoints, OpenAPI spec validation, CORS policy testing, and authentication header analysis.',
    type: 'API Security Assessment',
    enabledModules: ['API Specification Inventory', 'CORS Review', 'HTTP Security Headers', 'TLS Assessment'],
    defaultLimits: { maxRequestRate: 25, timeoutMinutes: 60 },
    requiredPermissions: ['API Gateway Staging/Prod Authorization'],
    excludedActivities: ['State-Mutating POST/DELETE without Sandbox Scope', 'Resource Exhaustion'],
    reportSections: ['API Inventory', 'Endpoint Security Matrix', 'Findings & Remediation'],
    estimatedDuration: '10 - 30 minutes',
  },
  {
    id: 'TMP-05',
    name: 'Full Authorized Assessment',
    description: 'Comprehensive multi-stage authorized assessment combining passive reconnaissance, non-destructive scanning, and controlled validation.',
    type: 'Full Authorized Assessment',
    enabledModules: [
      'DNS Record Collection',
      'WHOIS/RDAP',
      'Certificate Transparency',
      'Passive Subdomain Discovery',
      'HTTP Security Headers',
      'TLS Configuration Review',
      'Approved Low-Intensity Port Scanning',
      'Service Enumeration',
      'Manual Verification Checklist',
    ],
    defaultLimits: { maxRequestRate: 20, timeoutMinutes: 120 },
    requiredPermissions: ['Executive Authorization', 'Scope Ticket', 'CISO Notification'],
    excludedActivities: ['Destructive Exploitation', 'Persistence Installation', 'Data Exfiltration'],
    reportSections: ['Full Executive Brief', 'Methodology & Scope', 'Technical Findings', 'Evidence Appendix', 'Sign-off'],
    estimatedDuration: '25 - 60 minutes',
  },
];
