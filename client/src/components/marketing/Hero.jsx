import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import DashboardPreview from './DashboardPreview';
import InteractiveHeroDemo from './InteractiveHeroDemo';
import ShinyText from '../ui/ShinyText';

const BlueprintFlow = () => {
    // Randomized circuit paths based on the brand logo path
    const paths = [
        { top: '10%', left: '5%', scale: 1.2, rotate: 15, delay: 0 },
        { top: '25%', left: '75%', scale: 0.8, rotate: -10, delay: 2 },
        { top: '65%', left: '15%', scale: 1.5, rotate: 5, delay: 4 },
        { top: '80%', left: '60%', scale: 1.0, rotate: 180, delay: 1 },
        { top: '45%', left: '85%', scale: 0.7, rotate: 45, delay: 3 },
        { top: '15%', left: '40%', scale: 1.1, rotate: -30, delay: 5 }
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40 select-none">
            {paths.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{ top: p.top, left: p.left }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                        opacity: [0, 0.15, 0],
                        x: [0, 30, 0],
                        y: [0, 10, 0]
                    }}
                    transition={{ 
                        duration: 12, 
                        delay: p.delay, 
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <svg width="200" height="100" viewBox="0 0 100 100" className="text-primary/20 dark:text-blue-400/20" style={{ transform: `scale(${p.scale}) rotate(${p.rotate}deg)` }}>
                        <motion.path 
                            d="M 20 50 L 38 50 L 38 42 L 50 42 L 50 58 L 62 58 L 62 50 L 80 50" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: [0, 1, 0] }}
                            transition={{ duration: 6, repeat: Infinity, delay: p.delay }}
                        />
                        {[
                            { cx: 20, cy: 50 }, { cx: 38, cy: 50 }, { cx: 50, cy: 42 },
                            { cx: 50, cy: 58 }, { cx: 62, cy: 50 }, { cx: 80, cy: 50 }
                        ].map((node, ni) => (
                            <motion.circle 
                                key={ni}
                                cx={node.cx} cy={node.cy} r="2" 
                                fill="currentColor"
                                animate={{ 
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ 
                                    duration: 3, 
                                    delay: ni * 0.2 + p.delay,
                                    repeat: Infinity 
                                }}
                            />
                        ))}
                    </svg>
                </motion.div>
            ))}
        </div>
    );
};

const Hero = () => {
    return (
        <section className="hero overflow-hidden bg-bg-primary relative">
            {/* Tech Grid Overlay */}
            <div className="absolute inset-0 bg-grid-tech opacity-[0.03] dark:opacity-[0.07] pointer-events-none" />

            {/* NEXIO Blueprint Flow - Brand Aligned Circuit Background */}
            <BlueprintFlow />

            {/* Ambient Background Gradients - Enhanced Depth */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-accent-blue/5 blur-[180px] rounded-full pointer-events-none opacity-40 dark:opacity-20" />
            <div className="absolute -bottom-40 -right-40 w-[800px] h-[800px] bg-purple-500/5 blur-[180px] rounded-full pointer-events-none opacity-20 dark:opacity-10" />

            <div className="max-w-7xl mx-auto text-center relative z-10 pt-48">

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-[88px] font-bold tracking-[-0.04em] leading-[0.92] mb-10 text-balance"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    Scale your revenue with the world's first<br />
                    <ShinyText speed={5} className="gradient-text italic text-4xl md:text-7xl lg:text-[88px]">
                        Autonomous AI Sales Workforce.
                    </ShinyText>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="hero-subtitle mb-12 text-balance leading-relaxed px-6 md:px-0"
                >
                    NEXIO deploys autonomous AI agents that qualify and close leads across your entire sales funnel with zero human latency.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="flex justify-center gap-8 mb-16"
                >
                    <div className="flex items-center gap-2 text-[10px] tracking-[4px] font-mono text-muted-foreground/60 uppercase">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]"></span>
                        <span className="tracking-tight opacity-90 font-semibold">All Systems Operational</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="hero-cta flex flex-wrap justify-center gap-4"
                >
                    <Link to="/register">
                        <Button className="btn-primary px-10 h-14 text-base">
                            Start Free Trial
                        </Button>
                    </Link>
                    <Link to="/demo">
                        <Button className="btn-secondary px-10 h-14 text-base flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-text-primary/10 flex items-center justify-center">
                                <Play size={12} fill="currentColor" />
                            </div>
                            View Live Demo
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex justify-center items-center gap-8 text-[11px] font-medium text-muted-foreground/60 mb-32"
                >
                    <div className="flex items-center gap-2 text-nowrap">No credit card required</div>
                    <div className="w-1 h-1 rounded-full bg-border flex-none"></div>
                    <div className="flex items-center gap-2 text-nowrap">14-day free trial</div>
                    <div className="w-1 h-1 rounded-full bg-border flex-none"></div>
                    <div className="flex items-center gap-2 text-nowrap">Cancel anytime</div>
                </motion.div>

                {/* 🖥️ HIGH-FIDELITY INTERACTIVE DEMO (V8 AUTHENTIC SYNC) */}
                <motion.div
                    initial={{ opacity: 0, y: 40, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.5, type: "spring" }}
                    className="relative mx-auto max-w-6xl perspective-2000 mt-12 md:mt-64 bg-black/[0.2] border border-white/5 rounded-[3rem] p-4 group"
                >
                    <InteractiveHeroDemo />
                    
                    {/* Atmospheric Glow Underlying the Mockup */}
                    <div className="absolute -inset-10 bg-primary/5 blur-[100px] pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
