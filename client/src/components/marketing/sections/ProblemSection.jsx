import React from 'react';
import { motion } from 'framer-motion';
import { UserX, Clock, TrendingDown } from 'lucide-react';

const problems = [
    {
        icon: UserX,
        stat: '73%',
        title: 'Leads Go Cold Unanswered',
        description: 'High-intent visitors leave your site without a response and move to a competitor who replies in seconds — because speed wins.',
    },
    {
        icon: Clock,
        stat: '11 hrs',
        title: 'Average Response Time',
        description: 'The average sales team takes 11 hours to reply to a new lead. The optimal response window is under 5 minutes. Every hour costs deals.',
    },
    {
        icon: TrendingDown,
        stat: '$240k',
        title: 'Avg. Revenue Lost Per Year',
        description: "That's the estimated annual revenue loss for a mid-size sales team from slow follow-up and unqualified lead routing alone.",
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const ProblemSection = () => {
    return (
        <section
            className="py-32 md:py-40 px-6 relative overflow-hidden"
            aria-labelledby="problem-heading"
            style={{ background: 'var(--bg-primary)' }}
        >
            {/* Blue ambient — matches NEXIO brand */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'rgba(59,130,246,0.05)', filter: 'blur(140px)' }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-20"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8"
                        style={{
                            background: 'rgba(59,130,246,0.08)',
                            border: '1px solid rgba(59,130,246,0.2)',
                            color: 'var(--accent-blue)',
                        }}
                    >
                        <motion.span
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ background: 'var(--accent-blue)' }}
                        />
                        The Problem
                    </div>

                    <h2
                        id="problem-heading"
                        className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Every minute without AI,
                        <br />
                        <span className="gradient-text italic">you lose a qualified lead.</span>
                    </h2>

                    <p className="text-xl max-w-2xl mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Manual sales processes are silently draining your pipeline. Here's what's happening right now while your team is offline.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
                >
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="relative p-8 md:p-10 rounded-3xl group overflow-hidden"
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--card-shadow)',
                            }}
                        >
                            {/* Subtle animated pulse — NEXIO blue instead of red */}
                            <motion.div
                                className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full"
                                style={{ background: 'var(--accent-blue)' }}
                                animate={{ opacity: [0.8, 0.2, 0.8], scale: [1, 1.6, 1] }}
                                transition={{ duration: 3, repeat: Infinity, delay: index * 0.6 }}
                            />

                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
                                style={{
                                    background: 'rgba(59,130,246,0.08)',
                                    border: '1px solid rgba(59,130,246,0.15)',
                                }}
                            >
                                <problem.icon size={26} style={{ color: 'var(--accent-blue)' }} strokeWidth={1.5} />
                            </div>

                            {/* Stat number — uses blue accent */}
                            <div
                                className="text-5xl font-black tracking-tighter mb-3"
                                style={{ color: 'var(--accent-blue)' }}
                            >
                                {problem.stat}
                            </div>

                            <h3 className="text-xl font-bold mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                {problem.title}
                            </h3>

                            <p className="text-[15px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                                {problem.description}
                            </p>

                            {/* Hover glow */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"
                                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.06), transparent 70%)' }}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                        NEXIO eliminates every one of these problems. See how ↓
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default ProblemSection;
