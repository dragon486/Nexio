import React from 'react';
import PageTemplate from '../../components/marketing/PageTemplate';
import { 
    MessageSquare, 
    Zap, 
    TrendingUp, 
    ShieldCheck, 
    Globe, 
    Users,
    Cpu,
    Lock,
    Zap as Fast,
    Layers,
    Share2,
    BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

const featureList = [
    {
        icon: MessageSquare,
        title: "AI Lead Qualification",
        description: "Engage leads instantly via WhatsApp & Email. Our autonomous workforce asks the exact questions needed to filter intent from noise.",
        detail: "Using custom RAG pipelines, NEXIO identifies high-net-worth intent with 99.2% accuracy before alerting your team."
    },
    {
        icon: Zap,
        title: "Instant Follow-ups",
        description: "Zero latency response. While your competitors are sleeping, NEXIO is nurturing your leads and booking meetings.",
        detail: "Standard response times are under 30 seconds across all integrated channels, ensuring maximum retention."
    },
    {
        icon: TrendingUp,
        title: "Revenue Intelligence",
        description: "Track pipeline value, conversion rates, and AI performance in real-time with our enterprise-grade dashboard.",
        detail: "Visualize CAC and LTV metrics directly within the NEXIO interface, powered by native CRM integrations."
    },
    {
        icon: ShieldCheck,
        title: "Enterprise Security",
        description: "Bank-grade encryption and SOC2 compliant infrastructure ensures your customer data is always safe.",
        detail: "All data PII is sanitized at the edge before being processed by our secondary analytical layers."
    },
    {
        icon: Globe,
        title: "Multi-Channel Sync",
        description: "Seamlessly switch between WhatsApp, Email, and SMS based on where your leads are most active.",
        detail: "One unified thread per lead, regardless of the platform. NEXIO maintains context across 12+ communication protocols."
    },
    {
        icon: Users,
        title: "Intelligent Handoff",
        description: "NEXIO knows when to step back. High-value deals are instantly routed to your human sales team.",
        detail: "Triggers are customizable based on lead score, budget parameters, or specific keyword intent."
    }
];

const FeaturesPage = () => {
    return (
        <PageTemplate 
            title="Engineered for performance." 
            subtitle="The Nexus core is built on architectural resilience. Explore the technical capabilities that power the world's most advanced AI sales workforce."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featureList.map((item, i) => (
                    <motion.div
                        key={i}
                        className="group p-6 md:p-10 rounded-[32px] bg-secondary-bg border border-glass-border hover:border-text-primary/20 transition-all duration-700 relative overflow-hidden"
                        whileHover={{ y: -8 }}
                    >
                        {/* Ambient glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-bg-primary border border-glass-border flex items-center justify-center text-accent mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-4 tracking-tight">
                                {item.title}
                            </h3>
                            <p className="text-text-secondary leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                                {item.description}
                            </p>
                            <div className="pt-6 border-t border-glass-border">
                                <p className="text-[13px] text-text-secondary/60 font-medium leading-relaxed italic">
                                    {item.detail}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-32 p-8 md:p-16 rounded-[48px] bg-gradient-to-br from-secondary-bg to-bg-primary border border-glass-border relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-grid-white/[0.02]" />
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 tracking-tight">Ready to architect your workflow?</h2>
                    <p className="text-xl text-text-secondary mb-10 opacity-80">Join 500+ enterprises deploying NEXIO for 1:1 sales parity.</p>
                    <button className="px-10 py-5 rounded-full bg-text-primary text-bg-primary font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl">
                        Schedule an Architecture Audit
                    </button>
                </div>
            </div>
        </PageTemplate>
    );
};

export default FeaturesPage;
