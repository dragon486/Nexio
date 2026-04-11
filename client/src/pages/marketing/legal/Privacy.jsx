import React from 'react';
import PageTemplate from '../../../components/marketing/PageTemplate';

const PrivacyPage = () => {
    return (
        <PageTemplate 
            title="Privacy Architecture." 
            subtitle="How we handle your data with the precision and security of the Nexus core."
        >
            <div className="max-w-4xl mx-auto space-y-16 mb-32">
                <section>
                    <h2 className="text-2xl font-bold text-text-primary mb-6 tracking-tight">1. Data Resilience</h2>
                    <p className="text-lg text-text-secondary leading-relaxed opacity-80">
                        At NEXIO, privacy isn't just a policy; it's an architectural standard. All PII (Personally Identifiable Information) is encrypted at the edge using AES-256 protocols before reaching our analytical layers.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-text-primary mb-6 tracking-tight">2. Information Protocols</h2>
                    <p className="text-lg text-text-secondary leading-relaxed opacity-80 mb-6">
                        We collect lead data solely for the purpose of the 1:1 sales sync you've architected. This includes:
                    </p>
                    <ul className="space-y-4 text-text-secondary opacity-70">
                        <li className="flex gap-4">
                            <span className="text-accent font-bold">01.</span>
                            Communication history via WhatsApp and Email for context synthesis.
                        </li>
                        <li className="flex gap-4">
                            <span className="text-accent font-bold">02.</span>
                            Lead intent scoring metrics for funnel optimization.
                        </li>
                        <li className="flex gap-4">
                            <span className="text-accent font-bold">03.</span>
                            Workflow metadata for recursive learning engine refinement.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-text-primary mb-6 tracking-tight">3. Third-Party Sync</h2>
                    <p className="text-lg text-text-secondary leading-relaxed opacity-80">
                        NEXIO never sells your lead data to third-party marketplaces. We only sync data with your approved CRM integrations and communication providers (Twilio, SendGrid, etc.) as required for workforce parity.
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

export default PrivacyPage;
