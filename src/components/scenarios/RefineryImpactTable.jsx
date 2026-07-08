import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Clock, Zap } from 'lucide-react';

const REFINERIES = [
  { name: "Jamnagar Refinery", location: "Gujarat", capacity: 1360, sources: ["Saudi Arabia", "Iraq", "UAE"], dependency: 68 },
  { name: "Paradip Refinery", location: "Odisha", capacity: 300, sources: ["Iraq", "Saudi Arabia", "Kuwait"], dependency: 55 },
  { name: "Mumbai (HPCL) Refinery", location: "Maharashtra", capacity: 140, sources: ["Saudi Arabia", "UAE"], dependency: 72 },
  { name: "Kochi Refinery", location: "Kerala", capacity: 310, sources: ["Iraq", "Nigeria", "UAE"], dependency: 48 },
  { name: "Mangalore Refinery", location: "Karnataka", capacity: 360, sources: ["Saudi Arabia", "Kuwait", "Iraq"], dependency: 58 },
  { name: "Panipat Refinery", location: "Haryana", capacity: 300, sources: ["Iraq", "Saudi Arabia"], dependency: 62 },
  { name: "Mathura Refinery", location: "UP", capacity: 160, sources: ["Saudi Arabia", "UAE"], dependency: 45 },
  { name: "Chennai Refinery", location: "Tamil Nadu", capacity: 210, sources: ["Saudi Arabia", "Kuwait"], dependency: 52 },
];

const riskColors = {
  low: { bg: "bg-mint/10", text: "text-mint", border: "border-mint/30", dot: "bg-mint" },
  medium: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30", dot: "bg-yellow-400" },
  high: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-orange-400" },
  critical: { bg: "bg-coral/10", text: "text-coral", border: "border-coral/30", dot: "bg-coral" },
};

function getRiskLevel(impact) {
  if (impact >= 30) return "critical";
  if (impact >= 20) return "high";
  if (impact >= 10) return "medium";
  return "low";
}

export function calculateRefineryImpacts(scenario) {
  if (!scenario) return [];
  const factor = (scenario.severity / 100) * (scenario.supplyLoss / 35);
  return REFINERIES.map(r => {
    const impact = Math.round(r.dependency * factor * 0.9 * (0.8 + Math.random() * 0.4));
    const cappedImpact = Math.min(impact, 95);
    const capacityReduction = Math.round((r.capacity * cappedImpact) / 100);
    const riskLevel = getRiskLevel(cappedImpact);
    const recoveryDays = Math.round(scenario.recovery * (cappedImpact / 40) * (0.7 + Math.random() * 0.6));
    return { ...r, impact: cappedImpact, capacityReduction, riskLevel, recoveryDays };
  }).sort((a, b) => b.impact - a.impact);
}

export default function RefineryImpactTable({ impacts }) {
  if (!impacts || impacts.length === 0) return null;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm">Refinery Impact Analysis</h3>
        <span className="text-xs text-white/30">{impacts.filter(r => r.impact > 15).length} refineries critically affected</span>
      </div>

      {/* Cards Grid */}
      <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
        {impacts.slice(0, 4).map((r, i) => {
          const c = riskColors[r.riskLevel];
          return (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className={`${c.bg} border ${c.border} rounded-xl p-3`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                <p className="text-white text-xs font-semibold leading-tight">{r.name}</p>
              </div>
              <p className={`text-2xl font-bold ${c.text}`}>{r.impact}%</p>
              <p className="text-white/40 text-xs">Impact</p>
              <div className="mt-2 pt-2 border-t border-white/5 grid grid-cols-2 gap-1 text-xs">
                <div>
                  <p className="text-white/30">Capacity Loss</p>
                  <p className="text-white/70 font-medium">{r.capacityReduction}K bpd</p>
                </div>
                <div>
                  <p className="text-white/30">Recovery</p>
                  <p className="text-white/70 font-medium">{r.recoveryDays}d</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-t border-white/5">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              {["Refinery", "Location", "Capacity", "Impact %", "Capacity Loss", "Risk Level", "Recovery"].map(h => (
                <th key={h} className="px-4 py-2.5 text-white/30 font-medium text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {impacts.map((r, i) => {
              const c = riskColors[r.riskLevel];
              return (
                <motion.tr
                  key={r.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-2.5 text-white/80 font-medium whitespace-nowrap">{r.name}</td>
                  <td className="px-4 py-2.5 text-white/40 flex items-center gap-1 whitespace-nowrap"><MapPin className="w-3 h-3" />{r.location}</td>
                  <td className="px-4 py-2.5 text-white/60 whitespace-nowrap">{r.capacity}K bpd</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${r.impact}%`, backgroundColor: r.riskLevel === 'critical' ? '#FF6B6B' : r.riskLevel === 'high' ? '#F97316' : r.riskLevel === 'medium' ? '#EAB308' : '#2DDDA8' }} />
                      </div>
                      <span className={`font-bold ${c.text}`}>{r.impact}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-white/60 whitespace-nowrap">{r.capacityReduction}K bpd</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${c.bg} ${c.text}`}>{r.riskLevel}</span>
                  </td>
                  <td className="px-4 py-2.5 text-white/60 whitespace-nowrap">{r.recoveryDays} days</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}