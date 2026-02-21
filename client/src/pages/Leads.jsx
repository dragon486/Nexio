import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import { getLeads } from '../services/leadService';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [resilienceFilter, setResilienceFilter] = useState('all');
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

        return matchesSearch && matchesStatus && matchesPriority && matchesResilience;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-500/20 text-blue-400';
            case 'contacted': return 'bg-indigo-500/20 text-indigo-400';
            case 'qualified': return 'bg-emerald-500/20 text-emerald-400';
            case 'converted': return 'bg-green-500/20 text-green-400';
            case 'lost': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-emerald-400';
            case 'medium': return 'text-yellow-400';
            case 'low': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leads Central</h2>
                    <p className="text-muted text-sm mt-1">Manage and track your potential customers with AI-powered scoring.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-surface-soft/50 border border-surface-border rounded-xl focus:outline-none focus:border-primary/50 text-sm w-48 md:w-64 transition-all"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-surface-soft/50 border border-surface-border rounded-xl focus:outline-none focus:border-primary/50 text-sm appearance-none cursor-pointer hover:bg-white/5 transition-colors min-w-[120px]"
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-3 py-2 bg-surface-soft/50 border border-surface-border rounded-xl focus:outline-none focus:border-primary/50 text-sm appearance-none cursor-pointer hover:bg-white/5 transition-colors min-w-[120px]"
                    >
                        <option value="all">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    <select
                        value={resilienceFilter}
                        onChange={(e) => setResilienceFilter(e.target.value)}
                        className="px-3 py-2 bg-surface-soft/50 border border-surface-border rounded-xl focus:outline-none focus:border-primary/50 text-sm appearance-none cursor-pointer hover:bg-white/5 transition-colors min-w-[140px]"
                    >
                        <option value="all">Any Scoring</option>
                        <option value="resilience">Local Brain Only</option>
                        <option value="cloud">Cloud API Only</option>
                    </select>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-surface-border bg-white/[0.02]">
                                <th className="p-4 text-xs font-bold text-muted uppercase tracking-widest">Name</th>
                                <th className="p-4 text-xs font-bold text-muted uppercase tracking-widest">Status</th>
                                <th className="p-4 text-xs font-bold text-muted uppercase tracking-widest">AI Intelligence</th>
                                <th className="p-4 text-xs font-bold text-muted uppercase tracking-widest">Priority</th>
                                <th className="p-4 text-xs font-bold text-muted uppercase tracking-widest">Date</th>
                                <th className="p-4 text-xs font-bold text-muted uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-muted">Loading leads...</td></tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-muted">No leads found.</td></tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr
                                        key={lead._id}
                                        onClick={() => navigate(`/dashboard/leads/${lead._id}`)}
                                        className="border-b border-surface-border hover:bg-white/[0.03] transition-colors cursor-pointer group"
                                    >
                                        <td className="p-4">
                                            <div className="font-bold text-white group-hover:text-primary transition-colors">{lead.name}</div>
                                            <div className="text-xs text-muted">{lead.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", getStatusColor(lead.status))}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-surface-soft rounded-full overflow-hidden border border-white/5">
                                                    <div
                                                        className={cn("h-full rounded-full transition-all duration-500", lead.aiScore > 70 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : lead.aiScore > 40 ? "bg-yellow-500" : "bg-red-500")}
                                                        style={{ width: `${lead.aiScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-white/80">{lead.aiScore}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn("text-xs font-bold uppercase tracking-wide", getPriorityColor(lead.aiPriority))}>
                                                {lead.aiPriority}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-muted">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-muted hover:text-white transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};

export default Leads;
