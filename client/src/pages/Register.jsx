import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Button from '../components/ui/Button';
import { register } from '../services/authService';
import { Lock, Mail, User } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register(name, email, password); // Assuming register returns a response object
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                navigate('/onboarding');
            } else {
                // Handle cases where registration is successful but no token is returned,
                // or if the response structure is different.
                setError(response.message || 'Registration successful, but no token received.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Professional Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#3b82f6]/10 blur-[180px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#10b981]/10 blur-[180px] rounded-full animate-pulse-slow" />
            </div>

            <div className="fixed top-8 left-8 z-20">
                <Link to="/" className="flex items-center gap-2 text-xs font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-widest group">
                    <span className="w-8 h-8 rounded-full bg-surface-soft border border-border/10 flex items-center justify-center group-hover:-translate-x-1 transition-transform">←</span>
                    Return to Mission Control
                </Link>
            </div>

            <div className="w-full max-w-md relative z-10 p-10 bg-white/80 dark:bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-[24px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-[#e5e7eb] dark:border-[#2a2a2a] transition-all duration-500">
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black text-[#0f172a] dark:text-[#f8fafc] italic tracking-[-0.05em] mb-3 select-none">
                        NEXIO
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-[1.5px] w-10 bg-gradient-to-r from-transparent via-[#3b82f6]/30 to-transparent" />
                        <p className="text-[10px] text-[#3b82f6] font-black uppercase tracking-[0.4em] drop-shadow-sm">Initialize Hub</p>
                        <div className="h-[1.5px] w-10 bg-gradient-to-r from-transparent via-[#3b82f6]/30 to-transparent" />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Business Name</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-amber-500 transition-colors" size={18} />
                            <input
                                type="text"
                                className="w-full bg-[#fafafa] dark:bg-[#0f0f0f] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl py-3.5 pl-11 pr-4 text-[#0f172a] dark:text-[#f8fafc] placeholder:text-[#94a3b8]/40 focus:outline-none focus:ring-4 focus:ring-[#3b82f6]/10 focus:border-[#3b82f6]/50 transition-all font-bold text-sm shadow-inner"
                                placeholder="Quantum Corp"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-amber-500 transition-colors" size={18} />
                            <input
                                type="email"
                                className="w-full bg-[#fafafa] dark:bg-[#0f0f0f] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl py-3.5 pl-11 pr-4 text-[#0f172a] dark:text-[#f8fafc] placeholder:text-[#94a3b8]/40 focus:outline-none focus:ring-4 focus:ring-[#3b82f6]/10 focus:border-[#3b82f6]/50 transition-all font-bold text-sm shadow-inner"
                                placeholder="operator@nexus.ai"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-amber-500 transition-colors" size={18} />
                            <input
                                type="password"
                                className="w-full bg-[#fafafa] dark:bg-[#0f0f0f] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl py-3.5 pl-11 pr-4 text-[#0f172a] dark:text-[#f8fafc] placeholder:text-[#94a3b8]/40 focus:outline-none focus:ring-4 focus:ring-[#3b82f6]/10 focus:border-[#3b82f6]/50 transition-all font-bold text-sm shadow-inner"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-14 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none">
                        START FREE TRIAL
                    </Button>
                </form>

                <div className="mt-8 text-center text-[11px] font-bold uppercase tracking-widest space-y-4">
                    <p className="text-[#64748b] dark:text-[#94a3b8]">
                        ALREADY OPERATING? <Link to="/login" className="text-[#3b82f6] hover:text-[#2563eb] transition-all underline underline-offset-4 decoration-2 font-black">SIGN IN</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
