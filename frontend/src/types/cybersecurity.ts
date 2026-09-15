export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus = 'Detected' | 'Investigating' | 'Contained' | 'Resolved';

export type ActionStatus = 'Pending' | 'In progress' | 'Completed' | 'Failed';

export interface TimelineEvent {
  title: string;
  timestamp: string;
  description: string;
  completed: boolean;
  active?: boolean;
}

export interface ResponseAction {
  id: string;
  name: string;
  target: string;
  status: ActionStatus;
  timestamp?: string;
  details?: string;
}

export interface Incident {
  id: string;
  time: string;
  attackType: string;
  mitreTactic?: string;
  sourceIp: string;
  sourceHostname: string;
  sourceGeo?: string;
  targetIp: string;
  targetHostname: string;
  subnet: string;
  protocol: string;
  destinationPorts: string;
  detectedVulnerability: string;
  cveId?: string;
  impact: string;
  severity: Severity;
  status: IncidentStatus;
  timeline: TimelineEvent[];
  responseActions: ResponseAction[];
}

export interface NetworkHost {
  id: string;
  hostname: string;
  ipAddress: string;
  subnet: string;
  os: string;
  openServices: string[];
  riskLevel: Severity;
  lastSeen: string;
  status: 'Online' | 'Quarantined' | 'Degraded' | 'Offline';
  activeIncidents: number;
  cpuLoad?: string;
  bandwidth?: string;
}

export interface NetworkSubnet {
  id: string;
  cidr: string;
  name: string;
  category: 'Corporate' | 'Infrastructure' | 'Guest' | 'Operational Technology';
  hostCount: number;
  activeIncidents: number;
  vulnerabilityCount: number;
  securityStatus: 'Normal' | 'Elevated' | 'Critical';
  gateway: string;
  vlanId: number;
  hosts: NetworkHost[];
}

export interface Vulnerability {
  id: string;
  cveId: string;
  vulnerability: string;
  host: string;
  ip: string;
  subnet: string;
  service: string;
  port: number | string;
  severity: Severity;
  cvssScore: number;
  status: 'Active' | 'In Remediation' | 'Mitigated' | 'Patch Pending';
  recommendedRemediation: string;
  description: string;
  potentialImpact: string;
  publishedDate: string;
}

export interface IncidentReport {
  reportId: string;
  incidentId: string;
  attack: string;
  host: string;
  subnet: string;
  severity: Severity;
  incidentTime: string;
  status: IncidentStatus;
  generatedTime: string;
  author: string;
  source: {
    ip: string;
    hostname: string;
    geo: string;
    asn: string;
  };
  target: {
    ip: string;
    hostname: string;
    role: string;
  };
  network: {
    subnet: string;
    protocol: string;
    ports: string;
  };
  vulnerability: {
    affectedService: string;
    vulnerability: string;
    severity: Severity;
  };
  impact: string;
  responseActionsTaken: string[];
  remediationRecommended: string[];
  timeline: {
    detection: string;
    analysis: string;
    response: string;
    containment: string;
  };
  finalStatus: string;
}
