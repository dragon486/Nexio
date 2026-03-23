import React from 'react';
import { cn } from '../../lib/utils';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    // Professional Edition mapping to index.css classes
    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        ghost: "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground",
        outline: "btn-secondary", // Mapping outline to btn-secondary for professional consistency
    };

    const variantClass = variant ? variants[variant] : "";

    return (
        <button
            className={cn(
                "active:scale-95 transition-all duration-200", 
                variantClass,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
