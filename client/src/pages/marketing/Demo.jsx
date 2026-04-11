import React from 'react';
import PageTemplate from '../../components/marketing/PageTemplate';
import InteractiveHeroDemo from '../../components/marketing/InteractiveHeroDemo';
import { motion } from 'framer-motion';

const DemoPage = () => {
    return (
        <PageTemplate 
            title="Experience the Autonomy" 
            subtitle="Explore the world's most advanced AI sales workforce in action. See how NEXIO handles lead qualification, context-aware messaging, and high-throughput sync."
        >
            <div className="relative rounded-[48px] border border-glass-border bg-secondary-bg/20 backdrop-blur-3xl shadow-2xl p-4 md:p-8 overflow-hidden mb-32">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />
                
                <div className="relative z-10">
                    <InteractiveHeroDemo />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 className="text-4xl font-bold text-text-primary mb-8 tracking-tight">How it works.</h2>
                    <p className="text-xl text-text-secondary leading-relaxed mb-8 opacity-80">
                        NEXIO doesn't just send messages. It analyzes the architectural intent of every incoming lead, syncs with our local Local-Edge RAG, and generates contextually-accurate responses in under 30 seconds.
                    </p>
                    <div className="space-y-8">
                        {[
                            { title: "Real-time Synchronization", desc: "Native WhatsApp & Email integration handles 10,000+ records per minute." },
                            { title: "Context-Aware RAG", desc: "Retrieval-Augmented Generation ensures every response is technically accurate." },
                            { title: "Recursive Learning", desc: "The more leads NEXIO handles, the more it adapts to your unique brand voice." }
                        ].map((detail, dIdx) => (
                            <div key={dIdx} className="flex gap-4">
                                <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-bg-primary border border-glass-border flex items-center justify-center text-accent font-bold">
                                    {dIdx + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary mb-1">{detail.title}</h3>
                                    <p className="text-sm text-text-secondary opacity-70">{detail.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-12 rounded-[48px] bg-bg-primary border border-glass-border shadow-inner flex flex-col gap-8">
                    <div className="flex justify-between items-center pb-6 border-b border-glass-border">
                        <span className="text-sm font-bold uppercase tracking-widest opacity-40">System Architecture</span>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                            <span className="text-[10px] font-bold opacity-60 uppercase">Active</span>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-secondary-bg border border-glass-border">
                            <span className="text-sm font-medium text-text-primary">Response Latency</span>
                            <span className="font-mono text-xs text-accent">2.4ms</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-secondary-bg border border-glass-border">
                            <span className="text-sm font-medium text-text-primary">Model Confidence</span>
                            <span className="font-mono text-xs text-accent">99.8%</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-secondary-bg border border-glass-border">
                            <span className="text-sm font-medium text-text-primary">Active Lead Streams</span>
                            <span className="font-mono text-xs text-accent">12,482</span>
                        </div>
                    </div>
                    <div className="pt-4">
                        <button className="w-full py-5 rounded-full bg-accent text-white font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                            Deploy Custom Workforce
                        </button>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
};

export default DemoPage;
