import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getSocket } from '../services/socketService';

import Button from '../components/ui/Button';
import {
    User, Mail, Phone, Calendar, ArrowLeft,
    MessageSquare, Send, Sparkles, AlertCircle, CheckCircle, Clock, AlertTriangle, X,
    DollarSign
} from 'lucide-react';
import { cn } from '../lib/utils';
import { updateLead } from '../services/leadService';

const statuses = [
    { id: 'new', label: 'New', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    { id: 'contacted', label: 'Contacted', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
    { id: 'qualified', label: 'Qualified', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    { id: 'converted', label: 'Converted', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    { id: 'lost', label: 'Lost', color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' }
];
import { formatDistanceToNow } from 'date-fns';

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
    const [alert, setAlert] = useState(null); // { title: string, message: string }
    const scrollRef = React.useRef(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    // Auto-scroll on new messages or generation
    useEffect(() => {
        scrollToBottom();
    }, [lead?.conversationHistory]);

    const fetchLead = async () => {
        try {
            const res = await api.get(`/leads/${id}`);
            setLead(res.data);
        } catch (error) {
            console.error("Failed to load lead", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLead();
    }, [id]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleNewMessage = (data) => {
            // Only update if the incoming message is for the lead currently being viewed
            if (data.leadId === id) {
                setLead(prevLead => {
                    if (!prevLead) return prevLead;
                    return {
                        ...prevLead,
                        conversationHistory: [
                            ...prevLead.conversationHistory,
                            {
                                role: 'user', // Incoming syncs from leads are user role
                                content: data.content,
                                timestamp: data.timestamp
                            }
                        ]
                    };
                });
            }
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [id]);

    const handleGenerateFollowup = async () => {
        setGenerating(true);
        try {
            const res = await api.post(`/leads/${id}/generate-followup`);
            setLead(res.data);

            // Trigger high-impact alert for BOTH burst and daily limits
            if (res.data.aiScore === 0 && (res.data.aiNotes?.includes("Limit") || res.data.aiNotes?.includes("Quota"))) {
                setAlert({
                    title: "AI Rate Limit Hit ⏳",
                    message: res.data.aiNotes
                });
            } else if (res.data.aiScore === null) {
                // Subtle feedback for general processing errors
                console.warn("AI Generation failed due to a general processing error.");
                // The aiNotes will appear in the reasoning box automatically via setLead(res.data)
            }
        } catch (error) {
            console.error("Failed to generate", error);
        } finally {
            setGenerating(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            const updated = await updateLead(id, { status: newStatus });
            setLead(updated);
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD', 
            maximumFractionDigits: 0 
        }).format(val || 0);
    };

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">Decrypting Lead Intelligence...</div>
        </div>
    );
    if (!lead) return <div className="p-20 text-center text-muted-foreground font-bold">Lead profile not found in current sector.</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20">
            {/* AI Limit Alert Popup */}
            {alert && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in duration-300">
                    <div className="bg-surface border border-blue-500/30 rounded-[32px] p-10 max-w-md w-full shadow-[0_0_100px_rgba(59,130,246,0.2)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                        <button onClick={() => setAlert(null)} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"><X size={24} /></button>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center text-blue-500 mb-8 animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                <AlertTriangle size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-foreground mb-3 tracking-tighter uppercase italic">{alert.title}</h3>
                            <p className="text-muted-foreground mb-10 leading-relaxed font-medium">{alert.message}</p>
                            <Button variant="primary" className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl border-none shadow-lg shadow-blue-500/20" onClick={() => setAlert(null)}>ACKNOWLEDGE</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Command Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-surface/20 backdrop-blur-xl p-6 rounded-[32px] border border-surface-border">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/dashboard/leads')} className="w-12 h-12 flex items-center justify-center bg-surface-soft hover:bg-surface rounded-2xl transition-all border border-surface-border group active:scale-90">
                        <ArrowLeft size={20} className="text-muted-foreground group-hover:text-foreground group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none truncate max-w-md">{lead.name}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="text-[10px] text-foreground/50 font-black uppercase tracking-[0.2em] flex items-center gap-1.5 bg-surface-soft px-2.5 py-1 rounded-full border border-surface-border">
                                <Clock size={10} className="text-blue-500" /> Signal {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                            </div>
                            <div className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] flex items-center gap-1.5 bg-blue-500/5 px-2.5 py-1 rounded-full border border-blue-500/10">
                                <Sparkles size={10} /> Origin: {lead.source}
                            </div>
                            {lead.isSample && (
                                <div className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] flex items-center gap-1.5 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)] animate-pulse">
                                    🧪 Sample Data
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 flex-1 justify-end">
                    <div className="flex bg-surface-soft p-1.5 rounded-2xl border border-surface-border gap-1.5 shadow-inner overflow-x-auto max-w-full">
                        {statuses.map(s => (
                            <button
                                key={s.id}
                                onClick={() => handleUpdateStatus(s.id)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[9px] font-black transition-all uppercase tracking-widest whitespace-nowrap border border-transparent",
                                    lead.status === s.id
                                        ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] border-white/10"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                )}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                    <Button variant="primary" onClick={handleGenerateFollowup} disabled={generating} className="bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 text-[10px] font-black uppercase tracking-[0.2em] px-8 h-12 border-none rounded-2xl text-white">
                        {generating ? <><Sparkles className="animate-spin mr-2" size={14} /> ANALYZING...</> : <><Sparkles className="mr-2" size={14} /> SYNC INTELLIGENCE</>}
                    </Button>
                </div>
            </div>

            {/* Safety Lockout Banner */}
            {lead.requiresReview && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-[28px] p-6 flex gap-6 items-center animate-in slide-in-from-top-4 duration-500 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                    <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 shrink-0 shadow-inner">
                        <AlertTriangle size={28} className="animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-black text-foreground uppercase tracking-tighter italic">Autonomous Safety Protocol Active</h3>
                            <div className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase rounded tracking-[0.2em]">Blocked</div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">NEXIO identified critical instruction leakage or malformed logic in the generated dispatch. Automated sending has been locked to prevent hallucination propagation.</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {lead.safetyFlags?.map((flag, idx) => (
                                <span key={idx} className="bg-red-500/10 text-red-400 text-[9px] font-black px-3 py-1 rounded-full border border-red-500/20 uppercase tracking-widest leading-none">
                                    {flag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 uppercase font-black tracking-widest text-[10px] px-6 h-12 rounded-2xl"
                        onClick={() => handleSendMessage(lead.aiResponse?.email, "email")}
                    >
                        Force Deploy Fallback
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Profiler Column */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Identity Matrix */}
                    <div className="bg-surface/30 backdrop-blur-xl border border-surface-border rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700" />
                        
                        <div className="flex flex-col items-center mb-10">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] flex items-center justify-center text-4xl font-black text-white border-2 border-white/10 shadow-[0_20px_40px_rgba(59,130,246,0.3)] mb-6 transition-transform group-hover:scale-110">
                                {lead.name.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">{lead.name}</h2>
                            <div className="mt-3 flex items-center gap-2">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/5 shadow-inner",
                                    statuses.find(s => s.id === lead.status)?.color || 'bg-surface-border text-muted-foreground'
                                )}>
                                    {lead.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 shadow-inner group/val hover:bg-emerald-500/10 transition-all">
                                <div className="text-[9px] uppercase tracking-[0.2em] text-emerald-500 font-black mb-2 flex items-center gap-2 italic">
                                    <DollarSign size={12} /> Estimated ROI
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-400 font-black text-2xl">$</span>
                                    <input
                                        type="number"
                                        value={lead.dealSize || ""}
                                        onChange={(e) => setLead({ ...lead, dealSize: e.target.value })}
                                        onBlur={(e) => handleUpdateDealSize(e.target.value)}
                                        placeholder="0"
                                        className="bg-transparent border-none text-3xl font-black text-foreground focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-foreground/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 px-2">
                                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/link">
                                    <div className="w-8 h-8 rounded-xl bg-surface-soft flex items-center justify-center group-hover/link:bg-blue-500/20 transition-all">
                                        <Mail size={14} className="group-hover/link:text-blue-400" />
                                    </div>
                                    <a href={`mailto:${lead.email}`} className="text-sm font-bold tracking-tight truncate">{lead.email}</a>
                                </div>
                                {lead.phone && (
                                    <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/link">
                                        <div className="w-8 h-8 rounded-xl bg-surface-soft flex items-center justify-center group-hover/link:bg-blue-500/20 transition-all">
                                            <Phone size={14} className="group-hover/link:text-blue-400" />
                                        </div>
                                        <span className="text-sm font-bold tracking-tight">{lead.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-8 border-t border-surface-border">
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 italic">Original Signal</div>
                                <div className="text-sm text-foreground/80 leading-relaxed italic bg-surface-soft p-4 rounded-2xl border border-surface-border shadow-inner">
                                    "{lead.message}"
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Intelligence Deck */}
                    <div className="bg-surface/30 backdrop-blur-xl border border-blue-500/20 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 text-blue-500/5 group-hover:text-blue-500/10 transition-colors">
                            <Sparkles size={120} />
                        </div>
                        <h3 className="text-xl font-black text-foreground mb-8 flex items-center gap-3 tracking-tighter uppercase italic">
                            <Sparkles size={20} className="text-blue-500" /> AI Deck
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-surface-soft border border-surface-border p-4 rounded-2xl shadow-inner text-center">
                                <div className="text-4xl font-black text-blue-600 tracking-tighter">
                                    {lead.aiScore === null ? '--' : lead.aiScore}
                                </div>
                                <div className="text-[9px] text-foreground/50 font-black uppercase tracking-[0.2em] mt-1">Alpha Score</div>
                            </div>
                            <div className="bg-surface-soft border border-surface-border p-4 rounded-2xl shadow-inner text-center">
                                <div className={`text-xl font-black tracking-tighter uppercase italic ${lead.aiPriority === 'high' ? 'text-red-600' :
                                    lead.aiPriority === 'medium' ? 'text-amber-600' :
                                        'text-blue-600'
                                    }`}>
                                    {lead.aiPriority}
                                </div>
                                <div className="text-[9px] text-foreground/50 font-black uppercase tracking-[0.2em] mt-1">Priority</div>
                            </div>
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-5 shadow-inner">
                            <div className="text-[9px] font-black text-blue-500 mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                                <AlertCircle size={10} /> Neural Reasoning
                            </div>
                            <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                                {lead.aiNotes || "Analytic core pending synchronization."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timeline Column */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-surface/30 backdrop-blur-xl border border-surface-border rounded-[40px] shadow-2xl flex flex-col min-h-[700px]">
                        <div className="p-8 border-b border-surface-border flex items-center justify-between bg-surface-soft/20">
                            <h3 className="text-xl font-black text-foreground flex items-center gap-3 tracking-tighter uppercase italic">
                                <MessageSquare size={22} className="text-blue-500" /> Intelligence Timeline
                            </h3>
                            {lead.memorySummary && (
                                <div className="flex items-center gap-3 bg-blue-500/5 border border-blue-500/10 px-5 py-2 rounded-2xl shadow-inner">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">
                                        Context: {lead.memorySummary}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div ref={scrollRef} className="flex-1 p-8 space-y-8 overflow-y-auto max-h-[700px] custom-scrollbar scroll-smooth">
                            {/* Entry Point */}
                            <div className="flex justify-start">
                                <div className="max-w-[85%] bg-surface-soft/50 border border-surface-border rounded-[28px] rounded-tl-none p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-surface-soft border border-surface-border flex items-center justify-center text-xs font-black text-muted-foreground uppercase">{lead.name.charAt(0)}</div>
                                        <div>
                                            <div className="text-[10px] font-black text-foreground uppercase tracking-widest">{lead.name}</div>
                                            <div className="text-[9px] text-foreground/40 uppercase font-bold tracking-tighter">{formatDistanceToNow(new Date(lead.createdAt))} ago • Initial Capture</div>
                                        </div>
                                    </div>
                                    <p className="text-foreground text-base leading-relaxed font-medium ml-11">"{lead.message}"</p>
                                </div>
                            </div>

                            {/* Logical Flow */}
                            {lead.conversationHistory?.map((item, i) => {
                                const isAI = item.role === 'model' || item.role === 'assistant';
                                let aiData = null;
                                if (isAI) {
                                    try { aiData = JSON.parse(item.content); } catch (e) { /* Text content */ }
                                }

                                return (
                                    <div key={i} className={`flex ${isAI ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                        <div className={cn(
                                            "max-w-[85%] rounded-[32px] p-1 shadow-2xl",
                                            isAI ? "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-tr-none" : "bg-surface-soft/50 border border-surface-border rounded-tl-none"
                                        )}>
                                            <div className={cn(
                                                "p-6 rounded-[31px]",
                                                isAI ? "bg-surface rounded-tr-none border border-surface-border/50" : ""
                                            )}>
                                                <div className="flex items-center gap-3 mb-4">
                                                    {isAI ? (
                                                        <div className="w-8 h-8 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center text-white"><Sparkles size={14} /></div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-surface-soft border border-surface-border flex items-center justify-center text-xs font-black text-muted-foreground uppercase">{lead.name.charAt(0)}</div>
                                                    )}
                                                    <div>
                                                        <div className={cn("text-[10px] font-black uppercase tracking-widest", isAI ? 'text-blue-500' : 'text-foreground')}>
                                                            {isAI ? 'NEXIO AUTONOMOUS AI' : lead.name}
                                                        </div>
                                                        <div className="text-[9px] text-foreground/40 uppercase font-bold tracking-tighter">
                                                            {item.timestamp ? formatDistanceToNow(new Date(item.timestamp)) : 'Just now'} ago • Intelligence Sync
                                                        </div>
                                                    </div>
                                                </div>

                                                {aiData ? (
                                                    <div className="space-y-4 ml-11">
                                                        {aiData.email && (
                                                            <div className="bg-surface-soft/30 border border-surface-border/50 p-6 rounded-[24px] shadow-inner group/draft">
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div className="text-[10px] text-blue-500 uppercase tracking-[0.2em] font-black flex items-center gap-2">
                                                                        <Mail size={12} /> Communication Draft
                                                                    </div>
                                                                    {aiData.autoSent && <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-500/20">Auto-Dispatched</span>}
                                                                </div>
                                                                
                                                                {editingIndex === i ? (
                                                                    <div className="space-y-4">
                                                                        <textarea
                                                                            value={editContent}
                                                                            onChange={(e) => setEditContent(e.target.value)}
                                                                            className="w-full bg-black/60 border border-blue-500/30 rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all min-h-[160px] font-medium"
                                                                        />
                                                                        <div className="flex gap-3">
                                                                            <Button onClick={() => handleSendMessage(editContent, "email", aiData.emailSubject)} disabled={sending} className="bg-blue-500 hover:bg-blue-600 font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl">DEPLOY DISPATCH</Button>
                                                                            <Button onClick={() => setEditingIndex(null)} variant="ghost" className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed font-medium">{aiData.email}</p>
                                                                        {!aiData.autoSent && (
                                                                            <div className="mt-6 flex gap-3 transition-all">
                                                                                <Button onClick={() => handleSendMessage(aiData.email, "email", aiData.emailSubject)} variant={null} disabled={sending} className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl border-none shadow-lg shadow-blue-500/20">SEND NOW</Button>
                                                                                <Button onClick={() => { setEditingIndex(i); setEditContent(aiData.email); }} variant={null} className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-500/40 font-black uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl">Edit</Button>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                        {aiData.whatsapp && (
                                                            <div className="bg-emerald-500/5 p-5 rounded-[24px] border border-emerald-500/10 flex items-start gap-4 shadow-inner">
                                                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0"><MessageSquare size={18} /></div>
                                                                <div>
                                                                    <div className="text-[10px] text-emerald-500 uppercase tracking-[0.2em] font-black mb-2 italic">WhatsApp Payload</div>
                                                                    <p className="text-sm text-foreground/90 font-medium leading-relaxed">{aiData.whatsapp}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-base text-foreground/90 font-medium leading-relaxed ml-11 whitespace-pre-wrap">{item.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tactical Input Unit */}
                        <div className="p-8 border-t border-surface-border bg-surface-soft/10">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-blue-500/5 rounded-[28px] blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-700" />
                                <input
                                    type="text"
                                    placeholder="Annotate profile or transmit direct response..."
                                    value={directMessage}
                                    onChange={(e) => setDirectMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && directMessage && handleSendMessage(directMessage)}
                                    className="relative w-full bg-surface-soft border border-surface-border rounded-[28px] py-6 pl-8 pr-20 text-foreground font-bold text-base placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all shadow-2xl"
                                    disabled={sending}
                                />
                                <button
                                    onClick={() => directMessage && handleSendMessage(directMessage)}
                                    disabled={sending || !directMessage}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20 disabled:bg-surface-soft disabled:text-muted-foreground disabled:shadow-none border-none group active:scale-95"
                                >
                                    <Send size={24} className={cn("transition-transform group-hover:translate-x-1", directMessage ? 'animate-pulse' : '')} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;
