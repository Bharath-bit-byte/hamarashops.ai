import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Scroll to top helper for route changes and page reloads
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Industries from './pages/Industries';
import IndustryDetail from './pages/IndustryDetail';
import UseCases from './pages/UseCases';
import Architecture from './pages/Architecture';
import BusinessValue from './pages/BusinessValue';
import Contact from './pages/Contact';
import OurJourney from './pages/OurJourney';

// Utility / Policy Pages
import ApiDocs from './pages/ApiDocs';
import Integrations from './pages/Integrations';
import EthicsPolicy from './pages/EthicsPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SalesTerms from './pages/SalesTerms';
import NotFound from './pages/NotFound';

import ScrollToTopButton from './components/common/ScrollToTopButton';
import GeminiChatbot from './components/common/GeminiChatbot';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e12] text-[#e2e2e8]">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          <Route path="/industries" element={<Industries />} />
          <Route path="/industries/:slug" element={<IndustryDetail />} />
          
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/business-value" element={<BusinessValue />} />
          
          <Route path="/contact" element={<Contact />} />
          <Route path="/our-journey" element={<OurJourney />} />

          {/* Reference Policy / Integration Pages */}
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/ethics" element={<EthicsPolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/sales-terms" element={<SalesTerms />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
      <GeminiChatbot />
    </div>
  );
}
