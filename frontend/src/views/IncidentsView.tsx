import React, { useState, useMemo } from 'react';
import { Incident } from '../types/cybersecurity';
import { MOCK_INCIDENTS } from '../data/mockSecurityData';
import { SeverityBadge, StatusBadge } from '../components/common/Badges';
import { IncidentDetailPanel } from '../components/incidents/IncidentDetailPanel';
import { AbbCard } from '../components/common/AbbCard';
import { 
  RotateCcw, 
  SlidersHorizontal, 
  ShieldAlert
} from 'lucide-react';

interface IncidentsViewProps {
  onViewReport: (incidentId: string) => void;
  initialSelectedIncidentId?: string | null;
  searchQuery?: string;
  incidents?: Incident[];
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  onViewReport,
  initialSelectedIncidentId = null,
  searchQuery = '',
  incidents = MOCK_INCIDENTS
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(() => {
    if (initialSelectedIncidentId) {
      return incidents.find(i => i.id === initialSelectedIncidentId) || incidents[0];
    }
    return incidents[0]; // Default to selecting the first incident so analyst sees details immediately
  });

  // Filter States
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [attackFilter, setAttackFilter] = useState<string>('All');
  const [subnetFilter, setSubnetFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  // Extract unique attack types and subnets for dropdowns
  const attackTypes = useMemo(() => {
    const set = new Set<string>();
    incidents.forEach((i: Incident) => set.add(i.attackType));
    return Array.from(set);
  }, [incidents]);

  const subnets = useMemo(() => {
    const set = new Set<string>();
    incidents.forEach((i: Incident) => set.add(i.subnet));
    return Array.from(set);
  }, [incidents]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc: Incident) => {
      // Global and local query
      const query = (localSearch || searchQuery).toLowerCase();
      if (query) {
        const matchesQuery = 
          inc.id.toLowerCase().includes(query) ||
          inc.attackType.toLowerCase().includes(query) ||
          inc.sourceIp.toLowerCase().includes(query) ||
          inc.sourceHostname.toLowerCase().includes(query) ||
          inc.targetIp.toLowerCase().includes(query) ||
          inc.targetHostname.toLowerCase().includes(query) ||
          inc.subnet.toLowerCase().includes(query) ||
          inc.detectedVulnerability.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      if (severityFilter !== 'All' && inc.severity !== severityFilter) return false;
      if (attackFilter !== 'All' && inc.attackType !== attackFilter) return false;
      if (subnetFilter !== 'All' && inc.subnet !== subnetFilter) return false;
      if (statusFilter !== 'All' && inc.status !== statusFilter) return false;

      return true;
    });
  }, [incidents, severityFilter, attackFilter, subnetFilter, statusFilter, timeFilter, localSearch, searchQuery]);

  const resetFilters = () => {
    setSeverityFilter('All');
    setAttackFilter('All');
    setSubnetFilter('All');
    setStatusFilter('All');
    setTimeFilter('All');
    setLocalSearch('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ABB Standard KPI Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AbbCard
          title="Active incident containment"
          subtitle="MTD Avg"
          primaryValue="88.2% / 95%"
          changeText="+0.25%"
          changeType="positive"
          progressBar={{
            currentPercent: 88.2,
            currentLabel: 'Contained events',
            targetLabel: 'Target SLA (95%)'
          }}
        />

        <AbbCard
          title="Critical threat volume"
          subtitle="24h Window"
          primaryValue="2 uncontained / 14"
          changeText="Urgent Action"
          changeType="negative"
          progressBar={{
            currentPercent: 85.7,
            currentLabel: 'Cobalt Strike active',
            targetLabel: 'Tier 3 lead assigned'
          }}
        />

        <AbbCard
          title="Attack vector distribution"
          subtitle="MTD Avg"
          primaryValue="12 Types"
          changeText="Nominal"
          changeType="positive"
          barChart={{
            items: [
              { label: 'C2', value: 95, isRed: true },
              { label: 'Modbus', value: 70 },
              { label: 'Ransom', value: 50 },
              { label: 'Exfil', value: 35 },
              { label: 'Brute', value: 20 },
            ],
            targetLinePercent: 80,
            targetLineLabel: 'Target: < 15'
          }}
        />
      </div>

      {/* Top Filter Toolbar with ABB Signature Red Accent Bar */}
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] p-5 rounded-sm shadow-industrial space-y-4">
        {/* ABB Signature Red Accent Bar */}
        <div className="w-12 h-1.5 bg-[#FF000F] mb-3"></div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#181B1F] dark:text-white" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
              Incident Management & Triage Filters
            </span>
            <span className="text-[10px] font-mono text-[#6C757D] bg-[#F1F3F5] px-2 py-0.5 rounded-sm">
              {filteredIncidents.length} matching events
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="px-2.5 py-1 text-xs font-mono text-[#495057] hover:text-[#181B1F] bg-[#F8F9FA] hover:bg-[#E9ECEF] border border-[#CED4DA] rounded-sm flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
          {/* Severity Filter */}
          <div>
            <label className="block text-[10px] text-[#6C757D] uppercase font-semibold mb-1">
              Severity
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-[#CED4DA] text-[#181B1F] py-1 px-2 rounded-sm focus:border-[#181B1F] focus:bg-white outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Attack Type Filter */}
          <div>
            <label className="block text-[10px] text-[#6C757D] uppercase font-semibold mb-1">
              Attack Type
            </label>
            <select
              value={attackFilter}
              onChange={(e) => setAttackFilter(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-[#CED4DA] text-[#181B1F] py-1 px-2 rounded-sm focus:border-[#181B1F] focus:bg-white outline-none truncate"
            >
              <option value="All">All Attack Types</option>
              {attackTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Subnet Filter */}
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
              {subnets.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
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
              <option value="Detected">Detected</option>
              <option value="Investigating">Investigating</option>
              <option value="Contained">Contained</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Date / Time Filter */}
          <div>
            <label className="block text-[10px] text-[#6C757D] uppercase font-semibold mb-1">
              Time Window
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-[#CED4DA] text-[#181B1F] py-1 px-2 rounded-sm focus:border-[#181B1F] focus:bg-white outline-none"
            >
              <option value="All">Last 24 Hours</option>
              <option value="1h">Last 1 Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-[10px] text-[#6C757D] uppercase font-semibold mb-1">
              Keyword Filter
            </label>
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filter by IP, CVE..."
                className="w-full bg-[#F8F9FA] border border-[#CED4DA] text-[#181B1F] py-1 px-2 pr-6 rounded-sm focus:border-[#181B1F] focus:bg-white outline-none text-xs"
              />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  className="absolute right-1.5 top-1.5 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout: Table & Inspector Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Left Column: Incidents Table (7 cols on large screens) */}
        <div className="xl:col-span-7 bg-white border border-[#E2E6EA] rounded-sm shadow-industrial overflow-hidden">
          <div className="px-4 py-2.5 bg-[#F8F9FA] dark:bg-[#1E2229] border-b border-[#E2E6EA] dark:border-[#282D35] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-1 bg-[#FF000F] inline-block mr-1"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
                Incident Stream ({filteredIncidents.length})
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#6C757D]">
              Click row to inspect full telemetry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E6EA] bg-[#F1F3F5] text-[10px] font-mono uppercase tracking-wider text-[#495057]">
                  <th className="py-2.5 px-3 font-semibold">Incident ID</th>
                  <th className="py-2.5 px-3 font-semibold">Time</th>
                  <th className="py-2.5 px-3 font-semibold">Attack Type</th>
                  <th className="py-2.5 px-3 font-semibold">Source → Target</th>
                  <th className="py-2.5 px-3 font-semibold">Severity</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9ECEF] text-xs font-mono">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#6C757D]">
                      No security incidents match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((incident: Incident) => {
                    const isSelected = selectedIncident?.id === incident.id;
                    return (
                      <tr
                        key={incident.id}
                        onClick={() => setSelectedIncident(incident)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#F1F3F5] border-l-4 border-l-[#FF000F]'
                            : 'hover:bg-[#F8F9FA] border-l-4 border-l-transparent'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-[#181B1F] whitespace-nowrap">
                          {incident.id}
                        </td>
                        <td className="py-2.5 px-3 text-[#5A626E] text-[11px] whitespace-nowrap">
                          {incident.time.split(' ')[1]}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#181B1F] max-w-[170px] truncate">
                          <div>{incident.attackType}</div>
                          <div className="text-[10px] text-[#868E96]">{incident.subnet}</div>
                        </td>
                        <td className="py-2.5 px-3 text-[#495057] text-[11px] whitespace-nowrap">
                          <div>{incident.sourceIp}</div>
                          <div className="text-[10px] text-[#181B1F] font-semibold">→ {incident.targetHostname}</div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <SeverityBadge severity={incident.severity} size="sm" />
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <StatusBadge status={incident.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Selected Incident Details Panel (5 cols on large screens) */}
        <div className="xl:col-span-5 sticky top-20">
          {selectedIncident ? (
            <IncidentDetailPanel
              incident={selectedIncident}
              onClose={() => setSelectedIncident(null)}
              onViewReport={onViewReport}
            />
          ) : (
            <div className="bg-white border border-[#E2E6EA] rounded-sm p-8 text-center text-[#6C757D] font-mono text-xs">
              <ShieldAlert className="w-8 h-8 text-[#CED4DA] mx-auto mb-2" />
              <div>Select an incident from the stream to load technical investigation telemetry.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
