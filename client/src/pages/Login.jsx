import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../components/ui/Button';
import { login, googleLogin } from '../services/authService';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            setError(
                error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Invalid credentials'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setLoading(true);
        try {
            const data = await googleLogin(credentialResponse.credential);
            if (data.isNewUser) {
                navigate('/onboarding');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Authentication sequence failed. Protocol rejected.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px]" style={{ background: 'var(--accent-blue)' }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-10 blur-[120px]" style={{ background: 'var(--success-green)' }} />
            </div>

            {/* Back Home */}
            <div className="fixed top-8 left-8 z-20 hidden md:block">
                <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center border transition-all" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>←</span>
                    Mission Control
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10 p-8 md:p-12 backdrop-blur-3xl rounded-[32px] overflow-hidden"
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
            >
                <div className="text-center mb-10">
                    <motion.h1 
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="text-5xl font-black italic tracking-tighter mb-4" 
                        style={{ color: 'var(--text-primary)' }}
                    >
                        NEXIO
                    </motion.h1>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-white/5" style={{ borderColor: 'var(--border)' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-blue)' }} />
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--accent-blue)' }}>Authentication Gateway</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-4 rounded-2xl text-xs text-center font-bold tracking-wide border" 
                            style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-tertiary)' }}>Credential / Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={16} style={{ color: 'var(--text-tertiary)' }} />
                            <input
                                type="email"
                                className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all border"
                                style={{
                                    background: 'var(--bg-primary)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--text-primary)',
                                }}
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Verification / Pass</label>
                            <Link to="/forgot-password" size="sm" className="text-[9px] font-black uppercase tracking-widest hover:underline" style={{ color: 'var(--accent-blue)' }}>Recovery →</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={16} style={{ color: 'var(--text-tertiary)' }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:outline-none transition-all border"
                                style={{
                                    background: 'var(--bg-primary)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--text-primary)',
                                }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 transition-all hover:scale-110"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xl"
                        style={{ background: 'var(--accent-blue)', color: '#ffffff', boxShadow: '0 10px 30px rgba(59,130,246,0.3)' }}
                    >
                        {loading ? 'Processing...' : (
                            <>
                                Initialize Session <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-[1px]" style={{ background: 'var(--border)' }} />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-4 text-[9px] uppercase font-black tracking-widest" style={{ background: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
                            Secure OAuth 2.0
                        </span>
                    </div>
                </div>

                {/* Google Login — fully restored */}
                <div className="flex justify-center mb-10 group transition-all hover:scale-[1.02]">
                    <div className="w-full max-w-[240px]">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google login failed. Please try again.')}
                            theme="outline"
                            shape="circle"
                            text="continue_with"
                            size="large"
                            width="240px"
                        />
                    </div>
                </div>

                <div className="text-center pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                        Deployment not initialized?{' '}
                        <Link to="/register" className="font-black underline underline-offset-4 decoration-2 px-1" style={{ color: 'var(--accent-blue)' }}>
                            Register Hub
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
