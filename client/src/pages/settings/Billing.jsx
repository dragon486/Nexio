import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { CreditCard, CheckCircle, Zap, Shield } from 'lucide-react';

const Billing = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Subscription & Billing</h2>
                <p className="text-gray-400">Manage your plan, payment methods, and invoices.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Plan */}
                <GlassCard className="border-primary/20 bg-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Zap size={100} className="text-primary/20 -rotate-12 translate-x-4 -translate-y-4" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Pro Plan</h3>
                                <p className="text-xs text-primary font-bold uppercase tracking-wider">Active</p>
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-white mb-6">
                            $49<span className="text-lg text-gray-400 font-medium">/month</span>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {[
                                'Unlimited AI Leads',
                                'Advanced Analytics',
                                'Priority Support',
                                'Custom Integrations'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                    <CheckCircle size={16} className="text-green-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-3">
                            <Button variant="primary" className="w-full justify-center">Manage Subscription</Button>
                        </div>
                    </div>
                </GlassCard>

                {/* Payment Method */}
                <GlassCard>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CreditCard size={18} className="text-blue-400" /> Payment Method
                    </h3>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                                <span className="font-bold text-xs">VISA</span>
                            </div>
                            <div>
                                <p className="text-sm text-white font-medium">•••• •••• •••• 4242</p>
                                <p className="text-xs text-gray-500">Expires 12/2028</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded">Default</span>
                    </div>

                    <Button variant="outline" className="w-full justify-center">Update Payment Method</Button>
                </GlassCard>
            </div>

            {/* Invoices */}
            <GlassCard>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Invoice History</h3>
                    <Button variant="ghost" size="sm">Download All</Button>
                </div>

                <div className="space-y-1">
                    {[
                        { date: 'Oct 01, 2023', amount: '$49.00', status: 'Paid' },
                        { date: 'Sep 01, 2023', amount: '$49.00', status: 'Paid' },
                        { date: 'Aug 01, 2023', amount: '$49.00', status: 'Paid' },
                    ].map((inv, i) => (
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                                    <Shield size={16} />
                                </div>
                                <div>
                                    <p className="text-sm text-white font-medium">Invoice #{2023001 + i}</p>
                                    <p className="text-xs text-gray-500">{inv.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-white font-medium">{inv.amount}</span>
                                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase rounded">{inv.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export default Billing;
