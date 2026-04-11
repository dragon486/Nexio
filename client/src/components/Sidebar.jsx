import React, { useState } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, Activity, BarChart2, Zap, Settings,
    Shield, LogOut, Search, HelpCircle, MessageSquare,
    ChevronLeft, ChevronRight, Bell, Cpu, Store, ArrowRight,
    Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../lib/theme-context';
import { logout, getUser } from '../services/authService';

const Sidebar = ({ isMinimized, toggleMinimize, isMobileOpen, closeMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();
    const { theme } = useTheme();
    const isAdmin = user?.email === 'adelmuhammed786@gmail.com';
    const [search, setSearch] = useState('');

    const mainMenu = [
        { icon: LayoutDashboard, label: 'Dashboard',    path: '/dashboard', end: true },
        { icon: Users,           label: 'Leads',         path: '/dashboard/leads' },
        { icon: Activity,        label: 'Pipeline',      path: '/dashboard/pipeline', badge: 'AI' },
        { icon: Cpu,             label: 'Automations',   path: '/dashboard/settings/automations' },
        { icon: BarChart2,       label: 'Analytics',     path: '/dashboard/analytics' },
        { icon: Zap,             label: 'Integrations',  path: '/dashboard/settings/integrations' },
        ...(isAdmin ? [{ icon: Shield, label: 'Admin', path: '/dashboard/admin' }] : []),
    ];

    const toolsMenu = [
        { icon: Bell,          label: 'Notifications', path: '/dashboard/notifications' },
        { icon: MessageSquare, label: 'WhatsApp Bot',  path: '/dashboard/settings/whatsapp' },
        { icon: Settings,      label: 'Settings',      path: '/dashboard/settings' },
    ];

    const handleLogout = () => { logout(); navigate('/login'); };

    const filteredMain  = mainMenu.filter(i => i.label.toLowerCase().includes(search.toLowerCase()));
    const filteredTools = toolsMenu.filter(i => i.label.toLowerCase().includes(search.toLowerCase()));

    const NavItem = ({ item }) => (
        <NavLink
            to={item.path}
            end={item.end}
            onClick={closeMobile}
            className={({ isActive }) => cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative text-sm mb-0.5',
                isMinimized && 'justify-center px-0 mx-2',
                isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5 hover:text-[var(--text-primary)] font-medium'
            )}
        >
            {({ isActive }) => (
                <>
                    <item.icon size={17} className={cn('shrink-0', isActive ? '' : 'group-hover:scale-105 transition-transform')} />
                    {!isMinimized && (
                        <>
                            <span className="flex-1 truncate text-[13px]">{item.label}</span>
                            {item.badge && (
                                <span className={cn(
                                    "ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide",
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : typeof item.badge === 'number'
                                            ? "bg-red-500 text-white"
                                            : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                )}>
                                    {item.badge}
                                </span>
                            )}
                        </>
                    )}
                </>
            )}
        </NavLink>
    );

    return (
        <>
            <aside
                className={cn(
                    'fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300',
                    'border-r',
                    isMinimized ? 'w-[72px]' : 'w-[240px]',
                    isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
                )}
                style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}
            >
                {/* ── Logo ── */}
                <Link
                    to="/"
                    className={cn(
                        'flex items-center gap-3 px-5 h-[64px] border-b shrink-0 hover:bg-[var(--text-primary)]/5 transition-colors',
                        isMinimized && 'justify-center px-2'
                    )}
                    style={{ borderColor: 'var(--border)' }}
                >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shrink-0">
                        N
                    </div>
                    {!isMinimized && (
                        <div className="min-w-0">
                            <p className="text-[14px] font-black uppercase tracking-tight truncate leading-none" style={{ color: 'var(--text-primary)' }}>
                                NEXIO
                            </p>
                            <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                {user?.business?.name ? user.business.name : 'Sales Platform'}
                            </p>
                        </div>
                    )}
                </Link>

                {/* ── Search ── */}
                {!isMinimized && (
                    <div className="px-4 mt-4 mb-2">
                        <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-9 pr-3 py-2 text-[12px] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                                style={{
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)',
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* ── Nav ── */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-5">

                    {/* Main menu */}
                    <div className="px-3 space-y-0.5">
                        {!isMinimized && (
                            <p className="text-[10px] font-semibold px-3 mb-2 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                                Main Menu
                            </p>
                        )}
                        {filteredMain.map(item => <NavItem key={item.path} item={item} />)}
                    </div>

                    {/* Tools */}
                    <div className="px-3 space-y-0.5">
                        {!isMinimized && (
                            <p className="text-[10px] font-semibold px-3 mb-2 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                                Tools
                            </p>
                        )}
                        {filteredTools.map(item => <NavItem key={item.path} item={item} />)}
                    </div>

                    {/* ── Product Switcher ── */}
                    {!isMinimized && (
                        <div className="px-3">
                            <p className="text-[10px] font-semibold px-3 mb-3 uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
                                Active Product
                            </p>
                            <div className="space-y-2">
                                {/* NEXIO CRM */}
                                <Link
                                    to="/dashboard"
                                    className={cn(
                                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all border",
                                        !location.pathname.includes('/nexio-local')
                                            ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20"
                                            : "border-transparent hover:bg-[var(--text-primary)]/5"
                                    )}
                                    style={location.pathname.includes('/nexio-local') ? { color: 'var(--text-secondary)' } : {}}
                                >
                                    <LayoutDashboard size={15} />
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className={cn("text-[12px] font-semibold truncate", !location.pathname.includes('/nexio-local') ? "text-white" : "text-[var(--text-primary)]")}>NEXIO CRM</div>
                                        <div className={cn("text-[9px] font-medium", !location.pathname.includes('/nexio-local') ? "text-blue-100" : "text-[var(--text-tertiary)]")}>Sales Automation</div>
                                    </div>
                                    {!location.pathname.includes('/nexio-local') && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </Link>

                                {/* NEXIO Local */}
                                <Link
                                    to="/dashboard/nexio-local"
                                    className={cn(
                                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all border",
                                        location.pathname.includes('/nexio-local')
                                            ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20"
                                            : "border-transparent hover:bg-[var(--text-primary)]/5"
                                    )}
                                    style={!location.pathname.includes('/nexio-local') ? { color: 'var(--text-secondary)' } : {}}
                                >
                                    <Store size={15} className={!location.pathname.includes('/nexio-local') ? "text-emerald-500" : "text-white"} />
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className={cn("text-[12px] font-semibold truncate", location.pathname.includes('/nexio-local') ? "text-white" : "text-[var(--text-primary)]")}>NEXIO Local</div>
                                        <div className={cn("text-[9px] font-medium", location.pathname.includes('/nexio-local') ? "text-emerald-100" : "text-[var(--text-tertiary)]")}>WhatsApp Bot</div>
                                    </div>
                                    {location.pathname.includes('/nexio-local') && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className={cn('border-t p-3 space-y-1 shrink-0')} style={{ borderColor: 'var(--border)' }}>
                    {!isMinimized && (
                        <div className="space-y-0.5">
                            <NavLink
                                to="/dashboard/help"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium hover:bg-[var(--text-primary)]/5 transition-all"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <HelpCircle size={14} style={{ color: 'var(--text-tertiary)' }} /> Help & Support
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium hover:bg-red-500/5 hover:text-red-500 transition-all text-left"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <LogOut size={14} className="text-red-400" /> Sign Out
                            </button>
                        </div>
                    )}

                    {isMinimized && (
                        <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-red-400 transition-all">
                            <LogOut size={16} />
                        </button>
                    )}

                    {/* Upgrade CTA */}
                    {!isMinimized && (
                        <div className="mt-2 p-3 rounded-xl border relative overflow-hidden cursor-pointer group/up hover:border-blue-500/40 transition-all"
                            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                            <div className="flex items-start gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-600/10 flex items-center justify-center shrink-0">
                                    <Sparkles size={14} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        Upgrade to Pro
                                    </p>
                                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                                        Unlock unlimited leads & AI features
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 py-1.5 rounded-lg transition-colors">
                                Upgrade Plan <ArrowRight size={10} />
                            </div>
                        </div>
                    )}

                    {/* Collapse toggle */}
                    <button
                        onClick={toggleMinimize}
                        className={cn(
                            'hidden md:flex w-full h-9 rounded-xl items-center justify-center border hover:bg-[var(--text-primary)]/5 transition-all mt-1',
                        )}
                        style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}
                    >
                        {isMinimized ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
