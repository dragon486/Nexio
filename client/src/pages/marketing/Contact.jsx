import React from 'react';
import PageTemplate from '../../components/marketing/PageTemplate';
import { Zap, TrendingUp } from 'lucide-react';

const ContactPage = () => {
    return (
        <PageTemplate 
            title="Architect your sales engine." 
            subtitle="Connect with our technical leads to discuss your high-throughput workflow requirements."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start mb-32">
                <div className="p-6 md:p-12 rounded-[40px] bg-secondary-bg border border-glass-border relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-grid-white/[0.02]" />
                    <div className="relative z-10">
                        <h3 className="text-[12px] font-bold text-primary uppercase tracking-[0.3em] mb-12 text-center md:text-left">Technical Sync Request</h3>
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[12px] md:text-[11px] font-bold text-text-primary uppercase tracking-widest opacity-60 md:opacity-40">Architect Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-6 py-4 md:px-8 md:py-5 rounded-2xl bg-background border border-glass-border focus:border-primary outline-none text-text-primary transition-all text-sm" 
                                        placeholder="Adel Muhammed"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[12px] md:text-[11px] font-bold text-text-primary uppercase tracking-widest opacity-60 md:opacity-40">Enterprise Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full px-6 py-4 md:px-8 md:py-5 rounded-2xl bg-background border border-glass-border focus:border-primary outline-none text-text-primary transition-all text-sm" 
                                        placeholder="engineering@nexio.ai"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[12px] md:text-[11px] font-bold text-text-primary uppercase tracking-widest opacity-60 md:opacity-40">Workflow Protocol</label>
                                <select className="w-full px-6 py-4 md:px-8 md:py-5 rounded-2xl bg-background border border-glass-border focus:border-primary outline-none text-text-primary transition-all text-sm appearance-none">
                                    <option>Standard WhatsApp Sync</option>
                                    <option>Full Multi-Channel Workforce</option>
                                    <option>Custom API Integration</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[12px] md:text-[11px] font-bold text-text-primary uppercase tracking-widest opacity-60 md:opacity-40">Project Scope</label>
                                <textarea 
                                    className="w-full px-6 py-4 md:px-8 md:py-6 rounded-[24px] bg-background border border-glass-border focus:border-primary outline-none text-text-primary transition-all text-sm h-44 resize-none" 
                                    placeholder="Describe your current lead volume and desired conversion architecture..."
                                />
                            </div>
                            <button className="w-full py-6 rounded-full bg-text-primary text-bg-primary font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                                Initiate Connection
                            </button>
                        </form>
                    </div>
                </div>

                <div className="space-y-20 pt-10">
                    <div>
                        <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.3em] opacity-40 mb-10">Direct Channels</h4>
                        <div className="space-y-12">
                            {[
                                { title: "Technical Support", val: "support@nexio.ai", Icon: Zap },
                                { title: "Sales Architecture", val: "sales@nexio.ai", Icon: TrendingUp }
                            ].map((channel, i) => (
                                <div key={i} className="flex gap-8 group">
                                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        <channel.Icon size={28}/>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-text-primary mb-1 group-hover:text-accent transition-colors">{channel.title}</h5>
                                        <p className="text-xl font-medium text-text-secondary opacity-60">{channel.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.3em] opacity-40 mb-10">Global Headquarters</h4>
                        <p className="text-2xl font-bold text-text-primary leading-tight max-w-xs">
                            Architectural District,<br />
                            Silicon Core, SC 0101
                        </p>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
};

export default ContactPage;
