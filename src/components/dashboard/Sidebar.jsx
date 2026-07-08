import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, AlertTriangle, BarChart3, Truck,
  Database, Globe, Brain, MessageSquare, FileText, Settings,
  ChevronLeft, ChevronRight, LogOut, User
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const navItems = [
  { icon: LayoutDashboard, label: "Command Center", path: "/dashboard" },
  { icon: AlertTriangle, label: "Risk Intelligence", path: "/risk-intelligence" },
  { icon: BarChart3, label: "Scenario Modeller", path: "/scenarios" },
  { icon: Truck, label: "Procurement", path: "/procurement" },
  { icon: Database, label: "Strategic Reserves", path: "/reserves" },
  { icon: Globe, label: "Digital Twin", path: "/digital-twin" },
  { icon: Brain, label: "Resilience Commander", path: "/resilience" },
  { icon: MessageSquare, label: "AI Copilot", path: "/copilot" },
  { icon: FileText, label: "Reports", path: "/reports" },
];

export default function Sidebar({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-3 top-3 bottom-3 z-40 rounded-3xl glass flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-mint to-lavender flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-black" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-white font-bold text-lg whitespace-nowrap overflow-hidden"
            >
              EnerShield<span className="text-mint">AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-mint/10 text-mint' 
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-mint' : 'group-hover:text-white/80'}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/5 space-y-2">
        <AnimatePresence>
          {!collapsed && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-3 py-2"
            >
              <div className="w-8 h-8 rounded-lg bg-lavender/20 flex items-center justify-center">
                <User className="w-4 h-4 text-lavender" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.full_name || 'User'}</p>
                <p className="text-white/30 text-xs truncate">{user.role || 'Analyst'}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Link to="/settings">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-all w-full">
            <Settings className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">Settings</motion.span>
              )}
            </AnimatePresence>
          </div>
        </Link>

        <button
          onClick={() => base44.auth.logout('/')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-coral hover:bg-coral/5 transition-all w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-xl text-white/20 hover:text-white/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}