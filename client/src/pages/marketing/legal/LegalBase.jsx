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
