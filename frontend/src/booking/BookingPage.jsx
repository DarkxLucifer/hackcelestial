import React, { useState, useEffect } from 'react';
import { 
  Plane, Train, Bus, Building2, ShieldCheck, Download, 
  ArrowLeft, ArrowRight, Check, Calendar, MapPin, User, Clock, QrCode,
  Search, ArrowUpDown, Luggage, AlertTriangle, CreditCard, X, Sparkles,
  Printer, RefreshCw, SlidersHorizontal, ShieldAlert,
  ExternalLink, ArrowUpRight, Shield, Compass, Star
} from 'lucide-react';
import { 
  searchBookingInventory, 
  createBooking, 
  fetchBookingsList, 
  cancelBooking 
} from '../api';

const POPULAR_HUBS = [
  { code: 'BOM', label: 'Mumbai (BOM)' },
  { code: 'DEL', label: 'Delhi (DEL)' },
  { code: 'BLR', label: 'Bengaluru (BLR)' },
  { code: 'JAI', label: 'Jaipur (JAI)' },
  { code: 'HYD', label: 'Hyderabad (HYD)' },
  { code: 'CCU', label: 'Kolkata (CCU)' },
  { code: 'MAA', label: 'Chennai (MAA)' },
  { code: 'GOI', label: 'Goa (GOI)' },
  { code: 'PNQ', label: 'Pune (PNQ)' },
  { code: 'NAG', label: 'Nagpur (NAG)' }
];

