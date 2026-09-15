import React from 'react';
import { IncidentReport } from '../../types/cybersecurity';
import { SeverityBadge, StatusBadge } from '../common/Badges';
import { AbbLogo } from '../common/AbbLogo';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Shield, 
  Calendar,
  Clock,
  Server,
  Network,
  Terminal,
  ShieldCheck
} from 'lucide-react';

interface ReportPreviewModalProps {
  report: IncidentReport;
  onClose: () => void;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({ report, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-none">
      <div className="bg-white border border-[#CED4DA] w-full max-w-4xl max-h-[92vh] flex flex-col rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Modal Controls Bar (Not printed) */}
        <div className="no-print px-6 py-3 bg-[#12151A] text-white flex items-center justify-between border-b border-[#262B34]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF000F]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Document Preview: {report.reportId}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Visual Download PDF button (Functional via window.print) */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#FF000F] hover:bg-[#D6000D] text-white font-mono text-xs font-semibold rounded-sm flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#262B34] hover:bg-[#343A40] text-[#CED4DA] hover:text-white font-mono text-xs rounded-sm flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-[#868E96] hover:text-white hover:bg-[#262B34] rounded-sm transition-colors ml-2"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Report Document Sheet */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-6 bg-white text-[#181B1F] font-sans">
          {/* Document Header */}
          <div className="border-b-2 border-[#181B1F] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <AbbLogo className="h-8 w-auto" />
                <div>
                  <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-[#181B1F]">
                    ABB Security Operations Center
                  </h2>
                  <div className="text-[11px] text-[#6C757D] font-mono">
                    Industrial Cybersecurity & Incident Response Division
                  </div>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-mono uppercase text-[#181B1F] mt-3">
                SECURITY INCIDENT REPORT
              </h1>
            </div>

            <div className="p-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm font-mono text-xs space-y-1 sm:text-right">
              <div><span className="text-[#6C757D]">REPORT ID:</span> <strong>{report.reportId}</strong></div>
              <div><span className="text-[#6C757D]">GENERATED:</span> {report.generatedTime}</div>
              <div><span className="text-[#6C757D]">ANALYST:</span> {report.author}</div>
              <div><span className="text-[#6C757D]">CLASSIFICATION:</span> <span className="text-[#D6000D] font-bold">RESTRICTED - SOC INTERNAL</span></div>
            </div>
          </div>

          {/* Section: Metadata Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-[#F8F9FA] border border-[#E2E6EA] rounded-sm font-mono text-xs">
            <div>
              <span className="text-[10px] text-[#6C757D] uppercase block">Incident ID</span>
              <strong className="text-sm text-[#181B1F]">{report.incidentId}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#6C757D] uppercase block">Date</span>
              <span className="text-[#181B1F] font-medium">{report.incidentTime.split(' ')[0]}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6C757D] uppercase block">Time</span>
              <span className="text-[#181B1F] font-medium">{report.incidentTime.split(' ')[1]} UTC</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6C757D] uppercase block">Attack Type</span>
              <span className="text-[#181B1F] font-semibold">{report.attack}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6C757D] uppercase block">Severity</span>
              <div className="mt-0.5">
                <SeverityBadge severity={report.severity} size="sm" />
              </div>
            </div>
          </div>

          {/* Section: SOURCE & TARGET */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SOURCE */}
            <div className="border border-[#E2E6EA] rounded-sm p-4 bg-white">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#181B1F] border-b border-[#E9ECEF] pb-2 mb-3 flex items-center justify-between">
                <span>SOURCE</span>
                <span className="text-[10px] text-[#6C757D]">Inbound Threat Origin</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">IP Address:</span>
                  <span className="font-bold text-[#181B1F]">{report.source.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Hostname:</span>
                  <span className="font-medium text-[#181B1F] truncate max-w-[200px]">{report.source.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Geographic:</span>
                  <span className="text-[#495057]">{report.source.geo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Autonomous System:</span>
                  <span className="text-[#495057] text-[11px]">{report.source.asn}</span>
                </div>
              </div>
            </div>

            {/* TARGET */}
            <div className="border border-[#E2E6EA] rounded-sm p-4 bg-white">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#181B1F] border-b border-[#E9ECEF] pb-2 mb-3 flex items-center justify-between">
                <span>TARGET</span>
                <span className="text-[10px] text-[#6C757D]">Internal Asset Affected</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">IP Address:</span>
                  <span className="font-bold text-[#181B1F]">{report.target.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Hostname:</span>
                  <span className="font-bold text-[#181B1F]">{report.target.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Operational Role:</span>
                  <span className="text-[#495057] text-[11px] text-right max-w-[200px] truncate">{report.target.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: NETWORK & VULNERABILITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NETWORK */}
            <div className="border border-[#E2E6EA] rounded-sm p-4 bg-white">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#181B1F] border-b border-[#E9ECEF] pb-2 mb-3">
                NETWORK
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Subnet:</span>
                  <span className="font-bold text-[#181B1F]">{report.network.subnet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Protocol:</span>
                  <span className="font-medium text-[#181B1F]">{report.network.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Ports:</span>
                  <span className="font-semibold text-[#181B1F]">{report.network.ports}</span>
                </div>
              </div>
            </div>

            {/* VULNERABILITY */}
            <div className="border border-[#E2E6EA] rounded-sm p-4 bg-white">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#181B1F] border-b border-[#E9ECEF] pb-2 mb-3">
                VULNERABILITY
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Affected Service:</span>
                  <span className="font-medium text-[#181B1F]">{report.vulnerability.affectedService}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Vulnerability:</span>
                  <span className="font-bold text-[#D6000D] truncate max-w-[200px]">{report.vulnerability.vulnerability}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6C757D]">Severity:</span>
                  <SeverityBadge severity={report.vulnerability.severity} size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Section: IMPACT */}
          <div className="border border-[#E2E6EA] rounded-sm p-4 bg-white">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#181B1F] border-b border-[#E9ECEF] pb-2 mb-2">
              IMPACT
            </div>
            <p className="text-xs text-[#495057] leading-relaxed">
              {report.impact}
            </p>
          </div>

          {/* Section: RESPONSE & REMEDIATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RESPONSE */}
            <div className="border border-[#E2E6EA] rounded-sm p-4 bg-white">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#181B1F] border-b border-[#E9ECEF] pb-2 mb-3">
                RESPONSE (Actions Taken)
              </div>
              <ul className="space-y-1.5 text-xs text-[#495057]">
                {report.responseActionsTaken.map((action, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* REMEDIATION */}
            <div className="border border-[#E2E6EA] rounded-sm p-4 bg-white">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#181B1F] border-b border-[#E9ECEF] pb-2 mb-3">
                REMEDIATION (Recommended Actions)
              </div>
              <ul className="space-y-1.5 text-xs text-[#495057]">
                {report.remediationRecommended.map((rem, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF000F] rounded-none flex-shrink-0 mt-1.5"></span>
                    <span>{rem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: INCIDENT TIMELINE */}
          <div className="border border-[#E2E6EA] rounded-sm p-4 bg-white">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#181B1F] border-b border-[#E9ECEF] pb-2 mb-3">
              INCIDENT TIMELINE
            </div>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2 bg-[#F8F9FA] rounded-sm border border-[#E9ECEF]">
                <strong className="text-[#181B1F] mr-2">DETECTION:</strong>
                <span className="text-[#5A626E]">{report.timeline.detection}</span>
              </div>
              <div className="p-2 bg-[#F8F9FA] rounded-sm border border-[#E9ECEF]">
                <strong className="text-[#181B1F] mr-2">ANALYSIS:</strong>
                <span className="text-[#5A626E]">{report.timeline.analysis}</span>
              </div>
              <div className="p-2 bg-[#F8F9FA] rounded-sm border border-[#E9ECEF]">
                <strong className="text-[#181B1F] mr-2">RESPONSE:</strong>
                <span className="text-[#5A626E]">{report.timeline.response}</span>
              </div>
              <div className="p-2 bg-[#F8F9FA] rounded-sm border border-[#E9ECEF]">
                <strong className="text-[#181B1F] mr-2">CONTAINMENT:</strong>
                <span className="text-[#5A626E]">{report.timeline.containment}</span>
              </div>
            </div>
          </div>

          {/* Section: FINAL STATUS */}
          <div className="p-4 bg-[#F8F9FA] border-2 border-[#181B1F] rounded-sm">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#181B1F] mb-1">
              FINAL STATUS
            </div>
            <p className="text-xs text-[#181B1F] font-mono leading-relaxed">
              {report.finalStatus}
            </p>
          </div>

          {/* Document Sign-off Footer */}
          <div className="pt-6 border-t border-[#CED4DA] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#6C757D]">
            <span>ABB Switzerland Ltd • Corporate Security Operations Center</span>
            <span>Document Revision 1.0 • Archival ID: {report.reportId}-VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
