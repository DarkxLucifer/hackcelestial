import React, { useState } from 'react';
import { 
  User, ShieldCheck, Mail, Phone, Award, CreditCard, 
  ArrowLeft, ArrowRight, Bell, Check, Zap, MapPin, Globe, Plane
} from 'lucide-react';

export default function ProfilePage({ user, onNavigate, onLogout, t }) {
  const [autoApproveCap, setAutoApproveCap] = useState(150);
  const [notificationSaved, setNotificationSaved] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#181E4B] font-poppins pt-28 pb-20 px-4 sm:px-8 max-w-5xl mx-auto">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-xs font-semibold text-[#5E6282] hover:text-[#181E4B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Voyage Home</span>
        </button>

        <button
          onClick={onLogout}
          className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          Log Out
        </button>
      </div>

      {/* Profile Header Banner */}
      <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#072422] to-[#12423e] text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#F1A501] to-[#DF6951] text-white flex items-center justify-center font-bold text-2xl ring-4 ring-white/30 shadow-lg shrink-0">
            {user ? user.name.charAt(0) : "E"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-volkhov font-bold text-2xl sm:text-3xl text-white">
                {user ? user.name : "Elena Vance"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-400 text-black uppercase">
                {user ? user.tier : "Plus"} Member
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200 font-poppins mt-0.5">
              {user ? user.email : "elena.vance@voyage.io"} • Global Executive Traveler
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/booking')}
            className="px-5 py-2.5 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <span>My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Resilience Metrics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#5E6282]">
            <span>Trips Protected</span>
            <Plane className="w-4 h-4 text-[#F1A501]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#181E4B] mt-2">14</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">100% on-time hotel arrival rate</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#5E6282]">
            <span>Ghost Holds Dispatched</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#181E4B] mt-2">6</div>
          <div className="text-[11px] text-[#5E6282] mt-1">2 currently held for Zermatt trip</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#5E6282]">
            <span>EU261 Claims Recovered</span>
            <Award className="w-4 h-4 text-[#DF6951]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#181E4B] mt-2">€1,450</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">+€250 pending for BA 712</div>
        </div>
      </div>

      {/* Two Column Layout: Connected Programs & Recovery Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left Column: Connected Travel Credentials */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-poppins font-bold text-base text-[#181E4B] pb-3 border-b border-slate-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#F1A501]" />
            <span>Connected Travel Memberships &amp; Passports</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-[#181E4B]">British Airways Executive Club</div>
                <div className="text-[11px] text-[#5E6282] font-mono">BA-99482189 • Silver (Oneworld Sapphire)</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                LINKED
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-[#181E4B]">Swiss Federal Railways (SBB SwissPass)</div>
                <div className="text-[11px] text-[#5E6282] font-mono">CH-883-9102-1 • 1st Class General Abonnement</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                LINKED
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-[#181E4B]">Biometric Passport (EU/UK Biometric)</div>
                <div className="text-[11px] text-[#5E6282] font-mono">GBR •••••••482 • Valid thru 2031</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Autonomous Recovery Preferences */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-poppins font-bold text-base text-[#181E4B] pb-3 border-b border-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#DF6951]" />
            <span>Autonomous Recovery Engine Controls</span>
          </h3>

          <div className="space-y-4 text-xs font-poppins">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-[#181E4B]">Auto-Approve Recovery Budget Cap</span>
                <span className="font-mono font-bold text-[#F1A501]">€{autoApproveCap}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="500" 
                step="25"
                value={autoApproveCap}
                onChange={(e) => setAutoApproveCap(Number(e.target.value))}
                className="w-full accent-[#F1A501] cursor-pointer"
              />
              <span className="text-[10px] text-[#84829A] block mt-0.5">
                Plans costing under €{autoApproveCap} are executed instantly without waking you up.
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="font-semibold text-[#181E4B] block">Notification Dispatch Channels</span>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-[#5E6282]">WhatsApp High-Priority Disruption Pings</span>
                <span className="text-emerald-600 font-bold font-mono">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-[#5E6282]">Automatic Hotel Front-Desk SMS Dispatch</span>
                <span className="text-emerald-600 font-bold font-mono">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
