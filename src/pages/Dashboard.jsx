import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Activity, Gauge, DollarSign } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MetricCard from '@/components/dashboard/MetricCard';
import RiskHeatmap from '@/components/dashboard/RiskHeatmap';
import AlertsFeed from '@/components/dashboard/AlertsFeed';
import PriceTrendChart from '@/components/dashboard/PriceTrendChart';
import ReserveGauge from '@/components/dashboard/ReserveGauge';
import AIRecommendations from '@/components/dashboard/AIRecommendations';

export default function Dashboard() {
  const { user } = useOutletContext();
  const [time, setTime] = useState(new Date());
  const [metrics, setMetrics] = useState({ riskScore: '--', supplyStability: '--', reserveDays: '--', activeAlerts: 0, criticalEvents: 0 });

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function loadMetrics() {
      const [riskEvents, reserves] = await Promise.all([
        base44.entities.RiskEvent.filter({ status: 'active' }),
        base44.entities.StrategicReserve.list(),
      ]);
      const criticalEvents = riskEvents.filter(e => e.severity === 'critical' || e.severity === 'high').length;
      const avgRisk = riskEvents.length > 0
        ? Math.round(riskEvents.reduce((s, e) => s + (e.risk_score || 0), 0) / riskEvents.length)
        : 0;
      const avgCoverage = reserves.length > 0
        ? Math.round(reserves.reduce((s, r) => s + (r.coverage_days || 0), 0) / reserves.length)
        : 0;
      const supplyStability = Math.max(0, (100 - (criticalEvents * 3))).toFixed(1);
      setMetrics({ riskScore: avgRisk || '--', supplyStability, reserveDays: avgCoverage || '--', activeAlerts: riskEvents.length, criticalEvents });
    }
    loadMetrics();
  }, []);

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
          >
            {greeting()}, {user?.full_name?.split(' ')[0] || 'Director'}
          </motion.h1>
          <p className="text-white/40 text-sm mt-1">
            {metrics.criticalEvents > 0
              ? <><span className="text-coral font-medium">{metrics.criticalEvents} critical/high risk events</span> are currently active in the system.</>
              : 'All supply routes are currently stable. No critical events detected.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-mint pulse-mint" />
            <span className="text-xs text-white/60">System Online</span>
          </div>
          <div className="glass rounded-xl px-4 py-2">
            <span className="text-xs text-white/40 font-mono">
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Gauge} title="Global Risk Score" value={String(metrics.riskScore)} suffix="/100" change={metrics.activeAlerts > 0 ? `${metrics.activeAlerts} active` : '0 active'} changeType={metrics.riskScore > 60 ? "down" : "up"} />
        <MetricCard icon={Activity} title="Supply Stability" value={String(metrics.supplyStability)} suffix="%" change={metrics.criticalEvents > 0 ? `-${metrics.criticalEvents * 3}%` : "stable"} changeType={metrics.criticalEvents > 0 ? "down" : "neutral"} />
        <MetricCard icon={DollarSign} title="Brent Crude" value="82.4" suffix="$/bbl" change="+1.2%" changeType="up" />
        <MetricCard icon={Shield} title="Reserve Coverage" value={String(metrics.reserveDays)} suffix="days" change={metrics.reserveDays !== '--' && metrics.reserveDays > 40 ? "above target" : "below target"} changeType={metrics.reserveDays !== '--' && metrics.reserveDays > 40 ? "up" : "down"} />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Risk Heatmap — 2 cols */}
        <div className="lg:col-span-2">
          <RiskHeatmap />
        </div>
        {/* Alerts */}
        <div>
          <AlertsFeed />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Price Trends */}
        <div className="lg:col-span-2">
          <PriceTrendChart />
        </div>
        {/* Reserve */}
        <div>
          <ReserveGauge />
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="grid lg:grid-cols-2 gap-5">
        <AIRecommendations />
        {/* Economic Impact Summary */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Economic Impact Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-white/40 text-xs mb-1">Potential GDP Impact</p>
              <p className="text-2xl font-bold text-coral">-0.3%</p>
              <p className="text-white/30 text-xs mt-1">If Red Sea disruption persists 30 days</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-white/40 text-xs mb-1">Inflation Pressure</p>
              <p className="text-2xl font-bold text-lavender">+0.8%</p>
              <p className="text-white/30 text-xs mt-1">CPI contribution from fuel prices</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-white/40 text-xs mb-1">Import Bill Impact</p>
              <p className="text-2xl font-bold text-white">+$4.2B</p>
              <p className="text-white/30 text-xs mt-1">Annual increase at current prices</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-white/40 text-xs mb-1">Forex Reserve Drain</p>
              <p className="text-2xl font-bold text-mint">$2.1B</p>
              <p className="text-white/30 text-xs mt-1">Monthly energy import expenditure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}