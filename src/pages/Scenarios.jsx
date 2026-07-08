import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Play, Loader2, AlertTriangle, DollarSign, Clock, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import AIRiskMeter from '@/components/scenarios/AIRiskMeter';
import RefineryImpactTable, { calculateRefineryImpacts } from '@/components/scenarios/RefineryImpactTable';
import AIRecommendationsEngine from '@/components/scenarios/AIRecommendationsEngine';

const predefined = [
  { id: "hormuz", name: "Strait of Hormuz Closure", location: "Persian Gulf", severity: 95, duration: 30, supplyLoss: 35, priceImpact: 45, gdpImpact: -1.2, inflationImpact: 2.5, damage: 18.5, recovery: 90 },
  { id: "redsea", name: "Red Sea Shutdown", location: "Bab el-Mandeb", severity: 80, duration: 21, supplyLoss: 18, priceImpact: 25, gdpImpact: -0.5, inflationImpact: 1.2, damage: 8.2, recovery: 45 },
  { id: "opec", name: "OPEC+ Emergency Cut", location: "Global", severity: 70, duration: 60, supplyLoss: 12, priceImpact: 30, gdpImpact: -0.4, inflationImpact: 1.8, damage: 12.1, recovery: 120 },
  { id: "sanctions", name: "Sanctions Escalation", location: "Russia/Iran", severity: 75, duration: 90, supplyLoss: 22, priceImpact: 20, gdpImpact: -0.6, inflationImpact: 1.5, damage: 14.3, recovery: 180 },
  { id: "port", name: "Port Congestion Crisis", location: "India Ports", severity: 50, duration: 14, supplyLoss: 8, priceImpact: 5, gdpImpact: -0.1, inflationImpact: 0.4, damage: 2.8, recovery: 21 },
  { id: "conflict", name: "Maritime Conflict", location: "Indian Ocean", severity: 90, duration: 45, supplyLoss: 28, priceImpact: 40, gdpImpact: -1.0, inflationImpact: 2.2, damage: 16.7, recovery: 75 },
];

