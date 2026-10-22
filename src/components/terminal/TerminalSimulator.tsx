import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  Square,
  Copy,
  Trash2,
  Download,
  Search,
  Check,
  Cpu,
  ShieldCheck,
  FileCode,
} from 'lucide-react';
import { useApp } from '../../services/store';

interface TerminalSimulatorProps {
  initialTarget?: string;
  initialAssessmentId?: string;
  isEmbedded?: boolean;
}

interface LogLine {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'cmd' | 'output' | 'dim' | 'banner' | 'phase';
}

const PHANTOM_EYE_BANNER = `╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ██████╗ ██╗  ██╗ █████╗ ███╗   ██╗████████╗ ██████╗ ███╗   ███╗    ║
║   ██╔══██╗██║  ██║██╔══██╗████╗  ██║╚══██╔══╝██╔═══██╗████╗ ████║    ║
║   ██████╔╝███████║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║    ║
║   ██╔═══╝ ██╔══██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║    ║
║   ██║     ██║  ██║██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║    ║
║   ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝    ║
║                                                                      ║
║          E Y E   //   Offensive Security Automation Framework        ║
║                     SYSTEM_OFFSEC  •  v1.0                           ║
╚══════════════════════════════════════════════════════════════════════╝`;

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  initialTarget = 'BigSam.com',
  initialAssessmentId = 'ASM-DEMO',
  isEmbedded = false,
}) => {
  const { assessments, jobs, downloadDataFile } = useApp();

  const [target, setTarget] = useState(initialTarget);
  const [assessmentId, setAssessmentId] = useState(initialAssessmentId);
  const [inputVal, setInputVal] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Command history buffer
  const [history, setHistory] = useState<string[]>([
    'python3 phantomeye.py BigSam.com',
    'status',
    'scope',
    'phantom-eye BigSam.com -m recon',
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Terminal log lines
  const [logs, setLogs] = useState<LogLine[]>([
    {
      id: 'l-b',
      timestamp: '08:00:00',
      text: PHANTOM_EYE_BANNER,
      type: 'banner',
    },
    {
      id: 'l-0',
      timestamp: '08:00:01',
      text: '┌──(phantom㉿eye-workstation)-[~/PhantomEye]',
      type: 'dim',
    },
    {
      id: 'l-1',
      timestamp: '08:00:01',
      text: '└─$ python3 phantomeye.py --help',
      type: 'cmd',
    },
    {
      id: 'l-2',
      timestamp: '08:00:01',
      text: 'PHANTOM EYE - Offensive Security Automation Framework (SYSTEM_OFFSEC • v1.0)',
      type: 'info',
    },
    {
      id: 'l-3',
      timestamp: '08:00:02',
      text: '[SIMULATION] Safe mode active. Target context: ' + target,
      type: 'warn',
    },
  ]);

  const outputEndRef = useRef<HTMLDivElement>(null);
  const simulationAbortRef = useRef<boolean>(false);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLine = (text: string, type: LogLine['type'] = 'info') => {
    const now = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [...prev, { id: `log-${Date.now()}-${Math.random()}`, timestamp: now, text, type }]);
  };

  const runPhasedScan = async (targetDomain: string, mode = 'full') => {
    setTarget(targetDomain);
    setIsSimulating(true);
    simulationAbortRef.current = false;

    const timeStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Attempt live network resolution from Phantom Eye backend
    let liveReconData: any = null;
    try {
      const resp = await fetch('/api/modules/recon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: targetDomain }),
      });
      if (resp.ok) {
        const json = await resp.json();
        liveReconData = json.results;
      }
    } catch {
      // Fallback
    }

    const steps: Array<{ text: string; type: LogLine['type']; delay: number }> = [
      { text: `[+] Target        : ${targetDomain}`, type: 'info', delay: 250 },
      { text: `[+] Mode          : ${mode.toUpperCase()}`, type: 'info', delay: 200 },
      { text: `[+] Started       : ${timeStr}`, type: 'info', delay: 200 },
      { text: `[+] Report        : reports/${targetDomain}_assessment.txt`, type: 'info', delay: 200 },
      { text: `------------------------------------------------------------`, type: 'dim', delay: 150 },
    ];

    if (mode === 'full' || mode === 'recon') {
      const resolvedIp = liveReconData?.ip || '93.184.216.34';
      const openPorts = liveReconData?.ports ? JSON.stringify(liveReconData.ports) : '[80, 443, 8443]';
      const dnsCount = liveReconData?.dns ? Object.keys(liveReconData.dns).length : 6;

      steps.push(
        { text: `[*] Phase 1/5 : Reconnaissance`, type: 'phase', delay: 400 },
        { text: `[✓] IP Address     : ${resolvedIp}`, type: 'success', delay: 350 },
        { text: `[*] Running WHOIS...`, type: 'info', delay: 400 },
        { text: `[✓] WHOIS data retrieved (Authoritative ICANN registrar)`, type: 'success', delay: 350 },
        { text: `[*] Enumerating DNS records (A, AAAA, MX, NS, TXT, CNAME)...`, type: 'info', delay: 450 },
        { text: `[✓] DNS records collected: ${dnsCount} types verified`, type: 'success', delay: 400 },
        { text: `[*] Discovering subdomains with ${targetDomain}...`, type: 'info', delay: 500 },
        { text: `    • api.${targetDomain}`, type: 'output', delay: 150 },
        { text: `    • auth.${targetDomain}`, type: 'output', delay: 150 },
        { text: `    • mail.${targetDomain}`, type: 'output', delay: 150 },
        { text: `    • cdn.${targetDomain}`, type: 'output', delay: 150 },
        { text: `[✓] Subdomains found: 4`, type: 'success', delay: 300 },
        { text: `[*] Scanning common ports [21, 22, 25, 53, 80, 443, 3306, 8080, 8443]...`, type: 'info', delay: 500 },
        { text: `[✓] Open ports: ${openPorts}`, type: 'success', delay: 350 },
        { text: `[*] Fetching HTTP headers & tech...`, type: 'info', delay: 400 },
        { text: `[✓] HTTP 200 - Server: nginx/1.24.0 (Ubuntu) | FastApi 0.110`, type: 'success', delay: 350 }
      );
    }

    if (mode === 'full' || mode === 'vuln') {
      steps.push(
        { text: `------------------------------------------------------------`, type: 'dim', delay: 200 },
        { text: `[*] Phase 2/5 : Vulnerability Assessment`, type: 'phase', delay: 400 },
        { text: `[*] Checking 28 sensitive paths (/.git/HEAD, /.env, /backup.zip, /config.php)...`, type: 'info', delay: 500 },
        { text: `[!] Found: https://${targetDomain}/robots.txt [200]`, type: 'warn', delay: 350 },
        { text: `[!] Found: https://${targetDomain}/api/v1 [200]`, type: 'warn', delay: 350 },
        { text: `[✓] Sensitive/Interesting paths found: 2`, type: 'success', delay: 300 },
        { text: `[*] Analyzing security headers...`, type: 'info', delay: 400 },
        { text: `[✓] Missing security headers: ['Content-Security-Policy', 'Strict-Transport-Security']`, type: 'warn', delay: 400 }
      );
    }

    if (mode === 'full' || mode === 'owasp') {
      steps.push(
        { text: `------------------------------------------------------------`, type: 'dim', delay: 200 },
        { text: `[*] Phase 3/5 : OWASP Top 10 Testing`, type: 'phase', delay: 400 },
        { text: `[*] Running OWASP Top 10 checks...`, type: 'info', delay: 350 },
        { text: `[*] A03 - Injection (XSS / SQLi probes on query params)...`, type: 'info', delay: 500 },
        { text: `[!] Possible XSS reflection on parameter ?q=`, type: 'warn', delay: 400 },
        { text: `[*] A05 - Security Misconfiguration... Server header exposed`, type: 'warn', delay: 350 },
        { text: `[*] A07 - Auth related paths (/login, /admin) mapped`, type: 'info', delay: 350 },
        { text: `[*] A10 - SSRF payload list prepared (8 probes)`, type: 'info', delay: 300 },
        { text: `[✓] OWASP Top 10 phase completed`, type: 'success', delay: 300 }
      );
    }

    if (mode === 'full' || mode === 'api') {
      steps.push(
        { text: `------------------------------------------------------------`, type: 'dim', delay: 200 },
        { text: `[*] Phase 4/5 : API Security Top 10`, type: 'phase', delay: 400 },
        { text: `[*] Discovering API endpoints across REST & GraphQL dictionaries...`, type: 'info', delay: 500 },
        { text: `[✓] API endpoints discovered: 4 (/api, /api/v1, /api/docs, /swagger.json)`, type: 'success', delay: 400 },
        { text: `[*] Checking potential BOLA / IDOR paths...`, type: 'info', delay: 450 },
        { text: `[!] Possible BOLA/IDOR: https://${targetDomain}/api/users/1 → 200`, type: 'warn', delay: 400 },
        { text: `[✓] API Top 10 phase completed`, type: 'success', delay: 300 }
      );
    }

    if (mode === 'full' || mode === 'payload') {
      steps.push(
        { text: `------------------------------------------------------------`, type: 'dim', delay: 200 },
        { text: `[*] Phase 5/5 : Payload Generation`, type: 'phase', delay: 400 },
        { text: `[*] Generating full payload sets...`, type: 'info', delay: 450 },
        { text: `[✓] Payload categories generated: 10 (XSS, SQLi, LFI, RCE, SSRF, SSTI, XXE, CRLF, Open Redirect, API Abuse)`, type: 'success', delay: 400 },
        { text: `    • XSS             : 10 payloads`, type: 'output', delay: 100 },
        { text: `    • SQLI            : 12 payloads`, type: 'output', delay: 100 },
        { text: `    • LFI             : 9 payloads`, type: 'output', delay: 100 },
        { text: `    • RCE             : 10 payloads`, type: 'output', delay: 100 },
        { text: `    • SSRF            : 8 payloads`, type: 'output', delay: 100 }
      );
    }

    steps.push(
      { text: `------------------------------------------------------------`, type: 'dim', delay: 200 },
      { text: `[*] Generating Report...`, type: 'info', delay: 400 },
      { text: `[✓] Scan completed successfully`, type: 'success', delay: 300 },
      { text: `[✓] Report saved → reports/${targetDomain}_assessment.txt`, type: 'success', delay: 200 }
    );

    for (const step of steps) {
      if (simulationAbortRef.current) {
        addLine('[!] Scan interrupted by user', 'error');
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      if (simulationAbortRef.current) break;
      addLine(step.text, step.type);
    }

    setIsSimulating(false);
  };

  const handleRunCommand = async (cmdToRun?: string) => {
    const rawCmd = (cmdToRun || inputVal).trim();
    if (!rawCmd) return;

    // Save to history
    setHistory((prev) => [rawCmd, ...prev.filter((c) => c !== rawCmd)]);
    setHistoryIndex(-1);
    setInputVal('');

    addLine(`└─$ ${rawCmd}`, 'cmd');

    const tokens = rawCmd.split(' ');
    const baseCommand = tokens[0].toLowerCase();

    if (baseCommand === 'clear') {
      setLogs([]);
      return;
    }

    if (baseCommand === 'help') {
      addLine('========================================================================', 'dim');
      addLine('PHANTOM EYE OFFENSIVE SECURITY AUTOMATION FRAMEWORK — CLI COMMANDS', 'info');
      addLine('  python3 phantomeye.py <domain>         Run full 5-phase security assessment', 'info');
      addLine('  python3 phantomeye.py <domain> -m recon Reconnaissance phase only', 'info');
      addLine('  python3 phantomeye.py <domain> -m vuln  Vulnerability assessment phase only', 'info');
      addLine('  python3 phantomeye.py <domain> -m owasp OWASP Top 10 vulnerability checks', 'info');
      addLine('  python3 phantomeye.py <domain> -m api   API Security Top 10 evaluation', 'info');
      addLine('  python3 phantomeye.py <domain> -m payload Generate XSS, SQLi, LFI, RCE payloads', 'info');
      addLine('  phantom-eye <domain>                   Shortcut alias to launch full scan', 'info');
      addLine('  status                                 Display current session & environment state', 'info');
      addLine('  scope                                  Show authorized target domain & limits', 'info');
      addLine('  tools                                  List loaded Python backend modules', 'info');
      addLine('  history                                List recent command history', 'info');
      addLine('  reports                                List generated reports in reports/', 'info');
      addLine('  export txt                             Download session output log as TXT', 'info');
      addLine('  export json                            Download session output log as JSON', 'info');
      addLine('  clear                                  Clear terminal scrollback', 'info');
      addLine('========================================================================', 'dim');
      return;
    }

    if (baseCommand === 'status') {
      addLine(`[STATUS] Target Domain     : ${target}`, 'info');
      addLine(`[STATUS] Engine Version    : SYSTEM_OFFSEC • v1.0`, 'success');
      addLine(`[STATUS] Active Assessment : ${assessmentId}`, 'info');
      addLine(`[STATUS] Mode              : Automated Simulation (Safe)`, 'warn');
      addLine(`[STATUS] Threads           : 10 | Timeout: 10s`, 'info');
      return;
    }

    if (baseCommand === 'scope') {
      addLine(`[SCOPE] Authorized Apex  : ${target}`, 'info');
      addLine(`[SCOPE] Permitted Scopes : *.${target}, ${target}`, 'info');
      addLine(`[SCOPE] Rate Limit       : 15 req/sec (Safe Mode)`, 'info');
      addLine(`[SCOPE] Status           : EXPLICIT AUTHORIZATION VERIFIED`, 'success');
      return;
    }

    if (baseCommand === 'tools') {
      addLine('[MODULES] modules.recon       : WHOIS, DNS, Subdomains, Ports, Tech Detect', 'success');
      addLine('[MODULES] modules.vuln        : Sensitive Files (28 paths), Security Headers', 'success');
      addLine('[MODULES] modules.owasp       : OWASP Top 10 Probes (XSS, SQLi, LFI, RCE, SSRF)', 'success');
      addLine('[MODULES] modules.api_top10   : API Top 10 (BOLA, Auth, Function-Level, Swagger)', 'success');
      addLine('[MODULES] modules.payloads    : 10 Weaponized Payload Sets', 'success');
      addLine('[MODULES] modules.report      : Plain Text & Markdown Formatted Exporters', 'success');
      return;
    }

    if (baseCommand === 'history') {
      history.slice(0, 10).forEach((h, i) => {
        addLine(`  ${i + 1}  ${h}`, 'dim');
      });
      return;
    }

    if (baseCommand === 'reports') {
      addLine('[REPORTS] Available artifacts in reports/:', 'info');
      addLine(`  • reports/${target}_assessment.txt (42.8 KB)`, 'output');
      addLine(`  • reports/BigSam.com_report.txt (54.1 KB)`, 'output');
      addLine('Run "export txt" or "export json" to download.', 'info');
      return;
    }

    if (baseCommand === 'export') {
      const format = tokens[1]?.toLowerCase();
      if (format === 'json') {
        const jsonDump = JSON.stringify(logs, null, 2);
        downloadDataFile(`phantom_eye_terminal_${target}_${Date.now()}.json`, jsonDump, 'application/json');
        addLine(`[✓] Successfully exported phantom_eye_terminal_${target}.json`, 'success');
      } else {
        const textDump = logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
        downloadDataFile(`phantom_eye_terminal_${target}_${Date.now()}.txt`, textDump, 'text/plain');
        addLine(`[✓] Successfully exported phantom_eye_terminal_${target}.txt`, 'success');
      }
      return;
    }

    // Python phantomeye.py execution
    if (
      baseCommand === 'phantom-eye' ||
      baseCommand === 'python3' ||
      rawCmd.startsWith('python') ||
      rawCmd.startsWith('./phantomeye.py')
    ) {
      let targetDomain = target;
      let mode = 'full';

      // Parse CLI arguments
      for (let i = 1; i < tokens.length; i++) {
        if (tokens[i] === '-m' && tokens[i + 1]) {
          mode = tokens[i + 1].toLowerCase();
          i++;
        } else if (tokens[i] === '--mode' && tokens[i + 1]) {
          mode = tokens[i + 1].toLowerCase();
          i++;
        } else if (tokens[i] === '--passive') {
          mode = 'recon';
        } else if (tokens[i] === '--simulate') {
          mode = 'full';
        } else if (!tokens[i].startsWith('-') && !tokens[i].endsWith('.py')) {
          targetDomain = tokens[i];
        }
      }

      await runPhasedScan(targetDomain, mode);
      return;
    }

    // Unknown command
    addLine(`command not found: ${baseCommand}`, 'error');
    addLine(`Type "help" to view Phantom Eye CLI usage and options.`, 'dim');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const suggestions = [
        'help',
        'status',
        'scope',
        'tools',
        'history',
        'reports',
        'export txt',
        'export json',
        'python3 phantomeye.py BigSam.com',
        'python3 phantomeye.py BigSam.com -m recon',
        'python3 phantomeye.py BigSam.com -m vuln',
        'python3 phantomeye.py BigSam.com -m owasp',
        'python3 phantomeye.py BigSam.com -m api',
        'python3 phantomeye.py BigSam.com -m payload',
      ];
      const match = suggestions.find((s) => s.startsWith(inputVal));
      if (match) setInputVal(match);
    }
  };

  const handleCopy = () => {
    const textToCopy = logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStopSimulation = () => {
    simulationAbortRef.current = true;
    setIsSimulating(false);
  };

  const filteredLogs = searchTerm
    ? logs.filter((l) => l.text.toLowerCase().includes(searchTerm.toLowerCase()))
    : logs;

  return (
    <div className={`flex flex-col lg:flex-row gap-4 ${isEmbedded ? 'h-[620px]' : 'h-[calc(100vh-140px)]'}`}>
      {/* Main Black Terminal Container */}
      <div className="flex-1 flex flex-col bg-[#090909] text-[#E8E8E8] rounded-xl border border-[#292929] shadow-2xl overflow-hidden">
        {/* Terminal Header Bar */}
        <div className="bg-[#101010] border-b border-[#292929] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF202A] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#E8A23A] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#16A36A] inline-block"></span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#969696]">
              <TerminalIcon className="w-3.5 h-3.5 text-[#FF202A]" />
              <span className="text-[#F5F5F5] font-semibold">phantom-eye@kali</span>
              <span>:</span>
              <span className="text-[#4388FF]">~/PhantomEye</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#171717] text-[#55D99A] border border-[#292929] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55D99A] animate-pulse"></span>
              SIMULATION
            </span>

            {/* Search within output */}
            <div className="relative hidden sm:block">
              <Search className="w-3 h-3 text-[#666666] absolute left-2 top-2" />
              <input
                type="text"
                placeholder="Search output..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#090909] text-xs font-mono pl-7 pr-2 py-1 rounded border border-[#292929] text-[#E8E8E8] placeholder-[#666666] w-32 focus:w-44 focus:border-[#FF202A] outline-hidden transition-all"
              />
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 text-[#969696] hover:text-white rounded hover:bg-[#171717] transition-colors"
              title="Copy terminal buffer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#55D99A]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setLogs([])}
              className="p-1.5 text-[#969696] hover:text-white rounded hover:bg-[#171717] transition-colors"
              title="Clear terminal buffer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            {isSimulating && (
              <button
                onClick={handleStopSimulation}
                className="flex items-center gap-1 px-2 py-1 bg-[#FF202A] hover:bg-[#D71920] text-white text-[10px] font-mono rounded transition-colors"
              >
                <Square className="w-3 h-3 fill-current" />
                STOP
              </button>
            )}
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 terminal-scroll select-text">
          {filteredLogs.map((log) => {
            let textColor = 'text-[#E8E8E8]';
            if (log.type === 'banner') textColor = 'text-[#FF202A] font-bold';
            if (log.type === 'cmd') textColor = 'text-[#FFFFFF] font-bold';
            if (log.type === 'phase') textColor = 'text-[#FF202A] font-bold';
            if (log.type === 'info') textColor = 'text-[#4388FF]';
            if (log.type === 'success') textColor = 'text-[#55D99A] font-medium';
            if (log.type === 'warn') textColor = 'text-[#E8A23A]';
            if (log.type === 'error') textColor = 'text-[#FF202A]';
            if (log.type === 'output') textColor = 'text-[#969696]';
            if (log.type === 'dim') textColor = 'text-[#666666]';

            return (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                {log.type !== 'banner' && (
                  <span className="text-[#666666] select-none text-[10px] pt-0.5 shrink-0">
                    {log.timestamp}
                  </span>
                )}
                <span className={`break-all whitespace-pre font-mono ${textColor}`}>{log.text}</span>
              </div>
            );
          })}
          <div ref={outputEndRef} />
        </div>

        {/* Command Quick Autocomplete Bar */}
        <div className="bg-[#101010] border-t border-[#292929] px-3 py-1.5 flex items-center gap-2 overflow-x-auto text-[10px] font-mono text-[#969696]">
          <span className="text-[#666666] shrink-0">Phases:</span>
          {[
            'python3 phantomeye.py BigSam.com',
            'python3 phantomeye.py BigSam.com -m recon',
            'python3 phantomeye.py BigSam.com -m vuln',
            'python3 phantomeye.py BigSam.com -m owasp',
            'python3 phantomeye.py BigSam.com -m api',
            'python3 phantomeye.py BigSam.com -m payload',
            'export txt',
          ].map((c) => (
            <button
              key={c}
              disabled={isSimulating}
              onClick={() => handleRunCommand(c)}
              className="shrink-0 px-2 py-0.5 rounded bg-[#171717] hover:bg-[#292929] hover:text-[#F5F5F5] text-[#969696] transition-colors disabled:opacity-50 border border-[#292929]"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Terminal Input Prompt */}
        <div className="bg-[#0D0D0D] border-t border-[#292929] p-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#55D99A] font-bold select-none shrink-0">
            <span>┌──(phantom)</span>
            <span className="text-[#FF202A]">-[~]</span>
            <span className="text-[#F5F5F5]">$</span>
          </div>
          <input
            type="text"
            disabled={isSimulating}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isSimulating ? 'Background scan phase executing...' : 'Type command (e.g. "python3 phantomeye.py BigSam.com")...'}
            className="flex-1 bg-transparent font-mono text-xs text-[#E8E8E8] placeholder-[#666666] outline-hidden"
          />
          <button
            onClick={() => handleRunCommand()}
            disabled={isSimulating || !inputVal.trim()}
            className="px-3 py-1 bg-[#FF202A] hover:bg-[#D71920] text-white text-xs font-mono font-medium rounded transition-colors disabled:opacity-40"
          >
            Execute
          </button>
        </div>
      </div>

      {/* Terminal Side Panel (Operations Context) */}
      <div className="w-full lg:w-72 bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col justify-between shrink-0 shadow-xs text-xs text-[#172033]">
        <div className="space-y-4">
          <div className="border-b border-[#E2E8F0] pb-2">
            <h4 className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#E32936]" />
              Phantom Eye Engine
            </h4>
            <p className="text-[11px] text-[#64748B]">SYSTEM_OFFSEC • v1.0 Framework</p>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase">Active Target</div>
            <div className="mt-1 p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              <div className="font-mono text-xs font-bold text-[#172033]">{target}</div>
              <div className="text-[10px] text-[#059669] flex items-center gap-1 mt-0.5 font-medium">
                <ShieldCheck className="w-3 h-3" /> Scope Authorized
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase">Execution Mode</div>
            <div className="mt-1 p-2 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg text-xs">
              <span className="font-semibold text-[#E32936]">CLI Background Runner</span>
              <p className="text-[10px] text-[#64748B] mt-0.5">
                Multi-phase automation across recon, vuln, owasp, api, and payload modules.
              </p>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase mb-1">5 Scanning Phases</div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-[#64748B] py-0.5">
                <span>Phase 1: Recon (modules.recon)</span>
                <span className="text-[#059669] font-semibold text-[10px]">READY</span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] py-0.5">
                <span>Phase 2: Vuln (modules.vuln)</span>
                <span className="text-[#059669] font-semibold text-[10px]">READY</span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] py-0.5">
                <span>Phase 3: OWASP (modules.owasp)</span>
                <span className="text-[#059669] font-semibold text-[10px]">READY</span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] py-0.5">
                <span>Phase 4: API (modules.api_top10)</span>
                <span className="text-[#059669] font-semibold text-[10px]">READY</span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] py-0.5">
                <span>Phase 5: Payloads (10 Sets)</span>
                <span className="text-[#059669] font-semibold text-[10px]">READY</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Generated Output Files</div>
            <div className="space-y-1.5 text-xs">
              <div
                onClick={() => handleRunCommand('export txt')}
                className="p-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded hover:border-[#CBD5E1] cursor-pointer flex items-center justify-between transition-colors"
              >
                <span className="font-mono text-[10px] text-[#172033]">reports/{target}_report.txt</span>
                <Download className="w-3 h-3 text-[#64748B]" />
              </div>
              <div
                onClick={() => handleRunCommand('export json')}
                className="p-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded hover:border-[#CBD5E1] cursor-pointer flex items-center justify-between transition-colors"
              >
                <span className="font-mono text-[10px] text-[#172033]">reports/{target}_data.json</span>
                <Download className="w-3 h-3 text-[#64748B]" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] text-[10px] text-[#94A3B8]">
          Press <kbd className="font-mono bg-[#F1F5F9] px-1 rounded text-[#475569]">↑</kbd> / <kbd className="font-mono bg-[#F1F5F9] px-1 rounded text-[#475569]">↓</kbd> for command history. <kbd className="font-mono bg-[#F1F5F9] px-1 rounded text-[#475569]">Tab</kbd> to autocomplete.
        </div>
      </div>
    </div>
  );
};
