import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, CheckCircle2, ArrowLeft, Loader2, Cpu, ShieldCheck, Zap, Workflow } from 'lucide-react';
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

export default function IndustryDetail() {
  const { slug } = useParams();
  const [industry, setIndustry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        const data = await BusinessApi.getIndustryBySlug(slug);
        setIndustry(data);
      } catch (err) {
        console.error('Error loading industry detail:', err);
        setError(`Industry vertical "${slug}" was not found.`);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#0c0e12]">
        <Loader2 className="w-10 h-10 text-[#ff6b6b] animate-spin" />
      </div>
    );
  }

  if (error || !industry) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 text-center max-w-xl mx-auto bg-[#0c0e12]" style={{ perspective: 1000 }}>
        <Card3D glowColor="#ff6b6b" className="p-8 border border-red-500/40 w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Industry Not Found</h2>
          <p className="text-sm text-slate-300 mb-6 font-normal">{error}</p>
          <Link to="/industries" className="px-6 py-2.5 bg-[#ff6b6b] text-[#68000f] rounded-xl font-bold text-sm cursor-pointer">
            Back to All Industries
          </Link>
        </Card3D>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 max-w-6xl mx-auto min-h-screen bg-[#0c0e12]">
      {/* 3D WebGL Torus Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#0c0e12]/80 opacity-50 z-0 pointer-events-none" />}>
        <Float3DCanvas />
      </Suspense>

      <div className="relative z-10">
        
        {/* Back Link */}
        <Link to="/industries" className="inline-flex items-center gap-2 text-xs font-mono text-[#bcc7dd] hover:text-white mb-8 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4 text-[#ff6b6b]" />
          <span>Back to Industry Sectors</span>
        </Link>

        {/* Main Header Banner wrapped in Card3D with split visual layout */}
        <div className="mb-12">
          <Card3D glowColor="#ff6b6b" className="p-8 sm:p-12 border border-[#ff6b6b]/40 bg-gradient-to-br from-[#0a1628] via-[#1a1c20] to-[#0c0e12] w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
              <div className="lg:col-span-8" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-[#ff6b6b]/15 text-[#ffb3b0] font-mono text-xs font-bold uppercase border border-[#ff6b6b]/30">
                    {industry.category}
                  </span>
                  <span className="text-xs font-mono text-[#4cd6ff] flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> PDF Source of Truth Verified
                  </span>
                </div>

                <h1 className="font-headline text-3xl sm:text-5xl font-extrabold text-white mb-4">
                  {industry.name}
                </h1>
                
                {industry.subtitle && (
                  <p className="text-base sm:text-lg font-mono text-[#4cd6ff] mb-6">{industry.subtitle}</p>
                )}
                
                <p className="text-base text-slate-300 leading-relaxed max-w-4xl mb-8 font-normal">
                  {industry.description}
                </p>

                <div className="pt-6 border-t border-[#3c475a]/50 flex flex-wrap items-center justify-between gap-4">
                  <Link to="/contact" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-bold text-sm hover:shadow-lg transition-all inline-block cursor-pointer">
                    Consult {industry.name} Specialist
                  </Link>
                  <Link to="/architecture" className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer">
                    <Workflow className="w-4 h-4 text-[#4cd6ff]" />
                    <span>View Architecture Pipeline</span>
                  </Link>
                </div>
              </div>

              {/* Right Side Industry 3D Visual Asset */}
              <div className="lg:col-span-4" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}>
                <div className="relative w-full h-56 lg:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                  <img
                    src={industryImages[industry.slug] || '/images/retail_ai.png'}
                    alt={industry.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
            </div>
          </Card3D>
        </div>

        {/* Overview Stats from PDF */}
        {Array.isArray(industry.overviewStats) && industry.overviewStats.length > 0 && (
          <div className="mb-16">
            <h2 className="font-headline text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ff6b6b]" />
              <span>Industry Overview Stats & Trends (PDF)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {industry.overviewStats.map((st, idx) => (
                <Card3D key={idx} glowColor="#4cd6ff" className="p-5 border border-[#3c475a]/50 bg-[#0a1628]/60 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono text-[#4cd6ff] mb-1 uppercase tracking-wider">{st.label}</div>
                    <div className="text-sm font-semibold text-white leading-snug font-normal">{st.value}</div>
                  </div>
                </Card3D>
              ))}
            </div>
          </div>
        )}

        {/* Key Gen AI Use Cases */}
        {Array.isArray(industry.useCases) && industry.useCases.length > 0 && (
          <div className="mb-16">
            <h2 className="font-headline text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#ff6b6b]" />
              <span>Generative AI Use Cases for {industry.name}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industry.useCases.map((uc, idx) => (
                <Card3D key={idx} glowColor="#ff6b6b" className="bg-[#0a1628]/60 border border-[#3c475a]/50 p-6 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#4cd6ff] tracking-widest block mb-1">
                      {uc.category}
                    </span>
                    <h3 className="font-headline text-lg font-bold text-white mb-2">{uc.title || uc.category || uc}</h3>
                    {uc.description && (
                      <p className="text-xs text-slate-300 leading-relaxed mb-4 font-normal">{uc.description}</p>
                    )}
                    {Array.isArray(uc.examples) && (
                      <div className="space-y-1.5 pt-3 border-t border-[#3c475a]/30">
                        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">PDF Implementation Examples:</span>
                        {uc.examples.map((ex, eIdx) => (
                          <div key={eIdx} className="flex items-center text-xs text-slate-300 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b] mr-2 flex-shrink-0" />
                            <span>{ex}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card3D>
              ))}
            </div>
          </div>
        )}

        {/* AI Components & Business Metrics wrapped in Card3D */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.isArray(industry.aiComponents) && industry.aiComponents.length > 0 && (
            <Card3D glowColor="#4cd6ff" className="p-6 sm:p-8 border border-[#4cd6ff]/30 bg-[#0a1628]/60 flex flex-col justify-between">
              <div>
                <h3 className="font-headline text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#4cd6ff]" />
                  <span>Google Cloud AI Components</span>
                </h3>
                <ul className="space-y-3 font-mono text-xs text-slate-300">
                  {industry.aiComponents.map((comp, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4cd6ff] mt-1 flex-shrink-0" />
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card3D>
          )}

          {Array.isArray(industry.businessMetrics) && industry.businessMetrics.length > 0 && (
            <Card3D glowColor="#ff6b6b" className="p-6 sm:p-8 border border-[#ff6b6b]/30 bg-[#0a1628]/60 flex flex-col justify-between">
              <div>
                <h3 className="font-headline text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#ff6b6b]" />
                  <span>Target Business Metrics</span>
                </h3>
                <ul className="space-y-3 font-mono text-xs text-slate-300">
                  {industry.businessMetrics.map((met, mIdx) => (
                    <li key={mIdx} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ff6b6b] mt-1 flex-shrink-0" />
                      <span>{met}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card3D>
          )}
        </div>

      </div>
    </div>
  );
}
