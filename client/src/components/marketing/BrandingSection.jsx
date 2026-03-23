import React from 'react';
import { motion } from 'framer-motion';

const BrandingSection = () => {
    return (
        <section className="py-32 md:py-48 px-6 bg-background dark:bg-[#0a0a0a] relative overflow-hidden border-t border-border/5 dark:border-white/10">
            {/* Background Grid - consistent with Hero */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center justify-center text-center">
                {/* Logo Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12"
                >
                    <svg className="w-24 h-24 md:w-40 md:h-40 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.path 
                            d="M 20 50 L 38 50 L 38 42 L 50 42 L 50 58 L 62 58 L 62 50 L 80 50" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ 
                                duration: 2.5, 
                                ease: "easeInOut",
                                delay: 0.2
                            }}
                        />
                        {[
                            { cx: 20, cy: 50, color: "currentColor" },
                            { cx: 38, cy: 50, color: "#3b82f6" },
                            { cx: 50, cy: 42, color: "#3b82f6" },
                            { cx: 50, cy: 58, color: "#3b82f6" },
                            { cx: 62, cy: 50, color: "#3b82f6" },
                            { cx: 80, cy: 50, color: "currentColor" }
                        ].map((node, i) => (
                            <motion.circle 
                                key={i} 
                                cx={node.cx} 
                                cy={node.cy} 
                                r="3" 
                                fill={node.color}
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ 
                                    scale: [0, 1.2, 1],
                                    opacity: [0, 1, 1],
                                }}
                                viewport={{ once: true }}
                                transition={{ 
                                    duration: 0.8, 
                                    delay: 1 + (i * 0.15),
                                    scale: { repeat: Infinity, repeatDelay: 3, duration: 1, delay: i * 0.2 + 3 }
                                }}
                            />
                        ))}
                    </svg>
                </motion.div>

                {/* Big NEXIO Text - Cinematic Reveal */}
                <div className="overflow-hidden mb-6">
                    <motion.h2
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[100px] md:text-[220px] font-black tracking-tighter text-foreground leading-[0.8] mb-0 select-none"
                        style={{ 
                            fontFamily: "'Work Sans', sans-serif",
                            letterSpacing: "-0.06em"
                        }}
                    >
                        NEXIO
                    </motion.h2>
                </div>

                {/* Subtitle pillars - Staggered Reveal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="flex items-center gap-4 md:gap-10 text-[10px] md:text-base font-bold tracking-[0.6em] text-muted-foreground uppercase opacity-60"
                >
                    <motion.span whileHover={{ letterSpacing: "1em", color: "var(--color-primary)" }} transition={{ duration: 0.3 }}>Precision</motion.span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                    <motion.span whileHover={{ letterSpacing: "1em", color: "var(--color-primary)" }} transition={{ duration: 0.3 }}>Architecture</motion.span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                    <motion.span whileHover={{ letterSpacing: "1em", color: "var(--color-primary)" }} transition={{ duration: 0.3 }}>Intelligence</motion.span>
                </motion.div>
            </div>
        </section>
    );
};

export default BrandingSection;
