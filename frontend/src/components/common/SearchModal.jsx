import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { ContentApi } from '../../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await ContentApi.search(query);
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1a1c20] border border-[#3c475a] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#3c475a] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#ffb3b0]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI products, solutions, services, insights..."
            className="bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg w-full font-sans"
            autoFocus
          />
          {loading && <Loader2 className="w-5 h-5 text-[#4cd6ff] animate-spin" />}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-slate-400 text-sm font-mono">
              Type keywords to search across HamaraShops.ai Marketplace...
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching records found for "{query}".
            </div>
          ) : (
            results.map((item) => (
              <Link
                key={item.id}
                to={item.url || '#'}
                onClick={onClose}
                className="block p-3.5 rounded-xl bg-[#282a2e]/50 hover:bg-[#3c475a]/60 border border-white/5 hover:border-[#ff6b6b]/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white group-hover:text-[#ff6b6b] transition-colors text-base">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#4cd6ff]/10 text-[#4cd6ff] border border-[#4cd6ff]/30">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">{item.snippet}</p>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
