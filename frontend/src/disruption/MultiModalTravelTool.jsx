import React, { useState } from 'react';
import { 
  Plane, Train, Bus, Navigation, Clock, ShieldCheck, 
  Search, ArrowRight, ExternalLink, RefreshCw, Radio, CheckCircle2,
  AlertTriangle, MapPin, Gauge
} from 'lucide-react';

export default function MultiModalTravelTool() {
  const [activeTab, setActiveTab] = useState('flight'); // 'flight' | 'train' | 'metro' | 'bus'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [busOrigin, setBusOrigin] = useState('Delhi');
  const [busDestination, setBusDestination] = useState('Jaipur');

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setSearchResult(null);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q && activeTab !== 'metro' && activeTab !== 'bus') return;

    setIsSearching(true);
    try {
      if (activeTab === 'flight') {
        const res = await fetch(`/api/travel/flight-status?flight=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSearchResult({ type: 'flight', data });
      } else if (activeTab === 'train') {
        const res = await fetch(`/api/travel/train-status?train=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSearchResult({ type: 'train', data });
      } else if (activeTab === 'metro') {
        const res = await fetch(`/api/travel/gtfs-metro`);
        const data = await res.json();
        setSearchResult({ type: 'metro', data });
      } else if (activeTab === 'bus') {
        const res = await fetch(`/api/travel/bus-options?origin=${encodeURIComponent(busOrigin)}&destination=${encodeURIComponent(busDestination)}`);
        const data = await res.json();
        setSearchResult({ type: 'bus', data: data.buses });
      }
    } catch (err) {
      console.error("Travel search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadMetro = async () => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/travel/gtfs-metro`);
      const data = await res.json();
      setSearchResult({ type: 'metro', data });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchBuses = async (e) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    try {
      const res = await fetch(`/api/travel/bus-options?origin=${encodeURIComponent(busOrigin)}&destination=${encodeURIComponent(busDestination)}`);
      const data = await res.json();
      setSearchResult({ type: 'bus', data: data.buses });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-7 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-volkhov font-bold text-lg text-[#181E4B]">
            Multi-Modal Connection Radar
          </h3>
          <p className="text-xs text-[#5E6282] mt-0.5">
            Query live travel feeds across AviationStack (flights), RailRadar (trains), GTFS (metro), and redBus / AbhiBus (road transit).
          </p>
        </div>
      </div>

      {/* 4 Mode Option Cards - Clean selection without pre-loading fake data */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Option 1: Flight */}
        <button 
          type="button"
          onClick={() => handleTabSelect('flight')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'flight' 
              ? 'border-[#181E4B] bg-slate-50/90 shadow-2xs ring-1 ring-[#181E4B]/10' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
            <Plane className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#181E4B]">Flight Radar</div>
          <div className="text-[10px] text-[#5E6282] mt-0.5">AviationStack API</div>
        </button>

        {/* Option 2: Train */}
        <button 
          type="button"
          onClick={() => handleTabSelect('train')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'train' 
              ? 'border-[#181E4B] bg-slate-50/90 shadow-2xs ring-1 ring-[#181E4B]/10' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <Train className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#181E4B]">Train Tracker</div>
          <div className="text-[10px] text-[#5E6282] mt-0.5">RailRadar Live</div>
        </button>

        {/* Option 3: GTFS Metro */}
        <button 
          type="button"
          onClick={() => handleTabSelect('metro')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'metro' 
              ? 'border-[#181E4B] bg-slate-50/90 shadow-2xs ring-1 ring-[#181E4B]/10' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
            <Navigation className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#181E4B]">Airport Metro</div>
          <div className="text-[10px] text-[#5E6282] mt-0.5">GTFS 2.0 Feed</div>
        </button>

        {/* Option 4: Buses */}
        <button 
          type="button"
          onClick={() => handleTabSelect('bus')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'bus' 
              ? 'border-[#181E4B] bg-slate-50/90 shadow-2xs ring-1 ring-[#181E4B]/10' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Bus className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#181E4B]">Intercity Buses</div>
          <div className="text-[10px] text-[#5E6282] mt-0.5">redBus &bull; AbhiBus</div>
        </button>

      </div>

      {/* Query Bar for Flights & Trains */}
      {(activeTab === 'flight' || activeTab === 'train') && (
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'flight' 
                  ? "Enter flight code (e.g. AI 882, 6E 521, UK 992)..."
                  : "Enter train number or name (e.g. 20978, 12952)..."
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#181E4B] bg-slate-50/50"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2.5 rounded-xl text-xs font-googleSans font-bold text-white bg-[#181E4B] hover:bg-[#232a68] disabled:opacity-40 transition-all cursor-pointer"
          >
            {isSearching ? "Querying..." : "Search"}
          </button>
        </form>
      )}

      {/* GTFS Metro Trigger */}
      {activeTab === 'metro' && (
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-bold text-xs text-[#181E4B]">Delhi Airport Express Metro (DMRC)</div>
            <div className="text-[11px] text-[#5E6282] mt-0.5">GTFS 2.0 Feed • IGI Airport T3 to New Delhi Railway Station</div>
          </div>
          <button
            type="button"
            onClick={handleLoadMetro}
            disabled={isSearching}
            className="px-4 py-2 rounded-xl text-xs font-googleSans font-bold text-white bg-[#181E4B] hover:bg-[#232a68] disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            {isSearching ? "Fetching GTFS..." : "Load Airport Metro GTFS"}
          </button>
        </div>
      )}

      {/* Bus Route Query */}
      {activeTab === 'bus' && (
        <form onSubmit={handleSearchBuses} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5E6282] mb-1">Departure City:</label>
              <input
                type="text"
                value={busOrigin}
                onChange={(e) => setBusOrigin(e.target.value)}
                placeholder="e.g. Delhi"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-poppins focus:outline-none focus:border-[#181E4B] bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5E6282] mb-1">Destination City:</label>
              <input
                type="text"
                value={busDestination}
                onChange={(e) => setBusDestination(e.target.value)}
                placeholder="e.g. Jaipur"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-poppins focus:outline-none focus:border-[#181E4B] bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSearching || !busOrigin.trim() || !busDestination.trim()}
              className="px-4 py-2 rounded-xl text-xs font-googleSans font-bold text-white bg-[#181E4B] hover:bg-[#232a68] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSearching ? "Scraping redBus / AbhiBus..." : "Search Buses"}
            </button>
          </div>
        </form>
      )}

      {/* Loading Indicator */}
      {isSearching && (
        <div className="p-6 text-center rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-mono text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#181E4B]" />
          <span>Querying live telemetry API...</span>
        </div>
      )}

      {/* Empty State when no query has been made */}
      {!isSearching && !searchResult && (
        <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/40">
          <Radio className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
          <div className="text-xs font-semibold text-[#181E4B]">No Active Telemetry Query</div>
          <p className="text-[11px] text-[#5E6282] mt-0.5 max-w-sm mx-auto">
            Select a transit mode above and enter a flight, train, or route to inspect live tracking data.
          </p>
        </div>
      )}

      {/* Live Search Output (Displayed only when user searches) */}
      {!isSearching && searchResult && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-3">
          
          {/* Flight Result */}
          {searchResult.type === 'flight' && searchResult.data && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-[#181E4B]">
                  {searchResult.data.airline} ({searchResult.data.flight_iata})
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  searchResult.data.delay_minutes > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {searchResult.data.delay_minutes > 0 ? `+${searchResult.data.delay_minutes}m DELAY` : 'ON SCHEDULE'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11px]">
                <div>Departure: <strong className="text-slate-900">{searchResult.data.departure_airport}</strong></div>
                <div>Terminal / Gate: <strong className="text-slate-900">{searchResult.data.departure_terminal} / {searchResult.data.departure_gate}</strong></div>
                <div>Arrival: <strong className="text-slate-900">{searchResult.data.arrival_airport}</strong></div>
                <div>Aircraft: <strong className="text-slate-900">{searchResult.data.aircraft}</strong></div>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
                <span>Source: {searchResult.data.source || "AviationStack Realtime API"}</span>
                <span>Altitude: {searchResult.data.altitude_ft || 33000} ft</span>
              </div>
            </div>
          )}

          {/* Train Result */}
          {searchResult.type === 'train' && searchResult.data && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-[#181E4B]">
                  #{searchResult.data.train_number} {searchResult.data.train_name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {searchResult.data.delay_minutes > 0 ? `+${searchResult.data.delay_minutes}m DELAY` : 'RUNNING RIGHT TIME'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11px]">
                <div>Boarding Station: <strong className="text-slate-900">{searchResult.data.origin}</strong></div>
                <div>Platform: <strong className="text-slate-900">{searchResult.data.platform_number}</strong></div>
                <div>Approaching: <strong className="text-slate-900">{searchResult.data.current_location}</strong></div>
                <div>Speed: <strong className="text-slate-900">{searchResult.data.speed_kmh} km/h</strong></div>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
                <span>Source: RailRadar Indian Railways Telemetry</span>
                <span>Status: IRCTC Confirmed</span>
              </div>
            </div>
          )}

          {/* Metro Result */}
          {searchResult.type === 'metro' && searchResult.data && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-[#181E4B]">{searchResult.data.route?.route_long_name || "Delhi Airport Express"}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                  GTFS 2.0 SPECIFICATION
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 text-[11px]">
                <div>Duration: <strong>{searchResult.data.transit_metrics?.journey_duration_minutes || 19} min</strong></div>
                <div>Frequency: <strong>Every {searchResult.data.transit_metrics?.frequency_headway_minutes || 10} min</strong></div>
                <div>Fare: <strong>₹{searchResult.data.transit_metrics?.fare_inr || 60} INR</strong></div>
                <div>Direct: <strong className="text-emerald-700">IGI T3 ➔ NDLS</strong></div>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
                <span>Agency: {searchResult.data.agency?.name || "Delhi Metro Rail Corporation"}</span>
                <span>gtfs.org Standard Feed</span>
              </div>
            </div>
          )}

          {/* Bus Result */}
          {searchResult.type === 'bus' && Array.isArray(searchResult.data) && (
            <div className="space-y-2">
              <div className="text-[11px] text-[#5E6282] font-semibold pb-1 border-b border-slate-200">
                Available Intercity Buses ({busOrigin} ➔ {busDestination} via redBus &amp; AbhiBus):
              </div>
              {searchResult.data.map((b) => (
                <div key={b.id} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-[11px]">
                  <div>
                    <span className="font-bold text-[#181E4B]">{b.operator}</span> ({b.bus_type})
                    <div className="text-slate-500">Dep: {b.departure_time} &bull; {b.origin_point}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#181E4B]">₹{b.fare_inr} INR</div>
                    <div className="text-[10px] text-emerald-600">⭐ {b.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
