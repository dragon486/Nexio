import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Users, Moon, Sun, Settings, Layout } from 'lucide-react';
import api from '../services/api';
import { getSocket } from '../services/socketService';
import { useTheme } from '../lib/theme-context';
import { getUser } from '../services/authService';

/* Map pathname → readable page title */
const PAGE_TITLES = {
    '/dashboard':                  'Dashboard',
    '/dashboard/leads':            'Leads',
    '/dashboard/pipeline':         'Pipeline',
    '/dashboard/analytics':        'Analytics',
    '/dashboard/settings':         'Settings',
    '/dashboard/settings/automations': 'Automations',
    '/dashboard/settings/integrations': 'Integrations',
    '/dashboard/settings/team': 'Team Management',
    '/dashboard/admin':            'Admin Panel',
};

const TopBar = ({ user: propUser }) => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const authUser = getUser();
    const user = propUser || authUser;
    const [unreadCount, setUnreadCount] = useState(0);

    const isDashboard = location.pathname === '/dashboard';
    const title = PAGE_TITLES[location.pathname] || 'Dashboard';

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const { data } = await api.get('/notifications');
                const count = (data || []).filter(n => !n.read).length;
                setUnreadCount(count);
            } catch (err) {
                setUnreadCount(0);
                console.error('Failed to fetch unread notifications', err);
            }
        };
        fetchUnread();
        
        // Listen for mark-read events if any
        window.addEventListener('notifications-updated', fetchUnread);

        // REAL-TIME SOCKET LISTENER
        const socket = getSocket();
        if (socket) {
            socket.on('new_notification', fetchUnread);
        }

        return () => {
            window.removeEventListener('notifications-updated', fetchUnread);
            if (socket) {
                socket.off('new_notification', fetchUnread);
            }
        };
    }, []);

    return (
        <header className="sticky top-0 z-[100] h-[56px] bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between px-5 md:px-8 shrink-0">
            {/* Left — Page title */}
            <h1 className="text-lg font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                {title}
            </h1>

            {/* Right — Actions */}
            <div className="flex items-center gap-2">

                <div className="hidden sm:flex items-center -space-x-2 mr-1">
                    <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[var(--bg-primary)] bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </div>

                <Link to="/dashboard/settings/team" className="hidden sm:flex w-7 h-7 rounded-full border border-dashed border-gray-300 dark:border-gray-600 items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all mr-1" title="Add Team Member">
                    <Users size={12} />
                </Link>

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
                </button>

                {/* Notification bell */}
                <Link 
                    to="/dashboard/notifications"
                    className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                    <Bell size={15} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#0066ff] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 border-2 border-white dark:border-[var(--bg-primary)] scale-in animate-in slide-in-from-bottom-1 duration-300">
                            {unreadCount}
                        </span>
                    )}
                </Link>

                {/* Customize Widget button */}
                {isDashboard && (
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('open-widget-manager'))}
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-[var(--border)] rounded-lg text-[12px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                        <Layout size={13} />
                        Customize Widget
                    </button>
                )}

                {/* User avatar */}
                <div className="flex items-center gap-2 pl-2 border-l border-[var(--border)] ml-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066ff] to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="hidden lg:block text-left">
                        <p className="text-[12px] font-black leading-tight truncate max-w-[120px]" style={{ color: 'var(--text-primary)' }}>
                            {user?.name || 'User'}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5" style={{ color: 'var(--success-green)' }}>
                           ● {user?.plan || 'Free Plan'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
