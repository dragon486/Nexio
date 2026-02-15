import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, Building, Cpu, CreditCard, Users, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils'; // Adjust based on actual path
import GlassCard from '../../components/ui/GlassCard';

const SettingsLayout = () => {
    const navItems = [
        { icon: User, label: 'My Profile', path: '/dashboard/settings/profile' },
        { icon: Building, label: 'Business Profile', path: '/dashboard/settings/business' },
        { icon: Cpu, label: 'Automations', path: '/dashboard/settings/automations' },
        { icon: Users, label: 'Team Members', path: '/dashboard/settings/team', disabled: true },
        { icon: CreditCard, label: 'Billing & Usage', path: '/dashboard/settings/billing', disabled: true },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center text-sm text-gray-400 mb-6">
                <span>Settings</span>
                <ChevronRight size={14} className="mx-2" />
                <span className="text-white">Management</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Settings Sidebar */}
                <div className="md:col-span-3">
                    <GlassCard className="p-2 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.disabled ? '#' : item.path}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    item.disabled ? "opacity-50 cursor-not-allowed text-gray-600" : (
                                        isActive
                                            ? "bg-primary/10 text-white border border-primary/20 shadow-sm"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )
                                )}
                                onClick={e => item.disabled && e.preventDefault()}
                            >
                                <item.icon size={16} />
                                {item.label}
                                {item.disabled && <span className="ml-auto text-[10px] uppercase bg-white/5 px-1.5 py-0.5 rounded border border-white/5">Soon</span>}
                            </NavLink>
                        ))}
                    </GlassCard>
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
