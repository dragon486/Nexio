import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroBranding = ({ onComplete }) => {
    // We use internal state to handle the exit animation before calling parent completion
    const [shouldExit, setShouldExit] = useState(false);

    useEffect(() => {
        // Absolute Scroll Lock
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        // Animation Timeline: 
        // 0-2s: Drawing
        // 2-2.8s: Stasis/Reading
        // 2.8s: Start Exit
        const timer = setTimeout(() => {
            setShouldExit(true);
        }, 3000);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = '';
        };
    }, []);

    const handleExitComplete = () => {
        document.body.style.overflow = '';
        if (onComplete) onComplete();
    };

    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {!shouldExit && (
                <motion.section 
                    key="intro-stage"
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0, 
                        scale: 1.1,
                        filter: "blur(10px)",
                        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } 
                    }}
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-background dark:bg-[#0a0a0a] overflow-hidden"
                >
                    {/* High-Precision Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative flex flex-col items-center text-center px-4"
                    >
                        {/* Auto-Play Blueprint Logo */}
                        <div className="mb-12 relative">
                            <svg className="w-24 h-24 md:w-32 md:h-32 text-foreground dark:text-white" viewBox="0 0 100 100">
                                <motion.rect 
                                    x="15" y="35" width="70" height="30" 
                                    fill="none" stroke="currentColor" strokeWidth="1.5" 
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.3 }}
                                    transition={{ duration: 1.2, ease: "easeInOut" }}
                                />
                                <motion.path 
                                    d="M 20 50 L 38 50 L 38 42 L 50 42 L 50 58 L 62 58 L 62 50 L 80 50" 
                                    stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
                                />
                                {[20, 38, 50, 50, 62, 80].map((cx, i) => (
                                    <motion.circle 
                                        key={i} cx={cx} cy={i === 2 ? 42 : i === 3 ? 58 : 50} r="3.5" 
                                        fill={i === 0 || i === 5 ? "currentColor" : "#3b82f6"}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.5 + (i * 0.1), duration: 0.3 }}
                                    />
                                ))}
                            </svg>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.4, 0.2] }}
                                transition={{ delay: 1.8, duration: 1 }}
                                className="absolute inset-0 bg-primary/20 dark:bg-white/10 blur-3xl rounded-full -z-10"
                            />
                        </div>

                        {/* Professional Branding Typography */}
                        <motion.h2 
                            initial={{ opacity: 0, letterSpacing: "0.2em", filter: "blur(5px)" }}
                            animate={{ opacity: 1, letterSpacing: "-0.05em", filter: "blur(0px)" }}
                            transition={{ duration: 1, delay: 0.4 }}
                            style={{ fontFamily: "'Work Sans', sans-serif" }}
                            className="text-[60px] md:text-[180px] font-black tracking-tighter text-foreground leading-none mb-6"
                        >
                            NEXIO
                        </motion.h2>

                        {/* Architectural Subtitles */}
                        <div className="flex items-center gap-4 md:gap-10 text-[10px] md:text-sm font-medium tracking-[0.6em] text-muted-foreground uppercase">
                            {["Precision", "Architecture", "Intelligence"].map((text, i) => (
                                <React.Fragment key={text}>
                                    <motion.span 
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 0.6, y: 0 }}
                                        transition={{ delay: 2 + (i * 0.2) }}
                                    >
                                        {text}
                                    </motion.span>
                                    {i < 2 && <div className="w-1.5 h-1.5 rounded-full bg-primary/20 dark:bg-white/20" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    );
};

export default IntroBranding;
