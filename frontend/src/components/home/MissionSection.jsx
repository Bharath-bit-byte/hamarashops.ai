import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight } from 'lucide-react';

export default function MissionSection() {
  return (
    <section className="py-24 px-6 bg-[#0c0e12] border-t border-[#584140]/10 text-center relative z-20 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 flex items-center justify-center mx-auto mb-8 text-[#ff6b6b]">
          <Cpu className="w-8 h-8" />
        </div>
        <h2 className="font-headline-lg text-3xl sm:text-4xl text-white mb-6 font-bold leading-tight">
          Empowering Business through Intelligence
        </h2>
        <p className="text-base sm:text-lg text-[#bcc7dd] leading-relaxed max-w-2xl mx-auto mb-10 opacity-90">
          At HamaraShops.ai, we engineer sophisticated, high-performance interfaces and backend systems. We bridge the gap between complex AI capabilities and intuitive enterprise usability, driving digital transformation for industry leaders globally.
        </p>
        <Link
          to="/company"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ffb3b0] text-[#68000f] font-bold text-sm tracking-wide hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all"
        >
          <span>Learn More About Our Mission</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
