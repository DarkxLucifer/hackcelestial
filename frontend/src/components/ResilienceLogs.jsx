import React, { useState } from 'react';
import { 
  Activity, Shield, Filter, RefreshCw, Radio, CheckCircle, 
  AlertCircle, Zap, ShieldCheck, Clock, Plane, Train, Building2,
  AlertTriangle, ArrowRight, Check
} from 'lucide-react';

export default function ResilienceLogs({ activeDisruption, itinerary, t }) {
  const [filter, setFilter] = useState('all');

  const events = [
    {
      id: 1,
      time: "14:00:12 IST",
      type: "FLIGHT STATUS",
      category: "flight",
      route: "Mumbai → Delhi",
      description: "Flight departure confirmed. Estimated arrival 18:35.",
      meta: "Source: Airline",
      status: "confirmed",
      statusLabel: "CONFIRMED"
    },
    {
      id: 2,
      time: "14:01:04 IST",
      type: "DELAY DETECTED",
      category: "disruption",
      route: "Mumbai → Delhi",
      description: "Estimated arrival changed from 17:50 → 18:35. 45-minute delay detected.",
      meta: "Impact: Connection buffer reduced",
      status: "delay",
      statusLabel: "45m DELAY"
    },
    {
      id: 3,
      time: "14:01:08 IST",
      type: "CONNECTION CHECK",
      category: "disruption",
      route: "Delhi Airport → New Delhi Railway Station",
      description: "Current transfer time: 55 min • Required transfer time: 45 min • 10 min buffer remaining",
      meta: "Buffer remaining: 10 min",
      status: "risk",
      statusLabel: "AT RISK"
    },
    {
      id: 4,
      time: "14:01:14 IST",
      type: "RAIL CONNECTION",
      category: "rail",
      route: "New Delhi → Jaipur",
      description: "Scheduled departure: 19:20 • Current estimated arrival at station: 19:10",
      meta: "Margin: -10 min breach predicted",
      status: "risk",
      statusLabel: "CONNECTION AT RISK"
    },
    {
      id: 5,
      time: "14:01:21 IST",
      type: "HOTEL CHECK-IN",
      category: "hotel",
      route: "Jaipur Hotel",
      description: "Original check-in: 18:00 • Expected arrival: 22:15. Late arrival notification prepared.",
      meta: "Concierge bridge notified",
      status: "protected",
      statusLabel: "PROTECTED"
    },
    {
      id: 6,
      time: "14:01:29 IST",
      type: "RECOVERY SEARCH",
      category: "disruption",
      route: "Mumbai → Delhi → Jaipur",
      description: "Searching available alternatives for the affected journey. 12 alternatives checked (Flights • Trains • Transfers • Hotel policies).",
      meta: "Multi-objective solver running",
      status: "searching",
      statusLabel: "12 CHECKED"
    },
    {
      id: 7,
      time: "14:01:37 IST",
      type: "RECOVERY FOUND",
      category: "disruption",
      route: "Mumbai → Delhi → Jaipur",
      description: "3 feasible recovery plans found (₹0 · ₹2,850 · ₹6,900). Ranked using Cost · Arrival Time · Connections · Itinerary Impact.",
      meta: "Pareto-optimal set generated",
      status: "success",
      statusLabel: "3 PLANS"
    },
    {
      id: 8,
      time: "14:01:44 IST",
      type: "TRAVELER ALERT",
      category: "disruption",
      route: "Delhi → Jaipur",
      description: "Your Delhi → Jaipur connection is at risk due to the flight delay. Recommended action: Review recovery options.",
      meta: "Action required",
      status: "alert",
      statusLabel: "ACTION REQUIRED",
      action: true
    }
  ];

  const filteredEvents = filter === 'all' 
    ? events 
    : filter === 'flight' 
    ? events.filter(e => e.category === 'flight')
    : filter === 'rail'
    ? events.filter(e => e.category === 'rail')
    : filter === 'hotel'
    ? events.filter(e => e.category === 'hotel')
    : events.filter(e => e.category === 'disruption');

  const scrollToPlans = () => {
    const el = document.getElementById('dispute-plans');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="logs" 
      className="w-full bg-white py-14 px-4 sm:px-8 lg:px-12 border-b border-slate-100"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-volkhov font-bold text-2xl sm:text-3xl text-[#181E4B]">
              Autonomous Journey Monitoring
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6282] mt-1">
              Voyage is continuously checking your itinerary for delays, missed connections and downstream booking risks.
            </p>
          </div>

          {/* Top badges matching specifications */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Monitoring Live badge */}
            <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Monitoring Live</span>
            </div>

            {/* Itinerary Protected badge */}
            <div className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 flex items-center gap-1.5 text-xs font-semibold text-blue-800">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              <span>Itinerary Protected</span>
            </div>
          </div>
        </div>

        {/* Clean Light-Mode Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Top Control Bar with Filters */}
          <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono text-[11px] mr-1 font-semibold uppercase tracking-wider">
                FILTER BY:
              </span>
              {[
                { id: 'all', label: 'All Events' },
                { id: 'flight', label: 'Flight' },
                { id: 'rail', label: 'Rail' },
                { id: 'hotel', label: 'Hotel' },
                { id: 'disruption', label: 'Disruption' }
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
              <span>Updated just now</span>
            </div>
          </div>

          {/* Realistic Event Feed */}
          <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto bg-white">
            {filteredEvents.map((evt) => (
              <div 
                key={evt.id} 
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-4 hover:bg-slate-50/70 transition-colors"
              >
                {/* Timestamp */}
                <div className="text-slate-400 text-[11px] shrink-0 font-mono pt-0.5 whitespace-nowrap">
                  {evt.time}
                </div>

                {/* Badge Tag */}
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-wide shrink-0 ${
                  evt.status === 'delay'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : evt.status === 'risk' || evt.status === 'alert'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : evt.status === 'protected' || evt.status === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {evt.type}
                </span>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-xs text-[#181E4B]">
                      {evt.route}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      • {evt.meta}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-poppins">
                    {evt.description}
                  </p>
                </div>

                {/* Action button if present */}
                {evt.action && (
                  <button
                    onClick={scrollToPlans}
                    className="self-start sm:self-center shrink-0 px-3 py-1.5 rounded-lg bg-[#181E4B] text-white hover:bg-[#232a68] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>View Recovery Plans</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
