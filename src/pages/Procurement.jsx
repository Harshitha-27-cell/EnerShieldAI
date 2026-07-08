import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, DollarSign, Clock, Shield, MapPin, Ship, Star, Download, Loader2, ArrowRight, Sparkles, TrendingDown, AlertTriangle, CheckCircle, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';
import { base44 } from '@/api/base44Client';

const suppliers = [
  { id: 1, name: "Saudi Aramco", country: "Saudi Arabia", route: "Persian Gulf → Jamnagar", reliability: 94, risk: 42, capacity: 1.2, price: 80.5, delivery: 8, status: "active", alloc: 32, tankers: 4, ports: ["Jamnagar", "Mundra"], compatScore: 96 },
  { id: 2, name: "ADNOC", country: "UAE", route: "Fujairah → Mumbai", reliability: 91, risk: 38, capacity: 0.8, price: 81.2, delivery: 7, status: "active", alloc: 22, tankers: 3, ports: ["Mumbai JNPT", "Mundra"], compatScore: 92 },
  { id: 3, name: "Kuwait Petroleum", country: "Kuwait", route: "Mina al-Ahmadi → Paradip", reliability: 88, risk: 50, capacity: 0.5, price: 79.8, delivery: 10, status: "active", alloc: 14, tankers: 2, ports: ["Paradip", "Haldia"], compatScore: 88 },
  { id: 4, name: "Nigerian NNPC", country: "Nigeria", route: "Bonny → Kochi", reliability: 76, risk: 55, capacity: 0.4, price: 78.2, delivery: 18, status: "alternative", alloc: 12, tankers: 2, ports: ["Kochi", "Mangalore"], compatScore: 74 },
  { id: 5, name: "Rosneft", country: "Russia", route: "Novorossiysk → Jamnagar", reliability: 72, risk: 68, capacity: 0.9, price: 72.5, delivery: 22, status: "alternative", alloc: 12, tankers: 3, ports: ["Jamnagar"], compatScore: 70 },
  { id: 6, name: "Petrobras", country: "Brazil", route: "Santos → Mangalore", reliability: 82, risk: 28, capacity: 0.3, price: 83.1, delivery: 28, status: "alternative", alloc: 8, tankers: 1, ports: ["Mangalore", "Kochi"], compatScore: 80 },
];

const routes = [
  { id: 1, name: "Persian Gulf Direct", via: "Strait of Hormuz", distance: 2400, days: 8, risk: 65, riskReduction: 0, extraCost: 0, status: "primary" },
  { id: 2, name: "Red Sea / Suez", via: "Bab el-Mandeb", distance: 4200, days: 14, risk: 45, riskReduction: 22, extraCost: 1.8, status: "secondary" },
  { id: 3, name: "Cape of Good Hope", via: "Atlantic Ocean", distance: 11000, days: 28, risk: 12, riskReduction: 58, extraCost: 4.2, status: "alternative" },
  { id: 4, name: "East Africa Coast", via: "Mozambique Channel", distance: 6500, days: 19, risk: 20, riskReduction: 40, extraCost: 2.6, status: "alternative" },
];

const refineryCompat = [
  { name: "Jamnagar", capacity: 1360, utilization: 94, coverage: 88, compatible: ["Aramco", "ADNOC", "Russia"] },
  { name: "Paradip", capacity: 300, utilization: 78, coverage: 72, compatible: ["Kuwait", "Aramco", "Nigeria"] },
  { name: "Kochi", capacity: 310, utilization: 85, coverage: 80, compatible: ["ADNOC", "Nigeria", "Brazil"] },
  { name: "Mangalore", capacity: 360, utilization: 82, coverage: 78, compatible: ["Aramco", "Brazil", "ADNOC"] },
];

const radarData = [
  { metric: "Cost", Aramco: 75, ADNOC: 70, Russia: 95, Brazil: 60 },
  { metric: "Reliability", Aramco: 94, ADNOC: 91, Russia: 72, Brazil: 82 },
  { metric: "Speed", Aramco: 85, ADNOC: 88, Russia: 55, Brazil: 40 },
  { metric: "Risk", Aramco: 58, ADNOC: 62, Russia: 32, Brazil: 72 },
  { metric: "Capacity", Aramco: 90, ADNOC: 70, Russia: 80, Brazil: 30 },
];

