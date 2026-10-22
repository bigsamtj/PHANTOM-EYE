import React, { useState } from 'react';
import {
  Radar,
  Globe,
  Server,
  FileCode2,
  Lock,
  Layers,
  CheckCircle2,
  Share2,
  Code2,
} from 'lucide-react';
import { useApp } from '../services/store';
import { PhaseScriptModal } from '../components/common/PhaseScriptModal';

interface ReconnaissancePageProps {
  navigate: (route: string) => void;
}

export const ReconnaissancePage: React.FC<ReconnaissancePageProps> = ({ navigate }) => {
  const { assets } = useApp();

  const [activeTab, setActiveTab] = useState<
    'graph' | 'subdomains' | 'dns' | 'ips' | 'certs' | 'tech'
  >('graph');
  const [selectedNode, setSelectedNode] = useState<string | null>('example.com');
  const [scriptModalOpen, setScriptModalOpen] = useState(false);

  // Synthetic DNS records
  const dnsRecords = [
    { type: 'A', name: 'example.com', value: '93.184.216.34', ttl: 300, source: 'Cloudflare DNS' },
    { type: 'AAAA', name: 'example.com', value: '2606:2800:220:1:248:1893:25c8:1946', ttl: 300, source: 'Cloudflare DNS' },
    { type: 'MX', name: 'example.com', value: '10 mail.example.com', ttl: 3600, source: 'Authoritative' },
    { type: 'TXT', name: 'example.com', value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600, source: 'Authoritative' },
    { type: 'CNAME', name: 'api.example.com', value: 'lb-prod.example.com', ttl: 300, source: 'CT Log' },
    { type: 'CNAME', name: 'auth.example.com', value: 'sso.example.com', ttl: 300, source: 'Passive DNS' },
  ];

  // Synthetic Certificates
  const certificates = [
    {
      subject: 'CN=example.com',
      issuer: "DigiCert Global Root G2",
      validFrom: '2026-01-15',
      validTo: '2027-01-15',
      status: 'Valid (Active)',
      sans: ['example.com', 'www.example.com', '*.example.com'],
      serial: '04:bb:88:cc:44:11',
    },
    {
      subject: 'CN=legacy-vpn.example.com',
      issuer: "Let's Encrypt Authority X3",
      validFrom: '2025-08-01',
      validTo: '2026-11-01',
      status: 'Expiring Soon',
      sans: ['legacy-vpn.example.com'],
      serial: '03:f1:92:aa:12:e9',
    },
  ];

  const subdomains = assets.filter((a) => a.type === 'Subdomain' || a.type === 'Domain');

  return (
    <div className="space-y-6 pb-12 text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <Radar className="w-5 h-5 text-[#E32936]" />
            Passive Reconnaissance & Attack Surface
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Aggregated OSINT, DNS records, public certificate logs, and asset topological relationship mapping.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScriptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#172033] border border-[#CBD5E1] hover:border-[#E32936] text-xs font-mono rounded-lg transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-[#E32936]" /> Phase 2 Script .py
          </button>
          <span className="px-2.5 py-1 text-xs font-semibold bg-[#ECFDF5] text-[#059669] rounded-lg border border-[#A7F3D0] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> OSINT Feeds Online
          </span>
          <button
            onClick={() => navigate('/terminal')}
            className="px-3 py-1.5 bg-[#E32936] hover:bg-[#C91E2B] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Terminal Query
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Apex Domains', value: assets.filter((a) => a.type === 'Domain').length, icon: Globe },
          { label: 'Subdomains', value: subdomains.length, icon: Server },
          { label: 'IP Addresses', value: new Set(assets.map((a) => a.ipAddress).filter(Boolean)).size, icon: Layers },
          { label: 'DNS Records', value: assets.length > 0 ? dnsRecords.length : 0, icon: FileCode2 },
          { label: 'Certificates', value: assets.length > 0 ? certificates.length : 0, icon: Lock },
          { label: 'Tech Signatures', value: assets.length > 0 ? 12 : 0, icon: Radar },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-3 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-[#64748B] text-[10px] mb-1 font-semibold uppercase">
                <span>{m.label}</span>
                <Icon className="w-3.5 h-3.5 text-[#E32936]" />
              </div>
              <div className="text-xl font-extrabold text-[#172033]">{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'graph', label: 'Interactive Relationship Graph', icon: Share2 },
          { id: 'subdomains', label: `Domains & Subdomains (${subdomains.length})`, icon: Server },
          { id: 'dns', label: `DNS Records (${dnsRecords.length})`, icon: FileCode2 },
          { id: 'ips', label: 'IP Addresses (8)', icon: Layers },
          { id: 'certs', label: `Certificates (${certificates.length})`, icon: Lock },
          { id: 'tech', label: 'Technologies & Fingerprints', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#E32936] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Interactive Topological Relationship Graph */}
      {activeTab === 'graph' && (
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Surface Topology & Asset Graph</h3>
              <p className="text-xs text-[#64748B]">
                Interactive visual map linking the apex domain, discovered subdomains, IPs, and SSL certificates.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#E32936]"></span> Apex Domain</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span> Subdomain</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span> IP Address</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span> Certificate</span>
            </div>
          </div>

          {/* SVG Canvas Map */}
          <div className="relative bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 h-[440px] flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 900 400">
              {/* Connection Lines */}
              <line x1="450" y1="200" x2="220" y2="100" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="450" y1="200" x2="220" y2="200" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="450" y1="200" x2="220" y2="300" stroke="#CBD5E1" strokeWidth="2" />
              
              <line x1="450" y1="200" x2="680" y2="100" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="450" y1="200" x2="680" y2="200" stroke="#CBD5E1" strokeWidth="2" />

              <line x1="220" y1="100" x2="80" y2="70" stroke="#E2E8F0" strokeWidth="1.5" />
              <line x1="220" y1="200" x2="80" y2="190" stroke="#E2E8F0" strokeWidth="1.5" />
              <line x1="220" y1="300" x2="80" y2="310" stroke="#E2E8F0" strokeWidth="1.5" />

              {/* Apex Node (Center) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedNode('example.com')}
              >
                <circle cx="450" cy="200" r="32" fill="#E32936" className="filter drop-shadow-xs transition-all" />
                <text x="450" y="196" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">APEX</text>
                <text x="450" y="210" textAnchor="middle" fill="#FFFFFF" fontSize="9">example.com</text>
              </g>

              {/* Subdomain 1: api */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedNode('api.example.com')}
              >
                <circle cx="220" cy="100" r="26" fill="#2563EB" className="transition-all" />
                <text x="220" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">api</text>
              </g>

              {/* Subdomain 2: auth */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedNode('auth.example.com')}
              >
                <circle cx="220" cy="200" r="26" fill="#2563EB" />
                <text x="220" y="203" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">auth</text>
              </g>

              {/* Subdomain 3: legacy-vpn */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedNode('legacy-vpn.example.com')}
              >
                <circle cx="220" cy="300" r="26" fill="#DC2626" />
                <text x="220" y="303" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">legacy-vpn</text>
              </g>

              {/* IP 1 */}
              <g className="cursor-pointer" onClick={() => setSelectedNode('93.184.216.34')}>
                <rect x="25" y="55" width="115" height="28" rx="6" fill="#059669" />
                <text x="82" y="73" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">93.184.216.34</text>
              </g>

              {/* IP 2 */}
              <g className="cursor-pointer" onClick={() => setSelectedNode('198.51.100.99')}>
                <rect x="25" y="175" width="115" height="28" rx="6" fill="#059669" />
                <text x="82" y="193" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">198.51.100.99</text>
              </g>

              {/* IP 3 */}
              <g className="cursor-pointer" onClick={() => setSelectedNode('198.51.100.12')}>
                <rect x="25" y="295" width="115" height="28" rx="6" fill="#059669" />
                <text x="82" y="313" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">198.51.100.12</text>
              </g>

              {/* Cert 1 */}
              <g className="cursor-pointer" onClick={() => setSelectedNode("DigiCert Wildcard")}>
                <rect x="620" y="85" width="130" height="30" rx="6" fill="#D97706" />
                <text x="685" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">*.example.com</text>
              </g>

              {/* Cert 2 */}
              <g className="cursor-pointer" onClick={() => setSelectedNode("Let's Encrypt VPN Cert")}>
                <rect x="620" y="185" width="130" height="30" rx="6" fill="#D97706" />
                <text x="685" y="204" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">legacy-vpn cert</text>
              </g>
            </svg>

            {/* Selected Node Overlay Badge */}
            {selectedNode && (
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-[#E2E8F0] p-3 rounded-lg shadow-md text-xs">
                <div className="font-bold text-[#172033] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E32936]"></span>
                  <span>Selected Node: {selectedNode}</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  Status: <strong className="text-[#059669]">In Scope</strong> • Verified via passive DNS & CT logs
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Subdomains Table */}
      {activeTab === 'subdomains' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172033]">Discovered Domains & Hostnames</h3>
            <span className="text-xs text-[#64748B]">Showing {subdomains.length} entries</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-2.5 px-4">Hostname</th>
                <th className="py-2.5 px-4">Source</th>
                <th className="py-2.5 px-4">IP Address</th>
                <th className="py-2.5 px-4">First Observed</th>
                <th className="py-2.5 px-4">Scope Status</th>
                <th className="py-2.5 px-4">Findings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {subdomains.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3 px-4 font-mono font-bold text-[#172033]">{sub.name}</td>
                  <td className="py-3 px-4 text-[#64748B]">{sub.source}</td>
                  <td className="py-3 px-4 font-mono text-[#172033]">{sub.ipAddress || 'Pending'}</td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">{new Date(sub.firstSeen).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                        sub.scopeStatus === 'In Scope'
                          ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                          : sub.scopeStatus === 'Out of Scope'
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                          : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                      }`}
                    >
                      {sub.scopeStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#172033]">{sub.relatedFindingsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: DNS Records */}
      {activeTab === 'dns' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172033]">Authoritative DNS Records</h3>
            <span className="text-xs text-[#059669] font-medium">Authoritative Resolution Complete</span>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold font-sans border-b border-[#E2E8F0]">
              <tr>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">Value / Target</th>
                <th className="py-2.5 px-4">TTL</th>
                <th className="py-2.5 px-4 font-sans">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {dnsRecords.map((d, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC]">
                  <td className="py-3 px-4 font-bold text-[#E32936]">{d.type}</td>
                  <td className="py-3 px-4 text-[#172033]">{d.name}</td>
                  <td className="py-3 px-4 text-[#64748B] break-all">{d.value}</td>
                  <td className="py-3 px-4 text-[#94A3B8]">{d.ttl}s</td>
                  <td className="py-3 px-4 font-sans text-[#64748B]">{d.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: Certificates */}
      {activeTab === 'certs' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#172033]">Certificate Transparency & TLS Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((c, i) => (
              <div key={i} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172033]">{c.subject}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                    {c.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Issuer: <strong className="text-[#172033]">{c.issuer}</strong>
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Validity: {c.validFrom} to {c.validTo}
                </div>
                <div className="text-[11px] text-[#64748B]">
                  SANs: <span className="font-mono text-[#172033]">{c.sans.join(', ')}</span>
                </div>
                <div className="font-mono text-[10px] text-[#94A3B8] pt-1 border-t border-[#E2E8F0]">
                  Serial: {c.serial}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Tech Fingerprints */}
      {(activeTab === 'tech' || activeTab === 'ips') && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#172033]">Technology Stack & Service Signatures</h3>
          <p className="text-xs text-[#64748B]">Fingerprinted via passive HTTP response headers and TLS characteristics.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {[
              { tech: 'Nginx 1.24.0', type: 'Web Server', host: 'example.com' },
              { tech: 'FastAPI 0.110', type: 'Python Framework', host: 'api.example.com' },
              { tech: 'Keycloak 24.0', type: 'Identity Provider', host: 'auth.example.com' },
              { tech: 'OpenVPN Access Server', type: 'VPN Gateway', host: 'legacy-vpn.example.com' },
              { tech: 'DigiCert Global Root G2', type: 'Certificate Authority', host: '*.example.com' },
              { tech: 'Cloudflare Proxy (Simulated)', type: 'CDN / DDoS Protection', host: 'example.com' },
            ].map((t, idx) => (
              <div key={idx} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs">
                <div className="font-bold text-[#172033]">{t.tech}</div>
                <div className="text-[11px] text-[#64748B]">{t.type}</div>
                <div className="font-mono text-[10px] text-[#E32936] mt-1">{t.host}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2 Script Modal */}
      <PhaseScriptModal
        phaseNum={scriptModalOpen ? '02' : null}
        onClose={() => setScriptModalOpen(false)}
        targetDomain="example.com"
      />
    </div>
  );
};
