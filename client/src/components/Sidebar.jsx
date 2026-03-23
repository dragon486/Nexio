import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { logout } from '../services/authService';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const navigate = useNavigate();
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Leads', path: '/dashboard/leads' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <aside className="sidebar w-[220px] bg-[#0f0f0f] p-0 fixed h-screen left-0 top-0 flex flex-col z-50">
            {/* 1. Sidebar Logo (EXACT SPEC) */}
            <div className="sidebar-logo pt-8">
                <Link to="/" className="logo-container flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer">
                    {/* Professional Animated Logo */}
                    <svg className="blueprint-icon mb-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        {/* Blueprint Frame */}
                        <rect x="15" y="35" width="70" height="30" 
                            fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.3"/>
                        
                        {/* Main Connection Path */}
                        <motion.path 
                            d="M 20 50 L 38 50 L 38 42 L 50 42 L 50 58 L 62 58 L 62 50 L 80 50" 
                            fill="none" 
                            stroke="#3b82f6" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                        />
                        
                        {/* Connection Nodes */}
                        {[
                            { cx: 20, cy: 50, color: "#ffffff" },
                            { cx: 38, cy: 50, color: "#3b82f6" },
                            { cx: 50, cy: 42, color: "#3b82f6" },
                            { cx: 50, cy: 58, color: "#3b82f6" },
                            { cx: 62, cy: 50, color: "#3b82f6" },
                            { cx: 80, cy: 50, color: "#ffffff" }
                        ].map((node, i) => (
                            <motion.circle 
                                key={i}
                                cx={node.cx} 
                                cy={node.cy} 
                                r="3.5" 
                                fill={node.color}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ 
                                    scale: [0, 1.2, 1],
                                    opacity: [0, 1, 1],
                                }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: i * 0.15,
                                    scale: { repeat: Infinity, repeatDelay: 3, duration: 1, delay: i * 0.2 + 2 }
                                }}
                            />
                        ))}
                    </svg>

                    {/* Wordmark */}
                    <div className="logo-wordmark text-center">
                        <div className="nexio-text text-[32px] font-black tracking-[-1.5px] text-white">NEXIO</div>
                    </div>
                </Link>
            </div>

            {/* 2. Navigation Section */}
            <nav className="flex-1 p-6 space-y-1 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                            isActive
                                ? "bg-white/10 text-white shadow-xl"
                                : "text-white/50 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[13px] font-medium tracking-wide">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* 3. Bottom Section / Terminate Session */}
            <div className="p-6 border-t border-white/5">
                <button
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-white/40 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group"
                >
                    <LogOut size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Terminate Session</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
