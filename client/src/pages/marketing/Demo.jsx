import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import InteractiveHeroDemo from '../../components/marketing/InteractiveHeroDemo';
import SEO from '../../components/marketing/SEO';
import {
    MessageSquare, Zap, BarChart2, Code, Check,
    Send, Bot, User, TrendingUp, Users, ChevronRight,
    Star, Globe, Mail, Calendar
} from 'lucide-react';

// ── Live Chatbot Widget Demo ──────────────────────────────────────────────────
const CHAT_FLOW = [
    { from: 'bot', text: "Hi! I'm NEXIO AI — your sales assistant. How can I help you today?", delay: 0 },
    { from: 'user', text: "What does your pricing look like?", delay: 1.2 },
    { from: 'bot', text: "Great question! We have 3 plans starting from $49/mo. Our most popular is the Growth plan at $129/mo which includes AI lead scoring, WhatsApp automation, and CRM access.", delay: 2.5 },
    { from: 'user', text: "Can it handle 500+ leads per month?", delay: 4.2 },
    { from: 'bot', text: "Absolutely — our Growth plan handles up to 2,000 leads/month. I've noted you're evaluating for 500+ leads/month. Want me to book a quick 15-min call with our team?", delay: 5.8 },
    { from: 'user', text: "Yes, that would be great!", delay: 7.4 },
    { from: 'bot', text: "📅 Done! I've opened our booking calendar for you. Our team will confirm shortly. You're also pre-qualified as a high-intent lead — our AI just scored you 91/100 ✨", delay: 9.0 },
];

