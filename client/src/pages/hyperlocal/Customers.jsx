import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Search, Crown, MessageSquare, Phone } from 'lucide-react';
import { cn } from '../../lib/utils';
import nexioLocalService from '../../services/nexio-localService';

const MEMBERSHIP = {
    active:  'text-emerald-600 bg-emerald-500/10 border-emerald-500/30',
    expired: 'text-red-500 bg-red-500/10 border-red-400/30',
    trial:   'text-amber-600 bg-amber-500/10 border-amber-500/30',
    none:    'text-zinc-500 bg-zinc-500/10 border-zinc-400/20',
};

const TAG_COLORS = {
    vip: 'text-yellow-600 bg-yellow-500/10',
    regular: 'text-blue-600 bg-blue-500/10',
    new: 'text-emerald-600 bg-emerald-500/10',
    prospect: 'text-violet-600 bg-violet-500/10',
    churned: 'text-red-500 bg-red-500/10',
    follow_up: 'text-orange-600 bg-orange-500/10',
};

export default function NexioLocalCustomers() {
    const { business } = useOutletContext();
    const [customers, setCustomers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [tag, setTag] = useState('');
    const [membership, setMembership] = useState('');
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!business?._id) return;
        setLoading(true);
        nexioLocalService.getCustomers(business._id, { search, tag, membership, page, limit: 20 })
            .then(data => { setCustomers(data.customers || []); setTotal(data.total || 0); })
            .finally(() => setLoading(false));
    }, [business, search, tag, membership, page]);

    const currSymbol = { INR: '₹', USD: '$', EUR: '€', GBP: '£', SGD: 'S$' }[business?.currency] || '';

    const FILTER_TAGS = ['', 'new', 'regular', 'vip', 'prospect', 'churned'];
    const FILTER_MEM  = ['', 'active', 'expired', 'trial', 'none'];

    const inputStyle = {
        background: 'var(--bg-primary)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
    };

    return (
        <div className="space-y-5 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Users size={20} className="text-blue-500" /> Customers
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {total.toLocaleString()} total contacts
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by name or phone..."
                        className="w-full text-sm pl-9 pr-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        style={inputStyle}
                    />
                </div>

                {/* Tag filter */}
                <div className="flex gap-1 p-1 rounded-lg border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    {FILTER_TAGS.map(t => (
                        <button key={t} onClick={() => { setTag(t); setPage(1); }}
                            className={cn("px-3 py-1.5 rounded-md text-[11px] font-semibold capitalize transition-all",
                                tag === t ? "bg-blue-600 text-white" : "hover:bg-[var(--text-primary)]/5"
                            )}
                            style={tag !== t ? { color: 'var(--text-secondary)' } : {}}
                        >{t || 'All'}</button>
                    ))}
                </div>
            </div>

            {/* Membership filter */}
            <div className="flex flex-wrap gap-2">
                {FILTER_MEM.map(m => (
                    <button key={m} onClick={() => { setMembership(m); setPage(1); }}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-[11px] font-semibold border capitalize transition-all",
                            membership === m
                                ? "border-blue-500 bg-blue-500/10 text-blue-600"
                                : "hover:bg-[var(--text-primary)]/5"
                        )}
                        style={membership !== m ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}
                    >{m || 'All Status'}</button>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-7 h-7 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : customers.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-14" style={{ color: 'var(--text-tertiary)' }}>
                        <Users size={32} className="opacity-30" />
                        <p className="text-sm font-medium">No customers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}>
                                <tr>
                                    {['Customer', 'Tags', 'Status', 'Messages', 'Last Active', 'Spent'].map(h => (
                                        <th key={h} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                                {customers.map(c => {
                                    const mStyle = MEMBERSHIP[c.membershipStatus] || MEMBERSHIP.none;
                                    return (
                                        <tr key={c._id} onClick={() => setSelected(c)}
                                            className="cursor-pointer hover:bg-[var(--text-primary)]/[0.02] transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                        {(c.name || c.phone)?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                            {c.name || 'Unknown'}
                                                            {c.tags?.includes('vip') && <Crown size={11} className="inline ml-1 text-yellow-500" />}
                                                        </div>
                                                        <div className="text-[11px] font-mono" style={{ color: 'var(--text-tertiary)' }}>{c.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(c.tags || []).map(t => (
                                                        <span key={t} className={cn("text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full", TAG_COLORS[t] || 'text-zinc-500 bg-zinc-500/10')}>{t}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-lg border capitalize", mStyle)}>
                                                    {c.membershipStatus || 'none'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.totalMessages}</td>
                                            <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                {c.lastMessageDate ? new Date(c.lastMessageDate).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="px-5 py-4 text-sm font-semibold text-emerald-600">
                                                {c.totalSpent > 0 ? `${currSymbol}${c.totalSpent.toLocaleString()}` : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {total > 20 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Showing {Math.min(page * 20, total)} of {total}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium border hover:bg-[var(--text-primary)]/5 transition-all disabled:opacity-40"
                                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>← Prev</button>
                            <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium border hover:bg-[var(--text-primary)]/5 transition-all disabled:opacity-40"
                                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Next →</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Slide-over detail */}
            {selected && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
                    <div className="relative w-full max-w-sm border-l p-6 overflow-y-auto" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                        <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-xl" style={{ color: 'var(--text-tertiary)' }}>×</button>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-xl font-bold text-white">
                                {(selected.name || selected.phone)?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{selected.name || 'Unknown'}</h2>
                                <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                    <Phone size={11} /> {selected.phone}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-0 divide-y" style={{ borderColor: 'var(--border)' }}>
                            {[
                                { label: 'Membership', value: selected.membershipStatus || 'None' },
                                { label: 'Total Messages', value: selected.totalMessages },
                                { label: 'Total Spent', value: selected.totalSpent > 0 ? `${currSymbol}${selected.totalSpent.toLocaleString()}` : '—' },
                                { label: 'First Contact', value: selected.firstMessageDate ? new Date(selected.firstMessageDate).toLocaleDateString() : '—' },
                                { label: 'Last Active', value: selected.lastMessageDate ? new Date(selected.lastMessageDate).toLocaleDateString() : '—' },
                                { label: 'Allow Broadcasts', value: selected.allowBroadcasts ? '✅ Yes' : '❌ No' },
                            ].map(row => (
                                <div key={row.label} className="flex justify-between py-3">
                                    <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{row.label}</span>
                                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
