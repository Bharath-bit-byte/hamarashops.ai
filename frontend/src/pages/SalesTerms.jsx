import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldAlert, Award, FileCheck } from 'lucide-react';

export default function SalesTerms() {
  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#e2e2e8] pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
            Commercial Terms
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Sales <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">Terms</span>
          </h1>
          <p className="text-slate-400 text-sm font-mono">
            Effective Date: March 5, 2026 • Enterprise SLA & Licensing Standard
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card rounded-3xl p-8 sm:p-12 border border-[#3c475a]/50 shadow-2xl space-y-8"
        >
          <div>
            <h2 className="font-headline text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#ff6b6b]" />
              <span>1. Licensing & Subscription Tiers</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-[#0a1628] border border-[#3c475a]/60 text-xs">
                <div className="font-bold text-white mb-1">Professional Tier</div>
                <div className="text-slate-400 font-mono">Fixed annual license for dedicated business units.</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0a1628] border border-[#3c475a]/60 text-xs">
                <div className="font-bold text-white mb-1">Consumption Tier</div>
                <div className="text-slate-400 font-mono">Pay-per-inference model for high-scale API callers.</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0a1628] border border-[#3c475a]/60 text-xs">
                <div className="font-bold text-[#ffb3b0] mb-1">Enterprise Tier</div>
                <div className="text-slate-400 font-mono">Custom SLA, dedicated server mesh & 24/7 hotline.</div>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#3c475a]/40" />

          <div>
            <h2 className="font-headline text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#4cd6ff]" />
              <span>2. Payment Terms & Settlement</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Invoices are issued digitally and must be settled within 14 business days. Usage-based overages are billed at the conclusion of each monthly billing cycle.
            </p>
          </div>

          <div className="h-[1px] bg-[#3c475a]/40" />

          <div>
            <h2 className="font-headline text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <span>3. Service Level Agreement (99.9% Uptime)</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              We guarantee 99.9% uptime for core NLP, Vision AI, and Gateway routing microservices. Service credits apply to any unannounced service disruption exceeding SLA boundaries.
            </p>
            <div className="text-xs font-mono text-[#ffb3b0]">
              Contracts & Licensing Inquiries: <a href="mailto:contracts@hamarashops.ai" className="underline hover:text-white">contracts@hamarashops.ai</a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
