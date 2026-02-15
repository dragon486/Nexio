import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, MessageSquare, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

const LeadFeed = ({ leads }) => {
    const navigate = useNavigate();

    if (!leads || leads.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p className="animate-pulse">Waiting for new leads...</p>
                <p className="text-xs mt-2">Your AI is on standby 🤖</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {leads.map((lead, index) => (
                <motion.div
                    key={lead._id}
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${lead.aiPriority === 'high' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            <User size={18} />
                        </div>
                        <div>
                            <h4 className="font-medium text-white group-hover:text-primary transition-colors">{lead.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="capitalize">{lead.status}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={10} />
                                    {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-lg">
                            <Star size={14} fill="currentColor" />
                            <span className="text-xs font-bold">{lead.aiScore}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default LeadFeed;
