import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: "💬",
        title: "AI Lead Qualification",
        description: "NEXIO engages leads instantly via WhatsApp & Email, asking the right questions to qualify them before you wake up."
    },
    {
        icon: "⚡",
        title: "Instant Follow-ups",
        description: "Zero latency. While your competitors are sleeping, NEXIO is nurturing your leads and booking meetings."
    },
    {
        icon: "📈",
        title: "Revenue Intelligence",
        description: "Track pipeline value, conversion rates, and AI performance in real-time with our enterprise-grade dashboard."
    },
    {
        icon: "🛡️",
        title: "Enterprise Security",
        description: "Bank-grade encryption and SOC2 compliant infrastructure ensures your customer data is always safe."
    },
    {
        icon: "🌐",
        title: "Multi-Channel",
        description: "Seamlessly switch between WhatsApp, Email, and SMS based on where your leads are most active."
    },
    {
        icon: "👥",
        title: "Human Handoff",
        description: "NEXIO knows when to step back. High-value deals are instantly routed to your human sales team."
    }
];

const Features = () => {
    return (
        <section id="features" className="py-32 md:py-48 px-6 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-24"
                >
                    <h2 className="text-[32px] md:text-[56px] font-black text-foreground mb-6 tracking-tighter">
                        Everything you need to <span className="gradient-text italic">scale sales.</span>
                    </h2>
                    <p className="text-[18px] md:text-[21px] text-muted-foreground max-w-2xl mx-auto font-medium">
                        Powerful features designed to automate the busywork and let you focus on closing.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {features.map((feature, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <motion.div 
                                className="feature-card h-full group cursor-default relative overflow-hidden"
                                whileHover={{ y: -12, scale: 1.02 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {/* Glass Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                
                                <div className="relative z-10">
                                    <div className="feature-icon group-hover:bg-primary dark:group-hover:bg-white group-hover:text-background dark:group-hover:text-[#0a0a0a] group-hover:scale-110 transition-all duration-500 shadow-xl shadow-primary/5" data-icon={feature.icon}></div>
                                    <h3 className="group-hover:text-primary dark:group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                                    <p className="font-medium opacity-80 group-hover:opacity-100 transition-opacity">{feature.description}</p>
                                    
                                    {/* Reveal detail line */}
                                    <div className="mt-8 h-[2px] w-0 bg-primary dark:bg-white group-hover:w-full transition-all duration-700 opacity-20" />
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
