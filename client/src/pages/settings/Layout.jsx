import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, Building, Cpu, CreditCard, Users, ChevronRight, Zap } from 'lucide-react';
import { cn } from '../../lib/utils'; // Adjust based on actual path


const SettingsLayout = () => {
    const navItems = [
        { icon: User, label: 'My Profile', path: '/dashboard/settings/profile' },
        { icon: Building, label: 'Business Profile', path: '/dashboard/settings/business' },
        { icon: Cpu, label: 'Automations', path: '/dashboard/settings/automations' },
        { icon: Zap, label: 'Integrations', path: '/dashboard/settings/integrations' },
        { icon: Users, label: 'Team Members', path: '/dashboard/settings/team', disabled: true },
        { icon: CreditCard, label: 'Billing & Usage', path: '/dashboard/settings/billing', disabled: true },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center text-sm text-muted-foreground mb-6">
                <span>Settings</span>
                <ChevronRight size={14} className="mx-2" />
                <span className="text-foreground font-bold">Management</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Settings Sidebar */}
                <div className="md:col-span-3">
                    <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[12px] p-2 space-y-1 shadow-sm transition-all duration-300">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.disabled ? '#' : item.path}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    item.disabled ? "opacity-40 cursor-not-allowed text-muted-foreground" : (
                                        isActive
                                            ? "bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20 font-black tracking-tight"
                                            : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-[#f8fafc] hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a]/80"
                                    )
                                )}
                                onClick={e => item.disabled && e.preventDefault()}
                            >
                                <item.icon size={16} />
                                {item.label}
                                {item.disabled && <span className="ml-auto text-[8px] font-black uppercase bg-[#fafafa] dark:bg-[#0f0f0f] px-1.5 py-0.5 rounded border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#94a3b8]">Coming Soon</span>}
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="md:col-span-9">
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;
