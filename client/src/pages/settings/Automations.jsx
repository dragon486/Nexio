import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/ui/GlassCard';
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

    // Local state for form to allow instant UI updates
    const [settings, setSettings] = useState({
        autoReply: false,
        minScoreToAutoReply: 50,
        responseDelay: 5,
        dailyEmailLimit: 50,
        tone: 'professional',
        followupStyle: 'soft'
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

    if (loading) return <div className="p-8 text-white">Loading automations...</div>;

    const personas = [
        { id: 'friendly', icon: '🤝', label: 'Friendly', desc: 'Warm, approachable, and helpful.' },
        { id: 'professional', icon: '👔', label: 'Professional', desc: 'Concise, formal, and trustworthy.' },
        { id: 'aggressive', icon: '🦈', label: 'Aggressive', desc: 'Direct, persuasive, and high-energy.' },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Cpu className="text-primary" /> Automations Center
                    </h1>
                    <p className="text-gray-400">Configure your AI's behavior and safety limits.</p>
                </div>
                <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? <><Save size={18} className="animate-spin mr-2" /> Saving...</> : <><Save size={18} className="mr-2" /> Save Changes</>}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Master Control */}
                <GlassCard className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap size={100} />
                    </div>
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Auto-Pilot</h2>
                            <p className="text-sm text-gray-400 max-w-xs">
                                When enabled, Arlo will automatically reply to new leads that meet your criteria.
                            </p>
                        </div>
                        <button
                            onClick={() => handleChange('autoReply', !settings.autoReply)}
                            className={`transition-colors duration-300 ${settings.autoReply ? 'text-green-400' : 'text-gray-600'}`}
                        >
                            {settings.autoReply ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {settings.autoReply && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-6 border-t border-white/10 pt-6"
                            >
                                <div>
                                    <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
                                        <span>Confidence Threshold</span>
                                        <span className="text-primary font-bold">{settings.minScoreToAutoReply}%</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="100"
                                        value={settings.minScoreToAutoReply}
                                        onChange={(e) => handleChange('minScoreToAutoReply', parseInt(e.target.value))}
                                        className="w-full accent-primary h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Only reply to leads with an AI Score above this value.</p>
                                </div>

                                <div>
                                    <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
                                        <span>Human Mimicry Delay</span>
                                        <span className="text-primary font-bold">{settings.responseDelay} min</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="60"
                                        value={settings.responseDelay}
                                        onChange={(e) => handleChange('responseDelay', parseInt(e.target.value))}
                                        className="w-full accent-primary h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Wait this long before sending the reply to appear human.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </GlassCard>

                {/* 2. Persona Engine */}
                <GlassCard>
                    <div className="flex items-center gap-2 mb-6">
                        <Bot className="text-purple-400" />
                        <h2 className="text-xl font-bold text-white">AI Persona</h2>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-300">Tone of Voice</label>
                        <div className="grid grid-cols-3 gap-3">
                            {personas.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => handleChange('tone', p.id)}
                                    className={`cursor-pointer rounded-xl p-3 border transition-all ${settings.tone === p.id
                                        ? 'bg-primary/20 border-primary text-white'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{p.icon}</div>
                                    <div className="font-bold text-sm">{p.label}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 italic">
                            {personas.find(p => p.id === settings.tone)?.desc}
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <label className="text-sm font-medium text-gray-300 mb-3 block">Safety Limits</label>
                        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                            <div className="flex items-center gap-3">
                                <Shield className="text-gray-400" size={20} />
                                <div>
                                    <div className="text-sm font-bold text-white">Daily Email Limit</div>
                                    <div className="text-xs text-gray-500">Max auto-emails per day</div>
                                </div>
                            </div>
                            <input
                                type="number"
                                value={settings.dailyEmailLimit}
                                onChange={(e) => handleChange('dailyEmailLimit', parseInt(e.target.value))}
                                className="w-20 bg-black/20 border border-white/10 rounded px-2 py-1 text-right text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Automations;
