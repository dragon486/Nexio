import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import DashboardPreview from './DashboardPreview';

const Hero = () => {
    // High-fidelity SVG animation replaces fragile Lottie fetch

    return (
        <section className="hero">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-40" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none opacity-20" />

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hero-lottie-container mb-6 relative"
                >
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-2xl">
                        <div className="w-24 h-24 bg-primary rounded-full" />
                    </div>
                    <svg className="hero-blueprint-icon w-24 h-24 mx-auto relative z-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <filter id="hero-glow">
                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Blueprint Frame */}
                        <motion.rect 
                            x="15" y="35" width="70" height="30" 
                            fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        />
                        
                        {/* Core Processing Unit */}
                        <motion.path 
                            d="M 30 50 L 45 50 M 55 50 L 70 50 M 50 35 L 50 45 M 50 55 L 50 65" 
                            fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />

                        {/* Animated Data Connections */}
                        <motion.path 
                            d="M 20 50 L 35 50 L 35 42 L 50 42 L 50 58 L 65 58 L 65 50 L 80 50" 
                            fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0.1 }}
                            animate={{ pathLength: 1, opacity: 0.8 }}
                            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                            filter="url(#hero-glow)"
                        />
                        
                        {/* Pulsing Nodes */}
                        {[
                            { cx: 20, cy: 50, color: "currentColor" },
                            { cx: 35, cy: 50, color: "#3b82f6" },
                            { cx: 50, cy: 42, color: "#3b82f6" },
                            { cx: 50, cy: 58, color: "#3b82f6" },
                            { cx: 65, cy: 50, color: "#3b82f6" },
                            { cx: 80, cy: 50, color: "currentColor" }
                        ].map((node, i) => (
                            <motion.circle 
                                key={i}
                                cx={node.cx} cy={node.cy} r="3" 
                                fill={node.color}
                                animate={{ 
                                    scale: [1, 1.4, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ 
                                    duration: 2, 
                                    delay: i * 0.2,
                                    repeat: Infinity 
                                }}
                            />
                        ))}
                    </svg>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hero-badge group cursor-default"
                >
                    <span className="hero-badge-dot" />
                    <span>Now with WhatsApp Integration</span>
                    <ArrowRight size={12} className="text-primary/60 group-hover:translate-x-0.5 transition-transform" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Scale your revenue with the world's first<br />
                    <span className="gradient-text">
                        Autonomous AI Sales Workforce.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="hero-subtitle mb-10"
                >
                    NEXIO deploys autonomous AI agents that qualify and close leads across your entire sales funnel with zero human latency.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="flex justify-center gap-8 mb-10"
                >
                    <div className="flex items-center gap-2 text-[10px] tracking-[4px] font-mono text-muted-foreground/60 uppercase">
                        <span className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                        Architectural Intelligence
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="hero-cta"
                >
                    <Link to="/register">
                        <Button className="btn-primary btn-large btn-with-arrow">
                            Start Free Trial
                        </Button>
                    </Link>
                    <Link to="/demo">
                        <Button variant="outline" className="btn-secondary btn-large group flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play size={14} fill="currentColor" />
                            </div>
                            View Live Demo
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex justify-center items-center gap-8 text-[11px] font-medium text-muted-foreground/60 mb-20"
                >
                    <div className="flex items-center gap-2">No credit card required</div>
                    <div className="w-1 h-1 rounded-full bg-border"></div>
                    <div className="flex items-center gap-2">14-day free trial</div>
                    <div className="w-1 h-1 rounded-full bg-border"></div>
                    <div className="flex items-center gap-2">Cancel anytime</div>
                </motion.div>

                {/* Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.5, type: "spring" }}
                    className="relative mx-auto max-w-5xl perspective-1000"
                >
                    <div className="relative rounded-xl border border-border/20 bg-muted/30 backdrop-blur-xl shadow-2xl overflow-hidden group">
                        {/* Browser Bar */}
                        <div className="h-10 border-b border-border/10 bg-muted/20 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                            </div>
                            <div className="bg-muted/40 px-3 py-1 rounded text-[10px] text-muted-foreground font-mono ml-4 flex-1 text-center">
                                app.nexio.ai/dashboard
                            </div>
                        </div>
                        {/* Use an image or a simplified dashboard component here */}
                        <div className="relative aspect-video bg-background dark:bg-[#0a0a0a] flex overflow-hidden">
                            {/* Mock Sidebar */}
                            <div className="w-16 md:w-20 border-r border-border/10 bg-muted/10 flex flex-col items-center py-4 gap-4">
                                <div className="w-8 h-8 rounded-lg bg-primary/20" />
                                <div className="w-6 h-6 rounded-md bg-muted mt-4" />
                                <div className="w-6 h-6 rounded-md bg-muted/50" />
                                <div className="w-6 h-6 rounded-md bg-muted/50" />
                            </div>

                            {/* Mock Content */}
                            <div className="flex-1 flex flex-col">
                                {/* Mock Header */}
                                <div className="h-12 border-b border-border/10 flex items-center justify-between px-4">
                                    <div className="w-32 h-4 rounded-full bg-muted" />
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-muted/50" />
                                        <div className="w-8 h-8 rounded-full bg-primary/20" />
                                    </div>
                                </div>

                                <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-hidden relative">
                                    {/* Mock KPI Row */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-24 rounded-xl bg-muted/20 border border-border/10 p-3 flex flex-col justify-between">
                                                <div className="w-6 h-6 rounded bg-muted" />
                                                <div className="space-y-1">
                                                    <div className="w-16 h-4 rounded bg-muted/50" />
                                                    <div className={`w-8 h-2 rounded ${i === 1 ? 'bg-primary/50' : 'bg-muted/30'}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mock Chart Area */}
                                    <div className="flex-1 rounded-xl bg-muted/5 border border-border/10 p-4 relative overflow-hidden flex flex-col">
                                        <div className="flex justify-between mb-8">
                                            <div className="space-y-2">
                                                <div className="w-24 h-5 rounded bg-muted/20" />
                                                <div className="w-16 h-3 rounded bg-muted/10" />
                                            </div>
                                            <div className="w-20 h-8 rounded-lg bg-primary/20" />
                                        </div>
                                        <div className="flex-1 flex items-end gap-2 opacity-50">
                                            {[40, 60, 45, 70, 50, 80, 65, 85, 90, 75, 60, 95].map((h, i) => (
                                                <div key={i} className="flex-1 bg-gradient-to-t from-primary/50 to-primary/0 rounded-t-sm" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Glow Effects */}
                                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
                                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                                </div>
                            </div>

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-50" />
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -left-10 top-1/3 p-4 bg-background/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-xl shadow-2xl max-w-xs text-left"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><CheckCircle size={16} /></div>
                            <div>
                                <div className="text-foreground text-sm font-bold">New Lead Qualified</div>
                                <div className="text-muted-foreground text-xs">Just now via WhatsApp</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -right-10 bottom-1/3 p-4 bg-background/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-xl shadow-2xl max-w-xs text-left"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500"><ArrowRight size={16} /></div>
                            <div>
                                <div className="text-foreground text-sm font-bold">Meeting Booked</div>
                                <div className="text-muted-foreground text-xs">+$2,500 Potential Value</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
