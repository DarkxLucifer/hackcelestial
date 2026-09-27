import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Clock, ArrowRight, Sparkles, 
  CheckCircle2, Compass, ArrowUpRight, CreditCard, Bus, Train, Plane, 
  ExternalLink, Shield, X
} from 'lucide-react';

export default function TravelDisputePlans({ 
  user,
  onOpenAuth,
  onNavigate,
  onSelectPlan, 
  activeDisruption, 
  t 
}) {
  const [gatewayModalPlan, setGatewayModalPlan] = useState(null);
  const [redirectToast, setRedirectToast] = useState(null);

  const handleOpenGatewayModal = (planInfo) => {
    setGatewayModalPlan(planInfo);
  };

  const handleRedirectToPartnerGateway = (gatewayType, gatewayUrl) => {
    window.open(gatewayUrl, '_blank', 'noopener,noreferrer');
    setRedirectToast({
      gateway: gatewayType,
      message: `Redirected to ${gatewayType} official secure portal. Tokens synchronized.`
    });
    setTimeout(() => setRedirectToast(null), 7000);
    setGatewayModalPlan(null);
  };

  const handlePlanAction = (planKey) => {
    if (!user) {
      if (onOpenAuth) {
        onOpenAuth('login', '/booking');
      } else if (onNavigate) {
        onNavigate('/booking');
      }
    } else {
      if (onSelectPlan) {
        onSelectPlan(planKey);
      } else if (onNavigate) {
        onNavigate('/booking');
      }
    }
  };

  return (
    <section id="dispute-plans" className="w-full bg-[#FAF9F6] py-20 px-4 sm:px-8 lg:px-12 border-t border-slate-200 relative">
      
      {/* Toast Notification when redirected to external gateway */}
      {redirectToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#181E4B] text-white p-4 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-fadeIn max-w-md">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs">{redirectToast.gateway} Gateway Initialized</div>
            <div className="text-[11px] text-slate-300 mt-0.5">{redirectToast.message}</div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Header section in clean white theme */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181E4B]/5 border border-[#181E4B]/10 text-xs text-[#181E4B] font-poppins font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Disruption Recovery Solutions</span>
          </div>

          <h2 className="font-volkhov font-bold text-3xl sm:text-4xl lg:text-5xl text-[#181E4B] tracking-tight">
            Pareto-Optimal Recovery Plans
          </h2>

          <p className="font-poppins text-sm sm:text-base text-[#5E6282] max-w-2xl mx-auto leading-relaxed">
            Real-time multi-modal re-routing evaluated across cost, arrival time, and downstream booking retention with direct payment gateway handoffs.
          </p>
        </div>

        {/* 3 Recovery Cards: Cheapest, Fastest, Medium */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* =================================================================== */}
          {/* CARD 1: 🟢 CHEAPEST PLAN (BUDGET / VALUE-OPTIMIZED)                  */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-7 sm:p-8 border-2 border-emerald-200/90 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>🟢 CHEAPEST PLAN</span>
                </span>
                <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ₹0 EXTRA
                </span>
              </div>

              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-4">
                Airline Statutory Rebooking
              </h3>

              {/* Price & Out of Pocket */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-mono">₹0</span>
                  <span className="text-xs text-[#5E6282] font-mono">net out-of-pocket</span>
                </div>
                <div className="text-xs text-slate-600 font-medium mt-1">
                  Protected Leg: Mumbai (BOM) ➔ Delhi (DEL)
                </div>
              </div>

              {/* Arrival & Itinerary Impact */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-poppins">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">ARRIVAL</span>
                  <span className="font-bold text-[#181E4B] mt-0.5 block">Tomorrow 08:40</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">EXTRA COST</span>
                  <span className="font-bold text-emerald-700 mt-0.5 block">100% Free Carrier Hold</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6 space-y-3 text-xs text-[#5E6282] font-poppins">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Airline rebooking on next scheduled flight under DGCA CAR regulations</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Jaipur hotel reservation retained with automated desk notification</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Existing Jaipur road/rail transfer rescheduled without loss</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Direct partner gateway handoff to official IRCTC / State bus portal</span>
                </div>
              </div>

              {/* Trade-off notice */}
              <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed font-poppins">
                <span className="font-semibold text-slate-800">Trade-off:</span> Arrives next morning; zero financial burden with preserved hotel booking.
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={() => handleOpenGatewayModal({
                  title: "Airline Statutory Rebooking / State Transport",
                  type: "Cheapest Plan",
                  cost: 0,
                  carrier: "IndiGo / Indian Railways",
                  origin: "Mumbai (BOM)",
                  destination: "Delhi (DEL)"
                })}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>Proceed to Payment Gateway</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                onClick={() => handlePlanAction('plan_a')}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-[#181E4B] text-[#181E4B] font-semibold text-xs hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Select Lowest-Cost Plan</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* CARD 2: ⚡ FASTEST PLAN (SPEED & EARLIEST ARRIVAL)                  */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-7 sm:p-8 border-2 border-[#DF6951] shadow-xl relative flex flex-col justify-between hover:shadow-2xl transition-all">
            {/* Recommended Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#DF6951] text-white text-[11px] font-bold font-mono tracking-wider uppercase shadow-sm flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>⚡ FASTEST RECOVERY (RECOMMENDED)</span>
            </div>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-rose-50 text-rose-800 uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#DF6951]" />
                  <span>⚡ FASTEST PLAN</span>
                </span>
                <span className="text-xs font-mono text-[#DF6951] font-bold bg-[#DF6951]/10 px-2.5 py-0.5 rounded-full border border-[#DF6951]/20">
                  ₹2,850 EXTRA
                </span>
              </div>

              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-4">
                Flight + Rail Express Bypass
              </h3>

              {/* Price & Out of Pocket */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#DF6951] font-mono">₹2,850</span>
                  <span className="text-xs text-[#5E6282] font-mono">speed premium</span>
                </div>
                <div className="text-xs text-[#181E4B] font-semibold mt-1">
                  Mumbai (BOM) ➔ Delhi (DEL) ➔ Jaipur (JAI)
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
                  <span className="font-bold text-emerald-600 mt-0.5 block">~9h 25m Saved</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6 space-y-3 text-xs text-[#5E6282] font-poppins">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[#181E4B] font-medium">Earlier alternative flight secured on cleared priority airway</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[#181E4B] font-medium">Delhi ➔ Jaipur Vande Bharat / Superfast rail connection reserved</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Hotel check-in cryptographically extended to 23:59</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Direct partner gateway handoff to Air India / IndiGo / IRCTC</span>
                </div>
              </div>

              {/* Trade-off notice */}
              <div className="mt-5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed font-poppins">
                <span className="font-semibold">Fastest Advantage:</span> Saves over 9 hours, arriving tonight in time for full sleep and morning business.
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={() => handleOpenGatewayModal({
                  title: "Flight + Rail Express Bypass",
                  type: "Fastest Plan",
                  cost: 2850,
                  carrier: "IndiGo 6E / Vande Bharat Express",
                  origin: "Mumbai (BOM)",
                  destination: "Jaipur (JAI)"
                })}
                className="w-full py-3 rounded-xl bg-[#DF6951] hover:bg-[#c9533c] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>Proceed to Payment Gateway</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                onClick={() => handlePlanAction('plan_b')}
                className="w-full py-2.5 rounded-xl border border-[#DF6951]/30 hover:border-[#DF6951] text-[#DF6951] font-semibold text-xs hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Execute Fast Recovery</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DF6951]" />
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* CARD 3: ⚖️ MEDIUM / BALANCED PLAN (COMFORT & BUFFER)                 */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-7 sm:p-8 border-2 border-blue-200/90 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-100 text-blue-800 uppercase flex items-center gap-1.5">
                  <span>⚖️ MEDIUM PLAN</span>
                </span>
                <span className="text-xs font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  ₹1,450 EXTRA
                </span>
              </div>

              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-4">
                Comfort Rail + Late Check-In
              </h3>

              {/* Price & Out of Pocket */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 font-mono">₹1,450</span>
                  <span className="text-xs text-[#5E6282] font-mono">balanced upgrade</span>
                </div>
                <div className="text-xs text-[#181E4B] font-semibold mt-1">
                  Mumbai ➔ Delhi (Re-booked) ➔ Jaipur
                </div>
              </div>

              {/* Arrival & Time Saved */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-poppins">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">ARRIVAL</span>
                  <span className="font-bold text-[#181E4B] mt-0.5 block">Tonight 23:55</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-[#84829A] block uppercase font-mono">COMFORT SCORE</span>
                  <span className="font-bold text-blue-600 mt-0.5 block">8.9 / 10 (Balanced)</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6 space-y-3 text-xs text-[#5E6282] font-poppins">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Next scheduled carrier flight confirmed with zero penalty</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Comfortable 45-minute slack buffer at Delhi transit hub</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Hotel room lock guaranteed until 03:00 AM via webhook attestation</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Direct partner gateway handoff to IRCTC / Airline portal</span>
                </div>
              </div>

              {/* Trade-off notice */}
              <div className="mt-5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 leading-relaxed font-poppins">
                <span className="font-semibold">Balanced Advantage:</span> Moderate price point with low travel stress and retained hotel reservation.
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={() => handleOpenGatewayModal({
                  title: "Comfort Rail + Protected Late Check-In",
                  type: "Medium / Balanced Plan",
                  cost: 1450,
                  carrier: "Indian Railways / Air India",
                  origin: "Mumbai (BOM)",
                  destination: "Jaipur (JAI)"
                })}
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>Proceed to Payment Gateway</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                onClick={() => handlePlanAction('plan_c')}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-[#181E4B] text-[#181E4B] font-semibold text-xs hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Select Balanced Plan</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================= */}
      {/* AUTHENTICATED PAYMENT GATEWAY REDIRECTION MODAL              */}
      {/* ============================================================= */}
      {gatewayModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setGatewayModalPlan(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-lg cursor-pointer transition-colors"
            >
              &times;
            </button>

            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Authenticated Payment Gateway Handoff</span>
              </div>
              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-1">
                Choose Payment Channel
              </h3>
              <p className="text-xs text-[#5E6282] mt-0.5">
                Complete your recovery reservation for <strong>{gatewayModalPlan.title}</strong> ({gatewayModalPlan.origin} ➔ {gatewayModalPlan.destination}).
              </p>
            </div>

            <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{gatewayModalPlan.type}</span>
                <span className="text-slate-500 text-[11px]">{gatewayModalPlan.carrier}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg text-[#181E4B]">₹{Number(gatewayModalPlan.cost).toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Statutory Fare Protected</span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Select Official Partner Gateway to Redirect:
              </span>

              {/* 1. redBus Payment Gateway */}
              <button
                type="button"
                onClick={() => handleRedirectToPartnerGateway('redBus', 'https://www.redbus.in')}
                className="w-full p-4 rounded-2xl border border-red-200 bg-red-50/40 hover:bg-red-50 hover:border-red-400 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>redBus Payment Gateway</span>
                      <span className="text-[10px] font-mono bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                        Official Partner
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      State MSRTC, Sleeper, and Private Intercity AC Buses. Instant UPI, Cards &amp; NetBanking.
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-red-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              {/* 2. IRCTC Official Rail Gateway */}
              <button
                type="button"
                onClick={() => handleRedirectToPartnerGateway('IRCTC', 'https://www.irctc.co.in/nget/train-search')}
                className="w-full p-4 rounded-2xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>IRCTC Official Rail Gateway</span>
                      <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                        Indian Railways
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Vande Bharat, Tatkal, Superfast Express reservations &amp; official TDR settlement.
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-blue-800 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              {/* 3. Airline Gateway */}
              <button
                type="button"
                onClick={() => handleRedirectToPartnerGateway('Airline Official Gateway', 'https://www.goindigo.in')}
                className="w-full p-4 rounded-2xl border border-sky-200 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-400 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>Airline Official Portal (IndiGo / Air India)</span>
                      <span className="text-[10px] font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                        Direct Carrier
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Direct boarding pass issuance, seat allocation, and DGCA CAR protection.
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              {/* 4. Voyage 1-Click Autonomous Saga Gateway */}
              <button
                type="button"
                onClick={() => {
                  setGatewayModalPlan(null);
                  handlePlanAction('plan_b');
                }}
                className="w-full p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/60 hover:bg-amber-100/70 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#181E4B] text-amber-400 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#181E4B] flex items-center gap-1.5">
                      <span>Voyage 1-Click Autonomous Saga</span>
                      <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                        Zero Friction
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Instant compensation settlement, ghost hold lock, and automated rollback guarantee.
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#181E4B] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">
                🔒 Protected by 256-bit SSL encryption &amp; DGCA CAR / IRCTC compliance
              </span>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
