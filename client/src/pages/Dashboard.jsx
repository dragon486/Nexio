import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    DollarSign, Users, Zap, TrendingUp, TrendingDown,
    Activity, Calendar, Clock, CheckCircle, 
    ArrowUpRight, ArrowDownRight, BarChart2, Globe, Shield,
    Eye, Database, Info, ExternalLink
} from 'lucide-react';
import { getAnalytics } from '../services/analyticsService';
import { getUser } from '../services/authService';

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = getUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getAnalytics('7D');
                setAnalytics(data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    // 1. Mock Data for Preview Mode (High-Fidelity)
    const mockData = useMemo(() => ({
        roi: {
            aiGeneratedRevenue: 18400, // Matching the insight card
            hotLeadsToday: 18,
            autoRepliesSent: 142,
            leadsQualified: 86,
            avgResponseTimeSeconds: 3,
            aiConversionRate: 18,
            manualConversionRate: 7,
            manualAvgResponseTimeSeconds: 8100, // 2h 15m
            requiresReview: 12
        },
        potentialRevenue: 642000,
        aiPerformance: {
            totalLeads: 12400,
        },
        timeSaved: 23,
        resilienceLeads: 148,
        revenueHistory: [
            { date: 'MON', revenue: 45000 },
            { date: 'TUE', revenue: 62000 },
            { date: 'WED', revenue: 38000 },
            { date: 'THU', revenue: 78000 },
            { date: 'FRI', revenue: 55000 },
            { date: 'SAT', revenue: 88000 },
            { date: 'SUN', revenue: 95000 }
        ],
        recentLeads: [
            { id: 1, name: "Alpha Dynamics", status: "active", dealSize: 4200, type: 'conversion', title: 'Enterprise Deal Closed', desc: 'Alpha Dynamics • $4,200 MRR', icon: '$', time: '2m ago' },
            { id: 2, name: "Nebula Corp", status: "trial", dealSize: 2800, type: 'sync', title: 'WA Integration Sync', desc: 'Nebula Corp • 482 active threads', icon: 'W', time: '8m ago' },
            { id: 3, name: "Vertex Industries", status: "active", dealSize: 1950, type: 'upgrade', title: 'New Pro Upgrade', desc: 'Vertex Industries • $1,950 MRR', icon: '$', time: '15m ago' },
            { id: 4, name: "Quantum Systems", status: "active", dealSize: 12400, type: 'autonomous', title: 'AI Agent Autonomous Fix', desc: 'Redistributed 408 pending tickets', icon: 'A', time: '24m ago' }
        ]
    }), []);

    // 2. Hybrid Data Logic
    const isRealData = useMemo(() => {
        // Mode detection from backend: if isDemo is false, we have actual business data.
        return analytics && analytics.isDemo === false;
    }, [analytics]);

    const displayData = useMemo(() => {
        if (isRealData) return analytics;
        return mockData;
    }, [isRealData, analytics, mockData]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );
      const formatCurrency = (val) => {
        const num = Number(val);
        const safeVal = isNaN(num) ? 0 : num;
        const locale = displayData?.business?.locale || "en-US";
        const currency = displayData?.business?.currency || "USD";
        return new Intl.NumberFormat(locale, { 
            style: 'currency', 
            currency: currency, 
            maximumFractionDigits: 0 
        }).format(safeVal);
    };
    
    const formatTime = (seconds) => {
        const num = Number(seconds);
        const safeSeconds = isNaN(num) ? 0 : num;
        if (safeSeconds < 60) return `${safeSeconds}s`;
        const h = Math.floor(safeSeconds / 3600);
        const m = Math.floor((safeSeconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    // Auditor Logic: Strict MRR & ARR
    const currentMRR = (displayData?.roi?.aiGeneratedRevenue || 0) + (displayData?.roi?.manualRevenue || 0);

    // Dynamic Insight Logic (Auditor Fix)
    const renderInsight = () => {
        const revenue = displayData?.roi?.aiGeneratedRevenue || 0;
        const aiConverted = displayData?.roi?.aiConverted || 0; 
        
        if (!isRealData) return `"AI converted 12 high-value leads this week worth ${formatCurrency(18400)}"`;
        
        if (aiConverted === 0 || revenue === 0) return "No AI-driven conversions detected in this period.";
        
        return `"AI generated ${formatCurrency(revenue)} in revenue across ${aiConverted} converted opportunities."`;
    };

    return (
        <div className="content-area max-w-[1600px] mx-auto pb-20">
            {/* 🧪 Trust Banner (Only in Demo Mode) */}
            {!isRealData && analytics && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="bg-blue-500/5 backdrop-blur-3xl border border-blue-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner border border-blue-500/20 ring-4 ring-blue-500/5">
                                <Info size={24} />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-black text-foreground flex items-center gap-2 tracking-tight">
                                    Transparent Alpha Insight
                                    <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-black uppercase rounded-full shadow-lg shadow-blue-500/40">Demo Data</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed font-medium">
                                    This dashboard is displaying optimized sample metrics to demonstrate Arlo’s autonomous capabilities. 
                                    Your personal business data will synchronize automatically once you connect your first lead source.
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/dashboard/settings/integrations')}
                            className="px-6 py-3 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-3 shadow-xl active:scale-95 group/btn relative z-10"
                        >
                            Connect your data
                            <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            {/* Header with Mode Badge */}
            <div className="page-title-section flex justify-between items-end mb-10">
                <div>
                    <div className="executive-label tracking-[0.4em] mb-2">SYSTEM ARCHITECTURE: ALPHA</div>
                    <div className="flex items-center gap-4">
                        <h1 className="page-title text-5xl !mb-0 tracking-[-0.04em]">Intelligence Hub</h1>
                        {isRealData ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.1em] animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                Live Intelligence
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                <Eye size={14} className="animate-bounce-subtle" />
                                Demo Experience
                            </div>
                        )}
                    </div>
                    <p className="page-subtitle text-base font-medium text-muted-foreground mt-2 opacity-70">Real-time autonomous revenue operations & predictive analytics.</p>
                </div>
            </div>

            {/* AI Insights Card */}
            <div className="insight-section mb-8">
                <div className="card border-l-4 border-l-blue-500 bg-blue-500/5">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Zap size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mb-1">Autonomous Insight</div>
                            <div className="text-sm font-medium italic">
                                {renderInsight()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 1: Revenue & Performance (Audited) */}
            <div className="section">
                <div className="section-title">Revenue & Performance</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card highlight-card">
                        <div className="metric-header">
                            <div className="metric-label">AI Generated Revenue</div>
                            <div className="metric-icon text-emerald-500"><DollarSign size={20} /></div>
                        </div>
                        <div className="metric-value font-black text-emerald-500">
                            {formatCurrency(displayData?.roi?.aiGeneratedRevenue || 0)}
                        </div>
                        <div className="metric-change text-emerald-500/80">
                            <CheckCircle size={14} className="inline mr-1" /> Closed by AI automation
                        </div>
                    </div>
                    <div className="card">
                        <div className="metric-header">
                            <div className="metric-label">Monthly Recurring (MRR)</div>
                            <div className="metric-icon text-blue-500"><BarChart2 size={20} /></div>
                        </div>
                        <div className="metric-value font-black">
                            {formatCurrency(currentMRR)}
                        </div>
                        {isRealData ? (
                            <div className="metric-change text-[var(--text-tertiary)] italic text-xs">
                                Global lifetime average
                            </div>
                        ) : (
                            <div className="metric-change change-positive">
                                <ArrowUpRight size={16} /> 12.5%
                                <span className="metric-subtitle ml-2 text-[var(--text-tertiary)] font-normal">total growth</span>
                            </div>
                        )}
                    </div>
                    <div className="card">
                        <div className="metric-header">
                            <div className="metric-label">Annual Run Rate (ARR)</div>
                            <div className="metric-icon text-purple-500"><TrendingUp size={20} /></div>
                        </div>
                        <div className="metric-value font-black">
                            {formatCurrency(currentMRR * 12)}
                        </div>
                        {isRealData ? (
                            <div className="metric-change text-[var(--text-tertiary)] italic text-xs">
                                12 month projection
                            </div>
                        ) : (
                            <div className="metric-change change-positive">
                                <ArrowUpRight size={16} /> 8.2%
                                <span className="metric-subtitle ml-2 text-[var(--text-tertiary)] font-normal">projected</span>
                            </div>
                        )}
                    </div>
                    <div className="card">
                        <div className="metric-header">
                            <div className="metric-label">Potential Revenue</div>
                            <div className="metric-icon text-blue-500 font-bold"><Zap size={20} /></div>
                        </div>
                        <div className="metric-value font-black">
                            {formatCurrency(displayData?.potentialRevenue || 0)}
                        </div>
                        {isRealData ? (
                            <div className="metric-change text-[var(--text-tertiary)] italic text-xs">
                                Active pipeline value
                            </div>
                        ) : (
                            <div className="metric-change change-positive">
                                <ArrowUpRight size={16} /> 4.1%
                                <span className="metric-subtitle ml-2 text-[var(--text-tertiary)] font-normal">pipeline</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* New Section: ROI Comparison */}
            <div className="section">
                <div className="section-title text-blue-500">AI vs Manual Performance</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card border-blue-500/20">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <div className="metric-label mb-1">Conversion Win Rate</div>
                                <div className="text-2xl font-black">
                                    {(displayData?.roi?.aiConversionRate === 0 && displayData?.roi?.manualConversionRate === 0) || !displayData?.roi?.manualConversionRate ? (
                                        <span className="text-[var(--text-tertiary)] text-lg italic">Gathering Data...</span>
                                    ) : (
                                        <>AI performs {( (displayData?.roi?.aiConversionRate || 0) / (displayData?.roi?.manualConversionRate || 0.1) ).toFixed(1)}x better</>
                                    )}
                                </div>
                            </div>
                            <TrendingUp className="text-emerald-500" size={32} />
                        </div>
                        <div className="space-y-4">
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                        AI Win Rate
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-blue-600">
                                            {displayData?.roi?.aiConversionRate || 0}%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                    <div style={{ width: `${displayData?.roi?.aiConversionRate || 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                </div>
                            </div>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[var(--text-tertiary)] bg-gray-200">
                                        Manual Win Rate
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-[var(--text-tertiary)]">
                                            {displayData?.roi?.manualConversionRate || 0}%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                    <div style={{ width: `${displayData?.roi?.manualConversionRate || 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--text-tertiary)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-blue-500/20">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <div className="metric-label mb-1">Response Speed Advantage</div>
                                <div className="text-2xl font-black">
                                    Continuous 24/7 Coverage
                                </div>
                            </div>
                            <Clock className="text-blue-500" size={32} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                                <div className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-1">Avg AI Response</div>
                                <div className="text-3xl font-black text-blue-500">{formatTime(displayData?.roi?.avgResponseTimeSeconds || 0)}</div>
                                <div className="text-[10px] text-blue-500/60 mt-1">Instant Engagement</div>
                            </div>
                            <div className="p-4 bg-gray-500/5 rounded-xl border border-gray-500/10">
                                <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold mb-1">Manual Avg</div>
                                <div className="text-3xl font-black text-[var(--text-tertiary)]">{formatTime(displayData?.roi?.manualAvgResponseTimeSeconds || 0)}</div>
                                <div className="text-[10px] text-[var(--text-tertiary)]/60 mt-1">Delayed Opportunities</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: User Growth */}
            <div className="section">
                <div className="section-title">User Growth & Database</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card">
                        <div className="metric-header">
                            <div className="metric-label">Total Leads</div>
                            <div className="metric-icon text-blue-500"><Users size={20} /></div>
                        </div>
                        <div className="metric-value font-black">
                            {(displayData?.aiPerformance?.totalLeads || 0).toLocaleString()}
                        </div>
                        {isRealData ? (
                            <div className="metric-change text-[var(--text-tertiary)] italic text-xs">
                                Total database size
                            </div>
                        ) : (
                            <div className="metric-change change-positive">
                                <ArrowUpRight size={16} /> 24%
                                <span className="metric-subtitle ml-2 text-[var(--text-tertiary)] font-normal">database size</span>
                            </div>
                        )}
                    </div>
                    <div className="card">
                        <div className="metric-header">
                            <div className="metric-label">Hot Leads Today</div>
                            <div className="metric-icon text-emerald-500"><Calendar size={20} /></div>
                        </div>
                        <div className="metric-value font-black">
                            {displayData?.roi?.hotLeadsToday || 0}
                        </div>
                        <div className="metric-change change-positive">
                            <ArrowUpRight size={14} /> 
                            {displayData?.aiPerformance?.totalLeads > 0 
                                ? `${((displayData?.roi?.hotLeadsToday || 0) / displayData.aiPerformance.totalLeads * 100).toFixed(1)}%`
                                : "0%"
                            }
                            <span className="metric-subtitle ml-2 text-[var(--text-tertiary)] font-normal">priority 1 depth</span>
                        </div>
                    </div>
                    <div className="card">
                        <div className="metric-header">
                            <div className="metric-label">Auto Replies Sent</div>
                            <div className="metric-icon text-blue-500"><Zap size={20} /></div>
                        </div>
                        <div className="metric-value font-black">
                            {displayData?.roi?.autoRepliesSent || 0}
                        </div>
                        {displayData?.aiPerformance?.totalLeads > 0 && (
                             <div className="metric-change change-positive text-blue-500">
                                 ({(( (displayData?.roi?.autoRepliesSent || 0) / (displayData?.aiPerformance?.totalLeads) ) * 100).toFixed(1)}% of total leads)
                             </div>
                        )}
                    </div>
                    <div className="card">
                        <div className="metric-header">
                            <div className="metric-label">Hours Reclaimed</div>
                            <div className="metric-icon text-blue-500"><Shield size={20} /></div>
                        </div>
                        <div className="metric-value font-black">
                            {displayData?.timeSaved || 0}h
                        </div>
                        <div className="metric-change change-positive">
                            <ArrowUpRight size={16} /> 2.1%
                            <span className="metric-subtitle ml-2 text-[var(--text-tertiary)] font-normal">manual reduction</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Revenue Chart */}
            <div className="section">
                <div className="section-title">Revenue History (Dynamics)</div>
                <div className="card">
                    <div className="bar-chart items-end">
                        {displayData?.revenueHistory?.slice(-7).map((day, i) => {
                            // Find max revenue for scaling
                            const maxRev = Math.max(...displayData.revenueHistory.slice(-7).map(d => d.revenue || 0), 1000);
                            const height = Math.max(10, ((day.revenue || 0) / maxRev) * 100);
                            
                            // Map real date to short weekday if real data
                            const label = isRealData 
                                ? new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
                                : day.date;

                            return (
                                <div 
                                    key={i} 
                                    className="bar transition-all duration-500 ease-out" 
                                    style={{ height: `${height}%` }}
                                    title={formatCurrency(day.revenue || 0)}
                                >
                                    <div className="bar-label">{label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Section 4 & 5: Conversions & Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 section">
                <div>
                    <div className="section-title">Recent Activity</div>
                    <div className="card h-full">
                        {(isRealData ? displayData.recentLeads.slice(0, 4) : displayData.recentLeads).map((lead, i) => (
                            <div key={i} className={`activity-item ${i === 3 ? 'border-b-0 pb-0' : ''}`}>
                                <div className={`activity-icon font-bold ${
                                    lead.status === 'converted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                                }`}>
                                    {isRealData ? (lead.status === 'converted' ? '$' : 'L') : lead.icon}
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">
                                        {isRealData ? (lead.status === 'converted' ? 'Lead Converted' : 'New Lead Activity') : lead.title}
                                    </div>
                                    <div className="activity-desc">
                                        {isRealData 
                                            ? `${lead.name} • ${formatCurrency(lead.dealSize || 0)} Value`
                                            : lead.desc
                                        }
                                    </div>
                                    <div className="activity-time">
                                        {isRealData ? new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : lead.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isRealData && displayData.recentLeads.length === 0 && (
                            <div className="text-center py-10 text-[var(--text-tertiary)] italic">No recent activity detected.</div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="section-title">Strategic Growth Partners</div>
                    <div className="card h-full">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Entity</th>
                                    <th>Status</th>
                                    <th className="text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(isRealData ? displayData.recentLeads.slice(0, 3) : displayData.recentLeads.slice(0, 3)).map((lead, i) => (
                                    <tr key={i} className={i === 2 ? 'border-b-0' : ''}>
                                        <td className="font-bold">{lead.name}</td>
                                        <td>
                                            <span className={`status-badge ${
                                                lead.status === 'converted' || lead.status === 'active' ? 'status-active' : 'status-trial'
                                            }`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="text-right font-black text-emerald-500">
                                            {formatCurrency(isRealData ? lead.dealSize : lead.dealSize)}
                                        </td>
                                    </tr>
                                ))}
                                {isRealData && displayData.recentLeads.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-10 text-[var(--text-tertiary)] italic">No customer data available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Section 6: Platform Health */}
            <div className="section">
                <div className="section-title">Intelligence Resilience</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card">
                        <div className="metric-header items-center">
                            <div className="metric-label">System Performance</div>
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        </div>
                        <div className="metric-value font-black mt-4">100%</div>
                        <div className="metric-subtitle">Network status active</div>
                    </div>
                    <div className="card">
                        <div className="metric-header items-center">
                            <div className="metric-label">AI Response Time</div>
                            <div className="metric-icon bg-emerald-500/10 text-emerald-500"><Zap size={16} /></div>
                        </div>
                        <div className="metric-value font-black mt-4">
                            {displayData?.roi?.avgResponseTimeSeconds || 0}s
                        </div>
                        <div className="metric-subtitle">Avg response speed</div>
                    </div>
                    <div className="card">
                        <div className="metric-header items-center">
                            <div className="metric-label">Pending Reviews</div>
                            <div className="metric-icon bg-blue-500/10 text-blue-500"><Activity size={16} /></div>
                        </div>
                        <div className="metric-value font-black mt-4">
                            {displayData?.roi?.requiresReview || 0}
                        </div>
                        <div className="metric-subtitle">Human oversight queue</div>
                    </div>
                    <div className="card">
                        <div className="metric-header items-center">
                            <div className="metric-label">Resilience Saves</div>
                            <div className="metric-icon bg-purple-500/10 text-purple-500"><CheckCircle size={16} /></div>
                        </div>
                        <div className="metric-value font-black mt-4">
                            {displayData?.resilienceLeads || 0}
                        </div>
                        <div className="metric-subtitle">Leads fixed by AI</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
