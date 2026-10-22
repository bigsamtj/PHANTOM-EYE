import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  Terminal,
  X,
} from 'lucide-react';
import { useApp } from '../services/store';
import { ScanJob } from '../types';

interface ScanHistoryPageProps {
  navigate: (route: string) => void;
}

export const ScanHistoryPage: React.FC<ScanHistoryPageProps> = () => {
  const { jobs, downloadDataFile } = useApp();

  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<ScanJob | null>(null);

  const filtered = jobs.filter((j) => {
    return (
      j.id.toLowerCase().includes(search.toLowerCase()) ||
      j.target.toLowerCase().includes(search.toLowerCase()) ||
      j.module.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-12 relative text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <History className="w-5 h-5 text-[#E32936]" />
            Scan Job History & Raw Output
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Complete archive of background module execution, stdout streams, exit codes, and durations.
          </p>
        </div>

        <button
          onClick={() =>
            downloadDataFile(
              `phantom_eye_job_history_${Date.now()}.json`,
              JSON.stringify(jobs, null, 2),
              'application/json'
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#172033] text-xs font-semibold rounded-lg border border-[#CBD5E1] transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export Job Logs
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search job ID, module, target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#172033] placeholder-[#94A3B8] outline-hidden focus:border-[#E32936] focus:bg-white transition-colors"
          />
        </div>
        <span className="text-xs font-mono text-[#64748B]">{filtered.length} Archived Jobs</span>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Job ID</th>
                <th className="py-3 px-4">Module Name</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Exit Code</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Output Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#64748B]">
                    No scan jobs executed yet. Launch an assessment to record live scanning jobs.
                  </td>
                </tr>
              ) :
                filtered.map((j) => (
                <tr key={j.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#E32936]">{j.id}</td>
                  <td className="py-3 px-4 font-bold text-[#172033]">{j.module}</td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">{j.target}</td>
                  <td className="py-3 px-4 font-mono text-[#059669]">
                    {j.status === 'Completed' ? '0 (SUCCESS)' : 'N/A'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">{j.duration || '0m 45s'}</td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">{j.outputSize}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        j.status === 'Completed'
                          ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                          : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                      }`}
                    >
                      {j.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedJob(j)}
                      className="px-2.5 py-1 text-xs font-semibold bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#172033] rounded transition-colors"
                    >
                      View Output
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stdout Transcript Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-[#172033]">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#E32936]" />
                <span className="font-mono text-xs font-bold text-[#172033]">
                  {selectedJob.id} // {selectedJob.module}
                </span>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-[#94A3B8] hover:text-[#172033]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-[#101827]">
              <pre className="text-[#34D399] whitespace-pre-wrap leading-relaxed">
                {selectedJob.stdout}
              </pre>
            </div>

            <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-1 text-xs font-semibold bg-white border border-[#CBD5E1] text-[#172033] rounded hover:bg-[#E2E8F0]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
