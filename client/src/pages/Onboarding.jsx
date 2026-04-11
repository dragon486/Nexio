
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/ui/Button';
import api from '../services/api';
import { Building2, MessageSquare, Zap, CheckCircle, ArrowRight, Copy, Check, Eye, EyeOff, ShieldCheck, ChevronDown, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const targetAudienceSuggestions = [
    "First-time home buyers and high-net-worth investors",
    "Relocating families and corporate executives",
    "Commercial property investors and retail developers",
    "Young professionals seeking downtown condos",
    "Retirees looking for vacation homes and downsizing"
];

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [businessId, setBusinessId] = useState(null);
    const [copied, setCopied] = useState({ key: false, snippet: false });
    const [showApiKey, setShowApiKey] = useState(false);
    const [industryOpen, setIndustryOpen] = useState(false);
    const [suggestionIndex, setSuggestionIndex] = useState(0);

    const [formData, setFormData] = useState({
        // Step 1: Profile
        industry: 'Real Estate',
        targetAudience: '',
        avgDealSize: '',
        website: '',

        // Step 2: AI Settings
        tone: 'professional',
        followupStyle: 'soft',
    });

    useEffect(() => {
        // Fetch existing business data to get ID
        const fetchBusiness = async () => {
            try {
                const res = await api.get('/business/my');
                if (res.data) {
                    setBusinessId(res.data._id);
                    setFormData(prev => ({
                        ...prev,
                        ...res.data,
                        apiKey: res.data.apiKey,
                        publicKey: res.data.publicKey
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch business", err);
            }
        };
        fetchBusiness();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleCopy = (text, type) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(prev => ({ ...prev, [type]: true }));
        setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (businessId) {
                await api.put(`/business/${businessId}`, {
                    ...formData,
                    settings: {
                        tone: formData.tone,
                        followupStyle: formData.followupStyle
                    },
                    onboardingCompleted: true
                });
            }
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error("Onboarding failed", err);
        } finally {
            setLoading(false);
        }
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-3 mb-10">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-12 bg-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'w-3 bg-[#e5e7eb] dark:bg-[#2a2a2a]'}`} />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Professional Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#3b82f6]/10 blur-[180px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#10b981]/10 blur-[180px] rounded-full animate-pulse-slow" />
            </div>

            <div className="w-full max-w-2xl relative z-10 p-12 bg-white/80 dark:bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-[32px] min-h-[600px] flex flex-col shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] border border-[#e5e7eb] dark:border-[#2a2a2a] transition-all duration-500">
                <StepIndicator />

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-foreground italic tracking-tighter mb-3">
                        {step === 1 && "Business Profile"}
                        {step === 2 && "AI Settings"}
                        {step === 3 && "Connection"}
                    </h1>
                    <p className="text-[15px] text-muted-foreground/90 font-medium max-w-md mx-auto leading-relaxed">
                        {step === 1 && "Help NEXIO understand your target market and typical deal dynamics."}
                        {step === 2 && "Configure the psychological profile and tone of your AI representative."}
                        {step === 3 && "Deploy your capture snippet and bridge the gap to your dashboard."}
                    </p>
                </div>

                <div className="flex-1">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 relative">
                                    <div className="flex justify-between items-center px-1 mb-1">
                                        <label className="text-sm font-semibold text-foreground/90">Industry</label>
                                    </div>
                                    <div onClick={() => setIndustryOpen(!industryOpen)} className="w-full bg-[#fafafa] dark:bg-[#0f0f0f] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-[#3b82f6]/50 transition-all text-[#0f172a] dark:text-[#f8fafc] font-bold shadow-inner group">
                                        <span>{formData.industry || 'Real Estate'}</span>
                                        <ChevronDown size={18} className="text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                    </div>
                                    {industryOpen && (
                                        <div className="absolute top-[86px] left-0 w-full bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                                            <div onClick={() => { setFormData({...formData, industry: 'Real Estate'}); setIndustryOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-[#fafafa] dark:hover:bg-white/5 cursor-pointer flex justify-between items-center text-sm font-bold text-foreground transition-colors group">
                                                <span>Real Estate <span className="text-[10px] text-emerald-500 uppercase tracking-widest ml-2 font-black bg-emerald-500/10 px-2 py-0.5 rounded">Active</span></span>
                                                <Check size={16} className="text-emerald-500" />
                                            </div>
                                            <div className="w-full px-4 py-3 bg-[#f8fafc]/50 dark:bg-[#111111]/50 opacity-60 flex justify-between items-center cursor-not-allowed border-t border-[#e5e7eb] dark:border-[#2a2a2a] group" onClick={() => alert("SaaS support is coming soon! Stay tuned.")}>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground group-hover:text-amber-500 transition-colors">SaaS & Software</span>
                                                    <span className="text-[10px] text-amber-500 uppercase font-black tracking-widest mt-0.5">Coming Soon</span>
                                                </div>
                                                <Lock size={14} className="text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                            </div>
                                            <div className="w-full px-4 py-3 bg-[#f8fafc]/50 dark:bg-[#111111]/50 opacity-60 flex justify-between items-center cursor-not-allowed border-t border-[#e5e7eb] dark:border-[#2a2a2a] group" onClick={() => alert("E-commerce support is coming soon! Stay tuned.")}>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground group-hover:text-amber-500 transition-colors">E-commerce</span>
                                                    <span className="text-[10px] text-amber-500 uppercase font-black tracking-widest mt-0.5">Coming Soon</span>
                                                </div>
                                                <Lock size={14} className="text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                            </div>
                                            <div className="w-full px-4 py-3 bg-[#f8fafc]/50 dark:bg-[#111111]/50 opacity-60 flex justify-between items-center cursor-not-allowed border-t border-[#e5e7eb] dark:border-[#2a2a2a] group" onClick={() => alert("Healthcare support is coming soon! Stay tuned.")}>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground group-hover:text-amber-500 transition-colors">Healthcare & MedSpas</span>
                                                    <span className="text-[10px] text-amber-500 uppercase font-black tracking-widest mt-0.5">Coming Soon</span>
                                                </div>
                                                <Lock size={14} className="text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/90 block mb-1.5 px-1">Avg Deal Size</label>
                                    <div className="flex bg-[#fafafa] dark:bg-[#0f0f0f] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl focus-within:ring-4 focus-within:ring-[#3b82f6]/10 focus-within:border-[#3b82f6]/50 overflow-hidden transition-all shadow-inner">
                                        <select
                                            name="currency"
                                            value={formData.currency || 'USD'}
                                            onChange={handleChange}
                                            className="bg-[#ffffff] dark:bg-[#1a1a1a] border-r border-[#e5e7eb] dark:border-[#2a2a2a] px-3 py-3.5 text-xs outline-none text-[#0f172a] dark:text-[#f8fafc] hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a]/80 transition-all font-black"
                                        >
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                            <option value="INR">INR</option>
                                        </select>
                                        <input
                                            name="avgDealSize"
                                            value={formData.avgDealSize}
                                            onChange={handleChange}
                                            className="flex-1 bg-transparent px-4 py-3.5 focus:outline-none text-[#0f172a] dark:text-[#f8fafc] font-black placeholder:text-[#94a3b8]/30"
                                            placeholder="500,000"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-semibold text-foreground/90 mb-1">Target Audience</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, targetAudience: targetAudienceSuggestions[suggestionIndex] });
                                            setSuggestionIndex((prev) => (prev + 1) % targetAudienceSuggestions.length);
                                        }}
                                        className="text-[10px] text-[#3b82f6] hover:text-[#2563eb] transition-colors flex items-center gap-1 font-black uppercase tracking-widest focus:outline-none"
                                    >
                                        <Zap size={10} /> AI SUGGEST
                                    </button>
                                </div>
                                <input name="targetAudience" value={formData.targetAudience} onChange={handleChange} className="w-full bg-[#fafafa] dark:bg-[#0f0f0f] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl p-4 focus:ring-4 focus:ring-[#3b82f6]/10 focus:border-[#3b82f6]/50 outline-none transition-all text-[#0f172a] dark:text-[#f8fafc] font-black placeholder:text-[#94a3b8]/30 shadow-inner" placeholder="e.g. Relocating families or property investors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground/90 block mb-1.5 px-1">Website URL</label>
                                <input name="website" value={formData.website} onChange={handleChange} className="w-full bg-[#fafafa] dark:bg-[#0f0f0f] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl p-4 focus:ring-4 focus:ring-[#3b82f6]/10 focus:border-[#3b82f6]/50 outline-none transition-all text-[#0f172a] dark:text-[#f8fafc] font-black placeholder:text-[#94a3b8]/30 shadow-inner" placeholder="https://..." />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/90 block mb-1.5 px-1">AI Tone</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['friendly', 'professional', 'aggressive'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setFormData({ ...formData, tone: t })}
                                            className={`p-5 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] ${formData.tone === t ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-xl shadow-blue-500/20 scale-[1.05]' : 'bg-[#fafafa] dark:bg-[#0f0f0f] border-[#e5e7eb] dark:border-[#2a2a2a] text-[#64748b] dark:text-[#94a3b8] hover:border-[#3b82f6]/30'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground/90 block mb-1.5 px-1">Follow-up Style</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['soft', 'direct', 'urgent'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setFormData({ ...formData, followupStyle: s })}
                                            className={`p-5 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] ${formData.followupStyle === s ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-xl shadow-blue-500/20 scale-[1.05]' : 'bg-[#fafafa] dark:bg-[#0f0f0f] border-[#e5e7eb] dark:border-[#2a2a2a] text-[#64748b] dark:text-[#94a3b8] hover:border-[#3b82f6]/30'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="bg-surface-soft/50 border border-surface-border rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-foreground/90 flex items-center gap-2"><Zap size={14} className="text-amber-500" /> Your NEXIO Key</h3>
                                    <button 
                                        onClick={() => handleCopy(formData.apiKey, 'key')}
                                        className="text-[10px] font-bold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1.5 uppercase tracking-tighter"
                                    >
                                        {copied.key ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                                    </button>
                                </div>
                                <div className="bg-background/80 border border-surface-border p-4 rounded-xl font-mono text-xs text-foreground flex items-center justify-between min-w-0 group" onClick={() => handleCopy(formData.apiKey, 'key')}>
                                    <div className="flex-1 overflow-hidden truncate mr-2">
                                        {showApiKey ? (formData.apiKey || 'nexio_live_generating...') : '••••••••••••••••••••••••••••••••'}
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowApiKey(!showApiKey);
                                            }}
                                            className="p-1.5 hover:bg-surface-highlight rounded transition-colors text-muted-foreground hover:text-foreground"
                                            title={showApiKey ? "Hide API Key" : "Show API Key"}
                                        >
                                            {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface-soft/50 border border-surface-border rounded-2xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground/90 flex items-center gap-2"><Building2 size={14} className="text-primary" /> Lead Capture</h3>
                                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">Embed this snippet into your HTML to start capturing leads with NEXIO.</p>
                                    </div>
                                    <button 
                                        onClick={() => handleCopy(`<form action="${window.location.origin}/api/leads/capture" method="POST">\n  <input type="hidden" name="apiKey" value="${formData.publicKey || 'YOUR_PUBLIC_KEY'}" />\n  <input type="email" name="email" placeholder="Email" required />\n  <button type="submit">Connect</button>\n</form>`, 'snippet')}
                                        className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 uppercase tracking-tighter shrink-0"
                                    >
                                        {copied.snippet ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                                    </button>
                                </div>
                                <div 
                                    className="bg-background/80 border border-surface-border p-4 rounded-xl font-mono text-[11px] text-amber-500/80 overflow-x-auto whitespace-pre custom-scrollbar transition-colors hover:border-primary/30"
                                >
                                    {`<!-- NEXIO Public Snippet: Secure & Authorized -->\n` +
                                    `<form action="${window.location.origin}/api/leads/capture" method="POST">
   <input type="hidden" name="apiKey" value="${formData.publicKey || 'YOUR_PUBLIC_KEY'}" />
   <input type="email" name="email" placeholder="Email" required />
   <button type="submit">Connect</button>
 </form>`}
                                </div>
                                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                                    <ShieldCheck size={18} className="text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-blue-200 leading-relaxed">
                                        <span className="font-bold">Pro Tip:</span> For production, hide your key in a <code className="bg-blue-500/20 px-1 rounded">.env</code> file. Check the <span className="font-bold">Integrations</span> dashboard later for a secure server-side example.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="flex justify-between mt-10 pt-6 border-t border-surface-border">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-foreground font-bold text-sm">
                            Previous Step
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button onClick={handleNext} className="w-48 h-14 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none inline-flex items-center justify-center gap-2">
                            CONTINUE <ArrowRight size={14} />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="w-56 h-14 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none">
                            {loading ? 'PREPARING...' : 'FINISH SETUP'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
