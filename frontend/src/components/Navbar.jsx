import React, { useState, useEffect } from 'react';
import { Plane, Compass, ShieldAlert, Sparkles, Activity, FileCheck2, ArrowRight } from 'lucide-react';

export default function Navbar({ activeDisruption, onOpenSaga, onQuickSimulate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Navbar only becomes visible / active once the flight entry finishes and content begins pulling
      setScrolled(window.scrollY > 850);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-5 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-700 pointer-events-none ${
        scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
      }`}
    >
      <nav className="pointer-events-auto w-full max-w-5xl rounded-full px-6 py-2.5 flex items-center justify-between voyare-pill-nav bg-[#0c1f24]/85 backdrop-blur-xl border border-white/20 shadow-2xl">
        
        {/* Brand Logo - YATAR */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-voyare-coral via-[#FF8A65] to-voyare-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Plane className="w-4 h-4 text-white transform -rotate-45" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-[0.2em] text-white font-poppins">YATAR</span>
            <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15 hidden sm:inline-block">
              Resilience
            </span>
          </div>
        </a>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-white/80">
          <a href="#itinerary" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-voyare-gold" />
            <span>Itinerary Graph</span>
          </a>
          <a href="#simulator" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Radar Simulator</span>
          </a>
          <a href="#blast-radius" className="hover:text-white transition-colors flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>CPM Ripple</span>
          </a>
          <a href="#recovery" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-voyare-coral" />
            <span>Recovery Plans</span>
          </a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {activeDisruption ? (
            <button
              onClick={onOpenSaga}
              className="px-4 py-1.5 rounded-full bg-voyare-coral text-white font-bold text-xs shadow-md hover:bg-[#c5533c] transition-all flex items-center gap-1.5"
            >
              <span>1-Click Recover</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onQuickSimulate}
              className="px-4 py-1.5 rounded-full bg-white text-[#0c1f24] font-bold text-xs hover:bg-slate-100 transition-all flex items-center gap-1.5"
            >
              <span>Simulate Breach</span>
              <ArrowRight className="w-3.5 h-3.5 text-voyare-coral" />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
