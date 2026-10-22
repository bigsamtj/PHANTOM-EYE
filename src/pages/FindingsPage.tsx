import React, { useState } from 'react';
import {
  Bug,
  Filter,
  Search,
  X,
  Code2,
} from 'lucide-react';
import { useApp } from '../services/store';
import { Finding, FindingStatus } from '../types';
import { PhaseScriptModal } from '../components/common/PhaseScriptModal';

interface FindingsPageProps {
  navigate: (route: string) => void;
}

export const FindingsPage: React.FC<FindingsPageProps> = () => {
  const { findings, updateFindingStatus } = useApp();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [newStatus, setNewStatus] = useState<FindingStatus>('Open');
  const [analystNote, setAnalystNote] = useState('');
  const [scriptModalOpen, setScriptModalOpen] = useState(false);

  const filtered = findings.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.targetAsset.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase());
    const matchesSev = severityFilter === 'All' || f.severity === severityFilter;
    const matchesStat = statusFilter === 'All' || f.status === statusFilter;
    return matchesSearch && matchesSev && matchesStat;
  });

  const handleOpenDrawer = (f: Finding) => {
    setSelectedFinding(f);
    setNewStatus(f.status);
    setAnalystNote('');
  };

  const handleSaveStatus = () => {
    if (selectedFinding) {
      updateFindingStatus(selectedFinding.id, newStatus, analystNote || undefined);
      setSelectedFinding({
        ...selectedFinding,
        status: newStatus,
        reproductionNotes: analystNote
          ? `${selectedFinding.reproductionNotes}\n[Analyst Note]: ${analystNote}`
          : selectedFinding.reproductionNotes,
      });
      setAnalystNote('');
    }
  };

  return (
    <div className="space-y-6 pb-12 relative text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <Bug className="w-5 h-5 text-[#E32936]" />
            Security Findings & Vulnerability Validation
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Review, triage, and validate prioritized security findings across discovered assets with CVSS v3.1 calculation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScriptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#172033] border border-[#CBD5E1] hover:border-[#E32936] text-xs font-mono rounded-lg transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-[#E32936]" /> Phase 5 Script .py
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-[#FEF2F2] text-[#DC2626] font-bold rounded-lg border border-[#FEE2E2]">
              {findings.filter((f) => f.severity === 'Critical').length} Critical
            </span>
            <span className="px-2.5 py-1 bg-[#FEF2F2] text-[#E32936] font-bold rounded-lg border border-[#FEE2E2]">
              {findings.filter((f) => f.severity === 'High').length} High
            </span>
            <span className="px-2.5 py-1 bg-[#FEF3C7] text-[#D97706] font-bold rounded-lg border border-[#FDE68A]">
              {findings.filter((f) => f.severity === 'Medium').length} Medium
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search finding title, asset, CVE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#172033] placeholder-[#94A3B8] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5 text-[#64748B]">
            <Filter className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#172033] outline-hidden font-medium"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Informational">Informational</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-[#64748B]">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#172033] outline-hidden font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Under Review">Under Review</option>
              <option value="Confirmed">Confirmed</option>
              <option value="False Positive">False Positive</option>
              <option value="Accepted Risk">Accepted Risk</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Finding ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Target Asset</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Analyst</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-xs text-[#64748B]">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#E32936] flex items-center justify-center mx-auto">
                        <Bug className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-[#0F172A] text-sm">No Security Observations Detected</div>
                      <p className="text-[11px] text-[#64748B]">
                        Zero findings recorded in current state. Launch an active assessment to surface security vulnerabilities and CVSS vectors.
                      </p>
                    </div>
                  </td>
                </tr>
              ) :
                filtered.map((f) => (
                <tr key={f.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#E32936]">{f.id}</td>
                  <td
                    className="py-3 px-4 font-bold text-[#172033] hover:text-[#E32936] cursor-pointer"
                    onClick={() => handleOpenDrawer(f)}
                  >
                    {f.title}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        f.severity === 'Critical'
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                          : f.severity === 'High'
                          ? 'bg-[#FEF2F2] text-[#E32936] border border-[#FEE2E2]'
                          : f.severity === 'Medium'
                          ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                          : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                      }`}
                    >
                      {f.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">{f.targetAsset}</td>
                  <td className="py-3 px-4 text-[#64748B]">{f.category}</td>
                  <td className="py-3 px-4 font-medium text-[#172033]">{f.confidence}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F1F5F9] border border-[#CBD5E1] text-[#172033]">
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">{f.assignedAnalyst}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenDrawer(f)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#E32936] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FEE2E2] rounded transition-colors"
                    >
                      Details & Triage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Finding Detail Slide-over Drawer */}
      {selectedFinding && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl border-l border-[#E2E8F0] flex flex-col animate-in slide-in-from-right duration-150 text-[#172033]">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-white border border-[#CBD5E1] text-[#64748B] px-2 py-0.5 rounded">
                  {selectedFinding.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedFinding.severity === 'Critical'
                      ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                      : 'bg-[#FEF2F2] text-[#E32936] border border-[#FEE2E2]'
                  }`}
                >
                  {selectedFinding.severity}
                </span>
                <span className="text-[10px] bg-[#ECFDF5] text-[#059669] font-semibold px-2 py-0.5 rounded border border-[#A7F3D0]">
                  CVSS {selectedFinding.cvssScore || 'N/A'}
                </span>
              </div>
              <button
                onClick={() => setSelectedFinding(null)}
                className="p-1 text-[#94A3B8] hover:text-[#172033]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              <div>
                <h2 className="text-base font-bold text-[#172033] leading-snug">
                  {selectedFinding.title}
                </h2>
                <div className="text-[11px] text-[#64748B] font-mono mt-1">
                  Target: <strong className="text-[#172033]">{selectedFinding.targetAsset}</strong> • Category: {selectedFinding.category}
                </div>
              </div>

              {/* Status Triage Form */}
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
                <span className="font-bold text-[#172033] block">Triage & Analyst Review</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#64748B] mb-1">Update Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-[#CBD5E1] rounded bg-white text-[#172033]"
                    >
                      <option value="Open">Open</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="False Positive">False Positive</option>
                      <option value="Accepted Risk">Accepted Risk</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#64748B] mb-1">Assigned Analyst</label>
                    <div className="px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-[#64748B]">
                      {selectedFinding.assignedAnalyst}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#64748B] mb-1">Add Analyst Annotation / Proof</label>
                  <textarea
                    rows={2}
                    value={analystNote}
                    onChange={(e) => setAnalystNote(e.target.value)}
                    placeholder="Enter observation notes or reason for status change..."
                    className="w-full px-2.5 py-1.5 border border-[#CBD5E1] rounded bg-white text-[#172033] placeholder-[#94A3B8] outline-hidden"
                  />
                </div>

                <button
                  onClick={handleSaveStatus}
                  className="px-3 py-1.5 bg-[#E32936] hover:bg-[#C91E2B] text-white font-semibold rounded text-xs transition-colors"
                >
                  Save Triage Decision
                </button>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-[#172033] mb-1">Description</h4>
                <p className="text-[#64748B] leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                  {selectedFinding.description}
                </p>
              </div>

              {/* Impact */}
              <div>
                <h4 className="font-bold text-[#172033] mb-1">Technical Impact</h4>
                <p className="text-[#64748B] leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                  {selectedFinding.impact}
                </p>
              </div>

              {/* Remediation */}
              <div>
                <h4 className="font-bold text-[#059669] mb-1">Prescriptive Remediation</h4>
                <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-3 rounded-lg text-[#065F46] space-y-1">
                  <p>{selectedFinding.remediation}</p>
                </div>
              </div>

              {/* CVSS v3.1 Vector */}
              {selectedFinding.cvssVector && (
                <div>
                  <h4 className="font-bold text-[#172033] mb-1">CVSS v3.1 Vector</h4>
                  <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg font-mono text-[11px] text-[#E32936] break-all">
                    {selectedFinding.cvssVector}
                  </div>
                </div>
              )}

              {/* Evidence References */}
              <div>
                <h4 className="font-bold text-[#172033] mb-1">Evidence Artifact References</h4>
                <div className="space-y-1.5">
                  {selectedFinding.evidenceIds.map((eid) => (
                    <div key={eid} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[#E32936]">{eid}</span>
                      <span className="text-[#64748B]">SHA-256 Verified in Vault</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 5 Script Modal */}
      <PhaseScriptModal
        phaseNum={scriptModalOpen ? '05' : null}
        onClose={() => setScriptModalOpen(false)}
        targetDomain="example.com"
      />
    </div>
  );
};
