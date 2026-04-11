import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageTemplate from '../../components/marketing/PageTemplate';

const BlogPage = () => {
    return (
        <PageTemplate 
            title="Insights into the Nexus Architecture." 
            subtitle="The latest deep-dives into AI sales workforce efficiency, RAG optimization, and the future of autonomous lead qualification."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
                {[
                    { 
                        title: "Scaling RAG for 1M+ Leads", 
                        category: "Engineering", 
                        date: "Mar 24, 2026",
                        excerpt: "How we optimized our vector retrieval layers to handle enterprise-grade lead flow without sacrificing context." 
                    },
                    { 
                        title: "The Ethics of AI Sales Agents", 
                        category: "Policy", 
                        date: "Mar 18, 2026",
                        excerpt: "Architecting empathy into algorithmic communication. A deep-dive into NEXIO's behavioral alignment." 
                    },
                    { 
                        title: "WhatsApp vs. Email: Lead Intent", 
                        category: "Analysis", 
                        date: "Mar 12, 2026",
                        excerpt: "Comparative data on lead conversion rates across different communication protocols in 2026." 
                    }
                ].map((post, i) => (
                    <motion.div 
                        key={i} 
                        className="group p-8 rounded-[32px] border border-glass-border bg-secondary-bg hover:border-text-primary/20 transition-all duration-500 flex flex-col relative overflow-hidden shadow-sm"
                        whileHover={{ y: -8 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">{post.category}</span>
                            <span className="text-[11px] font-medium text-text-secondary opacity-40 italic">{post.date}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-6 tracking-tight leading-tight group-hover:text-primary transition-colors relative z-10">
                            {post.title}
                        </h3>
                        <p className="text-text-secondary leading-relaxed opacity-70 mb-10 flex-grow relative z-10 italic">
                            "{post.excerpt}"
                        </p>
                        <Link to="/blog" className="flex items-center gap-2 text-sm font-bold text-text-primary hover:gap-4 transition-all relative z-10 group/link">
                            Read Architecture Note <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="p-16 rounded-[48px] bg-secondary-bg border border-glass-border text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02]" />
                <div className="relative z-10 max-w-xl mx-auto">
                    <h2 className="text-3xl font-bold text-text-primary mb-6 tracking-tight">Stay synchronized.</h2>
                    <p className="text-text-secondary mb-10 opacity-80">Get technical updates and architecture notes delivered to your inbox.</p>
                    <div className="flex gap-4">
                        <input 
                            type="email" 
                            placeholder="engineering@company.com" 
                            className="flex-grow px-8 py-5 rounded-full bg-bg-primary border border-glass-border focus:border-primary outline-none text-text-primary transition-all text-sm"
                        />
                        <button className="px-10 py-5 rounded-full bg-text-primary text-bg-primary font-bold hover:scale-105 active:scale-95 transition-all shadow-xl">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
};

export default BlogPage;
