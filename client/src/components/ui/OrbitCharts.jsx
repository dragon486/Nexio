import React, { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

/* ─────────────────────────────────────────────
   SalesGauge  — Semi-circle performance meter
   Matches the Uxerflow reference left panel
───────────────────────────────────────────── */
export const SalesGauge = ({ value = 0, max = 100, size = 200, label = 'of 100 points' }) => {
    const radius = (size - 20) / 2;
    const circumference = Math.PI * radius; // half-circle
    const progress = Math.min(value / max, 1);
    const strokeOffset = circumference * (1 - progress);

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size / 2 + 16 }}>
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="overflow-visible"
                >
                    {/* Background arc */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        className="text-gray-100 dark:text-white/5"
                        strokeWidth={14}
                        strokeDasharray={`${circumference} ${circumference * 10}`}
                        strokeDashoffset={0}
                        strokeLinecap="round"
                        transform={`rotate(180 ${size / 2} ${size / 2})`}
                    />
                    {/* Progress arc — NEXIO Blue */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="var(--accent-primary)"
                        strokeWidth={14}
                        strokeDasharray={`${circumference} ${circumference * 10}`}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        transform={`rotate(180 ${size / 2} ${size / 2})`}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Center value */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                    <span className="text-4xl font-black text-gray-900 dark:text-white leading-none tracking-tight">
                        {value}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">{label}</span>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   MonthlyBarChart  — 12-month revenue bars
   Matches the Uxerflow reference analytics panel
───────────────────────────────────────────── */
export const MonthlyBarChart = ({ data = [], currentMonth = new Date().getMonth() }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const maxVal = Math.max(...data.map(d => d.revenue || 0), 1);
    const yLabels = ['₹4K', '₹3K', '₹2K', '₹1K', '0'];

    const [tooltip, setTooltip] = React.useState(null);

    return (
        <div className="w-full select-none">
            {/* Y-axis + bars */}
            <div className="flex gap-2 items-end" style={{ height: 200 }}>
                {/* Y-axis labels */}
                <div className="flex flex-col justify-between h-full text-right pr-2 shrink-0" style={{ height: 200 }}>
                    {yLabels.map(l => (
                        <span key={l} className="text-[10px] text-gray-400 dark:text-gray-600 leading-none">{l}</span>
                    ))}
                </div>
                {/* Bars */}
                <div className="flex-1 flex items-end gap-1.5 h-full relative">
                    {months.map((month, i) => {
                        const d = data[i] || { revenue: 0, convRate: 0 };
                        const barH = maxVal > 0 ? Math.max((d.revenue / maxVal) * 160, 4) : 4;
                        const isCurrent = i === currentMonth;
                        return (
                            <div
                                key={month}
                                className="flex-1 flex flex-col items-center gap-1 group cursor-pointer relative"
                                onMouseEnter={() => setTooltip({ i, month, ...d })}
                                onMouseLeave={() => setTooltip(null)}
                            >
                                {/* Tooltip */}
                                {tooltip?.i === i && (
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 bg-gray-900 dark:bg-gray-800 text-white rounded-xl p-3 text-xs shadow-xl whitespace-nowrap pointer-events-none">
                                        <div className="font-bold mb-1">{month}, {new Date().getFullYear()}</div>
                                        <div className="flex gap-3">
                                            <span>Revenue <b>₹{(d.revenue || 0).toLocaleString('en-IN')}</b></span>
                                            <span>Conv. <b>{d.convRate || 0}%</b></span>
                                        </div>
                                        {/* Arrow */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        'w-full rounded-lg transition-all duration-500 ease-out',
                                        isCurrent
                                            ? 'bg-[#0066ff] shadow-lg shadow-blue-500/25'
                                            : 'bg-gray-100 dark:bg-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/10'
                                    )}
                                    style={{ height: barH }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* X-axis labels */}
            <div className="flex gap-1.5 mt-2 pl-10">
                {months.map(m => (
                    <div key={m} className="flex-1 text-center text-[9px] text-gray-400 dark:text-gray-600">{m}</div>
                ))}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   Sparkline  — Tiny inline trend line
───────────────────────────────────────────── */
export const Sparkline = ({ data = [], width = 80, height = 36, color = '#0066ff', positive = true }) => {
    if (data.length < 2) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const pts = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    });
    return (
        <svg width={width} height={height} className="overflow-visible">
            <polyline
                points={pts.join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

/* ─────────────────────────────────────────────
   Heatmap  — Visit by Time grid
───────────────────────────────────────────── */
export const Heatmap = ({ data }) => {
    const hours = ['12 AM – 8 AM', '8 AM – 4 PM', '4 PM – 12 AM'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Use provided data or fall back to mock
    const grid = data || [
        [1, 2, 3, 1, 0, 0, 1],
        [5, 7, 8, 6, 4, 3, 5],
        [2, 3, 4, 7, 9, 8, 6],
    ];

    const getCell = (v) => {
        if (v === 0) return 'bg-gray-100 dark:bg-white/[0.03]';
        if (v <= 2) return 'bg-blue-100 dark:bg-blue-900/20';
        if (v <= 5) return 'bg-blue-300 dark:bg-blue-700/40';
        if (v <= 7) return 'bg-blue-500';
        return 'bg-blue-600 shadow-sm shadow-blue-500/30';
    };

    return (
        <div className="space-y-2">
            <div className="flex pl-24">
                {days.map(d => (
                    <div key={d} className="flex-1 text-center text-[10px] font-medium text-gray-400 dark:text-gray-600">{d}</div>
                ))}
            </div>
            {hours.map((h, i) => (
                <div key={h} className="flex items-center gap-2">
                    <span className="w-24 text-[10px] text-gray-400 dark:text-gray-600 text-right shrink-0 leading-tight">{h}</span>
                    <div className="flex-1 flex gap-1.5">
                        {grid[i].map((v, j) => (
                            <div
                                key={j}
                                className={cn('flex-1 h-8 rounded-lg transition-all duration-300 hover:opacity-80 cursor-pointer', getCell(v))}
                                title={`${h} ${days[j]}: ${v}`}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

/* ─────────────────────────────────────────────
   DonutChart  — Mobile/Web visit breakdown
───────────────────────────────────────────── */
export const DonutChart = ({ size = 140, segments = [], label = '' }) => {
    const total = segments.reduce((a, b) => a + (b.value || 0), 0) || 1;
    let offset = 0;
    const r = 16;
    const circ = 2 * Math.PI * r;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 44 44">
                {segments.map((seg, i) => {
                    const pct = (seg.value / total) * 100;
                    const dash = (pct / 100) * circ;
                    const gap = circ - dash;
                    const d = {
                        strokeDasharray: `${dash} ${gap}`,
                        strokeDashoffset: circ * 0.25 - offset * circ / 100,
                    };
                    offset += pct;
                    return (
                        <circle
                            key={i}
                            cx="22" cy="22" r={r}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth="6"
                            strokeDasharray={d.strokeDasharray}
                            strokeDashoffset={d.strokeDashoffset}
                            strokeLinecap="butt"
                            className="transition-all duration-700"
                        />
                    );
                })}
            </svg>
            {label && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{label}</span>
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   GaugeChart  — Legacy circular gauge (keep compat)
───────────────────────────────────────────── */
export const GaugeChart = ({ value = 0, size = 180 }) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size / 2 + 20 }}>
            <svg width={size} height={size} className="transform -rotate-180" viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
                    className="text-gray-100 dark:text-white/5"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={circumference / 2} strokeLinecap="round" />
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--accent-primary)" strokeWidth={strokeWidth} fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (value / 100) * (circumference / 2)}
                    strokeLinecap="round" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
                <div className="text-4xl font-black text-slate-900 dark:text-white leading-none">{value}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Score</div>
            </div>
        </div>
    );
};
