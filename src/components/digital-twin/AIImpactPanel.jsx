import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Route, Shield, AlertTriangle } from 'lucide-react';

export default function AIImpactPanel({ disruption, affectedNodeIds, nodes }) {
  if (!disruption || affectedNodeIds.length === 0) return null;

  const affectedNodes = nodes.filter(n => affectedNodeIds.includes(n.id));
  const refineries = affectedNodes.filter(n => n.type === 'refinery');
  const ports = affectedNodes.filter(n => n.type === 'port');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Brain className="w-4 h-4 text-lavender" />
        <h3 className="text-white font-semibold text-sm">AI Impact Prediction</h3>
      </div>

      <div className="p-4 space-y-3">
        {/* Affected Assets */}
        <div>
          <p className="text-white/30 text-xs font-medium mb-2">Affected Assets ({affectedNodes.length})</p>
          <div className="space-y-1.5">
            {affectedNodes.map(n => (
              <div key={n.id} className="flex items-center justify-between bg-coral/5 border border-coral/15 rounded-lg px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-coral pulse-coral" />
                  <p className="text-white/70 text-xs">{n.name}</p>
                </div>
                <span className="text-coral text-xs font-semibold capitalize">{n.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/[0.03] rounded-xl p-3">
            <AlertTriangle className="w-3.5 h-3.5 text-coral mb-1" />
            <p className="text-coral font-bold text-xl">{refineries.length}</p>
            <p className="text-white/30 text-xs">Refineries Hit</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3">
            <Route className="w-3.5 h-3.5 text-lavender mb-1" />
            <p className="text-lavender font-bold text-xl">{ports.length}</p>
            <p className="text-white/30 text-xs">Ports Impacted</p>
          </div>
        </div>

        {/* Mitigation */}
        <div className="bg-mint/5 border border-mint/20 rounded-xl p-3">
          <p className="text-mint text-xs font-semibold mb-2 flex items-center gap-1.5"><Shield className="w-3 h-3" />AI Mitigation Strategy</p>
          <div className="space-y-1.5 text-xs text-white/50">
            <p>→ Reroute affected shipments via Cape of Good Hope</p>
            <p>→ Release {Math.round(disruption.supplyLoss * 0.4)}% from strategic reserves</p>
            <p>→ Activate emergency supplier contracts (UAE, Kuwait)</p>
            <p>→ Prioritize supply to unaffected refineries</p>
          </div>
        </div>

        {/* Recovery */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/30">Estimated Recovery:</span>
          <span className="text-mint font-semibold">{disruption.recovery} days</span>
        </div>
      </div>
    </motion.div>
  );
}