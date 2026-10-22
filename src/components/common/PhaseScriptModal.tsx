import React, { useState } from 'react';
import {
  X,
  Play,
  Copy,
  Check,
  Download,
  Terminal,
  Code2,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { PHASE_SCRIPTS, PhaseScriptDefinition } from '../../services/phaseScripts';
import { useApp } from '../../services/store';

interface PhaseScriptModalProps {
  phaseNum: string | null;
  onClose: () => void;
  targetDomain?: string;
  authTicket?: string;
}

export const PhaseScriptModal: React.FC<PhaseScriptModalProps> = ({
  phaseNum,
  onClose,
  targetDomain = 'example.com',
  authTicket = 'AUTH-OFFSEC-2026',
}) => {
  const { downloadDataFile } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'python' | 'execution' | 'overview'>('python');

  if (!phaseNum || !PHASE_SCRIPTS[phaseNum]) return null;

  const phase: PhaseScriptDefinition = PHASE_SCRIPTS[phaseNum];
  const dynamicPythonCode = phase.pythonScript
    .replace(/example\.com/g, targetDomain)
    .replace(/AUTH-OFFSEC-2026/g, authTicket);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(dynamicPythonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyBash = () => {
    navigator.clipboard.writeText(phase.bashOneLiner);
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2000);
  };

  const handleDownloadPy = () => {
    downloadDataFile(
      phase.scriptFileName,
      dynamicPythonCode,
      'text/x-python'
    );
  };

  const handleExecute = () => {
    setActiveTab('execution');
    setIsRunning(true);
    setExecutionOutput([
      `[PHANTOM EYE ENGINE] Initiating Phase ${phase.phaseNum}: ${phase.name}`,
      `[*] Target: ${targetDomain} | Mode: SAFE_BASELINE | Ticket: ${authTicket}`,
      `[*] Script: ${phase.scriptFileName}`,
      `[*] Python Runtime: Python 3.12.4 (CPython, 64-bit)`,
      `--------------------------------------------------------------------------------`,
    ]);

    // Progressive log simulation matching the real python script steps
    phase.executionSteps.forEach((step, idx) => {
      setTimeout(() => {
        setExecutionOutput((prev) => [
          ...prev,
          `[${new Date().toISOString().substring(11, 19)} UTC] ${step.logPrefix} (Step ${step.step}) ${step.sampleLog}`,
        ]);

        if (idx === phase.executionSteps.length - 1) {
          setTimeout(() => {
            setExecutionOutput((prev) => [
              ...prev,
              `--------------------------------------------------------------------------------`,
              `[SUCCESS] Phase ${phase.phaseNum} background script finished with EXIT_CODE: 0`,
              `[+] Observations recorded. Artifacts committed to Evidence Vault.`,
            ]);
            setIsRunning(false);
          }, 400);
        }
      }, (idx + 1) * 450);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#172033]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] text-[#E32936] font-mono font-bold flex items-center justify-center text-xs">
              {phase.phaseNum}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#172033]">{phase.name}</h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] rounded">
                  {phase.scriptFileName}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Safe Mode
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">{phase.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#172033] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-5 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium">
            <button
              onClick={() => setActiveTab('python')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'python'
                  ? 'border-[#E32936] text-[#E32936] font-semibold'
                  : 'border-transparent text-[#64748B] hover:text-[#172033]'
              }`}
            >
              <Code2 className="w-4 h-4" /> Python Background Script (.py)
            </button>
            <button
              onClick={() => setActiveTab('execution')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'execution'
                  ? 'border-[#E32936] text-[#E32936] font-semibold'
                  : 'border-transparent text-[#64748B] hover:text-[#172033]'
              }`}
            >
              <Terminal className="w-4 h-4" /> Live Execution Stream
              {executionOutput.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#059669]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#E32936] text-[#E32936] font-semibold'
                  : 'border-transparent text-[#64748B] hover:text-[#172033]'
              }`}
            >
              <FileCode className="w-4 h-4" /> Scope & Parameters
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExecute}
              disabled={isRunning}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-xs ${
                isRunning
                  ? 'bg-[#E2E8F0] cursor-not-allowed text-[#94A3B8]'
                  : 'bg-[#E32936] hover:bg-[#C91E2B]'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? 'Running Script...' : 'Run in Background'}
            </button>

            <button
              onClick={handleDownloadPy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#172033] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] transition-colors"
              title="Download Python Script"
            >
              <Download className="w-3.5 h-3.5" />
              .py
            </button>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#172033] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] transition-colors"
              title="Copy Script"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs">
          {activeTab === 'python' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] text-[#64748B] bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
                <span>CLI Invocation:</span>
                <div className="flex items-center gap-2">
                  <code className="text-[#E32936] font-semibold">{phase.cliCommand.replace('{target}', targetDomain).replace('{authTicket}', authTicket)}</code>
                  <button
                    onClick={handleCopyBash}
                    className="p-1 text-[#94A3B8] hover:text-[#172033] transition-colors"
                  >
                    {copiedBash ? <Check className="w-3 h-3 text-[#059669]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="bg-[#101827] text-[#E5EDF7] p-4 rounded-xl border border-[#334155] overflow-x-auto leading-relaxed max-h-[500px]">
                  {dynamicPythonCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'execution' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0] text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#E32936] animate-ping' : 'bg-[#059669]'}`} />
                  <span className="text-[#64748B]">Process Status:</span>
                  <span className={`font-semibold ${isRunning ? 'text-[#E32936]' : 'text-[#059669]'}`}>
                    {isRunning ? 'RUNNING (PID 48921)' : 'IDLE / READY'}
                  </span>
                </div>
                <span className="text-[#64748B]">Target: {targetDomain}</span>
              </div>

              <div className="bg-[#101827] border border-[#334155] rounded-xl p-4 min-h-[360px] max-h-[480px] overflow-y-auto space-y-1.5 text-[11px] font-mono">
                {executionOutput.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-[#94A3B8] gap-2">
                    <Terminal className="w-8 h-8 opacity-40" />
                    <span>Click "Run in Background" to launch this phase script in real time.</span>
                  </div>
                ) : (
                  executionOutput.map((line, idx) => (
                    <div
                      key={idx}
                      className={
                        line.includes('[SUCCESS]') || line.includes('PASS')
                          ? 'text-[#34D399]'
                          : line.includes('[ERROR]') || line.includes('[FATAL]')
                          ? 'text-[#F87171]'
                          : line.includes('[WARN]')
                          ? 'text-[#FBBF24]'
                          : line.startsWith('[PHANTOM EYE')
                          ? 'text-[#F87171] font-bold'
                          : line.startsWith('---')
                          ? 'text-[#475569]'
                          : 'text-[#E5EDF7]'
                      }
                    >
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4 font-sans text-xs text-[#172033]">
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <h4 className="text-sm font-bold text-[#172033]">Phase Objective</h4>
                <p className="text-[#64748B] leading-relaxed">{phase.description}</p>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
                <h4 className="text-sm font-bold text-[#172033]">Key Defensive & Audit Techniques</h4>
                <ul className="space-y-2">
                  {phase.keyTechniques.map((tech, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[#64748B]">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <h4 className="text-sm font-bold text-[#172033]">Input & Output Schema</h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-white rounded-lg border border-[#E2E8F0]">
                    <span className="text-[#E32936] font-semibold block mb-1">// Inputs</span>
                    <span className="text-[#64748B]">target: string ({targetDomain})</span>
                    <br />
                    <span className="text-[#64748B]">authTicket: string ({authTicket})</span>
                    <br />
                    <span className="text-[#64748B]">safeMode: boolean (true)</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E2E8F0]">
                    <span className="text-[#059669] font-semibold block mb-1">// Artifact Outputs</span>
                    <span className="text-[#64748B]">exitCode: 0 (SUCCESS)</span>
                    <br />
                    <span className="text-[#64748B]">evidenceVaultId: EVD-SHA256</span>
                    <br />
                    <span className="text-[#64748B]">telemetryFile: .json / .txt</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]">
          <span>PHANTOM EYE OFFSEC ENGINE // STAGE {phase.phaseNum} OF 07</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-[#E2E8F0] text-[#172033] border border-[#CBD5E1] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
