import React from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Network, 
  Server, 
  ShieldAlert, 
  FileText, 
  Settings, 
  ShieldCheck,
  Radio
} from 'lucide-react';

export type NavPage = 'dashboard' | 'incidents' | 'network' | 'assets' | 'vulnerabilities' | 'reports' | 'settings';

interface SidebarProps {
  activePage: NavPage;
  onSelectPage: (page: NavPage) => void;
  criticalIncidentCount: number;
  criticalVulnCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  criticalIncidentCount,
  criticalVulnCount
}) => {
  const navItems = [
    { id: 'dashboard' as NavPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'incidents' as NavPage, label: 'Incidents', icon: AlertTriangle, badge: criticalIncidentCount, badgeColor: 'bg-[#FF000F] text-white' },
    { id: 'network' as NavPage, label: 'Network', icon: Network },
    { id: 'assets' as NavPage, label: 'Assets', icon: Server },
    { id: 'vulnerabilities' as NavPage, label: 'Vulnerabilities', icon: ShieldAlert, badge: criticalVulnCount, badgeColor: 'bg-[#E8590C] text-white' },
    { id: 'reports' as NavPage, label: 'Reports', icon: FileText },
    { id: 'settings' as NavPage, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#12151A] text-[#CED4DA] flex flex-col flex-shrink-0 border-r border-[#262B34] select-none h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-[#262B34] bg-[#0E1015]">
        <div className="flex items-center gap-3">
          {/* ABB Style Red Badge */}
          <div className="w-9 h-9 bg-[#FF000F] flex items-center justify-center font-bold text-white tracking-tighter text-sm shadow-sm rounded-none border border-red-400">
            ABB
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-semibold tracking-wider uppercase font-mono">
              Security Operations
            </span>
            <span className="text-[10px] text-[#868E96] font-mono tracking-tight flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SOC CLUSTER ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#6C757D]">
          Operational Views
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-sm transition-colors text-left ${
                isActive
                  ? 'bg-[#1E232C] text-white border-l-2 border-[#FF000F]'
                  : 'text-[#ADB5BD] hover:text-white hover:bg-[#1A1E26] border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF000F]' : 'text-[#868E96]'}`} />
                <span className="tracking-wide">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-sm ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Industrial SOC System Status Widget */}
      <div className="p-3 m-2 bg-[#181C23] border border-[#262B34] rounded-sm text-[11px] font-mono text-[#868E96] space-y-2">
        <div className="flex items-center justify-between border-b border-[#262B34] pb-1.5">
          <span className="flex items-center gap-1.5 text-white font-medium">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            TELEMETRY FEED
          </span>
          <span className="text-emerald-400 text-[10px]">100% SYNC</span>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="flex justify-between">
            <span>DEFCON Level:</span>
            <span className="text-amber-400 font-semibold">3 (ELEVATED)</span>
          </div>
          <div className="flex justify-between">
            <span>Active Shift:</span>
            <span className="text-[#DEE2E6]">Alpha / 08:00-16:00</span>
          </div>
          <div className="flex justify-between">
            <span>Duty Lead:</span>
            <span className="text-[#DEE2E6]">J. Vance (Tier 3)</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#262B34] flex items-center justify-between text-[10px] text-[#6C757D] font-mono bg-[#0E1015]">
        <span>ABB CyberOps v4.2</span>
        <span className="text-[#495057]">EN50156-CERT</span>
      </div>
    </aside>
  );
};
