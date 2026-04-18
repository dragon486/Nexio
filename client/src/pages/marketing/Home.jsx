import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../../components/marketing/Hero';
import Solutions from '../../components/marketing/Solutions';
import AnalyticsPreview from '../../components/marketing/AnalyticsPreview';
import Pricing from '../../components/marketing/Pricing';
import IntroBranding from '../../components/marketing/IntroBranding';
import ShowcaseSection from '../../components/marketing/ShowcaseSection';
import SEO from '../../components/marketing/SEO';

// Scroll-driven storytelling sections
import ProblemSection from '../../components/marketing/sections/ProblemSection';
import AIIntelligenceSection from '../../components/marketing/sections/AIIntelligenceSection';
import AutomationPipelineSection from '../../components/marketing/sections/AutomationPipelineSection';
import ROISection from '../../components/marketing/sections/ROISection';
import FeaturesShowcase from '../../components/marketing/sections/FeaturesShowcase';

const SectionWrapper = ({ children, id }) => (
    <motion.div
        id={id}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
        {children}
    </motion.div>
);

const Home = () => {
    const [isIntroActive, setIsIntroActive] = useState(true);

    useEffect(() => {
        if (isIntroActive) window.scrollTo(0, 0);
    }, [isIntroActive]);

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            <AnimatePresence mode="wait">
                {isIntroActive ? (
                    <motion.div key="intro-gate">
                        <IntroBranding onComplete={() => setIsIntroActive(false)} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="main-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <SEO
                            title="NEXIO | AI Lead Scoring, WhatsApp Automation & Sales Intelligence Platform"
                            description="NEXIO deploys autonomous AI agents to capture, score, and convert leads via WhatsApp, Gmail, and your website widget — 24/7. Replace manual follow-up with AI that never sleeps."
                            keywords="AI Lead Scoring, WhatsApp Business API Automation, Sales AI Platform, Lead Qualification AI, Embeddable Chat Widget, Gmail Automation, CRM with AI, Revenue Analytics, Autonomous Sales Workforce"
                        />

                        {/* ── 1. HERO — First impression & clarity */}
                        <Hero />

                        {/* ── 2. HOW IT WORKS — Data sync showcase */}
                        <SectionWrapper>
                            <ShowcaseSection />
                        </SectionWrapper>

                        {/* ── 3. PROBLEM — Pain points (blue theme, no red/orange) */}
                        <SectionWrapper>
                            <ProblemSection />
                        </SectionWrapper>

                        {/* ── 4. AI ENGINE — How NEXIO thinks */}
                        <SectionWrapper>
                            <AIIntelligenceSection />
                        </SectionWrapper>

                        {/* ── 5. AUTOMATION PIPELINE — Live WhatsApp flow */}
                        <SectionWrapper>
                            <AutomationPipelineSection />
                        </SectionWrapper>

                        {/* ── 6. ALL FEATURES — Tabbed, comprehensive showcase with all 18 real features */}
                        <SectionWrapper id="features">
                            <FeaturesShowcase />
                        </SectionWrapper>

                        {/* ── 7. SOLUTIONS — Industry verticals */}
                        <SectionWrapper id="solutions">
                            <Solutions />
                        </SectionWrapper>

                        {/* ── 8. ROI — Revenue impact */}
                        <SectionWrapper>
                            <ROISection />
                        </SectionWrapper>

                        {/* ── 9. ANALYTICS PREVIEW — Live dashboard demo */}
                        <SectionWrapper id="demo">
                            <AnalyticsPreview />
                        </SectionWrapper>

                        {/* ── 10. PRICING */}
                        <SectionWrapper id="pricing">
                            <Pricing />
                        </SectionWrapper>

                        {/* ── 11. FINAL CTA */}
                        <motion.section
                            initial={{ opacity: 0, scale: 0.97 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="py-32 md:py-48 px-6 text-center relative overflow-hidden"
                            aria-labelledby="cta-heading"
                        >
                            <div className="max-w-5xl mx-auto relative">
                                <div
                                    className="rounded-3xl p-12 md:p-24 relative overflow-hidden"
                                    style={{
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border)',
                                        boxShadow: '0 0 80px rgba(59,130,246,0.08)',
                                    }}
                                >
                                    <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.07), transparent 60%)' }}
                                    />

                                    <motion.div
                                        animate={{ scale: [1, 1.04, 1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-10"
                                        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent-blue)' }}
                                    >
                                        <motion.span
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="w-1.5 h-1.5 rounded-full inline-block"
                                            style={{ background: 'var(--accent-blue)' }}
                                        />
                                        Deploy in minutes — No code required
                                    </motion.div>

                                    <h2
                                        id="cta-heading"
                                        className="text-3xl md:text-6xl font-black tracking-tighter mb-8 leading-tight"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        Deploy your AI sales engine.
                                        <br />
                                        <span className="gradient-text italic">Start closing tonight.</span>
                                    </h2>

                                    <p className="text-xl mb-12 max-w-2xl mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>
                                        Join 500+ sales teams using NEXIO to qualify leads, book meetings, and close more revenue — 24/7, autonomously.
                                    </p>

                                    <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
                                        <Link to="/register">
                                            <motion.button
                                                whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(59,130,246,0.3)' }}
                                                whileTap={{ scale: 0.97 }}
                                                className="px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all"
                                                style={{ background: 'var(--accent-blue)', boxShadow: '0 10px 30px rgba(59,130,246,0.2)' }}
                                            >
                                                Start Free Trial — No Card Needed
                                            </motion.button>
                                        </Link>
                                        <Link to="/contact">
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                className="px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                                                style={{
                                                    background: 'transparent',
                                                    border: '2px solid var(--border)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            >
                                                Talk to Sales →
                                            </motion.button>
                                        </Link>
                                    </div>

                                    <p className="text-xs mt-8 font-medium" style={{ color: 'var(--text-tertiary)' }}>
                                        14-day free trial · No credit card required · Cancel anytime
                                    </p>
                                </div>
                            </div>
                        </motion.section>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
