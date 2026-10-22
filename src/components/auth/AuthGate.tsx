import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Clock, Server, Terminal } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('phantom_eye_auth_session') === 'true';
  });

  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live ticking system clock for real host time display
  const [currentTime, setCurrentTime] = useState<string>(() => {
    return new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const cleanName = adminName.trim();
    const cleanPass = password.trim();

    setTimeout(() => {
      // Sole designated administrator requirement
      if (cleanName === 'BIG SAM' && cleanPass === 'BIG SAM') {
        localStorage.setItem('phantom_eye_auth_session', 'true');
        localStorage.setItem('phantom_eye_admin_name', 'BIG SAM');
        localStorage.setItem('phantom_eye_admin_login_time', new Date().toISOString());
        setIsAuthenticated(true);
      } else {
        setError(
          'Access Denied: Invalid credentials. Only authorized Administrator "BIG SAM" is permitted access to this assessment environment.'
        );
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleQuickFill = () => {
    setAdminName('BIG SAM');
    setPassword('BIG SAM');
    setError(null);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0F172A] flex flex-col justify-between selection:bg-[#E32936] selection:text-white antialiased">
      {/* Top Banner Bar */}
      <header className="h-14 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between text-xs text-[#64748B]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#E32936] flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
            P
          </div>
          <span className="font-extrabold tracking-wider text-[#0F172A] text-sm">
            PHANTOM<span className="text-[#E32936]">EYE</span>
          </span>
          <span className="hidden sm:inline text-[#94A3B8]">|</span>
          <span className="hidden sm:inline font-mono text-[11px] text-[#475569]">
            CYBERSECURITY ASSESSMENT &amp; PENETRATION TESTING COMMAND
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-md border border-[#A7F3D0]">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
            <span>SYSTEM READY</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[#64748B]">
            <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>{currentTime}</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-8 space-y-6 relative overflow-hidden">
          {/* Subtle Top Red Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E32936] via-[#DC2626] to-[#B91C1C]" />

          {/* Icon & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#E32936] shadow-xs mb-1">
              <Shield className="w-6 h-6 text-[#E32936]" />
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
              Administrative Access
            </h1>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
              Authorized security assessment console. Master Administrator authentication required to launch and manage assessments.
            </p>
          </div>

          {/* Designated Administrator Badge */}
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#E32936]" />
              <div>
                <div className="font-bold text-[#0F172A]">Designated Administrator</div>
                <div className="text-[11px] text-[#64748B] font-mono">Operator ID: BIG SAM</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-semibold text-[#E32936] hover:text-[#B91C1C] hover:underline"
              title="Auto-fill BIG SAM credentials"
            >
              Fill Credentials
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3.5 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl flex items-start gap-2.5 text-xs text-[#DC2626] animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-snug font-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Administrative Name
              </label>
              <input
                type="text"
                required
                autoFocus
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Enter Administrator Name"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:border-[#E32936] focus:ring-2 focus:ring-[#FEF2F2] outline-hidden font-medium transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#0F172A]">
                  Master Access Password
                </label>
                <span className="text-[11px] text-[#94A3B8]">Case-sensitive</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Master Password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:border-[#E32936] focus:ring-2 focus:ring-[#FEF2F2] outline-hidden font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-[#E32936] hover:bg-[#C91E2B] active:bg-[#B91C1C] text-white text-xs font-bold rounded-xl shadow-md shadow-[#E32936]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authenticate as BIG SAM</span>
                </>
              )}
            </button>
          </form>

          {/* Security & System Info Footer */}
          <div className="pt-4 border-t border-[#E2E8F0] text-center space-y-2">
            <div className="flex items-center justify-center gap-3 text-[11px] text-[#64748B]">
              <span className="flex items-center gap-1">
                <Server className="w-3 h-3 text-[#94A3B8]" /> Host Engine v1.0
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-[#94A3B8]" /> Real-Time Telemetry
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8]">
              Authorized Operator: <strong className="text-[#0F172A]">BIG SAM</strong>. Unauthorized scanning or access strictly prohibited under international security standards.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 bg-white border-t border-[#E2E8F0] px-6 flex items-center justify-between text-[11px] text-[#94A3B8]">
        <div>
          PHANTOM EYE &copy; {new Date().getFullYear()} &bull; Authorized Penetration Testing Platform
        </div>
        <div className="font-mono text-[10px] text-[#64748B]">
          Admin: BIG SAM &bull; Light Mode &bull; Production Ready
        </div>
      </footer>
    </div>
  );
};
