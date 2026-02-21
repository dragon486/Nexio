import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, LogOut, Settings, HelpCircle, Clock, Sparkles, LayoutDashboard, Zap, CreditCard, Users } from 'lucide-react';
import { logout } from '../services/authService';
import { getLeads, markAsRead as markAsReadInService, markAllAsRead as markAllLeadsAsRead } from '../services/leadService';
import { getNotifications, markAsRead as markNotifAsRead, markAllAsRead as markAllNotifsAsRead } from '../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

import { cn } from '../lib/utils';

const SEARCH_ITEMS = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, keywords: ['home', 'main', 'analytics', 'revenue'] },
    { title: 'Leads Central', path: '/dashboard/leads', icon: Users, keywords: ['contacts', 'crm', 'prospects'] },
    { title: 'Live Feed', path: '/dashboard', icon: Sparkles, keywords: ['activity', 'realtime', 'notifications'] },
    { title: 'Profile Settings', path: '/dashboard/settings/profile', icon: User, keywords: ['account', 'user', 'password'] },
    { title: 'Business Settings', path: '/dashboard/settings/business', icon: Building2, keywords: ['company', 'hours', 'branding'] },
    { title: 'Automations', path: '/dashboard/settings/automations', icon: Zap, keywords: ['ai', 'autopilot', 'reply', 'bot'] },
    { title: 'Integrations', path: '/dashboard/settings/integrations', icon: Code, keywords: ['api', 'key', 'zapier', 'webhook'] },
    { title: 'Subscription', path: '/dashboard/settings/billing', icon: CreditCard, keywords: ['plan', 'pro', 'upgrade', 'billing'] },
];

// Re-import icons that might be missing from top-level import
import { Building2, Code } from 'lucide-react';

