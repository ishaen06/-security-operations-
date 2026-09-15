import React, { useState, useMemo } from 'react';
import { NetworkHost } from '../types/cybersecurity';
import { MOCK_HOSTS, MOCK_SUBNETS } from '../data/mockSecurityData';
import { SeverityBadge } from '../components/common/Badges';
import { AbbCard } from '../components/common/AbbCard';
import { 
  Server, 
  RotateCcw, 
  SlidersHorizontal
} from 'lucide-react';

interface AssetsViewProps {
  searchQuery?: string;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ searchQuery = '' }) => {
  const [subnetFilter, setSubnetFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [osFilter, setOsFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<NetworkHost | null>(null);

  // Extract unique OS types
  const osList = useMemo(() => {
    const set = new Set<string>();
    MOCK_HOSTS.forEach((h: NetworkHost) => {
      const simplified = h.os.split(' ')[0]; // e.g. Ubuntu, Windows, Debian, Cisco
      set.add(simplified);
    });
    return Array.from(set);
  }, []);

  const filteredHosts: NetworkHost[] = useMemo(() => {
    return MOCK_HOSTS.filter((host: NetworkHost) => {
      const q = (localSearch || searchQuery).toLowerCase();
      if (q) {
        const matches = 
          host.hostname.toLowerCase().includes(q) ||
          host.ipAddress.toLowerCase().includes(q) ||
          host.os.toLowerCase().includes(q) ||
          host.openServices.some(s => s.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (subnetFilter !== 'All' && host.subnet !== subnetFilter) return false;
      if (riskFilter !== 'All' && host.riskLevel !== riskFilter) return false;
      if (osFilter !== 'All' && !host.os.startsWith(osFilter)) return false;
      if (statusFilter !== 'All' && host.status !== statusFilter) return false;

      return true;
    });
  }, [subnetFilter, riskFilter, osFilter, statusFilter, localSearch, searchQuery]);

  const resetFilters = () => {
    setSubnetFilter('All');
    setRiskFilter('All');
    setOsFilter('All');
    setStatusFilter('All');
    setLocalSearch('');
  };

  const counts = {
    total: MOCK_HOSTS.length,
    online: MOCK_HOSTS.filter((h: NetworkHost) => h.status === 'Online').length,
    quarantined: MOCK_HOSTS.filter((h: NetworkHost) => h.status === 'Quarantined').length,
    critical: MOCK_HOSTS.filter((h: NetworkHost) => h.riskLevel === 'Critical').length
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ABB Standard KPI Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AbbCard
          title="Asset online availability"
          subtitle="MTD Avg"
          primaryValue={`${counts.online} / ${counts.total}`}
          changeText="99.8% Online"
          changeType="positive"
          progressBar={{
            currentPercent: 99.8,
            currentLabel: 'Nominal endpoints',
            targetLabel: `${counts.quarantined} isolated`
          }}
        />

        <AbbCard
          title="Operating system compliance"
          subtitle="24h Window"
          primaryValue="94.5%"
          changeText="+1.2%"
          changeType="positive"
          barChart={{
            items: [
              { label: 'Ubuntu', value: 85 },
              { label: 'Win', value: 92, isRed: true },
              { label: 'Debian', value: 70 },
              { label: 'Cisco', value: 98 },
            ],
            targetLinePercent: 85,
            targetLineLabel: 'Target: > 90%'
          }}
        />

        <AbbCard
          title="Endpoint risk distribution"
          subtitle="MTD Avg"
          primaryValue={`${counts.critical} Critical`}
          changeText="Requires Patch"
          changeType="negative"
          progressBar={{
            currentPercent: 80,
            currentLabel: `${counts.critical} critical endpoints`,
            targetLabel: 'Patch cycle 2026.Q3'
          }}
        />
      </div>

      {/* Filter Toolbar with ABB Signature Red Accent Bar */}
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] p-5 rounded-sm shadow-industrial space-y-4">
        {/* ABB Signature Red Accent Bar */}
        <div className="w-12 h-1.5 bg-[#FF000F] mb-4"></div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#181B1F] dark:text-white" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
              Asset Inventory Filters
            </span>
            <span className="text-[10px] font-mono text-[#6C757D] bg-[#F1F3F5] dark:bg-[#222730] px-2 py-0.5 rounded-sm">
              {filteredHosts.length} hosts shown
            </span>
          </div>

          <button
            onClick={resetFilters}
            className="px-2.5 py-1 text-xs font-mono text-[#495057] hover:text-[#181B1F] bg-[#F8F9FA] hover:bg-[#E9ECEF] border border-[#CED4DA] rounded-sm flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          {/* Subnet */}
          <div>
            <label className="block text-[10px] text-[#6C757D] uppercase font-semibold mb-1">
              Subnet
            </label>
            <select
              value={subnetFilter}
              onChange={(e) => setSubnetFilter(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-[#CED4DA] text-[#181B1F] py-1 px-2 rounded-sm focus:border-[#181B1F] focus:bg-white outline-none"
            >
              <option value="All">All Subnets</option>
              {MOCK_SUBNETS.map(s => (
                <option key={s.cidr} value={s.cidr}>{s.cidr} ({s.name})</option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-[10px] text-[#6C757D] uppercase font-semibold mb-1">
              Risk Level
            </label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-[#CED4DA] text-[#181B1F] py-1 px-2 rounded-sm focus:border-[#181B1F] focus:bg-white outline-none"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Operating System */}
          <div>
            <label className="block text-[10px] text-[#6C757D] uppercase font-semibold mb-1">
              Operating System
            </label>
            <select
              value={osFilter}
              onChange={(e) => setOsFilter(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-[#CED4DA] text-[#181B1F] py-1 px-2 rounded-sm focus:border-[#181B1F] focus:bg-white outline-none"
            >
              <option value="All">All Platforms</option>
              {osList.map(os => (
                <option key={os} value={os}>{os}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] text-[#6C757D] uppercase font-semibold mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-[#CED4DA] text-[#181B1F] py-1 px-2 rounded-sm focus:border-[#181B1F] focus:bg-white outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Quarantined">Quarantined</option>
              <option value="Degraded">Degraded</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Search */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[10px] text-[#6C757D] uppercase font-semibold mb-1">
              Search Asset
            </label>
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Hostname / IP..."
                className="w-full bg-[#F8F9FA] border border-[#CED4DA] text-[#181B1F] py-1 px-2 rounded-sm focus:border-[#181B1F] focus:bg-white outline-none text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Asset Table */}
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm shadow-industrial overflow-hidden">
        <div className="px-5 py-3 bg-[#F8F9FA] dark:bg-[#1E2229] border-b border-[#E2E6EA] dark:border-[#282D35] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 bg-[#FF000F] inline-block mr-1"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
              Enterprise Asset Directory
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#6C757D]">
            CMDB Agent Sync Interval: 60s
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E6EA] bg-[#F1F3F5] text-[10px] font-mono uppercase tracking-wider text-[#495057]">
                <th className="py-2.5 px-4 font-semibold">Hostname</th>
                <th className="py-2.5 px-4 font-semibold">IP Address</th>
                <th className="py-2.5 px-4 font-semibold">Subnet</th>
                <th className="py-2.5 px-4 font-semibold">Operating System</th>
                <th className="py-2.5 px-4 font-semibold">Open Services</th>
                <th className="py-2.5 px-4 font-semibold">Risk Level</th>
                <th className="py-2.5 px-4 font-semibold">Last Seen</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF] text-xs font-mono">
              {filteredHosts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#6C757D]">
                    No assets match the selected filter configuration.
                  </td>
                </tr>
              ) : (
                filteredHosts.map((host: NetworkHost) => (
                  <tr
                    key={host.id}
                    onClick={() => setSelectedAsset(host)}
                    className="hover:bg-[#F8F9FA] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-4 font-bold text-[#181B1F] whitespace-nowrap">
                      {host.hostname}
                    </td>
                    <td className="py-2.5 px-4 text-[#495057] whitespace-nowrap">
                      {host.ipAddress}
                    </td>
                    <td className="py-2.5 px-4 text-[#5A626E] whitespace-nowrap text-[11px]">
                      {host.subnet}
                    </td>
                    <td className="py-2.5 px-4 text-[#181B1F] whitespace-nowrap text-[11px]">
                      {host.os}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {host.openServices.map((srv: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#F1F3F5] text-[#495057] border border-[#DEE2E6] px-1 rounded-sm"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <SeverityBadge severity={host.riskLevel} size="sm" />
                    </td>
                    <td className="py-2.5 px-4 text-[#5A626E] text-[11px] whitespace-nowrap">
                      {host.lastSeen}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-medium px-2 py-0.5 rounded-sm ${
                        host.status === 'Online' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        host.status === 'Quarantined' ? 'bg-[#FFF1F2] text-[#D6000D] border border-[#FFA3A8]' :
                        host.status === 'Degraded' ? 'bg-[#FFF4E6] text-[#D9480F] border border-[#FFD8A8]' :
                        'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          host.status === 'Online' ? 'bg-emerald-500' :
                          host.status === 'Quarantined' ? 'bg-[#FF000F]' :
                          host.status === 'Degraded' ? 'bg-[#D9480F]' : 'bg-gray-400'
                        }`}></span>
                        {host.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAsset(host);
                        }}
                        className="px-2 py-1 text-[11px] font-mono text-[#495057] hover:text-[#181B1F] bg-white border border-[#CED4DA] hover:border-[#181B1F] rounded-sm transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Inspector Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-none">
          <div className="w-full max-w-xl bg-white border border-[#CED4DA] rounded-sm shadow-industrial-md overflow-hidden">
            <div className="px-5 py-3.5 bg-[#12151A] text-white flex items-center justify-between border-b border-[#262B34]">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#CED4DA]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Asset Detail: {selectedAsset.hostname}
                </span>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-[#868E96] hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8F9FA] border border-[#E9ECEF] rounded-sm">
                <div>
                  <span className="text-[#6C757D]">IP Address:</span>
                  <div className="font-bold text-[#181B1F]">{selectedAsset.ipAddress}</div>
                </div>
                <div>
                  <span className="text-[#6C757D]">Subnet:</span>
                  <div className="font-bold text-[#181B1F]">{selectedAsset.subnet}</div>
                </div>
                <div>
                  <span className="text-[#6C757D]">Operating System:</span>
                  <div className="font-medium text-[#181B1F]">{selectedAsset.os}</div>
                </div>
                <div>
                  <span className="text-[#6C757D]">Agent Status:</span>
                  <div className="font-bold text-[#181B1F]">{selectedAsset.status}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#6C757D] block mb-1">
                  Exposed Network Daemons & Ports:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAsset.openServices.map((s: string, idx: number) => (
                    <span key={idx} className="bg-white border border-[#CED4DA] px-2 py-1 rounded-sm text-[#181B1F]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8F9FA] border border-[#E9ECEF] rounded-sm">
                <div>
                  <span className="text-[#6C757D]">CPU Utilization:</span>
                  <div className="font-bold text-[#181B1F]">{selectedAsset.cpuLoad || '14%'}</div>
                </div>
                <div>
                  <span className="text-[#6C757D]">Current Throughput:</span>
                  <div className="font-bold text-[#181B1F]">{selectedAsset.bandwidth || '2.4 Mbps'}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FFF8F8] border border-[#FFA3A8] rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[#D6000D] font-bold block">Assigned Risk Level</span>
                  <span className="text-[#5A626E] text-[11px]">CrowdStrike Falcon Sensor & Tenable Nessus</span>
                </div>
                <SeverityBadge severity={selectedAsset.riskLevel} />
              </div>
            </div>
            <div className="px-5 py-2.5 bg-[#F8F9FA] border-t border-[#DEE2E6] flex justify-end">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-3 py-1 bg-[#181B1F] text-white rounded-sm text-xs font-mono hover:bg-[#2D3239]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
