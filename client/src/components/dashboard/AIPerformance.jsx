import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { Zap, CheckCircle2, Clock } from 'lucide-react';

const AIPerformance = ({ stats: data, isDemo }) => {
    // Expecting data: { avgScore, highPriority, midPriority, lowPriority, emailsSent, responseSpeed }

    const pieData = [
        { name: 'High Priority', value: data?.highPriority || 0, color: 'var(--color-primary)' },
        { name: 'Lead Nurture', value: data?.midPriority || 0, color: '#3B82F6' },
        { name: 'General Info', value: data?.lowPriority || 0, color: 'rgba(var(--muted-foreground-rgb), 0.3)' },
    ];

    return (
        <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[12px] h-full flex flex-col p-8 relative shadow-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                        <Zap size={18} className="text-primary animate-pulse" /> Signal Efficiency
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-2 font-bold opacity-60">Autonomous quality and action metrics</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-[0.1em] border transition-all ${isDemo ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-soft text-muted-foreground border-border/20'}`}>
                    {isDemo ? 'DEMO INTEL' : 'ACTUALS'}
                </div>
            </div>

            <div className="flex flex-col xl:flex-row items-center gap-12 h-full">
                {/* Donut Chart */}
                <div className="relative w-48 h-48 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={65}
                                outerRadius={85}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(var(--surface-rgb, 29, 29, 31), 0.8)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                                }}
                                itemStyle={{ color: 'var(--foreground)', fontSize: '10px', fontWeight: '900' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-5xl font-black text-foreground tracking-tighter">{Math.round(data?.avgScore || 0)}</span>
                        <span className="text-[9px] text-primary uppercase tracking-[0.3em] font-black mt-1">Efficacy</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex-1 w-full space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-surface/40 border border-border/10 hover:border-primary/20 transition-all group overflow-hidden relative">
                            <div className="absolute -right-4 -top-4 w-12 h-12 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
                            <Zap size={14} className="text-primary mb-3" />
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1 opacity-60">Lead Volume</div>
                            <div className="text-foreground font-black text-2xl tracking-tighter">{data?.emailsSent?.toLocaleString() || 0}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-surface/40 border border-border/10 hover:border-primary/20 transition-all group overflow-hidden relative">
                            <div className="absolute -right-4 -top-4 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
                            <Clock size={14} className="text-emerald-500 mb-3" />
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1 opacity-60">Response Velocity</div>
                            <div className="text-foreground font-black text-2xl tracking-tighter">{data?.responseSpeed || '0s'}</div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-gradient-to-br from-surface/60 to-surface/20 border border-border/10 relative overflow-hidden group">
                        {/* Reveal Glow */}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="flex justify-between items-end mb-4 relative z-10">
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black mb-2 opacity-60">Conversion Engine</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-primary tracking-tighter">{data?.aiWinRate ?? 0}%</span>
                                    <span className="text-[10px] text-primary font-black uppercase tracking-widest">AI Domination</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">Human Baseline: {data?.manualWinRate ?? 0}%</span>
                            </div>
                        </div>

                        <div className="h-2 w-full bg-surface-border rounded-full overflow-hidden flex relative z-10">
                            <div
                                className="h-full bg-primary transition-all duration-1000 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.5)]"
                                style={{ width: `${data?.aiWinRate ?? 0}%` }}
                            />
                            <div
                                className="h-full bg-foreground/10 transition-all duration-1000"
                                style={{ width: `${data?.manualWinRate ?? 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-6 justify-center xl:justify-start pt-2 opacity-60">
                        {pieData.map(item => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[9px] text-foreground uppercase font-black tracking-widest">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPerformance;
