import React, { useState } from 'react';
import { 
  Plane, Train, Building2, ShieldCheck, Download, 
  ArrowLeft, ArrowRight, Check, Calendar, MapPin, User, Clock, QrCode
} from 'lucide-react';

export default function BookingPage({ user, itinerary, activeDisruption, onNavigate, onSimulateAlpine, t }) {
  const [tab, setTab] = useState('active'); // 'active' | 'new'
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [qrModal, setQrModal] = useState(null);

  const handleNewBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setTab('active');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#181E4B] font-poppins pt-28 pb-20 px-4 sm:px-8 max-w-6xl mx-auto">
      
      {/* Top Breadcrumb & Back button */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-xs font-semibold text-[#5E6282] hover:text-[#181E4B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Voyage Home</span>
        </button>

        <div className="text-xs font-mono text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AUTONOMOUS IMMUNITY: ACTIVE</span>
        </div>
      </div>

      {/* Page Title */}
      <div className="mt-8 mb-6">
        <h1 className="font-volkhov font-bold text-3xl sm:text-4xl text-[#181E4B]">
          Protected Bookings &amp; Itineraries
        </h1>
        <p className="text-sm text-[#5E6282] mt-1">
          Direct management of guaranteed multi-modal flight, rail, and lodging reservations.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-slate-200/60 p-1 rounded-2xl max-w-md mb-8">
        <button
          onClick={() => setTab('active')}
          className={`flex-1 py-2.5 rounded-xl font-googleSans text-xs font-semibold transition-all cursor-pointer ${
            tab === 'active' ? 'bg-white text-[#181E4B] shadow-sm' : 'text-[#5E6282]'
          }`}
        >
          Active Itinerary (Mumbai → Delhi → Jaipur)
        </button>
        <button
          onClick={() => setTab('new')}
          className={`flex-1 py-2.5 rounded-xl font-googleSans text-xs font-semibold transition-all cursor-pointer ${
            tab === 'new' ? 'bg-white text-[#181E4B] shadow-sm' : 'text-[#5E6282]'
          }`}
        >
          Book New Journey
        </button>
      </div>

      {/* ACTIVE ITINERARY VIEW */}
      {tab === 'active' && (
        <div className="space-y-6">
          
          {/* Passenger & Ticket Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#072422] to-[#0f3d3a] text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="text-[11px] text-white/60 font-mono tracking-widest uppercase block">
                PASSENGER MANIFEST &amp; RESILIENCE CONTRACT
              </span>
              <h3 className="font-volkhov font-bold text-2xl text-white mt-1">
                {itinerary?.traveler_name || user?.name || "Traveler"}
              </h3>
              <p className="text-xs text-emerald-300 font-mono mt-0.5">
                {itinerary?.title ? `Itinerary: ${itinerary.title}` : `Ticket Ref: ${itinerary?.id || 'VY-RESILIENT'}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setQrModal('flight')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium font-poppins flex items-center gap-2 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Show Boarding QR</span>
              </button>
              <button
                onClick={() => alert("Downloading encrypted e-ticket PDF...")}
                className="px-4 py-2 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white text-xs font-semibold font-poppins flex items-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download E-Tickets</span>
              </button>
            </div>
          </div>

          {/* Confirmed Segments */}
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

      {/* BOOK NEW JOURNEY VIEW */}
      {tab === 'new' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl">
          <h3 className="font-volkhov font-bold text-2xl text-[#181E4B] mb-2">
            Book a New Autonomous Protected Trip
          </h3>
          <p className="text-xs sm:text-sm text-[#5E6282] mb-6">
            Every booking includes instant spatio-temporal failure prediction and autonomous multi-modal re-routing.
          </p>

          <form onSubmit={handleNewBooking} className="space-y-5">
            {bookingSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-poppins flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Trip confirmed! All connections protected by Voyage Resilience Engine.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#181E4B] mb-1">Origin City / Airport</label>
                <input 
                  type="text" 
                  defaultValue="Mumbai (BOM)" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F1A501]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#181E4B] mb-1">Destination City</label>
                <input 
                  type="text" 
                  defaultValue="Jaipur, Rajasthan" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F1A501]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#181E4B] mb-1">Departure Date</label>
                <input 
                  type="date" 
                  defaultValue="2026-10-15" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F1A501]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#181E4B] mb-1">Protection Tier</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F1A501]">
                  <option>Voyage Plus (Ghost Holds &amp; 1-Click Recovery)</option>
                  <option>Voyage Pro (Private Road Transfers)</option>
                  <option>Voyage Go (Standard Claims)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <span>Confirm Autonomous Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center relative border border-slate-100 shadow-2xl">
            <button
              onClick={() => setQrModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
            >
              &times;
            </button>
            <div className="w-48 h-48 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 p-4">
              <QrCode className="w-40 h-40 text-[#072422]" />
            </div>
            <h4 className="font-poppins font-bold text-base text-[#181E4B] mt-4">
              AI 882 Boarding Pass
            </h4>
            <p className="text-xs text-[#5E6282] mt-1 font-mono">
              Scan at Mumbai T2 Automated e-Gates
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
