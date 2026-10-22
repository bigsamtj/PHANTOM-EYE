import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  PlusCircle,
  Server,
  Radar,
  Activity,
  Bug,
  FolderLock,
  FileText,
  Terminal,
  Blocks,
  FileCode2,
  History,
  Users,
  ScrollText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../services/store';

interface SidebarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  navigate,
  collapsed,
  setCollapsed,
}) => {
  const { assessments, findings, jobs, assets } = useApp();

  const openFindingsCount = findings.filter((f) => f.status === 'Open' || f.status === 'Under Review').length;
  const runningJobsCount = jobs.filter((j) => j.status === 'Running').length;

  const workspaceNav = [
    { label: 'Overview', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Assessments', route: '/assessments', icon: ShieldAlert, badge: assessments.length > 0 ? assessments.length : undefined },
    { label: 'New Assessment', route: '/assessments/new', icon: PlusCircle, isPrimary: true },
    { label: 'Asset Inventory', route: '/assets', icon: Server, badge: assets.length > 0 ? assets.length : undefined },
    { label: 'Reconnaissance', route: '/recon', icon: Radar },
    { label: 'Scan & Enumeration', route: '/scanning', icon: Activity, badge: runningJobsCount > 0 ? `${runningJobsCount} active` : undefined },
    { label: 'Findings', route: '/findings', icon: Bug, badge: openFindingsCount > 0 ? openFindingsCount : undefined, badgeColor: 'bg-[#DC2626] text-white' },
    { label: 'Evidence Vault', route: '/evidence', icon: FolderLock },
    { label: 'Reports', route: '/reports', icon: FileText },
  ];

  const operationsNav = [
    { label: 'Terminal Simulator', route: '/terminal', icon: Terminal, highlight: true },
    { label: 'Integrations & Telegram', route: '/integrations', icon: Blocks },
    { label: 'Assessment Templates', route: '/templates', icon: FileCode2 },
    { label: 'Scan History', route: '/scan-history', icon: History },
  ];

  const adminNav = [
    { label: 'Team & RBAC', route: '/team', icon: Users },
    { label: 'Audit Logs', route: '/audit-logs', icon: ScrollText },
    { label: 'Platform Settings', route: '/settings', icon: Settings },
    { label: 'Documentation', route: '/help', icon: HelpCircle },
  ];

  const renderNavItem = (item: {
    label: string;
    route: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
    isPrimary?: boolean;
    highlight?: boolean;
  }) => {
    const Icon = item.icon;
    const isActive = currentRoute === item.route || (item.route !== '/dashboard' && currentRoute.startsWith(item.route) && item.route !== '/assessments');

    return (
      <button
        key={item.route}
        onClick={() => navigate(item.route)}
        title={collapsed ? item.label : undefined}
        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all text-left relative group cursor-pointer ${
          isActive
            ? 'bg-[#E32936] text-white shadow-xs font-semibold'
            : item.isPrimary
            ? 'text-[#E32936] hover:bg-[#FEF2F2] hover:text-[#C91E2B] font-semibold'
            : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
        }`}
      >
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.isPrimary ? 'text-[#E32936]' : 'text-[#64748B] group-hover:text-[#0F172A]'}`} />
        {!collapsed && <span className="truncate flex-1">{item.label}</span>}
        {!collapsed && item.badge !== undefined && (
          <span
            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full shrink-0 ${
              item.badgeColor || (isActive ? 'bg-black/20 text-white' : 'bg-[#E2E8F0] text-[#475569]')
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className={`bg-white border-r border-[#E2E8F0] flex flex-col transition-all duration-200 z-30 shrink-0 select-none shadow-xs ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 border-b border-[#E2E8F0] px-4 flex items-center justify-between">
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E32936] flex items-center justify-center shrink-0 shadow-xs">
            <Eye className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-wider text-[#0F172A] flex items-center gap-1">
                PHANTOM<span className="text-[#E32936]">EYE</span>
              </span>
              <span className="text-[10px] text-[#64748B] font-mono tracking-tight uppercase">
                ENTERPRISE // v1.0
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Operator Admin Identity Card */}
      {!collapsed && (
        <div className="mx-3 mt-3 p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#E32936] text-white flex items-center justify-center font-black text-xs shrink-0">
            BS
          </div>
          <div className="overflow-hidden flex-1">
            <div className="text-xs font-black text-[#0F172A] truncate flex items-center gap-1">
              <span>BIG SAM</span>
              <ShieldCheck className="w-3 h-3 text-[#059669]" />
            </div>
            <div className="text-[10px] text-[#64748B] truncate">Master Administrator</div>
          </div>
        </div>
      )}

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        <div>
          {!collapsed && (
            <h3 className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
              Workspace
            </h3>
          )}
          <div className="space-y-1">{workspaceNav.map(renderNavItem)}</div>
        </div>

        <div>
          {!collapsed && (
            <h3 className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
              Operations
            </h3>
          )}
          <div className="space-y-1">{operationsNav.map(renderNavItem)}</div>
        </div>

        <div>
          {!collapsed && (
            <h3 className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
              Administration
            </h3>
          )}
          <div className="space-y-1">{adminNav.map(renderNavItem)}</div>
        </div>
      </div>

      {/* Bottom Mode Status Badge */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
              Live Assessment Engine
            </span>
            <span className="font-mono text-[10px] bg-[#E2E8F0] px-1.5 py-0.5 rounded text-[#0F172A] font-bold">
              ACTIVE
            </span>
          </div>
        ) : (
          <div className="flex justify-center" title="Live Assessment Engine: Active">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse"></span>
          </div>
        )}
      </div>
    </aside>
  );
};
