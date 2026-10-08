import React from 'react';
import { motion } from 'framer-motion';

export default function LinkedInButton({ onClick, isLoading = false, className = '' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#0A66C2] hover:bg-[#004182] transition-colors duration-200 shadow-lg shadow-[#0A66C2]/25 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 focus:ring-offset-[#0c0e12] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${className}`}
      aria-label="Sign in with LinkedIn"
    >
      {/* Official LinkedIn 'in' SVG Mark */}
      <svg
        className="w-5 h-5 fill-current shrink-0"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.76v8.37H6.46v-8.37M7.84 6.78c-.89 0-1.61.72-1.61 1.61 0 .89.72 1.61 1.61 1.61.89 0 1.61-.72 1.61-1.61 0-.89-.72-1.61-1.61-1.61Z" />
      </svg>
      <span>{isLoading ? 'Connecting to LinkedIn...' : 'Sign in with LinkedIn'}</span>
    </motion.button>
  );
}
