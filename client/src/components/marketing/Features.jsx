import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Zap, BarChart3, Shield, Globe, Users } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const features = [
    {
        icon: MessageSquare,
        title: "AI Lead Qualification",
        description: "Arlo engages leads instantly via WhatsApp & Email, asking the right questions to qualify them before you wake up."
    },
    {
        icon: Zap,
        title: "Instant Follow-ups",
        description: "Zero latency. While your competitors are sleeping, Arlo is nurturing your leads and booking meetings."
    },
    {
        icon: BarChart3,
        title: "Revenue Intelligence",
        description: "Track pipeline value, conversion rates, and AI performance in real-time with our enterprise-grade dashboard."
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "Bank-grade encryption and SOC2 compliant infrastructure ensures your customer data is always safe."
    },
    {
        icon: Globe,
        title: "Multi-Channel",
        description: "Seamlessly switch between WhatsApp, Email, and SMS based on where your leads are most active."
    },
    {
        icon: Users,
        title: "Human Handoff",
        description: "Arlo knows when to step back. High-value deals are instantly routed to your human sales team."
    }
];

const Features = () => {
    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Everything you need to <span className="text-primary">scale sales.</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Powerful features designed to automate the busywork and let you focus on closing.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <GlassCard key={index} className="p-8 hover:bg-white/5 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
