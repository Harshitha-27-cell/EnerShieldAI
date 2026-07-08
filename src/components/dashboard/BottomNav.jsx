import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, AlertTriangle, BarChart3, Truck,
  Database, Globe, Brain, MessageSquare, FileText, MoreHorizontal
} from 'lucide-react';
import { useState } from 'react';
import MobileMenu from './MobileMenu';

const primaryNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: AlertTriangle, label: "Risk", path: "/risk-intelligence" },
  { icon: Brain, label: "Resilience", path: "/resilience" },
  { icon: MessageSquare, label: "Copilot", path: "/copilot" },
];

export default function BottomNav({ user }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center justify-around bg-[#111113] border-t border-white/[0.06]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {primaryNav.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 py-3 px-4 min-w-0 flex-1">
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-mint' : 'text-white/30'}`} />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-mint' : 'text-white/30'}`}>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col items-center gap-1 py-3 px-4 min-w-0 flex-1"
        >
          <MoreHorizontal className="w-5 h-5 text-white/30" />
          <span className="text-[10px] font-medium text-white/30">More</span>
        </button>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} user={user} currentPath={location.pathname} />
    </>
  );
}