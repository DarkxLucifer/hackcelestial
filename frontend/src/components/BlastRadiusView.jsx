import React from 'react';
import { AlertOctagon, TrendingDown, ArrowDownRight, ShieldCheck, DollarSign, Clock, CheckCircle, ExternalLink } from 'lucide-react';

export default function BlastRadiusView({ activeImpact, itinerary, onReviewRecovery }) {
  if (!activeImpact) {
    return (
      <section id="blast-radius" className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-volkhov text-2xl font-bold text-emerald-950">System In Steady State</h3>
            <p className="text-emerald-800 text-sm mt-1 max-w-lg mx-auto font-poppins">
              All multi-modal vertices possess positive temporal slack. Inbound aircraft rotation telemetry confirms on-time performance.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blast-radius" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Banner with pulsing red border */}
        <div className="rounded-[32px] bg-gradient-to-br from-red-950 via-[#181E4B] to-[#102C2E] p-8 lg:p-10 text-white shadow-2xl border-2 border-red-500/50 relative overflow-hidden">
          
          {/* Background ambient red glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            
            {/* Header badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <AlertOctagon className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 bg-red-500/20 px-2 py-0.5 rounded">
                      DOWNSTREAM RIPPLE DETECTED
                    </span>
                    <span className="text-xs text-white/60">
                      Blast Radius Propagation in 0.38s
                    </span>
                  </div>
                  <h3 className="font-volkhov text-2xl sm:text-3xl font-bold text-white mt-1">
                    CPM Impact & Failure Analysis
                  </h3>
                </div>
              </div>

              <button
                onClick={onReviewRecovery}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-voyare-coral to-voyare-gold text-white font-bold text-sm shadow-voyare-glow hover:opacity-95 transition-all flex items-center gap-2"
              >
                <span>View Solution Plans</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>
            </div>

            {/* Impact Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-[11px] uppercase font-bold text-white/50 tracking-wider">Nodes in Blast Radius</span>
                <div className="text-3xl font-black font-mono text-white mt-1 flex items-baseline gap-2">
                  <span>{activeImpact.blast_radius_node_ids.length}</span>
                  <span className="text-xs text-red-400 font-sans font-semibold">Downstream Vertices</span>
                </div>
                <p className="text-[11px] text-white/60 mt-1">
                  100% of remaining itinerary segments compromised
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-[11px] uppercase font-bold text-white/50 tracking-wider">Missed Connections</span>
                <div className="text-3xl font-black font-mono text-amber-400 mt-1 flex items-baseline gap-2">
                  <span>{activeImpact.missed_connection_node_ids.length}</span>
                  <span className="text-xs text-amber-200 font-sans font-semibold">Breached MCT</span>
                </div>
                <p className="text-[11px] text-white/60 mt-1">
                  SBB IC 8 (18:02) and MGB Shuttle unreachable
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-[11px] uppercase font-bold text-white/50 tracking-wider">Default Risk (Hotel)</span>
                <div className="text-3xl font-black font-mono text-red-400 mt-1 flex items-baseline gap-2">
                  <span>1</span>
                  <span className="text-xs text-red-200 font-sans font-semibold">Strict 21:00 Cutoff</span>
                </div>
                <p className="text-[11px] text-white/60 mt-1">
                  Matterhorn Lodge reception closes before arrival
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-[11px] uppercase font-bold text-white/50 tracking-wider">Financial Risk Exposure</span>
                <div className="text-3xl font-black font-mono text-emerald-400 mt-1 flex items-baseline gap-1">
                  <span>€{Math.round(activeImpact.estimated_financial_loss)}</span>
                  <span className="text-xs text-emerald-200 font-sans font-semibold">Protected</span>
                </div>
                <p className="text-[11px] text-white/60 mt-1">
                  Absorbed by Liquidity Bridge & EU261 claim
                </p>
              </div>

            </div>

            {/* Downstream Chain Walkthrough */}
            <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-wider text-voyare-gold font-bold mb-3">
                Topological Ripple Breakdown (Forward CPM Traversal)
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-start gap-2 text-red-300">
                  <span className="text-red-400 font-bold">[00:00:00.12]</span>
                  <span><strong>BA 712:</strong> Inbound aircraft G-TTNP delay +{activeImpact.delay_minutes}m. Touchdown pushed from 16:45 to 17:50 CET.</span>
                </div>
                <div className="flex items-start gap-2 text-red-300">
                  <span className="text-red-400 font-bold">[00:00:00.24]</span>
                  <span><strong>Transfer Link ZRH:</strong> Scheduled connection to rail is 18:02. Time remaining: 12 minutes (MCT is 30m). Buffer deficit: -18m &rarr; <strong>CONNECTION FAILED</strong>.</span>
                </div>
                <div className="flex items-start gap-2 text-amber-300">
                  <span className="text-amber-400 font-bold">[00:00:00.31]</span>
                  <span><strong>SBB IC 8:</strong> Passenger stranded at Zurich HB. Earliest standard fallback train is 19:02, reaching Visp at 21:02.</span>
                </div>
                <div className="flex items-start gap-2 text-amber-300">
                  <span className="text-amber-400 font-bold">[00:00:00.38]</span>
                  <span><strong>Boutique Hotel Matterhorn:</strong> Final arrival at Zermatt 22:15. Reception desk permanently closes at 21:00 &rarr; <strong>DEFAULT &amp; LOCKOUT RISK DETECTED</strong>.</span>
                </div>
              </div>
            </div>

            {/* Automated Protective Actions Taken Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Autonomous Protections Engaged:</strong> 2 Just-In-Time Ghost Holds secured. UK/EU261 €250 compensation dossier generated.
                </span>
              </div>
              <button
                onClick={onReviewRecovery}
                className="font-bold text-white underline hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Compare Sprint vs Balanced vs Rest Plans &rarr;</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
