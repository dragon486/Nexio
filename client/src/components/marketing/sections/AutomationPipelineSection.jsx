import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, Check, Zap } from 'lucide-react';

const WHATSAPP_MESSAGES = [
    { from: 'lead', text: 'Hi, I saw your pricing page. Is the Enterprise plan right for a 600-lead/month operation?', delay: 0 },
    { from: 'nexio', text: "Hi James! I'm NEXIO, TechFlow's AI assistant. Great question — 600 leads/month puts you firmly in our Enterprise tier. Quick question: are you currently handling follow-ups manually?", delay: 1.4 },
    { from: 'lead', text: "Yes, all manual. We're missing a ton of leads because of response time.", delay: 2.8 },
    { from: 'nexio', text: "That's exactly what we fix. I've scored your profile at 94/100 intent and I'm booking a 20-min call with our team. Does Thursday at 3pm work for you?", delay: 4.0 },
    { from: 'lead', text: '✅ Thursday 3pm works perfectly!', delay: 5.2 },
];

const PIPELINE_STEPS = [
    { label: 'Lead Captured from Website Chat', time: '0s' },
    { label: 'AI Qualification Complete', time: '8s' },
    { label: 'Intent Scored: 94 / 100', time: '14s' },
    { label: 'Meeting Booked in Calendar', time: '4m 32s' },
    { label: 'CRM Record Created & Tagged', time: '4m 33s' },
];

const MessageBubble = ({ message, isInView }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!isInView) return;
        const t = setTimeout(() => setVisible(true), message.delay * 1000 + 500);
        return () => clearTimeout(t);
    }, [isInView, message.delay]);

    const isNexio = message.from === 'nexio';

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`flex ${isNexio ? 'justify-start' : 'justify-end'}`}
        >
            <div
                className="max-w-[78%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed font-medium"
                style={isNexio
                    ? { background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderTopLeftRadius: '6px' }
                    : { background: 'var(--accent-blue)', color: '#ffffff', borderTopRightRadius: '6px' }
                }
            >
                {message.text}
            </div>
        </motion.div>
    );
};

const PipelineStep = ({ step, index, isInView }) => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (!isInView) return;
        const t = setTimeout(() => setShow(true), index * 950 + 900);
        return () => clearTimeout(t);
    }, [isInView, index]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={show ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.35, delay: 0.1, type: 'spring' }}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}
            >
                <Check size={16} className="text-emerald-500" />
            </motion.div>
            <div className="flex-1">
                <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{step.label}</div>
            </div>
            <div className="text-xs font-bold font-mono" style={{ color: 'var(--text-tertiary)' }}>{step.time}</div>
        </motion.div>
    );
};

const AutomationPipelineSection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    return (
        <section
            ref={sectionRef}
            className="py-32 md:py-48 px-6 relative overflow-hidden"
            aria-labelledby="automation-heading"
            style={{ background: 'var(--bg-primary)' }}
        >
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'rgba(59,130,246,0.04)', filter: 'blur(140px)' }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-20"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8"
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}
                    >
                        <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"
                        />
                        Live Automation Pipeline
                    </div>

                    <h2
                        id="automation-heading"
                        className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Every follow-up, automated.
                        <br />
                        <span className="gradient-text italic">Zero manual effort.</span>
                    </h2>

                    <p className="text-xl max-w-2xl mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Watch NEXIO engage, qualify, and book a real lead in real-time — while your team is asleep.
                    </p>
                </motion.div>

                {/* Split-screen */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* LEFT: WhatsApp Chat — mirrors InteractiveHeroDemo lead chat style */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div
                            className="rounded-[2rem] overflow-hidden shadow-2xl"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                        >
                            {/* WhatsApp green header */}
                            <div className="px-5 py-4 flex items-center gap-3" style={{ background: '#075E54' }}>
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ background: 'rgba(255,255,255,0.15)' }}
                                >
                                    <MessageSquare size={18} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">NEXIO AI · TechFlow</div>
                                    <div className="text-white/60 text-xs">Online · Responding instantly</div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div
                                className="p-5 space-y-3 min-h-[280px] max-h-[360px] overflow-hidden"
                                style={{ background: 'var(--bg-primary)' }}
                            >
                                {WHATSAPP_MESSAGES.map((msg, i) => (
                                    <MessageBubble key={i} message={msg} isInView={isInView} />
                                ))}
                            </div>

                            {/* Input bar */}
                            <div
                                className="px-4 py-3 flex items-center gap-3"
                                style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
                            >
                                <div
                                    className="flex-1 rounded-full px-4 py-2 text-[12px]"
                                    style={{ background: 'var(--bg-primary)', color: 'var(--text-tertiary)' }}
                                >
                                    NEXIO AI is typing...
                                </div>
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center"
                                    style={{ background: 'var(--accent-blue)' }}
                                >
                                    <Zap size={14} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Pipeline Status — mirrors DesktopDashboard Recent Leads table */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-5"
                    >
                        <div className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
                            NEXIO Dashboard — Real-time Pipeline
                        </div>

                        <div className="space-y-3">
                            {PIPELINE_STEPS.map((step, i) => (
                                <PipelineStep key={i} step={step} index={i} isInView={isInView} />
                            ))}
                        </div>

                        {/* Result card — mirrors Dashboard stat-card style */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 5.8 }}
                            className="mt-2 p-6 rounded-2xl"
                            style={{
                                background: 'rgba(16,185,129,0.05)',
                                border: '1px solid rgba(16,185,129,0.2)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-emerald-500 font-black text-sm tracking-wide uppercase">Lead Converted</span>
                                <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>4m 33s total</span>
                            </div>
                            <div className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>James Dalton</div>
                            <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
                                TechFlow Inc. · Enterprise · $14,400 ARR potential
                            </div>
                            <div className="flex items-center gap-2 mt-4 flex-wrap">
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-bold text-emerald-500"
                                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                                >
                                    Score: 94/100
                                </span>
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-bold"
                                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent-blue)' }}
                                >
                                    Meeting Booked
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AutomationPipelineSection;
