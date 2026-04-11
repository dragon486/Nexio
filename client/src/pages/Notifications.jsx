import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck, Users, Zap, TrendingUp, MessageSquare, AlertCircle, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import api from '../services/api';

/* Generate a refined welcome message if the notification list is entirely empty */
const getEmptyStateActions = (user = null) => {
    const firstName = user?.name?.split(' ')[0] || 'there';
    return [
        {
            id: 'welcome-nexus',
            type: 'system',
            read: true,
            time: new Date(),
            icon: Zap,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-500/10',
            title: `Welcome to NEXIO, ${firstName}!`,
            body: 'Your intelligent sales workspace is ready. High-intent leads will appear here in real-time.',
            action: { label: 'Go to Dashboard', path: '/dashboard' },
        }
    ];
};

const timeAgo = (date) => {
    const diff = (new Date() - new Date(date)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/notifications');
                const dbNotifs = data || [];
                const userData = JSON.parse(localStorage.getItem('user'));
                
                if (dbNotifs.length > 0) {
                    setNotifications(dbNotifs.map(n => ({
                        id: n._id,
                        type: n.type,
                        read: n.read,
                        time: n.createdAt,
                        title: n.title,
                        body: n.message,
                        icon: n.type === 'lead' ? Users : n.type === 'ai_limit' ? Zap : AlertCircle,
                        color: n.type === 'error' ? 'text-rose-500' : 'text-blue-500',
                        bg: n.type === 'error' ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-blue-50 dark:bg-blue-500/10',
                        action: n.link ? { label: 'View', path: n.link } : null
                    })));
                } else {
                    setNotifications(getEmptyStateActions(userData));
                }
            } catch (err) {
                console.error("Failed to load notifications", err);
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };
        load();
        
        // Listen for real-time updates while page is open
        window.addEventListener('notifications-updated', load);
        return () => window.removeEventListener('notifications-updated', load);
    }, []);

    const markRead = async (id) => {
        if (id.toString().startsWith('real-')) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            return;
        }
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const remove = async (id) => {
        // Assume removal is local for pseudo-notifs or just filter it out
        setNotifications(prev => prev.filter(n => n.id !== id));
        // If it's a real lead notification, we just hide it locally
    };

    const filtered = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        if (filter === 'leads') return n.type === 'lead';
        if (filter === 'ai') return n.type === 'ai';
        return true;
    });
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter">Notifications</h1>
                    {unreadCount > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1 italic">{unreadCount} unread</p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead}
                        className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-black text-blue-500 border border-blue-200 dark:border-blue-500/20 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all uppercase tracking-widest italic"
                    >
                        <CheckCheck size={14} className="stroke-[3]" /> Mark all read
                    </button>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl p-1 mb-6">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'leads', label: 'Leads' },
                    { id: 'ai', label: 'AI Activity' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setFilter(tab.id)}
                        className={cn('px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all uppercase tracking-widest',
                            filter === tab.id
                                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60'
                        )}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Notification list */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-4 border-blue-100 dark:border-white/10 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <Bell size={36} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications here</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map(n => (
                        <div key={n.id}
                            className={cn(
                                'relative flex items-start gap-4 p-5 rounded-[24px] border transition-all group !shadow-xl',
                                'bg-white dark:bg-[#16171d] border-gray-100 dark:border-white/5',
                                !n.read && 'border-blue-200 dark:border-blue-500/30 bg-blue-50/30 dark:bg-blue-500/[0.03]'
                            )}>
                            {/* Unread indicator */}
                            {!n.read && (
                                <div className="absolute top-5 right-5 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                </div>
                            )}

                            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5', n.bg)}>
                                <n.icon size={20} className={n.color} />
                            </div>

                            <div className="flex-1 min-w-0 pr-8">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <p className="text-[15px] font-black text-black dark:text-white tracking-tight leading-none uppercase italic">
                                        {n.title}
                                    </p>
                                </div>
                                <p className="text-[13px] text-gray-500 dark:text-gray-400 font-bold leading-relaxed max-w-[90%]">{n.body}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="flex items-center gap-1 text-[10px] opacity-40">
                                        <Clock size={10} /> {timeAgo(n.time)}
                                    </span>
                                    {n.action && (
                                        <Link to={n.action.path}
                                            onClick={() => markRead(n.id)}
                                            className="text-[11px] font-semibold text-blue-500 hover:underline">
                                            {n.action.label} →
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Actions on hover */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                {!n.read && (
                                    <button onClick={() => markRead(n.id)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                                        title="Mark read">
                                        <Check size={13} />
                                    </button>
                                )}
                                <button onClick={() => remove(n.id)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                    title="Remove">
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
