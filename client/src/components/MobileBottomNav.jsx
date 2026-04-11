import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Activity, BarChart2, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../lib/theme-context';

const MobileBottomNav = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const navItems = [
        { icon: Home,     label: 'Home',     path: '/dashboard',          end: true },
        { icon: Users,    label: 'Leads',    path: '/dashboard/leads',    end: false },
        { icon: Activity, label: 'Pipeline', path: '/dashboard/pipeline', end: false },
        { icon: BarChart2,label: 'Analytics',path: '/dashboard/analytics',end: false },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings', end: false },
    ];

    return (
        <nav 
            className={cn(
                'md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 h-16 border-t transition-all duration-300',
                isDark ? 'shadow-[0_-4px_25px_rgba(0,0,0,0.15)] backdrop-blur-2xl' : 'shadow-[0_-4px_20px_rgba(0,0,0,0.04)]'
            )}
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}
        >
            {navItems.map(item => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) => cn(
                        'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 min-w-0',
                        isActive 
                            ? 'text-blue-600' 
                            : 'text-gray-400 hover:text-gray-600'
                    )}
                    style={({ isActive }) => ({
                        color: isActive ? 'var(--accent-blue)' : 'var(--text-tertiary)'
                    })}
                >
                    {({ isActive }) => (
                        <>
                            <div className={cn(
                                'w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300',
                                isActive ? 'bg-blue-600/10' : 'bg-transparent'
                            )}>
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-80">
                                {item.label}
                            </span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default MobileBottomNav;
