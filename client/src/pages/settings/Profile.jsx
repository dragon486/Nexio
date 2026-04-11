import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { User, Mail, Lock, Camera, Save, Shield, Activity, Zap } from 'lucide-react';
import { getUser } from '../../services/authService';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const [user, setUser] = useState(() => getUser() || { name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1200);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Noir Account Card */}
            <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Shield size={160} className="text-blue-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                         <div className="px-3 py-1 bg-white/5 text-blue-500 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 flex items-center gap-2">
                             <User size={10} className="stroke-[3]" />
                             Neural Identity
                         </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-16">
                        <div className="relative group/avatar">
                            <div className="w-32 h-32 rounded-[40px] bg-white/5 border-2 border-white/10 flex items-center justify-center text-5xl font-black text-blue-500 shadow-2xl transition-all duration-700 group-hover/avatar:scale-105 group-hover/avatar:rotate-3">
                                {user.name?.charAt(0) || 'U'}
                            </div>
                            <div className="absolute inset-0 bg-blue-600/40 rounded-[40px] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-500 cursor-pointer backdrop-blur-md border-2 border-white/20">
                                <Camera size={32} className="text-white animate-pulse" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left pt-2">
                            <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">{user.name}</h3>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                                <div className="text-gray-500 font-black text-[13px] flex items-center gap-2 uppercase tracking-widest italic opacity-80">
                                    <Mail size={16} className="text-blue-500" /> {user.email}
                                </div>
                                <div className="h-4 w-px bg-white/10 hidden md:block" />
                                <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 shadow-lg">
                                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                     <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Strategic Authority</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Neural Alias</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={user.name}
                                        onChange={e => setUser({ ...user, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/50 transition-all font-black uppercase text-sm italic tracking-tight placeholder:text-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Network Sync Address</label>
                                <div className="relative opacity-40 grayscale group cursor-not-allowed">
                                    <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-gray-500 cursor-not-allowed font-black uppercase text-sm italic tracking-tight"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/5">
                            <div className="space-y-3 max-w-md">
                                 <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Security Signature</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                     <input
                                        type="password"
                                        placeholder="Enter new signature..."
                                        className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/50 transition-all font-black text-sm shadow-inner placeholder:text-gray-700 italic tracking-widest"
                                    />
                                </div>
                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] ml-6 italic opacity-60">Leave empty to preserve current encryption state.</p>
                            </div>
                        </div>

                        <div className="pt-12 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={cn(
                                    "h-16 px-12 rounded-[28px] font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-700 shadow-2xl relative overflow-hidden group/btn",
                                    showSuccess 
                                        ? "bg-emerald-500 text-white shadow-emerald-500/30" 
                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 active:scale-95"
                                )}
                            >
                                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                 <div className="relative z-10 flex items-center justify-center gap-3">
                                     {loading ? (
                                        <>
                                            <Zap size={18} className="animate-spin text-white" /> ENCRYPTING...
                                        </>
                                    ) : showSuccess ? (
                                        'SYNC COMPLETE ✅'
                                    ) : (
                                        <>
                                            DEPLOY CHANGES <Save size={18} />
                                        </>
                                    )}
                                 </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* Auxiliary Info — Noir Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-[#12131a] border border-white/5 rounded-[40px] p-10 flex items-start gap-6 shadow-2xl">
                      <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                           <Activity size={24} className="stroke-[2.5]" />
                      </div>
                      <div>
                           <h4 className="text-white font-black uppercase italic text-sm tracking-tight mb-2">Neural Activity Flow</h4>
                           <p className="text-[11px] text-gray-500 font-black uppercase italic tracking-tighter leading-relaxed opacity-80">
                               Your identity node is actively managing 1,420 predictive vectors. No unauthorized access attempts have been neutralized in the last 24 hours.
                           </p>
                      </div>
                 </div>
                 <div className="bg-[#12131a] border border-white/5 rounded-[40px] p-10 flex items-start gap-6 shadow-2xl">
                      <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                           <Zap size={24} className="stroke-[2.5]" />
                      </div>
                      <div>
                           <h4 className="text-white font-black uppercase italic text-sm tracking-tight mb-2">Synchronous Response Velocity</h4>
                           <p className="text-[11px] text-gray-500 font-black uppercase italic tracking-tighter leading-relaxed opacity-80">
                               Operating at peak efficiency in Asia/Mumbai. Global latency normalized at 42ms. Authority clearance is current and valid.
                           </p>
                      </div>
                 </div>
            </div>
        </div>
    );
};

export default Profile;
