import React, { useState, useEffect } from 'react';
import { AppProvider } from './services/store';
import { AuthGate } from './components/auth/AuthGate';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { NewAssessmentPage } from './pages/NewAssessmentPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { AssessmentWorkspacePage } from './pages/AssessmentWorkspacePage';
import { ReconnaissancePage } from './pages/ReconnaissancePage';
import { ScanningPage } from './pages/ScanningPage';
import { TerminalPage } from './pages/TerminalPage';
import { FindingsPage } from './pages/FindingsPage';
import { AssetInventoryPage } from './pages/AssetInventoryPage';
import { EvidenceVaultPage } from './pages/EvidenceVaultPage';
import { TimelinePage } from './pages/TimelinePage';
import { ReportsPage } from './pages/ReportsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { ScanHistoryPage } from './pages/ScanHistoryPage';
import { TeamPage } from './pages/TeamPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';

const AppContent: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname && window.location.pathname !== '/'
      ? window.location.pathname
      : '/dashboard';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentRoute(path && path !== '/' ? path : '/dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matching
  const renderCurrentPage = () => {
    if (currentRoute === '/' || currentRoute === '/dashboard') {
      return <DashboardPage navigate={navigate} />;
    }
    if (currentRoute === '/assessments/new') {
      return <NewAssessmentPage navigate={navigate} />;
    }
    if (currentRoute.startsWith('/assessments/ASM-')) {
      const id = currentRoute.split('/')[2];
      return <AssessmentWorkspacePage assessmentId={id} navigate={navigate} />;
    }
    if (currentRoute === '/assessments') {
      return <AssessmentsPage navigate={navigate} />;
    }
    if (currentRoute === '/recon') {
      return <ReconnaissancePage navigate={navigate} />;
    }
    if (currentRoute === '/scanning') {
      return <ScanningPage navigate={navigate} />;
    }
    if (currentRoute === '/terminal') {
      return <TerminalPage navigate={navigate} />;
    }
    if (currentRoute === '/findings') {
      return <FindingsPage navigate={navigate} />;
    }
    if (currentRoute === '/assets') {
      return <AssetInventoryPage navigate={navigate} />;
    }
    if (currentRoute === '/evidence') {
      return <EvidenceVaultPage navigate={navigate} />;
    }
    if (currentRoute === '/timeline') {
      return <TimelinePage navigate={navigate} />;
    }
    if (currentRoute === '/reports') {
      return <ReportsPage navigate={navigate} />;
    }
    if (currentRoute === '/integrations') {
      return <IntegrationsPage navigate={navigate} />;
    }
    if (currentRoute === '/templates') {
      return <TemplatesPage navigate={navigate} />;
    }
    if (currentRoute === '/scan-history') {
      return <ScanHistoryPage navigate={navigate} />;
    }
    if (currentRoute === '/team') {
      return <TeamPage navigate={navigate} />;
    }
    if (currentRoute === '/audit-logs') {
      return <AuditLogsPage navigate={navigate} />;
    }
    if (currentRoute === '/settings') {
      return <SettingsPage navigate={navigate} />;
    }
    if (currentRoute === '/help') {
      return <HelpPage navigate={navigate} />;
    }

    // Default fallback
    return <DashboardPage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] text-[#0F172A]">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        navigate={navigate}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Persistent Top Navbar */}
        <TopNavbar
          currentRoute={currentRoute}
          navigate={navigate}
          onOpenSearch={() => setSearchModalOpen(true)}
        />

        {/* Routed Page Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Global Search Palette Modal (⌘K) */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        navigate={navigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AuthGate>
        <AppContent />
      </AuthGate>
    </AppProvider>
  );
}
