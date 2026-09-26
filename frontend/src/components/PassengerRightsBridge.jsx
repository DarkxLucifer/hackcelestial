import React from 'react';
import { Scale, ShieldCheck, DollarSign, FileText, ArrowRight, Zap, CheckCircle2, Lock } from 'lucide-react';

export default function PassengerRightsBridge({ passengerRights, onApplyLiquidity }) {
  const eu = passengerRights?.eu261;
  const dot = passengerRights?.us_dot;
  const bridge = passengerRights?.liquidity_bridge;

  return (
    <section id="rights" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-voyare-coral/10 text-voyare-coral text-xs font-bold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Deterministic Legal Rights &amp; Capital Provision</span>
          </div>
          <h2 className="font-volkhov text-3xl sm:text-4xl md:text-5xl font-bold text-voyare-navy">
            Statutory Rights &amp; Liquidity Bridge
          </h2>
          <p className="font-poppins text-voyare-slate text-sm sm:text-base mt-2">
            Never pay out-of-pocket for carrier failures. Voyare automatically assembles statutory claims and underwrites an instant liquidity advance against pending airline disbursements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: EU261 & US DOT Automated Regulatory Dossiers */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* EU261 Dossier Card */}
            <div className="voyare-glass-card rounded-[28px] p-6 shadow-voyare-card border border-white">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-base">
                    EU
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-voyare-navy">
                      EU Regulation (EC) No 261/2004 &amp; UK261
                    </h4>
                    <span className="text-[11px] text-voyare-slate">
                      Operating Carrier: British Airways • Flight BA 712 (LHR ➔ ZRH)
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ELIGIBLE (€250)
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-sans block uppercase">Flight Distance</span>
                  <span className="font-bold text-voyare-navy">780 km (Short-haul)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-sans block uppercase">Statutory Payout</span>
                  <span className="font-bold text-emerald-600 text-sm">€250.00 Fixed Cash</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-sans block uppercase">Filing Status</span>
                  <span className="font-bold text-blue-600">Auto-Packaged Dossier</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 space-y-1 font-medium">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Duty of Care Entitlements Enforced:</span>
                </div>
                <p className="text-[11px] text-blue-800 pl-5">
                  • Complimentary refreshment vouchers (€25) <br />
                  • Mandatory overnight airport hotel accommodation in Zurich if evening connections fail <br />
                  • Dedicated ground transfer to lodging
                </p>
              </div>
            </div>

            {/* US DOT Final Rule Card */}
            <div className="voyare-glass-card rounded-[28px] p-6 shadow-voyare-card border border-white">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 font-bold text-base">
                    US
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-voyare-navy">
                      2024 U.S. DOT Automatic Cash Refund Rule
                    </h4>
                    <span className="text-[11px] text-voyare-slate">
                      14 CFR Part 260 • Mandatory Direct Credit Within 7 Business Days
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  ACTIVE SAFEGUARD
                </span>
              </div>

              <p className="text-xs text-voyare-slate mt-3 leading-relaxed">
                Guarantees 100% prompt cash refund without airline vouchers or hidden processing fees whenever cancellations or schedule changes exceed 3 hours domestically or 6 hours internationally.
              </p>
            </div>

          </div>

          {/* Right Column: Parametric Liquidity Advance Mechanism */}
          <div className="lg:col-span-5">
            <div className="rounded-[32px] bg-gradient-to-br from-[#102C2E] via-[#14183E] to-[#1E1D4C] p-7 text-white shadow-2xl border border-white/20 relative overflow-hidden">
              
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-voyare-gold" />
                  <span className="font-bold text-sm uppercase tracking-wider text-voyare-gold">
                    Parametric Liquidity Bridge
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  INSTANT UNDERWRITING
                </span>
              </div>

              <div className="mt-6 text-center">
                <span className="text-xs uppercase font-bold tracking-wider text-white/60">
                  Total Instant Credit Available
                </span>
                <div className="font-mono text-4xl sm:text-5xl font-black text-white mt-1">
                  €{bridge?.total_liquidity_advance || 400}.00
                </div>
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  Zero Interest • Backed by Statutory Payouts
                </p>
              </div>

              {/* Claims Underwritten Breakdown */}
              <div className="mt-6 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white/70">EU261 Statutory Claim:</span>
                  <span className="font-bold text-white">€250.00</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white/70">Parametric Weather / ATC Index:</span>
                  <span className="font-bold text-white">€150.00</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white/70">SBB Swiss Rail Refund Guarantee:</span>
                  <span className="font-bold text-white">€0.00 (Protected)</span>
                </div>
              </div>

              {/* Explanatory benefit */}
              <p className="text-xs text-white/70 mt-5 leading-relaxed">
                Airlines take up to 20 days to wire refunds. Voyare advances the funds immediately to your digital wallet so you can rebook alternative trains or hotels without personal capital lockup.
              </p>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="w-full py-3 rounded-xl bg-gradient-to-r from-voyare-coral to-voyare-gold text-white font-bold text-xs uppercase tracking-wider shadow-voyare-glow flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Liquidity Shield Active &amp; Ready</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
