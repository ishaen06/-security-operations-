import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Server, 
  Network, 
  Clock, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Flame,
  Globe,
  Sliders,
  Cpu,
  Layers,
  Lock,
  ArrowUpRight,
  Shield,
  Target
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
  // Determine default selected subnet tab based on current simulation or drill
  const [selectedSubnet, setSelectedSubnet] = useState<SubnetKey>('subnet-c');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters' | 'dns' | 'remediation'>('overview');

  // Sync selected subnet when active attack changes
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
      cve: 'CVE-2024-21887 (Ivanti Connect Secure Authentication Bypass)',
      incidentTime: '2026-09-11 11:42:18 UTC',
      duration: '48m 12s active • Airgap enforced in 24s',
      severity: 'HIGH',
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
          reputation: 'PHISHING / CREDENTIAL HARVESTER',
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
      cve: 'CVE-2024-6387 (regreSSHion OpenSSH Signal Handler Race Condition)',
      incidentTime: '2026-09-11 12:14:02 UTC',
      duration: '32m 44s active • Contained in 42s',
      severity: 'CRITICAL',
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
      ]
    },
    'drill': {
      name: 'Emergency Drill Simulation (All Subnets Enforced)',
      role: 'Full-Scale Enterprise Cyber Defense Drill',
      vlan: 'VLAN 10, 20, 30',
      gateway: '10.10.0.1 (Unified Edge Firewall)',
      totalHosts: 762,
      compromisedHosts: ['10.10.30.42 (SCADA Master)', '10.10.20.14 (PLM Server)', '10.10.10.84 (Corporate Bastion)'],
      attackName: 'Simulated CISA KEV CVE-2024-3400 & Abuse.ch Feodo Botnet Combined Assault',
      attackType: 'Full Cyber-Physical Assault Exercise (ISO/IEC 27035)',
      cve: 'CISA KEV Catalog CVE-2024-3400 + Abuse.ch Feodo IP Blocklist',
      incidentTime: '2026-09-11 14:00:00 UTC',
      duration: 'Ongoing Simulation Exercise • Live SSE Sync Active',
      severity: 'CRITICAL',
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
      ]
    }
  };

  const current = SUBNET_DATA[selectedSubnet];

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = `[ABB SECURITY INCIDENT REPORT - ${current.name}]
Incident Time: ${current.incidentTime} (Duration: ${current.duration})
Compromised Subnet: ${current.name} (${current.role})
Attack Vector: ${current.attackName} (${current.cve})
Attack Type: ${current.attackType}
Operational Effect: ${current.impact}
Parameters In Danger:
${current.parametersInDanger.map(p => ` - ${p.name}: Current=${p.current} (Target=${p.target}) [${p.danger}]`).join('\n')}
DNS Mapping:
${current.dnsMapping.map(d => ` - ${d.domain} -> ${d.resolvedIp} (${d.reputation}) -> ${d.action}`).join('\n')}
Remediation:
 1. Immediate Airgap & Boundary Firewall Rule Injection (FW-DENY-ALL)
 2. Revocation of Active Directory & SCADA engineering tokens
 3. Volatile RAM dump & EDR host isolation
 4. Restoration of Modbus Holding Registers from cryptographic golden backup`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(current, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `abb_incident_report_${selectedSubnet}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#16191E] border border-[#CED4DA] dark:border-[#282D35] rounded-sm shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-5 border-b border-[#E2E6EA] dark:border-[#282D35] bg-[#F8F9FA] dark:bg-[#1B2027] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Signature ABB Red Accent Bar */}
            <div className="w-12 h-1.5 bg-[#FF000F] mb-2" />
            <div className="flex items-center gap-3">
              <span className="font-outrun uppercase text-xs font-bold tracking-[0.2em] text-[#FF000F]">
                ABB CYBERSECURITY INCIDENT DOSSIER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-[#CED4DA] dark:border-[#343B45] text-[#495057] dark:text-[#9BA3AF] bg-white dark:bg-[#16191E]">
                ISO/IEC 27035 & IEC 62443 COMPLIANT
              </span>
            </div>
            <h2 className="font-sans font-bold text-xl sm:text-2xl text-[#181B1F] dark:text-white tracking-tight mt-1">
              Active Security Incident & Threat Telemetry Report
            </h2>
            <p className="text-xs text-[#6C757D] dark:text-[#9BA3AF] mt-0.5">
              Comprehensive attack forensics • Parameters in danger • DNS mapping • Step-by-step remediation
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-sm border border-[#CED4DA] dark:border-[#343B45] bg-white dark:bg-[#1F242C] text-[#181B1F] dark:text-white hover:border-[#FF000F] transition-colors"
              title="Copy incident executive summary to clipboard"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#6C757D]" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-sm border border-[#CED4DA] dark:border-[#343B45] bg-white dark:bg-[#1F242C] text-[#181B1F] dark:text-white hover:border-[#FF000F] transition-colors"
              title="Download structured JSON report"
            >
              <Download className="w-3.5 h-3.5 text-[#FF000F]" />
              <span className="hidden sm:inline">JSON</span>
            </button>

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
              className="p-1.5 text-[#6C757D] hover:text-[#181B1F] dark:hover:text-white rounded-sm transition-colors ml-2"
              title="Close incident report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subnet Selector Rail */}
        <div className="px-5 py-2.5 bg-[#F1F3F5] dark:bg-[#14171C] border-b border-[#E2E6EA] dark:border-[#282D35] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#6C757D] dark:text-[#9BA3AF] uppercase text-[11px] font-bold tracking-wider">
              Select Subnet Scope:
            </span>
            <div className="inline-flex rounded-xs border border-[#CED4DA] dark:border-[#343B45] overflow-hidden bg-white dark:bg-[#1F242C]">
              <button
                onClick={() => setSelectedSubnet('subnet-c')}
                className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
                  selectedSubnet === 'subnet-c'
                    ? 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] font-bold'
                    : 'text-[#495057] dark:text-[#9BA3AF] hover:bg-[#E9ECEF] dark:hover:bg-[#282D35]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#FF000F] animate-pulse" />
                <span>Subnet C (10.10.30.0/24) - Industrial</span>
              </button>

              <button
                onClick={() => setSelectedSubnet('subnet-b')}
                className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
                  selectedSubnet === 'subnet-b'
                    ? 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] font-bold'
                    : 'text-[#495057] dark:text-[#9BA3AF] hover:bg-[#E9ECEF] dark:hover:bg-[#282D35]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Subnet B (10.10.20.0/24) - Operations</span>
              </button>

              <button
                onClick={() => setSelectedSubnet('subnet-a')}
                className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
                  selectedSubnet === 'subnet-a'
                    ? 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] font-bold'
                    : 'text-[#495057] dark:text-[#9BA3AF] hover:bg-[#E9ECEF] dark:hover:bg-[#282D35]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Subnet A (10.10.10.0/24) - Corporate</span>
              </button>

              <button
                onClick={() => setSelectedSubnet('drill')}
                className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
                  selectedSubnet === 'drill'
                    ? 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] font-bold'
                    : 'text-[#495057] dark:text-[#9BA3AF] hover:bg-[#E9ECEF] dark:hover:bg-[#282D35]'
                }`}
              >
                <Flame className="w-3 h-3 text-[#FF000F]" />
                <span>CISA KEV Emergency Drill</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-[#6C757D] dark:text-[#9BA3AF]">Active Airgap State:</span>
            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-[#FF000F] font-bold uppercase rounded-xs">
              AIRGAP ISOLATED
            </span>
          </div>
        </div>

        {/* Targeted Compromised Device Callout Banner (when device attack is simulated) */}
        {activeAttackDevice && (
          <div className="mx-5 mt-4 p-3.5 bg-red-50 dark:bg-red-950/40 border-2 border-[#FF000F] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono animate-fadeIn">
            <div className="flex items-start sm:items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF000F] animate-ping shrink-0 mt-1 sm:mt-0" />
              <div>
                <span className="font-bold text-[#FF000F] uppercase tracking-wider flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-[#FF000F]" />
                  TARGETED ENDPOINT UNDER ACTIVE EXPLOIT:
                </span>
                <div className="mt-0.5">
                  <span className="font-bold text-[#181B1F] dark:text-white text-sm">
                    {activeAttackDevice.hostname} ({activeAttackDevice.ip})
                  </span>
                  <span className="text-[#6C757D] dark:text-[#9BA3AF] ml-2">
                    • Role: {activeAttackDevice.role} • Port: {activeAttackDevice.port}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-1 bg-[#FF000F] text-white font-bold rounded-xs text-[10px] uppercase">
                {activeAttackDevice.cve}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-xs">
                Zero-Trust Airgap Enforced
              </span>
            </div>
          </div>
        )}

        {/* Navigation Section Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-[#E2E6EA] dark:border-[#282D35] bg-white dark:bg-[#16191E] font-sans text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-[#FF000F] text-[#FF000F]'
                : 'border-transparent text-[#6C757D] dark:text-[#9BA3AF] hover:text-[#181B1F] dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Incident & Attack Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('parameters')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'parameters'
                ? 'border-[#FF000F] text-[#FF000F]'
                : 'border-transparent text-[#6C757D] dark:text-[#9BA3AF] hover:text-[#181B1F] dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Parameters in Danger ({current.parametersInDanger.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dns')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dns'
                ? 'border-[#FF000F] text-[#FF000F]'
                : 'border-transparent text-[#6C757D] dark:text-[#9BA3AF] hover:text-[#181B1F] dark:hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>DNS Mapping & Threat Resolution</span>
          </button>

          <button
            onClick={() => setActiveTab('remediation')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'remediation'
                ? 'border-[#FF000F] text-[#FF000F]'
                : 'border-transparent text-[#6C757D] dark:text-[#9BA3AF] hover:text-[#181B1F] dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Step-by-Step Remediation</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-[#181B1F] dark:text-white font-sans">
          
          {/* TAB 1: OVERVIEW & ATTACK DETAILS */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fadeIn">
              {/* High-Level Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm">
                  <span className="text-[10px] uppercase text-[#6C757D] dark:text-[#9BA3AF] block">TIME OF INCIDENT</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="w-4 h-4 text-[#FF000F]" />
                    <span className="font-bold text-sm text-[#181B1F] dark:text-white">{current.incidentTime}</span>
                  </div>
                  <span className="text-[10px] text-[#868E96] mt-0.5 block">{current.duration}</span>
                </div>

                <div className="p-3.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm">
                  <span className="text-[10px] uppercase text-[#6C757D] dark:text-[#9BA3AF] block">COMPROMISED SUBNET</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Network className="w-4 h-4 text-[#FF000F]" />
                    <span className="font-bold text-sm text-[#181B1F] dark:text-white truncate">{current.name.split(' ')[0]} {current.name.split(' ')[1]}</span>
                  </div>
                  <span className="text-[10px] text-[#FF000F] font-bold mt-0.5 block">CONTAINED VIA ZERO-TRUST</span>
                </div>

                <div className="p-3.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm">
                  <span className="text-[10px] uppercase text-[#6C757D] dark:text-[#9BA3AF] block">ATTACK CLASSIFICATION</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ShieldAlert className="w-4 h-4 text-[#FF000F]" />
                    <span className="font-bold text-xs text-[#FF000F] truncate">{current.attackType.split('(')[0]}</span>
                  </div>
                  <span className="text-[10px] text-[#868E96] mt-0.5 block">{current.cve.split(' ')[0]}</span>
                </div>

                <div className="p-3.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm">
                  <span className="text-[10px] uppercase text-[#6C757D] dark:text-[#9BA3AF] block">SEVERITY / THREAT SCORE</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-[#FF000F] text-white font-bold text-xs uppercase rounded-xs">
                      {current.severity}
                    </span>
                    <span className="font-outrun font-bold text-base text-[#FF000F]">94/100</span>
                  </div>
                  <span className="text-[10px] text-[#868E96] mt-0.5 block">ISO 27035 Cat 1 Emergency</span>
                </div>
              </div>

              {/* Box 1: What The Attack Is */}
              <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#E2E6EA] dark:border-[#282D35]">
                  <Flame className="w-4 h-4 text-[#FF000F]" />
                  <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-[#181B1F] dark:text-white">
                    WHAT THE ATTACK IS (Threat Vector Analysis)
                  </h3>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="text-[#6C757D] dark:text-[#9BA3AF]">Primary Vector:</span>
                    <span className="font-bold text-[#181B1F] dark:text-white text-sm">{current.attackName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="text-[#6C757D] dark:text-[#9BA3AF]">Vulnerability & Exploit:</span>
                    <span className="font-bold text-[#FF000F]">{current.cve}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="text-[#6C757D] dark:text-[#9BA3AF]">MITRE ATT&CK Matrix:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{current.attackType}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="text-[#6C757D] dark:text-[#9BA3AF]">Identified Threat Actor Profile:</span>
                    <span className="text-[#495057] dark:text-[#CBD5E1]">APT-28 / Feodo Botnet Syndicate (Command & Control via Eastern Europe Infrastructure)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="text-[#6C757D] dark:text-[#9BA3AF]">Deep Packet Inspection Trigger:</span>
                    <span className="text-[#495057] dark:text-[#CBD5E1]">Payload matched signature SID:20243400 (Modbus unauthorized function 0x06 write coil override)</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Which Subnet is Compromised & Compromised Hosts */}
              <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#E2E6EA] dark:border-[#282D35]">
                  <Server className="w-4 h-4 text-[#FF000F]" />
                  <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-[#181B1F] dark:text-white">
                    WHICH SUBNET IS COMPROMISED & TARGET ASSETS
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#6C757D] dark:text-[#9BA3AF]">Subnet ID:</span>
                      <strong className="text-[#181B1F] dark:text-white">{current.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6C757D] dark:text-[#9BA3AF]">Operational Enclave:</span>
                      <span className="text-[#495057] dark:text-[#CBD5E1] text-right">{current.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6C757D] dark:text-[#9BA3AF]">VLAN Tag:</span>
                      <span className="text-[#495057] dark:text-[#CBD5E1]">{current.vlan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6C757D] dark:text-[#9BA3AF]">Gateway Interface:</span>
                      <span className="text-[#495057] dark:text-[#CBD5E1]">{current.gateway}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[#6C757D] dark:text-[#9BA3AF] block font-bold">Directly Impacted Hosts:</span>
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

              {/* Box 3: Effect of Happening (Operational Impact & Blast Radius) */}
              <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#E2E6EA] dark:border-[#282D35]">
                  <Activity className="w-4 h-4 text-[#FF000F]" />
                  <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-[#181B1F] dark:text-white">
                    EFFECT OF HAPPENING (Operational Impact & Blast Radius)
                  </h3>
                </div>
                <p className="text-xs text-[#495057] dark:text-[#CBD5E1] leading-relaxed mb-3">
                  {current.impact}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                    <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] block">Physical Hardware Safety</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">0 Damage • SIL-3 Interlocked</strong>
                    <span className="text-[10px] text-[#868E96]">Emergency hardware trip prevented overpressure</span>
                  </div>
                  <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                    <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] block">East-West Blast Radius</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">Contained to {current.name.split(' ')[0]}</strong>
                    <span className="text-[10px] text-[#868E96]">Adjacent Subnets running nominal purple flows</span>
                  </div>
                  <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-xs">
                    <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] block">Regulatory & Compliance</span>
                    <strong className="text-amber-600 dark:text-amber-400 text-sm mt-0.5 block">IEC 62443 / ISO 27035</strong>
                    <span className="text-[10px] text-[#868E96]">Formal SOC Incident Dossier Generated</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARAMETERS IN DANGER */}
          {activeTab === 'parameters' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E6EA] dark:border-[#282D35]">
                <div>
                  <h3 className="font-sans font-bold text-base text-[#181B1F] dark:text-white">
                    Critical Industrial & Operational Parameters in Danger
                  </h3>
                  <p className="text-xs text-[#6C757D] dark:text-[#9BA3AF]">
                    Real-time delta between nominal industrial baselines and unauthorized injected commands.
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/60 text-[#FF000F] font-mono text-xs font-bold rounded-xs">
                  {current.parametersInDanger.length} THREAT TARGETS
                </span>
              </div>

              <div className="space-y-3">
                {current.parametersInDanger.map((param, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm hover:border-[#FF000F] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F1F3F5] dark:border-[#282D35]">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          param.danger === 'CRITICAL' ? 'bg-[#FF000F] animate-ping' :
                          param.danger === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'
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
                        {param.danger} THREAT LEVEL
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs font-mono">
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xs">
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block">Nominal Baseline Value:</span>
                        <span className="text-emerald-900 dark:text-emerald-200 font-bold">{param.target}</span>
                      </div>

                      <div className="p-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xs">
                        <span className="text-[10px] text-red-700 dark:text-red-400 uppercase font-bold block">Injected Threat / Danger Value:</span>
                        <span className="text-red-900 dark:text-red-300 font-bold">{param.current}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#495057] dark:text-[#CBD5E1] mt-2.5 font-sans leading-relaxed">
                      <strong>Analysis:</strong> {param.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DNS MAPPING & RESOLUTION */}
          {activeTab === 'dns' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E6EA] dark:border-[#282D35]">
                <div>
                  <h3 className="font-sans font-bold text-base text-[#181B1F] dark:text-white">
                    DNS Threat & Resolution Mapping Table
                  </h3>
                  <p className="text-xs text-[#6C757D] dark:text-[#9BA3AF]">
                    Inbound and outbound DNS queries, authoritative resolvers, and automated sinkholing defenses.
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold rounded-xs">
                  DNS SINKHOLE ACTIVE
                </span>
              </div>

              <div className="overflow-x-auto border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8F9FA] dark:bg-[#1F242C] border-b border-[#E2E6EA] dark:border-[#282D35] text-[#6C757D] dark:text-[#9BA3AF] text-[11px]">
                      <th className="p-3 font-semibold">QUERIED FQDN / DOMAIN</th>
                      <th className="p-3 font-semibold">TYPE</th>
                      <th className="p-3 font-semibold">RESOLVED IP</th>
                      <th className="p-3 font-semibold">DNS RESOLVER</th>
                      <th className="p-3 font-semibold">THREAT REPUTATION</th>
                      <th className="p-3 font-semibold">SOC ACTION</th>
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
                          <td className="p-3 font-bold text-[#181B1F] dark:text-white">
                            {dns.domain}
                          </td>
                          <td className="p-3 text-blue-600 dark:text-blue-400 font-bold">
                            {dns.type}
                          </td>
                          <td className="p-3 text-[#495057] dark:text-[#CBD5E1]">
                            {dns.resolvedIp}
                          </td>
                          <td className="p-3 text-[#6C757D] dark:text-[#9BA3AF]">
                            {dns.resolver}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                              isMalicious 
                                ? 'bg-red-100 dark:bg-red-950/60 text-[#FF000F] border border-red-300 dark:border-red-800' 
                                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            }`}>
                              {dns.reputation}
                            </span>
                          </td>
                          <td className="p-3 font-bold">
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {dns.action}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm text-xs font-mono text-[#6C757D] dark:text-[#9BA3AF] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#FF000F] shrink-0" />
                <span>
                  <strong>Recursive DNS Policy Notice:</strong> All endpoints within Subnets A, B, and C are strictly routed through recursive resolver 10.10.0.53 with automated RPZ (Response Policy Zone) sinkholing for known Abuse.ch Feodo and CISA KEV C2 domains.
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: STEP-BY-STEP REMEDIATION */}
          {activeTab === 'remediation' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E6EA] dark:border-[#282D35]">
                <div>
                  <h3 className="font-sans font-bold text-base text-[#181B1F] dark:text-white">
                    Step-by-Step ISO/IEC 27035 Remediation Protocol
                  </h3>
                  <p className="text-xs text-[#6C757D] dark:text-[#9BA3AF]">
                    Prescribed containment, eradication, recovery, and post-incident verification procedures.
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-mono text-xs font-bold rounded-xs">
                  PLAYBOOK #ISO-27035-ABB
                </span>
              </div>

              <div className="space-y-3">
                {/* Step 1: Immediate Containment */}
                <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F1F3F5] dark:border-[#282D35]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#FF000F] text-white font-mono font-bold text-xs flex items-center justify-center">1</span>
                      <h4 className="font-sans font-bold text-sm text-[#181B1F] dark:text-white">Phase 1: Immediate Network Airgap & Isolation (COMPLETED)</h4>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">Executed in 18s</span>
                  </div>
                  <ul className="text-xs text-[#495057] dark:text-[#CBD5E1] space-y-1.5 list-disc list-inside">
                    <li>Severed logical interface <code className="text-[#FF000F]">{current.gateway}</code> at the boundary Core Gateway.</li>
                    <li>Injected dynamic firewall rule <code className="text-[#FF000F]">FW-DENY-ALL-{selectedSubnet.toUpperCase()}</code> to stop east-west lateral movement.</li>
                    <li>Broadcasted DNS RPZ sinkhole rules to isolate compromised IPs from internet C2 callbacks.</li>
                  </ul>
                </div>

                {/* Step 2: Host Eradication & Forensics */}
                <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F1F3F5] dark:border-[#282D35]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] font-mono font-bold text-xs flex items-center justify-center">2</span>
                      <h4 className="font-sans font-bold text-sm text-[#181B1F] dark:text-white">Phase 2: Forensic Capture & Host Eradication (IN PROGRESS)</h4>
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">Active Forensic Lock</span>
                  </div>
                  <ul className="text-xs text-[#495057] dark:text-[#CBD5E1] space-y-1.5 list-disc list-inside">
                    <li>Captured volatile memory snapshot (RAM dump) from {current.compromisedHosts.join(', ')} for reverse malware disassembly.</li>
                    <li>Terminated unauthorized background daemon processes and revoked Kerberos session tickets.</li>
                    <li>EDR agent isolated process tree; all non-essential communication blocked.</li>
                  </ul>
                </div>

                {/* Step 3: Recovery & Calibration */}
                <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F1F3F5] dark:border-[#282D35]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] font-mono font-bold text-xs flex items-center justify-center">3</span>
                      <h4 className="font-sans font-bold text-sm text-[#181B1F] dark:text-white">Phase 3: Golden State Recovery & Register Verification (PENDING APPROVAL)</h4>
                    </div>
                    <span className="text-[#6C757D] dark:text-[#9BA3AF] text-xs font-mono">Awaiting Lead Approval</span>
                  </div>
                  <ul className="text-xs text-[#495057] dark:text-[#CBD5E1] space-y-1.5 list-disc list-inside">
                    <li>Revert all Modbus Holding Registers (40001, 40105) from cryptographic golden snapshot hash <code className="text-[#FF000F]">#ABB-SNAP-20260910</code>.</li>
                    <li>Flash certified vendor firmware on PLC controllers to eradicate injected bootkit/rootkit elements.</li>
                    <li>Conduct multi-point sensor calibration and verify SIL-3 mechanical interlocks.</li>
                  </ul>
                </div>

                {/* Step 4: Hardening & Post-Incident */}
                <div className="p-4 bg-white dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F1F3F5] dark:border-[#282D35]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] font-mono font-bold text-xs flex items-center justify-center">4</span>
                      <h4 className="font-sans font-bold text-sm text-[#181B1F] dark:text-white">Phase 4: Defensive Hardening & Lessons Learned</h4>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">Planned Post-Recovery</span>
                  </div>
                  <ul className="text-xs text-[#495057] dark:text-[#CBD5E1] space-y-1.5 list-disc list-inside">
                    <li>Deploy vendor emergency patch for {current.cve.split(' ')[0]}.</li>
                    <li>Enforce mandatory hardware security keys (FIDO2) on all engineering workstations.</li>
                    <li>Update Suricata and Zeek IDS rulesets across the entire Core Routing Fabric.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-[#F8F9FA] dark:bg-[#1B2027] border-t border-[#E2E6EA] dark:border-[#282D35] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#6C757D] dark:text-[#9BA3AF]">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#181B1F] dark:text-white">
              ABB Industrial Incident Response Protocol
            </span>
            <span>•</span>
            <span>Ref: {selectedSubnet.toUpperCase()}-INC-2026</span>
            <span>•</span>
            <span>Authors: Ishaen S Bethur & Pragyan Hota</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F] hover:bg-black font-sans font-bold rounded-sm transition-colors text-xs"
            >
              Close Dossier
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
