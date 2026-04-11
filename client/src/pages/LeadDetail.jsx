import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getSocket } from '../services/socketService';

import Button from '../components/ui/Button';
import {
    Mail, Phone, ArrowLeft,
    MessageSquare, Send, Sparkles, AlertCircle, Clock, AlertTriangle, X,
    DollarSign, ChevronRight, Activity, Shield, Zap, Target
} from 'lucide-react';
import { cn } from '../lib/utils';
import { updateLead } from '../services/leadService';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const statuses = [
    { id: 'new', label: 'New Signal', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'contacted', label: 'Syncing', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 'qualified', label: 'Validated', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'converted', label: 'Monetized', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    { id: 'lost', label: 'Neutralized', color: 'text-gray-500 bg-white/5 border-white/10' }
];

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [sending, setSending] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [directMessage, setDirectMessage] = useState("");
    const [alert, setAlert] = useState(null); 
    const scrollRef = React.useRef(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [lead?.conversationHistory]);

    const fetchLead = async (isMounted = true) => {
        try {
            const res = await api.get(`/leads/${id}`);
            if (isMounted) {
                setLead(res.data);
            }
        } catch (error) {
            console.error("Failed to load lead", error);
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        let isMounted = true;
        fetchLead(isMounted);
        return () => { isMounted = false; };
    }, [id]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleNewMessage = (data) => {
            if (data.leadId === id) {
                setLead(prevLead => {
                    if (!prevLead) return prevLead;
                    return {
                        ...prevLead,
                        conversationHistory: [
                            ...prevLead.conversationHistory,
                            {
                                role: 'user',
                                content: data.content,
                                timestamp: data.timestamp
                            }
                        ]
                    };
                });
            }
        };

        socket.on('new_message', handleNewMessage);
        return () => { socket.off('new_message', handleNewMessage); };
    }, [id]);

    const handleGenerateFollowup = async () => {
        setGenerating(true);
        try {
            const res = await api.post(`/leads/${id}/generate-followup`);
            setLead(res.data);

            if (res.data.aiScore === 0 && (res.data.aiNotes?.includes("Limit") || res.data.aiNotes?.includes("Quota"))) {
                setAlert({
                    title: "Neural Quota Hit ⏳",
                    message: res.data.aiNotes
                });
            }
        } catch (error) {
            console.error("Failed to generate", error);
        } finally {
            setGenerating(false);
        }
    };

    const handleSendMessage = async (content, type = 'whatsapp', subject = '') => {
        if (!content) return;
        setSending(true);
        try {
            const res = await api.post(`/leads/${id}/message`, { content, type, subject });
            setLead(res.data);
            if (type === 'whatsapp' || !type) setDirectMessage("");
            if (type === 'email') {
                setEditingIndex(null);
                setEditContent("");
            }
        } catch (error) {
            console.error("Failed to send message", error);
            setAlert({
                title: "Dispatch Failure",
                message: error.response?.data?.message || "Failed to transmit message through the selected channel."
            });
        } finally {
            setSending(false);
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
            <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse">Loading Profile...</div>
        </div>
    );

    if (!lead) return (
        <div className="p-20 text-center flex flex-col items-center gap-4">
             <AlertTriangle size={48} className="text-red-500 animate-pulse" />
             <div className="text-xl font-black text-[#12131a] uppercase tracking-widest italic leading-none">Signal Lost</div>
             <p className="text-gray-400 font-bold uppercase text-[11px] tracking-widest">Lead profile not found in current operational sector.</p>
        </div>
    );

    const fallbackEmailDraft = lead.aiResponse?.emailBody || lead.aiResponse?.email || '';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] w-full mx-auto pb-36 md:pb-20 px-4 overflow-x-hidden">
            {/* AI Limit Alert Popup — Noir Glass */}
            <AnimatePresence>
                {alert && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md" 
                            onClick={() => setAlert(null)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                        >
                            <div className="bg-[#12131a] border border-white/10 rounded-[48px] p-12 max-w-md w-full shadow-2xl relative overflow-hidden text-center">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                                <button onClick={() => setAlert(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
                                
                                <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-[32px] flex items-center justify-center text-blue-500 mb-10 mx-auto shadow-2xl">
                                    <AlertTriangle size={48} className="stroke-[2.5]" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic leading-none">{alert.title}</h3>
                                <p className="text-gray-400 mb-12 leading-relaxed font-bold text-sm uppercase tracking-tight italic opacity-70">{alert.message}</p>
                                <button 
                                    className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-2xl shadow-blue-500/20 transition-all active:scale-95"
                                    onClick={() => setAlert(null)}
                                >
                                    Confirm Reception
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Command Header — Noir Style */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16">
                <div className="flex flex-col md:flex-row items-center gap-8 w-full lg:w-auto">
                    <button onClick={() => navigate('/dashboard/leads')} className="w-16 h-16 shrink-0 flex items-center justify-center bg-white dark:bg-[#12131a] text-gray-900 dark:text-white rounded-[24px] shadow-sm dark:shadow-2xl border border-gray-200 dark:border-white/10 group hover:bg-blue-50 dark:hover:bg-blue-600 transition-all">
                        <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform stroke-[2.5]" />
                    </button>
                    <div className="flex-1 w-full text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                             <div className="px-3 py-1 bg-blue-500/10 dark:bg-[#12131a] text-blue-600 dark:text-blue-500 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-blue-200 dark:border-white/5 flex items-center gap-2">
                                 <Activity size={10} className="stroke-[3]" />
                                 Active Lead
                             </div>
                             <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Clock size={12} className="text-blue-500" /> Captured {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                             </div>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none truncate max-w-3xl">{lead.name}</h1>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="flex bg-white dark:bg-[#12131a] p-2 rounded-[28px] border border-gray-200 dark:border-white/5 gap-2 shadow-sm dark:shadow-2xl w-full sm:w-auto overflow-x-auto no-scrollbar">
                        {statuses.map(s => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    handleUpdateStatus(s.id);
                                }}
                                className={cn(
                                    "px-6 py-2.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.15em] whitespace-nowrap",
                                    lead.status === s.id
                                        ? "bg-gray-100/80 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm dark:shadow-lg"
                                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                )}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleGenerateFollowup} 
                        disabled={generating} 
                        className="w-full sm:w-auto h-16 bg-white dark:bg-[#12131a] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-[28px] px-10 text-[11px] font-black uppercase tracking-[0.2em] shadow-sm dark:shadow-2xl hover:bg-gray-50 dark:hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {generating ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} className="text-blue-400" />}
                        {generating ? 'Updating...' : 'Refresh AI Analysis'}
                    </button>
                </div>
            </div>

            {/* Safety Lockout Banner */}
            {lead.requiresReview && (
                <div className="bg-[#12131a] border border-red-500/20 rounded-[40px] p-8 mb-12 flex flex-col md:flex-row gap-8 items-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Shield size={120} className="text-red-500" />
                    </div>
                    <div className="w-20 h-20 bg-red-500/10 border border-red-500/10 rounded-[32px] flex items-center justify-center text-red-500 shrink-0">
                        <AlertTriangle size={40} className="animate-pulse stroke-[2.5]" />
                    </div>
                    <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">Security Lockout Active</h3>
                            <div className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-black uppercase rounded tracking-widest">Purged</div>
                        </div>
                        <p className="text-[14px] text-gray-500 font-bold leading-relaxed uppercase italic tracking-tight opacity-80">
                            Neural sequences detected instruction drift. Automated dispatch neutralized to prevent hallucination propagation. Manual review required for override.
                        </p>
                    </div>
                    <button
                        className="relative z-10 h-14 px-8 bg-white text-[#12131a] rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-500 hover:text-white transition-all shadow-xl"
                        onClick={() => handleSendMessage(fallbackEmailDraft, "email", lead.aiResponse?.emailSubject)}
                    >
                        Force Vector
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start mt-12">
                {/* Profiler Column */}
                <div className="lg:col-span-1 space-y-10 lg:sticky lg:top-8">
                    {/* Identity Matrix — Noir */}
                    <div className="bg-white dark:bg-[#12131a] border border-gray-200 dark:border-white/5 rounded-[48px] p-10 shadow-lg dark:shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                             <Target size={140} className="text-blue-500" />
                        </div>
                        
                        <div className="flex flex-col items-center mb-12 relative z-10">
                            <div className="w-28 h-28 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[36px] flex items-center justify-center text-5xl font-black text-blue-500 shadow-sm dark:shadow-2xl mb-8 group-hover:scale-105 transition-transform duration-500">
                                {lead.name.charAt(0)}
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-tight text-center">{lead.name}</h2>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[28px] p-6 shadow-inner text-center group/val hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                                <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black mb-4 flex items-center justify-center gap-2">
                                    <DollarSign size={14} className="stroke-[3]" /> Deal Size / Value
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-emerald-500 font-black text-3xl italic">₹</span>
                                    <input
                                        type="number"
                                        value={lead.dealSize || ""}
                                        onChange={(e) => setLead({ ...lead, dealSize: e.target.value })}
                                        onBlur={(e) => {
                                            const val = e.target.value;
                                            const nextDealSize = val === '' ? 0 : Number(val);
                                            if (!Number.isNaN(nextDealSize)) {
                                                updateLead(id, { dealSize: nextDealSize }).then(setLead);
                                            }
                                        }}
                                        placeholder="0"
                                        className="bg-transparent border-none text-4xl font-black text-gray-900 dark:text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-gray-300 dark:placeholder:text-white/5 text-center italic tracking-tighter"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 px-2">
                                <a href={`mailto:${lead.email}`} className="flex items-center gap-4 text-gray-500 hover:text-blue-400 transition-all group/link">
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover/link:bg-blue-500 text-white transition-all shadow-lg border border-white/5">
                                        <Mail size={16} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest truncate">{lead.email}</span>
                                </a>
                                {lead.phone && (
                                    <div className="flex items-center gap-4 text-gray-500 hover:text-emerald-400 transition-all group/link">
                                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover/link:bg-emerald-500 text-white transition-all shadow-lg border border-white/5">
                                            <Phone size={16} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">{lead.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-10 border-t border-white/5">
                                <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Initial Inquiry</div>
                                <div className="text-sm text-gray-400 font-bold leading-relaxed italic bg-white/5 p-6 rounded-[24px] border border-white/5 shadow-inner opacity-80 overflow-hidden line-clamp-4 hover:line-clamp-none transition-all">
                                    "{lead.message}"
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Wisdom */}
                    <div className="bg-white dark:bg-[#12131a] border border-gray-200 dark:border-white/5 rounded-[48px] p-10 shadow-lg dark:shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-blue-50 group-hover:text-blue-100 dark:text-blue-500/5 dark:group-hover:text-blue-500/10 transition-colors">
                             <Sparkles size={140} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-10 flex items-center gap-3 tracking-tighter uppercase leading-none relative z-10">
                            <Sparkles size={20} className="text-blue-500 stroke-[2.5]" /> AI Analysis
                        </h3>

                        <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
                            <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-[24px] shadow-inner text-center flex flex-col justify-center">
                                <div className="text-4xl font-black text-blue-500 tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] leading-none">
                                    {lead.aiScore === null ? '--' : lead.aiScore}
                                </div>
                                <div className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-3">Intent Score</div>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-6 rounded-[24px] shadow-inner text-center flex flex-col justify-center">
                                <div className={cn("text-lg font-black tracking-tighter uppercase leading-none", 
                                    lead.aiPriority === 'high' ? 'text-red-500' : 
                                    lead.aiPriority === 'medium' ? 'text-amber-500' : 'text-blue-400'
                                )}>
                                    {lead.aiPriority}
                                </div>
                                <div className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-3">Priority</div>
                            </div>
                        </div>

                        <div className={cn(
                            "bg-white/5 border rounded-[28px] p-6 shadow-inner relative z-10",
                            lead.aiNotes?.includes('LIMIT') ? "border-red-500/30" : "border-white/5"
                        )}>
                            <p className="text-[13px] leading-relaxed font-bold tracking-tight text-gray-400 opacity-80">
                                {lead.aiNotes || "AI analysis pending."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timeline Column */}
                <div className="lg:col-span-3 space-y-8 flex flex-col">
                    <div className="bg-white dark:bg-[#12131a] border border-gray-200 dark:border-white/5 rounded-[48px] shadow-lg dark:shadow-2xl flex flex-col min-h-[800px] lg:h-[calc(100vh-200px)] overflow-hidden">
                        <div className="p-8 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 dark:bg-[#0a0b0f] z-10">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3 uppercase">
                                <MessageSquare size={20} className="text-blue-500" /> Conversation History
                            </h3>
                            {lead.memorySummary && (
                                <div className="flex items-center gap-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 px-4 py-2 rounded-full shadow-inner max-w-sm">
                                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 truncate flex-1">
                                        <b className="text-gray-900 dark:text-white">Summary:</b> {lead.memorySummary}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div ref={scrollRef} className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto custom-scrollbar scroll-smooth relative isolate bg-white dark:bg-[#0a0b0f]">
                            
                            {/* Captured Intent (Initial Signal) */}
                            <div className="flex justify-center mb-8">
                                <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <Target size={12} className="text-blue-500" />
                                    Lead Captured • {formatDistanceToNow(new Date(lead.createdAt))} ago
                                </div>
                            </div>
                            
                            <div className="flex flex-col space-y-6 w-full">
                                <div className="flex justify-start">
                                    <div className="flex gap-3 max-w-[90%] md:max-w-[75%]">
                                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300 uppercase shrink-0 mt-1">
                                            {lead.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col gap-1 items-start">
                                            <div className="text-[10px] text-gray-500 font-bold ml-1">{lead.name}</div>
                                            <div className="bg-[#1a1b23] border border-white/5 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm text-sm text-gray-200 leading-relaxed">
                                                "{lead.message}"
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            {/* Conversation Dynamics */}
                            {lead.conversationHistory?.map((item, i) => {
                                const isAI = item.role === 'model' || item.role === 'assistant';
                                let aiData = null;
                                if (isAI) try { aiData = JSON.parse(item.content); } catch { /* Raw content */ }

                                return (
                                    <div key={i} className={`flex ${isAI ? 'justify-end' : 'justify-start'} w-full animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        <div className={`flex gap-3 max-w-[90%] md:max-w-[75%] ${isAI ? 'flex-row-reverse' : 'flex-row'}`}>
                                            
                                            {/* Avatar */}
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-md text-xs font-bold",
                                                isAI ? "bg-blue-600 text-white" : "bg-white/10 border border-white/10 text-gray-300 uppercase"
                                            )}>
                                                {isAI ? <Sparkles size={14} /> : lead.name.charAt(0)}
                                            </div>

                                            {/* Bubble & Metadata */}
                                            <div className={`flex flex-col gap-1 ${isAI ? 'items-end' : 'items-start'}`}>
                                                
                                                <div className="text-[10px] text-gray-500 font-bold flex gap-2 items-center px-1">
                                                    {isAI ? 'Alpha AI' : lead.name}
                                                    <span className="opacity-50">•</span>
                                                    <span>{item.timestamp ? formatDistanceToNow(new Date(item.timestamp)) : 'Active'}</span>
                                                </div>

                                                {aiData ? (
                                                    <div className="flex flex-col gap-3 items-end w-full">
                                                        {/* Widget chat response as bubble */}
                                                        {aiData.chatResponse && (
                                                            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-sm text-sm leading-relaxed">
                                                                {aiData.chatResponse}
                                                            </div>
                                                        )}
                                                        {/* Legacy fallback if no chatResponse but aiData exists */}
                                                        {!aiData.chatResponse && !aiData.emailBody && !aiData.whatsapp && (
                                                             <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-sm text-sm leading-relaxed">
                                                                 Processing lead interaction...
                                                             </div>
                                                        )}

                                                        {/* Formal Email Draft Block (Styled as a CRM Attachment Card) */}
                                                        {aiData.emailBody && (
                                                            <div className="bg-white dark:bg-[#12131a] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-lg w-full max-w-lg mt-1 text-left">
                                                                <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-white/5 pb-3">
                                                                    <div className="text-[10px] text-blue-400 uppercase tracking-widest font-black flex items-center gap-2">
                                                                        <Mail size={12} /> Email Follow-up Draft
                                                                    </div>
                                                                    {aiData.autoSent && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">SENT</span>}
                                                                </div>
                                                                
                                                                {editingIndex === i ? (
                                                                     <div className="space-y-4">
                                                                         <textarea
                                                                             value={editContent}
                                                                             onChange={(e) => setEditContent(e.target.value)}
                                                                             className="w-full bg-[#0a0b0f] border border-white/10 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:border-blue-500 min-h-[160px]"
                                                                         />
                                                                         <div className="flex justify-end gap-3 text-xs">
                                                                             <button onClick={() => setEditingIndex(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-bold">Cancel</button>
                                                                             <button onClick={() => handleSendMessage(editContent, "email", aiData.emailSubject)} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-500 transition-colors">Send Email</button>
                                                                         </div>
                                                                     </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="text-sm text-gray-800 dark:text-gray-300 font-medium whitespace-pre-wrap leading-relaxed opacity-90">{aiData.emailBody}</div>
                                                                        {!aiData.autoSent && (
                                                                            <div className="mt-4 flex gap-3 text-xs">
                                                                                <button onClick={() => handleSendMessage(aiData.emailBody, "email", aiData.emailSubject)} className="px-5 py-2 bg-blue-600 dark:bg-white text-white dark:text-black font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-sm">Send Email</button>
                                                                                <button onClick={() => { setEditingIndex(i); setEditContent(aiData.emailBody); }} className="px-5 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/10">Edit</button>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* WhatsApp Draft Block */}
                                                        {aiData.whatsapp && !aiData.chatResponse && (
                                                            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-5 shadow-lg w-full max-w-lg mt-1 text-left">
                                                                <div className="text-[10px] text-emerald-600 dark:text-emerald-500 uppercase tracking-widest font-black flex items-center gap-2 mb-3">
                                                                    <MessageSquare size={12} /> WhatsApp Draft
                                                                </div>
                                                                <div className="text-sm text-emerald-900 dark:text-emerald-50/90 font-medium leading-relaxed">{aiData.whatsapp}</div>
                                                                {!aiData.autoSent && (
                                                                    <button onClick={() => handleSendMessage(aiData.whatsapp, "whatsapp")} className="mt-4 px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-colors text-xs shadow-sm">Send Message</button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className={cn(
                                                        "px-5 py-3.5 shadow-sm text-sm leading-relaxed",
                                                        isAI 
                                                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                                                            : "bg-gray-100 dark:bg-[#1a1b23] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-gray-200 rounded-2xl rounded-tl-sm cursor-text selection:bg-blue-500/30"
                                                    )}>
                                                        {item.content}
                                                    </div>
                                                )}
                                                
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            </div>
                        </div>

                        {/* Standard Message Input */}
                        <div className="p-6 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0a0b0f] z-10 shrink-0">
                            <div className="relative group max-w-5xl mx-auto flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Type your message here..."
                                    value={directMessage}
                                    onChange={(e) => setDirectMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && directMessage && handleSendMessage(directMessage)}
                                    className="flex-1 bg-white dark:bg-[#1a1b23] border border-gray-300 dark:border-white/10 rounded-2xl py-4 flex-wrap pl-6 pr-6 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                                    disabled={sending}
                                />
                                <button
                                    onClick={() => directMessage && handleSendMessage(directMessage)}
                                    disabled={sending || !directMessage}
                                    className="w-14 h-14 bg-blue-600 text-white flex-shrink-0 flex items-center justify-center rounded-2xl hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={20} className="stroke-[2.5]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mobile Strategic Bar */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
                 <button 
                    onClick={handleGenerateFollowup} 
                    disabled={generating} 
                    className="w-full h-18 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_20px_50px_rgba(59,130,246,0.5)] flex items-center justify-center gap-4 active:scale-95 py-6"
                 >
                    {generating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    {generating ? 'ANALYZING VECTOR...' : 'SYNC INTELLIGENCE'}
                 </button>
            </div>
        </div>
    );
};

export default LeadDetail;
