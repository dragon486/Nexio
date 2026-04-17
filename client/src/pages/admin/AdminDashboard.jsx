import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { 
    Shield, Users, Database, DollarSign, Activity, 
    AlertTriangle, Search, Trash2, Eye, Filter, 
    CheckCircle2, Clock, Zap, TrendingUp, RefreshCw,
    Lock, Globe, Server, ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [status, setStatus] = useState(null);
    const [clients, setClients] = useState([]);
    const [queueStats, setQueueStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter] = useState('ALL');
    const [isSyncing, setIsSyncing] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [planLoading, setPlanLoading] = useState(false);

    // Safety Cooldown States
    const [purgeCooldown, setPurgeCooldown] = useState({}); // { queueName: seconds }
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAdminData = async () => {
        setIsSyncing(true);
        try {
            const [statusRes, usersRes, queueRes] = await Promise.all([
                api.get('/admin/system-status'),
                api.get('/admin/users'),
                api.get('/admin/queues/stats')
            ]);
            setStatus(statusRes.data);
            setClients(usersRes.data);
            setQueueStats(queueRes.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
            setTimeout(() => setIsSyncing(false), 800);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    // ─────────────────────────────────────────────────────────────
    // SAFETY OVERRIDE LOGIC (DLQ Management)
    // ─────────────────────────────────────────────────────────────
    
    const startPurgeCooldown = (queueName) => {
        setPurgeCooldown(prev => ({ ...prev, [queueName]: 10 }));
        const interval = setInterval(() => {
            setPurgeCooldown(prev => {
                const current = prev[queueName];
                if (current <= 1) {
                    clearInterval(interval);
                    return { ...prev, [queueName]: 0 };
                }
                return { ...prev, [queueName]: current - 1 };
            });
        }, 1000);
    };

    const handleRetryAll = async (queueName) => {
        if (!window.confirm(`Force retry all failed jobs in the ${queueName.toUpperCase()} pipeline? This will trigger side-effects immediately.`)) return;
        
        setActionLoading(true);
        try {
            await api.post(`/admin/queues/${queueName}/retry`);
            await fetchAdminData();
        } catch (error) {
            console.error('Retry failed', error);
            alert('Queue Error: Could not re-enqueue jobs.');
        } finally {
            setActionLoading(false);
        }
    };

    const handlePurgeQueue = async (queueName) => {
        if (!window.confirm(`CRITICAL ACTION: Purge all failed jobs from ${queueName.toUpperCase()}? This is irreversible and will delete potential customer outreach data.`)) return;
        
        setActionLoading(true);
        try {
            await api.post(`/admin/queues/${queueName}/purge`);
            setPurgeCooldown(prev => ({ ...prev, [queueName]: null }));
            await fetchAdminData();
        } catch (error) {
            console.error('Purge failed', error);
            alert('Security Error: Could not purge DLQ.');
        } finally {
            setActionLoading(false);
        }
    };
    
    // Original methods preserved...
    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you absolutely sure you want to PURGE all data for ${userName}? This action is irreversible.`)) return;
        
        try {
            await api.delete(`/admin/users/${userId}`);
            await fetchAdminData();
            if (selectedClient?._id === userId) setSelectedClient(null);
        } catch (error) {
            console.error("Delete failed", error);
            alert("Security Error: Could not purge client node.");
        }
    };

    const handleUpdatePlan = async (userId, newPlan) => {
        const normalizedPlan = newPlan === 'starter'
            ? 'founder_starter'
            : newPlan === 'pro'
                ? 'growth'
                : newPlan;

        setPlanLoading(true);
        try {
            await api.put(`/admin/users/${userId}/plan`, { plan: normalizedPlan });
            await fetchAdminData();
            setSelectedClient(prev => ({
                ...prev,
                business: { ...prev.business, plan: normalizedPlan }
            }));
        } catch (error) {
            console.error("Update plan failed", error);
            alert("Error: Could not update user's subscription tier.");
        } finally {
            setPlanLoading(false);
        }
    };

    const getOnboardingStatus = (client) => {
        if (client.metrics?.totalLeads > 0) return { label: 'Active', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: Zap };
        if (client.business?.websiteUrl) return { label: 'Ready', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: CheckCircle2 };
        if (client.business) return { label: 'Setup', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Clock };
        return { label: 'New', color: 'text-gray-400 bg-white/5 border-white/10', icon: Users };
    };

    const filteredClients = useMemo(() => {
        return (clients || []).filter(c => {
            const matchesSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.business?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
            
            if (statusFilter === 'ALL') return matchesSearch;
            
            const clientStatus = getOnboardingStatus(c).label;
            return matchesSearch && clientStatus.toUpperCase() === statusFilter;
        });
    }, [clients, searchTerm, statusFilter]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse italic">Synchronizing Global Authority Matrix...</div>
        </div>
    );

    if (!status) return (
        <div className="p-20 text-center flex flex-col items-center gap-4">
            <AlertTriangle size={48} className="text-red-500 animate-pulse" />
            <div className="text-xl font-black text-[#12131a] uppercase tracking-widest italic leading-none">Access Protocol Denied</div>
            <p className="text-gray-400 font-bold uppercase text-[11px] tracking-widest">Your credentials do not carry platform override signatures.</p>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
            {/* 1. Header Information — Noir Style */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                         <div className="px-3 py-1 bg-[#12131a] text-blue-500 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 flex items-center gap-2">
                             <Lock size={10} className="stroke-[3]" />
                             Superadmin Terminal
                         </div>
                         <div className="h-px w-12 bg-gray-200" />
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Nexus Overlook</span>
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter text-[#12131a] uppercase italic leading-none mb-6">
                        Executive <span className="text-blue-500">Oversight</span>
                    </h2>
                    <p className="text-gray-500 font-bold text-[14px] leading-relaxed italic opacity-80 uppercase tracking-tight max-w-2xl">
                        Global control center for Arlo.ai. Monitor node cluster health, cross-pipeline neural throughput, and high-tier credential management.
                    </p>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <div className="text-2xl font-black text-[#12131a] uppercase italic tracking-tighter leading-none">{status.userName || "Admin Alpha"}</div>
                        <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                            <Shield size={10} className="stroke-[3]" /> Active Override
                        </div>
                    </div>
                    <button 
                        onClick={fetchAdminData}
                        disabled={isSyncing}
                        className={cn(
                            "w-14 h-14 flex items-center justify-center bg-[#12131a] text-white rounded-[20px] transition-all shadow-2xl border border-white/10 group",
                            isSyncing ? "opacity-50" : "hover:bg-blue-600"
                        )}
                    >
                        <RefreshCw size={22} className={cn("transition-transform duration-700", isSyncing ? 'animate-spin' : 'group-hover:rotate-180')} />
                    </button>
                </div>
            </div>

            {/* 2. Neural Pipeline Monitor — Hardware Noir Grid */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-8">
                    <Activity size={20} className="text-blue-500" />
                    <h3 className="text-[12px] font-black text-[#12131a] uppercase tracking-[0.4em] italic">Neural Pipeline Matrix (Real-Time)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {['lead', 'email', 'whatsapp'].map((qName) => {
                        const q = queueStats?.[qName] || { active: 0, waiting: 0, failed: 0, completed: 0 };
                        const cooldown = purgeCooldown[qName];
                        
                        return (
                            <div key={qName} className="bg-[#12131a] border border-white/5 rounded-[40px] p-8 group shadow-2xl transition-all hover:bg-black/40">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                                        {qName === 'lead' ? <Activity size={20} className="text-blue-400" /> : 
                                         qName === 'email' ? <Globe size={20} className="text-amber-400" /> : 
                                         <Zap size={20} className="text-emerald-400" />}
                                    </div>
                                    <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500 border border-white/5">
                                        {qName} pipeline
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="text-center">
                                        <div className="text-xl font-black text-white italic leading-none mb-2">{q.active + q.waiting}</div>
                                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Active</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-black text-emerald-500 italic leading-none mb-2">{q.completed}</div>
                                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Done</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-black text-red-500 italic leading-none mb-2">{q.failed}</div>
                                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Failed</div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4 pt-6 border-t border-white/5">
                                    <button 
                                        onClick={() => handleRetryAll(qName)}
                                        disabled={q.failed === 0 || actionLoading}
                                        className="flex-1 py-3 bg-blue-600/10 text-blue-500 text-[9px] font-black uppercase tracking-widest rounded-2xl border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30"
                                    >
                                        Retry DLQ
                                    </button>
                                    
                                    {cooldown > 0 ? (
                                        <button 
                                            className="flex-1 py-3 bg-red-600/20 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-2xl border border-red-500/20 cursor-wait"
                                        >
                                            Hold ({cooldown}s)
                                        </button>
                                    ) : cooldown === 0 ? (
                                        <button 
                                            onClick={() => handlePurgeQueue(qName)}
                                            className="flex-1 py-3 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all animate-pulse"
                                        >
                                            Confirm Purge
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => startPurgeCooldown(qName)}
                                            disabled={q.failed === 0 || actionLoading}
                                            className="flex-1 py-3 bg-white/5 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-2xl border border-white/5 hover:text-red-500 transition-all disabled:opacity-30"
                                        >
                                            Purge
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Primary KPI Grid — Noir Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {[
                    { label: 'Total Nodes', val: status.users, icon: Users, color: 'text-blue-400' },
                    { label: 'Network Data', val: status.globalLeadsProcessed, icon: Server, color: 'text-amber-400' },
                    { label: 'Nexus Revenue', val: formatCurrency(status.grossPlatformRevenue), icon: DollarSign, color: 'text-emerald-400' },
                    { label: 'Core State', val: status.systemHealth, icon: Activity, color: 'text-indigo-400' }
                ].map((stat, i) => (
                    <div key={i} className="bg-[#12131a] border border-white/5 rounded-[40px] p-8 group relative overflow-hidden transition-all hover:translate-y-[-2px] shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                             <stat.icon size={80} className={stat.color} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6">
                                <stat.icon size={22} className={stat.color} />
                            </div>
                            <div className="text-4xl font-black text-white tracking-tighter truncate italic leading-none mb-3">{stat.val}</div>
                            <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] italic">
                                {stat.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 4. Operational Insights & Visualization — Noir Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-[#12131a] border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]" />
                    
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 italic">Growth Telemetry</h3>
                            <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Global Node Surge</p>
                        </div>
                        <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#555] flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Live Traffic
                        </div>
                    </div>
                    
                    <div className="h-[320px] w-full relative z-10 opacity-90">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={status.registrationTrend}>
                                <defs>
                                    <linearGradient id="colorNode" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
                                <XAxis 
                                    dataKey="_id" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 900 }}
                                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#12131a', 
                                        borderRadius: '24px',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        fontSize: '11px',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: '#ffffff'
                                    }}
                                    itemStyle={{ color: '#3b82f6' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorNode)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 flex flex-col justify-between shadow-2xl group">
                    <div className="relative z-10">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-10 italic">Core Diagnostics</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Security Status', body: 'No breaches detected.', icon: Shield, color: 'text-blue-400' },
                                { label: 'Pending Nodes', body: `${clients.filter(c => !c.business).length} awaiting setup.`, icon: Clock, color: 'text-amber-400' },
                                { label: 'Nexus Alpha', body: `Global rate at ${status.conversionRate}%.`, icon: Zap, color: 'text-emerald-400' }
                            ].map((insight, idx) => (
                                <div key={idx} className="flex items-start gap-5 p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default">
                                    <div className={cn("p-2.5 rounded-xl bg-white/5", insight.color)}>
                                        <insight.icon size={18} className="stroke-[3]" />
                                    </div>
                                    <div>
                                        <div className="text-[12px] font-black text-white uppercase tracking-tight italic leading-none mb-1">{insight.label}</div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest opacity-80 leading-tight">{insight.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button className="w-full mt-10 py-5 bg-white text-[#12131a] text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-blue-500 hover:text-white hover:shadow-2xl hover:shadow-blue-500/20 transition-all active:scale-[0.98]">
                        Download Intelligence PDF
                    </button>
                </div>
            </div>

            {/* 5. Registered Nodes Matrix — Noir Table Style */}
            <div className="bg-white border border-gray-100 rounded-[48px] overflow-hidden shadow-2xl relative">
                <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-gray-50/50">
                    <div>
                        <h3 className="text-2xl font-black text-[#12131a] uppercase tracking-tighter italic leading-none">Authority Matrix</h3>
                        <div className="flex items-center gap-3 mt-4">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Cluster Nodes Managed By NEXIO Alpha</p>
                        </div>
                    </div>
                    
                    <div className="relative w-full md:w-96 shadow-lg shadow-black/5 rounded-3xl overflow-hidden">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Scan Node Identity..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-white border-0 text-[12px] font-black uppercase tracking-tight placeholder:text-gray-300 focus:ring-0"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#12131a] text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                            <tr>
                                <th className="px-10 py-6 border-b border-white/5">Neural Identity</th>
                                <th className="px-10 py-6 border-b border-white/5">Lifecycle State</th>
                                <th className="px-10 py-6 border-b border-white/5">Sector Allocation</th>
                                <th className="px-10 py-6 border-b border-white/5 text-right pr-14">Override</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredClients.map((c) => {
                                const status = getOnboardingStatus(c);
                                return (
                                    <tr key={c._id} className="hover:bg-blue-50/30 transition-all group">
                                        <td className="px-10 py-10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-[#12131a] border border-white/5 flex items-center justify-center text-xl font-black text-blue-500 shadow-2xl transition-transform group-hover:scale-110">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-base font-black text-[#12131a] tracking-tighter uppercase italic leading-none mb-1.5">{c.name}</div>
                                                    <div className="text-[11px] text-gray-400 font-black uppercase tracking-widest opacity-60 leading-none">{c.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-10">
                                            <div className={cn("px-4 py-1.5 rounded-full w-fit text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm", status.color)}>
                                                {status.label}
                                            </div>
                                            <div className="text-[9px] text-gray-400 mt-3 font-black uppercase tracking-widest opacity-50 italic">Auth {new Date(c.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-10 py-10">
                                            {c.business ? (
                                                <div className="space-y-3">
                                                    <div className="text-[13px] font-black text-[#12131a] uppercase italic leading-none">{c.business.name}</div>
                                                    <div className="flex items-center gap-3">
                                                         <div className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-black uppercase tracking-widest">{c.business.industry || 'General'}</div>
                                                         <div className="h-3 w-px bg-gray-200" />
                                                         <div className="flex items-center gap-1.5 text-blue-500">
                                                              <TrendingUp size={10} className="stroke-[3]" />
                                                              <span className="text-[10px] font-black uppercase tracking-tighter italic">{c.metrics?.totalLeads || 0} Vectors</span>
                                                         </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 text-amber-500 font-black text-[10px] uppercase tracking-[0.2em] italic opacity-70">
                                                    <AlertTriangle size={14} className="stroke-[3]" /> Unconfigured Node
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-10 py-10 text-right pr-14">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button onClick={() => setSelectedClient(c)} className="w-11 h-11 flex items-center justify-center bg-[#12131a] text-white rounded-[14px] hover:bg-blue-600 transition-all shadow-xl shadow-black/10">
                                                    <Eye size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteUser(c._id, c.name)} className="w-11 h-11 flex items-center justify-center bg-red-50 text-red-500 border border-red-100 rounded-[14px] hover:bg-red-500 hover:text-white transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Diagnostic Overlay — Noir Side Drawer */}
            <AnimatePresence>
                {selectedClient && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md" 
                            onClick={() => setSelectedClient(null)} 
                        />
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-lg z-[101] bg-[#12131a] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] border-l border-white/5 flex flex-col text-white"
                        >
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-[24px] bg-blue-500 text-white flex items-center justify-center text-3xl font-black shadow-2xl shadow-blue-500/20">
                                        {selectedClient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{selectedClient.name}</h2>
                                        <div className="flex items-center gap-2">
                                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                             <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{selectedClient.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedClient(null)} className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/5 rounded-2xl text-gray-400 hover:text-white transition-all">
                                    <RefreshCw size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-12">
                                <section>
                                    <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] mb-6 italic">Neural Identity Profile</h4>
                                    <div className="space-y-4">
                                        <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                            <div className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">Platform Descriptor</div>
                                            <div className="text-lg font-black text-white uppercase italic tracking-tight">{selectedClient.business?.name || "Pending Validation"}</div>
                                        </div>
                                        <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                            <div className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">Assigned Sector</div>
                                            <div className="text-lg font-black text-white uppercase italic tracking-tight">{selectedClient.business?.industry || "Market Vector Alpha"}</div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] mb-6 italic">Authority Clearance</h4>
                                    <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-[40px] relative overflow-hidden group shadow-2xl">
                                        <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Shield size={120} />
                                        </div>
                                        <div className="flex items-center gap-3 mb-6">
                                             <Lock size={16} className="text-blue-500 stroke-[3]" />
                                             <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Override Command Tier</div>
                                        </div>
                                        <select 
                                            value={selectedClient.business?.plan || 'free'}
                                            onChange={(e) => handleUpdatePlan(selectedClient._id, e.target.value)}
                                            disabled={planLoading}
                                            className="w-full bg-[#0a0b0f] border-0 text-white text-[13px] font-black uppercase italic tracking-widest rounded-2xl p-5 focus:ring-4 focus:ring-blue-500/20 transition-all cursor-pointer shadow-2xl"
                                        >
                                            <option value="free">Alpha Tier (Trial)</option>
                                            <option value="founder_starter">Founder Tier (Starter)</option>
                                            <option value="growth">Intelligence Tier (Pro)</option>
                                            <option value="enterprise">Authority Tier (Nexus)</option>
                                        </select>
                                        <div className="mt-6 flex items-start gap-4">
                                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />
                                             <p className="text-[10px] text-gray-500 font-black uppercase italic leading-relaxed tracking-tight opacity-70">
                                                 Modifying this credential will instantly reshape the client's resource access and neural vector sequencing capacity across all active nodes.
                                             </p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] mb-6 italic">Performance Statistics</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-white/5 border border-white/5 rounded-3xl text-center">
                                            <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 italic">Vector Flux</div>
                                            <div className="text-3xl font-black text-blue-400 italic tracking-tighter leading-none">{selectedClient.metrics?.totalLeads || 0}</div>
                                        </div>
                                        <div className="p-6 bg-white/5 border border-white/5 rounded-3xl text-center">
                                            <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 italic">Cluster Age</div>
                                            <div className="text-sm font-black text-white uppercase italic mt-2 leading-none">{new Date(selectedClient.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="p-10 border-t border-white/5 bg-white/[0.01]">
                                <button onClick={() => setSelectedClient(null)} className="w-full py-5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-blue-700 shadow-2xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                                    Neutralize Diagnostic View <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
