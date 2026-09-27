import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, ShieldCheck, Zap, ArrowLeft, ArrowRight, 
  RotateCcw, CheckCircle2, Clock, Train, Plane, Building2, 
  FileText, Shield, Sparkles, AlertCircle, Compass, HelpCircle,
  MessageSquare, UploadCloud, ChevronRight, DollarSign, RefreshCw,
  Search, Link2, Check, Radio, Bus, Navigation, Map, CloudRain,
  Sun, Cloud, CloudSnow, Wind, Thermometer, Droplets
} from 'lucide-react';
import DemoJourneyGraph from '../components/DemoJourneyGraph';
import DisruptionChatbot from './DisruptionChatbot';
import RefundPolicyModal from './RefundPolicyModal';
import MultiModalTravelTool from './MultiModalTravelTool';
import RecoveryPlanCards from './RecoveryPlanCards';
import WeatherDigitalTwin from './WeatherDigitalTwin';
import DisruptionScenarioSimulator from './DisruptionScenarioSimulator';
import { fetchLiveWeather, getApiUrl } from '../api';

export default function DisruptionPage({
  user,
  itinerary,
  activeDisruption,
  onNavigate,
  onSimulateAlpine,
  onResetDisruption,
  onOpenSaga,
  t
}) {
  // Booking connection state (Real website: default false unless synced)
  const [hasVoyageBooking, setHasVoyageBooking] = useState(false);
  const [voyagePnrInput, setVoyagePnrInput] = useState('');
  const [isLinkingBooking, setIsLinkingBooking] = useState(false);

  // Tab state: 'chat' (AI Assistant & Ticket Upload) | 'map' (Connection Map & Recovery Plans)
  const [activeTab, setActiveTab] = useState('chat');

  // Chatbot states
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [hasEndedChat, setHasEndedChat] = useState(false);
  
  // Real Ingested Disruption Records
  const [disruptedTicket, setDisruptedTicket] = useState(null);
  const [disruptedTickets, setDisruptedTickets] = useState([]);
  const [sessionKey, setSessionKey] = useState(0);
  const [savedHistoryCount, setSavedHistoryCount] = useState(0);

  // Live weather banner state (auto-derived from ticket origin)
  const [liveWeather, setLiveWeather] = useState(null);
  const [simulatedWeather, setSimulatedWeather] = useState(null);

  const handleSimulateDisruptionScenario = (scenario) => {
    const record = {
      pnr: scenario.pnr || ("SIM-" + Math.floor(100000 + Math.random() * 900000)),
      carrier: scenario.carrier,
      service_number: scenario.service_number,
      origin: scenario.origin,
      destination: scenario.destination,
      travel_date: new Date().toISOString().split('T')[0],
      delay_minutes: scenario.delay_minutes,
      reason: scenario.reason,
      weather_condition: scenario.weather_condition,
      rainfall_mm: scenario.rainfall_mm,
      temperature_c: scenario.temperature_c,
      wind_speed_kmh: scenario.wind_speed_kmh,
      visibility_km: scenario.visibility_km,
      xgboost_prediction: scenario.xgboost_prediction,
      isSimulated: true
    };
    setDisruptedTicket(record);
    setDisruptedTickets([record]);
    setSimulatedWeather({
      condition: scenario.weather_condition,
      rainfall: scenario.rainfall_mm,
      temperature: scenario.temperature_c,
      windSpeed: scenario.wind_speed_kmh,
      visibility: scenario.visibility_km
    });
    if (scenario.weather_condition) {
      setLiveWeather(prev => ({
        ...prev,
        condition: scenario.weather_condition,
        precipitation_mm: scenario.rainfall_mm,
        temperature_c: scenario.temperature_c,
        wind_speed_kmh: scenario.wind_speed_kmh,
        visibility_km: scenario.visibility_km,
        location_name: `${scenario.origin} (${scenario.carrier})`
      }));
    }
  };

  const handleClearSimulatedScenario = () => {
    setDisruptedTicket(null);
    setDisruptedTickets([]);
    setSimulatedWeather(null);
  };

  // Check if saved tickets exist in backend without auto-activating them
  useEffect(() => {
    const checkSavedDisruptions = async () => {
      try {
        const res = await fetch(getApiUrl('/api/disruptions/external'));
        if (res.ok) {
          const data = await res.json();
          if (data.disruptions && data.disruptions.length > 0) {
            setSavedHistoryCount(data.disruptions.length);
            // Intentionally DO NOT auto-set disruptedTicket on initial page mount.
            // A fresh visit should start with a clean slate unless the user uploads a document!
          }
        }
      } catch (err) {
        console.warn("Could not check disruptions from backend:", err);
      }
    };
    checkSavedDisruptions();
  }, []);

  // Auto-fetch real-time live weather using browser GPS geolocation or disrupted ticket origin
  useEffect(() => {
    let isMounted = true;
    const loadWeather = async (lat = null, lon = null) => {
      const hub = disruptedTicket?.origin || 'BOM';
      try {
        const data = await fetchLiveWeather(hub, lat, lon);
        if (isMounted && data) {
          setLiveWeather(data);
        }
      } catch (err) {
        console.warn("Weather fetch error:", err);
      }
    };

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          loadWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          loadWeather(); // fallback to hub / BOM
        },
        { timeout: 5000 }
      );
    } else {
      loadWeather();
    }

    return () => { isMounted = false; };
  }, [disruptedTicket?.origin]);

  // File upload ref for uploading other tickets from active view
  const pageFileInputRef = useRef(null);
  const [isPageUploading, setIsPageUploading] = useState(false);

  // Refund policy modal state
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundModalData, setRefundModalData] = useState(null);
  const [filedReceipt, setFiledReceipt] = useState(null);

  // Clear entire ticket session, wiping all markings and states
  const handleClearSession = () => {
    if (onResetDisruption) onResetDisruption();
    setDisruptedTicket(null);
    setDisruptedTickets([]);
    setSimulatedWeather(null);
    setRefundModalData(null);
    setFiledReceipt(null);
    setHasEndedChat(false);
    setIsChatMinimized(false);
    setSessionKey(prev => prev + 1);
  };

  // Link Voyage Booking Handler
  const handleLinkVoyageBooking = (e) => {
    e.preventDefault();
    if (!voyagePnrInput.trim()) return;
    setIsLinkingBooking(true);
    setTimeout(() => {
      setHasVoyageBooking(true);
      setIsLinkingBooking(false);
    }, 600);
  };

  const handleOpenRefundModal = (customData = null) => {
    const dataToUse = customData || disruptedTicket || (disruptedTickets.length > 0 ? disruptedTickets[0] : null) || {
      pnr: "N/A",
      carrier: "Carrier",
      service_number: "Service",
      origin: "Origin",
      destination: "Destination",
      delay_minutes: 0,
      ticket_cost: 0,
      is_cancellation: false,
      disruption_reason: "Operational disruption"
    };

    setRefundModalData(dataToUse);
    setIsRefundModalOpen(true);
  };

  // Called when one or more tickets are parsed
  // STAYS in the chatbot view so user can review details, chat, or upload more documents
  const handleTicketProcessed = (record, allRecords = []) => {
    if (record) {
      setDisruptedTicket(record);
    }
    if (allRecords && allRecords.length > 0) {
      setDisruptedTickets(allRecords);
    } else if (record) {
      setDisruptedTickets(prev => {
        const exists = prev.some(t => t.pnr === record.pnr && t.service_number === record.service_number);
        return exists ? prev : [...prev, record];
      });
    }
    // We intentionally stay on activeTab === 'chat'!
  };

  // Explicit user action to view connection map
  const handleProceedToMap = (record, allRecords = []) => {
    if (record) setDisruptedTicket(record);
    if (allRecords && allRecords.length > 0) setDisruptedTickets(allRecords);
    setActiveTab('map');
    setTimeout(() => {
      const mapElement = document.getElementById('connection-map-section');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handlePageMultiFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsPageUploading(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      const response = await fetch(getApiUrl('/api/ai/upload-documents'), {
        method: 'POST',
        body: formData
      });
      const resData = await response.json();
      if (resData.structured_data) {
        handleTicketProcessed(resData.structured_data, resData.all_records || [resData.structured_data]);
      }
    } catch (err) {
      console.error("Multi upload error:", err);
    } finally {
      setIsPageUploading(false);
      if (pageFileInputRef.current) pageFileInputRef.current.value = '';
    }
  };

  const handleEndChat = (record) => {
    if (record) {
      setDisruptedTicket(record);
    }
    setHasEndedChat(true);
    setIsChatMinimized(true);
    setActiveTab('map');
    setTimeout(() => {
      const mapElement = document.getElementById('connection-map-section');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleExecutePlan = (planKey) => {
    if (onOpenSaga) {
      const planNames = {
        plan_a: { title: "PLAN A: Airline Rebooking", cost: "₹0 out-of-pocket" },
        plan_b: { title: "PLAN B: Flight + Rail Recovery", cost: "₹2,850 additional cost" },
        plan_c: { title: "PLAN C: Private Road Recovery", cost: "₹6,900 additional cost" }
      };
      const p = planNames[planKey] || planNames.plan_b;
      onOpenSaga({
        title: p.title,
        cost: p.cost,
        description: "Executing automated multi-modal recovery via Agentic Saga."
      });
    }
  };

  // Helper to reliably detect past dates across varied date formats
  const isPastDate = (dateStr) => {
    if (!dateStr) return false;
    const clean = String(dateStr).trim();
    if (/yesterday|completed|past/i.test(clean)) return true;
    const parsed = Date.parse(clean);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) return true;
    }
    const parts = clean.split(/[-/.\s]+/);
    if (parts.length >= 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);
      const monthNames = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
      };
      const mStr = parts[1].toLowerCase().slice(0, 3);
      if (monthNames[mStr] !== undefined) month = monthNames[mStr];
      if (parts[0].length === 4) {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      }
      if (year < 100) year += 2000;
      if (year < new Date().getFullYear()) return true;
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d < today;
      }
    }
    return false;
  };

  // Disruption metrics & past journey flag
  const actualDelay = typeof disruptedTicket?.delay_minutes === 'number' ? disruptedTicket.delay_minutes : (activeDisruption?.delay_minutes || 0);
  const isCancelled = Boolean(disruptedTicket?.is_cancellation);
  const isPast = Boolean(disruptedTicket?.is_past_journey) || 
                 disruptedTicket?.journey_status === 'COMPLETED' || 
                 isPastDate(disruptedTicket?.travel_date);
  const isDisrupted = !isPast && (actualDelay > 15 || isCancelled || Boolean(activeDisruption));

  // Condition: Has a dispute or disruption actually occurred?
  const isDisputeActive = Boolean(activeDisruption || disruptedTicket);

  // Compute Route corridor string dynamically
  const computedRouteCorridor = disruptedTickets.length > 1
    ? disruptedTickets.map(t => `${t.origin} → ${t.destination}`).join(" → ")
    : (disruptedTicket ? `${disruptedTicket.origin} → ${disruptedTicket.destination}` : "Mumbai → Delhi → Jaipur");

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#181E4B] font-poppins pt-28 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Top Header / Minimal Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between pb-5 border-b border-slate-200/60 gap-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#5E6282] hover:text-[#181E4B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => onNavigate('/booking')}
            className="text-xs font-semibold text-[#5E6282] hover:text-[#181E4B] transition-colors cursor-pointer"
          >
            Bookings
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-bold text-[#A35645]">Disruption Resolver</span>
        </div>

        {/* Clear Disrupted Ticket if currently active */}
        {isDisputeActive && (
          <button
            onClick={handleClearSession}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Ticket Session</span>
          </button>
        )}
      </div>

      {/* ===== LIVE REAL-TIME WEATHER DETAILS (Real GPS / Location based) ===== */}
      {(() => {
        const cond = (liveWeather?.condition || '').toLowerCase();
        const isRain = cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower');
        const isSnow = cond.includes('snow') || cond.includes('blizzard') || cond.includes('sleet') || (liveWeather?.temperature_c <= 0);
        const isStorm = cond.includes('thunder') || cond.includes('storm');
        const isClear = cond.includes('clear') || cond.includes('sunny');
        const isCloudy = cond.includes('cloud') || cond.includes('overcast') || cond.includes('fog') || cond.includes('mist');
        const locDisplay = liveWeather?.location_name || (disruptedTicket?.origin ? `${disruptedTicket.origin} Hub` : 'Live Location');

        let WeatherIcon = Sun;
        let iconColor = 'text-amber-500';
        let bgGradient = 'from-amber-500/10 via-amber-50 to-orange-50/50 border-amber-200/80';
        let textColor = 'text-amber-950';
        let badgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
        let weatherEmoji = '☀️';

        if (isStorm) {
          WeatherIcon = CloudRain;
          iconColor = 'text-purple-600 animate-pulse';
          bgGradient = 'from-purple-900/10 via-purple-50 to-indigo-50 border-purple-300';
          textColor = 'text-purple-950';
          badgeBg = 'bg-purple-100 text-purple-900 border-purple-300';
          weatherEmoji = '⛈️';
        } else if (isSnow) {
          WeatherIcon = CloudSnow;
          iconColor = 'text-sky-500 animate-spin';
          bgGradient = 'from-sky-100/50 via-blue-50 to-slate-50 border-sky-300';
          textColor = 'text-sky-950';
          badgeBg = 'bg-sky-100 text-sky-900 border-sky-300';
          weatherEmoji = '❄️';
        } else if (isRain) {
          WeatherIcon = CloudRain;
          iconColor = 'text-blue-600';
          bgGradient = 'from-blue-600/10 via-sky-50 to-cyan-50 border-blue-200';
          textColor = 'text-blue-950';
          badgeBg = 'bg-blue-100 text-blue-900 border-blue-300';
          weatherEmoji = '🌧️';
        } else if (isCloudy) {
          WeatherIcon = Cloud;
          iconColor = 'text-slate-600';
          bgGradient = 'from-slate-100 via-slate-50 to-gray-50 border-slate-200';
          textColor = 'text-slate-900';
          badgeBg = 'bg-slate-200 text-slate-800 border-slate-300';
          weatherEmoji = '☁️';
        } else if (isClear) {
          WeatherIcon = Sun;
          iconColor = 'text-amber-500 animate-spin-slow';
          bgGradient = 'from-amber-400/15 via-orange-50 to-yellow-50 border-amber-200';
          textColor = 'text-amber-950';
          badgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
          weatherEmoji = '☀️';
        }

        return (
          <div className={`mt-6 mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r ${bgGradient} border shadow-xs transition-all`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Location & Primary Condition */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center shrink-0 border border-white">
                  <WeatherIcon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-emerald-600" />
                      Live Weather • {locDisplay}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" title="Live telemetry synced" />
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeBg}`}>
                      {weatherEmoji} {liveWeather?.condition || 'Analyzing atmosphere...'}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-volkhov text-[#181E4B] mt-0.5">
                    {liveWeather ? `${Math.round(liveWeather.temperature_c)}°C` : '28°C'}
                    <span className="text-xs sm:text-sm font-sans font-medium text-slate-500 ml-2">
                      (feels like {liveWeather ? `${Math.round(liveWeather.apparent_temperature_c)}°C` : '30°C'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Atmospheric Metrics (Rain mm, Snow, Wind km/h, Humidity %) */}
              {liveWeather && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold text-slate-700 bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-white/80 shadow-2xs">
                  <span className="flex items-center gap-1.5" title="Precipitation / Rain">
                    <CloudRain className="w-4 h-4 text-blue-500" />
                    <span>{liveWeather.precipitation_mm ?? 0} mm rain</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1.5" title="Wind Velocity">
                    <Wind className="w-4 h-4 text-teal-600" />
                    <span>{liveWeather.wind_speed_kmh ?? 14} km/h</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1.5" title="Relative Humidity">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span>{liveWeather.humidity_pct ?? 65}%</span>
                  </span>
                  {isSnow && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1 text-sky-700 font-bold">
                        <CloudSnow className="w-4 h-4 text-sky-500" />
                        <span>Snow Warning</span>
                      </span>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        );
      })()}

      {/* Mode / Tab Switcher (Chatbot vs Connection Map vs Weather Digital Twin) */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200/80 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-[#181E4B] text-white shadow-sm'
              : 'bg-white text-[#5E6282] hover:text-[#181E4B] border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>AI Assistant &amp; Ticket Upload</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('twin')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'twin'
              ? 'bg-[#181E4B] text-white shadow-sm'
              : 'bg-white text-[#5E6282] hover:text-[#181E4B] border border-slate-200'
          }`}
        >
          <CloudRain className="w-4 h-4 text-blue-500" />
          <span>Weather Digital Twin</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. CHAT TAB: AI Travel Assistant + Document Dropzone + Radar               */}
      {/* User remains here after uploading tickets so they can chat or add more!    */}
      {/* ========================================================================= */}
      {activeTab === 'chat' && (
        <div className="space-y-6">
          
          {/* Quick entry link to Connection Map & Simulator when no dispute active */}
          {!isDisputeActive && (
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 rounded-2xl border border-blue-100 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-blue-100/80 text-blue-700">
                  <Map className="w-4 h-4" />
                </span>
                <span className="text-[#181E4B] font-medium">
                  Explore route connections or simulate disruption scenarios in real-time.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('map');
                  setTimeout(() => {
                    const el = document.getElementById('connection-map-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="px-3.5 py-1.5 rounded-xl font-bold bg-[#181E4B] text-white hover:bg-[#283177] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Connection Map &amp; Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          {/* Quick Notice Bar if tickets have already been analyzed */}
          {isDisputeActive && (
            <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs ${
              isPast ? "bg-slate-50 border-slate-200" : (isDisrupted ? "bg-amber-50/90 border-amber-200/90" : "bg-emerald-50/90 border-emerald-200/90")
            }`}>
              <div className="flex items-center gap-2.5">
                <span className={`p-1.5 rounded-lg ${isPast ? "bg-slate-200 text-slate-700" : (isDisrupted ? "bg-amber-200/70 text-amber-900" : "bg-emerald-200/70 text-emerald-900")}`}>
                  {isDisrupted ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </span>
                <span className={isPast ? "text-slate-800 font-medium" : (isDisrupted ? "text-amber-950 font-medium" : "text-emerald-950 font-medium")}>
                  <strong>{disruptedTickets.length > 1 ? `${disruptedTickets.length} Document Legs Analyzed` : (disruptedTicket?.carrier || "Ticket Analyzed")}</strong>: {disruptedTickets.length > 1 ? disruptedTickets.map(t => `${t.origin} ➔ ${t.destination}`).join(" | ") : `${disruptedTicket?.origin} ➔ ${disruptedTicket?.destination}`} {isPast ? "(Past Travel Document • Completed Run)" : (isDisrupted ? `(+${actualDelay}m delay)` : "(On Schedule)")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('twin')}
                  className="px-3 py-2 rounded-xl font-bold bg-white text-[#181E4B] border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs text-xs"
                >
                  <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                  <span>Weather Twin &amp; Nugen</span>
                </button>
                <button
                  onClick={() => handleProceedToMap(disruptedTicket, disruptedTickets)}
                  className="px-4 py-2 rounded-xl font-bold bg-[#181E4B] text-white hover:bg-[#283177] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>View Connection Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* AI Travel Assistant (Chat, Voice, Multi-Document Dropzone) */}
          <DisruptionChatbot
            key={`chat-${sessionKey}`}
            isOpen={true}
            isMinimized={false}
            isFloating={false}
            onMinimize={() => {}}
            onRestore={() => {}}
            onEndChat={handleEndChat}
            onTicketProcessed={handleTicketProcessed}
            onProceedToMap={handleProceedToMap}
            onCheckRefundPolicy={handleOpenRefundModal}
            t={t}
          />

          {/* Travel Engine (Auto-populated with extracted ticket info) */}
          <MultiModalTravelTool 
            key={`tool-chat-${sessionKey}`}
            extractedTicket={disruptedTicket}
            extractedTickets={disruptedTickets}
          />

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAP TAB: High-Priority Alert -> Connection Map -> RECOVERY PLANS        */}
      {/* ========================================================================= */}
      {activeTab === 'map' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Map View Header / Back Navigation & Simulation Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#181E4B] hover:text-blue-600 bg-white border border-slate-200/90 px-4 py-2 rounded-2xl shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to AI Assistant</span>
            </button>

            {disruptedTicket?.isSimulated && (
              <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl shadow-2xs">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span>Simulated Scenario: {disruptedTicket.carrier} (+{disruptedTicket.delay_minutes}m)</span>
                </span>
                <button
                  type="button"
                  onClick={handleClearSimulatedScenario}
                  className="text-xs font-bold text-red-600 hover:text-red-700 underline cursor-pointer ml-1"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Journey Status Card */}
          {/* Journey Status Card - Clean pure white card design */}
          {isPast ? (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 text-[#181E4B] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-700 shrink-0 mt-0.5 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-[#181E4B]">
                      Historical Record: {disruptedTicket?.carrier || "Carrier"} ({disruptedTicket?.service_number || "Service"})
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      PAST TRAVEL DOCUMENT (COMPLETED)
                    </span>
                  </div>
                  <p className="text-xs text-[#5E6282] mt-1 leading-relaxed">
                    This travel document is for a past scheduled date ({disruptedTicket?.travel_date || "Past Date"}). The service has already finished its run. Chat with the AI assistant to discuss if you caught this train or need retrospective IRCTC TDR filing.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs text-[#181E4B] bg-white hover:bg-slate-50 border border-slate-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#181E4B]" />
                  <span>AI Chatbot &amp; Documents</span>
                </button>

                <button
                  onClick={() => pageFileInputRef.current?.click()}
                  disabled={isPageUploading}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-purple-700" />
                  <span>{isPageUploading ? "Uploading..." : "Upload Other Tickets"}</span>
                </button>
              </div>
            </div>
          ) : isDisrupted ? (
            <div className="p-5 rounded-3xl bg-white border border-amber-300 text-[#181E4B] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 shrink-0 mt-0.5 border border-amber-200">
                  <AlertTriangle className="w-5 h-5 animate-pulse text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-[#181E4B]">
                      Disruption Detected: {disruptedTicket?.carrier || "Carrier"} ({disruptedTicket?.service_number || "Service"})
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      CASCADE RISK
                    </span>
                  </div>
                  <p className="text-xs text-[#5E6282] mt-1 leading-relaxed">
                    Operational delay of <strong className="font-semibold text-[#181E4B]">+{actualDelay} mins</strong> on {disruptedTicket?.origin || "Origin"} ➔ {disruptedTicket?.destination || "Destination"}. Downstream connection window impacted.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs text-[#181E4B] bg-white hover:bg-slate-50 border border-slate-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#181E4B]" />
                  <span>AI Chatbot &amp; Documents</span>
                </button>

                <button
                  onClick={() => pageFileInputRef.current?.click()}
                  disabled={isPageUploading}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-purple-700" />
                  <span>{isPageUploading ? "Uploading..." : "Upload Other Tickets"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 text-[#181E4B] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-700 shrink-0 mt-0.5 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-[#181E4B]">
                      Journey Status: {disruptedTicket?.carrier || "Carrier"} ({disruptedTicket?.service_number || "Service"}) — On Schedule
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-800 border border-slate-300 shadow-2xs">
                      RUNNING RIGHT TIME
                    </span>
                  </div>
                  <p className="text-xs text-[#5E6282] mt-1 leading-relaxed">
                    Operating nominally on {disruptedTicket?.origin || "Origin"} ➔ {disruptedTicket?.destination || "Destination"} (+0m delay). All downstream connection buffers are preserved.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs text-[#181E4B] bg-white hover:bg-slate-50 border border-slate-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#181E4B]" />
                  <span>AI Chatbot &amp; Documents</span>
                </button>

                <button
                  onClick={() => pageFileInputRef.current?.click()}
                  disabled={isPageUploading}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-purple-700" />
                  <span>{isPageUploading ? "Uploading..." : "Upload Other Tickets"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Hidden multi-file upload for uploading other tickets */}
          <input
            type="file"
            ref={pageFileInputRef}
            onChange={handlePageMultiFileUpload}
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            multiple
            className="hidden"
          />

          {/* SECTION 1: Interactive Connection Graph / Map */}
          <div id="connection-map-section" className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/70 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-volkhov font-bold text-xl text-[#181E4B]">
                  Interactive Journey Visualizer
                </h3>
                <p className="text-xs text-[#5E6282]">
                  Topological graph and Google Maps basemap showing slack buffers and critical connections.
                </p>
              </div>
            </div>

            {/* Live Map / TDAG Component with genuine multi-ticket coordinates */}
            <DemoJourneyGraph
              key={`graph-${sessionKey}`}
              itinerary={itinerary}
              disruptedTicket={disruptedTicket}
              disruptedTickets={disruptedTickets}
              activeDisruption={activeDisruption || (disruptedTicket ? {
                node_id: "node_flight_1",
                delay_minutes: actualDelay,
                reason: disruptedTicket?.disruption_reason || disruptedTicket?.reason || "Flight schedule delay"
              } : null)}
              onSimulateAlpine={onSimulateAlpine}
              onOpenSaga={onOpenSaga}
              simulatedWeather={simulatedWeather}
              t={t}
            />
          </div>

          {/* SECTION 2: RECOVERY PLANS (Render ONLY if active disruption occurred and NOT a completed/past journey) */}
          {isDisrupted && !isPast && (
            <div id="recovery-plans-section" className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-volkhov font-bold text-2xl text-[#181E4B]">
                    Recovery Plans
                  </h3>
                  <p className="text-xs text-[#5E6282]">
                    Intelligent multi-modal alternatives synthesized across rail, road, and air transit using XGBoost delay prediction.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#A35645] bg-[#A35645]/10 px-3 py-1 rounded-full">
                  3 Recovery Plans
                </span>
              </div>

              {/* 3 Recovery Plan Cards with dynamic route corridor, live weather & XGBoost delay */}
              <RecoveryPlanCards 
                onSelectPlan={handleExecutePlan}
                routeCorridor={computedRouteCorridor}
                disruptedTicket={disruptedTicket}
                xgboostPrediction={disruptedTicket?.xgboost_prediction}
                liveWeather={liveWeather || simulatedWeather}
              />
            </div>
          )}

          {/* Travel Engine */}
          <div className="pt-4">
            <MultiModalTravelTool 
              key={`tool-map-${sessionKey}`}
              extractedTicket={disruptedTicket}
              extractedTickets={disruptedTickets}
            />
          </div>

          {/* Disruption Scenario Simulator (Shown when no dispute occurs or when simulation is actively tested) */}
          {(!isDisrupted || disruptedTicket?.isSimulated) && (
            <div className="pt-4">
              <DisruptionScenarioSimulator 
                onSimulateScenario={handleSimulateDisruptionScenario}
                onClearScenario={handleClearSimulatedScenario}
                isSimulatingActive={Boolean(disruptedTicket?.isSimulated)}
              />
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TWIN TAB: Weather-Driven Digital Twin & Nugen AI Model Alignment       */}
      {/* ========================================================================= */}
      {activeTab === 'twin' && (
        <WeatherDigitalTwin
          activeTicket={disruptedTicket}
          disruptedTickets={disruptedTickets}
          itinerary={itinerary}
          activeDisruption={activeDisruption}
          onProceedToRecovery={(simResult) => {
            if (simResult && simResult.inputs) {
              handleSimulateDisruptionScenario({
                carrier: simResult.inputs.carrier,
                service_number: simResult.inputs.service_number,
                origin: simResult.inputs.origin,
                destination: simResult.inputs.destination,
                delay_minutes: simResult.predictions.predicted_delay_mins,
                reason: `XGBoost Predicted Delay (+${simResult.predictions.predicted_delay_mins}m): ${simResult.inputs.rainfall_mm > 0 ? `${simResult.inputs.rainfall_mm}mm rain, ` : ''}${simResult.inputs.wind_speed_kmh} km/h wind, ${simResult.inputs.visibility_km}km visibility at ${simResult.inputs.origin_name || simResult.inputs.origin}`,
                weather_condition: simResult.inputs.rainfall_mm > 20 ? "Heavy Rain / Downpour" : (simResult.inputs.visibility_km < 1 ? "Dense Fog" : (simResult.inputs.wind_speed_kmh > 40 ? "Severe Winds" : "Moderate Precipitation")),
                rainfall_mm: simResult.inputs.rainfall_mm,
                temperature_c: simResult.inputs.temperature_c,
                wind_speed_kmh: simResult.inputs.wind_speed_kmh,
                visibility_km: simResult.inputs.visibility_km,
                xgboost_prediction: simResult.predictions
              });
            }
            setActiveTab('map');
            setTimeout(() => {
              const el = document.getElementById('recovery-plans-section') || document.getElementById('connection-map-section');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 120);
          }}
        />
      )}

      {/* Floating AI Chatbot Capsule in Bottom Right Corner (available while viewing map, anchored at page root) */}
      {activeTab === 'map' && (
        <DisruptionChatbot
          key={`floating-${sessionKey}`}
          isOpen={!isChatMinimized}
          isMinimized={isChatMinimized}
          isFloating={true}
          onMinimize={() => setIsChatMinimized(true)}
          onRestore={() => {
            setHasEndedChat(false);
            setIsChatMinimized(false);
          }}
          onEndChat={handleEndChat}
          onTicketProcessed={handleTicketProcessed}
          onProceedToMap={handleProceedToMap}
          onCheckRefundPolicy={handleOpenRefundModal}
          t={t}
        />
      )}

      {/* Refund Policy Popup / Modal */}
      <RefundPolicyModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        ticketData={refundModalData}
        onClaimFiled={(receipt) => setFiledReceipt(receipt)}
        t={t}
      />

    </div>
  );
}
