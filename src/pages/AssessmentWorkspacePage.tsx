import React, { useState } from 'react';
import {
  ShieldCheck,
  Play,
  Pause,
  Zap,
  Code2,
  Terminal,
  Activity,
  CheckCircle2,
  FileText,
  AlertTriangle,
  FolderLock,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../services/store';
import { TerminalSimulator } from '../components/terminal/TerminalSimulator';
import { PhaseScriptModal } from '../components/common/PhaseScriptModal';

interface AssessmentWorkspacePageProps {
  assessmentId: string;
  navigate: (route: string) => void;
}

export const AssessmentWorkspacePage: React.FC<AssessmentWorkspacePageProps> = ({
  assessmentId,
  navigate,
}) => {
  const {
    assessments,
    assets,
    findings,
    evidence,
    jobs,
    timeline,
    reports,
    updateAssessmentStatus,
    generateReport,
    exportReportFile,
    executeRealTimeAssessment,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'summary'
    | 'scope'
    | 'recon'
    | 'scanning'
    | 'findings'
    | 'evidence'
    | 'timeline'
    | 'terminal'
    | 'reports'
    | 'activity'
  >('summary');

  const [inspectingPhase, setInspectingPhase] = useState<string | null>(null);
  const [isExecutingLive, setIsExecutingLive] = useState(false);
  const [liveLog, setLiveLog] = useState('');
  const [livePct, setLivePct] = useState(0);

  const assessment = assessments.find((a) => a.id === assessmentId);

  // If blank or not found, show elegant fallback
  if (!assessment) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#E32936] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-[#0F172A]">No Active Assessment Selected</h2>
          <p className="text-xs text-[#64748B] mt-1">
            The requested assessment does not exist or workspace data is in blank standby state.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/assessments')}
            className="px-4 py-2 text-xs font-semibold bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0F172A] hover:bg-[#E2E8F0]"
          >
            All Assessments
          </button>
          <button
            onClick={() => navigate('/assessments/new')}
            className="px-4 py-2 text-xs font-bold bg-[#E32936] text-white rounded-xl hover:bg-[#C91E2B] flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            New Assessment Wizard
          </button>
        </div>
      </div>
    );
  }

  const relatedAssets = assets.filter((ast) => ast.relatedAssessmentId === assessment.id);
  const relatedFindings = findings.filter((f) => f.assessmentId === assessment.id);
  const relatedEvidence = evidence.filter((e) => e.assessmentId === assessment.id);
  const relatedJobs = jobs.filter((j) => j.assessmentId === assessment.id);
  const relatedReports = reports.filter((r) => r.assessmentId === assessment.id);
  const relatedTimeline = timeline.filter((t) => t.assessmentId === assessment.id);

  // Trigger real-time live execution
  const handleRunAssessment = async () => {
    setIsExecutingLive(true);
    setLivePct(5);
    setLiveLog('Initializing real-time execution engine...');

    await executeRealTimeAssessment(assessment.id, (_phase, pct, msg) => {
      setLivePct(pct);
      setLiveLog(msg);
    });

    setIsExecutingLive(false);
  };

  // Workflow Stages (01 to 07)
  const workflowStages = [
    {
      num: '01',
      name: 'Authorization & Scope',
      status: assessment.authorization.isAuthorized ? 'Completed' : 'Pending',
      duration: '5s',
      observations: 'Ticket verified',
      tabTarget: 'scope',
    },
    {
      num: '02',
      name: 'Reconnaissance',
      status: relatedAssets.length > 0 ? 'Completed' : assessment.status === 'Running' ? 'In Progress' : 'Ready',
      duration: '45s',
      observations: `${relatedAssets.length} assets`,
      tabTarget: 'recon',
    },
    {
      num: '03',
      name: 'Asset Discovery',
      status: relatedAssets.length > 1 ? 'Completed' : assessment.status === 'Running' ? 'In Progress' : 'Ready',
      duration: '30s',
      observations: 'Subdomains mapped',
      tabTarget: 'recon',
    },
    {
      num: '04',
      name: 'Scanning & Enumeration',
      status: relatedJobs.length > 0 ? 'Completed' : assessment.status === 'Running' ? 'In Progress' : 'Ready',
      duration: '1m 15s',
      observations: `${relatedJobs.length} jobs run`,
      tabTarget: 'scanning',
    },
    {
      num: '05',
      name: 'Finding Validation',
      status: relatedFindings.length > 0 ? 'Completed' : assessment.status === 'Running' ? 'In Progress' : 'Ready',
      duration: '40s',
      observations: `${relatedFindings.length} findings`,
      tabTarget: 'findings',
    },
    {
      num: '06',
      name: 'Evidence Vault',
      status: relatedEvidence.length > 0 ? 'Completed' : assessment.status === 'Running' ? 'In Progress' : 'Ready',
      duration: '20s',
      observations: `${relatedEvidence.length} SHA-256 items`,
      tabTarget: 'evidence',
    },
    {
      num: '07',
      name: 'Report Deliverable',
      status: relatedReports.length > 0 ? 'Completed' : assessment.status === 'Running' ? 'In Progress' : 'Ready',
      duration: '15s',
      observations: `${relatedReports.length} reports generated`,
      tabTarget: 'reports',
    },
  ];

  return (
    <div className="space-y-6 pb-12 text-[#0F172A]">
      {/* Workspace Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <span className="font-mono text-xs font-bold bg-[#F8FAFC] border border-[#CBD5E1] text-[#64748B] px-2.5 py-0.5 rounded-lg">
                {assessment.id}
              </span>
              <h1 className="text-xl font-black text-[#0F172A] tracking-tight">{assessment.name}</h1>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  assessment.status === 'Completed'
                    ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                    : assessment.status === 'Running'
                    ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] animate-pulse'
                    : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                }`}
              >
                {assessment.status}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center gap-1 border border-[#A7F3D0]">
                <ShieldCheck className="w-3 h-3" />
                {assessment.authorization.authTicket}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
              <span>
                Target: <strong className="font-mono text-[#0F172A]">{assessment.targetDomain}</strong>
              </span>
              <span>&bull;</span>
              <span>
                Administrator: <strong className="text-[#0F172A] font-bold">BIG SAM</strong>
              </span>
              <span>&bull;</span>
              <span>
                Environment: <strong className="text-[#059669] font-semibold">{assessment.environment}</strong>
              </span>
              <span>&bull;</span>
              <span>
                Mode: <strong className="text-[#E32936] font-semibold">Real-Time Safe Baseline</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {assessment.status !== 'Completed' && (
              <button
                disabled={isExecutingLive}
                onClick={handleRunAssessment}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#E32936] hover:bg-[#C91E2B] rounded-xl shadow-md shadow-[#E32936]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isExecutingLive ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing Live...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Real-Time Assessment</span>
                  </>
                )}
              </button>
            )}

            {assessment.status === 'Completed' && (
              <button
                onClick={handleRunAssessment}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#059669] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-xl transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Re-run Scan</span>
              </button>
            )}

            <button
              onClick={() => {
                generateReport(assessment.id, 'Technical Security Assessment', 'TXT');
                setActiveTab('reports');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0F172A] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#E32936]" />
              <span>Fast Report</span>
            </button>
          </div>
        </div>

        {/* Live Execution Progress Bar If Active */}
        {isExecutingLive && (
          <div className="mt-5 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#E32936] font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E32936] animate-ping" />
                Live Execution in Progress...
              </span>
              <span className="font-extrabold text-[#0F172A]">{livePct}%</span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#E32936] to-[#DC2626] h-full transition-all duration-300 rounded-full"
                style={{ width: `${livePct}%` }}
              />
            </div>
            <div className="p-2.5 bg-[#0F172A] rounded-lg font-mono text-[11px] text-[#34D399] flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
              <span className="truncate">{liveLog}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-t border-[#E2E8F0] mt-6 pt-2 overflow-x-auto text-xs font-bold text-[#64748B]">
          {[
            { id: 'summary', label: 'Summary' },
            { id: 'scope', label: 'Scope' },
            { id: 'recon', label: `Recon (${relatedAssets.length})` },
            { id: 'scanning', label: `Scanning (${relatedJobs.length})` },
            { id: 'findings', label: `Findings (${relatedFindings.length})` },
            { id: 'evidence', label: `Evidence (${relatedEvidence.length})` },
            { id: 'timeline', label: 'Timeline' },
            { id: 'terminal', label: 'Terminal Simulator' },
            { id: 'reports', label: `Reports (${relatedReports.length})` },
            { id: 'activity', label: 'Audit Log' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#FEF2F2] text-[#E32936] border border-[#FEE2E2]'
                  : 'hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Summary with 7-Stage Workflow Tracker */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Assessment Ready Callout when not run yet */}
          {assessment.status === 'Ready' && !isExecutingLive && (
            <div className="bg-gradient-to-r from-[#FEF2F2] to-white border border-[#FEE2E2] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E32936] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#0F172A]">Assessment Configured &amp; Standing By</h3>
                  <p className="text-xs text-[#64748B]">
                    Scope and target <strong className="font-mono text-[#0F172A]">{assessment.targetDomain}</strong> are authorized. Click to run the real-time multi-phase scan.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRunAssessment}
                className="px-5 py-2.5 bg-[#E32936] hover:bg-[#C91E2B] text-white text-xs font-bold rounded-xl shadow-md shadow-[#E32936]/20 transition-all cursor-pointer whitespace-nowrap"
              >
                Execute Real-Time Assessment
              </button>
            </div>
          )}

          {/* 7-Stage Workflow Tracker */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <span>Assessment Lifecycle Stages</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF2F2] text-[#E32936] border border-[#FEE2E2] font-bold">
                    7 Phased Modules
                  </span>
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Click any stage to view telemetry or click &quot;Script .py&quot; to inspect standalone automation routines.
                </p>
              </div>
              <span className="text-xs font-black text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                Progress: {assessment.progress}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2.5">
              {workflowStages.map((stg) => (
                <div
                  key={stg.num}
                  className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#E32936] flex flex-col justify-between transition-all group"
                >
                  <div
                    onClick={() => setActiveTab(stg.tabTarget as any)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] mb-1">
                      <span className="font-bold text-[#E32936]">{stg.num}</span>
                      <span
                        className={`font-semibold ${
                          stg.status === 'Completed'
                            ? 'text-[#059669]'
                            : stg.status === 'In Progress'
                            ? 'text-[#2563EB] animate-pulse font-bold'
                            : 'text-[#94A3B8]'
                        }`}
                      >
                        {stg.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#0F172A] leading-snug group-hover:text-[#E32936] transition-colors">
                      {stg.name}
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#E2E8F0] text-[10px] text-[#64748B] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{stg.observations}</span>
                      <span className="text-[9px] text-[#94A3B8] font-mono">{stg.duration}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectingPhase(stg.num);
                      }}
                      className="w-full flex items-center justify-center gap-1 py-1 px-1.5 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] hover:border-[#E32936] rounded text-[10px] font-mono text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer"
                    >
                      <Code2 className="w-3 h-3 text-[#E32936]" />
                      <span>Script .py</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <span className="text-[11px] text-[#64748B] font-bold">Discovered Assets</span>
              <div className="text-2xl font-black text-[#0F172A] mt-1">{relatedAssets.length}</div>
              <button
                onClick={() => setActiveTab('recon')}
                className="text-[11px] text-[#E32936] font-bold mt-1 hover:underline block"
              >
                Inspect assets →
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <span className="text-[11px] text-[#64748B] font-bold">Security Observations</span>
              <div className="text-2xl font-black text-[#0F172A] mt-1">{relatedFindings.length}</div>
              <button
                onClick={() => setActiveTab('findings')}
                className="text-[11px] text-[#E32936] font-bold mt-1 hover:underline block"
              >
                Inspect findings →
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <span className="text-[11px] text-[#64748B] font-bold">Evidence Vault (SHA-256)</span>
              <div className="text-2xl font-black text-[#0F172A] mt-1">{relatedEvidence.length}</div>
              <button
                onClick={() => setActiveTab('evidence')}
                className="text-[11px] text-[#E32936] font-bold mt-1 hover:underline block"
              >
                Review vault →
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <span className="text-[11px] text-[#64748B] font-bold">Generated Reports</span>
              <div className="text-2xl font-black text-[#0F172A] mt-1">{relatedReports.length}</div>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-[11px] text-[#E32936] font-bold mt-1 hover:underline block"
              >
                Download report →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scope */}
      {activeTab === 'scope' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-5">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Authorized Scope Policy &amp; Boundaries</h2>
              <p className="text-xs text-[#64748B]">Audited testing boundaries agreed for this assessment.</p>
            </div>
            <button
              onClick={() => setInspectingPhase('01')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#E32936] rounded-xl text-xs font-mono text-[#0F172A]"
            >
              <Code2 className="w-3.5 h-3.5 text-[#E32936]" /> Inspect Scope Script
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase">Authorization Record</span>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Auth Ticket:</span>
                <span className="font-mono font-bold text-[#0F172A]">{assessment.authorization.authTicket}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Confirmed By:</span>
                <span className="text-[#0F172A] font-semibold">{assessment.authorization.confirmedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Confirmed At:</span>
                <span className="font-mono text-[#0F172A]">{assessment.authorization.confirmedAt}</span>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase">Execution Parameters</span>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Max Request Rate:</span>
                <span className="font-mono font-bold text-[#0F172A]">{assessment.scope.maxRequestRate} req/sec</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Testing Windows:</span>
                <span className="text-[#0F172A]">{assessment.scope.approvedWindows}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Status:</span>
                <span className="font-bold text-[#059669]">Explicit Authorization Verified</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-[#0F172A] block mb-1">Permitted Targets</span>
              <div className="flex flex-wrap gap-2">
                {assessment.scope.allowedDomains.map((d) => (
                  <span key={d} className="px-2.5 py-1 bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-lg font-mono">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-[#DC2626] block mb-1">Explicitly Excluded Targets</span>
              <div className="flex flex-wrap gap-2">
                {assessment.scope.excludedHosts.length > 0 ? (
                  assessment.scope.excludedHosts.map((ex) => (
                    <span key={ex} className="px-2.5 py-1 bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2] rounded-lg font-mono">
                      {ex}
                    </span>
                  ))
                ) : (
                  <span className="text-[#94A3B8]">None specified.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Recon */}
      {activeTab === 'recon' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Reconnaissance Observations</h2>
              <p className="text-xs text-[#64748B]">Subdomains and DNS entries discovered for {assessment.targetDomain}</p>
            </div>
            <button
              onClick={() => navigate('/recon')}
              className="text-xs font-bold text-[#E32936] hover:underline"
            >
              Open Full Recon Module →
            </button>
          </div>

          {relatedAssets.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8] space-y-3">
              <p>No reconnaissance data collected yet.</p>
              <button
                onClick={handleRunAssessment}
                className="px-4 py-2 bg-[#E32936] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Run Assessment Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-2.5 px-3">Asset</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3">Source</th>
                    <th className="py-2.5 px-3">Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {relatedAssets.map((ast) => (
                    <tr key={ast.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 px-3 font-bold text-[#0F172A]">{ast.name}</td>
                      <td className="py-2.5 px-3 text-[#64748B]">{ast.type}</td>
                      <td className="py-2.5 px-3 font-mono text-[#0F172A]">{ast.ipAddress || 'N/A'}</td>
                      <td className="py-2.5 px-3 text-[#64748B]">{ast.source}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                          {ast.scopeStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Scanning */}
      {activeTab === 'scanning' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Scanning &amp; Enumeration Jobs</h2>
              <p className="text-xs text-[#64748B]">Controlled jobs executed against authorized targets</p>
            </div>
            <button
              onClick={() => navigate('/scanning')}
              className="text-xs font-bold text-[#E32936] hover:underline"
            >
              Open Scan Console →
            </button>
          </div>

          {relatedJobs.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8]">
              No scanning jobs logged yet. Run the assessment to trigger scan jobs.
            </div>
          ) : (
            <div className="space-y-3">
              {relatedJobs.map((j) => (
                <div key={j.id} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#0F172A] flex items-center gap-2">
                      <span className="font-mono bg-white border border-[#CBD5E1] px-1.5 py-0.5 rounded text-[10px] text-[#64748B]">{j.id}</span>
                      <span>{j.module}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      {j.status}
                    </span>
                  </div>
                  <pre className="p-3 bg-[#0F172A] text-[#34D399] font-mono text-[11px] rounded-xl border border-[#334155] overflow-x-auto">
                    {j.stdout}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Findings */}
      {activeTab === 'findings' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Security Findings &amp; Observations</h2>
              <p className="text-xs text-[#64748B]">Vulnerabilities requiring sign-off and remediation</p>
            </div>
            <button
              onClick={() => navigate('/findings')}
              className="text-xs font-bold text-[#E32936] hover:underline"
            >
              Manage All Findings →
            </button>
          </div>

          {relatedFindings.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8]">
              No findings recorded yet. Execute assessment to triage observations.
            </div>
          ) : (
            <div className="space-y-3">
              {relatedFindings.map((f) => (
                <div key={f.id} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#0F172A] flex items-center gap-2">
                      <span className="font-mono text-[#E32936]">{f.id}</span>
                      <span>{f.title}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        f.severity === 'Critical'
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                          : f.severity === 'High'
                          ? 'bg-[#FEF2F2] text-[#E32936] border border-[#FEE2E2]'
                          : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                      }`}
                    >
                      {f.severity} (CVSS {f.cvssScore || 'N/A'})
                    </span>
                  </div>
                  <p className="text-[#64748B]">{f.description}</p>
                  <div className="pt-2 text-[11px] text-[#64748B] flex items-center gap-4">
                    <span>Target: <code className="font-mono text-[#0F172A]">{f.targetAsset}</code></span>
                    <span>Status: <strong className="text-[#0F172A]">{f.status}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Evidence */}
      {activeTab === 'evidence' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Evidence Vault Artifacts</h2>
              <p className="text-xs text-[#64748B]">Digital evidence and SHA-256 integrity metadata</p>
            </div>
            <button
              onClick={() => navigate('/evidence')}
              className="text-xs font-bold text-[#E32936] hover:underline"
            >
              Open Full Vault →
            </button>
          </div>

          {relatedEvidence.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8]">
              No evidence artifacts in vault yet. Run assessment to generate cryptographic evidence.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedEvidence.map((ev) => (
                <div key={ev.id} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#E32936]">{ev.id}</span>
                    <span className="text-[10px] bg-white border border-[#CBD5E1] px-2 py-0.5 rounded font-mono text-[#64748B]">
                      {ev.type}
                    </span>
                  </div>
                  <div className="font-bold text-[#0F172A]">{ev.name}</div>
                  <div className="font-mono text-[10px] text-[#64748B] truncate">
                    SHA-256: {ev.sha256}
                  </div>
                  {ev.contentPreview && (
                    <pre className="p-2.5 bg-[#0F172A] text-[#60A5FA] font-mono text-[10px] rounded-lg border border-[#334155] overflow-x-auto max-h-32">
                      {ev.contentPreview}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 7: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#0F172A]">Assessment Activity Timeline</h2>
            <p className="text-xs text-[#64748B]">Chronological audit of assessment actions for {assessment.targetDomain}</p>
          </div>

          {relatedTimeline.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8]">
              No timeline events recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {relatedTimeline.map((tl) => (
                <div key={tl.id} className="flex items-start gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
                  <span className="font-mono text-[10px] text-[#64748B] pt-0.5 shrink-0">
                    {new Date(tl.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <div className="flex-1">
                    <div className="font-bold text-[#0F172A]">{tl.sourceModule}</div>
                    <p className="text-[#64748B] mt-0.5">{tl.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 8: Terminal Simulator */}
      {activeTab === 'terminal' && (
        <TerminalSimulator
          initialTarget={assessment.targetDomain}
          initialAssessmentId={assessment.id}
          isEmbedded={true}
        />
      )}

      {/* Tab 9: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Assessment Deliverables</h2>
              <p className="text-xs text-[#64748B]">Download deliverables in TXT, JSON, CSV, or printable PDF format</p>
            </div>
            <button
              onClick={() => generateReport(assessment.id, 'Technical Security Assessment', 'TXT')}
              className="px-3.5 py-1.5 bg-[#E32936] text-white rounded-xl text-xs font-bold hover:bg-[#C91E2B] shadow-xs cursor-pointer"
            >
              Generate New Report
            </button>
          </div>

          {relatedReports.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8] space-y-3">
              <p>No reports generated yet for this assessment.</p>
              <button
                onClick={() => generateReport(assessment.id, 'Technical Security Assessment', 'TXT')}
                className="px-4 py-2 bg-[#E32936] text-white text-xs font-bold rounded-xl"
              >
                Generate Report Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {relatedReports.map((r) => (
                <div key={r.id} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#0F172A]">{r.name}</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      Format: <span className="font-mono font-bold text-[#E32936]">{r.format}</span> &bull; Size: {r.fileSize} &bull; Auditor: BIG SAM
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportReportFile(r.id, 'TXT')}
                      className="px-3 py-1.5 text-xs font-medium bg-white border border-[#CBD5E1] text-[#0F172A] rounded-lg hover:bg-[#E2E8F0] cursor-pointer"
                    >
                      TXT
                    </button>
                    <button
                      onClick={() => exportReportFile(r.id, 'JSON')}
                      className="px-3 py-1.5 text-xs font-medium bg-white border border-[#CBD5E1] text-[#0F172A] rounded-lg hover:bg-[#E2E8F0] cursor-pointer"
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => exportReportFile(r.id, 'PDF')}
                      className="px-3 py-1.5 text-xs font-bold bg-[#E32936] text-white rounded-lg hover:bg-[#C91E2B] shadow-xs cursor-pointer"
                    >
                      Print PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 10: Activity Log */}
      {activeTab === 'activity' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#0F172A]">Session Audit &amp; Activity Log</h2>
            <p className="text-xs text-[#64748B]">Audited user actions and automated observation triggers</p>
          </div>

          {relatedTimeline.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8]">
              No activity logs recorded yet.
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {relatedTimeline.map((tl) => (
                <div key={tl.id} className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg font-mono text-[11px]">
                  <span className="text-[#94A3B8]">[{tl.timestamp}]</span>{' '}
                  <span className="text-[#E32936] font-bold">[{tl.eventType}]</span>{' '}
                  <span className="text-[#0F172A]">{tl.summary}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Phase Script Inspector Modal */}
      <PhaseScriptModal
        phaseNum={inspectingPhase}
        onClose={() => setInspectingPhase(null)}
        targetDomain={assessment.targetDomain}
        authTicket={assessment.authorization.authTicket}
      />
    </div>
  );
};
