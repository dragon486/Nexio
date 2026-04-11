import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import MobileBottomNav from '../components/MobileBottomNav';
import useIsMobile from '../hooks/useIsMobile';
import { useTheme } from '../lib/theme-context';
import { getMe } from '../services/authService';
import { getMyBusiness } from '../services/businessService';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';

const MainLayout = () => {
    const [user, setUser] = useState(null);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchUserContext = async () => {
            try {
                const userData = await getMe();
                if (userData) {
                    const business = await getMyBusiness();
                    setUser({ ...userData, business });
                }
            } catch (error) {
                console.error("Failed to load user context", error);
            }
        };
        fetchUserContext();
    }, []);

    const toggleMinimize = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);


    return (
        <div data-theme={theme === 'dark' ? 'noir' : 'light'} className={cn(
            "h-screen font-sans flex relative overflow-hidden transition-colors duration-300"
        )} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Mobile Header (Fixed & Glassmorphic) */}
            {isMobile && (
                 <div className="md:hidden fixed top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-4 border-b transition-colors duration-300"
                    style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={toggleMobileSidebar}
                            className="p-2 -ml-2 transition-colors"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            <Menu size={22} strokeWidth={2} />
                        </button>
                        <div className="text-xl font-black tracking-[-1.5px] uppercase" style={{ color: 'var(--text-primary)' }}>NEXIO</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme}
                            className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            {theme === 'light' ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
                        </button>
                        
                        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                            style={{ background: 'var(--border)' }}>
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full" />
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {isMobile && isMobileSidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] transition-opacity duration-300 animate-in fade-in"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar Placeholder (Desktop Only) */}
            {!isMobile && (
                 <div className={cn(
                    "h-full flex-shrink-0 z-20 border-r border-transparent transition-all duration-300 hidden md:block",
                    isSidebarMinimized ? "w-[64px]" : "w-[220px]"
                )} />
            )}

            <Sidebar 
                isMinimized={isSidebarMinimized} 
                toggleMinimize={toggleMinimize}
                isMobileOpen={isMobileSidebarOpen}
                closeMobile={() => setIsMobileSidebarOpen(false)}
            />

            {/* 2. Main Content Area Layer - Scrollable */}
            <div className={cn(
                "flex-1 h-full flex flex-col min-w-0 bg-transparent relative overflow-y-auto custom-scrollbar z-0 overscroll-none transition-all duration-300",
                !isMobile && "pt-0",
                isMobile && "pt-14 pb-20 overflow-x-hidden"
            )}>
                {/* Global TopBar inside scrolling area (Desktop Only) */}
                {!isMobile && <TopBar user={user} />}

                {/* Background Gradients (Desktop Only) */}
                {!isMobile && (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/[0.03] blur-[140px] rounded-full -translate-y-1/2 translate-x-1/3" />
                    </div>
                )}

                <div className="relative z-10 flex flex-col h-full pt-4 md:pt-0">
                    <main className="flex-1">
                        <div className={cn(
                            "max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 pb-8", // Increased padding and max-width for better focus
                            isMobile && "px-3"
                        )}>
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
};

export default MainLayout;
