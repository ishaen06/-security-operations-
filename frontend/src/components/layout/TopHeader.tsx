import React, { useState, useEffect, useRef } from 'react';
import { AbbLogo } from '../common/AbbLogo';
import { 
  Clock, 
  X, 
  AlertTriangle, 
  LayoutDashboard,
  Server,
  Network as NetworkIcon,
  ShieldAlert,
  FileText,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Menu,
  ChevronRight
} from 'lucide-react';

export type NavPage = 'dashboard' | 'incidents' | 'network' | 'assets' | 'vulnerabilities' | 'reports' | 'settings';

interface TopHeaderProps {
  activePage: NavPage;
  onSelectPage: (page: NavPage) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  criticalIncidentCount: number;
  criticalVulnCount: number;
  onNavigateToIncident?: (incidentId: string) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onOpenLiveTraffic?: () => void;
  isDrillActive?: boolean;
  onOpenIncidentReport?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activePage,
  onSelectPage,
  searchQuery,
  onSearchChange,
  criticalIncidentCount,
  criticalVulnCount,
  onNavigateToIncident,
  isDarkMode = false,
  onToggleTheme,
  onOpenLiveTraffic,
  isDrillActive = false,
  onOpenIncidentReport
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isLiveAttackActive, setIsLiveAttackActive] = useState<boolean>(false);
  const navMenuRef = useRef<HTMLDivElement>(null);

  // Listen for simulated attack events across the platform
  useEffect(() => {
    const handleAttackEvent = (e: any) => {
      if (e.detail) {
        setIsLiveAttackActive(!!e.detail.isAttacking);
      }
    };
    window.addEventListener('abb_attack_state', handleAttackEvent);
    return () => window.removeEventListener('abb_attack_state', handleAttackEvent);
  }, []);

  useEffect(() => {
    const updateUtc = () => {
      const now = new Date();
      const utcStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      setCurrentTime(utcStr);
    };
    updateUtc();
    const timer = setInterval(updateUtc, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close collapsible menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navMenuRef.current && !navMenuRef.current.contains(e.target as Node)) {
        setIsNavOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsNavOpen(false);
    };
    if (isNavOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNavOpen]);

  const navItems = [
    { 
      id: 'dashboard' as NavPage, 
      label: 'Dashboard', 
      desc: 'KPIs, Outrun hero & telemetry summary',
      icon: LayoutDashboard,
      badge: 0
    },
    { 
      id: 'incidents' as NavPage, 
      label: 'Incidents', 
      desc: 'Live alerts, triage & ISO 27035 containment',
      icon: AlertTriangle, 
      badge: criticalIncidentCount,
      badgeColor: 'bg-[#FF000F] text-white'
    },
    { 
      id: 'network' as NavPage, 
      label: 'Network', 
      desc: 'Interactive topology & host inspection',
      icon: NetworkIcon,
      badge: 0
    },
    { 
      id: 'assets' as NavPage, 
      label: 'Assets', 
      desc: 'CMDB hardware inventory & sensors',
      icon: Server,
      badge: 0
    },
    { 
      id: 'vulnerabilities' as NavPage, 
      label: 'Vulnerabilities', 
      desc: 'CVSS v3.1 register & CISA KEV catalog',
      icon: ShieldAlert, 
      badge: criticalVulnCount,
      badgeColor: 'bg-[#E8590C] text-white'
    },
    { 
      id: 'reports' as NavPage, 
      label: 'Reports', 
      desc: 'Formal security dossiers & audit export',
      icon: FileText,
      badge: 0
    },
    { 
      id: 'settings' as NavPage, 
      label: 'Settings', 
      desc: 'Thresholds, SIEM rules & preferences',
      icon: SettingsIcon,
      badge: 0
    },
  ];



  return (
    <header className="bg-white border-b border-[#E2E6EA] sticky top-0 z-40 shadow-industrial">
      {/* Primary Top Bar (Matching official ABB corporate header) */}
      <div className="h-16 px-6 lg:px-8 flex items-center justify-between border-b border-[#F1F3F5]">
        {/* Left: Just the ABB Logo */}
        <div className="flex items-center">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onSelectPage('dashboard'); }} 
            className="flex items-center"
            title="ABB"
          >
            {/* The Real Official ABB Logo */}
            <AbbLogo className="h-7 w-auto hover:opacity-95 transition-opacity" />
          </a>
        </div>

        {/* Right: Controls matching ABB corporate bar */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* UTC Clock Ticker (Border & Box Outline Removed) */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-[#495057] dark:text-[#9BA3AF] px-2 py-1">
            <Clock className="w-3.5 h-3.5 text-[#6C757D]" />
            <span>{currentTime || 'UTC'}</span>
          </div>

          {/* Incident Threat Telemetry Report Button on Top Task Bar */}
          {onOpenIncidentReport && (
            <button
              onClick={onOpenIncidentReport}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-mono font-bold rounded-sm transition-all border ${
                isLiveAttackActive || isDrillActive
                  ? 'bg-red-50 dark:bg-red-950/40 border-[#FF000F] text-[#FF000F] shadow-sm animate-pulse'
                  : 'bg-[#F8F9FA] dark:bg-[#1B2027] border-[#CED4DA] dark:border-[#343B45] text-[#181B1F] dark:text-white hover:border-[#FF000F]'
              }`}
              title="Open Comprehensive Security Incident, Threat Vector & DNS Telemetry Report"
            >
              <FileText className="w-3.5 h-3.5 text-[#FF000F]" />
              <span className="hidden sm:inline">Incident Report</span>
              <span className="sm:hidden">Report</span>
              {(isLiveAttackActive || isDrillActive) && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF000F]" />
              )}
            </button>
          )}

          {/* Dark / Light Mode Toggle Button (matching media_1789113077931.png position) */}
          <button 
            onClick={onToggleTheme}
            className="p-2 text-[#495057] hover:text-[#181B1F] hover:bg-[#F1F3F5] rounded-sm transition-colors flex items-center justify-center text-xs font-mono"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark or Light Mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-[#181B1F] dark:text-white hover:text-black transition-colors" />
            ) : (
              <Moon className="w-4 h-4 text-[#181B1F] dark:text-white hover:text-black transition-colors" />
            )}
          </button>

          {/* Collapsible Navigation Bar (Top Right Corner - 3 lines only, Border & Box Outline Removed) */}
          <div className="relative" ref={navMenuRef}>
            <button
              onClick={() => setIsNavOpen(prev => !prev)}
              className={`p-2 rounded-sm transition-all flex items-center justify-center ${
                isNavOpen
                  ? 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F]'
                  : 'hover:bg-[#F1F3F5] dark:hover:bg-[#1F242C]'
              }`}
              title="Toggle Navigation Menu"
              aria-label="Navigation Menu"
              aria-expanded={isNavOpen}
            >
              {isNavOpen ? (
                <X className="w-5 h-5 text-[#FF000F]" />
              ) : (
                <Menu className="w-5 h-5 text-[#FF000F]" />
              )}
            </button>

            {/* Collapsible Navigation Dropdown Panel */}
            {isNavOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm shadow-2xl p-3 z-50 animate-fadeIn">
                {/* Panel Header */}
                <div className="pb-2.5 mb-2 border-b border-[#E2E6EA] dark:border-[#282D35]">
                  <div className="w-8 h-1 bg-[#FF000F] mb-1.5" />
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-outrun uppercase text-[10px] font-bold tracking-widest text-[#FF000F]">
                        ABB CYBEROPS
                      </span>
                      <h3 className="font-sans font-bold text-sm text-[#181B1F] dark:text-white">
                        Platform Navigation
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#CED4DA] dark:border-[#343B45] text-[#6C757D] dark:text-[#9BA3AF] rounded-xs">
                      {navItems.length} modules
                    </span>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectPage(item.id);
                          setIsNavOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-sm text-left transition-colors group ${
                          isActive
                            ? 'bg-[#FFF1F2] dark:bg-[#2A1517] border-l-2 border-[#FF000F]'
                            : 'hover:bg-[#F8F9FA] dark:hover:bg-[#1F242C] text-[#495057] dark:text-[#CBD5E1]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-xs ${
                            isActive
                              ? 'text-[#FF000F] bg-white dark:bg-[#181B1F]'
                              : 'text-[#6C757D] dark:text-[#9BA3AF] group-hover:text-[#181B1F] dark:group-hover:text-white'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className={`text-xs font-sans font-bold ${
                              isActive ? 'text-[#FF000F]' : 'text-[#181B1F] dark:text-white'
                            }`}>
                              {item.label}
                            </div>
                            <div className="text-[10px] font-sans text-[#6C757D] dark:text-[#9BA3AF]">
                              {item.desc}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.badge > 0 && (
                            <span className={`px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-xs ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF000F]' : 'text-[#CED4DA] dark:text-[#343B45] group-hover:text-[#181B1F] dark:group-hover:text-white'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </header>
  );
};
