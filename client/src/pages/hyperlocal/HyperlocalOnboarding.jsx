import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Tag, User, MessageSquare, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import nexioLocalService from '../../services/nexio-localService';

const CATEGORIES = [
    { id: 'gym',        name: 'Gym & Fitness',       icon: '🏋️' },
    { id: 'salon',      name: 'Salon & Spa',          icon: '💇' },
    { id: 'restaurant', name: 'Restaurant & Cafe',    icon: '🍕' },
    { id: 'retail',     name: 'Retail Store',         icon: '🛒' },
    { id: 'clinic',     name: 'Clinic',               icon: '🏥' },
    { id: 'education',  name: 'Education',            icon: '🎓' },
    { id: 'hotel',      name: 'Hotel',                icon: '🏨' },
    { id: 'other',      name: 'Other',                icon: '🏪' },
];

const CURRENCIES = [
    { code: 'INR', label: '₹ Indian Rupee' },
    { code: 'USD', label: '$ US Dollar' },
    { code: 'SGD', label: 'S$ Singapore Dollar' },
    { code: 'AED', label: 'AED UAE Dirham' },
    { code: 'GBP', label: '£ British Pound' },
    { code: 'EUR', label: '€ Euro' },
];

const STEPS = [
    { id: 1, label: 'Business Info',  icon: Store },
    { id: 2, label: 'Category',       icon: Tag },
    { id: 3, label: 'Your Details',   icon: User },
    { id: 4, label: 'WhatsApp',       icon: MessageSquare },
];

function Field({ label, placeholder, value, onChange, type = 'text', hint }) {
    return (
        <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                style={{
                    background: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                }}
            />
            {hint && <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{hint}</p>}
        </div>
    );
}

