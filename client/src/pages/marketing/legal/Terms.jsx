import React from 'react';
import PageTemplate from '../../../components/marketing/PageTemplate';

const TermsPage = () => {
    return (
        <PageTemplate 
            title="Service Protocols." 
            subtitle="The architectural agreement governing your use of the NEXIO autonomous workforce."
        >
            <div className="max-w-4xl mx-auto space-y-16 mb-32">
                <section>
                    <h2 className="text-2xl font-bold text-text-primary mb-6 tracking-tight flex items-center gap-4">
                        <span className="text-accent">01.</span> Nexus Access
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed opacity-80">
                        By deploying the NEXIO workforce, you agree to comply with all regional communication laws (TCPA, GDPR) regarding lead outreach and consent. You are responsible for maintaining the architectural integrity of your sales scripts.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-text-primary mb-6 tracking-tight flex items-center gap-4">
                        <span className="text-accent">02.</span> Workforce Parity
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed opacity-80 mb-6">
                        NEXIO provides an autonomous agent proxy for your sales team. While we strive for 100% context-aware accuracy, you are recommended to audit high-value threads for extreme sales nuances.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-text-primary mb-6 tracking-tight flex items-center gap-4">
                        <span className="text-accent">03.</span> Scaling Limits
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed opacity-80">
                        Lead credits are architected for monthly cycles. Unused credits within your tier do not provide technical rollover, but can be scaled instantly via our enterprise tier.
                    </p>
                </section>

                <div className="p-12 rounded-[32px] bg-secondary-bg border border-glass-border">
                    <p className="text-sm font-medium text-text-secondary italic opacity-60">
                        Last updated: March 30, 2026. For technical inquiries regarding our legal architecture, connect with our legal leads at legal@nexio.ai.
                    </p>
                </div>
            </div>
        </PageTemplate>
    );
};

export default TermsPage;
