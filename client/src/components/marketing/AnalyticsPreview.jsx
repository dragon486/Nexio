import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { TrendingUp, ArrowUpRight, Zap } from 'lucide-react';

const data = [
    { name: 'Mon', leads: 400, revenue: 2400 },
    { name: 'Tue', leads: 300, revenue: 1398 },
    { name: 'Wed', leads: 900, revenue: 9800 },
    { name: 'Thu', leads: 600, revenue: 3908 },
    { name: 'Fri', leads: 1100, revenue: 12800 },
    { name: 'Sat', leads: 700, revenue: 4800 },
    { name: 'Sun', leads: 1300, revenue: 15900 },
];

const AnalyticsPreview = () => {
    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Text Side */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
                        <TrendingUp size={14} />
                        <span>Real-time Intelligence</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Watch your revenue <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">grow in real-time.</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                        Arlo tracks every interaction, qualification, and booked meeting.
                        See exactly how much revenue your AI agents are generating.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-4xl font-bold text-white mb-1">24/7</div>
                            <div className="text-sm text-gray-500">Lead Availability</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-4xl font-bold text-white mb-1">&lt; 1min</div>
                            <div className="text-sm text-gray-500">Response Time</div>
                        </div>
                    </div>
                </div>

                {/* Chart Side */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <GlassCard className="p-6 md:p-8 relative z-10 border-white/10">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <div className="text-sm text-gray-400">Weekly Revenue</div>
                                <div className="text-3xl font-bold text-white mt-1">$15,900</div>
                            </div>
                            <div className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-1 rounded-lg text-sm">
                                <ArrowUpRight size={16} /> +24%
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#525252" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    {/* Floating Badge */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-6 -right-6 p-4 bg-[#0F0F12] border border-white/10 rounded-xl shadow-2xl flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <Zap size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-white">AI Just Closed</div>
                            <div className="text-xs text-gray-400">TechCorp Inc • $5k Deal</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AnalyticsPreview;
