import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../../components/marketing/Hero';
import Features from '../../components/marketing/Features';
import Solutions from '../../components/marketing/Solutions';
import AnalyticsPreview from '../../components/marketing/AnalyticsPreview';
import Pricing from '../../components/marketing/Pricing';
import IntroBranding from '../../components/marketing/IntroBranding';
import ShowcaseSection from '../../components/marketing/ShowcaseSection';
import SEO from '../../components/marketing/SEO';
import Button from '../../components/ui/Button';

const Home = () => {
    const [isIntroActive, setIsIntroActive] = useState(true);

    useEffect(() => {
        // Ensure scroll is at top on mount
        if (isIntroActive) {
            window.scrollTo(0, 0);
        }
    }, [isIntroActive]);

    return (
        <div className="bg-background dark:bg-[#0a0a0a] min-h-screen">
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
                        transition={{ duration: 1 }}
                    >
                        <SEO 
                            title="NEXIO | The World's First Autonomous AI Sales Workforce"
                            description="NEXIO transforms your sales funnel with autonomous AI agents that qualify, engage, and convert leads via WhatsApp 24/7."
                        />
                        <Hero />
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: \"-100px\" }}
                            transition={{ duration: 0.8 }}
                        >
                            <ShowcaseSection />
                        </motion.div>

                        <motion.div 
                            id=\"features\"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: \"-100px\" }}
                            transition={{ duration: 0.8 }}
                        >
                            <Features />
                        </motion.div>

                        <motion.div 
                            id=\"solutions\"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: \"-100px\" }}
                            transition={{ duration: 0.8 }}
                        >
                            <Solutions />
                        </motion.div>

                        <motion.div 
                            id=\"demo\"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: \"-100px\" }}
                            transition={{ duration: 0.8 }}
                        >
                            <AnalyticsPreview />
                        </motion.div>

                        <motion.div 
                            id=\"pricing\"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: \"-100px\" }}
                            transition={{ duration: 0.8 }}
                        >
                            <Pricing />
                        </motion.div>

                        <motion.section 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className=\"py-32 md:py-48 px-6 text-center relative overflow-hidden\"
                        >
                            <div className=\"max-w-5xl mx-auto bg-surface dark:bg-[#1a1a1a] border border-border/40 dark:border-white/10 rounded-3xl p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-primary/5 ring-1 ring-primary/5\">
                                <div className=\"absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none\" />
                                <h2 className=\"text-3xl md:text-6xl font-black text-foreground mb-8 tracking-tighter leading-tight\">
                                    Ready to architect your <br />
                                    <span className=\"gradient-text italic\">autonomous future?</span>
                                </h2>
                                <p className=\"text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium\">
                                    Join the next generation of sales teams using NEXIO to scale revenue with precision and speed.
                                </p>
                                <div className=\"flex flex-col md:flex-row gap-6 justify-center items-center\">
                                    <Link to=\"/register\" className=\"w-full md:w-auto\">
                                        <Button className=\"btn-primary btn-large w-full btn-with-arrow\">
                                            Start Free Trial
                                        </Button>
                                    </Link>
                                    <Link to=\"/contact\" className=\"w-full md:w-auto\">
                                        <Button 
                                            variant=\"outline\" 
                                            className=\"btn-secondary btn-large w-full\"
                                        >
                                            Initiate Sync
                                        </Button>
                                    </Link>
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
