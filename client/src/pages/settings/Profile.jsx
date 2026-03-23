import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import Button from '../../components/ui/Button';
import { User, Mail, Lock, Camera, Save } from 'lucide-react';
import { getUser } from '../../services/authService';

const Profile = () => {
    const [user, setUser] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const u = getUser();
        if (u) setUser(u);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API Update
        setTimeout(() => {
            setLoading(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            // In real app, call update user API here
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[12px] p-8 shadow-sm transition-all duration-300">
                <h2 className="text-xl font-bold text-[#0f172a] dark:text-[#f8fafc] mb-1 tracking-tight">Account Profile</h2>
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-8 font-medium">Manage your personal information and security settings.</p>

                <div className="flex items-start gap-8 mb-10">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-blue-500/10 border border-white/20 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                            <Camera size={24} className="text-white animate-pulse" />
                        </div>
                    </div>
                    <div className="flex-1 pt-2">
                        <h3 className="text-2xl font-black text-[#0f172a] dark:text-[#f8fafc] tracking-tighter">{user.name}</h3>
                        <p className="text-[#64748b] dark:text-[#94a3b8] font-bold text-sm flex items-center gap-2 mt-1">
                            <Mail size={14} className="opacity-60" /> {user.email}
                        </p>
                        <div className="mt-4">
                            <span className="text-[10px] text-[#3b82f6] px-3 py-1 bg-[#3b82f6]/10 rounded-lg inline-block border border-[#3b82f6]/20 font-black uppercase tracking-[0.2em] shadow-sm">
                                Strategic Administrator
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#64748b] dark:text-[#94a3b8] uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within:text-[#3b82f6] transition-colors" />
                                <input
                                    type="text"
                                    value={user.name}
                                    onChange={e => setUser({ ...user, name: e.target.value })}
                                    className="w-full bg-white border border-border/10 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-primary/50 transition-all font-bold text-sm shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#64748b] dark:text-[#94a3b8] uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative opacity-60">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full bg-white/60 border border-border/10 rounded-xl py-3.5 pl-12 pr-4 text-slate-500 cursor-not-allowed font-bold text-sm shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#e5e7eb] dark:border-[#2a2a2a]">
                        <div className="space-y-2 max-w-md">
                             <label className="text-[11px] font-black text-[#64748b] dark:text-[#94a3b8] uppercase tracking-widest ml-1">Change Password</label>
                            <div className="relative group">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within:text-[#3b82f6] transition-colors" />
                                 <input
                                    type="password"
                                    placeholder="Enter new password..."
                                    className="w-full bg-white border border-border/10 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-primary/50 transition-all font-bold text-sm shadow-inner placeholder:text-slate-400"
                                />
                            </div>
                            <p className="text-[10px] text-[#64748b] font-bold italic ml-1">Leave blank to keep current password.</p>
                        </div>
                    </div>

                    <div className="pt-8 flex justify-end">
                        <Button 
                            variant={showSuccess ? "outline" : "primary"} 
                            type="submit" 
                            disabled={loading}
                            className={cn(
                                "h-12 px-8 rounded-xl font-black tracking-tighter transition-all duration-300 shadow-xl",
                                showSuccess 
                                    ? "border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 shadow-emerald-500/10" 
                                    : "bg-accent hover:bg-accent/90 text-white shadow-blue-500/20"
                            )}
                        >
                             {loading ? (
                                <div className="flex items-center gap-2">
                                    <Save size={18} className="animate-spin" /> SAVING...
                                </div>
                            ) : showSuccess ? (
                                'PROFILE UPDATED ✅'
                            ) : (
                                'SAVE CHANGES'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
