import { Incident, NetworkSubnet, Vulnerability, IncidentReport, NetworkHost } from '../types/cybersecurity';

export const MOCK_HOSTS: NetworkHost[] = [
  // 192.168.10.0/24 - Employee Network
  {
    id: 'host-10-05',
    hostname: 'dc01.corp.abb',
    ipAddress: '192.168.10.5',
    subnet: '192.168.10.0/24',
    os: 'Windows Server 2022 Datacenter',
    openServices: ['Active Directory (389)', 'Kerberos (88)', 'DNS (53)', 'SMB (445)'],
    riskLevel: 'High',
    lastSeen: '2 mins ago',
    status: 'Online',
    activeIncidents: 1,
    cpuLoad: '48%',
    bandwidth: '42.8 Mbps'
  },
  {
    id: 'host-10-14',
    hostname: 'workstation-fin-12',
    ipAddress: '192.168.10.14',
    subnet: '192.168.10.0/24',
    os: 'Windows 11 Enterprise 23H2',
    openServices: ['RDP (3389)', 'NetBIOS (139)'],
    riskLevel: 'Low',
    lastSeen: 'Just now',
    status: 'Online',
    activeIncidents: 0,
    cpuLoad: '12%',
    bandwidth: '1.4 Mbps'
  },
  {
    id: 'host-10-84',
    hostname: 'workstation-eng-84',
    ipAddress: '192.168.10.84',
    subnet: '192.168.10.0/24',
    os: 'Ubuntu 24.04 LTS (x86_64)',
    openServices: ['SSH (22)', 'Docker Engine (2375)', 'VNC (5900)'],
    riskLevel: 'Medium',
    lastSeen: '1 min ago',
    status: 'Quarantined',
    activeIncidents: 1,
    cpuLoad: '89%',
    bandwidth: '8.2 Mbps'
  },
  {
    id: 'host-10-92',
    hostname: 'workstation-rd-03',
    ipAddress: '192.168.10.92',
    subnet: '192.168.10.0/24',
    os: 'macOS Sonoma 14.5',
    openServices: ['SSH (22)', 'mDNS (5353)'],
    riskLevel: 'Low',
    lastSeen: '5 mins ago',
    status: 'Online',
    activeIncidents: 0,
    cpuLoad: '15%',
    bandwidth: '3.1 Mbps'
  },
  {
    id: 'host-10-110',
    hostname: 'print-corp-fl02',
    ipAddress: '192.168.10.110',
    subnet: '192.168.10.0/24',
    os: 'Embedded Linux 5.10 (HP Laser)',
    openServices: ['IPP (631)', 'RAW (9100)', 'SNMPv2 (161)'],
    riskLevel: 'Medium',
    lastSeen: '4 mins ago',
    status: 'Online',
    activeIncidents: 0,
    cpuLoad: '6%',
    bandwidth: '0.2 Mbps'
  },

  // 192.168.20.0/24 - Server Network
  {
    id: 'host-20-01',
    hostname: 'edge-router-01.dc',
    ipAddress: '192.168.20.1',
    subnet: '192.168.20.0/24',
    os: 'Cisco IOS-XE 17.9.4a',
    openServices: ['BGP (179)', 'SSH (22)', 'SNMPv3 (161)'],
    riskLevel: 'High',
    lastSeen: 'Realtime',
    status: 'Online',
    activeIncidents: 1,
    cpuLoad: '72%',
    bandwidth: '840.5 Mbps'
  },
  {
    id: 'host-20-08',
    hostname: 'dmz-waf-gw02',
    ipAddress: '192.168.20.8',
    subnet: '192.168.20.0/24',
    os: 'Debian 12 Bookworm (Linux 6.1)',
    openServices: ['HTTPS (443)', 'HTTP (80)', 'Envoy Admin (9901)'],
    riskLevel: 'Critical',
    lastSeen: 'Just now',
    status: 'Degraded',
    activeIncidents: 1,
    cpuLoad: '94%',
    bandwidth: '312.0 Mbps'
  },
  {
    id: 'host-20-14',
    hostname: 'abb-plm-srv01',
    ipAddress: '192.168.20.14',
    subnet: '192.168.20.0/24',
    os: 'Red Hat Enterprise Linux 9.3',
    openServices: ['SSH (22)', 'PLM Core (8443)', 'PostgreSQL (5432)'],
    riskLevel: 'Critical',
    lastSeen: 'Just now',
    status: 'Quarantined',
    activeIncidents: 1,
    cpuLoad: '81%',
    bandwidth: '65.2 Mbps'
  },
  {
    id: 'host-20-45',
    hostname: 'erp-billing-db',
    ipAddress: '192.168.20.45',
    subnet: '192.168.20.0/24',
    os: 'Oracle Linux 8.8 (UEK)',
    openServices: ['Oracle TNS (1521)', 'PostgreSQL (5432)', 'SSH (22)'],
    riskLevel: 'High',
    lastSeen: '1 min ago',
    status: 'Online',
    activeIncidents: 1,
    cpuLoad: '64%',
    bandwidth: '128.4 Mbps'
  },
  {
    id: 'host-20-99',
    hostname: 'backup-nas-vault',
    ipAddress: '192.168.20.99',
    subnet: '192.168.20.0/24',
    os: 'TrueNAS CORE 13.0-U6',
    openServices: ['iSCSI (3260)', 'NFS (2049)', 'ZFS Send (8000)'],
    riskLevel: 'Low',
    lastSeen: '3 mins ago',
    status: 'Online',
    activeIncidents: 0,
    cpuLoad: '18%',
    bandwidth: '14.0 Mbps'
  },

  // 192.168.30.0/24 - Guest Network
  {
    id: 'host-30-01',
    hostname: 'guest-vlan-gw',
    ipAddress: '192.168.30.1',
    subnet: '192.168.30.0/24',
    os: 'PFSense 2.7.2-RELEASE',
    openServices: ['DNS Resolver (53)', 'Captive Portal (8002)'],
    riskLevel: 'Medium',
    lastSeen: 'Realtime',
    status: 'Online',
    activeIncidents: 0,
    cpuLoad: '31%',
    bandwidth: '88.5 Mbps'
  },
  {
    id: 'host-30-22',
    hostname: 'iot-temp-sensor-04',
    ipAddress: '192.168.30.22',
    subnet: '192.168.30.0/24',
    os: 'FreeRTOS v10.4.3 (ESP32-S3)',
    openServices: ['MQTT (8883)', 'CoAP (5683)'],
    riskLevel: 'Low',
    lastSeen: '10 mins ago',
    status: 'Online',
    activeIncidents: 0,
    cpuLoad: '8%',
    bandwidth: '0.05 Mbps'
  },
  {
    id: 'host-30-58',
    hostname: 'visitor-macbook-19',
    ipAddress: '192.168.30.58',
    subnet: '192.168.30.0/24',
    os: 'macOS Sonoma 14.2',
    openServices: ['AirDrop (8770)'],
    riskLevel: 'Low',
    lastSeen: '22 mins ago',
    status: 'Offline',
    activeIncidents: 0,
    cpuLoad: '0%',
    bandwidth: '0.0 Mbps'
  },

  // 192.168.40.0/24 - Industrial Control Network
  {
    id: 'host-40-12',
    hostname: 'scada-plc-sub01',
    ipAddress: '192.168.40.12',
    subnet: '192.168.40.0/24',
    os: 'ABB RTU560 / VxWorks 7',
    openServices: ['Modbus/TCP (502)', 'IEC 60870-5-104 (2404)', 'IEC 61850 MMS (102)'],
    riskLevel: 'Critical',
    lastSeen: 'Just now',
    status: 'Online',
    activeIncidents: 1,
    cpuLoad: '79%',
    bandwidth: '4.2 Mbps'
  },
  {
    id: 'host-40-18',
    hostname: 'abb-800xa-hmi01',
    ipAddress: '192.168.40.18',
    subnet: '192.168.40.0/24',
    os: 'Windows 10 IoT Enterprise LTSC',
    openServices: ['OPC UA (4840)', 'RDP-Restricted (3389)'],
    riskLevel: 'High',
    lastSeen: 'Just now',
    status: 'Online',
    activeIncidents: 0,
    cpuLoad: '38%',
    bandwidth: '12.6 Mbps'
  },
  {
    id: 'host-40-25',
    hostname: 'substation-relay-feeder03',
    ipAddress: '192.168.40.25',
    subnet: '192.168.40.0/24',
    os: 'ABB Relion 670 Microkernel',
    openServices: ['GOOSE Publisher', 'IEC 61850 (102)', 'DNP3 (20000)'],
    riskLevel: 'Low',
    lastSeen: 'Realtime',
    status: 'Online',
    activeIncidents: 0,
    cpuLoad: '21%',
    bandwidth: '1.8 Mbps'
  }
];

