import React, { useState } from 'react';
import { MessageSquare, Star, Bug, Lightbulb, CheckCircle, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import api from '../services/api';
import { getUser } from '../services/authService';

const TYPES = [
    { id: 'bug',       label: 'Bug Report',     icon: Bug,        color: 'text-rose-500',   bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { id: 'feature',   label: 'Feature Request', icon: Lightbulb,  color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { id: 'general',   label: 'General',          icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
];

const Feedback = () => {
    const user = getUser();
    const [type, setType] = useState('general');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setSubmitting(true);
        try {
            // Try to send via API; graceful fallback
            await api.post('/feedback', { type, rating, message, user: user?.name }).catch(() => {});
        } catch {}
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 800);
    };

    if (submitted) return (
        <div className="p-4 md:p-8 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={28} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Thank you!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm leading-relaxed">
                Your feedback helps us build a better product for you. We review every submission.
            </p>
            <button onClick={() => { setSubmitted(false); setMessage(''); setRating(0); }}
                className="mt-6 px-5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors">
                Send More Feedback
            </button>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl mb-4">
                    <MessageSquare size={22} className="text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Share Your Feedback</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Help us make NEXIO better for you</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Type selector */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Type</label>
                    <div className="grid grid-cols-3 gap-3">
                        {TYPES.map(t => (
                            <button key={t.id} type="button" onClick={() => setType(t.id)}
                                className={cn(
                                    'flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all',
                                    type === t.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                        : 'border-[var(--border)] bg-white dark:bg-[var(--bg-secondary)] hover:border-gray-300 dark:hover:border-white/10'
                                )}>
                                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', t.bg)}>
                                    <t.icon size={16} className={t.color} />
                                </div>
                                <span className={cn('text-[11px] font-semibold', type === t.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400')}>
                                    {t.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Star rating */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        How would you rate NEXIO overall?
                    </label>
                    <div className="flex items-center gap-2">
                        {[1,2,3,4,5].map(s => (
                            <button key={s} type="button"
                                onMouseEnter={() => setHoverRating(s)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(s)}
                                className="p-1 transition-transform hover:scale-110">
                                <Star size={24}
                                    className={cn('transition-colors', (hoverRating || rating) >= s ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700')} />
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {['','Awful','Poor','Okay','Good','Amazing!'][rating]}
                            </span>
                        )}
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tell us more
                    </label>
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={5}
                        placeholder={type === 'bug' ? 'Describe what happened and how to reproduce it...' : type === 'feature' ? 'Describe the feature you\'d like to see...' : 'What\'s on your mind?'}
                        className="w-full px-4 py-3 bg-white dark:bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                        required
                    />
                    <div className="flex justify-end mt-1">
                        <span className={cn('text-[10px]', message.length > 480 ? 'text-red-400' : 'text-gray-400')}>
                            {message.length}/500
                        </span>
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={submitting || !message.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-sm font-semibold transition-all">
                    {submitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send size={15} /> Submit Feedback
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default Feedback;
