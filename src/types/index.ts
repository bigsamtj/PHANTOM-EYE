export type AssessmentStatus =
  | 'Draft'
  | 'Awaiting Authorization'
  | 'Ready'
  | 'Queued'
  | 'Running'
  | 'Paused'
  | 'Completed'
  | 'Failed'
  | 'Cancelled';

export type AssessmentType =
  | 'Passive Reconnaissance'
  | 'External Attack Surface Assessment'
  | 'Web Security Baseline'
  | 'API Security Assessment'
  | 'Network Security Assessment'
  | 'Full Authorized Assessment'
  | 'Custom Assessment';

export type FindingSeverity =
  | 'Critical'
  | 'High'
  | 'Medium'
  | 'Low'
  | 'Informational'
  | 'Needs Validation';

export type FindingStatus =
  | 'Open'
  | 'Under Review'
  | 'Confirmed'
  | 'False Positive'
  | 'Accepted Risk'
  | 'Resolved';

export type AssetType =
  | 'Domain'
  | 'Subdomain'
  | 'IP Address'
  | 'Host'
  | 'Web Application'
  | 'API Endpoint'
  | 'TLS Certificate'
  | 'Service'
  | 'Technology';

export type ScopeStatus = 'In Scope' | 'Out of Scope' | 'Needs Review';

export type JobStatus = 'Queued' | 'Running' | 'Completed' | 'Failed' | 'Paused' | 'Cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Assessment Manager' | 'Security Analyst' | 'Reviewer' | 'Read-Only Auditor';
  avatar?: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

export interface ScopePolicy {
  allowedDomains: string[];
  allowedIpRanges: string[];
  excludedHosts: string[];
  approvedWindows: string;
  maxRequestRate: number; // requests/sec
  permittedCategories: string[];
  prohibitedCategories: string[];
}

export interface AuthorizationRecord {
  authTicket: string;
  confirmedBy: string;
  confirmedAt: string;
  expiresAt: string;
  isAuthorized: boolean;
  notes?: string;
}

export interface Assessment {
  id: string;
  name: string;
  targetDomain: string;
  targetIp?: string;
  clientReference: string;
  type: AssessmentType;
  environment: 'Demonstration Lab' | 'Authorized Staging' | 'Authorized Production';
  assignedAnalyst: string;
  status: AssessmentStatus;
  progress: number;
  authorization: AuthorizationRecord;
  scope: ScopePolicy;
  selectedModules: string[];
  executionMode: 'simulation' | 'live';
  createdAt: string;
  updatedAt: string;
  findingsCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  discoveredAssetsCount: number;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  targetDomain: string;
  scopeStatus: ScopeStatus;
  ipAddress?: string;
  firstSeen: string;
  lastSeen: string;
  source: string;
  relatedAssessmentId: string;
  relatedFindingsCount: number;
  ports?: number[];
  technologies?: string[];
  notes?: string;
  executionMode: 'simulation' | 'live';
}

export interface Finding {
  id: string;
  title: string;
  severity: FindingSeverity;
  confidence: 'High' | 'Medium' | 'Low';
  status: FindingStatus;
  targetAsset: string;
  category: string;
  assessmentId: string;
  description: string;
  reproductionNotes: string;
  impact: string;
  remediation: string;
  firstObserved: string;
  assignedAnalyst: string;
  evidenceIds: string[];
  cvssScore?: number;
  cvssVector?: string;
  references: string[];
  executionMode: 'simulation' | 'live';
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: 'Screenshot' | 'HTTP Metadata' | 'DNS Record' | 'TLS Certificate' | 'Scan Output' | 'Log' | 'Analyst Note';
  sourceModule: string;
  assessmentId: string;
  relatedAssetId?: string;
  relatedFindingId?: string;
  sha256: string;
  collectedAt: string;
  collectedBy: string;
  integrityStatus: 'Verified' | 'Calculated (Demo)' | 'Unverified';
  contentPreview?: string;
  fileSizeBytes?: number;
  executionMode: 'simulation' | 'live';
}

export interface ScanJob {
  id: string;
  assessmentId: string;
  module: string;
  target: string;
  status: JobStatus;
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  exitCode?: number;
  stdout: string;
  stderr?: string;
  outputSize: string;
  executionMode: 'simulation' | 'live';
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  eventType:
    | 'assessment_created'
    | 'authorization_confirmed'
    | 'scope_validated'
    | 'module_started'
    | 'asset_discovered'
    | 'observation_recorded'
    | 'finding_created'
    | 'finding_validated'
    | 'evidence_attached'
    | 'report_generated'
    | 'export_completed'
    | 'assessment_completed';
  actor: string;
  assessmentId: string;
  target: string;
  summary: string;
  relatedEvidenceId?: string;
  sourceModule: string;
  executionMode: 'simulation' | 'live';
}

export interface Report {
  id: string;
  name: string;
  assessmentId: string;
  target: string;
  format: 'TXT' | 'JSON' | 'CSV' | 'PDF';
  template: string;
  generatedAt: string;
  generatedBy: string;
  status: 'Ready' | 'Generating' | 'Archived';
  fileSize: string;
  executiveSummary: string;
  content?: string;
  executionMode: 'simulation' | 'live';
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  purpose: string;
  status: 'Connected' | 'Not Configured' | 'Unavailable' | 'Authentication Required' | 'Simulation Only';
  version?: string;
  lastHealthCheck: string;
  isSimulated: boolean;
  documentationUrl: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  result: 'Success' | 'Denied' | 'Failed' | 'Warning';
  correlationId: string;
  metadata: Record<string, any>;
}

export interface AssessmentTemplate {
  id: string;
  name: string;
  description: string;
  type: AssessmentType;
  enabledModules: string[];
  defaultLimits: {
    maxRequestRate: number;
    timeoutMinutes: number;
  };
  requiredPermissions: string[];
  excludedActivities: string[];
  reportSections: string[];
  estimatedDuration: string;
}
