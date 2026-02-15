import React from 'react';
import { Check } from 'lucide-react';
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
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Simple, transparent pricing.
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that's right for your business. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan, index) => (
                        <GlassCard
                            key={index}
                            className={`p-8 relative ${plan.popular ? 'border-primary/50 bg-primary/5 shadow-2xl shadow-primary/10 scale-105 z-10' : 'border-white/10'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full border border-primary-foreground/20">
                                    MOST POPULAR
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-xl font-medium text-gray-300 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-500">/month</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-400'}`}>
                                            <Check size={12} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.popular ? 'primary' : 'outline'}
                                className="w-full justify-center"
                            >
                                {plan.cta}
                            </Button>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
