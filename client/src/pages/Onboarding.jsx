
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import api from '../services/api';
import { Building2, MessageSquare, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [businessId, setBusinessId] = useState(null);

    const [formData, setFormData] = useState({
        // Step 1: Profile
        industry: '',
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
                        apiKey: res.data.apiKey
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
        <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white shadow-glow' : 'w-2 bg-white/10'}`} />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-white/[0.03] blur-[150px] rounded-full" />
            </div>

            <GlassCard className="w-full max-w-2xl relative z-10 p-8 min-h-[500px] flex flex-col">
                <StepIndicator />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2">
                        {step === 1 && "Tell us about your Business"}
                        {step === 2 && "Configure AI Behavior"}
                        {step === 3 && "Connect Your Leads"}
                    </h1>
                    <p className="text-[10px] text-muted font-black uppercase tracking-widest">
                        {step === 1 && "Help Arlo understand who you are selling to."}
                        {step === 2 && "Choose how Arlo should talk to your leads."}
                        {step === 3 && "Start capturing high-intent leads from your website."}
                    </p>
                </div>

                <div className="flex-1">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Industry</label>
                                        <button
                                            onClick={() => setFormData({ ...formData, industry: 'SaaS & Enterprise Software' })}
                                            className="text-[10px] text-white hover:text-zinc-300 transition-colors flex items-center gap-1 font-black uppercase tracking-widest"
                                        >
                                            <Zap size={10} /> AI Suggest
                                        </button>
                                    </div>
                                    <input name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 focus:border-white/40 outline-none transition-all text-white placeholder:text-zinc-500" placeholder="e.g. Real Estate" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Avg Deal Size</label>
                                    <div className="flex bg-white/[0.03] border border-white/10 rounded-xl focus-within:border-white/40 overflow-hidden transition-all">
                                        <select
                                            name="currency"
                                            value={formData.currency || 'USD'}
                                            onChange={handleChange}
                                            className="bg-white/5 border-r border-white/10 px-3 py-3 text-xs outline-none text-white hover:bg-white/10 transition-all font-bold"
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
                                            className="flex-1 bg-transparent px-3 py-3 focus:outline-none text-white font-bold placeholder:text-zinc-500"
                                            placeholder="5,000"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Target Audience</label>
                                    <button
                                        onClick={() => setFormData({ ...formData, targetAudience: 'CTOs and IT Directors at mid-market firms' })}
                                        className="text-[10px] text-white hover:text-zinc-300 transition-colors flex items-center gap-1 font-black uppercase tracking-widest"
                                    >
                                        <Zap size={10} /> AI Suggest
                                    </button>
                                </div>
                                <input name="targetAudience" value={formData.targetAudience} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 focus:border-white/40 outline-none transition-all text-white font-medium placeholder:text-zinc-500" placeholder="e.g. Home buyers in Austin, TX" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Website URL</label>
                                <input name="website" value={formData.website} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 focus:border-white/40 outline-none transition-all text-white font-medium placeholder:text-zinc-500" placeholder="https://..." />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-2 block">AI Tone</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['friendly', 'professional', 'aggressive'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setFormData({ ...formData, tone: t })}
                                            className={`p-3 rounded-xl border capitalize transition-all text-xs font-black uppercase tracking-widest ${formData.tone === t ? 'bg-white text-black border-white shadow-glow' : 'bg-white/[0.03] border-white/10 text-muted hover:bg-white/5'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-2 block">Follow-up Style</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['soft', 'direct', 'urgent'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setFormData({ ...formData, followupStyle: s })}
                                            className={`p-3 rounded-xl border capitalize transition-all text-xs font-black uppercase tracking-widest ${formData.followupStyle === s ? 'bg-white text-black border-white shadow-glow' : 'bg-white/[0.03] border-white/10 text-muted hover:bg-white/5'}`}
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
                            <div className="bg-surface/50 border border-white/10 rounded-xl p-4">
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Your API Key</h3>
                                <div className="bg-black/40 p-3 rounded-lg font-mono text-sm text-gray-300 break-all select-all">
                                    {formData.apiKey || 'arlo_live_generating...'}
                                </div>
                            </div>

                            <div className="bg-surface/50 border border-white/10 rounded-xl p-4">
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><Building2 size={18} className="text-blue-400" /> Lead Capture Snippet</h3>
                                <p className="text-sm text-gray-400 mb-2">Paste this HTML in your website to start capturing leads instantly.</p>
                                <div className="bg-black/40 p-3 rounded-lg font-mono text-xs text-green-400 overflow-x-auto whitespace-pre">
                                    {`<form action="http://localhost:8000/api/leads/capture" method="POST">
  <input type="hidden" name="apiKey" value="${formData.apiKey || 'YOUR_API_KEY'}" />
  <input type="text" name="name" placeholder="Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <button type="submit">Submit</button>
</form>`}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="flex justify-between mt-8 pt-4 border-t border-white/5">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={handleBack}>Back</Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button onClick={handleNext}>Continue <ArrowRight size={18} /></Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="px-8 bg-white text-black hover:bg-zinc-200 shadow-glow">
                            {loading ? 'Setup...' : 'Launch Cockpit 🚀'}
                        </Button>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};

export default Onboarding;
