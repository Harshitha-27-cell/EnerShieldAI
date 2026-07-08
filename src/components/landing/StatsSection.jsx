import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: "4.7M", label: "Barrels/Day Monitored", sub: "India's daily crude import" },
  { value: "42", label: "Days Reserve Coverage", sub: "Strategic petroleum reserves" },
  { value: "87%", label: "Import Dependency", sub: "Crude oil dependency ratio" },
  { value: "< 2min", label: "Alert Response", sub: "AI-powered threat detection" },
];

export default function StatsSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-1 font-display">{s.value}</div>
              <div className="text-mint text-sm font-medium mb-1">{s.label}</div>
              <div className="text-white/30 text-xs">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}