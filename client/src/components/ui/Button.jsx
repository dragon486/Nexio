import React from 'react';
import { cn } from '../../lib/utils';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: "bg-white text-black hover:bg-zinc-200 shadow-glow font-black uppercase tracking-widest",
        secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
        ghost: "bg-transparent hover:bg-white/5 text-muted hover:text-white",
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
