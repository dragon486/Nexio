import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, GitBranch, Zap, BarChart2, Link2,
    Bell, MessageSquare, Settings, Search,
    ChevronRight, TrendingUp, TrendingDown, Info, Download,
    Filter, Plus, Lock, Database, CheckCircle, ArrowUpRight,
    Target, Calendar, Clock, Star
} from 'lucide-react';

// ── DESIGN TOKENS — always dark (dashboard is always dark) ────────────────────
const T = {
    bg: '#0a0a0a',
    sidebar: '#0f1115',
    card: '#1a1c23',
    border: 'rgba(255,255,255,0.05)',
    borderLight: 'rgba(255,255,255,0.08)',
    text: '#f8fafc',
    textSec: '#94a3b8',
    textTer: 'rgba(255,255,255,0.25)',
    blue: '#3b82f6',
    green: '#10b981',
    amber: '#f59e0b',
    violet: '#8b5cf6',
};

// ── MICRO CHARTS ──────────────────────────────────────────────────────────────
const Sparkline = ({ data = [], color = T.blue, h = 36, w = 64 }) => {
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true">
            <polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const GaugeArc = ({ value = 82, size = 140 }) => {
    const r = (size - 20) / 2;
    const cx = size / 2, cy = size / 2 + 18;
    const toRad = (d) => (d * Math.PI) / 180;
    const arc = (a) => [cx + r * Math.cos(toRad(a)), cy + r * Math.sin(toRad(a))];
    const lA = (s, e) => (e - s > 180 ? 1 : 0);
    const sA = -200, eA = 20;
    const fA = (value / 100) * (eA - sA) + sA;
    const [sx, sy] = arc(sA), [ex, ey] = arc(eA), [fx, fy] = arc(fA);
    return (
        <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`} aria-hidden="true">
            <path d={`M${sx},${sy} A${r},${r} 0 ${lA(sA,eA)} 1 ${ex},${ey}`} stroke="rgba(255,255,255,0.06)" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d={`M${sx},${sy} A${r},${r} 0 ${lA(sA,fA)} 1 ${fx},${fy}`} stroke={T.blue} strokeWidth="9" strokeLinecap="round" fill="none" />
        </svg>
    );
};

const MiniBar = ({ values = [], accent = T.blue }) => {
    const max = Math.max(...values, 1);
    const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
    return (
        <div className="h-24 flex items-end gap-1" aria-hidden="true">
            {values.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full rounded-sm" style={{ height: `${(v / max) * 80}%`, minHeight: '3px', background: i === 3 ? accent : 'rgba(255,255,255,0.07)' }} />
                    <span className="text-[6px]" style={{ color: T.textTer }}>{months[i]}</span>
                </div>
            ))}
        </div>
    );
};

const HeatGrid = () => {
    const rows = [[2,1,2,1,3,2,1],[3,4,3,5,4,2,1],[2,3,4,4,3,5,3]];
    const labels = ['12AM–8AM','8AM–4PM','4PM–12AM'];
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const col = (v) => `rgba(59,130,246,${[0.08,0.2,0.4,0.65,0.9][v-1]})`;
    return (
        <div aria-hidden="true">
            <div className="flex gap-1 mb-1 pl-[52px]">
                {days.map(d => <div key={d} className="flex-1 text-center" style={{ fontSize: '6px', color: T.textTer, fontWeight: 700 }}>{d}</div>)}
            </div>
            {rows.map((row, ri) => (
                <div key={ri} className="flex gap-1 mb-1 items-center">
                    <div className="w-12 text-right pr-1.5 shrink-0" style={{ fontSize: '6px', color: T.textTer, fontWeight: 700 }}>{labels[ri]}</div>
                    {row.map((v, di) => <div key={di} className="flex-1 h-4 rounded-sm" style={{ background: col(v) }} />)}
                </div>
            ))}
        </div>
    );
};

const MiniDonut = ({ s = 80 }) => {
    const r = s / 2 - 7;
    const c = 2 * Math.PI * r;
    return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
            <circle cx={s/2} cy={s/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9"/>
            <circle cx={s/2} cy={s/2} r={r} fill="none" stroke={T.blue} strokeWidth="9"
                strokeDasharray={`${c*.6} ${c*.4}`} strokeLinecap="round" transform={`rotate(-90 ${s/2} ${s/2})`}/>
            <circle cx={s/2} cy={s/2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9"
                strokeDasharray={`${c*.4} ${c*.6}`} strokeLinecap="round" transform={`rotate(126 ${s/2} ${s/2})`}/>
        </svg>
    );
};

// ── VIEWS ─────────────────────────────────────────────────────────────────────
const DashboardView = () => {
    const [view, setView] = useState('overview');
    const stats = [
        { label: 'AI Generated Revenue', val: '₹24,064', trend: 12, spark: [4,5,6,5,7,8,9,10], color: T.blue },
        { label: 'Pipeline Potential', val: '₹15,490', trend: 9, spark: [3,4,5,4,6,5,7,8], color: T.green },
        { label: 'Leads Qualified', val: '2,355', trend: 7, spark: [6,5,7,6,8,9,8,10], color: T.violet },
        { label: 'Conversion Rate', val: '12.5%', trend: 2, spark: [4,3,5,4,6,5,7,8], color: T.amber },
    ];
    return (
        <div className="space-y-3">
            {/* Demo banner */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-medium" style={{ background: 'rgba(59,130,246,0.07)', border: `1px solid rgba(59,130,246,0.2)` }}>
                <Database size={12} className="shrink-0" style={{ color: T.blue }} />
                <span style={{ color: '#93c5fd' }}>Demo Mode — projected data. Connect your account to see live numbers.</span>
            </div>

            {/* Tab row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-0.5 p-1 rounded-xl" style={{ background: '#12131a' }}>
                    {['overview','sales','leads'].map(t => (
                        <button key={t} onClick={() => setView(t)} className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                            style={view===t ? { background: 'rgba(255,255,255,0.08)', color: T.text } : { color: T.textTer }}>
                            {t}
                        </button>
                    ))}
                    <div className="w-px h-3 mx-1" style={{ background: T.border }} />
                    <button className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest" style={{ color: T.blue }}>
                        <Plus size={9} /> Add Widget
                    </button>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                    {[{ icon: Filter, label: 'Filter' }, { icon: Download, label: 'Export' }].map(({ icon: I, label }) => (
                        <button key={label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold" style={{ border: `1px solid ${T.borderLight}`, color: T.textSec }}>
                            <I size={9} />{label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {stats.map((s, i) => (
                    <div key={i} className="rounded-2xl p-4 flex flex-col" style={{ background: T.card, border: `1px solid ${T.border}` }}>
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-1.5" style={{ color: T.textSec, fontSize: '9px', fontWeight: 600 }}>
                                    {s.label} <Info size={8} style={{ opacity: 0.4 }} />
                                </div>
                                <div className="text-base font-bold" style={{ color: T.text }}>{s.val}</div>
                                <div className="flex items-center gap-1 mt-0.5" style={{ fontSize: '8px', color: T.textSec }}>
                                    vs last month
                                    <span className="flex items-center gap-0.5 font-bold" style={{ color: s.trend >= 0 ? T.green : '#ef4444' }}>
                                        {s.trend >= 0 ? <TrendingUp size={8}/> : <TrendingDown size={8}/>}
                                        {s.trend >= 0 ? '+' : ''}{s.trend}%
                                    </span>
                                </div>
                            </div>
                            <Sparkline data={s.spark} color={s.color} w={50} h={30} />
                        </div>
                        <div className="pt-2 flex items-center gap-1" style={{ borderTop: `1px solid ${T.border}`, fontSize: '9px', color: T.textSec, fontWeight: 600 }}>
                            See Details <ChevronRight size={9} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Row 2: Gauge + Bar Chart */}
            <div className="grid grid-cols-5 gap-2">
                <div className="col-span-2 rounded-2xl p-4" style={{ background: T.card, border: `1px solid ${T.border}` }}>
                    <div className="flex items-center gap-1 mb-2" style={{ fontSize: '10px', fontWeight: 600, color: T.textSec }}>Sales Performance <Info size={10} style={{ opacity: 0.3 }} /></div>
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <GaugeArc value={82} size={120} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center mt-3">
                                <span className="text-2xl font-black" style={{ color: T.text }}>82</span>
                                <span style={{ fontSize: '8px', color: T.textSec }}>of 100 pts</span>
                            </div>
                        </div>
                        <div className="w-full mt-1.5 p-2.5 rounded-xl" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
                            <p className="font-bold" style={{ fontSize: '10px', color: T.text }}>Your team is great! ✨</p>
                            <p style={{ fontSize: '8px', color: T.textSec }}>AI Agent is meeting or exceeding targets in several areas.</p>
                        </div>
                        <button className="mt-1.5 flex items-center gap-1" style={{ fontSize: '9px', color: T.blue, fontWeight: 600 }}>
                            Improve Your Score <ChevronRight size={9} />
                        </button>
                    </div>
                </div>
                <div className="col-span-3 rounded-2xl p-4" style={{ background: T.card, border: `1px solid ${T.border}` }}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5" style={{ fontSize: '10px', fontWeight: 600, color: T.textSec }}>Analytics <Info size={10} style={{ opacity: 0.3 }} /></div>
                        <div className="flex items-center gap-1">
                            <button className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ border: `1px solid ${T.borderLight}`, fontSize: '8px', color: T.textTer }}><Filter size={8}/>Filter</button>
                            <button className="px-2 py-1 rounded-lg" style={{ border: `1px solid ${T.borderLight}`, fontSize: '8px', color: T.textTer }}>Last Year ▾</button>
                        </div>
                    </div>
                    <MiniBar values={[45,62,38,95,55,70,48,52,44,38,30,28]} />
                </div>
            </div>

            {/* Row 3: Heatmap + Donut */}
            <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3 rounded-2xl p-4" style={{ background: T.card, border: `1px solid ${T.border}` }}>
                    <div className="flex items-center justify-between mb-2">
                        <span style={{ fontSize: '10px', fontWeight: 600, color: T.textSec }}>Visit by Time</span>
                        <div className="flex items-center gap-1">
                            <span style={{ fontSize: '7px', color: T.textTer }}>0</span>
                            {['rgba(59,130,246,0.12)','rgba(59,130,246,0.3)','rgba(59,130,246,0.55)','rgba(59,130,246,0.85)'].map((c,i)=>(
                                <div key={i} className="w-2.5 h-1.5 rounded-sm" style={{ background: c }} />
                            ))}
                            <span style={{ fontSize: '7px', color: T.textTer }}>10k+</span>
                        </div>
                    </div>
                    <HeatGrid />
                </div>
                <div className="col-span-2 rounded-2xl p-4" style={{ background: T.card, border: `1px solid ${T.border}` }}>
                    <div className="flex items-center gap-1 mb-2" style={{ fontSize: '10px', fontWeight: 600, color: T.textSec }}>Total Visits <Info size={10} style={{ opacity: 0.2 }}/></div>
                    <div className="flex items-start justify-between gap-1">
                        <div>
                            <div className="text-xl font-bold" style={{ color: T.text }}>191,886</div>
                            <div className="flex items-center gap-1 mt-0.5" style={{ fontSize: '8px', color: T.textSec }}>
                                vs last month <span className="flex items-center gap-0.5 font-bold" style={{ color: T.green }}><TrendingUp size={8}/>+8.5%</span>
                            </div>
                            <div className="mt-2 space-y-1.5">
                                {[{l:'Mobile',v:'115,132',c:T.blue},{l:'Website',v:'76,754',c:'rgba(255,255,255,0.15)'}].map(s=>(
                                    <div key={s.l} className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.c }}/>
                                        <span className="flex-1" style={{ fontSize: '9px', color: T.textSec }}>{s.l}</span>
                                        <span className="font-semibold" style={{ fontSize: '9px', color: T.textSec }}>{s.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative shrink-0">
                            <MiniDonut s={76} />
                            <div className="absolute top-0 right-0" style={{ fontSize: '7px', color: T.textTer }}>60%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LeadsView = () => {
    const [selected, setSelected] = useState(null);
    const leads = [
        { name: 'Elite Fitness Pro', status: 'qualified', score: 95, deal: '₹4,200', industry: 'Health & Wellness', time: '2m ago' },
        { name: 'Azure Estates', status: 'converted', score: 92, deal: '₹42,500', industry: 'Real Estate', time: '8m ago' },
        { name: 'Nova Retail', status: 'new', score: 84, deal: '₹12,200', industry: 'E-commerce', time: '15m ago' },
        { name: 'BioGen Lab', status: 'contacted', score: 78, deal: '₹25,000', industry: 'Healthcare', time: '31m ago' },
        { name: 'TechFlow Inc.', status: 'qualified', score: 94, deal: '₹18,400', industry: 'SaaS', time: '1h ago' },
    ];
    const sc = { new: T.blue, qualified: T.green, contacted: T.amber, converted: T.violet };
    const sb = { new: 'rgba(59,130,246,0.1)', qualified: 'rgba(16,185,129,0.1)', contacted: 'rgba(245,158,11,0.1)', converted: 'rgba(139,92,246,0.1)' };
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <p style={{ fontSize:'8px', fontWeight:900, letterSpacing:'0.3em', color: T.blue }}>PORTFOLIO MANAGEMENT</p>
                    <h2 className="font-black italic uppercase tracking-tighter text-base" style={{ color: T.text }}>Leads Central</h2>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl" style={{ border: `1px solid ${T.borderLight}`, fontSize:'9px', color: T.textSec }}><Filter size={9}/> Filter</button>
                    <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-white" style={{ background: T.blue, fontSize:'9px' }}><Plus size={9}/> Add Lead</button>
                </div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.border}` }}>
                <div className="grid grid-cols-4 px-4 py-2.5" style={{ borderBottom: `1px solid ${T.border}` }}>
                    {['Identity','Status','AI Score','Value'].map(h => <span key={h} style={{ fontSize:'8px', fontWeight:900, letterSpacing:'0.2em', color: T.textTer }}>{h}</span>)}
                </div>
                {leads.map((lead, i) => (
                    <div key={i} onClick={() => setSelected(selected?.name === lead.name ? null : lead)}
                        className="grid grid-cols-4 px-4 py-2.5 cursor-pointer transition-all"
                        style={{ borderBottom: `1px solid ${T.border}`, background: selected?.name === lead.name ? 'rgba(59,130,246,0.05)' : 'transparent' }}>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', fontSize: '10px', fontWeight:900 }}>{lead.name[0]}</div>
                            <div>
                                <p style={{ fontSize:'11px', fontWeight:900, color: T.text, letterSpacing:'-0.02em' }}>{lead.name}</p>
                                <p style={{ fontSize:'8px', color: T.textTer }}>{lead.industry}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="px-2 py-0.5 rounded-full" style={{ background: sb[lead.status], color: sc[lead.status], fontSize:'8px', fontWeight:900 }}>{lead.status}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div className="h-full rounded-full" style={{ width:`${lead.score}%`, background: T.blue }}/>
                            </div>
                            <span style={{ fontSize:'10px', fontWeight:700, color: T.textSec }}>{lead.score}</span>
                        </div>
                        <div className="flex items-center">
                            <span style={{ fontSize:'12px', fontWeight:700, color: T.text }}>{lead.deal}</span>
                        </div>
                    </div>
                ))}
            </div>
            {selected && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    className="p-3 rounded-2xl" style={{ background:'rgba(59,130,246,0.05)', border:`1px solid rgba(59,130,246,0.2)` }}>
                    <div className="flex justify-between mb-2">
                        <span style={{ fontSize:'9px', fontWeight:900, letterSpacing:'0.2em', color: T.blue }}>AI INTELLIGENCE — {selected.name.toUpperCase()}</span>
                        <button onClick={() => setSelected(null)} style={{ color: T.textSec, fontSize:'11px' }}>✕</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[{l:'AI Score',v:`${selected.score}/100`,c:T.blue},{l:'Status',v:selected.status,c:T.text},{l:'Deal Value',v:selected.deal,c:T.green}].map(s=>(
                            <div key={s.l} className="p-2.5 rounded-xl" style={{ background:'rgba(255,255,255,0.04)' }}>
                                <p style={{ fontSize:'7px', fontWeight:900, letterSpacing:'0.2em', color: T.textTer, marginBottom:'4px' }}>{s.l}</p>
                                <p style={{ fontSize:'14px', fontWeight:900, color: s.c }}>{s.v}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const PipelineView = () => {
    const stages = [
        { label: 'Discovery', count: 18, value: '₹82k', color: T.blue, cards: [{ name:'TechFlow Inc', deal:'₹18.4k', score:94 }, { name:'Nova Retail', deal:'₹12.2k', score:84 }] },
        { label: 'Qualified', count: 12, value: '₹143k', color: T.green, cards: [{ name:'Azure Estates', deal:'₹42.5k', score:92 }, { name:'Elite Fitness', deal:'₹4.2k', score:95 }], locked: false },
        { label: 'Proposal', count: 7, value: '₹290k', color: T.amber, cards: [{ name:'BioGen Lab', deal:'₹25k', score:78 }], locked: true },
        { label: 'Closed Won', count: 4, value: '₹512k', color: T.green, cards: [], locked: true },
    ];
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <p style={{ fontSize:'8px', fontWeight:900, letterSpacing:'0.3em', color: T.violet }}>PIPELINE</p>
                    <h2 className="font-black italic uppercase tracking-tighter text-base" style={{ color: T.text }}>Deal Pipeline</h2>
                </div>
                <span className="px-2.5 py-1 rounded-full text-white flex items-center gap-1" style={{ background: T.violet, fontSize:'8px', fontWeight:900 }}>
                    <Star size={9} fill="currentColor" /> AI Pipeline
                </span>
            </div>
            <div className="grid grid-cols-4 gap-2 h-64">
                {stages.map((stage, si) => (
                    <div key={si} className="rounded-2xl p-3 flex flex-col relative overflow-hidden" style={{ background: T.card, border: `1px solid ${T.border}` }}>
                        {stage.locked && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm" style={{ background: 'rgba(10,10,10,0.75)' }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.borderLight}` }}>
                                    <Lock size={18} style={{ color: T.textSec }} />
                                </div>
                                <p style={{ fontSize:'9px', fontWeight:900, color: T.textSec, textAlign:'center' }}>Upgrade to unlock</p>
                                <button className="mt-2 px-3 py-1 rounded-full text-white" style={{ background: T.blue, fontSize:'8px', fontWeight:900 }}>Upgrade →</button>
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                                <span style={{ fontSize:'9px', fontWeight:900, color: T.text }}>{stage.label}</span>
                            </div>
                            <span className="w-5 h-5 rounded-lg flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.07)', fontSize:'9px', fontWeight:900 }}>{stage.count}</span>
                        </div>
                        <div className="mb-2" style={{ fontSize:'11px', fontWeight:900, color: stage.color }}>{stage.value}</div>
                        <div className="flex-1 space-y-1.5 overflow-hidden">
                            {stage.cards.map((c, ci) => (
                                <div key={ci} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}` }}>
                                    <p style={{ fontSize:'10px', fontWeight:900, color: T.text }}>{c.name}</p>
                                    <div className="flex justify-between mt-0.5">
                                        <span style={{ fontSize:'8px', color: T.textSec }}>{c.deal}</span>
                                        <span style={{ fontSize:'8px', color: T.blue }}>{c.score}/100</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AutomationsView = () => (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <div>
                <p style={{ fontSize:'8px', fontWeight:900, letterSpacing:'0.3em', color: T.amber }}>AUTOMATIONS</p>
                <h2 className="font-black italic uppercase tracking-tighter text-base" style={{ color: T.text }}>Workflow Engine</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-white flex items-center gap-1" style={{ background: 'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', color: T.amber, fontSize:'8px', fontWeight:900 }}>
                3 Active
            </span>
        </div>
        {[
            { name: 'New Lead → Welcome WhatsApp', trigger: 'Lead captured via widget', status: 'active', runs: '284', color: T.green },
            { name: 'Score > 80 → Book Meeting', trigger: 'AI score threshold hit', status: 'active', runs: '42', color: T.green },
            { name: 'Email Reply → CRM Update', trigger: 'Gmail integration event', status: 'active', runs: '178', color: T.green },
        ].map((a, i) => (
            <div key={i} className="p-4 rounded-2xl flex items-center gap-4" style={{ background: T.card, border: `1px solid ${T.border}` }}>
                <div className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ background: T.green }} />
                <div className="flex-1">
                    <p style={{ fontSize:'11px', fontWeight:900, color: T.text }}>{a.name}</p>
                    <p style={{ fontSize:'9px', color: T.textSec }}>{a.trigger}</p>
                </div>
                <div className="text-right">
                    <p style={{ fontSize:'13px', fontWeight:900, color: a.color }}>{a.runs}</p>
                    <p style={{ fontSize:'8px', color: T.textTer }}>runs today</p>
                </div>
                <div className="w-8 h-4 rounded-full relative" style={{ background: T.green }}>
                    <div className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-white" />
                </div>
            </div>
        ))}
        {/* Locked advanced automations */}
        <div className="p-4 rounded-2xl relative overflow-hidden" style={{ background: T.card, border: `1px solid ${T.border}` }}>
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl backdrop-blur-sm z-10" style={{ background: 'rgba(10,10,10,0.7)' }}>
                <div className="flex items-center gap-3">
                    <Lock size={16} style={{ color: T.textSec }} />
                    <span style={{ fontSize:'10px', fontWeight:900, color: T.textSec }}>Advanced automations — Upgrade to unlock</span>
                    <button className="px-3 py-1 rounded-full text-white" style={{ background: T.blue, fontSize:'8px', fontWeight:900 }}>Upgrade →</button>
                </div>
            </div>
            <p style={{ fontSize:'11px', color: T.text, opacity:0.3 }}>Multi-step nurture sequences, A/B testing, conditional logic...</p>
        </div>
    </div>
);

const AnalyticsView = () => (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <div>
                <p style={{ fontSize:'8px', fontWeight:900, letterSpacing:'0.3em', color: T.green }}>ANALYTICS</p>
                <h2 className="font-black italic uppercase tracking-tighter text-base" style={{ color: T.text }}>Performance Overview</h2>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl" style={{ border:`1px solid ${T.borderLight}`, fontSize:'9px', color:T.textSec }}>Last 30 days ▾</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
            {[
                { label:'Total Leads', val:'2,355', delta:'+247', color:T.blue, spark:[8,10,9,12,11,14,13,15] },
                { label:'Conversion Rate', val:'12.5%', delta:'+2.1%', color:T.green, spark:[9,10,8,11,10,12,11,13] },
                { label:'AI Revenue', val:'₹24,064', delta:'+₹3.2k', color:T.violet, spark:[6,8,7,9,8,11,10,12] },
            ].map((s,i)=>(
                <div key={i} className="p-4 rounded-2xl" style={{ background:T.card, border:`1px solid ${T.border}` }}>
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p style={{ fontSize:'9px', color:T.textSec }}>{s.label}</p>
                            <p className="text-lg font-black" style={{ color:T.text }}>{s.val}</p>
                            <p className="font-bold" style={{ fontSize:'9px', color:s.color }}>{s.delta}</p>
                        </div>
                        <Sparkline data={s.spark} color={s.color} w={48} h={28} />
                    </div>
                </div>
            ))}
        </div>
        <div className="p-4 rounded-2xl" style={{ background:T.card, border:`1px solid ${T.border}` }}>
            <p className="mb-3 font-semibold" style={{ fontSize:'10px', color:T.textSec }}>Monthly Lead Volume</p>
            <MiniBar values={[45,62,38,95,55,70,48,52,44,38,30,28]} />
        </div>
        <div className="grid grid-cols-2 gap-2">
            {[
                { label:'Avg AI Response Time', val:'3s', sub:'vs 2h 15m manual', color:T.blue },
                { label:'AI Win Rate', val:'28.5%', sub:'vs 11% manual team', color:T.green },
            ].map((s,i)=>(
                <div key={i} className="p-4 rounded-2xl" style={{ background:T.card, border:`1px solid ${T.border}` }}>
                    <p style={{ fontSize:'9px', color:T.textSec }}>{s.label}</p>
                    <p className="text-2xl font-black" style={{ color:s.color }}>{s.val}</p>
                    <p style={{ fontSize:'9px', color:T.textTer }}>{s.sub}</p>
                </div>
            ))}
        </div>
    </div>
);

// ── NAV ITEM ──────────────────────────────────────────────────────────────────
const NavItem = ({ icon: Icon, label, badge, active, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all text-left"
        style={active ? { background: T.blue, color: '#fff' } : { color: T.textSec }}>
        <div className="flex items-center gap-2.5">
            <Icon size={13} strokeWidth={active ? 2.5 : 2} />
            <span style={{ fontSize:'11px', fontWeight:600 }}>{label}</span>
        </div>
        {badge && <span className="text-white px-1.5 py-0.5 rounded-full" style={{ fontSize:'7px', fontWeight:900, background: T.blue }}>{badge}</span>}
    </button>
);

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
const InteractiveHeroDemo = ({ initialTab }) => {
    const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');

    const views = {
        dashboard: <DashboardView />,
        leads: <LeadsView />,
        pipeline: <PipelineView />,
        automations: <AutomationsView />,
        analytics: <AnalyticsView />,
    };

    return (
        <div className="relative w-full rounded-[1.25rem] md:rounded-[1.5rem] overflow-hidden flex select-none"
            style={{ background: T.bg, border: `1px solid rgba(255,255,255,0.06)`, minHeight: '480px', maxHeight: '560px', boxShadow: '0 0 80px rgba(0,0,0,0.7)' }}>

            {/* ── SIDEBAR — hidden on mobile, visible md+ */}
            <div className="hidden md:flex flex-col w-[148px] shrink-0 pt-4 pb-3" style={{ background: T.sidebar, borderRight: `1px solid ${T.border}` }}>
                {/* Logo */}
                <div className="px-3.5 mb-5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-black" style={{ background: T.blue, fontSize:'10px' }}>N</div>
                        <span className="font-black text-sm" style={{ color: T.text }}>NEXIO</span>
                    </div>
                    <span style={{ fontSize:'8px', color: T.textTer, fontWeight:600, marginLeft:'30px' }}>Sales Platform</span>
                </div>

                {/* Search */}
                <div className="px-2.5 mb-3.5">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${T.border}` }}>
                        <Search size={9} style={{ color: T.textTer }} />
                        <span style={{ fontSize:'9px', color: T.textTer, fontWeight:500 }}>Search...</span>
                    </div>
                </div>

                {/* Main Menu */}
                <div className="px-2 mb-3">
                    <p style={{ fontSize:'7px', fontWeight:900, letterSpacing:'0.2em', color: T.textTer, padding:'0 8px', marginBottom:'6px' }}>MAIN MENU</p>
                    <div className="space-y-0.5">
                        <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab==='dashboard'} onClick={() => setActiveTab('dashboard')} />
                        <NavItem icon={Users} label="Leads" active={activeTab==='leads'} onClick={() => setActiveTab('leads')} />
                        <NavItem icon={GitBranch} label="Pipeline" badge="AI" active={activeTab==='pipeline'} onClick={() => setActiveTab('pipeline')} />
                        <NavItem icon={Zap} label="Automations" active={activeTab==='automations'} onClick={() => setActiveTab('automations')} />
                        <NavItem icon={BarChart2} label="Analytics" active={activeTab==='analytics'} onClick={() => setActiveTab('analytics')} />
                        <NavItem icon={Link2} label="Integrations" active={false} onClick={() => {}} />
                    </div>
                </div>

                {/* Tools */}
                <div className="px-2 mb-3">
                    <p style={{ fontSize:'7px', fontWeight:900, letterSpacing:'0.2em', color: T.textTer, padding:'0 8px', marginBottom:'6px' }}>TOOLS</p>
                    <div className="space-y-0.5">
                        <NavItem icon={Bell} label="Notifications" active={false} onClick={() => {}} />
                        <NavItem icon={MessageSquare} label="WhatsApp Bot" active={false} onClick={() => {}} />
                        <NavItem icon={Settings} label="Settings" active={false} onClick={() => {}} />
                    </div>
                </div>

                {/* Active Product */}
                <div className="px-2.5 mt-auto">
                    <div className="p-2 rounded-xl mb-2" style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)' }}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <div className="w-5 h-5 rounded-md flex items-center justify-center text-white" style={{ background:T.blue, fontSize:'8px' }}><LayoutDashboard size={9}/></div>
                            <span style={{ fontSize:'9px', fontWeight:900, color:T.text }}>NEXIO CRM</span>
                            <span className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:'#60a5fa' }}/>
                        </div>
                        <span style={{ fontSize:'8px', color:'rgba(96,165,250,0.7)', fontWeight:700, marginLeft:'26px' }}>Sales Automation</span>
                    </div>
                    <button className="w-full py-1.5 rounded-xl text-white font-black text-[9px] uppercase tracking-widest" style={{ background: T.blue, boxShadow:'0 4px 12px rgba(59,130,246,0.3)' }}>
                        Upgrade Plan →
                    </button>
                </div>
            </div>

            {/* ── MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden" style={{ minWidth: 0 }}>
                {/* Top bar */}
                <div className="flex items-center justify-between px-4 md:px-5 py-3 shrink-0" style={{ borderBottom:`1px solid ${T.border}` }}>
                    {/* Mobile tab selector */}
                    <div className="flex md:hidden items-center gap-1 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
                        {[{k:'dashboard',l:'Home',I:LayoutDashboard},{k:'leads',l:'Leads',I:Users},{k:'pipeline',l:'Pipeline',I:GitBranch},{k:'automations',l:'Automations',I:Zap},{k:'analytics',l:'Analytics',I:BarChart2}].map(({k,l,I})=>(
                            <button key={k} onClick={()=>setActiveTab(k)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl shrink-0 transition-all"
                                style={activeTab===k ? {background:T.blue,color:'#fff',fontSize:'9px',fontWeight:900} : {background:'rgba(255,255,255,0.04)',color:T.textSec,fontSize:'9px'}}>
                                <I size={10}/>{l}
                            </button>
                        ))}
                    </div>
                    <span className="hidden md:block font-black text-sm" style={{ color: T.text }}>
                        {{dashboard:'Dashboard',leads:'Leads Central',pipeline:'Deal Pipeline',automations:'Workflow Engine',analytics:'Analytics'}[activeTab]}
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                        <button className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold" style={{ border:`1px solid ${T.borderLight}`, fontSize:'9px', color:T.textSec }}>
                            <Plus size={9}/> Widget
                        </button>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black" style={{ background:T.blue, fontSize:'10px' }}>H</div>
                    </div>
                </div>

                {/* View content */}
                <div className="flex-1 overflow-y-auto p-3 md:p-4" style={{ scrollbarWidth:'none' }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
                            {views[activeTab]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default InteractiveHeroDemo;
