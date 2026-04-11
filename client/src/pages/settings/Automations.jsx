import React, { useState, useEffect } from 'react';

import Button from '../../components/ui/Button';
import api from '../../services/api';
import { getMyBusiness, updateBusiness } from '../../services/businessService';
import {
    Cpu, MessageSquare, Zap, Clock, Shield,
    ToggleLeft, ToggleRight, Save, Bot,
    FileText, Database, CheckCircle, Upload,
    ChevronRight, ArrowUpRight, Target, Activity, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const Automations = () => {
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Local state for form to allow instant UI updates
    const [settings, setSettings] = useState({
        knowledgeBase: '',
        autoReply: false,
        applyWorkingHours: false,
        minScoreToAutoReply: 50,
        responseDelay: 5,
        dailyEmailLimit: 50,
        tone: 'professional',
        followupStyle: 'soft',
        schedulingLink: '',
        availabilityInstructions: '',
        workingHours: { start: '09:00', end: '18:00' }
    });

    useEffect(() => {
        loadBusiness();
    }, []);

    const loadBusiness = async () => {
        try {
            const data = await getMyBusiness();
            setBusiness(data);
            if (data.settings) {
                setSettings(prev => ({ ...prev, ...data.settings }));
            }
        } catch (error) {
            console.error("Failed to load business", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateBusiness(business._id, { settings });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadKB = async () => {
        if (!selectedFile || !business) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const { data } = await api.post(`/business/${business._id}/upload-kb`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (data.business.settings) {
                setSettings(prev => ({ ...prev, knowledgeBase: data.business.settings.knowledgeBase }));
            }
            setSelectedFile(null);
            alert("Neural context uploaded successfully!");
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse italic">Decoding Logic Matrix...</div>
        </div>
    );

    const personas = [
        { id: 'friendly', icon: '🤝', label: 'Friendly', desc: 'Warm, approachable, and helpful.' },
        { id: 'professional', icon: '👔', label: 'Professional', desc: 'Concise, formal, and trustworthy.' },
        { id: 'aggressive', icon: '🦈', label: 'Aggressive', desc: 'Direct, persuasive, and high-energy.' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Noir Automation Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                         <div className="px-3 py-1 bg-[#12131a] text-blue-500 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 flex items-center gap-2 shadow-2xl">
                             <Cpu size={10} className="stroke-[3]" />
                             Decision Engine
                         </div>
                    </div>
                    <h2 className="text-4xl font-black text-[#12131a] tracking-tighter uppercase italic leading-none mb-2">Alpha Logic</h2>
                    <p className="text-[14px] text-gray-500 font-bold leading-relaxed uppercase italic tracking-tight opacity-70">
                        Configure autonomous response triggers, persona vectors, and neural safety limits.
                    </p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className={cn(
                        "h-16 px-12 rounded-[28px] font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-700 shadow-2xl relative overflow-hidden group/btn",
                        showSuccess 
                            ? "bg-emerald-500 text-white shadow-emerald-500/30" 
                            : "bg-[#12131a] text-white shadow-black/30 border border-white/10 active:scale-95"
                    )}
                >
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        {saving ? <><Save size={18} className="animate-spin mr-2" /> Saving...</> : showSuccess ? 'LOGIC SYNCED ✅' : <><Save size={18} className="mr-2" /> SAVE LOGIC</>}
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* 1. Master Control — Noir Card */}
                <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <Zap size={140} className="text-blue-500" />
                    </div>
                    <div className="relative z-10 flex items-start justify-between mb-10">
                        <div>
                            <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 italic">Autonomous Mode</div>
                            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic leading-none">Auto-Pilot</h2>
                            <p className="text-[13px] text-gray-500 font-bold uppercase italic tracking-tight opacity-70 leading-relaxed max-w-xs">
                                When enabled, NEXIO Alpha will automatically neutralize leads that meet your criteria.
                            </p>
                        </div>
                        <button
                            onClick={() => handleChange('autoReply', !settings.autoReply)}
                            className={cn(
                                "transition-all duration-700 hover:scale-110 active:scale-95 z-10",
                                settings.autoReply ? 'text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-gray-700'
                            )}
                        >
                            {settings.autoReply ? <ToggleRight size={56} strokeWidth={1.5} /> : <ToggleLeft size={56} strokeWidth={1.5} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {settings.autoReply && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-10 border-t border-white/5 pt-10"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Intelligence Threshold</label>
                                        <span className="text-blue-500 font-black italic tracking-tighter text-lg">{settings.minScoreToAutoReply}% Alpha</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100"
                                        value={settings.minScoreToAutoReply}
                                        onChange={(e) => handleChange('minScoreToAutoReply', parseInt(e.target.value))}
                                        className="w-full accent-blue-500 h-2 bg-white/5 rounded-full appearance-none cursor-pointer border border-white/5 shadow-inner"
                                    />
                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] italic opacity-60">Minimum AI Score required for autonomous dispatch.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Neural Drift Delay</label>
                                        <span className="text-blue-500 font-black italic tracking-tighter text-lg">{settings.responseDelay} Cycles</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="60"
                                        value={settings.responseDelay}
                                        onChange={(e) => handleChange('responseDelay', parseInt(e.target.value))}
                                        className="w-full accent-blue-500 h-2 bg-white/5 rounded-full appearance-none cursor-pointer border border-white/5 shadow-inner"
                                    />
                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] italic opacity-60">Wait interval to simulate human response latency.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 2. Persona Engine — Noir Card */}
                <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Bot size={130} className="text-amber-500" />
                    </div>
                    <div className="relative z-10 flex items-center gap-3 mb-10">
                        <Bot className="text-amber-500 stroke-[2.5]" size={24} />
                        <div>
                             <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Emotional Alignment</div>
                             <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Neural Persona</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                        {personas.map(p => (
                            <div
                                key={p.id}
                                onClick={() => handleChange('tone', p.id)}
                                className={cn(
                                    "cursor-pointer rounded-[32px] p-8 border transition-all duration-500 text-center relative overflow-hidden group/item shadow-2xl",
                                    settings.tone === p.id
                                        ? 'bg-blue-600/20 border-blue-500 text-white'
                                        : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:border-white/10'
                                )}
                            >
                                <div className="text-4xl mb-4 transform transition-transform group-hover/item:scale-110 group-hover/item:rotate-3">{p.icon}</div>
                                <div className="font-black text-[11px] uppercase tracking-[0.1em]">{p.label}</div>
                                {settings.tone === p.id && (
                                     <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-white/[0.02] rounded-[28px] border border-white/5 relative z-10">
                         <p className="text-[11px] text-gray-400 font-bold uppercase italic tracking-tight opacity-70 leading-relaxed text-center">
                              {personas.find(p => p.id === settings.tone)?.desc}
                         </p>
                    </div>

                    <div className="mt-10 pt-10 border-t border-white/5 relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Shield className="text-gray-600" size={20} />
                            <div>
                                <div className="text-[11px] font-black text-white uppercase tracking-tight italic">Daily Vector Limit</div>
                                <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest leading-none mt-1">Maximum dispatches per day</div>
                            </div>
                        </div>
                        <input
                            type="number"
                            value={settings.dailyEmailLimit}
                            onChange={(e) => handleChange('dailyEmailLimit', parseInt(e.target.value))}
                            className="w-24 bg-[#0a0b0f] border border-white/5 rounded-2xl px-5 py-4 text-center text-white font-black italic tracking-tighter focus:outline-none focus:border-blue-500/50 shadow-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Scheduling & Availability — Noir Wide */}
            <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Clock size={160} className="text-amber-500" />
                </div>
                
                <div className="flex items-center gap-4 mb-12 relative z-10">
                    <Clock className="text-amber-500 stroke-[2.5]" size={28} />
                    <div>
                         <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Temporal Constraints</div>
                         <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Scheduling Matrix</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Intelligence Booking Node (Calendly)</label>
                            <div className="relative group">
                                <Zap size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" />
                                <input
                                    type="url"
                                    placeholder="https://calendly.com/nexus-realty"
                                    value={settings.schedulingLink || ''}
                                    onChange={(e) => handleChange('schedulingLink', e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-[28px] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/50 transition-all font-black uppercase text-sm italic tracking-tight placeholder:text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Neural Voice Link (Phone)</label>
                            <div className="relative group">
                                <MessageSquare size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" />
                                <input
                                    type="text"
                                    placeholder="e.g. +91 91234 56789"
                                    value={settings.businessPhone || ''}
                                    onChange={(e) => handleChange('businessPhone', e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-[28px] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/50 transition-all font-black uppercase text-sm italic tracking-tight placeholder:text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Availability Instructions</label>
                            <textarea
                                placeholder="E.g. No demos on Monday mornings. Neutralize all weekend dispatches."
                                value={settings.availabilityInstructions || ''}
                                onChange={(e) => handleChange('availabilityInstructions', e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-[32px] py-8 px-8 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700 min-h-[140px] shadow-inner font-black uppercase text-sm italic tracking-tight leading-relaxed overflow-hidden"
                            />
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-[40px] p-8 shadow-2xl relative group/preview">
                            <h4 className="text-[11px] font-black text-amber-500 mb-6 flex items-center gap-2 uppercase tracking-[0.3em] italic">
                                <Bot size={16} className="stroke-[3]" /> Neural Preview
                            </h4>
                            <div className="bg-[#0a0b0f] rounded-[24px] p-8 text-sm text-gray-300 italic tracking-tight uppercase leading-relaxed shadow-2xl border border-white/5 opacity-90">
                                {settings.schedulingLink ? (
                                    `"I'd love to sync for a strategic demo. You can calibrate a time node that suits you best here: ${settings.schedulingLink}"`
                                ) : (
                                    `"I'd love to show you the Alpha Node in action! When would be a good time for us to connect this week?"`
                                )}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-[40px] p-10 flex flex-col justify-between shadow-inner">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-400"><Clock size={28} className="stroke-[2.5]" /></div>
                                    <div>
                                        <div className="text-[12px] font-black text-white uppercase italic tracking-tight leading-none mb-1">Temporal Duty Cycle</div>
                                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">Apply Working Hours</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleChange('applyWorkingHours', !settings.applyWorkingHours)}
                                    className={cn(
                                        "transition-all duration-700",
                                        settings.applyWorkingHours ? 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-gray-700'
                                    )}
                                >
                                    {settings.applyWorkingHours ? <ToggleRight size={56} strokeWidth={1} /> : <ToggleLeft size={56} strokeWidth={1} />}
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2 italic">Node Open</label>
                                    <input
                                        type="time"
                                        value={settings.workingHours?.start || '09:00'}
                                        onChange={(e) => handleChange('workingHours', { ...settings.workingHours, start: e.target.value })}
                                        className="w-full bg-[#0a0b0f] border border-white/5 rounded-2xl px-6 py-4 text-white text-xs font-black italic tracking-tighter focus:border-blue-500/50 outline-none shadow-2xl appearance-none"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2 italic">Node Close</label>
                                    <input
                                        type="time"
                                        value={settings.workingHours?.end || '18:00'}
                                        onChange={(e) => handleChange('workingHours', { ...settings.workingHours, end: e.target.value })}
                                        className="w-full bg-[#0a0b0f] border border-white/5 rounded-2xl px-6 py-4 text-white text-xs font-black italic tracking-tighter focus:border-blue-500/50 outline-none shadow-2xl appearance-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Global AI Company Brain — Noir Wide */}
            <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Database size={160} className="text-amber-500" />
                </div>
                
                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <Database className="text-amber-500 stroke-[2.5]" size={28} />
                    <div>
                         <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Knowledge Architecture</div>
                         <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Neural Brain</h2>
                    </div>
                </div>
                
                <p className="text-[15px] font-bold text-gray-400 uppercase italic tracking-tight leading-relaxed max-w-3xl mb-12 opacity-80 relative z-10">
                    NEXIO Alpha utilizes <span className="text-blue-500">RAG (Retrieval-Augmented Generation)</span> to ingest your sector-specific intelligence. Neural sequences extract pricing, ROI vectors, and FAQ logic to neutralize lead objections autonomously.
                </p>

                <div className="space-y-10 relative z-10">
                    {/* PDF Uploader — Noir Style */}
                    <div className="p-12 border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-[40px] bg-white/[0.02] transition-all group/upload relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/upload:opacity-100 transition-opacity duration-700" />
                        <div className="flex flex-col items-center justify-center text-center relative z-10">
                            <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/10 rounded-[28px] flex items-center justify-center text-blue-500 mb-8 shadow-2xl group-hover/upload:scale-110 transition-transform">
                                <Upload size={32} className="stroke-[3]" />
                            </div>
                            <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter italic leading-none">Context Ingestion Node</h4>
                            <p className="text-[11px] text-gray-500 font-bold uppercase italic tracking-widest mb-10 opacity-70">Upload PDF knowledge base for autonomous vector alignment.</p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md">
                                <label className="w-full cursor-pointer px-10 h-14 bg-[#0a0b0f] border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-white">
                                    <FileText size={16} />
                                    <span>Select Intelligence</span>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                {selectedFile && <span className="text-[10px] text-blue-500 font-black italic uppercase truncate max-w-[200px]">{selectedFile.name}</span>}
                                <button 
                                    onClick={handleUploadKB}
                                    disabled={!selectedFile || uploading}
                                    className="w-full h-14 px-10 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-blue-700 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                                >
                                    {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Database size={16} />}
                                    {uploading ? "Ingesting..." : "Ingest PDF"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Text Area — Noir Console */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-2">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">System Instructions • Raw Vector Output</label>
                             <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Neural Thread Active</div>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500/5 rounded-[32px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <textarea
                                value={settings.knowledgeBase || ""}
                                onChange={(e) => handleChange('knowledgeBase', e.target.value)}
                                placeholder="E.g. Neural Logic Node 1: Sector focus is HNI Real Estate. Node 2: Pricing floor is INR 4.5 Cr..."
                                className="relative w-full h-80 px-10 py-10 bg-[#0a0b0f] border border-white/5 rounded-[40px] focus:outline-none focus:border-blue-500/50 text-[14px] font-mono font-bold text-gray-500 transition-all resize-none shadow-[inset_0_20px_60px_rgba(0,0,0,0.5)] scrollbar-hide"
                            />
                        </div>
                        <p className="text-[10px] text-gray-700 text-center font-black uppercase italic tracking-widest opacity-60">
                             Direct neural override available. Modify system brain instructions for instant sector-wide alignment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Automations;
