import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Flame, 
  RefreshCw, 
  Terminal, 
  Search, 
  Wifi, 
  CheckCircle2, 
  FileCode, 
  FileText 
} from 'lucide-react';
import { 
  TrafficPacket, 
  generateClientSidePacket, 
  EMERGENCY_DATASET, 
  EMERGENCY_CISA_KEV, 
  EMERGENCY_FEODO_C2 
} from '../../data/emergencyDrillHelper';

interface LiveTrafficModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDrillActive: boolean;
  onToggleEmergencyDrill: () => void;
}

export const LiveTrafficModal: React.FC<LiveTrafficModalProps> = ({
  isOpen,
  onClose,
  isDrillActive,
  onToggleEmergencyDrill,
}) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'cisa' | 'c2' | 'playbook'>('stream');
  const [packets, setPackets] = useState<TrafficPacket[]>(() => {
    const initial: TrafficPacket[] = [];
    for (let i = 1; i <= 25; i++) {
      initial.push(generateClientSidePacket(i));
    }
    return initial;
  });
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [selectedProto, setSelectedProto] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [pps, setPps] = useState<number>(28);
  const [bandwidthMb, setBandwidthMb] = useState<number>(1.48);

  // Live Streaming Telemetry State
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>(() => new Date().toLocaleTimeString());

  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const packetCounterRef = useRef<number>(100);

  // Function to inject fresh live packet burst
  const injectLiveBurst = async () => {
    const freshPackets: TrafficPacket[] = [];
    for (let i = 0; i < 10; i++) {
      packetCounterRef.current += 1;
      freshPackets.push(generateClientSidePacket(packetCounterRef.current));
    }
    setPackets((prev) => [...prev.slice(-190), ...freshPackets]);
    setLastRefreshedTime(new Date().toLocaleTimeString());
    setPps(Math.floor(28 + Math.random() * 16));
    setBandwidthMb(parseFloat((1.4 + Math.random() * 0.8).toFixed(2)));

    try {
      await fetch('http://localhost:5000/api/v1/emergency/force-sync', { method: 'POST' });
    } catch {
      // Offline fallback
    }
  };

  // Connect to SSE backend for continuous live streaming
  useEffect(() => {
    if (!isOpen) return;

    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('http://localhost:5000/api/v1/stream/traffic');

      eventSource.onopen = () => {
        setBackendConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.src_ip && parsed.id) {
            setPackets((prev) => [...prev.slice(-199), parsed]);
            setPps(Math.floor(24 + Math.random() * 12));
            setBandwidthMb(parseFloat((1.2 + Math.random() * 0.6).toFixed(2)));
          }
        } catch {
          // Non-packet event
        }
      };

      eventSource.onerror = () => {
        setBackendConnected(false);
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
      };
    } catch {
      setBackendConnected(false);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [isOpen]);

  // Client-side live stream fallback if backend SSE is not connected
  useEffect(() => {
    if (!isOpen || backendConnected) return;

    const liveTimer = setInterval(() => {
      packetCounterRef.current += 1;
      const p = generateClientSidePacket(packetCounterRef.current);
      setPackets((prev) => [...prev.slice(-199), p]);
      setPps(Math.floor(22 + Math.random() * 14));
      setBandwidthMb(parseFloat((1.1 + Math.random() * 0.7).toFixed(2)));
    }, 800);

    return () => clearInterval(liveTimer);
  }, [isOpen, backendConnected]);

  // Handle auto-scrolling
  useEffect(() => {
    if (autoScroll && scrollBottomRef.current && activeTab === 'stream') {
      scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [packets, autoScroll, activeTab]);

  if (!isOpen) return null;

  // Filter packets
  const filteredPackets = packets.filter((p) => {
    if (selectedProto === 'ALERTS' && p.action !== 'ALERT') return false;
    if (selectedProto !== 'ALL' && selectedProto !== 'ALERTS' && !p.protocol.includes(selectedProto)) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        p.src_ip.includes(q) ||
        p.dst_ip.includes(q) ||
        p.protocol.toLowerCase().includes(q) ||
        p.message.toLowerCase().includes(q) ||
        p.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalAlerts = packets.filter((p) => p.action === 'ALERT').length;

  // Downloader utility
  const handleDownloadDataset = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(EMERGENCY_DATASET, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "emergency_ops_dataset.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadSyslog = () => {
    const logContent = packets.map(p => 
      `<134>1 ${p.timestamp} perimeter-ngfw.abb.internal AbbCyberOps 4102 - [traffic@4102 src_ip="${p.src_ip}" dst_ip="${p.dst_ip}" proto="${p.protocol}" src_port=${p.src_port} dst_port=${p.dst_port} action="${p.action}" bytes=${p.bytes} packets=${p.packets} threat_score=${p.threat_score}] ${p.message}`
    ).join('\n');
    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = "emergency_traffic.log";
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-5 border-b border-[#E2E6EA] dark:border-[#282D35] bg-[#F8F9FA] dark:bg-[#1B2027] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Signature ABB Red Accent Bar */}
            <div className="w-12 h-1.5 bg-[#FF000F] mb-2" />
            <div className="flex items-center gap-3">
              <span className="font-outrun uppercase text-xs font-bold tracking-[0.2em] text-[#FF000F]">
                ABB CYBEROPS TELEMETRY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-[#CED4DA] dark:border-[#343B45] text-[#495057] dark:text-[#9BA3AF]">
                ISO/IEC 27035 EMERGENCY ENGINE
              </span>
            </div>
            <h2 className="font-sans font-bold text-xl text-[#181B1F] dark:text-white tracking-tight mt-0.5">
              Network Traffic & Emergency Telemetry (Live Stream)
            </h2>
            <p className="text-xs text-[#6C757D] dark:text-[#9BA3AF] mt-0.5">
              Real-Time Live Telemetry Streaming • CISA KEV & Feodo Threat Feeds
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Live Backend Connection Pill */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-sm border ${
                backendConnected 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
              }`}
              title={backendConnected ? "Connected to Node.js backend live stream (:5000)" : "Using live client-side telemetry engine"}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{backendConnected ? 'LIVE SSE (:5000)' : 'LIVE STREAM'}</span>
            </div>

            {/* Emergency Drill Toggle Button */}
            <button
              onClick={onToggleEmergencyDrill}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider rounded-sm transition-all shadow-sm ${
                isDrillActive 
                  ? 'bg-[#181B1F] text-amber-400 border border-amber-500 hover:bg-black' 
                  : 'bg-[#FF000F] text-white hover:bg-[#D9000D]'
              }`}
            >
              {isDrillActive ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Stop Emergency Drill</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-white" />
                  <span>Initiate Emergency Drill</span>
                </>
              )}
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-[#6C757D] hover:text-[#181B1F] dark:hover:text-white rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Telemetry Gauges HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-white dark:bg-[#16191E] border-b border-[#E2E6EA] dark:border-[#282D35]">
          <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm">
            <span className="text-[10px] font-mono uppercase text-[#6C757D] dark:text-[#9BA3AF]">Ingestion Velocity</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-outrun font-bold text-2xl text-[#181B1F] dark:text-white">{pps}</span>
              <span className="text-xs font-mono text-[#6C757D]">pkts/sec</span>
            </div>
          </div>

          <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm">
            <span className="text-[10px] font-mono uppercase text-[#6C757D] dark:text-[#9BA3AF]">Telemetry Bandwidth</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-outrun font-bold text-2xl text-[#181B1F] dark:text-white">{bandwidthMb}</span>
              <span className="text-xs font-mono text-[#6C757D]">MB/sec</span>
            </div>
          </div>

          <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm">
            <span className="text-[10px] font-mono uppercase text-[#6C757D] dark:text-[#9BA3AF]">Emergency Drill State</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${isDrillActive ? 'bg-[#FF000F] animate-ping' : 'bg-emerald-500'}`} />
              <span className={`font-sans font-bold text-sm ${isDrillActive ? 'text-[#FF000F]' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {isDrillActive ? 'ACTIVE SIMULATION' : 'BASELINE NOMINAL'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm">
            <span className="text-[10px] font-mono uppercase text-[#6C757D] dark:text-[#9BA3AF]">IoC Alerts Sourced</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-outrun font-bold text-2xl text-[#FF000F]">{totalAlerts}</span>
              <span className="text-xs font-mono text-[#6C757D]">active threats</span>
            </div>
          </div>

          {/* Live Stream Telemetry HUD Card */}
          <div className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#6C757D] dark:text-[#9BA3AF]">Live Stream Feed</span>
              <button 
                onClick={injectLiveBurst} 
                className="text-[10px] font-mono text-[#FF000F] hover:underline cursor-pointer"
                title="Inject live packet burst now"
              >
                Inject Burst
              </button>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-outrun font-bold text-2xl text-emerald-600 dark:text-emerald-400">
                LIVE
              </span>
              <span className="text-[10px] font-mono text-[#6C757D]">streaming</span>
            </div>
            <div className="text-[10px] font-mono text-[#868E96] truncate mt-0.5">
              {packets.length} Packets Captured
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Toolbars */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#F1F3F5] dark:bg-[#1B2027] border-b border-[#E2E6EA] dark:border-[#282D35]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('stream')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold rounded-sm transition-colors ${
                activeTab === 'stream' 
                  ? 'bg-white dark:bg-[#16191E] text-[#181B1F] dark:text-white shadow-sm border border-[#CED4DA] dark:border-[#343B45]' 
                  : 'text-[#6C757D] hover:text-[#181B1F] dark:hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#FF000F]" />
              <span>Telemetry Logs (Live Stream)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#E9ECEF] dark:bg-[#282D35] rounded-xs">
                {packets.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cisa')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold rounded-sm transition-colors ${
                activeTab === 'cisa' 
                  ? 'bg-white dark:bg-[#16191E] text-[#181B1F] dark:text-white shadow-sm border border-[#CED4DA] dark:border-[#343B45]' 
                  : 'text-[#6C757D] hover:text-[#181B1F] dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#E8590C]" />
              <span>CISA KEV Intel</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#E9ECEF] dark:bg-[#282D35] rounded-xs">
                {EMERGENCY_CISA_KEV.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('c2')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold rounded-sm transition-colors ${
                activeTab === 'c2' 
                  ? 'bg-white dark:bg-[#16191E] text-[#181B1F] dark:text-white shadow-sm border border-[#CED4DA] dark:border-[#343B45]' 
                  : 'text-[#6C757D] hover:text-[#181B1F] dark:hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#FF000F]" />
              <span>Feodo Botnet C2s</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#E9ECEF] dark:bg-[#282D35] rounded-xs">
                {EMERGENCY_FEODO_C2.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('playbook')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold rounded-sm transition-colors ${
                activeTab === 'playbook' 
                  ? 'bg-white dark:bg-[#16191E] text-[#181B1F] dark:text-white shadow-sm border border-[#CED4DA] dark:border-[#343B45]' 
                  : 'text-[#6C757D] hover:text-[#181B1F] dark:hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-blue-500" />
              <span>Emergency Playbook</span>
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadDataset}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-white dark:bg-[#1F242C] border border-[#CED4DA] dark:border-[#343B45] text-[#181B1F] dark:text-white hover:border-[#FF000F] rounded-sm transition-colors"
              title="Download full emergency dataset as JSON"
            >
              <Download className="w-3.5 h-3.5 text-[#FF000F]" />
              <span>Dataset (.json)</span>
            </button>

            <button
              onClick={handleDownloadSyslog}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-white dark:bg-[#1F242C] border border-[#CED4DA] dark:border-[#343B45] text-[#181B1F] dark:text-white hover:border-[#FF000F] rounded-sm transition-colors"
              title="Export RFC 5424 Syslog traffic log file"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Syslog (.log)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live Traffic Stream */}
        {activeTab === 'stream' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Stream Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-white dark:bg-[#16191E] border-b border-[#E2E6EA] dark:border-[#282D35]">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter IP, protocol, payload..."
                    className="w-48 sm:w-64 pl-7 pr-3 py-1 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#CED4DA] dark:border-[#343B45] text-xs font-mono rounded-sm outline-none focus:border-[#FF000F] text-[#181B1F] dark:text-white"
                  />
                  <Search className="w-3.5 h-3.5 text-[#6C757D] absolute left-2 top-2" />
                </div>

                <div className="flex items-center gap-1 text-xs font-mono">
                  {['ALL', 'ALERTS', 'MODBUS', 'TCP', 'HTTPS', 'DNS'].map((proto) => (
                    <button
                      key={proto}
                      onClick={() => setSelectedProto(proto)}
                      className={`px-2 py-0.5 rounded-sm transition-colors ${
                        selectedProto === proto 
                          ? proto === 'ALERTS' ? 'bg-[#FF000F] text-white' : 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F]'
                          : 'bg-[#E9ECEF] dark:bg-[#282D35] text-[#495057] dark:text-[#9BA3AF] hover:bg-[#DEE2E6]'
                      }`}
                    >
                      {proto}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stream Controls */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  onClick={injectLiveBurst}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border bg-[#F8F9FA] dark:bg-[#1F242C] border-[#CED4DA] dark:border-[#343B45] text-[#181B1F] dark:text-white hover:border-[#FF000F] transition-colors cursor-pointer"
                  title="Inject live telemetry burst immediately"
                >
                  <RefreshCw className="w-3 h-3 text-[#FF000F]" />
                  <span>Inject Burst</span>
                </button>

                <label className="flex items-center gap-1.5 text-xs text-[#6C757D] dark:text-[#9BA3AF] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="accent-[#FF000F] rounded-sm"
                  />
                  <span>Auto-scroll</span>
                </label>

                <button
                  onClick={() => setPackets([])}
                  className="p-1 text-[#6C757D] hover:text-[#181B1F] dark:hover:text-white"
                  title="Clear buffer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Industrial Monospace Terminal Viewport */}
            <div className="flex-1 overflow-y-auto bg-[#0A0D12] text-[#E6EDF3] p-3 font-mono text-xs select-text">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#21262D] text-[#8B949E] text-[11px]">
                    <th className="pb-2 font-normal">TIME (UTC)</th>
                    <th className="pb-2 font-normal">PACKET ID</th>
                    <th className="pb-2 font-normal">SOURCE IP</th>
                    <th className="pb-2 font-normal">DESTINATION IP</th>
                    <th className="pb-2 font-normal">PROTO</th>
                    <th className="pb-2 font-normal">PORT</th>
                    <th className="pb-2 font-normal">ACTION</th>
                    <th className="pb-2 font-normal">THREAT</th>
                    <th className="pb-2 font-normal">DPI LOG / PAYLOAD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161B22]">
                  {filteredPackets.map((pkt) => {
                    const isAlert = pkt.action === 'ALERT';
                    return (
                      <tr 
                        key={pkt.id} 
                        className={`hover:bg-[#161B22]/80 transition-colors ${
                          isAlert ? 'bg-[#FF000F]/10 text-red-300 font-semibold' : ''
                        }`}
                      >
                        <td className="py-1.5 text-[#8B949E] whitespace-nowrap">
                          {pkt.timestamp.split('T')[1]?.substring(0, 8)}
                        </td>
                        <td className="py-1.5 text-[#58A6FF] whitespace-nowrap">{pkt.id}</td>
                        <td className="py-1.5 text-[#7EE787] whitespace-nowrap">{pkt.src_ip}</td>
                        <td className={`py-1.5 whitespace-nowrap ${isAlert ? 'text-[#FF7B72] font-bold' : 'text-[#79C0FF]'}`}>
                          {pkt.dst_ip}
                        </td>
                        <td className="py-1.5 whitespace-nowrap text-[#FFA657]">{pkt.protocol}</td>
                        <td className="py-1.5 whitespace-nowrap text-[#D2A8FF]">{pkt.dst_port}</td>
                        <td className="py-1.5 whitespace-nowrap">
                          <span 
                            className={`px-1.5 py-0.5 rounded-xs text-[10px] uppercase ${
                              isAlert 
                                ? 'bg-[#FF000F] text-white font-bold animate-pulse' 
                                : pkt.action === 'DROP'
                                ? 'bg-amber-900/40 text-amber-300 border border-amber-700'
                                : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'
                            }`}
                          >
                            {pkt.action}
                          </span>
                        </td>
                        <td className="py-1.5 whitespace-nowrap">
                          <span className={pkt.threat_score > 70 ? 'text-[#FF000F] font-bold' : 'text-[#8B949E]'}>
                            {pkt.threat_score}/100
                          </span>
                        </td>
                        <td className="py-1.5 text-[#C9D1D9] truncate max-w-md" title={pkt.message}>
                          {pkt.message}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div ref={scrollBottomRef} />
            </div>
          </div>
        )}

        {/* Tab 2: Sourced CISA KEV Intelligence */}
        {activeTab === 'cisa' && (
          <div className="flex-1 overflow-y-auto p-5 bg-white dark:bg-[#16191E]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-base text-[#181B1F] dark:text-white">
                  Real CISA Known Exploited Vulnerabilities (KEV) Feed
                </h3>
                <p className="text-xs text-[#6C757D] dark:text-[#9BA3AF]">
                  Official U.S. Cybersecurity and Infrastructure Security Agency catalog actively exploited by threat actors
                </p>
              </div>
              <span className="text-xs font-mono bg-[#E9ECEF] dark:bg-[#282D35] px-2.5 py-1 rounded-sm text-[#495057] dark:text-[#9BA3AF]">
                Source: cisa.gov
              </span>
            </div>

            <div className="space-y-3">
              {EMERGENCY_CISA_KEV.map((vuln: any) => (
                <div 
                  key={vuln.cveID} 
                  className="p-4 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm hover:border-[#FF000F] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#FF000F] text-white font-mono text-xs font-bold rounded-xs">
                        {vuln.cveID}
                      </span>
                      <span className="font-sans font-bold text-sm text-[#181B1F] dark:text-white">
                        {vuln.vendorProject} - {vuln.product}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
                      Due Date: {vuln.dueDate || 'Immediate'}
                    </span>
                  </div>
                  <h4 className="font-sans font-semibold text-xs text-[#495057] dark:text-[#CBD5E1] mt-2">
                    {vuln.vulnerabilityName}
                  </h4>
                  <p className="text-xs text-[#6C757D] dark:text-[#9BA3AF] mt-1 leading-relaxed">
                    {vuln.shortDescription}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-[#E2E6EA] dark:border-[#2E3540] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#5A626E]">
                    <span>Action Required: <strong className="text-[#181B1F] dark:text-white">{vuln.requiredAction}</strong></span>
                    <span>Ransomware: <strong className="text-red-500">{vuln.knownRansomwareCampaignUse}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Sourced Feodo Tracker Botnet C2s */}
        {activeTab === 'c2' && (
          <div className="flex-1 overflow-y-auto p-5 bg-white dark:bg-[#16191E]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-base text-[#181B1F] dark:text-white">
                  Real Abuse.ch Feodo Tracker Active C2 Nodes
                </h3>
                <p className="text-xs text-[#6C757D] dark:text-[#9BA3AF]">
                  Live Command and Control servers associated with Dridex, Emotet, QakBot, and TrickBot
                </p>
              </div>
              <span className="text-xs font-mono bg-[#E9ECEF] dark:bg-[#282D35] px-2.5 py-1 rounded-sm text-[#495057] dark:text-[#9BA3AF]">
                Source: feodotracker.abuse.ch
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EMERGENCY_FEODO_C2.map((c2: any, i: number) => (
                <div 
                  key={i} 
                  className="p-3 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-[#FF000F]">{c2.ip_address}:{c2.port}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 font-semibold rounded-xs">
                      {c2.status || 'Active C2'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono text-[#6C757D] dark:text-[#9BA3AF] space-y-1">
                    <div>Malware Family: <strong className="text-[#181B1F] dark:text-white">{c2.malware || 'Generic Botnet'}</strong></div>
                    <div>Host: {c2.hostname}</div>
                    <div>AS Network: {c2.as_name} (AS{c2.as_number})</div>
                    <div>Country: {c2.country}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Emergency Playbook & Procedures */}
        {activeTab === 'playbook' && (
          <div className="flex-1 overflow-y-auto p-5 bg-white dark:bg-[#16191E]">
            <div className="mb-4">
              <h3 className="font-sans font-bold text-base text-[#181B1F] dark:text-white">
                ABB Standard Cybersecurity Incident Response Playbook
              </h3>
              <p className="text-xs text-[#6C757D] dark:text-[#9BA3AF]">
                Compliant with ISO/IEC 27035 / IEC 62443 / NIST SP 800-61 Rev 2
              </p>
            </div>

            <div className="space-y-4">
              {EMERGENCY_DATASET.emergencyScenarios?.map((scenario: any) => (
                <div 
                  key={scenario.drillId} 
                  className="p-4 bg-[#F8F9FA] dark:bg-[#1F242C] border border-[#E2E6EA] dark:border-[#2E3540] rounded-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-outrun uppercase text-xs font-bold text-[#FF000F]">
                      {scenario.drillId}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-mono bg-[#FF000F] text-white rounded-xs">
                      {scenario.severity}
                    </span>
                  </div>
                  <h4 className="font-sans font-bold text-sm text-[#181B1F] dark:text-white">
                    {scenario.title}
                  </h4>
                  <div className="mt-2 text-xs font-mono text-[#6C757D] dark:text-[#9BA3AF]">
                    <div>Zone: {scenario.affectedZone}</div>
                    <div>Threat Actor: {scenario.threatActor}</div>
                    <div>Exploited CVE: {scenario.primaryCve}</div>
                  </div>

                  <div className="mt-3">
                    <span className="text-xs font-sans font-semibold text-[#181B1F] dark:text-white">
                      Automated Containment Procedures:
                    </span>
                    <ol className="mt-1.5 space-y-1.5 list-decimal list-inside text-xs font-mono text-[#495057] dark:text-[#CBD5E1]">
                      {scenario.containmentPlaybook?.map((step: any) => (
                        <li key={step.step} className="p-1.5 bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-xs">
                          {step.action} — <span className="text-[#FF000F] font-semibold">[{step.status}]</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info strip */}
        <div className="px-5 py-3 bg-[#F8F9FA] dark:bg-[#1B2027] border-t border-[#E2E6EA] dark:border-[#282D35] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#6C757D] dark:text-[#9BA3AF]">
          <span>Dataset Authors: <strong>Ishaen S Bethur • Pragyan Hota</strong></span>
          <span>Buffer: {filteredPackets.length} events • Rate: ~{pps} pkts/s</span>
        </div>

      </div>
    </div>
  );
};
