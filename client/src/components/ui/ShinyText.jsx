import React from 'react';
import { motion } from 'framer-motion';

/**
 * ShinyText Component
 * Inspired by ReactBits - Creates a moving light-ray effect over text.
 */
const ShinyText = ({ children, className = "", speed = 3 }) => {
    return (
        <span 
            className={`relative inline-block overflow-hidden ${className}`}
            style={{
                background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
            }}
        >
            <motion.span
                animate={{
                    backgroundPosition: ['200% 0', '-200% 0'],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'inherit',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
            />
            {children}
        </span>
    );
};

export default ShinyText;
