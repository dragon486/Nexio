import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { getLeads } from '../services/leadService';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    // - **"White Box" Preservation**: Ensured that while the general dashboard remains perfectly dark, input fields and primary buttons maintain the requested high-contrast white aesthetic.

    // ## Dark Mode Text Visibility Fix (Leads & Settings)

    // We resolved an issue where certain text elements (table headers, descriptions, and labels) were nearly invisible in dark mode on the Leads and Settings pages.

    // ### Technical Resolution:
    // - **Tailwind Token Restoration**: Re-introduced the `foreground` and `muted-foreground` color mappings in `tailwind.config.js`. These are now dynamically linked to the CSS theme variables (`var(--text-primary)`, `var(--text-secondary)`).
    // - **Legibility Audit**: Confirmed that all components using standard text utilities now automatically adapt to the dark theme with appropriate contrast (e.g., light gray or off-white text against the dark background).
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [resilienceFilter, setResilienceFilter] = useState('all');
    const [reviewFilter, setReviewFilter] = useState('all');
    const navigate = useNavigate();
    const location = useLocation();

    // Sync URL search param with state
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        if (search) {
            setSearchTerm(search);
        }
    }, [location.search]);

    useEffect(() => {
        const loadLeads = async () => {
            try {
                const data = await getLeads();
                setLeads(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load leads:", err);
                setLeads([]);
            } finally {
                setLoading(false);
            }
        };
        loadLeads();
    }, []);

    const filteredLeads = leads.filter(lead => {
        // 1. Search Filter (Safe-Null)
        const name = (lead.name || '').toLowerCase();
        const email = (lead.email || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = name.includes(searchLower) || email.includes(searchLower);

        // 2. Status Filter
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

        // 3. Priority Filter
        const matchesPriority = priorityFilter === 'all' || lead.aiPriority === priorityFilter;

        // 4. Resilience Filter
        const matchesResilience = resilienceFilter === 'all' ||
            (resilienceFilter === 'resilience' ? lead.isResilienceMode : !lead.isResilienceMode);

        // 5. Review Filter
        const matchesReview = reviewFilter === 'all' ||
            (reviewFilter === 'review' ? lead.requiresReview : !lead.requiresReview);

        return matchesSearch && matchesStatus && matchesPriority && matchesResilience && matchesReview;
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'new': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'contacted': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
            case 'qualified': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'converted': return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'lost': return 'bg-red-500/10 text-red-600 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    const getPerformanceLabel = (score) => {
        if (score >= 80) return { label: 'High Alpha', color: 'text-emerald-600', bg: 'bg-emerald-500/10' };
        if (score >= 50) return { label: 'Steady', color: 'text-blue-600', bg: 'bg-blue-500/10' };
        return { label: 'Cold', color: 'text-red-600', bg: 'bg-red-500/10' };
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD', 
            maximumFractionDigits: 0 
        }).format(val || 0);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Executive Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase mb-2">Portfolio Management</div>
                    <h2 className="text-4xl font-black tracking-tighter text-foreground italic uppercase">Leads Central</h2>
                    <p className="text-muted-foreground text-sm mt-1 max-w-md">Proprietary AI scoring and autonomous conversion tracking for your high-value pipeline.</p>
                </div>
                
                {/* Unified Premium Filter Bar */}
                <div className="flex flex-wrap items-center gap-3 bg-surface/40 dark:bg-[#1a1a1a]/40 backdrop-blur-md p-2 rounded-2xl border border-surface-border dark:border-white/10 shadow-2xl">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Identify lead..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-surface-soft dark:bg-[#111111] border border-surface-border dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs w-48 md:w-64 transition-all text-foreground placeholder:text-muted-foreground/30"
                        />
                    </div>

                    <div className="h-6 w-[1px] bg-surface-border dark:bg-white/10 mx-1" />

                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-muted-foreground" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer pr-4"
                        >
                            <option value="all">Status: All</option>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="converted">Converted</option>
                            <option value="lost">Lost</option>
                        </select>
                    </div>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer border-l border-surface-border dark:border-white/10 pl-4 pr-4"
                    >
                        <option value="all">Priority: Any</option>
                        <option value="high">High Velocity</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    <button className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-all active:scale-95">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </div>

            {/* Premium Table Container */}
            <div className="bg-surface/30 dark:bg-[#1a1a1a]/30 backdrop-blur-xl border border-surface-border dark:border-white/10 rounded-[24px] shadow-2xl overflow-hidden group/table">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-surface-border dark:border-white/10 bg-surface-soft/50 dark:bg-[#111111]/50">
                                <th className="p-5 text-[10px] font-black text-foreground/60 uppercase tracking-[0.2em]">Asset / Identity</th>
                                <th className="p-5 text-[10px] font-black text-foreground/60 uppercase tracking-[0.2em]">Workflow Status</th>
                                <th className="p-5 text-[10px] font-black text-foreground/60 uppercase tracking-[0.2em]">Alpha Potential</th>
                                <th className="p-5 text-[10px] font-black text-foreground/60 uppercase tracking-[0.2em]">Projected Value</th>
                                <th className="p-5 text-[10px] font-black text-foreground/60 uppercase tracking-[0.2em]">Last Sync</th>
                                <th className="p-5 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Aggregating Alpha Data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-40">
                                            <Search size={40} className="text-muted-foreground mb-2" />
                                            <span className="text-sm font-bold text-muted-foreground">No matching leads in current segment.</span>
                                            <button onClick={() => {setSearchTerm(''); setStatusFilter('all'); setPriorityFilter('all');}} className="text-xs text-blue-500 hover:underline">Clear all filters</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => {
                                    const perf = getPerformanceLabel(lead.aiScore || 0);
                                    return (
                                        <tr
                                            key={lead._id}
                                            onClick={() => navigate(`/dashboard/leads/${lead._id}`)}
                                            className="hover:bg-surface-soft/50 dark:hover:bg-[#111111]/50 transition-all cursor-pointer group/row border-transparent border-l-2 hover:border-blue-500"
                                        >
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/10 rounded-xl flex items-center justify-center text-sm font-black text-white group-hover/row:scale-110 transition-transform shadow-lg">
                                                        {lead.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-black text-foreground text-sm tracking-tight group-hover/row:text-blue-400 transition-colors uppercase">{lead.name}</div>
                                                            {lead.requiresReview && (
                                                                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-tighter border border-amber-500/20 animate-pulse">
                                                                    Review
                                                                </span>
                                                            )}
                                                            {lead.isSample && (
                                                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-tighter border border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.2)]">
                                                                    Demo
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-foreground/40 font-medium lowercase italic">{lead.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-surface-border dark:border-white/10 shadow-inner focus-within:ring-2", 
                                                    getStatusColor(lead.status)
                                                )}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center justify-between gap-4 w-32">
                                                        <span className={cn("text-[9px] font-black uppercase tracking-tighter", perf.color)}>
                                                            {perf.label}
                                                        </span>
                                                        <span className="text-xs font-black text-foreground">
                                                            {lead.aiScore || 0}%
                                                        </span>
                                                    </div>
                                                    <div className="w-32 h-1 bg-surface-soft dark:bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn("h-full rounded-full transition-all duration-1000", 
                                                                lead.aiScore >= 80 ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" : 
                                                                lead.aiScore >= 50 ? "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]" : 
                                                                "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                                                            )}
                                                            style={{ width: `${lead.aiScore || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="font-black text-sm text-foreground">
                                                    {formatCurrency(lead.dealSize)}
                                                </div>
                                                <div className="text-[9px] text-foreground/40 uppercase font-bold tracking-widest">Estimated ROI</div>
                                            </td>
                                            <td className="p-5">
                                                <div className="text-xs font-bold text-foreground">
                                                    {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="text-[9px] text-foreground/40 uppercase font-bold tracking-widest">
                                                    {lead.source || 'Direct Entry'}
                                                </div>
                                            </td>
                                            <td className="p-5 text-right opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-surface-soft dark:hover:bg-white/10 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leads;
