import React, { useState } from 'react';
import DemoJourneyGraph from './DemoJourneyGraph';

export default function Hero({ onSimulateAlpine, onOpenSaga, itinerary, activeDisruption, t }) {
  return (
    <section 
      id="hero" 
      className="relative min-h-[85vh] pt-10 sm:pt-14 pb-16 flex flex-col justify-center overflow-hidden bg-white"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* ===================================================================== */}
          {/* DIV[1]: REAL MATHEMATICAL TDAG GRAPH / GOOGLE MAP VIEW                */}
          {/* XPath: /html/body/div/div/div[2]/div[3]/div[2]/div[2]/section[1]/div[2]/div/div[1] */}
          {/* ===================================================================== */}
          <div className="lg:col-span-8 w-full">
            <DemoJourneyGraph
              itinerary={itinerary}
              activeDisruption={activeDisruption}
              onSimulateAlpine={onSimulateAlpine}
              onOpenSaga={onOpenSaga}
              t={t}
            />
          </div>

          {/* ===================================================================== */}
          {/* DIV[2]: TRAVELER VISUAL COMPOSITION MATCHING FIGMA REFERENCE          */}
          {/* ===================================================================== */}
          <div className="lg:col-span-4 relative flex flex-col items-center justify-center">
            <img 
              src="/hero_traveller_full.png" 
              alt="Voyage Traveler" 
              className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] h-auto object-contain drop-shadow-md hover:scale-[1.02] transition-transform duration-500"
            />

            {/* Micro Badge */}
            <div className="mt-3 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 shadow-xs flex items-center gap-2 text-xs text-[#5E6282] font-poppins">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-[#181E4B]">Mumbai → Delhi → Jaipur</span>
              <span>• Active Protection</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
