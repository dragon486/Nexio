import React from 'react';

import Button from '../../components/ui/Button';
import { CreditCard, CheckCircle, Zap, Shield } from 'lucide-react';

const Billing = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#0f172a] dark:text-[#f8fafc] mb-2 tracking-tight">Subscription & Billing</h2>
                <p className="text-[#64748b] dark:text-[#94a3b8] font-medium">Manage your plan, payment methods, and invoices.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Plan */}
                <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#3b82f6]/20 rounded-[12px] p-8 shadow-sm relative overflow-hidden bg-blue-50 dark:bg-blue-500/5 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Zap size={100} className="text-primary/20 -rotate-12 translate-x-4 -translate-y-4" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#0f172a] dark:text-[#f8fafc]">Pro Plan</h3>
                                <p className="text-xs text-[#3b82f6] font-bold uppercase tracking-wider">Active</p>
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-[#0f172a] dark:text-[#f8fafc] mb-6">
                            $49<span className="text-lg text-[#64748b] dark:text-[#94a3b8] font-medium">/month</span>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {[
                                'Unlimited AI Leads',
                                'Advanced Analytics',
                                'Priority Support',
                                'Custom Integrations'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-[#0f172a] dark:text-[#f8fafc] font-medium">
                                    <CheckCircle size={16} className="text-[#10b981]" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-3">
                            <Button variant="primary" className="w-full justify-center">Manage Subscription</Button>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[12px] p-8 shadow-sm transition-all duration-300">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-[#f8fafc] mb-4 flex items-center gap-2">
                        <CreditCard size={18} className="text-[#3b82f6]" /> Payment Method
                    </h3>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-[#fafafa] dark:bg-[#1a1a1a] rounded border border border-[#e5e7eb] dark:border-[#2a2a2a] flex items-center justify-center">
                                <span className="font-bold text-[10px] text-[#64748b]">VISA</span>
                            </div>
                            <div>
                                <p className="text-sm text-[#0f172a] dark:text-[#f8fafc] font-bold">•••• •••• •••• 4242</p>
                                <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">Expires 12/2028</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded">Default</span>
                    </div>

                    <Button variant="outline" className="w-full justify-center">Update Payment Method</Button>
                </div>
            </div>

            {/* Invoices */}
            <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-[12px] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-[#f8fafc]">Invoice History</h3>
                    <Button variant="ghost" size="sm" className="text-[#3b82f6] font-bold">Download All</Button>
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
            </div>
        </div>
    );
};

export default Billing;
