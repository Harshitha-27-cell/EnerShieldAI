import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, Loader2, X, AlertTriangle, TrendingDown, Clock, Route } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

const DISRUPTIONS = [
  { id: "hormuz", name: "Strait of Hormuz Closure", icon: "🚢", affectedNodes: [1, 2, 11, 12], supplyLoss: 35, economic: 18.5, recovery: 90 },
  { id: "port_failure", name: "Paradip Port Failure", icon: "⚓", affectedNodes: [3, 4, 10], supplyLoss: 12, economic: 3.2, recovery: 21 },
  { id: "route_block", name: "Red Sea Route Blockage", icon: "⛽", affectedNodes: [2, 5, 6], supplyLoss: 18, economic: 6.8, recovery: 45 },
  { id: "refinery_fire", name: "Jamnagar Refinery Incident", icon: "🏭", affectedNodes: [1, 11, 12], supplyLoss: 22, economic: 8.1, recovery: 60 },
  { id: "pipeline", name: "Major Pipeline Rupture", icon: "🔧", affectedNodes: [1, 9, 10], supplyLoss: 8, economic: 2.1, recovery: 14 },
];

export default function WhatIfSimulator({ nodes, onSimulationResult }) {
  const [selected, setSelected] = useState(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const runSim = async (disruption) => {
    setSelected(disruption);
    setRunning(true);
    setResult(null);

    try {
      const affectedNames = disruption.affectedNodes.map(id => nodes.find(n => n.id === id)?.name).filter(Boolean).join(', ');
      const aiResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an energy infrastructure AI. A disruption has occurred: "${disruption.name}".
Affected assets: ${affectedNames}
Supply Loss: ${disruption.supplyLoss}%
Economic Impact: $${disruption.economic}B

Generate a What-If impact analysis and mitigation plan for India's energy supply chain.`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            bottlenecks: { type: "array", items: { type: "string" } },
            alternative_routes: { type: "array", items: { type: "string" } },
            recommended_actions: { type: "array", items: { type: "string" } },
            recovery_steps: { type: "array", items: { type: "string" } }
          }
        }
      });

      setResult({
        disruption,
        affectedNodeIds: disruption.affectedNodes,
        ai: aiResult,
      });
      onSimulationResult && onSimulationResult(disruption.affectedNodes, disruption);
    } catch (e) {
      setResult({
        disruption,
        affectedNodeIds: disruption.affectedNodes,
        ai: {
          summary: `${disruption.name} causes ${disruption.supplyLoss}% supply loss and $${disruption.economic}B economic impact.`,
          bottlenecks: ["Critical port congestion expected", "Refinery feedstock shortage within 72hrs", "Pipeline pressure imbalances"],
          alternative_routes: ["Cape of Good Hope bypass", "West African crude via Atlantic route", "Central Asian pipeline diversions"],
          recommended_actions: ["Activate strategic petroleum reserve release", "Emergency tanker redeployment", "Fast-track alternative supplier activation"],
          recovery_steps: ["Assess infrastructure damage", "Coordinate with allied nations", "Implement phased supply restoration"]
        }
      });
      onSimulationResult && onSimulationResult(disruption.affectedNodes, disruption);
    } finally {
      setRunning(false);
    }
  };

  const clear = () => { setResult(null); setSelected(null); onSimulationResult && onSimulationResult([], null); };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-400" />
        <h3 className="text-white font-semibold text-sm">What-If Simulator</h3>
        {result && <button onClick={clear} className="ml-auto text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>}
      </div>

      {/* Disruption Buttons */}
      <div className="p-3 space-y-1.5">
        {DISRUPTIONS.map(d => (
          <button
            key={d.id}
            onClick={() => !running && runSim(d)}
            disabled={running}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all text-xs ${selected?.id === d.id ? 'bg-coral/10 border border-coral/30' : 'bg-white/[0.03] border border-transparent hover:bg-white/[0.06]'}`}
          >
            <span className="text-base">{d.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 font-medium truncate">{d.name}</p>
              <p className="text-white/30">-{d.supplyLoss}% supply · ${d.economic}B impact</p>
            </div>
            {running && selected?.id === d.id ? (
              <Loader2 className="w-3.5 h-3.5 text-coral animate-spin shrink-0" />
            ) : (
              <Play className="w-3.5 h-3.5 text-white/20 shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* AI Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 overflow-hidden"
          >
            <div className="p-3 space-y-3">
              <div className="bg-coral/5 border border-coral/20 rounded-xl p-3">
                <p className="text-coral text-xs font-semibold mb-1">⚡ AI IMPACT ANALYSIS</p>
                <p className="text-white/60 text-xs leading-relaxed">{result.ai.summary}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/[0.03] rounded-lg p-2">
                  <p className="text-coral font-bold text-lg">{result.disruption.supplyLoss}%</p>
                  <p className="text-white/30">Supply Loss</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2">
                  <p className="text-coral font-bold text-lg">${result.disruption.economic}B</p>
                  <p className="text-white/30">Economic Hit</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2">
                  <p className="text-mint font-bold text-lg">{result.disruption.recovery}d</p>
                  <p className="text-white/30">Recovery</p>
                </div>
              </div>

              {result.ai.bottlenecks?.length > 0 && (
                <div>
                  <p className="text-white/30 text-xs font-medium mb-1.5">⚠ Bottlenecks</p>
                  {result.ai.bottlenecks.slice(0, 3).map((b, i) => (
                    <p key={i} className="text-white/50 text-xs flex items-start gap-1.5 mb-1"><AlertTriangle className="w-3 h-3 text-coral shrink-0 mt-0.5" />{b}</p>
                  ))}
                </div>
              )}

              {result.ai.recommended_actions?.length > 0 && (
                <div>
                  <p className="text-white/30 text-xs font-medium mb-1.5">✅ Actions</p>
                  {result.ai.recommended_actions.slice(0, 3).map((a, i) => (
                    <p key={i} className="text-white/50 text-xs flex items-start gap-1.5 mb-1"><span className="text-mint text-xs font-bold shrink-0">{i + 1}.</span>{a}</p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}