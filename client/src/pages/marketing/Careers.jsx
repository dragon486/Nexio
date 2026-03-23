import React from 'react';
import PageTemplate from '../../components/marketing/PageTemplate';

const CareersPage = () => {
    const roles = [
        { title: "AI Research Engineer", location: "Palo Alto / Remote", category: "Engineering" },
        { title: "Product Designer", location: "Remote", category: "Design" },
        { title: "Growth Architect", location: "Palo Alto", category: "Marketing" }
    ];

    return (
        <PageTemplate 
            title="Join the architects." 
            subtitle="We're building the infrastructure for the next generation of sales communication. Come design the future with us."
        >
            <div className="space-y-6 max-w-4xl mx-auto">
                {roles.map((role, i) => (
                    <div key={i} className="p-8 rounded-2xl border border-border/10 bg-muted/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-primary/30 transition-colors cursor-pointer">
                        <div>
                            <div className="text-[10px] uppercase font-bold text-primary tracking-widest mb-2">{role.category}</div>
                            <h3 className="text-xl font-bold">{role.title}</h3>
                            <p className="text-muted-foreground text-sm">{role.location}</p>
                        </div>
                        <button className="btn-secondary whitespace-nowrap">Apply Now</button>
                    </div>
                ))}
            </div>
            
            <div className="mt-20 text-center">
                <p className="text-muted-foreground">Don't see a perfect fit? Send your blueprint to <span className="text-foreground font-bold">careers@nexio.ai</span></p>
            </div>
        </PageTemplate>
    );
};

export default CareersPage;
