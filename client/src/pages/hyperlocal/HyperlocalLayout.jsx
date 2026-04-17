import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, Bot, Users, Megaphone, BarChart3,
    ChevronLeft, Store, LogOut, Menu, ArrowRight, Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';
import { logout } from '../../services/authService';
import nexioLocalService from '../../services/nexio-localService';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard',   path: '/dashboard/nexio-local', end: true },
    { icon: Bot,             label: 'Bot Setup',    path: '/dashboard/nexio-local/bot' },
    { icon: Users,           label: 'Customers',    path: '/dashboard/nexio-local/customers' },
    { icon: Megaphone,       label: 'Broadcasts',   path: '/dashboard/nexio-local/broadcasts' },
    { icon: BarChart3,       label: 'Analytics',    path: '/dashboard/nexio-local/analytics' },
];

const CATEGORY_ICONS = {
    gym: '🏋️', salon: '💇', restaurant: '🍕', retail: '🛒',
    clinic: '🏥', education: '🎓', hotel: '🏨', other: '🏪',
};

export default function NexioLocalLayout() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        nexioLocalService.getMyBusiness()
            .then(setBusiness)
            .catch(() => navigate('/dashboard/nexio-local/onboarding'))
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen local-bg-primary">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-xs font-semibold local-text-secondary">Loading NEXIO Local...</p>
            </div>
        </div>
    );

    const isDark = theme === 'dark';

    return (
        <div
            className="flex min-h-screen"
            style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            data-theme={isDark ? 'dark' : 'light'}
        >
            {/* ── SIDEBAR ── */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-60 flex flex-col border-r transition-transform duration-300",
                mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
            )}
                style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}
            >
                {/* Logo Bar */}
                <div className="px-5 h-16 flex items-center gap-3 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Store size={16} className="text-white" />
                    </div>
                    <div>
                        <div className="text-[13px] font-black uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>NEXIO Local</div>
                        <div className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>WhatsApp Automation</div>
                    </div>
                </div>

                {/* Business Info */}
                {business && (
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'var(--bg-primary)' }}>
                            <span className="text-xl">{CATEGORY_ICONS[business.category] || '🏪'}</span>
                            <div className="min-w-0">
                                <div className="text-[12px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{business.name}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        (business.whatsappConfig?.isActive && business.whatsappConfig?.accessToken && business.whatsappConfig?.phoneNumberId) 
                                            ? "bg-emerald-500 animate-pulse" 
                                            : business.whatsappConfig?.isActive ? "bg-amber-500" : "bg-zinc-400"
                                    )} />
                                    <span className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                                        { (business.whatsappConfig?.isActive && business.whatsappConfig?.accessToken && business.whatsappConfig?.phoneNumberId)
                                            ? 'Bot Active' 
                                            : business.whatsappConfig?.isActive ? 'Setup Required' : 'Bot Inactive' }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    <p className="text-[10px] font-semibold px-2 mb-2 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                        Menu
                    </p>
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-[13px] font-medium",
                                isActive
                                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                                    : "hover:bg-[var(--text-primary)]/5"
                            )}
                            style={({ isActive }) => isActive ? {} : { color: 'var(--text-secondary)' }}
                        >
                            <item.icon size={16} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium hover:bg-[var(--text-primary)]/5 transition-all"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <ChevronLeft size={16} /> Back to NEXIO CRM
                    </Link>
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium hover:bg-red-500/5 hover:text-red-500 transition-all text-left"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <LogOut size={16} className="text-red-400" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 lg:ml-60 min-h-screen flex flex-col">
                {/* Mobile topbar */}
                <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b shrink-0" style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}>
                    <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-[var(--text-primary)]/5 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Store size={15} className="text-emerald-500" />
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>NEXIO Local</span>
                    </div>
                    <div className="w-9" />
                </div>

                {/* Page content */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet context={{ business, setBusiness }} />
                </div>
            </main>
        </div>
    );
}
