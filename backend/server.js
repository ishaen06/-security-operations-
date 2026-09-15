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

const THREE_MINUTES_MS = 3 * 60 * 1000; // 180,000 ms
let lastRefreshedAt = new Date();
let nextRefreshAt = new Date(Date.now() + THREE_MINUTES_MS);

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

// Generator for live traffic stream
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

// 3-Minute Recurring Ingestion & Threat Feed Update Function
async function performThreeMinuteDataLogUpdate() {
  lastRefreshedAt = new Date();
  nextRefreshAt = new Date(Date.now() + THREE_MINUTES_MS);
  console.log(`[3-MIN CYCLE] Starting 3-minute log data refresh at ${lastRefreshedAt.toISOString()}...`);

  // Generate 25 new updated traffic log entries
  const newPackets = [];
  const c2List = emergencyDataset?.activeThreatC2Feed || [];
  for (let i = 0; i < 25; i++) {
    newPackets.push(generateLivePacket());
  }

  // Update memory and write log file
  if (emergencyDataset) {
    emergencyDataset.metadata.lastSyncCycle = lastRefreshedAt.toISOString();
    emergencyDataset.metadata.updateInterval = '3 minutes (180s)';
    emergencyDataset.sampleTrafficPackets = [
      ...newPackets,
      ...(emergencyDataset.sampleTrafficPackets || []).slice(0, 75)
    ];

    try {
      fs.writeFileSync(DATASET_FILE, JSON.stringify(emergencyDataset, null, 2), 'utf-8');
      if (fs.existsSync(FRONTEND_DATA_DIR)) {
        fs.writeFileSync(path.join(FRONTEND_DATA_DIR, 'emergency_ops_dataset.json'), JSON.stringify(emergencyDataset, null, 2), 'utf-8');
      }

      const logLines = emergencyDataset.sampleTrafficPackets.map(p => {
        return `<134>1 ${p.timestamp} perimeter-ngfw.abb.internal AbbCyberOps 4102 - [traffic@4102 src_ip="${p.src_ip}" dst_ip="${p.dst_ip}" proto="${p.protocol}" src_port=${p.src_port} dst_port=${p.dst_port} action="${p.action}" bytes=${p.bytes} packets=${p.packets} threat_score=${p.threat_score}] ${p.message}`;
      });
      fs.writeFileSync(LOG_FILE, logLines.join('\n'), 'utf-8');
      if (fs.existsSync(FRONTEND_DATA_DIR)) {
        fs.writeFileSync(path.join(FRONTEND_DATA_DIR, 'emergency_traffic.log'), logLines.join('\n'), 'utf-8');
      }
      console.log(`[3-MIN CYCLE] Updated log files with 25 fresh records. Next update at: ${nextRefreshAt.toISOString()}`);
    } catch (err) {
      console.error('[ERROR] Failed to save 3-minute log cycle:', err.message);
    }
  }

  // Notify all connected SSE clients of the 3-minute update cycle
  const refreshEvent = {
    type: '3_MINUTE_DATA_UPDATE',
    timestamp: lastRefreshedAt.toISOString(),
    nextUpdateAt: nextRefreshAt.toISOString(),
    recordsAdded: 25,
    message: 'Data logs updated (3-minute automated cycle)'
  };
  const data = `data: ${JSON.stringify(refreshEvent)}\n\n`;
  for (const client of sseClients) {
    client.write(data);
  }
}

// Start 3-minute recurring update timer
setInterval(performThreeMinuteDataLogUpdate, THREE_MINUTES_MS);

// Continuous live packet telemetry stream pulse (every 600ms)
setInterval(() => {
  if (sseClients.size === 0) return;
  const packet = generateLivePacket();
  const data = `data: ${JSON.stringify(packet)}\n\n`;
  for (const client of sseClients) {
    client.write(data);
  }
}, 600);

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

  // Route: Health & Sync Status Check (including 3-minute cycle countdown)
  if (url.pathname === '/api/v1/health' || url.pathname === '/api/v1/emergency/sync-status') {
    const secondsUntilNext = Math.max(0, Math.floor((nextRefreshAt.getTime() - Date.now()) / 1000));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      updateIntervalSeconds: 180,
      updateIntervalDescription: '3 minutes',
      lastRefreshedAt: lastRefreshedAt.toISOString(),
      nextRefreshAt: nextRefreshAt.toISOString(),
      secondsUntilNextUpdate: secondsUntilNext,
      datasetAvailable: !!emergencyDataset,
      c2NodeCount: emergencyDataset?.activeThreatC2Feed?.length || 0,
      cveCount: emergencyDataset?.knownExploitedVulnerabilities?.length || 0,
      activeSSEClients: sseClients.size
    }));
    return;
  }

  // Route: Manual Trigger of 3-Minute Refresh Cycle
  if (url.pathname === '/api/v1/emergency/force-sync' && req.method === 'POST') {
    performThreeMinuteDataLogUpdate();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: '3-minute data log update triggered immediately', timestamp: new Date().toISOString() }));
    return;
  }

  // Route: Get Emergency Dataset
  if (url.pathname === '/api/v1/emergency/dataset') {
    if (!fs.existsSync(DATASET_FILE)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Emergency dataset not found. Please run fetch:data first.' }));
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

  // Route: Live SSE Traffic Stream
  if (url.pathname === '/api/v1/stream/traffic') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Send initial greeting event with 3-minute schedule
    res.write(`data: ${JSON.stringify({ 
      type: 'CONNECTED', 
      message: 'ABB CyberOps Live SSE Stream Connected (3-minute update cycle active)', 
      timestamp: new Date().toISOString(),
      updateIntervalSeconds: 180,
      nextRefreshAt: nextRefreshAt.toISOString()
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
  console.log(`ABB CyberOps Live Telemetry Server running on http://localhost:${PORT}`);
  console.log(` - 3-Minute Auto-Update Cycle ACTIVE (Every 180 seconds)`);
  console.log(` - GET  /api/v1/emergency/sync-status`);
  console.log(` - GET  /api/v1/stream/traffic (SSE Live Stream)`);
  console.log(` - Next 3-minute update at: ${nextRefreshAt.toISOString()}`);
  console.log(`====================================================`);
});
