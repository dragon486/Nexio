import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Zap, ChevronRight } from 'lucide-react';

const useCountUp = (target, duration = 2000, shouldStart = false) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!shouldStart) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [shouldStart, target, duration]);
    return count;
};

const useTypingEffect = (text, speed = 25, shouldStart = false) => {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
        if (!shouldStart) return;
        setDisplayed('');
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) clearInterval(interval);
        }, speed);
        return () => clearInterval(interval);
    }, [shouldStart, text, speed]);
    return displayed;
};

const AI_TEXT = `> Identifying lead profile...
  Industry: SaaS — Company: TechFlow Inc.
  Lead source: Website chat
  Time-on-site: 4m 32s ↑ High intent
  Budget signal: "enterprise plan" detected
  Decision role: CEO — confirmed
  
> Scoring... complete.
> Routing to booking engine.`;

const AIIntelligenceSection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

    const score = useCountUp(94, 2200, isInView);
    const aiText = useTypingEffect(AI_TEXT, 20, isInView);

    return (
        <section
            ref={sectionRef}
            className="py-32 md:py-48 px-6 relative overflow-hidden"
            aria-labelledby="ai-intelligence-heading"
            style={{ background: 'var(--bg-primary)' }}
        >
            <div
                className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full -translate-y-1/2 pointer-events-none"
                style={{ background: 'rgba(59,130,246,0.05)', filter: 'blur(140px)' }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* LEFT: Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8"
                            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent-blue)' }}
                        >
                            <Brain size={12} />
                            AI Intelligence Engine
                        </div>

                        <h2
                            id="ai-intelligence-heading"
                            className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            NEXIO thinks.
                            <br />
                            <span className="gradient-text italic">In real-time.</span>
                        </h2>

                        <p className="text-xl mb-12 leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                            The moment a lead appears, NEXIO's AI engine analyzes their behavior, scores their intent from 0–100, and routes them to the right action — before your team even sees the notification.
                        </p>

                        <div className="space-y-4">
                            {[
                                'Analyzes time-on-site, pages visited, and chat messages',
                                'Scores purchase intent on a 0–100 scale in under 15 seconds',
                                'Automatically routes high-intent leads to calendar booking',
                            ].map((point, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 * i }}
                                    className="flex items-start gap-3"
                                >
                                    <ChevronRight size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-blue)' }} />
                                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{point}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT: Live AI Dashboard Card — matches real dashboard style */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        {/* Card — mirrors section-card from Dashboard */}
                        <div
                            className="rounded-[2rem] overflow-hidden shadow-2xl"
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--card-shadow)',
                            }}
                        >
                            {/* Top bar — mirrors chrome from InteractiveHeroDemo */}
                            <div
                                className="px-6 py-4 flex items-center justify-between"
                                style={{ borderBottom: '1px solid var(--border)' }}
                            >
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                                </div>
                                <div className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
                                    NEXIO · AI Analysis Engine
                                </div>
                                <motion.div
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="flex items-center gap-1.5 text-emerald-500"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-bold">LIVE</span>
                                </motion.div>
                            </div>

                            {/* Terminal output */}
                            <div className="p-6 font-mono text-[12px] leading-relaxed min-h-[200px]">
                                <span className="whitespace-pre-wrap" style={{ color: 'var(--text-tertiary)' }}>
                                    {aiText}
                                </span>
                                {isInView && (
                                    <motion.span
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className="inline-block w-2 h-4 ml-0.5 align-middle"
                                        style={{ background: 'var(--accent-blue)' }}
                                    />
                                )}
                            </div>

                            {/* Score bar — mirrors stat-card from Dashboard */}
                            <div
                                className="px-6 pb-8 pt-6"
                                style={{ borderTop: '1px solid var(--border)' }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span
                                        className="text-[11px] font-bold tracking-widest uppercase"
                                        style={{ color: 'var(--text-tertiary)' }}
                                    >
                                        Authority Score
                                    </span>
                                    <span className="text-3xl font-black tracking-tighter" style={{ color: 'var(--accent-blue)' }}>
                                        {score}<span className="text-lg" style={{ color: 'var(--text-tertiary)' }}>/100</span>
                                    </span>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.1)' }}>
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}
                                        initial={{ width: '0%' }}
                                        animate={isInView ? { width: `${score}%` } : { width: '0%' }}
                                        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>Low Intent</span>
                                    <span className="text-[10px] font-bold uppercase text-emerald-500">🔥 Hot Lead</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating badge — mirrors Dashboard floating badge style */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -bottom-5 -left-6 px-5 py-3 rounded-2xl flex items-center gap-2 text-[11px] font-black tracking-widest uppercase text-white shadow-xl"
                            style={{ background: '#10b981', boxShadow: '0 10px 30px rgba(16,185,129,0.25)' }}
                        >
                            <Zap size={14} fill="currentColor" />
                            Booking Sent Automatically
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AIIntelligenceSection;
