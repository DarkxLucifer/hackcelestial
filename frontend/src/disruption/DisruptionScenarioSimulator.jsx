import React, { useState } from 'react';
import { 
  Zap, Clock, ShieldCheck, CheckCircle2, ArrowRight, RotateCcw, 
  Train, Plane, Bus, CloudRain, CloudFog, CloudLightning, Sparkles
} from 'lucide-react';

const TRANSIT_CORRIDORS = [
  {
    id: "bom_del",
    label: "Mumbai (CSMT/BOM) ➔ Delhi (NDLS/DEL)",
    origin: "BOM",
    originCity: "Mumbai",
    destination: "DEL",
    destinationCity: "Delhi",
    icon: Train
  },
  {
    id: "ngp_bom",
    label: "Nagpur (NGP) ➔ Mumbai (CSMT)",
    origin: "NGP",
    originCity: "Nagpur",
    destination: "CSMT",
    destinationCity: "Mumbai CSMT",
    icon: Train
  },
  {
    id: "del_bom_air",
    label: "Delhi (DEL) ➔ Mumbai (BOM) [Air Corridor]",
    origin: "DEL",
    originCity: "Delhi IGI",
    destination: "BOM",
    destinationCity: "Mumbai",
    icon: Plane
  },
  {
    id: "zrh_zermatt",
    label: "Zurich (ZRH) ➔ Zermatt (Alpine Link)",
    origin: "ZRH",
    originCity: "Zurich",
    destination: "ZERMATT",
    destinationCity: "Zermatt",
    icon: Train
  }
];

