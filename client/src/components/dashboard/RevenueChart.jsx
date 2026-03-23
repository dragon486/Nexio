import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { ArrowUpRight } from 'lucide-react';

const RevenueChart = ({ data, isDemo, currency = 'USD', locale = 'en-US', title, subtitle }) => {
    const [timeRange, setTimeRange] = useState('7d');

    const formatValue = (value) => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-transparent p-4 rounded-xl shadow-2xl backdrop-blur-xl z-50">
                    <p className="text-text-tertiary text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">{label}</p>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <p className="text-text-primary text-lg font-black tracking-tighter">
                            {formatValue(payload[0].value * 100)}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-surface border border-transparent rounded-2xl p-8 hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col h-full relative group overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 z-20">
                <div>
                    <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        {title || 'Revenue Growth'} <ArrowUpRight className="text-accent" size={18} />
                    </h3>
                    <p className="text-[11px] text-text-tertiary mt-2 font-bold opacity-60">{subtitle || 'Intelligence-driven performance'}</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-[0.1em] border transition-all ${isDemo ? 'bg-accent/10 text-accent border-transparent' : 'bg-surface-soft/50 text-text-tertiary border-transparent'}`}>
                        {isDemo ? 'DEMO INTEL' : 'ACTUALS'}
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px] z-10 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-[0.03]" vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 700, opacity: 0.5 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 700, opacity: 0.5 }}
                            tickFormatter={(value) => `$${value}k`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                        <Bar 
                            dataKey="revenue" 
                            radius={[6, 6, 0, 0]}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={index === data.length - 1 ? 'var(--accent)' : 'rgba(59, 130, 246, 0.3)'} 
                                    className="hover:fill-accent transition-colors duration-300"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Visual Flair */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
        </div>
    );
};

export default RevenueChart;
