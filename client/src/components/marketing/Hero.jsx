import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import DashboardPreview from './DashboardPreview';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-sm"
                >
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>Now with WhatsApp Integration</span>
                    <ArrowRight size={14} className="text-gray-500" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
                >
                    Your AI Sales Brain.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400 animate-gradient-x">
                        Fully Automated Revenue.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Arlo.ai replaces human sales follow-ups with intelligent AI agents that qualify, nurture, and convert your leads — 24/7.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <Link to="/register">
                        <Button className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200 border-none rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all">
                            Start Free Trial
                        </Button>
                    </Link>
                    <Link to="/demo">
                        <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 hover:bg-white/5 gap-2 group">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play size={14} fill="currentColor" />
                            </div>
                            View Live Demo
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-20"
                >
                    <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> No credit card required</div>
                    <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> 14-day free trial</div>
                    <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> Cancel anytime</div>
                </motion.div>

                {/* Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.5, type: "spring" }}
                    className="relative mx-auto max-w-5xl perspective-1000"
                >
                    <div className="relative rounded-xl border border-white/10 bg-[#0A0A0A]/50 backdrop-blur-xl shadow-2xl overflow-hidden group">
                        {/* Browser Bar */}
                        <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 mix-blend-screen" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 mix-blend-screen" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 mix-blend-screen" />
                            </div>
                            <div className="bg-black/20 px-3 py-1 rounded text-[10px] text-gray-500 font-mono ml-4 flex-1 text-center">
                                app.arlo.ai/dashboard
                            </div>
                        </div>
                        {/* Use an image or a simplified dashboard component here */}
                        <div className="relative aspect-video bg-[#050505] flex overflow-hidden">
                            {/* Mock Sidebar */}
                            <div className="w-16 md:w-20 border-r border-white/5 bg-white/5 flex flex-col items-center py-4 gap-4">
                                <div className="w-8 h-8 rounded-lg bg-primary/20" />
                                <div className="w-6 h-6 rounded-md bg-white/10 mt-4" />
                                <div className="w-6 h-6 rounded-md bg-white/5" />
                                <div className="w-6 h-6 rounded-md bg-white/5" />
                            </div>

                            {/* Mock Content */}
                            <div className="flex-1 flex flex-col">
                                {/* Mock Header */}
                                <div className="h-12 border-b border-white/5 flex items-center justify-between px-4">
                                    <div className="w-32 h-4 rounded-full bg-white/10" />
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white/5" />
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20" />
                                    </div>
                                </div>

                                <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-hidden relative">
                                    {/* Mock KPI Row */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-24 rounded-xl bg-white/5 border border-white/5 p-3 flex flex-col justify-between">
                                                <div className="w-6 h-6 rounded bg-white/10" />
                                                <div className="space-y-1">
                                                    <div className="w-16 h-4 rounded bg-white/10" />
                                                    <div className={`w-8 h-2 rounded ${i === 1 ? 'bg-green-500/50' : 'bg-white/5'}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mock Chart Area */}
                                    <div className="flex-1 rounded-xl bg-white/5 border border-white/5 p-4 relative overflow-hidden flex flex-col">
                                        <div className="flex justify-between mb-8">
                                            <div className="space-y-2">
                                                <div className="w-24 h-5 rounded bg-white/10" />
                                                <div className="w-16 h-3 rounded bg-white/5" />
                                            </div>
                                            <div className="w-20 h-8 rounded-lg bg-primary/20" />
                                        </div>
                                        <div className="flex-1 flex items-end gap-2 opacity-50">
                                            {[40, 60, 45, 70, 50, 80, 65, 85, 90, 75, 60, 95].map((h, i) => (
                                                <div key={i} className="flex-1 bg-gradient-to-t from-primary/50 to-primary/0 rounded-t-sm" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Glow Effects */}
                                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
                                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                                </div>
                            </div>

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-50" />
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -left-10 top-1/3 p-4 bg-[#0F0F12]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-w-xs text-left"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><CheckCircle size={16} /></div>
                            <div>
                                <div className="text-white text-sm font-bold">New Lead Qualified</div>
                                <div className="text-gray-500 text-xs">Just now via WhatsApp</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -right-10 bottom-1/3 p-4 bg-[#0F0F12]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-w-xs text-left"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500"><ArrowRight size={16} /></div>
                            <div>
                                <div className="text-white text-sm font-bold">Meeting Booked</div>
                                <div className="text-gray-500 text-xs text-green-400">+$2,500 Potential Value</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
