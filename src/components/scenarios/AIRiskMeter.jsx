import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, Zap, Activity } from 'lucide-react';

function computeRiskScore(scenario) {
  if (!scenario) return 0;
  const supplyScore = Math.min(scenario.supplyLoss * 1.8, 35);
  const priceScore = Math.min(scenario.priceImpact * 0.6, 20);
  const gdpScore = Math.min(Math.abs(scenario.gdpImpact) * 15, 20);
  const recoveryScore = Math.min(scenario.recovery / 6, 15);
  const severityScore = scenario.severity * 0.1;
  return Math.min(Math.round(supplyScore + priceScore + gdpScore + recoveryScore + severityScore), 100);
}

const riskLevels = [
  { max: 25, label: "LOW", color: "#2DDDA8", bg: "bg-mint/10", text: "text-mint", desc: "Manageable disruption with minimal national impact" },
  { max: 50, label: "MEDIUM", color: "#EAB308", bg: "bg-yellow-500/10", text: "text-yellow-400", desc: "Significant disruption requiring proactive response" },
  { max: 75, label: "HIGH", color: "#F97316", bg: "bg-orange-500/10", text: "text-orange-400", desc: "Severe disruption with major economic consequences" },
  { max: 100, label: "CRITICAL", color: "#FF6B6B", bg: "bg-coral/10", text: "text-coral", desc: "National emergency — immediate executive action required" },
];

function getRiskConfig(score) {
  return riskLevels.find(l => score <= l.max) || riskLevels[riskLevels.length - 1];
}

const factors = [
  { key: "supplyLoss", label: "Supply Loss", weight: 35, calc: (s) => Math.min(s.supplyLoss * 1.8, 35) },
  { key: "priceImpact", label: "Price Impact", weight: 20, calc: (s) => Math.min(s.priceImpact * 0.6, 20) },
  { key: "gdpImpact", label: "GDP Impact", weight: 20, calc: (s) => Math.min(Math.abs(s.gdpImpact) * 15, 20) },
  { key: "recovery", label: "Recovery Time", weight: 15, calc: (s) => Math.min(s.recovery / 6, 15) },
  { key: "severity", label: "Severity", weight: 10, calc: (s) => s.severity * 0.1 },
];

export default function AIRiskMeter({ scenario }) {
  const [displayScore, setDisplayScore] = useState(0);
  const targetScore = computeRiskScore(scenario);
  const config = getRiskConfig(displayScore);

  useEffect(() => {
    if (!scenario) { setDisplayScore(0); return; }
    let start = 0;
    const step = Math.ceil(targetScore / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= targetScore) { setDisplayScore(targetScore); clearInterval(timer); }
      else setDisplayScore(start);
    }, 25);
    return () => clearInterval(timer);
  }, [targetScore, scenario]);

  const chartData = [{ value: displayScore, fill: config.color }];

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-white/40" />
        <h3 className="text-white font-semibold text-sm">AI Risk Level Meter</h3>
      </div>

      <div className="flex flex-col items-center">
        {/* Gauge */}
        <div className="relative w-48 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="85%" innerRadius="60%" outerRadius="90%"
              startAngle={180} endAngle={0} data={[{ value: 100, fill: 'rgba(255,255,255,0.05)' }, ...chartData]}
            >
              <RadialBar dataKey="value" cornerRadius={6} background={false} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <motion.p
              key={displayScore}
              className="text-4xl font-black"
              style={{ color: config.color }}
            >
              {displayScore}
            </motion.p>
            <p className="text-white/30 text-xs">/ 100</p>
          </div>
        </div>

        {/* Label */}
        <div className={`mt-3 px-4 py-1.5 rounded-full ${config.bg} border border-current/20`}>
          <p className={`text-sm font-black tracking-widest ${config.text}`}>{config.label} RISK</p>
        </div>
        <p className="text-white/40 text-xs text-center mt-2 max-w-[220px] leading-relaxed">{config.desc}</p>
      </div>

      {/* Factor Breakdown */}
      {scenario && (
        <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
          <p className="text-white/30 text-xs font-medium mb-2">Score Breakdown</p>
          {factors.map(f => {
            const score = Math.round(f.calc(scenario));
            const pct = Math.round((score / f.weight) * 100);
            return (
              <div key={f.key} className="flex items-center gap-2">
                <span className="text-white/40 text-xs w-24 shrink-0">{f.label}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                </div>
                <span className="text-white/50 text-xs w-8 text-right">{score}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}