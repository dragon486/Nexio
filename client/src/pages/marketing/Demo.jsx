import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, CheckCircle, Smartphone, Mail, MessageSquare } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';

// Mock Conversation Data
const DEMO_SCENARIO = [
    { type: 'lead', text: "Hi, I'm interested in the premium plan. What's the pricing?", delay: 1000 },
    { type: 'ai', text: "Hi! Thanks for reaching out. Our Premium plan is $149/mo and includes unlimited AI agents. Since you're looking to scale, how many leads are you currently handling per month?", delay: 3000 },
    { type: 'lead', text: "About 500 leads right now.", delay: 5000 },
    { type: 'ai', text: "Great! For 500 leads, Arlo can save you ~40 hours of manual follow-up work.\n\nWould you like to see a quick personalized demo of how it works?", delay: 8000 },
    { type: 'lead', text: "Yes, that sounds good.", delay: 10000 },
    { type: 'ai', text: "Perfect. I've sent a calendar invite to your email. Talk soon! 🚀", delay: 12000 },
];

const Demo = () => {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timeouts = [];

        // Reset
        setMessages([]);
        setProgress(0);

        // Run Scenario
        DEMO_SCENARIO.forEach(({ type, text, delay }) => {
            // Typing indicator before AI message
            if (type === 'ai') {
                timeouts.push(setTimeout(() => setIsTyping(true), delay - 1500));
            }

            timeouts.push(setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, { type, text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

                if (type === 'ai') {
                    setProgress(prev => Math.min(prev + 30, 100));
                }
            }, delay));
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">

                {/* Left: Context / Lead Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="text-left mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 mb-4 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-blue-500" /> Live Simulation
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">See Arlo in action.</h1>
                        <p className="text-gray-400">Arlo qualifies leads automatically across WhatsApp, Email, & SMS.</p>
                    </div>

                    <GlassCard className="p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Lead Profile</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xl font-bold text-white">
                                JD
                            </div>
                            <div>
                                <div className="text-white font-bold">John Doe</div>
                                <div className="text-sm text-gray-500">Real Estate Investor</div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Mail size={16} className="text-gray-500" /> john@example.com
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Smartphone size={16} className="text-gray-500" /> +1 (555) 0123
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <MessageSquare size={16} className="text-blue-400" /> Source: WhatsApp
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/5">
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">AI Analysis</h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-300">Lead Score</span>
                                <span className={`font-bold ${progress > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{progress}/100</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ width: `${progress}%` }}
                                    className={`h-full ${progress > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Right: Conversation Simulator */}
                <GlassCard className="lg:col-span-2 relative flex flex-col overflow-hidden h-full border-primary/20 bg-[#0A0A0A]/80">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                <Bot size={18} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Arlo AI Agent</div>
                                <div className="text-xs text-green-400">Online • Replying</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">SESSION ID: #8X92</div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <AnimatePresence>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[80%] rounded-2xl p-4 ${msg.type === 'ai'
                                            ? 'bg-white/10 text-gray-200 rounded-tl-none'
                                            : 'bg-primary text-white rounded-tr-none'
                                        }`}>
                                        <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
                                        <div className={`text-[10px] mt-2 opacity-50 ${msg.type === 'ai' ? 'text-left' : 'text-right'}`}>
                                            {msg.timestamp}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-75" />
                                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-150" />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Input Simulation */}
                    <div className="p-4 border-t border-white/5 bg-white/5 pointer-events-none opacity-50">
                        <div className="flex gap-2">
                            <div className="flex-1 h-10 bg-black/20 rounded-lg border border-white/10 flex items-center px-4 text-sm text-gray-500">
                                AI is handling this conversation...
                            </div>
                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                                <Send size={18} />
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Demo;
