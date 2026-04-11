import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    TrendingUp, TrendingDown, ChevronRight, Plus, Filter, Download,
    Info, Shield, Database, DollarSign, Users, Zap, BarChart2,
    Bell, ArrowUpRight, Smartphone, Globe, Target, Clock,
    CheckCircle, Star, Activity, RefreshCw
} from 'lucide-react';
import { getAnalytics } from '../services/analyticsService';
import { getUser, logout } from '../services/authService';
import api from '../services/api';
import PlatformExecutiveView from '../components/admin/PlatformExecutiveView';
import useIsMobile from '../hooks/useIsMobile';
import { cn } from '../lib/utils';
import {
    SalesGauge, MonthlyBarChart, Heatmap, DonutChart, Sparkline
} from '../components/ui/OrbitCharts';

/* ─── Helpers ─────────────────────────────── */
const fmtCurrency = (v) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0);
const fmtNumber = (v) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v || 0);
const fmtPercent = (v) => `${(v || 0).toFixed(1)}%`;

/* ─── Mock fallback data ─────────────────── */
const MOCK = {
    roi: {
        aiGeneratedRevenue: 24064,
        manualRevenue: 6200,
        hotLeadsToday: 24,
        leadsQualified: 2355,
        aiConversionRate: 12.5,
        manualConversionRate: 7,
        avgResponseTimeSeconds: 3,
        sentimentScore: 82,
        requiresReview: 12,
        newLeadsToday: 18,
        responseRate: 94,
    },
    potentialRevenue: 15490,
    revenueHistory: [
        { revenue: 1800, convRate: 6.2 },
        { revenue: 2200, convRate: 7.1 },
        { revenue: 1600, convRate: 5.8 },
        { revenue: 2800, convRate: 8.3 },
        { revenue: 2100, convRate: 7.5 },
        { revenue: 2766, convRate: 8.7 },
        { revenue: 0, convRate: 0 },
        { revenue: 0, convRate: 0 },
        { revenue: 0, convRate: 0 },
        { revenue: 0, convRate: 0 },
        { revenue: 0, convRate: 0 },
        { revenue: 0, convRate: 0 },
    ],
    recentLeads: [
        { _id: '1', name: 'Elite Fitness Pro',  status: 'new',       dealSize: 4200,  aiScore: 95 },
        { _id: '2', name: 'Serenity Spa & Salon', status: 'qualified', dealSize: 2800,  aiScore: 88 },
        { _id: '3', name: 'The Gourmet Kitchen', status: 'contacted', dealSize: 1950,  aiScore: 79 },
        { _id: '4', name: 'Urban Retail Hub',   status: 'new',       dealSize: 12400, aiScore: 97 },
    ],
    mobileVisits: 115132,
    webVisits: 76754,
    totalVisitsLastMonth: 176540,
};

const SUCCESS_CHECK = (
    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-in zoom-in duration-300">
        <CheckCircle size={24} strokeWidth={3} />
    </div>
);

