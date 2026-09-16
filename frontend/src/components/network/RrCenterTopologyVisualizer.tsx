import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Server, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Zap, 
  Layers, 
  Activity, 
  Radio, 
  X, 
  ExternalLink,
  ChevronRight,
  Flame,
  Wifi,
  Cpu,
  Target,
  Crosshair
} from 'lucide-react';

export type SubnetId = 'subnet-a' | 'subnet-b' | 'subnet-c';
export type AttackType = 'Port Scan' | 'Brute Force' | 'Malware / C2' | 'DoS Attack';

export interface VulnerableDevice {
  id: string;
  hostname: string;
  ip: string;
  role: string;
  port: string;
  vulnerability: string;
  cve: string;
  severity: 'Critical' | 'High' | 'Medium';
  attackVector: AttackType;
  exploitPayload: string;
  parametersImpacted: string[];
}

interface SubnetData {
  id: SubnetId;
  name: string;
  cidr: string;
  totalHosts: number;
  onlineHosts: number;
  offlineHosts: number;
  vulnerableHosts: number;
  activeIncidents: number;
  openServices: string[];
  vulnerabilities: string[];
  vulnerableDevices: VulnerableDevice[];
  trafficVolumeMb: number;
  role: string;
}

const INITIAL_SUBNETS: Record<SubnetId, SubnetData> = {
  'subnet-a': {
    id: 'subnet-a',
    name: 'Subnet A',
    cidr: '10.10.10.0/24',
    totalHosts: 254,
    onlineHosts: 248,
    offlineHosts: 6,
    vulnerableHosts: 2,
    activeIncidents: 0,
    openServices: ['HTTPS (443)', 'DNS (53)', 'LDAP (389)', 'Kerberos (88)'],
    vulnerabilities: ['CVE-2024-21887 (Medium) - Auth Bypass Risk', 'CVE-2024-6387 (Critical) - regreSSHion RCE'],
    vulnerableDevices: [
      {
        id: 'dev-a-1',
        hostname: 'dc01.corp.abb',
        ip: '10.10.10.14',
        role: 'Active Directory Domain Controller',
        port: 'Kerberos 88 / LDAP 389',
        vulnerability: 'Ivanti Auth Bypass & Kerberos Ticket Injection',
        cve: 'CVE-2024-21887',
        severity: 'Critical',
        attackVector: 'Brute Force',
        exploitPayload: 'AS-REP Roasting & Golden Ticket Forgery Attempt',
        parametersImpacted: ['Kerberos TGS Validation', 'LDAP Admin OU Hierarchy']
      },
      {
        id: 'dev-a-2',
        hostname: 'bastion-eng-84',
        ip: '10.10.10.84',
        role: 'Engineering Bastion Jump Box',
        port: 'SSH (Port 22)',
        vulnerability: 'regreSSHion OpenSSH Unauthenticated RCE',
        cve: 'CVE-2024-6387',
        severity: 'Critical',
        attackVector: 'Port Scan',
        exploitPayload: 'SIGALRM Race Condition Memory Context Hijack',
        parametersImpacted: ['SSH Root Daemon Process', 'Audit Session Log']
      }
    ],
    trafficVolumeMb: 42.4,
    role: 'Corporate Management & Identity Services'
  },
  'subnet-b': {
    id: 'subnet-b',
    name: 'Subnet B',
    cidr: '10.10.20.0/24',
    totalHosts: 254,
    onlineHosts: 248,
    offlineHosts: 6,
    vulnerableHosts: 2,
    activeIncidents: 0,
    openServices: ['SSH (22)', 'HTTPS (443)', 'PostgreSQL (5432)', 'RDP (3389)'],
    vulnerabilities: ['CVE-2024-3400 (Critical) - Gateway Ingress Vector', 'CVE-2023-48795 (High) - Terrapin SSH'],
    vulnerableDevices: [
      {
        id: 'dev-b-1',
        hostname: 'abb-plm-srv01',
        ip: '10.10.20.14',
        role: 'Core PLM Server',
        port: 'HTTPS 443 / API 8443',
        vulnerability: 'PAN-OS Gateway Command Injection & Ingress Pivot',
        cve: 'CVE-2024-3400',
        severity: 'Critical',
        attackVector: 'Malware / C2',
        exploitPayload: 'Remote Shell Spawn via Ingress API',
        parametersImpacted: ['CAD/PLM Firmware Signatures', 'Engineering Schematics']
      },
      {
        id: 'dev-b-2',
        hostname: 'fleet-analytics-node',
        ip: '10.10.20.65',
        role: 'Operations Influx TSDB Node',
        port: 'InfluxDB 8086 / SSH 22',
        vulnerability: 'Terrapin SSH Prefix Truncation & Telemetry Skew',
        cve: 'CVE-2023-48795',
        severity: 'High',
        attackVector: 'DoS Attack',
        exploitPayload: 'Malformed Telemetry Stream Packet Injection',
        parametersImpacted: ['Turbine RPM Predictive Baseline', 'Vibration Sensor TSDB Stream']
      }
    ],
    trafficVolumeMb: 68.1,
    role: 'Operations & Analytics Compute'
  },
  'subnet-c': {
    id: 'subnet-c',
    name: 'Subnet C',
    cidr: '10.10.30.0/24',
    totalHosts: 254,
    onlineHosts: 248,
    offlineHosts: 6,
    vulnerableHosts: 3,
    activeIncidents: 0,
    openServices: ['Modbus/TCP (502)', 'IEC-104 (2404)', 'OPC UA (4840)', 'SNMP (161)'],
    vulnerabilities: ['Modbus/TCP FC 0x06 Register Override', 'CVE-2022-29953 - Turbine Overspeed Invalidation', 'Coil 00012 Forced Lockdown'],
    vulnerableDevices: [
      {
        id: 'dev-c-1',
        hostname: 'scada-master-01',
        ip: '10.10.30.42',
        role: 'Primary SCADA Master Terminal',
        port: 'Modbus/TCP (Port 502)',
        vulnerability: 'Unauthenticated Modbus/TCP FC 0x06 Register Override',
        cve: 'CWE-306 / SCADA-FC06',
        severity: 'Critical',
        attackVector: 'DoS Attack',
        exploitPayload: 'Holding Register 40001 Thermal Trip Point Overwrite',
        parametersImpacted: ['Modbus Holding Register 40001 (Thermal Trip)', 'SIL-3 Safety Interlock']
      },
      {
        id: 'dev-c-2',
        hostname: 'plc-turbine-ctrl',
        ip: '10.10.30.88',
        role: 'Steam Turbine Governor PLC',
        port: 'IEC-60870-5-104 (Port 2404)',
        vulnerability: 'Turbine Overspeed Protection Logic Invalidation',
        cve: 'CVE-2022-29953',
        severity: 'Critical',
        attackVector: 'Brute Force',
        exploitPayload: 'ASDU Type 45 Single Command Inversion (4,800 RPM Injection)',
        parametersImpacted: ['Governor Velocity Setpoint (3600 RPM)', 'Emergency Trip Relay Coil']
      },
      {
        id: 'dev-c-3',
        hostname: 'rtu-pressure-relief',
        ip: '10.10.30.105',
        role: 'Pressure Relief RTU Valve',
        port: 'OPC UA (Port 4840)',
        vulnerability: 'Coil 00012 Forced Remote Override & Buffer Exhaustion',
        cve: 'CVE-2023-38545',
        severity: 'High',
        attackVector: 'Malware / C2',
        exploitPayload: 'OPC UA NodeId Forced Write Override (Relief Valve Lockdown)',
        parametersImpacted: ['Modbus Register 40105 (Overpressure Relief Valve)', 'Barometric Chamber Pressure']
      }
    ],
    trafficVolumeMb: 24.8,
    role: 'Industrial Automation & Substation Telemetry'
  }
};

const RESPONSE_STEPS = [
  { id: 1, label: 'DETECTION', desc: 'Anomaly flagged by DPI' },
  { id: 2, label: 'CLASSIFICATION', desc: 'Attack signature identified' },
  { id: 3, label: 'SUBNET IDENTIFICATION', desc: 'Target CIDR isolated' },
  { id: 4, label: 'RISK ASSESSMENT', desc: 'Blast radius calculated' },
  { id: 5, label: 'NETWORK ISOLATION', desc: 'Dynamic airgap policy enforced' },
  { id: 6, label: 'INCIDENT LOGGING', desc: 'SIEM audit record committed' },
  { id: 7, label: 'REMEDIATION', desc: 'IP re-assigned & server reconnected' }
];

