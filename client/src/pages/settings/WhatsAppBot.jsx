import React, { useState, useEffect } from 'react';
import { Bot, Key, Shield, Zap, Lock, ChevronRight, Activity, ArrowUpRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppBot = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [businessId, setBusinessId] = useState(null);
    const [plan, setPlan] = useState('free');

    const [config, setConfig] = useState({
        isActive: false,
        phoneNumberId: '',
        verifyToken: '',
        accessToken: '',
        knowledgeBase: ''
    });

    useEffect(() => {
        fetchBusiness();
    }, []);

    const fetchBusiness = async () => {
        try {
            const { data } = await api.get('/business/my');
            setBusinessId(data._id);
            setPlan(data.plan || 'free');
            if (data.whatsappConfig) {
                setConfig(data.whatsappConfig);
            }
        } catch (error) {
            console.error("Failed to load business data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/business/${businessId}`, {
                whatsappConfig: config
            });
            alert("WhatsApp Node synchronized successfully!");
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse italic">Initializing Bot Protocol...</div>
        </div>
    );

    const isPro = plan === 'pro' || plan === 'enterprise' || plan === 'starter';

    return (
        <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Noir Paywall Overlay — High Intensity */}
            {!isPro && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-12 bg-white/40 backdrop-blur-[24px] rounded-[48px] border-2 border-dashed border-[#12131a]/10">
                    <div className="w-32 h-32 bg-[#12131a] rounded-[40px] flex items-center justify-center mb-10 shadow-2xl relative group/gate">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl opacity-0 group-hover/gate:opacity-100 transition-opacity" />
                        <Bot size={56} className="text-white relative z-10 animate-pulse" />
                    </div>
                    <h2 className="text-4xl font-black text-[#12131a] mb-6 uppercase tracking-tighter italic text-center leading-none">
                        Autonomous <span className="text-blue-500">Pipeline</span> Locked
                    </h2>
                    <p className="text-[#12131a]/60 text-center max-w-lg font-bold leading-relaxed mb-12 uppercase italic tracking-tight text-sm">
                        The WhatsApp Central Alpha Agent is exclusively available for <span className="text-[#12131a] underline decoration-blue-500 underline-offset-4">PRO SECTOR</span> authorities. Elevate your nexus to deploy native Meta AI agents and capture high-intent signals instantly.
                    </p>
                    <button className="h-18 px-14 bg-[#12131a] text-white font-black uppercase tracking-[0.3em] rounded-[28px] shadow-2xl hover:bg-blue-600 transition-all active:scale-95 text-[11px] flex items-center gap-4">
                        UPGRADE INTELLIGENCE TIER <Zap size={18} className="fill-current" />
                    </button>
                </div>
            )}

            <div className={cn(
                "space-y-10 transition-all duration-1000",
                !isPro ? 'opacity-20 pointer-events-none select-none grayscale blur-md' : ''
            )}>
                {/* Noir WhatsApp Header */}
                <div className="mb-12 px-2">
                    <div className="flex items-center gap-4 mb-4">
                         <div className="px-3 py-1 bg-[#12131a] text-blue-500 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 flex items-center gap-2 shadow-2xl">
                             <Bot size={10} className="stroke-[3]" />
                             Neural Node: WhatsApp
                         </div>
                    </div>
                    <h2 className="text-4xl font-black text-[#12131a] tracking-tighter uppercase italic leading-none mb-2">Central Agent</h2>
                    <p className="text-[14px] text-gray-500 font-bold leading-relaxed uppercase italic tracking-tight opacity-70">
                        Deploy an autonomous Meta-linked AI agent to neutralize leads natively within the local messaging network.
                    </p>
                </div>

                {/* Master Toggle — Noir Cinematic Card */}
                <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <Bot size={160} className={config.isActive ? "text-emerald-500" : "text-blue-500"} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="flex items-start gap-8">
                            <div className={cn(
                                "w-20 h-20 rounded-[32px] flex items-center justify-center transition-all duration-700 shadow-2xl",
                                config.isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-white/5 text-gray-600 border border-white/5'
                            )}>
                                <Bot size={32} className={cn("stroke-[2.5]", config.isActive && "animate-pulse")} />
                            </div>
                            <div className="max-w-xl">
                                <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic mb-2">Agent Sync Status</div>
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-3">Deployment Status</h3>
                                <p className="text-[13px] text-gray-500 font-bold uppercase italic tracking-tight opacity-70 leading-relaxed">
                                    When active, NEXIO Alpha will instantly respond to incoming signals on your connected Meta Cloud API account using the sector-specific knowledge base.
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setConfig({ ...config, isActive: !config.isActive })}
                            disabled={!isPro}
                            className={cn(
                                "flex items-center gap-4 px-10 h-18 rounded-[28px] font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-700 shadow-2xl border-2",
                                config.isActive 
                                    ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500 italic drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                                    : 'bg-white/5 border-white/5 text-gray-700'
                            )}
                        >
                            {config.isActive ? 'AGENT ONLINE' : 'AGENT OFFLINE'}
                            <div className={cn(
                                "w-3 h-3 rounded-full transition-all duration-700",
                                config.isActive ? 'bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse' : 'bg-gray-800'
                            )} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
                    {/* Meta Connection Box — Noir Card */}
                    <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                             <Activity size={160} className="text-blue-500" />
                        </div>
                        <div className="flex items-center gap-4 mb-12 relative z-10">
                            <Key size={24} className="text-blue-500 stroke-[2.5]" />
                            <div>
                                 <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Network Link Protocol</div>
                                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Meta Pipeline</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                             <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Signal Node ID (Phone Number ID)</label>
                                    <input
                                        type="text"
                                        value={config.phoneNumberId}
                                        onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
                                        disabled={!isPro}
                                        placeholder="E.g. 104593859203948"
                                        className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 px-8 text-white font-black text-sm italic tracking-tight placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                                    />
                                    <p className="text-[9px] text-gray-600 font-black uppercase italic tracking-widest px-2 opacity-60 flex items-center gap-2">
                                         <ArrowUpRight size={12} className="text-blue-500" /> Retrieve from: Meta App Console &rarr; API Setup
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Neural Master Key (Access Token)</label>
                                    <input
                                        type="password"
                                        value={config.accessToken}
                                        onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                                        disabled={!isPro}
                                        placeholder="EAAI..."
                                        className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 px-8 text-white font-black text-sm italic tracking-tight placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                                    />
                                     <p className="text-[9px] text-gray-600 font-black uppercase italic tracking-widest px-2 opacity-60 mt-4 flex items-center gap-2">
                                         <Lock size={12} className="text-red-500" /> Use Permanent Token via Business Settings &rarr; System Users
                                    </p>
                                </div>
                             </div>

                             <div className="space-y-10">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Verification Signature (Webhook Token)</label>
                                    <input
                                        type="text"
                                        value={config.verifyToken}
                                        onChange={(e) => setConfig({ ...config, verifyToken: e.target.value })}
                                        disabled={!isPro}
                                        placeholder="Your unique webhook signature"
                                        className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 px-8 text-white font-black text-sm italic tracking-tight placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                                    />
                                </div>
                                <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[40px] shadow-2xl relative overflow-hidden group/tip">
                                     <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/tip:opacity-100 transition-opacity" />
                                     <h4 className="text-[11px] font-black text-blue-500 mb-4 flex items-center gap-2 uppercase tracking-[0.3em] italic leading-none">
                                          <Zap size={14} className="stroke-[3]" /> Deployment Protocol
                                     </h4>
                                     <p className="text-[11px] text-gray-500 leading-relaxed font-bold uppercase italic tracking-tight opacity-80 relative z-10">
                                          <span className="text-blue-400">Webhook Sync:</span> Append <code className="bg-white/5 px-2 py-0.5 rounded text-blue-300">/api/webhooks/whatsapp</code> to your absolute server gateway (e.g. your Ngrok proxy or high-fidelity domain) when calibrating the "Callback URL" node in the Meta Console.
                                     </p>
                                </div>
                             </div>
                        </div>

                        <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                             <div className="flex items-center gap-3">
                                  <Shield size={20} className="text-emerald-500 stroke-[2.5]" />
                                  <span className="text-[10px] text-gray-700 font-black uppercase italic tracking-widest">End-to-End Encryption Protocol Active</span>
                             </div>
                             <button 
                                onClick={handleSave} 
                                disabled={saving || !isPro} 
                                className={cn(
                                    "h-16 px-14 rounded-[32px] font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-700 shadow-2xl active:scale-95 flex items-center gap-4",
                                    saving ? 'bg-white/5 text-gray-700' : 'bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700'
                                )}
                            >
                                {saving ? <><RefreshCw size={18} className="animate-spin" /> SYNCHRONIZING...</> : <><Zap size={18} className="fill-current" /> DEPLOY PROTOCOLS</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RefreshCw = ({ className, size }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
);

export default WhatsAppBot;
