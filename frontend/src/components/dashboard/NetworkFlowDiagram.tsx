import React, { useState } from 'react';
import { Globe, Shield, Router, Server } from 'lucide-react';
import { MOCK_SUBNETS } from '../../data/mockSecurityData';
import { NetworkSubnet } from '../../types/cybersecurity';

interface NetworkFlowDiagramProps {
  onSelectSubnet?: (cidr: string) => void;
}

export const NetworkFlowDiagram: React.FC<NetworkFlowDiagramProps> = ({ onSelectSubnet }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>('firewall');

  return (
    <div className="bg-white border border-[#E2E6EA] rounded-sm p-4 shadow-industrial">
      {/* ABB Signature Red Accent Bar */}
      <div className="w-8 h-1 bg-[#FF000F] mb-3"></div>
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E9ECEF]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#181B1F] rounded-none"></span>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F]">
            Network Activity & Ingress Flow Pipeline
          </h3>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-[#5A626E]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Traffic Nominal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF000F] animate-pulse"></span>
            Threat Ingress Intercepted
          </span>
        </div>
      </div>

      {/* Industrial Pipeline Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {/* Node 1: Internet */}
        <div 
          onClick={() => setSelectedNode('internet')}
          className={`p-3 border rounded-sm cursor-pointer transition-all ${
            selectedNode === 'internet' 
              ? 'border-[#181B1F] bg-[#F8F9FA] shadow-sm' 
              : 'border-[#E2E6EA] hover:border-[#CED4DA] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#6C757D] uppercase">Zone 01 / Ingress</span>
            <Globe className="w-4 h-4 text-[#181B1F]" />
          </div>
          <div className="font-mono text-xs font-bold text-[#181B1F] mb-1">
            PUBLIC INTERNET
          </div>
          <div className="text-[11px] text-[#5A626E] font-mono space-y-0.5">
            <div>BGP Autonomous: AS13335</div>
            <div className="text-[#FF000F] font-semibold">Active Threat Feeds: 12</div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E9ECEF] flex items-center justify-between text-[10px] font-mono text-[#495057]">
            <span>Throughput</span>
            <span className="font-bold text-[#181B1F]">1.42 Gbps</span>
          </div>
        </div>

        {/* Node 2: Firewall */}
        <div 
          onClick={() => setSelectedNode('firewall')}
          className={`p-3 border rounded-sm cursor-pointer transition-all ${
            selectedNode === 'firewall' 
              ? 'border-2 border-[#FF000F] bg-[#FFF8F8] shadow-sm' 
              : 'border border-[#E2E6EA] hover:border-[#FF000F] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#6C757D] uppercase">Zone 02 / Perimeter</span>
            <Shield className="w-4 h-4 text-[#FF000F]" />
          </div>
          <div className="font-mono text-xs font-bold text-[#181B1F] mb-1 flex items-center gap-1.5">
            <span>PERIMETER NGFW</span>
            <span className="text-[9px] bg-[#FF000F] text-white px-1 font-mono font-bold rounded-none">INSPECT</span>
          </div>
          <div className="text-[11px] text-[#5A626E] font-mono space-y-0.5">
            <div>State: <span className="text-emerald-700 font-semibold">Active Filtering</span></div>
            <div>Inspected: <span className="font-semibold text-[#181B1F]">4.28B pkts</span></div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E9ECEF] flex items-center justify-between text-[10px] font-mono text-[#495057]">
            <span>Dropped Attacks</span>
            <span className="font-bold text-[#FF000F]">3,842 (24h)</span>
          </div>
        </div>

        {/* Node 3: Router & Subnets */}
        <div 
          onClick={() => setSelectedNode('subnets')}
          className={`p-3 border rounded-sm cursor-pointer transition-all ${
            selectedNode === 'subnets' 
              ? 'border-[#181B1F] bg-[#F8F9FA] shadow-sm' 
              : 'border-[#E2E6EA] hover:border-[#CED4DA] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#6C757D] uppercase">Zone 03 / Distribution</span>
            <Router className="w-4 h-4 text-[#181B1F]" />
          </div>
          <div className="font-mono text-xs font-bold text-[#181B1F] mb-1">
            CORE SUBNETS (4)
          </div>
          <div className="text-[11px] text-[#5A626E] font-mono space-y-0.5">
            <div>VLANs: 10, 20, 30, 40</div>
            <div>Active Incidents: <span className="font-bold text-[#FF000F]">6 Active</span></div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E9ECEF] flex items-center justify-between text-[10px] font-mono text-[#495057]">
            <span>Subnet Isolation</span>
            <span className="font-bold text-emerald-700">Enforced</span>
          </div>
        </div>

        {/* Node 4: Hosts */}
        <div 
          onClick={() => setSelectedNode('hosts')}
          className={`p-3 border rounded-sm cursor-pointer transition-all ${
            selectedNode === 'hosts' 
              ? 'border-[#181B1F] bg-[#F8F9FA] shadow-sm' 
              : 'border-[#E2E6EA] hover:border-[#CED4DA] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#6C757D] uppercase">Zone 04 / Endpoints</span>
            <Server className="w-4 h-4 text-[#181B1F]" />
          </div>
          <div className="font-mono text-xs font-bold text-[#181B1F] mb-1">
            PROTECTED HOSTS
          </div>
          <div className="text-[11px] text-[#5A626E] font-mono space-y-0.5">
            <div>Total Managed: <span className="font-bold text-[#181B1F]">1,250</span></div>
            <div>Quarantined: <span className="font-bold text-[#FF000F]">2 Hosts</span></div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E9ECEF] flex items-center justify-between text-[10px] font-mono text-[#495057]">
            <span>EDR Health</span>
            <span className="font-bold text-emerald-700">99.8% Online</span>
          </div>
        </div>
      </div>

      {/* Subnet Quick Drill-down Strip */}
      <div className="mt-4 pt-3 border-t border-[#E2E6EA] bg-[#F8F9FA] p-3 rounded-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#181B1F] font-semibold">
            Zone Distribution Matrix (Click subnet to filter):
          </span>
          <span className="text-[10px] font-mono text-[#6C757D]">
            Routing Protocol: BGP/OSPF Multi-Area
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {MOCK_SUBNETS.map((sub: NetworkSubnet) => (
            <div
              key={sub.id}
              onClick={() => onSelectSubnet && onSelectSubnet(sub.cidr)}
              className="p-2 bg-white border border-[#CED4DA] hover:border-[#181B1F] rounded-sm cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#181B1F]">
                  {sub.cidr}
                </span>
                <span className={`w-2 h-2 rounded-full ${
                  sub.securityStatus === 'Critical' ? 'bg-[#FF000F] animate-pulse' :
                  sub.securityStatus === 'Elevated' ? 'bg-[#E8590C]' : 'bg-emerald-500'
                }`}></span>
              </div>
              <div className="text-[10px] text-[#5A626E] truncate mt-0.5">
                {sub.name}
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#6C757D]">{sub.hostCount} hosts</span>
                {sub.activeIncidents > 0 ? (
                  <span className="text-[#FF000F] font-bold">{sub.activeIncidents} alert{sub.activeIncidents > 1 ? 's' : ''}</span>
                ) : (
                  <span className="text-emerald-700 font-medium">Clean</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
