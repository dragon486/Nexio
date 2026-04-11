import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const DateFilter = ({ onChange, value }) => {
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        { label: 'Last 7 Days', value: '7D' },
        { label: 'Last 30 Days', value: '30D' },
        { label: 'Last 90 Days', value: '90D' },
        { label: 'All Time', value: 'ALL' }
    ];

    const currentLabel = options.find(opt => opt.value === value)?.label || 'Select Range';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl text-sm font-semibold hover:border-blue-500 transition-all transition-colors duration-200 shadow-sm active:scale-95"
            >
                <Calendar size={16} className="text-blue-500" />
                <span>{currentLabel}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${
                                    value === option.value ? 'text-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'text-foreground'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DateFilter;
