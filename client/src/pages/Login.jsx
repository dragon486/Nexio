import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { login, googleLogin } from '../services/authService';
import { Lock, Mail } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            if (data.business && !data.business.onboardingCompleted) {
                navigate('/onboarding');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/[0.03] blur-[150px] rounded-full" />
            </div>

            <GlassCard className="w-full max-w-md relative z-10 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white italic drop-shadow-glow tracking-tighter mb-2">
                        Arlo.ai
                    </h1>
                    <p className="text-[10px] text-muted font-black uppercase tracking-widest">Sign in to your business cockpit</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-3">
                        Sign In
                    </Button>
                </form>

                <div className="mt-4">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const data = await googleLogin(credentialResponse.credential);
                                    if (data.business && !data.business.onboardingCompleted) {
                                        navigate('/onboarding');
                                    } else {
                                        navigate('/dashboard');
                                    }
                                } catch (err) {
                                    setError('Google Login Failed');
                                }
                            }}
                            onError={() => {
                                setError('Google Login Failed');
                            }}
                            theme="filled_black"
                            shape="pill"
                            width="100%"
                        />
                    </div>
                </div>

                <div className="mt-6 text-center text-[10px] text-muted font-black uppercase tracking-widest space-y-2">
                    <p>Don't have an account? <Link to="/register" className="text-white hover:text-zinc-300 transition-colors underline underline-offset-4">Sign Up</Link></p>
                    <p className="opacity-50 tracking-[0.2em] pt-2">Demo: demo@arlo.ai / demo</p>
                </div>
            </GlassCard>
        </div>
    );
};

export default Login;
