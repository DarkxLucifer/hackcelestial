import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Loader2, ArrowRight, X, AlertTriangle, Fingerprint, Lock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AgenticSagaModal({ plan, isOpen, onClose, onCommitSuccess }) {
  const [stage, setStage] = useState("review"); // "review", "executing", "completed"
  const [completedSteps, setCompletedSteps] = useState([]);
  const [sagaResult, setSagaResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStage("review");
      setCompletedSteps([]);
      setSagaResult(null);
    }
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const stepsList = [
    { id: 1, title: "Locking & Confirming Ghost Holds", desc: `Securing ${plan.ghost_holds_secured?.length || 2} pre-allocated inventory seats` },
    { id: 2, title: "Carrier Force-Majeure Fee Waiver", desc: "Transmitting disruption telemetry to British Airways & SBB PNR" },
    { id: 3, title: "Issuing Multi-Modal Digital Tickets", desc: "Committing replacement express rail & Matterhorn smart-lock keycode" },
    { id: 4, title: "Filing Statutory EU261 / US DOT Claim", desc: "Packaging automated €250 legal compensation packet" },
    { id: 5, title: "Disbursing Parametric Liquidity Advance", desc: `Crediting €${plan.liquidity_advance_offered || 400}.00 instantly to digital wallet` }
  ];

  const handleExecuteSaga = async () => {
    setStage("executing");
    
    // Simulate real-time saga transaction execution step by step
    for (let i = 0; i < stepsList.length; i++) {
      await new Promise(r => setTimeout(r, 650));
      setCompletedSteps(prev => [...prev, stepsList[i].id]);
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log("Confetti effect triggered");
    }

    setStage("completed");
    if (onCommitSuccess) {
      onCommitSuccess(plan);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-xl rounded-[32px] bg-white p-7 lg:p-8 shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={stage === "executing"}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors disabled:opacity-30"
        >
          <X className="w-4 h-4" />
        </button>

        {stage === "review" && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-voyare-coral font-poppins">
                Autonomous Agentic Protocol
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                MCP / AuthZEN Bounded Mandate
              </span>
            </div>

            <h3 className="font-volkhov text-2xl font-bold text-voyare-navy">
              Confirm {plan.archetype} Execution
            </h3>
            <p className="text-xs text-voyare-slate mt-1">
              Executing this plan initiates a Distributed Saga that atomically updates all airline, rail, and hotel bookings with automatic rollback protection.
            </p>

            {/* Plan Highlights Summary */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Selected Strategy:</span>
                <strong className="text-voyare-navy font-bold">{plan.archetype}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Revised Final Arrival:</span>
                <strong className="text-voyare-navy font-mono">{plan.final_arrival_time} (+{plan.net_delay_minutes}m)</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Net Out-Of-Pocket Balance:</span>
                <strong className={`font-mono text-sm ${plan.net_out_of_pocket <= 0 ? 'text-emerald-600 font-black' : 'text-amber-600'}`}>
                  {plan.net_out_of_pocket < 0 ? `+€${Math.abs(plan.net_out_of_pocket)} (GAIN)` : `€${plan.net_out_of_pocket}`}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Statutory Compensation Claim:</span>
                <strong className="text-emerald-600 font-mono">€{plan.regulatory_compensation}.00 Filed</strong>
              </div>
            </div>

            {/* Bounded Mandate Safeguard Notice */}
            <div className="mt-4 p-3.5 rounded-xl bg-voyare-cream/80 border border-[#F1A501]/30 flex items-center gap-3 text-xs text-voyare-navy">
              <Fingerprint className="w-6 h-6 text-voyare-gold shrink-0" />
              <div>
                <strong>Bounded-Mandate Authorization:</strong> Changes below your preset $150 limit are approved automatically. Biometric passkey signature attached.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel / Return
              </button>
              <button
                type="button"
                onClick={handleExecuteSaga}
                className="flex-1 py-3.5 rounded-xl bg-voyare-navy text-white text-xs font-bold hover:bg-black shadow-lg shadow-voyare-navy/20 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-voyare-coral" />
                <span>Authorize &amp; Rebook (1-Click)</span>
              </button>
            </div>
          </div>
        )}

        {stage === "executing" && (
          <div className="py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-voyare-coral/15 flex items-center justify-center mx-auto mb-4 text-voyare-coral">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <h3 className="font-volkhov text-2xl font-bold text-voyare-navy">
              Orchestrating Distributed Saga
            </h3>
            <p className="text-xs text-voyare-slate mt-1 mb-6">
              Coordinating multi-provider transaction APIs with transactional rollback safety...
            </p>

            {/* Step by Step Progress List */}
            <div className="space-y-3 text-left max-w-md mx-auto">
              {stepsList.map((step) => {
                const isDone = completedSteps.includes(step.id);
                const isCurrent = !isDone && (completedSteps.length + 1 === step.id);

                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : isCurrent
                        ? 'bg-voyare-cream/80 border-voyare-gold text-voyare-navy animate-pulse'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-voyare-gold animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{step.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stage === "completed" && (
          <div className="py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="font-volkhov text-2xl font-bold text-voyare-navy">
              Trip Successfully Recovered!
            </h3>
            <p className="text-xs text-voyare-slate mt-1 max-w-sm mx-auto">
              Your revised itinerary is confirmed across all systems. New boarding passes and smart-lock keycodes have been issued to your device.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left text-xs font-mono space-y-1.5 text-emerald-950">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Atomic Transaction Ledger Confirmed:</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                • SBB Express Train #834 Confirmed (Seats 24A, 24B) <br />
                • Boutique Hotel Matterhorn Late Lockbox Code: <strong>#8821</strong> <br />
                • UK/EU261 Compensation Docket Filed: <strong>€250.00</strong> <br />
                • Parametric Liquidity Shield: <strong>ACTIVE</strong>
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-voyare-navy text-white text-xs font-bold hover:bg-black shadow-lg transition-all"
              >
                Done • View Live Resilient Itinerary
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
