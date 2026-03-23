import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';

import Button from '../../components/ui/Button';
import { Zap, Copy, Check, Building2, Code, ShieldCheck, Mail, Link as LinkIcon, Unlink, Eye, EyeOff, Plus, Trash2, Globe, ShieldAlert } from 'lucide-react';
import { getMyBusiness } from '../../services/businessService';

const Integrations = () => {
    const [business, setBusiness] = useState({});
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedKey, setCopiedKey] = useState(false);
    const [copiedSnippet, setCopiedSnippet] = useState(false);
    const [copiedProCode, setCopiedProCode] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [copiedPublicKey, setCopiedPublicKey] = useState(false);
    const [integrationTab, setIntegrationTab] = useState('html'); // 'html' or 'pro'
    const [newDomain, setNewDomain] = useState('');
    const [updatingDomains, setUpdatingDomains] = useState(false);
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
        } else if (type === 'snippet') {
            setCopiedSnippet(true);
            setTimeout(() => setCopiedSnippet(false), 2000);
        } else if (type === 'public') {
            setCopiedPublicKey(true);
            setTimeout(() => setCopiedPublicKey(false), 2000);
        } else {
            setCopiedProCode(true);
            setTimeout(() => setCopiedProCode(false), 2000);
        }
    };

    const handleAddDomain = async (e) => {
        e.preventDefault();
        if (!newDomain) return;

        let formattedDomain = newDomain.toLowerCase().trim()
            .replace('http://', '')
            .replace('https://', '')
            .split('/')[0];

        if (!formattedDomain) return;

        setUpdatingDomains(true);
        try {
            const updatedDomains = [...(business.allowedDomains || []), formattedDomain];
            const updatedBusiness = await api.put(`/business/${business._id}`, {
                allowedDomains: updatedDomains
            });
            setBusiness(updatedBusiness.data);
            setNewDomain('');
        } catch (error) {
            console.error("Failed to add domain:", error);
        } finally {
            setUpdatingDomains(false);
        }
    };

    const handleRemoveDomain = async (domainToRemove) => {
        setUpdatingDomains(true);
        try {
            const updatedDomains = (business.allowedDomains || []).filter(d => d !== domainToRemove);
            const updatedBusiness = await api.put(`/business/${business._id}`, {
                allowedDomains: updatedDomains
            });
            setBusiness(updatedBusiness.data);
        } catch (error) {
            console.error("Failed to remove domain:", error);
        } finally {
            setUpdatingDomains(false);
        }
    };

    const maskedApiKey = showApiKey ? (business.apiKey || 'YOUR_API_KEY') : '••••••••••••••••••••••••••••••••';

    const snippet = `<!-- NEXIO Public Snippet: Secure & Authorized -->
<form action="http://localhost:8000/api/leads/capture" method="POST">
  <input type="hidden" name="apiKey" value="${business.publicKey || 'YOUR_PUBLIC_KEY'}" />
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

    const displaySnippet = `<!-- NEXIO Public Snippet: Secure & Authorized -->
