import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import MobileHeader from './MobileHeader';

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>

      {/* Mobile header */}
      <MobileHeader />

      {/* Main content */}
      <main className="md:ml-[72px] lg:ml-[276px] p-4 md:p-6 min-h-screen transition-all duration-300
        pt-[calc(env(safe-area-inset-top)+4rem)] md:pt-6
        pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Outlet context={{ user }} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav user={user} />
    </div>
  );
}