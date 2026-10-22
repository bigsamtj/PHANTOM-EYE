import React, { useState, useEffect } from 'react';
import { Search, X, ShieldAlert, Server, Bug, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../../services/store';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (route: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, navigate }) => {
  const { assessments, assets, findings, reports } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingAssessments = assessments.filter(
    (a) => a.name.toLowerCase().includes(q) || a.targetDomain.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
  );

  const matchingAssets = assets.filter(
    (ast) => ast.name.toLowerCase().includes(q) || (ast.ipAddress && ast.ipAddress.includes(q))
  );

  const matchingFindings = findings.filter(
    (f) => f.title.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.id.toLowerCase().includes(q)
  );

  const matchingReports = reports.filter(
    (r) => r.name.toLowerCase().includes(q) || r.target.toLowerCase().includes(q)
  );

  const totalResults =
    matchingAssessments.length + matchingAssets.length + matchingFindings.length + matchingReports.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-[#172033]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3 bg-[#F8FAFC]">
          <Search className="w-5 h-5 text-[#E32936]" />
          <input
            autoFocus
            type="text"
            placeholder="Search targets, CVEs, findings, assets, and reports..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-hidden text-sm text-[#172033] placeholder-[#94A3B8]"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] hover:text-[#172033] hover:bg-[#E2E8F0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {q.length === 0 ? (
            <div className="text-center py-8 text-[#64748B]">
              <Search className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
              <p>Type domain names, CVEs, subdomains, or finding IDs to search across datasets.</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-[#64748B]">
              <p>No matching security records found for &quot;{query}&quot;.</p>
            </div>
          ) : (
            <>
              {/* Assessments */}
              {matchingAssessments.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#64748B] text-[10px] uppercase mb-2">
                    Assessments ({matchingAssessments.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingAssessments.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          navigate(`/assessments/${a.id}`);
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-[#F8FAFC] cursor-pointer flex items-center justify-between border border-transparent hover:border-[#E2E8F0]"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-[#E32936]" />
                          <div>
                            <span className="font-bold text-[#172033]">{a.name}</span>
                            <span className="text-[#64748B] font-mono ml-2">({a.targetDomain})</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Findings */}
              {matchingFindings.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#64748B] text-[10px] uppercase mb-2">
                    Findings ({matchingFindings.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingFindings.slice(0, 3).map((f) => (
                      <div
                        key={f.id}
                        onClick={() => {
                          navigate('/findings');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-[#F8FAFC] cursor-pointer flex items-center justify-between border border-transparent hover:border-[#E2E8F0]"
                      >
                        <div className="flex items-center gap-2">
                          <Bug className="w-4 h-4 text-[#DC2626]" />
                          <div>
                            <span className="font-bold text-[#172033]">{f.title}</span>
                            <span className="text-[10px] bg-[#FEF2F2] text-[#DC2626] font-semibold px-1.5 py-0.5 rounded ml-2">
                              {f.severity}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assets */}
              {matchingAssets.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#64748B] text-[10px] uppercase mb-2">
                    Assets ({matchingAssets.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingAssets.slice(0, 3).map((ast) => (
                      <div
                        key={ast.id}
                        onClick={() => {
                          navigate('/assets');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-[#F8FAFC] cursor-pointer flex items-center justify-between border border-transparent hover:border-[#E2E8F0]"
                      >
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-[#2563EB]" />
                          <div>
                            <span className="font-bold text-[#172033]">{ast.name}</span>
                            <span className="text-[#64748B] font-mono ml-2">{ast.ipAddress}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
          <span>Navigation: Use ↑ ↓ keys to navigate, ESC to dismiss</span>
          <span>{totalResults} results matching</span>
        </div>
      </div>
    </div>
  );
};
