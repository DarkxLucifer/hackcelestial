import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Wind, Thermometer, Clock, ShieldAlert, 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, 
  Send, RefreshCw, Layers, Database, Cpu, Radio,
  Share2, MessageSquare, ThumbsUp, Activity, Compass,
  Sliders, Building2, Train, Plane, ExternalLink, Zap,
  Download, Eye, Copy, Check, X, FileText, Map, Play,
  RotateCcw, SlidersHorizontal, BarChart3, ShieldCheck
} from 'lucide-react';
import CartoJourneyMap from '../components/CartoJourneyMap';
import { 
  fetchLiveWeather, 
  fetchSocialSignals,
  fetchXGBoostPresets,
  simulateXGBoostScenario
} from '../api';

const DEFAULT_PRESETS = [
  {
    id: "monsoon_mumbai",
    title: "Mumbai Monsoon Runway Flooding & Rail Submersion",
    tag: "Monsoonal Deluge",
    carrier: "IndiGo Airlines / Indian Railways",
    service_number: "6E 534 / 12810 Mail",
    origin: "NGP",
    origin_name: "Nagpur (NGP)",
    destination: "BOM",
    destination_name: "Mumbai CSMT / BOM",
    dep_hour: 15,
    distance_km: 820,
    is_rail: 0,
    weather_type: "rain",
    rainfall_mm: 52.0,
    wind_speed_kmh: 46.0,
    visibility_km: 1.2,
    temperature_c: 26.0,
    scheduled_buffer_mins: 45,
    operational_context: "Kalyan-Kurla track submersion + BOM single-runway spacing under convective low-pressure cell",
    operational_contingency: "Runway flow control restriction active; speed restriction to 25 km/h on rail corridors; multi-modal ghost hold armed."
  },
  {
    id: "fog_delhi",
    title: "Delhi IGI CAT-III Radiation Inversion Fog",
    tag: "Dense Winter Fog",
    carrier: "Air India",
    service_number: "AI 882",
    origin: "DEL",
    origin_name: "Delhi IGI T3 (DEL)",
    destination: "BOM",
    destination_name: "Mumbai (BOM)",
    dep_hour: 7,
    distance_km: 1140,
    is_rail: 0,
    weather_type: "fog",
    rainfall_mm: 0.0,
    wind_speed_kmh: 6.0,
    visibility_km: 0.12,
    temperature_c: 7.5,
    scheduled_buffer_mins: 45,
    operational_context: "RVR drops below 125m; single-runway CAT III B ILS departure flow control in force",
    operational_contingency: "Single-runway CAT III B sequencing; holding pattern fuel burn escalation; priority re-accommodation on Vande Bharat rail relief corridor."
  },
  {
    id: "blizzard_swiss",
    title: "Swiss Alpine Glacier Blizzard & Mountain Hold",
    tag: "Sub-Zero Blizzard",
    carrier: "Swiss Federal Railways (SBB)",
    service_number: "IR90 Matterhorn Link",
    origin: "ZRH",
    origin_name: "Zurich Kloten (ZRH)",
    destination: "ZERMATT",
    destination_name: "Zermatt Resort",
    dep_hour: 11,
    distance_km: 215,
    is_rail: 1,
    weather_type: "snow",
    rainfall_mm: 24.0,
    wind_speed_kmh: 68.0,
    visibility_km: 0.6,
    temperature_c: -5.0,
    scheduled_buffer_mins: 35,
    operational_context: "Heavy snowfall & avalanche protection holds on Visp-Tasch rack rail link",
    operational_contingency: "Cogwheel track de-icing protocol; avalanche barrier clearance active; express snow-bus shuttle dispatched."
  },
  {
    id: "cyclone_crosswind",
    title: "Bay of Bengal Squall & Severe Crosswind Shear",
    tag: "Gale Crosswinds",
    carrier: "IndiGo Airlines",
    service_number: "6E 214",
    origin: "BLR",
    origin_name: "Bangalore (BLR)",
    destination: "HYD",
    destination_name: "Hyderabad (HYD)",
    dep_hour: 18,
    distance_km: 560,
    is_rail: 0,
    weather_type: "wind",
    rainfall_mm: 32.0,
    wind_speed_kmh: 74.0,
    visibility_km: 2.8,
    temperature_c: 23.0,
    scheduled_buffer_mins: 50,
    operational_context: "Gusting crosswinds exceed maximum aircraft crosswind limits (33 knots); mandatory go-arounds & holding stacks",
    operational_contingency: "Holding pattern fuel burn escalation; airborne sequencing holds; Chennai (MAA) tactical diversion slot reserved."
  }
];

