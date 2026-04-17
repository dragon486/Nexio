import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    DollarSign, Users, Zap, CheckCircle, 
    MessageSquare, ArrowUpRight, TrendingUp,
    Shield, Activity, Globe, Info, Clock, 
    BarChart2, Calendar, LayoutDashboard, Settings, LogOut,
    Search, Filter, MoreHorizontal, Send, Sparkles, ArrowLeft, Sun, Moon,
    Mail, Phone
} from 'lucide-react';

const initialLeads = [
    { id: 1, name: "Dynamic Retail", status: "converted", dealSize: "$18,400", aiScore: 98, industry: "SaaS & Cloud", time: "2m ago", email: "contact@alpha.com", source: "Email", message: "Reviewing our Q3 digital infrastructure roadmap. We require confirmation on NEXIO's technical throughput for 500k+ API calls/hour and its impact on our existing enterprise SLA." },
    { id: 2, name: "Azure Estates", status: "qualified", dealSize: "$42,500", aiScore: 92, industry: "Luxury Real Estate", time: "8m ago", email: "portfolio@azure.io", source: "WhatsApp", message: "Expanding our luxury villa portfolio in the EMAAR district. Automating lead qualification is a priority—specifically filtering by private equity history and high-net-worth investor intent." },
    { id: 3, name: "Nova Retail", status: "new", dealSize: "$12,200", aiScore: 84, industry: "E-commerce", time: "15m ago", email: "growth@nova.com", source: "Email", message: "Implementing omni-channel retention logic for abandoned carts exceeding $500. Can NEXIO personalize recovery flows based on previous SKU interactions and conversion history?" },
    { id: 4, name: "BioGen Lab", status: "new", dealSize: "$25,000", aiScore: 78, industry: "Healthcare / BioTech", time: "24m ago", email: "security@biogen.systems", source: "Email", message: "Requesting a technical audit of NEXIO's patient data isolation protocols. Our compliance team needs to verify HIPAA / GDPR integrity for the upcoming platform sync." },
    { id: 5, name: "Apex Insure", status: "contacted", dealSize: "$9,500", aiScore: 65, industry: "FinTech / Insurance", time: "42m ago", email: "ops@apex.insure", source: "WhatsApp", message: "Reviewing our risk-scoring automation for multi-jurisdictional policy underwriting. How does NEXIO's autonomous engine handle real-time compliance checks across 40+ countries?" }
];

