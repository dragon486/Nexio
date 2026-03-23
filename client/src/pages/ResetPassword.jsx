import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import Button from '../components/ui/Button';
import api from '../services/api';
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords don't match");
            setStatus('error');
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters");
            setStatus('error');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            await api.put(`/auth/reset-password/${token}`, { password });
            setStatus('success');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Invalid or expired token.');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Professional Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#3b82f6]/10 blur-[180px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#10b981]/10 blur-[180px] rounded-full animate-pulse-slow" />
            </div>

            <div className="w-full max-w-md relative z-10 p-10 bg-white/80 dark:bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-[24px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-[#e5e7eb] dark:border-[#2a2a2a] transition-all duration-500">
                {status !== 'success' && (
                    <Link to="/login" className="inline-flex items-center text-[10px] font-black text-[#64748b] dark:text-[#94a3b8] hover:text-[#3b82f6] transition-all mb-8 group uppercase tracking-[0.2em]">
                        <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Authorization
                    </Link>
                )}

                <div className="mb-10">
                    <h1 className="text-4xl font-black text-[#0f172a] dark:text-[#f8fafc] italic tracking-tight mb-3 uppercase">Security</h1>
                    <p className="text-[#64748b] dark:text-[#94a3b8] text-xs font-bold leading-relaxed uppercase tracking-wider">Initialize credential restoration sequence.</p>
                </div>

                {status === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-xl p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={32} className="text-green-500" />
                        </div>
                        <h3 className="text-foreground font-bold text-lg mb-2">Password Reset!</h3>
                        <p className="text-sm text-muted-foreground font-medium mb-6">Your password has been successfully updated.</p>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Redirecting to Login</p>
                        </div>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-amber-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#fafafa] dark:bg-[#0f0f0f] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl py-3.5 pl-11 pr-4 text-[#0f172a] dark:text-[#f8fafc] placeholder:text-[#94a3b8]/40 focus:outline-none focus:ring-4 focus:ring-[#3b82f6]/10 focus:border-[#3b82f6]/50 transition-all font-bold text-sm shadow-inner"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Confirm New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-amber-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#fafafa] dark:bg-[#0f0f0f] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl py-3.5 pl-11 pr-4 text-[#0f172a] dark:text-[#f8fafc] placeholder:text-[#94a3b8]/40 focus:outline-none focus:ring-4 focus:ring-[#3b82f6]/10 focus:border-[#3b82f6]/50 transition-all font-bold text-sm shadow-inner"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 flex items-center gap-2">
                                <AlertCircle size={16} />
                                {errorMessage}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full h-14 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'SECURING ACCOUNT...' : 'REESTABLISH AUTHORIZATION'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
