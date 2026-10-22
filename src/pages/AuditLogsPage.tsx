import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import { useApp } from '../services/store';

interface AuditLogsPageProps {
  navigate: (route: string) => void;
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = () => {
  const { auditLogs, downloadDataFile } = useApp();

  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('All');

  const filtered = auditLogs.filter((a) => {
    const matchesSearch =
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.actor.toLowerCase().includes(search.toLowerCase()) ||
      a.resource.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchesRes = resultFilter === 'All' || a.result === resultFilter;
    return matchesSearch && matchesRes;
  });

  return (
    <div className="space-y-6 pb-12 relative text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-[#E32936]" />
            Security Audit Trail & Governance Logs
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Tamper-evident audit log of assessment lifecycle actions, authorization reviews, and sensitive exports.
          </p>
        </div>

        <button
          onClick={() =>
            downloadDataFile(
              `phantom_eye_audit_trail_${Date.now()}.json`,
              JSON.stringify(auditLogs, null, 2),
              'application/json'
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#172033] text-xs font-semibold rounded-lg border border-[#CBD5E1] transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export Audit Log
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, actor, resource, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#172033] placeholder-[#94A3B8] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-[#64748B]">
          <Filter className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Result:</span>
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#172033] outline-hidden font-medium"
          >
            <option value="All">All Results</option>
            <option value="Success">Success Only</option>
            <option value="Denied">Denied / Policy Violations</option>
            <option value="Failure">Failures</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold font-sans border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Correlation ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 text-[#E32936] font-bold">{log.id}</td>
                  <td className="py-3 px-4 text-[#64748B]">{log.timestamp.replace('T', ' ').slice(0, 19)}</td>
                  <td className="py-3 px-4 font-sans font-bold text-[#172033]">{log.actor}</td>
                  <td className="py-3 px-4 font-sans text-[#172033]">{log.action}</td>
                  <td className="py-3 px-4 text-[#64748B]">{log.resource}</td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.result === 'Success'
                          ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                          : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                      }`}
                    >
                      {log.result}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#94A3B8]">{log.correlationId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
