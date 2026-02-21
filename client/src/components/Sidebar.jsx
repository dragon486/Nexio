import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { logout } from '../services/authService';

const Sidebar = () => {
    const navigate = useNavigate();
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Leads', path: '/dashboard/leads' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-surface/40 backdrop-blur-2xl border-r border-surface-border flex flex-col z-50">
            <div className="p-8 border-b border-surface-border/50">
                <Link to="/" className="text-white hover:text-zinc-400 transition-colors text-2xl font-black tracking-tighter italic drop-shadow-glow">
                    ARLO.AI
                </Link>
            </div>

            <nav className="flex-1 p-6 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                    >
                        {({ isActive }) => (
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/[0.03] transition-all",
                                isActive && "bg-white text-black shadow-glow font-black"
                            )}>
                                <item.icon size={18} className={cn("transition-colors", isActive ? "text-black" : "text-zinc-400 group-hover:text-white")} />
                                <span className="text-sm tracking-tight">{item.label}</span>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-surface-border/50">
                <button
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group"
                >
                    <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm tracking-tight">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
