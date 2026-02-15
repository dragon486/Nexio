import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl",
                "hover:border-white/20 transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
