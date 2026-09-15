import React, { useState, useMemo } from 'react';
import { IncidentReport } from '../types/cybersecurity';
import { MOCK_REPORTS } from '../data/mockSecurityData';
import { SeverityBadge, StatusBadge } from '../components/common/Badges';
import { AbbCard } from '../components/common/AbbCard';
import { ReportPreviewModal } from '../components/reports/ReportPreviewModal';
import { FileText, SlidersHorizontal } from 'lucide-react';

interface ReportsViewProps {
  initialReportIncidentId?: string | null;
  searchQuery?: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  initialReportIncidentId = null,
  searchQuery = ''
}) => {
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(() => {
    if (initialReportIncidentId) {
      return MOCK_REPORTS.find((r: IncidentReport) => r.incidentId === initialReportIncidentId) || MOCK_REPORTS[0];
    }
    return null;
  });

  const [localSearch, setLocalSearch] = useState<string>('');

  const filteredReports: IncidentReport[] = useMemo(() => {
    return MOCK_REPORTS.filter((report: IncidentReport) => {
      const q = (localSearch || searchQuery).toLowerCase();
      if (!q) return true;
      return (
        report.reportId.toLowerCase().includes(q) ||
        report.incidentId.toLowerCase().includes(q) ||
        report.attack.toLowerCase().includes(q) ||
        report.host.toLowerCase().includes(q) ||
        report.subnet.toLowerCase().includes(q) ||
        report.severity.toLowerCase().includes(q)
      );
    });
  }, [localSearch, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* ABB Standard KPI Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AbbCard
          title="Audit reports generated"
          subtitle="MTD Avg"
          primaryValue={`${MOCK_REPORTS.length} Dossiers`}
          changeText="+12.5%"
          changeType="positive"
          progressBar={{
            currentPercent: 90,
            currentLabel: 'Verified dossiers',
            targetLabel: 'Target SLA (85%)'
          }}
        />

        <AbbCard
          title="Regulatory compliance index"
          subtitle="MTD Avg"
          primaryValue="98.4%"
          changeText="+0.4%"
          changeType="positive"
          progressBar={{
            currentPercent: 98.4,
            currentLabel: 'IEC 62443 / NIS2',
            targetLabel: 'Target SLA (95%)'
          }}
        />

        <AbbCard
          title="Audit framework coverage"
          subtitle="24h Window"
          primaryValue="5 Frameworks"
          changeText="100% Compliant"
          changeType="positive"
          barChart={{
            items: [
              { label: 'IEC 62443', value: 98, isRed: true },
              { label: 'NIS2', value: 85 },
              { label: 'ISO 27001', value: 92 },
              { label: 'SOC 2', value: 78 },
              { label: 'NIST CSF', value: 88 },
            ],
            targetLinePercent: 80,
            targetLineLabel: 'Threshold: 80%'
          }}
        />
      </div>

      {/* Top Filter Toolbar with ABB Signature Red Accent Bar */}
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] p-5 rounded-sm shadow-industrial space-y-4">
        {/* ABB Signature Red Accent Bar */}
        <div className="w-12 h-1.5 bg-[#FF000F] mb-3"></div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF000F]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
                Official Incident Dossiers & Compliance Reports
              </h3>
            </div>
            <p className="text-[11px] text-[#5A626E] dark:text-[#9BA3AF] font-sans mt-0.5">
              Archival records for ISO 27001, NIS2 Directive, and IEC 62443 cyber incident disclosure.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search reports by ID, host, CVE..."
                className="bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] text-xs font-mono py-1.5 px-3 rounded-sm outline-none w-64 text-[#181B1F] dark:text-white focus:border-[#181B1F] dark:focus:border-white focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reports Archive Table */}
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm shadow-industrial overflow-hidden p-5">
        {/* ABB Signature Red Accent Bar */}
        <div className="w-12 h-1.5 bg-[#FF000F] mb-3"></div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#181B1F] dark:text-white" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
              Incident Reports Log ({filteredReports.length})
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#6C757D] dark:text-[#9BA3AF]">
            Click any row to open the formal incident dossier
          </span>
        </div>

        <div className="overflow-x-auto border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E6EA] dark:border-[#282D35] bg-[#F1F3F5] dark:bg-[#1F242D] text-[10px] font-mono uppercase tracking-wider text-[#495057] dark:text-[#ADB5BD]">
                <th className="py-2.5 px-4 font-semibold">Report ID</th>
                <th className="py-2.5 px-4 font-semibold">Incident ID</th>
                <th className="py-2.5 px-4 font-semibold">Attack</th>
                <th className="py-2.5 px-4 font-semibold">Host</th>
                <th className="py-2.5 px-4 font-semibold">Subnet</th>
                <th className="py-2.5 px-4 font-semibold">Severity</th>
                <th className="py-2.5 px-4 font-semibold">Incident Time</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Generated Time</th>
                <th className="py-2.5 px-4 font-semibold text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF] dark:divide-[#282D35] text-xs font-mono">
              {filteredReports.map((report: IncidentReport) => (
                <tr
                  key={report.reportId}
                  onClick={() => setSelectedReport(report)}
                  className="hover:bg-[#F8F9FA] dark:hover:bg-[#1F242D] cursor-pointer transition-colors group"
                >
                  <td className="py-2.5 px-4 font-bold text-[#181B1F] dark:text-white whitespace-nowrap">
                    <span className="group-hover:text-[#FF000F] transition-colors">
                      {report.reportId}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[#495057] dark:text-[#ADB5BD] whitespace-nowrap">
                    {report.incidentId}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-[#181B1F] dark:text-white max-w-[200px] truncate">
                    {report.attack}
                  </td>
                  <td className="py-2.5 px-4 text-[#181B1F] dark:text-white whitespace-nowrap">
                    {report.host}
                  </td>
                  <td className="py-2.5 px-4 text-[#5A626E] dark:text-[#9BA3AF] whitespace-nowrap text-[11px]">
                    {report.subnet}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <SeverityBadge severity={report.severity} size="sm" />
                  </td>
                  <td className="py-2.5 px-4 text-[#5A626E] dark:text-[#9BA3AF] whitespace-nowrap text-[11px]">
                    {report.incidentTime}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="py-2.5 px-4 text-[#5A626E] dark:text-[#9BA3AF] whitespace-nowrap text-[11px]">
                    {report.generatedTime}
                  </td>
                  <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report);
                      }}
                      className="px-2.5 py-1 text-[11px] font-mono text-[#181B1F] dark:text-white group-hover:text-white group-hover:bg-[#181B1F] border border-[#CED4DA] dark:border-[#333A46] group-hover:border-[#181B1F] rounded-sm transition-colors flex items-center gap-1 ml-auto"
                    >
                      <FileText className="w-3 h-3" />
                      Open Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <ReportPreviewModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};
