import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import GlassCard from '../ui/GlassCard';

const KPICard = ({ title, value, subtext, description, icon: Icon, trend, trendValue, color, delay = 0 }) => {
    return (
        <GlassCard
            className="flex flex-col justify-between h-32 relative overflow-visible group hover:shadow-glow transition-all duration-500 border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
        >
            {/* Tooltip Description */}
            {description && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 bg-black/90 border border-white/10 p-2 rounded-lg text-[10px] text-zinc-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 text-center shadow-xl backdrop-blur-md">
                    {description}
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45" />
                </div>
            )}
            {/* Background Glow */}
            <div className={cn(
                "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[50px] opacity-20 transition-opacity duration-500 group-hover:opacity-40",
                color === 'purple' && "bg-brand-purple",
                color === 'blue' && "bg-brand-blue",
                color === 'pink' && "bg-brand-pink",
                color === 'green' && "bg-emerald-500",
                !color && "bg-white"
            )} />

            <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                    <span className="text-muted text-[11px] font-bold uppercase tracking-wider mb-1">{title}</span>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: delay * 0.1 + 0.2 }}
                        className="text-3xl font-black text-white tracking-tight"
                    >
                        {value}
                    </motion.div>
                </div>
                <div className={cn(
                    "p-2.5 rounded-xl bg-white/5 border border-white/5 shadow-inner-white text-white/80 group-hover:scale-110 transition-transform duration-300",
                    color === 'purple' && "text-brand-purple shadow-glow-purple/20",
                    color === 'blue' && "text-brand-blue shadow-glow-blue/20",
                    color === 'pink' && "text-brand-pink",
                    color === 'green' && "text-emerald-400"
                )}>
                    <Icon size={18} />
                </div>
            </div>

            <div className="flex items-center gap-2 mt-auto z-10">
                {trend && (
                    <div className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1",
                        trend === 'up' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    )}>
                        {trend === 'up' ? '▲' : '▼'} {trendValue}
                    </div>
                )}
                {subtext && <span className="text-[10px] text-muted font-medium">{subtext}</span>}
            </div>
        </GlassCard>
    );
};

export default KPICard;
