import React from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Network as NetworkIcon, 
  Server, 
  ShieldAlert, 
  FileText, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { NavPage } from './TopHeader';

interface NavRailProps {
  activePage: NavPage;
  onSelectPage: (page: NavPage) => void;
  criticalIncidentCount: number;
  criticalVulnCount: number;
}

export const NavRail: React.FC<NavRailProps> = ({
  activePage,
  onSelectPage,
  criticalIncidentCount,
  criticalVulnCount
}) => {
  const navItems = [
    { 
      id: 'dashboard' as NavPage, 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: 0
    },
    { 
      id: 'incidents' as NavPage, 
      label: 'Incidents', 
      icon: AlertTriangle, 
      badge: criticalIncidentCount,
      badgeColor: 'bg-[#FF000F] text-white'
    },
    { 
      id: 'network' as NavPage, 
      label: 'Network', 
      icon: NetworkIcon,
      badge: 0
    },
    { 
      id: 'assets' as NavPage, 
      label: 'Assets', 
      icon: Server,
      badge: 0
    },
    { 
      id: 'vulnerabilities' as NavPage, 
      label: 'Vulnerabilities', 
      icon: ShieldAlert, 
      badge: criticalVulnCount,
      badgeColor: 'bg-[#E8590C] text-white'
    },
    { 
      id: 'reports' as NavPage, 
      label: 'Reports', 
      icon: FileText,
      badge: 0
    },
    { 
      id: 'settings' as NavPage, 
      label: 'Settings', 
      icon: SettingsIcon,
      badge: 0
    },
  ];

  return (
    <aside 
      className="w-16 bg-white dark:bg-[#16191E] border-r border-[#E2E6EA] dark:border-[#282D35] flex flex-col items-center py-4 flex-shrink-0 select-none z-30 transition-colors"
      aria-label="Sidebar Navigation"
    >
      {/* Home / Top Icon */}
      <button
        onClick={() => onSelectPage('dashboard')}
        className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors relative group ${
          activePage === 'dashboard'
            ? 'text-[#FF000F] bg-[#FFF1F2] dark:bg-[#2A1517]'
            : 'text-[#495057] dark:text-[#9CA3AF] hover:text-[#181B1F] dark:hover:text-white hover:bg-[#F1F3F5] dark:hover:bg-[#222730]'
        }`}
        title="Dashboard"
      >
        <LayoutDashboard className="w-5 h-5" />
        
        {/* Tooltip */}
        <span className="absolute left-full ml-2 px-2 py-1 bg-[#181B1F] text-white text-[11px] font-mono rounded-sm shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          Dashboard
        </span>
      </button>

      {/* Thin Horizontal Divider matching media_1789113363033.png */}
      <div className="w-8 h-px bg-[#E2E6EA] dark:bg-[#282D35] my-3"></div>

      {/* Main Navigation Icons List */}
      <div className="flex flex-col items-center space-y-2 flex-1">
        {navItems.slice(1).map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-10 h-10 rounded-sm border flex items-center justify-center transition-all relative group ${
                isActive
                  ? 'border-[#FF000F] text-[#FF000F] bg-[#FFF1F2] dark:bg-[#2A1517] font-bold shadow-sm'
                  : 'border-[#CED4DA] dark:border-[#373E48] text-[#495057] dark:text-[#9CA3AF] hover:text-[#181B1F] dark:hover:text-white hover:border-[#181B1F] dark:hover:border-white hover:bg-[#F8F9FA] dark:hover:bg-[#222730]'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4" />

              {/* Badge Counter if > 0 */}
              {item.badge > 0 && (
                <span 
                  className={`absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-mono font-bold flex items-center justify-center ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-[#181B1F] text-white text-[11px] font-mono rounded-sm shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
