import React, { useState, useEffect } from 'react';
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
  Flame
} from 'lucide-react';

export type SubnetKey = 'subnet-a' | 'subnet-b' | 'subnet-c' | 'drill';

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
  // Subnet selection
  const [selectedSubnet, setSelectedSubnet] = useState<SubnetKey>('subnet-c');

  // Automatically select active attack subnet when an attack is triggered
  useEffect(() => {
    if (activeAttackSubnet === 'subnet-a') setSelectedSubnet('subnet-a');
    else if (activeAttackSubnet === 'subnet-b') setSelectedSubnet('subnet-b');
    else if (activeAttackSubnet === 'subnet-c') setSelectedSubnet('subnet-c');
    else if (isDrillActive) setSelectedSubnet('drill');
  }, [activeAttackSubnet, isDrillActive]);

  if (!isOpen) return null;

  // Subnet specific intelligence dossiers
  const SUBNET_DATA = {
    'subnet-a': {
      name: 'Subnet A (10.10.10.0/24)',
      role: 'Corporate Management & Identity Enclave',
      vlan: 'VLAN 10',
      gateway: '10.10.0.1 (Interface eth0)',
      totalHosts: 254,
      compromisedHosts: ['10.10.10.14 (Active Directory DC)', '10.10.10.84 (Corporate Bastion Jump)'],
      attackName: activeAttackVector || 'Distributed Kerberos Credential Spray & Lateral Movement',
      attackType: 'Credential Access / Lateral Movement (MITRE T1110.003)',
      cve: 'CVE-2024-21887 (Ivanti Connect Secure Auth Bypass)',
      incidentTime: '2026-09-11 11:42:18 UTC',
      duration: '48m 12s active • Airgap enforced in 24s',
      severity: 'HIGH',
      containmentStatus: 'Airgap Isolated & Contained',
      impact: 'Attempted domain privilege escalation against corporate identity controllers. Zero-trust microsegmentation blocked east-west pivoting toward SCADA and operational subnets.',
      parametersInDanger: [
        {
          name: 'Kerberos Ticket Granting Service (TGS)',
          target: 'NOMINAL ENCRYPTED (AES-256)',
          current: 'GOLDEN TICKET INJECTION ATTEMPT',
          danger: 'CRITICAL',
          desc: 'Attacker attempted forging Kerberos TGS to obtain Domain Admin rights on 10.10.10.14.'
        },
        {
          name: 'Corporate LDAP Directory Queries',
          target: '< 12 queries/min',
          current: '480 queries/min (LDAP Recon Sweep)',
          danger: 'HIGH',
          desc: 'High-frequency brute force scanning against Active Directory organizational units.'
        },
        {
          name: 'Ingress VPN Bastion Session Capacity',
          target: '45 Active SSL Sessions',
          current: '180 Exhaustion Flood',
          danger: 'MEDIUM',
          desc: 'Session pool saturation attempt to lock out administrative responders.'
        },
        {
          name: 'Customer & Financial Database Records',
          target: 'RESTRICTED / AIRGAPPED',
          current: '0 Records Exfiltrated',
          danger: 'PROTECTED',
          desc: 'Database airgap held; no unauthorized read transactions succeeded.'
        }
      ],
      dnsMapping: [
        {
          domain: 'corp-auth.identity-spoof.com',
          type: 'A',
          resolvedIp: '185.220.101.45',
          resolver: '10.10.0.53:53',
          reputation: 'MALICIOUS C2',
          action: 'SINKHOLED (127.0.0.1)'
        },
        {
          domain: 'vpn-token-auth.abb.com.fake-cert.ru',
          type: 'A',
          resolvedIp: '194.26.29.112',
          resolver: '10.10.0.53:53',
          reputation: 'PHISHING / HARVESTER',
          action: 'BLOCKED AT FIREWALL'
        },
        {
          domain: 'ad-sync.corp.abb.internal',
          type: 'A',
          resolvedIp: '10.10.10.14',
          resolver: '10.10.10.5:53',
          reputation: 'LEGITIMATE INTERNAL',
          action: 'INSPECTED VIA DPI'
        }
      ],
      remediationSteps: [
        {
          step: 1,
          title: 'Immediate Network Airgap & Isolation',
          status: 'COMPLETED (24s latency)',
          action: 'Isolated interface eth0 on core gateway; injected dynamic FW-DENY-ALL rule to sever external ingress and halt east-west propagation.'
        },
        {
          step: 2,
          title: 'Kerberos & Identity Token Revocation',
          status: 'COMPLETED',
          action: 'Flushed KRBTGT Kerberos master ticket twice to invalidate forged Golden Tickets; forced credential reset for all Domain Admin accounts.'
        },
        {
          step: 3,
          title: 'Host Forensic Acquisition & Quarantine',
          status: 'IN PROGRESS',
          action: 'Captured volatile RAM dumps from 10.10.10.14 and 10.10.10.84; severed lateral bastion jump sessions via EDR quarantine.'
        },
        {
          step: 4,
          title: 'Patch Deployment & System Restoration',
          status: 'PENDING APPROVAL',
          action: 'Apply vendor security patch for CVE-2024-21887; verify LDAP query baseline thresholds before reconnecting gateway routing.'
        }
      ]
    },
    'subnet-b': {
      name: 'Subnet B (10.10.20.0/24)',
      role: 'Operations & Analytics Compute Enclave',
      vlan: 'VLAN 20',
      gateway: '10.10.0.1 (Interface eth1)',
      totalHosts: 254,
      compromisedHosts: ['10.10.20.14 (ABB PLM Server)', '10.10.20.65 (Fleet Analytics Node)'],
      attackName: activeAttackVector || 'High-Bandwidth Influx & Time-Series Data Tampering',
      attackType: 'Data Manipulation / Denial of Service (MITRE T0814)',
      cve: 'CVE-2024-6387 (regreSSHion OpenSSH Signal Handler Race)',
      incidentTime: '2026-09-11 12:14:02 UTC',
      duration: '32m 44s active • Contained in 42s',
      severity: 'CRITICAL',
      containmentStatus: 'Airgap Isolated & Contained',
      impact: 'Attempted memory injection into telemetry analytics engine and modification of historical sensor baselines. Threat actor severed at perimeter router before database corruption.',
      parametersInDanger: [
        {
          name: 'Time-Series Database (TSDB) Influx Port',
          target: 'Port 8086 • Signed Telemetry Only',
          current: 'Malformed Ingestion Payloads Injected',
          danger: 'CRITICAL',
          desc: 'Attacker injected false positive sensor spikes into predictive maintenance pipeline.'
        },
        {
          name: 'OpenSSH Daemon Memory Footprint',
          target: '14.2 MB RAM',
          current: 'Memory Race Condition Triggered',
          danger: 'CRITICAL',
          desc: 'Exploitation attempt of CVE-2024-6387 to hijack root execution context.'
        },
        {
          name: 'Operations Analytics Compute Load',
          target: '34% CPU Utilization',
          current: '98% CPU Spike (Cryptomining / DoS)',
          danger: 'HIGH',
          desc: 'Resource exhaustion attack intended to blind operators to simultaneous OT probes.'
        },
        {
          name: 'Outbound NetFlow Telemetry Stream',
          target: '1.48 MB/s Nominal',
          current: '18.4 MB/s Exfiltration Attempt',
          danger: 'HIGH',
          desc: '42.4 MB analytics telemetry staged for external transfer via encrypted tunnel.'
        }
      ],
      dnsMapping: [
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
          domain: 'tsdb-cluster.ops.abb.internal',
          type: 'A',
          resolvedIp: '10.10.20.14',
          resolver: '10.10.0.53:53',
          reputation: 'LEGITIMATE INTERNAL',
          action: 'MONITORED NOMINAL'
        }
      ],
      remediationSteps: [
        {
          step: 1,
          title: 'Immediate Ingress/Egress Isolation',
          status: 'COMPLETED (42s latency)',
          action: 'Severed eth1 perimeter gateway link; dropped all incoming SSH connections on port 22 across Subnet B.'
        },
        {
          step: 2,
          title: 'OpenSSH Daemon Process Termination & Patching',
          status: 'IN PROGRESS',
          action: 'Killed vulnerable sshd worker processes exploited via CVE-2024-6387; patched OpenSSH binary to verified safe release.'
        },
        {
          step: 3,
          title: 'Time-Series Database Integrity Check',
          status: 'IN PROGRESS',
          action: 'Restored TSDB historical metrics from golden cryptographic replica snapshot; purged malformed ingestion batches.'
        },
        {
          step: 4,
          title: 'Compute Load Baseline & Resumption',
          status: 'PENDING APPROVAL',
          action: 'Verify CPU load returns below 35% nominal threshold before lifting boundary routing restrictions.'
        }
      ]
    },
    'subnet-c': {
      name: 'Subnet C (10.10.30.0/24)',
      role: 'Industrial Automation & Robotics Control (SCADA/ICS)',
      vlan: 'VLAN 30',
      gateway: '10.10.0.1 (Interface eth2)',
      totalHosts: 254,
      compromisedHosts: ['10.10.30.42 (Primary SCADA Master)', '10.10.30.88 (Turbine PLC Controller)'],
      attackName: activeAttackVector || 'SCADA Modbus/TCP Register Injection & C2 Beaconing',
      attackType: 'ICS Control Manipulation / Unauthorized Override (MITRE T0855)',
      cve: 'CISA KEV CVE-2024-3400 (Palo Alto GlobalProtect Command Injection)',
      incidentTime: '2026-09-11 13:05:49 UTC',
      duration: '18m 22s active • Airgap Severed in 18s',
      severity: 'CRITICAL',
      containmentStatus: 'Airgap Isolated & Contained',
      impact: 'Unauthorized function code 0x06 (Write Single Register) targeted turbine controller and overpressure valves. Mechanical SIL-3 emergency interlocks held; physical damage averted by sub-second airgap isolation.',
      parametersInDanger: [
        {
          name: 'Modbus Holding Register 40001 (Turbine RPM Setpoint)',
          target: '3,000 RPM Nominal (Trip Limit: 3,600 RPM)',
          current: 'INJECTED: 4,800 RPM (OVERSPEED DANGER)',
          danger: 'CRITICAL',
          desc: 'Attacker commanded lethal turbine acceleration; command was blocked at physical airgap.'
        },
        {
          name: 'Modbus Holding Register 40105 (Overpressure Relief Valve)',
          target: '0x01 (AUTO-RELIEF ENGAGED)',
          current: 'INJECTED: 0x00 (FORCED CLOSED)',
          danger: 'CRITICAL',
          desc: 'Malicious payload attempted forcing pressure relief valve shut during high-pressure cycles.'
        },
        {
          name: 'Primary Reactor Core Coolant Temperature',
          target: '68.4 °C (Warning Threshold: 85.0 °C)',
          current: 'Manipulated Target: 114.2 °C',
          danger: 'CRITICAL',
          desc: 'Targeted manipulation of cooling pump thermal thresholds to trigger steam buildup.'
        },
        {
          name: 'Telemetry Ingestion Velocity',
          target: '28 pkts/sec (Jitter < 4ms)',
          current: 'High Jitter: 148 pkts/sec (34% Drop)',
          danger: 'HIGH',
          desc: 'Telemetry feedback channel flooded to prevent operator from viewing true sensor readings.'
        }
      ],
      dnsMapping: [
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
          domain: 'modbus-gateway.subnet-c.abb.internal',
          type: 'A',
          resolvedIp: '10.10.30.1',
          resolver: '10.10.0.53:53',
          reputation: 'INTERNAL OT FABRIC',
          action: 'AIRGAP ENFORCED'
        }
      ],
      remediationSteps: [
        {
          step: 1,
          title: 'Immediate Industrial Airgap Enforcement',
          status: 'COMPLETED (18s latency)',
          action: 'Physically and logically severed boundary interface eth2; deployed rule FW-DENY-ALL-SUBNET-C to stop unauthorized Modbus writes.'
        },
        {
          step: 2,
          title: 'C2 Sinkhole & DNS Poison Neutralization',
          status: 'COMPLETED',
          action: 'Sinkholed feodo-tracker.abuse.ch C2 domain to 127.0.0.1 via Response Policy Zone (RPZ); blocked all outbound port 443 telemetry.'
        },
        {
          step: 3,
          title: 'Modbus Register Golden State Rollback',
          status: 'IN PROGRESS',
          action: 'Restored Modbus Holding Register 40001 to nominal 3,000 RPM and Register 40105 to Auto-Relief (0x01) from golden hash snapshot.'
        },
        {
          step: 4,
          title: 'PLC Firmware Verification & SIL-3 Validation',
          status: 'PENDING APPROVAL',
          action: 'Verify cryptographic checksums on PLC controllers; confirm SIL-3 emergency mechanical interlocks are operational prior to re-arming.'
        }
      ]
    },
    'drill': {
      name: 'Emergency Drill Simulation (All Subnets Enforced)',
      role: 'Full-Scale Enterprise Cyber Defense Drill',
      vlan: 'VLAN 10, 20, 30',
      gateway: '10.10.0.1 (Unified Edge Gateway)',
      totalHosts: 762,
      compromisedHosts: ['10.10.30.42 (SCADA Master)', '10.10.20.14 (PLM Server)', '10.10.10.84 (Corporate Bastion)'],
      attackName: 'Simulated CISA KEV CVE-2024-3400 & Abuse.ch Feodo Botnet Assault',
      attackType: 'Full Cyber-Physical Exercise (ISO/IEC 27035)',
      cve: 'CISA KEV CVE-2024-3400 + Abuse.ch Feodo Blocklist',
      incidentTime: '2026-09-11 14:00:00 UTC',
      duration: 'Live Drill Active • Real-Time SSE Feed Synchronized',
      severity: 'CRITICAL',
      containmentStatus: 'Airgap Isolated & Contained',
      impact: 'Controlled live-fire red team exercise testing SOC tier 1-3 triage speed, airgap microsegmentation enforcement, and real-time DNS sinkhole propagation.',
      parametersInDanger: [
        {
          name: 'Turbine Safety Boundary Setpoint',
          target: 'Nominal 3,000 RPM',
          current: 'Simulated 4,800 RPM Attack Vector',
          danger: 'CRITICAL',
          desc: 'Drill injects malicious Modbus packets every 3 minutes to test mitigation automation.'
        },
        {
          name: 'Boundary Gateway Rule Integrity',
          target: '100% Policy Compliance',
          current: 'Simulated Rule Bypass Attempt',
          danger: 'HIGH',
          desc: 'Validating that automated deny rules trigger in under 30 seconds across interfaces.'
        },
        {
          name: 'Network Telemetry Ingestion Buffer',
          target: 'Zero Buffer Overflows',
          current: '25 Logs/Batch Strict Ingestion',
          danger: 'NOMINAL',
          desc: 'Batch ingestion mechanism operating nominally with zero dropped syslog records.'
        }
      ],
      dnsMapping: [
        {
          domain: 'c2-controller.feodo-tracker.abuse.ch',
          type: 'A',
          resolvedIp: '185.220.101.45',
          resolver: '10.10.0.53:53',
          reputation: 'ABUSE.CH FEED IoC',
          action: 'SINKHOLED (127.0.0.1)'
        },
        {
          domain: 'cisa-kev-panos-poc.org',
          type: 'A',
          resolvedIp: '198.51.100.24',
          resolver: '10.10.0.53:53',
          reputation: 'CISA KEV IoC CONTROL',
          action: 'LOGGED & SINKHOLED'
        }
      ],
      remediationSteps: [
        {
          step: 1,
          title: 'Automated Drill Containment Trigger',
          status: 'COMPLETED (< 15s latency)',
          action: 'Simulated gateway rules auto-injected; edge routing severed across affected test interfaces.'
        },
        {
          step: 2,
          title: 'DNS Sinkhole Verification Test',
          status: 'COMPLETED',
          action: 'Confirmed all malicious test domains resolved to local sinkhole IP 127.0.0.1 with zero packet leakage.'
        },
        {
          step: 3,
          title: 'Telemetry Reconciliation',
          status: 'IN PROGRESS',
          action: 'Reconciled 25-log emergency batch queue against historical baseline logs in backend storage.'
        },
        {
          step: 4,
          title: 'SOC Post-Drill Evaluation',
          status: 'PENDING COMPLETION',
          action: 'Benchmark SOC response latency against ISO/IEC 27035 target standards.'
        }
      ]
    }
  };

  const current = SUBNET_DATA[selectedSubnet];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#16191E] border border-[#CED4DA] dark:border-[#282D35] rounded-sm shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E6EA] dark:border-[#282D35] bg-[#F8F9FA] dark:bg-[#1B2027] flex items-center justify-between gap-4 shrink-0">
          <div>
            {/* Signature ABB Red Accent Bar */}
            <div className="w-12 h-1.5 bg-[#FF000F] mb-1.5" />
            <div className="flex items-center gap-2">
              <span className="font-outrun uppercase text-[11px] font-bold tracking-[0.2em] text-[#FF000F]">
                ABB INCIDENT DOSSIER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-red-100 dark:bg-red-950/60 text-[#FF000F] font-bold">
                SINGLE-PAGE REPORT
              </span>
            </div>
            <h2 className="font-sans font-bold text-lg sm:text-xl text-[#181B1F] dark:text-white tracking-tight mt-0.5">
              Security Incident & Threat Analysis Report
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-[#FF000F] text-white hover:bg-[#D9000D] font-bold rounded-sm transition-colors shadow-sm"
              title="Print formal PDF report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#6C757D] hover:text-[#181B1F] dark:hover:text-white rounded-sm transition-colors ml-1"
              title="Close incident report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subnet Selector Rail */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#F1F3F5] dark:bg-[#14171C] border-b border-[#E2E6EA] dark:border-[#282D35] flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#6C757D] dark:text-[#9BA3AF] uppercase text-[11px] font-bold tracking-wider">
              Select Subnet:
            </span>
            <div className="inline-flex rounded-xs border border-[#CED4DA] dark:border-[#343B45] overflow-hidden bg-white dark:bg-[#1F242C]">
              <button
                onClick={() => setSelectedSubnet('subnet-c')}
                className={`px-3 py-1 transition-colors flex items-center gap-1.5 ${
                  selectedSubnet === 'subnet-c'
                    ? 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] font-bold'
                    : 'text-[#495057] dark:text-[#9BA3AF] hover:bg-[#E9ECEF] dark:hover:bg-[#282D35]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#FF000F] animate-pulse" />
                <span>Subnet C (Industrial)</span>
              </button>

              <button
                onClick={() => setSelectedSubnet('subnet-b')}
                className={`px-3 py-1 transition-colors flex items-center gap-1.5 ${
                  selectedSubnet === 'subnet-b'
                    ? 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] font-bold'
                    : 'text-[#495057] dark:text-[#9BA3AF] hover:bg-[#E9ECEF] dark:hover:bg-[#282D35]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Subnet B (Operations)</span>
              </button>

              <button
                onClick={() => setSelectedSubnet('subnet-a')}
                className={`px-3 py-1 transition-colors flex items-center gap-1.5 ${
                  selectedSubnet === 'subnet-a'
                    ? 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] font-bold'
                    : 'text-[#495057] dark:text-[#9BA3AF] hover:bg-[#E9ECEF] dark:hover:bg-[#282D35]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Subnet A (Corporate)</span>
              </button>

              <button
                onClick={() => setSelectedSubnet('drill')}
                className={`px-3 py-1 transition-colors flex items-center gap-1.5 ${
                  selectedSubnet === 'drill'
                    ? 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] font-bold'
                    : 'text-[#495057] dark:text-[#9BA3AF] hover:bg-[#E9ECEF] dark:hover:bg-[#282D35]'
                }`}
              >
                <Flame className="w-3 h-3 text-[#FF000F]" />
                <span>Drill Mode</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-[#6C757D] dark:text-[#9BA3AF]">Airgap Status:</span>
            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-[#FF000F] font-bold uppercase rounded-xs">
              AIRGAP ISOLATED
            </span>
          </div>
        </div>

        {/* Targeted Endpoint Banner (if active attack device exists) */}
        {activeAttackDevice && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-[#FF000F] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono shrink-0">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#FF000F] shrink-0" />
              <span className="font-bold text-[#FF000F] uppercase">Targeted Device:</span>
              <span className="font-bold text-[#181B1F] dark:text-white">
                {activeAttackDevice.hostname || 'SCADA Master'} ({activeAttackDevice.ip || '10.10.30.42'})
              </span>
              <span className="text-[#6C757D] dark:text-[#9BA3AF]">
                • Port {activeAttackDevice.port || '502'} • {activeAttackDevice.role || 'Industrial Controller'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#FF000F] text-white font-bold rounded-xs text-[10px]">
                {activeAttackDevice.cve || current.cve.split(' ')[0]}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                Zero-Trust Airgap Enforced
              </span>
            </div>
          </div>
        )}

        {/* SINGLE-PAGE SCROLLABLE REPORT CONTENT - STRICTLY THE 7 REQUESTED SECTIONS */}
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
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] uppercase block">Timestamp (UTC)</span>
                <span className="font-bold text-sm text-[#181B1F] dark:text-white mt-1 block">{current.incidentTime}</span>
                <span className="text-[10px] text-[#868E96] mt-0.5 block">Precise NTP Synchronized</span>
              </div>
              <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] uppercase block">Active Duration & Containment Latency</span>
                <span className="font-bold text-sm text-[#181B1F] dark:text-white mt-1 block">{current.duration}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 block">Automated Sub-Second Isolation</span>
              </div>
              <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] uppercase block">Current Incident Status</span>
                <span className="font-bold text-sm text-[#FF000F] mt-1 block">{current.containmentStatus}</span>
                <span className="text-[10px] text-[#868E96] mt-0.5 block">Perimeter Gateway Rule Active</span>
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
                <span className="text-[#6C757D] dark:text-[#9BA3AF]">Threat Vector:</span>
                <span className="font-bold text-[#181B1F] dark:text-white text-sm">{current.attackName}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 p-2 bg-[#F8F9FA] dark:bg-[#1F242C] rounded-xs">
                <span className="text-[#6C757D] dark:text-[#9BA3AF]">Vulnerability / CVE:</span>
                <span className="font-bold text-[#FF000F]">{current.cve}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 p-2 bg-[#F8F9FA] dark:bg-[#1F242C] rounded-xs">
                <span className="text-[#6C757D] dark:text-[#9BA3AF]">Classification (MITRE ATT&CK):</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{current.attackType}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 p-2 bg-[#F8F9FA] dark:bg-[#1F242C] rounded-xs">
                <span className="text-[#6C757D] dark:text-[#9BA3AF]">Threat Classification / Method:</span>
                <span className="text-[#495057] dark:text-[#CBD5E1]">
                  Malicious packet injection attempting unauthorized state override via protocol manipulation and Command & Control callback.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-2 p-3 bg-[#F8F9FA] dark:bg-[#1F242C] rounded-xs border border-[#E2E6EA] dark:border-[#2E3540]">
                <div className="flex justify-between">
                  <span className="text-[#6C757D] dark:text-[#9BA3AF]">Subnet Name & CIDR:</span>
                  <strong className="text-[#181B1F] dark:text-white">{current.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D] dark:text-[#9BA3AF]">Operational Purpose:</span>
                  <span className="text-[#495057] dark:text-[#CBD5E1] text-right">{current.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D] dark:text-[#9BA3AF]">VLAN:</span>
                  <span className="text-[#495057] dark:text-[#CBD5E1]">{current.vlan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D] dark:text-[#9BA3AF]">Gateway Interface:</span>
                  <span className="text-[#495057] dark:text-[#CBD5E1]">{current.gateway}</span>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-[#F8F9FA] dark:bg-[#1F242C] rounded-xs border border-[#E2E6EA] dark:border-[#2E3540]">
                <span className="text-[#6C757D] dark:text-[#9BA3AF] block font-bold">Compromised / Targeted Hosts:</span>
                <div className="space-y-1.5">
                  {current.compromisedHosts.map((host, i) => (
                    <div key={i} className="p-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xs flex items-center justify-between">
                      <span className="font-bold text-[#FF000F]">{host}</span>
                      <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-400">ISOLATED</span>
                    </div>
                  ))}
                </div>
              </div>
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
              {current.impact}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] block">Operational Equipment Safety</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">0 Physical Damage</strong>
                <span className="text-[10px] text-[#868E96]">Mechanical SIL-3 hardware interlocks held</span>
              </div>
              <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] block">Blast Radius</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">Confined to {current.name.split(' ')[0]}</strong>
                <span className="text-[10px] text-[#868E96]">Zero lateral spillover to other subnets</span>
              </div>
              <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] block">Data Exfiltration Status</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">Zero Records Lost</strong>
                <span className="text-[10px] text-[#868E96]">Perimeter drop rules severed exfiltration channel</span>
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
                {current.parametersInDanger.length} Parameters Monitored
              </span>
            </div>

            <div className="space-y-3">
              {current.parametersInDanger.map((param, index) => (
                <div 
                  key={index}
                  className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E6EA] dark:border-[#282D35]">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        param.danger === 'CRITICAL' ? 'bg-[#FF000F] animate-pulse' :
                        param.danger === 'HIGH' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <h4 className="font-sans font-bold text-sm text-[#181B1F] dark:text-white">
                        {param.name}
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-xs ${
                      param.danger === 'CRITICAL' ? 'bg-[#FF000F] text-white' :
                      param.danger === 'HIGH' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400' :
                      'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {param.danger} THREAT
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2.5 text-xs font-mono">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xs">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block">Nominal Target Baseline:</span>
                      <span className="text-emerald-900 dark:text-emerald-200 font-bold">{param.target}</span>
                    </div>

                    <div className="p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xs">
                      <span className="text-[10px] text-red-700 dark:text-red-400 uppercase font-bold block">Injected Threat / Danger Value:</span>
                      <span className="text-red-900 dark:text-red-300 font-bold">{param.current}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#495057] dark:text-[#CBD5E1] mt-2 font-sans">
                    <strong>Consequence:</strong> {param.desc}
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
                SINKHOLE ACTIVE
              </span>
            </div>

            <div className="overflow-x-auto border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FA] dark:bg-[#1F242C] border-b border-[#E2E6EA] dark:border-[#282D35] text-[#6C757D] dark:text-[#9BA3AF] text-[11px]">
                    <th className="p-2.5 font-semibold">QUERIED DOMAIN</th>
                    <th className="p-2.5 font-semibold">TYPE</th>
                    <th className="p-2.5 font-semibold">RESOLVED IP</th>
                    <th className="p-2.5 font-semibold">RESOLVER</th>
                    <th className="p-2.5 font-semibold">REPUTATION</th>
                    <th className="p-2.5 font-semibold">SOC ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E6EA] dark:divide-[#282D35]">
                  {current.dnsMapping.map((dns, index) => {
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
              {current.remediationSteps.map((stepItem) => (
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
            <span className="font-bold text-[#181B1F] dark:text-white">ABB Incident Report</span>
            <span>•</span>
            <span>Ref: {selectedSubnet.toUpperCase()}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] hover:bg-black font-sans font-bold rounded-sm transition-colors text-xs"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
