import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { getMe } from '../services/authService';
import { getMyBusiness } from '../services/businessService';

const MainLayout = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserContext = async () => {
            try {
                const userData = await getMe();
                if (userData) {
                    // Enrich with business data if possible, or just used stored user data
                    // Ideally we fetch a "me" endpoint that gives full context
                    const business = await getMyBusiness();
                    setUser({ ...userData, business });
                }
            } catch (error) {
                console.error("Failed to load user context", error);
            }
        };
        fetchUserContext();
    }, []);

    return (
        <div className="h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-[#0f172a] dark:text-[#f8fafc] font-sans selection:bg-primary/30 flex relative overflow-hidden">
            {/* 1. Sidebar Layer - Fixed to left */}
            <div className="w-[220px] h-full flex-shrink-0 z-20 border-r border-transparent">
                <Sidebar />
            </div>

            {/* 2. Main Content Area Layer - Scrollable */}
            <div className="flex-1 h-full flex flex-col min-w-0 bg-[#fafafa] dark:bg-[#0a0a0a] relative overflow-y-auto custom-scrollbar z-0 overscroll-none">
                {/* Global TopBar inside scrolling area */}
                <TopBar user={user} />

                {/* Background Gradients */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    <main className="flex-1">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
