import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Play, Sparkles, UserCheck } from 'lucide-react';
import Card3D from '../common/Card3D';

// Reusable data array for easy content updates in the future
const teamVideos = [
  {
    id: 'team-video-1',
    name: 'Gorantla Charan Ranga',
    role: 'Full Stack Developer',
    title: 'My Journey with HamaraShops.ai',
    description: 'Sharing my experience and journey while developing HamaraShops.ai.',
    videoUrl: 'https://www.youtube.com/embed/ZNFY7UCzhbM',
    linkedinUrl: 'https://www.linkedin.com/in/gorantlacharanranga/',
    glowColor: '#ff6b6b'
  },
  {
    id: 'team-video-2',
    name: 'Sadam Bharath',
    role: 'Backend Developer',
    title: 'Backend Development Journey',
    description: 'Sharing the backend development and microservices experience.',
    videoUrl: 'https://www.youtube.com/embed/D1zHyBLH3v0',
    linkedinUrl: 'https://www.linkedin.com/in/sadambharath/',
    glowColor: '#4cd6ff'
  },
  {
    id: 'team-video-3',
    name: 'Akhil',
    role: 'Frontend Developer',
    title: 'Frontend & UI/UX Journey',
    description: 'Sharing the frontend development and UI/UX experience.',
    videoUrl: 'https://www.youtube.com/embed/zms_htzRvOE',
    linkedinUrl: 'https://www.linkedin.com/in/akhil-sunamudi-b417aa426/',
    glowColor: '#ff6b6b'
  },
  {
    id: 'team-video-4',
    name: 'Bhavani',
    role: 'Cloud & Deployment Engineer',
    title: 'Cloud Deployment Journey',
    description: 'Sharing the deployment and Google Cloud experience.',
    videoUrl: 'https://www.youtube.com/embed/XskLsDyDLYw',
    linkedinUrl: 'https://www.linkedin.com/in/madhikuntla-bhavani-7943ab1b0/',
    glowColor: '#4cd6ff'
  },

];

export default function TeamVideosSection() {
  return (
    <section id="our-journey" className="py-24 px-6 relative bg-radial-depth z-20 overflow-hidden border-t border-[#3c475a]/20 scroll-mt-28">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#ff6b6b]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#ff6b6b]" />
            <span>Team Insights</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl text-white font-extrabold tracking-tight mb-4">
            Our Journey — In Our Own Words
          </h2>
          <p className="text-base text-slate-300 leading-relaxed font-normal">
            Hear directly from the team behind HamaraShops.ai as we share our journey, experience, development process and vision.
          </p>
        </motion.div>

        {/* 4 Video Cards Grid (Responsive: 1 col mobile, 2 cols tablet, 4 cols desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamVideos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card3D glowColor={video.glowColor} className="bg-[#0a1628]/60 border border-[#3c475a]/50 h-full flex flex-col justify-between p-5 rounded-3xl">
                <div>
                  {/* YouTube Embed Container (16:9 Aspect Ratio) */}
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-5 border border-white/10 bg-black/40 shadow-lg">
                    <iframe
                      src={video.videoUrl}
                      title={video.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  {/* Person Name & Role Tag */}
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h3 className="font-headline text-lg font-bold text-white flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#4cd6ff]" />
                      <span>{video.name}</span>
                    </h3>
                    <span className="font-mono text-[10px] bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] px-2 py-0.5 rounded tracking-wider uppercase font-semibold">
                      {video.role}
                    </span>
                  </div>

                  {/* Video Title */}
                  <h4 className="font-headline text-sm font-semibold text-[#4cd6ff] mb-2">
                    {video.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
                    {video.description}
                  </p>
                </div>

                {/* LinkedIn External Profile Link */}
                <div className="pt-4 border-t border-[#3c475a]/30 mt-auto">
                  <a
                    href={video.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#1a1c20] hover:bg-[#ff6b6b] border border-[#3c475a] hover:border-[#ff6b6b] text-slate-200 hover:text-[#68000f] text-xs font-bold transition-all duration-300 group/btn cursor-pointer shadow-md"
                  >
                    <Linkedin className="w-4 h-4 text-[#ff6b6b] group-hover/btn:text-[#68000f] transition-colors" />
                    <span>View LinkedIn Profile</span>
                  </a>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
