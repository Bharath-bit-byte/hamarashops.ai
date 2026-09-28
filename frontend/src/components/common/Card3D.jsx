import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Card3D({ children, className = '', glowColor = '#ff6b6b' }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    setRotateX(-normY * 12);
    setRotateY(normX * 12);
    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div style={{ perspective: 1000 }} className="w-full h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={reducedMotion ? {} : {
          rotateX,
          rotateY,
          scale: isHovered ? 1.025 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative rounded-3xl overflow-hidden backdrop-blur-xl transition-shadow duration-300 h-full flex flex-col justify-between ${className}`}
      >
        {/* Dynamic Interactive Cursor Glow Overlay */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
          style={{
            opacity: isHovered && !reducedMotion ? 0.35 : 0,
            background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor}40, transparent 80%)`,
          }}
        />

        {/* Specular Glare/Sheen highlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
          style={{
            opacity: isHovered && !reducedMotion ? 0.15 : 0,
            background: `linear-gradient(${135 + (rotateX + rotateY) * 2}deg, rgba(255,255,255,0.4) 0%, transparent 60%)`,
          }}
        />

        {/* Subtle Ambient Border Glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl border transition-colors duration-300 z-20"
          style={{
            borderColor: isHovered ? `${glowColor}80` : 'rgba(60, 71, 90, 0.45)',
            boxShadow: isHovered
              ? `0 20px 40px -15px ${glowColor}30, 0 0 25px 0 ${glowColor}20`
              : 'none',
          }}
        />

        {/* Card Children Content with 3D Depth Lift */}
        <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }} className="relative z-10 w-full h-full flex flex-col justify-between">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
