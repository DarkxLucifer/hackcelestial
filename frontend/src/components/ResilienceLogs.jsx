import React, { useState } from 'react';
import { Terminal, Shield, Filter, RefreshCw, Radio, CheckCircle, AlertCircle, Zap } from 'lucide-react';

export default function ResilienceLogs({ activeDisruption, itinerary, t }) {
  const [filter, setFilter] = useState('all');

  const logs = [
    {
      time: "14:00:12 UTC",
      category: "radar",
      tag: "ADS-B",
      level: "info",
      message: "Radar connected to Eurocontrol NMOC. Flight BA 712 telemetry stream active (LHR → ZRH)."
    },
    {
      time: "14:01:45 UTC",
      category: "radar",
      tag: "WEATHER",
      level: "info",
      message: "Doppler radar at Zurich (ZRH): Clear, wind 8kts, alpine corridor open."
    },
    {
      time: "14:02:00 UTC",
      category: "disruption",
      tag: "DELAY",
      level: activeDisruption ? "error" : "success",
      message: activeDisruption 
        ? `Heathrow Ground Delay Program active. BA 712 estimated departure pushback +${activeDisruption.delay_minutes}m.`
        : "Flight BA 712 on-time dispatch confirmed. Buffer at Zurich: +45m."
    },
    {
      time: "14:02:05 UTC",
      category: "disruption",
      tag: "CPM-SLACK",
      level: activeDisruption ? "error" : "success",
      message: activeDisruption
        ? "Cascading breach: ZRH rail transit connection slack drops to -80m (SBB IC 8 connection missed)."
        : "Downstream CPM slack nominal: SBB IC 8 connection secured (+27m margin)."
    },
    {
      time: "14:02:12 UTC",
      category: "rail",
      tag: "GHOST-HOLD",
      level: "warning",
      message: "Just-In-Time Ghost Hold dispatched via SBB NDC: Reserved seat on SBB IC 8 #834 (Dep 19:02)."
    },
    {
      time: "14:02:16 UTC",
      category: "hotel",
      tag: "ANCHOR",
      level: "warning",
      message: "Boutique Hotel Matterhorn Lodge API notified: Late arrival anchor protected until 23:59."
    },
    {
      time: "14:02:20 UTC",
      category: "claims",
      tag: "EU261",
      level: "success",
      message: "Statutory rights bridge: EU261 disruption claim packet generated (€250 passenger refund)."
    },
    {
      time: "14:02:25 UTC",
      category: "optimizer",
      tag: "SAGA-AI",
      level: "success",
      message: "Multi-objective recovery Pareto solver complete: 3 validated plans ready for 1-click execution."
    }
  ];

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(l => l.category === filter);

  return (
    <section id="logs" className="w-full bg-[#FAF9F6] py-16 px-6 sm:px-10 lg:px-12 select-none">
      <div className="max-w-6xl mx-auto">
        
        {/* Minimal Log Terminal Card */}
        <div className="bg-[#10141d] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-300">
          
          {/* Terminal Window Header */}
          <div className="px-6 py-4 bg-[#0a0d14] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs font-semibold text-white/90 ml-2">
                voyage-telemetry-daemon :: live-stream
              </span>
            </div>

            {/* Live blinking pulse */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
                LIVE LOG FEED
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-6 py-3 bg-[#0d1018] border-b border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-mono text-[11px] mr-2">Filter:</span>
            {[
              { id: 'all', label: t?.logFilterAll || 'All Logs' },
              { id: 'radar', label: t?.logFilterRadar || 'Air Radar' },
              { id: 'disruption', label: 'Disruptions' },
              { id: 'rail', label: t?.logFilterRail || 'Rail Holds' },
              { id: 'claims', label: t?.logFilterClaims || 'EU261 Claims' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                  filter === f.id
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Log Stream Body */}
          <div className="p-6 font-mono text-xs space-y-2.5 max-h-[360px] overflow-y-auto">
            {filteredLogs.map((log, idx) => (
              <div 
                key={idx} 
                className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 hover:bg-slate-800/40 p-1.5 rounded transition-colors"
              >
                <span className="text-slate-500 text-[11px] shrink-0 font-mono">
                  [{log.time}]
                </span>

                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 text-center ${
                  log.level === 'error' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : log.level === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {log.tag}
                </span>

                <span className={`flex-1 text-[12px] leading-relaxed ${
                  log.level === 'error' 
                    ? 'text-red-200' 
                    : log.level === 'warning'
                    ? 'text-amber-100'
                    : 'text-slate-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Stats Summary */}
          <div className="px-6 py-3 bg-[#0a0d14] border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
            <div>
              Active Itinerary: <span className="text-white font-semibold">{itinerary ? itinerary.title : "Alpine Expedition"}</span>
            </div>
            <div>
              Domino Risk: <span className={activeDisruption ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                {activeDisruption ? "78/100 (HIGH CASCADE)" : "48/100 (NOMINAL)"}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
