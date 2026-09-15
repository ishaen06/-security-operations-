import React, { useState, useEffect, useMemo } from 'react';
import { TopHeader, NavPage } from './components/layout/TopHeader';
import { DashboardView } from './views/DashboardView';
import { IncidentsView } from './views/IncidentsView';
import { NetworkView } from './views/NetworkView';
import { AssetsView } from './views/AssetsView';
import { VulnerabilitiesView } from './views/VulnerabilitiesView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { Incident } from './types/cybersecurity';
import { MOCK_INCIDENTS, MOCK_VULNERABILITIES } from './data/mockSecurityData';
import { LiveTrafficModal } from './components/emergency/LiveTrafficModal';
import { ComprehensiveIncidentReportModal } from './components/reports/ComprehensiveIncidentReportModal';
import { getEmergencyDrillIncidents } from './data/emergencyDrillHelper';

export function App() {
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLiveTrafficOpen, setIsLiveTrafficOpen] = useState<boolean>(false);
  const [isEmergencyDrillActive, setIsEmergencyDrillActive] = useState<boolean>(false);
  const [isIncidentReportOpen, setIsIncidentReportOpen] = useState<boolean>(false);
  const [activeAttackSubnet, setActiveAttackSubnet] = useState<string | null>(null);
  const [activeAttackVector, setActiveAttackVector] = useState<string | null>(null);
  const [activeAttackDevice, setActiveAttackDevice] = useState<any | null>(null);

  // Synchronize attack state from topology visualizer across platform
  useEffect(() => {
    const handleAttackState = (e: any) => {
      if (e.detail) {
        if (e.detail.isAttacking) {
          setActiveAttackSubnet(e.detail.subnetId);
          setActiveAttackVector(e.detail.attackType);
          setActiveAttackDevice(e.detail.targetDevice || null);
        } else {
          setActiveAttackSubnet(null);
          setActiveAttackVector(null);
          setActiveAttackDevice(null);
        }
      }
    };
    window.addEventListener('abb_attack_state', handleAttackState);
    return () => window.removeEventListener('abb_attack_state', handleAttackState);
  }, []);
  
  // Theme state: dark / light mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('abb_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('abb_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('abb_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  // Navigation contextual states
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedSubnetCidr, setSelectedSubnetCidr] = useState<string | undefined>(undefined);
  const [selectedReportIncidentId, setSelectedReportIncidentId] = useState<string | null>(null);

  // Dynamic incidents state: injects real CISA KEV + Feodo C2 drill incidents during emergency drills
  const activeIncidents = useMemo(() => {
    if (isEmergencyDrillActive) {
      const drillIncidents = getEmergencyDrillIncidents();
      return [...drillIncidents, ...MOCK_INCIDENTS];
    }
    return MOCK_INCIDENTS;
  }, [isEmergencyDrillActive]);

  // Badge calculations
  const criticalIncidentCount = activeIncidents.filter(i => i.severity === 'Critical').length;
  const criticalVulnCount = MOCK_VULNERABILITIES.filter(v => v.severity === 'Critical').length;

  // Handlers for cross-page deep links
  const handleSelectIncidentFromDashboard = (incident: Incident) => {
    setSelectedIncidentId(incident.id);
  };

  const handleNavigateToIncidents = (incidentId?: string) => {
    if (incidentId) {
      setSelectedIncidentId(incidentId);
    }
    setActivePage('incidents');
  };

  const handleNavigateToNetwork = (subnetCidr?: string) => {
    if (subnetCidr) {
      setSelectedSubnetCidr(subnetCidr);
    }
    setActivePage('network');
  };

  const handleViewReport = (incidentId: string) => {
    setSelectedReportIncidentId(incidentId);
    setActivePage('reports');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#181B1F]">
      {/* Top Header with Real ABB Logo and Global Controls */}
      <TopHeader
        activePage={activePage}
        onSelectPage={(page) => {
          setActivePage(page);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        criticalIncidentCount={criticalIncidentCount}
        criticalVulnCount={criticalVulnCount}
        onNavigateToIncident={handleNavigateToIncidents}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenLiveTraffic={() => setIsLiveTrafficOpen(true)}
        isDrillActive={isEmergencyDrillActive}
        onOpenIncidentReport={() => setIsIncidentReportOpen(true)}
      />

      {/* Main Workspace Layout (Full width without left rail) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1700px] w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardView
              onSelectIncident={handleSelectIncidentFromDashboard}
              onNavigateToIncidents={() => setActivePage('incidents')}
              onNavigateToNetwork={handleNavigateToNetwork}
              onViewReport={handleViewReport}
              searchQuery={searchQuery}
              incidents={activeIncidents}
              isDrillActive={isEmergencyDrillActive}
              onOpenLiveTraffic={() => setIsLiveTrafficOpen(true)}
            />
          )}

          {activePage === 'incidents' && (
            <IncidentsView
              onViewReport={handleViewReport}
              initialSelectedIncidentId={selectedIncidentId}
              searchQuery={searchQuery}
              incidents={activeIncidents}
            />
          )}

          {activePage === 'network' && (
            <NetworkView
              initialSubnetCidr={selectedSubnetCidr}
              onNavigateToIncidents={() => setActivePage('incidents')}
              searchQuery={searchQuery}
            />
          )}

          {activePage === 'assets' && (
            <AssetsView
              searchQuery={searchQuery}
            />
          )}

          {activePage === 'vulnerabilities' && (
            <VulnerabilitiesView
              searchQuery={searchQuery}
            />
          )}

          {activePage === 'reports' && (
            <ReportsView
              initialReportIncidentId={selectedReportIncidentId}
              searchQuery={searchQuery}
            />
          )}

          {activePage === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Live Network Traffic & Emergency Drill Console */}
      <LiveTrafficModal
        isOpen={isLiveTrafficOpen}
        onClose={() => setIsLiveTrafficOpen(false)}
        isDrillActive={isEmergencyDrillActive}
        onToggleEmergencyDrill={() => setIsEmergencyDrillActive(prev => !prev)}
      />

      {/* Comprehensive Security Incident, Threat Vector & DNS Telemetry Report Modal */}
      <ComprehensiveIncidentReportModal
        isOpen={isIncidentReportOpen}
        onClose={() => setIsIncidentReportOpen(false)}
        activeAttackSubnet={activeAttackSubnet}
        activeAttackVector={activeAttackVector}
        activeAttackDevice={activeAttackDevice}
        isDrillActive={isEmergencyDrillActive}
      />

      {/* Minimal Footer */}
      <footer className="no-print bg-white dark:bg-[#16191E] border-t border-[#E2E6EA] dark:border-[#282D35] mt-auto">
        <div className="max-w-[1700px] mx-auto px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-[#6C757D] dark:text-[#9BA3AF]">
          <span>© {new Date().getFullYear()} All Rights Reserved</span>
          <span className="font-medium text-[#181B1F] dark:text-[#F8F9FA]">Ishaen S Bethur • Pragyan Hota</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
