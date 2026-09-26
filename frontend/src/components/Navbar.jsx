import React, { useState } from 'react';
import { Menu, X, ShieldAlert, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function Navbar({ activeDisruption, onOpenSaga, onQuickSimulate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    if (id === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'About Us', target: '#hero' },
    { label: 'Destinations', target: '#destinations' },
    { label: 'Travel Packages', target: '#recovery' },
    { label: 'Offers', target: '#services' },
    { label: 'Contact', target: '#footer' },
  ];

  const handleDisruptionSolving = () => {
    if (activeDisruption && onOpenSaga) {
      onOpenSaga();
    } else if (onQuickSimulate) {
      onQuickSimulate();
      const el = document.querySelector('#simulator');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNow = () => {
    scrollTo('#easy-steps');
  };

  return (
    <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-5xl rounded-full px-5 sm:px-7 py-2 sm:py-2.5 flex items-center justify-between bg-[#0b272c]/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.38)] transition-all duration-300">
        
        {/* Left: Uploaded Voyage Logo (Clean, no sticker/badge) */}
        <a 
          href="#hero" 
          onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
          className="flex items-center group py-0.5"
          aria-label="Voyage Home"
        >
          <img 
            src="/voyage_logo_crop.png" 
            alt="Voyage" 
            className="h-6 sm:h-7 md:h-8 w-auto object-contain brightness-105 transition-transform duration-200 group-hover:scale-[1.02]" 
          />
        </a>

        {/* Center: Clean Text Navigation Links (Matching Reference Image) */}
        <div className="hidden md:flex items-center gap-7 lg:gap-9 text-[13px] lg:text-sm font-medium text-white/90">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.target}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.target);
              }}
              className="hover:text-white transition-colors duration-200 tracking-wide hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Action Group: Disruption Solving (MAIN) + Book Now (SECONDARY) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* SECONDARY ACTION: Book Now (Sleek Frosted Ghost Button) */}
          <button
            onClick={handleBookNow}
            className="hidden sm:inline-flex px-4 py-1.5 sm:py-2 rounded-full border border-white/35 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm active:scale-95 transition-all duration-200 whitespace-nowrap"
            title="Book Itinerary & Ghost Holds"
          >
            Book Now
          </button>

          {/* MAIN PRIMARY ACTION: Disruption Solver (Prominent Solid Pill Button) */}
          <button
            onClick={handleDisruptionSolving}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg active:scale-95 whitespace-nowrap flex items-center gap-2 ring-2 ring-white/30 ${
              activeDisruption 
                ? 'bg-gradient-to-r from-[#DF6951] to-[#FF7D68] text-white shadow-[#DF6951]/50 animate-pulse'
                : 'bg-white text-[#0b272c] hover:bg-slate-100 hover:shadow-xl'
            }`}
            title="Launch Spatio-Temporal Disruption Recovery Engine"
          >
            {activeDisruption ? (
              <>
                <AlertTriangle className="w-4 h-4 text-white" />
                <span>Resolve Disruption</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-[#DF6951]" />
                <span>Disruption Solver</span>
              </>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/90 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors ml-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-16 left-4 right-4 rounded-2xl bg-[#0b272c]/95 backdrop-blur-2xl border border-white/20 p-5 shadow-2xl flex flex-col gap-3 md:hidden animate-in fade-in slide-in-from-top-3 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.target}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.target);
              }}
              className="text-white/90 hover:text-white font-medium text-sm py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/15 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDisruptionSolving();
              }}
              className="w-full py-2.5 rounded-full bg-white text-[#0b272c] font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <ShieldAlert className="w-4 h-4 text-[#DF6951]" />
              <span>{activeDisruption ? "Resolve Disruption" : "Disruption Solver"}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleBookNow();
              }}
              className="w-full py-2 rounded-full border border-white/30 text-white font-medium text-xs text-center"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
