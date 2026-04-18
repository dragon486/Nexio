import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../components/ui/Button';
import { login, googleLogin } from '../services/authService';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            setError(err.response?.data?.message || 'Google login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full animate-pulse-slow" style={{ background: 'rgba(59,130,246,0.08)', filter: 'blur(180px)' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full animate-pulse-slow" style={{ background: 'rgba(59,130,246,0.05)', filter: 'blur(180px)' }} />
            </div>

            <div className="fixed top-8 left-8 z-20">
                <Link to="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest group transition-all" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:-translate-x-1 transition-transform" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>←</span>
                    Back to Home
                </Link>
            </div>

            <div
                className="w-full max-w-md relative z-10 p-10 backdrop-blur-2xl rounded-[24px]"
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 32px 64px -16px rgba(0,0,0,0.2)',
                }}
            >
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black italic tracking-[-0.05em] mb-3" style={{ color: 'var(--text-primary)' }}>
                        NEXIO
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-[1.5px] w-10" style={{ background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.3), transparent)' }} />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: 'var(--accent-blue)' }}>Sign In to Dashboard</p>
                        <div className="h-[1.5px] w-10" style={{ background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.3), transparent)' }} />
                    </div>
                </div>

                {error && (
                    <div className="mb-5 p-3 rounded-xl text-sm text-center font-medium" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: 'var(--text-secondary)' }}>Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" size={18} style={{ color: 'var(--text-tertiary)' }} />
                            <input
                                type="email"
                                className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold focus:outline-none transition-all"
                                style={{
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)',
                                }}
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Password</label>
                            <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest transition-colors" style={{ color: 'var(--accent-blue)' }}>Forgot?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" size={18} style={{ color: 'var(--text-tertiary)' }} />
                            <input
                                type="password"
                                className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold focus:outline-none transition-all"
                                style={{
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)',
                                }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                        style={{ background: 'var(--accent-blue)', color: '#ffffff', boxShadow: '0 10px 30px rgba(59,130,246,0.25)' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In →'}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full" style={{ borderTop: '1px solid var(--border)' }} />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest px-4">
                        <span className="px-4" style={{ background: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>or continue with</span>
                    </div>
                </div>

                {/* Google Login — fully restored */}
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google login failed. Please try again.')}
                        theme="outline"
                        shape="pill"
                        width="100%"
                        text="signin_with"
                        logo_alignment="left"
                    />
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                        No account?{' '}
                        <Link to="/register" className="font-black underline underline-offset-4 decoration-2" style={{ color: 'var(--accent-blue)' }}>
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
