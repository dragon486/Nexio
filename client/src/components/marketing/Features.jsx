import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
    MessageSquare, 
    Zap, 
    TrendingUp, 
    ShieldCheck, 
    Globe, 
    Users 
} from 'lucide-react';

const features = [
    {
        icon: MessageSquare,
        title: 'AI Lead Qualification',
        description: 'NEXIO engages leads instantly via WhatsApp & Email, asking the right questions to qualify them before you wake up.',
        useCase: 'Used by real estate teams to qualify 200+ leads/day without a single rep.',
    },
    {
        icon: Zap,
        title: 'Instant Follow-ups',
        description: 'Zero latency. While your competitors are sleeping, NEXIO is nurturing your leads and booking meetings.',
        useCase: 'SaaS teams cut response time from 11 hours to under 60 seconds.',
    },
    {
        icon: TrendingUp,
        title: 'Revenue Intelligence',
        description: 'Track pipeline value, conversion rates, and AI performance in real-time with our enterprise-grade dashboard.',
        useCase: 'Sales managers monitor $500k+ pipelines with live updates.',
    },
    {
        icon: ShieldCheck,
        title: 'Enterprise Security',
        description: 'Bank-grade encryption and SOC2 compliant infrastructure ensures your customer data is always safe.',
        useCase: 'Trusted by fintech companies handling 10,000+ sensitive leads/month.',
    },
    {
        icon: Globe,
        title: 'Multi-Channel',
        description: 'Seamlessly switch between WhatsApp, Email, and SMS based on where your leads are most active.',
        useCase: 'E-commerce brands recover 43% of abandoned carts across 3 channels.',
    },
    {
        icon: Users,
        title: 'Human Handoff',
        description: 'NEXIO knows when to step back. High-value deals are instantly routed to your human sales team.',
        useCase: 'Agencies close 2x more enterprise deals with seamless AI-to-human handoff.',
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
};

// Spotlight card — mouse-tracked glow effect
const SpotlightCard = ({ children, className = '' }) => {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className={`spotlight-card ${className}`}
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            {/* Spotlight overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit]"
                style={{
                    background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,130,246,0.08), transparent 60%)',
                }}
            />
            {children}
        </div>
    );
};

const Features = () => {
    const gridRef = useRef(null);
    const isInView = useInView(gridRef, { once: true, amount: 0.1 });

    return (
        <section id="features" className="py-32 md:py-48 px-6 relative overflow-hidden" aria-labelledby="features-heading">
            {/* Background glow */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold tracking-widest text-primary mb-8 uppercase">
                        Why Teams Switch
                    </div>
                    <h2 id="features-heading" className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                        6 reasons sales teams{' '}
                        <span className="gradient-text italic block md:inline">switch to Nexio.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto tracking-normal font-medium">
                        Powerful features designed to automate the busywork and let you focus on closing.
                    </p>
                </motion.div>

                <motion.div
                    ref={gridRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                        >
                            <SpotlightCard>
                                <motion.div 
                                    className="feature-card h-full group cursor-default relative overflow-hidden"
                                    whileHover={{ y: -8, scale: 1.01 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {/* Glass shine */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    
                                    <div className="relative z-10">
                                        <div className="feature-icon group-hover:bg-primary dark:group-hover:bg-white group-hover:text-background dark:group-hover:text-[#0a0a0a] group-hover:scale-110 transition-all duration-500 shadow-xl shadow-primary/5">
                                            <feature.icon size={28} />
                                        </div>
                                        <h3 className="group-hover:text-primary dark:group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                                        <p className="font-medium opacity-80 group-hover:opacity-100 transition-opacity mb-6">{feature.description}</p>
                                        
                                        {/* Use-case callout */}
                                        <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10 text-[12px] text-muted-foreground font-medium">
                                            <span className="text-primary mt-0.5 flex-shrink-0">→</span>
                                            <span>{feature.useCase}</span>
                                        </div>
                                        
                                        {/* Reveal line */}
                                        <div className="mt-6 h-[2px] w-0 bg-primary dark:bg-white group-hover:w-full transition-all duration-700 opacity-20" />
                                    </div>
                                </motion.div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
