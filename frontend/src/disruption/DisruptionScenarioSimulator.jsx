import React, { useState } from 'react';
import { 
  CloudRain, Wind, Thermometer, Clock, AlertTriangle, 
  Sparkles, CheckCircle2, ArrowRight, Play, RotateCcw, 
  Sliders, Train, Plane, MapPin, ShieldAlert, Zap,
  CloudSnow, CloudFog, CloudLightning, Compass, Radio
} from 'lucide-react';
import { fetchLiveWeather, simulateXGBoostScenario } from '../api';

const REAL_BASIS_PRESETS = [
  {
    id: "monsoon_mumbai",
    title: "Central Railway Monsoon Waterlogging",
    badge: "Monsoonal Deluge",
    carrier: "Indian Railways",
    service_number: "12810 Howrah-Mumbai Mail",
    origin: "NGP",
    originName: "Nagpur (NGP)",
    destination: "CSMT",
    destinationName: "Mumbai CSMT",
    delay_minutes: 45,
    weather_condition: "Torrential Rain Showers",
    weather_icon: "🌧️",
    rainfall_mm: 42,
    temperature_c: 26,
    wind_speed_kmh: 38,
    reason: "Severe track waterlogging between Kalyan & Thane; speed restriction to 25 km/h on slow line",
    real_basis_note: "Grounded in Central Railway monsoon operating protocols and historical monsoon delays",
    accentColor: "border-blue-300 bg-blue-50/60 text-blue-900"
  },
  {
    id: "fog_delhi",
    title: "Northern India Winter Fog Ground Hold",
    badge: "Dense Radiation Fog",
    carrier: "Air India",
    service_number: "AI 887",
    origin: "DEL",
    originName: "Delhi (DEL/IGI)",
    destination: "BOM",
    destinationName: "Mumbai (BOM)",
    delay_minutes: 65,
    weather_condition: "Dense Fog / Low Visibility",
    weather_icon: "🌫️",
    rainfall_mm: 0,
    temperature_c: 9,
    wind_speed_kmh: 8,
    reason: "Runway Visual Range (RVR) < 125m at IGI T3; CAT III single-runway departure sequencing",
    real_basis_note: "Grounded in CAT-III B low-visibility procedures and flights.csv winter delay distributions",
    accentColor: "border-amber-300 bg-amber-50/60 text-amber-900"
  },
  {
    id: "blizzard_swiss",
    title: "Alpine Avalanche & Glacier Snowstorm",
    badge: "Sub-Zero Blizzard",
    carrier: "Swiss Federal Railways (SBB)",
    service_number: "IR90 Matterhorn Link",
    origin: "ZRH",
    originName: "Zurich Airport (ZRH)",
    destination: "ZERMATT",
    destinationName: "Zermatt Resort",
    delay_minutes: 80,
    weather_condition: "Severe Snowfall / Blizzard",
    weather_icon: "❄️",
    rainfall_mm: 18,
    temperature_c: -5,
    wind_speed_kmh: 55,
    reason: "Heavy snowfall and avalanche risk between Visp and Tasch; cogwheel track de-icing protocol active",
    real_basis_note: "Grounded in SBB Alpine winter safety contingency guidelines and hotel cutoff risks",
    accentColor: "border-sky-300 bg-sky-50/60 text-sky-900"
  }
];

