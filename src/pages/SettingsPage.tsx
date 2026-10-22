import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Terminal,
  FileText,
  Bell,
  Database,
  Lock,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface SettingsPageProps {
  navigate: (route: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<
    | 'general'
    | 'appearance'
    | 'defaults'
    | 'scope'
    | 'terminal'
    | 'branding'
    | 'notifications'
    | 'security'
  >('general');

  const [orgName, setOrgName] = useState('Phantom SecOps Global Labs');
  const [contactEmail, setContactEmail] = useState('security-lead@phantomeye.sec');
  const [defaultTimeout, setDefaultTimeout] = useState(45);
  const [defaultRateLimit, setDefaultRateLimit] = useState(15);
  const [defaultProfile, setDefaultProfile] = useState('Low Impact');
  const [terminalFontSize, setTerminalFontSize] = useState('12px');
  const [reportFooter, setReportFooter] = useState(
    'CONFIDENTIAL SECURITY ASSESSMENT • PREPARED BY PHANTOM EYE AUTHORIZED OPERATORS'
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#E32936]" />
            Application & Platform Settings
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Configure system defaults, authorization policies, terminal display settings, and report branding.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E32936] hover:bg-[#C91D29] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      {isSaved && (
        <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-center text-xs font-semibold text-[#059669] flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Preferences and engine defaults updated successfully.
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col md:flex-row">
        {/* Settings Navigation Tabs */}
        <div className="w-full md:w-56 bg-[#F8FAFC] border-r border-[#E2E8F0] p-3 space-y-1 shrink-0 text-xs font-medium">
          {[
            { id: 'general', label: 'General Organization', icon: Settings },
            { id: 'defaults', label: 'Assessment Defaults', icon: Shield },
            { id: 'scope', label: 'Scope Policies', icon: Lock },
            { id: 'terminal', label: 'Terminal Simulator', icon: Terminal },
            { id: 'branding', label: 'Report Deliverables', icon: FileText },
            { id: 'notifications', label: 'Alert Feeds', icon: Bell },
            { id: 'security', label: 'KMS & Engine Security', icon: Database },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#E32936] text-white font-semibold shadow-xs'
                    : 'text-[#64748B] hover:bg-[#EDF2F7] hover:text-[#172033]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 p-6 space-y-5 text-xs">
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-[#64748B] font-medium mb-1">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white text-[#172033] outline-hidden focus:border-[#E32936]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">Security Lead Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white text-[#172033] outline-hidden focus:border-[#E32936]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">Theme & Color Identity</label>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center justify-between">
                  <span>PHANTOM EYE Clean Light Mode (#F5F7FA / #E32936)</span>
                  <span className="px-2 py-0.5 rounded bg-[#FEF2F2] border border-[#FEE2E2] text-[#E32936] font-bold text-[10px]">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'defaults' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-[#64748B] font-medium mb-1">Default HTTP Request Timeout (seconds)</label>
                <input
                  type="number"
                  value={defaultTimeout}
                  onChange={(e) => setDefaultTimeout(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white text-[#172033] outline-hidden focus:border-[#E32936]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">Default Request Rate Limit (req/sec)</label>
                <input
                  type="number"
                  value={defaultRateLimit}
                  onChange={(e) => setDefaultRateLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white text-[#172033] outline-hidden focus:border-[#E32936]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-medium mb-1">Default Assessment Profile</label>
                <select
                  value={defaultProfile}
                  onChange={(e) => setDefaultProfile(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white text-[#172033] outline-hidden focus:border-[#E32936]"
                >
                  <option value="Passive OSINT">Passive OSINT</option>
                  <option value="Low Impact">Low Impact</option>
                  <option value="Standard Authorized">Standard Authorized</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'scope' && (
            <div className="space-y-4 max-w-xl">
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
                <span className="font-bold text-[#172033] block">Pre-flight Scope Enforcement</span>
                <p className="text-[#64748B] leading-relaxed">
                  Automatic exclusion filters block scanning on payment gateways, banking subnets, and critical health services.
                </p>
                <div className="p-2.5 bg-[#101827] rounded border border-[#1E293B] text-[11px] text-[#FCA5A5] font-mono">
                  DEFAULT_EXCLUSIONS = [&apos;payment.*&apos;, &apos;checkout.*&apos;, &apos;vault-prod.*&apos;]
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-[#64748B] font-medium mb-1">Terminal Font Size</label>
                <select
                  value={terminalFontSize}
                  onChange={(e) => setTerminalFontSize(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white text-[#172033] outline-hidden focus:border-[#E32936]"
                >
                  <option value="11px">11px (High Density)</option>
                  <option value="12px">12px (Standard)</option>
                  <option value="14px">14px (Comfortable)</option>
                </select>
              </div>

              <div className="p-3 bg-[#101827] rounded-lg border border-[#1E293B] font-mono text-[11px] text-[#34D399]">
                kali@phantom-eye:~$ phantom-eye example.com --font-size {terminalFontSize}
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-[#64748B] font-medium mb-1">Report Footer Disclaimer</label>
                <textarea
                  rows={3}
                  value={reportFooter}
                  onChange={(e) => setReportFooter(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white text-[#172033] font-mono text-xs outline-hidden focus:border-[#E32936]"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-3 max-w-xl">
              <label className="flex items-center gap-2 text-xs text-[#64748B] cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#E32936] rounded" />
                <span className="text-[#172033]">Notify analyst upon Critical severity finding discovery</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#64748B] cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#E32936] rounded" />
                <span className="text-[#172033]">Email executive summary upon assessment completion</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#64748B] cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#E32936] rounded" />
                <span className="text-[#172033]">Log audit event when reports are downloaded</span>
              </label>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 max-w-xl">
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
                <span className="font-bold text-[#172033] block">KMS Secret Vault & Cryptography</span>
                <p className="text-[#64748B] leading-relaxed">
                  All evidence hashes are computed via SHA-256 digests. Client session tokens expire in 12 hours.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                    FIPS 140-2 Validated
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-[#CBD5E1] text-[#64748B]">
                    TLS 1.3 Strict
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
