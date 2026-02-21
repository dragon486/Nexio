import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '../ui/GlassCard';
import { Zap, CheckCircle2, Clock } from 'lucide-react';

const AIPerformance = ({ data }) => {
    // Expecting data: { avgScore, highPriority, midPriority, lowPriority, emailsSent, responseSpeed }

    const pieData = [
        { name: 'High', value: data?.highPriority || 0, color: '#EC4899' }, // Pink
        { name: 'Medium', value: data?.midPriority || 0, color: '#8B5CF6' }, // Purple
        { name: 'Low', value: data?.lowPriority || 0, color: '#3B82F6' }, // Blue
    ];

    return (
        <GlassCard className="h-full flex flex-col p-6 relative border-white/5">
            <div className="mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap size={16} className="text-brand-purple" /> AI Performance
                </h3>
                <p className="text-[11px] text-muted mt-1">Efficiency and quality of autonomous actions</p>
            </div>

            <div className="flex flex-col xl:flex-row items-center gap-8 h-full">
                {/* Donut Chart */}
                <div className="relative w-40 h-40 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={75}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#050505', borderRadius: '8px', border: '1px solid #333' }}
                                itemStyle={{ color: '#fff', fontSize: '10px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-black text-white tracking-tighter">{Math.round(data?.avgScore || 0)}</span>
                        <span className="text-[9px] text-muted uppercase tracking-widest font-bold">Avg Score</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex-1 w-full space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-purple/20 rounded-lg text-brand-purple">
                                <Zap size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] text-muted uppercase tracking-wider font-bold">Volume</div>
                                <div className="text-white font-bold text-lg">{data?.emailsSent?.toLocaleString() || 0} <span className="text-xs text-muted font-normal lowercase">actions</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                <Clock size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] text-muted uppercase tracking-wider font-bold">Speed</div>
                                <div className="text-white font-bold text-lg">{data?.responseSpeed || '0s'} <span className="text-xs text-muted font-normal lowercase">avg</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-blue/20 rounded-lg text-brand-blue">
                                <Zap size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] text-muted uppercase tracking-wider font-bold">Resilience</div>
                                <div className="text-white font-bold text-lg">{data?.resilienceLeads || 0} <span className="text-xs text-muted font-normal lowercase">saved</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center xl:justify-start pt-2">
                        {pieData.map(item => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[10px] text-muted uppercase font-bold">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default AIPerformance;