export default function DisruptionScenarioSimulator({ onSimulateScenario, onClearScenario, isSimulatingActive = false }) {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'presets' | 'custom'

  // Live real-world weather predictor state
  const [liveOrigin, setLiveOrigin] = useState('BOM');
  const [liveDestination, setLiveDestination] = useState('DEL');
  const [liveCarrier, setLiveCarrier] = useState('IndiGo Airlines');
  const [liveService, setLiveService] = useState('6E 534');
  const [liveIsRail, setLiveIsRail] = useState(false);
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [liveTelemetry, setLiveTelemetry] = useState(null);
  const [liveXgbResult, setLiveXgbResult] = useState(null);

  // Custom scenario input state
  const [carrierType, setCarrierType] = useState('Flight');
  const [carrierName, setCarrierName] = useState('IndiGo Airlines');
  const [serviceNumber, setServiceNumber] = useState('6E 534');
  const [origin, setOrigin] = useState('BOM');
  const [destination, setDestination] = useState('DEL');
  const [delayMinutes, setDelayMinutes] = useState(55);
  const [weatherType, setWeatherType] = useState('rain'); // 'rain' | 'fog' | 'snow' | 'crosswind'
  const [customReason, setCustomReason] = useState('Heavy monsoonal precipitation and reduced runway friction');

  const fetchAndPredictRealWeather = async (orig = liveOrigin, dest = liveDestination, carrier = liveCarrier, service = liveService, isRail = liveIsRail) => {
    setIsFetchingLive(true);
    try {
      const weather = await fetchLiveWeather(orig);
      if (weather) {
        setLiveTelemetry(weather);
        const rain = Number(weather.precipitation_mm || weather.rain_mm || 0);
        const wind = Number(weather.wind_speed_kmh || 12);
        const vis = Number(weather.visibility_km || 10);
        const temp = Number(weather.temperature_c || 25);

        const payload = {
          rainfall_mm: rain,
          wind_speed_kmh: wind,
          visibility_km: vis,
          temperature_c: temp,
          dep_hour: new Date().getHours(),
          distance_km: 850,
          scheduled_buffer_mins: 45,
          is_rail: isRail ? 1 : 0,
          carrier_name: carrier,
          service_number: service,
          origin_code: orig,
          dest_code: dest
        };
        const xgbRes = await simulateXGBoostScenario(payload);
        if (xgbRes && xgbRes.predictions) {
          setLiveXgbResult(xgbRes);
        }
      }
    } catch (e) {
      console.error("Live weather prediction error:", e);
    } finally {
      setIsFetchingLive(false);
    }
  };

  const handleApplyLivePrediction = () => {
    if (!liveXgbResult || !liveTelemetry) return;
    onSimulateScenario({
      pnr: "SIM-" + Math.floor(100000 + Math.random() * 900000),
      carrier: liveCarrier,
      service_number: liveService,
      origin: liveOrigin,
      destination: liveDestination,
      delay_minutes: liveXgbResult.predictions.predicted_delay_mins,
      reason: `XGBoost Predicted Delay (+${liveXgbResult.predictions.predicted_delay_mins}m): ${liveTelemetry.condition} at ${liveTelemetry.location_name} (${liveTelemetry.precipitation_mm}mm rain, ${liveTelemetry.wind_speed_kmh}km/h wind, ${liveTelemetry.visibility_km}km visibility)`,
      weather_condition: liveTelemetry.condition,
      rainfall_mm: liveTelemetry.precipitation_mm,
      temperature_c: liveTelemetry.temperature_c,
      wind_speed_kmh: liveTelemetry.wind_speed_kmh,
      visibility_km: liveTelemetry.visibility_km,
      xgboost_prediction: liveXgbResult.predictions,
      isSimulated: true
    });
  };

  const handleApplyPreset = (preset) => {
    onSimulateScenario({
      pnr: "SIM-" + Math.floor(100000 + Math.random() * 900000),
      carrier: preset.carrier,
      service_number: preset.service_number,
      origin: preset.origin,
      destination: preset.destination,
      delay_minutes: preset.delay_minutes,
      reason: preset.reason,
      weather_condition: preset.weather_condition,
      rainfall_mm: preset.rainfall_mm,
      temperature_c: preset.temperature_c,
      wind_speed_kmh: preset.wind_speed_kmh,
      visibility_km: preset.visibility_km || 10,
      isSimulated: true
    });
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    let rainMm = 0;
    let tempC = 26;
    let windKmh = 25;
    let visKm = 10;
    let weatherCond = "Moderate Rain";

    if (weatherType === 'rain') {
      rainMm = 38;
      tempC = 27;
      windKmh = 40;
      visKm = 1.8;
      weatherCond = "Heavy Rain / Downpour";
    } else if (weatherType === 'snow') {
      rainMm = 15;
      tempC = -3;
      windKmh = 50;
      visKm = 0.8;
      weatherCond = "Snowfall / Blizzard";
    } else if (weatherType === 'fog') {
      rainMm = 0;
      tempC = 11;
      windKmh = 6;
      visKm = 0.2;
      weatherCond = "Dense Radiation Fog";
    } else if (weatherType === 'crosswind') {
      rainMm = 5;
      tempC = 28;
      windKmh = 65;
      visKm = 3.5;
      weatherCond = "Severe Crosswind Shear";
    }

    onSimulateScenario({
      pnr: "SIM-" + Math.floor(100000 + Math.random() * 900000),
      carrier: carrierName,
      service_number: serviceNumber,
      origin: origin.trim().toUpperCase(),
      destination: destination.trim().toUpperCase(),
      delay_minutes: parseInt(delayMinutes, 10),
      reason: customReason || `${weatherCond} causing operational departure hold`,
      weather_condition: weatherCond,
      rainfall_mm: rainMm,
      temperature_c: tempC,
      wind_speed_kmh: windKmh,
      visibility_km: visKm,
      isSimulated: true
    });
  };

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
              <Zap className="w-4 h-4 text-blue-700" />
            </span>
            <h3 className="font-volkhov font-bold text-lg text-[#181E4B]">
              Simulate Disruption Scenario (Real Weather &amp; XGBoost Engine)
            </h3>
          </div>
          <p className="text-xs text-[#5E6282] mt-1 max-w-2xl leading-relaxed">
            Ingest live meteorological conditions from Open-Meteo API into trained XGBoost models to compute real delay risk and synthesize multi-modal recovery plans.
          </p>
        </div>

        {/* Mode switcher pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'live' ? 'bg-white text-[#181E4B] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Live Weather &amp; XGBoost
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'presets' ? 'bg-white text-[#181E4B] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Operational Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'custom' ? 'bg-white text-[#181E4B] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Custom Builder
          </button>
        </div>
      </div>

      {/* Active simulation alert banner if running */}
      {isSimulatingActive && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            <span className="font-semibold">
              Active Simulation Mode: Real-basis delay injected into topology. 3 Recovery Plans generated.
            </span>
          </div>
          {onClearScenario && (
            <button
              type="button"
              onClick={onClearScenario}
              className="px-3 py-1.5 rounded-xl font-bold bg-white text-slate-700 hover:bg-slate-50 border border-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Nominal State</span>
            </button>
          )}
        </div>
      )}

      {/* TAB 1: REAL-TIME CITY WEATHER & XGBOOST PREDICTOR */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                  Live Meteorological Corridor Query
                </span>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Select transit cities to fetch live Open-Meteo telemetry and feed real-world weather parameters directly into trained XGBoost Regressor &amp; Classifier.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fetchAndPredictRealWeather(liveOrigin, liveDestination, liveCarrier, liveService, liveIsRail)}
                disabled={isFetchingLive}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#181E4B] text-white hover:bg-[#283177] flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{isFetchingLive ? 'Querying Live Weather...' : '⚡ Ingest Live Weather & Predict'}</span>
              </button>
            </div>

            {/* Inputs: Origin, Destination, Carrier, Service, Mode */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Origin Hub</label>
                <select
                  value={liveOrigin}
                  onChange={(e) => setLiveOrigin(e.target.value)}
                  className="w-full mt-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                >
                  <option value="BOM">Mumbai (BOM)</option>
                  <option value="DEL">Delhi IGI (DEL)</option>
                  <option value="NGP">Nagpur (NGP)</option>
                  <option value="BLR">Bangalore (BLR)</option>
                  <option value="HYD">Hyderabad (HYD)</option>
                  <option value="MAA">Chennai (MAA)</option>
                  <option value="CCU">Kolkata (CCU)</option>
                  <option value="ZRH">Zurich (ZRH)</option>
                  <option value="LHR">London (LHR)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Destination Hub</label>
                <select
                  value={liveDestination}
                  onChange={(e) => setLiveDestination(e.target.value)}
                  className="w-full mt-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                >
                  <option value="DEL">Delhi IGI (DEL)</option>
                  <option value="BOM">Mumbai (BOM)</option>
                  <option value="NGP">Nagpur (NGP)</option>
                  <option value="BLR">Bangalore (BLR)</option>
                  <option value="HYD">Hyderabad (HYD)</option>
                  <option value="MAA">Chennai (MAA)</option>
                  <option value="CCU">Kolkata (CCU)</option>
                  <option value="ZERMATT">Zermatt</option>
                  <option value="ZRH">Zurich (ZRH)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Carrier</label>
                <input
                  type="text"
                  value={liveCarrier}
                  onChange={(e) => setLiveCarrier(e.target.value)}
                  className="w-full mt-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Service #</label>
                <input
                  type="text"
                  value={liveService}
                  onChange={(e) => setLiveService(e.target.value)}
                  className="w-full mt-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Transport Mode</label>
                <div className="flex items-center gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() => setLiveIsRail(false)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                      !liveIsRail ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Plane className="w-3 h-3" />
                    <span>Air</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiveIsRail(true)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                      liveIsRail ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Train className="w-3 h-3" />
                    <span>Rail</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Weather & XGBoost Output Cards */}
          {liveTelemetry && liveXgbResult && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{liveTelemetry.icon || '⛅'}</span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      Live Telemetry: {liveTelemetry.location_name} — {liveTelemetry.condition}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {liveTelemetry.temperature_c}°C • Wind {liveTelemetry.wind_speed_kmh} km/h • Rain {liveTelemetry.precipitation_mm}mm • Visibility {liveTelemetry.visibility_km} km
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyLivePrediction}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D96B43] text-white hover:bg-[#c25a34] flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Simulate Real Disruption &amp; Generate Recovery Plans</span>
                </button>
              </div>

              {/* Prediction summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">XGBoost Predicted Delay</span>
                  <div className="text-2xl font-black text-rose-600 mt-1">
                    +{liveXgbResult.predictions.predicted_delay_mins}m
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    CI: +{liveXgbResult.predictions.delay_confidence_interval[0]}m – +{liveXgbResult.predictions.delay_confidence_interval[1]}m
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Weather Delay</span>
                  <div className="text-xl font-bold text-slate-800 mt-1">
                    +{liveXgbResult.predictions.primary_weather_mins}m
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Turnaround cascade: +{liveXgbResult.predictions.turnaround_cascade_mins}m
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Runway / Track Capacity</span>
                  <div className="text-xl font-bold text-slate-800 mt-1">
                    {liveXgbResult.predictions.runway_throughput_pct}%
                  </div>
                  <span className="text-[10px] text-rose-600 font-semibold">
                    -{liveXgbResult.predictions.capacity_reduction_pct}% capacity loss
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Cancellation Risk</span>
                  <div className="text-xl font-bold text-slate-800 mt-1">
                    {liveXgbResult.predictions.cancellation_probability_pct}%
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Risk: {liveXgbResult.predictions.risk_level}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 1-Click Real-Basis Historical Presets */}
      {activeTab === 'presets' && (
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Select a Grounded Real-World Case:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REAL_BASIS_PRESETS.map((preset) => (
              <div 
                key={preset.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between hover:shadow-md ${preset.accentColor}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xl">{preset.weather_icon}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/90 border border-slate-200">
                      {preset.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {preset.title}
                  </h4>

                  <div className="mt-2 text-xs font-mono font-bold text-[#181E4B]">
                    {preset.carrier} • {preset.service_number}
                  </div>

                  <div className="text-xs text-slate-700 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{preset.originName} ➔ {preset.destinationName}</span>
                  </div>

                  <div className="mt-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/70 text-[11px] text-slate-700 space-y-1">
                    <div className="font-bold text-rose-700">
                      Delay: +{preset.delay_minutes} minutes
                    </div>
                    <div className="line-clamp-2 text-slate-600">
                      {preset.reason}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await fetchAndPredictRealWeather(preset.origin, preset.destination, preset.carrier, preset.service_number, preset.carrier.toLowerCase().includes('rail') || preset.carrier.toLowerCase().includes('railways'));
                      setActiveTab('live');
                    }}
                    className="px-2.5 py-1.5 rounded-xl font-bold bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 transition text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Radio className="w-3 h-3 text-blue-600" />
                    <span>Live Weather</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#181E4B] text-white hover:bg-[#283177] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Simulate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Custom Scenario Builder */}
      {activeTab === 'custom' && (
        <form onSubmit={handleApplyCustom} className="space-y-4">
          
          {/* Live Weather Autofill in Custom Builder */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-blue-50/80 rounded-2xl border border-blue-200">
            <span className="text-xs font-semibold text-blue-900">
              Query live meteorological conditions for {origin} and compute ML delay:
            </span>
            <button
              type="button"
              onClick={async () => {
                const w = await fetchLiveWeather(origin);
                if (w) {
                  setCustomReason(`${w.condition} at ${w.location_name} (${w.temperature_c}°C, ${w.wind_speed_kmh}km/h wind, ${w.precipitation_mm}mm rain)`);
                  if (w.precipitation_mm > 5) setWeatherType('rain');
                  else if (w.visibility_km < 1) setWeatherType('fog');
                  else if (w.wind_speed_kmh > 45) setWeatherType('crosswind');
                  const payload = {
                    rainfall_mm: Number(w.precipitation_mm || 0),
                    wind_speed_kmh: Number(w.wind_speed_kmh || 12),
                    visibility_km: Number(w.visibility_km || 10),
                    temperature_c: Number(w.temperature_c || 25),
                    dep_hour: new Date().getHours(),
                    distance_km: 850,
                    scheduled_buffer_mins: 45,
                    is_rail: carrierName.toLowerCase().includes('rail') ? 1 : 0,
                    carrier_name: carrierName,
                    service_number: serviceNumber,
                    origin_code: origin,
                    dest_code: destination
                  };
                  const res = await simulateXGBoostScenario(payload);
                  if (res?.predictions) {
                    setDelayMinutes(res.predictions.predicted_delay_mins);
                  }
                }
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 transition cursor-pointer shadow-2xs"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Autofill Real Weather &amp; ML Delay</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Carrier Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Carrier &amp; Service:
              </label>
              <input
                type="text"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                placeholder="e.g. Air India Express"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#181E4B]"
                required
              />
            </div>

            {/* Service Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Service Number:
              </label>
              <input
                type="text"
                value={serviceNumber}
                onChange={(e) => setServiceNumber(e.target.value)}
                placeholder="e.g. AI-882 or 12810"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#181E4B]"
                required
              />
            </div>

            {/* Origin Hub */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Origin Transit Hub:
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#181E4B] cursor-pointer"
              >
                <option value="BOM">Mumbai (BOM/CSMT)</option>
                <option value="NGP">Nagpur (NGP)</option>
                <option value="DEL">Delhi (DEL/NDLS)</option>
                <option value="BLR">Bangalore (BLR)</option>
                <option value="LHR">London Heathrow (LHR)</option>
                <option value="ZRH">Zurich Airport (ZRH)</option>
                <option value="ORD">Chicago O'Hare (ORD)</option>
                <option value="JFK">New York JFK (JFK)</option>
              </select>
            </div>

            {/* Destination Hub */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination Hub:
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#181E4B] cursor-pointer"
              >
                <option value="CSMT">Mumbai CSMT</option>
                <option value="DEL">Delhi (DEL/NDLS)</option>
                <option value="BOM">Mumbai Airport (BOM)</option>
                <option value="VISP">Visp Station (Switzerland)</option>
                <option value="ZERMATT">Zermatt Resort</option>
                <option value="JFK">New York JFK</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Operational Delay Slider */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Simulated Operational Delay:
                </span>
                <span className="font-mono font-extrabold text-[#181E4B] text-sm">
                  +{delayMinutes} mins
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(e.target.value)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#181E4B]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Minor (+15m)</span>
                <span>Buffer Breached (+50m)</span>
                <span>Severe (+120m)</span>
              </div>
            </div>

            {/* Weather Condition Cause */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Atmospheric Weather Condition:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => { setWeatherType('rain'); setCustomReason('Heavy monsoon precipitation and runway waterlogging'); }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    weatherType === 'rain' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Rain</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setWeatherType('snow'); setCustomReason('Sub-zero blizzard and track freezing'); }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    weatherType === 'snow' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <CloudSnow className="w-3.5 h-3.5" />
                  <span>Snow</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setWeatherType('fog'); setCustomReason('Low visibility CAT III radiation fog hold'); }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    weatherType === 'fog' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <CloudFog className="w-3.5 h-3.5" />
                  <span>Fog</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setWeatherType('crosswind'); setCustomReason('Crosswind shear requiring single runway sequencing'); }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    weatherType === 'crosswind' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>Wind</span>
                </button>
              </div>
            </div>

          </div>

          {/* Detailed Reason string */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Disruption Cause Detail:
            </label>
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="e.g. Heavy monsoonal precipitation and reduced runway friction"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#181E4B]"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              Injects simulated parameters into the Topological Graph and activates 3 recovery plans.
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#181E4B] text-white hover:bg-[#283177] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Trigger Custom Disruption Scenario</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
