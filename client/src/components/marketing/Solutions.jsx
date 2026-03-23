import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShoppingBag, Cpu, ArrowUpRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const Solutions = () => {
    const solutions = [
        {
            title: "Real Estate Mastery",
            description: "Automate property inquiries and open-house follow-ups. NEXIO qualifies high-intent buyers and schedules viewings directly in your calendar.",
            icon: Building2,
            color: "rgba(59, 130, 246, 0.5)", // Blue
            lottie: "https://lottie.host/7e0c4f1c-3b3b-4b1a-9c1a-1a2b3c4d5e6f/example.json" // Placeholder or dynamic
        },
        {
            title: "SaaS Growth Engine",
            description: "Convert trial users into paid customers with personalized AI nurture sequences. Seamlessly bridge the gap between signup and activation.",
            icon: Cpu,
            color: "rgba(168, 85, 247, 0.5)", // Purple
        },
        {
            title: "E-commerce Recovery",
            description: "Rescue abandoned carts and answer product questions in real-time. Boost conversion rates by 30% with intelligent WhatsApp assistance.",
            icon: ShoppingBag,
            color: "rgba(16, 185, 129, 0.5)", // Emerald
        }
    ];

    return (
        <section id="solutions" className="py-32 md:py-48 px-6 bg-muted/[0.02] relative overflow-hidden">
            {/* Background Decorative element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-24"
                >
                    <h2 className="text-[32px] md:text-[56px] font-black tracking-tighter text-foreground mb-6">Vertical Blueprints.</h2>
                    <p className="text-muted-foreground text-[18px] md:text-[21px] max-w-2xl mx-auto font-medium">
                        NEXIO provides industry-specific AI architectures designed to solve unique sales challenges with mathematical precision.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {solutions.map((sol, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="flex"
                        >
                            <GlassCard 
                                className="group relative overflow-hidden flex flex-col p-1 transition-all duration-500 hover:border-primary/30"
                            >
                                <motion.div 
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="p-10 flex flex-col h-full bg-surface/50 dark:bg-[#1a1a1a]/50 rounded-2xl border border-border/5 dark:border-white/10"
                                >
                                    {/* Hover Underglow */}
                                    <div 
                                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-[80px] -z-10"
                                        style={{ backgroundColor: sol.color }}
                                    />
                                    
                                    <div className="flex justify-between items-start mb-10 text-muted-foreground group-hover:text-primary transition-colors">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500">
                                            <sol.icon size={32} />
                                        </div>
                                        <ArrowUpRight size={24} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4 text-foreground tracking-tight">{sol.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-[15px] font-medium mb-8 flex-grow">
                                        {sol.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary/40 uppercase group-hover:text-primary transition-colors">
                                        <span>Deploy Architecture</span>
                                        <motion.div 
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            →
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Solutions;
