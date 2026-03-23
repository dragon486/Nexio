import React, { useState, useEffect } from 'react';

import Button from '../../components/ui/Button';
import { getMyBusiness, updateBusiness } from '../../services/businessService';
import {
    Cpu, MessageSquare, Zap, Clock, Shield,
    ToggleLeft, ToggleRight, Save, Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Automations = () => {
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Local state for form to allow instant UI updates
    const [settings, setSettings] = useState({
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
            // Optionally show success toast
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return <div className="p-8 text-muted-foreground">Loading automations...</div>;

    const personas = [
        { id: 'friendly', icon: '🤝', label: 'Friendly', desc: 'Warm, approachable, and helpful.' },
        { id: 'professional', icon: '👔', label: 'Professional', desc: 'Concise, formal, and trustworthy.' },
        { id: 'aggressive', icon: '🦈', label: 'Aggressive', desc: 'Direct, persuasive, and high-energy.' },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <Cpu className="text-amber-500" /> Automations Center
                    </h1>
                    <p className="text-muted-foreground">Configure your AI's behavior and safety limits.</p>
                </div>
                <Button variant={showSuccess ? "outline" : "primary"} onClick={handleSave} disabled={saving}>
                    {saving ? <><Save size={18} className="animate-spin mr-2" /> Saving...</> : showSuccess ? 'Saved! ✅' : <><Save size={18} className="mr-2" /> Save Changes</>}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Master Control */}
                <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[20px] p-8 shadow-2xl transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Zap size={100} />
                    </div>
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-foreground mb-1">Auto-Pilot</h2>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                When enabled, NEXIO will automatically reply to new leads that meet your criteria.
                            </p>
                        </div>
                        <button
                            onClick={() => handleChange('autoReply', !settings.autoReply)}
                            className={`transition-all duration-500 hover:scale-110 active:scale-95 z-10 ${settings.autoReply ? 'text-[#10b981]' : 'text-[#64748b] dark:text-[#94a3b8]'}`}
                        >
                            {settings.autoReply ? <ToggleRight size={48} strokeWidth={1} /> : <ToggleLeft size={48} strokeWidth={1} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {settings.autoReply && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-6 border-t border-surface-border/50 pt-6"
                            >
                                <div>
                                    <label className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
                                        <span>Confidence Threshold</span>
                                        <span className="text-amber-500 font-bold">{settings.minScoreToAutoReply}%</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="100"
                                        value={settings.minScoreToAutoReply}
                                        onChange={(e) => handleChange('minScoreToAutoReply', parseInt(e.target.value))}
                                        className="w-full accent-[#3b82f6] h-1.5 bg-white rounded-lg appearance-none cursor-pointer border border-border/10 shadow-inner"
                                    />
                                    <p className="text-xs text-muted-foreground/60 mt-1">Only reply to leads with an AI Score above this value.</p>
                                </div>

                                <div>
                                    <label className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
                                        <span>Human Mimicry Delay</span>
                                        <span className="text-amber-500 font-bold">{settings.responseDelay} min</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="60"
                                        value={settings.responseDelay}
                                        onChange={(e) => handleChange('responseDelay', parseInt(e.target.value))}
                                        className="w-full accent-[#3b82f6] h-1.5 bg-[#fafafa] dark:bg-[#0f0f0f] rounded-lg appearance-none cursor-pointer border border-[#e5e7eb] dark:border-[#2a2a2a]"
                                    />
                                    <p className="text-xs text-muted-foreground/60 mt-1">Wait this long before sending the reply to appear human.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 2. Persona Engine */}
                <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[20px] p-8 shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-2 mb-6">
                        <Bot className="text-amber-500" />
                        <h2 className="text-xl font-bold text-foreground">AI Persona</h2>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-muted-foreground">Tone of Voice</label>
                        <div className="grid grid-cols-3 gap-3">
                            {personas.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => handleChange('tone', p.id)}
                                    className={`cursor-pointer rounded-xl p-4 border transition-all duration-300 ${settings.tone === p.id
                                        ? 'bg-[#3b82f6]/10 border-[#3b82f6] text-[#3b82f6] font-black shadow-lg shadow-blue-500/5'
                                        : 'bg-[#fafafa] dark:bg-[#0f0f0f]/40 border-[#e5e7eb] dark:border-[#2a2a2a] text-[#64748b] dark:text-[#94a3b8] hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a]'
                                        }`}
                                >
                                    <div className="text-3xl mb-3 transform transition-transform group-hover:scale-110">{p.icon}</div>
                                    <div className="font-black text-xs uppercase tracking-wider">{p.label}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground/60 italic">
                            {personas.find(p => p.id === settings.tone)?.desc}
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-surface-border/50">
                        <label className="text-sm font-medium text-muted-foreground mb-3 block">Safety Limits</label>
                        <div className="flex items-center justify-between bg-surface-soft/30 p-3 rounded-xl border border-surface-border">
                            <div className="flex items-center gap-3">
                                <Shield className="text-muted-foreground" size={20} />
                                <div>
                                    <div className="text-sm font-bold text-foreground">Daily Email Limit</div>
                                    <div className="text-xs text-muted-foreground">Max auto-emails per day</div>
                                </div>
                            </div>
                                <input
                                    type="number"
                                    value={settings.dailyEmailLimit}
                                    onChange={(e) => handleChange('dailyEmailLimit', parseInt(e.target.value))}
                                    className="w-24 bg-white border border-border/10 rounded-xl px-4 py-2 text-right text-slate-900 font-bold focus:outline-none focus:border-primary/50 shadow-inner"
                                />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Scheduling & Availability */}
            <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[20px] p-8 shadow-2xl transition-all duration-300 mt-6">
                <div className="flex items-center gap-2 mb-6">
                    <Clock className="text-amber-500" />
                    <h2 className="text-xl font-bold text-foreground">Scheduling & Availability</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <Zap size={14} className="text-amber-500" /> Booking Link
                            </label>
                            <input
                                type="url"
                                placeholder="https://calendly.com/your-name"
                                value={settings.schedulingLink || ''}
                                onChange={(e) => handleChange('schedulingLink', e.target.value)}
                                className="w-full bg-white border border-border/10 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-all font-bold text-sm shadow-inner"
                            />
                            <p className="text-xs text-muted-foreground/60 mt-2">The AI will use this link to schedule demos for high-intent leads.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Business Contact Number</label>
                            <input
                                type="text"
                                placeholder="e.g. +1 (555) 0123"
                                value={settings.businessPhone || ''}
                                onChange={(e) => handleChange('businessPhone', e.target.value)}
                                className="w-full bg-white border border-border/10 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-all font-bold text-sm shadow-inner"
                            />
                            <p className="text-xs text-muted-foreground/60 mt-2">AI will use this for "Call me" requests or WhatsApp follow-ups.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Availability Instructions</label>
                            <textarea
                                placeholder="E.g. No demos on Monday mornings. Focus on afternoon slots."
                                value={settings.availabilityInstructions || ''}
                                onChange={(e) => handleChange('availabilityInstructions', e.target.value)}
                                className="w-full bg-white border border-border/10 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-all font-bold text-sm shadow-inner h-24 resize-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-amber-500 mb-2 flex items-center gap-2">
                                <Bot size={16} /> AI Preview
                            </h4>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-xs text-slate-600 italic leading-relaxed shadow-inner border border-border/5">
                                {settings.schedulingLink ? (
                                    `"I'd love to show you a demo of our platform! You can book a time that suits you best using our calendar here: ${settings.schedulingLink}"`
                                ) : (
                                    `"I'd love to show you a demo of our platform! When would be a good time for us to connect this week?"`
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-surface-soft/30 p-3 rounded-xl border border-surface-border">
                            <div className="flex items-center gap-3">
                                <Clock className="text-muted-foreground" size={20} />
                                <div>
                                    <div className="text-sm font-bold text-foreground">Apply Working Hours</div>
                                    <div className="text-xs text-muted-foreground">Only send automated emails during these hours</div>
                                    <div className="flex gap-3 mt-2">
                                        <div className="flex-1">
                                            <input
                                                type="time"
                                                value={settings.workingHours?.start || '09:00'}
                                                onChange={(e) => handleChange('workingHours', { ...settings.workingHours, start: e.target.value })}
                                                className="w-full bg-white border border-border/10 rounded-lg px-3 py-2 text-slate-900 text-xs font-bold focus:border-primary/50 outline-none shadow-inner"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="time"
                                                value={settings.workingHours?.end || '18:00'}
                                                onChange={(e) => handleChange('workingHours', { ...settings.workingHours, end: e.target.value })}
                                                className="w-full bg-white border border-border/10 rounded-lg px-3 py-2 text-slate-900 text-xs font-bold focus:border-primary/50 outline-none shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleChange('applyWorkingHours', !settings.applyWorkingHours)}
                                className={`transition-colors duration-300 ${settings.applyWorkingHours ? 'text-green-400' : 'text-gray-600'}`}
                            >
                                {settings.applyWorkingHours ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Automations;
