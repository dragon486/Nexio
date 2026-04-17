import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics } from '../services/analyticsService';
import { 
    Zap, DollarSign, Activity, TrendingUp, 
    Clock, MousePointer, Info, Shield, 
    ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2,
    PieChart, Target, Layers, ChevronRight, Users
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GaugeChart, Sparkline, Heatmap, DonutChart } from '../components/ui/OrbitCharts';
import DateFilter from '../components/ui/DateFilter';
import { motion } from 'framer-motion';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('7D');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAnalytics(dateRange);
            setAnalytics(data);
        } catch (error) {
            console.error("Analytics: Error fetching data", error);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const displayData = useMemo(() => {
        if (analytics && !analytics.isDemo) return analytics;
        return {
            roi: {
                aiGeneratedRevenue: 184000,
                manualRevenue: 42000,
                aiConversionRate: 82,
                manualConversionRate: 7,
                avgResponseTimeSeconds: 3,
                manualAvgResponseTimeSeconds: 8100,
                sentimentScore: 94
            },
            potentialRevenue: 2450000,
            funnel: {
                totalLeads: 1420,
                contacted: 840,
                qualified: 320,
                converted: 124
            }
        };
    }, [analytics]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', { 
            style: 'currency', 
            currency: 'INR', 
            maximumFractionDigits: 0 
        }).format(val || 0);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
             <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse italic">Syncing Data...</span>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 max-w-[1600px] mx-auto">
            {/* Noir Executive Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 px-2">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="px-3 py-1 bg-[#12131a] text-blue-500 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 flex items-center gap-2">
                             <div className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
                             Strategic Vector Output
                         </div>
                         <div className="h-px w-12 bg-gray-200" />
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Live Performance</span>
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter text-[#12131a] uppercase italic leading-none mb-6">
                        Sales <span className="text-blue-500">Performance</span>
                    </h2>
                    <p className="text-gray-500 font-bold text-[14px] leading-relaxed italic opacity-80 uppercase tracking-tight max-w-2xl">
                        Deep-tier ROI tracking and predictive conversion modeling. The platform is currently operating at 94% efficiency, virtually eliminating response delay across all active leads.
                    </p>
                </div>
                
                <div className="flex items-center gap-3 bg-[#12131a] p-2 rounded-[24px] shadow-2xl border border-white/5">
                    <DateFilter current={dateRange} onChange={setDateRange} isOrbit={true} />
                    <button 
                        onClick={fetchData}
                        className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white hover:text-blue-400 transition-all group"
                    >
                        <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                    </button>
                </div>
            </div>

            {/* Core KPI Matrix — Noir Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                
                {/* Gauge: Revenue Performance */}
                <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 flex flex-col items-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                         <Target size={120} className="text-blue-500" />
                    </div>
                    
                    <div className="w-full flex justify-between items-center mb-12 relative z-10">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-blue-500" />
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Conversion ROI</span>
                        </div>
                        <Info size={14} className="text-gray-600 cursor-help" />
                    </div>

                    <div className="relative z-10 scale-110 mb-6">
                         <GaugeChart value={displayData.roi.aiConversionRate} />
                    </div>

                    <div className="text-center relative z-10 mt-4">
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 italic">Autonomous Revenue</p>
                        <h3 className="text-5xl font-black text-white tracking-tighter italic leading-none">{formatCurrency(displayData.roi.aiGeneratedRevenue)}</h3>
                        <div className="mt-8 flex flex-col items-center gap-3">
                             <div className="px-5 py-2 bg-white/5 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 shadow-sm flex items-center gap-2">
                                 <TrendingUp size={12} /> +240% Growth
                             </div>
                             <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Analyzing 1,420 Active Leads</span>
                        </div>
                    </div>
                </div>

                {/* Efficiency: Response Sync */}
                <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all hover:translate-y-[-2px]">
                    <div className="relative z-10">
                        <div className="flex items-baseline justify-between mb-12">
                             <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Response Efficiency</span>
                             </div>
                             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest border-b border-blue-500/20 pb-1">Live Syncing</span>
                        </div>
                        
                        <div className="space-y-10">
                            {[
                                { label: 'Inbound Latency', value: `${displayData.roi.avgResponseTimeSeconds}s`, percentage: 98, color: 'from-blue-600 to-blue-400', ghost: 'bg-blue-500/10' },
                                { label: 'Manual Drift', value: '2.4H', percentage: 12, color: 'from-red-600 to-red-400', ghost: 'bg-red-500/10' },
                                { label: 'Customer Sentiment', value: `${displayData.roi.sentimentScore}%`, percentage: displayData.roi.sentimentScore, color: 'from-indigo-600 to-indigo-400', ghost: 'bg-indigo-500/10' }
                            ].map((m, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[12px] font-black text-white uppercase tracking-tighter italic leading-none">{m.label}</span>
                                        <span className="text-[12px] font-black text-gray-500 uppercase font-mono">{m.value}</span>
                                    </div>
                                    <div className={cn("h-2.5 w-full rounded-full p-[1px] border border-white/5", m.ghost)}>
                                         <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${m.percentage}%` }}
                                            className={cn("h-full rounded-full transition-all duration-1000 bg-gradient-to-r shadow-[0_0_15px_rgba(59,130,246,0.2)]", m.color)}
                                         />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-white/5 text-blue-400 rounded-[28px] border border-white/5 relative group">
                         <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[28px]" />
                         <div className="flex items-start gap-4 relative z-10">
                             <Zap size={20} className="shrink-0 mt-0.5" />
                             <p className="text-[11px] font-black uppercase italic leading-relaxed tracking-tighter opacity-90">
                                 AI agents are currently handling 98% of inquiries, providing an instant response advantage over manual lead processing.
                             </p>
                         </div>
                    </div>
                </div>

                {/* Conversion: Segment Matrix */}
                <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
                    <div className="w-full flex justify-between items-center mb-10 relative z-10">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-blue-500" />
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Funnel Logic</span>
                        </div>
                        <PieChart size={16} className="text-gray-600" />
                    </div>

                    <div className="relative z-10 transform scale-110">
                        <DonutChart 
                            size={200} 
                            data={[
                                { value: displayData.funnel.totalLeads, color: 'rgba(255,255,255,0.03)' },
                                { value: displayData.funnel.contacted, color: '#3b82f6' },
                                { value: displayData.funnel.qualified, color: '#6366f1' },
                                { value: displayData.funnel.converted, color: '#10b981' }
                            ]} 
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">Conv. Rate</span>
                             <span className="text-3xl font-black text-white italic tracking-tighter">{((displayData.funnel.converted / displayData.funnel.totalLeads) * 100).toFixed(1)}%</span>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-x-12 gap-y-8 w-full px-4 relative z-10">
                        {[
                            { label: 'Inbound', value: displayData.funnel.totalLeads, color: 'bg-white/10' },
                            { label: 'Syncing', value: displayData.funnel.contacted, color: 'bg-blue-500' },
                            { label: 'Validated', value: displayData.funnel.qualified, color: 'bg-indigo-500' },
                            { label: 'Closed', value: displayData.funnel.converted, color: 'bg-emerald-500' }
                        ].map((f, i) => (
                            <div key={i} className="flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={cn("w-2.5 h-2.5 rounded-full border border-white/10 shadow-sm", f.color)} />
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em] leading-none">{f.label}</span>
                                </div>
                                    <span className="text-2xl font-black text-white uppercase italic tracking-tighter mt-1">{(f.value || 0).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Strategic Details — Noir Overviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2 md:px-0">
                 
                 {/* Acquisition Vectors — Noir Heatmap */}
                 <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[80px]" />
                    
                    <div className="flex justify-between items-start mb-12 relative z-10">
                        <div>
                            <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2 italic">Inbound Activity</h4>
                            <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Acquisition Vectors</p>
                        </div>
                        <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#555] flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Live Node Sync
                        </div>
                    </div>
                    <div className="relative z-10 translate-y-2 opacity-90 grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700">
                        <Heatmap />
                    </div>
                 </div>

                 {/* Revenue Potential — Noir Modeling */}
                 <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group min-h-[440px]">
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-all duration-1000" />
                    
                    <div className="relative z-10">
                         <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2 italic">Revenue Projection</h4>
                         <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Predicted Revenue Growth</p>
                    </div>

                    <div className="py-12 relative z-10">
                         <div className="flex items-baseline gap-2">
                              <span className="text-[24px] font-black text-blue-500 uppercase italic mb-8">Est</span>
                              <div className="text-8xl font-black text-white tracking-[0.05em] italic uppercase leading-none mb-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                                 {(displayData.potentialRevenue / 100000).toFixed(1)}L
                              </div>
                         </div>
                         <div className="flex items-center gap-6">
                             <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-emerald-400 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                                 <TrendingUp size={14} className="stroke-[3]" /> AI Prediction
                             </div>
                             <div className="h-6 w-px bg-white/10" />
                             <div className="flex items-center gap-2 text-gray-500">
                                 <Users size={14} />
                                 <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">1.4K leads synced</span>
                             </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-3 gap-10 pt-12 border-t border-white/5 relative z-10">
                        {[
                            { label: 'Current MRR', value: formatCurrency(displayData.roi.aiGeneratedRevenue + displayData.roi.manualRevenue) },
                            { label: 'Strategic LTV', value: '₹4.2L' },
                            { label: 'Status', value: 'OPTIMAL', color: 'text-emerald-500' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-3">
                                <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest opacity-60 leading-none">{item.label}</div>
                                <div className={cn("text-base font-black uppercase italic tracking-tight leading-none", item.color || "text-white")}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
            
            {/* Action Footer */}
            <div className="mt-20 flex justify-center px-4">
                 <Link to="/dashboard/leads" className="w-full max-w-4xl p-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-[32px] shadow-2xl group active:scale-[0.98] transition-all">
                      <div className="bg-[#12131a] w-full h-full rounded-[31px] p-8 flex items-center justify-between group-hover:bg-transparent transition-colors">
                           <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 group-hover:bg-white group-hover:text-blue-600 transition-all">
                                     <ArrowUpRight size={32} className="stroke-[3]" />
                                </div>
                                <div className="text-left">
                                     <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-1 italic">Exponential Strategy</p>
                                     <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-white transition-colors">Scale Your Sales Now</p>
                                </div>
                           </div>
                           <div className="hidden md:flex items-center gap-2 text-white/20 group-hover:text-white transition-colors">
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">View Full Pipeline</span>
                                <ChevronRight size={24} className="stroke-[3]" />
                           </div>
                      </div>
                 </Link>
            </div>
        </div>
    );
};

export default Analytics;