export const MOCK_SUBNETS: NetworkSubnet[] = [
  {
    id: 'sub-10',
    cidr: '192.168.10.0/24',
    name: 'Employee Network',
    category: 'Corporate',
    hostCount: 438,
    activeIncidents: 2,
    vulnerabilityCount: 14,
    securityStatus: 'Elevated',
    gateway: '192.168.10.1',
    vlanId: 10,
    hosts: MOCK_HOSTS.filter(h => h.subnet === '192.168.10.0/24')
  },
  {
    id: 'sub-20',
    cidr: '192.168.20.0/24',
    name: 'Server Network',
    category: 'Infrastructure',
    hostCount: 184,
    activeIncidents: 3,
    vulnerabilityCount: 22,
    securityStatus: 'Critical',
    gateway: '192.168.20.1',
    vlanId: 20,
    hosts: MOCK_HOSTS.filter(h => h.subnet === '192.168.20.0/24')
  },
  {
    id: 'sub-30',
    cidr: '192.168.30.0/24',
    name: 'Guest Network',
    category: 'Guest',
    hostCount: 92,
    activeIncidents: 0,
    vulnerabilityCount: 6,
    securityStatus: 'Normal',
    gateway: '192.168.30.1',
    vlanId: 30,
    hosts: MOCK_HOSTS.filter(h => h.subnet === '192.168.30.0/24')
  },
  {
    id: 'sub-40',
    cidr: '192.168.40.0/24',
    name: 'OT/ICS Control Network',
    category: 'Operational Technology',
    hostCount: 64,
    activeIncidents: 1,
    vulnerabilityCount: 8,
    securityStatus: 'Critical',
    gateway: '192.168.40.1',
    vlanId: 40,
    hosts: MOCK_HOSTS.filter(h => h.subnet === '192.168.40.0/24')
  }
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-8841',
    time: '2026-09-11 12:14:02 UTC',
    attackType: 'Cobalt Strike Beaconing',
    mitreTactic: 'Command and Control (TA0011 / T1071.001)',
    sourceIp: '198.51.100.42',
    sourceHostname: 'c2-edge-node.shadowbroker.net',
    sourceGeo: 'Frankfurt, DE (AS13335 Cloudflare)',
    targetIp: '192.168.20.14',
    targetHostname: 'abb-plm-srv01',
    subnet: '192.168.20.0/24',
    protocol: 'TCP / TLS 1.3',
    destinationPorts: '443, 22',
    detectedVulnerability: 'CVE-2024-6387 (regreSSHion)',
    cveId: 'CVE-2024-6387',
    impact: 'Unauthorized root command execution & interactive C2 beacon established on production PLM core server.',
    severity: 'Critical',
    status: 'Investigating',
    timeline: [
      {
        title: 'Threat detected',
        timestamp: '12:14:02 UTC',
        description: 'Deep Packet Inspection identified TLS beaconing cadence (interval 45s, jitter 15%) matching Cobalt Strike v4.9 profile.',
        completed: true
      },
      {
        title: 'Source identified',
        timestamp: '12:15:30 UTC',
        description: 'Origin traced to external C2 reflector node 198.51.100.42 in Frankfurt DE. Reputation score: Malicious (Threat Intel feed #9).',
        completed: true
      },
      {
        title: 'Risk assessed',
        timestamp: '12:18:10 UTC',
        description: 'Host contains proprietary product lifecycle schemas. CVSS 9.8 vulnerability exploited via signal handler race condition.',
        completed: true
      },
      {
        title: 'Response initiated',
        timestamp: '12:20:45 UTC',
        description: 'Analyst triggered automated perimeter block on boundary firewall and initiated host network isolation command.',
        completed: true,
        active: true
      },
      {
        title: 'Containment completed',
        timestamp: 'Pending verification',
        description: 'Awaiting endpoint agent confirmation of memory dump and process tree termination.',
        completed: false
      }
    ],
    responseActions: [
      {
        id: 'act-1',
        name: 'Block source IP',
        target: '198.51.100.42 (Palo Alto NGFW Edge Rule #882)',
        status: 'Completed',
        timestamp: '12:21:05 UTC',
        details: 'IP dropped across all external edge ingress interfaces.'
      },
      {
        id: 'act-2',
        name: 'Isolate host',
        target: 'abb-plm-srv01 (192.168.20.14)',
        status: 'In progress',
        timestamp: '12:21:30 UTC',
        details: 'CrowdStrike Falcon agent isolation policy applied. Forensic tunnel active.'
      },
      {
        id: 'act-3',
        name: 'Restrict port',
        target: 'Port 22 on Subnet 192.168.20.0/24',
        status: 'Pending',
        details: 'Awaiting SOC supervisor approval to limit internal SSH access to bastion gateway only.'
      },
      {
        id: 'act-4',
        name: 'Block suspicious domain',
        target: 'c2-edge-node.shadowbroker.net',
        status: 'Completed',
        timestamp: '12:22:12 UTC',
        details: 'Added to recursive DNS sinkhole (127.0.0.1) enterprise-wide.'
      }
    ]
  },
  {
    id: 'INC-2026-8839',
    time: '2026-09-11 11:48:19 UTC',
    attackType: 'Log4j JNDI Remote Code Execution',
    mitreTactic: 'Initial Access (TA0001 / T1190)',
    sourceIp: '203.0.113.19',
    sourceHostname: 'scanner-bot-04.ap-east.net',
    sourceGeo: 'Tokyo, JP (AS2516 KDDI)',
    targetIp: '192.168.20.8',
    targetHostname: 'dmz-waf-gw02',
    subnet: '192.168.20.0/24',
    protocol: 'HTTPS',
    destinationPorts: '443, 8443',
    detectedVulnerability: 'CVE-2021-44228 (Log4Shell)',
    cveId: 'CVE-2021-44228',
    impact: 'Malformed User-Agent header containing ${jndi:ldap://...} injection string sent to reverse proxy application endpoint.',
    severity: 'Critical',
    status: 'Detected',
    timeline: [
      {
        title: 'Threat detected',
        timestamp: '11:48:19 UTC',
        description: 'WAF signature alert #20044 triggered on inbound HTTP request User-Agent payload.',
        completed: true,
        active: true
      },
      {
        title: 'Source identified',
        timestamp: '11:49:05 UTC',
        description: 'IP 203.0.113.19 associated with automated vulnerability reconnaissance campaign.',
        completed: true
      },
      {
        title: 'Risk assessed',
        timestamp: 'Pending analyst review',
        description: 'Evaluating whether payload was passed downstream to Java-based backend services.',
        completed: false
      },
      {
        title: 'Response initiated',
        timestamp: 'Queued',
        description: 'Automated rate limit enforced; WAF virtual patch deployed.',
        completed: false
      },
      {
        title: 'Containment completed',
        timestamp: 'Queued',
        description: 'Pending post-incident log verification.',
        completed: false
      }
    ],
    responseActions: [
      {
        id: 'act-21',
        name: 'Block source IP',
        target: '203.0.113.19',
        status: 'Completed',
        timestamp: '11:50:00 UTC',
        details: 'Blocked at Cloudflare WAF tier.'
      },
      {
        id: 'act-22',
        name: 'Isolate host',
        target: 'dmz-waf-gw02 (192.168.20.8)',
        status: 'Pending',
        details: 'Host maintains active gateway traffic; isolation requires failover to secondary node.'
      },
      {
        id: 'act-23',
        name: 'Restrict port',
        target: 'Port 8443',
        status: 'In progress',
        details: 'Enforcing mTLS requirement on management port.'
      },
      {
        id: 'act-24',
        name: 'Block suspicious domain',
        target: 'ldap.attacker-c2.cc',
        status: 'Completed',
        timestamp: '11:51:14 UTC',
        details: 'Sinkholed domain at enterprise resolver.'
      }
    ]
  },
  {
    id: 'INC-2026-8835',
    time: '2026-09-11 10:32:41 UTC',
    attackType: 'Modbus/TCP Unauthorized Function Code',
    mitreTactic: 'Inhibit Response Function (TA0107 / T0855)',
    sourceIp: '192.168.10.84',
    sourceHostname: 'workstation-eng-84',
    sourceGeo: 'Internal Corporate LAN (Bldg 4, Fl 2)',
    targetIp: '192.168.40.12',
    targetHostname: 'scada-plc-sub01',
    subnet: '192.168.40.0/24',
    protocol: 'Modbus/TCP',
    destinationPorts: '502',
    detectedVulnerability: 'CWE-306 (Missing Authentication in Industrial Protocol)',
    cveId: 'ICS-VU-2024-09',
    impact: 'Unauthorized Force Multiple Coils (Function Code 15) sent to substation RTU; safety interlock bypass attempted.',
    severity: 'Critical',
    status: 'Contained',
    timeline: [
      {
        title: 'Threat detected',
        timestamp: '10:32:41 UTC',
        description: 'Industrial IDS (Nozomi Guardian) flagged anomalous cross-zone Modbus write command from Engineering VLAN.',
        completed: true
      },
      {
        title: 'Source identified',
        timestamp: '10:33:15 UTC',
        description: 'Compromised developer workstation (workstation-eng-84) identified as origin of script.',
        completed: true
      },
      {
        title: 'Risk assessed',
        timestamp: '10:35:00 UTC',
        description: 'Substation circuit breaker coils targeted. Physical safety interlocks held; digital override attempted.',
        completed: true
      },
      {
        title: 'Response initiated',
        timestamp: '10:36:20 UTC',
        description: 'Cross-zone routing between VLAN 10 and VLAN 40 severed immediately at core firewall.',
        completed: true
      },
      {
        title: 'Containment completed',
        timestamp: '10:40:00 UTC',
        description: 'PLC state verified nominal; engineering workstation revoked from 802.1X network access.',
        completed: true
      }
    ],
    responseActions: [
      {
        id: 'act-31',
        name: 'Block source IP',
        target: '192.168.10.84',
        status: 'Completed',
        timestamp: '10:36:30 UTC',
        details: 'Switchport shut down on access switch SW-CORP-4B.'
      },
      {
        id: 'act-32',
        name: 'Isolate host',
        target: 'workstation-eng-84',
        status: 'Completed',
        timestamp: '10:37:10 UTC',
        details: 'EDR isolated system; memory dumped for forensic extraction.'
      },
      {
        id: 'act-33',
        name: 'Restrict port',
        target: 'Port 502 (Modbus)',
        status: 'Completed',
        timestamp: '10:38:00 UTC',
        details: 'Strict unidirectional data diode rule verified for OT zone.'
      },
      {
        id: 'act-34',
        name: 'Block suspicious domain',
        target: 'N/A (Internal Attack Vector)',
        status: 'Completed',
        timestamp: '10:38:05 UTC',
        details: 'No external domain queried by script.'
      }
    ]
  },
  {
    id: 'INC-2026-8831',
    time: '2026-09-11 09:15:55 UTC',
    attackType: 'Kerberoasting Ticket Extraction',
    mitreTactic: 'Credential Access (TA0006 / T1558.003)',
    sourceIp: '192.168.10.14',
    sourceHostname: 'workstation-fin-12',
    sourceGeo: 'Internal Corporate LAN (Bldg 1)',
    targetIp: '192.168.10.5',
    targetHostname: 'dc01.corp.abb',
    subnet: '192.168.10.0/24',
    protocol: 'Kerberos / TCP',
    destinationPorts: '88',
    detectedVulnerability: 'Weak SPN Service Account Encryption (RC4-HMAC)',
    cveId: 'T1558.003',
    impact: 'Spike of 340 TGS service ticket requests with RC4 downgrade for offline password hash cracking.',
    severity: 'High',
    status: 'Investigating',
    timeline: [
      {
        title: 'Threat detected',
        timestamp: '09:15:55 UTC',
        description: 'Microsoft Defender for Identity detected Kerberos ticket anomaly event ID 4769.',
        completed: true
      },
      {
        title: 'Source identified',
        timestamp: '09:17:20 UTC',
        description: 'Originating session tied to domain user jsmith@corp.abb on workstation-fin-12.',
        completed: true
      },
      {
        title: 'Risk assessed',
        timestamp: '09:20:00 UTC',
        description: 'Service accounts for MSSQL and SAP extracted. Passwords require immediate enterprise rotation.',
        completed: true,
        active: true
      },
      {
        title: 'Response initiated',
        timestamp: '09:22:15 UTC',
        description: 'Disabled RC4-HMAC encryption on Active Directory domain controllers; initiated user session kill.',
        completed: true
      },
      {
        title: 'Containment completed',
        timestamp: 'Pending verification',
        description: 'Awaiting credential reset for 12 queried service accounts.',
        completed: false
      }
    ],
    responseActions: [
      {
        id: 'act-41',
        name: 'Block source IP',
        target: '192.168.10.14',
        status: 'In progress',
        details: 'Disabling user account and revoking Kerberos TGT.'
      },
      {
        id: 'act-42',
        name: 'Isolate host',
        target: 'workstation-fin-12',
        status: 'Pending',
        details: 'Queued for containment once memory snapshot completes.'
      },
      {
        id: 'act-43',
        name: 'Restrict port',
        target: 'Port 88 (Kerberos)',
        status: 'Completed',
        timestamp: '09:23:45 UTC',
        details: 'Enforced AES-256 exclusively for all Kerberos ticket exchanges.'
      },
      {
        id: 'act-44',
        name: 'Block suspicious domain',
        target: 'N/A',
        status: 'Completed',
        details: 'Internal Active Directory threat.'
      }
    ]
  },
  {
    id: 'INC-2026-8828',
    time: '2026-09-11 08:04:12 UTC',
    attackType: 'SQL Injection & Data Exfiltration',
    mitreTactic: 'Exfiltration (TA0010 / T1048)',
    sourceIp: '185.220.101.5',
    sourceHostname: 'tor-exit-node-ams.org',
    sourceGeo: 'Amsterdam, NL (Tor Network Exit)',
    targetIp: '192.168.20.45',
    targetHostname: 'erp-billing-db',
    subnet: '192.168.20.0/24',
    protocol: 'PostgreSQL / TCP',
    destinationPorts: '5432, 443',
    detectedVulnerability: 'CVE-2023-34362 (MOVEit SQLi Flaw)',
    cveId: 'CVE-2023-34362',
    impact: 'SQL sleep and UNION SELECT queries submitted to billing export endpoint; 45 MB customer records accessed.',
    severity: 'High',
    status: 'Contained',
    timeline: [
      {
        title: 'Threat detected',
        timestamp: '08:04:12 UTC',
        description: 'Database Activity Monitoring (Imperva DAM) alerted on repeated UNION SELECT syntax from web tier.',
        completed: true
      },
      {
        title: 'Source identified',
        timestamp: '08:06:30 UTC',
        description: 'Tor exit relay IP 185.220.101.5 proxying HTTP requests through vulnerable API gateway.',
        completed: true
      },
      {
        title: 'Risk assessed',
        timestamp: '08:10:00 UTC',
        description: 'Customer billing table queried. Database rollback point established.',
        completed: true
      },
      {
        title: 'Response initiated',
        timestamp: '08:12:40 UTC',
        description: 'WAF ruleset updated to block all Tor exit nodes. Vulnerable API endpoint disabled.',
        completed: true
      },
      {
        title: 'Containment completed',
        timestamp: '08:25:00 UTC',
        description: 'Database connection pool recycled; patch applied to billing middleware.',
        completed: true
      }
    ],
    responseActions: [
      {
        id: 'act-51',
        name: 'Block source IP',
        target: '185.220.101.5 (Tor Node Pool)',
        status: 'Completed',
        timestamp: '08:13:00 UTC',
        details: 'Tor exit node IP feed synchronized and dropped on edge.'
      },
      {
        id: 'act-52',
        name: 'Isolate host',
        target: 'erp-billing-db',
        status: 'Completed',
        timestamp: '08:15:20 UTC',
        details: 'Database read-only lock triggered during investigation.'
      },
      {
        id: 'act-53',
        name: 'Restrict port',
        target: 'Port 5432',
        status: 'Completed',
        timestamp: '08:16:00 UTC',
        details: 'Direct database port restricted to local subnet bastion only.'
      },
      {
        id: 'act-54',
        name: 'Block suspicious domain',
        target: 'api-exfil-sink.onion.ws',
        status: 'Completed',
        timestamp: '08:17:00 UTC',
        details: 'Destination domain blocked at secure web gateway.'
      }
    ]
  },
  {
    id: 'INC-2026-8824',
    time: '2026-09-11 06:40:11 UTC',
    attackType: 'Distributed SYN Flood Denial of Service',
    mitreTactic: 'Impact (TA0040 / T1498.001)',
    sourceIp: 'Multiple (14,200 botnet nodes)',
    sourceHostname: 'Mirai-Variant-Swarm.botnet',
    sourceGeo: 'Global (BR, VN, IN, RU)',
    targetIp: '192.168.20.1',
    targetHostname: 'edge-router-01.dc',
    subnet: '192.168.20.0/24',
    protocol: 'TCP / SYN',
    destinationPorts: '80, 443, 8080',
    detectedVulnerability: 'TCP Half-Open Connection Exhaustion',
    cveId: 'CWE-400',
    impact: 'Ingress bandwidth spiked to 45 Gbps; SYN backlog queue reached 98% capacity on perimeter edge router.',
    severity: 'High',
    status: 'Resolved',
    timeline: [
      {
        title: 'Threat detected',
        timestamp: '06:40:11 UTC',
        description: 'Perimeter NetFlow telemetry detected 10x anomalous inbound SYN packet rate.',
        completed: true
      },
      {
        title: 'Source identified',
        timestamp: '06:41:00 UTC',
        description: 'Identified as Mirai-based IoT botnet generating spoofed TCP SYN floods.',
        completed: true
      },
      {
        title: 'Risk assessed',
        timestamp: '06:42:30 UTC',
        description: 'Customer portals degraded; core infrastructure shielded behind carrier BGP scrubber.',
        completed: true
      },
      {
        title: 'Response initiated',
        timestamp: '06:43:10 UTC',
        description: 'Upstream ISP BGP Flowspec rule announced; Cloudflare Magic Transit scrub activated.',
        completed: true
      },
      {
        title: 'Containment completed',
        timestamp: '07:15:00 UTC',
        description: 'SYN cookies enabled on edge router; attack mitigated with zero packet drop on clean traffic.',
        completed: true
      }
    ],
    responseActions: [
      {
        id: 'act-61',
        name: 'Block source IP',
        target: 'BGP Flowspec Community 65000:666',
        status: 'Completed',
        timestamp: '06:44:00 UTC',
        details: 'Carrier blackholed invalid prefixes.'
      },
      {
        id: 'act-62',
        name: 'Isolate host',
        target: 'edge-router-01.dc',
        status: 'Completed',
        timestamp: '06:45:00 UTC',
        details: 'Hardware rate-limiter applied to control plane policing.'
      },
      {
        id: 'act-63',
        name: 'Restrict port',
        target: 'Port 80',
        status: 'Completed',
        timestamp: '06:46:00 UTC',
        details: 'Enforced HTTPS redirect at carrier edge.'
      },
      {
        id: 'act-64',
        name: 'Block suspicious domain',
        target: 'mirai-c2-seed.ddns.net',
        status: 'Completed',
        timestamp: '06:47:00 UTC',
        details: 'Global DNS block propagated.'
      }
    ]
  },
  {
    id: 'INC-2026-8819',
    time: '2026-09-11 04:12:38 UTC',
    attackType: 'Automated SSH Brute Force',
    mitreTactic: 'Credential Access (TA0006 / T1110.001)',
    sourceIp: '45.143.200.18',
    sourceHostname: 'vps-host.scan-scanner.ru',
    sourceGeo: 'Saint Petersburg, RU',
    targetIp: '192.168.10.84',
    targetHostname: 'workstation-eng-84',
    subnet: '192.168.10.0/24',
    protocol: 'SSH / TCP',
    destinationPorts: '22',
    detectedVulnerability: 'Exposed SSH Port on Non-Standard Forwarding',
    cveId: 'CWE-307',
    impact: '2,840 failed authentication attempts using wordlist containing common default root/admin credentials.',
    severity: 'Medium',
    status: 'Contained',
    timeline: [
      {
        title: 'Threat detected',
        timestamp: '04:12:38 UTC',
        description: 'SIEM rule "Repeated SSH Authentication Failures (>50/min)" triggered.',
        completed: true
      },
      {
        title: 'Source identified',
        timestamp: '04:13:20 UTC',
        description: 'External bulletproof hosting IP 45.143.200.18 cycling through usernames.',
        completed: true
      },
      {
        title: 'Risk assessed',
        timestamp: '04:15:00 UTC',
        description: 'Target machine had password authentication enabled instead of public key only.',
        completed: true
      },
      {
        title: 'Response initiated',
        timestamp: '04:16:15 UTC',
        description: 'Fail2ban firewall rule dropped source IP; sshd config updated to require ED25519 keys.',
        completed: true
      },
      {
        title: 'Containment completed',
        timestamp: '04:25:00 UTC',
        description: 'System audited; confirmed zero successful logins occurred.',
        completed: true
      }
    ],
    responseActions: [
      {
        id: 'act-71',
        name: 'Block source IP',
        target: '45.143.200.18',
        status: 'Completed',
        timestamp: '04:16:30 UTC',
        details: 'IP added to perimeter dynamic blocklist.'
      },
      {
        id: 'act-72',
        name: 'Isolate host',
        target: 'workstation-eng-84',
        status: 'Failed',
        details: 'Automated agent isolation timed out; manual intervention performed.'
      },
      {
        id: 'act-73',
        name: 'Restrict port',
        target: 'Port 22',
        status: 'Completed',
        timestamp: '04:20:00 UTC',
        details: 'Inbound port 22 blocked from WAN interfaces.'
      },
      {
        id: 'act-74',
        name: 'Block suspicious domain',
        target: 'N/A',
        status: 'Completed',
        details: 'Direct IP scan.'
      }
    ]
  },
  {
    id: 'INC-2026-8815',
    time: '2026-09-11 02:45:10 UTC',
    attackType: 'DNS Tunneling Exfiltration',
    mitreTactic: 'Exfiltration (TA0010 / T1048.003)',
    sourceIp: '192.168.30.58',
    sourceHostname: 'visitor-macbook-19',
    sourceGeo: 'Guest Wi-Fi (HQ Lobby)',
    targetIp: '192.168.30.1',
    targetHostname: 'guest-vlan-gw',
    subnet: '192.168.30.0/24',
    protocol: 'DNS / UDP',
    destinationPorts: '53',
    detectedVulnerability: 'Unfiltered Recursive DNS Queries on Guest VLAN',
    cveId: 'T1048.003',
    impact: 'High volume of encoded Base64 subdomains queried to domain ns1.dataleak-drop.biz via port 53.',
    severity: 'Medium',
    status: 'Resolved',
    timeline: [
      {
        title: 'Threat detected',
        timestamp: '02:45:10 UTC',
        description: 'DNS analytics engine detected entropy score > 4.8 on subdomain queries.',
        completed: true
      },
      {
        title: 'Source identified',
        timestamp: '02:46:00 UTC',
        description: 'MAC address traced to temporary visitor pass device on guest network.',
        completed: true
      },
      {
        title: 'Risk assessed',
        timestamp: '02:48:00 UTC',
        description: 'Isolated guest network; no internal corporate resources accessible from VLAN 30.',
        completed: true
      },
      {
        title: 'Response initiated',
        timestamp: '02:49:15 UTC',
        description: 'Device disconnected from access point; domain sinkholed at recursive resolver.',
        completed: true
      },
      {
        title: 'Containment completed',
        timestamp: '03:10:00 UTC',
        description: 'Device deauthenticated from 802.1X guest portal.',
        completed: true
      }
    ],
    responseActions: [
      {
        id: 'act-81',
        name: 'Block source IP',
        target: '192.168.30.58',
        status: 'Completed',
        timestamp: '02:50:00 UTC',
        details: 'DHCP lease revoked and MAC address blacklisted.'
      },
      {
        id: 'act-82',
        name: 'Isolate host',
        target: 'visitor-macbook-19',
        status: 'Completed',
        timestamp: '02:50:30 UTC',
        details: 'Wireless AP kicked client with 802.11 deauth frame.'
      },
      {
        id: 'act-83',
        name: 'Restrict port',
        target: 'Port 53 (External Forwarders)',
        status: 'Completed',
        timestamp: '02:52:00 UTC',
        details: 'Guest VLAN forced through Cisco Umbrella DNS.'
      },
      {
        id: 'act-84',
        name: 'Block suspicious domain',
        target: 'dataleak-drop.biz',
        status: 'Completed',
        timestamp: '02:53:00 UTC',
        details: 'Domain RPZ zone updated.'
      }
    ]
  },
  {
    id: 'INC-2026-8809',
    time: '2026-09-10 23:10:44 UTC',
    attackType: 'SMBv1 Deprecated Protocol Negotiation',
    mitreTactic: 'Lateral Movement (TA0008 / T1021.002)',
    sourceIp: '192.168.10.110',
    sourceHostname: 'print-corp-fl02',
    sourceGeo: 'Corporate Floor 2',
    targetIp: '192.168.10.14',
    targetHostname: 'workstation-fin-12',
    subnet: '192.168.10.0/24',
    protocol: 'SMB / TCP',
    destinationPorts: '445',
    detectedVulnerability: 'CVE-2017-0144 (EternalBlue Vulnerability Surface)',
    cveId: 'CVE-2017-0144',
    impact: 'Legacy multifunction printer attempted SMBv1 dialect negotiation following firmware error.',
    severity: 'Low',
    status: 'Resolved',
    timeline: [
      {
        title: 'Threat detected',
        timestamp: '23:10:44 UTC',
        description: 'Intrusion Detection System flagged SMBv1 NT LM 0.12 dialect negotiation attempt.',
        completed: true
      },
      {
        title: 'Source identified',
        timestamp: '23:12:00 UTC',
        description: 'Verified as office network printer performing scan-to-folder workflow.',
        completed: true
      },
      {
        title: 'Risk assessed',
        timestamp: '23:14:00 UTC',
        description: 'No malicious payload; legacy client configuration defect.',
        completed: true
      },
      {
        title: 'Response initiated',
        timestamp: '23:16:00 UTC',
        description: 'Enforced SMBv3 minimum protocol on file share host.',
        completed: true
      },
      {
        title: 'Containment completed',
        timestamp: '23:30:00 UTC',
        description: 'Printer firmware updated to support SMBv3 native transport.',
        completed: true
      }
    ],
    responseActions: [
      {
        id: 'act-91',
        name: 'Block source IP',
        target: '192.168.10.110',
        status: 'Completed',
        details: 'Not required - benign legacy device.'
      },
      {
        id: 'act-92',
        name: 'Isolate host',
        target: 'print-corp-fl02',
        status: 'Completed',
        details: 'Moved to dedicated printer VLAN.'
      },
      {
        id: 'act-93',
        name: 'Restrict port',
        target: 'Port 445',
        status: 'Completed',
        timestamp: '23:18:00 UTC',
        details: 'SMBv1 disabled at OS level on all Windows hosts.'
      },
      {
        id: 'act-94',
        name: 'Block suspicious domain',
        target: 'N/A',
        status: 'Completed',
        details: 'Internal printer communication.'
      }
    ]
  },
  {
    id: 'INC-2026-8802',
    time: '2026-09-10 20:05:18 UTC',
    attackType: 'TLS 1.0 Weak Cipher Handshake',
    mitreTactic: 'Defense Evasion (TA0005)',
    sourceIp: '192.168.30.22',
    sourceHostname: 'iot-temp-sensor-04',
    sourceGeo: 'Server Room Climate Pod',
    targetIp: '192.168.20.8',
    targetHostname: 'dmz-waf-gw02',
    subnet: '192.168.30.0/24',
    protocol: 'TLS 1.0 / TCP',
    destinationPorts: '8443',
    detectedVulnerability: 'CWE-326 (Inadequate Encryption Strength)',
    cveId: 'CVE-2015-4000 (Logjam)',
    impact: 'Legacy temperature telemetry sensor initiated TLS 1.0 connection with 3DES-EDE-CBC cipher suite.',
    severity: 'Low',
    status: 'Resolved',
    timeline: [
      {
        title: 'Threat detected',
        timestamp: '20:05:18 UTC',
        description: 'Compliance policy monitor detected non-compliant TLS 1.0 handshake.',
        completed: true
      },
      {
        title: 'Source identified',
        timestamp: '20:06:00 UTC',
        description: 'Identified as IoT climate monitoring probe.',
        completed: true
      },
      {
        title: 'Risk assessed',
        timestamp: '20:08:00 UTC',
        description: 'Isolated sensor metrics only; no sensitive enterprise data exposed.',
        completed: true
      },
      {
        title: 'Response initiated',
        timestamp: '20:10:00 UTC',
        description: 'OTA firmware patch queued to upgrade MbedTLS stack to TLS 1.3.',
        completed: true
      },
      {
        title: 'Containment completed',
        timestamp: '20:45:00 UTC',
        description: 'Firmware updated; verified successful TLS 1.3 connection.',
        completed: true
      }
    ],
    responseActions: [
      {
        id: 'act-101',
        name: 'Block source IP',
        target: '192.168.30.22',
        status: 'Completed',
        details: 'Not blocked; scheduled for maintenance.'
      },
      {
        id: 'act-102',
        name: 'Isolate host',
        target: 'iot-temp-sensor-04',
        status: 'Completed',
        details: 'Confined to IoT microsegment.'
      },
      {
        id: 'act-103',
        name: 'Restrict port',
        target: 'Port 8443',
        status: 'Completed',
        timestamp: '20:15:00 UTC',
        details: 'Server rejects all TLS < 1.2 handshakes.'
      },
      {
        id: 'act-104',
        name: 'Block suspicious domain',
        target: 'N/A',
        status: 'Completed',
        details: 'Internal sensor endpoint.'
      }
    ]
  }
];

