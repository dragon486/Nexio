import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { User, MoreHorizontal, MessageSquare, Phone, Mail, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { subscribeToLeads, unsubscribeFromLeads } from '../../services/socketService';

const LeadFeed = ({ leads: initialLeads }) => {
    const [leads, setLeads] = useState(initialLeads || []);

    useEffect(() => {
        setLeads(initialLeads || []);
    }, [initialLeads]);

    useEffect(() => {
        const handleNewLead = (newLead) => {
            console.log("⚡️ Real-time lead received:", newLead);
            setLeads(prev => {
                // Prevent duplicates
                if (prev.some(l => l._id === newLead._id)) return prev;
                return [newLead, ...prev].slice(0, 10); // Keep top 10
            });
        };

        subscribeToLeads(handleNewLead);
        return () => unsubscribeFromLeads(handleNewLead);
    }, []);
    return (
        <GlassCard className="h-full flex flex-col p-0 relative border-white/5 overflow-hidden">
            <div className="p-6 pb-2 bg-gradient-to-b from-white/5 to-transparent">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live Feed
                        </h3>
                        <p className="text-[11px] text-muted mt-1 ml-4">Real-time incoming leads and activities</p>
                    </div>
                    <button className="text-muted hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                <AnimatePresence>
                    {leads && leads.map((lead, index) => (
                        <motion.div
                            key={lead.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={`/dashboard/leads/${lead._id}`}
                                className="group flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] transition-all border border-transparent hover:border-white/10"
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-white/10 group-hover:border-white/30 transition-colors">
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div className={cn(
                                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center text-[8px]",
                                        lead.score >= 80 ? "bg-emerald-500 text-black" :
                                            lead.score >= 50 ? "bg-yellow-500 text-black" : "bg-zinc-500 text-white"
                                    )}>
                                        {lead.score}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-white font-medium text-sm truncate group-hover:text-brand-purple transition-colors">{lead.name}</h4>
                                        <span className="text-[10px] text-muted whitespace-nowrap ml-2">{lead.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[11px] text-muted truncate">{lead.company}</span>
                                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider flex items-center gap-1",
                                            lead.status === 'contacted' ? "text-primary" :
                                                lead.status === 'qualified' ? "text-emerald-400" :
                                                    lead.status === 'new' ? "text-blue-400" : "text-zinc-500"
                                        )}>
                                            {lead.status.toUpperCase()}
                                            {lead.isAutoPilotContacted && <Sparkles size={14} className="text-primary animate-pulse" />}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-3 border-t border-white/5 bg-white/[0.02]">
                <Link to="/dashboard/leads" className="block w-full py-2 text-center text-xs font-bold text-muted uppercase tracking-widest hover:text-white transition-colors">
                    View All Activity
                </Link>
            </div>
        </GlassCard>
    );
};

export default LeadFeed;
