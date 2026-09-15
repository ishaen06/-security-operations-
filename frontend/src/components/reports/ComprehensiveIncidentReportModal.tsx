import React from 'react';
import { 
  X, 
  Printer, 
  Clock, 
  ShieldAlert, 
  Network, 
  Activity, 
  Sliders, 
  Globe, 
  ShieldCheck, 
  Target,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeAttackSubnet?: string | null;
  activeAttackVector?: string | null;
  activeAttackDevice?: {
    id?: string;
    hostname?: string;
    ip?: string;
    role?: string;
    port?: string;
    cve?: string;
    vulnerability?: string;
    exploitPayload?: string;
    parametersImpacted?: string[];
  } | null;
  isDrillActive?: boolean;
}

export const ComprehensiveIncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  activeAttackSubnet,
  activeAttackVector,
  activeAttackDevice,
  isDrillActive = false
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Unified Enterprise Compromised Subnets Dossier
  const COMPROMISED_SUBNETS = [
    {
      id: 'subnet-c',
      name: 'Subnet C (10.10.30.0/24)',
      role: 'Industrial Automation & Robotics Control (SCADA/ICS)',
      vlan: 'VLAN 30',
      gateway: '10.10.0.1 (Interface eth2)',
      totalHosts: 254,
      compromisedHosts: ['10.10.30.42 (Primary SCADA Master)', '10.10.30.88 (Turbine PLC Controller)'],
      containment: 'Physical Airgap Enforced (< 18s latency)'
    },
    {
      id: 'subnet-b',
      name: 'Subnet B (10.10.20.0/24)',
      role: 'Operations & Analytics Compute Enclave',
      vlan: 'VLAN 20',
      gateway: '10.10.0.1 (Interface eth1)',
      totalHosts: 254,
      compromisedHosts: ['10.10.20.14 (ABB PLM Server)', '10.10.20.65 (Fleet Analytics Node)'],
      containment: 'Port 22 SSH Dropped & Process Tree Quarantined'
    },
    {
      id: 'subnet-a',
      name: 'Subnet A (10.10.10.0/24)',
      role: 'Corporate Management & Identity Enclave',
      vlan: 'VLAN 10',
      gateway: '10.10.0.1 (Interface eth0)',
      totalHosts: 254,
      compromisedHosts: ['10.10.10.14 (Active Directory DC)', '10.10.10.84 (Corporate Bastion Jump)'],
      containment: 'East-West Microsegmentation Enforced (Zero-Trust)'
    }
  ];

  // Unified Monitored Parameters in Danger Across Infrastructure
  const PARAMETERS_IN_DANGER = [
    {
      name: 'Modbus Holding Register 40001 (Turbine RPM Setpoint)',
      subnet: 'Subnet C (SCADA)',
      target: '3,000 RPM Nominal (Trip Limit: 3,600 RPM)',
      current: 'INJECTED: 4,800 RPM (OVERSPEED DANGER)',
      danger: 'CRITICAL',
      desc: 'Attacker commanded lethal turbine acceleration; command was blocked at physical airgap.'
    },
    {
      name: 'Modbus Holding Register 40105 (Overpressure Relief Valve)',
      subnet: 'Subnet C (SCADA)',
      target: '0x01 (AUTO-RELIEF ENGAGED)',
      current: 'INJECTED: 0x00 (FORCED CLOSED)',
      danger: 'CRITICAL',
      desc: 'Malicious payload attempted forcing pressure relief valve shut during high-pressure cycles.'
    },
    {
      name: 'Primary Reactor Core Coolant Temperature',
      subnet: 'Subnet C (SCADA)',
      target: '68.4 °C (Warning Threshold: 85.0 °C)',
      current: 'Manipulated Target: 114.2 °C',
      danger: 'CRITICAL',
      desc: 'Targeted manipulation of cooling pump thermal thresholds to trigger steam buildup.'
    },
    {
      name: 'Time-Series Database (TSDB) Influx Port',
      subnet: 'Subnet B (Operations)',
      target: 'Port 8086 • Signed Telemetry Only',
      current: 'Malformed Ingestion Payloads Injected',
      danger: 'HIGH',
      desc: 'Attacker injected false positive sensor spikes into predictive maintenance pipeline.'
    },
    {
      name: 'OpenSSH Daemon Memory Footprint',
      subnet: 'Subnet B (Operations)',
      target: '14.2 MB RAM Nominal',
      current: 'Memory Race Condition Triggered',
      danger: 'HIGH',
      desc: 'Exploitation attempt of CVE-2024-6387 to hijack root execution context.'
    },
    {
      name: 'Kerberos Ticket Granting Service (TGS)',
      subnet: 'Subnet A (Corporate)',
      target: 'NOMINAL ENCRYPTED (AES-256)',
      current: 'GOLDEN TICKET INJECTION ATTEMPT',
      danger: 'HIGH',
      desc: 'Attacker attempted forging Kerberos TGS to obtain Domain Admin rights on 10.10.10.14.'
    },
    {
      name: 'Telemetry Ingestion Velocity',
      subnet: 'Core Edge',
      target: '28 pkts/sec (Jitter < 4ms)',
      current: 'High Jitter: 148 pkts/sec (34% Drop)',
      danger: 'MEDIUM',
      desc: 'Telemetry feedback channel flooded to prevent operator from viewing true sensor readings.'
    }
  ];

  // Unified DNS Threat & Sinkhole Mapping Table
  const DNS_MAPPING = [
    {
      domain: 'c2-controller.feodo-tracker.abuse.ch',
      type: 'A',
      resolvedIp: '185.220.101.45',
      resolver: '10.10.0.53:53',
      reputation: 'FEODO BOTNET C2 (ABUSE.CH)',
      action: 'SINKHOLED (127.0.0.1)'
    },
    {
      domain: 'pan-os-update-telemetry.com',
      type: 'A',
      resolvedIp: '198.51.100.24',
      resolver: '10.10.0.53:53',
      reputation: 'CVE-2024-3400 STAGING HOST',
      action: 'BLOCKED VIA SURICATA'
    },
    {
      domain: 'c2-analytics-drop.shadowbroker.net',
      type: 'A',
      resolvedIp: '198.51.100.42',
      resolver: '10.10.0.53:53',
      reputation: 'KNOWN C2 SINKHOLE',
      action: 'SINKHOLED & DROPPED'
    },
    {
      domain: 'telemetry-mirror.darkweb-relay.cc',
      type: 'TXT',
      resolvedIp: 'N/A (Exfil via TXT records)',
      resolver: '10.10.0.53:53',
      reputation: 'DNS TUNNELING EXFILTRATION',
      action: 'DROPPED VIA DPI RULES'
    },
    {
      domain: 'corp-auth.identity-spoof.com',
      type: 'A',
      resolvedIp: '185.220.101.45',
      resolver: '10.10.0.53:53',
      reputation: 'MALICIOUS C2 SINKHOLE',
      action: 'SINKHOLED (127.0.0.1)'
    },
    {
      domain: 'vpn-token-auth.abb.com.fake-cert.ru',
      type: 'A',
      resolvedIp: '194.26.29.112',
      resolver: '10.10.0.53:53',
      reputation: 'PHISHING / CREDENTIAL HARVESTER',
      action: 'BLOCKED AT FIREWALL'
    }
  ];

  // Unified Step-by-Step Remediation Action Protocol
  const REMEDIATION_STEPS = [
    {
      step: 1,
      title: 'Immediate Network Airgap & Boundary Firewall Enforcement',
      status: 'COMPLETED (< 24s latency)',
      action: 'Physically and logically severed boundary interfaces eth0, eth1, and eth2 on Core Gateway. Injected dynamic FW-DENY-ALL rules to halt east-west lateral movement across all enclaves.'
    },
    {
      step: 2,
      title: 'C2 Threat Eradication & Host Forensics Capture',
      status: 'COMPLETED',
      action: 'Enforced DNS Response Policy Zone (RPZ) sinkholing on recursive resolver 10.10.0.53 (redirected C2 traffic to 127.0.0.1). Acquired volatile RAM dumps and killed unauthorized background daemon processes.'
    },
    {
      step: 3,
      title: 'Device IP Address Re-assignment & Network Quarantine',
      status: 'EXECUTED / ACTIVE',
      action: 'Changed compromised device IP addresses to clean, unpolluted leases: 10.10.30.42 → 10.10.30.198 (SCADA Master), 10.10.20.14 → 10.10.20.188 (PLM Server), and 10.10.10.14 → 10.10.10.185 (Domain Controller). Flushed gateway ARP caches and revoked compromised IP leases.'
    },
    {
      step: 4,
      title: 'Secure Server Reconnection & Golden State Baseline Restoration',
      status: 'COMPLETED',
      action: 'Securely reconnected all newly addressed devices to core servers via authenticated mutual TLS. Restored Modbus holding registers 40001 (3,000 RPM) and 40105 (0x01) from cryptographic golden snapshot hash #ABB-SNAP-20260910 with 100% nominal telemetry.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#16191E] border border-[#CED4DA] dark:border-[#282D35] rounded-sm shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E6EA] dark:border-[#282D35] bg-[#F8F9FA] dark:bg-[#1B2027] flex items-center justify-between gap-4 shrink-0">
          <div>
            {/* Signature ABB Red Accent Bar */}
            <div className="w-12 h-1.5 bg-[#FF000F] mb-1.5" />
            <div className="flex items-center gap-2">
              <span className="font-outrun uppercase text-[11px] font-bold tracking-[0.2em] text-[#FF000F]">
                ABB INCIDENT DOSSIER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-red-100 dark:bg-red-950/60 text-[#FF000F] font-bold">
                UNIFIED SINGLE-PAGE REPORT
              </span>
            </div>
            <h2 className="font-sans font-bold text-lg sm:text-xl text-[#181B1F] dark:text-white tracking-tight mt-0.5">
              Security Incident & Threat Analysis Report
            </h2>
            <p className="text-xs font-mono text-[#6C757D] dark:text-[#9BA3AF] mt-0.5">
              Enterprise Cyber-Physical Forensics • Parameters in Danger • DNS Mapping • Remediation Protocol
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-[#FF000F] text-white hover:bg-[#D9000D] font-bold rounded-sm transition-colors shadow-sm cursor-pointer"
              title="Print formal PDF report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#6C757D] hover:text-[#181B1F] dark:hover:text-white rounded-sm transition-colors ml-1 cursor-pointer"
              title="Close incident report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Targeted Endpoint Callout Banner (when specific device attack is active) */}
        {activeAttackDevice && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-[#FF000F] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#FF000F] shrink-0" />
              <span className="font-bold text-[#FF000F] uppercase">Active Targeted Endpoint:</span>
              <span className="font-bold text-[#181B1F] dark:text-white">
                {activeAttackDevice.hostname || 'SCADA Master'} ({activeAttackDevice.ip || '10.10.30.42'})
              </span>
              <span className="text-[#6C757D] dark:text-[#9BA3AF]">
                • Port {activeAttackDevice.port || '502'} • {activeAttackDevice.role || 'Industrial Controller'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#FF000F] text-white font-bold rounded-xs text-[10px]">
                {activeAttackDevice.cve || 'CVE-2024-3400'}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                Zero-Trust Airgap Enforced
              </span>
            </div>
          </div>
        )}

        {/* UNIFIED SINGLE-PAGE SCROLLABLE REPORT CONTENT - STRICTLY THE 7 REQUESTED SECTIONS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-[#181B1F] dark:text-white font-sans print:p-0 print:overflow-visible">
          
          {/* 1. TIME OF INCIDENT */}
          <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#E2E6EA] dark:border-[#282D35]">
              <Clock className="w-4 h-4 text-[#FF000F]" />
              <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-[#181B1F] dark:text-white">
                1. Time of Incident
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] uppercase block">Incident Detection Timestamp</span>
                <span className="font-bold text-sm text-[#181B1F] dark:text-white mt-1 block">2026-09-11 13:05:49 UTC</span>
                <span className="text-[10px] text-[#868E96] mt-0.5 block">NTP Stratum 1 Precision Clock</span>
              </div>
              <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] uppercase block">Active Duration & Airgap Latency</span>
                <span className="font-bold text-sm text-[#181B1F] dark:text-white mt-1 block">48m 12s Active • Contained in 18s</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 block">Sub-Second Microsegmentation</span>
              </div>
              <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] uppercase block">Current Incident Status</span>
                <span className="font-bold text-sm text-[#FF000F] mt-1 block">Airgap Isolated & Contained</span>
                <span className="text-[10px] text-[#868E96] mt-0.5 block">Dynamic Core Gateway Deny Rule Active</span>
              </div>
            </div>
          </div>

          {/* 2. WHAT THE ATTACK IS */}
          <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#E2E6EA] dark:border-[#282D35]">
              <ShieldAlert className="w-4 h-4 text-[#FF000F]" />
              <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-[#181B1F] dark:text-white">
                2. What the Attack Is
              </h3>
            </div>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 p-2 bg-[#F8F9FA] dark:bg-[#1F242C] rounded-xs">
                <span className="text-[#6C757D] dark:text-[#9BA3AF]">Primary Attack Vector:</span>
                <span className="font-bold text-[#181B1F] dark:text-white text-sm">
                  {activeAttackVector || 'SCADA Modbus/TCP Register Injection & Active C2 Beaconing'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 p-2 bg-[#F8F9FA] dark:bg-[#1F242C] rounded-xs">
                <span className="text-[#6C757D] dark:text-[#9BA3AF]">Exploited CVE Identifiers:</span>
                <span className="font-bold text-[#FF000F]">
                  CISA KEV CVE-2024-3400 (GlobalProtect) • CVE-2024-6387 (regreSSHion) • CVE-2024-21887 (Ivanti)
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 p-2 bg-[#F8F9FA] dark:bg-[#1F242C] rounded-xs">
                <span className="text-[#6C757D] dark:text-[#9BA3AF]">MITRE ATT&CK Classification:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  ICS Control Manipulation (T0855) • Credential Spray (T1110.003) • Data Manipulation (T0814)
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 p-2 bg-[#F8F9FA] dark:bg-[#1F242C] rounded-xs">
                <span className="text-[#6C757D] dark:text-[#9BA3AF]">Threat Profile & Mechanism:</span>
                <span className="text-[#495057] dark:text-[#CBD5E1]">
                  Eastern Europe C2 Syndicate (Abuse.ch Feodo Botnet) attempted unauthorized write coil override (Function Code 0x06) to hijack turbine speeds and disable pressure relief valves.
                </span>
              </div>
            </div>
          </div>

          {/* 3. WHICH SUBNET IS COMPROMISED */}
          <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#E2E6EA] dark:border-[#282D35]">
              <Network className="w-4 h-4 text-[#FF000F]" />
              <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-[#181B1F] dark:text-white">
                3. Which Subnet is Compromised
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              {COMPROMISED_SUBNETS.map((sub) => (
                <div 
                  key={sub.id}
                  className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] rounded-xs border border-[#E2E6EA] dark:border-[#2E3540] flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between pb-1 border-b border-[#E2E6EA] dark:border-[#282D35]">
                      <strong className="text-sm text-[#181B1F] dark:text-white">{sub.name}</strong>
                      <span className="text-[10px] px-1.5 py-0.2 bg-red-100 dark:bg-red-950/60 text-[#FF000F] font-bold rounded-xs">
                        {sub.vlan}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6C757D] dark:text-[#9BA3AF]">
                      {sub.role}
                    </div>
                    <div className="text-[11px] text-[#495057] dark:text-[#CBD5E1]">
                      Gateway: {sub.gateway}
                    </div>
                    <div className="pt-2">
                      <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] uppercase font-bold block mb-1">
                        Impacted Endpoints:
                      </span>
                      {sub.compromisedHosts.map((host, idx) => (
                        <div key={idx} className="p-1.5 mb-1 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xs text-[11px] font-bold text-[#FF000F] flex items-center justify-between">
                          <span>{host}</span>
                          <span className="text-[9px] uppercase">ISOLATED</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 pt-1 border-t border-[#E2E6EA] dark:border-[#282D35] text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ {sub.containment}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. EFFECT OF HAPPENING */}
          <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#E2E6EA] dark:border-[#282D35]">
              <Activity className="w-4 h-4 text-[#FF000F]" />
              <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-[#181B1F] dark:text-white">
                4. Effect of Happening
              </h3>
            </div>
            <p className="text-xs text-[#495057] dark:text-[#CBD5E1] leading-relaxed mb-3">
              Unauthorized function code 0x06 (Write Single Register) targeted industrial turbine controller and overpressure valves. Mechanical SIL-3 emergency interlocks engaged successfully; physical damage and catastrophic overspeed were prevented by sub-second zero-trust isolation. East-west microsegmentation stopped credential pivoting toward core identity controllers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] block">Physical Hardware Safety</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">0 Physical Damage</strong>
                <span className="text-[10px] text-[#868E96]">Mechanical SIL-3 emergency interlocks held</span>
              </div>
              <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] block">Cross-Enclave Blast Radius</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">Contained to Subnets A, B, C</strong>
                <span className="text-[10px] text-[#868E96]">Perimeter edge severed external callbacks</span>
              </div>
              <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] block">Data Exfiltration Status</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">Zero Records Lost</strong>
                <span className="text-[10px] text-[#868E96]">Outbound exfiltration channels dropped via DPI</span>
              </div>
            </div>
          </div>

          {/* 5. WHICH PARAMETERS ARE IN DANGER */}
          <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E2E6EA] dark:border-[#282D35]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FF000F]" />
                <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-[#181B1F] dark:text-white">
                  5. Which Parameters are in Danger
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/60 text-[#FF000F] font-mono text-xs font-bold rounded-xs">
                {PARAMETERS_IN_DANGER.length} Infrastructure Parameters
              </span>
            </div>

            <div className="space-y-2.5">
              {PARAMETERS_IN_DANGER.map((param, index) => (
                <div 
                  key={index}
                  className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-[#E2E6EA] dark:border-[#282D35]">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        param.danger === 'CRITICAL' ? 'bg-[#FF000F] animate-pulse' :
                        param.danger === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <h4 className="font-sans font-bold text-sm text-[#181B1F] dark:text-white">
                        {param.name}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#E9ECEF] dark:bg-[#282D35] text-[#6C757D] dark:text-[#9BA3AF] rounded-xs">
                        {param.subnet}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-xs ${
                      param.danger === 'CRITICAL' ? 'bg-[#FF000F] text-white' :
                      param.danger === 'HIGH' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400' :
                      'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                    }`}>
                      {param.danger} THREAT
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-xs font-mono">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xs">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block">Nominal Target Baseline:</span>
                      <span className="text-emerald-900 dark:text-emerald-200 font-bold">{param.target}</span>
                    </div>

                    <div className="p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xs">
                      <span className="text-[10px] text-red-700 dark:text-red-400 uppercase font-bold block">Injected Threat / Danger Value:</span>
                      <span className="text-red-900 dark:text-red-300 font-bold">{param.current}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#495057] dark:text-[#CBD5E1] mt-1.5 font-sans">
                    <strong>Operational Risk:</strong> {param.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. DNS MAPPING */}
          <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E2E6EA] dark:border-[#282D35]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#FF000F]" />
                <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-[#181B1F] dark:text-white">
                  6. DNS Mapping
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold rounded-xs">
                RESPONSE POLICY ZONE (RPZ) SINKHOLE ACTIVE
              </span>
            </div>

            <div className="overflow-x-auto border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FA] dark:bg-[#1F242C] border-b border-[#E2E6EA] dark:border-[#282D35] text-[#6C757D] dark:text-[#9BA3AF] text-[11px]">
                    <th className="p-2.5 font-semibold">QUERIED DOMAIN / FQDN</th>
                    <th className="p-2.5 font-semibold">TYPE</th>
                    <th className="p-2.5 font-semibold">RESOLVED IP</th>
                    <th className="p-2.5 font-semibold">RESOLVER</th>
                    <th className="p-2.5 font-semibold">THREAT REPUTATION</th>
                    <th className="p-2.5 font-semibold">SOC ENFORCEMENT ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E6EA] dark:divide-[#282D35]">
                  {DNS_MAPPING.map((dns, index) => {
                    const isMalicious = dns.reputation.includes('C2') || dns.reputation.includes('PHISHING') || dns.reputation.includes('TUNNELING') || dns.reputation.includes('IoC');
                    return (
                      <tr 
                        key={index}
                        className={`hover:bg-[#F8F9FA] dark:hover:bg-[#1B2027] transition-colors ${
                          isMalicious ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                        }`}
                      >
                        <td className="p-2.5 font-bold text-[#181B1F] dark:text-white">
                          {dns.domain}
                        </td>
                        <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold">
                          {dns.type}
                        </td>
                        <td className="p-2.5 text-[#495057] dark:text-[#CBD5E1]">
                          {dns.resolvedIp}
                        </td>
                        <td className="p-2.5 text-[#6C757D] dark:text-[#9BA3AF]">
                          {dns.resolver}
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                            isMalicious 
                              ? 'bg-red-100 dark:bg-red-950/60 text-[#FF000F]' 
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          }`}>
                            {dns.reputation}
                          </span>
                        </td>
                        <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">
                          {dns.action}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. REMEDIATION */}
          <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#E2E6EA] dark:border-[#282D35]">
              <ShieldCheck className="w-4 h-4 text-[#FF000F]" />
              <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-[#181B1F] dark:text-white">
                7. Remediation
              </h3>
            </div>

            <div className="space-y-3">
              {REMEDIATION_STEPS.map((stepItem) => (
                <div 
                  key={stepItem.step}
                  className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 mb-1.5 border-b border-[#E2E6EA] dark:border-[#282D35]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FF000F] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {stepItem.step}
                      </span>
                      <h4 className="font-sans font-bold text-sm text-[#181B1F] dark:text-white">
                        {stepItem.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#FF000F]">
                      {stepItem.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#495057] dark:text-[#CBD5E1] pl-7">
                    {stepItem.action}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#F8F9FA] dark:bg-[#1B2027] border-t border-[#E2E6EA] dark:border-[#282D35] flex items-center justify-between gap-3 text-xs font-mono text-[#6C757D] dark:text-[#9BA3AF] shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#181B1F] dark:text-white">ABB Enterprise Incident Report</span>
            <span>•</span>
            <span>Unified Infrastructure Scope</span>
            <span>•</span>
            <span>ISO/IEC 27035</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] hover:bg-black font-sans font-bold rounded-sm transition-colors text-xs cursor-pointer"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
