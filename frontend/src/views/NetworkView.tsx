import React, { useState } from 'react';
import { 
  Globe, 
  Shield, 
  Router, 
  Network, 
  Server, 
  ArrowDown
} from 'lucide-react';
import { MOCK_SUBNETS } from '../data/mockSecurityData';
import { NetworkSubnet, NetworkHost } from '../types/cybersecurity';
import { SeverityBadge } from '../components/common/Badges';
import { AbbCard } from '../components/common/AbbCard';
import { TopologyVisualizer } from '../components/network/TopologyVisualizer';

interface NetworkViewProps {
  initialSubnetCidr?: string;
  onNavigateToIncidents?: () => void;
  searchQuery?: string;
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  initialSubnetCidr,
  searchQuery = ''
}) => {
  const [selectedSubnet, setSelectedSubnet] = useState<NetworkSubnet>(() => {
    if (initialSubnetCidr) {
      return MOCK_SUBNETS.find((s: NetworkSubnet) => s.cidr === initialSubnetCidr) || MOCK_SUBNETS[0];
    }
    return MOCK_SUBNETS[0];
  });

  const [selectedHost, setSelectedHost] = useState<NetworkHost | null>(null);

  // Filter hosts for the selected subnet
  const subnetHosts: NetworkHost[] = selectedSubnet.hosts.filter((h: NetworkHost) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.hostname.toLowerCase().includes(q) ||
      h.ipAddress.toLowerCase().includes(q) ||
      h.os.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* ABB Standard KPI Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AbbCard
          title="Zone ingress bandwidth"
          subtitle="MTD Avg"
          primaryValue="1.42 / 2.5 Gbps"
          changeText="56.8% Nominal"
          changeType="positive"
          progressBar={{
            currentPercent: 56.8,
            currentLabel: 'Active utilization',
            targetLabel: 'Perimeter capacity'
          }}
        />

        <AbbCard
          title="NGFW threat inspection rate"
          subtitle="24h Window"
          primaryValue="99.4% Cleared"
          changeText="Optimal"
          changeType="positive"
          progressBar={{
            currentPercent: 99.4,
            currentLabel: 'Nominal packets',
            targetLabel: '0.6% drops'
          }}
        />

        <AbbCard
          title="Industrial segment latency"
          subtitle="MTD Avg"
          primaryValue="1.8ms"
          changeText="-0.2ms"
          changeType="positive"
          barChart={{
            items: [
              { label: 'DMZ', value: 40 },
              { label: 'Corp', value: 55 },
              { label: 'Guest', value: 30 },
              { label: 'OT L1', value: 92, isRed: true },
              { label: 'SCADA', value: 20 },
            ],
            targetLinePercent: 85,
            targetLineLabel: 'Target: < 5ms'
          }}
        />
      </div>

      {/* Core Network Threat Detection, Isolation & Incident Response Visualization */}
      <TopologyVisualizer />

      {/* Top Network Architecture Flow (Internet ↓ Firewall ↓ Router ↓ Multiple Subnets ↓ Hosts) */}
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] p-5 rounded-sm shadow-industrial">
        {/* ABB Signature Red Accent Bar */}
        <div className="w-12 h-1.5 bg-[#FF000F] mb-4"></div>

        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E9ECEF] dark:border-[#282D35]">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[#181B1F] dark:text-white" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
              Enterprise Industrial Topology Architecture
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#6C757D] dark:text-[#9CA3AF]">
            Architecture: IEC 62443 Industrial Security Zones
          </span>
        </div>

        {/* Hierarchical Flow Visualization */}
        <div className="flex flex-col items-center space-y-3">
          {/* Tier 1: Internet */}
          <div className="w-full max-w-md p-2.5 bg-[#F8F9FA] border border-[#CED4DA] rounded-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-[#181B1F]" />
              <div>
                <div className="text-xs font-mono font-bold text-[#181B1F]">EXTERNAL INTERNET (WAN)</div>
                <div className="text-[10px] font-mono text-[#6C757D]">Upstream BGP Transits (Telia / Swisscom)</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
              Carrier Up
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-[#ADB5BD]" />

          {/* Tier 2: Perimeter Firewall */}
          <div className="w-full max-w-md p-2.5 bg-white border-2 border-[#FF000F] rounded-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#FF000F]" />
              <div>
                <div className="text-xs font-mono font-bold text-[#181B1F] flex items-center gap-2">
                  <span>PERIMETER NEXT-GEN FIREWALL</span>
                  <span className="text-[9px] bg-[#FF000F] text-white px-1 font-mono font-bold">HA ACTIVE</span>
                </div>
                <div className="text-[10px] font-mono text-[#5A626E]">Cluster: Palo Alto PA-5450 • DPI & SSL Decrypt</div>
              </div>
            </div>
            <div className="text-right text-[10px] font-mono">
              <span className="text-[#FF000F] font-bold">3,842 Blocked</span>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-[#ADB5BD]" />

          {/* Tier 3: Core Distribution Router */}
          <div className="w-full max-w-md p-2.5 bg-[#F8F9FA] border border-[#CED4DA] rounded-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Router className="w-4 h-4 text-[#181B1F]" />
              <div>
                <div className="text-xs font-mono font-bold text-[#181B1F]">CORE BACKBONE ROUTER</div>
                <div className="text-[10px] font-mono text-[#6C757D]">Cisco Catalyst 9500 • Layer 3 Inter-VLAN Gateway</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#495057]">
              4 Segments
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-[#ADB5BD]" />

          <div className="text-[10px] font-mono uppercase tracking-widest text-[#6C757D]">
            Segmented Subnet Zones (Select a subnet to view hosts)
          </div>
        </div>

        {/* Tier 4: Subnets Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
          {MOCK_SUBNETS.map((subnet: NetworkSubnet) => {
            const isSelected = selectedSubnet.id === subnet.id;
            return (
              <div
                key={subnet.id}
                onClick={() => {
                  setSelectedSubnet(subnet);
                  setSelectedHost(null);
                }}
                className={`p-3.5 border rounded-sm cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#181B1F] bg-[#F8F9FA] ring-1 ring-[#181B1F] shadow-sm'
                    : 'border-[#E2E6EA] hover:border-[#CED4DA] bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#6C757D] uppercase">
                    VLAN {subnet.vlanId} • {subnet.category}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    subnet.securityStatus === 'Critical' ? 'bg-[#FF000F] animate-pulse' :
                    subnet.securityStatus === 'Elevated' ? 'bg-[#E8590C]' : 'bg-emerald-500'
                  }`}></span>
                </div>

                <div className="font-mono text-sm font-bold text-[#181B1F]">
                  {subnet.cidr}
                </div>
                <div className="text-xs font-medium text-[#495057] mt-0.5">
                  {subnet.name}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E9ECEF] space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#6C757D]">Hosts:</span>
                    <span className="font-semibold text-[#181B1F]">{subnet.hostCount} active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6C757D]">Active Incidents:</span>
                    <span className={`font-bold ${subnet.activeIncidents > 0 ? 'text-[#FF000F]' : 'text-emerald-700'}`}>
                      {subnet.activeIncidents}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6C757D]">Vulnerabilities:</span>
                    <span className="font-semibold text-[#D9480F]">{subnet.vulnerabilityCount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-[#E9ECEF]">
                    <span className="text-[#6C757D]">Security Status:</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded-sm ${
                      subnet.securityStatus === 'Critical' ? 'bg-[#FFF1F2] text-[#D6000D] border border-[#FFA3A8]' :
                      subnet.securityStatus === 'Elevated' ? 'bg-[#FFF4E6] text-[#D9480F] border border-[#FFD8A8]' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {subnet.securityStatus}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier 5: Subnet Hosts Detail Table */}
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm shadow-industrial overflow-hidden">
        <div className="px-5 py-3 border-b border-[#E2E6EA] dark:border-[#282D35] bg-[#F8F9FA] dark:bg-[#1E2229] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 bg-[#FF000F] inline-block mr-1"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
              Connected Host Endpoints in {selectedSubnet.cidr} ({selectedSubnet.name})
            </span>
            <span className="text-[10px] font-mono text-[#6C757D] bg-white border border-[#CED4DA] px-2 py-0.5 rounded-sm">
              Gateway: {selectedSubnet.gateway}
            </span>
          </div>

          <span className="text-[10px] font-mono text-[#6C757D]">
            Showing {subnetHosts.length} sampled endpoints
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E6EA] bg-[#F1F3F5] text-[10px] font-mono uppercase tracking-wider text-[#495057]">
                <th className="py-2.5 px-4 font-semibold">Hostname</th>
                <th className="py-2.5 px-4 font-semibold">IP Address</th>
                <th className="py-2.5 px-4 font-semibold">Operating System</th>
                <th className="py-2.5 px-4 font-semibold">Open Services</th>
                <th className="py-2.5 px-4 font-semibold">Risk Level</th>
                <th className="py-2.5 px-4 font-semibold">Bandwidth / CPU</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF] text-xs font-mono">
              {subnetHosts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#6C757D]">
                    No hosts found matching filter criteria in this subnet.
                  </td>
                </tr>
              ) : (
                subnetHosts.map((host: NetworkHost) => (
                  <tr
                    key={host.id}
                    onClick={() => setSelectedHost(host)}
                    className="hover:bg-[#F8F9FA] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-4 font-bold text-[#181B1F] whitespace-nowrap">
                      {host.hostname}
                    </td>
                    <td className="py-2.5 px-4 text-[#495057] whitespace-nowrap">
                      {host.ipAddress}
                    </td>
                    <td className="py-2.5 px-4 text-[#5A626E] whitespace-nowrap text-[11px]">
                      {host.os}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
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
                      <div>CPU: {host.cpuLoad || '12%'}</div>
                      <div className="text-[10px] text-[#868E96]">{host.bandwidth || '1.2 Mbps'}</div>
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
                          setSelectedHost(host);
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

      {/* Host Quick Detail Modal */}
      {selectedHost && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-none">
          <div className="w-full max-w-xl bg-white border border-[#CED4DA] rounded-sm shadow-industrial-md overflow-hidden">
            <div className="px-5 py-3.5 bg-[#12151A] text-white flex items-center justify-between border-b border-[#262B34]">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#CED4DA]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Host Profile: {selectedHost.hostname}
                </span>
              </div>
              <button
                onClick={() => setSelectedHost(null)}
                className="text-[#868E96] hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8F9FA] border border-[#E9ECEF] rounded-sm">
                <div>
                  <span className="text-[#6C757D]">IP Address:</span>
                  <div className="font-bold text-[#181B1F]">{selectedHost.ipAddress}</div>
                </div>
                <div>
                  <span className="text-[#6C757D]">Subnet Assignment:</span>
                  <div className="font-bold text-[#181B1F]">{selectedHost.subnet}</div>
                </div>
                <div>
                  <span className="text-[#6C757D]">Operating System:</span>
                  <div className="font-medium text-[#181B1F]">{selectedHost.os}</div>
                </div>
                <div>
                  <span className="text-[#6C757D]">Operational State:</span>
                  <div className="font-bold text-[#181B1F]">{selectedHost.status}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#6C757D] block mb-1">
                  Active Listening Services & Daemon Ports:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHost.openServices.map((s: string, idx: number) => (
                    <span key={idx} className="bg-white border border-[#CED4DA] px-2 py-1 rounded-sm text-[#181B1F]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#FFF8F8] border border-[#FFA3A8] rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[#D6000D] font-bold block">Assigned Risk Assessment</span>
                  <span className="text-[#5A626E] text-[11px]">CrowdStrike Falcon Sensor Agent v7.14</span>
                </div>
                <SeverityBadge severity={selectedHost.riskLevel} />
              </div>
            </div>
            <div className="px-5 py-2.5 bg-[#F8F9FA] border-t border-[#DEE2E6] flex justify-end">
              <button
                onClick={() => setSelectedHost(null)}
                className="px-3 py-1 bg-[#181B1F] text-white rounded-sm text-xs font-mono hover:bg-[#2D3239]"
              >
                Dismiss Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
