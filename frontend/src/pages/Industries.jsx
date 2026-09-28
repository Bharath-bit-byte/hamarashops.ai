import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2, Building2, Sparkles } from 'lucide-react';
import { BusinessApi } from '../services/api';
import Card3D from '../components/common/Card3D';

// Lazy load 3D background canvas
const Float3DCanvas = lazy(() => import('../components/common/Float3DCanvas'));

const industryImages = {
  'retail': '/images/retail_ai.png',
  'financial-services': '/images/finance_ai.png',
  'media-entertainment': '/images/media_ai.png',
  'healthcare-life-sciences': '/images/healthcare_ai.png',
  'manufacturing': '/images/manufacturing_ai.png'
};

export default function Industries() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    async function loadIndustries() {
      try {
        setLoading(true);
        const data = await BusinessApi.getIndustries();
        setIndustries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading industries:', err);
      } finally {
        setLoading(false);
      }
    }
    loadIndustries();
  }, []);

  const activeIndustry = industries[selectedIdx] || industries[0] || {};

  return (
    <div className="w-full min-h-screen bg-[#0c0e12] text-[#e2e2e8] pt-28 pb-20 px-6 relative overflow-hidden">
      {/* 3D WebGL Torus Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#0c0e12]/80 opacity-50 z-0 pointer-events-none" />}>
        <Float3DCanvas />
      </Suspense>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#ff6b6b]" />
            <span>Target Industry Sectors</span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Generative AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">Industry Use Cases</span>
          </h1>
          <p className="text-base sm:text-lg text-[#bcc7dd] leading-relaxed font-body-lg">
            Explore tailored foundation models, contextual vector search, and automated workflows across five target enterprise industries.
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#ff6b6b] animate-spin" />
          </div>
        )}

        {!loading && industries.length > 0 && (
          <div>
            
            {/* Sector Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12 relative z-20">
              {industries.map((ind, idx) => (
                <button
                  key={ind.id || idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                    selectedIdx === idx
                      ? 'bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] shadow-lg shadow-[#ff6b6b]/30 scale-105 border border-[#ff6b6b]/40'
                      : 'bg-[#1a1c20] text-slate-300 border border-[#3c475a] hover:border-[#ff6b6b]/50 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>{ind.name}</span>
                </button>
              ))}
            </div>

            {/* Active Industry Dashboard (Wrapped in interactive Card3D) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndustry.id || selectedIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-16"
              >
                <Card3D glowColor={selectedIdx % 2 === 0 ? '#ff6b6b' : '#4cd6ff'} className="p-8 sm:p-12 border border-[#ff6b6b]/40 shadow-2xl bg-gradient-to-br from-[#0a1628] via-[#1a1c20] to-[#0c0e12] w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                    {/* Left Info Column */}
                    <div className="lg:col-span-7 flex flex-col justify-between" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}>
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-3 py-1 rounded-full bg-[#ff6b6b]/15 text-[#ffb3b0] font-mono text-xs font-bold uppercase border border-[#ff6b6b]/30">
                            {activeIndustry.category}
                          </span>
                        </div>

                        <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white mb-3">
                          {activeIndustry.name}
                        </h2>

                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                          {activeIndustry.description}
                        </p>

                        {Array.isArray(activeIndustry.useCases) && activeIndustry.useCases.length > 0 && (
                          <div className="space-y-3 mb-6">
                            <div className="text-xs font-mono text-[#ffb3b0] uppercase tracking-wider mb-2">
                              Key Industry Use Cases:
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {activeIndustry.useCases.map((uc, uIdx) => (
                                <div key={uIdx} className="p-3 rounded-xl bg-[#0c0e12]/80 border border-[#3c475a]/50 text-xs text-slate-200 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-[#4cd6ff] shrink-0" />
                                  <span className="font-medium">{uc.title || uc.category || uc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/industries/${activeIndustry.slug}`}
                        className="inline-flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-extrabold text-sm hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all group mt-4 cursor-pointer"
                      >
                        <span>View Full {activeIndustry.name} Use Cases & Architecture</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Right Metrics Column */}
                    <div className="lg:col-span-5 flex flex-col justify-between gap-6" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}>
                      {/* Interactive 3D Sector Visual Image */}
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                        <img
                          src={industryImages[activeIndustry.slug] || '/images/retail_ai.png'}
                          alt={`${activeIndustry.name} 3D visual`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>

                      <div className="p-6 rounded-2xl bg-[#0c0e12]/90 border border-[#3c475a]/60 space-y-4">
                        <span className="font-mono text-xs text-[#4cd6ff] uppercase tracking-widest block border-b border-[#3c475a]/40 pb-2">
                          Industry Stats & Metrics
                        </span>
                        <div className="space-y-3">
                          {activeIndustry.overviewStats && activeIndustry.overviewStats.map((st, sIdx) => (
                            <div key={sIdx} className="space-y-1">
                              <div className="text-[11px] font-mono text-slate-400">{st.label}</div>
                              <div className="text-xs text-white font-medium pl-2 border-l-2 border-[#ff6b6b]">{st.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            </AnimatePresence>

            {/* 5 Grid Cards for all industries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {industries.map((ind, idx) => (
                <Card3D key={ind.id || idx} glowColor="#ff6b6b" className="bg-[#0a1628]/60 border border-[#3c475a]/50 p-6 flex flex-col justify-between">
                  <div>
                    {/* Visual Thumbnail */}
                    <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4 border border-white/5 shadow">
                      <img
                        src={industryImages[ind.slug] || '/images/retail_ai.png'}
                        alt={ind.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-headline text-lg font-bold text-white mb-2">{ind.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4 font-normal">{ind.description}</p>
                  </div>
                  <Link
                    to={`/industries/${ind.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#ff6b6b] font-bold uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Explore Use Cases</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Card3D>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
