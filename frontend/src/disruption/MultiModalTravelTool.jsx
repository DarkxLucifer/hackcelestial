import React, { useState, useEffect } from 'react';
import { 
  Plane, Train, Bus, Navigation, Clock, ShieldCheck, 
  Search, ArrowRight, ExternalLink, RefreshCw, Radio, CheckCircle2,
  AlertTriangle, MapPin, Gauge, Layers, Sparkles, Check
} from 'lucide-react';
import { getApiUrl } from '../api';

export default function MultiModalTravelTool({ extractedTicket, extractedTickets = [] }) {
  // Tabs: 'all' | 'flight' | 'train' | 'bus' | 'metro'
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Clean city extraction helper
  const cleanCity = (name) => {
    if (!name) return '';
    return name.replace(/\s*\([A-Z0-9\s]+\)/gi, '').replace(/\s*Jn\.?/gi, '').replace(/\s*Junction/gi, '').trim();
  };

  // Helper to reliably detect past dates
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

  const isPastTicket = (ticket) => {
    if (!ticket) return false;
    return Boolean(ticket.is_past_journey) || 
           ticket.journey_status === 'COMPLETED' || 
           isPastDate(ticket.travel_date);
  };

  const initialOrigin = cleanCity(extractedTicket?.origin) || 'Amravati';
  const initialDestination = cleanCity(extractedTicket?.destination) || 'Bhusaval';

  const [busOrigin, setBusOrigin] = useState(initialOrigin);
  const [busDestination, setBusDestination] = useState(initialDestination);

  // Synchronize when extractedTicket changes
  useEffect(() => {
    if (extractedTicket) {
      const orig = cleanCity(extractedTicket.origin);
      const dest = cleanCity(extractedTicket.destination);
      if (orig) setBusOrigin(orig);
      if (dest) setBusDestination(dest);

      const isTrain = extractedTicket.carrier?.toLowerCase().includes("rail") || 
                      extractedTicket.carrier?.toLowerCase().includes("train") ||
                      extractedTicket.service_number?.includes("#") ||
                      /^\d{4,5}$/.test(extractedTicket.service_number?.replace(/\D/g, ''));
      
      if (isTrain && extractedTicket.service_number) {
        setSearchQuery(extractedTicket.service_number.replace(/\D/g, '') || '11026');
      } else if (extractedTicket.service_number) {
        setSearchQuery(extractedTicket.service_number);
      }
    }
  }, [extractedTicket]);

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    setSearchResult(null);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q && activeTab !== 'metro' && activeTab !== 'bus' && activeTab !== 'all') return;

    setIsSearching(true);
    try {
      if (activeTab === 'flight') {
        const res = await fetch(getApiUrl(`/api/travel/flight-status?flight=${encodeURIComponent(q || 'AI 882')}`));
        const data = await res.json();
        setSearchResult({ type: 'flight', data });
      } else if (activeTab === 'train') {
        const res = await fetch(getApiUrl(`/api/travel/train-status?train=${encodeURIComponent(q || '11026')}`));
        const data = await res.json();
        setSearchResult({ type: 'train', data });
      } else if (activeTab === 'metro') {
        const res = await fetch(getApiUrl(`/api/travel/gtfs-metro`));
        const data = await res.json();
        setSearchResult({ type: 'metro', data });
      } else if (activeTab === 'bus' || activeTab === 'all') {
        const res = await fetch(getApiUrl(`/api/travel/bus-options?origin=${encodeURIComponent(busOrigin)}&destination=${encodeURIComponent(busDestination)}`));
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
      const res = await fetch(getApiUrl(`/api/travel/gtfs-metro`));
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
      const res = await fetch(getApiUrl(`/api/travel/bus-options?origin=${encodeURIComponent(busOrigin)}&destination=${encodeURIComponent(busDestination)}`));
      const data = await res.json();
      setSearchResult({ type: 'bus', data: data.buses });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const currentOrigin = cleanCity(extractedTicket?.origin) || busOrigin || "Amravati";
  const currentDestination = cleanCity(extractedTicket?.destination) || busDestination || "Bhusaval";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-7 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold mb-1">
            <Radio className="w-3 h-3 text-[#DF6951]" />
            <span>Live Telemetry Engine</span>
          </div>
          <h3 className="font-volkhov font-bold text-xl text-[#181E4B]">
            Travel Engine
          </h3>
          <p className="text-xs text-[#5E6282] mt-0.5">
            Query live travel feeds across Indian Railways (RailRadar), AviationStack (flights), MSRTC &amp; intercity buses, and GTFS metro transit.
          </p>
        </div>

        {extractedTicket && (
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[#181E4B] font-semibold">
              Synced: {extractedTicket.origin} ➔ {extractedTicket.destination}
            </span>
          </div>
        )}
      </div>

      {/* Extracted Ticket Context Banner (Only shown when browsing specific transport tabs so it doesn't duplicate Uploaded Mode) */}
      {extractedTicket && activeTab !== 'all' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-[#DF6951] border border-slate-200 flex items-center justify-center font-bold shadow-2xs">
              {extractedTicket.carrier?.toLowerCase().includes("rail") || extractedTicket.carrier?.toLowerCase().includes("train") ? (
                <Train className="w-4 h-4 text-indigo-600" />
              ) : extractedTicket.carrier?.toLowerCase().includes("bus") ? (
                <Bus className="w-4 h-4 text-emerald-600" />
              ) : (
                <Plane className="w-4 h-4 text-sky-600" />
              )}
            </div>
            <div>
              <div className="font-bold text-[#181E4B] flex items-center gap-2">
                <span>{extractedTicket.carrier} {extractedTicket.service_number}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">
                  PNR: {extractedTicket.pnr}
                </span>
                {extractedTicket.travel_date && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                    Date: {extractedTicket.travel_date}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#5E6282] mt-0.5">
                Route: <strong className="text-slate-800">{extractedTicket.origin}</strong> ➔ <strong className="text-slate-800">{extractedTicket.destination}</strong> &bull; Fare: ₹{extractedTicket.ticket_cost || 840}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
              isPastTicket(extractedTicket)
                ? "bg-slate-100 text-slate-700 border border-slate-200" 
                : (extractedTicket.delay_minutes > 0 ? "bg-amber-100 text-amber-900 border border-amber-200" : "bg-white text-slate-800 border border-slate-300 shadow-2xs")
            }`}>
              {isPastTicket(extractedTicket) ? "COMPLETED SERVICE" : (extractedTicket.delay_minutes > 0 ? `+${extractedTicket.delay_minutes}m DELAY` : "ON-TIME")}
            </span>
          </div>
        </div>
      )}

      {/* 5 Mode Option Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        
        {/* Option 0: UPLOADED TRAVEL MODE */}
        <button 
          type="button"
          onClick={() => handleTabSelect('all')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'all' 
              ? 'border-[#181E4B] bg-slate-50/90 shadow-2xs ring-1 ring-[#181E4B]/10' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-1.5">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div className="font-bold text-xs text-[#181E4B]">Uploaded Mode</div>
          <div className="text-[10px] text-[#5E6282] mt-0.5">Ticket Telemetry</div>
        </button>

        {/* Option 1: Flight */}
        <button 
          type="button"
          onClick={() => handleTabSelect('flight')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'flight' 
              ? 'border-[#181E4B] bg-slate-50/90 shadow-2xs ring-1 ring-[#181E4B]/10' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5">
            <Plane className="w-3.5 h-3.5" />
          </div>
          <div className="font-bold text-xs text-[#181E4B]">Flight Radar</div>
          <div className="text-[10px] text-[#5E6282] mt-0.5">AviationStack</div>
        </button>

        {/* Option 2: Train */}
        <button 
          type="button"
          onClick={() => handleTabSelect('train')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'train' 
              ? 'border-[#181E4B] bg-slate-50/90 shadow-2xs ring-1 ring-[#181E4B]/10' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5">
            <Train className="w-3.5 h-3.5" />
          </div>
          <div className="font-bold text-xs text-[#181E4B]">Train Tracker</div>
          <div className="text-[10px] text-[#5E6282] mt-0.5">RailRadar Live</div>
        </button>

        {/* Option 3: MSRTC & Buses */}
        <button 
          type="button"
          onClick={() => handleTabSelect('bus')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'bus' 
              ? 'border-[#181E4B] bg-slate-50/90 shadow-2xs ring-1 ring-[#181E4B]/10' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
            <Bus className="w-3.5 h-3.5" />
          </div>
          <div className="font-bold text-xs text-[#181E4B]">MSRTC &amp; Buses</div>
          <div className="text-[10px] text-[#5E6282] mt-0.5">MSRTC / redBus</div>
        </button>

        {/* Option 4: GTFS Metro */}
        <button 
          type="button"
          onClick={() => handleTabSelect('metro')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'metro' 
              ? 'border-[#181E4B] bg-slate-50/90 shadow-2xs ring-1 ring-[#181E4B]/10' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-1.5">
            <Navigation className="w-3.5 h-3.5" />
          </div>
          <div className="font-bold text-xs text-[#181E4B]">Airport Metro</div>
          <div className="text-[10px] text-[#5E6282] mt-0.5">GTFS 2.0 Feed</div>
        </button>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* ALL TAB / UPLOADED MODE: Only User's Uploaded Travel Details  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-[#181E4B]">
                {extractedTicket ? `Uploaded Travel Corridor: ${extractedTicket.origin} ➔ ${extractedTicket.destination}` : "Uploaded Journey Telemetry"}
              </div>
              <div className="text-[11px] text-[#5E6282] mt-0.5">
                Authentic extracted travel parameters for your uploaded booking ticket and service mode.
              </div>
            </div>
            {extractedTicket && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700">
                <span>PNR:</span>
                <strong className="text-[#181E4B]">{extractedTicket.pnr}</strong>
              </div>
            )}
          </div>

          {/* Render User's Authentic Uploaded Journey Details */}
          {(() => {
            const raw = ((extractedTickets && extractedTickets.length > 0) ? extractedTickets : (extractedTicket ? [extractedTicket] : []));
            const dict = {};
            raw.forEach(t => {
              if (!t) return;
              const pnr = String(t.pnr ?? '').trim().toUpperCase();
              let key = '';
              if (pnr && pnr !== 'N/A' && pnr !== 'UNKNOWN' && !pnr.startsWith('SIM-')) {
                key = `PNR_${pnr}`;
              } else {
                const orig = String(t.origin ?? '').trim().toUpperCase().replace(/\s*\([A-Z0-9\s]+\)/gi, '');
                const dest = String(t.destination ?? '').trim().toUpperCase().replace(/\s*\([A-Z0-9\s]+\)/gi, '');
                const svc = String(t.service_number ?? '').trim().toUpperCase();
                key = (orig && dest) ? `ROUTE_${orig}_${dest}_${svc}` : `T_${t.id || svc || orig}`;
              }
              if (!dict[key]) {
                dict[key] = { ...t };
              } else {
                const ex = dict[key];
                dict[key] = {
                  ...ex,
                  ...t,
                  booking_source: ex.booking_source || t.booking_source,
                  pnr: (ex.pnr && ex.pnr !== 'N/A') ? ex.pnr : t.pnr,
                  service_number: ex.service_number || t.service_number,
                  carrier: ex.carrier || t.carrier,
                  origin: ex.origin || t.origin,
                  destination: ex.destination || t.destination,
                  scheduled_departure: ex.scheduled_departure || t.scheduled_departure,
                  scheduled_arrival: ex.scheduled_arrival || t.scheduled_arrival,
                  travel_date: ex.travel_date || t.travel_date,
                  ticket_fare: ex.ticket_fare || t.ticket_fare
                };
              }
            });
            const ticketsToRender = Object.values(dict);

            if (ticketsToRender.length === 0) return null;

            return (
              <div className="space-y-3 font-poppins">
                {ticketsToRender.map((ticket, idx, arr) => {
                  const isPast = isPastTicket(ticket);
                  const isTrain = ticket.carrier?.toLowerCase().includes("rail") || ticket.carrier?.toLowerCase().includes("train");
                  const isBus = ticket.carrier?.toLowerCase().includes("bus") || ticket.carrier?.toLowerCase().includes("msrtc");
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-4 shadow-sm">
                    {/* Header: Carrier, Service & Live Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#DF6951] flex items-center justify-center font-bold border border-slate-200">
                          {isTrain ? <Train className="w-5 h-5 text-indigo-600" /> : isBus ? <Bus className="w-5 h-5 text-emerald-600" /> : <Plane className="w-5 h-5 text-sky-600" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#181E4B] flex items-center gap-2">
                            <span>{ticket.carrier}</span>
                            <span className="text-xs font-mono font-normal text-slate-500">
                              ({ticket.service_number})
                            </span>
                            {arr.length > 1 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                                Leg {idx + 1}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Booking Source: {ticket.booking_source || "Uploaded Document"} &bull; Ref: {ticket.pnr}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                          isPast 
                            ? "bg-slate-100 text-slate-700 border border-slate-200" 
                            : (ticket.delay_minutes > 0 ? "bg-amber-100 text-amber-900 border border-amber-200" : "bg-white text-slate-800 border border-slate-300 shadow-2xs")
                        }`}>
                          {isPast 
                            ? "PAST SERVICE (COMPLETED)" 
                            : (ticket.delay_minutes > 0 ? `+${ticket.delay_minutes}m DELAY` : "RUNNING RIGHT TIME")}
                        </span>
                      </div>
                    </div>

                    {/* Corridor & Times Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Origin / Departure</span>
                        <strong className="text-slate-900 font-bold text-xs mt-0.5 block">{ticket.origin}</strong>
                        <span className="text-[11px] text-slate-500 font-mono">{ticket.scheduled_departure ? `Departs: ${ticket.scheduled_departure}` : "Scheduled Departure"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Destination / Arrival</span>
                        <strong className="text-slate-900 font-bold text-xs mt-0.5 block">{ticket.destination}</strong>
                        <span className="text-[11px] text-slate-500 font-mono">{ticket.scheduled_arrival ? `Arrives: ${ticket.scheduled_arrival}` : "Scheduled Arrival"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Travel Date</span>
                        <strong className="text-slate-900 font-bold text-xs mt-0.5 block">{ticket.travel_date || "Today"}</strong>
                        <span className="text-[11px] text-slate-500 font-mono">{isPast ? "Journey completed" : "Active run"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ticket Fare</span>
                        <strong className="text-[#181E4B] font-bold text-sm mt-0.5 block">
                          ₹{ticket.ticket_cost || 840} {ticket.currency || 'INR'}
                        </strong>
                        <span className="text-[10px] font-mono text-emerald-600 font-semibold">Confirmed Ticket</span>
                      </div>
                    </div>

                    {/* Operational Details & Legal Passenger Framework */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Operational Note:</span>
                        <span className="text-slate-600">{ticket.disruption_reason || "Operating nominally under scheduled timetable."}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {isTrain ? "IRCTC TDR & Railway Passenger Charter Applicable" : "DGCA CAR Section 3 Statutory Rights Protected"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            );
          })() || (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#181E4B] flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#181E4B]">No Travel Ticket Uploaded Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Upload your travel ticket (PDF, image, or e-ticket) in the AI Chatbot to see your authentic travel mode telemetry, route corridor, and connection analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

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
                  : "Enter train number or name (e.g. 11026, 20978, 12952)..."
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
            <div className="font-bold text-xs text-[#181E4B]">Airport Express Metro Line (GTFS 2.0)</div>
            <div className="text-[11px] text-[#5E6282] mt-0.5">High-speed dedicated corridor linking airport terminal directly to railway station hub.</div>
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

      {/* Bus Route Query (Supports MSRTC and intercity) */}
      {activeTab === 'bus' && (
        <form onSubmit={handleSearchBuses} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5E6282] mb-1">Departure City / Depot:</label>
              <input
                type="text"
                value={busOrigin}
                onChange={(e) => setBusOrigin(e.target.value)}
                placeholder="e.g. Amravati or Delhi"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-poppins focus:outline-none focus:border-[#181E4B] bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5E6282] mb-1">Destination City / Depot:</label>
              <input
                type="text"
                value={busDestination}
                onChange={(e) => setBusDestination(e.target.value)}
                placeholder="e.g. Bhusaval or Jaipur"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-poppins focus:outline-none focus:border-[#181E4B] bg-white"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-500 font-mono">
              Live retrieval: MSRTC Shivshahi, Ordinary Express, Shivneri &amp; redBus
            </span>
            <button
              type="submit"
              disabled={isSearching || !busOrigin.trim() || !busDestination.trim()}
              className="px-4 py-2 rounded-xl text-xs font-googleSans font-bold text-white bg-[#181E4B] hover:bg-[#232a68] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSearching ? "Retrieving State Buses..." : "Search MSRTC & Buses"}
            </button>
          </div>
        </form>
      )}

      {/* Loading Indicator */}
      {isSearching && (
        <div className="p-6 text-center rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-mono text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#181E4B]" />
          <span>Querying real-time telemetry API...</span>
        </div>
      )}

      {/* Live Search Output (Displayed only when user searches in specific tab) */}
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
                  searchResult.data.delay_minutes > 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-white text-slate-800 border border-slate-300 shadow-2xs'
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
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  searchResult.data.delay_minutes > 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-white text-slate-800 border border-slate-300 shadow-2xs'
                }`}>
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
                <span className="font-bold text-[#181E4B]">{searchResult.data.route?.route_long_name || "Airport Express Line"}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                  GTFS 2.0 SPECIFICATION
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 text-[11px]">
                <div>Duration: <strong>{searchResult.data.transit_metrics?.journey_duration_minutes || 19} min</strong></div>
                <div>Frequency: <strong>Every {searchResult.data.transit_metrics?.frequency_headway_minutes || 10} min</strong></div>
                <div>Fare: <strong>₹{searchResult.data.transit_metrics?.fare_inr || 60} INR</strong></div>
                <div>Direct: <strong className="text-emerald-700">IGI T3 ➔ Station Hub</strong></div>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
                <span>Agency: {searchResult.data.agency?.name || "Metro Rail Corporation"}</span>
                <span>gtfs.org Standard Feed</span>
              </div>
            </div>
          )}

          {/* Bus Result (MSRTC + redBus) */}
          {searchResult.type === 'bus' && Array.isArray(searchResult.data) && (
            <div className="space-y-2">
              <div className="text-[11px] text-[#5E6282] font-semibold pb-1 border-b border-slate-200">
                Available Departures ({busOrigin} ➔ {busDestination} via MSRTC &amp; redBus):
              </div>
              {searchResult.data.map((b) => (
                <div key={b.id} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-[11px]">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#181E4B]">{b.operator}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                        {b.bus_type}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[10px] mt-0.5">
                      Dep: {b.departure_time} &bull; {b.origin_point}
                    </div>
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
