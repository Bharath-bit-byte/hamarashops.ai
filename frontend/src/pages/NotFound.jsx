import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center text-center">
      <div className="glass-card p-10 sm:p-14 rounded-3xl max-w-xl mx-auto border border-[#ff6b6b]/30 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 flex items-center justify-center text-[#ff6b6b] mx-auto mb-6">
          <Cpu className="w-8 h-8" />
        </div>

        <span className="font-mono text-xs uppercase tracking-widest text-[#ff6b6b] px-3 py-1 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 inline-block mb-4">
          404 — Endpoint Not Found
        </span>

        <h1 className="font-headline-lg text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Page Not Found
        </h1>

        <p className="text-sm text-[#bcc7dd] leading-relaxed mb-8">
          The route or resource specification you requested is not mapped on the HamaraShops.ai API Gateway router.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-[#ff6b6b] text-[#68000f] font-bold text-sm hover:bg-[#ffb3b0] transition-colors inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/industries"
            className="px-6 py-3 rounded-xl bg-[#1a1c20] text-white border border-[#3c475a] font-bold text-sm hover:border-[#ff6b6b]/50 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Industries</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
