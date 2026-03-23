import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { User, MoreHorizontal, MessageSquare, Phone, Mail, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { subscribeToLeads, unsubscribeFromLeads } from '../../services/socketService';

const LeadFeed = ({ leads: initialLeads, isDemo }) => {
    const [leads, setLeads] = useState(initialLeads || []);

    useEffect(() => {
        setLeads(initialLeads || []);
    }, [initialLeads]);

    useEffect(() => {
        if (isDemo) return; // Don't subscribe to real leads in demo mode

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
    }, [isDemo]);

    return (
        <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[12px] h-full flex flex-col p-0 relative shadow-sm transition-all duration-300 overflow-hidden">
            <div className="p-8 pb-4 bg-gradient-to-b from-primary/[0.03] to-transparent">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className={cn(
                                    "absolute inline-flex h-full w-full rounded-full opacity-75",
                                    isDemo ? "bg-primary/40 animate-pulse" : "bg-emerald-400 animate-ping"
                                )}></span>
                                <span className={cn(
                                    "relative inline-flex rounded-full h-2.5 w-2.5",
                                    isDemo ? "bg-primary" : "bg-emerald-500"
                                )}></span>
                            </span>
                            {isDemo ? 'Signal Intelligence' : 'Live Signal Feed'}
                        </h3>
                        <p className="text-[11px] text-muted-foreground mt-2 ml-5 font-bold opacity-60">
                            {isDemo ? 'High-fidelity preview of tactical lead activity' : 'Real-time incoming signal data and autonomous actions'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-2 space-y-3">
                <AnimatePresence>
                    {leads && leads.map((lead, index) => (
                        <motion.div
                            key={lead.id || index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link
                                to={`/dashboard/leads/${lead._id}`}
                                className="group flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/10 hover:border-primary/20 hover:bg-surface-soft/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 active:scale-95"
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-11 h-11 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black border border-border/20 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div className={cn(
                                        "absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-lg border-2 border-background flex items-center justify-center text-[9px] font-black",
                                        lead.score >= 80 ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" :
                                            lead.score >= 50 ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-muted-foreground text-background"
                                    )}>
                                        {lead.score}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-foreground font-black text-sm truncate tracking-tight group-hover:text-primary transition-colors">{lead.name}</h4>
                                        <span className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest whitespace-nowrap ml-3">{lead.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-muted-foreground font-bold tracking-tight opacity-60 truncate">{lead.company}</span>
                                        <div className="w-1 h-1 rounded-full bg-border/40" />
                                        <div className={cn(
                                            "text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5",
                                            lead.status === 'contacted' ? "text-primary" :
                                                lead.status === 'qualified' ? "text-emerald-500" :
                                                    lead.status === 'new' ? "text-blue-500" : "text-muted-foreground"
                                        )}>
                                            {lead.status}
                                            {lead.isAutoPilotContacted && <Sparkles size={11} className="text-primary animate-pulse" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                    <MoreHorizontal size={14} className="text-muted-foreground" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-4 border-t border-border/10 bg-primary/[0.02]">
                <Link to="/dashboard/leads" className="block w-full py-2.5 text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] hover:text-primary transition-all hover:bg-primary/5 rounded-xl">
                    View Strategic Signal Feed
                </Link>
            </div>
        </div>
    );
};

export default LeadFeed;
