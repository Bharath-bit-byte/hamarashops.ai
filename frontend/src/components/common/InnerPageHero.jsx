import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { handleImageError } from '../../utils/imageUtils';

export default function InnerPageHero({
  badge = "Enterprise AI",
  title = "Intelligent Systems Engineered for Scale",
  subtitle = "Leverage deep domain expertise and cognitive architectures to transform complex workflows.",
  ctaText = "Connect with Us",
  ctaLink = "/contact",
  stats = [
    { label: "Years of Excellence", value: "15+" },
    { label: "Enterprise Deployments", value: "2,500+" },
    { label: "High AI-Q Engineers", value: "3,000+" },
    { label: "Faster Time-to-Value", value: "Up to 40%" }
  ],
  previewTitle = "Cognitive Platform v3.1",
  previewCategory = "AI Core Engine",
  previewDesc = "Automated neural pipeline processing millions of daily transactions with 99.9% uptime SLA.",
  previewTag = "Verified SLA 99.9%",
  previewImage = "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800"
}) {
  return (
    <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-[#0c0e12] via-[#0a1628] to-[#0c0e12] border-b border-[#3c475a]/40 overflow-hidden">
      
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 opacity-25 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 50% 30%, #ff6b6b 0%, transparent 60%), radial-gradient(circle at 80% 70%, #4cd6ff 0%, transparent 50%)',
        filter: 'blur(80px)'
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Grid: Headline + Visual Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-6 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>

            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              {title}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={ctaLink}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-extrabold text-sm sm:text-base hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1a1c20]/80 border border-[#3c475a]/50 text-xs font-mono text-[#4cd6ff]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Spring Cloud Gateway Ready</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: High-Impact Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="glass-card rounded-3xl p-6 border border-[#ff6b6b]/30 shadow-2xl relative overflow-hidden group">
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden mb-6 border border-[#3c475a]/50">
                <img
                  src={previewImage}
                  alt={previewTitle}
                  onError={(e) => handleImageError(e, 'default')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
                
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0a1628]/80 backdrop-blur-md border border-[#ff6b6b]/40 text-[#ffb3b0] font-mono text-xs font-bold">
                  {previewCategory}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono font-bold">
                    {previewTag}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-headline text-2xl font-bold text-white mb-2 group-hover:text-[#ffb3b0] transition-colors">
                  {previewTitle}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {previewDesc}
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Banner: Statistics Highlights */}
        {Array.isArray(stats) && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-[#3c475a]/40">
            {stats.map((st, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                className="text-center md:text-left"
              >
                <div className="font-headline text-3xl sm:text-4xl font-extrabold text-white mb-1">
                  {st.value}
                </div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  {st.label}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
