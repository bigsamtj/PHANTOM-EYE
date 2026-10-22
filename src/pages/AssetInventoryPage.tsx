import React, { useState } from 'react';
import {
  Server,
  Search,
  Filter,
  X,
  Code2,
} from 'lucide-react';
import { useApp } from '../services/store';
import { Asset } from '../types';
import { PhaseScriptModal } from '../components/common/PhaseScriptModal';

interface AssetInventoryPageProps {
  navigate: (route: string) => void;
}

export const AssetInventoryPage: React.FC<AssetInventoryPageProps> = () => {
  const { assets } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [scopeFilter, setScopeFilter] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [scriptModalOpen, setScriptModalOpen] = useState(false);

  const filtered = assets.filter((ast) => {
    const matchesSearch =
      ast.name.toLowerCase().includes(search.toLowerCase()) ||
      (ast.ipAddress && ast.ipAddress.includes(search)) ||
      ast.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || ast.type === typeFilter;
    const matchesScope = scopeFilter === 'All' || ast.scopeStatus === scopeFilter;
    return matchesSearch && matchesType && matchesScope;
  });

  return (
    <div className="space-y-6 pb-12 relative text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <Server className="w-5 h-5 text-[#E32936]" />
            Discovered Asset Inventory
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Complete inventory of authorized perimeter assets, web applications, IP addresses, and services.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScriptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#172033] border border-[#CBD5E1] hover:border-[#E32936] text-xs font-mono rounded-lg transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-[#E32936]" /> Phase 3 Script .py
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#059669] font-bold rounded-lg border border-[#A7F3D0]">
              {assets.filter((a) => a.scopeStatus === 'In Scope').length} In Scope
            </span>
            <span className="px-2.5 py-1 bg-[#FEF2F2] text-[#DC2626] font-bold rounded-lg border border-[#FEE2E2]">
              {assets.filter((a) => a.scopeStatus === 'Out of Scope').length} Excluded
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search asset hostname, IP, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#172033] placeholder-[#94A3B8] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-[#64748B]">
            <Filter className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#172033] outline-hidden font-medium"
            >
              <option value="All">All Types</option>
              <option value="Domain">Domain</option>
              <option value="Subdomain">Subdomain</option>
              <option value="IP Address">IP Address</option>
              <option value="Web Application">Web Application</option>
              <option value="API Endpoint">API Endpoint</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-[#64748B]">
            <span>Scope Status:</span>
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#172033] outline-hidden font-medium"
            >
              <option value="All">All Scopes</option>
              <option value="In Scope">In Scope</option>
              <option value="Out of Scope">Out of Scope</option>
              <option value="Needs Review">Needs Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Asset ID</th>
                <th className="py-3 px-4">Hostname / Target</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Scope Status</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Open Findings</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-xs text-[#64748B]">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#E32936] flex items-center justify-center mx-auto">
                        <Server className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-[#0F172A] text-sm">Asset Inventory Empty</div>
                      <p className="text-[11px] text-[#64748B]">
                        No assets cataloged yet. Run reconnaissance on an authorized target to enumerate apex domains, subdomains, and host IPs.
                      </p>
                    </div>
                  </td>
                </tr>
              ) :
                filtered.map((ast) => (
                <tr key={ast.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#E32936]">{ast.id}</td>
                  <td
                    className="py-3 px-4 font-bold text-[#172033] hover:text-[#E32936] cursor-pointer"
                    onClick={() => setSelectedAsset(ast)}
                  >
                    {ast.name}
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">{ast.type}</td>
                  <td className="py-3 px-4 font-mono text-[#172033]">{ast.ipAddress || 'Unassigned'}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                        ast.scopeStatus === 'In Scope'
                          ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                          : ast.scopeStatus === 'Out of Scope'
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                          : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                      }`}
                    >
                      {ast.scopeStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">{ast.source}</td>
                  <td className="py-3 px-4 font-bold text-[#172033]">
                    {ast.relatedFindingsCount > 0 ? (
                      <span className="text-[#DC2626]">{ast.relatedFindingsCount} Issues</span>
                    ) : (
                      <span className="text-[#059669]">Clean</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedAsset(ast)}
                      className="px-2.5 py-1 text-[11px] font-medium text-[#172033] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded transition-colors"
                    >
                      Inspect Asset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Detail Drawer */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl border-l border-[#E2E8F0] flex flex-col animate-in slide-in-from-right duration-150 text-[#172033]">
            {/* Header */}
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#E32936]">{selectedAsset.id}</span>
                <span className="font-bold text-[#172033]">{selectedAsset.name}</span>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 text-[#94A3B8] hover:text-[#172033]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-mono">
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Asset Type:</span>
                  <span className="text-[#172033]">{selectedAsset.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">IP Address:</span>
                  <span className="text-[#172033]">{selectedAsset.ipAddress || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Scope Status:</span>
                  <span className="text-[#059669] font-bold">{selectedAsset.scopeStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Source:</span>
                  <span className="text-[#172033]">{selectedAsset.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">First Observed:</span>
                  <span className="text-[#172033]">{selectedAsset.firstSeen}</span>
                </div>
              </div>

              {selectedAsset.technologies && selectedAsset.technologies.length > 0 && (
                <div>
                  <span className="font-bold text-[#172033] block mb-1 font-sans">Technology Fingerprints</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAsset.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[11px] text-[#475569]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAsset.notes && (
                <div>
                  <span className="font-bold text-[#172033] block mb-1 font-sans">Analyst Notes</span>
                  <p className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[#64748B] font-sans leading-relaxed">
                    {selectedAsset.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-1.5 bg-white hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#172033] rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 3 Script Modal */}
      <PhaseScriptModal
        phaseNum={scriptModalOpen ? '03' : null}
        onClose={() => setScriptModalOpen(false)}
        targetDomain="example.com"
      />
    </div>
  );
};
