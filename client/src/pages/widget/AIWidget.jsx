import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, X, MessageSquare, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AIWidget = () => {
    const { key } = useParams();
    
    const [expanded, setExpanded] = useState(false);
    const [config, setConfig] = useState(null);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [leadId, setLeadId] = useState(null);
    const messagesEndRef = useRef(null);

    // Initial load - get config
    useEffect(() => {
        if (!key) return;
        api.get(`/widget/config`, { headers: { 'x-public-key': key } })
            .then(res => {
                setConfig(res.data);
                // Preload the welcome message from config
                setChatHistory([
                    { role: 'model', content: res.data.welcomeMessage }
                ]);
            })
            .catch(err => {
                console.error("Widget initialization failed:", err);
            });
    }, [key]);

    // Send iframe resize events to parent
    useEffect(() => {
        const height = expanded ? 600 : 80;
        const width = expanded ? 380 : 320;
        
        window.parent.postMessage(JSON.stringify({
            type: 'ARLO_WIDGET_RESIZE',
            height,
            width,
            expanded
        }), '*'); // Using '*' since we serve on unknown client domains
    }, [expanded]);

    // Auto-scroll chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const handleSend = async () => {
        if (!message.trim() || !key) return;
        
        const text = message;
        setMessage('');
        setChatHistory(prev => [...prev, { role: 'user', content: text }]);
        setLoading(true);

        try {
            const res = await api.post('/widget/chat', {
                message: text,
                leadId: leadId
            }, {
                headers: { 'x-public-key': key }
            });

            if (res.data.leadId) setLeadId(res.data.leadId);
            setChatHistory(prev => [...prev, { role: 'model', content: res.data.reply }]);
            
        } catch {
            setChatHistory(prev => [...prev, { 
                role: 'model', 
                content: "I'm having a little trouble connecting. Please try again later." 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    if (!config) return null; // Wait for config

    return (
        <div className="w-full h-full flex flex-col justify-end items-end p-2 bg-transparent font-sans">
            <AnimatePresence>
                {expanded && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#12131a] w-full h-[500px] mb-4 rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#1a1b23]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: config.color }}>
                                    {config.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-semibold tracking-tight">{config.name} AI</h3>
                                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setExpanded(false)}
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                            {chatHistory.map((chat, idx) => (
                                <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div 
                                        className={`max-w-[85%] text-sm leading-relaxed p-4 rounded-2xl ${
                                            chat.role === 'user' 
                                                ? 'bg-blue-600 text-white rounded-br-sm' 
                                                : 'bg-white/10 text-gray-200 rounded-bl-sm'
                                        }`}
                                    >
                                        {chat.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 text-gray-400 p-4 rounded-2xl rounded-bl-sm flex gap-1 items-center h-auto">
                                        <Loader2 size={16} className="animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Input Pill (Mimicking the Screenshot) */}
            <motion.div 
                layout
                onClick={() => !expanded && setExpanded(true)}
                className={`w-full bg-[#12131a] rounded-[40px] border border-white/10 shadow-2xl flex items-center gap-3 p-2 relative overflow-hidden group cursor-text
                    ${expanded ? 'h-[70px]' : 'h-[70px] hover:bg-[#1a1b23] hover:scale-[1.02] transition-all'}`}
            >
                {/* Branding matching the image */}
                {!expanded && chatHistory.length === 1 && (
                     <div className="absolute -top-24 left-0 w-full bg-[#202128] border border-white/5 p-4 rounded-3xl text-gray-300 text-sm font-medium shadow-xl">
                         {config.welcomeMessage}
                     </div>
                )}

                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 shrink-0 mx-1 group-hover:text-blue-400 transition-colors">
                    {expanded ? <Mic size={20} /> : <MessageSquare size={20} />}
                </div>
                
                <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    readOnly={!expanded}
                    className="flex-1 bg-transparent text-white placeholder-gray-500 font-medium text-base outline-none cursor-text disabled:opacity-50"
                />

                {expanded && message.trim() && (
                    <button 
                        onClick={handleSend}
                        disabled={loading}
                        className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 mx-1 hover:bg-blue-500 transition-colors disabled:opacity-50"
                    >
                        <Send size={18} className="translate-x-0.5" />
                    </button>
                )}
            </motion.div>
            
            {expanded && (
                <div className="w-full text-center mt-3 mb-1">
                    <p className="text-[10px] text-gray-500 font-medium">Powered by <strong className="text-white">NEXIO</strong></p>
                </div>
            )}
        </div>
    );
};

export default AIWidget;
