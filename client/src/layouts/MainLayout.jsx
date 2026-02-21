import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { getUser } from '../services/authService';
import { getMyBusiness } from '../services/businessService';

const MainLayout = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserContext = async () => {
            try {
                const userData = getUser();
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
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 flex">
            {/* Sidebar (Fixed Left) */}
            <div className="w-64 flex-shrink-0 z-30">
                <Sidebar />
            </div>

            {/* Main Content (Right) */}
            <div className="flex-1 flex flex-col min-w-0 bg-black relative">
                {/* Background Gradients (Subtler) */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] bg-white/[0.03] blur-[150px] rounded-full opacity-50" />
                </div>

                <TopBar user={user} />

                <main className="flex-1 p-8 overflow-y-auto z-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
