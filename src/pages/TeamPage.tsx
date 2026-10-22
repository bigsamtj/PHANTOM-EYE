import React from 'react';
import {
  Users,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Key,
} from 'lucide-react';
import { useApp } from '../services/store';

interface TeamPageProps {
  navigate: (route: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = () => {
  const { assessments } = useApp();

  return (
    <div className="space-y-6 pb-12 relative text-[#0F172A]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E32936]" />
              Team Access &amp; Administrative Authority
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#FEF2F2] text-[#E32936] rounded-md border border-[#FEE2E2]">
              SINGLE-ADMIN ENFORCEMENT
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Access control register and authority validation for the security assessment platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Authority Status: Fully Authorized
          </span>
        </div>
      </div>

      {/* Single Administrator Mandate Banner */}
      <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center text-[#E32936] shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-black text-[#0F172A]">
            Designated Master Administrator: BIG SAM
          </h2>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Per the security mandate, <strong>BIG SAM</strong> is the <em>sole administrator</em> authorized to configure targets, approve scopes, execute assessments, and sign off on executive reports. All other access provisionings are locked under single-administrator policy until authorized refinement.
          </p>
        </div>
      </div>

      {/* Administrator Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <Key className="w-4 h-4 text-[#E32936]" />
            Authorized Master Administrator Register
          </h3>
          <span className="text-xs font-mono font-bold text-[#059669]">1 Active Operator</span>
        </div>

        <div className="p-6">
          <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E32936] text-white flex items-center justify-center font-black text-xl shadow-md shadow-[#E32936]/20 shrink-0">
                BS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-[#0F172A]">BIG SAM</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> ACTIVE
                  </span>
                </div>
                <div className="text-xs text-[#64748B] font-mono mt-0.5">bigsam@phantomeye.sec</div>
                <div className="text-[11px] text-[#E32936] font-bold mt-1">
                  Role: Sole Master Administrator &bull; Chief Security Commander
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1 text-xs">
              <div className="text-[11px] text-[#64748B]">Active Assessments Governed:</div>
              <div className="font-black text-lg text-[#0F172A]">{assessments.length} Active</div>
              <span className="text-[10px] text-[#059669] font-mono">Full Read/Write/Execute Authority</span>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#0F172A]">Administrative Rights &amp; Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            { perm: 'Launch Real-Time Penetration Scans', granted: true },
            { perm: 'Approve & Validate Target Scopes (RFC 1123)', granted: true },
            { perm: 'Triage & Validate Confirmed Vulnerabilities', granted: true },
            { perm: 'Generate & Sign Executive Security Deliverables', granted: true },
            { perm: 'Archive Forensic Cryptographic Evidence (SHA-256)', granted: true },
            { perm: 'Configure Telegram Bot Alert Dispatcher', granted: true },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-[#0F172A]">{item.perm}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                GRANTED
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
