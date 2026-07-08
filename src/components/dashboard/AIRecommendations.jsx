import React from 'react';
import { Brain, ArrowRight, Zap, Shield, Truck } from 'lucide-react';

const recommendations = [
  {
    icon: Truck,
    priority: "urgent",
    title: "Reroute Red Sea shipments via Cape of Good Hope",
    impact: "Reduces exposure to Houthi threat by 94%",
    cost: "+$2.1M additional freight cost",
  },
  {
    icon: Shield,
    priority: "high",
    title: "Increase Vizag strategic reserve fill to 98%",
    impact: "Adds 3.2 days of emergency coverage",
    cost: "$340M procurement cost",
  },
  {
    icon: Zap,
    priority: "medium",
    title: "Activate backup UAE-India direct crude contract",
    impact: "Secures 180K bbl/day alternative supply",
    cost: "+$0.8/bbl premium vs current",
  },
];

const prioStyles = {
  urgent: "bg-coral/10 text-coral border-coral/20",
  high: "bg-lavender/10 text-lavender border-lavender/20",
  medium: "bg-mint/10 text-mint border-mint/20",
};

export default function AIRecommendations() {
  return (
    <div className="glass rounded-2xl">
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <Brain className="w-4 h-4 text-lavender" />
        <h3 className="text-white font-semibold text-sm">AI Recommendations</h3>
      </div>
      <div className="divide-y divide-white/5">
        {recommendations.map((r, i) => (
          <div key={i} className="px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <r.icon className="w-4 h-4 text-white/50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${prioStyles[r.priority]}`}>
                    {r.priority}
                  </span>
                </div>
                <p className="text-white/90 text-sm font-medium mb-1">{r.title}</p>
                <p className="text-mint text-xs">{r.impact}</p>
                <p className="text-white/30 text-xs mt-0.5">{r.cost}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}