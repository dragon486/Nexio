import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
    MessageSquare, Users, Bot, Zap, Send, CheckCircle2,
    TrendingUp, Activity, Megaphone, ArrowRight, AlertCircle, RefreshCw, Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import nexioLocalService from '../../services/nexio-localService';

const CATEGORY_ICONS = {
    gym: '🏋️', salon: '💇', restaurant: '🍕', retail: '🛒',
    clinic: '🏥', education: '🎓', hotel: '🏨', other: '🏪',
};

export default function NexioLocalDashboard() {
    const { business } = useOutletContext();
    const [conversations, setConversations] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [broadcast, setBroadcast] = useState({ message: '', target: 'all', sending: false, sent: false, error: '' });

    const fetchData = async (showRefresh = false) => {
        if (!business?._id) return;
        if (showRefresh) setRefreshing(true);
        try {
            const [convData, analyticsData] = await Promise.all([
                nexioLocalService.getConversations(business._id, { limit: 6 }),
                nexioLocalService.getAnalytics(business._id),
            ]);
            setConversations(convData.conversations || []);
            setAnalytics(analyticsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, [business]);

    const handleBroadcast = async () => {
        if (!broadcast.message.trim()) return;
        setBroadcast(p => ({ ...p, sending: true, error: '' }));
        try {
            await nexioLocalService.sendBroadcast(business._id, {
                message: broadcast.message, targetAudience: broadcast.target,
            });
            setBroadcast(p => ({ ...p, sending: false, sent: true, message: '' }));
            setTimeout(() => setBroadcast(p => ({ ...p, sent: false })), 3000);
        } catch (err) {
            setBroadcast(p => ({ ...p, sending: false, error: err.response?.data?.message || 'Failed to send.' }));
        }
    };

    const overview = analytics?.overview || {};
    const msgPct = overview.messagesIncluded > 0
        ? Math.min(100, Math.round((overview.messagesUsed / overview.messagesIncluded) * 100))
        : 0;

    const PLAN_RATE = { starter: '1.00', business: '0.75', enterprise: '0.50' };
    const currSymbol = { INR: '₹', USD: '$', EUR: '€', GBP: '£', SGD: 'S$', AED: 'AED ' }[business?.currency] || business?.currency || '';

    const statCards = [
        {
            label: 'Total Messages',
            value: overview.totalMessages?.toLocaleString() ?? '0',
            sub: `${overview.messagesUsed ?? 0} used this month`,
            icon: MessageSquare, accent: 'emerald',
        },
        {
            label: 'Customers',
            value: overview.totalCustomers?.toLocaleString() ?? '0',
            sub: `${overview.newCustomers ?? 0} new this month`,
            icon: Users, accent: 'blue',
        },
        {
            label: 'Bot Handled',
            value: `${overview.botHandledPercent ?? 0}%`,
            sub: `${overview.humanHandoffCount ?? 0} escalated to human`,
            icon: Bot, accent: 'violet',
        },
        {
            label: 'Bot Status',
            value: business?.whatsappConfig?.isActive ? 'Active' : 'Offline',
            sub: business?.whatsappConfig?.isActive ? 'Responding 24/7' : 'Set up WhatsApp to activate',
            icon: Zap, accent: business?.whatsappConfig?.isActive ? 'emerald' : 'amber',
        },
    ];

    const ACCENT_STYLES = {
        emerald: { icon: 'text-emerald-500', bg: 'bg-emerald-500/10', val: 'text-emerald-500' },
        blue:    { icon: 'text-blue-500',    bg: 'bg-blue-500/10',    val: 'text-blue-500' },
        violet:  { icon: 'text-violet-500',  bg: 'bg-violet-500/10',  val: 'text-violet-500' },
        amber:   { icon: 'text-amber-500',   bg: 'bg-amber-500/10',   val: 'text-amber-500' },
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
    );

    // ── Onboarding CTA if no WhatsApp configured ──
    const needsSetup = !business?.whatsappConfig?.phoneNumberId;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{CATEGORY_ICONS[business?.category] || '🏪'}</span>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{business?.name}</h1>
                        <p className="text-sm capitalize mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            {business?.category} · {business?.address?.city || 'No location set'} · <span className="uppercase font-semibold">{business?.plan}</span> plan
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className="p-2 rounded-lg border hover:bg-[var(--text-primary)]/5 transition-all"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    >
                        <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                    </button>
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold",
                        business?.whatsappConfig?.isActive
                            ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                            : "border-amber-500/30 text-amber-600 bg-amber-500/5"
                    )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full",
                            business?.whatsappConfig?.isActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                        )} />
                        {business?.whatsappConfig?.isActive ? 'Bot Live' : 'Setup Needed'}
                    </div>
                    <Link
                        to="/dashboard/nexio-local/bot"
                        className="p-2 rounded-lg border hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-all flex items-center gap-2 text-xs font-semibold shadow-sm"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    >
                        <Settings size={15} />
                        <span className="hidden sm:inline">Bot Settings</span>
                    </Link>
                </div>
            </div>

            {/* ── Setup Banner ── */}
            {needsSetup && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-md">
                    <AlertCircle size={18} className="text-amber-500 shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Your WhatsApp bot isn't connected yet
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            Connect your Meta Business number to start receiving and responding to messages automatically.
                        </p>
                    </div>
                    <Link
                        to="/dashboard/nexio-local/bot"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-400 transition-colors shrink-0"
                    >
                        Set Up Now <ArrowRight size={13} />
                    </Link>
                </div>
            )}

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => {
                    const st = ACCENT_STYLES[card.accent];
                    return (
                        <div key={card.label}
                            className="rounded-xl border p-5 transition-all hover:shadow-lg glass-noir hover:scale-[1.02]"
                            style={{ borderColor: 'var(--border)' }}
                        >
                            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-4", st.bg)}>
                                <card.icon size={17} className={st.icon} />
                            </div>
                            <div className={cn("text-2xl font-bold mb-0.5", st.val)}>{card.value}</div>
                            <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>{card.label}</div>
                            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            {/* ── Message Quota ── */}
            <div className="rounded-xl border p-5 glass-noir" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Monthly Message Quota</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {overview.messagesUsed ?? 0} / {overview.messagesIncluded ?? 500} used
                    </span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div
                        className={cn("h-full rounded-full transition-all duration-700",
                            msgPct > 85 ? "bg-red-500" : msgPct > 65 ? "bg-amber-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${msgPct}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                        {msgPct < 80 ? `${100 - msgPct}% remaining` : '⚠️ Running low — consider upgrading'}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                        Plan: <span className="font-semibold uppercase">{business?.plan}</span>
                    </span>
                </div>
            </div>

            {/* ── Two Column ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Conversations */}
                <div className="rounded-xl border overflow-hidden glass-noir" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2">
                            <Activity size={15} className="text-emerald-500" />
                            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Conversations</h3>
                        </div>
                        <Link to="/dashboard/nexio-local/customers" className="text-[11px] font-medium text-blue-500 hover:underline">
                            View all
                        </Link>
                    </div>

                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-12" style={{ color: 'var(--text-tertiary)' }}>
                            <MessageSquare size={28} className="opacity-30" />
                            <p className="text-xs font-medium">No conversations yet</p>
                            <p className="text-[11px]">Messages will appear once your bot is live</p>
                        </div>
                    ) : (
                        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                            {conversations.map((conv, i) => (
                                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[var(--text-primary)]/[0.02] transition-colors">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                                        style={{ background: '#3b82f6' }}
                                    >
                                        {(conv.customer?.name || conv.customerPhone)?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[12px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                                {conv.customer?.name || conv.customerPhone}
                                            </span>
                                            <span className="text-[10px] shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                                                {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                            {conv.content?.text}
                                        </p>
                                        <span className={cn(
                                            "inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded mt-1",
                                            conv.sender === 'bot' ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-500"
                                        )}>
                                            {conv.sender === 'bot' ? `🤖 ${conv.intent || 'bot'}` : '👤 customer'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Broadcast */}
                <div className="rounded-xl border overflow-hidden glass-noir" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                        <Megaphone size={15} className="text-violet-500" />
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Quick Broadcast</h3>
                    </div>

                    <div className="p-5 space-y-4">
                        {/* Audience */}
                        <div>
                            <label className="block text-[11px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Send to</label>
                            <select
                                value={broadcast.target}
                                onChange={e => setBroadcast(p => ({ ...p, target: e.target.value }))}
                                className="w-full text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                                style={{
                                    background: 'var(--bg-primary)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                <option value="all">All Customers</option>
                                <option value="active_members">Active Members</option>
                                <option value="expired_members">Expired Members</option>
                                <option value="new_customers">New Customers</option>
                                <option value="vip">VIP Customers</option>
                            </select>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-[11px] font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Message</label>
                            <textarea
                                rows={5}
                                value={broadcast.message}
                                onChange={e => setBroadcast(p => ({ ...p, message: e.target.value }))}
                                placeholder={'🎉 Special offer this weekend!\n\nGet 20% OFF — valid till Sunday.\n\nReply YES to claim.'}
                                className="w-full text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                                style={{
                                    background: 'var(--bg-primary)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--text-primary)',
                                }}
                            />
                            <div className="flex justify-between mt-1">
                                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                                    Cost: {currSymbol}{PLAN_RATE[business?.plan] || '1.00'}/message
                                </span>
                                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                                    {broadcast.message.length}/1024
                                </span>
                            </div>
                        </div>

                        {broadcast.error && (
                            <p className="text-xs text-red-500">{broadcast.error}</p>
                        )}

                        <button
                            onClick={handleBroadcast}
                            disabled={broadcast.sending || broadcast.sent || !broadcast.message.trim()}
                            className={cn(
                                "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                                broadcast.sent
                                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                                    : "bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed"
                            )}
                        >
                            {broadcast.sent ? <><CheckCircle2 size={15} /> Sent!</>
                                : broadcast.sending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                                : <><Send size={15} /> Send to {broadcast.target === 'all' ? 'All Customers' : broadcast.target.replace('_', ' ')}</>}
                        </button>

                        <Link to="/dashboard/nexio-local/broadcasts" className="flex items-center justify-center gap-1 text-xs text-blue-500 hover:underline mt-1">
                            View campaign history <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Intent Breakdown ── */}
            {analytics?.intentBreakdown?.length > 0 && (
                <div className="rounded-xl border p-5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Top Customer Questions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {analytics.intentBreakdown.map((item, i) => {
                            const ICONS = { pricing: '💰', booking: '📅', location: '📍', hours: '⏰', services: '✨', contact: '📞', greeting: '👋', other: '💬' };
                            return (
                                <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}>
                                    <span className="text-lg">{ICONS[item.intent] || '💬'}</span>
                                    <div>
                                        <div className="text-[12px] font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>{item.intent}</div>
                                        <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{item.count} times</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
