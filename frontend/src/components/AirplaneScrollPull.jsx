import React, { useState, useEffect, useRef } from 'react';
import { Plane, Navigation, Wind, Activity, Gauge, MapPin } from 'lucide-react';

export default function AirplaneScrollPull() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("Takeoff & Radar");
  const [altitude, setAltitude] = useState(34000);
  const [speed, setSpeed] = useState(465);
  const [tilt, setTilt] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
      setScrollProgress(progress);

      // Calculate dynamic altitude and speed based on journey progress
      if (progress < 0.2) {
        setAltitude(Math.round(10000 + progress * 120000));
        setSpeed(Math.round(280 + progress * 900));
        setCurrentSection("Cruise & Telemetry Radar");
      } else if (progress < 0.45) {
        setAltitude(34000);
        setSpeed(465);
        setCurrentSection("Itinerary Knowledge Graph (TDAG)");
      } else if (progress < 0.65) {
        setAltitude(26000);
        setSpeed(410);
        setCurrentSection("Turbulence & Disruption Blast Radius");
      } else if (progress < 0.85) {
        setAltitude(14000);
        setSpeed(320);
        setCurrentSection("Recovery Optimization & Ghost Holds");
      } else {
        setAltitude(Math.max(1200, Math.round(14000 - (progress - 0.85) * 80000)));
        setSpeed(Math.round(320 - (progress - 0.85) * 1000));
        setCurrentSection("Final Approach & Safe Landing");
      }

      // Aircraft banking tilt during scroll motion
      const deltaY = window.scrollY - lastScrollY;
      const calculatedTilt = Math.max(-18, Math.min(18, deltaY * 0.15));
      setTilt(calculatedTilt);
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only appear after user has scrolled past initial hero screen
  const isPastHero = scrollProgress > 0.18;

  const flyTo = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Vertical position on screen for the fixed flight corridor (moves down 12% to 84% of viewport height)
  const topPercent = 12 + scrollProgress * 70;
  
  // Subtle lateral drift mimicking genuine aerial navigation across waypoints
  const lateralShift = Math.sin(scrollProgress * Math.PI * 3) * 32;

  if (!isPastHero) return null;

  return (
    <>
      {/* Flight Path Navigation Spine (Subtle illuminated track along the right edge) */}
      <div className="fixed right-6 top-28 bottom-28 w-1 bg-gradient-to-b from-voyare-coral/40 via-voyare-gold/40 to-emerald-400/40 rounded-full z-30 hidden xl:block shadow-sm">
        {/* Scroll tracker bead */}
        <div 
          className="absolute w-3.5 h-3.5 -left-1.5 rounded-full bg-voyare-coral border-2 border-white shadow-lg transition-transform duration-75"
          style={{ top: `${scrollProgress * 100}%` }}
        />
        
        {/* Waypoint Markers */}
        <button 
          onClick={() => flyTo('#hero')} 
          title="Takeoff"
          className="absolute -left-3 top-0 w-7 h-7 rounded-full bg-white/90 shadow border border-slate-200 flex items-center justify-center text-[10px] font-bold text-voyare-darkNavy hover:scale-125 transition-transform"
        >
          1
        </button>
        <button 
          onClick={() => flyTo('#itinerary')} 
          title="Itinerary TDAG"
          className="absolute -left-3 top-[25%] w-7 h-7 rounded-full bg-white/90 shadow border border-slate-200 flex items-center justify-center text-[10px] font-bold text-voyare-darkNavy hover:scale-125 transition-transform"
        >
          2
        </button>
        <button 
          onClick={() => flyTo('#simulator')} 
          title="Disruption Radar"
          className="absolute -left-3 top-[50%] w-7 h-7 rounded-full bg-white/90 shadow border border-slate-200 flex items-center justify-center text-[10px] font-bold text-voyare-darkNavy hover:scale-125 transition-transform"
        >
          3
        </button>
        <button 
          onClick={() => flyTo('#recovery')} 
          title="Recovery Plans"
          className="absolute -left-3 top-[75%] w-7 h-7 rounded-full bg-white/90 shadow border border-slate-200 flex items-center justify-center text-[10px] font-bold text-voyare-darkNavy hover:scale-125 transition-transform"
        >
          4
        </button>
        <button 
          onClick={() => flyTo('#footer')} 
          title="Touchdown"
          className="absolute -left-3 top-[100%] w-7 h-7 rounded-full bg-white/90 shadow border border-slate-200 flex items-center justify-center text-[10px] font-bold text-voyare-darkNavy hover:scale-125 transition-transform"
        >
          5
        </button>
      </div>

      {/* Floating Aeroplane Pull Container */}
      <div 
        className="fixed z-40 pointer-events-none transition-all duration-150 ease-out hidden lg:block"
        style={{
          top: `${topPercent}%`,
          right: `calc(3rem + ${lateralShift}px)`,
          transform: `translate(0, -50%) rotate(${tilt}deg)`
        }}
      >
        {/* Pulling Cable / Flight Vector Tether reaching downwards to pull the section */}
        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-0.5 h-32 bg-gradient-to-b from-voyare-coral via-voyare-gold/80 to-transparent opacity-85">
          {/* Animated pulling pulse ring */}
          <div className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full border border-voyare-coral/80 animate-ping" />
        </div>

        {/* Engine Contrail Vapor Trails (Behind the aircraft) */}
        <div className="absolute -top-24 left-[28%] w-1.5 h-24 bg-gradient-to-t from-white/90 via-sky-200/50 to-transparent blur-[1px] opacity-75 animate-pulse" />
        <div className="absolute -top-24 right-[28%] w-1.5 h-24 bg-gradient-to-t from-white/90 via-sky-200/50 to-transparent blur-[1px] opacity-75 animate-pulse" />

        {/* High Resolution Commercial Aircraft Image from media_1790403853144.png */}
        <div className="relative group pointer-events-auto cursor-pointer" onClick={() => flyTo('#recovery')}>
          <img 
            src="/plane.png" 
            alt="Voyare Resilience Flight"
            className="w-28 md:w-36 h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-110"
          />

          {/* Wingtip Navigation Lights */}
          <div className="absolute left-[3%] top-[45%] w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <div className="absolute right-[3%] top-[45%] w-2 h-2 rounded-full bg-emerald-400 animate-ping" />

          {/* Jet Thruster Ambient Glow */}
          <div className="absolute top-[28%] left-[26%] w-4 h-4 bg-orange-500/40 rounded-full blur-md" />
          <div className="absolute top-[28%] right-[26%] w-4 h-4 bg-orange-500/40 rounded-full blur-md" />

          {/* Pulling Banner / Tether Tag */}
          <div className="absolute -bottom-8 -left-12 -right-12 text-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#14183E]/90 text-white shadow-lg backdrop-blur-sm border border-white/20 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-voyare-coral animate-pulse" />
              Pulling: {currentSection}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Cockpit Telemetry HUD (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#080809]/85 backdrop-blur-xl border border-white/15 text-white shadow-2xl">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-voyare-coral to-voyare-gold flex items-center justify-center">
          <Plane className="w-4 h-4 text-white transform -rotate-45" />
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-white/50">Flight Status</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              PULL AUTOPILOT
            </span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-white/50">Altitude</span>
            <span className="font-bold text-white">FL{Math.round(altitude / 100)}</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-white/50">Speed</span>
            <span className="font-bold text-white">{speed} KTS</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="hidden xl:flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-white/50">Waypoints</span>
            <span className="font-bold text-voyare-gold truncate max-w-[130px]">{currentSection}</span>
          </div>
        </div>
      </div>
    </>
  );
}
