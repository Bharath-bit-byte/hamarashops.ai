import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Bot, Search, UserCheck, FileText, Sparkles, Code2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card3D from '../components/common/Card3D';

// Lazy load 3D visualizer background
const Float3DCanvas = lazy(() => import('../components/common/Float3DCanvas'));

const useCasesList = [
  {
    icon: Bot,
    title: 'Customer Service Automation',
    subtitle: 'Conversational LLMs & Intelligent Resolution',
    description: 'Automate common customer interactions, summarize multi-turn support conversations, reduce human intervention, and provide frustration-free experiences.',
    examples: ['Garment fit & recipe advice', 'Equipment fault code troubleshooting', 'Post-call wrap-up summary generation'],
    glowColor: '#ff6b6b',
    imagePath: '/images/usecase_customer_service.png'
  },
  {
    icon: Search,
    title: 'Search & Synthesis',
    subtitle: 'Natural Language & Deep Document Retrieval',
    description: 'Query large document sets, content archives, contracts, medical literature, and engineering blueprints via natural language search.',
    examples: ['LIBOR contract phase-out identification', 'FDA drug submission cross-referencing', 'Decades-worth archive search in seconds'],
    glowColor: '#4cd6ff',
    imagePath: '/images/usecase_search_synthesis.png'
  },
  {
    icon: UserCheck,
    title: 'Personalization',
    subtitle: '1:1 Contextual Audience Messaging',
    description: 'Deliver tailor-made product recommendations, custom shopping experiences, and behavioral analytics tailored to the viewer in real-time.',
    examples: ['Personalized financial card recommendations', 'Complex fashion & grocery searches', 'Real-time streaming media discovery'],
    glowColor: '#ff6b6b',
    imagePath: '/images/usecase_personalization.png'
  },
  {
    icon: FileText,
    title: 'Content Generation',
    subtitle: 'Studio-Grade Media & Copy Generation',
    description: 'Empower creative and marketing teams to produce bespoke imagery, product copy, clinical reports, and marketing assets in minutes.',
    examples: ['Studio-grade product image creation with Imagen', 'Prior Authorization physician letter drafting', 'Clinical Study Report Table of Contents generation'],
    glowColor: '#4cd6ff',
    imagePath: '/images/usecase_content_generation.png'
  },
  {
    icon: Sparkles,
    title: 'AI Assistants',
    subtitle: 'Domain-Specific Virtual Concierge Agents',
    description: 'Deploy context-aware virtual concierges for patients, store associates, fantasy sports fans, and trade settlement facilitators.',
    examples: ['Wendy\'s FreshAI PoS drive-thru assistance', 'Pregnant patient hospital concierge', 'Repo trade settlement status assistant'],
    glowColor: '#ff6b6b',
    imagePath: '/images/usecase_ai_assistants.png'
  },
  {
    icon: Code2,
    title: 'Developer Assistance',
    subtitle: 'Regulatory Code Transformation & Automation',
    description: 'Help developers understand underlying regulatory or business requirement changes and assist in automating code modifications.',
    examples: ['Basel III capital requirement math formulas', 'Regulatory requirement to code translator', 'Automated API & catalog schema mapping'],
    glowColor: '#4cd6ff',
    imagePath: '/images/usecase_developer_assistance.png'
  }
];

export default function UseCases() {
  return (
    <div className="w-full min-h-screen bg-[#0c0e12] pt-28 pb-20 px-6 relative overflow-hidden">
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4cd6ff]/10 border border-[#4cd6ff]/30 text-[#4cd6ff] text-xs font-mono mb-4 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Generative AI Capabilities</span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Core AI Use Cases Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">Enterprise Workflows</span>
          </h1>
          <p className="text-base sm:text-lg text-[#bcc7dd] leading-relaxed font-body-lg">
            Explore the core Generative AI capabilities powered by leading foundation models, transforming customer service, search, content creation, and developer efficiency.
          </p>
        </motion.div>

        {/* 6 Grid Cards with 3D Specular Tilt and unique visuals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {useCasesList.map((uc, idx) => {
            const IconComponent = uc.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Card3D glowColor={uc.glowColor} className="bg-[#0a1628]/60 border border-[#3c475a]/50 h-full flex flex-col justify-between p-8">
                  <div>
                    {/* Thematic Use Case Image */}
                    <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-6 border border-white/5 shadow-md">
                      <img
                        src={uc.imagePath}
                        alt={uc.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 flex items-center justify-center text-[#ff6b6b] mb-6">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#4cd6ff] mb-2 block">
                      {uc.subtitle}
                    </span>
                    <h3 className="font-headline text-xl text-white font-bold mb-3">
                      {uc.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                      {uc.description}
                    </p>
                    
                    <div className="space-y-2 mb-6 pt-4 border-t border-[#3c475a]/30">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">PDF Reference Examples:</span>
                      {uc.examples.map((ex, eIdx) => (
                        <div key={eIdx} className="flex items-center text-xs text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b] mr-2 flex-shrink-0" />
                          <span>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/industries"
                    className="inline-flex items-center gap-2 text-xs font-mono text-[#ff6b6b] hover:text-white font-bold uppercase tracking-wider transition-colors group/link cursor-pointer"
                  >
                    <span>View Industry Applications</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </Card3D>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
