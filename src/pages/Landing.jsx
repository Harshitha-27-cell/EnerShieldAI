import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, BarChart3, Brain, Truck, Database, AlertTriangle, ArrowRight, ChevronRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlobeVisualization from '@/components/landing/GlobeVisualization';
import RiskTicker from '@/components/landing/RiskTicker';
import FeatureCard from '@/components/landing/FeatureCard';
import StatsSection from '@/components/landing/StatsSection';

const features = [
  { icon: AlertTriangle, title: "Geopolitical Risk Intelligence", description: "AI-powered monitoring of global threats, sanctions, and conflicts affecting energy supply chains in real-time.", accent: "coral" },
  { icon: BarChart3, title: "Disruption Scenario Modeller", description: "Simulate Hormuz closures, OPEC cuts, and custom scenarios with real-time economic impact forecasting.", accent: "lavender" },
  { icon: Truck, title: "Adaptive Procurement", description: "Instant alternative supplier and route recommendations optimized for cost, risk, and delivery time.", accent: "mint" },
  { icon: Database, title: "Strategic Reserve Optimizer", description: "AI-driven drawdown planning, release scheduling, and replenishment strategy for petroleum reserves.", accent: "lavender" },
  { icon: Globe, title: "Supply Chain Digital Twin", description: "Complete digital replica of India's energy infrastructure with real-time monitoring and failure prediction.", accent: "mint" },
  { icon: Brain, title: "AI Resilience Commander", description: "Auto-generated 24hr, 7-day, and 30-day crisis response plans with executable action items.", accent: "coral" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(auth => {
      if (auth) navigate('/dashboard', { replace: true });
      else setChecked(true);
    }).catch(() => setChecked(true));
  }, []);

  if (!checked) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-mint/20 border-t-mint rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-mint to-lavender flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">EnerShield<span className="text-mint">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#modules" className="hover:text-white transition-colors">Modules</a>
            <a href="#stats" className="hover:text-white transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-white/70 hover:text-white text-sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-mint hover:bg-mint-dark text-black font-semibold text-sm px-5">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Risk Ticker */}
      <div className="pt-[72px]">
        <RiskTicker />
      </div>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-mint/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-lavender/5 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 glass-mint rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-mint pulse-mint" />
              <span className="text-mint text-xs font-medium">Live Monitoring Active</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
              Defend India's
              <br />
              <span className="bg-gradient-to-r from-mint via-mint-light to-lavender bg-clip-text text-transparent">
                Energy Future
              </span>
            </h1>

            <p className="text-white/50 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
              AI-powered supply chain resilience platform that predicts disruptions, 
              simulates impacts, and generates executable crisis response strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-mint hover:bg-mint-dark text-black font-semibold px-8 h-12 text-base">
                  Launch Platform <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 h-12 text-base">
                  Explore Capabilities
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/5">
              <div>
                <div className="text-2xl font-bold text-white">73</div>
                <div className="text-xs text-white/40">Global Risk Score</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-coral">3</div>
                <div className="text-xs text-white/40">Active Threats</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-mint">98.2%</div>
                <div className="text-xs text-white/40">Supply Stability</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <GlobeVisualization />
            {/* Floating risk card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-12 left-4 glass rounded-xl p-4 max-w-[220px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-coral pulse-coral" />
                <span className="text-coral text-xs font-medium">HIGH RISK</span>
              </div>
              <p className="text-white text-sm font-medium">Strait of Hormuz</p>
              <p className="text-white/40 text-xs mt-1">Elevated threat — military activity detected</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="absolute top-16 right-4 glass rounded-xl p-4 max-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3.5 h-3.5 text-mint" />
                <span className="text-mint text-xs font-medium">SUPPLY FLOW</span>
              </div>
              <p className="text-white text-2xl font-bold">4.7M</p>
              <p className="text-white/40 text-xs">bbl/day imports active</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <div id="stats">
        <StatsSection />
      </div>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Integrated Intelligence Modules</h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Six AI-powered modules working in concert to transform geopolitical volatility into actionable, command-level resilience.
            </p>
          </motion.div>

          <div id="modules" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-mint/5 to-lavender/5 blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Secure the Supply Chain?</h2>
          <p className="text-white/40 text-lg mb-8">
            Join government agencies, refineries, and logistics operators already using EnerShield AI.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-mint hover:bg-mint-dark text-black font-semibold px-10 h-13 text-base">
              Start Free Trial <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-mint" />
            <span className="text-white/60 text-sm">EnerShield AI</span>
          </div>
          <p className="text-white/30 text-xs">© 2025 EnerShield AI. Intelligent Energy Supply Chain Resilience.</p>
        </div>
      </footer>
    </div>
  );
}