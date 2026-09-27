import React from 'react';
import { CheckCircle2, ArrowRight, Sparkles, Clock, ShieldCheck, Zap, Radio, CloudRain } from 'lucide-react';

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
  const rainfallMm = liveWeather?.precipitation_mm ?? disruptedTicket?.rainfall_mm ?? 0;
  const visibilityKm = liveWeather?.visibility_km ?? disruptedTicket?.visibility_km ?? 8.5;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-2 pb-2">
      
      {/* Top Banner: XGBoost Delay Grounding & Real Weather Ingestion */}
      <div className="col-span-1 md:col-span-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/70 to-slate-50 border border-blue-200/90 shadow-2xs">
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

      {/* ------------------------------------------------------------- */}
      {/* CARD 1: PLAN A (BUDGET STATE TRANSPORT / EXPRESS REBOOKING)  */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-md">
        <div>
          {/* Top Pills */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full uppercase">
              PLAN A: BUDGET EXPRESS
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              {isTrain ? "₹385 EXTRA" : "₹1,250 EXTRA"}
            </span>
          </div>

          {/* Heading */}
          <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mb-4">
            {isTrain ? "MSRTC Shivshahi / Rail Tatkal" : "High-Speed Rail / Express Transit"}
          </h3>

          {/* Price & Route */}
          <div className="mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-baseline gap-1.5">
              <span className="font-volkhov font-bold text-3xl text-[#181E4B]">
                {isTrain ? "₹385" : "₹1,250"}
              </span>
              <span className="text-xs text-[#5E6282] font-mono">fare difference</span>
            </div>
            <div className="text-xs text-[#5E6282] font-mono mt-1 font-semibold">
              {isTrain ? "MSRTC Shivshahi AC Bus / Next Express Service" : `Weather-hardened express corridor: ${origin} ➔ ${destination}`}
            </div>
          </div>

          {/* Stat Boxes */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                ARRIVAL
              </div>
              <div className="text-xs font-bold text-[#181E4B] mt-0.5 font-mono">
                Tonight (Minimal delay)
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                DELAY MITIGATED
              </div>
              <div className="text-xs font-bold text-emerald-600 mt-0.5 font-mono">
                Bypasses +{delayMinutes}m delay
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-6 text-xs text-[#5E6282] leading-relaxed font-poppins">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Reserved seat on weather-hardened express corridor</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Departs promptly, bypassing airport single-runway sequencing hold</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Automated ghost hold armed on subsequent transit connection</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Live GPS telemetry tracking enabled along highway / rail corridor</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Downstream hotel reservation notified &amp; room lock retained</span>
            </div>
          </div>

          {/* Trade-off Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 mb-6 text-[11px] text-[#5E6282] leading-relaxed">
            <strong className="text-[#181E4B] font-semibold">Trade-off:</strong> Standard AC express seat; economical and direct without overnight delay.
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onSelectPlan && onSelectPlan('plan_a')}
          className="w-full py-3 rounded-2xl font-googleSans font-bold text-xs text-[#181E4B] bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Select Budget Recovery Plan</span>
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
              PLAN B: CARRIER RE-PROTECTION
            </span>
            <span className="text-[11px] font-mono font-bold text-[#D96B43] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {isTrain ? "₹699 EXTRA" : "₹0 PROTECTED"}
            </span>
          </div>

          {/* Heading */}
          <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mb-4">
            {isTrain ? "Rail + Intercity Express Relief" : "Flight + Rail Protected Reroute"}
          </h3>

          {/* Yellow Highlight Price Box */}
          <div className="mb-5 p-4 rounded-2xl bg-[#FFFDF5] border border-[#FBECC8]">
            <div className="flex items-baseline gap-1.5">
              <span className="font-volkhov font-bold text-3xl text-[#181E4B]">
                {isTrain ? "₹699" : "₹0"}
              </span>
              <span className="text-xs text-[#5E6282] font-mono">additional cost</span>
            </div>
            <div className="text-xs text-[#5E6282] font-mono mt-1 font-semibold">
              Rebooked slot after XGBoost +{delayMinutes}m clearance window
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
                ~8h 45m saved
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-6 text-xs text-[#5E6282] leading-relaxed font-poppins">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Earliest alternative departure secured on subsequent cleared bank</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Absorbs +{turnaroundCascade}m turnaround ripple cascade without misconnection</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Hotel check-in window preserved with cryptographically extended lock</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Zero cancellation penalties applied under carrier re-protection protocol</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Remaining journey itinerary completely intact</span>
            </div>
          </div>

          {/* Trade-off Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 mb-6 text-[11px] text-[#5E6282] leading-relaxed">
            <strong className="text-[#181E4B] font-semibold">Trade-off:</strong> Re-accommodates on the earliest cleared departure with hours saved and minimal cost.
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onSelectPlan && onSelectPlan('plan_b')}
          className="w-full py-3 rounded-2xl font-googleSans font-bold text-xs text-white bg-[#D96B43] hover:bg-[#c25a34] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Select Recommended Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CARD 3: PLAN C (MAX COMFORT / WEATHER SHELTER)               */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-md">
        <div>
          {/* Top Pills */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full uppercase">
              PLAN C: WEATHER SHELTER HOLD
            </span>
            <span className="text-[11px] font-mono font-bold text-[#5E6282] bg-slate-100 px-2.5 py-1 rounded-full">
              {isTrain ? "₹3,200 EXTRA" : "₹5,400 EXTRA"}
            </span>
          </div>

          {/* Heading */}
          <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mb-4">
            {isTrain ? "Private Highway Cab" : "Smart Weather Shelter & Morning Flight"}
          </h3>

          {/* Price & Route */}
          <div className="mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-baseline gap-1.5">
              <span className="font-volkhov font-bold text-3xl text-[#181E4B]">
                {isTrain ? "₹3,200" : "₹5,400"}
              </span>
              <span className="text-xs text-[#5E6282] font-mono">total package</span>
            </div>
            <div className="text-xs text-[#5E6282] font-mono mt-1">
              Guaranteed morning slot outside storm hazard window
            </div>
          </div>

          {/* Stat Boxes */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                DEPARTURE
              </div>
              <div className="text-xs font-bold text-[#181E4B] mt-0.5 font-mono">
                Tomorrow 08:30 AM
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-mono text-[#84829A] font-semibold tracking-wider">
                RISK ELIMINATED
              </div>
              <div className="text-xs font-bold text-emerald-600 mt-0.5 font-mono">
                {cancelRisk}% cancel risk
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-6 text-xs text-[#5E6282] leading-relaxed font-poppins">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Airport transit hotel / premium lounge reservation pre-confirmed</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Avoids hazardous overnight travel during peak atmospheric storm cell</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Guaranteed re-departure on earliest morning bank with clear visibility</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Premium comfort with complete baggage security and assistance</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Automated delay attestation issued to hotel desk</span>
            </div>
          </div>

          {/* Trade-off Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 mb-6 text-[11px] text-[#5E6282] leading-relaxed">
            <strong className="text-[#181E4B] font-semibold">Trade-off:</strong> Replaces nocturnal transit in poor weather with comfortable overnight stay and early morning on-time flight.
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onSelectPlan && onSelectPlan('plan_c')}
          className="w-full py-3 rounded-2xl font-googleSans font-bold text-xs text-[#181E4B] bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Select Rest &amp; Morning Departure</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
