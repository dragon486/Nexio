import React from 'react';
import { motion } from 'framer-motion';

const PageTemplate = ({ title, subtitle, children }) => {
    return (
        <div className="relative pt-32 md:pt-44 pb-32 px-6 min-h-screen bg-bg-primary overflow-hidden">
            {/* Ambient background light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-primary/5 to-transparent blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-16 md:mb-24"
                >
                    <h1 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight text-text-primary">
                        {title}
                    </h1>
                    <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-medium opacity-80">
                        {subtitle}
                    </p>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default PageTemplate;
