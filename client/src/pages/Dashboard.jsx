import React, { useEffect, useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { getAnalytics } from '../services/analyticsService';
import { Activity, Users, DollarSign, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import LeadFeed from '../components/LeadFeed';
import { getUser } from '../services/authService';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = getUser();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAnalytics();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-white">Loading dashboard...</div>;

    const funnelData = stats?.funnel ? Object.keys(stats.funnel).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        count: stats.funnel[key]
    })) : [];

    const priorityData = [
        { name: 'High', value: stats?.aiPerformance?.highPriority || 0, color: '#10B981' }, // Green
        { name: 'Medium', value: stats?.aiPerformance?.midPriority || 0, color: '#F59E0B' }, // Yellow
        { name: 'Low', value: stats?.aiPerformance?.lowPriority || 0, color: '#6B7280' }, // Gray
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0);
    };

    // Calculate Funnel Drop-offs
    const getConversion = (stage1, stage2) => {
        const c1 = stats?.funnel?.[stage1] || 0;
        const c2 = stats?.funnel?.[stage2] || 0;
        if (c1 === 0) return 0;
        return Math.round((c2 / c1) * 100);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Overview</h1>
                <p className="text-gray-400">Welcome back! Here's your business performance.</p>
            </div>

            {/* Money & Speed KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] bg-green-500/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500" />
                    <div className="flex items-center gap-4 mb-2 relative z-10">
                        <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <span className="text-gray-400 text-sm font-medium">Pipeline Value</span>
                            <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded mt-1 w-fit">
                                <TrendingUp size={10} /> +12% this week
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 mt-2">
                        <h2 className="text-3xl font-bold text-white">{formatCurrency(stats?.stats?.potentialRevenue)}</h2>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] bg-purple-500/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />
                    <div className="flex items-center gap-4 mb-2 relative z-10">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                            <Zap size={24} />
                        </div>
                        <div>
                            <span className="text-gray-400 text-sm font-medium">AI Workload</span>
                            <div className="flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded mt-1 w-fit">
                                <TrendingUp size={10} /> +5% today
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 mt-2">
                        <h2 className="text-3xl font-bold text-white">{stats?.stats?.aiActions || 0}</h2>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                            <Users size={24} />
                        </div>
                        <span className="text-gray-400 text-sm font-medium">Total Leads</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{stats?.aiPerformance?.totalLeads || 0}</h2>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                            <Activity size={24} />
                        </div>
                        <span className="text-gray-400 text-sm font-medium">Avg Score</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h2 className="text-3xl font-bold text-white">{Math.round(stats?.aiPerformance?.avgScore || 0)}</h2>
                        <span className="text-gray-500 mb-1">/ 100</span>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main: Lead Funnel */}
                <GlassCard className="lg:col-span-2 p-6 min-h-[400px]">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-white">Lead Funnel</h3>
                        <div className="flex gap-4 text-xs">
                            <div className="text-gray-400">New → Contacted: <span className="text-white font-bold">{getConversion('new', 'contacted')}%</span></div>
                            <div className="text-gray-400">Contacted → Qualified: <span className="text-white font-bold">{getConversion('contacted', 'qualified')}%</span></div>
                            <div className="text-gray-400">Qualified → Converted: <span className="text-white font-bold">{getConversion('qualified', 'converted')}%</span></div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={funnelData}>
                                <defs>
                                    <linearGradient id="colorFunnel" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="#525252"
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#525252"
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorFunnel)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Side: Real-time Feed */}
                <GlassCard className="p-0 overflow-hidden flex flex-col h-[400px]">
                    <div className="p-6 border-b border-white/5 bg-white/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity size={20} className="text-green-400 animate-pulse" /> Live Feed
                        </h3>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        <LeadFeed leads={stats?.recentLeads} />
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Dashboard;
