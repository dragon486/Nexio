import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';

import Button from '../../components/ui/Button';
import { 
    Zap, Copy, Check, Building2, Code, ShieldCheck, 
    Mail, Link as LinkIcon, Unlink, Eye, EyeOff, 
    Plus, Trash2, Globe, ShieldAlert, ArrowUpRight,
    Terminal, Lock, Shield, Activity, ChevronRight
} from 'lucide-react';
import { getMyBusiness } from '../../services/businessService';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Integrations = () => {
    const [business, setBusiness] = useState({});
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedKey, setCopiedKey] = useState(false);
    const [copiedSnippet, setCopiedSnippet] = useState(false);
    const [copiedProCode, setCopiedProCode] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [copiedPublicKey, setCopiedPublicKey] = useState(false);
    const [copiedWidget, setCopiedWidget] = useState(false);
    const [integrationTab, setIntegrationTab] = useState('widget'); 
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
            const userRes = await api.get('/private');
            setUserData(userRes.data.user);
        } catch (error) {
            console.error("Failed to disconnect Gmail", error);
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
        } else if (type === 'widget') {
            setCopiedWidget(true);
            setTimeout(() => setCopiedWidget(false), 2000);
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

    const displaySnippet = `<!-- NEXIO Alpha Snippet: Secure Capture -->
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

    const widgetSnippet = `<!-- NEXIO AI Chat Widget -->
<script src="http://localhost:5173/embed.js?key=${business.publicKey || 'YOUR_PUBLIC_KEY'}" async></script>`;

    const proCode = `// 1. Add to .env file
NEXIO_API_KEY=${business.apiKey || 'YOUR_API_KEY'}

// 2. Server-side Capture (Node.js)
async function captureLead(leadData) {
  const response = await fetch('https://nexio-ai-api.com/api/leads/capture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: process.env.NEXIO_API_KEY,
      ...leadData
    })
  });
  return response.json();
}`;

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse italic">Synchronizing Sync Nodes...</div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Noir Integration Header */}
            <div className="mb-12 px-2">
                <div className="flex items-center gap-4 mb-4">
                     <div className="px-3 py-1 bg-[#12131a] text-blue-500 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 flex items-center gap-2 shadow-2xl">
                         <Zap size={10} className="stroke-[3]" />
                         Neural Linkages
                     </div>
                </div>
                <h2 className="text-4xl font-black text-[#12131a] tracking-tighter uppercase italic leading-none mb-2">Sync Hub</h2>
                <p className="text-[14px] text-gray-500 font-bold leading-relaxed uppercase italic tracking-tight opacity-70">
                    Manage API credentials, authorize host domains, and connect external network nodes.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* 1. API Credentials — Noir Card */}
                <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Lock size={140} className="text-blue-500" />
                    </div>
                    <div className="relative z-10 flex items-center gap-3 mb-10">
                        <Lock size={20} className="text-blue-500 stroke-[2.5]" />
                        <div>
                             <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Access Authorization</div>
                             <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Security Keys</h3>
                        </div>
                    </div>

                    <div className="space-y-10 relative z-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Public Key (Client-Safe)</label>
                                <span className="text-[8px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-emerald-500/20 shadow-xl shadow-emerald-500/10">Authorized</span>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1 bg-white/5 border border-white/5 rounded-[24px] py-6 px-8 text-white font-black text-sm italic tracking-tight overflow-hidden flex items-center">
                                    <span className="truncate opacity-80">{business.publicKey || 'Generating...'}</span>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(business.publicKey, 'public')}
                                    className="w-16 h-16 bg-white/5 border border-white/10 rounded-[20px] flex items-center justify-center text-white hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                                >
                                    {copiedPublicKey ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                                </button>
                            </div>
                            <p className="text-[9px] text-gray-600 font-black uppercase italic tracking-widest px-2 opacity-60">Safe for HTML snippets. Access restricted to authorized domains.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Secret Key (Server-Only)</label>
                                <span className="text-[8px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-red-500/20 shadow-xl shadow-red-500/10">Protected</span>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1 bg-white/5 border border-white/5 rounded-[24px] py-6 px-8 text-white font-black text-sm italic tracking-tight overflow-hidden flex items-center justify-between">
                                    <span className={cn("truncate", !showApiKey && "tracking-[0.4em] opacity-40")}>
                                        {showApiKey ? (business.apiKey || 'Generating...') : '••••••••••••••••'}
                                    </span>
                                    <button
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="ml-4 p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-600 hover:text-white"
                                    >
                                        {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(business.apiKey, 'key')}
                                    className="w-16 h-16 bg-white/5 border border-white/10 rounded-[20px] flex items-center justify-center text-white hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                                >
                                    {copiedKey ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                                </button>
                            </div>
                            <p className="text-[9px] text-red-500/60 font-black uppercase italic tracking-widest px-2 flex items-center gap-2">
                                <ShieldAlert size={12} className="stroke-[3]" /> Never expose this key in client-side codebases.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Gmail Integration — Noir Card */}
                <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Mail size={140} className="text-red-500" />
                    </div>
                    <div className="relative z-10 flex items-center gap-3 mb-10">
                        <Mail size={20} className="text-red-500 stroke-[2.5]" />
                        <div>
                             <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Distribution Vector</div>
                             <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Gmail Node</h3>
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <p className="text-[13px] text-gray-500 font-bold uppercase italic tracking-tight opacity-70 leading-relaxed max-w-sm">
                            NEXIO Alpha will use your SMTP signature to send high-fidelity follow-ups automatically.
                        </p>
                        
                        {userData?.gmailRefreshToken ? (
                            <div className="flex flex-col gap-6">
                                <div className="p-8 bg-emerald-500/10 border border-emerald-500/10 rounded-[32px] flex items-center gap-6 shadow-2xl shadow-emerald-500/5">
                                    <div className="w-16 h-16 bg-emerald-500 rounded-[20px] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30">
                                        <Check size={32} className="stroke-[3]" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic mb-1">Active Synchronization</div>
                                        <p className="text-lg font-black text-white italic tracking-tighter">{userData.gmailEmail || userData.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDisconnectGmail}
                                    className="w-full h-16 bg-white/5 border border-white/10 text-gray-500 hover:text-red-500 hover:border-red-500/30 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Unlink size={16} /> NEUTRALIZE GMAIL SYNC
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                <button
                                    onClick={handleConnectGmail}
                                    className="w-full h-18 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                                >
                                    <LinkIcon size={20} className="group-hover:rotate-45 transition-transform" /> CONNECT GMAIL NETWORK
                                </button>
                                 <div className="flex items-center gap-3 px-4">
                                      <Shield className="text-gray-700" size={14} />
                                      <span className="text-[9px] text-gray-700 font-black uppercase italic tracking-widest">Enterprise OAuth2 Encryption Standard</span>
                                 </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Authorized Domains — Noir Card */}
                <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group lg:col-span-1">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Globe size={140} className="text-blue-500" />
                    </div>
                    <div className="relative z-10 flex items-center gap-3 mb-10">
                        <Globe size={20} className="text-blue-500 stroke-[2.5]" />
                        <div>
                             <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Domain Whitelist</div>
                             <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Signal Filter</h3>
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <form onSubmit={handleAddDomain} className="flex gap-4">
                            <input
                                type="text"
                                value={newDomain}
                                onChange={(e) => setNewDomain(e.target.value)}
                                placeholder="nexus-realty.com"
                                className="flex-1 bg-white/5 border border-white/5 rounded-[24px] py-6 px-8 text-white font-black text-sm italic tracking-tight placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                            />
                            <button
                                type="submit"
                                disabled={updatingDomains || !newDomain}
                                className="w-16 h-16 bg-blue-600 text-white rounded-[20px] flex items-center justify-center shadow-xl active:scale-95 disabled:opacity-20"
                            >
                                <Plus size={24} className="stroke-[3]" />
                            </button>
                        </form>

                        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                            {business.allowedDomains && business.allowedDomains.length > 0 ? (
                                business.allowedDomains.map((domain, index) => (
                                    <div key={index} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-[24px] border border-white/5 group shadow-inner">
                                        <div className="flex items-center gap-4">
                                             <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                             <span className="text-[13px] text-white font-black uppercase italic tracking-tighter">{domain}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveDomain(domain)}
                                            className="text-gray-700 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-[32px] bg-white/[0.01]">
                                    <Activity size={32} className="text-gray-800 mx-auto mb-4 animate-pulse" />
                                    <p className="text-[10px] text-gray-700 font-black uppercase italic tracking-[0.2em] max-w-[220px] mx-auto">No domains authorized. Public Key is currently VULNERABLE.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Information Node — Noir Branding */}
                 <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent" />
                      <div className="relative z-10 flex flex-col justify-center h-full">
                           <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/10 rounded-[28px] flex items-center justify-center text-blue-500 mb-10 shadow-2xl">
                                <Terminal size={36} className="stroke-[2.5]" />
                           </div>
                           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">Neural Integration Protocols</h3>
                           <p className="text-[15px] font-bold text-gray-400 uppercase italic tracking-tight leading-relaxed mb-10 opacity-80">
                                Deploy Signal Capture snippets on authorized domains to begin high-intent lead ingestion. For absolute security, use the Server-side API protocol to neutralize client-side decryption attempts.
                           </p>
                           <div className="flex items-center gap-10">
                                <div className="text-center">
                                     <div className="text-2xl font-black text-white italic tracking-tighter">100%</div>
                                     <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">Uptime Sync</div>
                                </div>
                                <div className="h-10 w-px bg-white/10" />
                                <div className="text-center">
                                     <div className="text-2xl font-black text-white italic tracking-tighter">256-bit</div>
                                     <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">AES Encryption</div>
                                </div>
                           </div>
                      </div>
                 </div>
            </div>

            {/* 4. Snippet Console — Noir Wide Card */}
            <div className="bg-[#12131a] border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden group mt-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-emerald-500/10 rounded-[24px] text-emerald-500 border border-emerald-500/10 shadow-2xl">
                            <Code size={32} className="stroke-[3]" />
                        </div>
                        <div>
                             <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic mb-1 flex items-center gap-3">
                                 Signal Capture Sniffer
                                 {business.settings?.isWidgetActive && (
                                     <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-[8.5px] tracking-[0.2em] font-black italic flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-500/30">
                                         <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                         WIDGET ACTIVE
                                     </span>
                                 )}
                             </div>
                             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Code Deployment</h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 self-stretch lg:self-auto">
                        <div className="flex bg-[#0a0b0f] p-2 rounded-3xl border border-white/5 shadow-2xl">
                            <button
                                onClick={() => setIntegrationTab('html')}
                                className={cn(
                                    "px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all",
                                    integrationTab === 'html' ? 'bg-white text-[#12131a] shadow-xl italic' : 'text-gray-600 hover:text-white'
                                )}
                            >
                                HTML Snippet
                            </button>
                            <button
                                onClick={() => setIntegrationTab('widget')}
                                className={cn(
                                    "px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all",
                                    integrationTab === 'widget' ? 'bg-white text-[#12131a] shadow-xl italic' : 'text-gray-600 hover:text-white'
                                )}
                            >
                                AI Chat Widget
                            </button>
                        </div>
                        <button
                            onClick={() => copyToClipboard(integrationTab === 'html' ? displaySnippet : integrationTab === 'widget' ? widgetSnippet : proCode, integrationTab === 'html' ? 'snippet' : integrationTab === 'widget' ? 'widget' : 'pro')}
                            className="h-14 px-10 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-[20px] shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            {integrationTab === 'html' ? (copiedSnippet ? "COPIED!" : "COPY SNIPPET") : integrationTab === 'widget' ? (copiedWidget ? "COPIED" : "COPY WIDGET") : (copiedProCode ? "COPIED!" : "COPY CODE")}
                            <Copy size={16} />
                        </button>
                    </div>
                </div>

                <div className="bg-[#0a0b0f] border border-white/5 rounded-[40px] p-12 relative group shadow-[inset_0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                         <Terminal size={200} />
                    </div>
                    {integrationTab === 'pro' && (
                        <div className="mb-10 p-6 bg-blue-500/5 border border-blue-500/10 rounded-[28px] flex items-start gap-4">
                            <ShieldCheck size={20} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[12px] text-gray-500 leading-relaxed font-bold uppercase italic tracking-tight opacity-80">
                                <span className="text-blue-400">Security Recommendation:</span> Utilize the Alpha-Node server protocol to keep Secret Keys sequestered in your <code className="bg-white/5 px-2 py-0.5 rounded text-blue-300">.env</code>. Never expose Secret Keys in client-side production vectors.
                            </p>
                        </div>
                    )}
                    <pre className="font-mono text-xs text-emerald-500/80 overflow-x-auto whitespace-pre leading-loose custom-scrollbar pb-6 relative z-10">
                        {integrationTab === 'html' ? displaySnippet : integrationTab === 'widget' ? widgetSnippet : proCode}
                    </pre>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {[
                        { step: "1. Calibrate", icon: Activity, desc: "Synchronize labels and UI tokens to match your mission profile." },
                        { step: "2. Deploy", icon: ArrowUpRight, desc: "Inject snippet into any authorized network node for ingestion." },
                        { step: "3. Neutralize", icon: Zap, desc: "NEXIO Alpha instantly processes and scores every incoming signal." }
                    ].map((item, i) => (
                        <div key={i} className="p-8 bg-white/[0.02] rounded-[32px] border border-white/5 shadow-inner group/step hover:bg-white/5 transition-all">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover/step:scale-110 transition-transform">
                                 <item.icon size={24} className="stroke-[2.5]" />
                            </div>
                            <h4 className="text-[11px] font-black text-white mb-2 uppercase tracking-[0.2em] italic">{item.step}</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase italic tracking-widest leading-relaxed opacity-70">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Integrations;
