import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, description, accent = "mint", index = 0 }) {
  const accentStyles = {
    mint: "border-mint/20 hover:border-mint/40 hover:shadow-[0_0_40px_rgba(45,221,168,0.08)]",
    lavender: "border-lavender/20 hover:border-lavender/40 hover:shadow-[0_0_40px_rgba(167,139,250,0.08)]",
    coral: "border-coral/20 hover:border-coral/40 hover:shadow-[0_0_40px_rgba(255,107,107,0.08)]",
  };
  const iconStyles = {
    mint: "text-mint bg-mint/10",
    lavender: "text-lavender bg-lavender/10",
    coral: "text-coral bg-coral/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`glass rounded-2xl p-6 border transition-all duration-300 ${accentStyles[accent]}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconStyles[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}