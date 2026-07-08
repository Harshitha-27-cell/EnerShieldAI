import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Globe, TrendingUp, TrendingDown, Filter, Search, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

const riskEvents = [
  { id: 1, title: "Red Sea — Houthi militant attacks on commercial shipping", region: "Middle East", country: "Yemen", severity: "critical", score: 92, category: "conflict", time: "2 min ago", status: "active" },
  { id: 2, title: "OPEC+ emergency production session announced for Friday", region: "Global", country: "OPEC", severity: "high", score: 78, category: "market", time: "18 min ago", status: "monitoring" },
  { id: 3, title: "Iran-Israel tensions escalate — military movements detected", region: "Middle East", country: "Iran", severity: "high", score: 85, category: "geopolitical", time: "45 min ago", status: "active" },
  { id: 4, title: "Paradip Port congestion — 12 vessels in queue", region: "South Asia", country: "India", severity: "medium", score: 55, category: "logistics", time: "1 hr ago", status: "monitoring" },
  { id: 5, title: "US sanctions review on Russian oil exports", region: "Global", country: "Russia", severity: "medium", score: 62, category: "sanctions", time: "3 hr ago", status: "monitoring" },
  { id: 6, title: "Cyclone warning — Bay of Bengal shipping lanes", region: "South Asia", country: "India", severity: "medium", score: 48, category: "weather", time: "5 hr ago", status: "active" },
  { id: 7, title: "Strait of Hormuz transit remains normal — military drills concluded", region: "Middle East", country: "Iran", severity: "low", score: 30, category: "geopolitical", time: "8 hr ago", status: "resolved" },
];

const countryRisks = [
  { country: "Iran", score: 85 }, { country: "Yemen", score: 92 }, { country: "Russia", score: 68 },
  { country: "Saudi Arabia", score: 45 }, { country: "Iraq", score: 62 }, { country: "UAE", score: 38 },
  { country: "Kuwait", score: 42 }, { country: "Nigeria", score: 55 },
];

const trendData = [
  { month: "Jul", global: 58, mideast: 65, asia: 32 },
  { month: "Aug", global: 62, mideast: 70, asia: 35 },
  { month: "Sep", global: 55, mideast: 60, asia: 30 },
  { month: "Oct", global: 68, mideast: 78, asia: 38 },
  { month: "Nov", global: 72, mideast: 82, asia: 40 },
  { month: "Dec", global: 73, mideast: 85, asia: 42 },
];

const sevColors = { critical: "text-coral bg-coral/10 border-coral/20", high: "text-coral bg-coral/5 border-coral/10", medium: "text-lavender bg-lavender/5 border-lavender/10", low: "text-mint bg-mint/5 border-mint/10" };
const statusColors = { active: "text-coral", monitoring: "text-lavender", resolved: "text-mint" };

export default function RiskIntelligence() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = riskEvents.filter(e =>
    (filter === "all" || e.severity === filter) &&
    (search === "" || e.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Geopolitical Risk Intelligence</h1>
        <p className="text-white/40 text-sm mt-1">AI-powered monitoring of global threats affecting energy supply chains</p>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Global Risk Index", value: "73", color: "text-coral", bg: "glass-coral" },
          { label: "Active Threats", value: "4", color: "text-coral", bg: "glass-coral" },
          { label: "Monitoring", value: "3", color: "text-lavender", bg: "glass-lavender" },
          { label: "Resolved (24h)", value: "8", color: "text-mint", bg: "glass-mint" },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`${c.bg} rounded-2xl p-5`}>
            <p className="text-white/40 text-xs mb-2">{c.label}</p>
            <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Risk Trend */}
        <div className="lg:col-span-2 glass rounded-2xl">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-white font-semibold text-sm">Risk Score Trends</h3>
          </div>
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#18181a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="mideast" stroke="#FF6B6B" fill="url(#gRed)" strokeWidth={2} name="Middle East" />
                <Area type="monotone" dataKey="global" stroke="#A78BFA" fill="none" strokeWidth={2} name="Global" />
                <Area type="monotone" dataKey="asia" stroke="#2DDDA8" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="South Asia" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country Risk Rankings */}
        <div className="glass rounded-2xl">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-white font-semibold text-sm">Supplier Country Risk</h3>
          </div>
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryRisks} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="country" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ background: '#18181a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} fill="#A78BFA" name="Risk Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Event List */}
      <div className="glass rounded-2xl">
        <div className="px-5 py-3 border-b border-white/5 flex flex-col md:flex-row md:items-center gap-3">
          <h3 className="text-white font-semibold text-sm flex-1">Threat Events</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-8 text-xs bg-white/5 border-white/10 text-white w-48"
              />
            </div>
            <div className="flex gap-1">
              {["all", "critical", "high", "medium", "low"].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors ${filter === f ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.map(e => (
            <div key={e.id} className="px-5 py-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${e.severity === 'critical' || e.severity === 'high' ? 'bg-coral/10' : e.severity === 'medium' ? 'bg-lavender/10' : 'bg-mint/10'}`}>
                <AlertTriangle className={`w-5 h-5 ${e.severity === 'critical' || e.severity === 'high' ? 'text-coral' : e.severity === 'medium' ? 'text-lavender' : 'text-mint'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-sm font-medium">{e.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${sevColors[e.severity]}`}>{e.severity}</span>
                  <span className="text-white/20 text-xs">•</span>
                  <span className="text-white/40 text-xs">{e.region} — {e.country}</span>
                  <span className="text-white/20 text-xs">•</span>
                  <span className={`text-xs ${statusColors[e.status]}`}>{e.status}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-xl font-bold ${e.score >= 70 ? 'text-coral' : e.score >= 50 ? 'text-lavender' : 'text-mint'}`}>{e.score}</div>
                <p className="text-white/30 text-xs flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{e.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}