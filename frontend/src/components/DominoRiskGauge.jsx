import React from 'react';
import { Gauge, ShieldAlert, AlertTriangle, CheckCircle, Info, Activity } from 'lucide-react';

export default function DominoRiskGauge({ riskAnalysis, itinerary }) {
  const dri = riskAnalysis?.domino_risk_index ?? (itinerary?.domino_risk_index || 48.2);
  const level = riskAnalysis?.level || (dri > 65 ? "CRITICAL" : dri > 30 ? "MODERATE" : "LOW");
  const color = riskAnalysis?.color || (dri > 65 ? "#EF4444" : dri > 30 ? "#F59E0B" : "#10B981");
  const advice = riskAnalysis?.advice || "High structural fragility. Upstream delay breaks zero-slack anchors.";

  // Gauge calculations for SVG semicircle
  const radius = 80;
  const circumference = Math.PI * radius; // Half-circle
  const strokeDashoffset = circumference - (dri / 100) * circumference;

  return (
    <section id="domino-risk" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-voyare-coral/10 text-voyare-coral text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Structural Itinerary Vulnerability Metric</span>
          </div>
          <h2 className="font-volkhov text-3xl sm:text-4xl md:text-5xl font-bold text-voyare-navy">
            The Domino Risk Index (DRI)
          </h2>
          <p className="font-poppins text-voyare-slate text-sm sm:text-base mt-2">
            Traditional tools treat bookings as independent silos. The DRI evaluates network-level fragility, 
            carrier delay distributions, and zero-slack downstream bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Animated Circular Gauge */}
          <div className="lg:col-span-5">
            <div className="voyare-glass-card rounded-[32px] p-8 shadow-voyare-card border border-white text-center flex flex-col items-center">
              
              <div className="text-xs uppercase font-bold tracking-wider text-voyare-slate mb-4">
                Real-Time Fragility Index
              </div>

              {/* Semicircle Gauge SVG */}
              <div className="relative w-64 h-36 flex items-center justify-center">
                <svg className="w-64 h-36 overflow-visible" viewBox="0 0 200 110">
                  {/* Background Track */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  {/* Colored Active Arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={color}
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Score Number inside */}
                <div className="absolute bottom-0 flex flex-col items-center">
                  <span className="font-mono text-4xl sm:text-5xl font-black text-voyare-navy tracking-tight">
                    {Math.round(dri)}
                  </span>
                  <span className="text-[11px] font-bold text-voyare-slate uppercase">
                    Index Score / 100
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-6">
                <span 
                  className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
                  style={{ backgroundColor: `${color}20`, color: color, borderColor: `${color}40`, borderWidth: 1 }}
                >
                  Risk Status: {level}
                </span>
              </div>

              {/* Advice */}
              <p className="text-xs text-voyare-slate mt-4 max-w-sm font-medium leading-relaxed">
                {advice}
              </p>

              {/* Formula snippet */}
              <div className="mt-5 pt-4 border-t border-slate-100 w-full text-[10px] font-mono text-voyare-textMuted text-left">
                DRI = 100 × [1 - exp(-∑ (λᵢ / (σᵢ - MCTᵢ)) · Ω(vᵢ₊₁))]
              </div>

            </div>
          </div>

          {/* Right Column: Connection Risk Breakdown Table */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-poppins text-lg font-bold text-voyare-navy">
              Edge-by-Edge Sensitivity Analysis
            </h3>
            
            <div className="space-y-3">
              {riskAnalysis?.risk_breakdown?.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-voyare-navy font-poppins">
                      {item.connection}
                    </span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      item.connection_risk_score > 70 
                        ? 'bg-red-100 text-red-700' 
                        : item.connection_risk_score > 35 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {Math.round(item.connection_risk_score)}% Risk
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-mono text-voyare-slate">
                    <div>
                      <span className="text-slate-400 font-sans block text-[9px] uppercase">Net Slack Buffer</span>
                      <span className="font-bold text-voyare-darkNavy">+{item.net_buffer_minutes}m</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-sans block text-[9px] uppercase">Carrier Delay Factor (λ)</span>
                      <span className="font-bold text-voyare-darkNavy">{item.carrier_sensitivity}x</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-sans block text-[9px] uppercase">Downstream Anchor (Ω)</span>
                      <span className="font-bold text-voyare-darkNavy">{item.downstream_multiplier}x</span>
                    </div>
                  </div>

                  {item.risk_flags && item.risk_flags.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {item.risk_flags.map((flag, fIdx) => (
                        <span key={fIdx} className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200/60 font-medium">
                          ⚠️ {flag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Explanatory Callout */}
            <div className="p-4 rounded-2xl bg-voyare-cream/80 border border-[#F1A501]/30 flex items-start gap-3">
              <Info className="w-5 h-5 text-voyare-gold shrink-0 mt-0.5" />
              <div className="text-xs text-voyare-navy leading-relaxed">
                <strong>Why DRI Matters:</strong> Even if an individual flight has a 92% on-time rating, coupling it with a strict hotel check-in cutoff creates an exponential vulnerability. Voyare automatically triggers ghost holds before DRI surpasses 65.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
