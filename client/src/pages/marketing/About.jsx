import React from 'react';
import PageTemplate from '../../components/marketing/PageTemplate';

const AboutPage = () => {
    return (
        <PageTemplate 
            title="Building the future of workforce." 
            subtitle="NEXIO was born from a simple architectural vision: what if software could communicate as naturally as a human, with the precision of a machine?"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-32">
                <div className="rounded-[40px] bg-secondary-bg h-[500px] flex items-center justify-center border border-glass-border overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 bg-grid-white/[0.02]" />
                    <div className="relative z-10 text-center p-12">
                        <div className="flex justify-center gap-4 mb-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-12 h-12 flex-shrink-0 rounded-2xl bg-bg-primary border border-glass-border flex items-center justify-center text-accent font-bold">
                                    {i}
                                </div>
                            ))}
                        </div>
                        <span className="text-text-primary/40 font-mono text-sm tracking-widest uppercase">Architectural Blueprint v2.8</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-text-primary mb-8 tracking-tight">Our Philosophy.</h2>
                    <p className="text-xl text-text-secondary leading-relaxed mb-8 opacity-80">
                        We believe that the best sales communication isn't just about speed; it's about context, empathy, and technical accuracy. NEXIO is designed to be the bridge between human intuition and algorithmic efficiency.
                    </p>
                    <p className="text-xl text-text-secondary leading-relaxed opacity-80 mb-8">
                        By automating the repetitive parts of lead qualification, we empower human sales teams to focus on what they do best: building relationships and closing high-value deals.
                    </p>
                    <button className="px-10 py-5 rounded-full bg-text-primary text-bg-primary font-bold text-lg hover:scale-105 transition-all shadow-xl">
                        Meet the Engineers
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
                {[
                    { title: "Precision", desc: "Every word is chosen with architectural intent to maximize lead conversion." },
                    { title: "Resilience", desc: "Operates 24/7 without latency, ensuring no lead is ever left behind." },
                    { title: "Intelligence", desc: "A recursive learning engine that adapts to your brand's unique voice." }
                ].map((item, i) => (
                    <div key={i} className="p-8 md:p-12 rounded-[32px] border border-glass-border bg-secondary-bg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <h3 className="text-2xl font-bold text-text-primary mb-6 tracking-tight relative z-10">{item.title}</h3>
                        <p className="text-lg text-text-secondary leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity relative z-10">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="py-20 border-y border-glass-border text-center">
                <h3 className="text-[12px] font-bold text-text-primary uppercase tracking-[0.3em] opacity-40 mb-12">Trusted by Technical Teams at</h3>
                <div className="flex flex-wrap justify-center gap-16 md:gap-24 opacity-30 grayscale contrast-125">
                    {['ALPHA', 'NEXUS', 'OMEGA', 'CHRONOS', 'VERTEX'].map((brand, i) => (
                        <span key={i} className="text-3xl font-black italic tracking-tighter">{brand}</span>
                    ))}
                </div>
            </div>
        </PageTemplate>
    );
};

export default AboutPage;
