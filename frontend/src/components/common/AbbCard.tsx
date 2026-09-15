import React from 'react';

export interface AbbBarChartItem {
  label: string;
  value: number; // 0 to 100 percentage
  isRed?: boolean;
}

export interface AbbDotHeatmapWeek {
  week: string;
  dots: Array<'empty' | 'black' | 'red' | 'gray'>;
}

interface AbbCardProps {
  title: string;
  subtitle?: string; // e.g. "MTD Avg"
  primaryValue?: string; // e.g. "1.95m/2.7m" or "0.5%"
  changeText?: string; // e.g. "+0.29%"
  changeType?: 'positive' | 'negative' | 'neutral';
  
  // Visual Variant A: Progress Bar
  progressBar?: {
    currentPercent: number; // 0 to 100
    currentLabel: string; // e.g. "Current engagement rate"
    targetLabel?: string; // e.g. "Target engagement rate"
  };

  // Visual Variant B: Multi-Column Bar Chart with Target Line
  barChart?: {
    items: AbbBarChartItem[];
    targetLinePercent?: number; // e.g. 70
    targetLineLabel?: string; // e.g. "Target: 0.5%"
  };

  // Visual Variant C: Dot Heatmap (Frequency)
  dotHeatmap?: {
    weeks: AbbDotHeatmapWeek[];
  };

  className?: string;
  children?: React.ReactNode;
}

export const AbbCard: React.FC<AbbCardProps> = ({
  title,
  subtitle,
  primaryValue,
  changeText,
  changeType = 'positive',
  progressBar,
  barChart,
  dotHeatmap,
  className = '',
  children
}) => {
  return (
    <div className={`bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] p-5 rounded-sm shadow-industrial hover:border-[#CED4DA] dark:hover:border-[#4B5563] transition-colors flex flex-col justify-between ${className}`}>
      <div>
        {/* Signature ABB Red Accent Bar (from media_1789113363033.png) */}
        <div className="w-12 h-1.5 bg-[#FF000F] mb-4"></div>

        {/* Title matching media_1789113458641.png */}
        <h3 className="text-base sm:text-lg font-bold text-[#181B1F] dark:text-white tracking-[-0.02em] leading-snug font-sans">
          {title}
        </h3>

        {/* Subtitle / Time window matching media_1789113458641.png */}
        {subtitle && (
          <div className="text-xs font-sans font-normal text-[#6C757D] dark:text-[#9BA3AF] mt-0.5">
            {subtitle}
          </div>
        )}

        {/* Primary Value matching media_1789113215394.png */}
        {primaryValue && (
          <div className="mt-2.5 mb-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-display font-bold text-[#181B1F] dark:text-white tracking-tight">
              {primaryValue}
            </span>
            {changeText && (
              <span 
                className={`text-xs font-mono font-semibold ${
                  changeType === 'positive' 
                    ? 'text-emerald-700 dark:text-emerald-400' 
                    : changeType === 'negative'
                    ? 'text-[#FF000F]'
                    : 'text-[#6C757D]'
                }`}
              >
                {changeText}
              </span>
            )}
          </div>
        )}

        {/* Visual Variant A: Progress Bar */}
        {progressBar && (
          <div className="mt-4">
            <div className="w-full h-3.5 bg-[#E9ECEF] dark:bg-[#282D35] rounded-none overflow-hidden">
              <div 
                className="h-full bg-[#FF000F] transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progressBar.currentPercent))}%` }}
              ></div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#5A626E] dark:text-[#9CA3AF] mt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#FF000F] rounded-none inline-block"></span>
                <span>{progressBar.currentLabel}</span>
              </div>
              {progressBar.targetLabel && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#E9ECEF] dark:bg-[#373E48] border border-[#CED4DA] dark:border-[#4B5563] rounded-none inline-block"></span>
                  <span>{progressBar.targetLabel}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visual Variant B: Multi-Column Bar Chart with Target Line */}
        {barChart && (
          <div className="mt-4 pt-3 relative">
            {/* Horizontal Dashed Target Line */}
            {barChart.targetLinePercent !== undefined && (
              <div 
                className="absolute left-0 right-0 border-t border-dashed border-[#FF000F]/70 flex items-center justify-end pointer-events-none"
                style={{ top: `${100 - barChart.targetLinePercent}%` }}
              >
                {barChart.targetLineLabel && (
                  <span className="text-[10px] font-mono text-[#FF000F] bg-white dark:bg-[#16191E] px-1 -mt-2">
                    {barChart.targetLineLabel}
                  </span>
                )}
              </div>
            )}

            {/* Bars */}
            <div className="flex items-end justify-between h-20 pt-4 gap-2">
              {barChart.items.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                  <div 
                    className={`w-full ${bar.isRed ? 'bg-[#FF000F]' : 'bg-[#CED4DA] dark:bg-[#373E48]'} transition-all hover:opacity-90`}
                    style={{ height: `${bar.value}%` }}
                    title={`${bar.label}: ${bar.value}%`}
                  ></div>
                  <span className="text-[9px] font-mono text-[#868E96] dark:text-[#9CA3AF]">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Variant C: Dot Heatmap (from media_1789113387624.png) */}
        {dotHeatmap && (
          <div className="mt-4 space-y-1.5 font-mono text-[10px]">
            {dotHeatmap.weeks.map((w, wIdx) => (
              <div key={wIdx} className="flex items-center gap-2">
                <span className="w-12 text-[#868E96] dark:text-[#9CA3AF] text-[9px]">{w.week}</span>
                <div className="flex items-center gap-2">
                  {w.dots.map((dot, dIdx) => (
                    <span 
                      key={dIdx}
                      className={`w-2.5 h-2.5 rounded-full inline-block ${
                        dot === 'red'
                          ? 'bg-[#FF000F]'
                          : dot === 'black'
                          ? 'bg-[#181B1F] dark:bg-white'
                          : dot === 'gray'
                          ? 'bg-[#CED4DA] dark:bg-[#373E48]'
                          : 'bg-[#F1F3F5] dark:bg-[#20252D]'
                      }`}
                    ></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Body Children */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};
