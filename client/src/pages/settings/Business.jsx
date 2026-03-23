import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import { Building, Globe, MapPin, Save, Briefcase, Zap, ChevronRight } from 'lucide-react';
import { getMyBusiness, updateBusiness } from '../../services/businessService';

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

    if (loading) return <div className="text-muted-foreground">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[20px] p-8 shadow-2xl transition-all duration-300">
                <h2 className="text-xl font-bold text-foreground mb-1">Business Profile</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage your company details and public profile.</p>

                <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Company Name</label>
                            <div className="relative">
                                <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={business.name || ''}
                                    onChange={e => setBusiness({ ...business, name: e.target.value })}
                                    className="w-full bg-white border border-border/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-400 shadow-inner font-bold text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Website</label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={business.website || ''}
                                    onChange={e => setBusiness({ ...business, website: e.target.value })}
                                    className="w-full bg-white border border-border/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-400 shadow-inner font-bold text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Industry</label>
                            <div className="relative">
                                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={business.industry || ''}
                                    onChange={e => setBusiness({ ...business, industry: e.target.value })}
                                    className="w-full bg-white border border-border/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-400 shadow-inner font-bold text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Timezone</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={business.timezone || 'Asia/Kolkata'}
                                    onChange={e => setBusiness({ ...business, timezone: e.target.value })}
                                    className="w-full bg-white border border-border/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-400 shadow-inner font-bold text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-primary/[0.03] border border-primary/10 rounded-2xl transition-all">
                        <div>
                            <label className="block text-[10px] font-black text-[#3b82f6] mb-2 uppercase tracking-[0.2em]">Business Currency</label>
                            <select
                                value={business.currency || 'USD'}
                                onChange={e => setBusiness({ ...business, currency: e.target.value })}
                                className="w-full bg-white border border-border/10 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer hover:bg-slate-50 transition-colors text-sm font-bold tracking-tight shadow-inner"
                            >
                                <option value="USD">USD (Dollar)</option>
                                <option value="INR">INR (Rupee)</option>
                                <option value="EUR">EUR (Euro)</option>
                                <option value="GBP">GBP (Pound)</option>
                                <option value="AED">AED (Dirham)</option>
                                <option value="CAD">CAD (Canadian Dollar)</option>
                                <option value="AUD">AUD (Australian Dollar)</option>
                            </select>
                            <p className="text-[10px] text-muted-foreground mt-2 font-bold opacity-60 italic">All revenue and sales metrics will be displayed in {business.currency || 'USD'}.</p>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[#3b82f6] mb-2 uppercase tracking-[0.2em]">Region & Language</label>
                            <select
                                value={business.locale || 'en-US'}
                                onChange={e => setBusiness({ ...business, locale: e.target.value })}
                                className="w-full bg-white border border-border/10 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer hover:bg-slate-50 transition-colors text-sm font-bold tracking-tight shadow-inner"
                            >
                                <option value="en-US">US (en-US)</option>
                                <option value="en-IN">India (en-IN)</option>
                                <option value="en-GB">UK (en-GB)</option>
                                <option value="de-DE">Germany (de-DE)</option>
                                <option value="fr-FR">France (fr-FR)</option>
                                <option value="en-AE">UAE (en-AE)</option>
                            </select>
                             <p className="text-[10px] text-muted-foreground mt-2 font-bold opacity-60 italic">Sets the standard format for your dates and numbers.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Target Audience</label>
                        <textarea
                            value={business.targetAudience || ''}
                            onChange={e => setBusiness({ ...business, targetAudience: e.target.value })}
                            rows={3}
                            className="w-full bg-white border border-border/10 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-400 min-h-[120px] shadow-inner font-bold text-sm"
                        />
                    </div>

                    <div className="pt-4 border-t border-surface-border flex justify-end">
                        <Button variant={showSuccess ? "outline" : "primary"} type="submit" disabled={saving}>
                            {saving ? <><Save size={16} className="animate-spin mr-2" /> Saving...</> : showSuccess ? 'Saved! ✅' : <><Save size={16} className="mr-2" /> Save Changes</>}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[20px] p-8 shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                            <Zap size={18} className="text-amber-500" /> API & Integrations
                        </h3>
                        <p className="text-sm text-muted-foreground">Manage your API keys and lead capture snippets in our dedicated hub.</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/dashboard/settings/integrations')}>
                        Manage Integrations <ChevronRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>

            <div className="bg-red-500/[0.02] dark:bg-red-500/[0.05] border border-red-500/10 rounded-[20px] p-8 shadow-2xl transition-all duration-300">
                <h3 className="text-lg font-bold text-red-500 mb-1">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">Irreversible actions for your business account.</p>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-foreground">Reset API Key</div>
                        <div className="text-xs text-muted-foreground">Revoke your current key and generate a new one.</div>
                    </div>
                    <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">Revoke Key</Button>
                </div>
            </div>
        </div>
    );
};

export default BusinessProfile;
