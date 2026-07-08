import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, Shield, Zap, Download, ChevronDown, ChevronUp, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const riskText = { critical: "text-coral", high: "text-coral", medium: "text-lavender", low: "text-mint" };
const riskBg = { critical: "bg-coral/10", high: "bg-coral/10", medium: "bg-lavender/10", low: "bg-mint/10" };
const statusStyles = {
  draft: "bg-white/5 text-white/40",
  pending_approval: "bg-lavender/10 text-lavender",
  approved: "bg-mint/10 text-mint",
  executing: "bg-mint/10 text-mint",
  completed: "bg-white/5 text-white/40"
};

export default function Resilience() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const loadPlans = async () => {
    const data = await base44.entities.CrisisResponse.list('-created_date', 20);
    setPlans(data);
    setLoading(false);
  };

  useEffect(() => { loadPlans(); }, []);

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a crisis response plan for a Red Sea oil supply disruption affecting India's energy supply chain. 
India imports ~4.7M bbl/day, 35% through the Red Sea/Suez corridor. 
Return a structured plan with an executive briefing, immediate 24-hour actions, 7-day strategy, and 30-day recovery plan.
Each plan section should have 4-5 specific, actionable bullet points.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            executive_briefing: { type: "string" },
            plan_24h: { type: "string" },
            plan_7d: { type: "string" },
            plan_30d: { type: "string" },
            expected_risk_reduction_pct: { type: "number" },
            estimated_cost_billion_usd: { type: "number" }
          }
        }
      });

      await base44.entities.CrisisResponse.create({
        title: result.title || "AI-Generated Crisis Response Plan",
        risk_level: "high",
        executive_briefing: result.executive_briefing,
        plan_24h: result.plan_24h,
        plan_7d: result.plan_7d,
        plan_30d: result.plan_30d,
        expected_risk_reduction_pct: result.expected_risk_reduction_pct || 65,
        estimated_cost_billion_usd: result.estimated_cost_billion_usd || 5.0,
        status: "pending_approval"
      });

      await loadPlans();
    } catch (e) {
      console.error(e);
    }
    setGenerating(false);
  };

  const approvePlan = async (planId) => {
    setApprovingId(planId);
    try {
      await base44.entities.CrisisResponse.update(planId, { status: "approved" });
      setPlans(prev => prev.map(p => p.id === planId ? { ...p, status: "approved" } : p));
    } catch (e) {
      console.error(e);
    }
    setApprovingId(null);
  };

  const approvedCount = plans.filter(p => p.status === 'approved').length;
  const avgRiskReduction = plans.length > 0
    ? Math.round(plans.reduce((s, p) => s + (p.expected_risk_reduction_pct || 0), 0) / plans.length)
    : 0;
  const totalCost = plans.reduce((s, p) => s + (p.estimated_cost_billion_usd || 0), 0).toFixed(1);

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Resilience Commander</h1>
          <p className="text-white/40 text-sm mt-1">Auto-generated crisis response strategies and executable action plans</p>
        </div>
        <Button onClick={generatePlan} disabled={generating} className="bg-lavender hover:bg-lavender-dark text-black font-semibold">
          {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Brain className="w-4 h-4 mr-2" />Generate New Plan</>}
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-lavender rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">Active Plans</p>
          <p className="text-3xl font-bold text-lavender">{plans.length}</p>
        </div>
        <div className="glass-mint rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">Approved</p>
          <p className="text-3xl font-bold text-mint">{approvedCount}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">Avg Risk Reduction</p>
          <p className="text-3xl font-bold text-white">{avgRiskReduction}%</p>
        </div>
        <div className="glass-coral rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">Total Est. Cost</p>
          <p className="text-3xl font-bold text-coral">${totalCost}B</p>
        </div>
      </div>

      {/* Crisis Plans */}
      <div className="space-y-4">
        {loading && (
          <div className="glass rounded-2xl p-10 text-center text-white/30">Loading crisis plans...</div>
        )}
        {!loading && plans.length === 0 && (
          <div className="glass rounded-2xl p-10 text-center">
            <Brain className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No crisis plans yet. Click "Generate New Plan" to create one.</p>
          </div>
        )}
        {plans.map(plan => {
          const expanded = expandedId === plan.id;
          const risk = plan.risk_level || 'medium';
          return (
            <motion.div key={plan.id} layout className={`glass rounded-2xl overflow-hidden border ${risk === 'critical' ? 'border-coral/20' : 'border-white/5'}`}>
              <button
                onClick={() => setExpandedId(expanded ? null : plan.id)}
                className="w-full px-6 py-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${riskBg[risk]}`}>
                  <Brain className={`w-5 h-5 ${riskText[risk]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold">{plan.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${riskText[risk]} ${riskBg[risk]}`}>{risk}</span>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${statusStyles[plan.status] || statusStyles.draft}`}>{(plan.status || 'draft').replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="text-right mr-4">
                  <p className="text-mint text-sm font-semibold">-{plan.expected_risk_reduction_pct || 0}% risk</p>
                  <p className="text-white/30 text-xs">${plan.estimated_cost_billion_usd || 0}B est. cost</p>
                </div>
                {expanded ? <ChevronUp className="w-5 h-5 text-white/30" /> : <ChevronDown className="w-5 h-5 text-white/30" />}
              </button>

              {expanded && (
                <div className="border-t border-white/5 px-6 py-5 space-y-5">
                  {plan.executive_briefing && (
                    <div className="glass-lavender rounded-xl p-4">
                      <h4 className="text-lavender text-xs font-semibold uppercase mb-2">Executive Briefing</h4>
                      <p className="text-white/70 text-sm leading-relaxed">{plan.executive_briefing}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { label: "24-Hour Response", data: plan.plan_24h, icon: Zap, color: "coral" },
                      { label: "7-Day Strategy", data: plan.plan_7d, icon: Clock, color: "lavender" },
                      { label: "30-Day Recovery", data: plan.plan_30d, icon: Shield, color: "mint" },
                    ].map((phase, i) => (
                      <div key={i} className="bg-white/[0.03] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <phase.icon className={`w-4 h-4 text-${phase.color}`} />
                          <h4 className={`text-xs font-semibold uppercase text-${phase.color}`}>{phase.label}</h4>
                        </div>
                        <div className="space-y-2">
                          {(phase.data || '').split('\n').filter(Boolean).map((line, j) => (
                            <p key={j} className="text-white/50 text-xs leading-relaxed">{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {plan.status === 'pending_approval' && (
                      <Button
                        onClick={() => approvePlan(plan.id)}
                        disabled={approvingId === plan.id}
                        className="bg-mint hover:bg-mint-dark text-black font-semibold text-sm"
                      >
                        {approvingId === plan.id
                          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Approving...</>
                          : <><CheckCircle className="w-4 h-4 mr-2" />Approve Plan</>}
                      </Button>
                    )}
                    {plan.status === 'approved' && (
                      <span className="flex items-center gap-2 text-mint text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Plan Approved
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}