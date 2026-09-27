import React, { useState } from 'react';
import { 
  X, Plane, Train, Building2, ShieldCheck, Download, 
  Calendar, MapPin, User, Check, ArrowRight, Zap 
} from 'lucide-react';

export default function BookingModal({ isOpen, onClose, user, itinerary, activeDisruption, t }) {
  const [tab, setTab] = useState('active'); // 'active' | 'new'
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNewBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setTab('active');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
        >
          &times;
        </button>

        {/* Header */}
        <div className="pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t?.protectionActive || "Autonomous Protection Active"}</span>
          </div>
          <h2 className="font-volkhov font-bold text-2xl sm:text-3xl text-[#181E4B] mt-1">
            {t?.bookingModalTitle || "Voyage Itinerary & Bookings Dashboard"}
          </h2>
          <p className="font-poppins text-xs sm:text-sm text-[#5E6282] mt-0.5">
            {t?.bookingModalSubtitle || "Real-time management for protected trips and autonomous re-routing."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl my-6">
          <button
            onClick={() => setTab('active')}
            className={`flex-1 py-2 rounded-lg font-googleSans text-xs font-semibold transition-all cursor-pointer ${
              tab === 'active' ? 'bg-white text-[#181E4B] shadow-sm' : 'text-[#5E6282]'
            }`}
          >
            {t?.activeBookingTab || "Active Itinerary"}
          </button>
          <button
            onClick={() => setTab('new')}
            className={`flex-1 py-2 rounded-lg font-googleSans text-xs font-semibold transition-all cursor-pointer ${
              tab === 'new' ? 'bg-white text-[#181E4B] shadow-sm' : 'text-[#5E6282]'
            }`}
          >
            {t?.newBookingTab || "Book New Journey"}
          </button>
        </div>

        {/* Active Itinerary View */}
        {tab === 'active' && (
          <div className="space-y-4">
            
            {/* Passenger & Ticket Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0b272c] to-[#143d46] text-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-white/60 font-mono tracking-widest uppercase block">
                  PASSENGER RECORD
                </span>
                <h4 className="font-poppins font-bold text-base text-white">
                  {user?.name || "Traveler"}
                </h4>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">
                  Booking Ref: VY-8842-ALPINE • Tier: Plus
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Downloading digital boarding passes & SBB rail QR...")}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium font-poppins flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t?.downloadTicket || "Download E-Ticket"}</span>
                </button>
              </div>
            </div>

            {/* Segments List */}
            <div className="space-y-3 pt-2">
              <h5 className="font-poppins font-bold text-xs uppercase text-[#5E6282] tracking-wider">
                Confirmed Segments
              </h5>

              {/* Segment 1: Flight BA 712 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-poppins font-bold text-xs text-[#181E4B]">British Airways BA 712</div>
                    <div className="text-[11px] text-[#5E6282]">London (LHR) → Zurich (ZRH) • Seat 14A</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeDisruption ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {activeDisruption ? `+${activeDisruption.delay_minutes}m DELAY` : 'ON TIME'}
                </span>
              </div>

              {/* Segment 2: Train SBB IC 8 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-poppins font-bold text-xs text-[#181E4B]">SBB InterCity IC 8 #830</div>
                    <div className="text-[11px] text-[#5E6282]">Zurich HB → Visp • Coach 4, Seat 22</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  GHOST HOLD READY
                </span>
              </div>

              {/* Segment 3: Hotel Matterhorn */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-poppins font-bold text-xs text-[#181E4B]">Boutique Hotel Matterhorn Lodge</div>
                    <div className="text-[11px] text-[#5E6282]">Zermatt, Switzerland • Deluxe Alpine Suite</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  CHECK-IN SECURED
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Book New Journey View */}
        {tab === 'new' && (
          <form onSubmit={handleNewBooking} className="space-y-4">
            {bookingSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Trip booked with instant 1-Click Autonomous Resilience Guarantee!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#181E4B] mb-1 font-poppins">Departure City</label>
                <input 
                  type="text" 
                  defaultValue="London (LHR)" 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-poppins focus:outline-none focus:border-[#F1A501]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#181E4B] mb-1 font-poppins">Destination</label>
                <input 
                  type="text" 
                  defaultValue="Zermatt, Switzerland" 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-poppins focus:outline-none focus:border-[#F1A501]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#181E4B] mb-1 font-poppins">Travel Date</label>
                <input 
                  type="date" 
                  defaultValue="2026-10-15" 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-poppins focus:outline-none focus:border-[#F1A501]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#181E4B] mb-1 font-poppins">Protection Level</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-poppins focus:outline-none focus:border-[#F1A501]">
                  <option>Plus (1-Click Auto Recovery &amp; Ghost Holds)</option>
                  <option>Pro (VIP Private Alpine Transfers)</option>
                  <option>Go (Standard Delay Alerts)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white font-googleSans font-semibold text-sm transition-all shadow-md mt-4 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Confirm Protected Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
