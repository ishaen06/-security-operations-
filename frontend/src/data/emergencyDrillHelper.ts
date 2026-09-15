import emergencyData from './emergency_ops_dataset.json';
import { Incident } from '../types/cybersecurity';

export interface TrafficPacket {
  id: string;
  timestamp: string;
  src_ip: string;
  dst_ip: string;
  src_port: number;
  dst_port: number;
  protocol: string;
  action: 'ALLOW' | 'DROP' | 'ALERT';
  bytes: number;
  packets: number;
  threat_score: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  flag: string;
  message: string;
}

export const EMERGENCY_DATASET = emergencyData;

export const EMERGENCY_CISA_KEV = emergencyData.knownExploitedVulnerabilities || [];
export const EMERGENCY_FEODO_C2 = emergencyData.activeThreatC2Feed || [];

export function getEmergencyDrillIncidents(): Incident[] {
  const scenarios = emergencyData.emergencyScenarios || [];
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} UTC`;

  return scenarios.map((s, index) => {
    const c2 = s.indicatorsOfCompromise?.externalC2Nodes?.[0] || { ip_address: '185.196.8.156', port: 443, malware: 'Qakbot / BlackBasta' };
    const targetIp = s.indicatorsOfCompromise?.internalTargetIps?.[0] || '10.10.30.12';

    return {
      id: `INC-EMERGENCY-${index + 1}`,
      time: timeStr,
      attackType: s.title,
      mitreTactic: index === 0 ? 'T0855 - Unauthorized Command Message' : 'T1190 - Exploit Public-Facing Application',
      sourceIp: c2.ip_address,
      sourceHostname: c2.hostname || `c2-relay-${c2.country?.toLowerCase() || 'ext'}.darknet.node`,
      sourceGeo: c2.country || 'External Adversary',
      targetIp: targetIp,
      targetHostname: index === 0 ? 'rtu-substation-200.ot.abb' : 'vpn-gateway-01.corp.abb',
      subnet: index === 0 ? '10.10.30.0/24' : '10.10.10.0/24',
      protocol: index === 0 ? 'MODBUS/TCP' : 'HTTPS',
      destinationPorts: index === 0 ? '502 (Modbus)' : '443 (TLS)',
      detectedVulnerability: s.cveDetails?.vulnerabilityName || 'Known Exploited Vulnerability',
      cveId: s.primaryCve,
      impact: index === 0 
        ? 'CRITICAL SAFETY HAZARD: Direct manipulation of substation power distribution coils and unauthenticated SCADA command execution.' 
        : 'HIGH IMPACT: Active credential stuffing and lateral movement targeting corporate active directory.',
      severity: s.severity as any,
      status: 'Investigating',
      timeline: [
        {
          title: 'Initial CISA KEV Exploit Telemetry',
          timestamp: '3 mins ago',
          description: `Perimeter NGFW detected high-risk signature matching ${s.primaryCve}: ${s.cveDetails?.shortDescription || ''}`,
          completed: true
        },
        {
          title: 'Active C2 Beaconing Flagged',
          timestamp: '1 min ago',
          description: `Host ${targetIp} established encrypted handshake with flagged Feodo Tracker C2 node ${c2.ip_address}:${c2.port} (${c2.malware}).`,
          completed: true,
          active: true
        },
        {
          title: 'Emergency Drill Playbook Activated',
          timestamp: 'Just now',
          description: 'Automated containment steps dispatched to SOC analysts: isolation, airgap, and memory dump.',
          completed: false
        }
      ],
      responseActions: (s.containmentPlaybook || []).map((pb: any, pbIdx: number) => ({
        id: `act-drill-${index}-${pbIdx}`,
        name: pb.action,
        target: targetIp,
        status: pbIdx === 0 ? 'In progress' : 'Pending',
        details: `Emergency Response SOP: ${pb.action}`
      }))
    };
  });
}

// Client-side fallback traffic packet generator
export function generateClientSidePacket(counter: number): TrafficPacket {
  const c2List = EMERGENCY_FEODO_C2;
  const isThreat = Math.random() < 0.25;
  const protocols = ['TCP', 'UDP', 'MODBUS/TCP', 'IEC-104', 'HTTPS', 'DNS', 'SSH'];
  const internalIps = ['10.10.10.15', '10.10.10.22', '10.10.20.5', '10.10.30.12', '10.10.30.15', '192.168.1.100', '192.168.1.105'];
  const commonPorts = [80, 443, 502, 2404, 22, 53, 8080, 8443, 3389];
  const now = new Date().toISOString();

  if (isThreat && c2List.length > 0) {
    const c2 = c2List[Math.floor(Math.random() * c2List.length)];
    const internalIp = internalIps[Math.floor(Math.random() * internalIps.length)];
    return {
      id: `PKT-LIVE-${String(counter).padStart(5, '0')}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 899 + 100)}`,
      timestamp: now,
      src_ip: internalIp,
      dst_ip: c2.ip_address,
      src_port: 40000 + Math.floor(Math.random() * 20000),
      dst_port: c2.port || 443,
      protocol: 'TCP',
      action: 'ALERT',
      bytes: Math.floor(Math.random() * 4500) + 120,
      packets: Math.floor(Math.random() * 30) + 1,
      threat_score: Math.floor(Math.random() * 20) + 80,
      severity: 'Critical',
      flag: 'SYN,ACK,PSH',
      message: `EMERGENCY ALERT: Outbound connection to known active C2 botnet [${c2.malware || 'Feodo Tracker'} - Country: ${c2.country || 'EXT'}]`
    };
  } else {
    const src = internalIps[Math.floor(Math.random() * internalIps.length)];
    const dst = Math.random() < 0.5 ? '10.10.30.1' : '8.8.8.8';
    const proto = protocols[Math.floor(Math.random() * protocols.length)];
    const dstPort = proto === 'MODBUS/TCP' ? 502 : proto === 'IEC-104' ? 2404 : commonPorts[Math.floor(Math.random() * commonPorts.length)];
    const action = proto === 'MODBUS/TCP' || proto === 'IEC-104' ? 'ALLOW' : (Math.random() < 0.88 ? 'ALLOW' : 'DROP');

    return {
      id: `PKT-LIVE-${String(counter).padStart(5, '0')}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 899 + 100)}`,
      timestamp: now,
      src_ip: src,
      dst_ip: dst,
      src_port: 30000 + Math.floor(Math.random() * 30000),
      dst_port: dstPort,
      protocol: proto,
      action,
      bytes: Math.floor(Math.random() * 1500) + 64,
      packets: Math.floor(Math.random() * 10) + 1,
      threat_score: action === 'DROP' ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 15),
      severity: action === 'DROP' ? 'Medium' : 'Low',
      flag: 'ACK',
      message: action === 'DROP' ? 'Perimeter NGFW Rule #402 Drop' : 'Stateful Packet Inspection: Flow Established'
    };
  }
}
