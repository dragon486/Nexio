import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const useCountUp = (target, duration = 2000, shouldStart = false, decimals = 0) => {
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
        if (!shouldStart) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = eased * target;
            setCount(decimals > 0 ? parseFloat(val.toFixed(decimals)) : Math.floor(val));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [shouldStart, target, duration, decimals]);
    return count;
};

const revenueData = [
    { week: 'W1', revenue: 8200 },
    { week: 'W2', revenue: 12400 },
    { week: 'W3', revenue: 19800 },
    { week: 'W4', revenue: 28300 },
    { week: 'W5', revenue: 41200 },
    { week: 'W6', revenue: 58700 },
    { week: 'W7', revenue: 78400 },
    { week: 'W8', revenue: 124000 },
];

const ROISection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    // Counts: internally 32 → displays as 3.2x
    const leadsRaw = useCountUp(32, 2000, isInView, 0);
    const fasterPct = useCountUp(67, 2000, isInView);
    const revK = useCountUp(124, 2200, isInView);

    const stats = [
        {
            icon: Users,
            value: `${(leadsRaw / 10).toFixed(1)}x`,
            label: 'More Leads Qualified',
            sub: 'vs. fully manual process',
            accent: 'rgba(59,130,246,0.1)',
            accentBorder: 'rgba(59,130,246,0.2)',
            iconColor: 'var(--accent-blue)',
        },
        {
            icon: Clock,
            value: `${fasterPct}%`,
            label: 'Faster Response Time',
            sub: 'Average response under 60 seconds',
            accent: 'rgba(139,92,246,0.1)',
            accentBorder: 'rgba(139,92,246,0.2)',
            iconColor: '#8b5cf6',
        },
        {
            icon: DollarSign,
            value: `$${revK}k`,
            label: 'Average Revenue Added',
            sub: 'In the first 90 days with NEXIO',
            accent: 'rgba(16,185,129,0.1)',
            accentBorder: 'rgba(16,185,129,0.2)',
            iconColor: '#10b981',
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="py-32 md:py-48 px-6 relative overflow-hidden"
            aria-labelledby="roi-heading"
            style={{ background: 'var(--bg-primary)' }}
        >
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
                style={{ background: 'rgba(59,130,246,0.04)', filter: 'blur(160px)' }}
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
                        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent-blue)' }}
                    >
                        <TrendingUp size={12} />
                        Revenue Impact
                    </div>
                    <h2
                        id="roi-heading"
                        className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        NEXIO turns conversations
                        <br />
                        <span className="gradient-text italic">into revenue.</span>
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Real results from sales teams that replaced manual follow-up with NEXIO's autonomous AI workforce.
                    </p>
                </motion.div>

                {/* Stat Cards — mirror Dashboard stat-card style exactly */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="stat-card group relative overflow-hidden"
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--card-shadow)',
                            }}
                        >
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                                style={{ background: stat.accent, border: `1px solid ${stat.accentBorder}` }}
                            >
                                <stat.icon size={22} strokeWidth={1.5} style={{ color: stat.iconColor }} />
                            </div>
                            <div className="text-5xl font-black tracking-tighter mb-2" style={{ color: stat.iconColor }}>
                                {stat.value}
                            </div>
                            <div className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                                {stat.label}
                            </div>
                            <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                {stat.sub}
                            </div>

                            {/* Hover spotlight — matches SpotlightCard behavior */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[inherit]"
                                style={{ background: `radial-gradient(300px circle at 50% 0%, ${stat.accent}, transparent 60%)` }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Revenue Chart — mirrors DesktopDashboard Analytics section-card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="section-card relative overflow-hidden"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.03) 0%, transparent 50%)' }}
                    />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                        <div>
                            <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
                                Pipeline Value Growth — First 8 Weeks with NEXIO
                            </div>
                            <div className="text-4xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                                $124,000
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-emerald-500 text-sm font-bold">
                                <TrendingUp size={14} />
                                +412% vs. pre-NEXIO baseline
                            </div>
                        </div>
                        <div
                            className="flex items-center gap-2 px-4 py-2 rounded-xl"
                            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                        >
                            <motion.span
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-emerald-500 inline-block"
                            />
                            <span className="text-xs font-bold text-emerald-500 tracking-wider uppercase">Growing right now</span>
                        </div>
                    </div>

                    <div className="h-[220px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="week"
                                    stroke="transparent"
                                    tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 700 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--bg-elevated, var(--bg-secondary))',
                                        borderColor: 'var(--border)',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                    }}
                                    formatter={(v) => [`$${(v / 1000).toFixed(1)}k`, 'Pipeline Value']}
                                    labelFormatter={(l) => `Week ${l.replace('W', '')}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fill="url(#roiGrad)"
                                    isAnimationActive={isInView}
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ROISection;