const ChatWidget = ({ isOpen, onToggle }) => {
    const [visibleMessages, setVisibleMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const [input, setInput] = useState('');
    const chatRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        setVisibleMessages([]);
        let timers = [];
        CHAT_FLOW.forEach((msg, i) => {
            if (msg.from === 'bot') {
                timers.push(setTimeout(() => setTyping(true), msg.delay * 1000 - 600));
            }
            timers.push(setTimeout(() => {
                setTyping(false);
                setVisibleMessages(prev => [...prev, msg]);
                if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }, msg.delay * 1000 + 400));
        });
        return () => timers.forEach(clearTimeout);
    }, [isOpen]);

    return (
        <div className="relative">
            {/* Widget Host Page backdrop — dark client website mockup */}
            <div
                className="rounded-3xl overflow-hidden relative"
                style={{ background: '#0f1115', height: '480px', border: '1px solid rgba(255,255,255,0.08)' }}
            >
                {/* Fake dark website nav */}
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-blue-600" />
                        <div className="w-16 h-2.5 rounded-full bg-white/20" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-2 rounded-full bg-white/10" />
                        <div className="w-10 h-2 rounded-full bg-white/10" />
                        <div className="w-10 h-2 rounded-full bg-white/10" />
                        <div className="w-16 h-6 rounded-xl bg-blue-600/30" />
                    </div>
                </div>
                {/* Fake hero section */}
                <div className="p-8">
                    <div className="w-20 h-2 rounded-full bg-blue-500/30 mb-4" />
                    <div className="w-56 h-5 rounded-full bg-white/20 mb-3" />
                    <div className="w-44 h-5 rounded-full bg-white/15 mb-6" />
                    <div className="space-y-2">
                        <div className="w-full h-2 rounded-full bg-white/07" />
                        <div className="w-4/5 h-2 rounded-full bg-white/05" />
                        <div className="w-3/5 h-2 rounded-full bg-white/05" />
                    </div>
                </div>
                <div className="absolute top-16 right-6 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Your Client's Website
                </div>

                {/* Chat Widget */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute bottom-20 right-6 w-72 rounded-3xl overflow-hidden shadow-2xl"
                            style={{ background: '#0f1115', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            {/* Widget Header */}
                            <div className="px-5 py-4 flex items-center gap-3" style={{ background: '#3b82f6' }}>
                                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Bot size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">NEXIO AI Assistant</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                        <p className="text-white/70 text-[10px] font-medium">Online · Trained on your website</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div ref={chatRef} className="p-4 space-y-3 h-52 overflow-y-hidden" style={{ scrollbarWidth: 'none' }}>
                                {visibleMessages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div
                                            className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[12px] font-medium leading-relaxed"
                                            style={msg.from === 'bot'
                                                ? { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', borderBottomLeftRadius: '6px' }
                                                : { background: '#3b82f6', color: '#fff', borderBottomRightRadius: '6px' }
                                            }
                                        >
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {typing && (
                                    <div className="flex justify-start">
                                        <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.07)', borderBottomLeftRadius: '6px' }}>
                                            <div className="flex gap-1 items-center">
                                                {[0,1,2].map(i => (
                                                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"
                                                        animate={{ y: [0, -4, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="px-4 pb-4">
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <input
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        placeholder="Type your question..."
                                        className="flex-1 text-[12px] font-medium bg-transparent focus:outline-none"
                                        style={{ color: 'rgba(255,255,255,0.7)' }}
                                    />
                                    <button className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center">
                                        <Send size={12} className="text-white" />
                                    </button>
                                </div>
                                <p className="text-center text-[9px] mt-2 font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>
                                    Powered by NEXIO AI
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Widget Launcher Button */}
                <motion.button
                    onClick={onToggle}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className="absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center relative"
                    style={{ background: '#3b82f6', boxShadow: '0 8px 30px rgba(59,130,246,0.4)' }}
                    animate={isOpen ? {} : { scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                >
                    <AnimatePresence mode="wait">
                        {isOpen
                            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-white font-black text-xl">✕</motion.span>
                            : <motion.div key="bot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><MessageSquare size={22} className="text-white" /></motion.div>
                        }
                    </AnimatePresence>
                    {!isOpen && (
                        <motion.span
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full"
                            style={{ background: 'rgba(59,130,246,0.4)' }}
                        />
                    )}
                </motion.button>
            </div>
        </div>
    );
};

// ── Feature Demo Cards ─────────────────────────────────────────────────────────
const FEATURE_DEMOS = [
    {
        tab: 'Widget',
        icon: Code,
        title: 'Embeddable Chat Widget',
        subtitle: 'Drop on any website in 30 seconds',
        description: 'Install NEXIO on any website with one line of code. The AI learns your products, pricing, and FAQs — and qualifies every visitor in real time.',
        demo: 'widget',
        points: ['Trained on your business knowledge', 'Captures name, email, phone automatically', 'Scores each lead 0–100 in real time', 'Notifies your team for hot leads instantly'],
    },
    {
        tab: 'WhatsApp',
        icon: MessageSquare,
        title: 'WhatsApp Business Automation',
        subtitle: 'Reply to every lead in under 5 seconds',
        description: 'Connect your Meta WhatsApp Business account and NEXIO handles every message — qualifying leads, answering questions, and booking meetings 24/7.',
        demo: 'whatsapp',
        points: ['Connects via Meta Cloud API', 'AI replies in your brand voice', 'Handles 1,000s of conversations simultaneously', 'Escalates hot leads to your human team'],
    },
    {
        tab: 'Dashboard',
        icon: BarChart2,
        title: 'Revenue Intelligence Dashboard',
        subtitle: 'See your pipeline in real time',
        description: 'A full-featured CRM and analytics platform showing AI-generated revenue, pipeline value, conversion rates, and lead scores — live.',
        demo: 'dashboard',
        points: ['4 core stat cards with sparklines', 'Sales performance gauge', 'Monthly analytics bar chart', 'Visit heatmap & visitor segmentation'],
    },
    {
        tab: 'Email',
        icon: Mail,
        title: 'Gmail & Email Automation',
        subtitle: 'Zero inbox management',
        description: 'Connect Gmail via OAuth2. NEXIO reads, classifies, and auto-responds to inbound leads — sending perfectly crafted replies within seconds.',
        demo: 'email',
        points: ['OAuth2 Gmail integration', 'AI generates context-aware replies', 'Syncs lead data to your CRM', 'Tracks open and response rates'],
    },
];

const WhatsAppDemo = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    const [msgs, setMsgs] = useState([]);
    useEffect(() => {
        if (!inView) return;
        const flow = [
            { from: 'lead', text: "Hi, I'm interested in your enterprise plan for 800 leads/month." },
            { from: 'bot', text: "Hi! Thanks for reaching out 👋 I'm NEXIO, your AI assistant. 800 leads/month puts you in our Enterprise tier. Can I ask — are you currently managing follow-ups manually?" },
            { from: 'lead', text: "Yes, entirely manually. Losing a lot of leads." },
            { from: 'bot', text: "Completely understandable — that's exactly what we solve. I've scored your intent at 89/100 and I'm opening a booking link for a 20-min call with our team. 📅" },
        ];
        flow.forEach((m, i) => setTimeout(() => setMsgs(prev => [...prev, m]), (i + 1) * 1400));
    }, [inView]);

    return (
        <div ref={ref} className="rounded-2xl overflow-hidden" style={{ background: '#0f1115', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-5 py-3 flex items-center gap-3" style={{ background: '#075E54' }}>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><MessageSquare size={14} className="text-white" /></div>
                <div><p className="text-white font-bold text-sm">NEXIO AI</p><p className="text-white/60 text-[10px]">Online · Always Active</p></div>
            </div>
            <div className="p-4 space-y-3 min-h-[200px]" style={{ background: 'rgba(0,0,0,0.3)' }}>
                {msgs.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        <div className="max-w-[80%] px-4 py-2.5 rounded-2xl text-[12px] font-medium"
                            style={m.from === 'bot'
                                ? { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', borderBottomLeftRadius: '4px' }
                                : { background: '#25D366', color: '#fff', borderBottomRightRadius: '4px' }}>
                            {m.text}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const EmailDemo = () => (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0f1115', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">NEXIO · Inbox Intelligence</p>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-emerald-400" style={{ background: 'rgba(16,185,129,0.1)' }}>3 New Leads</span>
            </div>
        </div>
        {[
            { from: 'james@techflow.io', subject: 'RE: Enterprise Plan Inquiry', score: 94, status: 'responded', time: '2m ago' },
            { from: 'sara@nova-retail.com', subject: 'Pricing for growth team?', score: 81, status: 'qualified', time: '8m ago' },
            { from: 'info@biogenlab.co', subject: 'HIPAA Compliance Question', score: 76, status: 'processing', time: '14m ago' },
        ].map((email, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 transition-all hover:bg-white/[0.02] cursor-pointer" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                    {email.from[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-white truncate">{email.from}</p>
                    <p className="text-[10px] text-white/30 truncate">{email.subject}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-black text-blue-400">{email.score}/100</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${email.status === 'responded' ? 'text-emerald-400 bg-emerald-500/10' : email.status === 'qualified' ? 'text-blue-400 bg-blue-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                        {email.status}
                    </span>
                    <span className="text-[9px] text-white/20">{email.time}</span>
                </div>
            </div>
        ))}
    </div>
);

// ── Main Demo Page ─────────────────────────────────────────────────────────────
const DEMO_TAB_MAP = { widget: 0, whatsapp: 1, dashboard: 2, email: 3 };

const DemoPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') || 'dashboard';
    const activeFeature = DEMO_TAB_MAP[tabParam] ?? 2;
    const setActiveFeature = (idx) => {
        const key = Object.keys(DEMO_TAB_MAP).find(k => DEMO_TAB_MAP[k] === idx) || 'dashboard';
        setSearchParams({ tab: key });
    };
    const [chatOpen, setChatOpen] = useState(false);
    const dashboardTab = searchParams.get('dashboardTab') || 'dashboard';

    // Auto-open chat when widget tab is active
    useEffect(() => {
        if (tabParam === 'widget') {
            const t = setTimeout(() => setChatOpen(true), 1500);
            return () => clearTimeout(t);
        }
        setChatOpen(false);
    }, [tabParam]);


    return (
        <>
            <SEO
                title="Live Demo — See NEXIO's AI Sales Automation in Action"
                description="Explore the NEXIO platform live. See the real dashboard, chatbot widget, WhatsApp automation, and email AI — all running in real time."
                keywords="NEXIO Demo, AI Sales Demo, Live Chat Widget Demo, WhatsApp Automation Demo, CRM Dashboard Demo"
            />

            <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
                {/* Hero */}
                <div className="pt-16 pb-12 px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
                            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent-blue)' }}
                        >
                            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full inline-block bg-blue-500" />
                            Interactive Live Demo
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-5" style={{ color: 'var(--text-primary)' }}>
                            Experience NEXIO live.
                        </h1>
                        <p className="text-xl max-w-2xl mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>
                            This is the actual NEXIO platform — not a mockup. Click, interact, and see exactly what your team gets on day one.
                        </p>
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pb-32 space-y-24">

                    {/* ── LIVE DASHBOARD ──────────────────────────────────── */}
                    <section aria-label="Dashboard Demo">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="text-center mb-10">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--accent-blue)' }}>Real Dashboard</div>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                                    Your command center — live
                                </h2>
                            </div>
                            <div
                                className="rounded-3xl overflow-hidden shadow-2xl"
                                style={{ border: '1px solid var(--border)', boxShadow: '0 0 80px rgba(0,0,0,0.3)' }}
                            >
                                <InteractiveHeroDemo initialTab={dashboardTab} />
                            </div>
                            <p className="text-center text-sm mt-4 font-medium" style={{ color: 'var(--text-tertiary)' }}>
                                Click sidebar tabs: Dashboard · Leads · Pipeline · Automations · Analytics →
                            </p>
                        </motion.div>
                    </section>

                    {/* ── FEATURE DEMOS ──────────────────────────────────── */}
                    <section aria-label="Feature Demos">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-12"
                        >
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--accent-blue)' }}>Feature Demos</div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                                Every feature, live in action
                            </h2>
                        </motion.div>

                        {/* Feature Tabs */}
                        <div className="flex flex-wrap gap-3 justify-center mb-12">
                            {FEATURE_DEMOS.map((f, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveFeature(i)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all"
                                    style={activeFeature === i
                                        ? { background: 'var(--accent-blue)', color: '#fff', boxShadow: '0 8px 20px rgba(59,130,246,0.25)' }
                                        : { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
                                    }
                                >
                                    <f.icon size={14} />
                                    {f.tab}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFeature}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                                    {/* Left: copy */}
                                    <div>
                                        {(() => {
                                            const ActiveIcon = FEATURE_DEMOS[activeFeature].icon;
                                            return (
                                                <div
                                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
                                                    style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent-blue)' }}
                                                >
                                                    <ActiveIcon size={10} />
                                                    {FEATURE_DEMOS[activeFeature].tab}
                                                </div>
                                            );
                                        })()}
                                        <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-3" style={{ color: 'var(--text-primary)' }}>
                                            {FEATURE_DEMOS[activeFeature].title}
                                        </h3>
                                        <p className="text-base font-bold mb-6" style={{ color: 'var(--accent-blue)' }}>
                                            {FEATURE_DEMOS[activeFeature].subtitle}
                                        </p>
                                        <p className="text-lg font-medium mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                            {FEATURE_DEMOS[activeFeature].description}
                                        </p>
                                        <div className="space-y-3">
                                            {FEATURE_DEMOS[activeFeature].points.map((point, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <Check size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: live demo */}
                                    <div>
                                        {FEATURE_DEMOS[activeFeature].demo === 'widget' && (
                                            <ChatWidget isOpen={chatOpen} onToggle={() => setChatOpen(p => !p)} />
                                        )}
                                        {FEATURE_DEMOS[activeFeature].demo === 'whatsapp' && <WhatsAppDemo />}
                                        {FEATURE_DEMOS[activeFeature].demo === 'dashboard' && (
                                            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', maxHeight: '400px', overflow: 'hidden' }}>
                                                <InteractiveHeroDemo />
                                            </div>
                                        )}
                                        {FEATURE_DEMOS[activeFeature].demo === 'email' && <EmailDemo />}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </section>

                    {/* ── CTA ─────────────────────────────────────────────── */}
                    <section>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="text-center p-12 md:p-20 rounded-3xl relative overflow-hidden"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                        >
                            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(59,130,246,0.08), transparent 60%)' }} />
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6" style={{ color: 'var(--text-primary)' }}>
                                Ready to deploy your AI sales team?
                            </h2>
                            <p className="text-xl mb-10 max-w-xl mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Start your 14-day free trial today — no credit card needed.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white"
                                        style={{ background: 'var(--accent-blue)', boxShadow: '0 10px 30px rgba(59,130,246,0.25)' }}
                                    >
                                        Start Free Trial →
                                    </motion.button>
                                </Link>
                                <Link to="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest"
                                        style={{ border: '2px solid var(--border)', color: 'var(--text-primary)' }}
                                    >
                                        Talk to Sales
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default DemoPage;
