import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PeeledSheetPull({ children, activeDisruption, onSimulateAlpine, t }) {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 900
  );

  // --------------------------------------------------------------------------
  // VELVETY SMOOTH 60/120 FPS LERP SCROLL ENGINE
  // Eliminates notch-scroll stutter and provides continuous, cinematic motion.
  // --------------------------------------------------------------------------
  useEffect(() => {
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let animationFrameId;

    const onScroll = () => {
      targetY = window.scrollY;
    };

    const onResize = () => {
      setWindowHeight(window.innerHeight);
    };

    const loop = () => {
      const diff = targetY - currentY;
      if (Math.abs(diff) > 0.05) {
        currentY += diff * 0.16;
        setScrollY(currentY);
      } else if (currentY !== targetY) {
        currentY = targetY;
        setScrollY(currentY);
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --------------------------------------------------------------------------
  // DIRECT ELEVATOR-HOIST CHOREOGRAPHY:
  // - The content sheet is positioned JUST BELOW the airplane at all times.
  // - As the airplane ascends from the bottom to the top, the sheet goes up
  //   directly with it in perfect 1:1 tandem!
  // - No waiting until the middle: as soon as the plane climbs, the sheet climbs right behind it.
  // - The main island background NEVER disappears until the sheet covers full screen.
  // --------------------------------------------------------------------------

  const TOTAL_INTRO_SCROLL = 1400;
  const progress = Math.min(1.0, Math.max(0, scrollY / TOTAL_INTRO_SCROLL));

  // 1. Airplane vertical position:
  // Starts at bottom-middle (88%), climbs smoothly to center (42%) and exits top (-12%)
  const planeTopPercent = 88 - progress * 100;
  const planeScale = 0.96 + Math.sin(progress * Math.PI) * 0.09;
  const planeOpacity = progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.15) : 1.0;

  // 2. Content sheet vertical position:
  // Tucked JUST BELOW the airplane's tail (planeTop + 12vh):
  // At scroll 0 (progress 0): sheetTop = 88 + 12 = 100vh (just below bottom edge)
  // At middle (progress 0.46): plane is at 42%, sheetTop is at 54vh (overlapping island!)
  // At scroll 1400 (progress 1.0): sheetTop = -12 + 12 = 0vh (covers FULL SCREEN!)
  const sheetTopVh = Math.max(0, planeTopPercent + 12);

  // Exact vertical pixel translation for continuous, jump-free 60/120fps motion
  let sheetTranslateY = 0;
  if (scrollY <= TOTAL_INTRO_SCROLL) {
    const naturalViewportTop = TOTAL_INTRO_SCROLL - scrollY;
    const targetViewportTop = (sheetTopVh / 100) * windowHeight;
    sheetTranslateY = targetViewportTop - naturalViewportTop;
  } else {
    sheetTranslateY = 0;
  }

  const entryRatio = Math.min(1.0, progress * 2.0);

  return (
    <div className="relative w-full overflow-x-hidden bg-[#091f2c]">
      
      {/* ========================================================================= */}
      {/* 1. FIXED FULLSCREEN ISLAND BACKGROUND (z-0)                               */}
      {/* NEVER DISAPPEARS until content covers the full screen!                    */}
      {/* Pristine & clean: all prompt badges/text removed per user request.        */}
      {/* ========================================================================= */}
      <div 
        className="fixed inset-0 w-full h-screen z-0 pointer-events-none overflow-hidden bg-[#091f2c]"
        style={{
          transform: `scale(${1.0 + Math.min(scrollY / 2000, 1.0) * 0.05})`,
          willChange: 'transform'
        }}
      >
        {/* Fullscreen Island Background Image */}
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('/island.jpg')` }}
        >
          {/* Subtle natural atmospheric vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
        </div>

        {/* Atmospheric Cloud Framing on Left and Right */}
        <div 
          className="absolute -left-20 top-1/4 w-[380px] h-[520px] pointer-events-none z-10 opacity-80 mix-blend-screen filter blur-[2px]"
          style={{ transform: `translate3d(0, ${Math.min(scrollY * 0.15, 80)}px, 0)` }}
        >
          <div className="w-full h-full bg-gradient-to-r from-white via-white/80 to-transparent rounded-full filter blur-[40px]" />
        </div>
        <div 
          className="absolute -right-20 top-1/3 w-[420px] h-[580px] pointer-events-none z-10 opacity-80 mix-blend-screen filter blur-[2px]"
          style={{ transform: `translate3d(0, ${Math.min(scrollY * 0.12, 70)}px, 0)` }}
        >
          <div className="w-full h-full bg-gradient-to-l from-white via-white/80 to-transparent rounded-full filter blur-[45px]" />
        </div>
      </div>


      {/* ========================================================================= */}
      {/* 2. CENTER HERO TAGLINE (z-10)                                             */}
      {/* Matching font in image media_1790415846481.jpg & WHITE UNDERLINE LINE       */}
      {/* ========================================================================= */}
      {progress < 0.65 && (
        <div 
          className="fixed inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none"
          style={{
            opacity: Math.max(0, 1 - progress * 2.2),
            transform: `translate3d(0, ${-progress * 130}px, 0) scale(${1 - progress * 0.06})`,
            willChange: 'opacity, transform'
          }}
        >
          {/* Top Pill matching media_1790415846481.jpg */}
          <div className="mb-4 sm:mb-6 px-5 py-1.5 rounded-full bg-white/95 text-[#14183E] font-googleSans font-semibold text-xs sm:text-sm tracking-wide shadow-xl border border-white/50">
            {t?.worryLessPill || "Travel More. Worry Less"}
          </div>

          <h1 className="font-googleSans font-bold text-3xl sm:text-5xl md:text-6xl lg:text-[72px] text-white leading-[1.15] tracking-tight max-w-5xl drop-shadow-[0_4px_35px_rgba(0,0,0,0.85)] px-4">
            {t?.landingTagline1 || "When Journeys Disrupt,"} <br className="hidden sm:inline" />
            <span className="relative inline-block text-white">
              {t?.landingTagline2 || "Voyage Finds a Way Forward."}
              {/* WHITE CURVED LINE as explicitly requested by user */}
              <svg className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-5 text-white opacity-95 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" viewBox="0 0 350 20" fill="none" preserveAspectRatio="none">
                <path d="M3 15C80 3 240 3 347 13" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </div>
      )}


      {/* ========================================================================= */}
      {/* 3. THE AIRPLANE / ELEVATOR (z-30, ON TOP OF BOTH ISLAND AND SHEET)        */}
      {/* As this elevator goes up, the content sheet goes up directly below it!    */}
      {/* ========================================================================= */}
      {planeOpacity > 0 && (
        <div className="fixed inset-0 w-full h-screen pointer-events-none z-30 overflow-hidden">
          <div 
            className="absolute left-1/2 pointer-events-none flex flex-col items-center"
            style={{
              top: `${planeTopPercent}%`,
              transform: `translate3d(-50%, -50%, 0) scale(${planeScale})`,
              opacity: planeOpacity,
              willChange: 'top, transform, opacity'
            }}
          >
            {/* Jet Engine Contrails */}
            {entryRatio > 0.4 && (
              <>
                <div 
                  className="absolute -top-32 left-[28%] w-2.5 h-32 bg-gradient-to-t from-white/95 via-white/40 to-transparent blur-[1.5px]"
                  style={{ opacity: Math.min(1.0, (entryRatio - 0.4) * 2.0) }}
                />
                <div 
                  className="absolute -top-32 right-[28%] w-2.5 h-32 bg-gradient-to-t from-white/95 via-white/40 to-transparent blur-[1.5px]"
                  style={{ opacity: Math.min(1.0, (entryRatio - 0.4) * 2.0) }}
                />
              </>
            )}

            {/* High-Resolution Airliner - Clean, no black shadow/shade */}
            <img 
              src="/plane.png" 
              alt="Voyage Airplane"
              className="w-[280px] sm:w-[340px] md:w-[410px] lg:w-[460px] h-auto select-none"
            />

            {/* Wingtip Position Strobe Lights */}
            {entryRatio > 0.3 && (
              <>
                <div className="absolute left-[3%] top-[48%] w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <div className="absolute right-[3%] top-[48%] w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </>
            )}
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* 3. DEDICATED INTRO SCROLL TRACK SPACER (1400px)                           */}
      {/* ========================================================================= */}
      <div 
        style={{ height: `${TOTAL_INTRO_SCROLL}px` }} 
        className="w-full pointer-events-none" 
        aria-hidden="true" 
      />


      {/* ========================================================================= */}
      {/* 4. THE OVERLAPPING CONTENT SHEET / CANVAS (z-20)                          */}
      {/* Positioned JUST BELOW the airplane/elevator; as the elevator goes up,     */}
      {/* this sheet ascends in smooth lockstep until content covers full screen!    */}
      {/* ========================================================================= */}
      <div 
        className="relative z-20 w-full"
        style={{
          transform: `translate3d(0, ${sheetTranslateY}px, 0)`,
          willChange: 'transform'
        }}
      >
        {/* The 3D Curved Peeling Lip SVG at the top of the sheet */}
        <div className="relative w-full overflow-hidden -mb-1 pointer-events-none">
          <svg 
            viewBox="0 0 1440 220" 
            className="w-full h-28 sm:h-36 md:h-44 lg:h-52 text-white block fill-current drop-shadow-[0_-20px_35px_rgba(0,0,0,0.35)]" 
            preserveAspectRatio="none"
          >
            {/* Defs for realistic 3D rolled lip shading */}
            <defs>
              <linearGradient id="sheetLipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="15%" stopColor="#F5F7FA" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
              <linearGradient id="edgeBevel" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="50%" stopColor="rgba(200,210,225,0.3)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {/* The signature double-arched draped curve matching reference images */}
            <path 
              d="M 0,160 
                 C 220,160 480,45 720,10 
                 C 960,45 1220,160 1440,160 
                 L 1440,220 
                 L 0,220 Z" 
              fill="url(#sheetLipGradient)"
            />

            {/* 3D Rolled Rim highlight stroke */}
            <path 
              d="M 0,160 
                 C 220,160 480,45 720,10 
                 C 960,45 1220,160 1440,160" 
              fill="none" 
              stroke="url(#edgeBevel)" 
              strokeWidth="5"
            />
          </svg>
        </div>

        {/* The White Content Body pulled into view */}
        <div className="w-full bg-white text-voyare-navy pt-6 pb-24 shadow-2xl relative">
          
          {/* Section 01: Plan Freely exactly as shown in photo media_1790417004982.png */}
          <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-6 pb-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: 01 —— PLAN YOUR JOURNEY • Plan Freely */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-2.5 text-xs font-mono font-bold tracking-widest text-[#5E6282] uppercase">
                  <span>01</span>
                  <div className="w-8 h-px bg-slate-300" />
                  <span>PLAN YOUR JOURNEY</span>
                </div>

                <h2 className="font-volkhov text-4xl sm:text-5xl lg:text-6xl font-bold text-[#181E4B] tracking-tight">
                  Plan Freely
                </h2>

                <p className="font-poppins text-base sm:text-lg text-[#5E6282] max-w-md font-normal leading-relaxed">
                  Create your dream itinerary with complete confidence. YATAR’s resilience graph monitors every flight, rail connection, and hotel check-in 24/7.
                </p>

                <div className="pt-2">
                  <button 
                    onClick={onSimulateAlpine}
                    className="px-6 py-3 rounded-full border border-slate-300 hover:border-[#181E4B] text-[#181E4B] font-semibold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-xs group cursor-pointer"
                  >
                    <span>Explore Resilience Plans</span>
                    <ArrowRight className="w-4 h-4 text-[#DF6951] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right Column: Organic Pebble Destination Card matching reference images */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end">
                <div className="relative group max-w-md w-full">
                  {/* Organic pebble shape image container with smooth asymmetrical border radius */}
                  <div className="overflow-hidden rounded-[40px_18px_60px_24px] shadow-2xl border-4 border-white/80 aspect-[16/10] bg-slate-100">
                    <img 
                      src="/island.jpg" 
                      alt="Destination Preview" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F1A501]" />
                    <span className="text-xs font-bold text-[#181E4B] font-poppins">Autonomous Immunity Active</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 5. THE FULL PLATFORM CONTENT (Embedded seamlessly within the pulled sheet!) */}
          <div className="w-full border-t border-slate-100 pt-8">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}
