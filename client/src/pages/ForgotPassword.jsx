import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, ArrowLeft, CheckCircle, ShieldQuestion, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            await api.post('/auth/forgot-password', { email });
            setStatus('success');
        } catch (error) {
            setStatus('error');
            const serverMessage = error.response?.data?.message || error.response?.data?.error;
            setErrorMessage(serverMessage || 'Something went wrong. Please check your connection or try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-10 blur-[120px]" style={{ background: 'var(--accent-blue)' }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-10 blur-[120px]" style={{ background: 'var(--success-green)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md relative z-10 p-8 md:p-12 backdrop-blur-3xl rounded-[32px] overflow-hidden"
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
            >
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-white/5 border border-white/10 shadow-inner">
                        <ShieldQuestion size={32} style={{ color: 'var(--accent-blue)' }} />
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                        RECOVERY
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--text-tertiary)' }}>
                        Restore Access Hierarchy
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-6"
                        >
                            <div className="p-6 rounded-2xl border bg-emerald-500/5" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
                                <CheckCircle size={40} className="mx-auto mb-4 text-emerald-500" />
                                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Protocol Initiated</h3>
                                <p className="text-[11px] font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    A high-priority recovery link has been dispatched to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>. Please check your inbox.
                                </p>
                            </div>
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 px-6 py-3 rounded-xl"
                                style={{ background: 'var(--accent-blue)', color: '#fff' }}
                            >
                                <ArrowLeft size={14} /> Resume Authentication
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleSubmit} 
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--text-tertiary)' }}>Account Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={16} style={{ color: 'var(--text-tertiary)' }} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all border shadow-inner"
                                        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                        placeholder="operator@nexus.ai"
                                        required
                                    />
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 text-center animate-shake">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="space-y-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xl"
                                    style={{ background: 'var(--accent-blue)', color: '#ffffff', boxShadow: '0 10px 30px rgba(59,130,246,0.3)' }}
                                >
                                    {status === 'loading' ? 'PROCESSING...' : (
                                        <>
                                            SEND RECOVERY LINK <ArrowRight size={14} />
                                        </>
                                    )}
                                </button>
                                
                                <Link 
                                    to="/login" 
                                    className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-70 pt-2"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Cancel & Return
                                </Link>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
