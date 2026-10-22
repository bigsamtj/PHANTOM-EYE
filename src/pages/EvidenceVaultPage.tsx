import React, { useState } from 'react';
import {
  FolderLock,
  Search,
  Filter,
  Copy,
  Check,
  PlusCircle,
  ShieldCheck,
  X,
  Code2,
} from 'lucide-react';
import { useApp } from '../services/store';
import { EvidenceItem } from '../types';
import { PhaseScriptModal } from '../components/common/PhaseScriptModal';

interface EvidenceVaultPageProps {
  navigate: (route: string) => void;
}

export const EvidenceVaultPage: React.FC<EvidenceVaultPageProps> = () => {
  const { evidence, downloadDataFile, addEvidence, assessments } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [scriptModalOpen, setScriptModalOpen] = useState(false);

  // New evidence form
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<EvidenceItem['type']>('HTTP Metadata');
  const [newContent, setNewContent] = useState('');
  const [newSource] = useState('Manual Analyst Capture');

  const filtered = evidence.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.sha256.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleCreateEvidence = () => {
    if (!newName.trim()) return;

    // Generate simulated SHA-256
    const simulatedSha = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    addEvidence({
      name: newName,
      type: newType,
      sourceModule: newSource,
      assessmentId: assessments[0]?.id || 'ASM-LIVE',
      sha256: simulatedSha,
      collectedBy: 'BIG SAM',
      contentPreview: newContent || 'Forensic capture transcript.',
      fileSizeBytes: newContent.length * 2 || 1024,
      executionMode: 'live',
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewContent('');
  };

  return (
    <div className="space-y-6 pb-12 relative text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-[#E32936]" />
            Evidence Vault & Chain of Custody
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Forensic artifacts, raw response captures, SHA-256 cryptographic hashes, and report evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScriptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#172033] border border-[#CBD5E1] hover:border-[#E32936] text-xs font-mono rounded-lg transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-[#E32936]" /> Phase 6 Script .py
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#E32936] hover:bg-[#C91E2B] rounded-lg shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add Evidence Item
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search evidence name, hash, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#172033] placeholder-[#94A3B8] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-[#64748B]">
          <Filter className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Category:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#172033] outline-hidden font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Screenshot">Screenshot</option>
            <option value="HTTP Metadata">HTTP Metadata</option>
            <option value="DNS Record">DNS Record</option>
            <option value="TLS Certificate">TLS Certificate</option>
            <option value="Scan Output">Scan Output</option>
            <option value="Log">Log</option>
          </select>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Evidence ID</th>
                <th className="py-3 px-4">Artifact Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Source Module</th>
                <th className="py-3 px-4">SHA-256 Digest</th>
                <th className="py-3 px-4">Collected UTC</th>
                <th className="py-3 px-4">Integrity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-xs text-[#64748B]">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#E32936] flex items-center justify-center mx-auto">
                        <FolderLock className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-[#0F172A] text-sm">Evidence Vault Empty</div>
                      <p className="text-[11px] text-[#64748B]">
                        Zero forensic artifacts archived yet. Launching an assessment will automatically log raw HTTP headers, DNS dumps, and calculate cryptographic SHA-256 digests.
                      </p>
                    </div>
                  </td>
                </tr>
              ) :
                filtered.map((e) => (
                <tr key={e.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#E32936]">{e.id}</td>
                  <td
                    className="py-3 px-4 font-semibold text-[#172033] hover:text-[#E32936] cursor-pointer"
                    onClick={() => setSelectedEvidence(e)}
                  >
                    {e.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]">
                      {e.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">{e.sourceModule}</td>
                  <td className="py-3 px-4 font-mono text-[10px] text-[#64748B]">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate max-w-[130px]">{e.sha256}</span>
                      <button
                        onClick={() => handleCopyHash(e.sha256)}
                        title="Copy SHA-256"
                        className="text-[#94A3B8] hover:text-[#172033]"
                      >
                        {copiedHash === e.sha256 ? (
                          <Check className="w-3 h-3 text-[#059669]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">{e.collectedAt.replace('T', ' ').slice(0, 19)}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-semibold text-[#059669] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {e.integrityStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedEvidence(e)}
                      className="px-2 py-1 text-[11px] font-medium text-[#172033] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded transition-colors"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() =>
                        downloadDataFile(
                          `${e.id}_${e.name.replace(/\s+/g, '_')}.txt`,
                          e.contentPreview || 'Evidence content buffer',
                          'text/plain'
                        )
                      }
                      className="px-2 py-1 text-[11px] font-medium text-[#E32936] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FEE2E2] rounded transition-colors"
                    >
                      Export
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Detail Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-[#172033]">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#E32936]">
                  {selectedEvidence.id}
                </span>
                <span className="text-xs font-bold text-[#172033]">{selectedEvidence.name}</span>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-[#94A3B8] hover:text-[#172033]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                <div>
                  <span className="text-[#64748B] block">Type:</span>
                  <span className="text-[#172033]">{selectedEvidence.type}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Source Module:</span>
                  <span className="text-[#172033]">{selectedEvidence.sourceModule}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Collected By:</span>
                  <span className="text-[#172033]">{selectedEvidence.collectedBy}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Integrity Status:</span>
                  <span className="text-[#059669] font-bold">{selectedEvidence.integrityStatus}</span>
                </div>
              </div>

              <div>
                <span className="text-[#64748B] block mb-1">SHA-256 Digest (Hex):</span>
                <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[#E32936] break-all">
                  {selectedEvidence.sha256}
                </div>
              </div>

              {selectedEvidence.contentPreview && (
                <div>
                  <span className="text-[#64748B] block mb-1">Raw Telemetry / Payload Capture:</span>
                  <pre className="p-3 bg-[#101827] text-[#34D399] rounded border border-[#334155] overflow-x-auto text-[11px] max-h-48 whitespace-pre-wrap">
                    {selectedEvidence.contentPreview}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => setSelectedEvidence(null)}
                className="px-4 py-1.5 bg-white hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#172033] rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-md p-5 space-y-4 shadow-2xl text-[#172033]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 bg-[#F8FAFC] -m-5 mb-0 p-4 rounded-t-xl">
              <h3 className="text-sm font-bold text-[#172033]">Capture Forensic Evidence</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#94A3B8] hover:text-[#172033]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs pt-3">
              <div>
                <label className="block text-[#64748B] mb-1">Artifact Name</label>
                <input
                  type="text"
                  placeholder="e.g., HTTP_Response_Headers_prod.txt"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded bg-white text-[#172033] outline-hidden focus:border-[#E32936]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] mb-1">Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded bg-white text-[#172033] outline-hidden focus:border-[#E32936]"
                >
                  <option value="HTTP Metadata">HTTP Metadata</option>
                  <option value="DNS Record">DNS Record</option>
                  <option value="TLS Certificate">TLS Certificate</option>
                  <option value="Screenshot">Screenshot</option>
                  <option value="Scan Output">Scan Output</option>
                  <option value="Log">Log</option>
                </select>
              </div>

              <div>
                <label className="block text-[#64748B] mb-1">Content / Raw Payload</label>
                <textarea
                  rows={4}
                  placeholder="Paste raw telemetry, header dump, or certificate PEM..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded bg-white text-[#172033] font-mono outline-hidden focus:border-[#E32936]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#172033]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvidence}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#E32936] hover:bg-[#C91E2B] rounded shadow-xs"
              >
                Compute Hash & Store
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 6 Script Modal */}
      <PhaseScriptModal
        phaseNum={scriptModalOpen ? '06' : null}
        onClose={() => setScriptModalOpen(false)}
        targetDomain="example.com"
      />
    </div>
  );
};
