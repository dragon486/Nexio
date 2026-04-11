import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
    User, Building, Cpu, CreditCard, Users, 
    ChevronRight, Zap, MessageSquare, Shield,
    Settings, Activity, Globe, Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const SettingsLayout = () => {
    const navItems = [
        { icon: User, label: 'Profile', path: '/dashboard/settings/profile' },
        { icon: Building, label: 'Business', path: '/dashboard/settings/business' },
        { icon: Cpu, label: 'Automations', path: '/dashboard/settings/automations' },
        { icon: Zap, label: 'Integrations', path: '/dashboard/settings/integrations' },
        { icon: MessageSquare, label: 'WhatsApp Bot', path: '/dashboard/settings/whatsapp', badge: 'ACTIVE' },
        { icon: Users, label: 'Team', path: '/dashboard/settings/team' },
        { icon: CreditCard, label: 'Billing', path: '/dashboard/settings/billing', disabled: true },
    ];

    return (
        <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-700">
            {/* Noir Settings Header */}
            <div className="mb-12 px-2">
                <div className="flex items-center gap-3 mb-4">
                     <div className="px-3 py-1 bg-[#12131a] text-blue-500 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 flex items-center gap-2">
                         <Settings size={10} className="stroke-[3]" />
                         System Settings
                     </div>
                     <div className="h-px w-12 bg-gray-200" />
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Account Management</span>
                </div>
                <h2 className="text-5xl font-black tracking-tighter text-[#12131a] uppercase italic leading-none mb-4">
                    Settings <span className="text-blue-500">Suite</span>
                </h2>
                <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic gap-2 opacity-60">
                    <Globe size={12} className="text-blue-500" /> Platform Deployment • Active Node: Asia/Mumbai
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Noir Settings Sidebar */}
                <div className="lg:col-span-3 lg:sticky lg:top-8">
                    <div className="bg-[#12131a] border border-white/5 rounded-[40px] p-4 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                             <Lock size={120} className="text-blue-500" />
                        </div>
                        
                        <div className="p-4 mb-6 border-b border-white/5 relative z-10">
                             <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Settings Menu</div>
                             <div className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">Navigation</div>
                        </div>

                        <div className="space-y-2 relative z-10">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.disabled ? '#' : item.path}
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-4 px-6 py-4 rounded-[24px] text-[11px] font-black transition-all uppercase tracking-widest border border-transparent",
                                        item.disabled ? "opacity-30 cursor-not-allowed text-gray-500" : (
                                            isActive
                                                ? "bg-white/10 text-white shadow-xl shadow-black/20 border-white/5 italic"
                                                : "text-gray-500 hover:text-white hover:bg-white/5"
                                        )
                                    )}
                                    onClick={e => item.disabled && e.preventDefault()}
                                >
                                    <item.icon size={18} className={cn("stroke-[2.5]", item.disabled ? "" : "text-blue-400")} />
                                    {item.label}
                                    {item.badge && <span className="ml-auto text-[8px] font-black uppercase bg-blue-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/20">{item.badge}</span>}
                                    {item.disabled && <span className="ml-auto text-[8px] font-black uppercase text-gray-600 italic">Locked</span>}
                                </NavLink>
                            ))}
                        </div>
                        
                        <div className="mt-8 p-6 bg-white/5 rounded-[32px] border border-white/5 relative z-10">
                             <div className="flex items-start gap-3">
                                  <Shield size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                  <p className="text-[9px] font-black text-gray-500 uppercase italic leading-relaxed tracking-tighter">
                                      All systems are operating normally. Your NEXIO platform is fully synchronized.
                                  </p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Content Area — Noir Page Container */}
                <div className="lg:col-span-9">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;
