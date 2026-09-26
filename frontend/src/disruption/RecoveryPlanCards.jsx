import React from 'react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function RecoveryPlanCards({ 
  onSelectPlan, 
  routeCorridor = "Mumbai → Delhi → Jaipur" 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-6 pb-2">
      
      {/* ------------------------------------------------------------- */}
      {/* CARD 1: PLAN A (MINIMUM COST)                                */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-md">
        <div>
          {/* Top Pills */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full uppercase">
              PLAN A: MINIMUM COST
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              ₹0 EXTRA
            </span>
          </div>

          {/* Heading */}
          <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mb-4">
            Airline Rebooking
          </h3>

          {/* Price & Route */}
          <div className="mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-baseline gap-1.5">
              <span className="font-volkhov font-bold text-3xl text-[#181E4B]">₹0</span>
              <span className="text-xs text-[#5E6282] font-mono">out-of-pocket</span>
            </div>
            <div className="text-xs text-[#5E6282] font-mono mt-1">
              New flight: Mumbai → Delhi
            </div>
          </div>

          {/* Stat Boxes */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                ARRIVAL
              </div>
              <div className="text-xs font-bold text-[#181E4B] mt-0.5 font-mono">
                Tomorrow 08:40
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                ITINERARY IMPACT
              </div>
              <div className="text-xs font-bold text-[#D96B43] mt-0.5 font-mono">
                2 bookings affected
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-6 text-xs text-[#5E6282] leading-relaxed font-poppins">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Airline rebooking on next available flight</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Jaipur hotel reservation retained</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Hotel notified about late arrival</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Existing Jaipur transfer rescheduled</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>No additional travel payment</span>
            </div>
          </div>

          {/* Trade-off Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 mb-6 text-[11px] text-[#5E6282] leading-relaxed">
            <strong className="text-[#181E4B] font-semibold">Trade-off:</strong> Arrives next morning and misses tonight's hotel check-in window.
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onSelectPlan && onSelectPlan('plan_a')}
          className="w-full py-3 rounded-2xl font-googleSans font-bold text-xs text-[#181E4B] bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Select Lowest-Cost Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CARD 2: PLAN B (FASTEST RECOVERY) - RECOMMENDED              */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-[28px] border-2 border-[#D96B43] shadow-lg p-6 sm:p-7 flex flex-col justify-between relative transition-all hover:shadow-xl">
        
        {/* Floating Top Badge */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D96B43] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 whitespace-nowrap">
          <Sparkles className="w-3 h-3 fill-white" />
          <span>RECOMMENDED RECOVERY</span>
        </div>

        <div>
          {/* Top Pills */}
          <div className="flex items-center justify-between gap-2 mb-4 pt-1">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#A84832] bg-rose-50 px-3 py-1 rounded-full uppercase">
              PLAN B: FASTEST RECOVERY
            </span>
            <span className="text-[11px] font-mono font-bold text-[#D96B43] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              ₹2,850 EXTRA
            </span>
          </div>

          {/* Heading */}
          <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mb-4">
            Flight + Rail Recovery
          </h3>

          {/* Yellow Highlight Price Box */}
          <div className="mb-5 p-4 rounded-2xl bg-[#FFFDF5] border border-[#FBECC8]">
            <div className="flex items-baseline gap-1.5">
              <span className="font-volkhov font-bold text-3xl text-[#181E4B]">₹2,850</span>
              <span className="text-xs text-[#5E6282] font-mono">additional cost</span>
            </div>
            <div className="text-xs text-[#5E6282] font-mono mt-1 font-semibold">
              {routeCorridor}
            </div>
          </div>

          {/* Stat Boxes */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                ARRIVAL
              </div>
              <div className="text-xs font-bold text-[#181E4B] mt-0.5 font-mono">
                Tonight 23:15
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                TIME SAVED
              </div>
              <div className="text-xs font-bold text-emerald-600 mt-0.5 font-mono">
                ~9h 25m
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-6 text-xs text-[#5E6282] leading-relaxed font-poppins">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Earlier alternative flight secured</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Delhi → Jaipur train connection found</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Hotel check-in extended to 23:59</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Airport → railway station transfer adjusted</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Remaining Jaipur itinerary preserved</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Disruption-related refund/claim eligibility checked automatically</span>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onSelectPlan && onSelectPlan('plan_b')}
          className="w-full py-3.5 rounded-2xl font-googleSans font-bold text-xs text-white bg-[#D96B43] hover:bg-[#c25c35] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>Execute Fast Recovery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CARD 3: PLAN C (COMFORT RECOVERY)                            */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-md">
        <div>
          {/* Top Pills */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-[10px] font-mono font-bold tracking-wider text-blue-800 bg-blue-50 px-3 py-1 rounded-full uppercase">
              PLAN C: COMFORT RECOVERY
            </span>
            <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              ₹6,900 EXTRA
            </span>
          </div>

          {/* Heading */}
          <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mb-4">
            Private Road Recovery
          </h3>

          {/* Price & Route */}
          <div className="mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-baseline gap-1.5">
              <span className="font-volkhov font-bold text-3xl text-[#181E4B]">₹6,900</span>
              <span className="text-xs text-[#5E6282] font-mono">additional cost</span>
            </div>
            <div className="text-xs text-[#5E6282] font-mono mt-1 font-semibold">
              {routeCorridor}
            </div>
          </div>

          {/* Stat Boxes */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                ARRIVAL
              </div>
              <div className="text-xs font-bold text-[#181E4B] mt-0.5 font-mono">
                Tonight 22:10
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                TIME SAVED
              </div>
              <div className="text-xs font-bold text-emerald-600 mt-0.5 font-mono">
                ~10h 30m
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-6 text-xs text-[#5E6282] leading-relaxed font-poppins">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Alternative Mumbai → Delhi flight secured</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Private Delhi → Jaipur transfer</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Direct door-to-door journey</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Hotel notified of revised arrival</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>No train connection required</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Luggage handled throughout the transfer</span>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onSelectPlan && onSelectPlan('plan_c')}
          className="w-full py-3 rounded-2xl font-googleSans font-bold text-xs text-[#181E4B] bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Select Comfort Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
