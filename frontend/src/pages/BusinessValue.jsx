import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Clock, DollarSign, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import Card3D from '../components/common/Card3D';

// Lazy load 3D visualizer background
const Float3DCanvas = lazy(() => import('../components/common/Float3DCanvas'));

const coreMetrics = [
  {
    title: 'Improve Customer Satisfaction',
    subtitle: 'Frustration-Free Experiences',
    icon: Award,
    description: 'Providing hyper-relevant answers, 24/7 digital concierge support, and real-time contextual recommendations to increase customer retention and NPS.',
    metric: '32% Customer Service Impact',
    glowColor: '#ff6b6b'
  },
  {
    title: 'Increase Conversion',
    subtitle: '1:1 Personalization at Scale',
    icon: TrendingUp,
    description: 'Tailoring financial product offers and fashion search recommendations to increase basket size, up-sell precision, and customer lifetime value.',
    metric: 'Higher Up-Sell Relevance',
    glowColor: '#4cd6ff'
  },
  {
    title: 'Faster Time to Market',
    subtitle: 'Accelerated Development & Publishing',
    icon: Clock,
    description: 'Translating regulatory changes into code, automating clinical trial report generation, and producing studio-grade marketing assets in minutes.',
    metric: 'Minutes vs Weeks',
    glowColor: '#ff6b6b'
  },
  {
    title: 'Improve ROI',
    subtitle: 'Operational Efficiency & Cost Control',
    icon: DollarSign,
    description: 'Reducing manual document review, eliminating transit bottlenecks, cutting administrative clinician burnout, and lowering cost-to-serve.',
    metric: '$1.2T Financial Value Add',
    glowColor: '#4cd6ff'
  }
];

const secondaryBenefits = [
  { title: 'Increased Productivity', desc: 'Accelerates analyst, associate, and developer productivity across industries.' },
  { title: 'Reduced Operational Costs', desc: 'Lowers back-office cost to serve and eliminates repetitive manual processes.' },
  { title: 'Faster Time to Insight', desc: 'Instant natural language search across decades of archives, medical records, and blueprints.' },
  { title: 'Better Personalization', desc: 'Moves from generic one-to-many marketing to hyper-personalized one-to-one messaging.' },
  { title: 'Reduced Manual Work', desc: 'Automates prior authorization letters, clinical trial report TOCs, and contract reviews.' },
  { title: 'Better Customer Experience', desc: 'Delivers zero-friction drive-thru PoS, member concierges, and instant troubleshooting.' },
  { title: 'Improved Employee Satisfaction', desc: 'Frees employees from manual paperwork to focus on creative, relationship-building tasks.' },
  { title: 'Faster Content Creation', desc: 'Generates studio-grade images, product copy, and scripts with simple text prompts.' },
  { title: 'Better Decision Making', desc: 'Pinpoints best-fit machinery specifications and aggregates sentiment & financial research.' }
];

export default function BusinessValue() {
  return (
    <div className="w-full min-h-screen bg-[#0c0e12] pt-28 pb-20 px-6 relative overflow-hidden">
      {/* 3D WebGL Torus Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#0c0e12]/80 opacity-50 z-0 pointer-events-none" />}>
        <Float3DCanvas />
      </Suspense>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header split-grid container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
              <Zap className="w-4 h-4 text-[#ff6b6b]" />
              <span>Business Outcomes</span>
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Focus on <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">Real Business Value</span>
            </h1>
            <p className="text-base sm:text-lg text-[#bcc7dd] leading-relaxed font-body-lg">
              Generative AI initiatives must always be evaluated by the measurable ROI and tangible value they deliver across customer satisfaction, conversion rates, and operational speed.
            </p>
          </motion.div>

          {/* Right side visual asset */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative w-full h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/images/business_value_ai.png"
                alt="AI Business Value Growth Charts"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {coreMetrics.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card3D glowColor={item.glowColor} className="bg-[#0a1628]/60 border border-[#3c475a]/50 h-full flex flex-col justify-between p-6 sm:p-8">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 flex items-center justify-center text-[#ff6b6b] mb-6">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[10px] uppercase text-[#4cd6ff] tracking-wider block mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="font-headline text-xl text-white font-bold mb-3">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#3c475a]/30">
                    <span className="font-mono text-xs font-bold text-[#ffb3b0] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#ff6b6b]" />
                      <span>{item.metric}</span>
                    </span>
                  </div>
                </Card3D>
              </motion.div>
            );
          })}
        </div>

        {/* Supporting Outcomes List 3D Card wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card3D glowColor="#3c475a" className="p-8 sm:p-12 bg-[#0a1628]/60 border border-[#3c475a]/50">
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white mb-8 text-center">
              Comprehensive Industry Business Benefits
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {secondaryBenefits.map((b, bIdx) => (
                <div key={bIdx} className="bg-[#0a1628]/40 p-5 rounded-2xl border border-[#3c475a]/40 hover:border-[#ff6b6b]/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4cd6ff] flex-shrink-0" />
                    <h4 className="font-bold text-white text-sm">{b.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6 font-normal">{b.desc}</p>
                </div>
              ))}
            </div>
          </Card3D>
        </motion.div>

      </div>
    </div>
  );
}
