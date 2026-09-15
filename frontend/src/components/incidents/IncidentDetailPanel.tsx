import React, { useState } from 'react';
import { Incident, ActionStatus } from '../../types/cybersecurity';
import { SeverityBadge, StatusBadge, ActionBadge } from '../common/Badges';
import { 
  X, 
  ShieldAlert, 
  Clock, 
  Server, 
  Globe, 
  Radio, 
  FileText, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Terminal,
  Lock,
  ArrowRight
} from 'lucide-react';

interface IncidentDetailPanelProps {
  incident: Incident;
  onClose: () => void;
  onViewReport?: (incidentId: string) => void;
}

export const IncidentDetailPanel: React.FC<IncidentDetailPanelProps> = ({
  incident,
  onClose,
  onViewReport
}) => {
  const [responseActions, setResponseActions] = useState(incident.responseActions);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleTriggerAction = (actionId: string) => {
    setResponseActions(prev =>
      prev.map(a => {
        if (a.id === actionId) {
          const nextStatus: ActionStatus = 
            a.status === 'Pending' ? 'In progress' :
            a.status === 'In progress' ? 'Completed' :
            a.status === 'Failed' ? 'In progress' : 'Completed';
          return { ...a, status: nextStatus, timestamp: 'Just now' };
        }
        return a;
      })
    );

    const action = responseActions.find(a => a.id === actionId);
    if (action) {
      setActionFeedback(`Playbook command executed for: ${action.name}`);
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  return (
    <div className="bg-white border border-[#CED4DA] rounded-sm shadow-industrial-md flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-3.5 bg-[#12151A] text-white flex items-center justify-between border-b border-[#262B34]">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-[#FF000F] rounded-none"></span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-tight text-white">
                {incident.id}
              </span>
              <SeverityBadge severity={incident.severity} size="sm" />
              <StatusBadge status={incident.status} />
            </div>
            <p className="text-xs text-[#ADB5BD] font-mono mt-0.5">
              {incident.attackType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onViewReport && (
            <button
              onClick={() => onViewReport(incident.id)}
              className="px-2.5 py-1 bg-[#1E232C] hover:bg-[#2D3239] text-[#CED4DA] hover:text-white border border-[#343A40] text-xs font-mono rounded-sm flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#ADB5BD]" />
              View Formal Report
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-[#868E96] hover:text-white hover:bg-[#262B34] rounded-sm transition-colors"
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="bg-[#E7F5FF] text-[#1971C2] border-b border-[#A5D8FF] px-4 py-2 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <Terminal className="w-3.5 h-3.5 text-[#1971C2]" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Section 1: Telemetry Grid (14 requested parameters) */}
        <div>
          <div className="flex items-center justify-between border-b border-[#E9ECEF] pb-1.5 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#181B1F]">
              Incident Telemetry & Parameters
            </span>
            <span className="text-[10px] font-mono text-[#6C757D]">
              Detection Engine: ABB-SIEM-DPI-01
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-sm space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6C757D] border-b border-[#DEE2E6] pb-1">
                Source Entity
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Source IP:</span>
                  <span className="font-semibold text-[#181B1F]">{incident.sourceIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Source Hostname:</span>
                  <span className="font-semibold text-[#181B1F] truncate max-w-[180px]">{incident.sourceHostname}</span>
                </div>
                {incident.sourceGeo && (
                  <div className="flex justify-between">
                    <span className="text-[#6C757D]">Geographic / ASN:</span>
                    <span className="text-[#495057] truncate max-w-[180px]">{incident.sourceGeo}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-2.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-sm space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6C757D] border-b border-[#DEE2E6] pb-1">
                Destination Entity
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Destination IP:</span>
                  <span className="font-semibold text-[#181B1F]">{incident.targetIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Destination Host:</span>
                  <span className="font-semibold text-[#181B1F]">{incident.targetHostname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Affected Subnet:</span>
                  <span className="font-semibold text-[#FF000F]">{incident.subnet}</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-sm space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6C757D] border-b border-[#DEE2E6] pb-1">
                Network & Protocols
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Protocol:</span>
                  <span className="font-semibold text-[#181B1F]">{incident.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Destination Ports:</span>
                  <span className="font-semibold text-[#181B1F]">{incident.destinationPorts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Detection Time:</span>
                  <span className="text-[#181B1F]">{incident.time}</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-sm space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6C757D] border-b border-[#DEE2E6] pb-1">
                Threat Classification
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#6C757D]">Detected Vulnerability:</span>
                  <span className="font-semibold text-[#D6000D] truncate max-w-[170px]">
                    {incident.detectedVulnerability}
                  </span>
                </div>
                {incident.mitreTactic && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#6C757D]">MITRE ATT&CK:</span>
                    <span className="text-[#181B1F] text-[10px] truncate max-w-[170px]">{incident.mitreTactic}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[#6C757D]">Current Status:</span>
                  <StatusBadge status={incident.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Impact Statement */}
          <div className="mt-3 p-3 bg-[#FFF8F8] border border-[#FFA3A8] rounded-sm">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D6000D] mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#FF000F]" />
              Assessed Operational Impact
            </div>
            <p className="text-xs text-[#181B1F] font-sans leading-relaxed">
              {incident.impact}
            </p>
          </div>
        </div>

        {/* Section 2: Incident Timeline */}
        <div>
          <div className="flex items-center justify-between border-b border-[#E9ECEF] pb-1.5 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#181B1F]">
              Incident Timeline (5-Stage Forensic Progression)
            </span>
            <span className="text-[10px] font-mono text-[#6C757D]">
              ISO 27035 Response Standard
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DEE2E6]">
            {incident.timeline.map((event, idx) => (
              <div key={idx} className="relative group">
                {/* Stage marker */}
                <div
                  className={`absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-none border flex items-center justify-center ${
                    event.completed
                      ? 'bg-[#181B1F] border-[#181B1F] text-white'
                      : event.active
                      ? 'bg-[#FF000F] border-[#FF000F] text-white animate-pulse'
                      : 'bg-white border-[#ADB5BD]'
                  }`}
                >
                  {event.completed && <CheckCircle2 className="w-2.5 h-2.5" />}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#181B1F]">
                      {event.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#868E96]">
                      [{event.timestamp}]
                    </span>
                    {event.active && (
                      <span className="text-[9px] font-mono bg-[#FFF1F2] text-[#D6000D] border border-[#FFA3A8] px-1 font-bold">
                        CURRENT STAGE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5A626E] mt-0.5 leading-normal">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Response Actions */}
        <div>
          <div className="flex items-center justify-between border-b border-[#E9ECEF] pb-1.5 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#181B1F]">
              Response Actions & Containment Playbooks
            </span>
            <span className="text-[10px] font-mono text-[#6C757D]">
              EDR & NGFW Remote Execution
            </span>
          </div>

          <div className="space-y-2">
            {responseActions.map((action) => (
              <div
                key={action.id}
                className="p-3 border border-[#CED4DA] bg-[#F8F9FA] rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#181B1F]">
                      {action.name}
                    </span>
                    <ActionBadge status={action.status} />
                  </div>
                  <div className="text-[11px] font-mono text-[#5A626E]">
                    Target: <span className="text-[#181B1F] font-medium">{action.target}</span>
                  </div>
                  {action.details && (
                    <div className="text-[11px] text-[#6C757D]">
                      {action.details}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleTriggerAction(action.id)}
                    className="px-2.5 py-1 text-xs font-mono font-medium rounded-sm border transition-colors flex items-center gap-1.5 bg-white border-[#CED4DA] hover:border-[#181B1F] text-[#181B1F] hover:bg-[#F1F3F5]"
                  >
                    <Play className="w-3 h-3 text-[#FF000F]" />
                    {action.status === 'Completed' ? 'Re-verify' : 'Execute Action'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="px-5 py-2.5 bg-[#F8F9FA] border-t border-[#DEE2E6] flex items-center justify-between text-[11px] font-mono text-[#6C757D]">
        <span>ABB Cyber Incident Response System • Revision 2.4</span>
        <span className="text-[#181B1F] font-semibold">Incident Record Locked</span>
      </div>
    </div>
  );
};
