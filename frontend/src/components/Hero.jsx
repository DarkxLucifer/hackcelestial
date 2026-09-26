import React, { useState } from 'react';
import { Play, ArrowRight, Radio, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero({ onSimulateAlpine, onOpenSaga, itinerary, activeDisruption }) {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section 
      id="hero" 
      className="relative min-h-[90vh] pt-12 sm:pt-20 lg:pt-24 pb-20 flex flex-col justify-center overflow-hidden bg-white"
    >
      {/* ========================================================================= */}
      {/* Background Decore SVG from Figma (Yellow blob right, purple blur left)    */}
      {/* ========================================================================= */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden -z-0">
        {/* Soft purple ambient blur on the top-left */}
        <div 
          className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full filter blur-[85px] pointer-events-none opacity-40"
          style={{ backgroundColor: '#D5AEE4' }}
        />
        {/* Warm cream/yellow organic decore on top-right */}
        <div 
          className="absolute top-0 right-0 w-[550px] lg:w-[720px] h-[550px] lg:h-[680px] rounded-bl-[160px] filter blur-[70px] pointer-events-none opacity-60"
          style={{ backgroundColor: '#FFF1DA' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ===================================================================== */}
          {/* Left Column: Tagline, Volkhov Headline with Decore, Subtitle, & CTAs   */}
          {/* Matches exact typography and font structure from reference image       */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 sm:space-y-7">
            
            {/* Tagline: BEST DESTINATIONS AROUND THE WORLD */}
            <p className="font-poppins font-bold text-base sm:text-lg lg:text-[20px] text-[#DF6951] uppercase tracking-wider leading-[30px]">
              BEST DESTINATIONS AROUND THE WORLD
            </p>

            {/* Main Title in Volkhov font (84px on desktop, 700 weight, #181E4B) */}
            <h1 className="font-volkhov font-bold text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] text-[#181E4B] leading-[1.08] lg:leading-[89px] tracking-tight lg:tracking-[-0.04em]">
              Travel,{' '}
              <span className="relative inline-block text-[#181E4B] z-10">
                enjoy
                {/* Red/coral brush underline swooping underneath 'enjoy' from Figma */}
                <img 
                  src="/hero_shape.svg" 
                  alt="" 
                  className="absolute -bottom-1.5 sm:-bottom-2.5 md:-bottom-3 left-0 w-[115%] min-w-[190px] sm:min-w-[240px] md:min-w-[310px] pointer-events-none -z-10 select-none" 
                />
              </span>
              <br />
              and live a new
              <br />
              and full life
            </h1>

            {/* Description in Poppins font (16px, 500 weight, #5E6282, 30px line height, max 477px) */}
            <p className="font-poppins font-medium text-base text-[#5E6282] leading-[30px] max-w-[477px]">
              Built Wicket longer admire do barton vanity itself do in it. Preferred to sportsmen it engrossed listening. Park gate sell they west hard for the.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2">
              {/* Primary Button: Find out more (#F1A501, 170x60px, Google Sans 500 18px) */}
              <button
                onClick={onSimulateAlpine}
                className="px-7 sm:px-8 py-4 sm:py-4.5 rounded-[10px] bg-[#F1A501] text-white font-googleSans font-medium text-base sm:text-[18px] leading-[23px] shadow-[0px_20px_35px_rgba(241,165,1,0.22)] hover:bg-[#e09900] hover:shadow-[0px_25px_40px_rgba(241,165,1,0.32)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Find out more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Play Demo Button: #DF6951 52px circle + 'Play Demo' text (#686D77, Poppins 17px) */}
              <button
                onClick={() => setShowDemoModal(true)}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-[#DF6951] shadow-[0px_15px_30px_rgba(223,105,81,0.35)] flex items-center justify-center text-white group-hover:scale-105 active:scale-95 transition-transform">
                  <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                </div>
                <span className="font-poppins font-medium text-[17px] leading-[26px] text-[#686D77] group-hover:text-[#DF6951] transition-colors">
                  Play Demo
                </span>
              </button>
            </div>

            {/* Discreet feature highlight chips */}
            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-[#5E6282] font-poppins">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Autonomous Disruption Recovery</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#029BC5]" />
                <span>Live ADS-B &amp; NDC Radar</span>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* Right Column: Traveler Illustration with Paper Airplanes & Luggage     */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Ambient decore blob behind the traveler */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] pointer-events-none -z-10">
              <div className="absolute top-4 right-0 w-72 sm:w-96 lg:w-[460px] h-72 sm:h-96 lg:h-[460px] bg-[#FFF1DA] rounded-full filter blur-[50px] opacity-80" />
            </div>

            {/* High-Resolution Traveler Composition with Paper Planes */}
            <div className="relative group">
              <img 
                src="/hero_traveller_full.png" 
                alt="Voyage Traveler with Luggage" 
                className="relative z-10 w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[600px] h-auto object-contain select-none drop-shadow-md group-hover:scale-[1.015] transition-transform duration-500"
              />

              {/* Floating Live Telemetry Badge for the active flight */}
              <div className="absolute -bottom-3 sm:bottom-4 left-0 sm:left-4 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-voyare-card border border-slate-100 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <div className="text-[12px] font-bold text-[#181E4B] tracking-wide flex items-center gap-2 font-poppins">
                    <span>BA 712 • LHR → ZRH</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-600 font-mono font-semibold">
                      {activeDisruption ? `+${activeDisruption.delay_minutes}m DELAY` : "ON SCHEDULE"}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5E6282] font-poppins">
                    {itinerary ? itinerary.title : "The Alpine Expedition"}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* Video Demo Modal (Triggered by 'Play Demo')                                */}
      {/* ========================================================================= */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FAF9F6]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#DF6951]" />
                <h3 className="font-poppins font-bold text-base text-[#181E4B]">
                  Voyage Travel Experience &amp; Disruption Demo
                </h3>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>
            
            <div className="aspect-video w-full bg-slate-900 flex items-center justify-center">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/gbpG0fW3vkI?autoplay=1" 
                title="Voyage Platform Demo" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
            
            <div className="p-6 bg-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-volkhov font-bold text-lg text-[#181E4B]">
                  Live Alpine Cascade Disruption Simulation
                </h4>
                <p className="font-poppins text-xs text-[#5E6282] mt-0.5">
                  Experience how YATAR holds backup Swiss trains, protects hotel check-ins, and files EU261 claims in 1 click.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  if (onSimulateAlpine) onSimulateAlpine();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#F1A501] text-white font-medium text-sm shadow-md hover:bg-[#e09900] transition-colors cursor-pointer"
              >
                Simulate Cascade Now
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
