import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Search, Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import SearchModal from './SearchModal';
import AppointmentModal from './AppointmentModal';
import logo from '../../assets/logo.png';

const navLinks = [
  { name: 'About', path: '/about' },
  { name: 'Industries', path: '/industries' },
  { name: 'AI Use Cases', path: '/use-cases' },
  { name: 'AI Architecture', path: '/architecture' },
  { name: 'Business Value', path: '/business-value' },
  { name: 'Contact', path: '/contact' },
];

const megaMenuData = {
  Industries: [
    { name: 'Retail', path: '/industries/retail' },
    { name: 'Financial Services', path: '/industries/financial-services' },
    { name: 'Media & Entertainment', path: '/industries/media-entertainment' },
    { name: 'Healthcare & Life Sciences', path: '/industries/healthcare-life-sciences' },
    { name: 'Manufacturing', path: '/industries/manufacturing' },
  ],
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 30) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setSearchModalOpen(false);
        setAppointmentModalOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleOpenAppointmentModal = () => {
      setAppointmentModalOpen(true);
      setMobileMenuOpen(false);
    };
    window.addEventListener('open-appointment-modal', handleOpenAppointmentModal);
    return () => window.removeEventListener('open-appointment-modal', handleOpenAppointmentModal);
  }, []);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      {/* Outer Floating Sticky Container */}
      <div className="fixed top-2 sm:top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300">
        <motion.header
          initial={false}
          animate={{
            maxWidth: isScrolled ? '1140px' : '1340px',
            paddingTop: isScrolled ? '8px' : '14px',
            paddingBottom: isScrolled ? '8px' : '14px',
            paddingLeft: isScrolled ? '16px' : '24px',
            paddingRight: isScrolled ? '16px' : '24px',
            borderRadius: isScrolled ? '9999px' : '24px',
            backgroundColor: isScrolled ? 'rgba(10, 22, 40, 0.94)' : 'rgba(12, 14, 18, 0.85)',
            borderColor: isScrolled ? 'rgba(255, 107, 107, 0.35)' : 'rgba(60, 71, 90, 0.45)',
            boxShadow: isScrolled
              ? '0 20px 35px -10px rgba(0, 0, 0, 0.7), 0 0 20px 0 rgba(255, 107, 107, 0.12)'
              : '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="w-full backdrop-blur-xl border pointer-events-auto flex items-center justify-between transition-colors relative"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          {/* Logo / Brand */}
          <Link to="/" onClick={handleNavClick} className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <motion.div
              animate={{ scale: isScrolled ? 0.92 : 1 }}
              transition={{ duration: 0.2 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-lg shadow-[#ff6b6b]/30 group-hover:scale-105 transition-transform"
            >
              <img src={logo} alt="HamaraShops.ai logo" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-headline-md font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                HamaraShops<span className="text-[#ff6b6b]">.ai</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-1 hidden xs:block">
                Gen AI Industry Use Cases
              </span>
            </div>
          </Link>

          {/* Desktop Resizable Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#1a1c20]/60 p-1.5 rounded-full border border-[#3c475a]/50 backdrop-blur-md relative">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path !== '/' && location.pathname.startsWith(link.path));
              const hasDropdown = Boolean(megaMenuData[link.name]);

              return (
                <div
                  key={link.path}
                  className="relative group"
                  onMouseEnter={() => hasDropdown && setActiveDropdown(link.name)}
                >
                  <Link
                    to={link.path}
                    onClick={handleNavClick}
                    className={`relative px-4 py-2 rounded-full text-xs xl:text-sm font-medium transition-colors duration-200 z-10 flex items-center gap-1 ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] rounded-full shadow-md shadow-[#ff6b6b]/30 -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>{link.name}</span>
                    {hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180 text-[#ff6b6b]' : 'opacity-60'}`} />
                    )}
                  </Link>

                  {/* Dropdown Panel for Industries */}
                  <AnimatePresence>
                    {activeDropdown === link.name && megaMenuData[link.name] && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-2.5 w-64 bg-[#121620]/95 backdrop-blur-2xl border border-[#3c475a]/60 rounded-2xl p-2.5 shadow-2xl z-50 pointer-events-auto"
                      >
                        <div className="space-y-1">
                          {megaMenuData[link.name].map((subItem, sIdx) => (
                            <Link
                              key={sIdx}
                              to={subItem.path}
                              onClick={handleNavClick}
                              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#ff6b6b]/15 hover:text-white text-slate-300 text-xs font-semibold group/sub transition-colors"
                            >
                              <span>{subItem.name}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b] opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2.5 rounded-full bg-[#1a1c20] border border-[#3c475a] text-slate-300 hover:text-white hover:border-[#ff6b6b]/50 hover:bg-[#282a2e] transition-all cursor-pointer"
              title="Search Gen AI Use Cases"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] text-xs sm:text-sm font-bold tracking-wide hover:shadow-lg hover:shadow-[#ff6b6b]/30 hover:opacity-95 transition-all flex items-center gap-1.5 group cursor-pointer"
              aria-label="Schedule Appointment"
            >
              <span>Schedule Appointment</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu & Search Controls */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 rounded-lg bg-[#1a1c20] border border-[#3c475a] text-slate-300"
              aria-label="Search Use Cases"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#1a1c20] border border-[#3c475a] text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-6 h-6 text-[#ff6b6b]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Animated Mobile Navigation Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
                />

                {/* Mobile Drawer */}
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-[#0a1628]/95 backdrop-blur-2xl border border-[#3c475a] rounded-3xl p-6 shadow-2xl z-50 lg:hidden max-h-[80vh] overflow-y-auto"
                >
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{
                      open: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                      closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                    }}
                    className="flex flex-col gap-2"
                  >
                    {navLinks.map((link) => {
                      const isActive =
                        location.pathname === link.path ||
                        (link.path !== '/' && location.pathname.startsWith(link.path));

                      return (
                        <motion.div
                          key={link.path}
                          variants={{
                            open: { opacity: 1, y: 0 },
                            closed: { opacity: 0, y: -10 },
                          }}
                        >
                          <Link
                            to={link.path}
                            onClick={handleNavClick}
                            className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                              isActive
                                ? 'bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] font-bold shadow-md shadow-[#ff6b6b]/20'
                                : 'text-slate-200 hover:bg-[#1a1c20] hover:text-white'
                            }`}
                          >
                            {link.name}
                          </Link>

                          {/* Mobile Submenu for Industries */}
                          {link.name === 'Industries' && (
                            <div className="pl-4 mt-1 space-y-1">
                              {megaMenuData.Industries.map((sub, sIdx) => (
                                <Link
                                  key={sIdx}
                                  to={sub.path}
                                  onClick={handleNavClick}
                                  className="block px-3 py-2 text-xs text-slate-300 hover:text-white"
                                >
                                  • {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}

                    <motion.div
                      variants={{
                        open: { opacity: 1, y: 0 },
                        closed: { opacity: 0, y: -10 },
                      }}
                      className="pt-4 border-t border-[#3c475a]/60 mt-2 flex flex-col gap-3"
                    >
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setSearchModalOpen(true);
                        }}
                        className="w-full py-3 rounded-xl bg-[#1a1c20] border border-[#3c475a] text-slate-200 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4 text-[#ff6b6b]" />
                        <span>Search Use Cases</span>
                      </button>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setAppointmentModalOpen(true);
                        }}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ff8533] text-[#68000f] text-center font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b6b]/30 cursor-pointer"
                      >
                        <span>Schedule Appointment</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.header>
      </div>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Global Appointment Modal */}
      <AppointmentModal isOpen={appointmentModalOpen} onClose={() => setAppointmentModalOpen(false)} />
    </>
  );
}
