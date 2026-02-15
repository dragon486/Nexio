
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
                if (res.data && res.data.length > 0) {
                    setBusinessId(res.data[0]._id);
                    // Pre-fill if already exists
                    setFormData(prev => ({ ...prev, ...res.data[0] }));
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
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`} />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full" />
            </div>

            <GlassCard className="w-full max-w-2xl relative z-10 p-8 min-h-[500px] flex flex-col">
                <StepIndicator />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        {step === 1 && "Tell us about your Business"}
                        {step === 2 && "Configure AI Behavior"}
                        {step === 3 && "Connect Your Leads"}
                    </h1>
                    <p className="text-gray-400">
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
                                    <label className="text-sm font-medium text-gray-300">Industry</label>
                                    <input name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-surface/50 border border-white/10 rounded-xl p-3 mt-1 focus:border-primary/50 outline-none" placeholder="e.g. Real Estate" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-300">Avg Deal Size</label>
                                    <input name="avgDealSize" value={formData.avgDealSize} onChange={handleChange} className="w-full bg-surface/50 border border-white/10 rounded-xl p-3 mt-1 focus:border-primary/50 outline-none" placeholder="e.g. $5,000" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300">Target Audience</label>
                                <input name="targetAudience" value={formData.targetAudience} onChange={handleChange} className="w-full bg-surface/50 border border-white/10 rounded-xl p-3 mt-1 focus:border-primary/50 outline-none" placeholder="e.g. Home buyers in Austin, TX" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300">Website URL</label>
                                <input name="website" value={formData.website} onChange={handleChange} className="w-full bg-surface/50 border border-white/10 rounded-xl p-3 mt-1 focus:border-primary/50 outline-none" placeholder="https://..." />
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
                                            className={`p-3 rounded-xl border capitalize transition-all ${formData.tone === t ? 'bg-primary/20 border-primary text-white' : 'bg-surface/50 border-white/10 text-gray-400 hover:bg-white/5'}`}
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
                                            className={`p-3 rounded-xl border capitalize transition-all ${formData.followupStyle === s ? 'bg-secondary/20 border-secondary text-white' : 'bg-surface/50 border-white/10 text-gray-400 hover:bg-white/5'}`}
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
                                <div className="bg-black/40 p-3 rounded-lg font-mono text-sm text-gray-300 break-all">
                                    {/* Mock API Key for UI - in real app, fetch from business */}
                                    arlo_live_{Math.random().toString(36).substring(7)}
                                </div>
                            </div>

                            <div className="bg-surface/50 border border-white/10 rounded-xl p-4">
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><Building2 size={18} className="text-blue-400" /> Embed Widget</h3>
                                <p className="text-sm text-gray-400 mb-2">Paste this code in your website &lt;head&gt; tag.</p>
                                <div className="bg-black/40 p-3 rounded-lg font-mono text-xs text-green-400 overflow-x-auto">
                                    &lt;script src="https://cdn.arlo.ai/widget.js"&gt;&lt;/script&gt;
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
                        <Button onClick={handleSubmit} disabled={loading} className="bg-gradient-to-r from-emerald-500 to-teal-500">
                            {loading ? 'Setup...' : 'Launch Arlo 🚀'}
                        </Button>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};

export default Onboarding;
