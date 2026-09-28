import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
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
            Compliance & Security
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">Policy</span>
          </h1>
          <p className="text-slate-400 text-sm font-mono">
            Effective Date: March 5, 2026 • GDPR & CCPA Compliant
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
              <FileText className="w-5 h-5 text-[#ff6b6b]" />
              <span>1. Information Collection & Usage</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              HamaraShops.ai collects account metadata, telemetry diagnostics, and authorized API input payloads strictly to execute inference models and service SLA obligations.
            </p>
            <ul className="space-y-2 text-xs font-mono text-slate-400 pl-4 border-l border-[#ff6b6b]/40">
              <li>• Account Credentials & Token Authentication Metadata</li>
              <li>• Anonymized System Usage Metrics & Gateway Telemetry</li>
              <li>• Encrypted Input Payload Queries for Model Execution</li>
            </ul>
          </div>

          <div className="h-[1px] bg-[#3c475a]/40" />

          <div>
            <h2 className="font-headline text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#4cd6ff]" />
              <span>2. Encryption & Infrastructure Security</span>
            </h2>
            <div className="p-4 rounded-xl bg-[#0a1628] border border-[#3c475a]/60 text-xs font-mono text-slate-300 mb-3">
              AES-256 Encryption at Rest • TLS 1.3 in Transit • SOC2 Type II Certified
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Customer data is stored within isolated microservice partitions. Raw model inputs are never retained beyond session execution unless explicitly configured for offline fine-tuning.
            </p>
          </div>

          <div className="h-[1px] bg-[#3c475a]/40" />

          <div>
            <h2 className="font-headline text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>3. Data Rights & Governance</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Under GDPR, CCPA, and enterprise SLAs, customers maintain full rights to request data export, deletion, or processing restriction by contacting our Data Protection Officer.
            </p>
            <div className="text-xs font-mono text-[#ffb3b0]">
              Contact DPO: <a href="mailto:privacy@hamarashops.ai" className="underline hover:text-white">privacy@hamarashops.ai</a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
