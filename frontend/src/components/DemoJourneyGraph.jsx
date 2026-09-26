import React, { useState } from 'react';
import { 
  Plane, Train, Building2, Footprints, AlertTriangle, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Network, Layers, Info, Map
} from 'lucide-react';
import CartoJourneyMap from './CartoJourneyMap';

export default function DemoJourneyGraph({ 
  itinerary, 
  activeDisruption, 
  disruptedTicket,
  onSimulateAlpine, 
  onOpenSaga,
  t 
}) {
  const [selectedNodeId, setSelectedNodeId] = useState('node_flight_1');
  const [activeView, setActiveView] = useState('map'); // 'map' (default) | 'graph'

  const carrier = disruptedTicket?.carrier || "Carrier";
  const service = disruptedTicket?.service_number || "Transit";
  const orig = disruptedTicket?.origin || "Origin";
  const dest = disruptedTicket?.destination || "Destination";
  const delay = disruptedTicket?.delay_minutes || 45;
  const isTrain = Boolean(carrier.toLowerCase().includes("rail") || carrier.toLowerCase().includes("train") || service.includes("#"));

  // Mathematical Graph Model (Vertices V and Directed Edges E)
  const nodes = disruptedTicket ? [
    {
      id: "node_flight_1",
      vertexId: "V1",
      name: `${carrier} ${service}`,
      mode: isTrain ? "train" : "flight",
      origin: orig,
      destination: dest,
      window: "14:00 → 16:45",
      delayWindow: `Delayed +${delay}m`,
      mct: "45m",
      slack: "+45m",
      breachSlack: `-${delay}m (BREACH)`,
      status: "delayed",
      statusLabel: `DELAYED +${delay}m`,
      x: 15,
      y: 45
    },
    {
      id: "node_transfer_1",
      vertexId: "V2",
      name: `${dest} Transit Link`,
      mode: "walk",
      origin: dest,
      destination: `${dest} Transit Hub`,
      window: "17:15 → 17:35",
      delayWindow: "Connection Window Compromised",
      mct: "20m",
      slack: "+20m",
      breachSlack: `-${Math.max(10, delay - 25)}m (BREACH)`,
      status: "missed",
      statusLabel: "CONNECTION IMPACTED",
      x: 50,
      y: 45
    },
    {
      id: "node_hotel_1",
      vertexId: "V3",
      name: `${dest} Anchor / Destination`,
      mode: "hotel",
      origin: dest,
      destination: dest,
      window: "Check-in: 20:30",
      delayWindow: "Protected via Voyage Saga",
      mct: "15m",
      slack: "Strict Cutoff",
      breachSlack: "Ghost Hold Active",
      status: "protected",
      statusLabel: "GHOST HOLD PROTECTED",
      isAnchor: true,
      x: 85,
      y: 45
    }
  ] : [
    {
      id: "node_flight_1",
      vertexId: "V1",
      name: "British Airways BA 712",
      mode: "flight",
      origin: "LHR",
      destination: "ZRH",
      window: "14:00 → 16:45",
      delayWindow: "15:05 → 17:50 (+65m)",
      mct: "45m",
      slack: "+45m",
      breachSlack: "-20m (BREACH)",
      status: activeDisruption ? "delayed" : "on_time",
      statusLabel: activeDisruption ? "DELAYED +65m" : "CONFIRMED",
      x: 10,
      y: 45
    },
    {
      id: "node_transfer_1",
      vertexId: "V2",
      name: "Zurich Transit Shuttle",
      mode: "walk",
      origin: "ZRH T1",
      destination: "ZRH Rail",
      window: "17:15 → 17:35",
      delayWindow: "18:20 → 18:40",
      mct: "15m",
      slack: "+27m",
      breachSlack: "-80m (BREACH)",
      status: activeDisruption ? "missed" : "on_time",
      statusLabel: activeDisruption ? "MISSED CONNECTION" : "ON TIME",
      x: 32,
      y: 45
    },
    {
      id: "node_train_1",
      vertexId: "V3",
      name: "SBB InterCity IC 8",
      mode: "train",
      origin: "Zurich HB",
      destination: "Visp",
      window: "18:02 → 20:02",
      delayWindow: "Missed Train (Dep 18:02)",
      mct: "10m",
      slack: "+8m",
      breachSlack: "-83m (BREACH)",
      status: activeDisruption ? "missed" : "on_time",
      statusLabel: activeDisruption ? "MISSED (IC 8)" : "CONFIRMED",
      x: 54,
      y: 45
    },
    {
      id: "node_train_2",
      vertexId: "V4",
      name: "MGB Regional 138",
      mode: "train",
      origin: "Visp",
      destination: "Zermatt",
      window: "20:10 → 21:14",
      delayWindow: "Missed Transfer (Dep 20:10)",
      mct: "8m",
      slack: "+16m",
      breachSlack: "-89m (BREACH)",
      status: activeDisruption ? "missed" : "on_time",
      statusLabel: activeDisruption ? "MISSED CONNECTION" : "CONFIRMED",
      x: 74,
      y: 45
    },
    {
      id: "node_hotel_1",
      vertexId: "V5",
      name: "Matterhorn Lodge",
      mode: "hotel",
      origin: "Zermatt",
      destination: "Zermatt",
      window: "Check-in: 20:30",
      delayWindow: "Estimated Arrival: 22:30",
      mct: "15m",
      slack: "Strict 21:00 Cutoff",
      breachSlack: "Front Desk Closed (-90m)",
      status: activeDisruption ? "protected" : "on_time",
      statusLabel: activeDisruption ? "GHOST HOLD PROTECTED" : "CONFIRMED",
      isAnchor: true,
      x: 92,
      y: 45
    }
  ];

  // Recovery Ghost Hold Node (Injected dynamically into Graph when Disruption is active)
  const ghostNode = {
    id: "node_ghost_hold",
    vertexId: "V_ghost",
    name: "Ghost Hold: SBB IC 834",
    mode: "train",
    origin: "Zurich HB",
    destination: "Visp → Zermatt",
    window: "19:02 → 21:02",
    delayWindow: "Arrives Zermatt 22:30 (Late check-in)",
    mct: "15m",
    slack: "+15m (RESTORED)",
    status: "ghost_hold",
    statusLabel: "RESERVED SEAT",
    x: 64,
    y: 80
  };

  const edges = [
    { from: "V1", to: "V2", slack: activeDisruption ? "-20m" : "+45m", breached: activeDisruption },
    { from: "V2", to: "V3", slack: activeDisruption ? "-80m" : "+27m", breached: activeDisruption },
    { from: "V3", to: "V4", slack: activeDisruption ? "-83m" : "+8m", breached: activeDisruption },
    { from: "V4", to: "V5", slack: activeDisruption ? "-89m" : "+16m", breached: activeDisruption }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-voyare-card p-6 sm:p-8 overflow-hidden">
      
      {/* Graph Header: Title, Real Graph Stats, View Switcher & Simulate Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[#DF6951]" />
            <span className="text-xs font-bold font-poppins uppercase tracking-wider text-[#DF6951]">
              Spatio-Temporal Directed Acyclic Graph (TDAG)
            </span>
          </div>
          <h2 className="font-volkhov font-bold text-2xl sm:text-3xl text-[#181E4B] mt-1">
            Travel graph
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6282] font-poppins mt-0.5">
            Topology: |V| = 5 Vertices • |E| = 4 Dependency Edges • Critical Path Length: 519m
          </p>
        </div>

        {/* View Mode Switcher + Graph Metrics & Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveView('graph')}
              className={`px-3 py-1.5 rounded-lg font-googleSans font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'graph' ? 'bg-white text-[#181E4B] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Graph View</span>
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`px-3 py-1.5 rounded-lg font-googleSans font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'map' ? 'bg-white text-[#181E4B] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Google Map</span>
            </button>
          </div>

          <button
            onClick={onSimulateAlpine}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-poppins shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeDisruption
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-[#DF6951] hover:bg-[#c9533c] text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{activeDisruption ? "Disruption Active (+65m)" : "Simulate Cascade (+65m)"}</span>
          </button>
        </div>
      </div>

      {activeView === 'map' ? (
        <div className="mt-4">
          <CartoJourneyMap activeDisruption={activeDisruption} disruptedTicket={disruptedTicket} itinerary={itinerary} />
        </div>
      ) : (
        <>
          {/* Legend bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 text-xs text-[#5E6282] font-poppins border-b border-slate-100">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Positive Slack (&gt; 0m)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>Negative Slack (Breached Edge)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Zero-Slack Hotel Anchor</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#84829A]">
              Click any vertex node to inspect CPM constraints
            </div>
          </div>

          {/* ========================================================================= */}
          {/* REAL GRAPH CANVAS: SVG DIRECTED GRAPH WITH VERTICES AND EDGES             */}
          {/* ========================================================================= */}
          <div className="relative w-full h-[320px] sm:h-[360px] bg-slate-50/80 rounded-2xl border border-slate-200 mt-4 overflow-hidden">
        
        {/* Subtle graph background grid */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(100, 116, 139, 0.25) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* SVG Graph Edges (Directed Dependency Arrows with Slack Badges) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Edge 1: V1 (LHR) -> V2 (ZRH) */}
          <line 
            x1="10" y1="45" x2="32" y2="45" 
            stroke={activeDisruption ? "#ef4444" : "#10b981"} 
            strokeWidth="1.8" 
            markerEnd={activeDisruption ? "url(#arrow-red)" : "url(#arrow-green)"}
            className={activeDisruption ? "animate-pulse" : ""}
          />

          {/* Edge 2: V2 (ZRH) -> V3 (Visp Train) */}
          <line 
            x1="32" y1="45" x2="54" y2="45" 
            stroke={activeDisruption ? "#ef4444" : "#10b981"} 
            strokeWidth="1.8" 
            markerEnd={activeDisruption ? "url(#arrow-red)" : "url(#arrow-green)"}
            className={activeDisruption ? "animate-pulse" : ""}
          />

          {/* Edge 3: V3 (Train) -> V4 (Mountain Rail) */}
          <line 
            x1="54" y1="45" x2="74" y2="45" 
            stroke={activeDisruption ? "#ef4444" : "#10b981"} 
            strokeWidth="1.8" 
            markerEnd={activeDisruption ? "url(#arrow-red)" : "url(#arrow-green)"}
            className={activeDisruption ? "animate-pulse" : ""}
          />

          {/* Edge 4: V4 (Rail) -> V5 (Hotel Anchor) */}
          <line 
            x1="74" y1="45" x2="92" y2="45" 
            stroke={activeDisruption ? "#f59e0b" : "#10b981"} 
            strokeWidth="1.8" 
            markerEnd={activeDisruption ? "url(#arrow-amber)" : "url(#arrow-green)"}
          />

          {/* Autonomous Ghost Hold Re-routing Edge when Disrupted */}
          {activeDisruption && (
            <>
              {/* Divergence Edge from V2 to V_ghost */}
              <path 
                d="M 32,45 Q 48,80 64,80" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="1.8" 
                strokeDasharray="2,2"
                markerEnd="url(#arrow-green)"
              />
              {/* Convergence Edge from V_ghost to V5 */}
              <path 
                d="M 64,80 Q 78,80 92,45" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="1.8" 
                strokeDasharray="2,2"
                markerEnd="url(#arrow-green)"
              />
            </>
          )}
        </svg>

        {/* Edge Slack Labels (Pill badges positioned along edges) */}
        <div className="absolute top-[32%] left-[21%] -translate-x-1/2 -translate-y-1/2">
          <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold shadow-xs border ${
            activeDisruption ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {activeDisruption ? "-20m BREACH" : "+45m slack"}
          </span>
        </div>

        <div className="absolute top-[32%] left-[43%] -translate-x-1/2 -translate-y-1/2">
          <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold shadow-xs border ${
            activeDisruption ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {activeDisruption ? "-80m BREACH" : "+27m slack"}
          </span>
        </div>

        <div className="absolute top-[32%] left-[64%] -translate-x-1/2 -translate-y-1/2">
          <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold shadow-xs border ${
            activeDisruption ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {activeDisruption ? "-83m BREACH" : "+8m slack"}
          </span>
        </div>

        <div className="absolute top-[32%] left-[83%] -translate-x-1/2 -translate-y-1/2">
          <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold shadow-xs border ${
            activeDisruption ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {activeDisruption ? "21:00 STRICT" : "+16m slack"}
          </span>
        </div>

        {/* Real Graph Vertices (Node Circles) */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group flex flex-col items-center"
            >
              {/* Outer halo */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isSelected 
                  ? 'ring-4 ring-[#181E4B]/20 scale-110 shadow-lg' 
                  : 'group-hover:scale-105'
              } ${
                node.status === 'delayed'
                  ? 'bg-amber-100 border-2 border-amber-500 text-amber-800'
                  : node.status === 'missed'
                  ? 'bg-red-100 border-2 border-red-500 text-red-700'
                  : node.status === 'protected'
                  ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-800'
                  : 'bg-white border-2 border-slate-300 text-[#181E4B]'
              }`}>
                {node.mode === 'flight' && <Plane className="w-5 h-5" />}
                {node.mode === 'walk' && <Footprints className="w-5 h-5" />}
                {node.mode === 'train' && <Train className="w-5 h-5" />}
                {node.mode === 'hotel' && <Building2 className="w-5 h-5" />}
              </div>

              {/* Vertex Label */}
              <span className="mt-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-bold text-[#181E4B] shadow-xs whitespace-nowrap">
                {node.vertexId}: {node.origin}
              </span>

              {/* Status pill under node */}
              <span className={`mt-0.5 text-[9px] font-bold uppercase font-mono px-1.5 py-0.2 rounded ${
                node.status === 'delayed'
                  ? 'bg-amber-100 text-amber-800'
                  : node.status === 'missed'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {node.statusLabel}
              </span>
            </div>
          );
        })}

        {/* Autonomous Injected Ghost Hold Node on Graph */}
        {activeDisruption && (
          <div
            onClick={() => setSelectedNodeId('ghost_node')}
            style={{ left: `${ghostNode.x}%`, top: `${ghostNode.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group flex flex-col items-center"
          >
            <div className="w-11 h-11 rounded-full bg-emerald-500 border-2 border-white shadow-lg text-white flex items-center justify-center animate-bounce">
              <Train className="w-5 h-5" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-emerald-700 text-white font-mono text-[9px] font-bold shadow-xs whitespace-nowrap">
              {ghostNode.name}
            </span>
            <span className="text-[8px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
              ARRIVE 22:30 (HOTEL SECURED)
            </span>
          </div>
        )}

      </div>

      {/* Selected Node Real Graph Inspector Bar */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-poppins">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold font-mono text-[#181E4B]">
            {selectedNode.vertexId}
          </div>
          <div>
            <div className="font-bold text-[#181E4B] flex items-center gap-2">
              <span>{selectedNode.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white border border-slate-200 text-[#5E6282]">
                MCT: {selectedNode.mct}
              </span>
            </div>
            <div className="text-[#5E6282] text-[11px] mt-0.5">
              Window: {activeDisruption ? selectedNode.delayWindow : selectedNode.window} • Route: {selectedNode.origin} → {selectedNode.destination}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[#84829A] block uppercase font-mono">Current CPM Slack</span>
            <span className={`font-mono font-bold ${activeDisruption && selectedNode.status !== 'on_time' ? 'text-red-500' : 'text-emerald-600'}`}>
              {activeDisruption ? selectedNode.breachSlack : selectedNode.slack}
            </span>
          </div>

          <button
            onClick={onOpenSaga}
            className="px-4 py-2 rounded-xl bg-[#F1A501] hover:bg-[#e09900] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Resolve via Saga</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
        </>
      )}

    </div>
  );
}
