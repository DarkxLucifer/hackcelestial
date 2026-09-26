import React from 'react';
import { 
  ShieldCheck, Zap, Clock, DollarSign, ArrowRight, 
  Sparkles, Train, Plane, Hotel, CheckCircle2, AlertTriangle, FileText
} from 'lucide-react';

export default function TravelDisputePlans({ onSelectPlan, activeDisruption, t }) {
  return (
    <section id="dispute-plans" className="w-full bg-[#FAF9F6] py-20 px-6 sm:px-10 lg:px-12 select-none border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section in white theme */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DF6951]/10 border border-[#DF6951]/20 text-xs text-[#DF6951] font-poppins font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Autonomous Travel Dispute Plans</span>
          </div>

          <h2 className="font-volkhov font-bold text-3xl sm:text-4xl lg:text-5xl text-[#181E4B] tracking-tight">
            Travel Dispute &amp; Disruption Recovery Plans
          </h2>

          <p className="font-poppins text-sm sm:text-base text-[#5E6282] max-w-2xl mx-auto leading-relaxed">
            Multi-objective Pareto-optimal recovery pathways evaluated against EU261, US DOT, and Swiss rail carriage rules. All plans presented in clear, transparent structure.
          </p>
        </div>

        {/* 3 Dispute & Recovery Cards in Pristine White Format */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* =================================================================== */}
          {/* Plan 1: Minimal Cost / Statutory Carrier Dispute (€0 Out-of-Pocket) */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-8 border border-slate-200 shadow-voyare-card flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-100 text-slate-700 uppercase">
                  Plan A: Minimum Cost
                </span>
                <span className="text-xs font-mono text-emerald-600 font-bold">
                  +€250 Claim Credit
                </span>
              </div>

              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-4">
                Carrier Re-protection
              </h3>

              {/* Price & Out of Pocket */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#181E4B] font-mono">€0</span>
                  <span className="text-xs text-[#5E6282] font-mono">out-of-pocket</span>
                </div>
                <div className="text-xs text-emerald-700 font-medium mt-1">
                  100% airline-funded rebooking
                </div>
              </div>

              {/* Arrival & Slack Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-poppins">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">Arrival Window</span>
                  <span className="font-bold text-[#181E4B] mt-0.5 block">Next Day 09:15</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">Dispute Status</span>
                  <span className="font-bold text-emerald-600 mt-0.5 block">EU261 Filed</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6 space-y-3.5 text-xs text-[#5E6282] font-poppins">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Automated statutory EU261 compensation filed (€250 credit)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>British Airways complimentary overnight hotel at Zurich</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Zero credit card charge or additional transit costs</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Morning scenic SBB train re-ticketed at 07:02</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onSelectPlan && onSelectPlan('cost')}
                className="w-full py-3.5 rounded-xl border border-slate-300 hover:border-[#181E4B] text-[#181E4B] font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Select Carrier Dispute Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* Plan 2: Time-Optimal / Alpine Express (Recommended + Most Popular) */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-8 border-2 border-[#F1A501] shadow-2xl relative flex flex-col justify-between hover:shadow-2xl transition-all">
            {/* Recommended Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#F1A501] text-white text-[11px] font-bold font-mono tracking-wider uppercase shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>Recommended Recovery</span>
            </div>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-50 text-amber-900 uppercase">
                  Plan B: Alpine Express
                </span>
                <span className="text-xs font-mono text-emerald-600 font-bold">
                  Net Gain: +€208
                </span>
              </div>

              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-4">
                Ghost Hold Express
              </h3>

              {/* Price & Out of Pocket */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#181E4B] font-mono">+€42</span>
                  <span className="text-xs text-[#5E6282] font-mono">rail hold fee</span>
                </div>
                <div className="text-xs text-emerald-700 font-medium mt-1">
                  Arrive tonight before hotel cutoff (Net gain after €250 claim)
                </div>
              </div>

              {/* Arrival & Slack Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-poppins">
                <div className="p-3 rounded-xl bg-amber-50/50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">Arrival Window</span>
                  <span className="font-bold text-[#181E4B] mt-0.5 block">Tonight 22:30</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">Buffer Margin</span>
                  <span className="font-bold text-emerald-600 mt-0.5 block">+15m Restored</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6 space-y-3.5 text-xs text-[#5E6282] font-poppins">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F1A501] shrink-0 mt-0.5" />
                  <span className="text-[#181E4B] font-medium">Secures pre-held seat on SBB IC 8 #834 (Dep ZRH 19:02)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F1A501] shrink-0 mt-0.5" />
                  <span className="text-[#181E4B] font-medium">Boutique Hotel Matterhorn front desk extended to 23:59</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F1A501] shrink-0 mt-0.5" />
                  <span>1-Click Multi-Modal Autonomous Rebooking via SAGA</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F1A501] shrink-0 mt-0.5" />
                  <span>Files €250 EU261 claim automatically in background</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onSelectPlan && onSelectPlan('speed')}
                className="w-full py-3.5 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Execute Alpine Express Recovery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* Plan 3: Maximum Comfort / Executive VIP Alpine Transit              */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-8 border border-slate-200 shadow-voyare-card flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-100 text-slate-700 uppercase">
                  Plan C: Executive VIP
                </span>
                <span className="text-xs font-mono text-emerald-600 font-bold">
                  Net Gain: +€70
                </span>
              </div>

              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-4">
                Alpine Private Transit
              </h3>

              {/* Price & Out of Pocket */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#181E4B] font-mono">+€180</span>
                  <span className="text-xs text-[#5E6282] font-mono">private transfer</span>
                </div>
                <div className="text-xs text-emerald-700 font-medium mt-1">
                  Private alpine road transit direct to Zermatt door
                </div>
              </div>

              {/* Arrival & Slack Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-poppins">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">Arrival Window</span>
                  <span className="font-bold text-[#181E4B] mt-0.5 block">Tonight 21:10</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">Comfort Rating</span>
                  <span className="font-bold text-sky-600 mt-0.5 block">98/100 (Max)</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6 space-y-3.5 text-xs text-[#5E6282] font-poppins">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Private Mercedes V-Class chauffeur meet-and-greet at ZRH</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Direct scenic alpine highway route bypassing rail switch</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Arrives at Zermatt 1h 20m before original schedule</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Dedicated concierge luggage handling directly to hotel room</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onSelectPlan && onSelectPlan('comfort')}
                className="w-full py-3.5 rounded-xl border border-slate-300 hover:border-[#181E4B] text-[#181E4B] font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Select Executive VIP Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Passenger Rights Dispute Notice Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F1A501] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-poppins font-bold text-sm text-[#181E4B]">
                EU Regulation (EC) No 261/2004 Automatic Dispute Guarantee
              </h4>
              <p className="text-xs text-[#5E6282] mt-0.5">
                British Airways BA 712 delay exceeding statutory threshold qualifies for €250 compensation. YATAR files and verifies claims in real time.
              </p>
            </div>
          </div>

          <div className="shrink-0 font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200">
            CLAIM STATUS: VERIFIED ELIGIBLE
          </div>
        </div>

      </div>
    </section>
  );
}
