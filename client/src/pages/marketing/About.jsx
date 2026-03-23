import React from 'react';
import PageTemplate from '../../components/marketing/PageTemplate';

const AboutPage = () => {
    return (
        <PageTemplate 
            title="Building the future of sales." 
            subtitle="NEXIO was born from a simple architectural vision: what if software could communicate as naturally as a human, with the precision of a machine?"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-20">
                <div className="rounded-3xl bg-muted/10 h-96 flex items-center justify-center border border-border/10 overflow-hidden relative">
                    <div className="absolute inset-0 bg-grid-white/[0.02]" />
                    <span className="text-muted-foreground font-mono">Architectural Blueprint Visualization</span>
                </div>
                <div>
                    <h2 className="text-3xl font-bold mb-6">Our Philosophy</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        We believe that the best sales communication isn't just about speed; it's about context, empathy, and technical accuracy. NEXIO is designed to be the bridge between human intuition and algorithmic efficiency.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        By automating the repetitive parts of lead qualification, we empower human sales teams to focus on what they do best: building relationships and closing high-value deals.
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { title: "Precision", desc: "Every word is chosen with architectural intent to maximize conversion." },
                    { title: "Resilience", desc: "Operates 24/7 without latency, ensuring no lead is ever left behind." },
                    { title: "Intelligence", desc: "A recursive learning engine that adapts to your brand's unique voice." }
                ].map((item, i) => (
                    <div key={i} className="p-8 rounded-2xl border border-border/10 bg-muted/5">
                        <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </PageTemplate>
    );
};

export default AboutPage;
