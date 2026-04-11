import React from 'react';
import PageTemplate from '../../components/marketing/PageTemplate';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

const PricingPage = () => {
    return (
        <PageTemplate 
            title="Premium Performance Architecture" 
            subtitle="Choose a tier designed for your scale. Every plan is built on 1:1 sales workforce parity."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                {[
                    { 
                        name: "Standard", 
                        price: "499", 
                        description: "Built for individual portfolios and small teams.",
                        features: ["1,000 lead credits/mo", "WhatsApp & Email Sync", "Basic RAG Analysis"]
                    },
                    { 
                        name: "Professional", 
                        price: "1,299", 
                        description: "The sweet spot for growing enterprise teams.",
                        features: ["5,000 lead credits/mo", "Multi-Channel Protocols", "Prioritized RAG Intent", "Custom Sales Persona"],
                        highlight: true
                    },
                    { 
                        name: "Enterprise", 
                        price: "Custom", 
                        description: "High-throughput sales engine for global giants.",
                        features: ["Unlimited Scaling", "SOC2 Dedicated Server", "Full API Webhooks", "Dedicated Account Lead"]
                    }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className={`group p-8 md:p-10 rounded-[32px] border ${item.highlight ? 'border-text-primary' : 'border-glass-border'} bg-secondary-bg hover:scale-105 active:scale-95 md:active:scale-100 transition-all duration-500 relative flex flex-col`}
                    >
                        {item.highlight && (
                            <div className="absolute top-0 right-0 py-1.5 px-6 bg-text-primary text-bg-primary rounded-bl-2xl rounded-tr-3xl text-sm font-bold uppercase tracking-wider">
                                Recommended
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-text-primary mb-2 opacity-50 uppercase tracking-widest">{item.name}</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl font-bold tracking-tight text-text-primary">
                                {typeof item.price === 'string' && item.price !== 'Custom' ? `$${item.price}` : item.price}
                            </span>
                            {item.price !== 'Custom' && <span className="text-text-secondary opacity-60">/mo</span>}
                        </div>
                        <p className="text-text-secondary leading-relaxed mb-8 flex-grow">
                            {item.description}
                        </p>
                        <ul className="space-y-4 mb-10 text-left">
                            {item.features.map((feature, fIdx) => (
                                <li key={fIdx} className="flex items-center gap-3 text-sm text-text-primary font-medium">
                                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-5 rounded-full font-bold text-lg transition-all ${item.highlight ? 'bg-text-primary text-bg-primary shadow-xl scale-105' : 'bg-bg-primary text-text-primary border border-glass-border hover:bg-text-primary hover:text-bg-primary'}`}>
                            Deploy Workflow
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto overflow-hidden rounded-[32px] border border-glass-border bg-secondary-bg/50 backdrop-blur-3xl shadow-2xl">
                <div className="p-8 md:p-10 border-b border-glass-border">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Full Capability Comparison</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-bg-primary/50 text-[10px] md:text-[12px] font-bold text-text-primary uppercase tracking-widest opacity-40">
                                <th className="px-6 py-4 md:px-10 md:py-6 border-r border-glass-border">Capability</th>
                                <th className="px-6 py-4 md:px-10 md:py-6 border-r border-glass-border text-center">Standard</th>
                                <th className="px-6 py-4 md:px-10 md:py-6 border-r border-glass-border text-center">Pro</th>
                                <th className="px-6 py-4 md:px-10 md:py-6 text-center">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px]">
                            {[
                                { name: "Max Leads/Month", s: "1,000", p: "5,000", e: "Unlimited" },
                                { name: "Channel Protocols", s: "WhatsApp", p: "WhatsApp, Email", e: "ALL + API" },
                                { name: "RAG Analysis Speed", s: "Normal", p: "Fast", e: "Instant (Local Edge)" },
                                { name: "Workflow Resiliency", s: "99.9%", p: "99.99%", e: "High Availability 1:1" }
                            ].map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-glass-border hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 md:px-10 md:py-6 border-r border-glass-border font-bold text-text-primary whitespace-nowrap">{row.name}</td>
                                    <td className="px-6 py-4 md:px-10 md:py-6 border-r border-glass-border text-center text-text-secondary">{row.s}</td>
                                    <td className="px-6 py-4 md:px-10 md:py-6 border-r border-glass-border text-center text-text-primary font-bold">{row.p}</td>
                                    <td className="px-6 py-4 md:px-10 md:py-6 text-center text-text-secondary">{row.e}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-32 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-8 tracking-tight">Need a custom technical spec?</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <button className="px-10 py-5 rounded-full bg-text-primary text-bg-primary font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl">
                        Schedule an Architecture Sync
                    </button>
                    <button className="px-10 py-5 rounded-full bg-bg-primary text-text-primary border border-glass-border font-bold text-lg hover:bg-text-secondary/10 transition-all">
                        Talk to an Enterprise Lead
                    </button>
                </div>
            </div>
        </PageTemplate>
    );
};

export default PricingPage;
