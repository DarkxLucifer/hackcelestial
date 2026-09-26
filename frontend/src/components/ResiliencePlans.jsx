import React, { useState } from 'react';
import { 
  Sparkles, MessageSquare, Image, Brain, Phone, 
  Briefcase, Code2, Search, Layers, ShieldCheck, Zap,
  Check, ArrowRight
} from 'lucide-react';

export default function ResiliencePlans({ onSelectPlan, t }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'trip'
  const [proMultiplier, setProMultiplier] = useState('5x'); // '5x' | '20x'

  return (
    <section id="plans" className="w-full bg-[#0d0d0e] text-white py-20 px-6 sm:px-10 lg:px-12 select-none border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/80 font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F1A501]" />
            <span>Voyage Protection Tiers</span>
          </div>
          <h2 className="font-volkhov font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            {t?.plansHeading || "Resilience & Travel Protection Plans"}
          </h2>
          <p className="font-poppins text-sm sm:text-base text-[#8E8E93] max-w-xl mx-auto">
            {t?.plansSubtitle || "Choose the level of autonomous journey immunity that fits your travel lifestyle."}
          </p>

          {/* Toggle pill Personal / Business */}
          <div className="pt-4 flex justify-center">
            <div className="bg-[#212124] p-1 rounded-full border border-white/10 flex items-center">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold font-poppins transition-all cursor-pointer ${
                  billingPeriod === 'monthly' ? 'bg-[#323236] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setBillingPeriod('trip')}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold font-poppins transition-all cursor-pointer ${
                  billingPeriod === 'trip' ? 'bg-[#323236] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                Business
              </button>
            </div>
          </div>
        </div>

        {/* 3 Tier Cards matching media_1790415846480.jpg */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* =================================================================== */}
          {/* Card 1: Go ($8 USD / month)                                         */}
          {/* =================================================================== */}
          <div className="bg-[#171719] rounded-[28px] p-8 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <h3 className="font-googleSans font-bold text-2xl text-white">Go</h3>
              
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">$8</span>
                <span className="text-xs text-[#8E8E93] font-mono">USD / month</span>
              </div>

              <p className="text-xs text-[#8E8E93] mt-2 font-poppins">
                Keep traveling with expanded autonomous delay access
              </p>

              <button 
                onClick={() => onSelectPlan && onSelectPlan('go')}
                className="w-full mt-6 py-3 rounded-full bg-[#242428] hover:bg-[#2e2e32] text-white font-googleSans font-medium text-sm border border-white/10 transition-colors cursor-pointer"
              >
                {t?.planGoBtn || "Your current plan"}
              </button>

              <div className="mt-8 space-y-4 text-xs text-white/90 font-poppins">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-white/70 shrink-0" />
                  <span>Core disruption predictive model</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-white/70 shrink-0" />
                  <span>Real-time ADS-B flight alerts &amp; SMS</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image className="w-4 h-4 text-white/70 shrink-0" />
                  <span>Statutory EU261 &amp; US DOT claim drafting</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="w-4 h-4 text-white/70 shrink-0" />
                  <span>Doppler alpine snowfall monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white/70 shrink-0" />
                  <span>Expanded delay notification mode</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[11px] text-[#555] font-poppins">
              This plan includes standard alerts. <a href="#learn" className="underline">Learn more</a>
            </div>
          </div>

          {/* =================================================================== */}
          {/* Card 2: Plus ($20 USD / month - Most Popular)                       */}
          {/* =================================================================== */}
          <div className="bg-[#171719] rounded-[28px] p-8 border border-white/20 shadow-2xl relative flex flex-col justify-between hover:border-emerald-500/50 transition-all ring-1 ring-white/10">
            {/* Pill accent */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-bold font-mono tracking-wider uppercase">
              {t?.mostPopular || "Most Popular"}
            </div>

            <div>
              <h3 className="font-googleSans font-bold text-2xl text-white">Plus</h3>
              
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">$20</span>
                <span className="text-xs text-[#8E8E93] font-mono">USD / month</span>
              </div>

              <p className="text-xs text-[#8E8E93] mt-2 font-poppins">
                Unlock the full autonomous recovery experience
              </p>

              <button 
                onClick={() => onSelectPlan && onSelectPlan('plus')}
                className="w-full mt-6 py-3 rounded-full bg-[#343439] hover:bg-emerald-500 hover:text-black text-white font-googleSans font-semibold text-sm transition-all shadow-md cursor-pointer"
              >
                {t?.planPlusBtn || "Upgrade to Plus"}
              </button>

              <div className="mt-8 space-y-4 text-xs text-white/90 font-poppins">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Advanced multi-modal Pareto model</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Just-In-Time Ghost Holds on Swiss trains</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hotel front-desk check-in auto-extension</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-Click Autonomous Tri-Archetype routing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Agentic Saga multi-step recovery dispatch</span>
                </div>
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Expanded deep seat inventory research</span>
                </div>
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero out-of-pocket cancellation cover</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[11px] text-[#8E8E93] font-poppins">
              Manage subscription anytime in Voyage Account.
            </div>
          </div>

          {/* =================================================================== */}
          {/* Card 3: Pro ($100 USD / month)                                      */}
          {/* =================================================================== */}
          <div className="bg-[#171719] rounded-[28px] p-8 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-googleSans font-bold text-2xl text-white">Pro</h3>
                {/* 5x / 20x toggle matching media_1790415846480.jpg */}
                <div className="bg-[#242428] p-0.5 rounded-full border border-white/10 flex items-center text-[10px] font-mono">
                  <button 
                    onClick={() => setProMultiplier('5x')}
                    className={`px-2.5 py-0.5 rounded-full transition-all ${proMultiplier === '5x' ? 'bg-[#3b3b40] text-white' : 'text-[#8E8E93]'}`}
                  >
                    5x
                  </button>
                  <button 
                    onClick={() => setProMultiplier('20x')}
                    className={`px-2.5 py-0.5 rounded-full transition-all ${proMultiplier === '20x' ? 'bg-[#3b3b40] text-white' : 'text-[#8E8E93]'}`}
                  >
                    20x
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">$100</span>
                <span className="text-xs text-[#8E8E93] font-mono">USD / month</span>
              </div>

              <p className="text-xs text-[#8E8E93] mt-2 font-poppins">
                Maximize your productivity and travel speed
              </p>

              <button 
                onClick={() => onSelectPlan && onSelectPlan('pro')}
                className="w-full mt-6 py-3 rounded-full bg-[#343439] hover:bg-white hover:text-black text-white font-googleSans font-semibold text-sm transition-all cursor-pointer"
              >
                {t?.planProBtn || "Upgrade to Pro"}
              </button>

              <div className="mt-6 text-xs text-white/50 font-medium font-poppins">
                Everything in Plus and:
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-white/90 font-poppins">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-white/80 shrink-0" />
                  <span>5x more usage &amp; priority hold allocation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-white/80 shrink-0" />
                  <span>Frontier Pro multi-agent resilience model</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white/80 shrink-0" />
                  <span>Maximum access to VIP transfer dispatch</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-white/80 shrink-0" />
                  <span>Private alpine helicopter / road guarantees</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-white/80 shrink-0" />
                  <span>Unlimited global multi-leg itineraries</span>
                </div>
                <div className="flex items-center gap-3">
                  <Code2 className="w-4 h-4 text-white/80 shrink-0" />
                  <span>Instant 0-minute hold reservation speed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="w-4 h-4 text-white/80 shrink-0" />
                  <span>100% full non-refundable lodging indemnity</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-white/80 shrink-0" />
                  <span>Early access to experimental frontier corridors</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[10px] text-[#666] font-poppins">
              Unlimited subject to carrier guardrails. <br />
              <a href="#limits" className="underline hover:text-white/60">Learn about limits and promos</a> • <a href="#billing" className="underline hover:text-white/60">I need help with a billing issue</a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