export default function BookingPage({ user, itinerary, activeDisruption, onNavigate, onSimulateAlpine, t }) {
  // Tabs: 'search' | 'my_bookings' | 'active'
  const [tab, setTab] = useState('search');
  
  // Search state
  const [origin, setOrigin] = useState('Mumbai (BOM)');
  const [destination, setDestination] = useState('Delhi (DEL)');
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [modeFilter, setModeFilter] = useState('all'); // 'all' | 'flight' | 'train' | 'bus' | 'hotel'
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  
  // Checkout Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkoutPassenger, setCheckoutPassenger] = useState({
    name: user?.name || 'Yash Sharma',
    email: user?.email || 'traveler@voyage.ai',
    phone: '+91 98200 12345',
    seatPreference: 'Window'
  });
  const [selectedTier, setSelectedTier] = useState('Voyage Plus');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(null);

  // My Bookings from Database
  const [bookingsList, setBookingsList] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // QR Code & Ticket Viewer Modals
  const [activeQrModal, setActiveQrModal] = useState(null);
  const [activeTicketModal, setActiveTicketModal] = useState(null);
  const [cancelStatus, setCancelStatus] = useState(null);

  // Partner Gateway Modal & Redirection State
  const [partnerGatewayModal, setPartnerGatewayModal] = useState(null);
  const [partnerRedirectToast, setPartnerRedirectToast] = useState(null);
  const [paymentChannel, setPaymentChannel] = useState('voyage'); // 'voyage' | 'partner'

  const handleOpenPartnerGateway = (item) => {
    setPartnerGatewayModal(item);
  };

  const handleRedirectToPartnerGateway = (gatewayName, targetUrl) => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setPartnerRedirectToast({
      gateway: gatewayName,
      message: `Redirected to official ${gatewayName} payment gateway. Route parameters synchronized.`
    });
    setTimeout(() => setPartnerRedirectToast(null), 7000);
    setPartnerGatewayModal(null);
  };

  // Initial load: search inventory & load bookings list
  useEffect(() => {
    loadSearchResults();
    loadBookings();
  }, []);

  const loadSearchResults = async () => {
    setIsSearching(true);
    const data = await searchBookingInventory({
      origin,
      destination,
      date: travelDate,
      mode: modeFilter
    });
    setSearchResults(data);
    setIsSearching(false);
  };

  const loadBookings = async () => {
    setIsLoadingBookings(true);
    const data = await fetchBookingsList();
    if (data && data.bookings) {
      setBookingsList(data.bookings);
    }
    setIsLoadingBookings(false);
  };

  const handleSwapLocations = () => {
    const tmp = origin;
    setOrigin(destination);
    setDestination(tmp);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSearchResults();
  };

  const handleOpenCheckout = (item) => {
    setSelectedItem(item);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsBookingSubmitting(true);

    const baseFare = Number(selectedItem.fare_inr || 4500);
    const tax = Math.round(baseFare * 0.10);
    const fee = selectedTier === 'Voyage Plus' ? 499 : (selectedTier === 'Voyage Pro' ? 899 : 199);

    const payload = {
      passenger_name: checkoutPassenger.name,
      passenger_email: checkoutPassenger.email,
      passenger_phone: checkoutPassenger.phone,
      seat_preference: checkoutPassenger.seatPreference,
      origin: selectedItem.origin || origin,
      destination: selectedItem.destination || destination,
      travel_date: travelDate,
      transport_mode: selectedItem.mode || 'flight',
      carrier: selectedItem.carrier,
      service_number: selectedItem.service_number,
      departure_time: selectedItem.dep_time,
      arrival_time: selectedItem.arr_time,
      duration: selectedItem.duration,
      seat_class: selectedItem.seat_class || 'Standard Economy',
      fare_inr: baseFare,
      tax_inr: tax,
      protection_tier: selectedTier
    };

    const res = await createBooking(payload);
    setIsBookingSubmitting(false);

    if (res && res.status === 'BOOKING_CONFIRMED') {
      setBookingSuccessModal(res.booking);
      setSelectedItem(null);
      await loadBookings();
    } else {
      alert("Failed to save booking. Please try again.");
    }
  };

  const handleCancelBooking = async (ref) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${ref}? Instant refund will be computed under DGCA/IRCTC regulations.`)) {
      return;
    }
    const res = await cancelBooking(ref);
    if (res && res.success) {
      setCancelStatus(res);
      await loadBookings();
      setTimeout(() => setCancelStatus(null), 6000);
    }
  };

  // Filtered inventory options
  const allResults = [];
  if (searchResults) {
    if (modeFilter === 'all' || modeFilter === 'flight') allResults.push(...(searchResults.flights || []));
    if (modeFilter === 'all' || modeFilter === 'train') allResults.push(...(searchResults.trains || []));
    if (modeFilter === 'all' || modeFilter === 'bus') allResults.push(...(searchResults.buses || []));
    if (modeFilter === 'all' || modeFilter === 'hotel') allResults.push(...(searchResults.hotels || []));
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#181E4B] font-poppins pt-24 pb-20 px-4 sm:px-8 max-w-6xl mx-auto">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-xs font-semibold text-[#5E6282] hover:text-[#181E4B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Voyage Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 flex items-center gap-2 font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AUTONOMOUS RESILIENCE: ACTIVE</span>
          </div>
          <button
            onClick={() => onNavigate('/disruption')}
            className="text-xs font-bold text-white bg-[#A35645] hover:bg-[#b8614e] px-3.5 py-1.5 rounded-full shadow-xs transition-colors cursor-pointer"
          >
            Disruption Twin
          </button>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div className="mt-8 mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-volkhov font-bold text-3xl sm:text-4xl text-[#181E4B]">
            Real-Time Booking &amp; Inventory Engine
          </h1>
          <p className="text-sm text-[#5E6282] mt-1 max-w-2xl">
            Live multi-modal flight, train, bus, and hotel reservations backed by SQLite database persistence, AviationStack flight schedules, and XGBoost AI delay risk analysis.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/70 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setTab('search')}
            className={`px-4 py-2 rounded-xl font-googleSans text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'search' ? 'bg-white text-[#181E4B] shadow-sm' : 'text-[#5E6282] hover:text-[#181E4B]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#F1A501]" />
            <span>Search &amp; Book</span>
          </button>
          <button
            onClick={() => { setTab('my_bookings'); loadBookings(); }}
            className={`px-4 py-2 rounded-xl font-googleSans text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'my_bookings' ? 'bg-white text-[#181E4B] shadow-sm' : 'text-[#5E6282] hover:text-[#181E4B]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>My Bookings ({bookingsList.length})</span>
          </button>
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 rounded-xl font-googleSans text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'active' ? 'bg-white text-[#181E4B] shadow-sm' : 'text-[#5E6282] hover:text-[#181E4B]'
            }`}
          >
            <Plane className="w-3.5 h-3.5 text-blue-600" />
            <span>Active Corridor</span>
          </button>
        </div>
      </div>

      {/* Partner Gateway Redirect Notification Toast Banner */}
      {partnerRedirectToast && (
        <div className="mb-6 p-4 rounded-2xl bg-[#181E4B] text-white border border-amber-400 text-xs flex items-center justify-between animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <strong className="text-amber-300 font-bold">{partnerRedirectToast.gateway} Gateway:</strong> {partnerRedirectToast.message}
            </div>
          </div>
          <button
            onClick={() => setPartnerRedirectToast(null)}
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Cancellation Notice Banner */}
      {cancelStatus && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{cancelStatus.message}</span>
          </div>
          <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-1 rounded-md border border-amber-200">
            REFUND: ₹{cancelStatus.refund_amount?.toLocaleString('en-IN')}
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: REAL SEARCH & BOOK INVENTORY ENGINE                                */}
      {/* ========================================================================= */}
      {tab === 'search' && (
        <div className="space-y-6">
          
          {/* Real Search Bar Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              
              {/* Row 1: Origin, Swap, Destination, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                {/* Origin */}
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Origin Hub / City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[#F1A501] focus:bg-white cursor-pointer"
                    >
                      {POPULAR_HUBS.map(h => (
                        <option key={`orig_${h.code}`} value={h.label}>{h.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="sm:col-span-1 flex justify-center pt-2 sm:pt-4">
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    title="Swap Origin and Destination"
                    className="p-2.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-xs active:rotate-180 duration-200"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Destination */}
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Destination City / Terminal
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[#F1A501] focus:bg-white cursor-pointer"
                    >
                      {POPULAR_HUBS.map(h => (
                        <option key={`dest_${h.code}`} value={h.label}>{h.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Travel Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[#F1A501] focus:bg-white"
                    />
                  </div>
                </div>

              </div>

              {/* Row 2: Mode Filters & Submit Button */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { key: 'all', label: 'All Modes' },
                    { key: 'flight', label: '✈️ Flights' },
                    { key: 'train', label: '🚆 Trains' },
                    { key: 'bus', label: '🚌 Buses' },
                    { key: 'hotel', label: '🏨 Lodging' }
                  ].map(m => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => {
                        setModeFilter(m.key);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        modeFilter === m.key
                          ? 'bg-[#181E4B] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-6 py-2.5 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Querying Live Corridors...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search Real Inventory</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* AI Corridor Resilience Telemetry Banner */}
          {searchResults?.xgboost_corridor_telemetry && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0b272c] text-white flex flex-wrap items-center justify-between gap-4 text-xs font-poppins">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">
                    XGBoost Corridor Intelligence: {searchResults.origin} ➔ {searchResults.destination}
                  </span>
                  <span className="text-slate-300 text-[11px]">
                    Expected delay: {searchResults.xgboost_corridor_telemetry.predicted_route_delay_mins} mins • Cancellation probability: {(searchResults.xgboost_corridor_telemetry.cancellation_probability * 100).toFixed(1)}% • Atmosphere: {searchResults.xgboost_corridor_telemetry.weather_safety_index}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  ALL TRIPS GUARANTEED WITH GHOST HOLDS
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VOYAGE BEST PLAN TO TRAVEL (OPTIMAL MULTI-MODAL PATH WITH REAL DATA)      */}
          {/* ========================================================================= */}
          {allResults.length > 0 && (
            (() => {
              const bestCandidate = allResults.find(r => r.mode === 'flight') || allResults.find(r => r.mode === 'train') || allResults[0];
              const isFlight = bestCandidate.mode === 'flight';
              const isTrain = bestCandidate.mode === 'train';
              const baseFare = Number(bestCandidate.fare_inr || 4500);

              return (
                <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-amber-50/20 to-orange-50/30 border-2 border-amber-300 shadow-md relative overflow-hidden transition-all hover:shadow-lg">
                  {/* Top Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-200/60">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-[#F1A501] text-white shadow-xs">
                        <Sparkles className="w-5 h-5 fill-white" />
                      </span>
                      <div>
                        <div className="text-xs font-mono font-bold uppercase text-[#D96B43] tracking-wider flex items-center gap-1.5">
                          <span>VOYAGE RECOMMENDED • BEST PLAN TO TRAVEL</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <h2 className="font-volkhov font-bold text-xl sm:text-2xl text-[#181E4B]">
                          Optimal Multi-Modal Travel Path ({origin} ➔ {destination})
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        98.6% Punctuality Score
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        {travelDate}
                      </span>
                    </div>
                  </div>

                  {/* Multi-Modal Journey Steps Timeline */}
                  <div className="my-5">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      End-to-End Synthesized Travel Sequence (Real Corridors):
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      
                      {/* Step 1: Feeder Transit */}
                      <div className="p-3.5 rounded-2xl bg-white/95 border border-slate-200 shadow-2xs flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                          <Train className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Step 1 • Feeder Link</div>
                          <div className="text-xs font-bold text-slate-900">Airport / Station Express Metro</div>
                          <div className="text-[11px] text-slate-500 font-mono">30m transfer (Traffic-isolated)</div>
                        </div>
                      </div>

                      {/* Step 2: Primary Carrier */}
                      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300 shadow-xs flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isFlight ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isFlight ? <Plane className="w-4 h-4" /> : <Train className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-[10px] font-mono font-bold uppercase text-[#D96B43]">Step 2 • Primary Speed Leg</div>
                          <div className="text-xs font-bold text-slate-900">{bestCandidate.carrier} ({bestCandidate.service_number})</div>
                          <div className="text-[11px] text-emerald-700 font-mono font-semibold">
                            {bestCandidate.dep_time} ➔ {bestCandidate.arr_time} ({bestCandidate.duration})
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Destination Shuttle */}
                      <div className="p-3.5 rounded-2xl bg-white/95 border border-slate-200 shadow-2xs flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                          <Bus className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Step 3 • Hub Handoff</div>
                          <div className="text-xs font-bold text-slate-900">Zero-Wait EV Shuttle / Cab</div>
                          <div className="text-[11px] text-slate-500 font-mono">25m transfer (Pre-dispatched)</div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Summary & Dual CTAs */}
                  <div className="pt-4 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Combined Fare</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-volkhov font-bold text-2xl text-[#181E4B]">₹{baseFare.toLocaleString('en-IN')}</span>
                          <span className="text-[11px] text-slate-500 font-mono">all-inclusive</span>
                        </div>
                      </div>

                      <div className="hidden sm:block border-l border-slate-200 pl-4">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">Disruption Resilience</span>
                        <span className="text-xs font-mono font-bold text-emerald-600">Ghost Hold Shield Armed</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleOpenPartnerGateway(bestCandidate)}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                        <span>Redirect to Partner Gateway</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenCheckout(bestCandidate)}
                        className="px-5 py-2.5 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-white" />
                        <span>Book Best Plan (Voyage Resilient)</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })()
          )}

          {/* Search Results List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-sm text-[#181E4B] uppercase tracking-wider">
                Available Departures ({allResults.length} Real Options Found)
              </h3>
              <span className="text-xs text-slate-500">
                Sorted by Punctuality &amp; Multi-Modal Synergy
              </span>
            </div>

            {isSearching ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <RefreshCw className="w-8 h-8 text-[#F1A501] animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-700">Querying real flight &amp; rail databases...</p>
                <p className="text-xs text-slate-400 font-mono">Connecting AviationStack, RailRadar, and Open-Meteo corridors</p>
              </div>
            ) : allResults.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-3xl border border-slate-200">
                <p className="text-sm font-semibold text-slate-700">No trips found for this specific mode filter.</p>
                <button
                  onClick={() => setModeFilter('all')}
                  className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  View All Multi-Modal Options
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {allResults.map((item, idx) => (
                  <div
                    key={item.id || `res_${idx}`}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-wrap items-center justify-between gap-4"
                  >
                    
                    {/* Left: Carrier Icon & Service Information */}
                    <div className="flex items-center gap-4 min-w-[240px]">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        item.mode === 'flight' ? 'bg-sky-100 text-sky-600' :
                        item.mode === 'train' ? 'bg-emerald-100 text-emerald-600' :
                        item.mode === 'bus' ? 'bg-indigo-100 text-indigo-600' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.mode === 'flight' && <Plane className="w-6 h-6" />}
                        {item.mode === 'train' && <Train className="w-6 h-6" />}
                        {item.mode === 'bus' && <Bus className="w-6 h-6" />}
                        {item.mode === 'hotel' && <Building2 className="w-6 h-6" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-poppins font-bold text-sm sm:text-base text-[#181E4B]">
                            {item.carrier}
                          </span>
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            {item.service_number}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {item.aircraft || item.seat_class || item.duration} • {item.dep_terminal ? `Terminal ${item.dep_terminal}` : (item.platform || 'Direct')}
                        </div>
                        <div className="text-[11px] font-mono text-emerald-600 font-semibold mt-0.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{item.reliability_score || '95% On-Time'}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">{item.available_seats || 12} seats left</span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Timing & Duration Bar */}
                    <div className="flex items-center gap-6 text-center">
                      <div>
                        <span className="font-bold text-base text-[#181E4B] block">{item.dep_time}</span>
                        <span className="text-[11px] text-slate-400 font-mono">Departure</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-mono uppercase">{item.duration}</span>
                        <div className="w-20 sm:w-24 h-0.5 bg-slate-300 my-1 relative">
                          <div className="w-2 h-2 rounded-full bg-[#181E4B] absolute -top-[3px] left-1/2 -translate-x-1/2" />
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold">Non-stop</span>
                      </div>
                      <div>
                        <span className="font-bold text-base text-[#181E4B] block">{item.arr_time}</span>
                        <span className="text-[11px] text-slate-400 font-mono">Arrival</span>
                      </div>
                    </div>

                    {/* Right: Fare & Dual Book / Partner Gateway Actions */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 text-right">
                      <div>
                        <span className="font-volkhov font-bold text-xl sm:text-2xl text-[#181E4B] block">
                          ₹{Number(item.fare_inr || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          +10% taxes &amp; immunity
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenPartnerGateway(item)}
                          title="Handoff to official authenticated portal (redBus / IRCTC / Airline)"
                          className="px-3 py-2.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                          <span>Partner Gateway</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenCheckout(item)}
                          className="px-4 py-2.5 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY BOOKINGS & PERSISTENT SQLITE DATABASE RECORDS                   */}
      {/* ========================================================================= */}
      {tab === 'my_bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-base text-[#181E4B]">
              Confirmed Passenger Bookings (Stored in Voyage Disruption Database)
            </h3>
            <button
              onClick={loadBookings}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Records</span>
            </button>
          </div>

          {isLoadingBookings ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
              <RefreshCw className="w-8 h-8 text-[#F1A501] animate-spin mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Loading your confirmed itineraries from database...</p>
            </div>
          ) : bookingsList.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Luggage className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No active bookings found in your account.</p>
              <button
                onClick={() => setTab('search')}
                className="px-4 py-2 rounded-xl bg-[#F1A501] text-white text-xs font-bold shadow-sm"
              >
                Search &amp; Book Your First Trip
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookingsList.map((bk) => {
                const isCancelled = bk.status === 'CANCELLED';
                return (
                  <div
                    key={bk.booking_ref}
                    className={`p-6 rounded-3xl bg-white border transition-all shadow-sm ${
                      isCancelled ? 'border-slate-200 opacity-60 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                          isCancelled ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#181E4B]">
                              {bk.booking_ref}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {bk.status}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            Passenger: <strong className="text-slate-800">{bk.passenger_name}</strong> • {bk.passenger_email}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-volkhov font-bold text-xl text-[#181E4B] block">
                          ₹{Number(bk.total_fare_inr || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                          {bk.protection_tier} Active
                        </span>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-poppins">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-mono uppercase">Route &amp; Carrier</span>
                        <span className="font-bold text-sm text-slate-900 block mt-0.5">
                          {bk.origin} ➔ {bk.destination}
                        </span>
                        <span className="text-slate-500 font-medium">
                          {bk.carrier} ({bk.service_number})
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-mono uppercase">Timing &amp; Date</span>
                        <span className="font-semibold text-slate-800 block mt-0.5">
                          {bk.departure_time} - {bk.arrival_time}
                        </span>
                        <span className="text-slate-500">
                          Date: {bk.travel_date} • {bk.duration}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-mono uppercase">Seat &amp; Class</span>
                        <span className="font-semibold text-slate-800 block mt-0.5">
                          {bk.seat_class || 'Economy'} ({bk.seat_preference} Preference)
                        </span>
                        <span className="text-emerald-600 font-mono text-[11px]">
                          Autonomous Re-routing Guaranteed
                        </span>
                      </div>
                    </div>

                    {/* Actions: Show QR, Print Ticket, Cancel */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {!isCancelled && (
                          <>
                            <button
                              onClick={() => setActiveQrModal(bk)}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5 text-slate-600" />
                              <span>Boarding QR</span>
                            </button>
                            <button
                              onClick={() => setActiveTicketModal(bk)}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-600" />
                              <span>View E-Ticket</span>
                            </button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!isCancelled && (
                          <button
                            onClick={() => handleCancelBooking(bk.booking_ref)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                          >
                            Cancel &amp; Claim Refund
                          </button>
                        )}
                        <button
                          onClick={() => onNavigate('/disruption')}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#072422] hover:bg-[#0c3a37] transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Test Disruption Engine</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ACTIVE ITINERARY TRAJECTORY (MUMBAI -> DELHI -> JAIPUR)            */}
      {/* ========================================================================= */}
      {tab === 'active' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#072422] to-[#0f3d3a] text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="text-[11px] text-white/60 font-mono tracking-widest uppercase block">
                PASSENGER MANIFEST &amp; RESILIENCE CONTRACT
              </span>
              <h3 className="font-volkhov font-bold text-2xl text-white mt-1">
                {itinerary?.traveler_name || user?.name || "Yash Sharma"}
              </h3>
              <p className="text-xs text-emerald-300 font-mono mt-0.5">
                Booking Ref: VY-8842-ALPINE • Tier: Plus Active
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveQrModal({
                  booking_ref: 'VY-8842-ALPINE',
                  passenger_name: 'Yash Sharma',
                  carrier: 'Air India',
                  service_number: 'AI 882',
                  origin: 'Mumbai (BOM)',
                  destination: 'Delhi (DEL)'
                })}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium font-poppins flex items-center gap-2 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Show Boarding QR</span>
              </button>
              <button
                onClick={() => setActiveTicketModal({
                  booking_ref: 'VY-8842-ALPINE',
                  passenger_name: 'Yash Sharma',
                  carrier: 'Air India + Vande Bharat',
                  service_number: 'AI 882 / #20978',
                  origin: 'Mumbai (BOM)',
                  destination: 'Jaipur (JAI)',
                  departure_time: '15:30 IST',
                  arrival_time: '23:15 IST',
                  duration: '7h 45m',
                  seat_class: 'Multi-Modal Plus',
                  total_fare_inr: 7979
                })}
                className="px-4 py-2 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white text-xs font-semibold font-poppins flex items-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>View Full E-Ticket</span>
              </button>
            </div>
          </div>

          {/* Segments Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-poppins font-bold text-sm uppercase text-[#181E4B] tracking-wider pb-3 border-b border-slate-100">
              Multi-Modal Travel Segments (Mumbai → Delhi → Jaipur)
            </h4>

            {/* Segment 1: Flight BOM -> DEL */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-poppins font-bold text-sm text-[#181E4B]">Air India AI 882 (BOM → DEL)</div>
                  <div className="text-xs text-[#5E6282]">Mumbai T2 → Delhi Airport T3 • Seat 12B (Economy)</div>
                  <div className="text-[11px] font-mono text-[#84829A] mt-0.5">Sched: 15:30 - 17:50 | Aircraft: A321neo</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  activeDisruption ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {activeDisruption ? `+45m DELAYED (ETA 18:35)` : 'ON SCHEDULE'}
                </span>
                <span className="text-[11px] text-[#5E6282] block mt-1">Terminal 2 Gate 44</span>
              </div>
            </div>

            {/* Segment 2: Delhi Metro Airport Express */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Train className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-poppins font-bold text-sm text-[#181E4B]">Delhi Metro Airport Express (DEL → NDLS)</div>
                  <div className="text-xs text-[#5E6282]">IGI Airport T3 → New Delhi Railway Station</div>
                  <div className="text-[11px] font-mono text-[#84829A] mt-0.5">Transfer Time: 55 min | Required Buffer: 45 min</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  activeDisruption ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {activeDisruption ? '10m BUFFER (AT RISK)' : 'BUFFER SECURED'}
                </span>
                <span className="text-[11px] text-[#5E6282] block mt-1">Express Line Track 1</span>
              </div>
            </div>

            {/* Segment 3: Rail NDLS -> Jaipur */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Train className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-poppins font-bold text-sm text-[#181E4B]">Vande Bharat Express #20978 (NDLS → JAI)</div>
                  <div className="text-xs text-[#5E6282]">New Delhi → Jaipur Junction • Chair Car C3, Seat 45</div>
                  <div className="text-[11px] font-mono text-[#84829A] mt-0.5">Sched: 19:20 - 23:15 | Indian Railways</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  activeDisruption ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {activeDisruption ? 'CONNECTION AT RISK' : 'CONFIRMED'}
                </span>
                <span className="text-[11px] text-[#5E6282] block mt-1">Platform 16</span>
              </div>
            </div>

            {/* Segment 4: Jaipur Hotel */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-poppins font-bold text-sm text-[#181E4B]">Heritage Boutique Hotel Jaipur</div>
                  <div className="text-xs text-[#5E6282]">Jaipur, Rajasthan • Deluxe Heritage Suite (2 Nights)</div>
                  <div className="text-[11px] font-mono text-[#84829A] mt-0.5">Check-in: 18:00 (Late arrival guaranteed until 23:59)</div>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                  HOTEL PROTECTED
                </span>
                <span className="text-[11px] text-[#5E6282] block mt-1">Late Check-in Confirmed</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHECKOUT MODAL: PASSENGER & PROTECTION CONFIRMATION                       */}
      {/* ========================================================================= */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-lg cursor-pointer"
            >
              &times;
            </button>

            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Voyage Autonomous Protection Guaranteed</span>
              </div>
              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-1">
                Confirm Protected Reservation
              </h3>
              <p className="text-xs text-[#5E6282] mt-0.5">
                {selectedItem.carrier} • {selectedItem.service_number} ({selectedItem.origin} ➔ {selectedItem.destination})
              </p>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 mt-5">
              
              {/* Trip Summary Chip */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{selectedItem.dep_time} - {selectedItem.arr_time}</span>
                  <span className="text-slate-500 block text-[11px]">{selectedItem.duration} • {travelDate}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-base text-[#181E4B]">₹{Number(selectedItem.fare_inr).toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400 block">Base fare</span>
                </div>
              </div>

              {/* Passenger Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Passenger Full Name</label>
                  <input
                    type="text"
                    required
                    value={checkoutPassenger.name}
                    onChange={(e) => setCheckoutPassenger(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-[#F1A501] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email for Boarding Pass</label>
                  <input
                    type="email"
                    required
                    value={checkoutPassenger.email}
                    onChange={(e) => setCheckoutPassenger(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-[#F1A501] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile (SMS / WhatsApp Updates)</label>
                  <input
                    type="tel"
                    required
                    value={checkoutPassenger.phone}
                    onChange={(e) => setCheckoutPassenger(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-[#F1A501] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Seat Preference</label>
                  <select
                    value={checkoutPassenger.seatPreference}
                    onChange={(e) => setCheckoutPassenger(p => ({ ...p, seatPreference: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-[#F1A501] focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Window">Window Seat</option>
                    <option value="Aisle">Aisle Seat</option>
                    <option value="Recliner">Recliner / Chair Car</option>
                  </select>
                </div>
              </div>

              {/* Protection Tier Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Voyage Autonomous Resilience Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { tier: 'Voyage Go', price: 199, label: 'Claims Only' },
                    { tier: 'Voyage Plus', price: 499, label: 'Ghost Holds (Recommended)' },
                    { tier: 'Voyage Pro', price: 899, label: 'Private Car Transfer' }
                  ].map(t => (
                    <button
                      key={t.tier}
                      type="button"
                      onClick={() => setSelectedTier(t.tier)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedTier === t.tier
                          ? 'border-[#F1A501] bg-amber-50/60 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-900 block">{t.tier}</span>
                      <span className="text-[10px] text-slate-500 block">{t.label}</span>
                      <span className="text-[11px] font-bold text-[#F1A501] mt-1 block">+₹{t.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5 font-poppins">
                <div className="flex justify-between text-slate-600">
                  <span>Base Transport Fare:</span>
                  <span>₹{Number(selectedItem.fare_inr).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Airport / Terminal Levies &amp; GST (10%):</span>
                  <span>₹{Math.round(selectedItem.fare_inr * 0.10).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{selectedTier} Autonomous Guarantee:</span>
                  <span>₹{selectedTier === 'Voyage Plus' ? 499 : (selectedTier === 'Voyage Pro' ? 899 : 199)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#181E4B] pt-2 border-t border-slate-100">
                  <span>Total Amount:</span>
                  <span>
                    ₹{(
                      Number(selectedItem.fare_inr) +
                      Math.round(selectedItem.fare_inr * 0.10) +
                      (selectedTier === 'Voyage Plus' ? 499 : (selectedTier === 'Voyage Pro' ? 899 : 199))
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Gateway Channel Selector */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Select Payment Processing Gateway:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('voyage')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                      paymentChannel === 'voyage'
                        ? 'border-[#F1A501] bg-amber-50/70 shadow-2xs font-bold text-[#181E4B]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#F1A501] shrink-0" />
                    <div>
                      <span className="block text-xs font-bold">Voyage 1-Click Pay</span>
                      <span className="block text-[10px] text-slate-400">UPI, Cards &amp; Immunity</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChannel('partner')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                      paymentChannel === 'partner'
                        ? 'border-blue-500 bg-blue-50/70 shadow-2xs font-bold text-blue-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="block text-xs font-bold">Partner Official Gateway</span>
                      <span className="block text-[10px] text-slate-400">redBus / IRCTC / Airline</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit or External Gateway Redirect Button */}
              {paymentChannel === 'partner' ? (
                <button
                  type="button"
                  onClick={() => {
                    const itemToRedirect = selectedItem;
                    setSelectedItem(null);
                    handleOpenPartnerGateway(itemToRedirect);
                  }}
                  className="w-full py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Proceed to Authenticated Partner Gateway (redBus / IRCTC / Airline) ↗</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isBookingSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {isBookingSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Payment &amp; Securing Seats...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Confirm &amp; Pay (Instant Immunity Guarantee)</span>
                    </>
                  )}
                </button>
              )}

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PARTNER PAYMENT GATEWAY SELECTION MODAL                                  */}
      {/* ========================================================================= */}
      {partnerGatewayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setPartnerGatewayModal(null)}
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
                Redirect to Authenticated Portal
              </h3>
              <p className="text-xs text-[#5E6282] mt-0.5">
                {partnerGatewayModal.carrier} • {partnerGatewayModal.service_number} ({partnerGatewayModal.origin || origin} ➔ {partnerGatewayModal.destination || destination})
              </p>
            </div>

            <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{partnerGatewayModal.dep_time} - {partnerGatewayModal.arr_time}</span>
                <span className="text-slate-500 text-[11px]">{partnerGatewayModal.duration} • {travelDate}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg text-[#181E4B]">₹{Number(partnerGatewayModal.fare_inr).toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-400 block">+10% taxes</span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Choose Official Payment Gateway to Open:
              </span>

              {/* 1. redBus */}
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
                      Intercity AC &amp; Sleeper buses. Instant UPI, NetBanking, and Card checkout.
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-red-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              {/* 2. IRCTC */}
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
                      Direct ticket reservation for Vande Bharat, Rajdhani, Superfast trains &amp; Tatkal.
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-blue-800 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              {/* 3. Airline Gateway */}
              <button
                type="button"
                onClick={() => handleRedirectToPartnerGateway('IndiGo / Air India Gateway', partnerGatewayModal.carrier?.toLowerCase().includes('indigo') ? 'https://www.goindigo.in' : (partnerGatewayModal.carrier?.toLowerCase().includes('air india') ? 'https://www.airindia.com' : 'https://www.makemytrip.com/flights/'))}
                className="w-full p-4 rounded-2xl border border-sky-200 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-400 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>Airline Official Portal (IndiGo / Air India / MMT)</span>
                      <span className="text-[10px] font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                        Direct Carrier
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Direct flight booking, seat selection, and authenticated payment gateway handoff.
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </button>

              {/* 4. Complete via Voyage with Resilient Protection */}
              <button
                type="button"
                onClick={() => {
                  const targetItem = partnerGatewayModal;
                  setPartnerGatewayModal(null);
                  handleOpenCheckout(targetItem);
                }}
                className="w-full p-4 rounded-2xl border-2 border-[#F1A501] bg-amber-50/60 hover:bg-amber-100/70 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#181E4B] text-amber-400 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#181E4B] flex items-center gap-1.5">
                      <span>Book on Voyage with Autonomous Resilience</span>
                      <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                        Ghost Holds
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Includes XGBoost delay prediction, ghost hold protection, and instant compensation.
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#181E4B] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">
                🔒 Protected by 256-bit SSL encryption &amp; certified merchant standards
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOOKING SUCCESS MODAL                                                     */}
      {/* ========================================================================= */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-widest block">
              BOOKING CONFIRMED &amp; SAVED
            </span>
            <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mt-1">
              Have a Resilient Journey!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your reservation has been recorded in the SQLite ledger with continuous autonomous delay monitoring.
            </p>

            <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Ref / PNR:</span>
                <span className="font-bold text-slate-900">{bookingSuccessModal.booking_ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Passenger:</span>
                <span className="font-bold text-slate-900">{bookingSuccessModal.passenger_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{bookingSuccessModal.carrier} {bookingSuccessModal.service_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Departure:</span>
                <span className="font-bold text-slate-900">{bookingSuccessModal.departure_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-emerald-700">₹{Number(bookingSuccessModal.total_fare_inr).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveQrModal(bookingSuccessModal);
                  setBookingSuccessModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-4 h-4" />
                <span>Show QR Pass</span>
              </button>
              <button
                onClick={() => {
                  setBookingSuccessModal(null);
                  setTab('my_bookings');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#181E4B] hover:bg-[#252c6b] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                View My Bookings
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QR BOARDING PASS MODAL                                                    */}
      {/* ========================================================================= */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center relative border border-slate-100 shadow-2xl">
            <button
              onClick={() => setActiveQrModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
            >
              &times;
            </button>
            
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
              DIGITAL BOARDING PASS &amp; RAIL TOKEN
            </span>
            <h4 className="font-poppins font-bold text-base text-[#181E4B]">
              {activeQrModal.carrier} • {activeQrModal.service_number}
            </h4>
            <p className="text-xs text-slate-500 font-mono">
              PNR: {activeQrModal.booking_ref}
            </p>

            <div className="w-52 h-52 mx-auto my-4 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 p-4">
              <QrCode className="w-44 h-44 text-[#072422]" />
            </div>

            <div className="text-xs text-slate-600 space-y-1 font-mono">
              <p>Passenger: <strong>{activeQrModal.passenger_name}</strong></p>
              <p>Valid at automated e-Gates &amp; TDR scanners</p>
            </div>

            <button
              onClick={() => {
                alert(`Encrypted boarding pass downloaded for ${activeQrModal.booking_ref}`);
                setActiveQrModal(null);
              }}
              className="w-full mt-4 py-2.5 rounded-xl bg-[#072422] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Save Pass to Wallet / Offline</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE E-TICKET VIEWER MODAL                                           */}
      {/* ========================================================================= */}
      {activeTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveTicketModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
            >
              &times;
            </button>

            {/* Printable Ticket Card */}
            <div className="p-6 rounded-2xl bg-white border-2 border-slate-800 text-slate-900 font-poppins space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <span className="font-volkhov font-bold text-xl tracking-wider">VOYAGE ELECTRONIC TICKET</span>
                </div>
                <span className="font-mono text-xs font-bold bg-slate-100 px-2.5 py-1 rounded border border-slate-300">
                  PNR: {activeTicketModal.booking_ref}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">PASSENGER</span>
                  <strong className="text-sm">{activeTicketModal.passenger_name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">OPERATOR</span>
                  <strong className="text-sm">{activeTicketModal.carrier}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">SERVICE NO.</span>
                  <strong className="text-sm">{activeTicketModal.service_number}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">CLASS</span>
                  <strong className="text-sm">{activeTicketModal.seat_class || 'Economy'}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">DEPARTURE</span>
                  <strong className="text-base">{activeTicketModal.origin}</strong>
                  <span className="text-slate-600 block">{activeTicketModal.departure_time}</span>
                </div>
                <div className="text-center font-mono text-[11px] text-slate-400">
                  <span>➔ {activeTicketModal.duration || 'Direct'} ➔</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">ARRIVAL</span>
                  <strong className="text-base">{activeTicketModal.destination}</strong>
                  <span className="text-slate-600 block">{activeTicketModal.arrival_time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-slate-500 font-mono">Status: <strong>CONFIRMED (PROTECTED BY VOYAGE ENGINE)</strong></span>
                <span className="font-bold text-sm">Fare Paid: ₹{Number(activeTicketModal.total_fare_inr || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setActiveTicketModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
