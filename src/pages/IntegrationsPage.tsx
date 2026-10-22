import React, { useState } from 'react';
import {
  Blocks,
  ExternalLink,
  Settings,
  X,
} from 'lucide-react';
import { useApp } from '../services/store';
import { Integration } from '../types';

interface IntegrationsPageProps {
  navigate: (route: string) => void;
}

export const IntegrationsPage: React.FC<IntegrationsPageProps> = () => {
  const { integrations } = useApp();
  const [selectedTool, setSelectedTool] = useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleOpenConfig = (tool: Integration) => {
    setSelectedTool(tool);
    setApiKey('');
    setEndpointUrl('https://api.internal-security.local/v1');
    setSavedMsg(false);
  };

  const handleSaveConfig = () => {
    setSavedMsg(true);
    setTimeout(() => {
      setSelectedTool(null);
      setSavedMsg(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12 relative text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <Blocks className="w-5 h-5 text-[#E32936]" />
            Security Tools & Engine Integrations
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Connect and orchestrate approved reconnaissance providers, scanners, Python engines, and digital forensics utilities.
          </p>
        </div>

        <span className="text-xs font-mono bg-[#F8FAFC] text-[#64748B] px-3 py-1 rounded-lg border border-[#CBD5E1]">
          {integrations.length} Providers Configured
        </span>
      </div>

      {/* Integration Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((t) => (
          <div
            key={t.id}
            className="p-5 bg-white border border-[#E2E8F0] rounded-xl flex flex-col justify-between shadow-xs hover:border-[#E32936] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-[#172033]">{t.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    t.status === 'Connected'
                      ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                      : t.status === 'Simulation Only'
                      ? 'bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]'
                      : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <p className="text-xs text-[#64748B] mb-4 leading-relaxed">{t.purpose}</p>

              <div className="space-y-1.5 text-[11px] text-[#94A3B8] font-mono pt-2 border-t border-[#E2E8F0]">
                {t.version && <div>Version: <span className="text-[#172033]">{t.version}</span></div>}
                <div>Health Check: <span className="text-[#059669]">{t.lastHealthCheck}</span></div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between">
              <a
                href={t.documentationUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#64748B] hover:text-[#172033] flex items-center gap-1"
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => handleOpenConfig(t)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#172033] rounded text-xs font-semibold transition-colors"
              >
                <Settings className="w-3 h-3" /> Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-md p-5 space-y-4 shadow-2xl text-[#172033]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 bg-[#F8FAFC] -m-5 mb-0 p-4 rounded-t-xl">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Configure {selectedTool.name}</h3>
                <p className="text-[11px] text-[#64748B]">{selectedTool.purpose}</p>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                className="text-[#94A3B8] hover:text-[#172033]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs pt-3">
              <div>
                <label className="block text-[#64748B] mb-1">API Base URL / Endpoint</label>
                <input
                  type="text"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded bg-white text-[#172033] font-mono outline-hidden focus:border-[#E32936]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] mb-1">API Authentication Token / Key</label>
                <input
                  type="password"
                  placeholder="Enter secret token..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded bg-white text-[#172033] font-mono outline-hidden focus:border-[#E32936]"
                />
              </div>

              {savedMsg && (
                <div className="p-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded text-[#059669] text-center font-medium">
                  Settings successfully saved!
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => setSelectedTool(null)}
                className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#172033]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#E32936] hover:bg-[#C91E2B] rounded shadow-xs"
              >
                Save Integration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
