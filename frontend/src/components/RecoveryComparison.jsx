import React, { useState } from 'react';
import { Sparkles, Zap, Shield, Moon, Clock, DollarSign, ArrowRight, Check, CheckCircle2, GitCommit, GitBranch, AlertCircle } from 'lucide-react';

export default function RecoveryComparison({ recoveryPlans, onSelectPlan, activeDisruption }) {
  const [selectedPlanId, setSelectedPlanId] = useState(recoveryPlans?.[0]?.id || "plan_balanced");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "git-diff"

  if (!recoveryPlans || recoveryPlans.length === 0) return null;

  const getArchetypeIcon = (archetype) => {
    if (archetype.includes("Sprint")) return <Zap className="w-5 h-5 text-amber-500" />;
    if (archetype.includes("Rest")) return <Moon className="w-5 h-5 text-indigo-400" />;
    return <Shield className="w-5 h-5 text-voyare-coral" />;
  };

  const getArchetypeBadgeColor = (archetype) => {
    if (archetype.includes("Sprint")) return "bg-amber-100 text-amber-800 border-amber-300";
    if (archetype.includes("Rest")) return "bg-indigo-100 text-indigo-800 border-indigo-300";
    return "bg-voyare-coral/15 text-voyare-coral border-voyare-coral/30";
  };

  return (
    <section id="recovery" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-voyare-coral/10 text-voyare-coral text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Combinatorial CP-SAT Pareto Frontier</span>
          </div>
          <h2 className="font-volkhov text-3xl sm:text-4xl md:text-5xl font-bold text-voyare-navy">
            Tri-Archetype Recovery Framework
          </h2>
          <p className="font-poppins text-voyare-slate text-sm sm:text-base mt-2">
            No single recovery fits all situations. Voyare explores the Pareto frontier and curates 3 tailored recovery plans based on speed, budget, and physical comfort.
          </p>

          {/* View Mode Toggle: Cards vs Git-Diff View */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "cards" 
                  ? 'bg-white text-voyare-navy shadow-sm' 
                  : 'text-voyare-slate hover:text-voyare-navy'
              }`}
            >
              Curated Plan Cards
            </button>
            <button
              onClick={() => setViewMode("git-diff")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "git-diff" 
                  ? 'bg-voyare-navy text-white shadow-sm' 
                  : 'text-voyare-slate hover:text-voyare-navy'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5 text-voyare-coral" />
              <span>Itinerary Git-Diff View</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Curated Tri-Archetype Plan Cards */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {recoveryPlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`voyare-glass-card rounded-[28px] p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 relative cursor-pointer border ${
                    isSelected
                      ? 'ring-2 ring-voyare-coral shadow-2xl scale-[1.02] bg-white'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-xl bg-white/90'
                  }`}
                >
                  {/* Top Badge and Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shadow-inner">
                        {getArchetypeIcon(plan.archetype)}
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${getArchetypeBadgeColor(plan.archetype)}`}>
                        {plan.archetype}
                      </span>
                    </div>

                    <h3 className="font-poppins text-xl font-bold text-voyare-navy">
                      {plan.tagline.split('•')[0]}
                    </h3>
                    <p className="text-xs text-voyare-textMuted font-mono mt-0.5">
                      {plan.tagline.split('•')[1] || plan.archetype}
                    </p>

                    <p className="font-poppins text-xs text-voyare-slate mt-3 leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                          Net Delay
                        </span>
                        <div className="text-base font-bold font-mono text-voyare-navy mt-0.5 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-voyare-coral" />
                          <span>+{Math.round(plan.net_delay_minutes / 60)}h {plan.net_delay_minutes % 60}m</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                          Arrival Time
                        </span>
                        <div className="text-base font-bold font-mono text-voyare-darkNavy mt-0.5">
                          {plan.final_arrival_time}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                          Out-Of-Pocket
                        </span>
                        <div className={`text-base font-bold font-mono mt-0.5 ${
                          plan.net_out_of_pocket < 0 
                            ? 'text-emerald-600 font-extrabold' 
                            : plan.net_out_of_pocket === 0 
                            ? 'text-voyare-navy' 
                            : 'text-amber-600'
                        }`}>
                          {plan.net_out_of_pocket < 0 
                            ? `+€${Math.abs(plan.net_out_of_pocket)} (GAIN)` 
                            : `€${plan.net_out_of_pocket}`}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                          Comfort Score
                        </span>
                        <div className="text-base font-bold font-mono text-voyare-navy mt-0.5">
                          {plan.comfort_score} / 10
                        </div>
                      </div>
                    </div>

                    {/* Replacement Vertices List */}
                    <div className="mt-5 space-y-2">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Replaced / Rescheduled Vertices
                      </div>
                      {plan.replacement_nodes?.map((node, nIdx) => (
                        <div key={nIdx} className="text-xs p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-semibold text-voyare-navy leading-tight">{node.name}</div>
                            <div className="text-[10px] text-voyare-slate mt-0.5 font-mono">{node.departure} ➔ {node.arrival}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Ghost Holds Attached */}
                    {plan.ghost_holds_secured?.length > 0 && (
                      <div className="mt-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] flex items-center justify-between">
                        <span className="font-medium">🔒 Ghost Holds Secured:</span>
                        <span className="font-mono font-bold">{plan.ghost_holds_secured.length} Locked</span>
                      </div>
                    )}
                  </div>

                  {/* Commit Action Button */}
                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlan(plan);
                      }}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-voyare-navy text-white hover:bg-black shadow-voyare-card'
                          : 'bg-slate-100 text-voyare-navy hover:bg-slate-200'
                      }`}
                    >
                      <span>Execute 1-Click Atomic Saga</span>
                      <ArrowRight className="w-4 h-4 text-voyare-coral" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* View Mode 2: Visual Git-Diff Comparison (like software commit diff) */
          <div className="voyare-glass-card rounded-[32px] p-6 lg:p-8 shadow-voyare-card border border-white">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-wrap gap-4">
              <div>
                <h3 className="font-poppins text-xl font-bold text-voyare-navy flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-voyare-coral" />
                  <span>Itinerary Differential Ledger (Git-Diff)</span>
                </h3>
                <p className="text-xs text-voyare-slate mt-0.5">
                  Visual software revision tracking for multi-modal travel bookings. 
                  Red indicates severed nodes, green indicates automated replacement branches.
                </p>
              </div>

              {/* Plan Switcher Pills */}
              <div className="flex items-center gap-2">
                {recoveryPlans.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedPlanId === p.id 
                        ? 'bg-voyare-navy text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.archetype}
                  </button>
                ))}
              </div>
            </div>

            {/* Git-Diff Display for Selected Plan */}
            {(() => {
              const activePlan = recoveryPlans.find(p => p.id === selectedPlanId) || recoveryPlans[0];

              return (
                <div className="mt-6 space-y-4">
                  <div className="font-mono text-xs p-4 rounded-2xl bg-[#080809] text-white overflow-x-auto shadow-inner">
                    <div className="text-white/40 pb-2 border-b border-white/10 mb-3">
                      commit 8f19da24: Disruption Recovery Branch [{activePlan.archetype.toUpperCase()}]
                    </div>

                    {/* Deleted / Broken Segments */}
                    <div className="space-y-1.5">
                      <div className="text-red-400 font-bold uppercase tracking-wider text-[10px]">
                        --- Disrupted / Broken Logistical Vertices
                      </div>
                      {activePlan.diff_summary?.deleted_segments?.map((del, dIdx) => (
                        <div key={dIdx} className="text-red-300 bg-red-950/40 px-3 py-1.5 rounded flex items-center gap-2">
                          <span className="font-bold text-red-500">-</span>
                          <span className="line-through">{del}</span>
                          <span className="text-[10px] text-red-400 ml-auto">[Force Majeure Refund Requested]</span>
                        </div>
                      ))}
                    </div>

                    {/* Inserted Recovery Segments */}
                    <div className="mt-4 space-y-1.5">
                      <div className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                        +++ Injected Optimal Recovery Vertices
                      </div>
                      {activePlan.diff_summary?.inserted_segments?.map((ins, iIdx) => (
                        <div key={iIdx} className="text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded flex items-center gap-2">
                          <span className="font-bold text-emerald-400">+</span>
                          <span>{ins}</span>
                          <span className="text-[10px] text-emerald-400 ml-auto">[Ghost Hold Secured]</span>
                        </div>
                      ))}
                    </div>

                    {/* Modified Retimed Bookings */}
                    <div className="mt-4 space-y-1.5">
                      <div className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                        ~~~ Retimed / Adjusted Reservation Nodes
                      </div>
                      {activePlan.diff_summary?.modified_segments?.map((mod, mIdx) => (
                        <div key={mIdx} className="text-amber-200 bg-amber-950/40 px-3 py-1.5 rounded flex items-center gap-2">
                          <span className="font-bold text-amber-400">~</span>
                          <span>{mod}</span>
                          <span className="text-[10px] text-amber-300 ml-auto">[Supplier Webhook Notified]</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-voyare-slate font-medium">Selected Archetype: </span>
                      <strong className="text-voyare-navy font-bold">{activePlan.archetype}</strong>
                      <span className="text-voyare-textMuted ml-2">(Delay: +{activePlan.net_delay_minutes}m, Net OOP: €{activePlan.net_out_of_pocket})</span>
                    </div>

                    <button
                      onClick={() => onSelectPlan(activePlan)}
                      className="px-5 py-2 rounded-xl bg-voyare-coral text-white font-bold hover:bg-[#c5533c] shadow-voyare-coral-glow transition-all"
                    >
                      Authorize &amp; Rebook via Distributed Saga
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

      </div>
    </section>
  );
}
