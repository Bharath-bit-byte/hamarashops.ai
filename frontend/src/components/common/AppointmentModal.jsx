import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, FileText, MessageSquare, X, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';
import { ContactApi } from '../../services/api';

export default function AppointmentModal({ isOpen, onClose }) {
  const todayStr = new Date().toISOString().split('T')[0];

  // Form State
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [purpose, setPurpose] = useState('AI Architecture Review');
  const [customPurpose, setCustomPurpose] = useState('');
  const [message, setMessage] = useState('');

  // Status State
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setClientName('');
    setEmail('');
    setPhone('');
    setPreferredDate('');
    setPreferredTime('10:00 AM');
    setPurpose('AI Architecture Review');
    setCustomPurpose('');
    setMessage('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!clientName.trim() || !email.trim() || !phone.trim() || !preferredDate || !preferredTime || !purpose) {
      setError('Please fill in all required fields marked with *.');
      return;
    }

    const finalPurpose = purpose === 'Other' ? (customPurpose.trim() || 'General Meeting') : purpose;

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        clientName: clientName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        preferredDate,
        preferredTime,
        purpose: finalPurpose,
        message: message.trim(),
      };

      const res = await ContactApi.scheduleAppointment(payload);
      if (res && res.resendEmailId) {
        setSuccess(true);
      } else {
        throw new Error(res?.message || 'Unable to submit your appointment request right now. Please try again or contact us directly.');
      }
    } catch (err) {
      console.error('Appointment submission error:', err);
      setError(err.message || 'Unable to submit your appointment request right now. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#0c0e12]/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#0a1628] border border-[#ff6b6b]/40 rounded-2xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#3c475a]/50 bg-[#0c0e12]/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ff6b6b]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold text-white">Schedule an Appointment Request</h3>
                <p className="text-xs text-slate-400 font-mono">1-on-1 AI Consultation & Technical Review</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1a1c20] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
            {success ? (
              /* Success View */
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Appointment Request Submitted</h4>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you! Your appointment request has been dispatched to our engineering team. We will review your requested schedule and contact you via email or phone to confirm.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300 text-xs font-mono text-left max-w-lg mx-auto">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>
                    <strong>Please Note:</strong> This is an <em>appointment request</em>. Your meeting time is subject to availability and will be confirmed by our team via email or phone.
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c0e12] border border-[#3c475a] text-left text-xs space-y-2.5 max-w-lg mx-auto font-mono">
                  <div className="flex justify-between border-b border-[#3c475a]/40 pb-2">
                    <span className="text-slate-400">Client Name:</span>
                    <span className="text-white font-bold">{clientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#3c475a]/40 pb-2">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-[#4cd6ff]">{email}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#3c475a]/40 pb-2">
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-white">{phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#3c475a]/40 pb-2">
                    <span className="text-slate-400">Preferred Date & Time:</span>
                    <span className="text-white font-bold">{preferredDate} at {preferredTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Purpose:</span>
                    <span className="text-[#ff6b6b] font-bold">{purpose === 'Other' ? customPurpose : purpose}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-extrabold text-xs hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Request Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Disclaimer Banner */}
                <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#3c475a] flex items-start gap-3 text-xs text-slate-300">
                  <Info className="w-5 h-5 text-[#4cd6ff] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Submitting this form sends an <strong className="text-[#4cd6ff]">appointment request</strong> to the HamaraShops.ai team. We will review your preferred date and time and reach out to confirm your meeting.
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs font-mono">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#ff6b6b]" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#ff6b6b]" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                    />
                  </div>
                </div>

                {/* Phone & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#ff6b6b]" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#ff6b6b]" />
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                    />
                  </div>
                </div>

                {/* Time Slot & Purpose */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#ff6b6b]" />
                      Preferred Time *
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                    >
                      <option value="09:00 AM" className="bg-[#0c0e12]">09:00 AM IST</option>
                      <option value="10:00 AM" className="bg-[#0c0e12]">10:00 AM IST</option>
                      <option value="11:00 AM" className="bg-[#0c0e12]">11:00 AM IST</option>
                      <option value="02:00 PM" className="bg-[#0c0e12]">02:00 PM IST</option>
                      <option value="03:00 PM" className="bg-[#0c0e12]">03:00 PM IST</option>
                      <option value="04:00 PM" className="bg-[#0c0e12]">04:00 PM IST</option>
                      <option value="05:00 PM" className="bg-[#0c0e12]">05:00 PM IST</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#ff6b6b]" />
                      Meeting Purpose *
                    </label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                    >
                      <option value="AI Architecture Review" className="bg-[#0c0e12]">AI Architecture Review</option>
                      <option value="Product Suite Demonstration" className="bg-[#0c0e12]">Product Suite Demonstration</option>
                      <option value="Custom Generative AI Solution" className="bg-[#0c0e12]">Custom Generative AI Solution</option>
                      <option value="Enterprise Integration & API" className="bg-[#0c0e12]">Enterprise Integration & API</option>
                      <option value="Strategic Partnership" className="bg-[#0c0e12]">Strategic Partnership</option>
                      <option value="Other" className="bg-[#0c0e12]">Other</option>
                    </select>
                  </div>
                </div>

                {purpose === 'Other' && (
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Specify Meeting Purpose *</label>
                    <input
                      type="text"
                      required
                      value={customPurpose}
                      onChange={(e) => setCustomPurpose(e.target.value)}
                      placeholder="Please specify your meeting objective..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                    />
                  </div>
                )}

                {/* Additional Message */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    Additional Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide any specific topics or prerequisites for our meeting..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-white text-sm focus:outline-none focus:border-[#ff6b6b]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3c475a]/50">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={submitting}
                    className="px-5 py-3 rounded-xl bg-[#0c0e12] border border-[#3c475a] text-slate-300 text-xs font-mono hover:bg-[#1a1c20] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-extrabold text-xs hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>Submit Appointment Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
