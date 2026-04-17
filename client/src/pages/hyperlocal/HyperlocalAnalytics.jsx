import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BarChart3, MessageSquare, Users, Bot, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts';
import { cn } from '../../lib/utils';
import nexioLocalService from '../../services/nexio-localService';

const INTENT_COLORS = {
    pricing: '#10b981', booking: '#3b82f6', location: '#f59e0b',
    hours: '#8b5cf6', services: '#06b6d4', contact: '#f87171',
    greeting: '#a78bfa', other: '#6b7280',
};

const INTENT_ICONS = {
    pricing: '💰', booking: '📅', location: '📍',
    hours: '⏰', services: '✨', contact: '📞',
    greeting: '👋', other: '💬',
};

export default function NexioLocalAnalytics() {
    const { business } = useOutletContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async (showRefresh = false) => {
        if (!business?._id) return;
        if (showRefresh) setRefreshing(true);
        try {
            const result = await nexioLocalService.getAnalytics(business._id);
            setData(result);
        } catch (err) { console.error(err); }
        finally { setLoading(false); setRefreshing(false); }
    }, [business?._id]);

    useEffect(() => { load(); }, [load]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-7 h-7 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );

    const overview = data?.overview || {};
    const daily = (data?.dailyMessages || []).map(d => ({ date: d.date, Messages: d.count }));
    const intents = data?.intentBreakdown || [];
    const bc = data?.broadcastStats || {};

    const msgPct = overview.messagesIncluded > 0
        ? Math.min(100, Math.round((overview.messagesUsed / overview.messagesIncluded) * 100))
        : 0;

    const kpis = [
        { label: 'Total Messages',  value: overview.totalMessages?.toLocaleString() ?? '0', icon: MessageSquare, accent: 'emerald', sub: `${overview.messagesUsed ?? 0} this month` },
        { label: 'Total Customers', value: overview.totalCustomers?.toLocaleString() ?? '0', icon: Users,          accent: 'blue',    sub: `${overview.newCustomers ?? 0} new` },
        { label: 'Bot Automation',  value: `${overview.botHandledPercent ?? 0}%`,            icon: Bot,            accent: 'violet',  sub: `${overview.humanHandoffCount ?? 0} handoffs` },
        { label: 'Broadcasts Sent', value: bc.totalSent?.toLocaleString() ?? '0',            icon: TrendingUp,     accent: 'amber',   sub: `${bc.totalRead ?? 0} read` },
    ];

    const ACCENT = {
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
        blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-500' },
        violet:  { bg: 'bg-violet-500/10',  text: 'text-violet-500' },
        amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-500' },
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="px-3 py-2 rounded-lg text-xs shadow-xl border glass-noir" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <div className="font-semibold mb-1">{label}</div>
                {payload.map((p, i) => (
                    <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <BarChart3 size={20} className="text-blue-500" /> Analytics
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Last 30 days · Real-time data</p>
                </div>
                <button onClick={() => load(true)} disabled={refreshing}
                    className="p-2 rounded-lg border hover:bg-[var(--text-primary)]/5 transition-all"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map(kpi => {
                    const ac = ACCENT[kpi.accent];
                    return (
                        <div key={kpi.label} className="rounded-xl border p-5 hover:shadow-lg transition-all glass-noir hover:scale-[1.02]"
                            style={{ borderColor: 'var(--border)' }}>
                            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-4", ac.bg)}>
                                <kpi.icon size={17} className={ac.text} />
                            </div>
                            <div className={cn("text-2xl font-bold mb-0.5", ac.text)}>{kpi.value}</div>
                            <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>{kpi.label}</div>
                            <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{kpi.sub}</div>
                        </div>
                    );
                })}
            </div>

            {/* Quota Bar */}
            <div className="rounded-xl border p-5 glass-noir" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between mb-3">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Monthly Quota</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {overview.messagesUsed ?? 0} / {overview.messagesIncluded ?? 500}
                    </span>
                </div>
                <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className={cn("h-full rounded-full transition-all duration-700",
                        msgPct > 85 ? "bg-red-500" : msgPct > 65 ? "bg-amber-500" : "bg-emerald-500"
                    )} style={{ width: `${msgPct}%` }} />
                </div>
                <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
                    {msgPct}% used · {msgPct < 80 ? `${100 - msgPct}% remaining` : 'Consider upgrading your plan'}
                </p>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Messages */}
                <div className="rounded-xl border p-5 glass-noir" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Activity size={14} className="text-emerald-500" />
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Message Volume (30 days)</h3>
                    </div>
                    {daily.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            No data yet — messages will appear here once your bot is active
                        </div>
                    ) : (
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={daily}>
                                    <defs>
                                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false}
                                        tickFormatter={v => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                                    <YAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="Messages" stroke="#10b981" strokeWidth={2} fill="url(#grad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Intent Breakdown */}
                <div className="rounded-xl border p-5 glass-noir" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Bot size={14} className="text-violet-500" />
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>What Customers Ask About</h3>
                    </div>
                    {intents.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            No intent data yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {intents.map((item, i) => {
                                const maxCount = Math.max(...intents.map(x => x.count));
                                const pct = Math.round((item.count / maxCount) * 100);
                                const color = INTENT_COLORS[item.intent] || '#6b7280';
                                return (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[12px] font-medium flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                                                {INTENT_ICONS[item.intent] || '💬'} <span className="capitalize">{item.intent}</span>
                                            </span>
                                            <span className="text-[11px] font-semibold" style={{ color }}>{item.count} times</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full" style={{ background: 'var(--border)' }}>
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, background: color }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Broadcast Stats */}
            <div className="rounded-xl border p-5 glass-noir" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Broadcast Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Total Sent',  value: bc.totalSent ?? 0,      color: 'text-blue-500' },
                        { label: 'Delivered',   value: bc.totalDelivered ?? 0, color: 'text-emerald-500' },
                        { label: 'Read',        value: bc.totalRead ?? 0,      color: 'text-violet-500' },
                    ].map(stat => (
                        <div key={stat.label} className="text-center py-4 rounded-xl border transition-all"
                            style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
                            <div className={cn("text-2xl font-bold mb-1", stat.color)}>{stat.value.toLocaleString()}</div>
                            <div className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
                {bc.totalSent > 0 && (
                    <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>
                        Delivery rate: {Math.round((bc.totalDelivered / bc.totalSent) * 100)}% ·
                        Read rate: {Math.round((bc.totalRead / bc.totalSent) * 100)}%
                    </p>
                )}
            </div>
        </div>
    );
}
