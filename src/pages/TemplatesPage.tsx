import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  PlusCircle,
  Clock,
  X,
  Play,
} from 'lucide-react';
import { useApp } from '../services/store';
import { AssessmentTemplate } from '../types';

interface TemplatesPageProps {
  navigate: (route: string) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ navigate }) => {
  const { templates } = useApp();
  const [templateList, setTemplateList] = useState<AssessmentTemplate[]>(templates);
  const [selectedTemplate, setSelectedTemplate] = useState<AssessmentTemplate | null>(null);

  const handleDuplicate = (t: AssessmentTemplate) => {
    const duplicated: AssessmentTemplate = {
      ...t,
      id: `TMP-${Math.floor(10 + Math.random() * 90)}`,
      name: `${t.name} (Copy)`,
    };
    setTemplateList((prev) => [duplicated, ...prev]);
  };

  return (
    <div className="space-y-6 pb-12 relative text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-[#E32936]" />
            Assessment Templates & Profiles
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Standardized, reusable security scanning profiles with pre-approved testing limits and Python modules.
          </p>
        </div>

        <button
          onClick={() => navigate('/assessments/new')}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#E32936] hover:bg-[#C91E2B] rounded-lg shadow-xs transition-all"
        >
          <PlusCircle className="w-4 h-4" /> New Custom Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templateList.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-5 bg-white border border-[#E2E8F0] rounded-xl shadow-xs flex flex-col justify-between hover:border-[#E32936] transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-[#E32936]">{tmpl.id}</span>
                <span className="text-[10px] text-[#64748B] flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-[#94A3B8]" /> {tmpl.estimatedDuration}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#172033] mb-1.5 group-hover:text-[#E32936] transition-colors">
                {tmpl.name}
              </h3>
              <p className="text-xs text-[#64748B] mb-4 leading-relaxed">{tmpl.description}</p>

              <div className="space-y-1.5 text-xs pt-3 border-t border-[#E2E8F0]">
                <span className="text-[11px] font-semibold text-[#64748B] block mb-1">
                  Enabled Modules ({tmpl.enabledModules.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {tmpl.enabledModules.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between">
              <button
                onClick={() => handleDuplicate(tmpl)}
                className="flex items-center gap-1 text-[11px] text-[#64748B] hover:text-[#172033] transition-colors"
              >
                <Copy className="w-3 h-3" /> Duplicate
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTemplate(tmpl)}
                  className="px-2.5 py-1 text-xs text-[#172033] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded"
                >
                  Inspect
                </button>
                <button
                  onClick={() => navigate('/assessments/new')}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-[#E32936] hover:bg-[#C91E2B] rounded shadow-xs"
                >
                  <Play className="w-3 h-3 fill-current" /> Use
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-[#172033]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 bg-[#F8FAFC] -m-6 mb-0 p-4 rounded-t-xl">
              <div>
                <span className="font-mono text-xs text-[#E32936] font-bold">
                  {selectedTemplate.id}
                </span>
                <h3 className="text-base font-bold text-[#172033]">{selectedTemplate.name}</h3>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-[#94A3B8] hover:text-[#172033]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs pt-3">
              <p className="text-[#64748B] leading-relaxed">{selectedTemplate.description}</p>
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Assessment Type:</span>
                  <span className="font-semibold text-[#172033]">{selectedTemplate.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Max Rate:</span>
                  <span className="font-mono text-[#172033]">{selectedTemplate.defaultLimits?.maxRequestRate || 25} req/sec</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Estimated Time:</span>
                  <span className="text-[#172033]">{selectedTemplate.estimatedDuration}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-1.5 bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#172033] rounded text-xs font-semibold"
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