const InteractiveHeroDemo = () => {
    const [selectedLead, setSelectedLead] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [theme, setTheme] = useState('dark');
    const [isGenerating, setIsGenerating] = useState(false);
    const [intelligenceResult, setIntelligenceResult] = useState(null);
    const [hasSent, setHasSent] = useState(false);
    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const handleSelectLead = (lead) => {
        setSelectedLead(lead);
        setIntelligenceResult(null);
        setHasSent(false);
    };

    const handleSendNow = () => {
        setHasSent(true);
        setTimeout(() => {
            const chatHistory = document.getElementById('chat-history-scroll');
            if (chatHistory) chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    const handleGenerateIntelligence = () => {
        setIsGenerating(true);
        setIntelligenceResult(null);
        setHasSent(false);
        
        const intelligenceProfiles = {
            1: { reasoning: "Critical technical intent regarding Q3 infrastructure. Scalability confirmed as primary conversion catalyst. Enterprise-grade throughput requirements confirmed.", draft: "Dear Dynamic Retail Team,\n\nI am confirming that NEXIO's sync engine handles 1.2M+ records/hour with zero latency impact. I've attached our technical scope and enterprise SLA for your review.\n\nShall we schedule a brief technical sync to finalize the integration specs?" },
            2: { reasoning: "High-net-worth portfolio inquiry. Investment history indicates Tier-1 resilience. Target high-intent luxury automation.", draft: "Hi! I've prepared a highly qualified portfolio of EMAAR villas for you focused on high-net-worth investor criteria. Want to review the brochure? 🏘️" },
            3: { reasoning: "Retail retention logic triggered. Segment: High-value cart abandonment. SKU-level personalized re-engagement recommended for ROI protection.", draft: "Dear Nova Retail Team,\n\nConfirming that our personalization engine can automate recovery flows for your abandoned carts over $500. We can sync this with your Shopify Plus environment to protect your weekly ROI.\n\nShall we proceed with the integration?" },
            4: { reasoning: "Critical compliance inquiry. HIPAA/GDPR isolation protocols verified via siloed LLM clusters. Move to technical audit stage for sign-off.", draft: "Dear BioGen Security Team,\n\nRegarding your patient data isolation inquiry, I am confirming that our siloed LLM clusters and E2E encryption ensure total data integrity for your HIPAA sync. Attached is our ISO 27001 / SOC 2 Type II security audit.\n\nAre you available for a brief briefing with our compliance officer tomorrow?" },
            5: { reasoning: "Risk-scoring logic validation requested. Compliance module handles 40+ countries natively. Move to multi-jurisdictional pilot.", draft: "Hi there! We're all set for the risk-scoring pilot. Real-time compliance across the 40+ countries you mentioned is active. Shall we kick off the first test run? 🚀" }
        };

        const profile = intelligenceProfiles[selectedLead?.id] || intelligenceProfiles[1];
        const channel = selectedLead.source.toLowerCase().includes('whatsapp') ? 'whatsapp' : 'email';

        setTimeout(() => {
            setIsGenerating(false);
            setIntelligenceResult({
                score: selectedLead.aiScore,
                channel: channel,
                subject: channel === 'email' ? `Technical Review: ${selectedLead.industry} Support` : null,
                priority: selectedLead.aiScore > 80 ? 'High' : 'Medium',
                reasoning: profile.reasoning,
                generatedMessage: profile.draft
            });
            setTimeout(() => {
                const chatHistory = document.getElementById('chat-history-scroll');
                if (chatHistory) chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });
            }, 100);
        }, 1500);
    };

    return (
        <div data-testid="interactive-demo" className={`relative w-full h-[600px] md:h-auto md:aspect-video rounded-[1.5rem] md:rounded-[2.5rem] border transition-all duration-700 ease-[0.28,0.11,0.32,1] overflow-hidden flex flex-col md:flex-row ${theme === 'dark' ? 'bg-black border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)]' : 'bg-white border-black/5 shadow-[0_0_100px_rgba(0,0,0,0.05)]'}`}>
            
            {/* 🛠️ NAVIGATION SIDEBAR */}
            <div className={`hidden md:flex w-[200px] border-r transition-all duration-700 flex-col pt-10 pb-6 z-50 ${theme === 'dark' ? 'bg-black border-white/5' : 'bg-[#fbfbfd] border-black/5'}`}>
                <div className="px-8 mb-12 text-left">
                    <div className={`text-[22px] font-bold tracking-[-0.04em] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>NEXIO</div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
                        { icon: Users, label: 'Leads Central', id: 'leads' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); handleSelectLead(null); }}
                            className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${
                                activeTab === item.id 
                                    ? (theme === 'dark' ? "bg-white/10 text-white" : "bg-black/5 text-black")
                                    : (theme === 'dark' ? "text-white/20 hover:text-white/50" : "text-black/30 hover:text-black/60")
                            }`}
                        >
                            <item.icon size={15} className={activeTab === item.id ? "opacity-100" : "opacity-40"} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                            <span className="text-[12px] font-semibold tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="px-6 pt-6 border-t border-white/5 opacity-40">
                    <div className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-semibold tracking-tight ${theme === 'dark' ? 'text-white/30' : 'text-black/30'}`}>
                        <LogOut size={14} />
                        <span>Logout</span>
                    </div>
                </div>
            </div>

            {/* 📊 MAIN CONTENT GRID */}
            <div className="flex-1 flex flex-col relative overflow-hidden min-h-[600px]">
                
                {/* 🖥️ Chrome UI (Minimalist Safari) */}
                <div className={`h-14 border-b flex items-center px-4 md:px-10 justify-between z-40 relative transition-all duration-700 ${theme === 'dark' ? 'bg-black/60 border-white/5 backdrop-blur-[30px]' : 'bg-white/60 border-black/5 backdrop-blur-[30px]'}`}>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className={`px-10 py-1.5 rounded-xl border text-[10px] font-semibold tracking-tight transition-all duration-700 ${theme === 'dark' ? 'bg-white/[0.03] border-white/10 text-white/40' : 'bg-black/[0.03] border-black/5 text-black/40'}`}>
                        app.nexio.ai/{selectedLead ? 'leads/' + selectedLead.id : activeTab}
                    </div>
                    <button onClick={toggleTheme} className={`p-2.5 rounded-full transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-black/5 text-zinc-600'}`}>
                        {theme === 'dark' ? <Sun size={15} strokeWidth={2.5} /> : <Moon size={15} strokeWidth={2.5} />}
                    </button>
                </div>

                {/* DASHBOARD VIEW */}
                {!selectedLead && activeTab === 'dashboard' && (
                    <div className="p-8 h-full overflow-y-auto no-scrollbar pb-32 animate-in fade-in duration-500">
                        <div className="mb-6">
                            <div className={`backdrop-blur-3xl border rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xl text-left transition-colors duration-500 ${theme === 'dark' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-500 ${theme === 'dark' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-blue-100 border-blue-200 text-blue-600'}`}>
                                        <Info size={18} />
                                    </div>
                                    <div>
                                        <div className={`text-xs font-black flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                                            AI Strategic Insight
                                            <span className="px-2 py-0.5 bg-blue-500 text-white text-[7px] font-black uppercase rounded-full">Demo Data</span>
                                        </div>
                                        <p className="text-[9px] text-zinc-500 mt-1 max-w-lg font-medium italic">"AI converted 12 high-value leads this week worth $18,400"</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-10">
                            {[
                                { label: "AI Revenue", val: "$18,400", sub: "Monthly Closed", color: "text-emerald-500" },
                                { label: "Win Rate", val: "12.5%", sub: "Automated Ops", color: "" },
                                { label: "Annual Run Rate", val: "$220k", sub: "12mo Target", color: "" },
                                { label: "Pipeline", val: "$642k", sub: "Active Intent", color: "" }
                            ].map((card, i) => (
                                <div key={i} className={`p-6 border rounded-[2rem] text-left transition-all duration-700 ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/[0.03] shadow-sm'}`}>
                                    <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-tight mb-4">{card.label}</div>
                                    <div className={`text-3xl font-bold tracking-tight mb-2 ${card.color || (theme === 'dark' ? 'text-white' : 'text-black')}`}>{card.val}</div>
                                    <div className="text-[9px] font-semibold text-text-tertiary uppercase">{card.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* NEW: ROI COMPARISON SECTION */}
                        <div className="mb-8 text-left">
                            <div className={`text-[9px] font-black uppercase tracking-[0.3em] mb-4 ${theme === 'dark' ? 'text-blue-500/60' : 'text-blue-500'}`}>AI vs Manual Performance</div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className={`p-6 border rounded-[2rem] transition-colors duration-500 ${theme === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Conversion Win Rate</div>
                                            <div className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>AI performs 2.5x better</div>
                                        </div>
                                        <TrendingUp className="text-emerald-500" size={24} />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div className="text-[8px] font-black uppercase rounded-full text-blue-500 bg-blue-500/10 px-2 py-0.5">AI Win Rate</div>
                                                <span className="text-[10px] font-black text-blue-500">18%</span>
                                            </div>
                                            <div className={`overflow-hidden h-1.5 flex rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-zinc-100'}`}>
                                                <div style={{ width: '18%' }} className="bg-blue-500 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div className="text-[8px] font-black uppercase rounded-full text-zinc-500 bg-zinc-500/10 px-2 py-0.5">Manual Win Rate</div>
                                                <span className="text-[10px] font-black text-zinc-500">7%</span>
                                            </div>
                                            <div className={`overflow-hidden h-1.5 flex rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-zinc-100'}`}>
                                                <div style={{ width: '7%' }} className="bg-zinc-500 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 border rounded-[2rem] transition-colors duration-500 ${theme === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Response Speed Advantage</div>
                                            <div className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Continuous 24/7 Coverage</div>
                                        </div>
                                        <Clock className="text-blue-500" size={24} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className={`p-4 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-blue-500/5 border-blue-500/10 text-blue-500' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                            <div className="text-[8px] uppercase tracking-wider font-black mb-1">Avg AI Response</div>
                                            <div className="text-2xl font-black">3s</div>
                                        </div>
                                        <div className={`p-4 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-zinc-500/5 border-zinc-500/10 text-zinc-500' : 'bg-zinc-50 border-zinc-100 text-zinc-600'}`}>
                                            <div className="text-[8px] uppercase tracking-wider font-black mb-1">Manual Avg</div>
                                            <div className="text-2xl font-black">2h 15m</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEW: USER GROWTH & DATABASE SECTION */}
                        <div className="mb-8 text-left">
                            <div className={`text-[9px] font-black uppercase tracking-[0.3em] mb-4 ${theme === 'dark' ? 'text-blue-500/60' : 'text-blue-500'}`}>User Growth & Database</div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Leads", val: "12,400", sub: "Database size", icon: Users, color: "text-blue-500" },
                                    { label: "Hot Leads Today", val: "18", sub: "Priority 1 depth", icon: Calendar, color: "text-emerald-500" },
                                    { label: "Auto Replies Sent", val: "142", sub: "1.1% coverage", icon: Zap, color: "text-blue-500" },
                                    { label: "Hours Reclaimed", val: "23h", sub: "Manual reduction", icon: Shield, color: "text-indigo-500" }
                                ].map((stat, i) => (
                                    <div key={i} className={`p-4 border rounded-2xl transition-colors duration-500 ${theme === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                                            <stat.icon size={12} className={stat.color} />
                                        </div>
                                        <div className={`text-xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{stat.val}</div>
                                        <div className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">{stat.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NEW: REVENUE HISTORY CHART SECTION */}
                        <div className="text-left">
                            <div className={`text-[9px] font-black uppercase tracking-[0.3em] mb-4 ${theme === 'dark' ? 'text-blue-500/60' : 'text-blue-500'}`}>Revenue History (Dynamics)</div>
                            <div className={`p-6 border rounded-[2rem] transition-colors duration-500 ${theme === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
                                <div className="h-24 flex items-end gap-3 px-4">
                                    {[45, 62, 38, 78, 55, 88, 95].map((val, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                animate={{ height: `${val}%` }}
                                                className={`w-full rounded-t-lg transition-all duration-300 ${i === 6 ? 'bg-blue-500' : 'bg-blue-500/20 group-hover:bg-blue-500/40'}`} 
                                            />
                                            <div className="text-[7px] font-black text-zinc-600">
                                                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* LEADS CENTRAL VIEW */}
                {!selectedLead && activeTab === 'leads' && (
                    <div className="p-4 md:p-8 h-full w-full overflow-y-auto no-scrollbar pb-32 animate-in fade-in duration-700 text-left">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 md:gap-0">
                            <div>
                                <div className="text-[9px] font-black tracking-[0.3em] text-blue-500 uppercase mb-2">Portfolio Management</div>
                                <h1 className={`text-2xl md:text-4xl font-black tracking-tighter italic uppercase mb-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Leads Central</h1>
                                <p className="text-zinc-500 text-[9px] font-medium max-w-[200px] md:max-w-sm">Proprietary AI scoring and autonomous conversion tracking.</p>
                            </div>

                            <div className={`flex items-center gap-3 backdrop-blur-md p-1.5 rounded-xl border shadow-2xl transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-900/60 border-white/10' : 'bg-white/80 border-zinc-200'}`}>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" size={12} />
                                    <input type="text" placeholder="Identify lead..." className={`pl-8 pr-4 py-1.5 border rounded-lg text-[9px] w-32 md:w-40 focus:outline-none transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-950 border-white/5 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`} />
                                </div>
                                <div className={`h-4 w-[1px] ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`} />
                                <div className="flex items-center gap-2 text-[9px] font-black text-zinc-400 px-2 cursor-pointer transition-colors hover:text-white">
                                    <Filter size={10} /> STATUS: ALL
                                </div>
                                <div className="px-2 py-1.5 bg-primary/10 text-primary rounded-md"><MoreHorizontal size={14} /></div>
                            </div>
                        </div>

                        <div className={`border rounded-[24px] overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-white/[0.02] border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-left min-w-[500px]">
                                    <thead>
                                        <tr className={`border-b transition-colors duration-500 ${theme === 'dark' ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-100 bg-zinc-50/50'}`}>
                                            <th className="p-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Asset / Identity</th>
                                            <th className="p-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Workflow Status</th>
                                            <th className="p-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Conversion Potential</th>
                                            <th className="p-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Projected Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {initialLeads.map((lead, i) => (
                                            <tr key={i} onClick={() => handleSelectLead(lead)} className={`transition-all cursor-pointer group border-l-2 border-transparent hover:border-primary ${theme === 'dark' ? 'hover:bg-white/[0.03]' : 'hover:bg-zinc-50'}`}>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">{lead.name.charAt(0)}</div>
                                                        <div>
                                                            <div className={`font-black text-xs md:text-sm tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-zinc-900 shadow-sm'}`}>{lead.name}</div>
                                                            <div className="text-[9px] text-zinc-600 font-medium italic lowercase">{lead.industry}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/5 ${lead.status === 'converted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-400'}`}>{lead.status}</span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center justify-between gap-4 w-32">
                                                            <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-400">High Potential</span>
                                                            <span className={`text-[10px] font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{lead.aiScore}%</span>
                                                        </div>
                                                        <div className={`w-32 h-1 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-zinc-100'}`}>
                                                            <motion.div animate={{ width: `${lead.aiScore}%` }} className="h-full bg-emerald-500 rounded-full" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5"><div className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{lead.dealSize}</div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* 💬 LEAD DETAIL CHAT VIEW (1:1 SYNC) */}
                {selectedLead && (
                    <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden animate-in slide-in-from-bottom-10 duration-700">
                        {/* Chat Header */}
                        <div className={`p-6 border-b flex items-center justify-between transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-900/40 border-white/10' : 'bg-white border-zinc-200'}`}>
                            <div className="flex items-center gap-6">
                                <button onClick={() => handleSelectLead(null)} className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all hover:-translate-x-1 ${theme === 'dark' ? 'bg-zinc-800 border-white/10 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-900'}`}>
                                    <ArrowLeft size={16} />
                                </button>
                                <div className="text-left">
                                    <h2 className={`text-2xl font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{selectedLead.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="text-[8px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> AI Agent Active
                                        </div>
                                        <div className={`text-[8px] font-black uppercase tracking-widest opacity-40 flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 ${theme === 'dark' ? 'text-white' : 'text-zinc-500'}`}>
                                            Source: {selectedLead.source} Sync
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={handleGenerateIntelligence}
                                    disabled={isGenerating}
                                    className={`px-6 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 border-none ${isGenerating ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-2xl shadow-xl shadow-blue-500/20'}`}
                                >
                                    {isGenerating ? <><Sparkles className="animate-spin" size={14} /> Analyzing...</> : <><Sparkles size={14} /> Sync Intelligence</>}
                                </button>
                            </div>
                        </div>

                        {/* Chat History */}
                        <div id="chat-history-scroll" className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar flex flex-col">
                            <div className="flex-1 min-h-[50px]" /> {/* Spacer */}
                            <div className="space-y-10">
                                {/* Lead Initial Message */}
                                <div className="flex justify-start">
                                    <div className={`max-w-[70%] p-6 rounded-[28px] rounded-tl-none border shadow-sm transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-900/60 border-white/10 backdrop-blur-md' : 'bg-white border-zinc-200'}`}>
                                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-3">{selectedLead.name} • Internal Lead</div>
                                        <p className={`text-base font-medium leading-relaxed text-left ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>
                                            "{selectedLead.message}"
                                        </p>
                                        <div className="text-[8px] font-black text-zinc-600 mt-4 uppercase tracking-[0.2em]">Source: {selectedLead.source} Sync</div>
                                    </div>
                                </div>

                                {/* AI Intelligence Insight (Generated) */}
                                <AnimatePresence>
                                    {intelligenceResult && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-center"
                                        >
                                            <div className="bg-blue-500/5 border border-blue-500/20 backdrop-blur-2xl rounded-[32px] p-6 max-w-xl shadow-[0_0_50px_rgba(59,130,246,0.1)] flex gap-6 items-center text-left">
                                                <div className="w-14 h-14 rounded-2xl bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center text-white shrink-0"><Sparkles size={24} /></div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em]">AI Analysis</h3>
                                                        <div className="px-2 py-0.5 bg-blue-500 text-white text-[7px] font-black uppercase rounded tracking-widest">Score: {intelligenceResult.score}</div>
                                                    </div>
                                                    <p className={`text-[11px] font-bold leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>{intelligenceResult.reasoning}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* AI Response Bubble (Only if not generating or is static history) */}
                                {!intelligenceResult && (
                                    <div className="flex justify-end pr-4">
                                        <div className="max-w-[75%] p-8 rounded-[38px] rounded-tr-none bg-primary shadow-[0_30px_60px_-15px_rgba(59,130,246,0.4)] text-left relative group">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white"><Sparkles size={14} /></div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Autonomous AI Agent</span>
                                            </div>
                                            <p className="text-base font-black text-white leading-relaxed">
                                                Hi! Thanks for reaching out to us. I've just received your inquiry and I'm currently preparing a detailed response for you. I'll have that over in just a moment! ⚡
                                            </p>
                                            <div className="text-[8px] font-black text-white/50 mt-6 uppercase tracking-widest flex items-center justify-between">
                                                <span>Transmitted via {selectedLead.source}</span>
                                                <span className="px-2 py-1 bg-white/10 rounded flex items-center gap-1.5 block">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                                                    Active Analysis
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* GENERATED MESSAGE (Appears below Intelligence Card) */}
                                <AnimatePresence>
                                    {intelligenceResult?.generatedMessage && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            {/* Draft Card (Channel Aware) */}
                                            <div className={`border rounded-[32px] p-6 shadow-2xl transition-all flex flex-col gap-6 ${theme === 'dark' ? 'border-white/10 bg-zinc-950/40 backdrop-blur-3xl' : 'border-zinc-200 bg-white/80'}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className={`text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2 italic ${intelligenceResult.channel === 'email' ? 'text-blue-500' : 'text-emerald-500'}`}>
                                                        {intelligenceResult.channel === 'email' ? <Mail size={12} /> : <MessageSquare size={12} />} 
                                                        {hasSent ? (intelligenceResult.channel === 'email' ? 'Email Dispatched' : 'WhatsApp Sent') : (intelligenceResult.channel === 'email' ? 'Intelligence Draft (Mail)' : 'Intelligence Draft (WhatsApp)')}
                                                    </div>
                                                    {hasSent && <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-500/20 ">Auto-Dispatched</span>}
                                                </div>

                                                <div className="space-y-4">
                                                    {intelligenceResult.channel === 'email' && intelligenceResult.subject && (
                                                        <div className={`p-4 rounded-xl border-l-4 border-blue-500 transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-100'}`}>
                                                            <div className="text-[8px] font-black uppercase text-zinc-500 mb-1">Subject:</div>
                                                            <div className={`text-xs font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{intelligenceResult.subject}</div>
                                                        </div>
                                                    )}
                                                    <p className={`text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'} ${intelligenceResult.channel === 'whatsapp' ? 'italic' : ''}`}>
                                                        {intelligenceResult.generatedMessage}
                                                    </p>
                                                </div>

                                                {!hasSent && (
                                                    <div className="flex gap-4">
                                                        <button 
                                                            onClick={handleSendNow}
                                                            className={`font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-2xl shadow-xl border-none active:scale-95 transition-all text-center text-white ${intelligenceResult.channel === 'email' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'}`}
                                                        >
                                                            {intelligenceResult.channel === 'email' ? 'SEND EMAIL NOW' : 'SEND WHATSAPP'}
                                                        </button>
                                                        <button className={`font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-2xl border transition-all ${theme === 'dark' ? 'border-white/10 text-zinc-500 hover:text-white' : 'border-zinc-200 text-zinc-400 hover:text-zinc-600'}`}>
                                                            Edit Draft
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Final Sent Bubble (Only if sent) */}
                                            {hasSent && (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="flex justify-end pr-4"
                                                >
                                                    <div className={`max-w-[75%] p-8 rounded-[38px] rounded-tr-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] text-left relative ${intelligenceResult.channel === 'email' ? 'bg-blue-600' : 'bg-emerald-600 shadow-emerald-500/20'}`}>
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                                                                {intelligenceResult.channel === 'email' ? <Mail size={14} /> : <MessageSquare size={14} />}
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Autonomous AI Dispatch ({intelligenceResult.channel})</span>
                                                        </div>
                                                        {intelligenceResult.channel === 'email' && intelligenceResult.subject && (
                                                            <div className="mb-4 text-[10px] font-black text-white/40 uppercase tracking-widest">SUB: {intelligenceResult.subject}</div>
                                                        )}
                                                        <p className="text-base font-black text-white leading-relaxed whitespace-pre-wrap">
                                                            {intelligenceResult.generatedMessage}
                                                        </p>
                                                        <div className="text-[8px] font-black text-white/50 mt-6 uppercase tracking-widest flex items-center justify-between">
                                                            <span>Transmitted via {intelligenceResult.channel.charAt(0).toUpperCase() + intelligenceResult.channel.slice(1)}</span>
                                                            <span className="px-2 py-1 bg-white/10 rounded flex items-center gap-1.5 block">
                                                                <div className="w-1 h-1 rounded-full bg-emerald-400" />
                                                                Live Delivery
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Chat Input Layer */}
                        <div className={`p-8 border-t transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-950/20 border-white/10' : 'bg-white border-zinc-200 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]'}`}>
                            <div className="relative max-w-4xl mx-auto group">
                                <div className="absolute inset-0 bg-blue-500/5 rounded-[28px] blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-700" />
                                <input
                                    type="text"
                                    placeholder="Dictate manual follow-up or add profile context..."
                                    className={`relative w-full border rounded-[28px] py-6 pl-10 pr-24 text-base font-bold transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 shadow-2xl ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10 text-white placeholder:text-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-300'}`}
                                />
                                <button className="absolute right-3.5 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 border-none group active:scale-95">
                                    <Send size={24} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                <Search size={14} className="text-zinc-500" />
                                <Mail size={14} className="text-zinc-500" />
                                <Phone size={14} className="text-zinc-500" />
                                <Activity size={14} className="text-zinc-500" />
                            </div>
                        </div>
                    </div>
                )}

                {/* 📱 MOBILE NAVIGATION (Visible only on < md) */}
                {!selectedLead && (
                    <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] flex gap-2 p-1.5 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl">
                        {[
                            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                            { id: 'leads', icon: Users, label: 'Leads' }
                        ].map((nav) => (
                            <button
                                key={nav.id}
                                onClick={() => setActiveTab(nav.id)}
                                className={`flex flex-col items-center gap-1 px-5 py-2.5 rounded-xl transition-all ${
                                    activeTab === nav.id 
                                        ? "bg-white/10 text-white shadow-inner" 
                                        : "text-white/30 hover:text-white/60"
                                }`}
                            >
                                <nav.icon size={16} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{nav.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.1); border-radius: 10px; }
            `}} />
        </div>
    );
};

export default InteractiveHeroDemo;
