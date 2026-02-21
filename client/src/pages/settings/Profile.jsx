import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/ui/GlassCard';
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
            <GlassCard>
                <h2 className="text-xl font-bold text-white mb-1">My Profile</h2>
                <p className="text-sm text-gray-400 mb-6">Manage your personal information and security.</p>

                <div className="flex items-start gap-6 mb-8">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={20} className="text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{user.name}</h3>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-xs text-primary mt-1 px-2 py-0.5 bg-primary/10 rounded inline-block border border-primary/20">Administrator</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={user.name}
                                onChange={e => setUser({ ...user, name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-4">
                        <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                placeholder="Leave blank to keep current"
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button variant={showSuccess ? "outline" : "primary"} type="submit" disabled={loading}>
                            {loading ? 'Saving...' : showSuccess ? 'Saved! ✅' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default Profile;
