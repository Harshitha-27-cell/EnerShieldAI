import React from 'react';
import { motion } from 'framer-motion';
import { Database, Droplets, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell, LineChart, Line } from 'recharts';

const facilities = [
  { name: "Vizag (Visakhapatnam)", capacity: 11.22, current: 10.1, status: "operational", coverage: 9, lat: 17.7, lng: 83.3, color: "#2DDDA8" },
  { name: "Mangalore", capacity: 11.22, current: 9.5, status: "filling", coverage: 8, lat: 12.9, lng: 74.9, color: "#A78BFA" },
  { name: "Padur", capacity: 17.28, current: 14.2, status: "operational", coverage: 12, lat: 12.5, lng: 75.0, color: "#6FE7C2" },
  { name: "Chandikhol", capacity: 13.31, current: 11.8, status: "operational", coverage: 10, lat: 20.7, lng: 86.1, color: "#C4B3FB" },
];

const totalCap = facilities.reduce((a, f) => a + f.capacity, 0);
const totalCur = facilities.reduce((a, f) => a + f.current, 0);
const totalDays = facilities.reduce((a, f) => a + f.coverage, 0);

const demandData = [
  { month: "Jan", demand: 4.8, supply: 5.2, reserve: 45.6 },
  { month: "Feb", demand: 4.6, supply: 5.0, reserve: 46.0 },
  { month: "Mar", demand: 4.9, supply: 5.1, reserve: 45.8 },
  { month: "Apr", demand: 5.1, supply: 5.0, reserve: 45.7 },
  { month: "May", demand: 5.3, supply: 4.8, reserve: 44.2 },
  { month: "Jun", demand: 5.0, supply: 5.1, reserve: 44.5 },
  { month: "Jul", demand: 4.7, supply: 5.3, reserve: 45.1 },
  { month: "Aug", demand: 4.9, supply: 5.0, reserve: 45.2 },
  { month: "Sep", demand: 5.2, supply: 4.9, reserve: 44.9 },
  { month: "Oct", demand: 5.4, supply: 5.0, reserve: 44.5 },
  { month: "Nov", demand: 5.1, supply: 5.2, reserve: 44.6 },
  { month: "Dec", demand: 5.0, supply: 5.1, reserve: 45.6 },
];

const drawdownPlan = [
  { week: "W1", release: 2.0, remaining: 43.6 },
  { week: "W2", release: 3.5, remaining: 40.1 },
  { week: "W3", release: 4.0, remaining: 36.1 },
  { week: "W4", release: 3.0, remaining: 33.1 },
  { week: "W5", release: 2.0, remaining: 31.1 },
  { week: "W6", release: 1.0, remaining: 30.1 },
];

const statusStyles = { operational: "bg-mint/10 text-mint", filling: "bg-lavender/10 text-lavender", releasing: "bg-coral/10 text-coral", maintenance: "bg-white/5 text-white/40" };

export default function Reserves() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Strategic Reserve Optimization</h1>
        <p className="text-white/40 text-sm mt-1">AI-driven reserve management, drawdown planning, and coverage analysis</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-mint rounded-2xl p-5">
          <Droplets className="w-5 h-5 text-mint mb-2" />
          <p className="text-3xl font-bold text-mint">{totalCur.toFixed(1)}</p>
          <p className="text-white/40 text-xs">MMT Stored / {totalCap.toFixed(1)} MMT</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5">
          <Database className="w-5 h-5 text-lavender mb-2" />
          <p className="text-3xl font-bold text-lavender">{Math.round((totalCur / totalCap) * 100)}%</p>
          <p className="text-white/40 text-xs">Utilization Rate</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-5">
          <Clock className="w-5 h-5 text-white/60 mb-2" />
          <p className="text-3xl font-bold text-white">{totalDays}</p>
          <p className="text-white/40 text-xs">Total Coverage Days</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-5">
          <CheckCircle className="w-5 h-5 text-mint mb-2" />
          <p className="text-3xl font-bold text-mint">4/4</p>
          <p className="text-white/40 text-xs">Facilities Operational</p>
        </motion.div>
      </div>

      {/* Facility Details */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {facilities.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">{f.name}</h3>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${statusStyles[f.status]}`}>{f.status}</span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/40">{f.current} / {f.capacity} MMT</span>
                <span className="text-white/60">{Math.round((f.current / f.capacity) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(f.current / f.capacity) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: f.color }}
                />
              </div>
            </div>
            <p className="text-white/30 text-xs">Coverage: <span className="text-white/60 font-medium">{f.coverage} days</span></p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Demand vs Supply */}
        <div className="glass rounded-2xl">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-white font-semibold text-sm">Demand vs Supply (M bbl/day)</h3>
          </div>
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandData}>
                <defs>
                  <linearGradient id="gDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gSupply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DDDA8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2DDDA8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#18181a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="demand" stroke="#FF6B6B" fill="url(#gDemand)" strokeWidth={2} name="Demand" />
                <Area type="monotone" dataKey="supply" stroke="#2DDDA8" fill="url(#gSupply)" strokeWidth={2} name="Supply" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drawdown Plan */}
        <div className="glass rounded-2xl">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-white font-semibold text-sm">Emergency Drawdown Plan</h3>
          </div>
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={drawdownPlan}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#18181a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="release" fill="#A78BFA" radius={[6, 6, 0, 0]} name="Release (MMT)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}