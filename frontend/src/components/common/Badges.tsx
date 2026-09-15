import React from 'react';
import { Severity, IncidentStatus, ActionStatus } from '../../types/cybersecurity';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.2' : 'text-xs px-2 py-0.5';

  switch (severity) {
    case 'Critical':
      return (
        <span className={`inline-flex items-center gap-1 font-mono font-semibold uppercase tracking-wider bg-[#FFF1F2] text-[#D6000D] border border-[#FFA3A8] rounded-sm ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF000F] animate-pulse"></span>
          CRITICAL
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1 font-mono font-semibold uppercase tracking-wider bg-[#FFF4E6] text-[#D9480F] border border-[#FFD8A8] rounded-sm ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9480F]"></span>
          HIGH
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1 font-mono font-semibold uppercase tracking-wider bg-[#E7F5FF] text-[#1971C2] border border-[#A5D8FF] rounded-sm ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1971C2]"></span>
          MEDIUM
        </span>
      );
    case 'Low':
    default:
      return (
        <span className={`inline-flex items-center gap-1 font-mono font-semibold uppercase tracking-wider bg-[#F1F3F5] text-[#495057] border border-[#CED4DA] rounded-sm ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#868E96]"></span>
          LOW
        </span>
      );
  }
};

interface StatusBadgeProps {
  status: IncidentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Detected':
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium px-2 py-0.5 rounded-sm bg-[#FFF9DB] text-[#E67700] border border-[#FFE066]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59F00]"></span>
          Detected
        </span>
      );
    case 'Investigating':
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium px-2 py-0.5 rounded-sm bg-[#E7F5FF] text-[#1C7ED6] border border-[#A5D8FF]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#339AF0] animate-ping"></span>
          Investigating
        </span>
      );
    case 'Contained':
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium px-2 py-0.5 rounded-sm bg-[#F1F3F5] text-[#2D3239] border border-[#CED4DA]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D3239]"></span>
          Contained
        </span>
      );
    case 'Resolved':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium px-2 py-0.5 rounded-sm bg-[#EBFBEE] text-[#2F9E44] border border-[#B2F2BB]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#40C057]"></span>
          Resolved
        </span>
      );
  }
};

interface ActionBadgeProps {
  status: ActionStatus;
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1 font-mono text-xs font-medium px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
          <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          Completed
        </span>
      );
    case 'In progress':
      return (
        <span className="inline-flex items-center gap-1 font-mono text-xs font-medium px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-2 h-2 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></span>
          In progress
        </span>
      );
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1 font-mono text-xs font-medium px-2 py-0.5 rounded-sm bg-gray-100 text-gray-700 border border-gray-300">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          Pending
        </span>
      );
    case 'Failed':
    default:
      return (
        <span className="inline-flex items-center gap-1 font-mono text-xs font-medium px-2 py-0.5 rounded-sm bg-red-50 text-red-700 border border-red-200">
          <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Failed
        </span>
      );
  }
};
