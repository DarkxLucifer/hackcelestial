import React, { useState, useEffect } from 'react';
import { 
  Plane, Train, Bus, Navigation, Clock, ShieldCheck, 
  Search, ArrowRight, ExternalLink, RefreshCw, Radio, CheckCircle2,
  AlertTriangle, MapPin, Gauge
} from 'lucide-react';

export default function MultiModalTravelTool({ onSelectSegment }) {
  const [activeTab, setActiveTab] = useState('flight'); // 'flight' | 'train' | 'bus' | 'gtfs'
  const [telemetry, setTelemetry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchLiveTelemetry();
  }, []);

  const fetchLiveTelemetry = async () => {
    try {
      const res = await fetch('/api/travel/live-telemetry');
      const data = await res.json();
      setTelemetry(data);
    } catch (e) {
      console.warn("Could not load travel telemetry:", e);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setIsSearching(true);
    setSearchResult(null);

    try {
      if (activeTab === 'flight') {
        const res = await fetch(`/api/travel/flight-status?flight=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSearchResult({ type: 'flight', data });
      } else if (activeTab === 'train') {
        const res = await fetch(`/api/travel/train-status?train=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSearchResult({ type: 'train', data });
      } else if (activeTab === 'bus') {
        const res = await fetch(`/api/travel/bus-options?origin=Delhi&destination=Jaipur`);
        const data = await res.json();
        setSearchResult({ type: 'bus', data: data.buses });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const flightSeg = telemetry?.segments?.flight_segment;
  const trainSeg = telemetry?.segments?.rail_segment;
  const metroSeg = telemetry?.segments?.gtfs_metro_segment;
  const busList = telemetry?.segments?.emergency_bus_options || [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-7 space-y-6">
      
      {/* Header with live radar indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-volkhov font-bold text-lg text-[#181E4B]">
              Multi-Modal Connection Radar
            </h3>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-[#5E6282] mt-0.5">
            Real-time feed from AviationStack (flights), RailRadar (trains), GTFS (metro), and redBus/AbhiBus (road transit).
          </p>
        </div>

        <button
          onClick={fetchLiveTelemetry}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#181E4B] transition-colors cursor-pointer"
          title="Refresh live data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Radar</span>
        </button>
      </div>

      {/* Segment Mode Selector */}
      <div className="flex bg-slate-100/70 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => { setActiveTab('flight'); setSearchResult(null); }}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'flight' ? 'bg-white text-[#181E4B] shadow-2xs' : 'text-[#5E6282] hover:text-[#181E4B]'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>Flight</span>
        </button>

        <button
          onClick={() => { setActiveTab('train'); setSearchResult(null); }}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'train' ? 'bg-white text-[#181E4B] shadow-2xs' : 'text-[#5E6282] hover:text-[#181E4B]'
          }`}
        >
          <Train className="w-3.5 h-3.5" />
          <span>Train</span>
        </button>

        <button
          onClick={() => { setActiveTab('gtfs'); setSearchResult(null); }}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'gtfs' ? 'bg-white text-[#181E4B] shadow-2xs' : 'text-[#5E6282] hover:text-[#181E4B]'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>GTFS Metro</span>
        </button>

        <button
          onClick={() => { setActiveTab('bus'); setSearchResult(null); }}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'bus' ? 'bg-white text-[#181E4B] shadow-2xs' : 'text-[#5E6282] hover:text-[#181E4B]'
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>Buses</span>
        </button>
      </div>

      {/* Query Bar */}
      {activeTab !== 'gtfs' && (
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'flight' 
                  ? "Enter flight code (e.g. AI 882, 6E 521)..." 
                  : activeTab === 'train' 
                  ? "Enter train number (e.g. 20978 Vande Bharat, 12951)..." 
                  : "Search redBus & AbhiBus routes (Delhi to Jaipur)..."
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#181E4B] bg-slate-50/50"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2.5 rounded-xl text-xs font-googleSans font-bold text-white bg-[#181E4B] hover:bg-[#232a68] disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSearching ? "Querying..." : "Search"}
          </button>
        </form>
      )}

      {/* Active Tab Content */}
      <div className="space-y-4">
        
        {/* 1. FLIGHT TELEMETRY (AviationStack) */}
        {activeTab === 'flight' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3 font-mono text-xs">
            {searchResult?.type === 'flight' ? (
              /* Custom search result */
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-[#181E4B]">{searchResult.data.airline} ({searchResult.data.flight_iata})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    searchResult.data.delay_minutes > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {searchResult.data.delay_minutes > 0 ? `+${searchResult.data.delay_minutes}m DELAY` : 'ON TIME'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>Dep: <strong>{searchResult.data.departure_airport}</strong></div>
                  <div>Gate: <strong>{searchResult.data.departure_gate}</strong></div>
                  <div>Arr: <strong>{searchResult.data.arrival_airport}</strong></div>
                  <div>Sched: <strong>{searchResult.data.scheduled_departure}</strong></div>
                </div>
              </div>
            ) : (
              /* Nominal Connection Graph Flight Segment */
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-sky-600" />
                    <span className="font-bold text-[#181E4B]">
                      {flightSeg?.airline || "Air India"} ({flightSeg?.flight_iata || "AI 882"})
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                    +{flightSeg?.delay_minutes || 45}m DELAY (BOM)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 text-[11px]">
                  <div>Departure: <strong className="text-slate-900">{flightSeg?.departure_airport}</strong></div>
                  <div>Terminal / Gate: <strong className="text-slate-900">{flightSeg?.departure_terminal} / {flightSeg?.departure_gate}</strong></div>
                  <div>Arrival: <strong className="text-slate-900">{flightSeg?.arrival_airport}</strong></div>
                  <div>Aircraft: <strong className="text-slate-900">{flightSeg?.aircraft}</strong></div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-400">
                  <span>Source: {flightSeg?.source || "AviationStack Realtime API"}</span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Radio className="w-3 h-3 animate-ping" />
                    <span>Live Radar Stream</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. TRAIN RUNNING STATUS (RailRadar) */}
        {activeTab === 'train' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-[#181E4B]">
                  {trainSeg?.train_name || "Vande Bharat Express (#20978)"}
                </span>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                ON TIME • RUNNING RIGHT TIME
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 text-[11px]">
              <div>Boarding: <strong className="text-slate-900">{trainSeg?.origin || "New Delhi (NDLS)"}</strong></div>
              <div>Platform: <strong className="text-slate-900">{trainSeg?.platform_number || "Platform 16 (NDLS)"}</strong></div>
              <div>Approaching: <strong className="text-slate-900">{trainSeg?.current_location || "Delhi Cantt (DEC)"}</strong></div>
              <div>Speed: <strong className="text-slate-900">{trainSeg?.speed_kmh || 115} km/h</strong></div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-400">
              <span>Source: RailRadar Indian Railways Telemetry (railradar.in)</span>
              <span>TDR Status: Zero Cancellation Fee</span>
            </div>
          </div>
        )}

        {/* 3. GTFS URBAN METRO TRANSIT */}
        {activeTab === 'gtfs' && metroSeg && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#F37021]" />
                <span className="font-bold text-[#181E4B]">{metroSeg.route.route_long_name}</span>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                GTFS 2.0 SPECIFICATION
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 text-[11px]">
              <div>Duration: <strong className="text-slate-900">{metroSeg.transit_metrics.journey_duration_minutes} min</strong></div>
              <div>Frequency: <strong className="text-slate-900">Every {metroSeg.transit_metrics.frequency_headway_minutes} min</strong></div>
              <div>Fare: <strong className="text-slate-900">₹{metroSeg.transit_metrics.fare_inr} INR</strong></div>
              <div>Direct: <strong className="text-emerald-700">IGI T3 ➔ NDLS</strong></div>
            </div>

            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
              <span>Agency: {metroSeg.agency.name}</span>
              <span>gtfs.org Standard Feed</span>
            </div>
          </div>
        )}

        {/* 4. BUSES (redBus & AbhiBus Emergency Recovery) */}
        {activeTab === 'bus' && (
          <div className="space-y-2.5">
            <div className="text-[11px] text-[#5E6282] font-semibold">
              Live Intercity Bus Departures (Delhi ➔ Jaipur Recovery via redBus &amp; AbhiBus):
            </div>
            {busList.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 transition-colors flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#181E4B]">{b.operator}</span>
                    <span className="text-[10px] font-mono text-slate-400">({b.bus_type})</span>
                  </div>
                  <div className="text-[11px] text-[#5E6282] mt-0.5">
                    Dep: <strong>{b.departure_time}</strong> ({b.origin_point}) ➔ Arr: <strong>{b.arrival_time}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-[#181E4B]">₹{b.fare_inr} INR</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">⭐ {b.rating} • {b.available_seats} seats</div>
                  </div>
                  <a
                    href={b.booking_link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#181E4B] transition"
                    title="View on booking platform"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