/* ─── Sub-components ────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        new:       'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
        qualified: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
        contacted: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
        converted: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
    };
    return (
        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize', map[status] || map.new)}>
            {status}
        </span>
    );
};

const Trend = ({ value, good = true }) => {
    const positive = good ? value >= 0 : value <= 0;
    return (
        <span className={cn('inline-flex items-center gap-0.5 text-[11px] font-semibold', positive ? 'text-emerald-500' : 'text-red-400')}>
            {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {value > 0 ? '+' : ''}{value}%
        </span>
    );
};

/* ═══════════════════════════════════════════
   MOBILE DASHBOARD — Financial App Style
═══════════════════════════════════════════ */
const MobileDashboard = ({ 
    d, isReal, navigate, user, 
    activeWidgets, setIsAddingWidget 
}) => {
    const total = (d?.roi?.aiGeneratedRevenue || 0) + (d?.roi?.manualRevenue || 0);
    const todayLeads = d?.roi?.newLeadsToday || d?.roi?.hotLeadsToday || 0;
    const convRate = d?.roi?.aiConversionRate || 0;
    const responseRate = d?.roi?.responseRate || 94;

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="mobile-dashboard flex flex-col gap-4 pb-6">

            {/* Greeting header */}
            <div className="flex items-center justify-between px-1 pt-2">
                <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] opacity-70 italic">{today}</p>
                    <h2 className="text-2xl font-black text-[#12131a] leading-none mt-2 uppercase italic tracking-tighter">
                        {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
                    </h2>
                </div>
                <Link to="/dashboard/notifications"
                    className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-[#12131a] text-white shadow-lg shadow-black/10">
                    <Bell size={20} />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#12131a]" />
                </Link>
            </div>

            {/* Hero — Noir balance card */}
            {activeWidgets.includes('rev') && (
                <div className="relative rounded-[32px] bg-[#12131a] text-white p-6 overflow-hidden shadow-2xl border border-white/5">
                    {/* Decorative orbs */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Consolidated Revenue</p>
                        </div>
                        <div className="text-4xl font-black tracking-tight mb-6 italic leading-none">{fmtCurrency(total)}</div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">AI Generated</p>
                                </div>
                                <p className="text-xl font-black italic">{fmtCurrency(d?.roi?.aiGeneratedRevenue)}</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Manual</p>
                                </div>
                                <p className="text-xl font-black italic">{fmtCurrency(d?.roi?.manualRevenue)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Stats row */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { id: 'usr', label: 'New Leads',        value: todayLeads,               icon: Users,       color: 'text-blue-500',   trend: 14 },
                    { id: 'fun', label: 'Conversion',       value: fmtPercent(convRate),     icon: Target,      color: 'text-violet-500', trend: 2  },
                    { id: 'bot', label: 'Response Rate',      value: `${responseRate}%`,        icon: Zap,         color: 'text-emerald-500', trend: 5 },
                    { id: 'cmp', label: 'Projected',        value: fmtCurrency(d?.potentialRevenue), icon: BarChart2, color: 'text-amber-500', trend: 9 },
                ].filter(item => activeWidgets.includes(item.id)).map((item, i) => (
                    <div key={i} className="bg-[#12131a] border border-white/5 rounded-3xl p-5 shadow-xl transition-all hover:translate-y-[-1px]">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-white/5')}>
                            <item.icon size={18} className={item.color} />
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">{item.label}</p>
                        <p className="text-xl font-black text-white italic leading-none">{item.value}</p>
                        <div className="mt-2">
                            <Trend value={item.trend} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity — Noir Card */}
            {activeWidgets.includes('usr') && (
                <div className="bg-[#12131a] rounded-[32px] p-6 shadow-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Recent Leads</span>
                        <Link to="/dashboard/leads" className="text-[100px] font-black text-blue-500 uppercase tracking-widest">View All →</Link>
                    </div>
                    <div className="space-y-4">
                        {(d?.recentLeads || []).slice(0, 3).map(lead => (
                            <div
                                key={lead._id}
                                className="flex items-center gap-4 cursor-pointer group"
                                onClick={() => navigate(`/dashboard/leads/${lead._id}`)}
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 text-[18px] font-black shrink-0 transition-transform group-hover:scale-105">
                                    {lead.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[15px] font-black text-white italic truncate group-hover:text-blue-400 transition-colors uppercase leading-none mb-1.5">{lead.name}</p>
                                    <div className="flex items-center gap-2">
                                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sync: {lead.aiScore}%</p>
                                    </div>
                                </div>
                                <StatusBadge status={lead.status} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Performance */}
            {activeWidgets.includes('bot') && (
                <div className="card !p-4 !shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold opacity-90">AI Performance</span>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">OPTIMAL</span>
                    </div>
                    <SalesGauge value={d?.roi?.sentimentScore || 82} max={100} size={160} label="of 100 pts" />
                    <p className="text-[11px] text-center opacity-50 mt-2">
                        Agent running 2,700× faster than manual response
                    </p>
                    <Link to="/dashboard/analytics"
                        className="flex items-center justify-center gap-1 mt-3 text-[12px] font-semibold text-blue-500">
                        Full Analytics <ChevronRight size={13} />
                    </Link>
                </div>
            )}

            {/* Quick Actions — Noir Grid */}
            <div className="bg-[#12131a] rounded-[32px] p-6 shadow-2xl border border-white/5">
                <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-5 italic">Quick Hub</p>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Add Lead',   icon: Plus,        path: '/dashboard/leads',    color: 'text-blue-400' },
                        { label: 'Pipeline',   icon: Activity,    path: '/dashboard/pipeline', color: 'text-violet-400' },
                        { label: 'Analytics',  icon: BarChart2,   path: '/dashboard/analytics',color: 'text-amber-400' },
                    ].map((a, i) => (
                        <Link key={i} to={a.path}
                            className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-white/10 active:scale-95 group">
                            <a.icon size={22} className={cn(a.color, "transition-transform group-hover:scale-110")} />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">{a.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

/* ═══════════════════════════════════════════
   DESKTOP DASHBOARD — Uxerflow Style
═══════════════════════════════════════════ */
const DesktopDashboard = ({ 
    d, navigate, user, fetchData, 
    isAddingWidget, setIsAddingWidget, 
    activeWidgets, setActiveWidgets,
    isSavingLayout, setIsSavingLayout, 
    showSaveSuccess, setShowSaveSuccess 
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [filterText, setFilterText] = useState('');
    const [exporting, setExporting] = useState(false);
    
    const currentMonth = new Date().getMonth();
    const totalVisits = (d?.mobileVisits || 0) + (d?.webVisits || 0);
    const visitTrend = 8.5;

    const handleExport = () => {
        setExporting(true);
        try {
            const headers = ['Name', 'Status', 'AI Score', 'Value'];
            const rows = (d?.recentLeads || []).map(l => [l.name, l.status, l.aiScore + '%', '$' + l.dealSize]);
            const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `NEXIO_Report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error("Export failed", e);
        } finally {
            setTimeout(() => setExporting(false), 1000);
        }
    };

    const filteredLeads = useMemo(() => {
        if (!filterText) return d?.recentLeads || [];
        return (d?.recentLeads || []).filter(l => 
            l.name.toLowerCase().includes(filterText.toLowerCase()) || 
            l.status.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [d?.recentLeads, filterText]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', { 
            style: 'currency', 
            currency: 'INR', 
            maximumFractionDigits: 0 
        }).format(val || 0);
    };

    const statCards = useMemo(() => [
        {
            id: 'rev', label: 'AI Generated Revenue',
            value: formatCurrency(d?.roi?.aiGeneratedRevenue), trend: 12,
            sparkData: [4,6,5,8,7,9,10,12], link: '/dashboard/analytics', accent: '#3b82f6',
        },
        {
            id: 'fun', label: 'Pipeline Potential',
            value: formatCurrency(d?.potentialRevenue), trend: 9,
            sparkData: [3,5,4,6,5,7,8,9], link: '/dashboard/pipeline', accent: '#10b981',
        },
        {
            id: 'usr', label: 'Leads Qualified',
            value: fmtNumber(d?.roi?.leadsQualified), trend: 7,
            sparkData: [6,5,7,6,8,9,8,10], link: '/dashboard/leads', accent: '#8b5cf6',
        },
        {
            id: 'fun', label: 'Conversion Rate',
            value: fmtPercent(d?.roi?.aiConversionRate), trend: 2,
            sparkData: [4,3,5,4,6,5,7,8], link: '/dashboard/analytics', accent: '#f59e0b',
        },
    ].filter(c => activeWidgets.includes(c.id)), [d, activeWidgets]);

    return (
        <div className="space-y-5">
            {/* Tab nav + actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-1 bg-[#12131a] rounded-2xl p-1.5 shadow-xl border border-black/5">
                    {['overview', 'sales', 'leads'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={cn('px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all',
                                activeTab === tab
                                    ? 'bg-white/10 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-white'
                            )}>
                            {tab}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-white/10 mx-2" />
                    <button onClick={() => setIsAddingWidget(true)}
                        className="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">
                        <Plus size={14} className="stroke-[3]" /> Add Widget
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter leads..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm uppercase tracking-widest w-48"
                        />
                    </div>
                    <button onClick={handleExport} disabled={exporting}
                        className="flex items-center gap-2 px-6 py-3 bg-[#12131a] text-white rounded-2xl text-[11px] font-black hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest disabled:opacity-50">
                        {exporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />} 
                        {exporting ? 'Exporting...' : 'Export Report'}
                    </button>
                </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map(card => (
                    <div key={card.id} className="stat-card group">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-1.5 text-[12px] font-medium opacity-50 mb-2">
                                    {card.label} <Info size={12} className="opacity-30" />
                                </div>
                                <div className="text-2xl md:text-3xl font-bold tracking-tight">
                                    {card.value}
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-[11px] opacity-40">
                                    vs last month <Trend value={card.trend} />
                                </div>
                            </div>
                            <div className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                <Sparkline data={card.sparkData} color={card.accent} height={40} width={72} />
                            </div>
                        </div>
                        <Link to={card.link}
                            className="flex items-center gap-1 text-[12px] font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors mt-2 pt-3 border-t border-[var(--border)]">
                            See Details <ChevronRight size={13} />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Row 2: Gauge + Bar Chart */}
            {(activeWidgets.includes('fun') || activeWidgets.includes('rev')) && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {activeWidgets.includes('fun') && (
                        <div className={cn("section-card", activeWidgets.includes('rev') ? "lg:col-span-2" : "lg:col-span-5")}>
                            <div className="flex items-center gap-2 text-[13px] font-semibold mb-4">
                                Sales Performance <Info size={13} className="opacity-30" />
                            </div>
                            <SalesGauge value={d?.roi?.sentimentScore || 82} max={100} size={220} label="of 100 points" />
                            <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/15 rounded-xl">
                                <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 mb-1">Your team is great! ✨</p>
                                <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">
                                    The AI Agent is meeting or exceeding targets in several areas.
                                </p>
                            </div>
                            <Link to="/dashboard/analytics" className="flex items-center gap-1 mt-4 text-[12px] font-semibold text-blue-500 hover:underline">
                                Improve Your Score <ChevronRight size={13} />
                            </Link>
                        </div>
                    )}

                    {activeWidgets.includes('rev') && (
                        <div className={cn("section-card", activeWidgets.includes('fun') ? "lg:col-span-3" : "lg:col-span-5")}>
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-800 dark:text-gray-100">
                                    Analytics <Info size={13} className="text-gray-300 dark:text-gray-600" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--border)] rounded-lg text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                        <Filter size={11} /> Filter
                                    </button>
                                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--border)] rounded-lg text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                        Last Year ▾
                                    </button>
                                </div>
                            </div>
                            <MonthlyBarChart data={d?.revenueHistory || []} currentMonth={currentMonth} />
                        </div>
                    )}
                </div>
            )}

            {/* Row 3: Heatmap + Donut */}
            {activeWidgets.includes('geo') && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <div className="section-card lg:col-span-3">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">Visit by Time</span>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                <span>0</span>
                                {['bg-blue-100','bg-blue-200','bg-blue-400','bg-blue-600'].map((c,i) => (
                                    <span key={i} className={cn('w-4 h-3 rounded-sm', c)} />
                                ))}
                                <span>10,000+</span>
                            </div>
                        </div>
                        <Heatmap />
                    </div>

                    <div className="section-card lg:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">
                                Total Visits <Info size={12} className="inline ml-1 text-gray-300 dark:text-gray-600" />
                            </span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    {fmtNumber(totalVisits)}
                                </div>
                                <div className="mt-1 text-[11px] text-gray-400 flex items-center gap-1.5">
                                    vs last month <Trend value={visitTrend} />
                                </div>
                                <div className="mt-5 space-y-2.5">
                                    {[
                                        { label: 'Mobile',  value: d?.mobileVisits || 115132, color: '#0066ff' },
                                        { label: 'Website', value: d?.webVisits   || 76754,   color: '#e5e7eb' },
                                    ].map(seg => (
                                        <div key={seg.label} className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                                            <span className="text-[12px] text-gray-500 dark:text-gray-400 flex-1">{seg.label}</span>
                                            <span className="text-[12px] font-semibold text-gray-800 dark:text-gray-200">{fmtNumber(seg.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <DonutChart size={130} segments={[
                                    { value: d?.mobileVisits || 115132, color: '#0066ff' },
                                    { value: d?.webVisits   || 76754,  color: '#e5e7eb' },
                                ]} />
                                <div className="absolute top-2 right-2 text-[10px] font-bold text-gray-500">40%</div>
                                <div className="absolute bottom-4 right-0 text-[10px] font-bold text-gray-500">60%</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Row 4: Recent Leads */}
            {activeWidgets.includes('usr') && (
                <div className="section-card">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">High-Intent Leads</span>
                        <Link to="/dashboard/leads" className="text-[12px] font-semibold text-blue-500 hover:underline flex items-center gap-0.5">
                            View All <ChevronRight size={13} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[var(--border)]">
                                    {['Name','Status','AI Score','Est. Value',''].map(h => (
                                        <th key={h} className="pb-2.5 text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider pr-4 last:pr-0">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-subtle)]">
                                {filteredLeads.map(lead => (
                                    <tr key={lead._id || lead.id}
                                        className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                                        onClick={() => navigate(`/dashboard/leads/${lead._id || lead.id}`)}>
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                                    {lead.name?.charAt(0)}
                                                </div>
                                                <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                                                    {lead.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4"><StatusBadge status={lead.status} /></td>
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full bg-blue-500 transition-all duration-700"
                                                        style={{ width: `${lead.aiScore || 0}%` }} />
                                                </div>
                                                <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">{lead.aiScore}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">{fmtCurrency(lead.dealSize)}</span>
                                        </td>
                                        <td className="py-3">
                                            <ChevronRight size={15} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════ */
const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [adminData, setAdminData] = useState({ status: null, clients: [] });
    const [loading, setLoading]     = useState(true);
    const [isAddingWidget, setIsAddingWidget] = useState(false);
    const [activeWidgets, setActiveWidgets] = useState(() => {
        const saved = localStorage.getItem('nexio_active_widgets');
        return saved ? JSON.parse(saved) : ['rev', 'fun', 'bot'];
    });
    const [isSavingLayout, setIsSavingLayout] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [impersonating]           = useState(localStorage.getItem('impersonationToken'));
    const isMobile                  = useIsMobile();
    const navigate                  = useNavigate();
    const user                      = getUser();
    const isAdmin                   = user?.email === 'adelmuhammed786@gmail.com' && !impersonating;

    const fetchData = async () => {
        setLoading(true);
        try {
            if (isAdmin) {
                const [statusRes, usersRes] = await Promise.all([
                    api.get('/admin/system-status'),
                    api.get('/admin/users'),
                ]);
                setAdminData({ status: statusRes.data, clients: usersRes.data });
            } else {
                const data = await getAnalytics();
                setAnalytics(data);
            }
        } catch (err) {
            console.error('Dashboard fetch error', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchData(); 
        const handleOpen = () => setIsAddingWidget(true);
        window.addEventListener('open-widget-manager', handleOpen);
        return () => window.removeEventListener('open-widget-manager', handleOpen);
    }, [isAdmin]);

    // Persist widget selections
    useEffect(() => {
        localStorage.setItem('nexio_active_widgets', JSON.stringify(activeWidgets));
    }, [activeWidgets]);

    const isReal = analytics && analytics.isDemo === false;
    const d = isReal ? analytics : MOCK;

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-100 dark:border-white/10 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">Loading dashboard...</span>
            </div>
        </div>
    );

    if (isAdmin) return (
        <div className="p-4 md:p-8">
            <PlatformExecutiveView
                status={adminData.status}
                clients={adminData.clients}
                onImpersonate={async (clientId) => {
                    try {
                        const { data } = await api.post(`/admin/impersonate/${clientId}`);
                        localStorage.setItem('adminToken', localStorage.getItem('token'));
                        localStorage.setItem('adminUser', localStorage.getItem('user'));
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        localStorage.setItem('impersonationToken', data.token);
                        window.location.reload();
                    } catch (err) { console.error('Impersonation failed', err); }
                }}
                onDeleteClient={async (id, name) => {
                    if (window.confirm(`Delete client ${name}?`)) {
                        await api.delete(`/admin/users/${id}`);
                        fetchData();
                    }
                }}
            />
        </div>
    );

    return (
        <div className={cn('p-4', !isMobile && 'md:p-6 lg:p-8 max-w-[1400px] mx-auto')}>
            {!isReal && !isMobile && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl text-[12px] mb-5">
                    <Database size={14} className="text-blue-500 shrink-0" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Demo Mode — showing projected data.</span>
                </div>
            )}

            {impersonating && (
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-blue-600 rounded-xl text-white text-[12px] mb-5">
                    <div className="flex items-center gap-2">
                        <Shield size={14} className="animate-pulse" />
                        <span className="font-semibold">Support session active — viewing {user?.name}'s account</span>
                    </div>
                    <button onClick={() => {
                        localStorage.setItem('token', localStorage.getItem('adminToken'));
                        localStorage.setItem('user', localStorage.getItem('adminUser'));
                        ['adminToken','adminUser','impersonationToken'].forEach(k => localStorage.removeItem(k));
                        window.location.reload();
                    }} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all">
                        Exit
                    </button>
                </div>
            )}

            {isMobile
                ? <MobileDashboard 
                    d={d} isReal={isReal} navigate={navigate} user={user} 
                    activeWidgets={activeWidgets} setIsAddingWidget={setIsAddingWidget}
                  />
                : <DesktopDashboard 
                    d={d} navigate={navigate} user={user} fetchData={fetchData} 
                    isAddingWidget={isAddingWidget} setIsAddingWidget={setIsAddingWidget}
                    activeWidgets={activeWidgets} setActiveWidgets={setActiveWidgets}
                    isSavingLayout={isSavingLayout} setIsSavingLayout={setIsSavingLayout}
                    showSaveSuccess={showSaveSuccess} setShowSaveSuccess={setShowSaveSuccess}
                  />
            }

            {/* Global Widget Overlay */}
            {isAddingWidget && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[32px] w-full max-w-xl p-8 shadow-2xl relative">
                        <button onClick={() => setIsAddingWidget(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <Plus className="rotate-45" size={24} />
                        </button>
                        <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">Customize Workspace</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Select modules to pin to your active dashboard.</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'rev', label: 'Revenue Forecast' },
                                { id: 'fun', label: 'Funnel Metrics' },
                                { id: 'geo', label: 'Geographic Sync' },
                                { id: 'bot', label: 'Bot Performance' },
                                { id: 'cmp', label: 'Campaign ROI' },
                                { id: 'usr', label: 'Team Activity' },
                            ].map(w => {
                                const isActive = activeWidgets.includes(w.id);
                                return (
                                    <div key={w.id} 
                                        onClick={() => {
                                            setActiveWidgets(prev => 
                                                prev.includes(w.id) 
                                                    ? prev.filter(id => id !== w.id) 
                                                    : [...prev, w.id]
                                            );
                                        }}
                                        className={cn(
                                            "p-5 rounded-[24px] border-2 flex items-center gap-4 transition-all cursor-pointer select-none",
                                            isActive ? "border-blue-500 bg-blue-500/5 rotate-[0.5deg] shadow-lg shadow-blue-500/10" : "border-[var(--border)] hover:border-blue-500/30"
                                        )}
                                    >
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-gray-100 dark:bg-white/5 text-gray-400")}>
                                            <Zap size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-black italic uppercase leading-none mb-1">{w.label}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{isActive ? 'Active' : 'Add Module'}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <button 
                            onClick={async () => {
                                setIsSavingLayout(true);
                                await new Promise(r => setTimeout(r, 1500));
                                setIsSavingLayout(false);
                                setShowSaveSuccess(true);
                                await new Promise(r => setTimeout(r, 1000));
                                setShowSaveSuccess(false);
                                setIsAddingWidget(false);
                            }} 
                            disabled={isSavingLayout}
                            className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 italic"
                        >
                            {isSavingLayout ? (
                                <>
                                    <RefreshCw size={16} className="animate-spin" /> Syncing Node Layout...
                                </>
                            ) : showSaveSuccess ? (
                                <>
                                    <CheckCircle size={16} /> Configuration Saved
                                </>
                            ) : (
                                'Apply Dashboard Changes'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
