import React, { useState } from 'react';
import { Sliders, Briefcase, Users, Backpack, Sparkles, RefreshCw } from 'lucide-react';

export default function PersonaWeightSliders({ onUpdateWeights, isOptimizing }) {
  const [activePersona, setActivePersona] = useState("corporate");
  const [weights, setWeights] = useState({
    weight_cost: 0.05,
    weight_time: 0.60,
    weight_intent: 0.25,
    weight_comfort: 0.10,
    budget_limit: 1000.0
  });

  const selectPersona = (type) => {
    setActivePersona(type);
    let newWeights;
    if (type === "corporate") {
      newWeights = { weight_cost: 0.05, weight_time: 0.60, weight_intent: 0.25, weight_comfort: 0.10, budget_limit: 1500 };
    } else if (type === "leisure") {
      newWeights = { weight_cost: 0.20, weight_time: 0.20, weight_intent: 0.50, weight_comfort: 0.10, budget_limit: 800 };
    } else if (type === "budget") {
      newWeights = { weight_cost: 0.65, weight_time: 0.15, weight_intent: 0.10, weight_comfort: 0.10, budget_limit: 400 };
    }
    setWeights(newWeights);
    onUpdateWeights(newWeights);
  };

  const handleSliderChange = (key, val) => {
    const newWeights = { ...weights, [key]: parseFloat(val) };
    setWeights(newWeights);
    setActivePersona("custom");
    onUpdateWeights(newWeights);
  };

  return (
    <section className="py-12 relative bg-slate-50/70 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-voyare-coral mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>Multi-Objective Calibration</span>
            </div>
            <h3 className="font-volkhov text-2xl sm:text-3xl font-bold text-voyare-navy">
              Dynamic Traveler Persona Tuning
            </h3>
            <p className="text-xs text-voyare-slate mt-1 font-poppins">
              Adjust the scalarization weights of the Google OR-Tools CP-SAT solver to match personal preferences.
            </p>
          </div>

          {/* Persona selector tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <button
              onClick={() => selectPersona("corporate")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activePersona === "corporate"
                  ? 'bg-voyare-navy text-white shadow-sm'
                  : 'text-voyare-slate hover:text-voyare-navy'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Corporate (Time)</span>
            </button>

            <button
              onClick={() => selectPersona("leisure")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activePersona === "leisure"
                  ? 'bg-voyare-coral text-white shadow-sm'
                  : 'text-voyare-slate hover:text-voyare-navy'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Leisure (Intent)</span>
            </button>

            <button
              onClick={() => selectPersona("budget")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activePersona === "budget"
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-voyare-slate hover:text-voyare-navy'
              }`}
            >
              <Backpack className="w-3.5 h-3.5" />
              <span>Budget (Cost)</span>
            </button>
          </div>
        </div>

        {/* 4D Objective Vector Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          
          {/* Weight Time */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-voyare-slate">Time Penalty (w_time)</span>
              <span className="font-mono font-bold text-voyare-coral">{weights.weight_time.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={weights.weight_time}
              onChange={(e) => handleSliderChange("weight_time", e.target.value)}
              className="w-full accent-voyare-coral h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Minimizes final arrival delay</span>
          </div>

          {/* Weight Cost */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-voyare-slate">Out-of-Pocket (w_cost)</span>
              <span className="font-mono font-bold text-emerald-600">{weights.weight_cost.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={weights.weight_cost}
              onChange={(e) => handleSliderChange("weight_cost", e.target.value)}
              className="w-full accent-emerald-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Minimizes net cash expenditure</span>
          </div>

          {/* Weight Intent */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-voyare-slate">Trip Intent (w_intent)</span>
              <span className="font-mono font-bold text-voyare-gold">{weights.weight_intent.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={weights.weight_intent}
              onChange={(e) => handleSliderChange("weight_intent", e.target.value)}
              className="w-full accent-voyare-gold h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Preserves activities &amp; planned POIs</span>
          </div>

          {/* Weight Comfort */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-voyare-slate">Comfort / Rest (w_comfort)</span>
              <span className="font-mono font-bold text-indigo-500">{weights.weight_comfort.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={weights.weight_comfort}
              onChange={(e) => handleSliderChange("weight_comfort", e.target.value)}
              className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Avoids red-eyes &amp; tight layovers</span>
          </div>

        </div>

      </div>
    </section>
  );
}
