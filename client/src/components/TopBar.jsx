import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const TopBar = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    // Simple breadcrumb logic
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = pathSegments.length > 0
        ? pathSegments.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
        : ['Dashboard'];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 border-b border-white/5 bg-surface/30 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-20">
            {/* Left: Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-400">
                <Link to="/" className="text-gray-600 mr-2 hover:text-white transition-colors font-bold">Arlo.ai</Link>
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                        <span className="mx-2 text-gray-600">/</span>
                        <span className={index === breadcrumbs.length - 1 ? "text-white font-medium" : ""}>
                            {crumb}
                        </span>
                    </React.Fragment>
                ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Search (Visual Only) */}
                <div className="relative hidden md:block group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-black/20 border border-white/5 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-all w-64 focus:w-80"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="text-[10px] bg-white/10 px-1.5 rounded text-gray-400">⌘</span>
                        <span className="text-[10px] bg-white/10 px-1.5 rounded text-gray-400">K</span>
                    </div>
                </div>

                <div className="h-6 w-[1px] bg-white/10 mx-2" />

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary/20">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="hidden md:block text-left mr-2">
                            <div className="text-xs font-medium text-white leading-none mb-0.5">{user?.name || 'User'}</div>
                            <div className="text-[10px] text-gray-500 leading-none">Pro Plan</div>
                        </div>
                        <ChevronDown size={14} className="text-gray-500" />
                    </button>

                    {isProfileOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-30"
                                onClick={() => setIsProfileOpen(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0F0F12] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-3 border-b border-white/5">
                                    <p className="text-sm font-medium text-white">{user?.business?.name || 'My Business'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <div className="p-1">
                                    <button onClick={() => navigate('/dashboard/settings/profile')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        <User size={16} /> Profile
                                    </button>
                                    <button onClick={() => navigate('/dashboard/settings')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
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
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopBar;
