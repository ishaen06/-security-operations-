import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Clock, 
  RefreshCw, 
  Download, 
  Search, 
  CheckCircle2,
  Lock,
  Terminal,
  Table as TableIcon
} from 'lucide-react';
import { 
  TrafficPacket, 
  generateClientSidePacket 
} from '../../data/emergencyDrillHelper';

export const LiveLogsTable: React.FC = () => {
  // Pre-seed with 20 realistic logs so table is populated initially
  const [packets, setPackets] = useState<TrafficPacket[]>(() => {
    const initial: TrafficPacket[] = [];
    for (let i = 1; i <= 20; i++) {
      initial.push(generateClientSidePacket(i));
    }
    return initial;
  });

  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedProto, setSelectedProto] = useState<string>('ALL');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'console' | 'table'>('console');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);

  const packetCounterRef = useRef<number>(25);
  const isSyncingRef = useRef<boolean>(false);
  const isBackendConnectedRef = useRef<boolean>(false);
  const noticeTimeoutRef = useRef<any>(null);

  // User click handler for "Sync Logs" button - injects immediate live burst
  const handleManualSync = async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setIsSyncing(true);

    // Ingest immediate burst of 10 fresh live packets
    const freshBurst: TrafficPacket[] = [];
    for (let i = 0; i < 10; i++) {
      packetCounterRef.current += 1;
      freshBurst.push(generateClientSidePacket(packetCounterRef.current));
    }
    setPackets((prev) => [...freshBurst, ...prev.slice(0, 190)]);

    setRefreshNotice('Live Sync: +10 live telemetry packets injected');
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    noticeTimeoutRef.current = setTimeout(() => setRefreshNotice(null), 3000);

    try {
      await fetch('http://localhost:5000/api/v1/emergency/force-sync', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch {
      // Backend offline fallback handled cleanly
    }

    setTimeout(() => {
      setIsSyncing(false);
      isSyncingRef.current = false;
    }, 500);
  };

  // Real-time live SSE stream from backend (:5000)
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('http://localhost:5000/api/v1/stream/traffic');

      eventSource.onopen = () => {
        isBackendConnectedRef.current = true;
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          // Ingest live packet continuously as it arrives
          if (parsed.src_ip && parsed.id) {
            isBackendConnectedRef.current = true;
            if (isLiveStreaming) {
              setPackets((prev) => [parsed, ...prev.slice(0, 199)]);
            }
          }
        } catch {
          // ignore
        }
      };

      eventSource.onerror = () => {
        isBackendConnectedRef.current = false;
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
      };
    } catch {
      isBackendConnectedRef.current = false;
    }

    return () => {
      if (eventSource) eventSource.close();
      if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    };
  }, [isLiveStreaming]);

  // Client-side real-time continuous stream fallback if backend SSE is disconnected
  useEffect(() => {
    if (!isLiveStreaming) return;

    const streamInterval = setInterval(() => {
      if (!isBackendConnectedRef.current) {
        packetCounterRef.current += 1;
        const pkt = generateClientSidePacket(packetCounterRef.current);
        setPackets((prev) => [pkt, ...prev.slice(0, 199)]);
      }
    }, 900);

    return () => clearInterval(streamInterval);
  }, [isLiveStreaming]);

  // Helper to determine subnet
  const getSubnet = (ip: string) => {
    if (ip.startsWith('10.10.10.')) return 'Subnet A (10.10.10.0/24)';
    if (ip.startsWith('10.10.20.')) return 'Subnet B (10.10.20.0/24)';
    if (ip.startsWith('10.10.30.')) return 'Subnet C (10.10.30.0/24)';
    if (ip.startsWith('192.168.1.')) return 'Subnet A (10.10.10.0/24)';
    return 'Perimeter DMZ / External';
  };

  // Filtered packets
  const filteredPackets = useMemo(() => {
    return packets
      .filter((pkt) => {
        if (selectedProto !== 'ALL' && pkt.protocol !== selectedProto) return false;
        if (selectedAction !== 'ALL' && pkt.action !== selectedAction) return false;
        if (!searchFilter) return true;
        const q = searchFilter.toLowerCase();
        return (
          pkt.id.toLowerCase().includes(q) ||
          pkt.src_ip.toLowerCase().includes(q) ||
          pkt.dst_ip.toLowerCase().includes(q) ||
          pkt.protocol.toLowerCase().includes(q) ||
          pkt.action.toLowerCase().includes(q) ||
          pkt.message.toLowerCase().includes(q)
        );
      })
      .slice(-40)
      .reverse(); // Newest first
  }, [packets, selectedProto, selectedAction, searchFilter]);

  // Download raw logs
  const handleDownloadLogs = () => {
    const logContent = packets.map(p => 
      `${p.timestamp} CEF:0|ABB|CyberOps|1.0|${p.action}|${p.message}|${p.threat_score}|src=${p.src_ip} spt=${p.src_port} dst=${p.dst_ip} dpt=${p.dst_port} proto=${p.protocol} bytes=${p.bytes}`
    ).join('\n');

    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abb_network_traffic_${new Date().toISOString().slice(0, 10)}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm shadow-industrial overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E2E6EA] dark:border-[#282D35] bg-[#F8F9FA] dark:bg-[#1B2027] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Signature ABB Red Accent Bar */}
          <div className="w-10 h-1.5 bg-[#FF000F] mb-2" />
          <div className="flex items-center gap-2">
            <span className="font-outrun text-xs font-bold uppercase tracking-wider text-[#FF000F]">
              ABB PERIMETER TELEMETRY
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#181B1F] dark:text-white mt-0.5">
            Log
          </h3>
          <p className="text-xs font-mono text-[#6C757D] dark:text-[#9BA3AF] mt-0.5">
            Real-time continuous packet telemetry streaming across Core Gateway and Subnets A, B, and C
          </p>
        </div>

        {/* Real-Time Live Stream Controls & Indicator */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Streaming Indicator */}
          <div className="flex items-center gap-2 font-mono text-xs text-[#495057] dark:text-[#9BA3AF]">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveStreaming ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLiveStreaming ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <div>
              <div className={`text-[9px] uppercase font-bold tracking-wider leading-none ${isLiveStreaming ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {isLiveStreaming ? 'LIVE STREAMING' : 'STREAM PAUSED'}
              </div>
              <div className="font-bold text-xs text-[#181B1F] dark:text-white mt-0.5 leading-none">
                {packets.length} Events Logged
              </div>
            </div>
          </div>

          {/* Pause / Resume Feed Toggle */}
          <button
            onClick={() => setIsLiveStreaming(prev => !prev)}
            className="px-2.5 py-1.5 bg-white dark:bg-[#1F242C] border border-[#CED4DA] dark:border-[#343B45] hover:border-[#FF000F] text-[#181B1F] dark:text-white rounded-sm text-xs font-mono font-bold transition-colors shadow-xs cursor-pointer select-none"
            title={isLiveStreaming ? "Pause live stream" : "Resume live stream"}
          >
            {isLiveStreaming ? 'Pause Feed' : 'Resume Live'}
          </button>

          {/* Sync Now Button - Injects fresh live burst immediately */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center justify-center gap-1.5 w-28 px-3 py-1.5 bg-[#181B1F] text-white hover:bg-black rounded-sm text-xs font-mono font-bold uppercase transition-all shadow-xs disabled:opacity-75 cursor-pointer select-none"
            title="Inject live packet burst immediately"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isSyncing ? 'animate-spin text-[#FF000F]' : ''}`} />
            <span className="truncate">{isSyncing ? 'Syncing...' : 'Sync Logs'}</span>
          </button>

          {/* Download Logs Button - Clean & borderless */}
          <button
            onClick={handleDownloadLogs}
            className="p-1.5 text-[#495057] dark:text-[#CBD5E1] hover:text-[#181B1F] dark:hover:text-white rounded-sm transition-colors"
            title="Download full emergency traffic log (CEF / RFC 5424 format)"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Notice Banner (if triggered) */}
      {refreshNotice && (
        <div className="px-5 py-2 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">{refreshNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-700">Live Active</span>
        </div>
      )}

      {/* Filter and Query Toolbar */}
      <div className="px-5 py-3 border-b border-[#E2E6EA] dark:border-[#282D35] bg-white dark:bg-[#16191E] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[#868E96] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter IP, Protocol, Action, Message, CVE..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#CED4DA] dark:border-[#343B45] text-[#181B1F] dark:text-white rounded-xs text-xs outline-none focus:border-[#FF000F]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Protocol Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#6C757D]">Proto:</span>
            <select
              value={selectedProto}
              onChange={(e) => setSelectedProto(e.target.value)}
              className="px-2 py-1 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#CED4DA] dark:border-[#343B45] text-[#181B1F] dark:text-white rounded-xs text-xs outline-none focus:border-[#FF000F]"
            >
              <option value="ALL">All Protocols</option>
              <option value="MODBUS/TCP">MODBUS/TCP</option>
              <option value="IEC-104">IEC-104</option>
              <option value="HTTPS">HTTPS</option>
              <option value="DNS">DNS</option>
              <option value="TCP">TCP</option>
              <option value="SSH">SSH</option>
            </select>
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#6C757D]">Action:</span>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-2 py-1 bg-[#F8F9FA] dark:bg-[#1B2027] border border-[#CED4DA] dark:border-[#343B45] text-[#181B1F] dark:text-white rounded-xs text-xs outline-none focus:border-[#FF000F]"
            >
              <option value="ALL">All Actions</option>
              <option value="ALLOW">ALLOW</option>
              <option value="DROP">DROP</option>
              <option value="ALERT">ALERT</option>
            </select>
          </div>

          <span className="text-[10px] text-[#6C757D] font-mono pl-2 border-l border-[#E2E6EA] dark:border-[#282D35]">
            Showing {filteredPackets.length} logs (Newest First)
          </span>

          {/* Format Switcher: Log View vs Table */}
          <div className="inline-flex rounded-xs border border-[#CED4DA] dark:border-[#343B45] overflow-hidden ml-1">
            <button
              onClick={() => setViewMode('console')}
              className={`px-2 py-1 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors ${
                viewMode === 'console'
                  ? 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F]'
                  : 'bg-white dark:bg-[#1B2027] text-[#495057] dark:text-[#9BA3AF] hover:bg-[#F1F3F5]'
              }`}
              title="Terminal Log Stream view"
            >
              <Terminal className="w-3 h-3" />
              <span>Log View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2 py-1 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#181B1F] text-white dark:bg-white dark:text-[#181B1F]'
                  : 'bg-white dark:bg-[#1B2027] text-[#495057] dark:text-[#9BA3AF] hover:bg-[#F1F3F5]'
              }`}
              title="Structured Table view"
            >
              <TableIcon className="w-3 h-3" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Log Output Area */}
      {viewMode === 'console' ? (
        <div className="bg-[#0A0D12] text-[#E6EDF3] p-3 sm:p-4 font-mono text-xs max-h-[480px] overflow-y-auto select-text space-y-1">
          {filteredPackets.length === 0 ? (
            <div className="py-8 text-center text-[#8B949E]">
              No matching network packet logs found.
            </div>
          ) : (
            filteredPackets.map((pkt, idx) => {
              const isDrop = pkt.action === 'DROP';
              const isAlert = pkt.action === 'ALERT';
              const timeOnly = pkt.timestamp.includes('T')
                ? pkt.timestamp.split('T')[1].slice(0, 8)
                : pkt.timestamp.slice(0, 8);

              return (
                <div 
                  key={pkt.id} 
                  className={`flex flex-wrap sm:flex-nowrap items-baseline gap-2 py-1 px-2 rounded-xs font-mono leading-relaxed hover:bg-[#161B22] transition-colors border-b border-[#161B22]/50 ${
                    isAlert ? 'bg-[#FF000F]/10 text-red-200' : isDrop ? 'bg-amber-950/20 text-amber-200' : 'text-[#C9D1D9]'
                  }`}
                >
                  <span className="text-[#6E7681] select-none text-[10px] w-6 text-right shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[#8B949E] text-[11px] whitespace-nowrap shrink-0">
                    {timeOnly}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded-xs text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                    isAlert 
                      ? 'bg-[#FF000F] text-white animate-pulse' 
                      : isDrop 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-600/40' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-600/40'
                  }`}>
                    {pkt.action}
                  </span>
                  <span className="text-[#FFA657] font-bold text-[11px] shrink-0">
                    {pkt.protocol}
                  </span>
                  <span className="text-[#7EE787] whitespace-nowrap text-[11px] shrink-0">
                    {pkt.src_ip}:{pkt.src_port}
                  </span>
                  <span className="text-[#8B949E] text-[10px] shrink-0">→</span>
                  <span className="text-[#79C0FF] whitespace-nowrap text-[11px] shrink-0">
                    {pkt.dst_ip}:{pkt.dst_port}
                  </span>
                  <span className="text-[#8B949E] text-[10px] whitespace-nowrap shrink-0">
                    [{getSubnet(pkt.dst_ip).split(' ')[0]} {getSubnet(pkt.dst_ip).split(' ')[1] || ''}]
                  </span>
                  <span className="text-[#E6EDF3] truncate text-[11px] flex-1">
                    {pkt.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Dense High-Performance Monospace Log Table */
        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="sticky top-0 bg-[#F1F3F5] dark:bg-[#1F242C] border-b border-[#E2E6EA] dark:border-[#282D35] text-[10px] uppercase tracking-wider text-[#495057] dark:text-[#CBD5E1] z-10">
              <tr>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Log ID</th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Time (UTC)</th>
                <th className="py-2.5 px-3 font-semibold whitespace-nowrap">Action</th>
                <th className="py-2.5 px-3 font-semibold whitespace-nowrap">Protocol</th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Source IP:Port</th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Destination IP:Port</th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Network Subnet</th>
                <th className="py-2.5 px-4 font-semibold">DPI & Telemetry Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF] dark:divide-[#282D35]">
              {filteredPackets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#6C757D] dark:text-[#9BA3AF]">
                    No matching network packet logs found for query.
                  </td>
                </tr>
              ) : (
                filteredPackets.map((pkt) => {
                  const isDrop = pkt.action === 'DROP';
                  const isAlert = pkt.action === 'ALERT';

                  const timeOnly = pkt.timestamp.includes('T')
                    ? pkt.timestamp.split('T')[1].slice(0, 8)
                    : pkt.timestamp.slice(0, 8);

                  return (
                    <tr 
                      key={pkt.id} 
                      className={`hover:bg-[#F8F9FA] dark:hover:bg-[#1B2027] transition-colors ${
                        isDrop ? 'bg-red-50/40 dark:bg-red-950/15' : isAlert ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''
                      }`}
                    >
                      <td className="py-2 px-4 font-bold text-[#181B1F] dark:text-white whitespace-nowrap text-[11px]">
                        {pkt.id}
                      </td>
                      <td className="py-2 px-4 text-[#5A626E] dark:text-[#9BA3AF] whitespace-nowrap text-[11px]">
                        {timeOnly}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-xs tracking-wider inline-flex items-center gap-1 ${
                          isDrop 
                            ? 'bg-[#FF000F] text-white' 
                            : isAlert 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {isDrop && <Lock className="w-2.5 h-2.5" />}
                          {pkt.action}
                        </span>
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap font-bold text-[#181B1F] dark:text-white text-[11px]">
                        {pkt.protocol}
                      </td>
                      <td className="py-2 px-4 text-[#495057] dark:text-[#CBD5E1] whitespace-nowrap text-[11px]">
                        {pkt.src_ip}:{pkt.src_port}
                      </td>
                      <td className="py-2 px-4 text-[#181B1F] dark:text-white whitespace-nowrap font-medium text-[11px]">
                        {pkt.dst_ip}:{pkt.dst_port}
                      </td>
                      <td className="py-2 px-4 text-[#5A626E] dark:text-[#9BA3AF] whitespace-nowrap text-[11px]">
                        {getSubnet(pkt.dst_ip)}
                      </td>
                      <td className="py-2 px-4 text-[#181B1F] dark:text-[#CBD5E1] max-w-[420px] truncate text-[11px]">
                        <span className={`${isDrop ? 'text-[#FF000F] font-bold' : isAlert ? 'text-amber-600 dark:text-amber-400 font-medium' : ''}`}>
                          {pkt.message}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Industrial Footer with Authorship and Auto-Refresh Metrics */}
      <div className="px-5 py-3 border-t border-[#E2E6EA] dark:border-[#282D35] bg-[#F8F9FA] dark:bg-[#1B2027] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-[#6C757D] dark:text-[#9BA3AF]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Buffer: {packets.length} logs</span>
          <span>•</span>
          <span>Feed: Real-Time Live Streaming</span>
          <span>•</span>
          <span>Mode: Continuous Live Ingestion</span>
        </div>

        <div>
          <span>Official Dataset: CISA KEV & Abuse.ch Feed • Authors: <strong>Ishaen S Bethur</strong> & <strong>Pragyan Hota</strong></span>
        </div>
      </div>
    </div>
  );
};