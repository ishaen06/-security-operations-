import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Server, 
  Activity 
} from 'lucide-react';
import { Incident } from '../types/cybersecurity';
import { MOCK_INCIDENTS, MOCK_STATS } from '../data/mockSecurityData';
import { NetworkFlowDiagram } from '../components/dashboard/NetworkFlowDiagram';
import { IncidentTrendChart } from '../components/dashboard/IncidentTrendChart';
import { IncidentDetailPanel } from '../components/incidents/IncidentDetailPanel';
import { AbbCard } from '../components/common/AbbCard';
import { TopologyVisualizer } from '../components/network/TopologyVisualizer';
import { LiveLogsTable } from '../components/dashboard/LiveLogsTable';

interface DashboardViewProps {
  onSelectIncident: (incident: Incident) => void;
  onNavigateToIncidents: () => void;
  onNavigateToNetwork: (subnetCidr?: string) => void;
  onViewReport: (incidentId: string) => void;
  searchQuery?: string;
  incidents?: Incident[];
  isDrillActive?: boolean;
  onOpenLiveTraffic?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectIncident,
  onNavigateToIncidents,
  onNavigateToNetwork,
  onViewReport,
  searchQuery = '',
  incidents = MOCK_INCIDENTS,
  isDrillActive = false,
  onOpenLiveTraffic
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  return (
    <div className="space-y-6 pb-12">

      {/* Official ABB Brand Banner - Merged Seamlessly with Page Background */}
      <div className="text-[#181B1F] dark:text-white pt-2 pb-4 sm:pt-3 sm:pb-5 px-1">
        {/* Signature Red Accent Bar */}
        <div className="w-16 sm:w-20 h-2 bg-[#FF000F] mb-5"></div>

        {/* Overline Kicker */}
        <div className="font-outrun font-bold text-xs sm:text-sm tracking-[0.3em] text-[#FF000F] uppercase mb-3">
          ENGINEERED TO OUTRUN
        </div>

        {/* Big Headline */}
        <h1 className="font-outrun font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#181B1F] dark:text-white tracking-wide uppercase leading-tight max-w-5xl">
          HELPING INDUSTRIES OUTRUN LEANER AND CLEANER
        </h1>

        {/* Subtitle / Description */}
        <p className="font-sans font-light text-sm sm:text-base md:text-lg text-[#495057] dark:text-[#CBD5E1] leading-relaxed max-w-4xl mt-4">
          Real-time cybersecurity operations across global electrification, robotics, and discrete automation infrastructure.
        </p>
      </div>

      {/* Core Network Threat Detection, Isolation & Incident Response Visualization */}
      <TopologyVisualizer />

      {/* Emergency Drill Alert Notice Banner */}
      {isDrillActive && (
        <div className="p-4 bg-[#FF000F]/10 border-l-4 border-[#FF000F] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#FF000F] text-white font-mono font-bold text-[10px] uppercase rounded-xs">
                EMERGENCY DRILL ENGAGED
              </span>
              <strong className="text-[#181B1F] dark:text-white font-sans text-sm">
                SCADA/ICS Modbus Tampering & Active C2 Exfiltration
              </strong>
            </div>
            <p className="text-[#495057] dark:text-[#CBD5E1] mt-1 font-mono text-[11px]">
              Real-world CISA KEV CVE-2024-3400 + Abuse.ch Feodo Botnet C2 injected into incident queue. Live real-time telemetry streaming active.
            </p>
          </div>
          {onOpenLiveTraffic && (
            <button
              onClick={onOpenLiveTraffic}
              className="px-3 py-1.5 bg-[#FF000F] text-white hover:bg-[#D9000D] font-mono font-bold uppercase rounded-sm text-xs shrink-0"
            >
              Open Live Traffic Console
            </button>
          )}
        </div>
      )}

      {/* Official ABB Standard Dashboard Grid (exact layout from media_1789113363033.png & media_1789113387624.png) */}
      
      {/* Row 1: 2 Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Event Ingestion Velocity (Matching Audience Growth Rate) */}
        <AbbCard
          title="Audience growth rate"
          subtitle="MTD Avg"
          primaryValue="0.5%"
          changeText="+0.29%"
          changeType="positive"
          barChart={{
            items: [
              { label: '12am', value: 28 },
              { label: '3am', value: 42 },
              { label: '6am', value: 65 },
              { label: '9am', value: 76 },
              { label: '12pm', value: 95, isRed: true },
              { label: '3pm', value: 20 },
              { label: '6pm', value: 32 },
              { label: '9pm', value: 40 },
            ],
            targetLinePercent: 80,
            targetLineLabel: 'Target: 0.5%'
          }}
        />

        {/* Card 2: Page Impressions / Threat Throughput */}
        <AbbCard
          title="Page impressions"
          subtitle="MTD Avg"
          primaryValue="1.95m/2.7m"
          changeText="+1.87m"
          changeType="positive"
          progressBar={{
            currentPercent: 72.2,
            currentLabel: 'Current engagement rate',
            targetLabel: 'Target engagement rate'
          }}
        />
      </div>

      {/* Row 2: 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 3: Post Engagement Rate / Threat Containment */}
        <AbbCard
          title="Post engagement rate"
          subtitle="MTD Avg"
          primaryValue="3.5%/4.5%"
          changeText="+0.25%"
          changeType="positive"
          progressBar={{
            currentPercent: 77.8,
            currentLabel: 'Current engagement rate',
            targetLabel: 'Target engagement rate'
          }}
        />

        {/* Card 4: Click-through Rate / Attack Velocity */}
        <AbbCard
          title="Click-through rate"
          subtitle="MTD Avg"
          primaryValue="2%"
          changeText="+1.01%"
          changeType="positive"
          barChart={{
            items: [
              { label: '12am', value: 18 },
              { label: '3am', value: 30 },
              { label: '6am', value: 88 },
              { label: '9am', value: 35 },
              { label: '12pm', value: 96, isRed: true },
              { label: '3pm', value: 16 },
              { label: '6pm', value: 24 },
              { label: '9pm', value: 28 },
            ],
            targetLinePercent: 72,
            targetLineLabel: 'Target: 2%'
          }}
        />

        {/* Card 5: Post Engagement Rate / Incident Mitigation */}
        <AbbCard
          title="Post engagement rate"
          subtitle="MTD Avg"
          primaryValue="0.8/1 per day"
          changeText="Optimal"
          changeType="positive"
          progressBar={{
            currentPercent: 80,
            currentLabel: 'Current engagement rate',
            targetLabel: 'Target engagement rate'
          }}
        />
      </div>

      {/* Row 3: Post Frequency Dot Heatmap & Operational Integrity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 6: Post Frequency Dot Heatmap (Matching media_1789113387624.png) */}
        <AbbCard
          title="Post frequency"
          subtitle="MTD Avg"
          primaryValue="1"
          changeText="1 per day"
          changeType="positive"
          dotHeatmap={{
            weeks: [
              { week: 'Week 1', dots: ['gray', 'red', 'gray', 'gray', 'black', 'gray', 'gray'] },
              { week: 'Week 2', dots: ['black', 'gray', 'gray', 'red', 'gray', 'gray', 'gray'] },
              { week: 'Week 3', dots: ['gray', 'gray', 'black', 'gray', 'gray', 'gray', 'gray'] },
              { week: 'Week 4', dots: ['gray', 'gray', 'gray', 'gray', 'gray', 'gray', 'gray'] },
              { week: 'Week 5', dots: ['gray', 'gray', 'empty', 'empty', 'empty', 'empty', 'empty'] },
            ]
          }}
        />

        {/* Card 7: Protected Host Integrity */}
        <AbbCard
          title="Protected host integrity"
          subtitle="24h Window"
          primaryValue={`${MOCK_STATS.protectedHosts} / ${MOCK_STATS.totalHosts}`}
          changeText="99.8% Nominal"
          changeType="positive"
          progressBar={{
            currentPercent: 99.8,
            currentLabel: 'Operational endpoints',
            targetLabel: '2 quarantined'
          }}
        />

        {/* Card 8: Active Critical Incidents */}
        <AbbCard
          title="Critical security alerts"
          subtitle="24h Window"
          primaryValue={`${MOCK_STATS.criticalUncontained} uncontained / ${MOCK_STATS.criticalIncidents}`}
          changeText="Urgent Action"
          changeType="negative"
          progressBar={{
            currentPercent: 85.7,
            currentLabel: 'Cobalt Strike active',
            targetLabel: 'Tier 3 lead assigned'
          }}
        />
      </div>

      {/* Network Activity Visualization (Internet → Firewall → Subnets → Hosts) */}
      <NetworkFlowDiagram onSelectSubnet={(cidr: string) => onNavigateToNetwork(cidr)} />

      {/* Incident Trend Chart */}
      <IncidentTrendChart />

      {/* Live Security & Network Logs (Auto-refreshed every 3 minutes) */}
      <LiveLogsTable />

      {/* Floating or Modal Incident Inspector if selected */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-none">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col">
            <IncidentDetailPanel
              incident={selectedIncident}
              onClose={() => setSelectedIncident(null)}
              onViewReport={onViewReport}
            />
          </div>
        </div>
      )}
    </div>
  );
};
