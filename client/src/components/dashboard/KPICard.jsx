import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';


const KPICard = ({ title, value, subtext, description, icon: Icon, emoji, trend, trendValue, trendLabel, color, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="flex h-full group"
        >
            <div
                className="bg-surface border border-transparent rounded-xl flex flex-col w-full relative overflow-hidden transition-all duration-300 p-6 hover:shadow-2xl hover:shadow-black/5"
            >
                {/* Enterprise Accent Bar */}
                <div className={cn(
                    "absolute top-0 left-0 right-0 h-[3px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left",
                    color === 'purple' ? "bg-purple-500" : 
                    color === 'blue' ? "bg-accent" : 
                    color === 'pink' ? "bg-pink-500" : 
                    color === 'green' ? "bg-success" : "bg-accent"
                )} />

                <div className="flex justify-between items-start mb-4">
                    <span className="text-text-tertiary text-[11px] font-bold uppercase tracking-wider">{title}</span>
                    <div className="w-10 h-10 rounded-lg bg-bg-primary/50 flex items-center justify-center text-xl shadow-sm border border-border/5">
                        {emoji || (Icon && <Icon size={20} strokeWidth={2.5} />)}
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="text-[32px] font-extrabold text-text-primary tracking-tight leading-none mb-2">
                        {value}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                        {trend && (
                            <div className={cn(
                                "text-[13px] font-semibold flex items-center gap-1",
                                trend === 'up' ? "text-success" : "text-danger"
                            )}>
                                {trend === 'up' ? '↑' : '↓'} {trendValue}
                            </div>
                        )}
                        {trendLabel && <span className="text-[13px] text-text-secondary font-medium">{trendLabel}</span>}
                        {subtext && <span className="text-[13px] text-text-secondary font-medium">{subtext}</span>}
                    </div>
                </div>

                {description && (
                    <div className="mt-4 pt-4 border-t border-border/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[11px] text-text-tertiary leading-relaxed font-medium">{description}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default KPICard;
