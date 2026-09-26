import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldCheck, Zap, ArrowLeft, ArrowRight, 
  RotateCcw, CheckCircle2, Clock, Train, Plane, Building2, 
  FileText, Shield, Sparkles, AlertCircle, Compass, HelpCircle
} from 'lucide-react';
import DemoJourneyGraph from '../components/DemoJourneyGraph';

export default function DisruptionPage({
  user,
  itinerary,
  activeDisruption,
  onNavigate,
  onSimulateAlpine,
  onResetDisruption,
  onOpenSaga,
  t
}) {
  const [selectedPlanId, setSelectedPlanId] = useState('plan_b');

  const plans = [
    {
      id: "plan_a",
      title: "PLAN A: MINIMUM COST",
      badge: "₹0 EXTRA",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      costDelta: "₹0 out-of-pocket",
      timeDelta: "Tomorrow 08:40",
      riskScore: "2 bookings affected",
      description: "Airline rebooking on next available flight (Mumbai → Delhi) with hotel retention and rescheduled transfer. Trade-off: Arrives next morning and misses tonight's check-in window.",
      steps: [
        "Airline rebooking on next available flight",
        "Jaipur hotel reservation retained & late arrival notified",
        "Existing Jaipur transfer rescheduled (₹0 additional travel payment)"
      ]
    },
    {
      id: "plan_b",
      title: "PLAN B: FASTEST RECOVERY",
      badge: "RECOMMENDED RECOVERY (₹2,850 EXTRA)",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      costDelta: "₹2,850 additional cost",
      timeDelta: "Tonight 23:15 (~9h 25m saved)",
      riskScore: "Protected Check-in",
      description: "Flight + Rail Recovery: Earlier alternative flight secured + Delhi → Jaipur train connection found. Hotel check-in extended to 23:59.",
      steps: [
        "Earlier alternative flight secured (Mumbai → Delhi)",
        "Delhi → Jaipur train connection found & booked",
        "Hotel check-in extended to 23:59; Airport transfer adjusted"
      ]
    },
    {
      id: "plan_c",
      title: "PLAN C: COMFORT RECOVERY",
      badge: "MAXIMUM CONVENIENCE (₹6,900 EXTRA)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      costDelta: "₹6,900 additional cost",
      timeDelta: "Tonight 22:10 (~10h 30m saved)",
      riskScore: "Zero Train Transfer",
      description: "Private Road Recovery: Alternative flight + Private direct Delhi → Jaipur executive transfer with door-to-door luggage handling.",
      steps: [
        "Alternative Mumbai → Delhi flight secured",
        "Private Delhi → Jaipur transfer (door-to-door)",
        "Luggage handled throughout transfer; Hotel notified"
      ]
    }
  ];

  const handleExecuteSelectedPlan = () => {
    const chosen = plans.find(p => p.id === selectedPlanId);
    if (onOpenSaga) {
      onOpenSaga({
        title: chosen.title,
        cost: chosen.costDelta,
        description: chosen.description
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#181E4B] font-poppins pt-28 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#5E6282] hover:text-[#181E4B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voyage Home</span>
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => onNavigate('/booking')}
            className="text-xs font-semibold text-[#5E6282] hover:text-[#181E4B] transition-colors cursor-pointer"
          >
            My Bookings
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-bold text-[#A35645]">Disruption Resolver</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-[#A35645] bg-[#A35645]/10 px-3 py-1 rounded-full border border-[#A35645]/20 flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A35645]" />
            <span>DISRUPTION CASCADE SOLVER :: 100% IMMUNITY</span>
          </div>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="mt-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F1A501]" />
            <span>Pareto-Optimal Multi-Modal Recovery Engine</span>
          </div>
          <h1 className="font-volkhov font-bold text-3xl sm:text-4xl text-[#181E4B]">
            Autonomous Disruption Resolver
          </h1>
          <p className="text-sm text-[#5E6282] mt-1 max-w-2xl">
            When unexpected flight delays, missed rail transfers, or cancellations hit your travel chain,
            Voyage's topological solver re-routes your entire trip in milliseconds without abandonment.
          </p>
        </div>

        {/* Quick Simulator Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onSimulateAlpine({
              node_id: "node_flight_1",
              delay_minutes: 45,
              is_cancellation: false,
              reason: "Air Traffic Control Ground Delay Program at BOM (+45m)"
            })}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#A35645] hover:bg-[#b8614e] transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Simulate Disruption (+45m)</span>
          </button>

          {activeDisruption && (
            <button
              onClick={onResetDisruption}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Nominal Schedule</span>
            </button>
          )}
        </div>
      </div>

      {/* Disruption Status Alert Banner */}
      {activeDisruption ? (
        <div className="mb-8 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-rose-900">
                  Critical Disruption Detected on Leg 1
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-200 text-rose-800">
                  SEVERITY: CASCADE BREACH
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                Flight delayed by <span className="font-bold">+45 minutes</span>.
                Downstream connection margin at Delhi Airport to New Delhi Railway station is reduced to <span className="font-bold">10 minutes</span>, causing a missed connection on Vande Bharat Express to Jaipur.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={handleExecuteSelectedPlan}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Execute 1-Click Recovery Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-sm">Nominal Schedule Active</span>
              <p className="text-xs text-emerald-700">All connections along Mumbai → Delhi → Jaipur have positive slack margins.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full shrink-0">
            SLACK: BUFFER SECURED
          </span>
        </div>
      )}

      {/* Grid: Graph / Carto Map Visualization (Left) + Recovery Plans (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Carto Basemap / Topological Graph */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-volkhov font-bold text-xl text-[#181E4B]">
                Interactive Journey Visualizer
              </h3>
              <p className="text-xs text-[#5E6282]">
                Live Carto Basemap and Mathematical Topological Graph (TDAG) showing slack buffers and critical paths.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
              TDAG / CARTO v2.5
            </span>
          </div>

          <DemoJourneyGraph
            itinerary={itinerary}
            activeDisruption={activeDisruption}
            onSimulateAlpine={onSimulateAlpine}
            onOpenSaga={onOpenSaga}
            t={t}
          />
        </div>

        {/* Right: Recovery Plans */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-volkhov font-bold text-lg text-[#181E4B]">
                Pareto Recovery Alternatives
              </h3>
              <span className="text-xs font-bold text-[#A35645]">
                {plans.length} Validated Plans
              </span>
            </div>

            <div className="space-y-3.5">
              {plans.map((p) => {
                const isSelected = selectedPlanId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#181E4B] bg-slate-50/90 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-[#181E4B]">
                        {p.title}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>

                    <p className="text-xs text-[#5E6282] leading-relaxed mb-3">
                      {p.description}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/70 font-mono">
                      <div>
                        <span className="text-slate-400">Cost: </span>
                        <span className="font-bold text-[#181E4B]">{p.costDelta}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Time: </span>
                        <span className="font-bold text-[#181E4B]">{p.timeDelta}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Impact: </span>
                        <span className="font-bold text-emerald-600">{p.riskScore}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Execute Plan Button */}
            <button
              onClick={handleExecuteSelectedPlan}
              className="mt-5 w-full py-3 rounded-2xl font-googleSans font-bold text-sm text-white bg-[#181E4B] hover:bg-[#232a68] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Execute Selected Recovery with Agentic Saga</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