export const MOCK_VULNERABILITIES: Vulnerability[] = [
  {
    id: 'VULN-001',
    cveId: 'CVE-2024-6387',
    vulnerability: 'OpenSSH Signal Handler Race Condition (regreSSHion)',
    host: 'abb-plm-srv01',
    ip: '192.168.20.14',
    subnet: '192.168.20.0/24',
    service: 'OpenSSH 8.9p1',
    port: 22,
    severity: 'Critical',
    cvssScore: 9.8,
    status: 'Active',
    description: 'A signal handler race condition vulnerability in OpenSSH server (sshd) allows unauthenticated remote attackers to execute arbitrary code with root privileges on glibc-based Linux systems.',
    potentialImpact: 'Full root server compromise, unauthorized access to proprietary PLM system files, lateral movement pivot into internal networks.',
    recommendedRemediation: 'Upgrade OpenSSH to version 9.8p1 or newer. As an immediate workaround, set LoginGraceTime 0 in sshd_config to prevent race condition exploitation (note: potential DoS side effect).',
    publishedDate: '2024-07-01'
  },
  {
    id: 'VULN-002',
    cveId: 'CVE-2021-44228',
    vulnerability: 'Apache Log4j2 JNDI Remote Code Execution (Log4Shell)',
    host: 'dmz-waf-gw02',
    ip: '192.168.20.8',
    subnet: '192.168.20.0/24',
    service: 'Apache HTTP Server / Java Gateway',
    port: 443,
    severity: 'Critical',
    cvssScore: 10.0,
    status: 'In Remediation',
    description: 'Apache Log4j2 versions 2.0-beta9 through 2.15.0 JNDI features used in configuration, log messages, and parameters do not protect against attacker-controlled LDAP and other JNDI related endpoints.',
    potentialImpact: 'Remote code execution under web server user credentials, secret exfiltration from environment variables, full container breakout.',
    recommendedRemediation: 'Update Log4j2 library to version 2.17.1 or newer. Set system property -Dlog4j2.formatMsgNoLookups=true or remove the JndiLookup class from the classpath.',
    publishedDate: '2021-12-10'
  },
  {
    id: 'VULN-003',
    cveId: 'CVE-2024-3094',
    vulnerability: 'XZ Utils Malicious Code Injection Backdoor',
    host: 'workstation-eng-84',
    ip: '192.168.10.84',
    subnet: '192.168.10.0/24',
    service: 'liblzma 5.6.0 / sshd',
    port: 22,
    severity: 'Critical',
    cvssScore: 10.0,
    status: 'Active',
    description: 'Malicious code was discovered in the upstream tarballs of xz utils versions 5.6.0 and 5.6.1 that injects unauthorized payload during OpenSSH authentication routines.',
    potentialImpact: 'Complete authentication bypass allowing remote actors to inject arbitrary commands via forged SSH certificate payloads.',
    recommendedRemediation: 'Immediately downgrade xz-utils package to version 5.4.x stable. Re-image compromised host and rotate all cryptographic key pairs.',
    publishedDate: '2024-03-29'
  },
  {
    id: 'VULN-004',
    cveId: 'CVE-2023-44487',
    vulnerability: 'HTTP/2 Rapid Reset Stream Cancellation Denial of Service',
    host: 'edge-router-01.dc',
    ip: '192.168.20.1',
    subnet: '192.168.20.0/24',
    service: 'HTTP/2 Ingress Proxy',
    port: 443,
    severity: 'High',
    cvssScore: 7.5,
    status: 'Patch Pending',
    description: 'The HTTP/2 protocol allows a client to request stream cancellation via RST_STREAM frame immediately after sending HEADERS, leading to extreme server CPU exhaustion.',
    potentialImpact: 'Ingress denial of service, service unavailability for customer portal and operational APIs.',
    recommendedRemediation: 'Apply vendor firmware patch (Cisco IOS-XE 17.9.4b) with HTTP/2 stream reset rate limiting enabled.',
    publishedDate: '2023-10-10'
  },
  {
    id: 'VULN-005',
    cveId: 'CVE-2023-34362',
    vulnerability: 'MOVEit Transfer SQL Injection Remote Code Execution',
    host: 'erp-billing-db',
    ip: '192.168.20.45',
    subnet: '192.168.20.0/24',
    service: 'Automated Billing Portal',
    port: 5432,
    severity: 'High',
    cvssScore: 9.8,
    status: 'In Remediation',
    description: 'SQL injection vulnerability in the Progress MOVEit Transfer web application that could allow an unauthenticated attacker to gain unauthorized access to database contents.',
    potentialImpact: 'Exfiltration of sensitive customer financial transaction data, schema alteration, privileged administrative escalation.',
    recommendedRemediation: 'Apply manufacturer emergency security update. Rotate all database service credentials and verify audit logs for unauthorized SELECT queries.',
    publishedDate: '2023-06-02'
  },
  {
    id: 'VULN-006',
    cveId: 'CVE-2024-21626',
    vulnerability: 'runc Leaky File Descriptor Container Escape',
    host: 'abb-plm-srv01',
    ip: '192.168.20.14',
    subnet: '192.168.20.0/24',
    service: 'Docker / containerd 1.6.18',
    port: 2375,
    severity: 'High',
    cvssScore: 8.6,
    status: 'Mitigated',
    description: 'runc contains an internal file descriptor leak (specifically /sys/fs/cgroup) that allows a malicious container to escape isolation and write to host filesystem.',
    potentialImpact: 'Container host takeover, read/write access to host OS files, privilege escalation to host root.',
    recommendedRemediation: 'Upgrade runc to version 1.1.12 or newer. Ensure container images run with non-root UID mappings.',
    publishedDate: '2024-01-31'
  },
  {
    id: 'VULN-007',
    cveId: 'CVE-2024-1086',
    vulnerability: 'Linux Kernel nf_tables Use-After-Free Privilege Escalation',
    host: 'workstation-eng-84',
    ip: '192.168.10.84',
    subnet: '192.168.10.0/24',
    service: 'Linux Kernel 6.5.0-generic',
    port: 0,
    severity: 'High',
    cvssScore: 7.8,
    status: 'Active',
    description: 'A use-after-free vulnerability in the Linux kernel netfilter nf_tables component can be exploited to achieve local privilege escalation from unprivileged user to root.',
    potentialImpact: 'Local standard users can bypass security boundaries and compromise the host kernel.',
    recommendedRemediation: 'Update Linux kernel package to >= 6.8.0. Restrict user unprivileged user namespaces via sysctl kernel.unprivileged_userns_clone=0.',
    publishedDate: '2024-01-31'
  },
  {
    id: 'VULN-008',
    cveId: 'CVE-2023-38606',
    vulnerability: 'Hardware MMIO Register Validation Flaw',
    host: 'workstation-rd-03',
    ip: '192.168.10.92',
    subnet: '192.168.10.0/24',
    service: 'Kernel Memory Controller',
    port: 0,
    severity: 'Medium',
    cvssScore: 6.8,
    status: 'Mitigated',
    description: 'An app may be able to modify sensitive kernel state via unmapped hardware register memory addresses.',
    potentialImpact: 'Local sandbox escape on developer workstation.',
    recommendedRemediation: 'Apply Apple Security Update macOS 14.5.',
    publishedDate: '2023-07-24'
  },
  {
    id: 'VULN-009',
    cveId: 'CVE-2023-20198',
    vulnerability: 'Cisco IOS XE Web UI Unauthenticated Admin Creation',
    host: 'edge-router-01.dc',
    ip: '192.168.20.1',
    subnet: '192.168.20.0/24',
    service: 'HTTP/HTTPS Web Management UI',
    port: 443,
    severity: 'Critical',
    cvssScore: 10.0,
    status: 'Mitigated',
    description: 'Allows remote, unauthenticated attacker to create an account on an affected system with privilege level 15 access.',
    potentialImpact: 'Full takeover of perimeter routing infrastructure, traffic interception, BGP redirection.',
    recommendedRemediation: 'Disable HTTP Server feature on WAN interfaces: "no ip http server" and "no ip http secure-server".',
    publishedDate: '2023-10-16'
  },
  {
    id: 'VULN-010',
    cveId: 'CVE-2022-22965',
    vulnerability: 'Spring Framework Remote Code Execution (Spring4Shell)',
    host: 'dmz-waf-gw02',
    ip: '192.168.20.8',
    subnet: '192.168.20.0/24',
    service: 'Spring MVC Web Service',
    port: 8080,
    severity: 'High',
    cvssScore: 9.8,
    status: 'Mitigated',
    description: 'A Spring MVC or Spring WebFlux application running on JDK 9+ may be vulnerable to remote code execution via data binding.',
    potentialImpact: 'Remote arbitrary command execution via crafted HTTP request parameters.',
    recommendedRemediation: 'Upgrade Spring Framework to 5.3.18 or 5.2.20 or newer.',
    publishedDate: '2022-03-31'
  }
];

