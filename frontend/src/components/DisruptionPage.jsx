import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldCheck, Zap, ArrowLeft, ArrowRight, 
  RotateCcw, CheckCircle2, Clock, Train, Plane, Building2, 
  FileText, Shield, Sparkles, AlertCircle, Compass, HelpCircle
} from 'lucide-react';
import DemoJourneyGraph from './DemoJourneyGraph';

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
  const [selectedPlanId, setSelectedPlanId] = useState('plan_ghost_hold');
  const [claimGenerated, setClaimGenerated] = useState(false);

  const plans = [
    {
      id: "plan_ghost_hold",
      title: "Plan A: SBB Autonomous Ghost-Hold",
      badge: "RECOMMENDED (OPTIMAL)",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      costDelta: "€0.00",
      timeDelta: "+55m arrival",
      riskScore: "12/100 (Safe)",
      description: "Utilizes pre-reserved Just-in-Time inventory on SBB IC 8 #834 (Dep 19:02) from Zurich HB with auto-held late check-in at Matterhorn Lodge.",
      steps: [
        "Hold confirmed on SBB IC 8 #834 (Seat 42A, 19:02)",
        "Matterhorn Lodge arrival window extended to 23:59",
        "Zero cancellation penalties or extra re-booking fees"
      ]
    },
    {
      id: "plan_express_shuttle",
      title: "Plan B: Alpine Express Sprinter",
      badge: "FASTEST RECOVERY",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      costDelta: "+€45.00",
      timeDelta: "+15m arrival",
      riskScore: "8/100 (Ultra-Safe)",
      description: "Direct private executive sprinter van dispatched from ZRH terminal to Visp station, bypassing the missed rail connection entirely.",
      steps: [
        "Driver assigned at Zurich Airport Terminal 1 curbside",
        "Direct alpine highway transit avoiding rail schedule",
        "Arrives Zermatt in time for standard 21:00 check-in"
      ]
    },
    {
      id: "plan_overnight_compensation",
      title: "Plan C: Zurich Overnight + EU261 Credit",
      badge: "MAXIMUM COMFORT & PAYOUT",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      costDelta: "-€250.00 (Net Gain)",
      timeDelta: "Next Morning 08:30",
      riskScore: "0/100 (Zero Risk)",
      description: "Complimentary luxury stay at Radisson Blu Zurich Airport with automatic €250 EU261 passenger claim payout + panoramic Glacier Express train next morning.",
      steps: [
        "Free 5-star airport hotel voucher & dining voucher issued",
        "Instant €250 statutory EU261 wire transfer queued",
        "First-class morning connection via Glacier Express"
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
              delay_minutes: 65,
              is_cancellation: false,
              reason: "Air Traffic Control Ground Delay Program at LHR (+65m)"
            })}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#A35645] hover:bg-[#b8614e] transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Simulate LHR Delay (+65m)</span>
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
                British Airways BA 712 delayed by <span className="font-bold">+65 minutes</span> due to Heathrow ATC flow management.
                Downstream connection margin at Zurich Airport Rail transit is breached by <span className="font-bold">-80 minutes</span>, causing a missed connection on SBB InterCity IC 8.
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
              <p className="text-xs text-emerald-700">All 5 segments (Flight, Zurich Transfer, SBB Train, MGB Regional, Matterhorn Lodge) have positive slack margins.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full shrink-0">
            SLACK: +45m BUFFER
          </span>
        </div>
      )}

      {/* Grid: Graph Visualization (Left) + Recovery Plans (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Real Topological Directed Acyclic Graph */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-volkhov font-bold text-xl text-[#181E4B]">
                Topological Dependency Graph
              </h3>
              <p className="text-xs text-[#5E6282]">
                Mathematical Directed Acyclic Graph (TDAG) showing slack buffers and critical domino paths.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
              TDAG v2.4
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

        {/* Right: Recovery Plans & Passenger Rights */}
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
                        <span className="text-slate-400">Risk: </span>
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

          {/* EU261 & Passenger Rights Protection Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <Shield className="w-5 h-5 text-indigo-600" />
              <h4 className="font-volkhov font-bold text-base text-[#181E4B]">
                Statutory Compensation Rights
              </h4>
            </div>

            <p className="text-xs text-[#5E6282] leading-relaxed">
              Under EC Regulation 261/2004 and the Swiss Federal Office of Transport (FOT), delay pushbacks exceeding 3 hours entitle you to cash indemnity.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
              <span>Eligible Claim:</span>
              <span className="text-emerald-600 font-bold text-sm">€250.00 / Passenger</span>
            </div>

            <button
              onClick={() => setClaimGenerated(true)}
              disabled={claimGenerated}
              className={`mt-4 w-full py-2.5 rounded-xl font-googleSans font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                claimGenerated
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{claimGenerated ? "Claim Dossier Staged & Filed" : "Pre-fill EU261 Claim Dossier"}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
