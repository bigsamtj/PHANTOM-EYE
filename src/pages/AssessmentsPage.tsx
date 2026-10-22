import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  PlusCircle,
  Download,
} from 'lucide-react';
import { useApp } from '../services/store';

interface AssessmentsPageProps {
  navigate: (route: string) => void;
}

export const AssessmentsPage: React.FC<AssessmentsPageProps> = ({ navigate }) => {
  const { assessments, downloadDataFile } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = assessments.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.targetDomain.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesType = typeFilter === 'All' || a.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((a) => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkExport = () => {
    const exportData = assessments.filter((a) => selectedIds.includes(a.id));
    downloadDataFile(
      `phantom_eye_assessments_export_${Date.now()}.json`,
      JSON.stringify(exportData, null, 2),
      'application/json'
    );
  };

  return (
    <div className="space-y-6 pb-12 text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#E32936]" />
            Security Assessments
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage target assessments, review authorization envelopes, and access workspaces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkExport}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#172033] bg-[#F8FAFC] hover:bg-[#E2E8F0] rounded-lg transition-colors border border-[#CBD5E1]"
            >
              <Download className="w-3.5 h-3.5" /> Export Selected ({selectedIds.length})
            </button>
          )}

          <button
            onClick={() => navigate('/assessments/new')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#E32936] hover:bg-[#C91E2B] rounded-lg shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4" /> New Assessment
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-80">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search assessment name, target, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Filter className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#172033] outline-hidden font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Ready">Ready</option>
              <option value="Running">Running</option>
              <option value="Completed">Completed</option>
              <option value="Paused">Paused</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#172033] outline-hidden font-medium"
            >
              <option value="All">All Types</option>
              <option value="External Attack Surface Assessment">External Attack Surface</option>
              <option value="Passive Reconnaissance">Passive Reconnaissance</option>
              <option value="API Security Assessment">API Security Assessment</option>
              <option value="Web Security Baseline">Web Security Baseline</option>
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
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 text-[#E32936] rounded border-[#CBD5E1]"
                  />
                </th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Assessment Name</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Discovered Assets</th>
                <th className="py-3 px-4">Analyst</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-14 text-center text-xs text-[#64748B]">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#E32936] flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-[#0F172A] text-sm">No Assessments Found</div>
                      <p className="text-[11px] text-[#64748B]">
                        Workspace is currently in clean blank state. Administrator BIG SAM can configure a new target scope to start scanning.
                      </p>
                      <button
                        onClick={() => navigate('/assessments/new')}
                        className="px-4 py-2 bg-[#E32936] hover:bg-[#C91E2B] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                      >
                        Create New Assessment
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(a.id)}
                        onChange={() => toggleSelect(a.id)}
                        className="w-3.5 h-3.5 text-[#E32936] rounded border-[#CBD5E1]"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-[#172033]">{a.id}</td>
                    <td
                      className="py-3 px-4 font-bold text-[#172033] hover:text-[#E32936] cursor-pointer"
                      onClick={() => navigate(`/assessments/${a.id}`)}
                    >
                      {a.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#64748B]">{a.targetDomain}</td>
                    <td className="py-3 px-4 text-[#64748B]">{a.type}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
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
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#E32936] h-1.5 rounded-full"
                            style={{ width: `${a.progress}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-[10px] text-[#64748B]">{a.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#172033]">{a.discoveredAssetsCount}</td>
                    <td className="py-3 px-4 text-[#64748B]">{a.assignedAnalyst}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/assessments/${a.id}`)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#E32936] bg-[#FEF2F2] hover:bg-[#FEE2E2] rounded-md transition-colors border border-[#FEE2E2]"
                      >
                        Open Workspace
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
