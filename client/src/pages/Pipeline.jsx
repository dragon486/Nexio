import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeads, updateLead } from '../services/leadService';
import { 
    Search, Filter, ChevronRight, Activity, 
    Zap, Clock, CheckCircle, ArrowRight, User,
    DollarSign, MoreHorizontal, Target, TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

const STAGES = [
    { id: 'new', label: 'Prospects', color: 'bg-blue-500', icon: Activity },
    { id: 'contacted', label: 'Engaged', color: 'bg-indigo-500', icon: Clock },
    { id: 'qualified', label: 'Qualified', color: 'bg-emerald-500', icon: Target },
    { id: 'converted', label: 'Closed', color: 'bg-[#0066ff]', icon: CheckCircle }
];

const Pipeline = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [draggingId, setDraggingId] = useState(null);
    const navigate = useNavigate();

    const loadLeads = async () => {
        try {
            const data = await getLeads();
            setLeads(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Pipeline: Failed to load leads", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeads();
    }, []);

    const handleMoveLead = async (leadId, newStatus) => {
        // Optimistic update
        const originalLeads = [...leads];
        setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
        
        try {
            await updateLead(leadId, { status: newStatus });
        } catch (err) {
            console.error("Failed to move lead", err);
            setLeads(originalLeads); // Rollback
        }
    };

    const filteredLeads = leads.filter(l => 
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStageTotal = (stageId) => {
        return filteredLeads
            .filter(l => l.status === stageId)
            .reduce((sum, l) => sum + (Number(l.dealSize) || 0), 0);
    };

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse">Synchronizing Node Matrix</span>
                <span className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Optimizing Intelligence Flow...</span>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-700">
            {/* Command Header */}
            <div className="mb-8 p-1">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                             Revenue Command
                        </div>
                        <h2 className="text-4xl font-black tracking-tight dark:text-white uppercase italic leading-none">
                            Active Pipeline
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-[13px] font-medium max-w-xl leading-relaxed mt-2">
                            Global lead orchestration. AI prioritizing high-velocity vectors for immediate capital conversion.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                type="text"
                                placeholder="Search active vectors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white placeholder:opacity-40"
                            />
                        </div>
                        <button className="flex items-center justify-center w-11 h-11 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl text-gray-500 hover:text-blue-500 transition-all">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Kanban Board Container */}
            <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-10 custom-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 scroll-smooth">
                    {STAGES.map((stage) => {
                        const stageLeads = filteredLeads.filter(l => l.status === stage.id);
                        const stageTotal = getStageTotal(stage.id);
                        
                        return (
                            <div key={stage.id} className="flex-shrink-0 w-[300px] flex flex-col">
                                {/* Column Header */}
                                <div className="mb-5 px-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className={cn("w-2 h-2 rounded-full", stage.color, "shadow-[0_0_8px] shadow-current")} />
                                            <span className="text-[11px] font-black dark:text-white uppercase tracking-[0.2em]">{stage.label}</span>
                                        </div>
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded-md text-[9px] font-black text-gray-400 dark:text-gray-500">
                                            {stageLeads.length}
                                        </span>
                                    </div>
                                    <div className="text-[13px] font-black tracking-tight text-gray-400 dark:text-gray-500 pl-4">
                                        ₹{(stageTotal || 0).toLocaleString('en-IN')} <span className="text-[10px] opacity-40 font-bold uppercase tracking-tighter ml-1">Volume</span>
                                    </div>
                                </div>

                                {/* Drop Zone / Column Content */}
                                <div 
                                    className={cn(
                                        "flex-1 min-h-[500px] bg-gray-50/50 dark:bg-white/[0.01] rounded-[32px] p-3 border border-dashed border-gray-200 dark:border-white/5 space-y-4 transition-colors duration-300",
                                        draggingId && "bg-blue-500/[0.02] border-blue-500/20"
                                    )}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const leadId = e.dataTransfer.getData('leadId');
                                        if (leadId) handleMoveLead(leadId, stage.id);
                                        setDraggingId(null);
                                    }}
                                >
                                    <AnimatePresence mode="popLayout">
                                        {stageLeads.map((lead) => (
                                            <motion.div
                                                key={lead._id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('leadId', lead._id);
                                                    setDraggingId(lead._id);
                                                }}
                                                onDragEnd={() => setDraggingId(null)}
                                                className={cn(
                                                    "stat-card !p-5 relative group cursor-grab active:cursor-grabbing hover:scale-[1.02] active:scale-[0.98] transition-all transform-gpu",
                                                    draggingId === lead._id ? "opacity-50 grayscale" : "opacity-100"
                                                )}
                                                onClick={() => navigate(`/dashboard/leads/${lead._id}`)}
                                            >
                                                {/* Header Info */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-blue-600 font-black text-xs shadow-inner">
                                                            {lead.name?.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-xs font-black dark:text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate max-w-[120px]">
                                                                {lead.name}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                <div className="text-[10px] font-black text-gray-400 group-hover:text-gray-900 transition-colors uppercase italic truncate">
                                                                    ₹{(lead.dealSize || 0).toLocaleString('en-IN')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-1.5 text-gray-300 group-hover:text-gray-900 transition-colors">
                                                        <MoreHorizontal size={14} />
                                                    </div>
                                                </div>

                                                {/* Meta Info */}
                                                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.1em] opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex items-center gap-1.5 text-gray-500">
                                                        <Activity size={10} /> Lead Score: {lead.aiScore}%
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-500">
                                                        <Clock size={10} /> {new Date(lead.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                                    </div>
                                                </div>

                                                {/* AI Intelligence Badge (Elevated) */}
                                                {lead.aiScore >= 80 && (
                                                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-500/10 flex items-center gap-2">
                                                        <Zap size={10} className="text-blue-500 fill-current" />
                                                        <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">AI Focus Sector</span>
                                                    </div>
                                                )}
                                                
                                                {/* Hover Glow Effect */}
                                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {stageLeads.length === 0 && (
                                        <div className="h-32 flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-white/5 rounded-3xl opacity-20">
                                            <stage.icon size={20} className="mb-2" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Idle Vector Drop</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Pipeline;
