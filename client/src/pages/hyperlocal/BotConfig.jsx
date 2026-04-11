import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Bot, Plus, Trash2, Save, CheckCircle2, Loader2,
    MessageSquare, MapPin, Clock, DollarSign, Phone, Zap, Eye
} from 'lucide-react';
import { cn } from '../../lib/utils';
import nexioLocalService from '../../services/nexio-localService';

const TEMPLATES = [
    { id: 'gym',        icon: '🏋️', name: 'Gym' },
    { id: 'salon',      icon: '💇', name: 'Salon' },
    { id: 'restaurant', icon: '🍕', name: 'Restaurant' },
    { id: 'retail',     icon: '🛒', name: 'Retail' },
    { id: 'clinic',     icon: '🏥', name: 'Clinic' },
    { id: 'custom',     icon: '✨', name: 'Custom' },
];

const INTENTS = [
    { key: 'pricing',  icon: DollarSign, label: 'Pricing & Plans',       desc: 'Bot answers pricing questions' },
    { key: 'booking',  icon: Clock,      label: 'Booking',                desc: 'Bot handles appointment inquiries' },
    { key: 'location', icon: MapPin,     label: 'Location & Directions',  desc: 'Bot shares your address' },
    { key: 'hours',    icon: Clock,      label: 'Business Hours',         desc: 'Bot responds to timing questions' },
    { key: 'services', icon: Zap,        label: 'Services',               desc: 'Bot describes your offerings' },
    { key: 'contact',  icon: Phone,      label: 'Human Handoff',          desc: 'Escalates to human when needed' },
];

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const DAY_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function NexioLocalBotConfig() {
    const { business, setBusiness } = useOutletContext();
    const [config, setConfig] = useState(null);
    const [services, setServices] = useState([]);
    const [hours, setHours] = useState({});
    const [whatsapp, setWhatsapp] = useState({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [tab, setTab] = useState('bot');

    useEffect(() => {
        if (!business) return;
        setConfig(business.botConfig || {});
        setServices(business.services || []);
        setHours(business.hours || {});
        setWhatsapp(business.whatsappConfig || {});
    }, [business]);

    const updateConfig = (key, val) => setConfig(p => ({ ...p, [key]: val }));
    const updateIntent = (key, val) => setConfig(p => ({
        ...p, enabledIntents: { ...p.enabledIntents, [key]: val }
    }));
    const addService = () => setServices(p => [...p, { name: '', price: 0, duration: '', description: '' }]);
    const updateService = (i, key, val) => { const n = [...services]; n[i] = { ...n[i], [key]: val }; setServices(n); };
    const removeService = (i) => setServices(p => p.filter((_, idx) => idx !== i));

    const handleSave = async () => {
        setSaving(true);
        try {
            const updated = await nexioLocalService.updateConfig(business._id, { botConfig: config, services, hours, whatsappConfig: whatsapp });
            setBusiness(updated.business);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    if (!config) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
    );

    const card = { background: 'var(--bg-secondary)', borderColor: 'var(--border)' };
    const inputStyle = { background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' };

    const TABS = [
        { id: 'bot',      label: 'Bot Settings' },
        { id: 'services', label: 'Services & Pricing' },
        { id: 'hours',    label: 'Business Hours' },
        { id: 'whatsapp', label: 'WhatsApp Setup' },
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Bot size={20} className="text-emerald-500" /> Bot Setup
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Configure your AI-powered WhatsApp assistant</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className={cn("flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
                        saved ? "border text-emerald-600 bg-emerald-500/10"
                              : "bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-50"
                    )}
                    style={saved ? { borderColor: 'rgba(16,185,129,0.3)' } : {}}>
                    {saved ? <><CheckCircle2 size={15} /> Saved!</>
                        : saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
                        : <><Save size={15} /> Save</>}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-lg border w-fit" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                {TABS.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all",
                            tab === t.id ? "bg-emerald-500 text-white shadow-sm"
                                         : "hover:bg-[var(--text-primary)]/5"
                        )}
                        style={tab !== t.id ? { color: 'var(--text-secondary)' } : {}}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── BOT SETTINGS ── */}
            {tab === 'bot' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-5">
                        {/* Template */}
                        <div className="rounded-xl border p-5" style={card}>
                            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Bot Template</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {TEMPLATES.map(t => (
                                    <button key={t.id} onClick={() => updateConfig('template', t.id)}
                                        className={cn("flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all",
                                            config.template === t.id ? "border-emerald-500 bg-emerald-500/5" : "hover:border-emerald-500/30"
                                        )}
                                        style={config.template !== t.id ? { borderColor: 'var(--border)' } : {}}>
                                        <span className="text-2xl">{t.icon}</span>
                                        <span className="text-[11px] font-medium" style={{ color: config.template === t.id ? '#059669' : 'var(--text-secondary)' }}>{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Welcome Message */}
                        <div className="rounded-xl border p-5" style={card}>
                            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Welcome Message</h3>
                            <textarea rows={5} value={config.welcomeMessage || ''}
                                onChange={e => updateConfig('welcomeMessage', e.target.value)}
                                className="w-full text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all"
                                style={inputStyle} placeholder="Hi! Welcome to our business..." />
                        </div>

                        {/* Persona */}
                        <div className="rounded-xl border p-5" style={card}>
                            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Bot Personality</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['Friendly', 'Professional', 'Energetic'].map(p => (
                                    <button key={p} onClick={() => updateConfig('aiPersona', p.toLowerCase())}
                                        className={cn("py-2 rounded-lg border text-sm font-medium transition-all capitalize",
                                            config.aiPersona === p.toLowerCase() ? "border-emerald-500 bg-emerald-500/5 text-emerald-600"
                                                                                 : "hover:border-emerald-500/30"
                                        )}
                                        style={config.aiPersona !== p.toLowerCase() ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Intents */}
                        <div className="rounded-xl border p-5" style={card}>
                            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Auto-Reply Topics</h3>
                            <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Choose which questions the bot handles automatically</p>
                            <div className="space-y-3">
                                {INTENTS.map(intent => (
                                    <div key={intent.key} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                                        <div className="flex items-center gap-3">
                                            <intent.icon size={14} style={{ color: 'var(--text-tertiary)' }} />
                                            <div>
                                                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{intent.label}</div>
                                                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{intent.desc}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateIntent(intent.key, config.enabledIntents?.[intent.key] === false ? true : false)}
                                            className={cn("w-11 h-6 rounded-full transition-all duration-200 relative shrink-0",
                                                config.enabledIntents?.[intent.key] !== false ? "bg-emerald-500" : "bg-gray-300 dark:bg-zinc-600"
                                            )}>
                                            <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-200",
                                                config.enabledIntents?.[intent.key] !== false ? "left-6" : "left-1"
                                            )} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div className="lg:sticky lg:top-8">
                        <div className="rounded-xl border overflow-hidden" style={card}>
                            <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                                <Eye size={14} className="text-emerald-500" />
                                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Live Preview</span>
                            </div>
                            {/* WhatsApp mockup — always dark for realism */}
                            <div style={{ background: '#0a1628', minHeight: 380 }} className="p-5">
                                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                                        {business?.name?.[0]}
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-white">{business?.name}</div>
                                        <div className="text-[10px] text-emerald-400">● Online</div>
                                    </div>
                                </div>
                                <div className="flex justify-end mb-3">
                                    <div className="bg-[#005c4b] text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[80%] leading-relaxed">
                                        Hi! What are your prices? 👋
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-[#1f2937] text-white text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[90%] whitespace-pre-line leading-relaxed">
                                        {config.welcomeMessage || 'Your welcome message will appear here...'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-2 ml-1">
                                    <Bot size={10} className="text-emerald-400" />
                                    <span className="text-[9px] text-zinc-500">AI Bot · just now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── SERVICES ── */}
            {tab === 'services' && (
                <div className="rounded-xl border overflow-hidden" style={card}>
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Services & Pricing</h3>
                        <button onClick={addService}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-sm font-medium border border-emerald-500/30 hover:bg-emerald-500/15 transition-all">
                            <Plus size={14} /> Add Service
                        </button>
                    </div>
                    <div className="p-5 space-y-3">
                        {services.length === 0 && (
                            <div className="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
                                <Zap size={28} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm font-medium">No services yet</p>
                                <p className="text-xs mt-1">Add your services so the bot can answer price and service questions</p>
                            </div>
                        )}
                        {services.map((svc, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}>
                                <input placeholder="Service name" value={svc.name} onChange={e => updateService(i, 'name', e.target.value)}
                                    className="flex-1 text-sm bg-transparent border-b py-1 focus:outline-none"
                                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                                <input placeholder="Price" type="number" value={svc.price} onChange={e => updateService(i, 'price', e.target.value)}
                                    className="w-24 text-sm bg-transparent border-b py-1 focus:outline-none"
                                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                                <input placeholder="Duration" value={svc.duration} onChange={e => updateService(i, 'duration', e.target.value)}
                                    className="w-28 text-sm bg-transparent border-b py-1 focus:outline-none"
                                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                                <button onClick={() => removeService(i)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── HOURS ── */}
            {tab === 'hours' && (
                <div className="rounded-xl border overflow-hidden" style={card}>
                    <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Business Hours</h3>
                    </div>
                    <div className="p-5 space-y-2">
                        {DAYS.map((day, i) => {
                            const h = hours[day] || {};
                            return (
                                <div key={day} className="flex items-center gap-4 py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                                    <div className="w-10 text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>{DAY_SHORT[i]}</div>
                                    <button onClick={() => setHours(p => ({ ...p, [day]: { ...h, closed: !h.closed } }))}
                                        className={cn("text-[11px] font-semibold px-3 py-1 rounded-lg border transition-all",
                                            h.closed ? "border-red-400/30 text-red-500 bg-red-500/5" : "border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                                        )}>
                                        {h.closed ? 'Closed' : 'Open'}
                                    </button>
                                    {!h.closed && (
                                        <div className="flex items-center gap-2">
                                            <input type="time" value={h.open || '09:00'}
                                                onChange={e => setHours(p => ({ ...p, [day]: { ...h, open: e.target.value } }))}
                                                className="text-sm px-2 py-1.5 rounded-lg border focus:outline-none"
                                                style={inputStyle} />
                                            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>to</span>
                                            <input type="time" value={h.close || '21:00'}
                                                onChange={e => setHours(p => ({ ...p, [day]: { ...h, close: e.target.value } }))}
                                                className="text-sm px-2 py-1.5 rounded-lg border focus:outline-none"
                                                style={inputStyle} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── WHATSAPP SETUP ── */}
            {tab === 'whatsapp' && (
                <div className="max-w-lg space-y-5">
                    <div className="rounded-xl border p-5" style={card}>
                        <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Meta Cloud API Credentials</h3>
                        <p className="text-xs mb-5" style={{ color: 'var(--text-secondary)' }}>
                            Get your credentials from the{' '}
                            <a href="https://business.facebook.com/settings/whatsapp-business-accounts" target="_blank" rel="noreferrer" className="text-emerald-500 underline">
                                Meta Business Dashboard
                            </a>.
                        </p>
                        <div className="space-y-4">
                            {[
                                { key: 'phoneNumberId', label: 'Phone Number ID', placeholder: '1234567890' },
                                { key: 'accessToken',   label: 'Access Token',    placeholder: 'EAAxxxxxxxxxxxxx', type: 'password' },
                                { key: 'phoneNumber',   label: 'Display Phone',   placeholder: '+91 98765 12345' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{f.label}</label>
                                    <input type={f.type || 'text'} placeholder={f.placeholder} value={whatsapp[f.key] || ''}
                                        onChange={e => setWhatsapp(p => ({ ...p, [f.key]: e.target.value }))}
                                        className="w-full text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        style={inputStyle} />
                                </div>
                            ))}
                        </div>

                        {/* Webhook URL */}
                        <div className="mt-5 p-4 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}>
                            <div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>WhatsApp Webhook URL (Paste in Meta Dashboard)</div>
                            <code className="text-xs text-emerald-500 font-mono break-all">
                                {window.location.origin.replace(':5173', ':8000')}/webhooks/hyperlocal/{business?._id}
                            </code>
                        </div>

                        {/* Active toggle */}
                        <div className="flex items-center justify-between mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
                            <div>
                                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Bot Active</div>
                                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Enable/disable auto-replies</div>
                            </div>
                            <button onClick={() => setWhatsapp(p => ({ ...p, isActive: !p.isActive }))}
                                className={cn("w-11 h-6 rounded-full transition-all duration-200 relative",
                                    whatsapp.isActive ? "bg-emerald-500" : "bg-gray-300"
                                )}>
                                <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-200",
                                    whatsapp.isActive ? "left-6" : "left-1"
                                )} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