const costData = suppliers.map(s => ({ name: s.name.split(' ')[0], price: s.price, fill: s.status === "active" ? "#2DDDA8" : "#A78BFA" }));

export default function Procurement() {
  const [view, setView] = useState("workflow");
  const [generating, setGenerating] = useState(false);
  const [execRec, setExecRec] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);

  const generateExecRec = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are India's Chief Energy Procurement Advisor. Generate an executive procurement recommendation for India's energy supply chain.

Current suppliers: Saudi Aramco (32% allocation), ADNOC (22%), Kuwait (14%), Nigeria (12%), Russia (12%), Brazil (8%)
Best route: Cape of Good Hope (58% risk reduction, +$4.2/bbl)
Top refinery: Jamnagar (1360K bpd, 94% utilization)
Market context: High geopolitical risk in Persian Gulf region

Generate a concise executive recommendation covering: best supplier choice, best route, expected savings, risk reduction, and top 3 next actions.`,
        response_json_schema: {
          type: "object",
          properties: {
            best_supplier: { type: "string" },
            best_route: { type: "string" },
            expected_savings_billion: { type: "number" },
            risk_reduction_pct: { type: "number" },
            executive_summary: { type: "string" },
            next_actions: { type: "array", items: { type: "string" } },
            impacted_refineries: { type: "array", items: { type: "string" } }
          }
        }
      });
      setExecRec(result);
    } catch (e) {
      setExecRec({
        best_supplier: "Saudi Aramco + ADNOC (Combined)",
        best_route: "Cape of Good Hope Bypass",
        expected_savings_billion: 2.1,
        risk_reduction_pct: 58,
        executive_summary: "Immediate reallocation to Gulf-based suppliers with Cape of Good Hope routing provides maximum supply security. Combined Aramco-ADNOC allocation of 54% covers India's baseline demand with minimum risk exposure.",
        next_actions: ["Execute emergency framework agreements with Aramco and ADNOC within 48 hours", "Divert 8 tankers to Cape of Good Hope route immediately", "Release 15% SPR to bridge the 28-day delivery window"],
        impacted_refineries: ["Jamnagar", "Paradip", "Kochi"]
      });
    } finally {
      setGenerating(false);
    }
  };

  const views = ["workflow", "suppliers", "routes", "comparison"];

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Adaptive Procurement Orchestrator</h1>
          <p className="text-white/40 text-sm mt-1">AI-powered decision workflow: disruption → supplier → route → procurement</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {views.map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-xl text-xs capitalize transition-colors ${view === v ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-mint rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">Active Suppliers</p>
          <p className="text-3xl font-bold text-mint">3</p>
        </div>
        <div className="glass-lavender rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">Alternatives Ready</p>
          <p className="text-3xl font-bold text-lavender">3</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">Avg. Cost</p>
          <p className="text-3xl font-bold text-white">$80.5<span className="text-lg text-white/40">/bbl</span></p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">Potential Savings</p>
          <p className="text-3xl font-bold text-mint">$2.1B<span className="text-lg text-white/40">/yr</span></p>
        </div>
      </div>

      {/* Workflow View */}
      {view === "workflow" && (
        <div className="space-y-5">
          {/* Flow Steps */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">Decision Workflow</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {["Disruption Detected", "Scenario Simulated", "Suppliers Identified", "Route Selected", "Procurement Generated", "Refinery Analysis"].map((step, i) => (
                <React.Fragment key={step}>
                  <div className="px-3 py-1.5 rounded-xl bg-mint/10 border border-mint/20 text-mint font-medium">{step}</div>
                  {i < 5 && <ArrowRight className="w-3.5 h-3.5 text-white/20 shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Supplier Ranking Leaderboard */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <h3 className="text-white font-semibold text-sm">AI Supplier Ranking Leaderboard</h3>
            </div>
            <div className="divide-y divide-white/5">
              {suppliers.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-5 py-3 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${i === 0 ? 'bg-yellow-400/20 text-yellow-400' : i === 1 ? 'bg-white/10 text-white/60' : i === 2 ? 'bg-orange-500/10 text-orange-400' : 'bg-white/5 text-white/30'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{s.name}</p>
                    <p className="text-white/30 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{s.country} · {s.delivery}d delivery</p>
                  </div>
                  <div className="hidden md:grid grid-cols-4 gap-4 text-xs text-right">
                    <div><p className="text-white/30">Reliability</p><p className="text-mint font-semibold">{s.reliability}%</p></div>
                    <div><p className="text-white/30">Risk</p><p className={`font-semibold ${s.risk >= 60 ? 'text-coral' : s.risk >= 40 ? 'text-lavender' : 'text-mint'}`}>{s.risk}</p></div>
                    <div><p className="text-white/30">Price</p><p className="text-white font-semibold">${s.price}</p></div>
                    <div><p className="text-white/30">Compat.</p><p className="text-lavender font-semibold">{s.compatScore}%</p></div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/30 text-xs">Allocation</p>
                    <p className="text-white font-bold">{s.alloc}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Route Comparison */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
              <Ship className="w-4 h-4 text-lavender" />
              <h3 className="text-white font-semibold text-sm">Route Comparison</h3>
            </div>
            <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {routes.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoute(r)}
                  className={`text-left p-4 rounded-xl border transition-all ${selectedRoute.id === r.id ? 'border-lavender/40 bg-lavender/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'}`}
                >
                  <p className="text-white font-medium text-sm mb-1">{r.name}</p>
                  <p className="text-white/30 text-xs mb-3">via {r.via}</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-white/40">Distance</span><span className="text-white/70">{r.distance.toLocaleString()} nm</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Transit</span><span className="text-white/70">{r.days} days</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Route Risk</span><span className={r.risk >= 50 ? 'text-coral' : r.risk >= 30 ? 'text-yellow-400' : 'text-mint'}>{r.risk}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Risk -</span><span className="text-mint">-{r.riskReduction}%</span></div>
                    {r.extraCost > 0 && <div className="flex justify-between"><span className="text-white/40">Extra Cost</span><span className="text-lavender">+${r.extraCost}/bbl</span></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Refinery Compatibility */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
              <Factory className="w-4 h-4 text-mint" />
              <h3 className="text-white font-semibold text-sm">Refinery Impact & Compatibility</h3>
            </div>
            <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {refineryCompat.map((r, i) => (
                <motion.div key={r.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                  <p className="text-white font-medium text-sm mb-3">{r.name}</p>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between mb-1"><span className="text-white/30">Utilization</span><span className="text-white/60">{r.utilization}%</span></div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-mint rounded-full" style={{ width: `${r.utilization}%` }} /></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1"><span className="text-white/30">Supply Cover</span><span className="text-mint">{r.coverage}%</span></div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-lavender rounded-full" style={{ width: `${r.coverage}%` }} /></div>
                    </div>
                    <div className="pt-1">
                      <p className="text-white/30 mb-1">Compatible Suppliers</p>
                      <div className="flex flex-wrap gap-1">
                        {r.compatible.map(c => <span key={c} className="px-1.5 py-0.5 bg-mint/10 text-mint rounded text-xs">{c}</span>)}
                      </div>
                    </div>
                    <div className="flex justify-between pt-1"><span className="text-white/30">Capacity</span><span className="text-white/60">{r.capacity}K bpd</span></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Executive Recommendation */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lavender" />
                <h3 className="text-white font-semibold text-sm">AI Executive Recommendation</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="border-white/10 text-white/50 text-xs">
                  <Download className="w-3 h-3 mr-1.5" />Report
                </Button>
                <Button size="sm" onClick={generateExecRec} disabled={generating} className="bg-lavender hover:bg-lavender-dark text-black text-xs font-semibold">
                  {generating ? <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Generating...</> : <><Sparkles className="w-3 h-3 mr-1.5" />Generate</>}
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {execRec ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="glass-mint rounded-xl p-3"><p className="text-white/30 mb-1">Best Supplier</p><p className="text-mint font-semibold">{execRec.best_supplier}</p></div>
                    <div className="glass-lavender rounded-xl p-3"><p className="text-white/30 mb-1">Best Route</p><p className="text-lavender font-semibold">{execRec.best_route}</p></div>
                    <div className="glass rounded-xl p-3"><p className="text-white/30 mb-1">Expected Savings</p><p className="text-mint font-bold text-lg">${execRec.expected_savings_billion}B</p></div>
                    <div className="glass rounded-xl p-3"><p className="text-white/30 mb-1">Risk Reduction</p><p className="text-mint font-bold text-lg">{execRec.risk_reduction_pct}%</p></div>
                  </div>

                  <div className="bg-lavender/5 border border-lavender/20 rounded-xl p-4">
                    <p className="text-white/60 text-sm leading-relaxed">{execRec.executive_summary}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/30 text-xs font-medium mb-2">Next Actions</p>
                      {execRec.next_actions?.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 mb-2">
                          <CheckCircle className="w-3.5 h-3.5 text-mint shrink-0 mt-0.5" />
                          <p className="text-white/60 text-xs">{a}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-white/30 text-xs font-medium mb-2">Impacted Refineries</p>
                      {execRec.impacted_refineries?.map((r, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-coral" />
                          <p className="text-white/60 text-xs">{r} Refinery</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="p-8 text-center">
                  <Sparkles className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">Click Generate to create an AI executive recommendation</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {view === "suppliers" && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {suppliers.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`glass rounded-2xl p-5 border ${s.status === 'active' ? 'border-mint/20' : 'border-white/5'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-sm">{s.name}</h3>
                  <p className="text-white/30 text-xs flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{s.country}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.status === 'active' ? 'bg-mint/10 text-mint' : 'bg-lavender/10 text-lavender'}`}>{s.status}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/40 mb-4"><Ship className="w-3 h-3" /><span>{s.route}</span></div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-white/30">Reliability</span><p className="text-mint font-semibold text-sm">{s.reliability}%</p></div>
                <div><span className="text-white/30">Risk Score</span><p className={`font-semibold text-sm ${s.risk >= 50 ? 'text-coral' : s.risk >= 35 ? 'text-lavender' : 'text-mint'}`}>{s.risk}</p></div>
                <div><span className="text-white/30">Price</span><p className="text-white font-semibold text-sm">${s.price}/bbl</p></div>
                <div><span className="text-white/30">Delivery</span><p className="text-white font-semibold text-sm">{s.delivery} days</p></div>
                <div><span className="text-white/30">Allocation</span><p className="text-lavender font-semibold text-sm">{s.alloc}%</p></div>
                <div><span className="text-white/30">Compat.</span><p className="text-mint font-semibold text-sm">{s.compatScore}%</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {view === "routes" && (
        <div className="space-y-4">
          {routes.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className={`glass rounded-2xl p-5 border ${r.status === 'primary' ? 'border-coral/30' : r.risk <= 20 ? 'border-mint/30' : 'border-white/5'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{r.name}</h3>
                  <p className="text-white/30 text-xs mt-0.5">via {r.via}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.status === 'primary' ? 'bg-coral/10 text-coral' : r.risk <= 20 ? 'bg-mint/10 text-mint' : 'bg-lavender/10 text-lavender'}`}>{r.status}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                <div><p className="text-white/30">Distance</p><p className="text-white font-semibold">{r.distance.toLocaleString()} nm</p></div>
                <div><p className="text-white/30">Transit Time</p><p className="text-white font-semibold">{r.days} days</p></div>
                <div><p className="text-white/30">Route Risk</p><p className={`font-bold text-lg ${r.risk >= 50 ? 'text-coral' : r.risk >= 30 ? 'text-yellow-400' : 'text-mint'}`}>{r.risk}</p></div>
                <div><p className="text-white/30">Risk Reduction</p><p className="text-mint font-semibold">-{r.riskReduction}%</p></div>
                <div><p className="text-white/30">Extra Cost</p><p className={r.extraCost > 0 ? "text-lavender font-semibold" : "text-mint font-semibold"}>{r.extraCost > 0 ? `+$${r.extraCost}/bbl` : "No extra cost"}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {view === "comparison" && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="glass rounded-2xl">
            <div className="px-5 py-3 border-b border-white/5"><h3 className="text-white font-semibold text-sm">Price Comparison</h3></div>
            <div className="p-4 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[65, 90]} />
                  <Tooltip contentStyle={{ background: '#18181a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="price" radius={[6, 6, 0, 0]} name="$/bbl">{costData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass rounded-2xl">
            <div className="px-5 py-3 border-b border-white/5"><h3 className="text-white font-semibold text-sm">Multi-Factor Analysis</h3></div>
            <div className="p-4 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                  <Radar name="Saudi Aramco" dataKey="Aramco" stroke="#2DDDA8" fill="#2DDDA8" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="ADNOC" dataKey="ADNOC" stroke="#A78BFA" fill="#A78BFA" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="Russia" dataKey="Russia" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.05} strokeWidth={1.5} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}