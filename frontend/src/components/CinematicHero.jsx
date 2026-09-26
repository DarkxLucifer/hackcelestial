import React, { useState, useEffect } from 'react';
import { ChevronDown, Plane, ShieldCheck, Zap, Activity, Compass, Wind } from 'lucide-react';

export default function CinematicHero({ onSimulateAlpine, activeDisruption }) {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothY, setSmoothY] = useState(0);

  // Smooth lerp scroll position for cinematic inertia
  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      setScrollY(window.scrollY);
      const winH = window.innerHeight;
      const progress = Math.min(1.5, Math.max(0, window.scrollY / (winH * 1.2)));
      setScrollProgress(progress);
    };

    const updateSmooth = () => {
      setSmoothY((prev) => prev + (window.scrollY - prev) * 0.12);
      animationFrameId = requestAnimationFrame(updateSmooth);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(updateSmooth);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Title fade and scale out as user scrolls
  const titleOpacity = Math.max(0, 1 - scrollProgress * 1.8);
  const titleTranslateY = -scrollProgress * 90;

  // Island Parallax scale & shift
  const islandScale = 1.0 + scrollProgress * 0.15;
  const islandTranslateY = scrollProgress * 40;

  // Airplane movement:
  // Starts centered over the island exactly like in reference image 3 (top-down view).
  // As user scrolls, the airplane moves smoothly downward/forward, pulling the content behind it.
  const planeTranslateY = scrollProgress * 320;
  const planeScale = 1.0 - scrollProgress * 0.08;
  const planeBanking = Math.sin(scrollProgress * Math.PI) * 4; // subtle tilt

  // Pulling tether opacity and height
  const tetherHeight = Math.max(0, Math.min(220, scrollProgress * 260));
  const tetherOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.1) * 2));

  return (
    <div id="hero" className="relative w-full h-[140vh] overflow-hidden select-none">
      
      {/* Sticky Fullscreen Flight Canvas */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Fullscreen Island Background with 3D Parallax */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-75 ease-out"
          style={{
            backgroundImage: `url('/island.jpg')`,
            transform: `scale(${islandScale}) translateY(${islandTranslateY}px)`,
            willChange: 'transform'
          }}
        >
          {/* Subtle cinematic gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />
        </div>

        {/* Minimal Initial Hero Typography: YATAR */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-between py-16 px-6 pointer-events-none z-20 transition-all duration-75"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
            willChange: 'transform, opacity'
          }}
        >
          {/* Top Brand Bar */}
          <div className="flex items-center gap-2 tracking-[0.3em] text-white/90 text-xs uppercase font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-voyare-coral animate-ping" />
            <span>Autonomous Travel Resilience</span>
          </div>

          {/* Majestic Center Title: Y A T A R */}
          <div className="text-center flex flex-col items-center">
            <h1 className="font-poppins text-7xl sm:text-8xl md:text-9xl lg:text-[140px] font-black text-white tracking-[0.25em] drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] leading-none select-none">
              YATAR
            </h1>
            <p className="mt-4 font-poppins text-sm sm:text-base md:text-lg font-light text-white/90 tracking-[0.35em] uppercase drop-shadow-md">
              Intelligent Disruption Recovery
            </p>
          </div>

          {/* Minimalist Scroll Prompt Indicator */}
          <div className="flex flex-col items-center gap-2 text-white/80 animate-bounce">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold text-white/70">
              Scroll To Fly
            </span>
            <ChevronDown className="w-5 h-5 text-white/90" />
          </div>
        </div>

        {/* The Airplane: Centered directly over the island in top-down view (Reference 3) */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${planeTranslateY}px) scale(${planeScale}) rotate(${planeBanking}deg)`,
            willChange: 'transform'
          }}
        >
          <div className="relative flex flex-col items-center">
            
            {/* Realistic Shadow Cast onto the Island Canopy Below */}
            <div 
              className="absolute top-12 w-64 md:w-80 h-64 md:h-80 rounded-full bg-black/45 blur-2xl -z-10 transition-transform duration-100"
              style={{
                transform: `scale(${1 + scrollProgress * 0.4}) translateY(${15 + scrollProgress * 25}px)`
              }}
            />

            {/* Jet Engine Contrail Vapor Trails extending backwards */}
            <div 
              className="absolute -top-36 left-[30%] w-1.5 h-36 bg-gradient-to-t from-white/80 via-white/30 to-transparent blur-[1px] opacity-70 transition-opacity"
              style={{ opacity: Math.max(0.3, scrollProgress * 1.2) }}
            />
            <div 
              className="absolute -top-36 right-[30%] w-1.5 h-36 bg-gradient-to-t from-white/80 via-white/30 to-transparent blur-[1px] opacity-70 transition-opacity"
              style={{ opacity: Math.max(0.3, scrollProgress * 1.2) }}
            />

            {/* High-Resolution Airliner Image exactly matched to 3rd Reference Composition */}
            <img 
              src="/plane.png" 
              alt="YATAR Flight"
              className="w-72 sm:w-80 md:w-96 lg:w-[420px] h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)] select-none"
            />

            {/* Wingtip Position Strobe Lights */}
            <div className="absolute left-[3%] top-[48%] w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <div className="absolute right-[3%] top-[48%] w-2 h-2 rounded-full bg-emerald-400 animate-ping" />

            {/* Dynamic Physical Pulling Tethers extending downwards to pull content */}
            <div 
              className="absolute top-[85%] w-full flex items-center justify-center transition-all duration-75"
              style={{
                height: `${tetherHeight}px`,
                opacity: tetherOpacity
              }}
            >
              {/* Twin glowing guide cables */}
              <div className="absolute left-[35%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-voyare-coral via-voyare-gold to-white/80 opacity-80" />
              <div className="absolute right-[35%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-voyare-coral via-voyare-gold to-white/80 opacity-80" />
              
              {/* Central magnetic pulling beam */}
              <div className="w-1 bg-gradient-to-b from-cyan-400 via-sky-300 to-white/90 h-full opacity-90 shadow-[0_0_15px_rgba(56,189,248,0.8)]" />

              {/* Pulling Beacon Node */}
              <div className="absolute bottom-0 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-cyan-400/60 text-cyan-300 text-[10px] font-mono tracking-wider uppercase font-bold shadow-lg flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Pulling: Resilience Itinerary</span>
              </div>
            </div>

          </div>
        </div>

        {/* Minimal Cockpit HUD Telemetry on Bottom Left */}
        <div 
          className="absolute bottom-8 left-8 z-40 hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 text-white shadow-2xl transition-opacity duration-300"
          style={{ opacity: Math.min(1, scrollProgress * 2) }}
        >
          <div className="w-7 h-7 rounded-lg bg-voyare-coral/20 flex items-center justify-center text-voyare-coral">
            <Plane className="w-3.5 h-3.5 transform -rotate-45" />
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/50 block">Altitude</span>
              <span className="font-bold text-white">FL{Math.round(350 - scrollProgress * 120)}</span>
            </div>
            <div className="w-px h-5 bg-white/10" />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/50 block">Airspeed</span>
              <span className="font-bold text-emerald-400">{Math.round(460 - scrollProgress * 60)} KTS</span>
            </div>
            <div className="w-px h-5 bg-white/10" />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/50 block">Tether</span>
              <span className="font-bold text-voyare-gold">PULL ACTIVE</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
