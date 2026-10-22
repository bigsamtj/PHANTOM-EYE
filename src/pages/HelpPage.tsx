import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Terminal,
  ChevronRight,
  ShieldAlert,
  Code2,
} from 'lucide-react';
import { PhaseScriptModal } from '../components/common/PhaseScriptModal';

interface HelpPageProps {
  navigate: (route: string) => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ navigate }) => {
  const [cmdSearch, setCmdSearch] = useState('');
  const [inspectingPhase, setInspectingPhase] = useState<string | null>(null);

  const commands = [
    { cmd: 'help', desc: 'Displays available CLI simulator commands and syntax.' },
    { cmd: 'clear', desc: 'Clears the current terminal scrollback buffer.' },
    { cmd: 'status', desc: 'Shows active assessment ID, target context, and safe mode state.' },
    { cmd: 'scope', desc: 'Prints authorized target apex, allowed subdomains, and rate limits.' },
    { cmd: 'tools', desc: 'Lists connected discovery and analysis engines.' },
    { cmd: 'history', desc: 'Lists recent command history executed in this terminal session.' },
    { cmd: 'reports', desc: 'Lists available downloadable report artifacts.' },
    { cmd: 'phantom-eye <domain>', desc: 'Runs complete simulated security assessment with progressive logs.' },
    { cmd: 'phantom-eye <domain> --phase <1-7>', desc: 'Executes a specific phase background Python script (1 through 7).' },
    { cmd: 'phantom-eye <domain> --passive', desc: 'Runs passive reconnaissance simulation only (DNS, WHOIS, CT).' },
    { cmd: 'phantom-eye <domain> --simulate', desc: 'Generates progressive synthetic vulnerability findings.' },
    { cmd: 'export txt', desc: 'Downloads session terminal logs as a TXT file.' },
    { cmd: 'export json', desc: 'Downloads structured terminal session events as a JSON file.' },
  ];

  const phaseScripts = [
    { phase: '01', name: 'Scope & Authorization Gate', file: '01_authorization_and_scope.py' },
    { phase: '02', name: 'Passive OSINT & DNS Enumeration', file: '02_passive_reconnaissance.py' },
    { phase: '03', name: 'Asset Catalog & IP Dedup', file: '03_asset_discovery.py' },
    { phase: '04', name: 'Safe Scanning & Security Headers', file: '04_scanning_enumeration.py' },
    { phase: '05', name: 'Finding Triage & CVSS v3.1', file: '05_finding_validation.py' },
    { phase: '06', name: 'Evidence Vault & SHA-256 Hashing', file: '06_evidence_vault.py' },
    { phase: '07', name: 'Multi-Format Report Compiler', file: '07_report_generator.py' },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.cmd.toLowerCase().includes(cmdSearch.toLowerCase()) ||
      c.desc.toLowerCase().includes(cmdSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 text-[#172033]">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#E32936]" />
            Documentation & Operator Handbook
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Operational reference for authorized security assessments, 7-phase Python scripts, and terminal syntax.
          </p>
        </div>

        <button
          onClick={() => navigate('/terminal')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E32936] hover:bg-[#C91D29] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Terminal className="w-3.5 h-3.5" /> Open Terminal
        </button>
      </div>

      {/* Mandatory Authorization Notice */}
      <div className="p-4 bg-[#FEF2F2] border-l-4 border-[#E32936] rounded-r-xl border-y border-r border-[#FEE2E2] space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-[#E32936]">
          <ShieldAlert className="w-4 h-4" />
          <span>AUTHORIZATION REQUIREMENT NOTICE</span>
        </div>
        <p className="text-xs text-[#64748B] leading-relaxed">
          PHANTOM EYE must only be executed against targets you own or have explicit, signed written authorization to assess.
          Non-authorized penetration testing or reconnaissance may violate computer crime statutes and regulatory mandates.
        </p>
      </div>

      {/* 7 Background Python Phase Scripts Overview */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#E32936]" />
          <span>Background Execution Phase Scripts</span>
        </h3>
        <p className="text-xs text-[#64748B]">
          Every assessment workflow phase executes a modular, auditable Python script that can run standalone in CLI or as a background task. Click any script to inspect the complete source code:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {phaseScripts.map((ps) => (
            <div
              key={ps.phase}
              onClick={() => setInspectingPhase(ps.phase)}
              className="p-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#E32936]/40 rounded-lg cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-[#E32936] block mb-1">
                  Phase {ps.phase}
                </span>
                <span className="text-xs font-bold text-[#172033] block">{ps.name}</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E2E8F0]">
                <span className="font-mono text-[10px] text-[#64748B] block truncate max-w-[150px]">
                  {ps.file}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Command Reference */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#E32936]" />
              Terminal Simulator Command Reference
            </h3>
            <p className="text-xs text-[#64748B]">Supported commands in the Kali Linux-style terminal simulator</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter commands..."
              value={cmdSearch}
              onChange={(e) => setCmdSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs border border-[#CBD5E1] rounded-lg bg-white text-[#172033] placeholder-[#94A3B8] outline-hidden focus:border-[#E32936]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCommands.map((c, i) => (
            <div key={i} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1">
              <div className="font-mono text-xs font-bold text-[#E32936]">{c.cmd}</div>
              <p className="text-xs text-[#64748B] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Script Inspector Modal */}
      <PhaseScriptModal
        phaseNum={inspectingPhase}
        onClose={() => setInspectingPhase(null)}
        targetDomain="example.com"
      />
    </div>
  );
};