export default function Scenarios() {
  const [selected, setSelected] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState(null);
  const [refineryImpacts, setRefineryImpacts] = useState([]);
  const [customDuration, setCustomDuration] = useState([30]);
  const [customSeverity, setCustomSeverity] = useState([70]);

  const runSimulation = (scenario) => {
    setSimulating(true);
    setSelected(scenario);
    const dur = customDuration[0];
    const sev = customSeverity[0];
    const factor = (sev / scenario.severity) * (dur / scenario.duration);
    setTimeout(() => {
      const computed = {
        ...scenario,
        duration: dur,
        severity: sev,
        supplyLoss: Math.round(scenario.supplyLoss * factor * 10) / 10,
        priceImpact: Math.round(scenario.priceImpact * factor * 10) / 10,
        gdpImpact: Math.round(scenario.gdpImpact * factor * 100) / 100,
        inflationImpact: Math.round(scenario.inflationImpact * factor * 100) / 100,
        damage: Math.round(scenario.damage * factor * 10) / 10,
        recovery: Math.round(scenario.recovery * (dur / scenario.duration)),
        timeline: Array.from({ length: 6 }, (_, i) => ({
          week: `W${i + 1}`,
          supply: Math.max(60, 100 - scenario.supplyLoss * factor * Math.sin((i / 5) * Math.PI)),
          price: 82 + scenario.priceImpact * factor * Math.sin(((i + 1) / 6) * Math.PI) * 0.7,
        })),
      };
      setResults(computed);
      setRefineryImpacts(calculateRefineryImpacts(computed));
      setSimulating(false);
    }, 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Disruption Scenario Modeller</h1>
        <p className="text-white/40 text-sm mt-1">Simulate future disruptions and forecast economic impact with AI-powered analysis</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Scenario Selection */}
        <div className="space-y-5">
          <div className="glass rounded-2xl">
            <div className="px-5 py-3 border-b border-white/5">
              <h3 className="text-white font-semibold text-sm">Predefined Scenarios</h3>
            </div>
            <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto">
              {predefined.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setSelected(s); setCustomDuration([s.duration]); setCustomSeverity([s.severity]); setResults(null); setRefineryImpacts([]); }}
                  className={`w-full text-left p-3 rounded-xl transition-all ${selected?.id === s.id ? 'bg-lavender/10 border border-lavender/30' : 'bg-white/[0.03] border border-transparent hover:bg-white/[0.05]'}`}
                >
                  <p className="text-white text-sm font-medium">{s.name}</p>
                  <p className="text-white/30 text-xs mt-0.5">{s.location}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs font-semibold ${s.severity >= 80 ? 'text-coral' : s.severity >= 60 ? 'text-lavender' : 'text-mint'}`}>Risk: {s.severity}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/40 text-xs">{s.duration} days</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Risk Meter */}
          <AIRiskMeter scenario={results} />
        </div>

        {/* Simulation Controls + Results */}
        <div className="lg:col-span-2 space-y-5">
          {/* Controls */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">Simulation Parameters</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-white/50 text-xs mb-2 block">Duration: {customDuration[0]} days</label>
                <Slider value={customDuration} onValueChange={setCustomDuration} min={7} max={180} step={1} className="mt-2" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-2 block">Severity: {customSeverity[0]}/100</label>
                <Slider value={customSeverity} onValueChange={setCustomSeverity} min={10} max={100} step={1} className="mt-2" />
              </div>
            </div>
            <Button
              onClick={() => selected && runSimulation(selected)}
              disabled={!selected || simulating}
              className="mt-5 bg-lavender hover:bg-lavender-dark text-black font-semibold"
            >
              {simulating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Simulating...</> : <><Play className="w-4 h-4 mr-2" />Execute Simulation</>}
            </Button>
          </div>

          {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Impact Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: AlertTriangle, label: "Supply Loss", value: `${results.supplyLoss}%`, color: "text-coral" },
                  { icon: DollarSign, label: "Price Impact", value: `+${results.priceImpact}%`, color: "text-lavender" },
                  { icon: TrendingDown, label: "GDP Impact", value: `${results.gdpImpact}%`, color: "text-coral" },
                  { icon: Clock, label: "Recovery", value: `${results.recovery}d`, color: "text-mint" },
                ].map((m, i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <m.icon className={`w-4 h-4 ${m.color} mb-2`} />
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-white/40 text-xs">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Economic Damage */}
              <div className="glass-coral rounded-2xl p-5 text-center">
                <p className="text-white/50 text-xs mb-1">Estimated Economic Damage</p>
                <p className="text-5xl font-bold text-coral">${results.damage}B</p>
                <p className="text-white/30 text-sm mt-1">Inflation Impact: +{results.inflationImpact}%</p>
              </div>

              {/* Forecast Chart */}
              <div className="glass rounded-2xl">
                <div className="px-5 py-3 border-b border-white/5">
                  <h3 className="text-white font-semibold text-sm">Impact Forecast</h3>
                </div>
                <div className="p-4 h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#18181a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                      <Line type="monotone" dataKey="supply" stroke="#2DDDA8" strokeWidth={2} dot={false} name="Supply %" />
                      <Line type="monotone" dataKey="price" stroke="#FF6B6B" strokeWidth={2} dot={false} name="Price $/bbl" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {!results && !simulating && (
            <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <BarChart3 className="w-12 h-12 text-white/10 mb-4" />
              <p className="text-white/30 text-sm">Select a scenario and run the simulation</p>
              <p className="text-white/20 text-xs mt-1">AI will analyze refinery impacts, compute risk score, and generate recommendations</p>
            </div>
          )}
        </div>
      </div>

      {/* Refinery Impact Analysis — full width */}
      {refineryImpacts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <RefineryImpactTable impacts={refineryImpacts} />
        </motion.div>
      )}

      {/* AI Recommendations — full width */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <AIRecommendationsEngine scenario={results} refineryImpacts={refineryImpacts} />
        </motion.div>
      )}
    </div>
  );
}