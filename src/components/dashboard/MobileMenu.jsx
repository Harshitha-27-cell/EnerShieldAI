import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, AlertTriangle, BarChart3, Truck,
  Database, Globe, Brain, MessageSquare, FileText,
  Settings, LogOut, X, User
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const allNav = [
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

export default function MobileMenu({ open, onClose, user, currentPath }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#111113] rounded-t-3xl border-t border-white/[0.08]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* User info */}
            {user && (
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
                <div className="w-9 h-9 rounded-xl bg-lavender/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-lavender" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.full_name || 'User'}</p>
                  <p className="text-white/30 text-xs">{user.role || 'Analyst'}</p>
                </div>
                <button onClick={onClose} className="ml-auto p-1">
                  <X className="w-5 h-5 text-white/30" />
                </button>
              </div>
            )}

            {/* Nav grid */}
            <div className="grid grid-cols-3 gap-1 p-3">
              {allNav.map(item => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-colors ${isActive ? 'bg-mint/10' : 'hover:bg-white/5'}`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-mint' : 'text-white/40'}`} />
                    <span className={`text-[10px] font-medium text-center leading-tight ${isActive ? 'text-mint' : 'text-white/40'}`}>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Bottom actions */}
            <div className="flex items-center gap-2 px-4 pb-4 pt-1 border-t border-white/5">
              <Link
                to="/settings"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-white/50 text-sm"
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <button
                onClick={() => base44.auth.logout('/')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-coral/10 text-coral text-sm"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}