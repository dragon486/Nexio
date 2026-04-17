import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeads } from '../services/leadService';
import { Search, Filter, MoreHorizontal, User, Mail, DollarSign, Activity, Zap, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter] = useState('all');
    const navigate = useNavigate();

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
        const name = (lead.name || '').toLowerCase();
        const email = (lead.email || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = name.includes(searchLower) || email.includes(searchLower);
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || lead.aiPriority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'new': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'contacted': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
            case 'qualified': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'converted': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'lost': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', { 
            style: 'currency', 
            currency: 'INR', 
            maximumFractionDigits: 0 
        }).format(val || 0);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse italic">Synchronizing Lead Vectors...</span>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-700 pb-20">
            {/* Noir Executive Header */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="text-[10px] font-black tracking-[0.4em] text-blue-500 uppercase mb-3 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-node" />
                             CRM Command Center
                        </div>
                        <h2 className="text-5xl font-black tracking-tight text-[#12131a] dark:text-[#12131a] uppercase italic leading-none">Lead Desk</h2>
                        <p className="text-gray-500 font-bold text-[13px] mt-4 max-w-xl leading-relaxed italic opacity-80 uppercase tracking-tight">
                            Strategic oversight of unified business nodes. Powered by high-fidelity lead qualification.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="px-8 py-4 bg-[#12131a] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                            Create New Lead
                        </button>
                    </div>
                </div>

                {/* Noir Performance Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {[
                        { label: 'Active Pipeline', value: filteredLeads.length, icon: Activity, color: 'text-blue-400' },
                        { label: 'Network Potential', value: formatCurrency(filteredLeads.reduce((acc, l) => acc + (l.dealSize || 0), 0)), icon: DollarSign, color: 'text-emerald-400' },
                        { label: 'AI Sync Rate', value: '98.4%', icon: Zap, color: 'text-amber-400' }
                    ].map((m, i) => (
                        <div key={i} className="bg-[#12131a] border border-white/5 p-8 rounded-[32px] flex items-center gap-6 transition-all hover:translate-y-[-2px] shadow-2xl">
                             <div className={cn("w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-all", m.color)}>
                                 <m.icon size={26} />
                             </div>
                             <div>
                                 <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{m.label}</div>
                                 <div className="text-3xl font-black text-white tracking-tighter leading-none">{m.value}</div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Noir Tactical Controls */}
            <div className="bg-white border border-gray-100 rounded-3xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search lead identities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-black uppercase tracking-tight text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-30 italic"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-56 bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-700 px-6 py-4 rounded-2xl cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all uppercase tracking-widest"
                    >
                        <option value="all">ANY STATUS</option>
                        <option value="new">NEW INBOUND</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="qualified">QUALIFIED</option>
                        <option value="converted">CONVERTED</option>
                    </select>
                </div>
            </div>

            {/* Noir Matrix Table */}
            <div className="bg-[#12131a] rounded-[40px] overflow-hidden shadow-2xl relative border border-white/5">
                <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] border-b border-white/5">
                            <tr>
                                <th className="px-10 py-6">Node Identity</th>
                                <th className="px-6 py-6">Lifecycle State</th>
                                <th className="px-6 py-6 text-center">Neural Sync</th>
                                <th className="px-6 py-6">Proj. Value</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-50">
                                            <Search size={48} className="text-gray-600" />
                                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">No compatible segments found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr 
                                        key={lead._id}
                                        onClick={() => navigate(`/dashboard/leads/${lead._id}`)}
                                        className="group hover:bg-white/[0.02] transition-all cursor-pointer"
                                    >
                                        <td className="px-10 py-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 font-black text-2xl transition-transform group-hover:scale-110 shadow-inner">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[17px] font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors italic leading-none">{lead.name}</span>
                                                        {lead.requiresReview && <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Alert</span>}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[12px] font-medium text-gray-500 lowercase opacity-80">
                                                        <Mail size={13} className="text-blue-500" />
                                                        {lead.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-10">
                                            <div className={cn(
                                                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border w-fit shadow-lg", 
                                                getStatusColor(lead.status)
                                            )}>
                                                {lead.status}
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-600 mt-3 uppercase tracking-tight italic opacity-60">Captured {new Date(lead.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-10">
                                            <div className="flex items-center gap-4 justify-center">
                                                <div className="w-28 h-3 bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                                                    <div 
                                                        className={cn("h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]", 
                                                            lead.aiScore >= 80 ? "bg-emerald-500" : lead.aiScore >= 50 ? "bg-blue-500" : "bg-amber-500"
                                                        )}
                                                        style={{ width: `${lead.aiScore || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-[12px] font-black text-white italic">{lead.aiScore || 0}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-10">
                                            <div className="text-[18px] font-black text-white tracking-tighter italic leading-none">{formatCurrency(lead.dealSize)}</div>
                                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2">High Intent</div>
                                        </td>
                                        <td className="px-10 py-10 text-right">
                                            <button className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-gray-500 group-hover:text-blue-400 group-hover:bg-white/10 transition-all shadow-xl">
                                                <ChevronRight size={22} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leads;
