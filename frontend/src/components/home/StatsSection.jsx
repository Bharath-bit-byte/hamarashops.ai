import React, { useState, useEffect } from 'react';
import { ContentApi } from '../../services/api';

const fallbackStats = [
  { value: '200+', label: 'AI Models Deployed', color: 'text-[#ff6b6b]' },
  { value: '10K+', label: 'Predictions / Sec', color: 'text-[#4cd6ff]' },
  { value: '1PB+', label: 'Data Points Processed', color: 'text-[#ff6b6b]' },
  { value: '45%', label: 'Business Growth', color: 'text-[#4cd6ff]' },
];

export default function StatsSection() {
  const [stats, setStats] = useState(fallbackStats);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await ContentApi.getMetrics();
        if (Array.isArray(data) && data.length > 0) {
          const colors = ['text-[#ff6b6b]', 'text-[#4cd6ff]', 'text-[#ff6b6b]', 'text-[#4cd6ff]'];
          const mapped = data.slice(0, 4).map((m, idx) => ({
            value: m.value,
            label: m.label || m.description,
            color: colors[idx % colors.length]
          }));
          setStats(mapped);
        }
      } catch (err) {
        console.error('Error fetching metrics from API Gateway:', err);
      }
    }
    loadMetrics();
  }, []);

  return (
    <section className="py-12 border-b border-t border-[#584140]/20 bg-[#1e2024]/50 backdrop-blur-sm relative z-20 mt-[-1px]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-2">
              <div className={`font-headline-lg text-3xl sm:text-4xl font-extrabold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="font-mono text-xs text-[#bcc7dd] uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
