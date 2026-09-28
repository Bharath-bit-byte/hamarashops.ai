import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Cloud, Database, Server, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentApi } from '../services/api';

const fallbackIntegrations = [
  {
    name: 'Cloud Infrastructure',
    desc: 'Seamless sync with AWS, Azure, and Google Cloud Platform.',
    icon: Cloud,
  },
  {
    name: 'CRM Systems',
    desc: 'Native connectors for Salesforce, HubSpot, and Microsoft Dynamics.',
    icon: Server,
  },
  {
    name: 'ERP Platforms',
    desc: 'Deep workflow integration with SAP, Oracle, and NetSuite.',
    icon: Layers,
  },
  {
    name: 'Data Warehouses',
    desc: 'Real-time telemetry streaming from Snowflake, BigQuery, and Databricks.',
    icon: Database,
  },
];

export default function Integrations() {
  const [integrations, setIntegrations] = useState(fallbackIntegrations);

  useEffect(() => {
    async function loadIntegrations() {
      try {
        const data = await ContentApi.getIntegrations();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item, idx) => ({
            name: item.name,
            desc: item.description || item.desc,
            icon: fallbackIntegrations[idx % fallbackIntegrations.length].icon,
          }));
          setIntegrations(mapped);
        }
      } catch (err) {
        console.error('Failed to load integrations:', err);
      }
    }
    loadIntegrations();
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#e2e2e8] pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
            Connected Stack
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Connected <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">Ecosystem</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            HamaraShops.ai operates seamlessly inside your existing tech stack through zero-downtime microservice connectors.
          </p>
        </motion.div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {integrations.map((item, i) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-3xl p-8 border border-[#3c475a]/50 hover:border-[#ff6b6b]/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 flex items-center justify-center text-[#ff6b6b] mb-6 group-hover:bg-[#ff6b6b] group-hover:text-[#68000f] transition-all">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-white mb-3 group-hover:text-[#ffb3b0] transition-colors">
                  {item.name}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#4cd6ff]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Production Ready Connector</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Connector CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card rounded-3xl p-10 border border-[#ff6b6b]/40 text-center bg-gradient-to-r from-[#0a1628] to-[#1a1c20]"
        >
          <h2 className="font-headline text-3xl font-extrabold text-white mb-4">Need a Custom Enterprise Integration?</h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Our API-first architecture enables our engineering team to deploy custom connectors for proprietary data stores in weeks.
          </p>
          <Link
            to="/api-docs"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-bold text-sm hover:shadow-lg hover:shadow-[#ff6b6b]/30 transition-all"
          >
            <span>Explore API Documentation</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
