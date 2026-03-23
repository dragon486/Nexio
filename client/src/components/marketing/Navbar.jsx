import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { isAuthenticated } from '../../services/authService';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleThemeToggle = () => {
        setIsRotating(true);
        toggleTheme();
        setTimeout(() => setIsRotating(false), 500);
    };

    const navLinks = [
        { name: 'Features', path: '#features' },
        { name: 'Solutions', path: '#solutions' },
        { name: 'Pricing', path: '#pricing' },
    ];

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id.replace('#', ''));
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setMobileMenuOpen(false);
        }
    };

    return (
        <nav className={`marketing-navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                {/* 1. LOGO PROFESSIONAL FIX (CRITICAL) */}
                <Link to="/" className="logo-nav">
                    <svg className="logo-icon-nav" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="nav-logo-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#1d1d1f' }} />
                                <stop offset="50%" style={{ stopColor: '#3b82f6' }} />
                                <stop offset="100%" style={{ stopColor: '#1d1d1f' }} />
                            </linearGradient>
                            <linearGradient id="nav-logo-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#f5f5f7' }} />
                                <stop offset="50%" style={{ stopColor: '#3b82f6' }} />
                                <stop offset="100%" style={{ stopColor: '#f5f5f7' }} />
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
                    <span className="logo-text">NEXIO</span>
                </Link>

                {/* Desktop Nav Links */}
                <ul className="nav-links hidden md:flex">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <a href={link.path} onClick={(e) => scrollToSection(e, link.path)}>
                                {link.name}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href="#demo" onClick={(e) => scrollToSection(e, '#demo')}>
                            Demo
                        </a>
                    </li>
                </ul>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleThemeToggle}
                        className={`theme-toggle ${isRotating ? 'rotating' : ''}`}
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                    </button>
                    
                    {isAuthenticated() ? (
                        <Link to="/dashboard" className="btn-primary">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
                                Sign In
                            </Link>
                            <Link 
                                to="/register" 
                                className="btn-primary btn-with-arrow"
                            >
                                Get Started
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-foreground ml-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background dark:bg-[#0a0a0a] border-b border-border/10 dark:border-white/10 overflow-hidden"
                    >
                        <div className="px-6 py-8 space-y-4 flex flex-col">
                            {navLinks.map((link) => (
                                <a 
                                    key={link.name} 
                                    href={link.path} 
                                    onClick={(e) => scrollToSection(e, link.path)}
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all py-2"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-4 border-t border-border/10 flex flex-col gap-4">
                                <Link to="/login" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-primary btn-with-arrow w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
