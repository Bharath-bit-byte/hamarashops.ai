import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Film } from 'lucide-react';

// =========================================================================
// OFFICIAL HAMARASHOPS.AI COMPANY VIDEO CONFIGURATION
// YouTube Video ID: pxaMqyFmHO0
// Privacy-enhanced embed: https://www.youtube-nocookie.com/embed/pxaMqyFmHO0
// =========================================================================
export const YOUTUBE_VIDEO_ID = 'pxaMqyFmHO0';
export const YOUTUBE_EMBED_URL = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`;
export const YOUTUBE_THUMBNAIL_URL = `https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`;

// Backward compatibility aliases
export const COMPANY_VIDEO_SRC = YOUTUBE_EMBED_URL;
export const COMPANY_VIDEO_POSTER = YOUTUBE_THUMBNAIL_URL;

export default function CompanyVideoSection() {
  return (
    <section id="company-video-section" className="py-16 px-6 bg-[#0c0e12] border-b border-[#3c475a]/30 relative overflow-hidden scroll-mt-28">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* 1. COMPANY TAGLINE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#ff6b6b]" />
            <span>OUR POSITIONING</span>
          </div>

          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
            "HamaraShops.ai is an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] via-[#ff8533] to-[#4cd6ff]">
              application player
            </span>{' '}
            in the AI race."
          </h2>
        </motion.div>

        {/* 2. LARGE CINEMATIC VIDEO CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-[#0a1628]/80 border border-[#ff6b6b]/30 shadow-2xl shadow-[#ff6b6b]/10 group"
        >
          {/* 16:9 Aspect Ratio Frame */}
          <div className="relative w-full aspect-video bg-black/90 flex items-center justify-center overflow-hidden">
            <iframe
              src={`${YOUTUBE_EMBED_URL}?rel=0&enablejsapi=1`}
              title="HamaraShops.ai Company Profile Video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>

          {/* Bottom Bar Label */}
          <div className="p-4 bg-[#0a1628] border-t border-[#3c475a]/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff6b6b] animate-pulse" />
              <span className="text-white font-semibold">HamaraShops.ai Company Profile Video</span>
            </span>
            <span className="text-[#4cd6ff] flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>Official YouTube Broadcast</span>
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
