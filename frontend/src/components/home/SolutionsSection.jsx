import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, BarChart, Shield, Infinity as LoopIcon, Cpu, Loader2, Sparkles } from 'lucide-react';
import { ContentApi } from '../../services/api';
import Card3D from '../common/Card3D';
import { getSmartImage, handleImageError } from '../../utils/imageUtils';

const fallbackSolutions = [
  {
    id: 'sol-001',
    title: 'Generative AI Engines',
    summary: 'State-of-the-art generative AI systems powering text synthesis, document generation, and RAG interaction.',
    icon: BarChart,
    category: 'Analytics',
    benefits: ['Large Language Models (LLMs)', 'Synthesized Data Generation'],
    slug: 'generative-ai-engines',
    img: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sol-002',
    title: 'Predictive Maintenance',
    summary: 'Predictive maintenance solutions integrating edge IoT sensors and neural network architectures.',
    icon: Shield,
    category: 'Security',
    benefits: ['Edge AI & IoT Integration', '60% Reduced Risk Exposure'],
    slug: 'predictive-maintenance',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sol-003',
    title: 'Fraud Detection Systems',
    summary: 'Next-generation transaction scoring and automated anomaly response systems powered by neural models.',
    icon: LoopIcon,
    category: 'Automation',
    benefits: ['Real-Time Transaction Scoring', '99.4% Anomaly Accuracy'],
    slug: 'fraud-detection-systems',
    img: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=600&q=80',
  },
];

const categories = ['All Solutions', 'Analytics', 'Security', 'Automation'];

export default function SolutionsSection() {
  const [solutions, setSolutions] = useState(fallbackSolutions);
  const [selectedCategory, setSelectedCategory] = useState('All Solutions');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSolutions() {
      setLoading(true);
      try {
        const data = await ContentApi.getSolutions();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 6).map((item, idx) => ({
            id: item.id || `sol-${idx}`,
            title: item.title || item.name,
            summary: item.summary || item.description,
            icon: fallbackSolutions[idx % fallbackSolutions.length].icon,
            category: item.category || fallbackSolutions[idx % fallbackSolutions.length].category,
            benefits: item.keyBenefits || fallbackSolutions[idx % fallbackSolutions.length].benefits,
            slug: item.slug,
            img: getSmartImage(item),
          }));
          setSolutions(mapped);
        }
      } catch (err) {
        console.error('Failed to load solutions from API Gateway:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSolutions();
  }, []);

  const filteredSolutions = selectedCategory === 'All Solutions'
    ? solutions
    : solutions.filter((s) => s.category === selectedCategory || s.title.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <section className="py-24 px-6 relative bg-radial-depth z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-3 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cognitive Architecture</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl text-white font-extrabold tracking-tight">
              Enterprise Solutions
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mt-2 font-normal">
              Architecting the future of your business through intelligent, scalable, and secure AI integrations.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-[#1a1c20]/80 p-1.5 rounded-full border border-[#3c475a]/60 backdrop-blur-md">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    isSelected ? 'text-[#68000f]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeSolutionTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] rounded-full shadow-md shadow-[#ff6b6b]/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#ff6b6b] animate-spin" />
          </div>
        )}

        {/* 3-Column Compact 3D Tilt Solution Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSolutions.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Card3D glowColor="#ff6b6b" className="bg-[#0a1628]/60 border border-[#3c475a]/50 h-full flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={card.img}
                          alt={card.title}
                          onError={(e) => handleImageError(e, 'generative')}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-transparent to-transparent" />
                        <div className="absolute top-3 right-3 bg-[#0a1628]/80 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-white/10">
                          <IconComponent className="w-5 h-5 text-[#ff6b6b]" />
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-headline text-xl text-white mb-2 font-bold group-hover:text-[#ffb3b0] transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
                          {card.summary}
                        </p>

                        <ul className="space-y-1.5 mb-4">
                          {card.benefits.slice(0, 2).map((benefit, bIdx) => (
                            <li key={bIdx} className="flex items-center text-[11px] text-slate-400 font-mono">
                              <CheckCircle className="w-3.5 h-3.5 text-[#4cd6ff] mr-1.5 flex-shrink-0" />
                              <span className="truncate">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-0">
                      <Link
                        to={`/solutions/${card.slug}`}
                        className="text-[#ff6b6b] font-mono text-xs font-bold uppercase tracking-wider hover:text-[#ffb3b0] transition-colors inline-flex items-center gap-1.5 group/link"
                      >
                        <span>Explore Solution</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </Card3D>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
