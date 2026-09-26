import React, { useState } from 'react';
import { ShieldAlert, Zap, RotateCcw, AlertTriangle, CloudSnow, Clock, Sliders, CheckCircle2 } from 'lucide-react';

export default function DisruptionSimulator({ itinerary, onSimulate, onReset, activeDisruption, isSimulating }) {
  const [selectedNodeId, setSelectedNodeId] = useState("node_flight_1");
  const [delayMinutes, setDelayMinutes] = useState(65);
  const [isCancellation, setIsCancellation] = useState(false);
  const [reason, setReason] = useState("Air Traffic Control Ground Delay Program at LHR");

  const handleSimulateCustom = () => {
    onSimulate({
      node_id: selectedNodeId,
      delay_minutes: isCancellation ? 0 : Number(delayMinutes),
      is_cancellation: isCancellation,
      reason: reason
    });
  };

  const handleApplyPreset = (presetName) => {
    if (presetName === 'alpine') {
      setSelectedNodeId("node_flight_1");
      setDelayMinutes(65);
      setIsCancellation(false);
      setReason("Heathrow Air Traffic Control Ground Delay Program (+65m)");
      onSimulate({
        node_id: "node_flight_1",
        delay_minutes: 65,
        is_cancellation: false,
        reason: "Heathrow Air Traffic Control Ground Delay Program (+65m)"
      });
    } else if (presetName === 'blizzard') {
      setSelectedNodeId("node_flight_1");
      setDelayMinutes(240);
      setIsCancellation(true);
      setReason("Polar Vortex Blizzard & Airport Ground Stop");
      onSimulate({
        node_id: "node_flight_1",
        delay_minutes: 240,
        is_cancellation: true,
        reason: "Polar Vortex Blizzard & Airport Ground Stop"
      });
    } else if (presetName === 'strike') {
      setSelectedNodeId("node_train_1");
      setDelayMinutes(120);
      setIsCancellation(true);
      setReason("SBB / Regional Railway Industrial Action Strike");
      onSimulate({
        node_id: "node_train_1",
        delay_minutes: 120,
        is_cancellation: true,
        reason: "SBB / Regional Railway Industrial Action Strike"
      });
    }
  };

  return (
    <section id="simulator" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-voyare-coral/10 text-voyare-coral text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Stress Testing</span>
          </div>
          <h2 className="font-volkhov text-3xl sm:text-4xl md:text-5xl font-bold text-voyare-navy">
            Disruption Radar & Injection Simulator
          </h2>
          <p className="font-poppins text-voyare-slate text-sm sm:text-base mt-2">
            Simulate real-world operational disturbances across air traffic, rail strikes, weather holds, and carrier backlogs. 
            Watch the engine calculate the downstream ripple blast radius instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Preset Scenarios */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-voyare-navy font-poppins flex items-center gap-2">
              <Sliders className="w-4 h-4 text-voyare-coral" />
              <span>One-Click Hackathon Scenarios</span>
            </h3>

            {/* Preset 1: Alpine Cascade */}
            <div 
              onClick={() => handleApplyPreset('alpine')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                activeDisruption?.delay_minutes === 65 && !activeDisruption?.is_cancellation
                  ? 'bg-amber-500/10 border-amber-500 shadow-lg ring-2 ring-amber-400/40'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-voyare-coral">Featured Case Study</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">+65m Delay</span>
              </div>
              <h4 className="font-bold text-base text-voyare-navy mt-1">The Alpine Cascade (Heathrow ➔ Zermatt)</h4>
              <p className="text-xs text-voyare-slate mt-1">
                LHR Ground Delay (+65m) causes missed Zurich HB train (18:02). The delay cascades to Zermatt, triggering a locked hotel door default after the 21:00 cutoff.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-medium">✓ Demonstrates TDAG Ripple & EU261 €250 Claim</span>
                <span className="text-voyare-coral font-bold flex items-center gap-1">Apply Preset &rarr;</span>
              </div>
            </div>

            {/* Preset 2: Polar Vortex Blizzard */}
            <div 
              onClick={() => handleApplyPreset('blizzard')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                activeDisruption?.is_cancellation && activeDisruption?.node_id === 'node_flight_1'
                  ? 'bg-red-500/10 border-red-500 shadow-lg ring-2 ring-red-400/40'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Plan-Level Disruption</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">CANCELLED</span>
              </div>
              <h4 className="font-bold text-base text-voyare-navy mt-1">Polar Vortex Storm Cancellation</h4>
              <p className="text-xs text-voyare-slate mt-1">
                Severe winter weather forces immediate flight cancellation. Triggers 2024 U.S. DOT prompt cash refund mandate and multi-modal rail substitution.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-sky-700 font-medium">✓ Enforces US DOT Automatic Refund</span>
                <span className="text-voyare-coral font-bold flex items-center gap-1">Apply Preset &rarr;</span>
              </div>
            </div>

            {/* Preset 3: Transit Strike */}
            <div 
              onClick={() => handleApplyPreset('strike')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                activeDisruption?.node_id === 'node_train_1'
                  ? 'bg-purple-500/10 border-purple-500 shadow-lg ring-2 ring-purple-400/40'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Day-Level Disruption</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">RAIL STRIKE</span>
              </div>
              <h4 className="font-bold text-base text-voyare-navy mt-1">SBB Railway Industrial Strike</h4>
              <p className="text-xs text-voyare-slate mt-1">
                Regional railway workers strike halts mainline transit across the Gotthard and Bern corridors. Dispatches emergency private shuttle transfer.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-purple-700 font-medium">✓ Activates Rail Rights Reg 2021/782</span>
                <span className="text-voyare-coral font-bold flex items-center gap-1">Apply Preset &rarr;</span>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Control Board */}
          <div className="lg:col-span-7">
            <div className="voyare-glass-card rounded-[28px] p-6 lg:p-8 shadow-voyare-card border border-white">
              
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-voyare-coral/15 flex items-center justify-center text-voyare-coral">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-voyare-navy text-base">Custom Disruption Injector</h4>
                    <p className="text-xs text-voyare-slate">Target any itinerary vertex with custom delay metrics</p>
                  </div>
                </div>

                <button
                  onClick={onReset}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-voyare-slate hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              </div>

              {/* Node Target Selection */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-voyare-slate mb-1.5">
                    Target Itinerary Vertex
                  </label>
                  <select
                    value={selectedNodeId}
                    onChange={(e) => setSelectedNodeId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-sm text-voyare-navy focus:outline-none focus:ring-2 focus:ring-voyare-coral"
                  >
                    {itinerary?.nodes?.map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.name} ({node.carrier || "Transfer"} - {node.start_time})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Disruption Mode Switch */}
                <div className="flex items-center gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCancellation(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      !isCancellation
                        ? 'bg-voyare-navy text-white border-voyare-navy shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Schedule Delay
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCancellation(true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      isCancellation
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Complete Cancellation
                  </button>
                </div>

                {/* Delay Minutes Slider */}
                {!isCancellation && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-voyare-slate uppercase tracking-wider">Delay Duration</span>
                      <span className="font-mono font-bold text-base text-voyare-coral">+{delayMinutes} minutes</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="300"
                      step="5"
                      value={delayMinutes}
                      onChange={(e) => setDelayMinutes(e.target.value)}
                      className="w-full accent-voyare-coral h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>+15m (Minor)</span>
                      <span>+65m (Alpine Breach)</span>
                      <span>+180m (EU261 Tier)</span>
                      <span>+300m (Severe)</span>
                    </div>
                  </div>
                )}

                {/* Reason description input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-voyare-slate mb-1.5">
                    Disruption Classification / Root Cause
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Inbound aircraft ground hold program"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-sm text-voyare-navy focus:outline-none focus:ring-2 focus:ring-voyare-coral"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <button
                    onClick={handleSimulateCustom}
                    disabled={isSimulating}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-voyare-coral to-[#FF7D68] text-white font-bold text-base shadow-voyare-coral-glow hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5 fill-white" />
                    <span>{isSimulating ? "Propagating Downstream Blast Radius..." : "Inject Disruption & Calculate Ripple Effect"}</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