export default function WeatherDigitalTwin({ 
  activeTicket, 
  disruptedTickets = [],
  itinerary,
  activeDisruption = true,
  onProceedToRecovery 
}) {
  // Navigation tab: 'twin' | 'social'
  const [activeTab, setActiveTab] = useState('twin');

  // Simulator mode: 'presets' | 'custom'
  const [simMode, setSimMode] = useState('presets');

  // Real-basis Presets & XGBoost metadata
  const [presets, setPresets] = useState(DEFAULT_PRESETS);
  const [modelMeta, setModelMeta] = useState(null);
  const [selectedPresetId, setSelectedPresetId] = useState("monsoon_mumbai");

  // Custom scenario input state
  const [customCarrier, setCustomCarrier] = useState('IndiGo Airlines');
  const [customService, setCustomService] = useState('6E 534');
  const [customOrigin, setCustomOrigin] = useState('NGP');
  const [customDestination, setCustomDestination] = useState('BOM');
  const [customRainfall, setCustomRainfall] = useState(48);
  const [customWind, setCustomWind] = useState(45);
  const [customVisibility, setCustomVisibility] = useState(1.5);
  const [customTemp, setCustomTemp] = useState(26);
  const [customBuffer, setCustomBuffer] = useState(45);
  const [customIsRail, setCustomIsRail] = useState(false);

  // Active Simulation Results & Status
  const [simResult, setSimResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);

  // Social signals
  const [socialSignals, setSocialSignals] = useState([]);
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);

  // Initial load
  useEffect(() => {
    loadPresetsAndModel();
    loadSocialData();
    // Run default preset simulation on initial mount so user sees realistic ML baseline
    executePresetSimulation(DEFAULT_PRESETS[0]);
  }, []);

  const loadPresetsAndModel = async () => {
    try {
      const data = await fetchXGBoostPresets();
      if (data) {
        if (data.presets && data.presets.length > 0) setPresets(data.presets);
        if (data.metadata) setModelMeta(data.metadata);
      }
    } catch (e) {
      console.warn("Could not load XGBoost presets:", e);
    }
  };

  const loadSocialData = async () => {
    setIsLoadingSocial(true);
    try {
      const res = await fetchSocialSignals();
      if (res && res.signals) setSocialSignals(res.signals);
    } catch (e) {
      console.warn('Social feed error:', e);
    } finally {
      setIsLoadingSocial(false);
    }
  };

  const executePresetSimulation = async (preset) => {
    setSelectedPresetId(preset.id);
    setIsSimulating(true);
    try {
      const payload = {
        rainfall_mm: preset.rainfall_mm,
        wind_speed_kmh: preset.wind_speed_kmh,
        visibility_km: preset.visibility_km,
        temperature_c: preset.temperature_c,
        dep_hour: preset.dep_hour || 14,
        distance_km: preset.distance_km || 850,
        scheduled_buffer_mins: preset.scheduled_buffer_mins || 45,
        is_rail: preset.is_rail || 0,
        carrier_name: preset.carrier,
        service_number: preset.service_number,
        origin_code: preset.origin,
        dest_code: preset.destination
      };
      const res = await simulateXGBoostScenario(payload);
      if (res && res.predictions) {
        setSimResult(res);
        setHasSimulated(true);
      }
    } catch (e) {
      console.error("XGBoost simulation error:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  const executeCustomSimulation = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSimulating(true);
    try {
      const payload = {
        rainfall_mm: parseFloat(customRainfall),
        wind_speed_kmh: parseFloat(customWind),
        visibility_km: parseFloat(customVisibility),
        temperature_c: parseFloat(customTemp),
        dep_hour: 15,
        distance_km: 850,
        scheduled_buffer_mins: parseInt(customBuffer, 10),
        is_rail: customIsRail ? 1 : 0,
        carrier_name: customCarrier,
        service_number: customService,
        origin_code: customOrigin,
        dest_code: customDestination
      };
      const res = await simulateXGBoostScenario(payload);
      if (res && res.predictions) {
        setSimResult(res);
        setHasSimulated(true);
      }
    } catch (e) {
      console.error("Custom simulation error:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [liveWeatherData, setLiveWeatherData] = useState(null);

  const fetchLiveWeatherForCorridor = async (originCode, destCode, carrier, service, isRail) => {
    setIsFetchingLive(true);
    setIsSimulating(true);
    try {
      const data = await fetchLiveWeather(originCode || customOrigin || 'BOM');
      if (data) {
        setLiveWeatherData(data);
        const rain = Number(data.precipitation_mm || data.rain_mm || 0);
        const wind = Number(data.wind_speed_kmh || 12);
        const vis = Number(data.visibility_km || 10);
        const temp = Number(data.temperature_c || 25);

        setCustomRainfall(rain);
        setCustomWind(wind);
        setCustomVisibility(vis);
        setCustomTemp(temp);

        const payload = {
          rainfall_mm: rain,
          wind_speed_kmh: wind,
          visibility_km: vis,
          temperature_c: temp,
          dep_hour: new Date().getHours(),
          distance_km: 850,
          scheduled_buffer_mins: parseInt(customBuffer, 10) || 45,
          is_rail: isRail !== undefined ? (isRail ? 1 : 0) : (customIsRail ? 1 : 0),
          carrier_name: carrier || customCarrier,
          service_number: service || customService,
          origin_code: originCode || customOrigin,
          dest_code: destCode || customDestination
        };
        const res = await simulateXGBoostScenario(payload);
        if (res && res.predictions) {
          setSimResult({
            ...res,
            isLiveWeatherGrounded: true,
            liveTelemetry: data
          });
          setHasSimulated(true);
        }
      }
    } catch (e) {
      console.error("Live weather simulation error:", e);
    } finally {
      setIsFetchingLive(false);
      setIsSimulating(false);
    }
  };

  const handleResetSimulation = () => {
    setHasSimulated(false);
    setSimResult(null);
    setLiveWeatherData(null);
  };

  // Build simulated ticket for map rendering
  const simulatedMapTicket = (hasSimulated && simResult) ? {
    carrier: simResult.inputs.carrier,
    service_number: simResult.inputs.service_number,
    origin: simResult.inputs.origin,
    destination: simResult.inputs.destination,
    delay_minutes: simResult.predictions.predicted_delay_mins,
    reason: simResult.inputs.operational_context || "XGBoost Simulated Weather Disruption",
    isSimulated: true
  } : null;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('twin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'twin'
                ? 'bg-[#181E4B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>XGBoost Scenario Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'social'
                ? 'bg-[#181E4B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Social Stream</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
        </div>

        {/* Model badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold text-[11px] border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>XGBoost ML v3.2 • Trained on 100k Records (MAE: {modelMeta?.metrics?.mae_mins || '26.3'}m)</span>
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: XGBOOST REAL-WORLD SCENARIO SIMULATOR (Climate viewer removed)   */}
      {/* ===================================================================== */}
      {activeTab === 'twin' && (
        <div className="space-y-6">
          
          {/* Main Simulator Control Panel */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
            
            {/* Header with Mode Switch (Presets vs Custom) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-volkhov font-bold text-lg text-[#181E4B] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Real-World Disruption Scenario Simulator
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-fidelity operational scenario engine powered by trained XGBoost models. Evaluates actual multi-modal delay distributions, cancellation risk, and runway capacity.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setSimMode('presets')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    simMode === 'presets'
                      ? 'bg-white text-[#181E4B] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Real Operational Presets
                </button>
                <button
                  type="button"
                  onClick={() => setSimMode('custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    simMode === 'custom'
                      ? 'bg-white text-[#181E4B] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Custom Builder
                </button>
              </div>
            </div>

            {/* PRESETS VIEW */}
            {simMode === 'presets' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {presets.map((p) => {
                  const isSelected = selectedPresetId === p.id && hasSimulated;
                  return (
                    <div 
                      key={p.id}
                      onClick={() => executePresetSimulation(p)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                        isSelected 
                          ? 'border-[#181E4B] bg-blue-50/50 shadow-xs ring-2 ring-[#181E4B]/10' 
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70 shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            p.weather_type === 'rain' ? 'bg-blue-100 text-blue-800' :
                            p.weather_type === 'fog' ? 'bg-amber-100 text-amber-800' :
                            p.weather_type === 'snow' ? 'bg-sky-100 text-sky-800' :
                            'bg-teal-100 text-teal-800'
                          }`}>
                            {p.tag}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {p.origin} ➔ {p.destination}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition leading-snug">
                          {p.title}
                        </h4>

                        <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
                          <div><strong>Carrier:</strong> {p.carrier} ({p.service_number})</div>
                          <div><strong>Atmosphere:</strong> {p.rainfall_mm > 0 ? `${p.rainfall_mm}mm rain` : 'Dense fog'}, {p.wind_speed_kmh} km/h wind</div>
                          <div><strong>Visibility:</strong> {p.visibility_km} km | {p.temperature_c}°C</div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchLiveWeatherForCorridor(p.origin, p.destination, p.carrier, p.service_number, p.is_rail);
                          }}
                          className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg border border-blue-200 flex items-center gap-1 transition cursor-pointer"
                        >
                          <Radio className="w-2.5 h-2.5 text-blue-600" />
                          <span>Sync Live Weather</span>
                        </button>
                        <div className="flex items-center gap-1 font-bold text-blue-600 text-xs">
                          <span>{isSelected ? 'Active Scenario' : 'Simulate'}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CUSTOM BUILDER VIEW */}
            {simMode === 'custom' && (
              <form onSubmit={executeCustomSimulation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Carrier & Service */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Carrier Name</label>
                    <input
                      type="text"
                      value={customCarrier}
                      onChange={(e) => setCustomCarrier(e.target.value)}
                      placeholder="e.g. IndiGo / Air India"
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Flight / Train Number</label>
                    <input
                      type="text"
                      value={customService}
                      onChange={(e) => setCustomService(e.target.value)}
                      placeholder="e.g. 6E 534 / AI 882"
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  {/* Origin & Destination Hubs */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Origin Hub</label>
                    <select
                      value={customOrigin}
                      onChange={(e) => setCustomOrigin(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-blue-500 transition"
                    >
                      <option value="NGP">Nagpur Junction (NGP)</option>
                      <option value="BOM">Mumbai CSMT / BOM</option>
                      <option value="DEL">Delhi IGI T3 (DEL)</option>
                      <option value="BLR">Bangalore (BLR)</option>
                      <option value="HYD">Hyderabad (HYD)</option>
                      <option value="MAA">Chennai (MAA)</option>
                      <option value="CCU">Kolkata (CCU)</option>
                      <option value="ZRH">Zurich Airport (ZRH)</option>
                      <option value="ZERMATT">Zermatt Resort</option>
                      <option value="LHR">London Heathrow (LHR)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Destination Hub</label>
                    <select
                      value={customDestination}
                      onChange={(e) => setCustomDestination(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-blue-500 transition"
                    >
                      <option value="BOM">Mumbai CSMT / BOM</option>
                      <option value="DEL">Delhi IGI T3 (DEL)</option>
                      <option value="NGP">Nagpur (NGP)</option>
                      <option value="BLR">Bangalore (BLR)</option>
                      <option value="HYD">Hyderabad (HYD)</option>
                      <option value="MAA">Chennai (MAA)</option>
                      <option value="CCU">Kolkata (CCU)</option>
                      <option value="ZERMATT">Zermatt Resort</option>
                      <option value="ZRH">Zurich Airport (ZRH)</option>
                    </select>
                  </div>

                </div>

                {/* Real-time Open-Meteo Weather Ingestion Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200/80">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-blue-600 text-white">
                      <Radio className={`w-3.5 h-3.5 ${isFetchingLive ? 'animate-pulse' : ''}`} />
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Real-Time Weather Telemetry (Open-Meteo)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Query live satellite & surface weather for {customOrigin} and predict disruption via trained XGBoost models.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fetchLiveWeatherForCorridor(customOrigin, customDestination, customCarrier, customService, customIsRail)}
                    disabled={isFetchingLive || isSimulating}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#181E4B] text-white hover:bg-[#283177] flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isFetchingLive ? 'Fetching Live Telemetry...' : `Fetch Live Weather for ${customOrigin}`}</span>
                  </button>
                </div>

                {/* Weather Parameters Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  
                  {/* Rainfall */}
                  <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                        Rainfall
                      </span>
                      <span className="font-mono font-bold text-slate-900">{customRainfall} mm/h</span>
                    </div>
                    <input 
                      type="range" min="0" max="80" step="1"
                      value={customRainfall}
                      onChange={(e) => setCustomRainfall(e.target.value)}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#181E4B]"
                    />
                  </div>

                  {/* Wind Gusts */}
                  <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-teal-500" />
                        Wind Velocity
                      </span>
                      <span className="font-mono font-bold text-slate-900">{customWind} km/h</span>
                    </div>
                    <input 
                      type="range" min="5" max="95" step="1"
                      value={customWind}
                      onChange={(e) => setCustomWind(e.target.value)}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#181E4B]"
                    />
                  </div>

                  {/* Visibility */}
                  <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-purple-500" />
                        Runway Visibility
                      </span>
                      <span className="font-mono font-bold text-slate-900">{customVisibility} km</span>
                    </div>
                    <input 
                      type="range" min="0.1" max="10.0" step="0.1"
                      value={customVisibility}
                      onChange={(e) => setCustomVisibility(e.target.value)}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#181E4B]"
                    />
                  </div>

                  {/* Temperature */}
                  <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                        Temperature
                      </span>
                      <span className="font-mono font-bold text-slate-900">{customTemp}°C</span>
                    </div>
                    <input 
                      type="range" min="-10" max="45" step="1"
                      value={customTemp}
                      onChange={(e) => setCustomTemp(e.target.value)}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#181E4B]"
                    />
                  </div>

                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSimulating}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#181E4B] text-white hover:bg-[#283177] transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                    <span>{isSimulating ? 'Running XGBoost Inference...' : 'Run XGBoost ML Prediction'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* SIMULATION RESULTS (Rendered when simulated) */}
          {hasSimulated && simResult && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* Live Real-Time Weather Grounding Banner */}
              {simResult.isLiveWeatherGrounded && simResult.liveTelemetry && (
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                  <span>
                    <strong>Real-World Weather Grounded:</strong> Live telemetry for {simResult.liveTelemetry.location_name} — {simResult.liveTelemetry.condition} ({simResult.liveTelemetry.temperature_c}°C, {simResult.liveTelemetry.wind_speed_kmh} km/h wind, {simResult.liveTelemetry.precipitation_mm}mm rain, {simResult.liveTelemetry.visibility_km}km visibility) fed directly into trained XGBoost Regressor & Classifier.
                  </span>
                </div>
              )}

              {/* XGBoost Prediction Metrics Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1: Predicted Delay with Confidence Interval */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">XGBoost Delay Prediction</span>
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${simResult.predictions.risk_color}18`,
                        color: simResult.predictions.risk_color
                      }}
                    >
                      {simResult.predictions.risk_level}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-[#181E4B]">
                      +{simResult.predictions.predicted_delay_mins}m
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      (95% CI: +{simResult.predictions.delay_confidence_interval[0]}m – +{simResult.predictions.delay_confidence_interval[1]}m)
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Primary Weather Delay:</span>
                      <strong className="text-slate-800">+{simResult.predictions.primary_weather_mins}m</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Turnaround Ripple Cascade:</span>
                      <strong className="text-slate-800">+{simResult.predictions.turnaround_cascade_mins}m</strong>
                    </div>
                  </div>
                </div>

                {/* Metric 2: Cancellation Risk */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium block">Cancellation Risk Probability</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-[#181E4B]">
                      {simResult.predictions.cancellation_probability_pct}%
                    </span>
                    <span className="text-xs text-slate-400">probability</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, simResult.predictions.cancellation_probability_pct * 1.5)}%`,
                        backgroundColor: simResult.predictions.cancellation_probability_pct > 30 ? '#EF4444' : (simResult.predictions.cancellation_probability_pct > 15 ? '#F59E0B' : '#10B981')
                      }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-2">
                    Evaluation based on XGBoost classification trees
                  </div>
                </div>

                {/* Metric 3: Runway / Corridor Throughput Capacity */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium block">Runway / Track Throughput</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-[#181E4B]">
                      {simResult.predictions.runway_throughput_pct}%
                    </span>
                    <span className="text-xs font-semibold text-rose-600">
                      (-{simResult.predictions.capacity_reduction_pct}% capacity loss)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                    <div 
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${simResult.predictions.runway_throughput_pct}%` }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-2">
                    {simResult.predictions.capacity_reduction_pct > 40 ? 'Severe flow control restrictions' : 'Nominal departure sequencing'}
                  </div>
                </div>

                {/* Metric 4: Connection Buffer & Downstream Turnaround Slack */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        Connection Buffer Slack
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        simResult.predictions.is_buffer_breached 
                          ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {simResult.predictions.is_buffer_breached ? 'Buffer Deficit' : 'Slack Protected'}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className={`text-3xl font-extrabold ${simResult.predictions.is_buffer_breached ? 'text-rose-600' : 'text-[#181E4B]'}`}>
                        {simResult.predictions.buffer_slack_mins >= 0 ? `+${simResult.predictions.buffer_slack_mins}m` : `${simResult.predictions.buffer_slack_mins}m`}
                      </span>
                      <span className="text-xs text-slate-400">
                        {simResult.predictions.is_buffer_breached ? 'missed transfer deficit' : 'remaining buffer'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          simResult.predictions.is_buffer_breached ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.max(10, Math.min(100, ((simResult.inputs.scheduled_buffer_mins + Math.min(0, simResult.predictions.buffer_slack_mins)) / Math.max(1, simResult.inputs.scheduled_buffer_mins)) * 100))}%`
                        }}
                      ></div>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      {simResult.predictions.is_buffer_breached
                        ? `Predicted delay (+${simResult.predictions.predicted_delay_mins}m) exhausts scheduled buffer (${simResult.inputs.scheduled_buffer_mins}m). Multi-modal recovery triggered.`
                        : `Scheduled buffer (${simResult.inputs.scheduled_buffer_mins}m) absorbs predicted delay (+${simResult.predictions.predicted_delay_mins}m).`}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Turnaround ripple: +{simResult.predictions.turnaround_cascade_mins}m</span>
                    <span className="font-semibold text-slate-500">XGBoost Evaluated</span>
                  </div>
                </div>

              </div>

              {/* Action Bar: Reset Simulation or Proceed to Multi-Modal Recovery */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-200/80">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">
                      Simulated Corridor: {simResult.inputs.origin_name} ➔ {simResult.inputs.destination_name}
                    </h5>
                    <p className="text-[11px] text-slate-600">
                      Disruption detected with +{simResult.predictions.predicted_delay_mins}m delay. Multi-modal alternatives ready.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetSimulation}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                    Reset Simulation
                  </button>

                  {onProceedToRecovery && (
                    <button
                      type="button"
                      onClick={() => onProceedToRecovery(simResult)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#181E4B] text-white hover:bg-[#283177] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Proceed to Recovery Plans</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* CORRIDOR MAP & WEATHER RADAR:                                         */}
          {/* Shows on map ONLY when a scenario is simulated!                       */}
          {/* ===================================================================== */}
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-sm text-[#181E4B] flex items-center gap-2">
                  <Map className="w-4 h-4 text-blue-600" />
                  Corridor Meteorological Weather Map
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dynamic geospatial mapping of simulated journey waypoints, cloud zones, precipitation radar, and speed restrictions.
                </p>
              </div>

              {hasSimulated && simResult && (
                <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
                  <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 font-bold text-[11px] flex items-center gap-1.5">
                    {simResult.inputs.rainfall_mm > 0 ? `🌧️ ${simResult.inputs.rainfall_mm} mm/h rain` : '🌫️ Foggy/Overcast'}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold text-[11px]">
                    💨 {simResult.inputs.wind_speed_kmh} km/h wind
                  </span>
                </div>
              )}
            </div>

            {/* If NOT simulated yet, show realistic placeholder invitation */}
            {!hasSimulated || !simResult ? (
              <div className="relative w-full h-[340px] bg-slate-50/70 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-2xs">
                  <Map className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="font-bold text-sm text-[#181E4B]">No Active Simulated Scenario Selected</h4>
                <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                  Select one of the real-world operational presets above or build a custom meteorological scenario to dynamically render the flight corridor and weather radar tiles on the map.
                </p>
                <button
                  type="button"
                  onClick={() => executePresetSimulation(DEFAULT_PRESETS[0])}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-[#181E4B] text-white hover:bg-[#283177] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate Mumbai Monsoon Corridor</span>
                </button>
              </div>
            ) : (
              /* Render map specifically with the simulated scenario's journey and weather! */
              <CartoJourneyMap
                disruptedTicket={simulatedMapTicket}
                disruptedTickets={[simulatedMapTicket]}
                itinerary={itinerary}
                activeDisruption={true}
                simulatedWeather={{
                  rainfall: simResult.inputs.rainfall_mm,
                  temperature: simResult.inputs.temperature_c,
                  windSpeed: simResult.inputs.wind_speed_kmh,
                  duration: 3.0
                }}
              />
            )}

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: LIVE SOCIAL SIGNAL STREAM (Bluesky AT Protocol)                 */}
      {/* ===================================================================== */}
      {activeTab === 'social' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-sm text-[#181E4B] flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                Real-Time Traveler Social Signal Stream
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Ingesting crowdsourced passenger posts via{' '}
                <a
                  href="https://docs.bsky.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline"
                >
                  Bluesky AT Protocol API
                </a>
                {' '}— Central Railway telemetry feeds and MET department alerts.
              </p>
            </div>
            <button
              onClick={loadSocialData}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingSocial ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>
          </div>

          <div className="space-y-3">
            {socialSignals.map((sig) => (
              <div key={sig.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                  {sig.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{sig.author}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{sig.handle}</span>
                      {sig.verified && (
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{sig.time_ago}</span>
                  </div>

                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">{sig.text}</p>

                  <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-500">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      sig.sentiment === 'WARNING' ? 'bg-amber-100 text-amber-900' :
                      sig.sentiment === 'NEGATIVE' ? 'bg-rose-100 text-rose-900' :
                      sig.sentiment === 'POSITIVE' ? 'bg-emerald-100 text-emerald-900' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {sig.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {sig.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" /> {sig.retweets}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