const TopBar = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // State
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [recentLeads, setRecentLeads] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isPulseActive, setIsPulseActive] = useState(false);
    const lastUnreadCountRef = useRef(0);

    const fetchRecent = async (isInitial = false) => {
        try {
            const [leadsData, notifsData] = await Promise.all([
                getLeads(),
                getNotifications()
            ]);

            const slicedLeads = leadsData.slice(0, 5);
            setRecentLeads(slicedLeads);
            setNotifications(notifsData);

            const currentUnreadCount = leadsData.filter(l => !l.read).length + notifsData.filter(n => !n.read).length;

            // Activate pulse ONLY if unread count increased
            if (!isInitial && currentUnreadCount > lastUnreadCountRef.current) {
                setIsPulseActive(true);
            }

            lastUnreadCountRef.current = currentUnreadCount;
        } catch (err) {
            console.error(err);
        }
    };

    // Initial Fetch
    useEffect(() => {
        fetchRecent(true);

        // Polling every 30 seconds for new leads
        const interval = setInterval(() => fetchRecent(), 30000);
        return () => clearInterval(interval);
    }, []);

    // Also update when location changes (in case leads were marked as read elsewhere)
    useEffect(() => {
        fetchRecent();
    }, [location.pathname]);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Refs for click outside
    const profileRef = useRef(null);
    const notificationRef = useRef(null);
    const searchRef = useRef(null);

    // Click Outside Handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search Logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();

        // Filter Navigation Items
        const navResults = SEARCH_ITEMS.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.keywords.some(k => k.toLowerCase().includes(query))
        );

        setSearchResults(navResults);
    }, [searchQuery]);

    const handleSearchSelect = (path) => {
        navigate(path);
        setSearchQuery('');
        setIsSearchFocused(false);
    };

    const handleSearchEnter = (e) => {
        if (e.key === 'Enter') {
            if (searchResults.length > 0) {
                handleSearchSelect(searchResults[0].path);
            } else {
                // Fallback: Search Leads
                navigate(`/dashboard/leads?search=${encodeURIComponent(searchQuery)}`);
                setSearchQuery('');
                setIsSearchFocused(false);
            }
        }
    };

    const breadcrumbs = location.pathname.split('/').filter(Boolean).length > 0
        ? location.pathname.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1))
        : ['Dashboard'];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 border-b border-surface-border bg-background/50 backdrop-blur-2xl flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Left: Breadcrumbs */}
            <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em]">
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className="mx-2 text-surface-border">/</span>}
                        <span className={index === breadcrumbs.length - 1 ? "text-white" : "text-muted"}>
                            {crumb}
                        </span>
                    </React.Fragment>
                ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">

                {/* 1. Global Command Search */}
                <div className="relative hidden lg:block group" ref={searchRef}>
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Settings, Pages, or Leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onKeyDown={handleSearchEnter}
                        className="bg-surface-soft/50 border border-surface-border rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-primary/50 transition-all w-72 focus:w-96 placeholder:text-muted/50 shadow-inner"
                    />

                    {/* Search Results Dropdown */}
                    {isSearchFocused && searchQuery && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F0F12] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                            {searchResults.length > 0 && (
                                <div className="p-2 border-b border-white/5">
                                    <h4 className="px-2 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Navigate</h4>
                                    {searchResults.map((item) => (
                                        <button
                                            key={item.title}
                                            onClick={() => handleSearchSelect(item.path)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                                        >
                                            <item.icon size={14} className="text-primary" />
                                            <span>{item.title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Always show "Search Leads" option */}
                            <div className="p-2">
                                <button
                                    onClick={() => {
                                        navigate(`/dashboard/leads?search=${encodeURIComponent(searchQuery)}`);
                                        setSearchQuery('');
                                        setIsSearchFocused(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                                >
                                    <Search size={14} className="text-muted" />
                                    <span>Search leads for "{searchQuery}"</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-6 w-[1px] bg-white/10 mx-2" />

                {/* 2. Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => {
                            setIsNotificationsOpen(!isNotificationsOpen);
                            if (isPulseActive) setIsPulseActive(false);
                        }}
                        className={cn("relative p-2 transition-colors rounded-full hover:bg-white/5", isNotificationsOpen ? "text-white bg-white/5" : "text-gray-400")}
                    >
                        <Bell size={18} />
                        {isPulseActive && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_#fff]" />
                        )}
                        {!isPulseActive && (recentLeads.some(l => !l.read) || notifications.some(n => !n.read)) && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white/40 rounded-full border border-black shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
                        )}
                    </button>

                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0F0F12] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white">Notifications</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                await Promise.all([markAllLeadsAsRead(), markAllNotifsAsRead()]);
                                                setRecentLeads(prev => prev.map(l => ({ ...l, read: true })));
                                                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                                setIsPulseActive(false);
                                                lastUnreadCountRef.current = 0;
                                            } catch (err) { console.error(err); }
                                        }}
                                        className="text-[10px] text-gray-500 hover:text-white transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                {recentLeads.length === 0 && notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 text-xs italic">
                                        No recent activity found.
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        {/* Merged Timeline Section */}
                                        {[
                                            ...notifications.map(n => ({ ...n, itemType: 'system' })),
                                            ...recentLeads.map(l => ({ ...l, itemType: 'lead' }))
                                        ]
                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            .map(item => {
                                                if (item.itemType === 'system') {
                                                    const notif = item;
                                                    return (
                                                        <button
                                                            key={`notif-${notif._id}`}
                                                            onClick={async () => {
                                                                if (!notif.read) {
                                                                    try {
                                                                        await markNotifAsRead(notif._id);
                                                                        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
                                                                    } catch (err) { console.error(err); }
                                                                }
                                                                if (notif.link) navigate(notif.link);
                                                                setIsNotificationsOpen(false);
                                                            }}
                                                            className={cn(
                                                                "w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 group",
                                                                !notif.read ? "bg-white/[0.04]" : "opacity-60"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-full border flex items-center justify-center shrink-0 group-hover:scale-105 transition-all shadow-glow-sm",
                                                                notif.type === 'ai_limit' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                                                    notif.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                                                        "bg-blue-500/10 border-blue-500/20 text-blue-500"
                                                            )}>
                                                                {notif.type === 'ai_limit' ? <Clock size={16} className="animate-pulse" /> :
                                                                    notif.type === 'error' ? <AlertTriangle size={16} /> :
                                                                        <Info size={16} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-white leading-tight">
                                                                    {notif.title}
                                                                    {!notif.read && <span className="ml-2 w-1.5 h-1.5 bg-amber-500 rounded-full inline-block shadow-[0_0_5px_#f59e0b]" />}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{notif.message}</p>
                                                                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-600">
                                                                    <Clock size={10} />
                                                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                } else {
                                                    const lead = item;
                                                    return (
                                                        <button
                                                            key={`lead-${lead._id}`}
                                                            onClick={async () => {
                                                                if (!lead.read) {
                                                                    try {
                                                                        await markAsReadInService(lead._id);
                                                                        setRecentLeads(prev => prev.map(l => l._id === lead._id ? { ...l, read: true } : l));
                                                                    } catch (err) { console.error(err); }
                                                                }
                                                                navigate(`/dashboard/leads/${lead._id}`);
                                                                setIsNotificationsOpen(false);
                                                            }}
                                                            className={cn(
                                                                "w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 group",
                                                                !lead.read ? "bg-white/[0.02]" : "opacity-60"
                                                            )}
                                                        >
                                                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-all">
                                                                <Sparkles size={16} className={cn("text-white", !lead.read && "animate-pulse")} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-white group-hover:text-zinc-300 transition-colors">
                                                                    New Lead: {lead.name}
                                                                    {!lead.read && <span className="ml-2 w-1.5 h-1.5 bg-white rounded-full inline-block shadow-[0_0_5px_#fff]" />}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate">{lead.message}</p>
                                                                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-600">
                                                                    <Clock size={10} />
                                                                    {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                }
                                            })}
                                    </div>
                                )}
                            </div>
                            <Link
                                to="/dashboard/leads"
                                onClick={() => setIsNotificationsOpen(false)}
                                className="block p-3 text-center text-xs text-white hover:bg-white/5 transition-colors font-black uppercase tracking-widest"
                            >
                                View all leads
                            </Link>
                        </div>
                    )}
                </div>


                {/* 3. Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={cn("flex items-center gap-3 pl-2 pr-1 py-1 rounded-full transition-colors border hover:border-white/5", isProfileOpen ? "bg-white/5 border-white/5" : "border-transparent")}
                    >
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-black shadow-glow">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="hidden md:block text-left mr-2">
                            <div className="text-xs font-medium text-white leading-none mb-0.5">{user?.name || 'User'}</div>
                            <div className="text-[10px] text-gray-500 leading-none">Pro Plan</div>
                        </div>
                        <ChevronDown size={14} className="text-gray-500" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0F0F12] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-3 border-b border-white/5">
                                <p className="text-sm font-medium text-white">{user?.business?.name || 'My Business'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                            <div className="p-1">
                                <button onClick={() => { navigate('/dashboard/settings/profile'); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                    <User size={16} /> Profile
                                </button>
                                <button onClick={() => { navigate('/dashboard/settings/business'); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                    <Settings size={16} /> Business Settings
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                    <HelpCircle size={16} /> Help & Support
                                </button>
                            </div>
                            <div className="p-1 border-t border-white/5">
                                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopBar;
