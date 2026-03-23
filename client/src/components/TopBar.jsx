import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Moon, Sun } from 'lucide-react';
import { logout } from '../services/authService';
import { useTheme } from '../lib/ThemeContext';

const TopBar = ({ user }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="top-header bg-[var(--bg-secondary)] border-b border-[var(--border)] px-10 py-5 flex justify-between items-center sticky top-0 z-[100] will-change-transform">
            {/* Left: Page Label */}
            <div className="page-label text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                INTELLIGENCE DASHBOARD
            </div>

            {/* Right: Actions */}
            <div className="header-actions flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative group">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                    <input 
                        type="text" 
                        className="search-bar w-80 pl-11 pr-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-[var(--text-tertiary)]/50"
                        placeholder="Search metrics, customers, analytics..."
                    />
                </div>

                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className="icon-btn w-10 h-10 border border-[var(--border)] bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[var(--bg-primary)] transition-all"
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {/* User Profile */}
                <div className="user-profile flex items-center gap-3 pl-1.5 pr-4 py-1.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl">
                    <div className="user-avatar w-9 h-9 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="user-info text-left">
                        <div className="user-name text-[13px] font-semibold leading-tight">
                            {user?.name || 'Admin User'}
                        </div>
                        <div className="user-tier text-[10px] text-[var(--success-green)] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                            <span className="tier-dot w-1 h-1 bg-[var(--success-green)] rounded-full" />
                            EXECUTIVE
                        </div>
                    </div>
                </div>

                {/* Optional: Logout if needed, or keep it in Sidebar */}
            </div>
        </header>
    );
};

export default TopBar;
