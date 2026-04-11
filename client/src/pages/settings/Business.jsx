import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import { 
    Building, Globe, MapPin, Save, Briefcase, 
    Zap, ChevronRight, Target, Activity, Shield,
    Lock, ArrowUpRight
} from 'lucide-react';
import { getMyBusiness, updateBusiness } from '../../services/businessService';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const BusinessProfile = () => {
    const navigate = useNavigate();
    const [business, setBusiness] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getMyBusiness();
            setBusiness(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateBusiness(business._id, business);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse italic">Syncing Sector Matrix...</div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Noir Business Profile Card */}
            <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Building size={160} className="text-blue-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                         <div className="px-3 py-1 bg-white/5 text-blue-500 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 flex items-center gap-2">
                             <Target size={10} className="stroke-[3]" />
                             Sector Vector
                         </div>
                    </div>
                    
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">Business Console</h2>
                    <p className="text-[14px] text-gray-500 font-bold leading-relaxed uppercase italic tracking-tight opacity-70 mb-12">
                        Manage company intelligence, network localization, and sector-specific operational parameters.
                    </p>

                    <form onSubmit={handleSave} className="space-y-10 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Entity Designation</label>
                                <div className="relative group">
                                    <Building size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={business.name || ''}
                                        onChange={e => setBusiness({ ...business, name: e.target.value })}
                                        placeholder="e.g. Nexus Realty Group"
                                        className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/50 transition-all font-black uppercase text-sm italic tracking-tight placeholder:text-gray-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Neural Gateway (URL)</label>
                                <div className="relative group">
                                    <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={business.website || ''}
                                        onChange={e => setBusiness({ ...business, website: e.target.value })}
                                        placeholder="https://nexus.ai"
                                        className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/50 transition-all font-black uppercase text-sm italic tracking-tight placeholder:text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Operational Sector</label>
                                <div className="relative group">
                                    <Briefcase size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={business.industry || ''}
                                        onChange={e => setBusiness({ ...business, industry: e.target.value })}
                                        placeholder="e.g. Real Estate Alpha"
                                        className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/50 transition-all font-black uppercase text-sm italic tracking-tight placeholder:text-gray-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Temporal Sync (Timezone)</label>
                                <div className="relative group">
                                    <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={business.timezone || 'Asia/Kolkata'}
                                        onChange={e => setBusiness({ ...business, timezone: e.target.value })}
                                        placeholder="e.g. Asia/Kolkata"
                                        className="w-full bg-white/5 border border-white/5 rounded-[24px] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/50 transition-all font-black uppercase text-sm italic tracking-tight placeholder:text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-white/[0.02] border border-white/5 rounded-[40px] shadow-inner transition-all group/matrix">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-blue-500 mb-2 uppercase tracking-[0.3em] ml-2 italic">Monetization Vector</label>
                                <div className="relative">
                                     <select
                                        value={business.currency || 'INR'}
                                        onChange={e => setBusiness({ ...business, currency: e.target.value })}
                                        className="w-full bg-[#0a0b0f] border border-white/5 rounded-[24px] py-5 px-6 text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer transition-all text-xs font-black uppercase tracking-widest italic shadow-2xl"
                                    >
                                        <option value="INR">INR (Rupee)</option>
                                        <option value="USD">USD (Dollar)</option>
                                        <option value="EUR">EUR (Euro)</option>
                                        <option value="GBP">GBP (Pound)</option>
                                        <option value="AED">AED (Dirham)</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                                         <ChevronRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                                <p className="text-[9px] text-gray-600 px-2 font-black uppercase italic tracking-widest opacity-60">Global revenue metrics will be calibrated in {business.currency || 'INR'}.</p>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-blue-500 mb-2 uppercase tracking-[0.3em] ml-2 italic">Regional Logic Path</label>
                                <div className="relative">
                                    <select
                                        value={business.locale || 'en-IN'}
                                        onChange={e => setBusiness({ ...business, locale: e.target.value })}
                                        className="w-full bg-[#0a0b0f] border border-white/5 rounded-[24px] py-5 px-6 text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer transition-all text-xs font-black uppercase tracking-widest italic shadow-2xl"
                                    >
                                        <option value="en-IN">India (en-IN)</option>
                                        <option value="en-US">US (en-US)</option>
                                        <option value="en-GB">UK (en-GB)</option>
                                        <option value="en-AE">UAE (en-AE)</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                                         <ChevronRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                                <p className="text-[9px] text-gray-600 px-2 font-black uppercase italic tracking-widest opacity-60">Standardizes date sequencing and numeric precision.</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic mb-3 block">Neural Target Architecture</label>
                            <textarea
                                value={business.targetAudience || ''}
                                onChange={e => setBusiness({ ...business, targetAudience: e.target.value })}
                                rows={4}
                                placeholder="Describe the high-intent vectors you aim to capture..."
                                className="w-full bg-white/5 border border-white/5 rounded-[32px] py-8 px-8 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700 min-h-[160px] shadow-inner font-black uppercase text-sm italic tracking-tight leading-relaxed"
                            />
                        </div>

                        <div className="pt-8 border-t border-white/5 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={saving}
                                className={cn(
                                    "h-16 px-12 rounded-[28px] font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-700 shadow-2xl relative overflow-hidden group/btn",
                                    showSuccess 
                                        ? "bg-emerald-500 text-white shadow-emerald-500/30" 
                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 active:scale-95"
                                )}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    {saving ? (
                                        <>
                                            <Zap size={18} className="animate-spin text-white" /> CALIBRATING...
                                        </>
                                    ) : showSuccess ? (
                                        'CALIBRATION COMPLETE ✅'
                                    ) : (
                                        <>
                                            SYNC SECTOR DATA <Save size={18} />
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* API Hub Redirect Card */}
            <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 shadow-2xl group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/10 rounded-[28px] flex items-center justify-center text-blue-500 shadow-2xl group-hover:scale-110 transition-transform">
                            <Zap size={36} className="stroke-[2.5]" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-3 flex items-center gap-3">
                                API & Node Integration
                            </h3>
                            <p className="text-[13px] text-gray-500 font-bold uppercase italic tracking-tight opacity-80 leading-tight">Manage the external neural linkages and lead capture snippets.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard/settings/integrations')}
                        className="w-full md:w-auto h-14 px-8 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-600 hover:border-blue-600 transition-all flex items-center justify-center gap-3 group/link"
                    >
                        Access Hub <ArrowUpRight size={16} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Danger Zone — Noir Negative */}
            <div className="bg-red-500/[0.03] border border-red-500/10 rounded-[48px] p-12 shadow-2xl group">
                <div className="flex items-center gap-3 mb-8">
                     <Shield size={16} className="text-red-500 stroke-[3]" />
                     <h3 className="text-xl font-black text-red-500 uppercase italic tracking-tighter leading-none">Security Override</h3>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-md">
                        <div className="text-[13px] font-black text-white uppercase italic tracking-tight mb-2">Neutralize API Keys</div>
                        <div className="text-[11px] text-gray-500 font-black uppercase tracking-widest leading-relaxed opacity-70">Instantly revoke all active neural gateways and generate a fresh sector signature. This will break existing lead flows.</div>
                    </div>
                    <button className="w-full md:w-auto px-10 h-16 bg-white/[0.03] border border-red-500/20 text-red-500 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95">
                        PURGE CURRENT KEYS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BusinessProfile;
