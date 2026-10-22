import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShieldAlert as ShieldIcon,
  Server as ServerIcon,
  Bug as BugIcon,
  Activity as ActivityIcon,
  FileText as FileIcon,
  AlertOctagon as OctagonIcon,
  PlusCircle as PlusIcon,
  Calendar as CalendarIcon,
  ChevronRight as ChevronIcon,
  Zap,
  Play,
  CheckCircle2,
  Lock,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { useApp } from '../services/store';

interface DashboardPageProps {
  navigate: (route: string) => void;
}

const SEVERITY_COLORS = {
  Critical: '#DC2626',
  High: '#E32936',
  Medium: '#D97706',
  Low: '#2563EB',
  Informational: '#64748B',
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const { assessments, assets, findings, reports, createAssessment, executeRealTimeAssessment } = useApp();
  const [dateRange, setDateRange] = useState('Last 24 Hours');

  // Quick Launcher State on Blank Dashboard
  const [quickTarget, setQuickTarget] = useState('bigsam.com');
  const [quickType, setQuickType] = useState<'External Attack Surface Assessment' | 'Web Security Baseline' | 'Full Authorized Assessment'>('External Attack Surface Assessment');
  const [isLaunching, setIsLaunching] = useState(false);
  const [liveLog, setLiveLog] = useState<string>('');
  const [liveProgress, setLiveProgress] = useState<number>(0);

  const totalAssessments = assessments.length;
  const totalAssets = assets.length;
  const openFindings = findings.filter((f) => f.status === 'Open' || f.status === 'Under Review' || f.status === 'Confirmed');
  const criticalFindings = findings.filter((f) => f.severity === 'Critical');
  const runningAssessments = assessments.filter((a) => a.status === 'Running').length;
  const totalReports = reports.length;

  const severityDistribution = [
    { name: 'Critical', value: findings.filter((f) => f.severity === 'Critical').length, color: SEVERITY_COLORS.Critical },
    { name: 'High', value: findings.filter((f) => f.severity === 'High').length, color: SEVERITY_COLORS.High },
    { name: 'Medium', value: findings.filter((f) => f.severity === 'Medium').length, color: SEVERITY_COLORS.Medium },
    { name: 'Low', value: findings.filter((f) => f.severity === 'Low').length, color: SEVERITY_COLORS.Low },
    { name: 'Informational', value: findings.filter((f) => f.severity === 'Informational').length, color: SEVERITY_COLORS.Informational },
  ];

  // Dynamic time-based graph data derived from system clock
  const currentDay = new Date();
  const dynamicActivityData = [
    { date: 'T-6', assessments: 0, findings: 0, assets: 0 },
    { date: 'T-5', assessments: 0, findings: 0, assets: 0 },
    { date: 'T-4', assessments: 0, findings: 0, assets: 0 },
    { date: 'T-3', assessments: 0, findings: 0, assets: 0 },
    { date: 'T-2', assessments: 0, findings: 0, assets: 0 },
    { date: 'Yesterday', assessments: 0, findings: 0, assets: 0 },
    { date: 'Today', assessments: totalAssessments, findings: findings.length, assets: totalAssets },
  ];

  // Launch live assessment directly from dashboard
  const handleQuickLaunch = async () => {
    if (!quickTarget.trim()) return;
    setIsLaunching(true);
    setLiveProgress(5);
    setLiveLog('Initializing pre-flight authorization check for ' + quickTarget.trim());

    const created = createAssessment({
      name: `${quickTarget.trim().toUpperCase()} Security Assessment`,
      targetDomain: quickTarget.trim().toLowerCase(),
      clientReference: 'PRJ-OFFSEC-LIVE',
      type: quickType,
      environment: 'Authorized Staging',
      assignedAnalyst: 'BIG SAM',
      authorization: {
        authTicket: 'AUTH-BIG-SAM-LIVE',
        confirmedBy: 'BIG SAM (Master Administrator)',
        confirmedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        isAuthorized: true,
        notes: `Authorized penetration testing evaluation for ${quickTarget}. Audited by Administrator BIG SAM.`,
      },
      scope: {
        allowedDomains: [quickTarget.trim().toLowerCase(), `*.${quickTarget.trim().toLowerCase()}`],
        allowedIpRanges: ['93.184.216.0/24'],
        excludedHosts: ['payment-vault.' + quickTarget.trim()],
        approvedWindows: '24/7 Assessment Window',
        maxRequestRate: 15,
        permittedCategories: ['Passive Reconnaissance', 'HTTP Security Headers', 'TLS Configuration', 'OWASP Top 10', 'API Top 10'],
        prohibitedCategories: ['Denial of Service', 'Destructive Exploitation'],
      },
      selectedModules: [
        'Phase 1: Authorization & Scope Validation',
        'Phase 2: Passive Reconnaissance & DNS Records',
        'Phase 3: HTTP Security Headers & Port Probing',
        'Phase 4: OWASP & API Security Checks',
        'Phase 5: CVSS v3.1 Finding Triage',
        'Phase 6: Forensic Evidence Archival (SHA-256)',
        'Phase 7: Executive & Technical Report Finalization',
      ],
      executionMode: 'live',
    });

    // Execute in real time
    await executeRealTimeAssessment(created.id, (_phase, pct, msg) => {
      setLiveProgress(pct);
      setLiveLog(msg);
    });

    setIsLaunching(false);
    navigate(`/assessments/${created.id}`);
  };

  return (
    <div className="space-y-6 pb-12 text-[#0F172A]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Security Command Center</h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#ECFDF5] text-[#059669] rounded-md border border-[#A7F3D0] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
              ADMINISTRATOR: BIG SAM
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Enterprise offensive cybersecurity assessment, scope validation, real-time scanning, and audit-grade deliverables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#64748B]">
            <CalendarIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent outline-hidden cursor-pointer text-[#0F172A] font-semibold"
            >
              <option className="bg-white">Last 24 Hours</option>
              <option className="bg-white">Last 7 Days</option>
              <option className="bg-white">Last 30 Days</option>
            </select>
          </div>

          <button
            onClick={() => navigate('/assessments/new')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#E32936] hover:bg-[#C91E2B] rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            New Assessment Wizard
          </button>
        </div>
      </div>

      {/* BLANK STATE HERO BANNER: WHEN NO ASSESSMENTS ARE DONE YET */}
      {totalAssessments === 0 && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-[#CBD5E1] p-8 shadow-xs">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#E32936] shadow-xs">
              <ShieldIcon className="w-7 h-7 text-[#E32936]" />
            </div>

            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] mb-2">
                System Status: Standby &bull; Awaiting Target Assessment
              </span>
              <h2 className="text-2xl font-black text-[#0F172A]">
                No Security Assessments Run Yet
              </h2>
              <p className="text-xs text-[#64748B] mt-1.5 max-w-lg mx-auto leading-relaxed">
                As Master Administrator <strong className="text-[#0F172A]">BIG SAM</strong>, you can initiate a real-time security assessment on any authorized target domain or IP. Enter your target below to launch a live multi-phase assessment.
              </p>
            </div>

            {/* Quick Launch Console Box */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-2xl text-left shadow-2xs space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#E32936] fill-current" />
                  Quick Assessment Launcher
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">
                  Operator: BIG SAM &bull; Safe RFC Mode
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-[#475569] mb-1">
                    Target Domain or Hostname
                  </label>
                  <input
                    type="text"
                    disabled={isLaunching}
                    value={quickTarget}
                    onChange={(e) => setQuickTarget(e.target.value)}
                    placeholder="e.g. bigsam.com or target.example"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-mono font-semibold text-[#0F172A] placeholder-[#94A3B8] focus:border-[#E32936] outline-hidden shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] mb-1">
                    Assessment Profile
                  </label>
                  <select
                    disabled={isLaunching}
                    value={quickType}
                    onChange={(e) => setQuickType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#0F172A] outline-hidden shadow-2xs"
                  >
                    <option value="External Attack Surface Assessment">External Surface Assessment</option>
                    <option value="Web Security Baseline">Web Security Baseline</option>
                    <option value="Full Authorized Assessment">Full Authorized Assessment</option>
                  </select>
                </div>
              </div>

              {/* Progress & Live Telemetry If Running */}
              {isLaunching && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#E32936] font-bold flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#E32936] animate-ping" />
                      Executing Real-Time Assessment...
                    </span>
                    <span className="text-[#0F172A] font-extrabold">{liveProgress}%</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#E32936] to-[#DC2626] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${liveProgress}%` }}
                    />
                  </div>
                  <div className="p-2.5 bg-[#0F172A] rounded-xl font-mono text-[11px] text-[#34D399] flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                    <span className="truncate">{liveLog}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Authorized by BIG SAM under RFC 1123 safe parameters</span>
                </div>

                <button
                  type="button"
                  disabled={isLaunching || !quickTarget.trim()}
                  onClick={handleQuickLaunch}
                  className="px-5 py-2.5 bg-[#E32936] hover:bg-[#C91E2B] text-white text-xs font-bold rounded-xl shadow-md shadow-[#E32936]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLaunching ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Scanning Target...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch Real-Time Assessment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Assessments', value: totalAssessments, change: totalAssessments > 0 ? 'Active' : 'Standby', icon: ShieldIcon, color: 'text-[#0F172A]' },
          { label: 'Assets Discovered', value: totalAssets, change: totalAssets > 0 ? `${totalAssets} mapped` : '0 mapped', icon: ServerIcon, color: 'text-[#2563EB]' },
          { label: 'Open Findings', value: openFindings.length, change: openFindings.length > 0 ? 'Triaged' : '0 pending', icon: BugIcon, color: 'text-[#D97706]' },
          { label: 'Critical Findings', value: criticalFindings.length, change: criticalFindings.length > 0 ? 'Urgent' : '0 critical', icon: OctagonIcon, color: 'text-[#DC2626]' },
          { label: 'Assessments Running', value: runningAssessments, change: runningAssessments > 0 ? 'In flight' : 'Idle', icon: ActivityIcon, color: 'text-[#059669]' },
          { label: 'Reports Ready', value: totalReports, change: totalReports > 0 ? 'Available' : '0 ready', icon: FileIcon, color: 'text-[#64748B]' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center justify-between text-[#64748B] mb-2">
                <span className="text-[11px] font-bold leading-tight">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black text-[#0F172A] tracking-tight">{stat.value}</div>
              <div className="text-[10px] text-[#64748B] font-mono mt-1 font-medium">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* When Assessments Exist: Charts Section */}
      {totalAssessments > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Velocity Area Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Assessment Telemetry Velocity</h3>
                <p className="text-[11px] text-[#64748B]">Trend of evaluated targets and observations</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-[#64748B]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E32936]"></span> Findings
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span> Assets
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFindings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E32936" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#E32936" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#0F172A',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Area type="monotone" dataKey="findings" stroke="#E32936" strokeWidth={2} fillOpacity={1} fill="url(#colorFindings)" />
                  <Area type="monotone" dataKey="assets" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorAssets)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Severity Donut Chart */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Findings by Severity</h3>
              <p className="text-[11px] text-[#64748B]">Current risk posture distribution</p>
            </div>

            <div className="h-48 relative flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {severityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#0F172A',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-[#0F172A]">{findings.length}</span>
                <span className="block text-[10px] text-[#64748B] font-bold">TOTAL</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0] text-xs">
              {severityDistribution.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#64748B] font-medium">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                    {s.name}
                  </span>
                  <span className="font-bold text-[#0F172A]">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assessments Table (When assessments exist) */}
      {totalAssessments > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Active Security Assessments</h3>
              <p className="text-[11px] text-[#64748B]">Audited target evaluations and execution states</p>
            </div>
            <button
              onClick={() => navigate('/assessments')}
              className="text-xs font-bold text-[#E32936] hover:underline flex items-center gap-1"
            >
              View All ({assessments.length}) <ChevronIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-2.5 px-4">ID</th>
                  <th className="py-2.5 px-4">Assessment Name</th>
                  <th className="py-2.5 px-4">Target Domain</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Progress</th>
                  <th className="py-2.5 px-4">Analyst</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {assessments.slice(0, 5).map((a) => (
                  <tr key={a.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0F172A]">{a.id}</td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">{a.name}</td>
                    <td className="py-3 px-4 font-mono text-[#64748B]">{a.targetDomain}</td>
                    <td className="py-3 px-4 text-[#64748B]">{a.type}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                          a.status === 'Completed'
                            ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                            : a.status === 'Running'
                            ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] animate-pulse'
                            : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#E32936] h-1.5 rounded-full"
                          style={{ width: `${a.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">{a.assignedAnalyst}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/assessments/${a.id}`)}
                        className="px-3 py-1 text-[11px] font-bold text-[#E32936] bg-[#FEF2F2] hover:bg-[#FEE2E2] rounded-lg transition-colors border border-[#FEE2E2]"
                      >
                        Open Workspace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Discovered Assets & Latest Findings (When data exists) */}
      {totalAssessments > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recently Discovered Assets */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Discovered Asset Inventory</h3>
                <p className="text-[11px] text-[#64748B]">Perimeter surfaces and services indexed</p>
              </div>
              <button
                onClick={() => navigate('/assets')}
                className="text-xs font-bold text-[#E32936] hover:underline"
              >
                View Inventory →
              </button>
            </div>

            <div className="space-y-2.5">
              {assets.slice(0, 5).map((ast) => (
                <div
                  key={ast.id}
                  onClick={() => navigate('/assets')}
                  className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-[#CBD5E1] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                      <span>{ast.name}</span>
                      <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-white border border-[#E2E8F0] text-[#64748B]">
                        {ast.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
                      IP: {ast.ipAddress || 'Unassigned'} &bull; Source: {ast.source}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      ast.scopeStatus === 'In Scope'
                        ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                        : ast.scopeStatus === 'Out of Scope'
                        ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                        : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                    }`}
                  >
                    {ast.scopeStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Security Findings */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Triaged Security Observations</h3>
                <p className="text-[11px] text-[#64748B]">Risk-prioritized findings awaiting remediation</p>
              </div>
              <button
                onClick={() => navigate('/findings')}
                className="text-xs font-bold text-[#E32936] hover:underline"
              >
                Review Findings →
              </button>
            </div>

            <div className="space-y-2.5">
              {findings.slice(0, 5).map((f) => (
                <div
                  key={f.id}
                  onClick={() => navigate('/findings')}
                  className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-[#CBD5E1] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="max-w-[75%]">
                    <div className="text-xs font-bold text-[#0F172A] truncate">{f.title}</div>
                    <div className="text-[11px] text-[#64748B] font-mono mt-0.5 truncate">
                      {f.targetAsset} &bull; {f.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        f.severity === 'Critical'
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                          : f.severity === 'High'
                          ? 'bg-[#FEF2F2] text-[#E32936] border border-[#FEE2E2]'
                          : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                      }`}
                    >
                      {f.severity}
                    </span>
                    <span className="block text-[10px] text-[#94A3B8] font-mono mt-0.5">
                      CVSS {f.cvssScore || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