export const MOCK_REPORTS: IncidentReport[] = [
  {
    reportId: 'REP-2026-0841',
    incidentId: 'INC-2026-8841',
    attack: 'Cobalt Strike Beaconing & Lateral Reconnaissance',
    host: 'abb-plm-srv01',
    subnet: '192.168.20.0/24',
    severity: 'Critical',
    incidentTime: '2026-09-11 12:14:02 UTC',
    status: 'Investigating',
    generatedTime: '2026-09-11 12:35:00 UTC',
    author: 'SOC Tier 3 Lead Analyst J. Vance (ID: ABB-SOC-094)',
    source: {
      ip: '198.51.100.42',
      hostname: 'c2-edge-node.shadowbroker.net',
      geo: 'Frankfurt, Hessen, Germany',
      asn: 'AS13335 (Cloudflare Inc)'
    },
    target: {
      ip: '192.168.20.14',
      hostname: 'abb-plm-srv01',
      role: 'Core Enterprise Product Lifecycle Management (PLM) Server'
    },
    network: {
      subnet: '192.168.20.0/24 (Server Network - DMZ Tier)',
      protocol: 'TCP / TLS 1.3 encrypted tunnel',
      ports: 'Destination Port 443 (HTTPS), Port 22 (SSH)'
    },
    vulnerability: {
      affectedService: 'OpenSSH 8.9p1 on glibc 2.35',
      vulnerability: 'CVE-2024-6387 (regreSSHion Signal Handler Race Condition)',
      severity: 'Critical'
    },
    impact: 'Unauthorized root command execution and interactive C2 beacon established on production PLM core server. High probability of credential dumping from memory and preliminary Active Directory reconnaissance.',
    responseActionsTaken: [
      'Automated perimeter firewall rule #882 created dropping all ingress/egress to 198.51.100.42',
      'CrowdStrike Falcon endpoint isolation initiated on host abb-plm-srv01 (forensic tunnel retained)',
      'Recursive DNS sinkhole applied enterprise-wide for domain c2-edge-node.shadowbroker.net',
      'Volatile memory snapshot (RAM dump, 64 GB) captured for forensic disassembly'
    ],
    remediationRecommended: [
      'Upgrade OpenSSH package on all Linux enterprise hosts to version 9.8p1 immediately',
      'Audit all SSH keys in /root/.ssh/authorized_keys and /home/*/.ssh/',
      'Enforce mandatory multi-factor authentication (MFA) on SSH bastions via hardware security keys',
      'Rotate all database credentials and API service tokens resident on abb-plm-srv01',
      'Review Kerberos TGS requests from 192.168.20.14 during the detection interval'
    ],
    timeline: {
      detection: '12:14:02 UTC - Suricata IDS signature #2034812 flagged TLS beaconing profile (jitter: 15%, sleep: 45s).',
      analysis: '12:18:10 UTC - SIEM correlation confirmed outbound TCP handshake to known Russian threat actor C2 infrastructure.',
      response: '12:20:45 UTC - Automated containment playbook invoked; edge firewall ingress and egress dropped.',
      containment: '12:22:12 UTC - Endpoint isolation verified; C2 heartbeat ceased. Threat actor severed from corporate network.'
    },
    finalStatus: 'Host is currently quarantined in forensic inspection mode. Containment confirmed at network boundary. Threat actor eradicated from initial access vector.'
  },
  {
    reportId: 'REP-2026-0835',
    incidentId: 'INC-2026-8835',
    attack: 'Modbus/TCP Unauthorized Function Code Injection',
    host: 'scada-plc-sub01',
    subnet: '192.168.40.0/24',
    severity: 'Critical',
    incidentTime: '2026-09-11 10:32:41 UTC',
    status: 'Contained',
    generatedTime: '2026-09-11 11:15:00 UTC',
    author: 'OT Security Specialist M. Lindqvist (ID: ABB-OT-112)',
    source: {
      ip: '192.168.10.84',
      hostname: 'workstation-eng-84',
      geo: 'Internal Corporate LAN (Engineering Floor 2)',
      asn: 'Internal Enterprise AS65001'
    },
    target: {
      ip: '192.168.40.12',
      hostname: 'scada-plc-sub01',
      role: 'Substation Feeder RTU560 Electrical Protection Controller'
    },
    network: {
      subnet: '192.168.40.0/24 (OT/ICS Control Network)',
      protocol: 'Modbus/TCP Industrial Protocol',
      ports: 'Destination Port 502'
    },
    vulnerability: {
      affectedService: 'Modbus/TCP Daemon (RTU Firmware 12.4.1)',
      vulnerability: 'CWE-306 (Missing Authentication for Critical Industrial Function)',
      severity: 'Critical'
    },
    impact: 'Unauthorized Force Multiple Coils (Function Code 15) sent to substation RTU. Attempted digital override of 110kV feeder circuit breaker trip coils. Hardware interlock prevented physical breaker trip.',
    responseActionsTaken: [
      'Severed routed gateway interface between Corporate VLAN 10 and Industrial VLAN 40 at core firewall',
      'Port shut-down applied to physical switchport hosting workstation-eng-84',
      'Industrial anomaly detection engine (Nozomi) placed in strict enforcement mode for Modbus writes',
      'Substation telemetry and RTU coil states verified with on-site electrical protection engineers'
    ],
    remediationRecommended: [
      'Enforce physical hardware data diode for all IT/OT zone boundaries',
      'Upgrade RTU firmware to enable IEC 62351 cryptographic authentication and TLS encapsulation',
      'Conduct complete forensic image analysis of engineering workstation workstation-eng-84',
      'Mandate dual-authorization ceremony for any SCADA engineering configuration modification'
    ],
    timeline: {
      detection: '10:32:41 UTC - Nozomi Guardian alert #OT-902 triggered on unexpected Modbus write from IT subnet.',
      analysis: '10:35:00 UTC - Packet payload confirmed register 0x0040 (Feeder Breaker Coil) targeted with write state 0x00.',
      response: '10:36:20 UTC - Inter-VLAN routing rule disabled; workstation network isolation enacted.',
      containment: '10:40:00 UTC - Field engineering confirmed nominal state; zero physical disruption occurred.'
    },
    finalStatus: 'Resolved and contained. Physical safety mechanisms functioned as engineered. Investigation into workstation origin ongoing.'
  },
  {
    reportId: 'REP-2026-0828',
    incidentId: 'INC-2026-8828',
    attack: 'SQL Injection & Billing Record Exfiltration',
    host: 'erp-billing-db',
    subnet: '192.168.20.0/24',
    severity: 'High',
    incidentTime: '2026-09-11 08:04:12 UTC',
    status: 'Contained',
    generatedTime: '2026-09-11 09:30:00 UTC',
    author: 'SOC Analyst K. Becker (ID: ABB-SOC-048)',
    source: {
      ip: '185.220.101.5',
      hostname: 'tor-exit-node-ams.org',
      geo: 'Amsterdam, North Holland, Netherlands',
      asn: 'AS200017 (Tor Exit Relay Node)'
    },
    target: {
      ip: '192.168.20.45',
      hostname: 'erp-billing-db',
      role: 'Enterprise Billing & Financial Transaction Database'
    },
    network: {
      subnet: '192.168.20.0/24 (Server Network)',
      protocol: 'PostgreSQL TDS / TCP',
      ports: 'Destination Port 5432, 443'
    },
    vulnerability: {
      affectedService: 'Billing Web API Export Handler',
      vulnerability: 'CVE-2023-34362 (SQL Injection in Web File Transfer Component)',
      severity: 'High'
    },
    impact: 'Attacker submitted automated UNION SELECT payloads against billing export handler. Approximately 45 MB of customer transaction records queried before database connection termination.',
    responseActionsTaken: [
      'Edge WAF updated to block all Tor exit relay IPs across perimeter gateways',
      'Vulnerable API endpoint placed in maintenance mode',
      'PostgreSQL read-only lock triggered during log audit',
      'Database connection pool recycled with newly issued service credentials'
    ],
    remediationRecommended: [
      'Implement parameterized prepared statements across all database abstraction interfaces',
      'Apply manufacturer security patch to billing middleware application',
      'Deploy Database Activity Monitoring (DAM) real-time query blocking on sensitive financial tables',
      'Notify corporate data privacy officer in accordance with GDPR compliance protocols'
    ],
    timeline: {
      detection: '08:04:12 UTC - Database monitor alerted on excessive syntax error and UNION keyword frequency.',
      analysis: '08:06:30 UTC - Verified Tor exit node origin exploiting unsanitized GET query string.',
      response: '08:12:40 UTC - WAF virtual patch deployed; API endpoint severed.',
      containment: '08:25:00 UTC - Exfiltration path closed. Full database integrity verified.'
    },
    finalStatus: 'Contained. Vulnerable endpoint disabled pending code refactoring and QA security approval.'
  }
];

