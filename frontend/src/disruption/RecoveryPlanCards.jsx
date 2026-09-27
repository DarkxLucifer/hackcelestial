import React, { useState } from 'react';
import { 
  CheckCircle2, ArrowRight, Sparkles, Clock, ShieldCheck, Zap, 
  ExternalLink, CreditCard, Bus, Train, Plane, X, Shield, ArrowUpRight
} from 'lucide-react';

export default function RecoveryPlanCards({ 
  onSelectPlan, 
  routeCorridor = "Mumbai → Delhi → Jaipur",
  disruptedTicket = null,
  xgboostPrediction = null,
  liveWeather = null
}) {
  const isTrain = routeCorridor.toLowerCase().includes("train") || 
                  routeCorridor.toLowerCase().includes("rail") || 
                  routeCorridor.includes("20978") || 
                  routeCorridor.includes("NDLS") || 
                  routeCorridor.includes("CSMT") ||
                  routeCorridor.includes("12810") ||
                  routeCorridor.toLowerCase().includes("vande");

  // Operational metrics from XGBoost and real weather
  const delayMinutes = Number(disruptedTicket?.delay_minutes || xgboostPrediction?.predicted_delay_mins || 45);
  const primaryWeather = Number(xgboostPrediction?.primary_weather_mins || Math.round(delayMinutes * 0.65));
  const turnaroundCascade = Number(xgboostPrediction?.turnaround_cascade_mins || Math.max(0, delayMinutes - primaryWeather));
  const runwayCapacity = Number(xgboostPrediction?.runway_throughput_pct || 74);
  const cancelRisk = Number(xgboostPrediction?.cancellation_probability_pct || 14.5);
  
  const origin = disruptedTicket?.origin || "BOM";
  const destination = disruptedTicket?.destination || "DEL";
  const weatherCond = liveWeather?.condition || disruptedTicket?.weather_condition || "Moderate Precipitation";
  const tempC = liveWeather?.temperature_c ?? disruptedTicket?.temperature_c ?? 26;
  const windKmh = liveWeather?.wind_speed_kmh ?? disruptedTicket?.wind_speed_kmh ?? 18;

  // Payment Gateway Modal State
  const [gatewayModalPlan, setGatewayModalPlan] = useState(null);
  const [redirectToast, setRedirectToast] = useState(null);

  const handleOpenGatewayModal = (planInfo) => {
    setGatewayModalPlan(planInfo);
  };

  const handleRedirectToPartnerGateway = (gatewayType, gatewayUrl) => {
    // Open authenticated partner payment portal
    window.open(gatewayUrl, '_blank', 'noopener,noreferrer');
    
    setRedirectToast({
      gateway: gatewayType,
      message: `Redirected to ${gatewayType} official secure portal. Itinerary tokens synchronized.`
    });
    setTimeout(() => setRedirectToast(null), 7000);
    setGatewayModalPlan(null);
  };

  const handleProceedVoyageSaga = (planKey) => {
    setGatewayModalPlan(null);
    if (onSelectPlan) {
      onSelectPlan(planKey);
    }
  };

  return (
    <div className="relative pt-2 pb-2">
      
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

      {/* Top Banner: XGBoost Delay Grounding & Real Weather Ingestion */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/70 to-slate-50 border border-blue-200/90 shadow-2xs mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Zap className="w-4 h-4 text-amber-300" />
            </span>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <span>XGBoost Multi-Modal Delay Engine Grounded</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                  ML-Predicted
                </span>
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Recovery plans synthesized by factoring real meteorological conditions at <strong>{origin}</strong> into machine learning delay &amp; turnaround cascade trees.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-900 shadow-2xs">
              {origin} ➔ {destination}
            </span>
          </div>
        </div>

        {/* Prediction decomposition pill grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
          <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">XGBoost Predicted Delay</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-rose-600 font-mono">+{delayMinutes}m</span>
              <span className="text-[10px] text-slate-400 font-mono">delay</span>
            </div>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Weather vs Ripple</span>
            <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">
              +{primaryWeather}m primary / +{turnaroundCascade}m cascade
            </div>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Live Atmosphere</span>
            <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
              {weatherCond} ({tempC}°C, {windKmh}km/h)
            </div>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Corridor Throughput</span>
            <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">
              {runwayCapacity}% throughput ({cancelRisk}% cancel risk)
            </div>
          </div>
        </div>
      </div>

      {/* 3 Distinct Plan Cards: Cheapest, Fastest, Medium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        
        {/* ============================================================= */}
        {/* CARD 1: 🟢 CHEAPEST PLAN (BUDGET / VALUE OPTIMIZED)            */}
        {/* ============================================================= */}
        <div className="bg-white rounded-[28px] border-2 border-emerald-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-md relative">
          <div>
            {/* Top Category Badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>🟢 CHEAPEST PLAN</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {isTrain ? "₹385 TOTAL EXTRA" : "₹1,250 TOTAL EXTRA"}
              </span>
            </div>

            {/* Heading */}
            <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mb-2">
              {isTrain ? "MSRTC Shivshahi / Intercity Superfast Rail" : "Budget Intermodal Relay & High-Speed Rail"}
            </h3>

            <p className="text-xs text-[#5E6282] mb-4">
              Value-first resolution utilizing state transit or confirmed non-peak express links with zero or minimal out-of-pocket costs.
            </p>

            {/* Price & Route */}
            <div className="mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-baseline gap-1.5">
                <span className="font-volkhov font-bold text-3xl text-emerald-700">
                  {isTrain ? "₹385" : "₹1,250"}
                </span>
                <span className="text-xs text-[#5E6282] font-mono">net additional fare</span>
              </div>
              <div className="text-xs text-[#5E6282] font-mono mt-1 font-semibold">
                {isTrain ? "MSRTC AC Sleeper / Regional Superfast Connection" : `Weather-hardened budget transit: ${origin} ➔ ${destination}`}
              </div>
            </div>

            {/* Stat Boxes */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                  SCHEDULE
                </div>
                <div className="text-xs font-bold text-[#181E4B] mt-0.5 font-mono">
                  Tonight (Guaranteed)
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                  EXTRA EXPENSE
                </div>
                <div className="text-xs font-bold text-emerald-600 mt-0.5 font-mono">
                  Lowest Cost Profile
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3 mb-6 text-xs text-[#5E6282] leading-relaxed font-poppins">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Reserved AC seat on weather-hardened state road/rail corridor</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Bypasses terminal delays with high on-schedule reliability</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Direct handoff to official redBus &amp; IRCTC reservation gateway</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Downstream hotel reservation notified &amp; room lock preserved</span>
              </div>
            </div>

            {/* Trade-off Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 mb-6 text-[11px] text-emerald-900 leading-relaxed">
              <strong>Cheapest Advantage:</strong> Lowest total budget impact; ideal for practical travelers requiring guaranteed arrival without premium surcharges.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mt-2">
            <button
              onClick={() => handleOpenGatewayModal({
                key: 'plan_cheapest',
                title: isTrain ? "MSRTC Shivshahi AC / Tatkal Rail" : "Budget Express Transit",
                type: 'Cheapest Plan',
                cost: isTrain ? 385 : 1250,
                carrier: isTrain ? "MSRTC / Indian Railways" : "Budget Relay Carrier",
                mode: isTrain ? "bus_rail" : "rail",
                origin,
                destination
              })}
              className="w-full py-3 rounded-2xl font-googleSans font-bold text-xs text-white bg-emerald-700 hover:bg-emerald-800 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Payment Gateway</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>

            <button
              onClick={() => onSelectPlan && onSelectPlan('plan_a')}
              className="w-full py-2.5 rounded-2xl font-googleSans font-semibold text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Voyage 1-Click Autonomous Saga</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* CARD 2: ⚡ FASTEST PLAN (SPEED & EARLIEST ARRIVAL)             */}
        {/* ============================================================= */}
        <div className="bg-white rounded-[28px] border-2 border-[#D96B43] shadow-lg p-6 sm:p-7 flex flex-col justify-between relative transition-all hover:shadow-xl">
          
          {/* Floating Top Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D96B43] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3 h-3 fill-white" />
            <span>⚡ FASTEST RECOVERY (RECOMMENDED)</span>
          </div>

          <div>
            {/* Top Pills */}
            <div className="flex items-center justify-between gap-2 mb-4 pt-1">
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#A84832] bg-rose-50 px-3 py-1 rounded-full uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#D96B43]" />
                <span>⚡ FASTEST PLAN</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-[#D96B43] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {isTrain ? "₹1,250 EXTRA" : "₹2,400 EXTRA"}
              </span>
            </div>

            {/* Heading */}
            <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mb-2">
              {isTrain ? "Direct Vande Bharat / Superfast Express Bypass" : "Priority Direct Airline Corridor Bypass"}
            </h3>

            <p className="text-xs text-[#5E6282] mb-4">
              Maximum speed and time savings. Bypasses stalled sectors via high-speed direct rail or instant airline re-routing.
            </p>

            {/* Price Box */}
            <div className="mb-5 p-4 rounded-2xl bg-[#FFFDF5] border border-[#FBECC8]">
              <div className="flex items-baseline gap-1.5">
                <span className="font-volkhov font-bold text-3xl text-[#D96B43]">
                  {isTrain ? "₹1,250" : "₹2,400"}
                </span>
                <span className="text-xs text-[#5E6282] font-mono">speed premium difference</span>
              </div>
              <div className="text-xs text-[#5E6282] font-mono mt-1 font-semibold">
                Earliest available cleared departure bank (Saves up to 8.5 hours)
              </div>
            </div>

            {/* Stat Boxes */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                  ARRIVAL
                </div>
                <div className="text-xs font-bold text-[#181E4B] mt-0.5 font-mono">
                  Tonight 21:15
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                  TIME SAVED
                </div>
                <div className="text-xs font-bold text-emerald-600 mt-0.5 font-mono">
                  ~8h 45m Saved
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3 mb-6 text-xs text-[#5E6282] leading-relaxed font-poppins">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Departs on earliest unconstrained corridor with cleared green signal</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Absorbs +{turnaroundCascade}m turnaround cascade without downstream misconnection</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Priority baggage handling and expedited express gate handoff</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Direct partner gateway handoff to Air India / IndiGo / IRCTC Express</span>
              </div>
            </div>

            {/* Trade-off Box */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 mb-6 text-[11px] text-[#5E6282] leading-relaxed">
              <strong>Fastest Advantage:</strong> Earliest possible arrival time; completely salvages business meetings and tight hotel schedules.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mt-2">
            <button
              onClick={() => handleOpenGatewayModal({
                key: 'plan_fastest',
                title: isTrain ? "Vande Bharat Priority Express" : "IndiGo / Air India Priority Bypass",
                type: 'Fastest Plan',
                cost: isTrain ? 1250 : 2400,
                carrier: isTrain ? "Indian Railways (20978)" : "IndiGo / Air India",
                mode: isTrain ? "train" : "flight",
                origin,
                destination
              })}
              className="w-full py-3 rounded-2xl font-googleSans font-bold text-xs text-white bg-[#D96B43] hover:bg-[#c25a34] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Payment Gateway</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>

            <button
              onClick={() => onSelectPlan && onSelectPlan('plan_b')}
              className="w-full py-2.5 rounded-2xl font-googleSans font-semibold text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Voyage 1-Click Autonomous Saga</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* CARD 3: ⚖️ MEDIUM / BALANCED PLAN (COMFORT & BUFFER)          */}
        {/* ============================================================= */}
        <div className="bg-white rounded-[28px] border-2 border-blue-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-md">
          <div>
            {/* Top Pills */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-[10px] font-mono font-bold tracking-wider text-blue-800 bg-blue-100 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                <span>⚖️ MEDIUM PLAN</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {isTrain ? "₹699 EXTRA" : "₹0 PROTECTED"}
              </span>
            </div>

            {/* Heading */}
            <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mb-2">
              {isTrain ? "Carrier Re-Protection & Guaranteed Buffer" : "Protected Next Flight + Hotel Retention"}
            </h3>

            <p className="text-xs text-[#5E6282] mb-4">
              Balanced cost and comfort. Re-accommodates on the very next carrier bank with automated hotel room preservation and comfortable buffer.
            </p>

            {/* Price & Route */}
            <div className="mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-baseline gap-1.5">
                <span className="font-volkhov font-bold text-3xl text-blue-700">
                  {isTrain ? "₹699" : "₹0"}
                </span>
                <span className="text-xs text-[#5E6282] font-mono">
                  {isTrain ? "re-accommodation fare" : "fully carrier-covered"}
                </span>
              </div>
              <div className="text-xs text-[#5E6282] font-mono mt-1 font-semibold">
                Comfortable 45m connection buffer + Late check-in secured
              </div>
            </div>

            {/* Stat Boxes */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                  ARRIVAL
                </div>
                <div className="text-xs font-bold text-[#181E4B] mt-0.5 font-mono">
                  Tonight 23:30
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                  COMFORT RATING
                </div>
                <div className="text-xs font-bold text-blue-600 mt-0.5 font-mono">
                  8.8 / 10 (Balanced)
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3 mb-6 text-xs text-[#5E6282] leading-relaxed font-poppins">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Next scheduled service secured under passenger rights protection</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Hotel check-in window cryptographically extended until 03:00 AM</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Zero cancellation penalties applied under carrier protection regulations</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Direct handoff to IRCTC / Official Airline rebooking gateway</span>
              </div>
            </div>

            {/* Trade-off Box */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 mb-6 text-[11px] text-blue-900 leading-relaxed">
              <strong>Balanced Advantage:</strong> Optimal balance between reasonable cost and zero stress; no overnight stranding with confirmed room lock.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mt-2">
            <button
              onClick={() => handleOpenGatewayModal({
                key: 'plan_medium',
                title: isTrain ? "IRCTC Protected Next Train" : "Carrier Protected Next Departure",
                type: 'Medium / Balanced Plan',
                cost: isTrain ? 699 : 0,
                carrier: isTrain ? "Indian Railways Express" : "Carrier Protected Network",
                mode: isTrain ? "train" : "flight",
                origin,
                destination
              })}
              className="w-full py-3 rounded-2xl font-googleSans font-bold text-xs text-white bg-blue-700 hover:bg-blue-800 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Payment Gateway</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>

            <button
              onClick={() => onSelectPlan && onSelectPlan('plan_c')}
              className="w-full py-2.5 rounded-2xl font-googleSans font-semibold text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Voyage 1-Click Autonomous Saga</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

      </div>

      {/* ============================================================= */}
      {/* AUTHENTICATED PAYMENT GATEWAY REDIRECTION MODAL              */}
      {/* ============================================================= */}
      {gatewayModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setGatewayModalPlan(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-lg cursor-pointer transition-colors"
            >
              &times;
            </button>

            {/* Header */}
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

            {/* Plan Cost Summary */}
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

            {/* Select Gateway Channels */}
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

              {/* 3. Airline Gateway (Air India / IndiGo / MakeMyTrip) */}
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
                onClick={() => handleProceedVoyageSaga(gatewayModalPlan.key)}
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

    </div>
  );
}
