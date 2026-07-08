import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Shield, Activity } from 'lucide-react';

const tickerItems = [
  { icon: AlertTriangle, text: "Red Sea: Elevated Risk — Houthi attacks ongoing", color: "text-coral" },
  { icon: TrendingUp, text: "Brent Crude: $82.4/bbl (+1.2%)", color: "text-mint" },
  { icon: Shield, text: "Strategic Reserves: 87% capacity — 42 days coverage", color: "text-lavender" },
  { icon: Activity, text: "Hormuz Transit: 18.2M bbl/day — Normal flow", color: "text-mint" },
  { icon: AlertTriangle, text: "OPEC+ Meeting: Production decision pending", color: "text-yellow-400" },
  { icon: Shield, text: "India Import Dependency: 87.4% — Monitoring", color: "text-lavender" },
];

export default function RiskTicker() {
  return (
    <div className="w-full overflow-hidden bg-black/40 border-y border-white/5 py-2.5">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: [0, -1600] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
            <span className="text-white/70">{item.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}