export default function DisruptionScenarioSimulator({ 
  onSimulateScenario, 
  onClearScenario, 
  isSimulatingActive = false 
}) {
  const [selectedCorridorId, setSelectedCorridorId] = useState("bom_del");
  const [activeSimulatedPlan, setActiveSimulatedPlan] = useState(null);

  const currentCorridor = TRANSIT_CORRIDORS.find(c => c.id === selectedCorridorId) || TRANSIT_CORRIDORS[0];

  // The 3 Plan Cards: Cheapest, Medium, Fastest (Pure Black & White Theme)
  const SIMULATION_PLANS = [
    {
      id: "cheapest",
      categoryBadge: "🟢 CHEAPEST PLAN",
      categoryTitle: "Budget / Value-First Alternative",
      categoryTheme: {
        border: "border-black hover:border-neutral-800",
        badgeBg: "bg-black text-white",
        badgeDot: "bg-white",
        priceColor: "text-black",
        cardBg: "bg-white",
        buttonBg: "bg-black hover:bg-neutral-800 text-white shadow-xs"
      },
      title: "State Bus / Regional Tatkal Rail",
      operator: "MSRTC Shivshahi / Intercity Express",
      serviceNumber: "12810 Express",
      netFare: "₹385",
      fareSubtext: "Lowest extra out-of-pocket",
      delayMins: 45,
      weatherCondition: "Torrential Rain & Track Waterlogging",
      weatherIcon: CloudRain,
      weatherStats: "42mm Rain • 26°C • Wind 38km/h",
      reason: `Waterlogging on slow tracks between Kalyan & Thane; +45m speed restriction. Recovery via scheduled state bus/tatkal rail connection.`,
      highlights: [
        "Reserved AC sleeper on weather-hardened state road corridor",
        "Full statutory IRCTC TDR & refund filing assistance",
        "Lowest extra expense — zero airline surge fare pricing"
      ],
      estimatedDuration: "Tonight (Guaranteed)",
      costRating: "Lowest Cost Profile",
      xgboostDelay: 45
    },
    {
      id: "medium",
      categoryBadge: "⚖️ MEDIUM PLAN",
      categoryTitle: "Balanced Comfort & Reliability",
      categoryTheme: {
        border: "border-black hover:border-neutral-800",
        badgeBg: "bg-black text-white",
        badgeDot: "bg-white",
        priceColor: "text-black",
        cardBg: "bg-white",
        buttonBg: "bg-black hover:bg-neutral-800 text-white shadow-xs"
      },
      title: "3-Tier AC Superfast / AC Intercity",
      operator: "Indian Railways Superfast (Tatkal Guard)",
      serviceNumber: "12952 Rajdhani Relay",
      netFare: "₹1,250",
      fareSubtext: "Optimal price-to-comfort ratio",
      delayMins: 65,
      weatherCondition: "Dense Winter Fog & Reduced Visibility",
      weatherIcon: CloudFog,
      weatherStats: "Dense Fog • 12°C • RVR 200m",
      reason: `Dense radiation fog causing CAT-III B speed holds (+65m delay). Recovery via reserved 3AC berth with synchronized connection buffer.`,
      highlights: [
        "Guaranteed 3AC / premium coach seat with meal buffer",
        "Hotel check-in hold coordinated with partner property",
        "Optimal balance between transit cost and rest comfort"
      ],
      estimatedDuration: "Evening Buffer + Rest",
      costRating: "Moderate & Re-protected",
      xgboostDelay: 65
    },
    {
      id: "fastest",
      categoryBadge: "⚡ FASTEST PLAN",
      categoryTitle: "Speed Priority & Earliest Arrival",
      categoryTheme: {
        border: "border-black hover:border-neutral-800",
        badgeBg: "bg-black text-white",
        badgeDot: "bg-white",
        priceColor: "text-black",
        cardBg: "bg-white",
        buttonBg: "bg-black hover:bg-neutral-800 text-white shadow-xs"
      },
      title: "Vande Bharat Express / Air Shuttle Bypass",
      operator: "Priority Air Shuttle / Vande Bharat Executive",
      serviceNumber: "20978 Vande Bharat / AI 887",
      netFare: "₹3,400",
      fareSubtext: "Fastest route bypass (saves 4h 30m)",
      delayMins: 90,
      weatherCondition: "Severe Convective Storm & Track Obstruction",
      weatherIcon: CloudLightning,
      weatherStats: "Severe Storm • 28°C • Wind 58km/h",
      reason: `Primary transit corridor blocked (+90m delay). Direct bypass via high-speed Vande Bharat or express flight to reach destination on schedule.`,
      highlights: [
        "Bypasses congested bottleneck — saves 4 to 6 hours",
        "Instant priority boarding & terminal fast-track transit",
        "Guaranteed earliest arrival at destination before business hours"
      ],
      estimatedDuration: "Earliest Arrival (Saves 4h+)",
      costRating: "Speed Priority",
      xgboostDelay: 90
    }
  ];

  const handleTriggerPlan = (plan) => {
    setActiveSimulatedPlan(plan.id);

    const scenarioPayload = {
      pnr: "SIM-" + Math.floor(100000 + Math.random() * 900000),
      carrier: plan.operator,
      service_number: plan.serviceNumber,
      origin: currentCorridor.origin,
      destination: currentCorridor.destination,
      delay_minutes: plan.delayMins,
      reason: plan.reason,
      weather_condition: plan.weatherCondition,
      rainfall_mm: plan.id === "cheapest" ? 42 : (plan.id === "fastest" ? 25 : 0),
      temperature_c: plan.id === "cheapest" ? 26 : (plan.id === "medium" ? 12 : 28),
      wind_speed_kmh: plan.id === "cheapest" ? 38 : (plan.id === "fastest" ? 58 : 10),
      visibility_km: plan.id === "medium" ? 0.3 : 4.0,
      xgboost_prediction: {
        predicted_delay_mins: plan.xgboostDelay,
        primary_weather_mins: Math.round(plan.xgboostDelay * 0.65),
        turnaround_cascade_mins: Math.round(plan.xgboostDelay * 0.35),
        runway_throughput_pct: plan.id === "fastest" ? 60 : 75,
        cancellation_probability_pct: plan.id === "fastest" ? 8.2 : 14.5
      },
      selected_recovery_type: plan.id,
      isSimulated: true
    };

    if (onSimulateScenario) {
      onSimulateScenario(scenarioPayload);
    }

    // Scroll smoothly to recovery plans section with redirection buttons
    setTimeout(() => {
      const el = document.getElementById('recovery-plans-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleReset = () => {
    setActiveSimulatedPlan(null);
    if (onClearScenario) {
      onClearScenario();
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200/90 shadow-sm space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-black text-white shadow-xs">
              <Zap className="w-5 h-5" />
            </span>
            <h3 className="font-volkhov font-bold text-2xl text-black">
              Simulate Disruption
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 max-w-2xl leading-relaxed">
            Select a disruption scenario below to test real-world delays, view live cascade topology, and unlock recovery routes with instant payment gateway redirection.
          </p>
        </div>

        {/* Reset Button (Visible if simulation is active) */}
        {isSimulatingActive && (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 transition-all flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4 text-black" />
            <span>Reset Simulation</span>
          </button>
        )}
      </div>

      {/* Corridor Quick Selector (Pure Black & White) */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 font-mono">
          Select Travel Corridor
        </label>
        <div className="flex flex-wrap gap-2">
          {TRANSIT_CORRIDORS.map(corridor => {
            const Icon = corridor.icon;
            const isSelected = corridor.id === selectedCorridorId;
            return (
              <button
                key={corridor.id}
                type="button"
                onClick={() => setSelectedCorridorId(corridor.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-black text-white border-black shadow-xs font-bold"
                    : "bg-white text-black hover:bg-neutral-100 border-neutral-300 font-medium"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-black"}`} />
                <span>{corridor.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Simulation Status Banner */}
      {isSimulatingActive && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
            <span className="font-semibold">
              Simulation Active on <strong>{currentCorridor.label}</strong>. Recovery plans with payment gateway redirects generated below!
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('recovery-plans-section');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="px-3 py-1.5 rounded-xl font-bold bg-[#181E4B] text-white hover:bg-[#283177] transition-all flex items-center gap-1.5 cursor-pointer text-xs shadow-xs"
          >
            <span>Jump to Recovery Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* THREE PLAN CARDS: CHEAPEST, MEDIUM, FASTEST (Pure Black & White) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
        {SIMULATION_PLANS.map((plan) => {
          const WeatherIcon = plan.weatherIcon;
          const isSelected = activeSimulatedPlan === plan.id;
          const theme = plan.categoryTheme;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border-2 ${theme.border} bg-white p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl relative group ${
                isSelected ? "ring-2 ring-black shadow-lg" : "shadow-xs"
              }`}
            >
              <div>
                {/* Category Badge & Additional Cost */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-mono font-bold tracking-wider px-3 py-1 rounded-full uppercase flex items-center gap-1.5 ${theme.badgeBg}`}>
                    <span className={`w-2 h-2 rounded-full ${theme.badgeDot} animate-pulse`} />
                    <span>{plan.categoryBadge}</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-black bg-white px-2.5 py-1 rounded-full border border-black shadow-2xs">
                    {plan.netFare} EXTRA
                  </span>
                </div>

                {/* Title & Operator */}
                <h4 className="font-volkhov font-bold text-xl text-black mb-1">
                  {plan.title}
                </h4>
                <div className="text-xs text-neutral-600 font-medium mb-3">
                  Operator: <strong className="text-black">{plan.operator}</strong>
                </div>

                <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                  {plan.categoryTitle}. Ingests simulated {plan.delayMins}m disruption on {currentCorridor.origin} ➔ {currentCorridor.destination}.
                </p>

                {/* Fare & Delay Decomposition Box (Monochrome) */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 mb-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-volkhov font-extrabold text-2xl text-black">
                        {plan.netFare}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono ml-1.5">net extra</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-extrabold text-black bg-neutral-200/80 px-2 py-0.5 rounded border border-neutral-300">
                        +{plan.delayMins}m delay
                      </span>
                      <span className="block text-[10px] text-neutral-500 mt-0.5">simulated risk</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 flex items-center gap-2 text-xs text-neutral-800 font-medium">
                    <WeatherIcon className="w-4 h-4 text-black shrink-0" />
                    <span className="truncate">{plan.weatherStats}</span>
                  </div>
                </div>

                {/* Highlights List (Monochrome) */}
                <div className="space-y-2.5 mb-6 text-xs text-neutral-700 font-poppins">
                  {plan.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                      <span className="leading-snug">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Click Action Button (Pure Black) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleTriggerPlan(plan)}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md bg-black hover:bg-neutral-800 text-white transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Simulate {plan.id === 'cheapest' ? 'Cheapest' : (plan.id === 'medium' ? 'Medium' : 'Fastest')} Plan</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
                <div className="text-center mt-2">
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Instant 1-Click XGBoost &amp; Gateway Redirect
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
