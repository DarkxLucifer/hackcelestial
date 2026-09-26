import React, { useState } from 'react';
import { 
  Plane, Train, Building2, AlertTriangle, CheckCircle2, 
  Clock, ArrowRight, ShieldCheck, MapPin, Eye, Compass, Zap
} from 'lucide-react';

export default function DemoJourneyMap({ 
  itinerary, 
  activeDisruption, 
  onSimulateAlpine, 
  onOpenSaga,
  t 
}) {
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'timeline'
  const [activePin, setActivePin] = useState('zurich');

  const pins = [
    {
      id: 'london',
      city: 'London Heathrow (LHR)',
      type: 'flight',
      country: 'United Kingdom',
      coords: { x: 18, y: 32 },
      status: 'Delayed (+65m)',
      statusColor: 'text-amber-500 bg-amber-50 border-amber-200',
      time: '14:00 → 17:50',
      slack: '+35m Buffer',
      detail: 'Flight BA 712 delayed by ATC Ground Delay Program at LHR.'
    },
    {
      id: 'zurich',
      city: 'Zurich Airport & HB (ZRH)',
      type: 'train',
      country: 'Switzerland',
      coords: { x: 62, y: 55 },
      status: activeDisruption ? 'Missed Connection (-80m)' : 'On Schedule',
      statusColor: activeDisruption ? 'text-red-500 bg-red-50 border-red-200' : 'text-emerald-500 bg-emerald-50 border-emerald-200',
      time: '18:02 → 20:02',
      slack: activeDisruption ? '-80m Breach' : '+45m OK',
      detail: 'Connection to SBB IC 8 train to Visp. YATAR holds backup seat on IC 834.'
    },
    {
      id: 'visp',
      city: 'Visp Alpine Interchange',
      type: 'train',
      country: 'Valais Alps',
      coords: { x: 57, y: 74 },
      status: activeDisruption ? 'Cascade Impacted' : 'On Schedule',
      statusColor: activeDisruption ? 'text-red-500 bg-red-50 border-red-200' : 'text-emerald-500 bg-emerald-50 border-emerald-200',
      time: '20:10 → 21:14',
      slack: activeDisruption ? '-89m Breach' : '+16m OK',
      detail: 'Transfer to Matterhorn Gotthard Bahn mountain regional railway.'
    },
    {
      id: 'zermatt',
      city: 'Zermatt Matterhorn Lodge',
      type: 'hotel',
      country: 'Swiss Alps',
      coords: { x: 60, y: 88 },
      status: activeDisruption ? 'Check-in Protected (Ghost Hold)' : 'Confirmed',
      statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      time: 'Late Check-in 22:30',
      slack: 'Zero Penalty',
      detail: 'Non-refundable alpine lodge. Front desk cutoff extended to midnight autonomously.'
    }
  ];

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-voyare-card p-6 sm:p-8 overflow-hidden">
      
      {/* Header bar with title, legend & view toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DF6951]" />
            <span className="text-xs font-bold font-poppins uppercase tracking-wider text-[#DF6951]">
              Live Multi-Modal Itinerary Radar
            </span>
          </div>
          <h2 className="font-volkhov font-bold text-2xl sm:text-3xl text-[#181E4B] mt-1">
            {t?.demoJourneyTitle || "The Alpine Expedition: London to Zermatt"}
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6282] font-poppins mt-0.5">
            {t?.demoJourneySubtitle || "Total Budget: €700 • Graph Entities: 5 Vertices, 4 Dependency Edges"}
          </p>
        </div>

        {/* View Switcher: Interactive Map vs Connection Flow */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-poppins transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-[#181E4B] shadow-sm'
                  : 'text-[#5E6282] hover:text-[#181E4B]'
              }`}
            >
              🗺️ {t?.viewMap || "Interactive Map"}
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-poppins transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-[#181E4B] shadow-sm'
                  : 'text-[#5E6282] hover:text-[#181E4B]'
              }`}
            >
              📊 {t?.viewTimeline || "Connection Graph"}
            </button>
          </div>

          <button
            onClick={onSimulateAlpine}
            className="px-4 py-2 rounded-xl bg-[#DF6951] hover:bg-[#c9533c] text-white text-xs font-semibold font-poppins shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{activeDisruption ? "Cascade Active" : "Simulate Cascade"}</span>
          </button>
        </div>
      </div>

      {/* Legend strip matching reference image media_1790415757393.png */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 text-xs text-[#5E6282] font-poppins">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Positive Slack (&gt; 0m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Negative Slack (Breached)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Zero-Slack Anchor (Hotel)</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-[#84829A]">
          Live Critical Path: LHR → ZRH → VISP → ZERMATT
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MAP VIEW: GEOGRAPHICAL INTERACTIVE FLIGHT & RAIL ROUTE MAP             */}
      {/* ========================================================================= */}
      {viewMode === 'map' && (
        <div className="relative w-full h-[420px] sm:h-[480px] rounded-2xl bg-gradient-to-br from-[#0c2331] via-[#102d3e] to-[#081822] overflow-hidden border border-slate-800 text-white mt-4 select-none">
          
          {/* Subtle Topographical Grid Background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}
          />

          {/* SVG Map Canvas with Flight Path Arc & Swiss Mountain Rail Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="railGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Flight Path (London LHR -> Zurich ZRH) */}
            <path
              d="M 18,32 Q 40,20 62,55"
              fill="none"
              stroke="url(#flightGradient)"
              strokeWidth="1.2"
              strokeDasharray="2,1.5"
              className="animate-pulse"
            />

            {/* Train Line (Zurich ZRH -> Visp) */}
            <path
              d="M 62,55 L 57,74"
              fill="none"
              stroke="url(#railGradient)"
              strokeWidth="1.5"
            />

            {/* Mountain Cogwheel Rail (Visp -> Zermatt) */}
            <path
              d="M 57,74 L 60,88"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="1,1"
            />

            {/* Simulated delay breach marker on flight segment */}
            {activeDisruption && (
              <circle cx="40" cy="27" r="1.5" fill="#ef4444" className="animate-ping" />
            )}
          </svg>

          {/* City Geographic Pins */}
          {pins.map((pin) => {
            const isSelected = activePin === pin.id;
            return (
              <div
                key={pin.id}
                onClick={() => setActivePin(pin.id)}
                style={{ left: `${pin.coords.x}%`, top: `${pin.coords.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              >
                {/* Ripple ring */}
                <div className={`absolute -inset-2 rounded-full opacity-40 transition-all ${
                  isSelected ? 'animate-ping bg-emerald-400' : 'group-hover:bg-white/30'
                }`} />

                {/* Pin Node */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform transform ${
                  isSelected 
                    ? 'scale-125 bg-emerald-500 text-white ring-4 ring-emerald-400/40' 
                    : 'bg-white/90 text-[#0c2331] group-hover:scale-110'
                }`}>
                  {pin.type === 'flight' ? <Plane className="w-4 h-4" /> : pin.type === 'train' ? <Train className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                </div>

                {/* City Label Badge */}
                <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 text-[10px] font-mono tracking-wide">
                  {pin.city.split(' ')[0]}
                </div>
              </div>
            );
          })}

          {/* Selected Pin HUD Inspector Card (Bottom-Left Overlay) */}
          {(() => {
            const current = pins.find(p => p.id === activePin) || pins[1];
            return (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-30 bg-[#081822]/90 backdrop-blur-xl border border-white/15 p-4 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{current.city}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${current.statusColor}`}>
                    {current.status}
                  </span>
                </div>
                <div className="mt-2 text-xs space-y-1">
                  <div className="flex justify-between text-white/70">
                    <span>Scheduled Window:</span>
                    <span className="font-mono text-white font-medium">{current.time}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Downstream CPM Slack:</span>
                    <span className="font-mono text-amber-400 font-bold">{current.slack}</span>
                  </div>
                  <p className="text-[11px] text-white/60 pt-1 leading-relaxed">
                    {current.detail}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Top-Right Flight Telemetry HUD Chip */}
          <div className="absolute top-4 right-4 z-30 hidden sm:flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="font-mono text-[11px]">
              <span className="text-white/60">Air-Rail Corridor: </span>
              <span className="text-white font-bold">1,048 km</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TIMELINE FLOW VIEW: MATCHING EXACT FIGMA IMAGE media_1790415757393.png  */}
      {/* ========================================================================= */}
      {viewMode === 'timeline' && (
        <div className="mt-6 overflow-x-auto pb-4">
          <div className="min-w-[820px] flex items-center gap-3">
            
            {/* Card 1: British Airways BA 712 */}
            <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                  <Plane className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 uppercase font-mono">
                  Delayed
                </span>
              </div>
              <h4 className="font-poppins font-bold text-sm text-[#181E4B]">British Airways BA 712</h4>
              <p className="text-xs text-[#5E6282]">British Airways • BA 712</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#84829A] block text-[10px]">START</span>
                  <span className="font-bold text-[#181E4B]">14:00</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <div>
                  <span className="text-[#84829A] block text-[10px]">END</span>
                  <span className="font-bold text-red-500">17:50</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] font-mono text-emerald-600 font-semibold">
                CPM Slack: +35m
              </div>
            </div>

            {/* Connecting Breach 1 */}
            <div className="shrink-0 flex flex-col items-center">
              <span className="px-2 py-0.5 rounded bg-red-500 text-white font-mono text-[10px] font-bold shadow-sm whitespace-nowrap">
                -80m BREACH
              </span>
              <div className="w-8 h-0.5 bg-red-400 mt-1" />
            </div>

            {/* Card 2: Zurich Airport Transit Ground Link */}
            <div className="flex-1 bg-white rounded-2xl p-5 border border-red-200 shadow-sm relative">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 uppercase font-mono">
                  Missed Connection
                </span>
              </div>
              <h4 className="font-poppins font-bold text-sm text-[#181E4B]">Zurich Transit...</h4>
              <p className="text-xs text-[#5E6282]">Zurich Ground • Air-Rail Link</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#84829A] block text-[10px]">START</span>
                  <span className="font-bold text-[#181E4B]">17:15</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <div>
                  <span className="text-[#84829A] block text-[10px]">END</span>
                  <span className="font-bold text-red-500">18:55</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] font-mono text-red-500 font-semibold">
                CPM Slack: -20m
              </div>
            </div>

            {/* Connecting Breach 2 */}
            <div className="shrink-0 flex flex-col items-center">
              <span className="px-2 py-0.5 rounded bg-red-500 text-white font-mono text-[10px] font-bold shadow-sm whitespace-nowrap">
                -83m BREACH
              </span>
              <div className="w-8 h-0.5 bg-red-400 mt-1" />
            </div>

            {/* Card 3: SBB InterCity IC 8 */}
            <div className="flex-1 bg-white rounded-2xl p-5 border border-red-200 shadow-sm relative">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Train className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 uppercase font-mono">
                  Missed Connection
                </span>
              </div>
              <h4 className="font-poppins font-bold text-sm text-[#181E4B]">SBB InterCity IC 8</h4>
              <p className="text-xs text-[#5E6282]">Swiss Federal Railways • IC 8 #830</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#84829A] block text-[10px]">START</span>
                  <span className="font-bold text-[#181E4B]">18:02</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <div>
                  <span className="text-[#84829A] block text-[10px]">END</span>
                  <span className="font-bold text-red-500">21:25</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] font-mono text-red-500 font-semibold">
                CPM Slack: -8m
              </div>
            </div>

            {/* Connecting Breach 3 */}
            <div className="shrink-0 flex flex-col items-center">
              <span className="px-2 py-0.5 rounded bg-red-500 text-white font-mono text-[10px] font-bold shadow-sm whitespace-nowrap">
                -89m BREACH
              </span>
              <div className="w-8 h-0.5 bg-red-400 mt-1" />
            </div>

            {/* Card 4: Matterhorn Gotthard Bahn */}
            <div className="flex-1 bg-white rounded-2xl p-5 border border-red-200 shadow-sm relative">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Train className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 uppercase font-mono">
                  Missed Connection
                </span>
              </div>
              <h4 className="font-poppins font-bold text-sm text-[#181E4B]">Matterhorn Gotthard...</h4>
              <p className="text-xs text-[#5E6282]">MGB • MGB Reg 138</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#84829A] block text-[10px]">START</span>
                  <span className="font-bold text-[#181E4B]">20:10</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <div>
                  <span className="text-[#84829A] block text-[10px]">END</span>
                  <span className="font-bold text-red-500">22:45</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] font-mono text-red-500 font-semibold">
                CPM Slack: 0m
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Action Footer: 1-Click Resolve with Autonomous Saga */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#181E4B] font-poppins">
              Autonomous Ghost Holds Active
            </div>
            <div className="text-[11px] text-[#5E6282]">
              SBB IC 834 backup seat + Matterhorn Lodge midnight check-in guaranteed
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSaga}
          className="px-6 py-2.5 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white font-medium text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Open Agentic Saga Resolver</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
