import React from 'react';
import PageTemplate from '../../../components/marketing/PageTemplate';

const LegalPage = ({ title, content }) => {
    return (
        <PageTemplate 
            title={title} 
            subtitle="Our commitment to transparency, security, and architectural integrity."
        >
            <div className="prose prose-invert max-w-3xl mx-auto text-muted-foreground leading-relaxed">
                {content.map((section, i) => (
                    <div key={i} className="mb-12">
                        <h2 className="text-xl font-bold text-foreground mb-4 font-mono uppercase tracking-widest">{section.title}</h2>
                        <p className="mb-4">{section.body}</p>
                    </div>
                ))}
            </div>
        </PageTemplate>
    );
};

export default LegalPage;

export const PrivacyContent = [
    { title: "Data Collection", body: "We collect only the information necessary to provide our autonomous sales services, including lead contact information and communication history." },
    { title: "Lead Privacy", body: "NEXIO instances are logically isolated. Data from your leads is never used to train models for other customers." }
];

export const TermsContent = [
    { title: "Service Scope", body: "NEXIO provides an autonomous sales software platform. You are responsible for ensuring your use complies with local telemarketing and data laws." },
    { title: "Accountability", body: "While NEXIO is highly intelligent, you remain 'human-in-the-loop' for final deal approvals and strategic oversight." }
];

export const SecurityContent = [
    { title: "Inference Isolation", body: "Every NEXIO instance runs in a secure, isolated container. We use bank-grade encryption for all data at rest and in transit." },
    { title: "Compliance", body: "NEXIO infrastructure is SOC2 Type II compliant and regularly audited by third-party security architects." }
];
