import React, { useState } from 'react';
import { MOCK_EVENT_TREND_DATA } from '../../data/mockSecurityData';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

export const IncidentTrendChart: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chart metrics
  const maxEvents = Math.max(...MOCK_EVENT_TREND_DATA.map(d => d.totalEvents));
  const height = 140;
  const width = 500;
  const paddingX = 40;
  const paddingBottom = 25;
  const paddingTop = 15;
  const innerHeight = height - paddingBottom - paddingTop;
  const innerWidth = width - paddingX * 2;
  const stepX = innerWidth / (MOCK_EVENT_TREND_DATA.length - 1);

  // Generate points for total events line
  const points = MOCK_EVENT_TREND_DATA.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = height - paddingBottom - (d.totalEvents / maxEvents) * innerHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="bg-white border border-[#E2E6EA] rounded-sm p-4 shadow-industrial">
      {/* ABB Signature Red Accent Bar */}
      <div className="w-8 h-1 bg-[#FF000F] mb-3"></div>
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E9ECEF]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#181B1F]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F]">
            Security Events & Alert Velocity (24h Window)
          </h3>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-[#495057]">
            <span className="w-3 h-0.5 bg-[#181B1F]"></span>
            Total Ingestion Rate
          </span>
          <span className="flex items-center gap-1.5 text-[#D6000D] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#FF000F]"></span>
            Critical Spikes
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full relative overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 select-none">
          {/* Subtle Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - paddingBottom - ratio * innerHeight;
            const val = Math.round(ratio * maxEvents);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E9ECEF"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-[#868E96]"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area under curve (subtle gray) */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`}
            fill="#F1F3F5"
            opacity="0.6"
          />

          {/* Clean line */}
          <path
            d={pathD}
            fill="none"
            stroke="#181B1F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, i) => {
            const hasCritical = p.criticalEvents > 0;
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hasCritical ? 4.5 : 3}
                  fill={hasCritical ? '#FF000F' : '#181B1F'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all hover:r-6"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* X Axis Time Labels */}
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-[#6C757D]"
                >
                  {p.time}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && (
          <div 
            className="absolute top-2 bg-[#181B1F] text-white p-2 text-[10px] font-mono rounded-sm shadow-md border border-[#343A40] pointer-events-none z-20"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="font-bold text-white border-b border-[#343A40] pb-1 mb-1">
              Time: {points[hoveredIndex].time} UTC
            </div>
            <div>Events: <span className="text-gray-200 font-semibold">{points[hoveredIndex].totalEvents.toLocaleString()}</span></div>
            <div>Blocked: <span className="text-emerald-400 font-semibold">{points[hoveredIndex].blockedThreats}</span></div>
            {points[hoveredIndex].criticalEvents > 0 && (
              <div className="text-[#FFA3A8] font-bold mt-0.5">
                Critical Spikes: {points[hoveredIndex].criticalEvents}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-[#E9ECEF] flex items-center justify-between text-[11px] font-mono text-[#5A626E]">
        <span>Aggregated NetFlow & SIEM Events (15-min sampling)</span>
        <span className="text-[#181B1F] font-medium flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          Peak Velocity: 3,420 eps @ 10:00 UTC
        </span>
      </div>
    </div>
  );
};
