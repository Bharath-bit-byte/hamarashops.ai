import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import TeamVideosSection from '../components/home/TeamVideosSection';

// Lazy load 3D visualizer background
const Float3DCanvas = lazy(() => import('../components/common/Float3DCanvas'));

export default function OurJourney() {
  return (
    <div className="w-full min-h-screen bg-[#0c0e12] pt-28 pb-20 px-6 relative overflow-hidden">
      {/* 3D WebGL Torus Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#0c0e12]/80 opacity-50 z-0 pointer-events-none" />}>
        <Float3DCanvas />
      </Suspense>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header split-grid container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            {/* Back Link */}
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-[#bcc7dd] hover:text-white mb-8 transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4 text-[#ff6b6b]" />
              <span>Back to Home</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#ff6b6b]" />
              <span>Team Journey</span>
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Our Journey — <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">In Our Own Words</span>
            </h1>
            <p className="text-base sm:text-lg text-[#bcc7dd] leading-relaxed font-body-lg">
              Hear directly from the team behind HamaraShops.ai as we share our journey, experience, development process and vision.
            </p>
          </motion.div>

          {/* Right side visual asset */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 pt-8 lg:pt-0"
          >
            <div className="relative w-full h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/images/journey_ai.png"
                alt="Technical Development Journey Nodes"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Embedded Team Videos Component */}
        <TeamVideosSection />

      </div>
    </div>
  );
}
