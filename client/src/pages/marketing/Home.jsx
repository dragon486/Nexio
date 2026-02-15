import React from 'react';
import Hero from '../../components/marketing/Hero';
import Features from '../../components/marketing/Features';
import AnalyticsPreview from '../../components/marketing/AnalyticsPreview';
import Pricing from '../../components/marketing/Pricing';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
        >
            <Hero />
            <Features />
            <AnalyticsPreview />
            <Pricing />

            {/* CTA Section */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-4xl mx-auto bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-[100px] pointer-events-none" />

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 relative z-10">
                        Ready to automate your revenue?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto relative z-10">
                        Join 500+ companies using Arlo.ai to scale their sales without scaling headcount.
                    </p>

                    <button className="relative z-10 h-14 px-8 text-lg bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                        Start Your 14-Day Free Trial
                    </button>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;
