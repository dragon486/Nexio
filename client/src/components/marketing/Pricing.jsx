import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import GlassCard from '../ui/GlassCard';

const plans = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for testing the waters.",
        features: ["1 AI Agent", "100 Leads / month", "Basic Analytics", "Email Support"],
        cta: "Start Free",
        popular: false
    },
    {
        name: "Growth",
        price: "$49",
        description: "For scaling startups.",
        features: ["3 AI Agents", "1,000 Leads / month", "Advanced Analytics", "WhatsApp Integration", "Priority Support"],
        cta: "Get Started",
        popular: true
    },
    {
        name: "Scale",
        price: "$149",
        description: "For high-volume sales teams.",
        features: ["Unlimited Agents", "Unlimited Leads", "Custom Integrations", "Dedicated Account Manager", "SLA Support"],
        cta: "Contact Sales",
        popular: false
    }
];

const Pricing = () => {
    return (
        <section id="pricing" className="py-32 md:py-48 px-6 relative overflow-hidden">
            {/* Dynamic Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-24"
                >
                    <h2 className="text-3xl md:text-6xl font-black text-foreground mb-6 tracking-tighter">
                        Simple, transparent pricing.
                    </h2>
                    <p className="text-[18px] md:text-[21px] text-muted-foreground max-w-2xl mx-auto font-medium">
                        Choose the plan that's right for your business. No hidden fees.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-stretch pt-12">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="flex"
                        >
                            <motion.div 
                                className="w-full h-full relative"
                                whileHover={{ y: -15, scale: 1.02 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[10px] font-black px-5 py-2 rounded-full tracking-widest shadow-2xl border border-white/10 z-50 whitespace-nowrap">
                                        MOST POPULAR
                                    </div>
                                )}
                                <GlassCard
                                    className={`flex flex-col p-10 relative w-full h-full transition-all duration-500 group ${plan.popular ? 'ring-2 ring-primary shadow-[0_40px_80px_-15px_rgba(59,130,246,0.2)] z-10' : 'border border-border/5'}`}
                                >
                                    {/* Glass Shine Reflection - Clip to inner */}
                                    <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        
                                        {/* Reveal Underglow for Popular Card */}
                                        {plan.popular && (
                                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                                        )}
                                    </div>
                                    
                                    <div className="mb-10 relative z-10">
                                        <h3 className="text-sm font-bold text-primary tracking-[0.3em] uppercase mb-6 group-hover:scale-105 transition-transform origin-left">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-6xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">{plan.price}</span>
                                            <span className="text-muted-foreground/60 font-bold text-sm uppercase tracking-wider">/month</span>
                                        </div>
                                        <p className="text-[15px] text-muted-foreground mt-6 font-medium leading-relaxed">{plan.description}</p>
                                    </div>

                                    <ul className="space-y-5 mb-12 flex-grow relative z-10">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-4 text-[14px] text-foreground font-semibold group-hover:translate-x-1 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-background transition-all duration-300">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                                <span className="opacity-80 group-hover:opacity-100 transition-opacity">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="relative z-10">
                                        <Button
                                            variant={plan.popular ? 'primary' : 'secondary'}
                                            className="w-full justify-center btn-large shadow-xl hover:shadow-primary/30"
                                        >
                                            {plan.cta}
                                        </Button>
                                    </div>

                                    {/* Reveal Underglow for Popular Card */}
                                    {plan.popular && (
                                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                                    )}
                                </GlassCard>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
