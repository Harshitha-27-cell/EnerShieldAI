import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { date: "Jan", brent: 76.2, wti: 71.8, basket: 74.5 },
  { date: "Feb", brent: 78.5, wti: 73.2, basket: 76.1 },
  { date: "Mar", brent: 81.3, wti: 76.8, basket: 79.4 },
  { date: "Apr", brent: 79.8, wti: 75.1, basket: 77.9 },
  { date: "May", brent: 77.4, wti: 72.6, basket: 75.3 },
  { date: "Jun", brent: 80.1, wti: 75.5, basket: 78.2 },
  { date: "Jul", brent: 83.7, wti: 79.2, basket: 81.9 },
  { date: "Aug", brent: 85.2, wti: 80.8, basket: 83.4 },
  { date: "Sep", brent: 82.4, wti: 77.6, basket: 80.3 },
  { date: "Oct", brent: 84.1, wti: 79.4, basket: 82.1 },
  { date: "Nov", brent: 81.8, wti: 76.9, basket: 79.7 },
  { date: "Dec", brent: 82.4, wti: 77.8, basket: 80.5 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: ${p.value}/bbl</p>
      ))}
    </div>
  );
};

export default function PriceTrendChart() {
  return (
    <div className="glass rounded-2xl">
      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm">Crude Oil Price Trends</h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-mint" /> Brent</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-lavender" /> WTI</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/40" /> Basket</span>
        </div>
      </div>
      <div className="p-4 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gMint" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2DDDA8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2DDDA8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gLav" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[65, 90]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="brent" stroke="#2DDDA8" fill="url(#gMint)" strokeWidth={2} name="Brent" />
            <Area type="monotone" dataKey="wti" stroke="#A78BFA" fill="url(#gLav)" strokeWidth={2} name="WTI" />
            <Area type="monotone" dataKey="basket" stroke="rgba(255,255,255,0.3)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="OPEC Basket" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}