import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Activity,
  Radio,
  Sun,
  Clock,
  LogOut,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../services/store';

interface TopNavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onOpenSearch: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ currentRoute, navigate, onOpenSearch }) => {
  const {
    currentEnvironment,
    setCurrentEnvironment,
    jobs,
    currentUser,
    timeline,
    assessments,
    resetToBlankState,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [envMenuOpen, setEnvMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Live host system clock
  const [systemClock, setSystemClock] = useState<string>(() => {
    return new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemClock(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const runningJob = jobs.find((j) => j.status === 'Running');

  // Breadcrumbs calculation
  const getBreadcrumbs = () => {
    const parts = currentRoute.split('/').filter(Boolean);
    if (parts.length === 0) return ['Overview'];
    return parts.map((part) => {
      if (part.startsWith('ASM-')) return part;
      return part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ');
    });
  };

  const breadcrumbs = getBreadcrumbs();

  const handleSignOut = () => {
    localStorage.removeItem('phantom_eye_auth_session');
    window.location.reload();
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs select-none">
      {/* Breadcrumbs & Title */}
      <div className="flex items-center gap-3">
        <nav className="flex items-center text-xs text-[#64748B]">
          <span
            onClick={() => navigate('/dashboard')}
            className="hover:text-[#0F172A] cursor-pointer font-bold text-[#E32936]"
          >
            PHANTOM EYE
          </span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span className="mx-2 text-[#CBD5E1]">/</span>
              <span
                className={`font-semibold ${
                  idx === breadcrumbs.length - 1 ? 'text-[#0F172A]' : 'hover:text-[#0F172A] cursor-pointer text-[#64748B]'
                }`}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        {/* Live Host System Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium text-[#475569] bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]" title="Current Host System Time">
          <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>{systemClock}</span>
        </div>

        {/* Global Search Bar */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-all w-40 sm:w-56 text-left shadow-2xs"
        >
          <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="flex-1 truncate">Search targets, findings...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-[#E2E8F0] rounded font-mono text-[#64748B]">
            ⌘K
          </kbd>
        </button>

        {/* Crisp Light Mode Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#0F172A] bg-[#FFFBEB] rounded-lg border border-[#FDE68A]">
          <Sun className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Light Mode</span>
        </div>

        {/* Running Assessment Indicator */}
        {runningJob ? (
          <button
            onClick={() => navigate('/scanning')}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-[#FEF2F2] border border-[#FEE2E2] text-[#E32936] rounded-lg text-xs font-medium hover:bg-[#FEE2E2] transition-colors"
            title="Active assessment scan executing."
          >
            <Activity className="w-3.5 h-3.5 text-[#E32936] animate-pulse" />
            <span className="truncate max-w-[110px] font-mono">{runningJob.target}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E32936] animate-ping"></span>
          </button>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-[#059669] bg-[#ECFDF5] rounded-lg border border-[#A7F3D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
            <span>Live Engine Ready</span>
          </div>
        )}

        {/* Clear to Blank State Option (If assessments exist) */}
        {assessments.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Reset all assessment data to a blank state?')) {
                resetToBlankState();
                navigate('/dashboard');
              }
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#64748B] hover:text-[#DC2626] bg-[#F8FAFC] hover:bg-[#FEF2F2] rounded-lg border border-[#E2E8F0] hover:border-[#FEE2E2] transition-colors"
            title="Wipe assessments and return to blank state"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[11px] font-medium">Reset Blank</span>
          </button>
        )}

        {/* Environment Badge / Selector */}
        <div className="relative">
          <button
            onClick={() => setEnvMenuOpen(!envMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-semibold text-[#0F172A] border border-[#E2E8F0] transition-colors"
          >
            <Radio className="w-3 h-3 text-[#059669]" />
            <span className="hidden sm:inline">{currentEnvironment}</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {envMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-50 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold text-[#94A3B8] uppercase">
                Testing Environment
              </div>
              {[
                { name: 'Authorized Staging', desc: 'Pre-production verified testing envelope' },
                { name: 'Demonstration Lab', desc: 'Safe simulation & diagnostics' },
                { name: 'Authorized Production', desc: 'Signed legal authorization ticket' },
              ].map((env) => (
                <button
                  key={env.name}
                  onClick={() => {
                    setCurrentEnvironment(env.name as any);
                    setEnvMenuOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    currentEnvironment === env.name
                      ? 'bg-[#FEF2F2] text-[#E32936] font-bold'
                      : 'hover:bg-[#F8FAFC] text-[#0F172A]'
                  }`}
                >
                  <div>{env.name}</div>
                  <div className="text-[10px] text-[#64748B] font-normal">{env.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {timeline.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E32936]"></span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <span className="font-bold text-[#0F172A]">System Notifications</span>
                <span className="text-[10px] text-[#059669] font-medium">All engines nominal</span>
              </div>
              <div className="divide-y divide-[#E2E8F0] max-h-60 overflow-y-auto">
                {timeline.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#94A3B8]">
                    No activity recorded yet.
                  </div>
                ) : (
                  timeline.slice(0, 5).map((item) => (
                    <div key={item.id} className="py-2.5">
                      <div className="font-semibold text-[#0F172A]">{item.eventType.replace(/_/g, ' ')}</div>
                      <div className="text-[11px] text-[#64748B] truncate">{item.summary}</div>
                      <div className="text-[9px] text-[#94A3B8] font-mono mt-0.5">
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Just now'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Administrator BIG SAM Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] text-xs font-medium text-[#0F172A]"
          >
            <div className="w-7 h-7 rounded-lg bg-[#E32936] text-white flex items-center justify-center font-black text-xs shadow-xs">
              BS
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="leading-tight font-extrabold text-[#0F172A]">BIG SAM</span>
              <span className="text-[10px] text-[#E32936] font-semibold">Administrator</span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-2 z-50 text-xs">
              <div className="px-2.5 py-2 border-b border-[#E2E8F0] mb-1">
                <div className="flex items-center gap-1.5 font-black text-[#0F172A]">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>BIG SAM</span>
                </div>
                <div className="text-[10px] text-[#64748B] font-mono">bigsam@phantomeye.sec</div>
                <span className="inline-block mt-1 px-1.5 py-0.2 text-[9px] font-bold bg-[#FEF2F2] text-[#E32936] rounded border border-[#FEE2E2]">
                  SOLE AUTHORIZED COMMANDER
                </span>
              </div>

              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#0F172A] font-medium"
              >
                Platform Settings &amp; KMS
              </button>
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  navigate('/audit-logs');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#0F172A] font-medium"
              >
                Security Audit Logs
              </button>
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  navigate('/team');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#0F172A] font-medium"
              >
                RBAC Access Control
              </button>

              <div className="pt-1 mt-1 border-t border-[#E2E8F0]">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEF2F2] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock Console / Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
