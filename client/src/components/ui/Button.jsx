import React from 'react';
import { cn } from '../../lib/utils';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg shadow-primary/20",
        secondary: "bg-surface border border-white/10 text-white hover:bg-white/5",
        ghost: "bg-transparent hover:bg-white/5 text-gray-300 hover:text-white",
    };

    return (
        <button
            className={cn(
                "px-4 py-2 rounded-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
