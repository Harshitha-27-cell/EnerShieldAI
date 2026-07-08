import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, ChevronLeft } from 'lucide-react';

const routeLabels = {
  '/dashboard': 'Command Center',
  '/risk-intelligence': 'Risk Intelligence',
  '/scenarios': 'Scenario Modeller',
  '/procurement': 'Procurement',
  '/reserves': 'Strategic Reserves',
  '/digital-twin': 'Digital Twin',
  '/resilience': 'Resilience Commander',
  '/copilot': 'AI Copilot',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/dashboard';
  const label = routeLabels[location.pathname] || 'EnerShield AI';

  return (
    <header
      className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.06]"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
    >
      {!isHome ? (
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ChevronLeft className="w-5 h-5 text-white/60" />
        </button>
      ) : (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-mint to-lavender flex items-center justify-center">
          <Shield className="w-4 h-4 text-black" />
        </div>
      )}
      <span className="text-white font-semibold text-sm">{label}</span>
    </header>
  );
}