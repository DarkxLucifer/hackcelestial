import React, { useState } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

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
    { label: 'Destinations', target: '#itinerary' },
    { label: 'Travel Packages', target: '#recovery' },
    { label: 'Offers', target: '#simulator' },
    { label: 'Contact', target: '#rights' },
  ];

  const handleBookNow = () => {
    if (activeDisruption && onOpenSaga) {
      onOpenSaga();
    } else {
      scrollTo('#recovery');
    }
  };

  return (
    <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-5xl rounded-full px-5 sm:px-7 py-2 sm:py-2.5 flex items-center justify-between bg-[#0b272c]/75 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-300">
        
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

        {/* Right: Solid White Pill "Book Now" Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBookNow}
            className="px-5 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white text-[#0b272c] font-bold text-xs sm:text-sm hover:bg-slate-100 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-md whitespace-nowrap flex items-center gap-1.5"
          >
            <span>Book Now</span>
            {activeDisruption && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/90 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
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
        </div>
      )}
    </header>
  );
}
