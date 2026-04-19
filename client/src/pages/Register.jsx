import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../components/ui/Button';
import { register, googleLogin } from '../services/authService';
import { Building2, Lock, Mail, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [businessName, setBusinessName] = useState('');
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
            const response = await register(name, email, password, businessName);
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                navigate('/onboarding');
            } else {
                setError(response.message || 'Registration successful, but no token received.');
            }
        } catch (err) {
            setError(
                err.response?.data?.errors?.[0]?.message ||
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Registration failed'
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
            setError(err.response?.data?.message || err.response?.data?.error || 'Registration sequence failure. Access denied.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px]" style={{ background: 'var(--accent-blue)' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-10 blur-[120px]" style={{ background: 'var(--success-green)' }} />
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
                className="w-full max-w-lg relative z-10 p-8 md:p-12 backdrop-blur-3xl rounded-[32px] overflow-hidden"
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
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--success-green)' }} />
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--success-green)' }}>Initialize New Instance</span>
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

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-tertiary)' }}>Operator Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={16} style={{ color: 'var(--text-tertiary)' }} />
                                <input
                                    type="text"
                                    className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all border"
                                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                    placeholder="Adele Muhammed"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-tertiary)' }}>Business Entity</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={16} style={{ color: 'var(--text-tertiary)' }} />
                                <input
                                    type="text"
                                    className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all border"
                                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                    placeholder="Quantum Corp"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-tertiary)' }}>Primary Node / Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={16} style={{ color: 'var(--text-tertiary)' }} />
                            <input
                                type="email"
                                className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all border"
                                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                placeholder="operator@nexus.ai"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-tertiary)' }}>Access Key / Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={16} style={{ color: 'var(--text-tertiary)' }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:outline-none transition-all border"
                                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
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
                        {loading ? 'INITIALIZING...' : (
                            <>
                                START FREE RUN <ArrowRight size={14} />
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
                            Rapid Provisioning
                        </span>
                    </div>
                </div>

                {/* Google Sign-up integration */}
                <div className="flex justify-center mb-10 group transition-all hover:scale-[1.02]">
                    <div className="w-full max-w-[240px]">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google sign-up failed. Please try again.')}
                            theme="outline"
                            shape="circle"
                            text="signup_with"
                            size="large"
                            width="240px"
                        />
                    </div>
                </div>

                <div className="text-center pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                        ALREADY OPERATING?{' '}
                        <Link to="/login" className="font-black underline underline-offset-4 decoration-2 px-1" style={{ color: 'var(--accent-blue)' }}>
                            SIGN IN
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
