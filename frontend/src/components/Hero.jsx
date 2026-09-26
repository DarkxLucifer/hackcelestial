import React from 'react';
import { Play, ArrowRight, ShieldCheck, Zap, Radio, CloudRain, AlertTriangle, Sparkles } from 'lucide-react';

export default function Hero({ onSimulateAlpine, onOpenSaga, itinerary, activeDisruption }) {
  return (
    <section id="hero" className="relative min-h-[92vh] pt-32 pb-20 flex flex-col justify-center overflow-hidden">
      {/* Ambient background with lush tropical island aerial image */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 filter blur-[2px] transition-transform duration-1000"
          style={{ backgroundImage: `url('/island.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/80 via-[#FAF9F6]/95 to-[#FAF9F6]" />
        
        {/* Decorative ambient color blur orbs from Figma specification */}
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-voyare-purpleGlow/30 filter blur-[90px]" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full bg-voyare-cream/90 filter blur-[75px]" />
        <div className="absolute bottom-10 left-1/4 w-[360px] h-[360px] rounded-full bg-voyare-skyGlow/25 filter blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Subheading & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-voyare-coral/10 border border-voyare-coral/20">
              <span className="w-2 h-2 rounded-full bg-[#DF6951]" />
              <span className="text-xs md:text-sm font-bold tracking-wider uppercase text-voyare-coral font-poppins">
                Autonomous Travel Resilience
              </span>
            </div>

            {/* Main Title in Volkhov font as per Figma specs */}
            <h1 className="font-volkhov text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-bold text-voyare-navy leading-[1.08] tracking-tight">
              When Journeys Disrupt, <br />
              <span className="relative inline-block text-voyare-darkNavy">
                Voyage Finds a Way Forward.
                {/* Decorative underline curve from Figma Vector Decore */}
                <svg className="absolute -bottom-2 left-0 w-full h-4 text-voyare-coral opacity-80" viewBox="0 0 350 20" fill="none" preserveAspectRatio="none">
                  <path d="M3 15C80 3 240 3 347 13" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Description in Poppins font as per Figma specs */}
            <p className="font-poppins text-base md:text-lg text-voyare-slate max-w-2xl leading-relaxed">
              When a flight delay at Heathrow threatens to leave you locked outside your Zermatt alpine hotel at midnight, YATAR’s Spatio-Temporal Knowledge Graph detects the cascading failure hours before airlines speak up, holds backup rail seats, files statutory EU261 claims, and recovers your trip in 1 click.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              {/* Primary Gold Pill CTA */}
              <button
                onClick={onSimulateAlpine}
                className="px-8 py-4 rounded-xl bg-voyare-gold text-white font-semibold text-base shadow-voyare-glow hover:bg-[#e09900] hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <span>Simulate Alpine Cascade</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Secondary Play Demo Button with coral circle button */}
              <a
                href="#simulator"
                className="flex items-center gap-3 px-6 py-3.5 rounded-xl hover:bg-white/80 transition-colors w-full sm:w-auto justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-voyare-coral flex items-center justify-center shadow-voyare-coral-glow text-white group-hover:scale-105 transition-transform">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
                <span className="font-poppins font-medium text-voyare-slate text-base">
                  Explore Live Radar
                </span>
              </a>
            </div>

            {/* Feature Highlights Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-voyare-textMuted font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>US DOT 2024 & EU261 Automated Claims</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-voyare-gold" />
                <span>CP-SAT Multi-Objective Optimizer</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-sky-500" />
                <span>Just-In-Time Ghost Holds</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Trip Radar & Mission Control Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Decorative background glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-voyare-coral/20 to-voyare-gold/20 rounded-3xl blur-2xl -z-10" />

              <div className="voyare-glass-card rounded-[28px] p-6 shadow-voyare-card border border-white">
                
                {/* Header Strip */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-voyare-navy">
                      Live Telemetry Stream
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-voyare-slate">
                    ADS-B + GDS NDC
                  </span>
                </div>

                {/* Active Trip Info */}
                <div className="mt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-voyare-coral">
                    Monitored Trip
                  </div>
                  <h3 className="font-poppins text-lg font-bold text-voyare-navy mt-0.5">
                    {itinerary ? itinerary.title : "The Alpine Expedition: London to Zermatt"}
                  </h3>
                  <p className="text-xs text-voyare-slate mt-0.5">
                    Traveler: {itinerary ? itinerary.traveler_name : "Elena Vance"} • 5 Interconnected Segments
                  </p>
                </div>

                {/* Radar Route Summary Card */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#102C2E]/90 to-[#14183E] text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Current Segment</span>
                    <span className="text-voyare-gold font-mono font-bold">BA 712 (A320neo)</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <div className="text-xl font-bold font-mono">LHR</div>
                      <div className="text-[10px] text-white/70">London Heathrow</div>
                    </div>
                    <div className="flex-1 px-4 flex flex-col items-center">
                      <div className="text-[10px] text-white/60 font-mono">
                        {activeDisruption ? `+${activeDisruption.delay_minutes}m DELAY` : "ON SCHEDULE"}
                      </div>
                      <div className="w-full relative flex items-center justify-center my-1">
                        <div className="w-full h-0.5 bg-white/20"></div>
                        <div className={`absolute w-3 h-3 rounded-full ${activeDisruption ? 'bg-red-500' : 'bg-emerald-400'}`}></div>
                      </div>
                      <div className="text-[9px] text-white/50">1h 45m flight</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold font-mono">ZRH</div>
                      <div className="text-[10px] text-white/70">Zurich Airport</div>
                    </div>
                  </div>

                  {/* Negative Slack Warning Banner */}
                  {activeDisruption ? (
                    <div className="mt-4 p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>
                        <strong>Critical Buffer Deficit:</strong> Slack drops to <strong>-10m</strong>. Missed SBB train guaranteed.
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CloudRain className="w-4 h-4 text-sky-300" />
                        <span>Weather at ZRH: Clear 14°C</span>
                      </div>
                      <span className="font-mono text-[10px] bg-emerald-400/20 px-2 py-0.5 rounded text-emerald-300">
                        Buffer: +45m OK
                      </span>
                    </div>
                  )}
                </div>

                {/* Domino Risk Score & Ghost Holds quick glance */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-voyare-slate">Domino Risk (DRI)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-2xl font-black font-mono ${
                        itinerary?.domino_risk_index > 70 ? 'text-red-500' : 'text-voyare-navy'
                      }`}>
                        {itinerary ? Math.round(itinerary.domino_risk_index) : 48}
                      </span>
                      <span className="text-xs text-voyare-slate">/100</span>
                    </div>
                    <span className="text-[10px] text-voyare-textMuted mt-0.5">
                      {itinerary?.domino_risk_index > 70 ? 'Extreme Cascade Risk' : 'Moderate Fragility'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-voyare-slate">Ghost Holds</span>
                      <div className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        2 Pre-Secured
                      </div>
                    </div>
                    <span className="text-[10px] text-voyare-textMuted">Zero-Penalty 90m Hold</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
