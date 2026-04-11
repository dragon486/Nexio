import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="relative border-t border-glass-border bg-bg-primary pt-32 pb-16 overflow-hidden">
            {/* Dark mode depth enhancement */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-t from-primary/5 to-transparent blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-20">
                    <div className="col-span-2 lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-14 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                                <svg className="logo-icon-nav" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="footer-logo-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#1d1d1f" />
                                            <stop offset="50%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#1d1d1f" />
                                        </linearGradient>
                                        <linearGradient id="footer-logo-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#f5f5f7" />
                                            <stop offset="50%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#f5f5f7" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Blueprint Frame */}
                                    <rect className="logo-frame" x="15" y="35" width="70" height="30" 
                                        fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                                    
                                    {/* Main Connection Path */}
                                    <motion.path className="logo-path" 
                                        d="M 20 50 L 38 50 L 38 42 L 50 42 L 50 58 L 62 58 L 62 50 L 80 50" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                                    />
                                    
                                    {/* Connection Nodes */}
                                    {[
                                        { cx: 20, cy: 50, color: "currentColor" },
                                        { cx: 38, cy: 50, color: "#3b82f6" },
                                        { cx: 50, cy: 42, color: "#3b82f6" },
                                        { cx: 50, cy: 58, color: "#3b82f6" },
                                        { cx: 62, cy: 50, color: "#3b82f6" },
                                        { cx: 80, cy: 50, color: "currentColor" }
                                    ].map((node, i) => (
                                        <motion.circle 
                                            key={i}
                                            cx={node.cx} 
                                            cy={node.cy} 
                                            r="3.5" 
                                            fill={node.color}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ 
                                                scale: [0, 1.2, 1],
                                                opacity: [0, 1, 1],
                                            }}
                                            transition={{ 
                                                duration: 0.5, 
                                                delay: i * 0.15,
                                                scale: { repeat: Infinity, repeatDelay: 3, duration: 1, delay: i * 0.2 + 2 }
                                            }}
                                        />
                                    ))}
                                </svg>
                            </div>
                            <span className="logo-text">NEXIO</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-8">
                            The autonomous AI sales workforce that works 24/7.
                            Qualify leads, book meetings, and close deals without lifting a finger.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Linkedin, href: "https://www.linkedin.com/in/adel-muhammed-49136a282/" },
                                { Icon: Github, href: "https://github.com/dragon486" }
                            ].map((item, i) => (
                                <a 
                                    key={i} 
                                    href={item.href} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-secondary-bg border border-glass-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-text-primary transition-all duration-500 shadow-sm group"
                                >
                                    <item.Icon size={18} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[12px] font-bold text-text-primary uppercase tracking-[0.2em] opacity-40 mb-8">Product</h4>
                        <ul className="space-y-4 text-[14px]">
                            <li><Link to="/features" className="text-text-secondary hover:text-text-primary transition-all duration-300">Features</Link></li>
                            <li><Link to="/pricing" className="text-text-secondary hover:text-text-primary transition-all duration-300">Pricing</Link></li>
                            <li><Link to="/demo" className="text-text-secondary hover:text-text-primary transition-all duration-300">Interactive Demo</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[12px] font-bold text-text-primary uppercase tracking-[0.2em] opacity-40 mb-8">Company</h4>
                        <ul className="space-y-4 text-[14px]">
                            <li><Link to="/about" className="text-text-secondary hover:text-text-primary transition-all duration-300">About</Link></li>
                            <li><Link to="/blog" className="text-text-secondary hover:text-text-primary transition-all duration-300">Blog</Link></li>
                            <li><Link to="/contact" className="text-text-secondary hover:text-text-primary transition-all duration-300">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[12px] font-bold text-text-primary uppercase tracking-[0.2em] opacity-40 mb-8">Legal</h4>
                        <ul className="space-y-4 text-[14px]">
                            <li><Link to="/privacy" className="text-text-secondary hover:text-text-primary transition-all duration-300">Privacy</Link></li>
                            <li><Link to="/terms" className="text-text-secondary hover:text-text-primary transition-all duration-300">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] text-text-secondary font-medium">
                    <p>© 2026 NEXIO Inc. Built for the high-end sales workforce.</p>
                    <div className="flex items-center gap-3 py-1.5 px-4 bg-secondary-bg border border-glass-border rounded-full backdrop-blur-3xl shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]"></span>
                        <span className="tracking-tight opacity-90 font-semibold text-text-primary">All Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
