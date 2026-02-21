import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import GlassCard from '../ui/GlassCard';
import { ArrowUpRight, Calendar, BarChart2 } from 'lucide-react';

const RevenueChart = ({ data }) => {
    const [timeRange, setTimeRange] = useState('7d');

    // Filter logic
    const getFilteredData = () => {
        if (!data) return [];
        const copy = [...data];
        switch (timeRange) {
            case '24h': return copy.slice(-1);
            case '7d': return copy.slice(-7);
            case '30d': return copy.slice(-30);
            case 'All': return copy;
            default: return copy.slice(-7);
        }
    };

    const filteredData = getFilteredData();
    const hasData = filteredData && filteredData.length > 0;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/90 border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md z-50">
                    <p className="text-white text-xs font-bold mb-1">{label}</p>
                    <p className="text-brand-purple text-sm font-black">
                        ${payload[0].value.toLocaleString()}
                    </p>
                    <p className="text-brand-blue text-xs">
                        {payload[1].value.toFixed(0)} Leads
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <GlassCard className="h-full flex flex-col p-6 relative group border-white/5 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 z-20">
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        Revenue Growth <ArrowUpRight className="text-emerald-500" size={16} />
                    </h3>
                    <p className="text-[11px] text-muted mt-1">Net revenue from AI-converted leads</p>
                </div>

                <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5 relative z-50">
                    {['24h', '7d', '30d', 'All'].map((range) => (
                        <button
                            key={range}
                            onClick={() => {
                                console.log("Clicked range:", range);
                                setTimeRange(range);
                            }}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all relative ${timeRange === range
                                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10'
                                : 'text-muted hover:text-zinc-300 hover:bg-white/5'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-white/10 mx-1 self-center" />
                    <button
                        className="px-2 py-1.5 rounded-md text-muted hover:text-white hover:bg-white/5 transition-all relative group/cal"
                        title="Custom Range"
                        onClick={() => console.log("Calendar clicked")}
                    >
                        <Calendar size={14} />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover/cal:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">Custom Range</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[250px] z-10 relative">
                {!hasData ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted z-20">
                        <div className="p-4 rounded-full bg-white/5 mb-3">
                            <BarChart2 size={24} className="opacity-50" />
                        </div>
                        <p className="text-xs font-medium">No data available for this period</p>
                        <p className="text-[10px] opacity-60 mt-1">Try selecting a different time range</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#666', fontSize: 10, dy: 10 }}
                                interval="preserveStartEnd"
                                minTickGap={30}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#666', fontSize: 10, dx: -10 }}
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#8B5CF6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                isAnimationActive={true}
                                animationDuration={1000}
                            />
                            <Area
                                type="monotone"
                                dataKey="leads"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorLeads)"
                                yAxisId={0}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </GlassCard>
    );
};

export default RevenueChart;