export const MOCK_EVENT_TREND_DATA = [
  { time: '00:00', totalEvents: 520, criticalEvents: 0, blockedThreats: 48 },
  { time: '02:00', totalEvents: 410, criticalEvents: 0, blockedThreats: 62 },
  { time: '04:00', totalEvents: 680, criticalEvents: 1, blockedThreats: 140 },
  { time: '06:00', totalEvents: 1420, criticalEvents: 1, blockedThreats: 390 },
  { time: '08:00', totalEvents: 2150, criticalEvents: 1, blockedThreats: 512 },
  { time: '10:00', totalEvents: 3420, criticalEvents: 2, blockedThreats: 840 },
  { time: '11:00', totalEvents: 2980, criticalEvents: 1, blockedThreats: 710 },
  { time: '12:00', totalEvents: 3231, criticalEvents: 3, blockedThreats: 920 }
];

export const MOCK_STATS = {
  securityEvents24h: '14,821',
  securityEventsChange: '+6.4%',
  highRiskIncidents: 18,
  highRiskChange: '+2 today',
  criticalIncidents: 3,
  criticalUncontained: 1,
  protectedHosts: 1248,
  totalHosts: 1250,
  firewallUptime: '99.998%',
  packetsInspected24h: '4.28B',
  threatsBlocked24h: '3,842'
};
