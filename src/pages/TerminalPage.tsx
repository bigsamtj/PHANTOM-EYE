import React from 'react';
import { Terminal, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { TerminalSimulator } from '../components/terminal/TerminalSimulator';

interface TerminalPageProps {
  navigate: (route: string) => void;
}

export const TerminalPage: React.FC<TerminalPageProps> = ({ navigate }) => {
  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#E32936]" />
              Phantom Eye Security Terminal
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1E293B] text-[#34D399] rounded">
              KALI SIMULATION
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Simulated CLI environment for authorized penetration testers and forensics analysts. All commands run in demonstrative safe mode.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/help')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#172033] bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#64748B]" /> Command Reference
          </button>
        </div>
      </div>

      {/* Terminal Simulator Component */}
      <TerminalSimulator initialTarget="bigsam.com" initialAssessmentId="ASM-BIGSAM" isEmbedded={false} />
    </div>
  );
};
