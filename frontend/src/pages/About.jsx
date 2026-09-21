import React, { useEffect, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Compass, Milestone, ShieldCheck, Award } from 'lucide-react';
import { ContentApi } from '../services/api';
import Card3D from '../components/common/Card3D';

// Lazy load 3D background canvas to keep route bundle footprint minimal
const Float3DCanvas = lazy(() => import('../components/common/Float3DCanvas'));

export default function About() {
  const [info, setInfo] = useState({
    headline: 'ABOUT AI EXCELLENCE',
    mission: 'At HamaraShops.ai, we believe that artificial intelligence is the ultimate tool for human advancement. Our mission is to democratize complex AI technologies, making them accessible and actionable for businesses of all sizes.',
    vision: 'To create a world where intelligence is embedded in every workflow, allowing humans to focus on creativity while AI handles the complexity.',
    approach: 'We combine deep technical expertise with industry insights to deliver solutions that are not just powerful, but also practical and ethical.',
    journey: 'Hamarashops.ai is a leading global IT solutions organisation, enabling its clients to transform at the intersect of unparalleled domain expertise and emerging technologies to achieve real-world business impact. A focus on very select industries, a detailed understanding of the underlying processes of those industries and partnerships with leading platforms provide us a distinct vantage. We leverage AI, Cloud and insight-driven technologies, allied with our industry expertise, to transform client businesses into intelligent, high-growth enterprises. Today our proprietary platforms power critical business processes across the Insurance, Financial Services and Travel industries. Our skill-certified technology and process consultants engineer, design, consult, operate, and modernise systems across the world.'
  });

  useEffect(() => {
    async function loadCompanyData() {
      try {
        const data = await ContentApi.getCompany();
        if (data && data.mission) {
          setInfo(data);
        }
      } catch (err) {
        console.error('Failed to load company info from backend:', err);
      }
    }
    loadCompanyData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0c0e12] pt-28 pb-20 px-6 relative overflow-hidden">
      {/* Dynamic 3D WebGL Torus Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#0c0e12]/80 opacity-50 z-0 pointer-events-none" />}>
        <Float3DCanvas />
      </Suspense>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header split-grid container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#ff6b6b]" />
              <span>{info.headline || 'ABOUT AI EXCELLENCE'}</span>
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Democratizing Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">Global Enterprise</span>
            </h1>
            <p className="text-lg text-[#bcc7dd] leading-relaxed font-body-lg">
              {info.mission}
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
                src="/images/about_ai.png"
                alt="AI Collaborative Innovation"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Vision & Approach 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card3D glowColor="#ff6b6b" className="p-8 bg-[#0a1628]/60 border border-[#ff6b6b]/30 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 flex items-center justify-center text-[#ff6b6b] mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="font-headline text-2xl font-bold text-white mb-4">OUR VISION</h2>
                <p className="text-slate-300 leading-relaxed text-sm font-normal">
                  {info.vision}
                </p>
              </div>
            </Card3D>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card3D glowColor="#4cd6ff" className="p-8 bg-[#0a1628]/60 border border-[#4cd6ff]/30 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#4cd6ff]/10 border border-[#4cd6ff]/30 flex items-center justify-center text-[#4cd6ff] mb-6">
                  <Compass className="w-6 h-6" />
                </div>
                <h2 className="font-headline text-2xl font-bold text-white mb-4">OUR APPROACH</h2>
                <p className="text-slate-300 leading-relaxed text-sm font-normal">
                  {info.approach}
                </p>
              </div>
            </Card3D>
          </motion.div>
        </div>

        {/* Journey Section 3D Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card3D glowColor="#3c475a" className="p-8 sm:p-12 bg-[#0a1628]/60 border border-[#3c475a]/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 flex items-center justify-center text-[#ff6b6b]">
                <Milestone className="w-5 h-5" />
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white">OUR JOURNEY</h2>
            </div>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              {info.journey}
            </p>
          </Card3D>
        </motion.div>

        {/* Meet Our CEO / Leadership Section */}
        <motion.div
          id="ceo-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 scroll-mt-28"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-3 uppercase tracking-widest">
              <Award className="w-4 h-4 text-[#ff6b6b]" />
              <span>LEADERSHIP</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">CEO</span>
            </h2>
          </div>

          <Card3D glowColor="#ff6b6b" className="p-4 sm:p-8 bg-[#0a1628]/70 border border-[#ff6b6b]/30 rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
            <div className="relative w-full overflow-hidden rounded-2xl">
              <img
                src="/images/ceo_poster.png"
                alt="Meet Our CEO - Dheerendar Srivastav
, Founder & Chief Executive Officer of HamaraShops.ai"
                className="w-full h-auto object-contain rounded-xl max-h-[850px] mx-auto shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
                loading="lazy"
              />
            </div>
          </Card3D>
        </motion.div>

        {/* Certified Technology & Process Consultants Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card3D glowColor="#4cd6ff" className="p-8 sm:p-10 bg-[#0a1628]/60 border border-[#4cd6ff]/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#4cd6ff]/10 border border-[#4cd6ff]/30 flex items-center justify-center text-[#4cd6ff]">
                <ShieldCheck className="w-5 h-5 text-[#4cd6ff]" />
              </div>
              <h2 className="font-headline text-xl sm:text-2xl font-bold text-white">
                Certified Technology & Process Consultants
              </h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-normal mb-6">
              Our skill-certified technology and process consultants engineer, design, consult, operate, and modernize AI and enterprise systems across the world.
            </p>
            <div className="pt-4 border-t border-[#3c475a]/40 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#4cd6ff]">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4cd6ff]" />
                Insurance Industry Solutions
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6b6b]" />
                Financial Services Intelligence
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Travel & Enterprise Platforms
              </span>
            </div>
          </Card3D>
        </motion.div>

      </div>
    </div>
  );
}
