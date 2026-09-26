import React from 'react';
import { 
  ShieldCheck, Zap, Clock, ArrowRight, Sparkles, 
  CheckCircle2, Compass, ArrowUpRight
} from 'lucide-react';

export default function TravelDisputePlans({ 
  user,
  onOpenAuth,
  onNavigate,
  onSelectPlan, 
  activeDisruption, 
  t 
}) {
  const handlePlanAction = (planKey) => {
    if (!user) {
      if (onOpenAuth) {
        onOpenAuth('login', '/booking');
      } else if (onNavigate) {
        onNavigate('/booking');
      }
    } else {
      if (onNavigate) {
        onNavigate('/booking');
      }
    }
  };

  return (
    <section id="dispute-plans" className="w-full bg-[#FAF9F6] py-20 px-4 sm:px-8 lg:px-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section in white theme - Clean, professional, no stickers/emojis */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181E4B]/5 border border-[#181E4B]/10 text-xs text-[#181E4B] font-poppins font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Disruption Recovery Solutions</span>
          </div>

          <h2 className="font-volkhov font-bold text-3xl sm:text-4xl lg:text-5xl text-[#181E4B] tracking-tight">
            Pareto-Optimal Recovery Plans
          </h2>

          <p className="font-poppins text-sm sm:text-base text-[#5E6282] max-w-2xl mx-auto leading-relaxed">
            Real-time multi-modal re-routing evaluated across cost, arrival time, and downstream booking retention.
          </p>
        </div>

        {/* 3 Recovery Cards in Pristine White Format */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* =================================================================== */}
          {/* PLAN A: MINIMUM COST (₹0 EXTRA)                                     */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-7 sm:p-8 border border-slate-200 shadow-voyare-card flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-100 text-slate-700 uppercase">
                  PLAN A: MINIMUM COST
                </span>
                <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ₹0 EXTRA
                </span>
              </div>

              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-4">
                Airline Rebooking
              </h3>

              {/* Price & Out of Pocket */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#181E4B] font-mono">₹0</span>
                  <span className="text-xs text-[#5E6282] font-mono">out-of-pocket</span>
                </div>
                <div className="text-xs text-slate-600 font-medium mt-1">
                  New flight: Mumbai → Delhi
                </div>
              </div>

              {/* Arrival & Itinerary Impact */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-poppins">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">ARRIVAL</span>
                  <span className="font-bold text-[#181E4B] mt-0.5 block">Tomorrow 08:40</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">ITINERARY IMPACT</span>
                  <span className="font-bold text-amber-700 mt-0.5 block">2 bookings affected</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6 space-y-3 text-xs text-[#5E6282] font-poppins">
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

              {/* Trade-off notice */}
              <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed font-poppins">
                <span className="font-semibold text-slate-800">Trade-off:</span> Arrives next morning and misses tonight's hotel check-in window.
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handlePlanAction('plan_a')}
                className="w-full py-3.5 rounded-xl border border-slate-300 hover:border-[#181E4B] text-[#181E4B] font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Select Lowest-Cost Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* PLAN B: FASTEST RECOVERY (RECOMMENDED RECOVERY)                     */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-7 sm:p-8 border-2 border-[#DF6951] shadow-xl relative flex flex-col justify-between hover:shadow-2xl transition-all">
            {/* Recommended Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#DF6951] text-white text-[11px] font-bold font-mono tracking-wider uppercase shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>RECOMMENDED RECOVERY</span>
            </div>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-rose-50 text-rose-800 uppercase">
                  PLAN B: FASTEST RECOVERY
                </span>
                <span className="text-xs font-mono text-[#DF6951] font-bold bg-[#DF6951]/10 px-2.5 py-0.5 rounded-full border border-[#DF6951]/20">
                  ₹2,850 EXTRA
                </span>
              </div>

              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-4">
                Flight + Rail Recovery
              </h3>

              {/* Price & Out of Pocket */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#181E4B] font-mono">₹2,850</span>
                  <span className="text-xs text-[#5E6282] font-mono">additional cost</span>
                </div>
                <div className="text-xs text-[#181E4B] font-semibold mt-1">
                  Mumbai → Delhi → Jaipur
                </div>
              </div>

              {/* Arrival & Time Saved */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-poppins">
                <div className="p-3 rounded-xl bg-amber-50/40">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">ARRIVAL</span>
                  <span className="font-bold text-[#181E4B] mt-0.5 block">Tonight 23:15</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/40">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">TIME SAVED</span>
                  <span className="font-bold text-emerald-600 mt-0.5 block">~9h 25m</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6 space-y-3 text-xs text-[#5E6282] font-poppins">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[#181E4B] font-medium">Earlier alternative flight secured</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[#181E4B] font-medium">Delhi → Jaipur train connection found</span>
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

            <div className="pt-6">
              <button
                onClick={() => handlePlanAction('plan_b')}
                className="w-full py-3.5 rounded-xl bg-[#DF6951] hover:bg-[#c9533c] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Execute Fast Recovery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* PLAN C: MAXIMUM CONVENIENCE / COMFORT RECOVERY                      */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-7 sm:p-8 border border-slate-200 shadow-voyare-card flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-800 uppercase">
                  PLAN C: COMFORT RECOVERY
                </span>
                <span className="text-xs font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  ₹6,900 EXTRA
                </span>
              </div>

              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-4">
                Private Road Recovery
              </h3>

              {/* Price & Out of Pocket */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#181E4B] font-mono">₹6,900</span>
                  <span className="text-xs text-[#5E6282] font-mono">additional cost</span>
                </div>
                <div className="text-xs text-[#181E4B] font-semibold mt-1">
                  Mumbai → Delhi → Jaipur
                </div>
              </div>

              {/* Arrival & Time Saved */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-poppins">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">ARRIVAL</span>
                  <span className="font-bold text-[#181E4B] mt-0.5 block">Tonight 22:10</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">TIME SAVED</span>
                  <span className="font-bold text-emerald-600 mt-0.5 block">~10h 30m</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6 space-y-3 text-xs text-[#5E6282] font-poppins">
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

            <div className="pt-6">
              <button
                onClick={() => handlePlanAction('plan_c')}
                className="w-full py-3.5 rounded-xl border border-slate-300 hover:border-[#181E4B] text-[#181E4B] font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Select Comfort Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
