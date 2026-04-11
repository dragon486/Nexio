import React from 'react';
import { 
    Users, DollarSign, TrendingUp, Activity, 
    Shield, ArrowUpRight, Zap, Eye, Trash2, 
    AlertTriangle, CheckCircle2, Clock, Globe
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PlatformExecutiveView = ({ status, clients, onImpersonate, onDeleteClient }) => {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    if (!status) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] animate-pulse">Syncing Executive Intelligence...</div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* 1. SaaS Master Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card group !p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500 rounded-xl group-hover:scale-110 transition-transform"><DollarSign size={20} /></div>
                        <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500 text-[8px] font-black uppercase rounded-md border border-emerald-500/20">Net MRR</div>
                    </div>
                    <div className="text-3xl font-black tracking-tighter truncate">{formatCurrency(status.netSaaSRevenue)}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-1.5 opacity-50">
                        <TrendingUp size={10} className="text-emerald-500" /> Subscription Income
                    </div>
                </div>

                <div className="stat-card group !p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500 rounded-xl group-hover:scale-110 transition-transform"><Users size={20} /></div>
                        <div className="px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500 text-[8px] font-black uppercase rounded-md border border-blue-500/20">Network</div>
                    </div>
                    <div className="text-3xl font-black tracking-tighter">{status.users}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-1.5 opacity-50">
                        <CheckCircle2 size={10} className="text-blue-500" /> Active Client Nodes
                    </div>
                </div>

                <div className="stat-card group !p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500 rounded-xl group-hover:scale-110 transition-transform"><Zap size={20} /></div>
                        <div className="px-2 py-0.5 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500 text-[8px] font-black uppercase rounded-md border border-amber-500/20">Trial Flow</div>
                    </div>
                    <div className="text-3xl font-black tracking-tighter">{status.activeTrials}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-1.5 opacity-50">
                        <Clock size={10} className="text-amber-500" /> Power Trials Active
                    </div>
                </div>

                <div className="stat-card group !p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-500 rounded-xl group-hover:scale-110 transition-transform"><Globe size={20} /></div>
                        <div className="px-2 py-0.5 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-500 text-[8px] font-black uppercase rounded-md border border-purple-500/20">ARR Target</div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <div className="text-3xl font-black tracking-tighter truncate">{status.progressToTarget}%</div>
                        <div className="text-[10px] text-purple-600 dark:text-purple-400 font-black">OF ₹1.32 CR</div>
                    </div>
                    <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full mt-3 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000" 
                            style={{ width: `${status.progressToTarget}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* 2. Registration Trend & Client Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 section-card !p-8 relative overflow-hidden">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 opacity-40 italic">Node Growth Telemetry</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={status.registrationTrend}>
                                <defs>
                                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.05} vertical={false} />
                                <XAxis 
                                    dataKey="_id" 
                                    tick={{ fill: 'currentColor', opacity: 0.4, fontSize: 10, fontWeight: 700 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, color: '#111827' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="section-card !p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20 ring-8 ring-blue-500/5">
                        <Activity size={32} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-2 opacity-40 italic">Conversion Efficiency</h3>
                    <div className="text-4xl font-black text-blue-600 tracking-tighter mb-4">{status.conversionRate}%</div>
                    <p className="text-[10px] font-medium uppercase tracking-tight max-w-[200px] leading-relaxed opacity-50">
                        Global average conversion rate across all AI-managed nodes in the NEXIO network.
                    </p>
                </div>
            </div>

            {/* 3. Client Intelligence Matrix */}
            <div className="section-card !p-0 relative overflow-hidden overflow-x-auto">
                <div className="p-8 border-b border-[var(--border)] bg-blue-500/[0.02] flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-500/10 rounded-[18px]"><Shield size={24} /></div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-[0.2em] italic">Client Intelligence Matrix</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Global Node Management & Support Shell</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-60">
                        <Activity size={12} className="text-emerald-500" /> {clients.length} Nodes Online
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-[var(--border)] text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                            <tr>
                                <th className="px-8 py-6">Client Identity</th>
                                <th className="px-8 py-6">Tier Status</th>
                                <th className="px-8 py-6">Intelligence Load</th>
                                <th className="px-8 py-6 text-right pr-12">Support Shell</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border/30">
                            {clients.map((c) => (
                                <tr key={c._id} className="hover:bg-blue-500/5 transition-all duration-300 group cursor-default border-b border-gray-100 dark:border-black/5 last:border-0">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-black/5 dark:border-white/10 flex items-center justify-center text-sm font-black text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                                                {c.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black tracking-tight group-hover:text-blue-500 transition-colors uppercase">{c.name}</div>
                                                <div className="text-[11px] font-medium opacity-50 lowercase">{c.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit border text-[9px] font-black uppercase tracking-widest",
                                            c.business?.plan === 'pro_intelligence' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-lg shadow-purple-500/10' :
                                            c.business?.plan === 'founder_starter' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        )}>
                                            <Shield size={10} />
                                            {c.business?.plan === 'free' ? 'Power Trial' : (c.business?.plan || 'New').replace('_', ' ')}
                                        </div>
                                        <div className="text-[9px] text-muted-foreground mt-2 font-bold uppercase tracking-tighter opacity-50 pl-1 italic">
                                            {c.business?.subscriptionExpiresAt ? `Cycle Ends ${new Date(c.business.subscriptionExpiresAt).toLocaleDateString()}` : 'Rolling Trial'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="text-sm font-black tracking-tighter mb-2">
                                            {c.business?.plan === 'founder_starter' ? '₹2,999/mo' : 
                                             c.business?.plan === 'pro_intelligence' ? '₹14,999/mo' : 
                                             c.business?.plan === 'enterprise' ? '₹25,000/mo' : '₹0 (Trial)'}
                                        </div>
                                        <div className="space-y-2 max-w-[150px]">
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">
                                                <span>AI Load</span>
                                                <span>{Math.round(((c.metrics?.totalLeads || 0) / (c.business?.maxConversations || 1)) * 100)}%</span>
                                            </div>
                                            <div className="w-full h-1 bg-surface-border rounded-full overflow-hidden">
                                                <div 
                                                    className={cn(
                                                        "h-full transition-all duration-1000",
                                                        ((c.metrics?.totalLeads || 0) / (c.business?.maxConversations || 1)) > 0.8 ? 'bg-red-500' : 'bg-blue-500'
                                                    )}
                                                    style={{ width: `${Math.min(100, ((c.metrics?.totalLeads || 0) / (c.business?.maxConversations || 1)) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-[10px] font-black text-foreground">{c.metrics?.totalLeads || 0} / {c.business?.maxConversations || 0} Conv</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right pr-12">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            <button 
                                                onClick={() => onImpersonate(c._id)}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-95 border border-white/5"
                                            >
                                                <Eye size={12} /> Impersonate
                                            </button>
                                            <button 
                                                onClick={() => onDeleteClient(c._id, c.name)}
                                                className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all hover:scale-110"
                                                title="Purge Node"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {clients.length === 0 && (
                    <div className="p-20 text-center">
                        <Database size={48} className="mx-auto text-muted-foreground/20 mb-4 animate-pulse" />
                        <div className="text-xs font-black text-muted-foreground uppercase tracking-widest italic">No client nodes detected in the matrix.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlatformExecutiveView;
