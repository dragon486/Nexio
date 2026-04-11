import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
    Database, Zap, TrendingUp, MessageSquare, 
    DollarSign, Users, Activity, CheckCircle, 
    ArrowUpRight, Info, ExternalLink, Shield,
    BarChart2, Clock, Send
} from 'lucide-react';

const steps = [
    {
        id: 'step1',
        icon: <Database size={32} />,
        step: 'Step 01',
        title: <>Zero-Latency<br/>Data Fusion.</>,
        description: 'NEXIO sync with your WhatsApp Business API in seconds, indexing your business DNA to respond like a founder.',
        color: 'text-primary'
    },
    {
        id: 'step2',
        icon: <MessageSquare size={32} />,
        step: 'Step 02',
        title: <>Autonomous<br/>Engagement.</>,
        description: 'Our AI doesn\'t just "chat." It qualifies, handles objections, and pushes leads toward conversion 24/7.',
        color: 'text-purple-500'
    },
    {
        id: 'step3',
        icon: <TrendingUp size={32} />,
        step: 'Step 03',
        title: <>Predictive<br/>ROI Matrix.</>,
        description: 'Watch your revenue pipeline grow in real-time as NEXIO categorizes high-intent leads and forecasts your ARR.',
        color: 'text-emerald-500'
    }
];