<form action="http://localhost:8000/api/leads/capture" method="POST">
  <input type="hidden" name="apiKey" value="${business.publicKey || 'YOUR_PUBLIC_KEY'}" />
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

    const proCode = `// 1. Add this to your .env file
NEXIO_API_KEY=${business.apiKey || 'YOUR_API_KEY'}

// 2. Server-side implementation (Node.js Example)
async function captureLead(leadData) {
  const response = await fetch('https://nexio-ai-api.com/api/leads/capture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: process.env.NEXIO_API_KEY, // Key stays secret on your server!
      ...leadData
    })
  });
  return response.json();
}`;

    if (loading) return <div className="text-muted-foreground p-8">Loading integrations...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Integrations</h2>
                <p className="text-sm text-muted-foreground">Connect NEXIO to your website and third-party tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[12px] p-8 shadow-sm transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground">API Integration</h3>
                            <p className="text-xs text-muted-foreground">Your API credentials.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Public Key</label>
                                <span className="text-[10px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">Safe for HTML</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-white border border-border/10 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-all font-bold text-sm shadow-inner flex items-center justify-between min-w-0">
                                    <span className="truncate border-none bg-transparent flex-1 mr-2 outline-none">
                                        {business.publicKey || 'Generating...'}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => copyToClipboard(business.publicKey, 'public')}
                                    className="shrink-0"
                                >
                                    {copiedPublicKey ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground/60 mt-2">
                                Use this key for public website forms. Access is limited to your Authorized Domains.
                            </p>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Secret Key</label>
                                <span className="text-[10px] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">Private</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-white border border-border/10 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-all font-bold text-sm shadow-inner flex items-center justify-between min-w-0">
                                    <span className="truncate border-none bg-transparent flex-1 mr-2 outline-none text-red-500/60">
                                        {showApiKey ? (business.apiKey || 'Generating...') : '••••••••••••••••••••••••••••••••'}
                                    </span>
                                    <button
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="shrink-0 p-1.5 hover:bg-slate-50 rounded-md transition-colors text-muted-foreground hover:text-foreground"
                                        title={showApiKey ? "Hide Secret Key" : "Show Secret Key"}
                                    >
                                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => copyToClipboard(business.apiKey, 'key')}
                                    className="shrink-0"
                                >
                                    {copiedKey ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground/60 mt-2 flex items-center gap-1">
                                <ShieldAlert size={10} className="text-red-400" /> NEVER share your Secret key in public code (keep it server-side).
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[12px] p-8 shadow-sm transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground">Gmail Integration</h3>
                            <p className="text-xs text-muted-foreground">Send automated follow-ups from your address.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {userData?.gmailRefreshToken ? (
                            <div className="flex flex-col gap-3">
                                <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-foreground">Connected</p>
                                        <p className="text-[10px] text-muted-foreground">{userData.gmailEmail || userData.email}</p>
                                    </div>
                                    <Check size={16} className="text-green-500" />
                                </div>
                                <Button
                                    onClick={handleDisconnectGmail}
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-muted-foreground hover:text-red-500 border-surface-border"
                                >
                                    <Unlink size={14} className="mr-2" /> Disconnect account
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    NEXIO will use your work email to send professional follow-ups to your leads.
                                </p>
                                <Button
                                    onClick={handleConnectGmail}
                                    variant="primary"
                                    className="w-full border-2 border-foreground"
                                >
                                    <LinkIcon size={16} className="mr-2" /> Connect Gmail Account
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[12px] p-8 shadow-sm transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/20">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground">Authorized Domains</h3>
                            <p className="text-xs text-muted-foreground">Whitelist websites allowed to capture leads.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <form onSubmit={handleAddDomain} className="flex gap-2">
                            <input
                                type="text"
                                value={newDomain}
                                onChange={(e) => setNewDomain(e.target.value)}
                                placeholder="example.com"
                                className="flex-1 bg-white border border-border/10 rounded-xl px-4 py-2 text-sm text-slate-900 font-bold outline-none focus:border-primary/50 transition-all shadow-inner placeholder:text-slate-400"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                variant="outline"
                                disabled={updatingDomains || !newDomain}
                            >
                                <Plus size={14} />
                            </Button>
                        </form>

                        <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                            {business.allowedDomains && business.allowedDomains.length > 0 ? (
                                business.allowedDomains.map((domain, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-surface-soft/30 rounded-lg border border-surface-border group">
                                        <span className="text-[11px] text-foreground font-medium">{domain}</span>
                                        <button
                                            onClick={() => handleRemoveDomain(domain)}
                                            className="text-muted-foreground hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 border border-dashed border-surface-border rounded-lg">
                                    <p className="text-[10px] text-muted-foreground italic">No domains whitelisted. Your Public Key is currently UNPROTECTED.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-[12px] p-8 shadow-sm transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-500 border border-green-500/20">
                            <Code size={24} />
                        </div>
                        <div>
                             <h3 className="font-bold text-foreground">Quick Lead Capture Snippet</h3>
                            <p className="text-xs text-muted-foreground">Copy-paste this snippet to start collecting leads immediately.</p>
                        </div>
                    </div>

                    <div className="flex bg-surface-soft p-1 rounded-lg border border-surface-border self-stretch md:self-auto">
                        <button
                            onClick={() => setIntegrationTab('html')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${integrationTab === 'html' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            HTML Snippet
                        </button>
                             <button
                                onClick={() => setIntegrationTab('pro')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${integrationTab === 'pro' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Server API (Secure)
                            </button>
                    </div>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => copyToClipboard(integrationTab === 'html' ? snippet : proCode, integrationTab === 'html' ? 'snippet' : 'pro')}
                        className="bg-emerald-500 hover:bg-emerald-600"
                    >
                        {integrationTab === 'html' ? (copiedSnippet ? "Copied!" : "Copy Snippet") : (copiedProCode ? "Copied!" : "Copy Code")}
                    </Button>
                </div>

                <div className="bg-[#fafafa] dark:bg-[#0f0f0f] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl p-6 relative group shadow-inner max-h-[400px] overflow-y-auto">
                    {integrationTab === 'pro' && (
                        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                            <ShieldCheck size={18} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-200 leading-relaxed">
                                <span className="font-bold">Recommended for Security:</span> Use this method to keep your API key hidden in your <code className="bg-blue-500/20 px-1 rounded">.env</code> file. Do not expose keys in the frontend for production apps.
                            </p>
                        </div>
                    )}
                    <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                        {integrationTab === 'html' ? displaySnippet : proCode}
                    </pre>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-surface-soft/30 rounded-lg border border-surface-border">
                        <h4 className="text-xs font-bold text-foreground mb-1">1. Customize</h4>
                        <p className="text-[11px] text-muted-foreground">Change the labels and styles to match your brand.</p>
                    </div>
                    <div className="p-4 bg-surface-soft/30 rounded-lg border border-surface-border">
                        <h4 className="text-xs font-bold text-foreground mb-1">2. Embed</h4>
                        <p className="text-[11px] text-muted-foreground">Paste anywhere on your site to create a lead form.</p>
                    </div>
                    <div className="p-4 bg-surface-soft/30 rounded-lg border border-surface-border">
                        <h4 className="text-xs font-bold text-foreground mb-1">3. Automate</h4>
                        <p className="text-[11px] text-muted-foreground">NEXIO will instantly score every submission.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Integrations;
