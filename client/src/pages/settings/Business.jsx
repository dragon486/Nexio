import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { Building, Globe, MapPin, Save, Briefcase } from 'lucide-react';
import { getMyBusiness, updateBusiness } from '../../services/businessService';

const BusinessProfile = () => {
    const [business, setBusiness] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-6">
            <GlassCard>
                <h2 className="text-xl font-bold text-white mb-1">Business Profile</h2>
                <p className="text-sm text-gray-400 mb-6">Manage your company details and public profile.</p>

                <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
                            <div className="relative">
                                <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={business.name || ''}
                                    onChange={e => setBusiness({ ...business, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={business.website || ''}
                                    onChange={e => setBusiness({ ...business, website: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Industry</label>
                            <div className="relative">
                                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={business.industry || ''}
                                    onChange={e => setBusiness({ ...business, industry: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Timezone</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={business.timezone || 'UTC'}
                                    onChange={e => setBusiness({ ...business, timezone: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Target Audience</label>
                        <textarea
                            value={business.targetAudience || ''}
                            onChange={e => setBusiness({ ...business, targetAudience: e.target.value })}
                            rows={3}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary/50"
                        />
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-end">
                        <Button variant="primary" type="submit" disabled={saving}>
                            {saving ? <><Save size={16} className="animate-spin mr-2" /> Saving...</> : <><Save size={16} className="mr-2" /> Save Changes</>}
                        </Button>
                    </div>
                </form>
            </GlassCard>

            <GlassCard className="border-red-500/20">
                <h3 className="text-lg font-bold text-red-400 mb-1">Danger Zone</h3>
                <p className="text-sm text-gray-400 mb-4">Irreversible actions for your business account.</p>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-white">Reset API Key</div>
                        <div className="text-xs text-gray-500">Revoke your current key and generate a new one.</div>
                    </div>
                    <Button variant="outline" className="text-red-400 border-red-500/20 hover:bg-red-500/10">Revoke Key</Button>
                </div>
            </GlassCard>
        </div>
    );
};

export default BusinessProfile;