const ShowcaseSection = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { 
        mass: 0.1,
        stiffness: 150,
        damping: 25,
        restDelta: 0.001 
    });
    
    const progressValue = useTransform(smoothProgress, [0, 1], [0, 100]);
    const roundedProgress = useTransform(progressValue, (v) => Math.round(v));

    // DASHBOARD MOCKUP: Entry / Presence / Exit
    const mockupScale = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0.6, 1, 1, 0.8]);
    const mockupRotateX = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [30, 0, 0, -15]);
    const mockupOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    // ATMOSPHERE (Parallax Glow)
    const bgOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.1, 0.6, 0.1]);
    const bgScale = useTransform(smoothProgress, [0, 1], [0.8, 1.5]);

    return (
        <section ref={sectionRef} className="relative h-[600vh] bg-background">
            
            {/* 🛑 STICKY CONTAINER */}
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center pt-20 overflow-hidden px-8 will-change-transform">
                
                {/* 🌌 Background Atmosphere (Optimized: Using Gradient, not Blur) */}
                <motion.div 
                    style={{ opacity: bgOpacity, scale: bgScale }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform"
                >
                    <div className="w-[1400px] h-[1400px] bg-[radial-gradient(circle_at_center,var(--accent-blue)_0%,transparent_70%)] rounded-full opacity-10" />
                </motion.div>

                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-20 h-full py-12">
                    
                    {/* 📝 STORYTELLING (STILL LOCKED: DO NOT CHANGE RANGES) */}
                    <div className="relative h-full flex items-center">
                        {steps.map((step, index) => {
                            const start = 0.1 + (index * 0.3);
                            const end = 0.35 + (index * 0.3);
                            
                            const opacity = useTransform(smoothProgress, 
                                [start - 0.05, start + 0.05, end - 0.05, end + 0.05], 
                                [0, 1, 1, 0]
                            );

                            const translateY = useTransform(smoothProgress,
                                [start - 0.05, start + 0.05, end - 0.05, end + 0.05],
                                [60, 0, 0, -60]
                            );

                            return (
                                <motion.div 
                                    key={step.id}
                                    style={{ opacity, y: translateY }}
                                    className="absolute inset-0 flex flex-col justify-center text-center lg:text-left pointer-events-none"
                                >
                                    <div className={`flex items-center justify-center lg:justify-start gap-4 mb-6 md:mb-10 ${step.color}`}>
                                        <div className="p-3 md:p-4 bg-current/10 rounded-2xl border border-current/20 shadow-xl">
                                            {step.icon}
                                        </div>
                                        <span className="text-[12px] font-bold tracking-tight opacity-40">{step.step}</span>
                                    </div>
                                    <h2 className="text-4xl sm:text-6xl lg:text-[84px] font-bold tracking-tight mb-6 md:mb-10 text-foreground leading-[1] transition-all">
                                        {step.title}
                                    </h2>
                                    <p className="text-xl lg:text-2xl text-text-secondary font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* 🖥️ REAL DASHBOARD MOCKUP (V8 HIGH-FIDELITY SYNC) */}
                    <motion.div 
                        style={{ 
                            scale: mockupScale, 
                            rotateX: mockupRotateX, 
                            opacity: mockupOpacity,
                            perspective: "2000px"
                        }}
                        className="relative hidden lg:block w-full"
                    >
                        <div className="relative aspect-[16/11] bg-black rounded-[3rem] border border-white/5 shadow-[0_60px_150px_-30px_rgba(0,0,0,1)] overflow-hidden group transition-all duration-700">
                           
                            {/* Browser Header (Safari Pro) */}
                            <div className="h-14 bg-black/80 backdrop-blur-3xl border-b border-white/5 flex items-center px-10 justify-between z-40 relative">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                                </div>
                                <div className="text-[10px] font-bold text-white/20 tracking-tight">SYSTEM ARCHITECTURE: NEXIO</div>
                                <div className="w-20" />
                            </div>

                            {/* CORE DASHBOARD CANVAS */}
                            <div className="p-6 h-full bg-[#030303] relative overflow-hidden">
                                
                                {/* VIEW 01: ONBOARDING & SYNC (Step 1 Range: 0.1 - 0.35) */}
                                <motion.div 
                                    style={{ 
                                        opacity: useTransform(smoothProgress, [0.05, 0.1, 0.35, 0.4], [0, 1, 1, 0]),
                                        y: useTransform(smoothProgress, [0.05, 0.1, 0.35, 0.4], [20, 0, 0, -20])
                                    }}
                                    className="absolute inset-0 p-8 space-y-8"
                                >
                                    {/* Real Trust Banner Mockup */}
                                    <div className="bg-blue-500/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-6 shadow-2xl">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/10">
                                                <Info size={24} />
                                            </div>
                                            <div className="text-left leading-tight">
                                                <div className="text-sm font-black text-white flex items-center gap-2">
                                                    Infrastructure: Core
                                                    <span className="px-2 py-0.5 bg-blue-500 text-white text-[8px] font-black uppercase rounded-full">Secure Sync</span>
                                                </div>
                                                <p className="text-[10px] text-zinc-500 mt-1 max-w-md font-medium">Automatic business DNA synchronization with WhatsApp Business API.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connection Nodes */}
                                    <div className="grid grid-cols-2 gap-6">
                                        {[
                                            { label: 'WA API', title: 'Data Stream', icon: <MessageSquare size={20} className="text-primary" />, status: 'Syncing' },
                                            { label: 'DNA', title: 'Intelligence', icon: <Database size={20} className="text-primary/40" />, status: 'Indexing' }
                                        ].map((node, i) => (
                                            <div key={i} className="card-mockup flex items-center gap-6 p-6">
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 flex items-center justify-center shadow-lg">
                                                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{node.label}</div>
                                                    <div className="text-lg font-black text-white tracking-tight">{node.title}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* VIEW 02: AI AUTO-MESSAGING & LEADS (Step 2 Range: 0.4 - 0.65) */}
                                <motion.div 
                                    style={{ 
                                        opacity: useTransform(smoothProgress, [0.38, 0.42, 0.65, 0.7], [0, 1, 1, 0]),
                                        y: useTransform(smoothProgress, [0.38, 0.42, 0.65, 0.7], [20, 0, 0, -20])
                                    }}
                                    className="absolute inset-0 p-8 grid grid-cols-12 gap-8 pointer-events-none"
                                >
                                    {/* Left: Lead Feed (Mirroring LeadFeed.jsx) */}
                                    <div className="col-span-5 space-y-4">
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Discovery Feed</div>
                                        {[
                                            { name: "Dynamic Retail", score: 98, status: "Active", urgent: true },
                                            { name: "Nebula Corp", score: 84, status: "Indexing", urgent: false },
                                            { name: "Vertex Tech", score: 72, status: "Syncing", urgent: false }
                                        ].map((lead, i) => (
                                            <motion.div 
                                                key={i}
                                                style={{ x: useTransform(smoothProgress, [0.4 + (i * 0.05), 0.45 + (i * 0.05)], [-20, 0]) }}
                                                className={`p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between ${lead.urgent ? 'ring-1 ring-emerald-500/20' : ''}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${lead.urgent ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                        <Users size={14} />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-xs font-black text-white leading-none mb-1">{lead.name}</div>
                                                        <div className="text-[9px] text-zinc-500 font-bold">{lead.status}</div>
                                                    </div>
                                                </div>
                                                <div className={`text-[10px] font-black ${lead.urgent ? 'text-emerald-500' : 'text-zinc-600'}`}>{lead.score}</div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Right: AI CONVERSATION SHELL (NEXIO MESSAGING) */}
                                    <div className="col-span-7 flex flex-col h-full bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                            <div className="flex items-center gap-3 text-left">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><MessageSquare size={14} className="text-primary" /></div>
                                                <div>
                                                    <div className="text-xs font-black text-white">Dynamic Retail</div>
                                                    <div className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">AI Agent Active</div>
                                                </div>
                                            </div>
                                            <Zap size={14} className="text-primary" />
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            {/* Lead Message */}
                                            <motion.div 
                                                style={{ scale: useTransform(smoothProgress, [0.48, 0.52], [0.8, 1]), opacity: useTransform(smoothProgress, [0.48, 0.52], [0, 1]) }}
                                                className="bg-zinc-800/80 p-4 rounded-2xl rounded-tl-none mr-8 text-left"
                                            >
                                                <p className="text-[11px] font-medium text-zinc-300">Is this for Enterprise? How much do you charge for 500 agents?</p>
                                                <div className="text-[8px] text-zinc-500 mt-2 font-mono uppercase tracking-widest text-right">LEAD • 12:04PM</div>
                                            </motion.div>

                                            {/* AI NEXIO Automated Message */}
                                            <motion.div 
                                                style={{ scale: useTransform(smoothProgress, [0.55, 0.6], [0.8, 1]), opacity: useTransform(smoothProgress, [0.55, 0.6], [0, 1]) }}
                                                className="bg-primary p-4 rounded-2xl rounded-tr-none ml-8 text-left shadow-[0_10px_40px_rgba(59,130,246,0.3)]"
                                            >
                                                <p className="text-[11px] font-black text-white leading-relaxed">NEXIO AI: Hi Dynamic Retail! Yes, we specialize in high-capacity enterprise clusters. For 500+ agents, we offer bespoke scaling. Would you like our Founder, Adel, to share the tier pricing on WhatsApp?</p>
                                                <div className="text-[8px] text-white/50 mt-2 font-mono uppercase tracking-widest text-right">AUTONOMOUS AGENT • JUST NOW</div>
                                            </motion.div>
                                        </div>

                                        <div className="h-10 bg-black/40 rounded-xl mt-4 flex items-center px-4 justify-between border border-white/5">
                                            <div className="text-[9px] text-zinc-600 font-black uppercase">NEXIO AI is typing...</div>
                                            <Send size={12} className="text-zinc-600" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* VIEW 03: ROI MATRIX & REVENUE (Step 3 Range: 0.7 - 0.95) */}
                                <motion.div 
                                    style={{ 
                                        opacity: useTransform(smoothProgress, [0.68, 0.72, 0.9, 1], [0, 1, 1, 0]),
                                        y: useTransform(smoothProgress, [0.68, 0.72, 0.9, 1], [20, 0, 0, -20])
                                    }}
                                    className="absolute inset-0 p-8 space-y-8 pointer-events-none"
                                >
                                    {/* Top Row: REAL METRICS Card from Dashboard.jsx */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="card-mockup p-8 border-l-4 border-l-emerald-500 bg-emerald-500/[0.03]">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">AI Generated Revenue</div>
                                                <DollarSign size={20} className="text-emerald-500" />
                                            </div>
                                            <div className="text-5xl font-black text-white tracking-tighter mb-4">$18,400</div>
                                            <div className="flex items-center gap-2 text-[10px] text-emerald-500/60 font-black uppercase tracking-widest">
                                                <CheckCircle size={14} /> Closed by AI automation
                                            </div>
                                        </div>
                                        <div className="card-mockup p-8 bg-white/[0.02]">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Potential Pipeline</div>
                                                <Zap size={20} className="text-primary" />
                                            </div>
                                            <div className="text-5xl font-black text-white tracking-tighter mb-4">$642,000</div>
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                                                <ArrowUpRight size={14} /> Active High-Intent Value
                                            </div>
                                        </div>
                                    </div>

                                    {/* Revenue Chart: REAL DATA from revenueHistory */}
                                    <div className="card-mockup flex-1 p-8 min-h-[220px] flex flex-col justify-between">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="text-xs font-black text-white uppercase tracking-widest">Revenue Growth Analysis</div>
                                            <div className="flex gap-4">
                                                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                                                    <div key={day} className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{day}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-end h-[140px] gap-4">
                                            {[15, 35, 25, 45, 30, 55, 100].map((h, i) => {
                                                const step3Progress = useTransform(smoothProgress, [0.75, 0.9], [0, 1]);
                                                return (
                                                    <motion.div 
                                                        key={i}
                                                        style={{ 
                                                            height: `${h}%`, 
                                                            scaleY: step3Progress,
                                                            opacity: useTransform(smoothProgress, [0.7 + (i * 0.02), 0.8 + (i * 0.02)], [0.2, 1])
                                                        }}
                                                        className="flex-1 bg-gradient-to-t from-emerald-500/80 via-emerald-500/30 to-transparent rounded-t-2xl origin-bottom shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>

                            </div>

                        </div>

                        {/* Outer Glow */}
                        <div className="absolute -inset-12 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-30 pointer-events-none" />
                    </motion.div>

                </div>

                {/* 🧵 PROGRESS INDICATOR */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-8 z-30">
                    <div className="w-[240px] md:w-[400px] h-1 bg-white/10 rounded-full overflow-hidden relative shadow-inner">
                        <motion.div 
                            style={{ scaleX: smoothProgress }} 
                            className="absolute inset-0 bg-primary origin-left rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]" 
                        />
                    </div>
                    <div className="w-16 text-right">
                         <motion.span className="text-[14px] font-black tracking-widest text-primary font-mono">
                            {roundedProgress}
                        </motion.span>
                        <span className="text-[14px] font-black tracking-widest text-primary font-mono">%</span>
                    </div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .card-mockup {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 2rem;
                    transition: all 0.5s cubic-bezier(0.28, 0.11, 0.32, 1);
                }
            `}} />

        </section>
    );
};

export default ShowcaseSection;
