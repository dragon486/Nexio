import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="border-t border-border/10 dark:border-white/10 bg-background dark:bg-[#0a0a0a] pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
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
                        <div className="flex gap-3">
                            {[Twitter, Linkedin, Github].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/5 flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 transition-all shadow-sm">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link to="/demo" className="hover:text-primary transition-colors">Interactive Demo</Link></li>
                            <li><Link to="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                            <li><Link to="/security" className="hover:text-primary transition-colors">Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2026 NEXIO Inc. All rights reserved.</p>
                    <div className="flex items-center gap-2 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow shadow-emerald-500/50"></span>
                        All Systems Operational
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
