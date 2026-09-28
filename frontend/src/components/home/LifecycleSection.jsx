import React from 'react';
import { motion } from 'framer-motion';
import { Search, BrainCircuit, Plug, TrendingUp, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Discovery',
    desc: 'We analyze your data landscape to identify the highest-value AI opportunities tailored to your enterprise goals.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Modeling',
    desc: 'Our data scientists build and train sophisticated machine learning models using state-of-the-art neural architectures.',
    icon: BrainCircuit,
  },
  {
    number: '03',
    title: 'Integration',
    desc: 'We seamlessly integrate AI models into your existing applications, ensuring high performance and ultra-low latency.',
    icon: Plug,
  },
  {
    number: '04',
    title: 'Evolution',
    desc: 'Continuous monitoring and fine-tuning ensure your AI products grow smarter and more accurate with every interaction.',
    icon: TrendingUp,
  },
];

export default function LifecycleSection() {
  return (
    <section className="py-24 px-6 bg-[#0a1628]/60 border-t border-[#3c475a]/30 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Product Lifecycle</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Nurturing Continuous Innovation Through <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">
              Intelligent Engineering
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Our systematic approach ensures that AI isn't just a feature, but a core driver of your product's success and evolution.
          </p>
        </motion.div>

        {/* 4-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-3xl p-8 border border-[#3c475a]/50 hover:border-[#ff6b6b]/50 transition-all duration-300 relative group flex flex-col justify-between"
              >
                {/* Step Badge */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-mono font-extrabold flex items-center justify-center text-sm shadow-md shadow-[#ff6b6b]/20">
                      {step.number}
                    </span>
                    <IconComp className="w-6 h-6 text-[#ff6b6b] group-hover:text-[#4cd6ff] transition-colors" />
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-white mb-3 group-hover:text-[#ffb3b0] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#3c475a]/40">
                  <div className="h-1 bg-[#1a1c20] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff] w-0 group-hover:w-full transition-all duration-700 ease-out" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
