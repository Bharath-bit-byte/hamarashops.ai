import React, { useEffect, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Calendar, Clock } from 'lucide-react';
import { ContactApi } from '../services/api';
import InnerPageHero from '../components/common/InnerPageHero';
import Card3D from '../components/common/Card3D';
import AppointmentModal from '../components/common/AppointmentModal';

// Lazy load 3D visualizer background
const Float3DCanvas = lazy(() => import('../components/common/Float3DCanvas'));

export default function Contact() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);

  // Appointment Modal State
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

  useEffect(() => {
    async function loadContactInfo() {
      try {
        setLoadingInfo(true);
        const data = await ContactApi.getContactInfo();
        setContactInfo(data);
        if (data?.inquiryCategories?.length > 0) {
          setCategory(data.inquiryCategories[0]);
        }
      } catch (err) {
        console.error('Error loading contact metadata:', err);
      } finally {
        setLoadingInfo(false);
      }
    }
    loadContactInfo();
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsAppointmentOpen(true);
    window.addEventListener('open-appointment-modal', handleOpen);
    if (window.location.hash === '#appointment') {
      setIsAppointmentOpen(true);
    }
    return () => window.removeEventListener('open-appointment-modal', handleOpen);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError('Please fill in all required fields (Full Name and Email Address).');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        fullName,
        email,
        category,
        subject,
        message,
      };
      const res = await ContactApi.submitInquiry(payload);
      if (res && res.resendEmailId) {
        setReceipt(res);
      } else {
        throw new Error(res?.message || 'Inquiry submission failed because Resend email service did not accept the request.');
      }
    } catch (err) {
      console.error('Inquiry submission failed:', err);
      setError(err.message || 'Submission failed. Please check form parameters and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0c0e12] text-[#e2e2e8] relative overflow-hidden">
      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />

      {/* 3D WebGL Torus Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#0c0e12]/80 opacity-50 z-0 pointer-events-none" />}>
        <Float3DCanvas />
      </Suspense>

      <div className="relative z-10">
        {/* Hero Section */}
        <InnerPageHero
          badge="Enterprise Consultation Portal"
          title="Connect with Our AI Solution Architects"
          subtitle="Engage our engineering leaders for AI product evaluations, custom generative model engineering, and enterprise integration consultations."
          ctaText="Submit Online Inquiry"
          ctaLink="#form"
          stats={[
            { label: "Response Time", value: "< 4 Hours" },
            { label: "Architecture Audit", value: "Complimentary" },
            { label: "Gateway Status", value: "Active 24/7" },
            { label: "Data Security", value: "SOC2 Type II" }
          ]}
          previewTitle="Enterprise Consultation Hub"
          previewCategory="24/7 Advisory"
          previewDesc="Direct line to principal data scientists and solutions architects."
          previewTag="Instant Dispatch"
          previewImage="/images/usecase_customer_service.png"
        />

        {/* Main Content Section */}
        <section id="form" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
            
            {/* Left Column: Verified Metadata wrapped in Card3D */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card3D glowColor="#4cd6ff" className="p-8 border border-[#3c475a]/60 space-y-6 shadow-xl w-full">
                  <h3 className="font-headline text-2xl font-bold text-white border-b border-[#3c475a]/50 pb-4 font-headline-md">
                    {contactInfo?.companyName || 'HamaraShops.ai'}
                  </h3>

                  {contactInfo?.contactEmail && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-[#ff6b6b] shrink-0 mt-1" />
                      <div>
                        <div className="text-xs font-mono text-slate-400 uppercase">Official Email</div>
                        <a href={`mailto:${contactInfo.contactEmail}`} className="text-sm font-mono text-[#4cd6ff] hover:underline font-bold">
                          {contactInfo.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 pt-4 border-t border-[#3c475a]/40">
                    <ShieldCheck className="w-5 h-5 text-[#ff6b6b] shrink-0 mt-1" />
                    <div>
                      <div className="text-xs font-mono text-slate-400 uppercase mb-1">Architecture Guarantee</div>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        Stateless request validation handled via Spring Cloud API Gateway with instant JSON receipt generation.
                      </p>
                    </div>
                  </div>
                </Card3D>
              </motion.div>

              {/* Dedicated Appointment Banner Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card3D glowColor="#ff6b6b" className="p-8 border border-[#ff6b6b]/40 bg-gradient-to-br from-[#1a1c20] via-[#0a1628] to-[#0c0e12] space-y-5 shadow-xl w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#ff6b6b]/20 border border-[#ff6b6b]/40 text-[#ff6b6b]">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-headline text-lg font-bold text-white">Direct Meeting Request</h4>
                      <p className="text-xs text-[#4cd6ff] font-mono">1-on-1 Architect Consultation</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Prefer a direct discussion? Submit a request to schedule a 1-on-1 meeting with our AI solution architects at your preferred date and time.
                  </p>

                  <button
                    onClick={() => setIsAppointmentOpen(true)}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-extrabold text-xs hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule an Appointment</span>
                  </button>
                </Card3D>
              </motion.div>
            </div>

            {/* Right Column: Inquiry Form / Receipt State wrapped in Card3D */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card3D glowColor="#ff6b6b" className="p-8 sm:p-10 border border-[#ff6b6b]/40 shadow-2xl bg-gradient-to-br from-[#0a1628] via-[#1a1c20] to-[#0c0e12] w-full">
                  
                  {receipt ? (
                    /* Receipt Confirmation Card */
                    <div className="text-center py-8 space-y-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h3 className="font-headline text-3xl font-bold text-white">Inquiry Successfully Dispatched</h3>
                      <p className="text-sm text-slate-300 max-w-md mx-auto font-normal">{receipt.message}</p>

                      <div className="p-6 rounded-2xl bg-[#0c0e12] border border-[#3c475a] text-left font-mono text-xs space-y-2 max-w-md mx-auto">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Inquiry ID:</span>
                          <span className="text-[#4cd6ff] font-bold">{receipt.inquiryId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className="text-emerald-400 font-bold">{receipt.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Timestamp:</span>
                          <span className="text-slate-200">{receipt.timestamp}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setReceipt(null);
                          setFullName('');
                          setEmail('');
                          setSubject('');
                          setMessage('');
                        }}
                        className="px-8 py-3 rounded-xl bg-[#1a1c20] border border-[#3c475a] text-white text-xs font-mono hover:bg-[#282a2e] transition-colors cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    /* Controlled Contact Form */
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3c475a]/50">
                        <div>
                          <h3 className="font-headline text-3xl font-extrabold text-white mb-1">Submit Enterprise Inquiry</h3>
                          <p className="text-xs text-slate-300 font-normal">Business & technical evaluation inquiries</p>
                        </div>
                        <button
                          id="appointment"
                          type="button"
                          onClick={() => setIsAppointmentOpen(true)}
                          className="px-4 py-2.5 rounded-xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/40 text-[#ff6b6b] hover:bg-[#ff6b6b]/20 font-mono text-xs flex items-center gap-2 shrink-0 transition-colors cursor-pointer scroll-mt-28"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Schedule Appointment</span>
                        </button>
                      </div>

                      {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs font-mono">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-mono text-slate-300 mb-2 uppercase">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full px-4 py-3.5 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-300 mb-2 uppercase">Business Email *</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. s.jenkins@enterprise.com"
                            className="w-full px-4 py-3.5 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-2 uppercase">Inquiry Category *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                        >
                          {contactInfo?.inquiryCategories?.map((cat) => (
                            <option key={cat} value={cat} className="bg-[#0c0e12] text-white">
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-2 uppercase">Subject</label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g. Enterprise AI Integration Inquiry"
                          className="w-full px-4 py-3.5 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-2 uppercase">Message</label>
                        <textarea
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Describe your technical requirements or evaluation timeline..."
                          className="w-full px-4 py-3.5 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-extrabold text-sm hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Submitting Inquiry via Gateway...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Inquiry</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </Card3D>
              </motion.div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
