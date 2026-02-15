import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/marketing/Navbar';
import Footer from '../components/marketing/Footer';

const MarketingLayout = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
            <Navbar />

            <main className="relative z-10 pt-20">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MarketingLayout;
