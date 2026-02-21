import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../services/analyticsService';
import {
    DollarSign, Users, Zap, TrendingUp,
    ArrowRight, Activity, Calendar
} from 'lucide-react';
import KPICard from '../components/dashboard/KPICard';
import FunnelChart from '../components/dashboard/FunnelChart';
import RevenueChart from '../components/dashboard/RevenueChart';
import AIPerformance from '../components/dashboard/AIPerformance';
import LeadFeed from '../components/dashboard/LeadFeed';
import { getUser } from '../services/authService';
import { initSocket, subscribeToAnalytics, unsubscribeFromAnalytics } from '../services/socketService';

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d'); // Global time range
    const user = getUser();

    // Initialize Socket
    useEffect(() => {
        if (user?.business?._id) {
            initSocket(user.business._id);
        }
    }, [user?.business?._id]);

    const fetchAnalytics = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const data = await getAnalytics(timeRange);
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();

        const handleAnalyticsUpdate = () => {
            console.log("📈 Analytics update received via Socket");
            fetchAnalytics(false); // Update in background
        };

        subscribeToAnalytics(handleAnalyticsUpdate);
        return () => unsubscribeFromAnalytics(handleAnalyticsUpdate);
    }, [timeRange]); // Refetch when timeRange changes

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-purple/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-purple rounded-full animate-spin border-t-transparent"></div>
            </div>
        </div>
    );

    // Prepare chart data
    const funnelChartData = analytics?.funnel ? Object.keys(analytics.funnel).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: analytics.funnel[key]
    })) : [];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0);
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 p-1">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                        CEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-blue">Cockpit</span>
                    </h1>
                    <p className="text-muted font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Business Intelligence for <span className="text-white font-bold">{user?.business?.name || 'Arlo'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-md relative z-50">
                    {['Today', '7D', '30D'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === range
                                ? 'bg-surface-highlight text-white shadow-inner-white'
                                : 'text-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <button
                        className="p-2 text-muted hover:text-white transition-colors relative group"
                        title="Custom Range"
                    >
                        <Calendar size={16} />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">Custom</span>
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <KPICard
                    title="Pipeline Value"
                    value={formatCurrency(analytics?.potentialRevenue)}
                    icon={DollarSign}
                    color="purple"
                    delay={0}
                    description="Total potential revenue from all active qualified leads."
                />
                <KPICard
                    title="Total Leads"
                    value={analytics?.aiPerformance?.totalLeads}
                    icon={Users}
                    color="blue"
                    delay={1}
                    description="Total number of leads captured in the current period."
                />
                <KPICard
                    title="Revenue"
                    value={formatCurrency(analytics?.generatedRevenue)}
                    icon={Activity}
                    color="green"
                    delay={2}
                    description="Actual revenue closed and collected this month."
                />
                <KPICard
                    title="AI Actions (24h)"
                    value={analytics?.aiActions}
                    icon={Zap}
                    color="pink"
                    delay={3}
                    description="Total autonomous actions (emails, SMS) performed by AI today."
                />
                <KPICard
                    title="Time Saved"
                    value={`${analytics?.timeSaved || 0}h`}
                    icon={TrendingUp}
                    subtext={analytics?.timeSaved > 0 ? `Equivalent to ${Math.round(analytics.timeSaved / 40)} FTEs` : "Start automating leads"}
                    delay={4}
                    description="Estimated hours saved by AI automation vs manual work."
                />
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[400px]">
                {/* Visual Funnel - Leans visual */}
                <div className="lg:col-span-4 h-full">
                    <FunnelChart data={funnelChartData} />
                </div>

                {/* Revenue & Growth - Interactive */}
                <div className="lg:col-span-8 h-full">
                    <RevenueChart data={analytics?.revenueHistory} />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[350px]">
                <div className="lg:col-span-5 h-full">
                    <AIPerformance data={{ ...analytics?.aiPerformance, resilienceLeads: analytics?.resilienceLeads }} />
                </div>
                <div className="lg:col-span-7 h-full">
                    <LeadFeed leads={analytics?.recentLeads} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
