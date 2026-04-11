import React, { useState } from 'react';
import { Users, Mail, Shield, Trash2, Plus, CheckCircle2, Clock, MoreVertical, Search, Smartphone, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_MEMBERS = [
    { id: 1, name: 'Adel Muhammed', email: 'adelmuhammed786@gmail.com', role: 'Owner', status: 'active', avatar: 'AM', color: 'bg-blue-600' },
    { id: 2, name: 'Jessica Chen', email: 'jessica@nexio.ai', role: 'Admin', status: 'active', avatar: 'JC', color: 'bg-violet-600' },
    { id: 3, name: 'Irfan Khan', email: 'irfan@nexus.com', role: 'Member', status: 'pending', avatar: 'IK', color: 'bg-amber-600' },
];

const Team = () => {
    const [members, setMembers] = useState(MOCK_MEMBERS);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInvite = (e) => {
        e.preventDefault();
        if (!inviteEmail) return;
        setInviting(true);
        
        // Simulate API call
        setTimeout(() => {
            const newMember = {
                id: Date.now(),
                name: inviteEmail.split('@')[0],
                email: inviteEmail,
                role: 'Member',
                status: 'pending',
                avatar: inviteEmail.charAt(0).toUpperCase(),
                color: 'bg-gray-600'
            };
            setMembers([...members, newMember]);
            setInviteEmail('');
            setInviting(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1200);
    };

    const removeMember = (id) => {
        if (window.confirm('Are you sure you want to remove this member?')) {
            setMembers(members.filter(m => m.id !== id));
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[#12131a] mb-2">
                        Team <span className="text-blue-500">Management</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic opacity-70">
                        Authorize nodes • Manage access levels • Shared intelligence
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {members.map(m => (
                            <div key={m.id} className={cn("w-9 h-9 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xl", m.color)}>
                                {m.avatar}
                            </div>
                        ))}
                    </div>
                    <div className="h-10 w-px bg-gray-200" />
                    <div className="text-right">
                        <div className="text-[12px] font-black text-[#12131a] uppercase italic">{members.length} Active Nodes</div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Full Sync Active</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Invite Card */}
                <div className="lg:col-span-1">
                    <div className="bg-[#12131a] rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                             <Plus size={140} className="text-blue-500" strokeWidth={3} />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                    <Mail size={18} className="text-blue-500" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">Invite New Node</h3>
                            </div>

                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 italic">Intelligence Email</label>
                                    <input 
                                        type="email" 
                                        placeholder="node@intelligence.ai"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-[20px] px-5 py-4 text-[12px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-bold placeholder:text-gray-600"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={inviting || !inviteEmail}
                                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-[20px] py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 italic"
                                >
                                    {inviting ? (
                                        <>
                                            <Clock size={16} className="animate-spin" /> Authorizing...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} strokeWidth={3} /> Send Invitation
                                        </>
                                    )}
                                </button>
                            </form>

                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-[20px] flex items-center gap-3"
                                    >
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        <p className="text-[10px] font-black text-emerald-500 uppercase italic">Invitation Transmitted Successfully</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <div className="mt-8 pt-8 border-t border-white/5">
                                 <div className="flex items-center gap-3 opacity-50">
                                      <Shield size={14} className="text-blue-400" />
                                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.1em] italic leading-relaxed">
                                          Roles can be modified after the node accepts the synchronization request.
                                      </p>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Member List */}
                <div className="lg:col-span-2">
                    <div className="bg-white border-2 border-gray-100 rounded-[32px] p-4 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-4 mb-4">
                            <div className="relative flex-1 max-w-xs">
                                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="SEARCH NODES..."
                                    className="w-full bg-gray-50 rounded-[20px] pl-10 pr-4 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">
                                <Globe size={14} className="text-blue-500" /> Global Sync: Active
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-gray-50">
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Intelligence Node</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Role</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Sync Auth</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {members.map((member) => (
                                        <tr key={member.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-[12px] font-black text-white shadow-lg", member.color)}>
                                                        {member.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-black text-[#12131a] uppercase italic leading-tight">{member.name}</div>
                                                        <div className="text-[10px] font-medium text-gray-400 mt-0.5">{member.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic",
                                                    member.role === 'Owner' ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                                                )}>
                                                    <Shield size={10} strokeWidth={3} /> {member.role}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={cn(
                                                    "flex items-center gap-2 text-[10px] font-black uppercase italic tracking-widest",
                                                    member.status === 'active' ? "text-emerald-500" : "text-amber-500"
                                                )}>
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", member.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                                                    {member.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2.5 rounded-xl hover:bg-blue-50 text-blue-500 transition-all border border-transparent hover:border-blue-100">
                                                        <Smartphone size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => removeMember(member.id)}
                                                        disabled={member.role === 'Owner'}
                                                        className={cn(
                                                            "p-2.5 rounded-xl transition-all border border-transparent",
                                                            member.role === 'Owner' ? "opacity-20 cursor-not-allowed" : "hover:bg-red-50 text-red-500 hover:border-red-100"
                                                        )}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
