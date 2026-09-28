import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ContactApi } from '../../services/api';
import { Send, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export default function ConsultationSection() {
  const [form, setForm] = useState({ fullName: '', email: '', subject: 'Homepage Consultation', message: '', category: 'General' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email) return;

    try {
      setLoading(true);
      setError(null);
      await ContactApi.submitInquiry(form);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit consultation:', err);
      setError('Unable to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-[#0a1628]/60 border-t border-b border-[#3c475a]/40 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#ff6b6b]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 sm:p-12 border border-[#ff6b6b]/30 shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Column 1: Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ffb3b0] text-xs font-mono mb-4 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Accelerate Transformation</span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                Ready to Architect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#4cd6ff]">AI Roadmap?</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Schedule a 1-on-1 strategy session with our principal AI architects. Get direct insights on model deployment, enterprise data integration, and ROI estimation.
              </p>
              
              <div className="space-y-3 font-mono text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ff6b6b]" />
                  <span>Strict Confidentiality & NDA Assurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#4cd6ff]" />
                  <span>24-Hour Response Time SLA</span>
                </div>
              </div>
            </div>

            {/* Column 2: Form */}
            <div>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#1a1c20]/90 border border-[#ff6b6b]/40 p-8 rounded-2xl text-center space-y-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-[#ff6b6b] mx-auto" />
                  <h3 className="text-xl font-bold text-white">Consultation Request Received</h3>
                  <p className="text-sm text-slate-300">
                    Thank you! Our AI architecture team will reach out to you within 24 business hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ fullName: '', email: '', subject: 'Homepage Consultation', message: '', category: 'General' }); }}
                    className="px-5 py-2.5 rounded-xl bg-[#282a2e] text-white text-xs font-semibold hover:bg-[#333539] transition-all"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 bg-[#0c0e12]/80 p-6 sm:p-8 rounded-2xl border border-[#3c475a]/50">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#1a1c20] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@enterprise.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#1a1c20] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Key Initiative / Scope</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your upcoming AI initiative or workflow challenges..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#1a1c20] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-bold text-sm hover:shadow-lg hover:shadow-[#ff6b6b]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'Submitting...' : 'Request Architecture Session'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
