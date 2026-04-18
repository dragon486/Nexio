import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    MessageSquare, Zap, TrendingUp, ShieldCheck, Globe, Users,
    Code, BarChart2, Mail, Bell, Cpu, Layers, Calendar, Filter,
    Settings, Smartphone, Star, ChevronRight
} from 'lucide-react';

// ─── All real NEXIO features derived from the actual codebase ─────────────────
const FEATURE_CATEGORIES = [
    {
        category: 'AI & Lead Intelligence',
        categoryColor: 'rgba(59,130,246,0.1)',
        categoryBorder: 'rgba(59,130,246,0.2)',
        categoryTextColor: 'var(--accent-blue)',
        features: [
            {
                icon: Cpu,
                title: 'Gemini-Powered Lead Scoring',
                description: 'Google Gemini AI scores every lead 0–100 in real time based on their message, behavior, and intent signals. No manual review needed.',
                badge: 'Core AI',
            },
            {
                icon: Zap,
                title: 'Autonomous AI Responses',
                description: 'NEXIO generates context-aware responses using your business context — replying like a founder, not a bot. Works via WhatsApp, email, and chat widget.',
                badge: 'Always On',
            },
            {
                icon: Star,
                title: 'Sentiment & Intent Analysis',
                description: 'Tracks conversation sentiment over time and identifies when a lead shifts from cold to hot — triggering automatic escalation.',
                badge: 'Smart',
            },
        ]
    },
    {
        category: 'Automation & Channels',
        categoryColor: 'rgba(16,185,129,0.1)',
        categoryBorder: 'rgba(16,185,129,0.2)',
        categoryTextColor: '#10b981',
        features: [
            {
                icon: MessageSquare,
                title: 'WhatsApp Business API',
                description: 'Connect your Meta WhatsApp Business account in minutes. NEXIO automatically responds to every incoming message 24/7 without any human intervention.',
                badge: 'Multi-Channel',
                demoTab: 'whatsapp',
            },
            {
                icon: Mail,
                title: 'Gmail & Email Automation',
                description: 'OAuth2-powered Gmail integration syncs inbound leads from email. AI reads, classifies, and replies to qualified inquiries automatically.',
                badge: 'Native Integration',
            },
            {
                icon: Code,
                title: 'Embeddable Chat Widget',
                description: 'Drop a single JavaScript snippet on any website to capture leads directly. The AI widget qualifies visitors in real-time and funnels them to your NEXIO CRM.',
                badge: 'Website Integration',
                highlight: true,
                demoTab: 'widget',
            },
        ]
    },
    {
        category: 'CRM & Pipeline',
        categoryColor: 'rgba(139,92,246,0.1)',
        categoryBorder: 'rgba(139,92,246,0.2)',
        categoryTextColor: '#8b5cf6',
        features: [
            {
                icon: Users,
                title: 'Lead Management Hub',
                description: 'A full CRM for managing every lead, conversation, status, and deal value — with one-click access to full conversation threads and AI analysis.',
                badge: 'Built-in CRM',
            },
            {
                icon: Layers,
                title: 'Visual Pipeline Management',
                description: 'Drag-and-drop pipeline view showing every lead stage — from new inquiry to converted client. See deal values and AI scores at a glance.',
                badge: 'Kanban',
            },
            {
                icon: Calendar,
                title: 'Automated Meeting Booking',
                description: 'When a lead hits a qualifying threshold, NEXIO auto-sends a meeting booking link. Hot leads get a calendar invite before your team is even notified.',
                badge: 'Workflow',
            },
        ]
    },
    {
        category: 'Analytics & Intelligence',
        categoryColor: 'rgba(245,158,11,0.1)',
        categoryBorder: 'rgba(245,158,11,0.2)',
        categoryTextColor: '#f59e0b',
        features: [
            {
                icon: BarChart2,
                title: 'Revenue Analytics Dashboard',
                description: 'Track AI-generated revenue vs manual revenue side-by-side. Monthly bar charts, sparklines, and conversion rate trends — all updated in real time.',
                badge: 'Live Data',
                demoTab: 'dashboard',
            },
            {
                icon: TrendingUp,
                title: 'ROI & Performance Reporting',
                description: 'Understand exactly what NEXIO is worth to your business. See response time improvements, conversion rate lifts, and projected revenue forecasts.',
                badge: 'Business Intelligence',
            },
            {
                icon: Filter,
                title: 'Advanced Lead Filtering',
                description: 'Filter leads by AI score, status, source, deal size, or industry. Export filtered datasets to CSV for your own analysis.',
                badge: 'Data Export',
            },
        ]
    },
    {
        category: 'Personalization & Security',
        categoryColor: 'rgba(59,130,246,0.1)',
        categoryBorder: 'rgba(59,130,246,0.2)',
        categoryTextColor: 'var(--accent-blue)',
        features: [
            {
                icon: Settings,
                title: 'Business DNA Configuration',
                description: 'Train NEXIO on your business — products, tone, pricing, FAQs. The AI responds as your brand voice, not a generic chatbot.',
                badge: 'Personalized AI',
            },
            {
                icon: Bell,
                title: 'Smart Notifications',
                description: 'Get real-time alerts when hot leads come in, a deal is about to close, or the AI needs human review — across web and mobile.',
                badge: 'Real-time',
            },
            {
                icon: ShieldCheck,
                title: 'Enterprise Security',
                description: 'JWT authentication, API key isolation per client, role-based access, and admin impersonation controls ensure your data stays protected.',
                badge: 'Enterprise',
            },
        ]
    },
    {
        category: 'Platform & Integrations',
        categoryColor: 'rgba(16,185,129,0.1)',
        categoryBorder: 'rgba(16,185,129,0.2)',
        categoryTextColor: '#10b981',
        features: [
            {
                icon: Globe,
                title: 'Multi-Client Admin Panel',
                description: 'Agencies and white-label users can manage multiple client accounts from one admin panel — with impersonation, client analytics, and billing controls.',
                badge: 'Agency Ready',
            },
            {
                icon: Smartphone,
                title: 'Mobile-First Dashboard',
                description: 'The full NEXIO dashboard is optimized for mobile with a financial-app style design. Check leads, respond, and monitor revenue from anywhere.',
                badge: 'Mobile App Feel',
            },
            {
                icon: Cpu,
                title: 'Broadcast Campaigns',
                description: 'Send AI-personalized broadcast messages to your entire lead database in one click — segmented by status, score, or industry vertical.',
                badge: 'Campaigns',
            },
        ]
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const SpotlightCard = ({ children, borderColor }) => {
    const ref = useRef(null);
    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        ref.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        ref.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    return (
        <div ref={ref} onMouseMove={handleMouseMove} className="group h-full relative">
            <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[inherit]"
                style={{ background: 'radial-gradient(350px circle at var(--mx,50%) var(--my,50%), rgba(59,130,246,0.07), transparent 60%)' }}
            />
            {children}
        </div>
    );
};

const FeaturesShowcase = () => {
    const [activeCategory, setActiveCategory] = useState(0);
    const gridRef = useRef(null);
    const isInView = useInView(gridRef, { once: true, amount: 0.05 });

    return (
        <section
            id="features"
            className="py-32 md:py-48 px-6 relative overflow-hidden"
            aria-labelledby="features-showcase-heading"
            style={{ background: 'var(--bg-primary)' }}
        >
            <div
                className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full pointer-events-none -translate-y-1/2"
                style={{ background: 'rgba(59,130,246,0.04)', filter: 'blur(130px)' }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-16"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8"
                        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent-blue)' }}
                    >
                        Everything You Need
                    </div>
                    <h2
                        id="features-showcase-heading"
                        className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        One platform.
                        <span className="gradient-text italic block">Every sales tool you need.</span>
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>
                        From AI lead scoring to WhatsApp automation, embeddable chat widgets to revenue analytics — NEXIO replaces 6 different tools with one intelligent platform.
                    </p>
                </motion.div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 justify-center mb-16">
                    {FEATURE_CATEGORIES.map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveCategory(i)}
                            className="px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300"
                            style={activeCategory === i
                                ? { background: 'var(--accent-blue)', color: '#ffffff', boxShadow: '0 8px 20px rgba(59,130,246,0.25)' }
                                : { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
                            }
                        >
                            {cat.category}
                        </button>
                    ))}
                </div>

                {/* Feature Cards Grid */}
                <AnimatedGrid
                    key={activeCategory}
                    features={FEATURE_CATEGORIES[activeCategory].features}
                    cat={FEATURE_CATEGORIES[activeCategory]}
                />

                {/* Full-flat capability strip */}
                <motion.div
                    ref={gridRef}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="mt-20 p-8 rounded-3xl"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                    <p className="text-xs font-black uppercase tracking-widest mb-6 text-center" style={{ color: 'var(--text-tertiary)' }}>
                        Everything included in every plan
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            'AI Lead Scoring', 'WhatsApp Business API', 'Gmail Integration',
                            'Embeddable Chat Widget', 'CRM & Lead Management', 'Visual Pipeline',
                            'Revenue Analytics', 'Smart Notifications', 'Broadcast Campaigns',
                            'Business DNA Training', 'Human Handoff', 'Admin Panel',
                            'Mobile Dashboard', 'CSV Export', 'API Key Management',
                            'Google OAuth', 'Multi-Client Support', 'Real-time Insights',
                        ].map((cap, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.4, delay: i * 0.03 }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold"
                                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--accent-blue)' }} />
                                {cap}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const AnimatedGrid = ({ features, cat }) => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
            {features.map((feature, index) => (
                <motion.div key={index} variants={cardVariants} className="h-full">
                    <SpotlightCard>
                        <motion.div
                            className="h-full p-8 rounded-3xl relative overflow-hidden cursor-default group/card"
                            style={{
                                background: 'var(--bg-secondary)',
                                border: `1px solid var(--border)`,
                                boxShadow: 'var(--card-shadow)',
                            }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Hover border accent */}
                            <div
                                className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                                style={{ background: 'linear-gradient(to right, transparent, var(--accent-blue), transparent)' }}
                            />

                            {/* Feature badge */}
                            <div
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-6"
                                style={{ background: cat.categoryColor, border: `1px solid ${cat.categoryBorder}`, color: cat.categoryTextColor }}
                            >
                                {feature.badge}
                            </div>

                            {/* Icon */}
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover/card:scale-110"
                                style={{ background: cat.categoryColor, border: `1px solid ${cat.categoryBorder}` }}
                            >
                                <feature.icon size={22} strokeWidth={1.5} style={{ color: cat.categoryTextColor }} />
                            </div>

                            <h3 className="text-[18px] font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                {feature.title}
                            </h3>

                            <p className="text-[14px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                                {feature.description}
                            </p>

                            {/* Footer */}
                            <div className="mt-6 flex items-center justify-between">
                                <div
                                    className="h-[1px] flex-1 w-0 group-hover/card:w-full transition-all duration-700"
                                    style={{ background: 'var(--border)' }}
                                />
                                {feature.demoTab && (
                                    <Link
                                        to={`/demo?tab=${feature.demoTab}`}
                                        className="ml-3 flex items-center gap-1 shrink-0 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-all duration-500"
                                        style={{ color: cat.categoryTextColor }}
                                    >
                                        See Demo <ChevronRight size={10} />
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </SpotlightCard>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default FeaturesShowcase;
