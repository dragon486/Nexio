import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Activity, Users, DollarSign, Zap, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { User, Clock, Star } from 'lucide-react';

// Mock Data
const stats = {
    stats: { potentialRevenue: 124500, aiActions: 842 },
    aiPerformance: { totalLeads: 1204, avgScore: 92 },
    recentLeads: [
        { _id: '1', name: 'Sarah Miller', status: 'qualified', aiScore: 95, aiPriority: 'high', createdAt: new Date().toISOString() },
        { _id: '2', name: 'TechCorp Inc.', status: 'contacted', aiScore: 88, aiPriority: 'medium', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { _id: '3', name: 'John Doe', status: 'new', aiScore: 45, aiPriority: 'low', createdAt: new Date(Date.now() - 7200000).toISOString() },
        { _id: '4', name: 'Acme Solutions', status: 'qualified', aiScore: 98, aiPriority: 'high', createdAt: new Date(Date.now() - 10800000).toISOString() },
    ],
    funnel: { new: 1204, contacted: 856, qualified: 432, converted: 145 }
};

const funnelData = [
    { name: 'New', count: 1204 },
    { name: 'Contacted', count: 856 },
    { name: 'Qualified', count: 432 },
    { name: 'Converted', count: 145 },
];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0);
};

const getConversion = (stage1, stage2) => {
    const c1 = stats.funnel[stage1];
    const c2 = stats.funnel[stage2];
    return Math.round((c2 / c1) * 100);
};

// Simplified LeadFeed for Preview (No Navigation)
const PreviewLeadFeed = ({ leads }) => {
    return (
        <div className="space-y-4">
            {leads.map((lead, index) => (
                <div
                    key={lead._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted border border-border"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${lead.aiPriority === 'high' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
                            <User size={18} />
                        </div>
                        <div>
                            <h4 className="font-medium text-foreground">{lead.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="capitalize">{lead.status}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={10} />
                                    Just now
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-lg">
                            <Star size={14} fill="currentColor" />
                            <span className="text-xs font-bold">{lead.aiScore}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const DashboardPreview = () => {
    return (
        <div className="p-6 bg-background dark:bg-[#0a0a0a] h-full overflow-hidden flex flex-col pointer-events-none select-none">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Overview</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Alex! Here's your business performance.</p>
            </div>

            {/* Money & Speed KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <GlassCard className="p-4 flex flex-col justify-between relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                        <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <span className="text-gray-400 text-xs font-medium">Pipeline Value</span>
                            <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-1 py-0.5 rounded mt-0.5 w-fit">
                                <TrendingUp size={8} /> +12%
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 mt-1">
                        <h2 className="text-2xl font-bold text-white">{formatCurrency(stats.stats.potentialRevenue)}</h2>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 flex flex-col justify-between relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <Zap size={20} />
                        </div>
                        <div>
                            <span className="text-gray-400 text-xs font-medium">AI Workload</span>
                            <div className="flex items-center gap-1 text-[10px] text-purple-400 bg-purple-500/10 px-1 py-0.5 rounded mt-0.5 w-fit">
                                <TrendingUp size={8} /> +5%
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 mt-1">
                        <h2 className="text-2xl font-bold text-white">{stats.stats.aiActions}</h2>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <Users size={20} />
                        </div>
                        <span className="text-muted-foreground text-xs font-medium">Total Leads</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{stats.aiPerformance.totalLeads}</h2>
                </GlassCard>

                <GlassCard className="p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Activity size={20} />
                        </div>
                        <span className="text-muted-foreground text-xs font-medium">Avg Score</span>
                    </div>
                    <div className="flex items-end gap-1">
                        <h2 className="text-2xl font-bold text-foreground">{Math.round(stats.aiPerformance.avgScore)}</h2>
                        <span className="text-muted-foreground text-xs mb-1">/ 100</span>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Main: Lead Funnel */}
                <GlassCard className="lg:col-span-2 p-4 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-foreground">Lead Funnel</h3>
                        <div className="flex gap-2 text-[10px]">
                            <div className="text-muted-foreground">New → Contacted: <span className="text-foreground font-bold">{getConversion('new', 'contacted')}%</span></div>
                            <div className="text-muted-foreground">Contacted → Qualified: <span className="text-foreground font-bold">{getConversion('contacted', 'qualified')}%</span></div>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={funnelData}>
                                <defs>
                                    <linearGradient id="colorFunnelPreview" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="var(--foreground)"
                                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                    cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorFunnelPreview)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Side: Real-time Feed */}
                <GlassCard className="p-0 overflow-hidden flex flex-col border border-border">
                    <div className="p-4 border-b border-border bg-muted/30">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Activity size={16} className="text-green-500 animate-pulse" /> Live Feed
                        </h3>
                    </div>
                    <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                        <PreviewLeadFeed leads={stats.recentLeads} />
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default DashboardPreview;
