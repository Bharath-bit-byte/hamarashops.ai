import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Cpu, Key, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/auth/token',
    desc: 'Retrieve access token for API authentication.',
  },
  {
    method: 'POST',
    path: '/api/v1/ai/process',
    desc: 'Analyze unstructured data using the Cognitive Automation engine.',
  },
  {
    method: 'GET',
    path: '/api/v1/vision/detect',
    desc: 'Execute real-time object detection on a provided image URL or stream.',
  },
  {
    method: 'POST',
    path: '/api/v1/nlp/translate',
    desc: 'Translate text across 100+ supported languages with contextual accuracy.',
  },
];

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#e2e2e8] pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:text-left"
        >
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
            Developer Ecosystem
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            API <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">Documentation</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Connect your enterprise systems to the HamaraShops.ai neural network through our Spring Cloud API Gateway REST endpoints.
          </p>
        </motion.div>

        {/* Quick Start Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card rounded-3xl p-8 border border-[#ff6b6b]/30 shadow-2xl mb-12 relative overflow-hidden"
        >
          <div className="flex items-center gap-3 text-white mb-4 font-mono text-sm font-bold">
            <Terminal className="w-5 h-5 text-[#ff6b6b]" />
            <span>SDK Installation</span>
          </div>
          <div className="bg-[#0a1628] p-4 rounded-xl font-mono text-sm border border-[#3c475a]/60 text-slate-200 flex items-center justify-between">
            <code><span className="text-[#ff6b6b]">npm install</span> @hamarashops/sdk</code>
            <span className="text-xs text-slate-500">v3.1.0</span>
          </div>
        </motion.div>

        {/* Core Endpoints List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-3xl p-8 border border-[#3c475a]/50 shadow-2xl mb-12"
        >
          <h2 className="font-headline text-2xl font-bold text-white mb-6">Core REST Endpoints</h2>
          <div className="space-y-4">
            {endpoints.map((api, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row items-start md:items-center gap-4 p-5 rounded-2xl bg-[#0c0e12]/80 border border-[#3c475a]/40 hover:border-[#ff6b6b]/50 transition-colors"
              >
                <span
                  className={`px-3.5 py-1 rounded-lg text-xs font-mono font-extrabold uppercase tracking-widest ${api.method === 'GET'
                      ? 'bg-blue-500/20 text-[#4cd6ff] border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                >
                  {api.method}
                </span>
                <code className="text-[#ff6b6b] font-mono text-sm font-bold bg-[#1a1c20] px-3 py-1 rounded border border-[#3c475a]/50">
                  {api.path}
                </code>
                <p className="text-slate-300 text-sm flex-1">{api.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-[#3c475a]/50">
            <Key className="w-6 h-6 text-[#ff6b6b] mb-3" />
            <h3 className="font-bold text-white mb-2">Bearer Authentication</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Use Bearer Token authentication header for all requests beyond the token endpoint.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-[#3c475a]/50">
            <Cpu className="w-6 h-6 text-[#4cd6ff] mb-3" />
            <h3 className="font-bold text-white mb-2">Rate Limiting</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Global limit of 1,000 requests per minute per gateway client credentials.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-[#3c475a]/50">
            <Shield className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-bold text-white mb-2">RFC 7231 Standards</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Strict adherence to RFC standards for error handling and standard status codes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
