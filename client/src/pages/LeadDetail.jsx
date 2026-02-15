
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import {
    User, Mail, Phone, Calendar, ArrowLeft,
    MessageSquare, Send, Sparkles, AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const fetchLead = async () => {
        try {
            const res = await api.get(`/leads/${id}`);
            setLead(res.data);
        } catch (error) {
            console.error("Failed to load lead", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLead();
    }, [id]);

    const handleGenerateFollowup = async () => {
        setGenerating(true);
        try {
            const res = await api.post(`/leads/${id}/generate-followup`);
            setLead(res.data);
        } catch (error) {
            console.error("Failed to generate", error);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading lead...</div>;
    if (!lead) return <div className="p-8 text-white">Lead not found</div>;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                        Added {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })} • <span className="capitalize">{lead.source}</span>
                    </p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" className="text-red-400 border-red-500/20 hover:bg-red-500/10">Archive</Button>
                    <Button variant="primary" onClick={handleGenerateFollowup} disabled={generating}>
                        {generating ? <><Sparkles className="animate-spin mr-2" size={16} /> Thinking...</> : <><Sparkles className="mr-2" size={16} /> Generate Follow-up</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Col: Profile & Context */}
                <div className="space-y-6">
                    <GlassCard>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-2xl font-bold text-white border border-white/10">
                                {lead.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">{lead.name}</h2>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                                        lead.status === 'qualified' ? 'bg-green-500/20 text-green-400' :
                                            'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {lead.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <Mail size={16} className="text-gray-500" />
                                <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">{lead.email}</a>
                            </div>
                            {lead.phone && (
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Phone size={16} className="text-gray-500" />
                                    <span>{lead.phone}</span>
                                </div>
                            )}
                            <div className="border-t border-white/10 pt-4 mt-4">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Original Inquiry</h3>
                                <p className="text-sm text-gray-300 italic">"{lead.message}"</p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* AI Analysis Card */}
                    <GlassCard className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Sparkles size={80} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles size={18} className="text-purple-400" /> AI Intelligence
                        </h3>

                        <div className="flex items-center justify-between mb-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                    {lead.aiScore}
                                </div>
                                <div className="text-xs text-gray-500">Lead Score</div>
                            </div>
                            <div className="h-10 w-[1px] bg-white/10" />
                            <div className="text-center">
                                <div className={`text-xl font-bold capitalize ${lead.aiPriority === 'high' ? 'text-red-400' :
                                        lead.aiPriority === 'medium' ? 'text-yellow-400' :
                                            'text-blue-400'
                                    }`}>
                                    {lead.aiPriority}
                                </div>
                                <div className="text-xs text-gray-500">Priority</div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <h4 className="text-xs font-bold text-gray-400 mb-1">AI Reasoning</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {lead.aiNotes || "AI has not analyzed this lead yet."}
                            </p>
                        </div>
                    </GlassCard>
                </div>

                {/* Center & Right: Conversation & Actions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Conversation Memory */}
                    <GlassCard className="min-h-[500px] flex flex-col">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <MessageSquare size={18} className="text-blue-400" /> Conversation Memory
                            </h3>
                            {lead.memorySummary && (
                                <span className="text-xs text-gray-500 max-w-xs text-right truncate" title={lead.memorySummary}>
                                    🧠 Context: {lead.memorySummary}
                                </span>
                            )}
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto mb-4 custom-scrollbar pr-2 max-h-[600px]">
                            {/* Original Message */}
                            <div className="flex justify-start">
                                <div className="max-w-[80%] bg-surface border border-white/10 rounded-2xl rounded-tl-none p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-gray-400">{lead.name}</span>
                                        <span className="text-[10px] text-gray-600">{formatDistanceToNow(new Date(lead.createdAt))} ago</span>
                                    </div>
                                    <p className="text-gray-200 text-sm whitespace-pre-wrap">{lead.message}</p>
                                </div>
                            </div>

                            {/* History Items */}
                            {lead.conversationHistory?.map((item, i) => {
                                const isAI = item.role === 'model' || item.role === 'assistant';
                                let content = item.content;

                                // Parse JSON content if AI response
                                let aiData = null;
                                if (isAI) {
                                    try {
                                        aiData = JSON.parse(item.content);
                                        content = aiData.email || aiData.whatsapp || "Generated Content";
                                    } catch (e) { /* Content is plain text */ }
                                }

                                return (
                                    <div key={i} className={`flex ${isAI ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl p-4 ${isAI
                                                ? 'bg-primary/10 border border-primary/20 rounded-tr-none'
                                                : 'bg-surface border border-white/10 rounded-tl-none'
                                            }`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-bold ${isAI ? 'text-primary' : 'text-gray-400'}`}>
                                                    {isAI ? 'Arlo AI' : lead.name}
                                                </span>
                                                {item.timestamp && (
                                                    <span className="text-[10px] text-gray-600">
                                                        {formatDistanceToNow(new Date(item.timestamp))} ago
                                                    </span>
                                                )}
                                            </div>

                                            {aiData ? (
                                                <div className="space-y-3">
                                                    {aiData.email && (
                                                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                                            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider flex items-center gap-1"><Mail size={10} /> Email Draft</div>
                                                            <p className="text-sm text-gray-200 whitespace-pre-wrap">{aiData.email}</p>
                                                            <div className="mt-2 flex gap-2">
                                                                <button className="text-xs bg-primary hover:bg-primary/80 text-white px-2 py-1 rounded transition-colors">Send Now</button>
                                                                <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors">Edit</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {aiData.whatsapp && (
                                                        <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/10">
                                                            <div className="text-xs text-green-400 mb-1 uppercase tracking-wider flex items-center gap-1"><MessageSquare size={10} /> WhatsApp</div>
                                                            <p className="text-sm text-gray-200 whitespace-pre-wrap">{aiData.whatsapp}</p>
                                                        </div>
                                                    )}
                                                    {aiData.salesFollowup && (
                                                        <div className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/10">
                                                            <div className="text-xs text-yellow-400 mb-1 uppercase tracking-wider flex items-center gap-1"><AlertCircle size={10} /> Sales Tips</div>
                                                            <p className="text-sm text-gray-200 whitespace-pre-wrap">{aiData.salesFollowup}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-200 text-sm whitespace-pre-wrap">{content}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Type a note or reply..."
                                className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                <Send size={16} />
                            </button>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;
