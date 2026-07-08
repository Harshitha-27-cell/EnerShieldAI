import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MetricCard({ icon: Icon, title, value, change, changeType = "neutral", suffix = "", glassType = "glass" }) {
  const trendColors = { up: "text-mint", down: "text-coral", neutral: "text-white/40" };
  const TrendIcon = changeType === "up" ? TrendingUp : changeType === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${glassType} rounded-2xl p-5 group hover:scale-[1.02] transition-transform duration-200`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white/60" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${trendColors[changeType]}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white font-display">
        {value}<span className="text-lg text-white/40 ml-1">{suffix}</span>
      </div>
      <p className="text-white/40 text-sm mt-1">{title}</p>
    </motion.div>
  );
}