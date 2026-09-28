import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';
import { ContentApi } from '../../services/api';
import Card3D from '../common/Card3D';
import { getSmartImage, handleImageError } from '../../utils/imageUtils';

const fallbackInsights = [
  {
    id: 'ins-001',
    title: 'Revolutionizing Healthcare with AI Diagnostics',
    category: 'Research Brief',
    summary: 'Exploring how Vision AI and anomaly detection accuracy transform healthcare diagnostic workflows.',
    slug: 'revolutionizing-healthcare-ai',
    readTime: '8 Min',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ins-002',
    title: 'The Future of Ethical AI & Governance',
    category: 'Enterprise Brief',
    summary: 'How responsible neural network design and transparent AI governance enable trustworthy enterprise AI deployment.',
    slug: 'future-ethical-ai-products',
    readTime: '6 Min',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ins-003',
    title: 'A2A Protocol for Multi-Agent Systems',
    category: 'Architecture Paper',
    summary: 'Autonomous agent-to-agent communication framework for zero-latency distributed decision making.',
    slug: 'multi-agent-systems-a2a-protocol',
    readTime: '10 Min',
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
];

export default function InsightsSection() {
  const [insights, setInsights] = useState(fallbackInsights);

  useEffect(() => {
    async function loadInsights() {
      try {
        const data = await ContentApi.getInsights();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 3).map((item, idx) => ({
            id: item.id,
            title: item.title,
            category: item.category || item.type || 'Research Brief',
            summary: item.description || item.summary,
            slug: item.slug,
            readTime: item.readTime || '6 Min',
            img: getSmartImage(item),
          }));
          setInsights(mapped);
        }
      } catch (err) {
        console.error('Failed to load insights from API Gateway:', err);
      }
    }

    loadInsights();
  }, []);

  return (
    <section className="py-24 px-6 bg-[#0c0e12] relative z-20 overflow-hidden border-t border-[#3c475a]/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-3 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thought Leadership</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl text-white font-extrabold tracking-tight">
              Featured Insights
            </h2>
            <p className="text-base text-slate-300 mt-1">Latest thinking on AI, data, and digital transformation.</p>
          </div>
          <Link
            to="/insights"
            className="text-[#ff6b6b] hover:text-[#ffb3b0] transition-colors flex items-center mt-4 md:mt-0 font-mono text-xs uppercase tracking-widest gap-1 group font-bold"
          >
            <span>View All Insights</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </motion.div>

        {/* 3-Column 3D Tilt Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card3D glowColor="#4cd6ff" className="bg-[#0a1628]/60 border border-[#3c475a]/50 h-full flex flex-col justify-between">
                <div>
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      onError={(e) => handleImageError(e, 'default')}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#0a1628]/80 text-[#4cd6ff] border border-[#4cd6ff]/40 text-[10px] font-mono font-bold uppercase backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-headline text-lg text-white mb-2 font-bold group-hover:text-[#ff6b6b] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <div className="h-[1px] w-full bg-[#3c475a]/40 mb-3" />
                  <div className="flex justify-between items-center text-slate-400 font-mono text-xs">
                    <span className="text-[11px]">Read Time: {item.readTime}</span>
                    <Link
                      to={`/insights/${item.slug}`}
                      className="flex items-center gap-1 text-[#ff6b6b] hover:text-[#ffb3b0] font-bold text-xs"
                    >
                      <span>Read Paper</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
