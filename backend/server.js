import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const DATA_DIR = path.resolve(__dirname, './data');
const FRONTEND_DATA_DIR = path.resolve(__dirname, '../frontend/src/data');
const DATASET_FILE = path.join(DATA_DIR, 'emergency_ops_dataset.json');
const LOG_FILE = path.join(DATA_DIR, 'emergency_traffic.log');

let lastActivityAt = new Date();

// Cache emergency dataset
let emergencyDataset = null;
function loadDatasetFromDisk() {
  try {
    if (fs.existsSync(DATASET_FILE)) {
      emergencyDataset = JSON.parse(fs.readFileSync(DATASET_FILE, 'utf-8'));
      console.log(`[INFO] Loaded emergency dataset with ${emergencyDataset.emergencyScenarios?.length || 0} scenarios.`);
    }
  } catch (err) {
    console.warn('[WARN] Could not load dataset at startup:', err.message);
  }
}
loadDatasetFromDisk();

// Active SSE client connections
const sseClients = new Set();

// Generator for continuous live traffic stream
function generateLivePacket() {
  const isC2Attack = Math.random() < 0.22;
  const c2List = emergencyDataset?.activeThreatC2Feed || [];
  const protocols = ['TCP', 'UDP', 'MODBUS/TCP', 'IEC-104', 'HTTPS', 'DNS', 'SSH'];
  const internalIps = ['10.10.10.15', '10.10.10.22', '10.10.20.5', '10.10.30.12', '10.10.30.15', '192.168.1.100', '192.168.1.105'];
  const commonPorts = [80, 443, 502, 2404, 22, 53, 8080, 8443, 3389];

  const now = new Date().toISOString();

  if (isC2Attack && c2List.length > 0) {
    const c2 = c2List[Math.floor(Math.random() * c2List.length)];
    const internalIp = internalIps[Math.floor(Math.random() * internalIps.length)];
    return {
      id: `PKT-LIVE-${Date.now().toString().slice(-6)}`,
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
      id: `PKT-LIVE-${Date.now().toString().slice(-6)}`,
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

// Write a single log entry to the append-only log file
function appendToLogFile(p) {
  const line = `<134>1 ${p.timestamp} perimeter-ngfw.abb.internal AbbCyberOps 4102 - [traffic@4102 src_ip="${p.src_ip}" dst_ip="${p.dst_ip}" proto="${p.protocol}" src_port=${p.src_port} dst_port=${p.dst_port} action="${p.action}" bytes=${p.bytes} packets=${p.packets} threat_score=${p.threat_score}] ${p.message}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line, 'utf-8');
    if (fs.existsSync(FRONTEND_DATA_DIR)) {
      fs.appendFileSync(path.join(FRONTEND_DATA_DIR, 'emergency_traffic.log'), line, 'utf-8');
    }
  } catch {
    // Ignore file write errors
  }
}

// Continuous Real-Time Live Packet Telemetry Stream (Every 750ms)
setInterval(() => {
  const packet = generateLivePacket();
  lastActivityAt = new Date();

  // Send to all active SSE clients
  if (sseClients.size > 0) {
    const data = `data: ${JSON.stringify(packet)}\n\n`;
    for (const client of sseClients) {
      client.write(data);
    }
  }

  // Append live packet directly to logs
  appendToLogFile(packet);

  // Update in-memory dataset
  if (emergencyDataset) {
    emergencyDataset.sampleTrafficPackets = [
      packet,
      ...(emergencyDataset.sampleTrafficPackets || []).slice(0, 99)
    ];
  }
}, 750);

// Periodically flush in-memory dataset to disk every 15 seconds
setInterval(() => {
  if (emergencyDataset) {
    try {
      emergencyDataset.metadata.lastSyncCycle = new Date().toISOString();
      emergencyDataset.metadata.mode = 'Real-Time Live Streaming';
      fs.writeFileSync(DATASET_FILE, JSON.stringify(emergencyDataset, null, 2), 'utf-8');
      if (fs.existsSync(FRONTEND_DATA_DIR)) {
        fs.writeFileSync(path.join(FRONTEND_DATA_DIR, 'emergency_ops_dataset.json'), JSON.stringify(emergencyDataset, null, 2), 'utf-8');
      }
    } catch {
      // Ignore disk flush errors
    }
  }
}, 15000);

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Route: Health & Real-Time Sync Status Check
  if (url.pathname === '/api/v1/health' || url.pathname === '/api/v1/emergency/sync-status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'UP',
      mode: 'REAL_TIME_LIVE_STREAMING',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      lastActivityAt: lastActivityAt.toISOString(),
      datasetAvailable: !!emergencyDataset,
      c2NodeCount: emergencyDataset?.activeThreatC2Feed?.length || 0,
      cveCount: emergencyDataset?.knownExploitedVulnerabilities?.length || 0,
      activeSSEClients: sseClients.size
    }));
    return;
  }

  // Route: Manual Live Ingestion Trigger / Force Sync
  if (url.pathname === '/api/v1/emergency/force-sync' && req.method === 'POST') {
    const burst = [];
    for (let i = 0; i < 10; i++) {
      const p = generateLivePacket();
      burst.push(p);
      appendToLogFile(p);
      if (sseClients.size > 0) {
        const data = `data: ${JSON.stringify(p)}\n\n`;
        for (const client of sseClients) {
          client.write(data);
        }
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'Live burst packet injection committed', 
      packetsInjected: burst.length, 
      timestamp: new Date().toISOString() 
    }));
    return;
  }

  // Route: Get Emergency Dataset
  if (url.pathname === '/api/v1/emergency/dataset') {
    if (!fs.existsSync(DATASET_FILE)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Emergency dataset not found.' }));
      return;
    }
    const data = fs.readFileSync(DATASET_FILE, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    return;
  }

  // Route: Get Emergency Syslog raw file
  if (url.pathname === '/api/v1/emergency/traffic.log') {
    if (!fs.existsSync(LOG_FILE)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Log file not found');
      return;
    }
    const data = fs.readFileSync(LOG_FILE, 'utf-8');
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="emergency_traffic.log"'
    });
    res.end(data);
    return;
  }

  // Route: Real-Time Live SSE Traffic Stream
  if (url.pathname === '/api/v1/stream/traffic') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ 
      type: 'CONNECTED', 
      message: 'ABB CyberOps Real-Time Live Telemetry Stream Connected', 
      timestamp: new Date().toISOString(),
      mode: 'LIVE_STREAMING'
    })}\n\n`);

    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // Route: Trigger Drill Broadcast
  if (url.pathname === '/api/v1/emergency/trigger-drill' && req.method === 'POST') {
    const drillAlert = {
      type: 'EMERGENCY_DRILL_TRIGGERED',
      drillId: 'DRILL-EMERGENCY-01',
      title: 'CRITICAL: OT/SCADA PLC Modbus Injection & Active C2 Exfiltration',
      severity: 'Critical',
      timestamp: new Date().toISOString()
    };
    const alertData = `data: ${JSON.stringify(drillAlert)}\n\n`;
    for (const client of sseClients) {
      client.write(alertData);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'Drill broadcasted', clientsNotified: sseClients.size }));
    return;
  }

  // Default 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`ABB CyberOps Real-Time Live Telemetry Server running on http://localhost:${PORT}`);
  console.log(` - Live Per-Second Telemetry Streaming: ACTIVE (No 3-minute interval)`);
  console.log(` - GET  /api/v1/health`);
  console.log(` - GET  /api/v1/stream/traffic (SSE Real-Time Live Stream)`);
  console.log(`====================================================`);
});
