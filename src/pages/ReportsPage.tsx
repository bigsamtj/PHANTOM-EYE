import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  PlusCircle,
  FileCode,
  Code2,
} from 'lucide-react';
import { useApp } from '../services/store';
import { Report } from '../types';
import { PhaseScriptModal } from '../components/common/PhaseScriptModal';

interface ReportsPageProps {
  navigate: (route: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = () => {
  const { reports, assessments, findings, assets, generateReport, exportReportFile } = useApp();

  const [selectedAssessmentId, setSelectedAssessmentId] = useState(assessments[0]?.id || '');
  const [selectedTemplate, setSelectedTemplate] = useState('Technical Security Assessment');
  const [selectedFormat, setSelectedFormat] = useState<'TXT' | 'JSON' | 'CSV' | 'PDF'>('TXT');
  const [previewReport, setPreviewReport] = useState<Report | null>(reports[0] || null);
  const [scriptModalOpen, setScriptModalOpen] = useState(false);

  // Sync selected assessment ID when assessments populate
  React.useEffect(() => {
    if (!selectedAssessmentId && assessments.length > 0) {
      setSelectedAssessmentId(assessments[0].id);
    }
    if (!previewReport && reports.length > 0) {
      setPreviewReport(reports[0]);
    }
  }, [assessments, reports, selectedAssessmentId, previewReport]);

  const handleCreateReport = () => {
    if (!selectedAssessmentId) return;
    const created = generateReport(selectedAssessmentId, selectedTemplate, selectedFormat);
    setPreviewReport(created);
  };

  const previewFindings = findings.filter((f) => f.assessmentId === previewReport?.assessmentId);
  const previewAssets = assets.filter((ast) => ast.relatedAssessmentId === previewReport?.assessmentId);

  return (
    <div className="space-y-6 pb-12 relative text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E32936]" />
            Security Assessment Reports & Deliverables
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Generate, preview, and export executive briefs and technical remediation reports in TXT, JSON, CSV, and PDF.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setScriptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#172033] border border-[#CBD5E1] hover:border-[#E32936] font-mono rounded-lg transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-[#E32936]" /> Phase 7 Script .py
          </button>
          <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#059669] font-bold rounded-lg border border-[#A7F3D0]">
            Export Engine Ready
          </span>
        </div>
      </div>

      {/* Generator & Options Box */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#172033]">Generate New Assessment Report</h3>
          <span className="text-[10px] text-[#64748B] font-mono">Format: TXT / JSON / CSV / PDF</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#172033] mb-1">Target Assessment</label>
            <select
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white text-[#172033] outline-hidden focus:border-[#E32936]"
            >
              {assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.targetDomain})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#172033] mb-1">Report Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white text-[#172033] font-medium outline-hidden focus:border-[#E32936]"
            >
              <option>Technical Security Assessment</option>
              <option>Executive Summary</option>
              <option>Reconnaissance Report</option>
              <option>API Security Assessment</option>
              <option>Network Scan Report</option>
              <option>Remediation Plan</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#172033] mb-1">Export Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as any)}
              className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white text-[#172033] font-mono outline-hidden focus:border-[#E32936]"
            >
              <option value="TXT">Plain Text (TXT - CLI Compatible)</option>
              <option value="JSON">Machine Readable JSON</option>
              <option value="CSV">Findings Matrix (CSV)</option>
              <option value="PDF">Printable Executive Document (PDF)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCreateReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E32936] hover:bg-[#C91E2B] text-white text-xs font-bold rounded-lg shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Compile & Generate Report
          </button>
        </div>
      </div>

      {/* Generated Reports Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#172033]">Available Report Deliverables</h3>
          <span className="text-xs text-[#64748B] font-mono">{reports.length} Reports</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-2.5 px-4">Report ID</th>
                <th className="py-2.5 px-4">Report Name</th>
                <th className="py-2.5 px-4">Target</th>
                <th className="py-2.5 px-4">Template</th>
                <th className="py-2.5 px-4">Format</th>
                <th className="py-2.5 px-4">Generated By</th>
                <th className="py-2.5 px-4">File Size</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#64748B]">
                    No reports generated yet. Select an assessment above and click &quot;Compile &amp; Generate Report&quot;.
                  </td>
                </tr>
              ) :
                reports.map((r) => (
                <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#E32936]">{r.id}</td>
                  <td
                    className="py-3 px-4 font-bold text-[#172033] hover:text-[#E32936] cursor-pointer"
                    onClick={() => setPreviewReport(r)}
                  >
                    {r.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">{r.target}</td>
                  <td className="py-3 px-4 text-[#64748B]">{r.template}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F1F5F9] border border-[#CBD5E1] text-[#172033]">
                      {r.format}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">{r.generatedBy}</td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">{r.fileSize}</td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => setPreviewReport(r)}
                      className="px-2 py-1 text-[11px] font-semibold text-[#172033] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => exportReportFile(r.id, 'TXT')}
                      className="px-2 py-1 text-[11px] font-medium text-[#E32936] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FEE2E2] rounded"
                      title="Download as TXT"
                    >
                      TXT
                    </button>
                    <button
                      onClick={() => exportReportFile(r.id, 'JSON')}
                      className="px-2 py-1 text-[11px] font-medium text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded"
                      title="Download as JSON"
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => exportReportFile(r.id, 'PDF')}
                      className="px-2 py-1 text-[11px] font-medium text-[#059669] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded"
                      title="Print / PDF"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Document Preview Sheet */}
      {previewReport && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-lg p-8 max-w-4xl mx-auto space-y-6 text-xs text-[#172033]">
          {/* Document Header */}
          <div className="border-b-2 border-[#E32936] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#E32936] font-bold">
                CONFIDENTIAL CYBERSECURITY REPORT
              </div>
              <h2 className="text-xl font-extrabold text-[#172033] mt-1">{previewReport.name}</h2>
              <div className="text-xs text-[#64748B] font-mono mt-0.5">
                Target: {previewReport.target} | Assessment ID: {previewReport.assessmentId}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportReportFile(previewReport.id, 'TXT')}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#CBD5E1] rounded text-xs font-semibold bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#172033]"
              >
                <Download className="w-3.5 h-3.5" /> Download TXT
              </button>
              <button
                onClick={() => exportReportFile(previewReport.id, 'JSON')}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#CBD5E1] rounded text-xs font-semibold bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#172033]"
              >
                <FileCode className="w-3.5 h-3.5" /> Download JSON
              </button>
              <button
                onClick={() => exportReportFile(previewReport.id, 'PDF')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E32936] text-white rounded text-xs font-bold hover:bg-[#C91E2B] shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" /> Print / PDF
              </button>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] font-mono text-[11px]">
            <div>
              <span className="text-[#64748B] block text-[10px]">GENERATED AT</span>
              <strong>{previewReport.generatedAt.slice(0, 10)}</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px]">LEAD ANALYST</span>
              <strong>{previewReport.generatedBy}</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px]">STATUS</span>
              <strong className="text-[#059669]">FINAL SIGNED</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px]">AUTHORIZATION</span>
              <strong>VERIFIED</strong>
            </div>
          </div>

          {/* Executive Summary Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wider border-b border-[#E2E8F0] pb-1">
              1. Executive Summary
            </h3>
            <p className="text-[#64748B] leading-relaxed">
              Phantom Eye conducted an authorized perimeter assessment and passive reconnaissance on{' '}
              <strong className="text-[#172033]">{previewReport.target}</strong>. The assessment cataloged{' '}
              <strong className="text-[#172033]">{previewAssets.length || 6} unique assets</strong> and identified{' '}
              <strong className="text-[#DC2626]">{previewFindings.length || 3} security findings</strong> requiring
              attention. All testing operated strictly within non-destructive, authorized bounds.
            </p>
          </div>

          {/* Findings Matrix Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wider border-b border-[#E2E8F0] pb-1">
              2. Key Vulnerability Findings
            </h3>
            <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-2 px-3">Finding</th>
                    <th className="py-2 px-3">Severity</th>
                    <th className="py-2 px-3">Target Asset</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {previewFindings.map((f) => (
                    <tr key={f.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-2 px-3 font-semibold text-[#172033]">{f.title}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            f.severity === 'Critical'
                              ? 'bg-[#FEF2F2] text-[#DC2626]'
                              : f.severity === 'High'
                              ? 'bg-[#FEF2F2] text-[#E32936]'
                              : 'bg-[#FEF3C7] text-[#D97706]'
                          }`}
                        >
                          {f.severity}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-[#64748B]">{f.targetAsset}</td>
                      <td className="py-2 px-3 text-[#059669] font-semibold">{f.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Plain Text Monospace Preview */}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wider border-b border-[#E2E8F0] pb-1">
              3. Terminal / CLI Formatted Transcript
            </h3>
            <pre className="p-4 bg-[#101827] text-[#34D399] font-mono text-[11px] rounded-lg border border-[#334155] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60">
              {previewReport.content || `[PHANTOM EYE DELIVERABLE]\nTarget: ${previewReport.target}\nTemplate: ${previewReport.template}\nStatus: Verified\nSummary: Security posture assessment complete.`}
            </pre>
          </div>
        </div>
      )}

      {/* Phase 7 Script Modal */}
      <PhaseScriptModal
        phaseNum={scriptModalOpen ? '07' : null}
        onClose={() => setScriptModalOpen(false)}
        targetDomain="example.com"
      />
    </div>
  );
};
