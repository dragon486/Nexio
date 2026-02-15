import React, { useEffect, useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { getLeads } from '../services/leadService';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadLeads = async () => {
            const data = await getLeads();
            setLeads(data);
            setLoading(false);
        };
        loadLeads();
    }, []);

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h2 className="text-3xl font-bold">Leads</h2>
                    <p className="text-gray-400">Manage and track your potential customers.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-surface/50 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 text-sm w-64"
                        />
                    </div>
                    <button className="p-2 bg-surface/50 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                        <Filter size={18} className="text-gray-400" />
                    </button>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 text-sm font-medium text-gray-400">Name</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Score</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Priority</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Date</th>
                                <th className="p-4 text-sm font-medium text-gray-400"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading leads...</td></tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No leads found.</td></tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{lead.name}</div>
                                            <div className="text-xs text-gray-500">{lead.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn("px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider", getStatusColor(lead.status))}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-surface rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full", lead.aiScore > 70 ? "bg-emerald-500" : lead.aiScore > 40 ? "bg-yellow-500" : "bg-red-500")}
                                                        style={{ width: `${lead.aiScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium">{lead.aiScore}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn("text-sm font-medium capitalize", getPriorityColor(lead.aiPriority))}>
                                                {lead.aiPriority}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-gray-400 hover:text-white transition-colors">
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
