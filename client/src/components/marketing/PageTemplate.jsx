import React from 'react';
import { motion } from 'framer-motion';

const PageTemplate = ({ title, subtitle, children }) => {
    return (
        <div className="pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{title}</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default PageTemplate;
