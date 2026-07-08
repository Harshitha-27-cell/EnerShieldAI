import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const reserves = [
  { name: "Vizag", capacity: 11.22, current: 10.1, color: "#2DDDA8" },
  { name: "Mangalore", capacity: 11.22, current: 9.5, color: "#A78BFA" },
  { name: "Padur", capacity: 17.28, current: 14.2, color: "#6FE7C2" },
  { name: "Chandikhol", capacity: 13.31, current: 11.8, color: "#C4B3FB" },
];

const total = reserves.reduce((a, r) => a + r.capacity, 0);
const filled = reserves.reduce((a, r) => a + r.current, 0);
const pct = Math.round((filled / total) * 100);

export default function ReserveGauge() {
  const data = [{ value: filled }, { value: total - filled }];

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-white font-semibold text-sm mb-4">Strategic Reserve Status</h3>
      <div className="flex items-center gap-6">
        <div className="w-32 h-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={38} outerRadius={52} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                <Cell fill="#2DDDA8" />
                <Cell fill="rgba(255,255,255,0.05)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{pct}%</span>
            <span className="text-[10px] text-white/40">Filled</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {reserves.map((r, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">{r.name}</span>
                <span className="text-white/40">{r.current}/{r.capacity} MMT</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(r.current / r.capacity) * 100}%`, backgroundColor: r.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
        <span className="text-white/40">Coverage</span>
        <span className="text-mint font-semibold">42 Days</span>
      </div>
    </div>
  );
}