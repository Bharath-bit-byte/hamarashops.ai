import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LinkedInButton from '../components/auth/LinkedInButton';
import logoImg from '../assets/logo.png';

export default function Login() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    const messageParam = params.get('message');

    if (errorParam) {
      if (errorParam === 'cancelled') {
        setErrorMessage('LinkedIn sign-in was cancelled or consent was declined.');
      } else if (errorParam === 'invalid_state') {
        setErrorMessage(messageParam ? decodeURIComponent(messageParam) : 'Authentication validation failed (state mismatch). Please try again.');
      } else if (errorParam === 'auth_failed') {
        setErrorMessage(messageParam ? decodeURIComponent(messageParam) : 'Unable to complete LinkedIn verification. Please check your network and retry.');
      } else if (errorParam === 'missing_code') {
        setErrorMessage('Authorization code was not returned by LinkedIn.');
      } else {
        setErrorMessage(messageParam ? decodeURIComponent(messageParam) : 'An error occurred during authentication.');
      }
    }
  }, [location]);

  const handleLinkedInSignIn = () => {
    setErrorMessage(null);
    const from = location.state?.from?.pathname || '/';
    login(from);
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#e2e2e8] pt-32 pb-24 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#ff6b6b]/15 via-[#ff8533]/10 to-[#0A66C2]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#121620]/90 backdrop-blur-2xl border border-[#3c475a]/60 rounded-3xl p-8 sm:p-10 shadow-2xl relative"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="w-14 h-14 rounded-2xl bg-white p-2 flex items-center justify-center shadow-xl shadow-[#ff6b6b]/20 mb-4 hover:scale-105 transition-transform">
            <img src={logoImg} alt="HamaraShops.ai Logo" className="w-full h-full object-contain" />
          </Link>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In to HamaraShops<span className="text-[#ff6b6b]">.ai</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Enterprise Generative AI & Microservices Cloud Platform
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Authentication Notice</span>
                <span>{errorMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Already Authenticated State */}
        {isAuthenticated && user ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-[#1a2233]/70 border border-[#3c475a]/50 flex items-center gap-3.5 text-left">
              {user.pictureUrl ? (
                <img
                  src={user.pictureUrl}
                  alt={user.name || 'User'}
                  className="w-12 h-12 rounded-xl object-cover border border-[#ff6b6b]/40 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#ff6b6b] to-[#ff8533] text-white font-bold flex items-center justify-center shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                <p className="text-slate-400 text-xs truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                  Signed In via LinkedIn
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ff6b6b]/20"
              >
                <span>Continue to Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={logout}
                className="w-full py-2.5 rounded-xl border border-[#3c475a] text-slate-300 hover:text-white hover:bg-white/5 font-medium text-xs transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Actions */
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <LinkedInButton
                onClick={handleLinkedInSignIn}
                isLoading={isLoading}
                className="w-full"
              />
            </div>

            {/* Security Guarantee */}
            <div className="pt-4 border-t border-[#262c38] space-y-2.5">
              <div className="flex items-start gap-2.5 text-slate-400 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Uses OpenID Connect (OIDC) with zero password storage on HamaraShops.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-400 text-xs">
                <Lock className="w-4 h-4 text-[#ff6b6b] shrink-0 mt-0.5" />
                <span>
                  HttpOnly session cookies protect against client-side script tampering.
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-[11px] text-slate-500 font-mono">
          <span>By signing in, you agree to our </span>
          <Link to="/sales-terms" className="text-slate-400 hover:text-white underline">Terms</Link>
          <span> and </span>
          <Link to="/privacy" className="text-slate-400 hover:text-white underline">Privacy Policy</Link>.
        </div>
      </motion.div>
    </div>
  );
}
