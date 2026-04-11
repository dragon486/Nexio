import React, { useState } from 'react';
import { Search, ChevronRight, BookOpen, Zap, MessageSquare, Settings, Shield, CreditCard, Phone, Mail, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

const categories = [
    {
        icon: Zap,
        label: 'Getting Started',
        color: 'text-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        articles: [
            { title: 'How to connect your WhatsApp Business account', time: '3 min read' },
            { title: 'Setting up your first lead pipeline', time: '5 min read' },
            { title: 'Understanding the AI scoring system', time: '4 min read' },
            { title: 'Onboarding your team members', time: '2 min read' },
        ],
    },
    {
        icon: MessageSquare,
        label: 'Leads & Pipeline',
        color: 'text-violet-500',
        bg: 'bg-violet-50 dark:bg-violet-500/10',
        articles: [
            { title: 'How AI qualifies and prioritizes leads', time: '6 min read' },
            { title: 'Moving leads through pipeline stages', time: '3 min read' },
            { title: 'Setting up automated follow-up sequences', time: '5 min read' },
        ],
    },
    {
        icon: Settings,
        label: 'Automations',
        color: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        articles: [
            { title: 'Creating your first automation workflow', time: '7 min read' },
            { title: 'Trigger conditions and actions explained', time: '4 min read' },
            { title: 'Integrating with CRM and email tools', time: '5 min read' },
        ],
    },
    {
        icon: CreditCard,
        label: 'Billing & Plans',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        articles: [
            { title: 'How billing cycles work', time: '2 min read' },
            { title: 'Upgrading or downgrading your plan', time: '3 min read' },
            { title: 'Requesting a refund', time: '2 min read' },
        ],
    },
    {
        icon: Shield,
        label: 'Security & Privacy',
        color: 'text-rose-500',
        bg: 'bg-rose-50 dark:bg-rose-500/10',
        articles: [
            { title: 'How your data is stored and protected', time: '4 min read' },
            { title: 'Two-factor authentication setup', time: '2 min read' },
            { title: 'GDPR compliance and data export', time: '3 min read' },
        ],
    },
];

const HelpCenter = () => {
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(null);

    const filtered = categories.map(c => ({
        ...c,
        articles: c.articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase())),
    })).filter(c => !search || c.articles.length > 0);

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl mb-4">
                    <BookOpen size={22} className="text-blue-500" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Help Center</h1>
                <p className="text-[var(--text-secondary)] text-sm">Find answers, guides, and resources for NEXIO</p>
            </div>

            {/* Search */}
            <div className="relative mb-8">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search for help articles..."
                    className="w-full pl-11 pr-4 py-3.5 card !p-0 !px-11 !rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm shadow-sm h-12"
                />
            </div>

            <div className="space-y-4">
                {filtered.map((cat, i) => (
                    <div key={i} className="card !p-0 overflow-hidden !shadow-sm">
                        <button
                            onClick={() => setExpanded(expanded === i ? null : i)}
                            className="w-full flex items-center gap-4 p-5 hover:bg-black/[0.02] transition-colors"
                        >
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', cat.bg)}>
                                <cat.icon size={18} className={cat.color} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-semibold text-sm leading-tight">{cat.label}</p>
                                <p className="text-xs opacity-50 mt-0.5">{cat.articles.length} articles</p>
                            </div>
                            <ChevronRight size={16} className={cn('opacity-40 transition-transform', expanded === i && 'rotate-90')} />
                        </button>
                        {expanded === i && (
                            <div className="border-t border-[var(--border)] divide-y divide-[var(--border-subtle)]">
                                {cat.articles.map((article, j) => (
                                    <button key={j} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors text-left group">
                                        <div className="flex-1">
                                            <p className="text-[13px] font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors">{article.title}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{article.time}</p>
                                        </div>
                                        <ExternalLink size={13} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors shrink-0" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="mailto:support@nexio.ai"
                    className="flex items-center gap-4 p-5 card !shadow-sm hover:border-blue-200 dark:hover:border-blue-500/20 transition-all group">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                        <Mail size={18} className="text-blue-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm leading-tight text-[var(--text-primary)]">Email Support</p>
                        <p className="text-xs text-[var(--text-secondary)]">support@nexio.ai</p>
                    </div>
                    <ChevronRight size={14} className="ml-auto opacity-30 group-hover:text-blue-500 transition-all" />
                </a>
                <a href="/contact"
                    className="flex items-center gap-4 p-5 card !shadow-sm hover:border-violet-200 dark:hover:border-violet-500/20 transition-all group">
                    <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center shrink-0">
                        <MessageSquare size={18} className="text-violet-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm leading-tight text-[var(--text-primary)]">Live Chat</p>
                        <p className="text-xs text-[var(--text-secondary)]">Typically replies within minutes</p>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-violet-500 transition-all" />
                </a>
            </div>
        </div>
    );
};

export default HelpCenter;
