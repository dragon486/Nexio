import React, { useState, useRef } from 'react';
import { cn } from '../../lib/utils';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const GlassCard = ({ children, className, ...props }) => {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth movement for the spotlight
    const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "glass-card rounded-2xl p-6 relative overflow-hidden group/card",
                className
            )}
            {...props}
        >
            {/* Spotlight Glow Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-0"
                style={{
                    background: `radial-gradient(400px circle at ${springX}px ${springY}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
                }}
            />
            
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default GlassCard;
