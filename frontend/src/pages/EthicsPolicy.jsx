import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Scale, UserCheck, Sparkles } from 'lucide-react';

const principles = [
  {
    title: 'Human-Centric Design',
    desc: 'Our AI is built to augment human intelligence, enabling domain experts to solve complex challenges with higher accuracy.',
    icon: UserCheck,
  },
  {
    title: 'Algorithmic Transparency',
    desc: 'We enforce Explainable AI (XAI) protocols so every prediction and inference is traceable and audit-ready.',
    icon: Eye,
  },
  {
    title: 'Inherent Fairness',
    desc: 'We continuously audit training data to eliminate demographic and cognitive biases across our neural networks.',
    icon: Scale,
  },
  {
    title: 'Data Sovereignty',
    desc: 'Enterprise customers retain complete data ownership. We implement differential privacy to guarantee non-leakage.',
    icon: ShieldCheck,
  },
];

export default function EthicsPolicy() {
  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#e2e2e8] pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
            Responsible Innovation
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">Ethics</span> Framework
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            At HamaraShops.ai, enterprise performance comes hand-in-hand with strict safety, transparency, and human-first engineering principles.
          </p>
        </motion.div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {principles.map((p, i) => {
            const IconComponent = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-3xl p-8 border border-[#3c475a]/50 hover:border-[#ff6b6b]/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 flex items-center justify-center text-[#ff6b6b] mb-6">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-white mb-3">{p.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Commitment Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card rounded-3xl p-10 border border-[#ff6b6b]/40 bg-[#0a1628]/80"
        >
          <h2 className="font-headline text-2xl font-bold text-white mb-4">Continuous Adversarial Auditing</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Our AI Ethics Committee routinely executes red-teaming exercises on our MLOps pipelines to simulate adversarial attacks, data drift, and bias injection, ensuring complete governance.
          </p>
          <div className="p-6 rounded-2xl bg-[#1a1c20]/90 border border-[#3c475a]/60 text-xs font-mono text-[#4cd6ff] italic">
            "AI is a mirror of training data. Our mission is to ensure that data represents an unbiased, high-integrity foundation for enterprise growth."
          </div>
        </motion.div>

      </div>
    </div>
  );
}
