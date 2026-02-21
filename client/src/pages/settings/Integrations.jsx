import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { Zap, Copy, Check, Building2, Code, ShieldCheck, Mail, Link as LinkIcon, Unlink } from 'lucide-react';
import { getMyBusiness } from '../../services/businessService';

const Integrations = () => {
    const [business, setBusiness] = useState({});
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedKey, setCopiedKey] = useState(false);
    const [copiedSnippet, setCopiedSnippet] = useState(false);
    const location = useLocation();

    useEffect(() => {
        loadData();
    }, [location.search]);

    const loadData = async () => {
        try {
            const data = await getMyBusiness();
            setBusiness(data);

            const userRes = await api.get('/private');
            setUserData(userRes.data.user);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectGmail = async () => {
        try {
            const res = await api.get('/auth/google/gmail-connect');
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (error) {
            console.error("Failed to initiate Gmail connect", error);
        }
    };

    const handleDisconnectGmail = async () => {
        try {
            await api.post('/auth/google/gmail-disconnect');

            // Re-fetch user data to update the UI
            const userRes = await api.get('/private');
            setUserData(userRes.data.user);

            // Optionally, update local storage if you rely on it
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                delete storedUser.gmailEmail;
                delete storedUser.gmailRefreshToken;
                localStorage.setItem('user', JSON.stringify(storedUser));
            }
        } catch (error) {
            console.error("Failed to disconnect Gmail", error);
            alert("Failed to disconnect Gmail account. Please try again.");
        }
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'key') {
            setCopiedKey(true);
            setTimeout(() => setCopiedKey(false), 2000);
        } else {
            setCopiedSnippet(true);
            setTimeout(() => setCopiedSnippet(false), 2000);
        }
    };

    const snippet = `<form action="http://localhost:8000/api/leads/capture" method="POST">
  <input type="hidden" name="apiKey" value="${business.apiKey || 'YOUR_API_KEY'}" />
  <div class="field">
    <label>Name</label>
    <input type="text" name="name" required />
  </div>
  <div class="field">
    <label>Email</label>
    <input type="email" name="email" required />
  </div>
  <button type="submit">Submit Inquiry</button>
</form>`;

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Integrations</h2>
                <p className="text-sm text-gray-400">Connect Arlo.ai to your website and third-party tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">API Access</h3>
                            <p className="text-xs text-gray-500">Your unique authentication key.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Live API Key</label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-sm text-gray-300 break-all select-all">
                                    {business.apiKey}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => copyToClipboard(business.apiKey, 'key')}
                                    className="shrink-0"
                                >
                                    {copiedKey ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                </Button>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                                <ShieldCheck size={10} /> Never share your API key in public client-side code.
                            </p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Gmail Integration</h3>
                            <p className="text-xs text-gray-500">Send automated follow-ups from your address.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {userData?.gmailRefreshToken ? (
                            <div className="flex flex-col gap-3">
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-white">Connected</p>
                                        <p className="text-[10px] text-gray-400">{userData.gmailEmail || userData.email}</p>
                                    </div>
                                    <Check size={16} className="text-green-500" />
                                </div>
                                <Button
                                    onClick={handleDisconnectGmail}
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-zinc-500 hover:text-white border-white/5"
                                >
                                    <Unlink size={14} className="mr-2" /> Disconnect account
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Arlo will use your work email to send professional follow-ups to your leads.
                                </p>
                                <Button
                                    onClick={handleConnectGmail}
                                    variant="primary"
                                    className="w-full bg-white text-black hover:bg-zinc-200"
                                >
                                    <LinkIcon size={16} className="mr-2" /> Connect Gmail Account
                                </Button>
                            </div>
                        )}
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Webhooks</h3>
                            <p className="text-xs text-gray-500">Coming soon for real-time CRM sync.</p>
                        </div>
                    </div>
                    <div className="h-24 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
                        <span className="text-xs text-gray-500 italic">Zapier & Make.com integrations in beta</span>
                    </div>
                </GlassCard>
            </div>

            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                            <Code size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Universal Lead Capture</h3>
                            <p className="text-xs text-gray-500">The fastest way to start receiving leads.</p>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => copyToClipboard(snippet, 'snippet')}
                        className="bg-emerald-500 hover:bg-emerald-600"
                    >
                        {copiedSnippet ? "Copied!" : "Copy Snippet"}
                    </Button>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-6 relative group">
                    <pre className="font-mono text-xs text-green-400 overflow-x-auto whitespace-pre leading-relaxed">
                        {snippet}
                    </pre>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <h4 className="text-xs font-bold text-gray-300 mb-1">1. Customize</h4>
                        <p className="text-[11px] text-gray-500">Change the labels and styles to match your brand.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <h4 className="text-xs font-bold text-gray-300 mb-1">2. Embed</h4>
                        <p className="text-[11px] text-gray-500">Paste anywhere on your site to create a lead form.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <h4 className="text-xs font-bold text-gray-300 mb-1">3. Automate</h4>
                        <p className="text-[11px] text-gray-500">Arlo will instantly score every submission.</p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default Integrations;
