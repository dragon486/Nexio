import React from 'react';
import PageTemplate from '../../../components/marketing/PageTemplate';
import { ShieldCheck, Lock as PrivateIcon, Search, Cpu } from 'lucide-react';

const SecurityPage = () => {
    return (
        <PageTemplate 
            title="Nexus Security Protocols." 
            subtitle="The technical architecture governing how we protect your enterprise sales data at every layer."
        >
            <div className="max-w-4xl mx-auto space-y-16 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { title: "Edge Encryption", desc: "All data is encrypted via TLS 1.3 in transit and AES-256 at rest.", Icon: PrivateIcon },
                        { title: "Local RAG Isolation", desc: "Lead context is processed in ephemeral memory states, never stored permanently.", Icon: Cpu },
                        { title: "Continuous Auditing", desc: "Real-time threat detection and recursive vulnerability scanning.", Icon: Search },
                        { title: "Access Protocols", desc: "No human at NEXIO has access to your lead-facing communication threads.", Icon: ShieldCheck }
                    ].map((feature, i) => (
                        <div key={i} className="p-10 rounded-[32px] bg-secondary-bg border border-glass-border">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <feature.Icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-3 tracking-tight">{feature.title}</h3>
                            <p className="text-text-secondary leading-relaxed opacity-70 italic">"{feature.desc}"</p>
                        </div>
                    ))}
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-text-primary mb-6 tracking-tight">Compliance Infrastructure</h2>
                    <p className="text-lg text-text-secondary leading-relaxed opacity-80">
                        NEXIO is architected to align with SOC2 Type II and HIPAA standards for data reliability. Our infrastructure resides on geographically isolated clusters to ensure maximum workforce parity and uptime resilience.
                    </p>
                </section>

                <div className="p-12 rounded-[32px] bg-secondary-bg border border-glass-border">
                    <p className="text-sm font-medium text-text-secondary italic opacity-60">
                        Last updated: March 30, 2026. For technical inquiries regarding our data architecture, connect with our security leads at security@nexio.ai.
                    </p>
                </div>
            </div>
        </PageTemplate>
    );
};

export default SecurityPage;