export const RrCenterTopologyVisualizer: React.FC = () => {
  const [subnets, setSubnets] = useState<Record<SubnetId, SubnetData>>(INITIAL_SUBNETS);
  const [attackedSubnetId, setAttackedSubnetId] = useState<SubnetId | null>(null);
  const [attackedDevice, setAttackedDevice] = useState<VulnerableDevice | null>(null);
  const [selectedAttackType, setSelectedAttackType] = useState<AttackType>('Port Scan');
  const [responseStep, setResponseStep] = useState<number>(0);
  const [selectedSubnetForDetails, setSelectedSubnetForDetails] = useState<SubnetData | null>(null);
  const [detectionTimestamp, setDetectionTimestamp] = useState<string>('10:42:31');
  const [incidentId, setIncidentId] = useState<string>('INC-100024');
  const [flowSpeed, setFlowSpeed] = useState<'slow' | 'normal'>('slow');
  const [isRemediating, setIsRemediating] = useState<boolean>(false);
  const [remediationPhase, setRemediationPhase] = useState<'idle' | 'assigning_ip' | 'reconnecting' | 'restored'>('idle');
  const [remediationInfo, setRemediationInfo] = useState<{
    hostname: string;
    oldIp: string;
    newIp: string;
    subnetId: SubnetId;
    deviceId: string;
  } | null>(null);
  const [reconnectingSubnetId, setReconnectingSubnetId] = useState<SubnetId | null>(null);
  const [remediationLog, setRemediationLog] = useState<{
    hostname: string;
    oldIp: string;
    newIp: string;
    timestamp: string;
  } | null>(null);

  // Calibrated slow durations for request and data packet flows
  const trunkReqDur = flowSpeed === 'slow' ? '4.0s' : '2.0s';
  const trunkDataDur = flowSpeed === 'slow' ? '4.6s' : '2.3s';
  const subnetReqDur = flowSpeed === 'slow' ? '5.2s' : '2.6s';
  const subnetDataDur = flowSpeed === 'slow' ? '5.8s' : '2.9s';

  // Remediation Action: Change device IP address and reconnect to server in the simulation
  const executeRemediation = (targetSubnet: SubnetId, targetDevice: VulnerableDevice) => {
    setIsRemediating(true);
    setResponseStep(7); // Advance Step 7: REMEDIATION & RECONNECTION

    const oldIp = targetDevice.ip;
    const hostname = targetDevice.hostname;

    // Calculate new clean IP address on this subnet
    const prefix = targetSubnet === 'subnet-a' ? '10.10.10.' : targetSubnet === 'subnet-b' ? '10.10.20.' : '10.10.30.';
    const currentSuffix = parseInt(oldIp.split('.').pop() || '10', 10);
    const newSuffix = currentSuffix < 150 ? currentSuffix + 140 : currentSuffix - 50;
    const newIp = `${prefix}${newSuffix}`;

    setRemediationInfo({
      hostname,
      oldIp,
      newIp,
      subnetId: targetSubnet,
      deviceId: targetDevice.id
    });

    // PHASE 1: Re-assign IP Lease of the system (starts immediately, lasts 2.5s)
    setRemediationPhase('assigning_ip');

    // PHASE 2 (after 2500ms): Device receives new IP, initiates TLS 1.3 handshake to reconnect to Main Server (10.10.0.1)
    setTimeout(() => {
      // Reassign IP address of device in subnet state immediately so nodes update on canvas
      setSubnets(prev => {
        const currentSubnet = prev[targetSubnet];
        if (!currentSubnet) return prev;
        return {
          ...prev,
          [targetSubnet]: {
            ...currentSubnet,
            vulnerableDevices: currentSubnet.vulnerableDevices.map(d => 
              d.id === targetDevice.id ? { ...d, ip: newIp } : d
            )
          }
        };
      });

      setRemediationPhase('reconnecting');
      setReconnectingSubnetId(targetSubnet);
    }, 2500);

    // PHASE 3 (after 5000ms total = 5s duration for Step 7): Main Server acknowledges reconnection, TLS tunnel active, telemetry restored
    setTimeout(() => {
      setRemediationPhase('restored');
      setRemediationLog({
        hostname,
        oldIp,
        newIp,
        timestamp: new Date().toLocaleTimeString()
      });

      setIsRemediating(false);
      setAttackedSubnetId(null);
      setAttackedDevice(null);
      setReconnectingSubnetId(null);

      // Commit remediation event to backend server so log is written to emergency_traffic.log and streamed live
      fetch('http://localhost:5000/api/v1/emergency/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostname,
          oldIp,
          newIp,
          subnetId: targetSubnet,
          serverIp: '10.10.0.1'
        })
      }).catch(() => {});

      // Reset phase to idle after displaying verification
      setTimeout(() => {
        setRemediationPhase('idle');
      }, 3000);

      // Broadcast remediation completion and server reconnection to global feeds
      window.dispatchEvent(new CustomEvent('abb_attack_state', {
        detail: {
          isAttacking: false,
          subnetId: null,
          attackType: null,
          targetDevice: null,
          remediation: {
            hostname,
            oldIp,
            newIp,
            reconnected: true,
            serverIp: '10.10.0.1'
          }
        }
      }));
    }, 5000);
  };

  // Sequential progression when attack is simulated:
  // Steps 1 to 6 run for 3 seconds each; Step 7 (Remediation) runs for 5 seconds:
  // Step 1: Detection (0s - 3s)
  // Step 2: Classification (3s - 6s)
  // Step 3: Subnet Identification (6s - 9s)
  // Step 4: Risk Assessment (9s - 12s)
  // Step 5: Network Isolation (12s - 15s)
  // Step 6: Incident Logging (15s - 18s)
  // Step 7: Automated Remediation (18s - 23s, 5s duration) -> IP rotated & system reconnected to Main Server (10.10.0.1)
  useEffect(() => {
    if (!attackedSubnetId || !attackedDevice) {
      if (!isRemediating) {
        setResponseStep(0);
      }
      return;
    }

    setResponseStep(1); // Step 1 starts at 0s (lasts 3s)
    const targetSubnet = attackedSubnetId;
    const targetDevice = attackedDevice;

    const timers = [
      setTimeout(() => setResponseStep(2), 3000),  // Step 2: Classification (starts at 3s, lasts 3s)
      setTimeout(() => setResponseStep(3), 6000),  // Step 3: Subnet Identification (starts at 6s, lasts 3s)
      setTimeout(() => setResponseStep(4), 9000),  // Step 4: Risk Assessment (starts at 9s, lasts 3s)
      setTimeout(() => setResponseStep(5), 12000), // Step 5: Network Isolation (starts at 12s, lasts 3s)
      setTimeout(() => setResponseStep(6), 15000), // Step 6: Incident Logging (starts at 15s, lasts 3s)
      // Automatically execute remediation once Step 6 completes after 3s (at 18s):
      setTimeout(() => {
        executeRemediation(targetSubnet, targetDevice);
      }, 18000),                                   // Step 7: Remediation (starts at 18s, lasts 3s until 21s)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [attackedSubnetId, attackedDevice]);

  const handleSimulateAttack = (subnetId: SubnetId, targetDevice?: VulnerableDevice) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setDetectionTimestamp(timeStr);
    const incId = `INC-${Math.floor(100000 + Math.random() * 90000)}`;
    setIncidentId(incId);
    setAttackedSubnetId(subnetId);
    setRemediationLog(null);

    // Resolve targeted vulnerable device
    const device = targetDevice || subnets[subnetId].vulnerableDevices[0];
    setAttackedDevice(device);
    setSelectedAttackType(device.attackVector);

    window.dispatchEvent(new CustomEvent('abb_attack_state', {
      detail: {
        isAttacking: true,
        subnetId: subnetId,
        attackType: device.attackVector,
        incidentId: incId,
        timestamp: timeStr,
        targetDevice: {
          id: device.id,
          hostname: device.hostname,
          ip: device.ip,
          role: device.role,
          port: device.port,
          cve: device.cve,
          vulnerability: device.vulnerability,
          exploitPayload: device.exploitPayload,
          parametersImpacted: device.parametersImpacted
        }
      }
    }));
  };

  const handleReset = () => {
    setAttackedSubnetId(null);
    setAttackedDevice(null);
    setIsRemediating(false);
    setRemediationPhase('idle');
    setRemediationInfo(null);
    setReconnectingSubnetId(null);
    setResponseStep(0);

    window.dispatchEvent(new CustomEvent('abb_attack_state', {
      detail: {
        isAttacking: false,
        subnetId: null,
        attackType: null,
        targetDevice: null
      }
    }));
  };

  // Manual Trigger fallback for Remediate button
  const handleRemediate = () => {
    if (!attackedDevice || !attackedSubnetId) {
      handleReset();
      return;
    }
    executeRemediation(attackedSubnetId, attackedDevice);
  };

  const isAttacking = attackedSubnetId !== null;

  return (
    <div className="space-y-6">
      {/* 1. PRIMARY CORE NETWORK TOPOLOGY CARD */}
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] p-6 sm:p-8 rounded-sm shadow-industrial">
        
        {/* Top Header of Topology */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E2E6EA] dark:border-[#282D35]">
          <div>
            {/* Signature ABB Red Accent Bar */}
            <div className="w-12 h-1.5 bg-[#FF000F] mb-3" />
            <div className="flex items-center gap-2">
              <span className="font-outrun uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#FF000F]">
                NETWORK TOPOLOGY INFRASTRUCTURE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#CED4DA] dark:border-[#343B45] text-[#495057] dark:text-[#9BA3AF] rounded-xs">
                PRIMARY CORE HOST
              </span>
            </div>
            <h2 className="font-sans font-bold text-xl sm:text-2xl text-[#181B1F] dark:text-white tracking-tight mt-1">
              Enterprise Core Network Architecture & Micro-Segmentation
            </h2>
            <p className="text-xs sm:text-sm text-[#6C757D] dark:text-[#9BA3AF] mt-0.5">
              Primary Core Host (10.10.0.1) connected through Secure Gateway / Firewall to independent Subnets A, B, and C (254 hosts each).
            </p>
          </div>

          {/* Global Security Status Pill */}
          <div className="flex items-center gap-3">
            <div 
              className={`px-3 py-2 rounded-sm border flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider ${
                isRemediating
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-700 dark:text-cyan-300 shadow-sm animate-pulse'
                  : isAttacking
                  ? 'bg-red-50 dark:bg-red-950/40 border-[#FF000F] text-[#FF000F] shadow-sm animate-pulse'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${
                isRemediating 
                  ? 'bg-cyan-500 animate-ping' 
                  : isAttacking 
                  ? 'bg-[#FF000F] animate-ping' 
                  : 'bg-emerald-500'
              }`} />
              <span>
                {isRemediating 
                  ? 'REMEDIATION ACTIVE — RECONNECTING' 
                  : isAttacking 
                  ? 'THREAT DETECTED — SUBNET ISOLATED' 
                  : 'NETWORK STATUS: PROTECTED'}
              </span>
            </div>
          </div>
        </div>

        {/* AUTOMATED RESPONSE SEQUENCE PROGRESSION TRACKER - POSITIONED ON TOP OF SIMULATION */}
        <div className="my-5 p-4 sm:p-5 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF000F]" />
              <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#181B1F] dark:text-white">
                Automated Response Sequence (ABB Adaptive SOC Engine)
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#6C757D] dark:text-[#9BA3AF]">
              {isRemediating ? (
                <span className="text-cyan-600 dark:text-cyan-400 font-bold animate-pulse">
                  Step 7 Active (5s): Rotating IP ({remediationInfo?.oldIp} → {remediationInfo?.newIp}) & Reconnecting to Main Server (10.10.0.1)...
                </span>
              ) : isAttacking ? (
                <span className="text-[#FF000F] font-bold">
                  Step {responseStep} of 7 Active (3s) • {RESPONSE_STEPS[responseStep - 1]?.label}: {RESPONSE_STEPS[responseStep - 1]?.desc}
                </span>
              ) : remediationLog ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  All 7 Steps Completed • System IP Rotated to {remediationLog.newIp} & Reconnected to Main Server (10.10.0.1)
                </span>
              ) : (
                'Standing by for telemetry trigger'
              )}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {RESPONSE_STEPS.map((step) => {
              const isRemediationStep = step.id === 7;
              const isCurrent = (isAttacking && responseStep === step.id) || (isRemediating && isRemediationStep);
              const isCompleted = (isAttacking && responseStep > step.id) || (remediationLog && isRemediationStep);

              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-sm border transition-all text-left relative overflow-hidden ${
                    isCurrent
                      ? isRemediationStep
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm animate-pulse'
                        : 'bg-[#FF000F] text-white border-[#FF000F] shadow-sm animate-pulse'
                      : isCompleted
                      ? 'bg-white dark:bg-[#16191E] border-emerald-500 text-emerald-700 dark:text-emerald-400'
                      : 'bg-white/50 dark:bg-[#16191E]/50 border-[#E2E6EA] dark:border-[#282D35] text-[#868E96]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono font-bold">
                      STEP 0{step.id}
                    </span>
                    {isCurrent && (
                      <span className="text-[8px] font-mono bg-black/25 px-1 py-0.5 rounded-xs font-bold uppercase tracking-wider text-white">
                        {isRemediationStep ? '5s ACTIVE' : '3s ACTIVE'}
                      </span>
                    )}
                    {isCompleted && !isCurrent && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    )}
                  </div>
                  <div className="text-[11px] font-sans font-bold truncate">
                    {step.label}
                  </div>
                  <div className={`text-[9px] truncate mt-0.5 ${isCurrent ? 'text-white/90' : 'text-[#6C757D]'}`}>
                    {isRemediationStep && isRemediating 
                      ? remediationPhase === 'assigning_ip' 
                        ? 'Rotating IP address...' 
                        : 'Reconnecting to Main Server...' 
                      : step.desc}
                  </div>

                  {/* Visual animated progress line while step is active (5s for Step 7 Remediation, 3s for Steps 1-6) */}
                  {isCurrent && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 overflow-hidden">
                      <div 
                        className="h-full bg-white/90"
                        style={{
                          animation: `stepTimerBar ${isRemediationStep ? '5000ms' : '3000ms'} linear forwards`
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Telemetry Flow & Cadence Control Bar */}
        <div className="p-3.5 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[#6C757D] dark:text-[#9BA3AF] text-[11px] uppercase font-bold tracking-wider">
              Telemetry Flow:
            </span>
            
            {/* Legend 1: Downstream Requests (ABB Electric Lilac) */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#615eef] shadow-sm animate-pulse" />
              <span className="text-[#181B1F] dark:text-white font-bold">Requests (Inbound / Control)</span>
              <span className="text-[10px] text-[#615eef] font-bold">↓ Downstream</span>
            </div>

            {/* Legend 2: Upstream Data (ABB Violet Purple) */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9061F9] shadow-sm animate-pulse" />
              <span className="text-[#181B1F] dark:text-white font-bold">Data & NetFlow Telemetry</span>
              <span className="text-[10px] text-[#9061F9] font-bold">↑ Upstream</span>
            </div>

            {/* Legend 3: Threat Blocked */}
            {isAttacking && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF000F] shadow-sm animate-ping" />
                <span className="text-[#FF000F] font-bold">Exploit Stream</span>
                <span className="text-[10px] text-red-600 dark:text-red-400 font-bold">⛔ Dropped / Airgap</span>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Network Topology Map */}
        <div className="relative bg-[#FAFBFD] dark:bg-[#12151A] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm p-6 sm:p-8 overflow-hidden">
        
        {/* Real-time Remediation Simulation Overlay HUD */}
        {isRemediating && remediationInfo && (
          <div className="mb-5 p-3.5 bg-gradient-to-r from-[#181B1F] via-[#1E242E] to-[#181B1F] text-white rounded-sm border-2 border-cyan-500 shadow-xl flex items-center justify-between gap-3 text-xs font-mono animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <div>
                <div className="font-bold text-cyan-400 flex items-center gap-2 text-xs">
                  <span>LOGGING COMPLETED → AUTOMATED REMEDIATION ACTIVE</span>
                  <span className="text-[9px] px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-700 rounded-xs font-bold uppercase tracking-wider">
                    {remediationPhase === 'assigning_ip' ? 'Step 1: System IP Rotation' : 'Step 2: Main Server Reconnection'}
                  </span>
                </div>
                <div className="text-gray-300 text-[11px] mt-0.5">
                  {remediationPhase === 'assigning_ip' && (
                    <span>
                      Incident logging completed. Rotating IP address of <strong>{remediationInfo.hostname}</strong> from <span className="line-through text-red-400 font-bold">{remediationInfo.oldIp}</span> to new lease <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1 py-0.2 rounded-xs">{remediationInfo.newIp}</span> and flushing local ARP cache...
                    </span>
                  )}
                  {remediationPhase === 'reconnecting' && (
                    <span>
                      Establishing secure mutual TLS 1.3 cryptographic session from newly assigned IP <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1 py-0.2 rounded-xs">{remediationInfo.newIp}</span> through Gateway to Main Server <strong>10.10.0.1</strong>...
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="px-2 py-1 bg-cyan-900/80 text-cyan-200 rounded-xs text-[10px] font-bold border border-cyan-600">
                {remediationPhase === 'assigning_ip' ? 'IP ROTATED' : 'RECONNECTING MAIN SERVER'}
              </span>
            </div>
          </div>
        )}

        {/* Topology Diagram Container */}
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          {/* LEVEL 1: Central Primary Core Host */}
          <div className="relative z-10 w-full max-w-md">
            <div className={`p-4 bg-white dark:bg-[#1B2027] border-2 rounded-sm shadow-md flex items-center justify-between gap-4 transition-all ${
              remediationPhase === 'reconnecting' 
                ? 'border-cyan-500 ring-2 ring-cyan-500/30' 
                : 'border-[#181B1F] dark:border-white'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xs flex items-center justify-center font-bold ${
                  remediationPhase === 'reconnecting'
                    ? 'bg-cyan-600 text-white animate-pulse'
                    : 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F]'
                }`}>
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-outrun uppercase tracking-widest text-[#FF000F] font-bold">
                    PRIMARY CORE INFRASTRUCTURE
                  </div>
                  <h3 className="font-sans font-bold text-base text-[#181B1F] dark:text-white">
                    Primary Core Host
                  </h3>
                  <p className="text-[11px] font-mono text-[#6C757D] dark:text-[#9BA3AF]">
                    IP: 10.10.0.1 • Core Routing Fabric
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                {remediationPhase === 'reconnecting' ? (
                  <span className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                    HANDSHAKE: {remediationInfo?.newIp}
                  </span>
                ) : remediationPhase === 'restored' || remediationLog ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    ONLINE (TLS RESTORED)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE
                  </span>
                )}
                <div className="text-[10px] text-[#6C757D]">
                  {remediationPhase === 'reconnecting' ? 'Verifying 10.10.0.1 Reconnect' : 'Uptime: 99.999%'}
                </div>
              </div>
            </div>
          </div>

          {/* Connection Line 1: Core Host to Gateway with Request, Data, and Reconnection Flows */}
          <div className="w-full max-w-sm h-14 relative flex items-center justify-center my-0.5">
            <svg className="w-48 h-full" viewBox="0 0 160 56">
              <defs>
                <path id="trunk-req-path" d="M 65 0 L 65 56" fill="none" />
                <path id="trunk-data-path" d="M 95 56 L 95 0" fill="none" />
                <path id="trunk-reconn-path" d="M 80 56 L 80 0" fill="none" />
              </defs>

              {/* Physical conduit line tracks */}
              <line x1="65" y1="0" x2="65" y2="56" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
              <line 
                x1="80" 
                y1="0" 
                x2="80" 
                y2="56" 
                stroke={remediationPhase === 'reconnecting' ? '#00D2FF' : 'transparent'} 
                strokeWidth={remediationPhase === 'reconnecting' ? '2.5' : '1'} 
                strokeDasharray={remediationPhase === 'reconnecting' ? '4 2' : 'none'}
              />
              <line x1="95" y1="0" x2="95" y2="56" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />

              {/* Downstream Request Packet (ABB Electric Lilac #615eef) */}
              <g>
                <circle r="7" fill="#615eef" opacity="0.3">
                  <animateMotion dur={trunkReqDur} repeatCount="indefinite">
                    <mpath href="#trunk-req-path" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#615eef">
                  <animateMotion dur={trunkReqDur} repeatCount="indefinite">
                    <mpath href="#trunk-req-path" />
                  </animateMotion>
                </circle>
              </g>

              {/* Upstream Data Telemetry Packet (ABB Violet Purple #9061F9) */}
              <g>
                <circle r="7" fill="#9061F9" opacity="0.3">
                  <animateMotion dur={trunkDataDur} begin="1.4s" repeatCount="indefinite">
                    <mpath href="#trunk-data-path" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#9061F9">
                  <animateMotion dur={trunkDataDur} begin="1.4s" repeatCount="indefinite">
                    <mpath href="#trunk-data-path" />
                  </animateMotion>
                </circle>
              </g>

              {/* Upstream Reconnection TLS Handshake Packet (Cyan #00D2FF) */}
              {remediationPhase === 'reconnecting' && (
                <g>
                  <circle r="9" fill="#00D2FF" opacity="0.5">
                    <animateMotion dur="0.55s" repeatCount="indefinite">
                      <mpath href="#trunk-reconn-path" />
                    </animateMotion>
                  </circle>
                  <circle r="4.5" fill="#00D2FF">
                    <animateMotion dur="0.55s" repeatCount="indefinite">
                      <mpath href="#trunk-reconn-path" />
                    </animateMotion>
                  </circle>
                </g>
              )}
            </svg>

            {/* Micro indicators alongside conduit */}
            {remediationPhase === 'reconnecting' ? (
              <div className="absolute left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 animate-pulse bg-white/90 dark:bg-black/90 px-2 py-0.5 rounded-xs border border-cyan-500 shadow-sm">
                <span>↑ RECONNECTING NEW IP ({remediationInfo?.newIp}) TO MAIN SERVER 10.10.0.1</span>
              </div>
            ) : (
              <>
                <div className="absolute left-1/2 -translate-x-20 text-[9px] font-mono font-bold text-[#615eef] flex items-center gap-0.5">
                  <span>↓ REQ</span>
                </div>
                <div className="absolute left-1/2 translate-x-12 text-[9px] font-mono font-bold text-[#9061F9] flex items-center gap-0.5">
                  <span>↑ DATA</span>
                </div>
              </>
            )}
          </div>

          {/* LEVEL 2: Secure Network Gateway / Firewall */}
          <div className="relative z-10 w-full max-w-sm">
            <div className="p-3.5 bg-white dark:bg-[#1B2027] border border-[#CED4DA] dark:border-[#343B45] rounded-sm shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#F1F3F5] dark:bg-[#282D35] rounded-xs text-[#181B1F] dark:text-white">
                  <Shield className="w-4 h-4 text-[#FF000F]" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-[#181B1F] dark:text-white">
                    Secure Network Gateway / Firewall
                  </h4>
                  <p className="text-[10px] font-mono text-[#6C757D] dark:text-[#9BA3AF]">
                    Next-Gen Stateful Inspection • DPI Rule #402 Active
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xs">
                FILTERING
              </span>
            </div>
          </div>

          {/* Connection Line 2: Multi-Subnet Branching Lines with Request & Data Flows (SVG) */}
          <div className="w-full h-20 sm:h-24 relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 84">
              <defs>
                {/* Downstream Request Paths (from Gateway 400,0) */}
                <path id="path-req-a" d="M 390 0 L 390 28 L 133 28 L 133 84" fill="none" />
                <path id="path-req-b" d="M 395 0 L 395 84" fill="none" />
                <path id="path-req-c" d="M 410 0 L 410 28 L 667 28 L 667 84" fill="none" />

                {/* Upstream Data Telemetry Paths (from Subnets to Gateway) */}
                <path id="path-data-a" d="M 143 84 L 143 36 L 396 36 L 396 0" fill="none" />
                <path id="path-data-b" d="M 405 84 L 405 0" fill="none" />
                <path id="path-data-c" d="M 657 84 L 657 36 L 404 36 L 404 0" fill="none" />

                {/* Upstream Reconnection TLS Handshake Paths (from Subnets to Gateway) */}
                <path id="path-reconn-a" d="M 133 84 L 133 28 L 400 28 L 400 0" fill="none" />
                <path id="path-reconn-b" d="M 400 84 L 400 0" fill="none" />
                <path id="path-reconn-c" d="M 667 84 L 667 28 L 400 28 L 400 0" fill="none" />

                {/* Attack Exploit Path (Stops at isolation barrier at y=36) */}
                <path id="path-atk-a" d="M 390 0 L 390 28 L 133 28 L 133 38" fill="none" />
                <path id="path-atk-b" d="M 395 0 L 395 38" fill="none" />
                <path id="path-atk-c" d="M 410 0 L 410 28 L 667 28 L 667 38" fill="none" />
              </defs>

              {/* Trunk line dropping from Gateway */}
              <line x1="400" y1="0" x2="400" y2="32" stroke="#CED4DA" strokeWidth="2" />

              {/* Horizontal Distribution Bus */}
              <line x1="133" y1="32" x2="667" y2="32" stroke="#CED4DA" strokeWidth="2" />

              {/* Branch to Subnet A */}
              <line 
                x1="133" 
                y1="32" 
                x2="133" 
                y2="84" 
                stroke={
                  reconnectingSubnetId === 'subnet-a'
                    ? '#00D2FF'
                    : attackedSubnetId === 'subnet-a'
                    ? '#FF000F'
                    : '#CED4DA'
                } 
                strokeWidth={reconnectingSubnetId === 'subnet-a' || attackedSubnetId === 'subnet-a' ? '3' : '2'}
                strokeDasharray={reconnectingSubnetId === 'subnet-a' ? '4 2' : attackedSubnetId === 'subnet-a' ? '6 4' : 'none'}
              />

              {/* Branch to Subnet B */}
              <line 
                x1="400" 
                y1="32" 
                x2="400" 
                y2="84" 
                stroke={
                  reconnectingSubnetId === 'subnet-b'
                    ? '#00D2FF'
                    : attackedSubnetId === 'subnet-b'
                    ? '#FF000F'
                    : '#CED4DA'
                } 
                strokeWidth={reconnectingSubnetId === 'subnet-b' || attackedSubnetId === 'subnet-b' ? '3' : '2'}
                strokeDasharray={reconnectingSubnetId === 'subnet-b' ? '4 2' : attackedSubnetId === 'subnet-b' ? '6 4' : 'none'}
              />

              {/* Branch to Subnet C */}
              <line 
                x1="667" 
                y1="32" 
                x2="667" 
                y2="84" 
                stroke={
                  reconnectingSubnetId === 'subnet-c'
                    ? '#00D2FF'
                    : attackedSubnetId === 'subnet-c'
                    ? '#FF000F'
                    : '#CED4DA'
                } 
                strokeWidth={reconnectingSubnetId === 'subnet-c' || attackedSubnetId === 'subnet-c' ? '3' : '2'}
                strokeDasharray={reconnectingSubnetId === 'subnet-c' ? '4 2' : attackedSubnetId === 'subnet-c' ? '6 4' : 'none'}
              />

              {/* =================================================== */}
              {/* SUBNET A PACKET FLOWS                               */}
              {/* =================================================== */}
              {attackedSubnetId !== 'subnet-a' ? (
                <>
                  {/* Downstream Request Packet (ABB Electric Lilac #615eef) */}
                  <g>
                    <circle r="7" fill="#615eef" opacity="0.3">
                      <animateMotion dur={subnetReqDur} repeatCount="indefinite">
                        <mpath href="#path-req-a" />
                      </animateMotion>
                    </circle>
                    <circle r="3.5" fill="#615eef">
                      <animateMotion dur={subnetReqDur} repeatCount="indefinite">
                        <mpath href="#path-req-a" />
                      </animateMotion>
                    </circle>
                  </g>

                  {/* Upstream Data Packet (ABB Soft Lilac Violet #A855F7) */}
                  <g>
                    <circle r="7" fill="#A855F7" opacity="0.3">
                      <animateMotion dur={subnetDataDur} begin="1.8s" repeatCount="indefinite">
                        <mpath href="#path-data-a" />
                      </animateMotion>
                    </circle>
                    <circle r="3.5" fill="#A855F7">
                      <animateMotion dur={subnetDataDur} begin="1.8s" repeatCount="indefinite">
                        <mpath href="#path-data-a" />
                      </animateMotion>
                    </circle>
                  </g>
                </>
              ) : reconnectingSubnetId === 'subnet-a' ? (
                /* Reconnection Handshake Packet (Cyan #00D2FF) */
                <g>
                  <circle r="9" fill="#00D2FF" opacity="0.5">
                    <animateMotion dur="0.6s" repeatCount="indefinite">
                      <mpath href="#path-reconn-a" />
                    </animateMotion>
                  </circle>
                  <circle r="4.5" fill="#00D2FF">
                    <animateMotion dur="0.6s" repeatCount="indefinite">
                      <mpath href="#path-reconn-a" />
                    </animateMotion>
                  </circle>
                </g>
              ) : (
                /* Attack Exploit Packet Blocked at Junction */
                <g>
                  <circle r="9" fill="#FF000F" opacity="0.35">
                    <animateMotion dur="3.0s" repeatCount="indefinite">
                      <mpath href="#path-atk-a" />
                    </animateMotion>
                  </circle>
                  <circle r="4" fill="#FF000F">
                    <animateMotion dur="3.0s" repeatCount="indefinite">
                      <mpath href="#path-atk-a" />
                    </animateMotion>
                  </circle>
                </g>
              )}

              {/* =================================================== */}
              {/* SUBNET B PACKET FLOWS                               */}
              {/* =================================================== */}
              {attackedSubnetId !== 'subnet-b' ? (
                <>
                  {/* Downstream Request Packet (ABB Electric Lilac #615eef) */}
                  <g>
                    <circle r="7" fill="#615eef" opacity="0.3">
                      <animateMotion dur={subnetReqDur} begin="0.8s" repeatCount="indefinite">
                        <mpath href="#path-req-b" />
                      </animateMotion>
                    </circle>
                    <circle r="3.5" fill="#615eef">
                      <animateMotion dur={subnetReqDur} begin="0.8s" repeatCount="indefinite">
                        <mpath href="#path-req-b" />
                      </animateMotion>
                    </circle>
                  </g>

                  {/* Upstream Data Packet (ABB Electric Violet #9061F9) */}
                  <g>
                    <circle r="7" fill="#9061F9" opacity="0.3">
                      <animateMotion dur={subnetDataDur} begin="2.6s" repeatCount="indefinite">
                        <mpath href="#path-data-b" />
                      </animateMotion>
                    </circle>
                    <circle r="3.5" fill="#9061F9">
                      <animateMotion dur={subnetDataDur} begin="2.6s" repeatCount="indefinite">
                        <mpath href="#path-data-b" />
                      </animateMotion>
                    </circle>
                  </g>
                </>
              ) : reconnectingSubnetId === 'subnet-b' ? (
                /* Reconnection Handshake Packet (Cyan #00D2FF) */
                <g>
                  <circle r="9" fill="#00D2FF" opacity="0.5">
                    <animateMotion dur="0.6s" repeatCount="indefinite">
                      <mpath href="#path-reconn-b" />
                    </animateMotion>
                  </circle>
                  <circle r="4.5" fill="#00D2FF">
                    <animateMotion dur="0.6s" repeatCount="indefinite">
                      <mpath href="#path-reconn-b" />
                    </animateMotion>
                  </circle>
                </g>
              ) : (
                /* Attack Exploit Packet Blocked at Junction */
                <g>
                  <circle r="9" fill="#FF000F" opacity="0.35">
                    <animateMotion dur="3.0s" repeatCount="indefinite">
                      <mpath href="#path-atk-b" />
                    </animateMotion>
                  </circle>
                  <circle r="4" fill="#FF000F">
                    <animateMotion dur="3.0s" repeatCount="indefinite">
                      <mpath href="#path-atk-b" />
                    </animateMotion>
                  </circle>
                </g>
              )}

              {/* =================================================== */}
              {/* SUBNET C PACKET FLOWS                               */}
              {/* =================================================== */}
              {attackedSubnetId !== 'subnet-c' ? (
                <>
                  {/* Downstream Request Packet (ABB Electric Lilac #615eef) */}
                  <g>
                    <circle r="7" fill="#615eef" opacity="0.3">
                      <animateMotion dur={subnetReqDur} begin="1.6s" repeatCount="indefinite">
                        <mpath href="#path-req-c" />
                      </animateMotion>
                    </circle>
                    <circle r="3.5" fill="#615eef">
                      <animateMotion dur={subnetReqDur} begin="1.6s" repeatCount="indefinite">
                        <mpath href="#path-req-c" />
                      </animateMotion>
                    </circle>
                  </g>

                  {/* Upstream Data Packet (ABB Deep Royal Purple #7C3AED) */}
                  <g>
                    <circle r="7" fill="#7C3AED" opacity="0.3">
                      <animateMotion dur={subnetDataDur} begin="3.4s" repeatCount="indefinite">
                        <mpath href="#path-data-c" />
                      </animateMotion>
                    </circle>
                    <circle r="3.5" fill="#7C3AED">
                      <animateMotion dur={subnetDataDur} begin="3.4s" repeatCount="indefinite">
                        <mpath href="#path-data-c" />
                      </animateMotion>
                    </circle>
                  </g>
                </>
              ) : reconnectingSubnetId === 'subnet-c' ? (
                /* Reconnection Handshake Packet (Cyan #00D2FF) */
                <g>
                  <circle r="9" fill="#00D2FF" opacity="0.5">
                    <animateMotion dur="0.6s" repeatCount="indefinite">
                      <mpath href="#path-reconn-c" />
                    </animateMotion>
                  </circle>
                  <circle r="4.5" fill="#00D2FF">
                    <animateMotion dur="0.6s" repeatCount="indefinite">
                      <mpath href="#path-reconn-c" />
                    </animateMotion>
                  </circle>
                </g>
              ) : (
                /* Attack Exploit Packet Blocked at Junction */
                <g>
                  <circle r="9" fill="#FF000F" opacity="0.35">
                    <animateMotion dur="3.0s" repeatCount="indefinite">
                      <mpath href="#path-atk-c" />
                    </animateMotion>
                  </circle>
                  <circle r="4" fill="#FF000F">
                    <animateMotion dur="3.0s" repeatCount="indefinite">
                      <mpath href="#path-atk-c" />
                    </animateMotion>
                  </circle>
                </g>
              )}
            </svg>

            {/* Dynamic Status Badges along Conduit */}
            {attackedSubnetId && !reconnectingSubnetId && !isRemediating && (
              <div 
                className="absolute top-8 -translate-x-1/2 z-20 px-2.5 py-1 bg-[#FF000F] text-white text-[9px] font-mono font-bold rounded-xs shadow-md flex items-center gap-1.5 animate-bounce border border-white dark:border-black"
                style={{
                  left: attackedSubnetId === 'subnet-a' ? '16.6%' : attackedSubnetId === 'subnet-b' ? '50%' : '83.3%'
                }}
              >
                <Lock className="w-3 h-3" />
                <span>LINK SEVERED • AIRGAP ACTIVE</span>
              </div>
            )}

            {/* Phase 1 Badge: Reassigning IP */}
            {remediationPhase === 'assigning_ip' && remediationInfo && (
              <div 
                className="absolute top-8 -translate-x-1/2 z-20 px-2.5 py-1 bg-amber-500 text-white text-[9px] font-mono font-bold rounded-xs shadow-md flex items-center gap-1.5 animate-pulse border border-white"
                style={{
                  left: remediationInfo.subnetId === 'subnet-a' ? '16.6%' : remediationInfo.subnetId === 'subnet-b' ? '50%' : '83.3%'
                }}
              >
                <RotateCcw className="w-3 h-3 animate-spin" />
                <span>ROTATING IP: {remediationInfo.oldIp} → {remediationInfo.newIp}</span>
              </div>
            )}

            {/* Phase 2 Badge: Reconnecting to Server */}
            {remediationPhase === 'reconnecting' && remediationInfo && (
              <div 
                className="absolute top-8 -translate-x-1/2 z-20 px-2.5 py-1 bg-cyan-600 text-white text-[9px] font-mono font-bold rounded-xs shadow-md flex items-center gap-1.5 animate-pulse border border-white"
                style={{
                  left: remediationInfo.subnetId === 'subnet-a' ? '16.6%' : remediationInfo.subnetId === 'subnet-b' ? '50%' : '83.3%'
                }}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
                <span>TLS HANDSHAKE: RECONNECTING {remediationInfo.newIp} TO MAIN SERVER (10.10.0.1)</span>
              </div>
            )}

            {/* Phase 3 Badge: Restored */}
            {remediationPhase === 'restored' && remediationInfo && (
              <div 
                className="absolute top-8 -translate-x-1/2 z-20 px-2.5 py-1 bg-emerald-600 text-white text-[9px] font-mono font-bold rounded-xs shadow-md flex items-center gap-1.5 border border-white"
                style={{
                  left: remediationInfo.subnetId === 'subnet-a' ? '16.6%' : remediationInfo.subnetId === 'subnet-b' ? '50%' : '83.3%'
                }}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>RECONNECTED • IP {remediationInfo.newIp} SECURED WITH MAIN SERVER</span>
              </div>
            )}
          </div>

          {/* LEVEL 3: Three Horizontally Segmented Subnets */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
            {(['subnet-a', 'subnet-b', 'subnet-c'] as SubnetId[]).map((subnetKey) => {
              const subnet = subnets[subnetKey];
              const isCompromised = attackedSubnetId === subnetKey;
              const isHealthy = !isCompromised;

              return (
                <div
                  key={subnet.id}
                  onClick={() => setSelectedSubnetForDetails(subnet)}
                  className={`p-5 rounded-sm border-2 transition-all cursor-pointer relative group ${
                    isCompromised
                      ? 'bg-red-50/70 dark:bg-red-950/20 border-[#FF000F] shadow-lg'
                      : 'bg-white dark:bg-[#1B2027] border-[#E2E6EA] dark:border-[#282D35] hover:border-[#181B1F] dark:hover:border-white shadow-sm'
                  }`}
                >
                  {/* Status Indicator Banner */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E6EA] dark:border-[#282D35]">
                    <div className="flex items-center gap-2">
                      <span className="font-outrun text-xs font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
                        {subnet.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#6C757D]">
                        {subnet.cidr}
                      </span>
                    </div>

                    <span 
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-xs flex items-center gap-1 ${
                        isCompromised
                          ? 'bg-[#FF000F] text-white animate-pulse'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {isCompromised ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>ISOLATED</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>HEALTHY</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* 254 Hosts Compact Aggregation */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#181B1F] dark:text-white text-sm">
                        {subnet.totalHosts} Hosts
                      </span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-emerald-600 dark:text-emerald-400">Online: {subnet.onlineHosts}</span>
                        <span className="text-[#6C757D]">Offline: {subnet.offlineHosts}</span>
                      </div>
                    </div>

                    {/* Live Request & Data Flow HUD inside card */}
                    <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#14181F] border border-[#E2E6EA] dark:border-[#262C36] rounded-xs text-[10px] font-mono flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isCompromised ? 'bg-red-500' : 'bg-[#615eef] animate-pulse'}`} />
                        <span className="text-[#6C757D]">Req Flow:</span>
                        <span className={`font-bold ${isCompromised ? 'text-[#FF000F]' : 'text-[#615eef]'}`}>
                          {isCompromised ? '0 req/s' : `${flowSpeed === 'slow' ? '148' : '296'} req/s`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isCompromised ? 'bg-red-500' : 'bg-[#9061F9] animate-pulse'}`} />
                        <span className="text-[#6C757D]">Data Flow:</span>
                        <span className={`font-bold ${isCompromised ? 'text-[#FF000F]' : 'text-[#9061F9]'}`}>
                          {isCompromised ? '0.0 Mbps (Airgapped)' : `${subnet.trafficVolumeMb} Mbps`}
                        </span>
                      </div>
                    </div>

                    {/* Operational Description */}
                    <div className="text-[11px] font-sans text-[#6C757D] dark:text-[#9BA3AF] flex items-center justify-between">
                      <span className="truncate">{subnet.role}</span>
                      <span className="text-[#181B1F] dark:text-white font-mono shrink-0 ml-2">
                        {isCompromised ? '0.0 Mbps' : `${subnet.trafficVolumeMb} Mbps`}
                      </span>
                    </div>

                    {/* Vulnerable Devices & Threat Targets (User Request: subnets contain vulnerable devices able to be attacked) */}
                    <div className="pt-3 border-t border-[#E2E6EA] dark:border-[#282D35] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#181B1F] dark:text-white flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-[#FF000F]" />
                          Vulnerable Devices ({subnet.vulnerableDevices.length})
                        </span>
                        <span className="text-[9px] font-mono text-[#6C757D]">
                          Exploit Targetable
                        </span>
                      </div>

                      <div className="space-y-2">
                        {subnet.vulnerableDevices.map((dev) => {
                          const isDevAttacked = isCompromised && attackedDevice?.id === dev.id;
                          const isDevRemediating = isRemediating && remediationInfo?.deviceId === dev.id;
                          const isDevRecentlyRemediated = remediationLog?.hostname === dev.hostname;

                          return (
                            <div
                              key={dev.id}
                              onClick={(e) => e.stopPropagation()}
                              className={`p-2.5 rounded-xs border transition-all ${
                                isDevRemediating
                                  ? remediationPhase === 'assigning_ip'
                                    ? 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/50 shadow-sm animate-pulse'
                                    : 'bg-cyan-50/90 dark:bg-cyan-950/50 border-cyan-500 ring-2 ring-cyan-500/50 shadow-sm animate-pulse'
                                  : isDevAttacked
                                  ? 'bg-red-100/90 dark:bg-red-950/50 border-[#FF000F] ring-1 ring-[#FF000F] shadow-sm animate-pulse'
                                  : isDevRecentlyRemediated
                                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500/40'
                                  : isCompromised
                                  ? 'bg-white/70 dark:bg-[#14181F]/70 border-emerald-300 dark:border-emerald-800'
                                  : 'bg-[#F8F9FA] dark:bg-[#14181F] border-[#E2E6EA] dark:border-[#262C36] hover:border-[#ADB5BD]'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1.5">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                      isDevRemediating 
                                        ? remediationPhase === 'assigning_ip' ? 'bg-amber-500 animate-ping' : 'bg-cyan-400 animate-ping'
                                        : isDevAttacked 
                                        ? 'bg-[#FF000F] animate-ping' 
                                        : isDevRecentlyRemediated 
                                        ? 'bg-emerald-500' 
                                        : 'bg-amber-500'
                                    }`} />
                                    <span className="font-mono font-bold text-xs text-[#181B1F] dark:text-white truncate">
                                      {dev.hostname}
                                    </span>
                                    {isDevRemediating && (
                                      <span className={`text-[8px] font-mono px-1 py-0.2 rounded-xs font-bold uppercase tracking-wider ${
                                        remediationPhase === 'assigning_ip' 
                                          ? 'bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 animate-pulse' 
                                          : 'bg-cyan-200 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 animate-pulse'
                                      }`}>
                                        {remediationPhase === 'assigning_ip' ? 'Rotating IP' : 'TLS Handshake'}
                                      </span>
                                    )}
                                    {isDevRecentlyRemediated && (
                                      <span className="text-[8px] font-mono px-1 py-0.2 rounded-xs font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                        Reconnected
                                      </span>
                                    )}
                                  </div>

                                  {/* Dynamic IP Address Display */}
                                  <div className="text-[10px] font-mono text-[#6C757D] dark:text-[#9BA3AF] mt-0.5">
                                    {isDevRemediating && remediationPhase === 'assigning_ip' && remediationInfo ? (
                                      <div className="flex items-center gap-1 font-bold">
                                        <span className="line-through text-red-500">{remediationInfo.oldIp}</span>
                                        <span className="text-amber-600">→</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 animate-pulse">{remediationInfo.newIp}</span>
                                        <span className="text-[#868E96]">• {dev.port}</span>
                                      </div>
                                    ) : isDevRemediating && remediationPhase === 'reconnecting' ? (
                                      <div className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                                        <span>{dev.ip}</span>
                                        <span>• Connecting to 10.10.0.1</span>
                                      </div>
                                    ) : isDevRecentlyRemediated ? (
                                      <div>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{dev.ip}</span>
                                        <span className="text-[#6C757D]"> (New IP) • {dev.port}</span>
                                      </div>
                                    ) : (
                                      <div>
                                        {dev.ip} • <span className="text-[#495057] dark:text-[#CBD5E1]">{dev.port}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-xs shrink-0 ${
                                  dev.severity === 'Critical'
                                    ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                }`}>
                                  {dev.cve}
                                </span>
                              </div>

                              <div className="text-[10px] text-[#495057] dark:text-[#9BA3AF] mt-1 line-clamp-1">
                                {dev.vulnerability}
                              </div>

                              {/* Interactive Attack & Remediation Trigger Buttons */}
                              <div className="mt-2 pt-1.5 border-t border-[#E9ECEF] dark:border-[#262C36] flex items-center justify-between">
                                <span className="text-[9px] font-mono text-[#6C757D]">
                                  {isDevRemediating ? (
                                    <span className="text-cyan-600 dark:text-cyan-400 font-bold animate-pulse">● REMEDIATING</span>
                                  ) : isDevAttacked ? (
                                    <span className="text-[#FF000F] font-bold">● EXPLOITED</span>
                                  ) : isCompromised ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ AIRGAPPED</span>
                                  ) : isDevRecentlyRemediated ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ ONLINE</span>
                                  ) : (
                                    <span>Vec: {dev.attackVector}</span>
                                  )}
                                </span>

                                {isDevAttacked ? (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemediate();
                                      }}
                                      disabled={isRemediating}
                                      className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#FF000F] hover:bg-[#D9000D] text-white rounded-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-xs"
                                      title="Change device IP and reconnect to Core Server (10.10.0.1)"
                                    >
                                      <RotateCcw className={`w-2.5 h-2.5 ${isRemediating ? 'animate-spin' : ''}`} />
                                      <span>{isRemediating ? 'Reconnecting...' : 'Remediate (Change IP)'}</span>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReset();
                                      }}
                                      className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#181B1F] text-white hover:bg-black rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                                      title="Neutralize threat"
                                    >
                                      <span>Reset</span>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSimulateAttack(subnet.id, dev);
                                    }}
                                    className="px-2 py-0.5 text-[9px] font-mono font-bold bg-white dark:bg-[#16191E] text-[#FF000F] border border-[#FF000F] hover:bg-[#FF000F] hover:text-white rounded-xs transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                                    title={`Launch ${dev.attackVector} against ${dev.hostname} (${dev.ip})`}
                                  >
                                    <Flame className="w-2.5 h-2.5 text-[#FF000F]" />
                                    <span>Attack Device</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      </div>
      {/* End of Card 1: Network Topology Visualizer */}

      {/* ========================================================================= */}
      {/* 2. SEPARATE CARD: THREAT SIMULATION & INCIDENT RESPONSE ENGINE            */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm shadow-sm p-5 sm:p-7 space-y-6">
        
        {/* Header of Simulation Card */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E2E6EA] dark:border-[#282D35]">
          <div>
            {/* Signature ABB Red Accent Bar */}
            <div className="w-12 h-1.5 bg-[#FF000F] mb-3" />
            <div className="flex items-center gap-2">
              <span className="font-outrun uppercase text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#FF000F]">
                THREAT SIMULATION & INCIDENT RESPONSE ENGINE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#CED4DA] dark:border-[#343B45] text-[#495057] dark:text-[#9BA3AF] rounded-xs">
                ISO/IEC 27035
              </span>
            </div>
            <h2 className="font-sans font-bold text-xl sm:text-2xl text-[#181B1F] dark:text-white tracking-tight mt-1">
              Automated Threat Detection & Attack Simulation
            </h2>
            <p className="text-xs sm:text-sm text-[#6C757D] dark:text-[#9BA3AF] mt-0.5">
              Simulate exploit vectors against individual subnets to verify autonomous firewall link severance and micro-segmentation.
            </p>
          </div>

          {/* Reset Baseline Button */}
          {isAttacking && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-bold uppercase tracking-wider bg-[#181B1F] text-white hover:bg-black rounded-sm transition-all shadow-sm shrink-0"
              title="Restore normal segmented network state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Baseline</span>
            </button>
          )}
        </div>

        {/* Attack Simulation Trigger Bar */}
        <div className="p-4 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#181B1F] dark:text-white flex items-center gap-1.5 mr-2">
              <Zap className="w-4 h-4 text-[#FF000F]" />
              Simulate Attack:
            </span>

            {/* Attack Subnet A */}
            <button
              onClick={() => handleSimulateAttack('subnet-a')}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-sm border transition-all ${
                attackedSubnetId === 'subnet-a'
                  ? 'bg-[#FF000F] text-white border-[#FF000F] shadow-sm'
                  : 'bg-white dark:bg-[#16191E] border-[#CED4DA] dark:border-[#343B45] text-[#181B1F] dark:text-white hover:border-[#FF000F]'
              }`}
            >
              Attack Subnet A (10.10.10.0/24)
            </button>

            {/* Attack Subnet B */}
            <button
              onClick={() => handleSimulateAttack('subnet-b')}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-sm border transition-all ${
                attackedSubnetId === 'subnet-b'
                  ? 'bg-[#FF000F] text-white border-[#FF000F] shadow-sm'
                  : 'bg-white dark:bg-[#16191E] border-[#CED4DA] dark:border-[#343B45] text-[#181B1F] dark:text-white hover:border-[#FF000F]'
              }`}
            >
              Attack Subnet B (10.10.20.0/24)
            </button>

            {/* Attack Subnet C */}
            <button
              onClick={() => handleSimulateAttack('subnet-c')}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-sm border transition-all ${
                attackedSubnetId === 'subnet-c'
                  ? 'bg-[#FF000F] text-white border-[#FF000F] shadow-sm'
                  : 'bg-white dark:bg-[#16191E] border-[#CED4DA] dark:border-[#343B45] text-[#181B1F] dark:text-white hover:border-[#FF000F]'
              }`}
            >
              Attack Subnet C (10.10.30.0/24)
            </button>
          </div>

          {/* Attack Vector Selector */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#6C757D] dark:text-[#9BA3AF]">Vector:</span>
            <select
              value={selectedAttackType}
              onChange={(e) => {
                const newType = e.target.value as AttackType;
                setSelectedAttackType(newType);
                if (attackedSubnetId) {
                  window.dispatchEvent(new CustomEvent('abb_attack_state', {
                    detail: {
                      isAttacking: true,
                      subnetId: attackedSubnetId,
                      attackType: newType,
                      incidentId: incidentId,
                      timestamp: detectionTimestamp
                    }
                  }));
                }
              }}
              className="px-2.5 py-1.5 bg-white dark:bg-[#16191E] border border-[#CED4DA] dark:border-[#343B45] text-[#181B1F] dark:text-white rounded-sm text-xs outline-none focus:border-[#FF000F]"
            >
              <option value="Port Scan">Port Scan / Recon</option>
              <option value="Brute Force">Brute Force Credential Spray</option>
              <option value="Malware / C2">Malware C2 Beaconing</option>
              <option value="DoS Attack">Distributed Denial of Service (DoS)</option>
            </select>
          </div>
        </div>

        {/* SECURITY EVENT PANEL (Visible when attack is simulated) */}
      {isAttacking && (
        <div className="p-5 bg-white dark:bg-[#16191E] border-2 border-[#FF000F] rounded-sm shadow-md animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#E2E6EA] dark:border-[#282D35] gap-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 bg-[#FF000F] text-white font-mono text-xs font-bold rounded-xs">
                {incidentId}
              </span>
              <h3 className="font-sans font-bold text-base text-[#181B1F] dark:text-white">
                Live Incident Response Telemetry Dossier
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 rounded-xs">
                Status: ACTIVE
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase bg-[#FF000F] text-white rounded-xs">
                Severity: HIGH
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs font-mono">
            {/* Targeted Vulnerable Endpoint */}
            <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1B2027] border-2 border-[#FF000F] rounded-xs col-span-2 sm:col-span-1">
              <span className="text-[#FF000F] text-[10px] uppercase font-bold flex items-center gap-1">
                <Target className="w-3 h-3 text-[#FF000F]" /> Targeted Device
              </span>
              <div className="font-bold text-[#FF000F] text-sm mt-0.5 truncate">
                {attackedDevice?.hostname || 'Target Endpoint'}
              </div>
              <div className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] truncate mt-0.5">
                IP: {attackedDevice?.ip} • {attackedDevice?.port}
              </div>
            </div>

            {/* Injected Vulnerability / CVE */}
            <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
              <span className="text-[#6C757D] text-[10px] uppercase font-bold">Vulnerability / CVE</span>
              <div className="font-bold text-[#FF000F] mt-0.5 truncate">
                {attackedDevice?.cve || 'Zero-Day Exploit'}
              </div>
              <div className="text-[10px] text-[#495057] dark:text-[#9BA3AF] truncate mt-0.5">
                {attackedDevice?.vulnerability}
              </div>
            </div>

            <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
              <span className="text-[#6C757D] text-[10px] uppercase">Attack Classification</span>
              <div className="font-bold text-[#181B1F] dark:text-white mt-0.5">
                {selectedAttackType}
              </div>
              <div className="text-[10px] text-[#6C757D] truncate mt-0.5">
                Severity: {attackedDevice?.severity || 'HIGH'}
              </div>
            </div>

            <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
              <span className="text-[#6C757D] text-[10px] uppercase">Affected Subnet</span>
              <div className="font-bold text-[#FF000F] mt-0.5">
                {subnets[attackedSubnetId].name} ({subnets[attackedSubnetId].cidr})
              </div>
              <div className="text-[10px] text-[#6C757D] truncate mt-0.5">
                {subnets[attackedSubnetId].totalHosts} Hosts In Enclave
              </div>
            </div>

            <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
              <span className="text-[#6C757D] text-[10px] uppercase">Detection Time</span>
              <div className="font-bold text-[#181B1F] dark:text-white mt-0.5">
                {detectionTimestamp} UTC
              </div>
              <div className="text-[10px] text-[#6C757D] truncate mt-0.5">
                Airgap Latency: &lt; 24ms
              </div>
            </div>

            <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
              <span className="text-[#6C757D] text-[10px] uppercase">Adversary Source IP</span>
              <div className="font-bold text-[#FF000F] mt-0.5">
                203.0.113.45 (External)
              </div>
              <div className="text-[10px] text-[#6C757D] truncate mt-0.5">
                BGP Autonomous System 64496
              </div>
            </div>

            <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
              <span className="text-[#6C757D] text-[10px] uppercase">Detection Engine</span>
              <div className="font-bold text-[#181B1F] dark:text-white mt-0.5">
                Network Detection System
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold truncate mt-0.5">
                94% AI Confidence
              </div>
            </div>

            <div className="p-2.5 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
              <span className="text-[#6C757D] text-[10px] uppercase">Impacted Parameter</span>
              <div className="font-bold text-[#FF000F] mt-0.5 truncate" title={attackedDevice?.parametersImpacted?.[0]}>
                {attackedDevice?.parametersImpacted?.[0] || 'Perimeter Gateway'}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold truncate mt-0.5">
                Protected by Airgap
              </div>
            </div>
          </div>

          {/* Containment Assurance Notice with Direct Action */}
          <div className="mt-4 p-3.5 bg-[#FAFBFD] dark:bg-[#1B2027] border-l-4 border-emerald-500 text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                AUTOMATED ZERO-TRUST AIRGAP CONTAINMENT VERIFIED
              </div>
              <div className="text-[#495057] dark:text-[#CBD5E1] mt-1">
                Zero-Trust micro-segmentation successfully severed the conduit to {subnets[attackedSubnetId].name}. Target endpoint <strong>{attackedDevice?.hostname} ({attackedDevice?.ip})</strong> was quarantined before lateral pivot into other industrial tiers.
              </div>
              {attackedDevice?.exploitPayload && (
                <div className="mt-1 text-[11px] text-[#FF000F]">
                  Blocked Payload: <code className="bg-red-50 dark:bg-red-950/60 px-1.5 py-0.5 rounded-xs border border-red-200 dark:border-red-900 font-mono font-bold">{attackedDevice.exploitPayload}</code>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleRemediate}
                disabled={isRemediating}
                className="px-3.5 py-1.5 bg-[#FF000F] hover:bg-[#D9000D] text-white rounded-xs text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                title="Change device IP address and securely reconnect to server"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRemediating ? 'animate-spin' : ''}`} />
                <span>{isRemediating ? 'Reassigning IP & Reconnecting...' : 'Remediate: Change IP & Reconnect Server'}</span>
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-[#181B1F] text-white hover:bg-black rounded-xs text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Dismiss and restore baseline"
              >
                <span>Neutralize Threat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Remediation Success Confirmation */}
      {remediationLog && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono animate-fadeIn">
          <div className="flex items-start sm:items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-wide">
                REMEDIATION EXECUTED: DEVICE RECONNECTED TO SERVER
              </span>
              <div className="text-[#495057] dark:text-[#CBD5E1] mt-0.5">
                Device <strong>{remediationLog.hostname}</strong> IP address was changed from <span className="line-through text-red-600">{remediationLog.oldIp}</span> to <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded-xs">{remediationLog.newIp}</span>. Local ARP cache flushed and secure TLS channel re-established with Core Gateway Server.
              </div>
            </div>
          </div>
          <button
            onClick={() => setRemediationLog(null)}
            className="text-[#6C757D] hover:text-black dark:hover:text-white text-xs font-bold px-2 py-1 rounded-xs border border-emerald-300 dark:border-emerald-800 shrink-0 self-end sm:self-center"
          >
            Dismiss
          </button>
        </div>
      )}
      </div>
      {/* End of Card 2: Attack Simulation Engine */}

      {/* TECHNICAL SUBNET DETAILS MODAL / DRAWER */}
      {selectedSubnetForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E2E6EA] dark:border-[#282D35] bg-[#F8F9FA] dark:bg-[#1B2027] flex items-center justify-between">
              <div>
                <div className="w-10 h-1 bg-[#FF000F] mb-1.5" />
                <h3 className="font-sans font-bold text-lg text-[#181B1F] dark:text-white">
                  Technical Telemetry — {selectedSubnetForDetails.name}
                </h3>
                <p className="text-xs font-mono text-[#6C757D]">
                  CIDR: {selectedSubnetForDetails.cidr} • Role: {selectedSubnetForDetails.role}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubnetForDetails(null)}
                className="p-1 text-[#6C757D] hover:text-[#181B1F] dark:hover:text-white rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
                  <span className="text-[10px] text-[#6C757D]">Total Hosts</span>
                  <div className="text-base font-bold text-[#181B1F] dark:text-white mt-0.5">
                    {selectedSubnetForDetails.totalHosts}
                  </div>
                </div>

                <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
                  <span className="text-[10px] text-[#6C757D]">Active Online</span>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {selectedSubnetForDetails.onlineHosts}
                  </div>
                </div>

                <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
                  <span className="text-[10px] text-[#6C757D]">Inactive Offline</span>
                  <div className="text-base font-bold text-[#6C757D] mt-0.5">
                    {selectedSubnetForDetails.offlineHosts}
                  </div>
                </div>

                <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
                  <span className="text-[10px] text-[#6C757D]">Security Status</span>
                  <div className="mt-0.5">
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-xs ${
                      attackedSubnetId === selectedSubnetForDetails.id
                        ? 'bg-[#FF000F] text-white animate-pulse'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {attackedSubnetId === selectedSubnetForDetails.id ? 'ISOLATED' : 'HEALTHY'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Open Services */}
              <div>
                <span className="text-[11px] font-sans font-bold text-[#181B1F] dark:text-white block mb-1.5">
                  Open Network Services:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubnetForDetails.openServices.map((svc) => (
                    <span key={svc} className="px-2 py-1 bg-[#F1F3F5] dark:bg-[#282D35] border border-[#CED4DA] dark:border-[#3A424E] text-[#181B1F] dark:text-[#E2E6EA] rounded-xs text-[11px]">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detected Vulnerabilities & Devices */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-sans font-bold text-[#181B1F] dark:text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#FF000F]" />
                    Vulnerable Endpoints & Exploit Targets:
                  </span>
                  <span className="text-[10px] text-[#6C757D]">
                    {selectedSubnetForDetails.vulnerableDevices.length} Targets Detected
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedSubnetForDetails.vulnerableDevices.map((dev) => {
                    const isDevAttacked = attackedSubnetId === selectedSubnetForDetails.id && attackedDevice?.id === dev.id;
                    return (
                      <div 
                        key={dev.id} 
                        className={`p-2.5 rounded-xs border text-[11px] ${
                          isDevAttacked
                            ? 'bg-red-50 dark:bg-red-950/40 border-[#FF000F] ring-1 ring-[#FF000F]'
                            : 'bg-[#F8F9FA] dark:bg-[#1F242C] border-[#CED4DA] dark:border-[#343B45]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isDevAttacked ? 'bg-[#FF000F] animate-ping' : 'bg-amber-500'}`} />
                            <span className="font-bold text-[#181B1F] dark:text-white font-mono">
                              {dev.hostname} ({dev.ip})
                            </span>
                            <span className="text-[10px] text-[#6C757D] font-mono">
                              Port: {dev.port}
                            </span>
                          </div>

                          <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-xs ${
                            dev.severity === 'Critical'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {dev.cve}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#495057] dark:text-[#CBD5E1] mt-1">
                          {dev.vulnerability}
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-[#E9ECEF] dark:border-[#282D35] flex items-center justify-between">
                          <span className="text-[10px] text-[#6C757D]">
                            Impacts: {dev.parametersImpacted[0]}
                          </span>
                          {isDevAttacked ? (
                            <button
                              onClick={() => handleReset()}
                              className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#181B1F] text-white hover:bg-black rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Neutralize</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSimulateAttack(selectedSubnetForDetails.id, dev)}
                              className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#FF000F] text-white hover:bg-red-700 rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Flame className="w-3 h-3" />
                              <span>Attack Device</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Traffic Volume */}
              <div className="p-3 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6C757D]">Current Throughput</span>
                  <div className="text-sm font-bold text-[#181B1F] dark:text-white">
                    {attackedSubnetId === selectedSubnetForDetails.id ? '0.00 Mbps (Blocked)' : `${selectedSubnetForDetails.trafficVolumeMb} Mbps Nominal`}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#6C757D]">Core Connection</span>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {attackedSubnetId === selectedSubnetForDetails.id ? 'AIRGAP ACTIVE' : '10G Fiber Trunk'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F8F9FA] dark:bg-[#1B2027] border-t border-[#E2E6EA] dark:border-[#282D35] flex justify-end">
              <button
                onClick={() => setSelectedSubnetForDetails(null)}
                className="px-4 py-1.5 text-xs font-sans font-semibold bg-[#181B1F] text-white hover:bg-black rounded-sm transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
