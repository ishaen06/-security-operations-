import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  ShieldCheck, 
  Clock, 
  Activity,
  CheckCircle2,
  X,
  AlertTriangle
} from 'lucide-react';
import { NavPage } from './Sidebar';

interface TopNavbarProps {
  activePage: NavPage;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateToIncident?: (incidentId: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activePage,
  searchQuery,
  onSearchChange,
  onNavigateToIncident
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

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

  const getPageTitle = (page: NavPage) => {
    switch (page) {
      case 'dashboard':
        return { title: 'Security Overview', subtitle: 'Real-time telemetry, threat alerts, and network health monitoring' };
      case 'incidents':
        return { title: 'Incident Response Management', subtitle: 'Triage, containment protocols, and forensic investigation timeline' };
      case 'network':
        return { title: 'Network Topology & Zone Segmentation', subtitle: 'Perimeter firewalls, distribution routers, and subnet telemetry' };
      case 'assets':
        return { title: 'Asset Inventory & Endpoint Status', subtitle: 'Enterprise host monitoring, service mapping, and vulnerability risk' };
      case 'vulnerabilities':
        return { title: 'Vulnerability Management & CVSS Register', subtitle: 'Identified CVE exposures, system impact, and remediation playbooks' };
      case 'reports':
        return { title: 'Incident Reports & Forensic Dossiers', subtitle: 'Formal compliance records, breach post-mortems, and audit logs' };
      case 'settings':
        return { title: 'Security Policies & Node Configuration', subtitle: 'Firewall rules, detection thresholds, webhooks, and preferences' };
    }
  };

  const { title, subtitle } = getPageTitle(activePage);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Critical Alert: Cobalt Strike Beaconing',
      time: '12:14 UTC',
      host: 'abb-plm-srv01 (192.168.20.14)',
      critical: true,
      incidentId: 'INC-2026-8841'
    },
    {
      id: 'notif-2',
      title: 'OT Cross-Zone Violation Detected',
      time: '10:32 UTC',
      host: 'scada-plc-sub01 (192.168.40.12)',
      critical: true,
      incidentId: 'INC-2026-8835'
    },
    {
      id: 'notif-3',
      title: 'Perimeter NGFW Rule Updated',
      time: '08:15 UTC',
      host: 'Palo Alto Edge #882',
      critical: false,
      incidentId: 'INC-2026-8828'
    }
  ];

  return (
    <header className="h-16 bg-white border-b border-[#E2E6EA] flex items-center justify-between px-6 sticky top-0 z-30 shadow-industrial">
      {/* Title & Context */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#6C757D]">ABB CyberOps</span>
          <span className="text-[#ADB5BD]">/</span>
          <h1 className="text-sm font-bold text-[#181B1F] tracking-tight font-mono uppercase">
            {title}
          </h1>
        </div>
        <p className="text-[11px] text-[#5A626E] hidden md:block">
          {subtitle}
        </p>
      </div>

      {/* Center Global Search */}
      <div className="relative w-72 lg:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-3.5 w-3.5 text-[#6C757D]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by IP, Hostname, CVE, or Incident ID..."
          className="w-full pl-9 pr-8 py-1.5 bg-[#F8F9FA] border border-[#CED4DA] focus:border-[#FF000F] focus:bg-white text-xs font-mono text-[#181B1F] rounded-sm placeholder-[#6C757D] outline-none transition-colors"
        />
        {searchQuery ? (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[10px] font-mono text-[#ADB5BD] pointer-events-none">
            Ctrl+K
          </span>
        )}
      </div>

      {/* Right Controls: Environment, Time, Notifications, User */}
      <div className="flex items-center gap-4">
        {/* Environment Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[#495057] font-medium">CLUSTER:</span>
          <span className="text-[#181B1F] font-semibold">ABB-PROD-ZURICH</span>
        </div>

        {/* UTC Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-[#495057] px-2 py-1 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm">
          <Clock className="w-3.5 h-3.5 text-[#6C757D]" />
          <span>{currentTime || 'SYNCHRONIZING UTC...'}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-1.5 rounded-sm text-[#495057] hover:text-[#181B1F] hover:bg-[#F1F3F5] border border-transparent hover:border-[#DEE2E6] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF000F] rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#CED4DA] rounded-sm shadow-industrial-md z-50 animate-in fade-in slide-in-from-top-1 duration-100">
              <div className="px-3 py-2 border-b border-[#E2E6EA] flex items-center justify-between bg-[#F8F9FA]">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F]">
                  Active Security Alerts
                </span>
                <span className="text-[10px] font-mono font-semibold text-white bg-[#FF000F] px-1.5 py-0.2 rounded-sm">
                  2 CRITICAL
                </span>
              </div>
              <div className="divide-y divide-[#E9ECEF] max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => {
                      if (onNavigateToIncident && n.incidentId) {
                        onNavigateToIncident(n.incidentId);
                      }
                      setNotificationsOpen(false);
                    }}
                    className="p-3 hover:bg-[#F8F9FA] cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-1.5">
                        {n.critical ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#FF000F] flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-xs font-medium text-[#181B1F] leading-snug">
                            {n.title}
                          </p>
                          <p className="text-[10px] font-mono text-[#6C757D] mt-0.5">
                            {n.host}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#ADB5BD] whitespace-nowrap">
                        {n.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-[#E2E6EA] bg-[#F8F9FA] text-center">
                <span className="text-[10px] font-mono text-[#6C757D]">
                  All alerts recorded to SIEM audit log
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#DEE2E6]">
          <div className="w-8 h-8 rounded-sm bg-[#1E232C] text-white flex items-center justify-center font-mono text-xs font-semibold border border-[#343A40]">
            JV
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-[#181B1F] leading-tight">
              J. Vance
            </span>
            <span className="text-[10px] font-mono text-[#5A626E]">
              SOC Lead • Tier 3
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
