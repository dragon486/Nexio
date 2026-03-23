import React from 'react';
import PageTemplate from '../../components/marketing/PageTemplate';

const ContactPage = () => {
    return (
        <PageTemplate 
            title="Talk to an architect." 
            subtitle="Need a custom deployment or have technical questions? Our engineering team is here to help you scale your sales engine."
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-12">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Direct Connection</h3>
                        <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">
                            architecture@nexio.ai<br/>
                            +1 (555) 123-4567
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Mailing Address</h3>
                        <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                            NEXIO Headquarters<br/>
                            123 Architectural Way<br/>
                            Palo Alto, CA 94301
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20">
                        <h3 className="text-lg font-bold mb-2">Technical Support</h3>
                        <p className="text-sm text-muted-foreground">Existing customers can reach out to support@nexio.ai for 24/7 technical assistance.</p>
                    </div>
                </div>
                
                <form className="space-y-6 bg-muted/10 border border-border/10 p-10 rounded-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                            <input type="text" className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="John Architect" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                            <input type="email" className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="john@company.ai" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inquiry Type</label>
                        <select className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 outline-none appearance-none cursor-pointer">
                            <option>Enterprise Deployment</option>
                            <option>Custom CRM Integration</option>
                            <option>Partnership Inquiry</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                        <textarea className="w-full bg-background border border-border/20 rounded-xl px-4 py-3 h-32 outline-none focus:border-primary transition-colors" placeholder="Describe your sales engine requirements..."></textarea>
                    </div>
                    <button className="btn-primary btn-with-arrow w-full py-4 text-sm tracking-widest uppercase">Send Inquiry</button>
                </form>
            </div>
        </PageTemplate>
    );
};

export default ContactPage;
