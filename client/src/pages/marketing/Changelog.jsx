import React from 'react';
import PageTemplate from '../../components/marketing/PageTemplate';

const ChangelogPage = () => {
    const updates = [
        { version: "v1.2.0", date: "Mar 18, 2026", title: "Architect Blueprint Theme", changes: ["Brand new marketing architecture", "High-impact Hero animations", "Universal dark mode contrast optimization"] },
        { version: "v1.1.5", date: "Mar 12, 2026", title: "WhatsApp Integration Refinement", changes: ["Enhanced inference for WhatsApp messages", "Real-time delivery status tracking", "Improved lead qualification logic"] }
    ];

    return (
        <PageTemplate 
            title="Recursive updates." 
            subtitle="Follow the evolution of the NEXIO sales engine as we ship architectural improvements every week."
        >
            <div className="max-w-3xl mx-auto space-y-16">
                {updates.map((update, i) => (
                    <div key={i} className="relative pl-12 border-l border-border/10 pb-12 last:pb-0">
                        <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-primary shadow-glow shadow-primary/40" />
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-xs font-mono font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">{update.version}</span>
                            <span className="text-sm text-muted-foreground">{update.date}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-6">{update.title}</h3>
                        <ul className="space-y-3">
                            {update.changes.map((change, j) => (
                                <li key={j} className="text-muted-foreground text-sm flex items-center gap-3">
                                    <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                                    {change}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </PageTemplate>
    );
};

export default ChangelogPage;
