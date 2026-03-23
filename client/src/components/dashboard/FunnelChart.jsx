import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';


const FunnelChart = ({ data, isDemo }) => {
    // Transform data for the chart if needed, or expect pre-formatted
    // Expecting: [{ name: 'New', value: 100 }, { name: 'Contacted', value: 80 }...]

    return (
        <div className="bg-surface border border-transparent rounded-2xl h-full flex flex-col p-8 relative overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all">
            <div className="flex justify-between items-start mb-10 z-10">
                <div>
                    <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">Conversion Funnel</h3>
                    <p className="text-[11px] text-text-tertiary mt-2 font-bold opacity-60">Lead progression through stages</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-[0.1em] border transition-all ${isDemo ? 'bg-accent/10 text-accent border-transparent' : 'bg-surface-soft/50 text-text-tertiary border-transparent'}`}>
                    {isDemo ? 'DEMO INTEL' : 'ACTUALS'}
                </div>
            </div>

            <div className="flex-1 space-y-6">
                {data?.map((stage, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                        <div className="w-24 text-[11px] font-bold text-text-secondary uppercase tracking-tight truncate">{stage.name}</div>
                        <div className="flex-1 h-10 bg-surface-soft/50 rounded-xl overflow-hidden relative">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${stage.percentage}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                className="h-full bg-gradient-to-r from-accent to-purple-500 flex items-center px-4"
                            >
                                <span className="text-[10px] font-black text-white">{stage.percentage}%</span>
                            </motion.div>
                        </div>
                        <div className="w-12 text-right text-lg font-black text-text-primary tracking-tighter">
                            {stage.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Flair */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/5 blur-[80px] rounded-full" />
        </div>
    );
};

export default FunnelChart;
