import React, { useState, useMemo } from 'react';
import { Vulnerability } from '../types/cybersecurity';
import { MOCK_VULNERABILITIES } from '../data/mockSecurityData';
import { SeverityBadge } from '../components/common/Badges';
import { AbbCard } from '../components/common/AbbCard';
import { 
  ShieldAlert, 
  SlidersHorizontal, 
  AlertCircle, 
  CheckCircle2, 
  Terminal, 
  ShieldCheck
} from 'lucide-react';

interface VulnerabilitiesViewProps {
  searchQuery?: string;
}

export const VulnerabilitiesView: React.FC<VulnerabilitiesViewProps> = ({ searchQuery = '' }) => {
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(MOCK_VULNERABILITIES[0]);
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  // Summary counts
  const summary = useMemo(() => {
    return {
      critical: MOCK_VULNERABILITIES.filter((v: Vulnerability) => v.severity === 'Critical').length,
      high: MOCK_VULNERABILITIES.filter((v: Vulnerability) => v.severity === 'High').length,
      medium: MOCK_VULNERABILITIES.filter((v: Vulnerability) => v.severity === 'Medium').length,
      low: MOCK_VULNERABILITIES.filter((v: Vulnerability) => v.severity === 'Low').length,
    };
  }, []);

  const filteredVulns: Vulnerability[] = useMemo(() => {
    return MOCK_VULNERABILITIES.filter((v: Vulnerability) => {
      const q = (localSearch || searchQuery).toLowerCase();
      if (q) {
        const matches = 
          v.cveId.toLowerCase().includes(q) ||
          v.vulnerability.toLowerCase().includes(q) ||
          v.host.toLowerCase().includes(q) ||
          v.ip.toLowerCase().includes(q) ||
          v.service.toLowerCase().includes(q) ||
          v.subnet.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (severityFilter !== 'All' && v.severity !== severityFilter) return false;
      if (statusFilter !== 'All' && v.status !== statusFilter) return false;

      return true;
    });
  }, [severityFilter, statusFilter, localSearch, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* ABB Standard KPI Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AbbCard
          title="Critical CVE exposure"
          subtitle="CVSS 9.0 - 10.0"
          primaryValue={`${summary.critical} Critical / 10`}
          changeText="Urgent Patch"
          changeType="negative"
          progressBar={{
            currentPercent: 80,
            currentLabel: `${summary.critical} exploitable RCE`,
            targetLabel: 'Zero tolerance SLA'
          }}
        />

        <AbbCard
          title="CVSS severity distribution"
          subtitle="24h Window"
          primaryValue="10 Active"
          changeText="Score Avg: 7.4"
          changeType="positive"
          barChart={{
            items: [
              { label: 'Critical', value: 95, isRed: true },
              { label: 'High', value: 75 },
              { label: 'Medium', value: 45 },
              { label: 'Low', value: 20 },
            ],
            targetLinePercent: 80,
            targetLineLabel: 'Threshold: CVSS 7+'
          }}
        />

        <AbbCard
          title="Vulnerability remediation rate"
          subtitle="MTD Avg"
          primaryValue="85.7%"
          changeText="+4.5%"
          changeType="positive"
          progressBar={{
            currentPercent: 85.7,
            currentLabel: 'Remediated CVEs',
            targetLabel: 'Target SLA (90%)'
          }}
        />
      </div>

      {/* Filter Toolbar with ABB Signature Red Accent Bar */}
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] p-5 rounded-sm shadow-industrial space-y-4">
        {/* ABB Signature Red Accent Bar */}
        <div className="w-12 h-1.5 bg-[#FF000F] mb-3"></div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#181B1F] dark:text-white" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
              Vulnerability Register ({filteredVulns.length} entries)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] text-xs font-mono py-1.5 px-2.5 rounded-sm text-[#181B1F] dark:text-white outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] text-xs font-mono py-1.5 px-2.5 rounded-sm text-[#181B1F] dark:text-white outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="In Remediation">In Remediation</option>
              <option value="Patch Pending">Patch Pending</option>
              <option value="Mitigated">Mitigated</option>
            </select>

            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search CVE, service, host..."
              className="bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] text-xs font-mono py-1.5 px-3 rounded-sm text-[#181B1F] dark:text-white outline-none w-52"
            />

            {(severityFilter !== 'All' || statusFilter !== 'All' || localSearch) && (
              <button
                onClick={() => {
                  setSeverityFilter('All');
                  setStatusFilter('All');
                  setLocalSearch('');
                }}
                className="text-xs font-mono text-[#6C757D] dark:text-[#9BA3AF] hover:text-[#181B1F] dark:hover:text-white"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout: Table and Vulnerability Details Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Table (7 cols on large screens) */}
        <div className="xl:col-span-7 bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm shadow-industrial overflow-hidden p-5">
          {/* ABB Signature Red Accent Bar */}
          <div className="w-12 h-1.5 bg-[#FF000F] mb-3"></div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
              Discovered CVE Vulnerability Instances
            </span>
            <span className="text-[10px] font-mono text-[#6C757D] dark:text-[#9BA3AF]">
              Source: OpenVAS / Nessus Professional
            </span>
          </div>

          <div className="overflow-x-auto border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E6EA] dark:border-[#282D35] bg-[#F1F3F5] dark:bg-[#1F242D] text-[10px] font-mono uppercase tracking-wider text-[#495057] dark:text-[#ADB5BD]">
                  <th className="py-2.5 px-3 font-semibold">CVE ID</th>
                  <th className="py-2.5 px-3 font-semibold">Host / IP</th>
                  <th className="py-2.5 px-3 font-semibold">Subnet</th>
                  <th className="py-2.5 px-3 font-semibold">Service : Port</th>
                  <th className="py-2.5 px-3 font-semibold">Severity</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9ECEF] dark:divide-[#282D35] text-xs font-mono">
                {filteredVulns.map((vuln: Vulnerability) => {
                  const isSelected = selectedVuln?.id === vuln.id;
                  return (
                    <tr
                      key={vuln.id}
                      onClick={() => setSelectedVuln(vuln)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#F1F3F5] dark:bg-[#202632] border-l-4 border-l-[#FF000F]'
                          : 'hover:bg-[#F8F9FA] dark:hover:bg-[#1B2028] border-l-4 border-l-transparent'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-[#181B1F] dark:text-white whitespace-nowrap">
                        <div>{vuln.cveId}</div>
                        <div className="text-[10px] text-[#868E96] font-normal truncate max-w-[150px]">
                          {vuln.vulnerability}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[#181B1F] dark:text-white whitespace-nowrap">
                        <div className="font-semibold">{vuln.host}</div>
                        <div className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF]">{vuln.ip}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[#5A626E] dark:text-[#9BA3AF] text-[11px] whitespace-nowrap">
                        {vuln.subnet}
                      </td>
                      <td className="py-2.5 px-3 text-[#181B1F] dark:text-white text-[11px] whitespace-nowrap">
                        <div>{vuln.service}</div>
                        <div className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF]">Port: {vuln.port || 'Any'}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <SeverityBadge severity={vuln.severity} size="sm" />
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${
                          vuln.status === 'Active' ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50' :
                          vuln.status === 'In Remediation' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' :
                          vuln.status === 'Patch Pending' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50' :
                          'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                        }`}>
                          {vuln.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vulnerability Details Panel (5 cols on large screens) */}
        <div className="xl:col-span-5 sticky top-20">
          {selectedVuln ? (
            <div className="bg-white dark:bg-[#16191E] border border-[#CED4DA] dark:border-[#282D35] rounded-sm shadow-industrial-md overflow-hidden flex flex-col p-5">
              {/* ABB Signature Red Accent Bar */}
              <div className="w-12 h-1.5 bg-[#FF000F] mb-3"></div>

              {/* Panel Header */}
              <div className="p-4 bg-[#12151A] text-white flex items-center justify-between rounded-sm border border-[#262B34] mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#FF000F] rounded-none"></span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold tracking-tight text-white">
                        {selectedVuln.cveId}
                      </span>
                      <SeverityBadge severity={selectedVuln.severity} size="sm" />
                    </div>
                    <span className="text-[10px] text-[#ADB5BD] font-mono">
                      CVSS v3.1 Base Score: <strong className="text-white">{selectedVuln.cvssScore} / 10.0</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Panel Body */}
              <div className="space-y-4 text-xs">
                {/* Vulnerability Description */}
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6C757D] dark:text-[#9BA3AF] border-b border-[#E9ECEF] dark:border-[#282D35] pb-1 mb-1.5">
                    Vulnerability Description
                  </div>
                  <h4 className="font-mono font-bold text-[#181B1F] dark:text-white text-xs mb-1">
                    {selectedVuln.vulnerability}
                  </h4>
                  <p className="text-[#495057] dark:text-[#ADB5BD] font-sans leading-relaxed">
                    {selectedVuln.description}
                  </p>
                </div>

                {/* Affected Entities */}
                <div className="grid grid-cols-2 gap-2.5 p-3 bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#E9ECEF] dark:border-[#282D35] rounded-sm font-mono text-[11px]">
                  <div>
                    <span className="text-[#6C757D] dark:text-[#9BA3AF] block text-[10px]">Affected Host:</span>
                    <span className="font-bold text-[#181B1F] dark:text-white">{selectedVuln.host}</span>
                    <span className="text-[#6C757D] dark:text-[#9BA3AF] block text-[10px] mt-0.5">({selectedVuln.ip})</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] dark:text-[#9BA3AF] block text-[10px]">Affected Service:</span>
                    <span className="font-bold text-[#181B1F] dark:text-white">{selectedVuln.service}</span>
                    <span className="text-[#6C757D] dark:text-[#9BA3AF] block text-[10px] mt-0.5">Port: {selectedVuln.port}</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] dark:text-[#9BA3AF] block text-[10px]">Subnet Location:</span>
                    <span className="font-semibold text-[#181B1F] dark:text-white">{selectedVuln.subnet}</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] dark:text-[#9BA3AF] block text-[10px]">Remediation Status:</span>
                    <span className="font-bold text-[#FF000F]">{selectedVuln.status}</span>
                  </div>
                </div>

                {/* Potential Impact */}
                <div className="p-3 bg-[#FFF8F8] dark:bg-red-950/30 border border-[#FFA3A8] dark:border-red-900/50 rounded-sm">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D6000D] dark:text-red-400 mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#FF000F]" />
                    Potential Security Impact
                  </div>
                  <p className="text-xs text-[#181B1F] dark:text-gray-200 font-sans leading-relaxed">
                    {selectedVuln.potentialImpact}
                  </p>
                </div>

                {/* Recommended Remediation */}
                <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] rounded-sm">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white mb-1.5 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#181B1F] dark:text-white" />
                    Recommended Remediation Playbook
                  </div>
                  <p className="text-xs text-[#495057] dark:text-[#ADB5BD] font-sans leading-relaxed mb-2">
                    {selectedVuln.recommendedRemediation}
                  </p>
                  <div className="p-2 bg-[#12151A] text-emerald-400 font-mono text-[11px] rounded-sm overflow-x-auto">
                    <code># Remediation command preview{'\n'}sudo apt-get update && sudo apt-get --only-upgrade install {selectedVuln.service.toLowerCase().split(' ')[0]}</code>
                  </div>
                </div>
              </div>

              {/* Panel Footer */}
              <div className="mt-4 pt-3 border-t border-[#DEE2E6] dark:border-[#282D35] flex items-center justify-between text-[11px] font-mono text-[#6C757D] dark:text-[#9BA3AF]">
                <span>NVD Published: {selectedVuln.publishedDate}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Patch Available
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm p-8 text-center text-[#6C757D] dark:text-[#9BA3AF] font-mono text-xs">
              Select a vulnerability to view technical description and remediation playbook.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
