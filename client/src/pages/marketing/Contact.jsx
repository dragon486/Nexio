import React, { useState } from 'react';
import PageTemplate from '../../components/marketing/PageTemplate';
import { Mail, MessageSquare, CheckCircle, AlertCircle, Loader2, Phone } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        interest: 'WhatsApp AI Bot',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        // Since there's no backend contact endpoint yet, open email directly
        const subject = encodeURIComponent(`NEXIO Inquiry from ${formData.name} — ${formData.interest}`);
        const body = encodeURIComponent(
            `Hi Adel,\n\nName: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'N/A'}\nInterested in: ${formData.interest}\n\nMessage:\n${formData.message}`
        );
        window.location.href = `mailto:adelmuhammed786@gmail.com?subject=${subject}&body=${body}`;
        setStatus('success');
    };

    if (status === 'success') {
        return (
            <PageTemplate
                title="Message sent!"
                subtitle="Thank you for reaching out. We'll get back to you within 24 hours."
            >
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-10">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-4xl font-bold mb-6">We'll be in touch soon.</h2>
                    <p className="text-xl text-text-secondary max-w-md">
                        Adel will personally review your message and reach out within 24 hours.
                    </p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="mt-12 text-primary font-bold hover:underline"
                    >
                        Send another message
                    </button>
                </div>
            </PageTemplate>
        );
    }

    return (
        <PageTemplate
            title="Get in touch."
            subtitle="Have a question, want a demo, or ready to get started? We'd love to hear from you."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start mb-32">
                {/* Contact Form */}
                <div className="p-6 md:p-12 rounded-[40px] bg-secondary-bg border border-glass-border relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-10">Send us a message</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest opacity-60">Full Name</label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl bg-background border border-glass-border focus:border-primary outline-none text-text-primary transition-all text-sm"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest opacity-60">Email Address</label>
                                    <input
                                        required
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl bg-background border border-glass-border focus:border-primary outline-none text-text-primary transition-all text-sm"
                                        placeholder="you@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-primary uppercase tracking-widest opacity-60">Company (optional)</label>
                                <input
                                    name="company"
                                    type="text"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-background border border-glass-border focus:border-primary outline-none text-text-primary transition-all text-sm"
                                    placeholder="Your company name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-primary uppercase tracking-widest opacity-60">I'm interested in</label>
                                <select
                                    name="interest"
                                    value={formData.interest}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-background border border-glass-border focus:border-primary outline-none text-text-primary transition-all text-sm appearance-none"
                                >
                                    <option>WhatsApp AI Bot</option>
                                    <option>AI Lead Management</option>
                                    <option>Enterprise Plan</option>
                                    <option>Custom Integration</option>
                                    <option>Pricing Information</option>
                                    <option>Something else</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-primary uppercase tracking-widest opacity-60">Message</label>
                                <textarea
                                    required
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-[20px] bg-background border border-glass-border focus:border-primary outline-none text-text-primary transition-all text-sm h-36 resize-none"
                                    placeholder="Tell us about your business and what you're looking for..."
                                />
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-500/10 p-4 rounded-xl">
                                    <AlertCircle size={18} />
                                    Something went wrong. Please try again or email us directly.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-5 rounded-full bg-primary text-white font-bold text-base hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-16 pt-6">
                    <div>
                        <h4 className="text-xs font-bold text-text-primary uppercase tracking-widest opacity-40 mb-8">Contact directly</h4>
                        <div className="space-y-10">
                            {[
                                { title: "Email Us", val: "adelmuhammed786@gmail.com", Icon: Mail, href: "mailto:adelmuhammed786@gmail.com" },
                                { title: "WhatsApp", val: "Chat with us on WhatsApp", Icon: MessageSquare, href: "https://wa.me/message/nexio" },
                                { title: "Book a Call", val: "Schedule a free 30-min demo", Icon: Phone, href: "/contact" }
                            ].map((channel, i) => (
                                <a key={i} href={channel.href} className="flex gap-6 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <channel.Icon size={22} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">{channel.title}</h5>
                                        <p className="text-sm font-medium text-text-secondary opacity-70">{channel.val}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl border border-glass-border bg-primary/5">
                        <h4 className="font-bold text-text-primary mb-3">Ready to get started?</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            All plans include a free onboarding session. Adel personally sets up your first AI bot and trains it on your business.
                        </p>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
};

export default ContactPage;
