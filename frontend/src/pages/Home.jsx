import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Workflow, TrendingUp, Cpu } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import CompanyVideoSection from '../components/home/CompanyVideoSection';
import LocationsSection from '../components/home/LocationsSection';
import Card3D from '../components/common/Card3D';
import { BusinessApi } from '../services/api';

// Lazy load 3D pipeline component to optimize main chunk size
const Pipeline3DCanvas = lazy(() => import('../components/common/Pipeline3DCanvas'));

const commonChallenges = [
  { title: 'Improve Customer Service', desc: 'Deliver 24/7 hyper-personalized support, conversational AI concierges, and instant troubleshooting.' },
  { title: 'Accelerate Search & Discovery', desc: 'Enable natural language search across complex contracts, medical literature, blueprints, and media archives.' },
  { title: 'Build Personalized Content', desc: 'Produce studio-grade imagery, product copy, and customized 1:1 financial or shopping recommendations.' },
  { title: 'Improve Developer Code Efficiency', desc: 'Translate regulatory or business requirement changes into automated code modifications.' },
  { title: 'Control Operating Costs', desc: 'Eliminate manual document review, automate prior authorizations, and streamline back-office operations.' }
];

// Mapping generated 3D visual assets to their respective industry slug paths
const industryImages = {
  'retail': '/images/retail_ai.png',
  'financial-services': '/images/finance_ai.png',
  'media-entertainment': '/images/media_ai.png',
  'healthcare-life-sciences': '/images/healthcare_ai.png',
  'manufacturing': '/images/manufacturing_ai.png'
};

