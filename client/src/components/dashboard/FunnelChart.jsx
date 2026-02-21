import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const FunnelChart = ({ data }) => {
    // Transform data for the chart if needed, or expect pre-formatted
    // Expecting: [{ name: 'New', value: 100 }, { name: 'Contacted', value: 80 }...]

    return (
        <GlassCard className="h-full flex flex-col relative overflow-hidden group border-white/5">
            <div className="flex justify-between items-start mb-6 z-10">
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Conversion Funnel</h3>
                    <p className="text-[11px] text-muted mt-1">Lead progression from new to close</p>
                </div>
                <div className="bg-white/5 px-2 py-1 rounded-lg text-[10px] font-mono text-white/50 border border-white/5">
                    Live
                </div>
            </div>

            <div className="flex-1 w-full min-h-[200px] z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 50 }}>
                        <defs>
                            <linearGradient id="colorFunnel" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#050505', borderColor: '#1F1F1F', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            fill="url(#colorFunnel)"
                            animationDuration={1500}
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 10, dy: 10 }}
                            interval={0}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Overlay Stats */}
            <div className="absolute bottom-4 right-6 flex flex-col items-end pointer-events-none z-0 opacity-10">
                <span className="text-6xl font-black text-white stroke-black">
                    {data && data.length > 0 ? Math.round((data[data.length - 1].value / data[0].value) * 100) : 0}%
                </span>
            </div>
        </GlassCard>
    );
};

export default FunnelChart;
