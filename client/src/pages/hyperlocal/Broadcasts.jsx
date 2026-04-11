import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Megaphone, Send, CheckCircle2, Clock, Users, Eye, Loader2, Plus, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import nexioLocalService from '../../services/nexio-localService';

const STATUS_STYLES = {
    sent:      'text-emerald-600 bg-emerald-500/10 border-emerald-500/30',
    sending:   'text-blue-600 bg-blue-500/10 border-blue-500/30',
    scheduled: 'text-amber-600 bg-amber-500/10 border-amber-500/30',
    draft:     'text-zinc-500 bg-zinc-500/10 border-zinc-400/20',
    failed:    'text-red-500 bg-red-500/10 border-red-400/30',
};

const AUDIENCE_LABELS = {
    all: 'All Customers',
    active_members: 'Active Members',
    expired_members: 'Expired Members',
    new_customers: 'New Customers',
    vip: 'VIP Customers',
};

export default function NexioLocalBroadcasts() {
    const { business } = useOutletContext();
    const [broadcasts, setBroadcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [composing, setComposing] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ message: '', targetAudience: 'all', scheduledFor: '' });

    const COST_RATES = { starter: 1, business: 0.75, enterprise: 0.5 };
    const currSymbol = { INR: '₹', USD: '$', EUR: '€', GBP: '£', SGD: 'S$' }[business?.currency] || (business?.currency || '') + ' ';

    useEffect(() => {
        if (!business?._id) return;
        nexioLocalService.getBroadcasts(business._id)
            .then(data => setBroadcasts(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
    }, [business]);

    const handleSend = async () => {
        if (!form.message.trim()) return;
        setSending(true); setError('');
        try {
            await nexioLocalService.sendBroadcast(business._id, {
                message: form.message,
                targetAudience: form.targetAudience,
                scheduledFor: form.scheduledFor || undefined,
            });
            setSent(true);
            setForm({ message: '', targetAudience: 'all', scheduledFor: '' });
            const updated = await nexioLocalService.getBroadcasts(business._id);
            setBroadcasts(Array.isArray(updated) ? updated : []);
            setTimeout(() => { setSent(false); setComposing(false); }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send broadcast.');
        } finally { setSending(false); }
    };

    const inputStyle = {
        background: 'var(--bg-primary)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
    };

    return (
        <div className="space-y-5 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Megaphone size={20} className="text-violet-500" /> Broadcasts
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        Send bulk WhatsApp messages to your customers
                    </p>
                </div>
                {!composing && (
                    <button onClick={() => setComposing(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors">
                        <Plus size={15} /> New Broadcast
                    </button>
                )}
            </div>

            {/* Compose Panel */}
            {composing && (
                <div className="rounded-xl border p-6 space-y-4" style={{ background: 'var(--bg-secondary)', borderColor: 'rgba(139,92,246,0.3)' }}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>New Broadcast</h3>
                        <button onClick={() => setComposing(false)} className="text-xl" style={{ color: 'var(--text-tertiary)' }}>×</button>
                    </div>

                    {/* Audience */}
                    <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Send to</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(AUDIENCE_LABELS).map(([val, lbl]) => (
                                <button key={val} onClick={() => setForm(p => ({ ...p, targetAudience: val }))}
                                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all",
                                        form.targetAudience === val
                                            ? "border-violet-500 bg-violet-500/10 text-violet-600"
                                            : "hover:bg-[var(--text-primary)]/5"
                                    )}
                                    style={form.targetAudience !== val ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}
                                >
                                    <Users size={11} /> {lbl}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Message <span className="font-normal" style={{ color: 'var(--text-tertiary)' }}>(WhatsApp: *bold*, _italic_)</span>
                        </label>
                        <textarea rows={6} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                            placeholder={'🎉 *Special Offer!*\n\nGet 20% OFF this weekend only!\n\nReply YES to claim.'}
                            className="w-full text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none transition-all"
                            style={inputStyle} />
                        <div className="flex justify-between mt-1">
                            <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                                Cost: {currSymbol}{(COST_RATES[business?.plan] || 1).toFixed(2)}/message
                            </span>
                            <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{form.message.length}/1024</span>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                            Schedule (optional — leave blank to send now)
                        </label>
                        <input type="datetime-local" value={form.scheduledFor}
                            onChange={e => setForm(p => ({ ...p, scheduledFor: e.target.value }))}
                            className="text-sm px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                            style={inputStyle} />
                    </div>

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <div className="flex gap-3">
                        <button onClick={() => setComposing(false)}
                            className="flex-1 py-2.5 rounded-lg border text-sm font-medium hover:bg-[var(--text-primary)]/5 transition-all"
                            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                            Cancel
                        </button>
                        <button onClick={handleSend} disabled={sending || !form.message.trim()}
                            className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                                sent ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                                    : "bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed"
                            )}>
                            {sent ? <><CheckCircle2 size={15} /> Sent!</>
                                : sending ? <><Loader2 size={15} className="animate-spin" /> Sending...</>
                                : form.scheduledFor ? <><Clock size={15} /> Schedule</>
                                : <><Send size={15} /> Send Now</>}
                        </button>
                    </div>
                </div>
            )}

            {/* Campaign History */}
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <Eye size={14} style={{ color: 'var(--text-tertiary)' }} />
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Campaign History</h3>
                    <span className="ml-auto text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{broadcasts.length} campaigns</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-36">
                        <div className="w-7 h-7 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                    </div>
                ) : broadcasts.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-14" style={{ color: 'var(--text-tertiary)' }}>
                        <Megaphone size={32} className="opacity-30" />
                        <p className="text-sm font-medium">No campaigns yet</p>
                        <p className="text-xs">Create your first broadcast to reach your customers</p>
                    </div>
                ) : (
                    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                        {broadcasts.map(b => {
                            const style = STATUS_STYLES[b.status] || STATUS_STYLES.draft;
                            const deliveryRate = b.totalRecipients > 0
                                ? Math.round((b.deliveredCount / b.totalRecipients) * 100) : 0;
                            return (
                                <div key={b._id} className="px-5 py-4 hover:bg-[var(--text-primary)]/[0.02] transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium line-clamp-2 mb-2" style={{ color: 'var(--text-primary)' }}>
                                                {b.message}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border capitalize", style)}>
                                                    {b.status}
                                                </span>
                                                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                                                    {AUDIENCE_LABELS[b.targetAudience] || b.targetAudience} · {b.totalRecipients} recipients
                                                </span>
                                                {b.sentAt && (
                                                    <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                                                        {new Date(b.sentAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <div className="text-sm font-semibold text-emerald-600">{deliveryRate}% delivered</div>
                                            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                                                {currSymbol}{(b.totalCost || 0).toFixed(2)} cost
                                            </div>
                                        </div>
                                    </div>
                                    {b.status === 'sent' && b.totalRecipients > 0 && (
                                        <div className="mt-3">
                                            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${deliveryRate}%` }} />
                                            </div>
                                            <div className="flex justify-between mt-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                                                <span>{b.sentCount || 0} sent · {b.deliveredCount || 0} delivered · {b.readCount || 0} read</span>
                                                <span>{b.failedCount || 0} failed</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
