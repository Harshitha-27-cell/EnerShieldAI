import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Ship, Globe, Database, Factory, AlertTriangle, ChevronDown, ChevronUp, TrendingDown, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const priorityConfig = {
  high: { bg: "bg-coral/10", text: "text-coral", border: "border-coral/30", label: "HIGH PRIORITY" },
  medium: { bg: "bg-lavender/10", text: "text-lavender", border: "border-lavender/30", label: "MEDIUM" },
  low: { bg: "bg-mint/10", text: "text-mint", border: "border-mint/30", label: "LOW" },
};

const categoryIcons = {
  supplier: Globe,
  routing: Ship,
  reserves: Database,
  refinery: Factory,
  emergency: AlertTriangle,
};

export default function AIRecommendationsEngine({ scenario, refineryImpacts }) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!scenario) return;
    generateRecommendations();
  }, [scenario?.id, scenario?.severity, scenario?.duration]);

  const generateRecommendations = async () => {
    if (!scenario) return;
    setLoading(true);
    try {
      const topRefineries = refineryImpacts?.slice(0, 3).map(r => `${r.name} (${r.impact}% impact)`).join(', ') || 'Jamnagar, Paradip, Mumbai';

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are India's Chief Energy Security Advisor. A disruption scenario has been triggered:
Scenario: ${scenario.name}
Location: ${scenario.location}
Severity: ${scenario.severity}/100
Supply Loss: ${scenario.supplyLoss}%
Price Impact: +${scenario.priceImpact}%
GDP Impact: ${scenario.gdpImpact}%
Duration: ${scenario.duration} days
Recovery: ${scenario.recovery} days
Top Affected Refineries: ${topRefineries}

Generate 6 specific, actionable recommendations across these exact categories: supplier, routing, reserves, refinery, emergency.
Each must be concrete and specific to India's energy supply chain.`,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  category: { type: "string", enum: ["supplier", "routing", "reserves", "refinery", "emergency"] },
                  priority: { type: "string", enum: ["high", "medium", "low"] },
                  title: { type: "string" },
                  description: { type: "string" },
                  estimated_benefit: { type: "string" },
                  risk_reduction_pct: { type: "number" },
                  timeline: { type: "string" },
                  actions: { type: "array", items: { type: "string" } }
                }
              }
            },
            executive_summary: { type: "string" }
          }
        }
      });
      setRecommendations(result);
    } catch (e) {
      // fallback
      setRecommendations(getFallbackRecs(scenario));
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  if (loading) {
    return (
      <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full bg-lavender/10 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-lavender animate-spin" />
        </div>
        <p className="text-white/50 text-sm">AI generating recommendations...</p>
        <p className="text-white/20 text-xs">Analyzing supply chain vulnerabilities</p>
      </div>
    );
  }

  if (!recommendations) return null;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-lavender" />
        <h3 className="text-white font-semibold text-sm">AI Recommended Actions</h3>
        <span className="ml-auto text-xs text-white/30">{recommendations.recommendations?.length || 0} actions</span>
      </div>

      {recommendations.executive_summary && (
        <div className="px-5 py-3 border-b border-white/5 bg-lavender/5">
          <p className="text-lavender/80 text-xs leading-relaxed">{recommendations.executive_summary}</p>
        </div>
      )}

      <div className="p-4 space-y-3">
        {recommendations.recommendations?.map((rec, i) => {
          const pc = priorityConfig[rec.priority] || priorityConfig.medium;
          const Icon = categoryIcons[rec.category] || AlertTriangle;
          const isExpanded = expanded[rec.id || i];
          return (
            <motion.div
              key={rec.id || i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`border ${pc.border} ${pc.bg} rounded-xl overflow-hidden`}
            >
              <button
                onClick={() => toggle(rec.id || i)}
                className="w-full p-4 flex items-start gap-3 text-left"
              >
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${pc.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${pc.text}`}>{pc.label}</span>
                    <span className="text-white/20 text-xs capitalize">{rec.category}</span>
                  </div>
                  <p className="text-white/80 text-sm font-medium leading-snug">{rec.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                    {rec.risk_reduction_pct > 0 && (
                      <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-mint" />{rec.risk_reduction_pct}% risk reduction</span>
                    )}
                    {rec.timeline && (
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rec.timeline}</span>
                    )}
                    {rec.estimated_benefit && (
                      <span className="text-mint">{rec.estimated_benefit}</span>
                    )}
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-white/20 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-white/20 shrink-0 mt-1" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
                      <p className="text-white/60 text-xs leading-relaxed">{rec.description}</p>
                      {rec.actions?.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-white/30 text-xs font-medium">Action Steps:</p>
                          {rec.actions.map((action, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <span className={`text-xs font-bold ${pc.text} mt-0.5`}>{j + 1}.</span>
                              <p className="text-white/60 text-xs">{action}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function getFallbackRecs(scenario) {
  return {
    executive_summary: `Immediate multi-pronged response required. Activate emergency procurement from Gulf alternatives and release strategic reserves proportional to ${scenario.supplyLoss}% supply loss.`,
    recommendations: [
      { id: "1", category: "supplier", priority: "high", title: "Emergency Procurement from UAE and Saudi Arabia", description: "Activate emergency crude procurement contracts with ADNOC and Saudi Aramco to compensate for supply shortfall.", estimated_benefit: "Covers 40% of deficit", risk_reduction_pct: 28, timeline: "24–72 hours", actions: ["Contact ADNOC emergency desk immediately", "Activate existing framework agreements", "Book spot tankers for next 30 days"] },
      { id: "2", category: "reserves", priority: "high", title: "Release Strategic Petroleum Reserves", description: "Authorize partial release from Vizag, Mangalore, and Padur SPR facilities to stabilize domestic supply.", estimated_benefit: "45 days supply buffer", risk_reduction_pct: 22, timeline: "Immediate", actions: ["Authorize MoPNG release order", "Coordinate with IOC for distribution", "Release up to 20% of stored volume"] },
      { id: "3", category: "routing", priority: "medium", title: "Reroute Tankers via Cape of Good Hope", description: "Divert tankers currently using affected routes through the Cape of Good Hope to avoid disruption zones.", estimated_benefit: "Bypasses 80% of disruption", risk_reduction_pct: 18, timeline: "48 hours", actions: ["Notify shipping partners immediately", "Calculate additional transit costs", "Coordinate with port authorities for extended schedules"] },
      { id: "4", category: "refinery", priority: "medium", title: "Prioritize Supply to High-Capacity Refineries", description: "Allocate available crude supply to Jamnagar and Paradip as priority refineries due to highest capacity and national coverage.", estimated_benefit: "Maximizes output efficiency", risk_reduction_pct: 15, timeline: "1–3 days", actions: ["Issue supply allocation directive", "Adjust pipeline flow priorities", "Coordinate with IOCL and RIL"] },
      { id: "5", category: "supplier", priority: "medium", title: "Activate West African Spot Market Purchases", description: "Purchase spot cargoes from Nigeria and Angola to diversify supply and reduce route dependency.", estimated_benefit: "$2.1B savings potential", risk_reduction_pct: 12, timeline: "3–5 days", actions: ["Contact NNPC emergency desk", "Engage commodity traders for spot deals", "Arrange insurance for alternative routes"] },
      { id: "6", category: "emergency", priority: "high", title: "Initiate Demand-Side Management", description: "Implement emergency fuel conservation measures to reduce demand pressure during the supply disruption period.", estimated_benefit: "Reduces demand by 8–12%", risk_reduction_pct: 10, timeline: "Immediate", actions: ["Issue fuel conservation advisory", "Restrict non-essential industrial consumption", "Coordinate with state governments"] },
    ]
  };
}