import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Search, Database, Bot, Mail, Map, Calendar, Languages, ArrowRight, Layers, Workflow } from 'lucide-react';
import Card3D from '../components/common/Card3D';

// Lazy load 3D visualizers to optimize bundle sizes
const Float3DCanvas = lazy(() => import('../components/common/Float3DCanvas'));
const Pipeline3DCanvas = lazy(() => import('../components/common/Pipeline3DCanvas'));

const flowSteps = [
  { step: '01', title: 'User / Channel', desc: 'Mobile App, Web Portal, Voice, Drive-thru PoS', icon: Bot, color: 'border-[#ff6b6b]/40 text-[#ff6b6b]' },
  { step: '02', title: 'AI / Agent Interface', desc: 'Vertex AI Agent Builder, Conversational Agent', icon: Cpu, color: 'border-[#4cd6ff]/40 text-[#4cd6ff]' },
  { step: '03', title: 'Search & Data Index', desc: 'Vertex AI Search, Vector Store, Private ELN & EHR', icon: Search, color: 'border-[#ff6b6b]/40 text-[#ff6b6b]' },
  { step: '04', title: 'Generative AI Model', desc: 'PaLM, MedPaLM, Imagen, Chirp Voice AI', icon: Layers, color: 'border-[#4cd6ff]/40 text-[#4cd6ff]' },
  { step: '05', title: 'Business System', desc: 'ERP, LIMS, Order Management, Google Maps, Email', icon: Database, color: 'border-[#ff6b6b]/40 text-[#ff6b6b]' },
];

const techComponents = [
  {
    name: 'Vertex AI Agent Builder',
    category: 'Conversational Layer',
    icon: Bot,
    description: 'Creates conversational experiences across mobile apps, web interfaces, and quick-service restaurant (QSR) drive-thrus.',
    industries: ['Retail', 'Financial Services', 'Media', 'Healthcare', 'Manufacturing']
  },
  {
    name: 'Vertex AI Search',
    category: 'Information Retrieval',
    icon: Search,
    description: 'Enables secure data discovery across patient records, engineering blueprints, contracts, and media archives.',
    industries: ['Healthcare', 'Media', 'Manufacturing', 'Financial Services']
  },
  {
    name: 'Domain-Adapted AI Models',
    category: 'Foundation Models',
    icon: Cpu,
    description: 'PaLM for text generation, MedPaLM for specialized clinical discharge notes, Imagen for image generation, and Chirp for voice-to-text.',
    industries: ['Healthcare', 'Retail', 'Media', 'Financial Services']
  },
  {
    name: 'Databases & Enterprise Catalogs',
    category: 'Data Layer',
    icon: Database,
    description: 'Integration with structured customer data, product catalogs, electronic lab notebooks (ELN), and historical maintenance logs.',
    industries: ['Financial Services', 'Manufacturing', 'Healthcare', 'Retail']
  },
  {
    name: 'Google Maps & Location Services',
    category: 'Location Intelligence',
    icon: Map,
    description: 'Integrates geospatial coordinates and routing data for provider finding, store locators, and dynamic fleet dispatching.',
    industries: ['Healthcare', 'Financial Services', 'Manufacturing']
  },
  {
    name: 'Email & Scheduling Systems',
    category: 'Action & Workflow',
    icon: Mail,
    description: 'Triggers post-call wrap-up summary emails to patients, appointment booking in healthcare, and automated reorder dispatches.',
    industries: ['Healthcare', 'Manufacturing', 'Financial Services']
  }
];

export default function Architecture() {
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
              <Workflow className="w-4 h-4 text-[#ff6b6b]" />
              <span>AI Solution Architecture</span>
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Stitching Multiple Models into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">Cohesive Systems</span>
            </h1>
            <p className="text-base sm:text-lg text-[#bcc7dd] leading-relaxed font-body-lg">
              High-impact use cases are the result of stitching together foundation models, vector search, enterprise databases, and external business APIs into unified architectures.
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
                src="/images/architecture_ai.png"
                alt="AI Architecture System Grid"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* 3D Conceptual Pipeline Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card3D glowColor="#ff6b6b" className="p-8 sm:p-10 bg-[#0a1628]/60 border border-[#ff6b6b]/30 mb-20">
            <div className="text-center mb-6">
              <h2 className="font-headline text-2xl font-bold text-white mb-2">Conceptual Architecture Flow</h2>
              <p className="text-xs font-mono text-slate-400">Interactive 3D Pipeline Visualizer (User Prompt → Conversational Agent → Vector Search → Foundation Model → Action)</p>
            </div>
            
            <Suspense fallback={<div className="w-full h-[280px] bg-[#1a1c20]/60 rounded-2xl animate-pulse" />}>
              <Pipeline3DCanvas />
            </Suspense>

            {/* Grid detailing steps below the 3D pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8 pt-8 border-t border-[#3c475a]/30">
              {flowSteps.map((step, idx) => (
                <div key={idx} className="bg-black/30 border border-[#3c475a]/30 p-4 rounded-xl text-center">
                  <span className="font-mono text-[9px] text-[#ffb3b0] uppercase tracking-widest block mb-1">{step.step} {step.title}</span>
                  <p className="text-[11px] text-slate-300 leading-snug font-normal">{step.desc}</p>
                </div>
              ))}
            </div>
          </Card3D>
        </motion.div>

        {/* Supported AI Components Grid */}
        <div className="mb-12">
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white mb-8 text-center">
            Key Architecture Components (PDF Source of Truth)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techComponents.map((comp, idx) => {
              const IconComp = comp.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Card3D glowColor="#ff6b6b" className="bg-[#0a1628]/60 border border-[#3c475a]/50 h-full flex flex-col justify-between p-6 sm:p-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ff6b6b]">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[#4cd6ff] tracking-wider block">{comp.category}</span>
                          <h3 className="font-headline text-lg font-bold text-white">{comp.name}</h3>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                        {comp.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#3c475a]/30">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-2">Applied Industries:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {comp.industries.map((ind, iIdx) => (
                          <span key={iIdx} className="text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-md">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card3D>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
