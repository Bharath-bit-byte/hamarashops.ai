import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Linkedin, Twitter, Facebook, Instagram, Mail } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-[#08090c] border-t border-[#3c475a]/50 text-slate-300 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#3c475a]/40">
          
          {/* Brand Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-[#ff6b6b]/20 group-hover:scale-105 transition-transform overflow-hidden">
                <img src={logoImg} alt="HamaraShops.ai Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-headline-md font-extrabold text-2xl text-white">
                HamaraShops<span className="text-[#ff6b6b]">.ai</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Destination Digital — Empowering modern enterprises with sophisticated, high-performance artificial intelligence solutions designed for scale.
            </p>
            
            <div className="flex items-center gap-2 text-xs font-mono text-[#4cd6ff] bg-[#1a1c20] px-3 py-1.5 rounded-full border border-[#3c475a] w-fit">
              <ShieldCheck className="w-4 h-4 text-[#ff6b6b]" />
              <span>Generative AI Industry Use Cases • PDF Source of Truth</span>
            </div>

            {/* Social & Contact Action Buttons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <a
                href="https://www.linkedin.com/company/hamarashops-com/posts/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-[#1a1c20] border border-[#3c475a]/70 hover:border-[#ff6b6b] text-white hover:text-[#ff6b6b] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-[#ff6b6b]/20"
              >
                <Linkedin className="w-4.5 h-4.5 stroke-[1.8]" />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=dheerendar@hamarashops.ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Gmail Email"
                title="Send Email to dheerendar@hamarashops.ai"
                className="w-10 h-10 rounded-full bg-[#1a1c20] border border-[#3c475a]/70 hover:border-[#ff6b6b] text-white hover:text-[#ff6b6b] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-[#ff6b6b]/20"
              >
                <Mail className="w-4.5 h-4.5 stroke-[1.8]" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-10 h-10 rounded-full bg-[#1a1c20] border border-[#3c475a]/70 hover:border-[#ff6b6b] text-white hover:text-[#ff6b6b] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-[#ff6b6b]/20"
              >
                <Twitter className="w-4.5 h-4.5 stroke-[1.8]" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-[#1a1c20] border border-[#3c475a]/70 hover:border-[#ff6b6b] text-white hover:text-[#ff6b6b] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-[#ff6b6b]/20"
              >
                <Facebook className="w-4.5 h-4.5 stroke-[1.8]" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-[#1a1c20] border border-[#3c475a]/70 hover:border-[#ff6b6b] text-white hover:text-[#ff6b6b] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-[#ff6b6b]/20"
              >
                <Instagram className="w-4.5 h-4.5 stroke-[1.8]" />
              </a>
            </div>
          </div>

          {/* Industry Verticals */}
          <div>
            <h4 className="font-bold text-white text-base mb-4 tracking-wide font-headline-md">Target Industries</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/industries/retail" className="hover:text-[#ff6b6b] transition-colors">Retail</Link></li>
              <li><Link to="/industries/financial-services" className="hover:text-[#ff6b6b] transition-colors">Financial Services</Link></li>
              <li><Link to="/industries/media-entertainment" className="hover:text-[#ff6b6b] transition-colors">Media & Entertainment</Link></li>
              <li><Link to="/industries/healthcare-life-sciences" className="hover:text-[#ff6b6b] transition-colors">Healthcare & Life Sciences</Link></li>
              <li><Link to="/industries/manufacturing" className="hover:text-[#ff6b6b] transition-colors">Manufacturing</Link></li>
            </ul>
          </div>

          {/* Navigation Hub */}
          <div>
            <h4 className="font-bold text-white text-base mb-4 tracking-wide font-headline">Enterprise Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-[#ff6b6b] transition-colors">About AI Excellence</Link></li>
              <li><Link to="/use-cases" className="hover:text-[#ff6b6b] transition-colors">AI Use Cases</Link></li>
              <li><Link to="/architecture" className="hover:text-[#ff6b6b] transition-colors">AI Solution Architecture</Link></li>
              <li><Link to="/business-value" className="hover:text-[#ff6b6b] transition-colors">Business Value</Link></li>
              <li><Link to="/contact" className="hover:text-[#ff6b6b] transition-colors">Contact & Locations</Link></li>
              <li><Link to="/ethics" className="hover:text-[#ff6b6b] transition-colors">AI Ethics Policy</Link></li>
            </ul>
          </div>

          {/* Contact Action */}
          <div>
            <h4 className="font-bold text-white text-base mb-4 tracking-wide font-headline">Get Started</h4>
            <p className="text-xs text-slate-400 mb-4">Transform your enterprise workflows with tailored cognitive solutions.</p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] text-sm font-bold hover:shadow-lg hover:shadow-[#ff6b6b]/25 transition-all"
            >
              <span>Schedule Strategy Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} HamaraShops.ai. All rights reserved. Enterprise AI Platform.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/sales-terms" className="hover:text-white transition-colors">Sales Terms</Link>
            <Link to="/ethics" className="hover:text-white transition-colors">AI Ethics</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