export default function NexioLocalOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '', tagline: '', street: '', city: '', state: '', country: 'India', pincode: '',
        category: '', currency: 'INR',
        ownerName: '', ownerEmail: '', ownerPhone: '',
        phoneNumberId: '', accessToken: '',
        otherCategory: '',
    });

    const update = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const canNext = () => {
        if (step === 1) return form.name.trim() && form.city.trim();
        if (step === 2) return !!form.category;
        if (step === 3) return form.ownerEmail.trim();
        return true;
    };

    const handleFinish = async () => {
        setLoading(true); setError('');
        try {
            const payload = {
                name: form.name, tagline: form.tagline,
                category: form.category === 'other' && form.otherCategory ? form.otherCategory : form.category,
                currency: form.currency,
                address: { street: form.street, city: form.city, state: form.state, country: form.country, pincode: form.pincode },
                billingEmail: form.ownerEmail,
            };

            // Include WhatsApp config if provided
            if (form.phoneNumberId && form.accessToken) {
                payload.whatsappConfig = {
                    phoneNumberId: form.phoneNumberId,
                    accessToken: form.accessToken,
                    isActive: true
                };
            }

            await nexioLocalService.register(payload);
            navigate('/dashboard/nexio-local');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
            <div className="w-full max-w-xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 neon-glow-emerald"
                        style={{ borderColor: 'rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">NEXIO Local</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Set up your <span className="text-emerald-500">WhatsApp Bot</span>
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Get your business online in under 5 minutes
                    </p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-0 mb-8">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className="flex flex-col items-center gap-1">
                                <div className={cn(
                                    "w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                    step > s.id ? "bg-emerald-500 border-emerald-500 text-white"
                                        : step === s.id ? "border-emerald-500 text-emerald-500"
                                        : "border-[var(--border)] text-[var(--text-tertiary)]"
                                )} style={step === s.id ? { background: 'rgba(16,185,129,0.1)' } : {}}>
                                    {step > s.id ? <CheckCircle2 size={16} /> : <s.icon size={15} />}
                                </div>
                                <span className="text-[9px] font-semibold uppercase tracking-wider hidden sm:block"
                                    style={{ color: step === s.id ? '#059669' : 'var(--text-tertiary)' }}>
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className="flex-1 h-0.5 mx-2 rounded transition-all duration-500"
                                    style={{ background: step > i + 1 ? '#10b981' : 'var(--border)' }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Card */}
                <div className="rounded-2xl border p-7 glass-noir" style={{ borderColor: 'var(--border)' }}>

                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Tell us about your business</h2>
                            <Field label="Business Name *" placeholder="e.g. Anytime Fitness Noida" value={form.name} onChange={v => update('name', v)} />
                            <Field label="Tagline" placeholder="e.g. Your fitness journey starts here" value={form.tagline} onChange={v => update('tagline', v)} />
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Street Address" placeholder="123 Main St" value={form.street} onChange={v => update('street', v)} />
                                <Field label="City *" placeholder="Mumbai" value={form.city} onChange={v => update('city', v)} />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <Field label="State" placeholder="Maharashtra" value={form.state} onChange={v => update('state', v)} />
                                <Field label="Country" placeholder="India" value={form.country} onChange={v => update('country', v)} />
                                <Field label="Pincode" placeholder="400001" value={form.pincode} onChange={v => update('pincode', v)} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Currency</label>
                                <select value={form.currency} onChange={e => update('currency', e.target.value)}
                                    className="w-full text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-base font-bold mb-5" style={{ color: 'var(--text-primary)' }}>What type of business is it?</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {CATEGORIES.map(cat => (
                                    <button key={cat.id} onClick={() => update('category', cat.id)}
                                        className={cn("flex flex-col items-center gap-2 py-5 rounded-xl border-2 transition-all",
                                            form.category === cat.id
                                                ? "border-emerald-500 bg-emerald-500/5"
                                                : "hover:border-[var(--text-tertiary)]"
                                        )}
                                        style={form.category !== cat.id ? { borderColor: 'var(--border)' } : {}}>
                                        <span className="text-3xl">{cat.icon}</span>
                                        <span className="text-[11px] font-semibold text-center leading-tight"
                                            style={{ color: form.category === cat.id ? '#059669' : 'var(--text-secondary)' }}>
                                            {cat.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            
                            {form.category === 'other' && (
                                <div className="mt-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Field 
                                        label="Tell us about your business type *" 
                                        placeholder="e.g. Pet Grooming, Architecture Studio, etc." 
                                        value={form.otherCategory} 
                                        onChange={v => update('otherCategory', v)} 
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Your contact details</h2>
                            <Field label="Your Name" placeholder="Rahul Sharma" value={form.ownerName} onChange={v => update('ownerName', v)} />
                            <Field label="Email Address *" placeholder="rahul@mygym.com" type="email" value={form.ownerEmail} onChange={v => update('ownerEmail', v)} />
                            <Field label="Phone Number" placeholder="+91 98765 12345" value={form.ownerPhone} onChange={v => update('ownerPhone', v)} />
                        </div>
                    )}

                    {/* Step 4 */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Connect WhatsApp Business</h2>
                            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                                You'll need a Meta Business number. Get your credentials from the{' '}
                                <a href="https://business.facebook.com/settings/whatsapp-business-accounts" target="_blank" rel="noreferrer" className="text-emerald-500 underline">
                                    Meta Business Dashboard
                                </a>.
                            </p>
                            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-600 text-sm">
                                💡 You can skip this for now and configure it later in <strong>Bot Setup</strong>.
                            </div>
                            <Field label="Phone Number ID" placeholder="From Meta Dashboard" value={form.phoneNumberId} onChange={v => update('phoneNumberId', v)} />
                            <Field label="Access Token" placeholder="EAAxxxxxxxxxxxxx" value={form.accessToken} type="password"
                                hint="Use a Permanent Access Token for best results" onChange={v => update('accessToken', v)} />

                            {error && <p className="text-sm text-red-500 bg-red-500/5 rounded-lg px-3 py-2 border border-red-400/20">{error}</p>}
                        </div>
                    )}

                    {/* Nav buttons */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                        {step > 1 ? (
                            <button onClick={() => setStep(s => s - 1)}
                                className="px-5 py-2.5 rounded-lg border text-sm font-medium hover:bg-[var(--text-primary)]/5 transition-all"
                                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                                ← Back
                            </button>
                        ) : <div />}

                        {step < 4 ? (
                            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                Next <ChevronRight size={15} />
                            </button>
                        ) : (
                            <button onClick={handleFinish} disabled={loading || !form.name || !form.category}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 disabled:opacity-40 transition-all">
                                {loading ? <><Loader2 size={15} className="animate-spin" /> Creating...</> : <><CheckCircle2 size={15} /> Launch Bot</>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
