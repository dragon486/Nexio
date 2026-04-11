import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { TrendingUp, ArrowUpRight, Zap } from 'lucide-react';

const data = [
    { name: 'Mon', leads: 400, revenue: 2400 },
    { name: 'Tue', leads: 300, revenue: 1398 },
    { name: 'Wed', leads: 900, revenue: 9800 },
    { name: 'Thu', leads: 600, revenue: 3908 },
    { name: 'Fri', leads: 1100, revenue: 12800 },
    { name: 'Sat', leads: 700, revenue: 4800 },
    { name: 'Sun', leads: 1300, revenue: 15900 },
];

const AnalyticsPreview = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section className="py-32 md:py-48 px-6 relative overflow-hidden">
            {/* Dynamic Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                {/* Text Side */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-white/10 border border-primary/20 dark:border-white/20 text-xs font-bold tracking-widest text-primary dark:text-white mb-8 uppercase">
                        <TrendingUp size={14} />
                        <span>Exponential Growth Architecture</span>
                    </div>
                    <h2 className="text-3xl md:text-6xl font-black text-foreground mb-8 tracking-tighter leading-tight">
                        Architect your <br />
                        <span className="gradient-text italic">Revenue Pipeline.</span>
                    </h2>
                    <p className="text-[21px] text-muted-foreground mb-12 leading-relaxed font-medium">
                        NEXIO provides an end-to-end architectural framework for your lead lifecycle.
                        Monitor every qualification event and conversion milestone in real-time.
                    </p>

                    <div className="grid grid-cols-2 gap-8">
                        {[
                            { label: "Autonomy Level", value: "24/7", sub: "Fully Autonomous" },
                            { label: "Response Latency", value: "< 1m", sub: "Real-time Sync" }
                        ].map((stat, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-3xl bg-surface/50 dark:bg-[#1a1a1a]/50 border border-border/10 dark:border-white/10 backdrop-blur-md shadow-xl transition-all hover:border-primary/20 group"
                            >
                                <div className="text-4xl font-black text-foreground mb-2 tracking-tighter group-hover:text-primary dark:group-hover:text-white transition-colors">{stat.value}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-1">{stat.label}</div>
                                <div className="text-[10px] text-primary/40 dark:text-white/40 font-bold uppercase tracking-wider">{stat.sub}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Chart Side - 3D Tilt Effect */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative perspective-2000"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ rotateX, rotateY }}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-purple-500/30 blur-[130px] rounded-full pointer-events-none opacity-40 animate-pulse" />

                    <GlassCard className="p-8 md:p-12 relative z-10 border-border/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        
                        <div className="flex justify-between items-center mb-10 relative z-20">
                            <div>
                                <div className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Weekly Pipeline Value</div>
                                <div className="text-4xl font-black text-foreground mt-2 tracking-tighter">$15,900.00</div>
                            </div>
                            <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className="flex items-center gap-1 text-green-400 bg-green-500/10 px-3 py-1.5 rounded-xl text-sm font-bold border border-green-500/20"
                            >
                                <ArrowUpRight size={18} /> +24%
                            </motion.div>
                        </div>

                        <div className="h-[350px] w-full relative z-20">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="currentColor" tick={{ fill: 'var(--color-text-light)', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--color-bg-white)', borderColor: 'var(--color-border)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                                        itemStyle={{ color: 'var(--color-text)', fontWeight: 700 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3b82f6"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    {/* Floating Badge - Awesome Interaction */}
                    <motion.div
                        animate={{ 
                            y: [0, -15, 0],
                            rotate: [-1, 1, -1]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-10 -right-10 p-6 bg-surface dark:bg-[#1a1a1a] border border-border/50 dark:border-white/10 rounded-2xl shadow-3xl flex items-center gap-4 z-30"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white shadow-inner">
                            <Zap size={24} fill="currentColor" className="opacity-80" />
                        </div>
                        <div>
                            <div className="font-extrabold text-foreground tracking-tight">AI Just Closed</div>
                            <div className="text-[11px] text-muted-foreground font-bold tracking-wide uppercase opacity-60">TechCorp Inc • $5k Val</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default AnalyticsPreview;
