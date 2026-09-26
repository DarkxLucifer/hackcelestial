import React, { useState } from 'react';
import { 
  Activity, Shield, Filter, RefreshCw, Radio, CheckCircle, 
  AlertCircle, Zap, ShieldCheck, Clock, Terminal, ChevronRight
} from 'lucide-react';

export default function ResilienceLogs({ activeDisruption, itinerary, t }) {
  const [filter, setFilter] = useState('all');

  const logs = [
    {
      time: "14:00:12 UTC",
      category: "radar",
      tag: "ADS-B RADAR",
      level: "info",
      message: "Eurocontrol NMOC telemetry stream synchronized. Flight BA 712 transponder beacon locked (LHR → ZRH)."
    },
    {
      time: "14:01:45 UTC",
      category: "radar",
      tag: "WEATHER-METAR",
      level: "info",
      message: "Zurich Kloten (LSZH) Doppler radar scan: Wind 080/08kt, visibility >10km, alpine air corridor open."
    },
    {
      time: "14:02:00 UTC",
      category: "disruption",
      tag: "SCHEDULE-DELTA",
      level: activeDisruption ? "error" : "success",
      message: activeDisruption 
        ? `LHR Ground Delay Program active. British Airways BA 712 departure delayed by +${activeDisruption.delay_minutes || 65} minutes.`
        : "BA 712 on-time pushback approved. Current Zurich transit buffer: +45m nominal slack."
    },
    {
      time: "14:02:05 UTC",
      category: "disruption",
      tag: "CPM-CRITICAL-PATH",
      level: activeDisruption ? "error" : "success",
      message: activeDisruption
        ? "Topological dependency breach: Zurich Rail Transit margin collapses to -80m. SBB IC 8 connection severed."
        : "Topological dependency margin validated: SBB IC 8 connection secured (+27m buffer)."
    },
    {
      time: "14:02:12 UTC",
      category: "rail",
      tag: "GHOST-HOLD",
      level: "warning",
      message: "Autonomous Ghost-Hold protocol engaged: Instant zero-cost inventory lock on SBB IC 8 #834 (Dep 19:02)."
    },
    {
      time: "14:02:16 UTC",
      category: "hotel",
      tag: "LODGING-ANCHOR",
      level: "warning",
      message: "Matterhorn Lodge concierge API bridge updated: Late-arrival check-in window preserved until 23:59."
    },
    {
      time: "14:02:20 UTC",
      category: "claims",
      tag: "EU261 RIGHTS",
      level: "success",
      message: "Statutory passenger rights claim packet assembled: €250 statutory compensation claim staged."
    },
    {
      time: "14:02:25 UTC",
      category: "optimizer",
      tag: "PARETO-SOLVER",
      level: "success",
      message: "Multi-objective recovery Pareto front calculated: 3 resilient itinerary alternatives available for instant switch."
    }
  ];

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(l => l.category === filter);

  return (
    <section 
      id="logs" 
      className="w-full bg-white py-14 px-4 sm:px-8 lg:px-12 select-none border-b border-slate-100"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold font-mono tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                LIVE RESILIENCE TELEMETRY FEED
              </span>
            </div>
            <h2 className="font-volkhov font-bold text-2xl sm:text-3xl text-[#181E4B]">
              Autonomous Journey Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6282] mt-0.5">
              Continuous Critical Path (CPM) monitoring and zero-latency disruption mitigation events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-mono text-[#181E4B]">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-bold">Latency: 12ms</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-mono text-[#181E4B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A35645]" />
              <span className="font-bold">Saga Shield Active</span>
            </div>
          </div>
        </div>

        {/* Clean Light-Mode Container (Altered Modern Design with Pure White Background) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Top Control Bar with Filters */}
          <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono text-[11px] mr-1 font-semibold">FILTER BY:</span>
              {[
                { id: 'all', label: t?.logFilterAll || 'All Logs' },
                { id: 'radar', label: t?.logFilterRadar || 'Air Radar (ADS-B)' },
                { id: 'disruption', label: 'Disruptions (CPM)' },
                { id: 'rail', label: t?.logFilterRail || 'Rail Ghost-Holds' },
                { id: 'claims', label: t?.logFilterClaims || 'EU261 Claims' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1 rounded-lg font-googleSans text-xs font-medium transition-all cursor-pointer ${
                    filter === f.id
                      ? 'bg-[#181E4B] text-white shadow-xs font-semibold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Real-time Stream</span>
            </div>
          </div>

          {/* Log Items Feed */}
          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto bg-white">
            {filteredLogs.map((log, idx) => (
              <div 
                key={idx} 
                className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:bg-slate-50/70 transition-colors"
              >
                {/* Timestamp */}
                <div className="text-slate-400 text-[11px] shrink-0 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <span>{log.time}</span>
                </div>

                {/* Tag Badge */}
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-wide shrink-0 ${
                  log.level === 'error' 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                    : log.level === 'warning'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : log.tag.includes('RADAR')
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {log.tag}
                </span>

                {/* Message Text */}
                <span className={`flex-1 text-xs sm:text-[13px] font-mono leading-relaxed ${
                  log.level === 'error' 
                    ? 'text-rose-900 font-medium' 
                    : log.level === 'warning'
                    ? 'text-amber-900'
                    : 'text-[#181E4B]'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>

          {/* Clean Footer Bar with Metrics */}
          <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#181E4B]">Monitored Route:</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-bold">
                {itinerary ? itinerary.title : "London (LHR) → Zermatt"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Cascade Risk:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  activeDisruption 
                    ? "bg-rose-100 text-rose-700 border border-rose-200" 
                    : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                }`}>
                  {activeDisruption ? "78/100 (HIGH CASCADE RISK)" : "48/100 (NOMINAL BUFFER)"}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Zero Disruption Loss Guarantee</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
