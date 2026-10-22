import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../services/store';
import { AssessmentType } from '../types';

interface NewAssessmentPageProps {
  navigate: (route: string) => void;
}

export const NewAssessmentPage: React.FC<NewAssessmentPageProps> = ({ navigate }) => {
  const { createAssessment, currentUser } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Details
  const [name, setName] = useState('Authorized Security Assessment');
  const [targetDomain, setTargetDomain] = useState('bigsam.com');
  const [targetIp, setTargetIp] = useState('93.184.216.34');
  const [clientReference, setClientReference] = useState('PRJ-OFFSEC-01');
  const [description, setDescription] = useState(
    'Automated reconnaissance, vulnerability assessment, OWASP Top 10, and API security evaluation.'
  );
  const [assessmentType, setAssessmentType] = useState<AssessmentType>(
    'External Attack Surface Assessment'
  );
  const [environment, setEnvironment] = useState<'Demonstration Lab' | 'Authorized Staging' | 'Authorized Production'>(
    'Authorized Staging'
  );
  const [assignedAnalyst, setAssignedAnalyst] = useState('BIG SAM');

  // Step 2: Authorization & Scope
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [authTicket, setAuthTicket] = useState(`AUTH-OFFSEC-${new Date().getFullYear()}`);
  const [approvedWindows, setApprovedWindows] = useState('24/7 Assessment Window');
  const [maxRequestRate, setMaxRequestRate] = useState(15);
  const [allowedDomains, setAllowedDomains] = useState('bigsam.com, *.bigsam.com');
  const [allowedIpRanges, setAllowedIpRanges] = useState('93.184.216.0/24');
  const [excludedHosts, setExcludedHosts] = useState('vault-prod.bigsam.com, payment.bigsam.com');

  // Step 3: Modules
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'Phase 1: Reconnaissance (WHOIS, DNS, Subdomains, Ports)',
    'Phase 2: Vulnerability Assessment (Sensitive Files, Headers)',
    'Phase 3: OWASP Top 10 Testing (XSS, SQLi, LFI, RCE, SSRF)',
    'Phase 4: API Security Top 10 (BOLA, Endpoints, Swagger)',
    'Phase 5: Payload Generation (10 Attack Vectors)',
  ]);

  // Validation errors
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStep1Next = () => {
    if (!targetDomain.trim() || !name.trim()) {
      setErrorMsg('Assessment name and Target domain are required.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    if (!isAuthorized) {
      setErrorMsg('You must explicitly confirm authorization before proceeding.');
      return;
    }
    if (!authTicket.trim()) {
      setErrorMsg('An Authorization Ticket reference is mandatory for auditable testing.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(3);
  };

  const handleStep3Next = () => {
    if (selectedModules.length === 0) {
      setErrorMsg('Please select at least one assessment module.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(4);
  };

  const handleStartAssessment = () => {
    const created = createAssessment({
      name,
      targetDomain: targetDomain.trim(),
      targetIp: targetIp.trim() || undefined,
      clientReference,
      type: assessmentType,
      environment,
      assignedAnalyst,
      authorization: {
        authTicket,
        confirmedBy: `${currentUser.name} (${currentUser.role})`,
        confirmedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        isAuthorized: true,
        notes: `Authorized penetration testing evaluation for ${targetDomain}. Execution mode: simulation.`,
      },
      scope: {
        allowedDomains: allowedDomains.split(',').map((s) => s.trim()).filter(Boolean),
        allowedIpRanges: allowedIpRanges.split(',').map((s) => s.trim()).filter(Boolean),
        excludedHosts: excludedHosts.split(',').map((s) => s.trim()).filter(Boolean),
        approvedWindows,
        maxRequestRate,
        permittedCategories: ['Passive OSINT', 'HTTP Headers', 'TLS Configuration', 'Safe Service Fingerprinting', 'OWASP Probes'],
        prohibitedCategories: ['Denial of Service', 'Destructive Exploitation', 'Persistence Installation'],
      },
      selectedModules,
      executionMode: 'simulation',
    });

    navigate(`/assessments/${created.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-[#172033]">
      {/* Page Title */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#E32936]" />
            New Security Assessment Wizard
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Configure an authorized perimeter assessment, define testing scope, and select modules.
          </p>
        </div>

        {/* Quick Demo Pre-fill Button */}
        <button
          onClick={() => {
            setName('BigSam.com Offensive Security Assessment');
            setTargetDomain('BigSam.com');
            setTargetIp('93.184.216.34');
            setAuthTicket('AUTH-OFFSEC-2026');
            setIsAuthorized(true);
            setEnvironment('Demonstration Lab');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg hover:bg-[#D1FAE5] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Target (BigSam.com)
        </button>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { step: 1, title: '01 Details' },
            { step: 2, title: '02 Authorization & Scope' },
            { step: 3, title: '03 Modules' },
            { step: 4, title: '04 Review & Start' },
          ].map((s) => (
            <div
              key={s.step}
              className={`p-2 rounded-lg font-medium transition-all ${
                currentStep === s.step
                  ? 'bg-[#E32936] text-white shadow-xs font-semibold'
                  : currentStep > s.step
                  ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                  : 'bg-[#F8FAFC] text-[#94A3B8] border border-[#E2E8F0]'
              }`}
            >
              <span>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMsg && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl flex items-center gap-3 text-xs text-[#DC2626]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: Details */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#172033]">Step 1: Assessment Details</h2>
            <p className="text-xs text-[#64748B]">Identify target domain, client reference, and operational template.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Assessment Name <span className="text-[#E32936]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
                placeholder="e.g. BigSam.com Full Scan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Target Domain <span className="text-[#E32936]">*</span>
              </label>
              <input
                type="text"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
                placeholder="e.g. BigSam.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Target IP Address or CIDR (Optional)
              </label>
              <input
                type="text"
                value={targetIp}
                onChange={(e) => setTargetIp(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
                placeholder="e.g. 93.184.216.34"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Client / Project Reference
              </label>
              <input
                type="text"
                value={clientReference}
                onChange={(e) => setClientReference(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
                placeholder="e.g. PRJ-OFFSEC-01"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">Assessment Type</label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value as AssessmentType)}
                className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
              >
                <option>Passive Reconnaissance</option>
                <option>External Attack Surface Assessment</option>
                <option>Web Security Baseline</option>
                <option>API Security Assessment</option>
                <option>Network Security Assessment</option>
                <option>Full Authorized Assessment</option>
                <option>Custom Assessment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">Target Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
              >
                <option>Demonstration Lab</option>
                <option>Authorized Staging</option>
                <option>Authorized Production</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">Description / Objectives</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleStep1Next}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E32936] hover:bg-[#C91E2B] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Next: Authorization & Scope <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Authorization & Scope */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#172033]">Step 2: Authorization & Scope Definition</h2>
            <p className="text-xs text-[#64748B]">
              Rigorous scope enforcement guarantees that testing remains strictly within permitted boundaries.
            </p>
          </div>

          {/* Authorization Checkbox Callout */}
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAuthorized}
                onChange={(e) => setIsAuthorized(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#E32936] border-[#CBD5E1] rounded focus:ring-[#E32936]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#172033]">
                  I confirm that explicit authorization exists for testing {targetDomain || 'the target'}
                </span>
                <p className="text-[#64748B] mt-0.5">
                  The client or target asset owner has signed an Engagement Letter or granted documented testing rights under an approved bug bounty or assessment agreement.
                </p>
              </div>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
              <div>
                <label className="block text-[11px] font-semibold text-[#172033] mb-1">
                  Authorization Ticket / Ref <span className="text-[#E32936]">*</span>
                </label>
                <input
                  type="text"
                  value={authTicket}
                  onChange={(e) => setAuthTicket(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg text-[#172033]"
                  placeholder="e.g. AUTH-2026-DEMO-01"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#172033] mb-1">Approved Testing Windows</label>
                <input
                  type="text"
                  value={approvedWindows}
                  onChange={(e) => setApprovedWindows(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#172033]"
                />
              </div>
            </div>
          </div>

          {/* Scope Boundaries */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#172033]">Scope Boundaries & Guardrails</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Allowed Domains (Comma separated)
                </label>
                <input
                  type="text"
                  value={allowedDomains}
                  onChange={(e) => setAllowedDomains(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Allowed IP Ranges / CIDRs
                </label>
                <input
                  type="text"
                  value={allowedIpRanges}
                  onChange={(e) => setAllowedIpRanges(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#DC2626] mb-1">
                Explicitly Excluded Hosts & Networks
              </label>
              <input
                type="text"
                value={excludedHosts}
                onChange={(e) => setExcludedHosts(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-[#FCA5A5] bg-[#FEF2F2] rounded-lg text-[#DC2626]"
                placeholder="e.g. vault.BigSam.com, 10.0.0.0/8"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Max Request Rate Limit (req/sec)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={maxRequestRate}
                  onChange={(e) => setMaxRequestRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#CBD5E1] text-[#172033] text-xs font-semibold rounded-lg hover:bg-[#F8FAFC] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              onClick={handleStep2Next}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E32936] hover:bg-[#C91E2B] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Next: Select Modules <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Modules */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#172033]">Step 3: Assessment Modules</h2>
            <p className="text-xs text-[#64748B]">
              Select approved, non-destructive discovery and verification modules based on the Phantom Eye automation engine.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-[#E32936] mb-2 uppercase text-[10px] tracking-wider">
                5-Phase Offensive Security Engine
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'Phase 1: Reconnaissance (WHOIS, DNS, Subdomains, Ports)', desc: 'Socket IP resolution, WHOIS lookup, DNS A/MX/NS/TXT records, and port scan (modules/recon.py).' },
                  { id: 'Phase 2: Vulnerability Assessment (Sensitive Files, Headers)', desc: 'Checks 28 sensitive paths (/.git, /.env, backup.zip) and missing security headers (modules/vuln.py).' },
                  { id: 'Phase 3: OWASP Top 10 Testing (XSS, SQLi, LFI, RCE, SSRF)', desc: 'Automated injection checks across query params, headers, and endpoints (modules/owasp.py).' },
                  { id: 'Phase 4: API Security Top 10 (BOLA, Endpoints, Swagger)', desc: 'Discovers API routes, tests BOLA/IDOR on /api/users/1, and checks admin auth (modules/api_top10.py).' },
                  { id: 'Phase 5: Payload Generation (10 Attack Vectors)', desc: 'Generates weaponized payloads for XSS, SQLi, LFI, RCE, SSRF, SSTI, XXE, CRLF (modules/payloads.py).' },
                ].map((m) => {
                  const checked = selectedModules.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() =>
                        setSelectedModules((prev) =>
                          checked ? prev.filter((x) => x !== m.id) : [...prev, m.id]
                        )
                      }
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        checked ? 'border-[#E32936] bg-[#FEF2F2]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-[#172033]">
                        <span>{m.id}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#E32936] rounded border-[#CBD5E1]"
                        />
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-1">{m.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-xs text-[#059669] flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 shrink-0 text-[#059669]" />
            <span>
              Intrusive exploits, credential attacks, and destructive tests are disabled by default.
            </span>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#CBD5E1] text-[#172033] text-xs font-semibold rounded-lg hover:bg-[#F8FAFC] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              onClick={handleStep3Next}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E32936] hover:bg-[#C91E2B] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Next: Review & Start <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review and Start */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-5">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#172033]">Step 4: Review and Start Assessment</h2>
            <p className="text-xs text-[#64748B]">Verify parameters prior to launching the simulation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
              <div className="font-bold text-[#172033] border-b border-[#E2E8F0] pb-1.5">
                Target Specifications
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Target Domain:</span>
                <span className="font-mono font-bold text-[#172033]">{targetDomain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Target IP:</span>
                <span className="font-mono text-[#172033]">{targetIp || 'Automatic DNS'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Environment:</span>
                <span className="font-semibold text-[#059669]">{environment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Execution Mode:</span>
                <span className="font-semibold text-[#E32936]">Safe Engine Baseline</span>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
              <div className="font-bold text-[#172033] border-b border-[#E2E8F0] pb-1.5">
                Authorization & Scope
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Ticket Ref:</span>
                <span className="font-mono font-bold text-[#172033]">{authTicket}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Request Limit:</span>
                <span className="font-mono text-[#172033]">{maxRequestRate} req/sec</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Testing Window:</span>
                <span className="text-[#172033] truncate max-w-[150px]">{approvedWindows}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Selected Modules:</span>
                <span className="font-semibold text-[#172033]">{selectedModules.length} Active</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">
              Active Assessment Modules
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedModules.map((m) => (
                <span
                  key={m}
                  className="px-2 py-0.5 bg-white border border-[#CBD5E1] rounded text-[11px] font-medium text-[#172033]"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#CBD5E1] text-[#172033] text-xs font-semibold rounded-lg hover:bg-[#F8FAFC] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/assessments')}
                className="px-4 py-2 border border-[#CBD5E1] text-[#64748B] hover:text-[#172033] text-xs font-medium rounded-lg"
              >
                Save as Draft
              </button>
              <button
                onClick={handleStartAssessment}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#E32936] hover:bg-[#C91E2B] text-white text-xs font-bold rounded-lg shadow-xs transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