export default function Home() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIndustries() {
      try {
        const data = await BusinessApi.getIndustries();
        if (Array.isArray(data) && data.length > 0) {
          setIndustries(data);
        }
      } catch (err) {
        console.error('Failed to load industries for Home page:', err);
      } finally {
        setLoading(false);
      }
    }
    loadIndustries();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0c0e12]">
      {/* 1. Hero Section with dynamic 3D WebGL core */}
      <HeroSection />

      {/* 2. Company Tagline & Large Cinematic Video Section */}
      <CompanyVideoSection />

      {/* 3. Locations Section with spatial card interactions */}
      <LocationsSection />

      {/* 3. Generative AI Industry Use Cases Intro & 3D Glass Challenges */}
      <section className="py-24 px-6 relative bg-radial-depth z-20 overflow-hidden border-b border-[#3c475a]/20">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#ff6b6b]" />
              <span>Enterprise Transformation</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl text-white font-extrabold tracking-tight mb-4">
              GENERATIVE AI INDUSTRY USE CASES
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Addressing key business challenges across global industries through tailored foundation models, vector search, and intelligent workflow automation.
            </p>
          </motion.div>

          {/* Common Challenges 3D Grid */}
          <div className="mb-20">
            <h3 className="text-center font-headline text-xl text-white font-bold mb-8">
              Solving Common Business Challenges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {commonChallenges.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="h-full"
                >
                  <Card3D glowColor={idx % 2 === 0 ? '#ff6b6b' : '#4cd6ff'} className="p-5 h-full bg-[#0a1628]/60 border border-[#3c475a]/40 flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 flex items-center justify-center text-[#ff6b6b] mb-4 text-xs font-mono font-bold">
                        0{idx + 1}
                      </div>
                      <h4 className="font-bold text-white text-sm mb-2">{item.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">{item.desc}</p>
                    </div>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 4. Five Industries Overview Section */}
          <div className="pt-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="font-mono text-xs text-[#4cd6ff] uppercase tracking-widest block mb-1">Target Sectors</span>
                <h3 className="font-headline text-3xl font-extrabold text-white">Five Key Industries</h3>
              </div>
              <Link
                to="/industries"
                className="text-[#ff6b6b] font-mono text-xs font-bold uppercase tracking-wider hover:text-white transition-colors inline-flex items-center gap-2 group"
              >
                <span>Explore All Industry Use Cases</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((ind, idx) => (
                <motion.div
                  key={ind.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Card3D glowColor={idx % 2 === 0 ? '#ff6b6b' : '#4cd6ff'} className="bg-[#0a1628]/60 border border-[#3c475a]/50 h-full flex flex-col justify-between p-6 sm:p-8">
                    <div>
                      {/* Interactive 3D Card Header Image */}
                      <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-5 border border-white/5 shadow-md">
                        <img
                          src={industryImages[ind.slug] || '/images/retail_ai.png'}
                          alt={`${ind.name} Generative AI Visual`}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>

                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#4cd6ff] mb-2 block">
                        {ind.category}
                      </span>
                      <h4 className="font-headline text-xl text-white font-bold mb-2">
                        {ind.name}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-6 font-normal">
                        {ind.description}
                      </p>

                      <div className="space-y-2 mb-6 pt-4 border-t border-[#3c475a]/30">
                        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">Key Gen AI Focus:</span>
                        {ind.useCases && ind.useCases.slice(0, 2).map((uc, uIdx) => (
                          <div key={uIdx} className="flex items-center text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6b6b] mr-2 flex-shrink-0" />
                            <span className="truncate">{uc.title || uc.category || uc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link
                      to={`/industries/${ind.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono text-[#ff6b6b] hover:text-white font-bold uppercase tracking-wider transition-colors group/link cursor-pointer"
                    >
                      <span>View Use Cases</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. AI Solution Architecture Summary with 3D Pipeline Visualizer */}
      <section className="py-20 px-6 bg-[#0a1628]/60 border-b border-[#3c475a]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4cd6ff]/10 border border-[#4cd6ff]/30 text-[#4cd6ff] text-xs font-mono mb-4 uppercase tracking-widest">
                <Workflow className="w-3.5 h-3.5" />
                <span>AI Architecture</span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                AI SOLUTION ARCHITECTURE
              </h2>
              <p className="text-[#bcc7dd] text-sm sm:text-base leading-relaxed mb-6 font-normal">
                High-impact business use cases are achieved by stitching together foundation models (PaLM, MedPaLM, Imagen, Chirp), vector search, enterprise databases, and external APIs.
              </p>
              
              <div className="space-y-3 font-mono text-xs text-slate-300 mb-8">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#ff6b6b]" />
                  <span>Vertex AI Agent Builder & Conversational Interface</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#4cd6ff]" />
                  <span>Vertex AI Search for Secure Patient & Document Discovery</span>
                </div>
              </div>

              <Link
                to="/architecture"
                className="px-6 py-3 rounded-xl bg-[#282a2e] text-white text-xs font-semibold hover:bg-[#3c475a] transition-all inline-flex items-center gap-2 border border-[#3c475a] cursor-pointer"
              >
                <span>Explore Full Architecture</span>
                <ArrowRight className="w-4 h-4 text-[#ff6b6b]" />
              </Link>
            </div>

            {/* Interactive 3D Pipeline Canvas Box */}
            <div className="bg-[#0c0e12] border border-[#3c475a]/60 rounded-3xl p-8 shadow-2xl space-y-4 relative z-10">
              <div className="text-[#ffb3b0] border-b border-[#3c475a]/40 pb-3 font-mono text-xs font-bold uppercase tracking-widest">
                Conceptual Pipeline Flow
              </div>
              <Suspense fallback={<div className="w-full h-[280px] bg-[#1a1c20]/60 rounded-2xl animate-pulse" />}>
                <Pipeline3DCanvas />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Business Value Summary with 3D Stat Cards */}
      <section className="py-20 px-6 relative bg-radial-depth z-20 overflow-hidden border-b border-[#3c475a]/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
              <TrendingUp className="w-4 h-4 text-[#ff6b6b]" />
              <span>BUSINESS VALUE OF GENERATIVE AI</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Focus on Key Business Outcomes
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Always consider the tangible value the solution brings to your enterprise across four primary metrics.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card3D glowColor="#ff6b6b" className="p-6 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#ff6b6b] mb-1 font-headline">Satisfaction</div>
              <div className="text-xs font-mono text-slate-300 uppercase">Improved Customer Satisfaction</div>
            </Card3D>
            <Card3D glowColor="#4cd6ff" className="p-6 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#4cd6ff] mb-1 font-headline">Conversion</div>
              <div className="text-xs font-mono text-slate-300 uppercase">Increase in Conversion</div>
            </Card3D>
            <Card3D glowColor="#ff6b6b" className="p-6 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#ff6b6b] mb-1 font-headline">Speed</div>
              <div className="text-xs font-mono text-slate-300 uppercase">Faster Time to Market</div>
            </Card3D>
            <Card3D glowColor="#4cd6ff" className="p-6 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#4cd6ff] mb-1 font-headline">ROI</div>
              <div className="text-xs font-mono text-slate-300 uppercase">Improved Return on Investment</div>
            </Card3D>
          </div>

          <div className="mt-10">
            <Link
              to="/business-value"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-bold text-sm hover:shadow-lg hover:shadow-[#ff6b6b]/30 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>View Detailed Value Metrics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
