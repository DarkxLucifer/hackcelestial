import React, { useState } from 'react';
import { Plane, Train, Hotel, Footprints, Clock, AlertCircle, CheckCircle2, ChevronRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function ItineraryGraph({ itinerary, activeDisruption, onSelectNode }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  if (!itinerary || !itinerary.nodes) return null;

  const getNodeIcon = (node) => {
    if (node.type === 'reservation') return <Hotel className="w-5 h-5 text-voyare-coral" />;
    if (node.mode === 'flight') return <Plane className="w-5 h-5 text-sky-500" />;
    if (node.mode === 'train') return <Train className="w-5 h-5 text-emerald-500" />;
    return <Footprints className="w-5 h-5 text-voyare-slate" />;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delayed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30">DELAYED</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-600 border border-red-500/30">CANCELLED</span>;
      case 'missed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-600 border border-red-500/30">MISSED CONNECTION</span>;
      case 'at_risk':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-600 border border-orange-500/30">CHECK-IN AT RISK</span>;
      case 'rebooked':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 border border-purple-500/30">REBOOKED / RESOLVED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">CONFIRMED</span>;
    }
  };

  const selectedNode = itinerary.nodes.find(n => n.id === selectedNodeId) || itinerary.nodes[0];

  return (
    <section id="itinerary" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-voyare-coral/10 text-voyare-coral text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spatio-Temporal Knowledge Graph</span>
          </div>
          <h2 className="font-volkhov text-3xl sm:text-4xl md:text-5xl font-bold text-voyare-navy">
            Interconnected Multi-Modal TDAG
          </h2>
          <p className="font-poppins text-voyare-slate text-sm sm:text-base mt-3">
            Every booking is modeled as a vertex linked by Minimum Connection Times (MCT) and physical transfer buffers. 
            Real-time Critical Path Method (CPM) continuously measures available temporal slack.
          </p>
        </div>

        {/* TDAG Visual Pipeline Container */}
        <div className="voyare-glass-card rounded-[32px] p-6 lg:p-8 shadow-voyare-card border border-white">
          
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-voyare-navy font-poppins">
                {itinerary.title}
              </h3>
              <p className="text-xs text-voyare-slate mt-0.5">
                Total Budget: €{itinerary.total_cost} • Graph Entities: {itinerary.nodes.length} Vertices, {itinerary.edges.length} Dependency Edges
              </p>
            </div>

            {/* Slack Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-voyare-slate">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Positive Slack (&gt; 0m)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>Negative Slack (Breached)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Zero-Slack Anchor</span>
              </div>
            </div>
          </div>

          {/* Interactive Graph Node Strip */}
          <div className="mt-8 flex flex-col lg:flex-row items-stretch gap-3 overflow-x-auto pb-4">
            {itinerary.nodes.map((node, idx) => {
              const edge = itinerary.edges[idx];
              const isSelected = selectedNodeId === node.id;
              const isBreached = node.status === 'delayed' || node.status === 'missed' || node.status === 'at_risk';

              return (
                <React.Fragment key={node.id}>
                  {/* Node Card */}
                  <div
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      if (onSelectNode) onSelectNode(node);
                    }}
                    className={`flex-1 min-w-[220px] rounded-2xl p-4 transition-all cursor-pointer border ${
                      isSelected
                        ? 'ring-2 ring-voyare-coral bg-white shadow-xl scale-[1.02]'
                        : isBreached
                        ? 'bg-red-50/60 border-red-200 hover:border-red-300'
                        : 'bg-white/80 border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm">
                        {getNodeIcon(node)}
                      </div>
                      {getStatusBadge(node.status)}
                    </div>

                    <div className="font-poppins font-bold text-sm text-voyare-navy leading-snug line-clamp-1">
                      {node.name}
                    </div>

                    <div className="text-[11px] text-voyare-textMuted mt-1">
                      {node.carrier || "Ground Link"} • {node.service_number || "Direct"}
                    </div>

                    {/* Schedule times */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="text-[9px] uppercase text-voyare-slate font-sans">Start</div>
                        <div className="font-bold text-voyare-navy">{node.start_time}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <div className="text-right">
                        <div className="text-[9px] uppercase text-voyare-slate font-sans">End</div>
                        <div className={`font-bold ${node.details?.revised_end_time ? 'text-red-500 font-bold' : 'text-voyare-navy'}`}>
                          {node.details?.revised_end_time || node.end_time}
                        </div>
                      </div>
                    </div>

                    {/* Slack & Critical Attributes */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span className="text-voyare-slate">CPM Slack:</span>
                      <span className={`font-mono font-bold ${
                        node.slack_minutes < 0 ? 'text-red-500' : 'text-emerald-600'
                      }`}>
                        {node.slack_minutes > 0 ? `+${node.slack_minutes}m` : `${node.slack_minutes}m`}
                      </span>
                    </div>

                    {node.checkin_cutoff && (
                      <div className="mt-1.5 px-2 py-1 rounded bg-amber-50 text-[10px] text-amber-800 border border-amber-200/60 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>Cutoff: {node.checkin_cutoff} strict</span>
                      </div>
                    )}
                  </div>

                  {/* Inter-Node Edge Connector */}
                  {idx < itinerary.nodes.length - 1 && (
                    <div className="flex lg:flex-col items-center justify-center px-1 py-2">
                      <div className="flex lg:flex-col items-center gap-1">
                        <div className={`w-8 lg:w-0.5 h-0.5 lg:h-8 ${
                          edge?.is_breached ? 'bg-red-500 animate-pulse' : 'bg-slate-300'
                        }`} />
                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold whitespace-nowrap ${
                          edge?.is_breached 
                            ? 'bg-red-500 text-white shadow-sm' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {edge?.slack < 0 ? `-${Math.abs(edge.slack)}m BREACH` : `+${edge?.slack || 25}m buffer`}
                        </div>
                        <div className={`w-8 lg:w-0.5 h-0.5 lg:h-8 ${
                          edge?.is_breached ? 'bg-red-500 animate-pulse' : 'bg-slate-300'
                        }`} />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Deep Node Inspector Panel */}
          {selectedNode && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-50/90 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-voyare-coral tracking-wider">
                    Inspecting Vertex: {selectedNode.id}
                  </span>
                  {selectedNode.critical_anchor && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                      ZERO-SLACK CRITICAL ANCHOR
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-voyare-navy mt-0.5">
                  {selectedNode.name} ({selectedNode.origin || "Origin"} ➔ {selectedNode.destination || "Destination"})
                </h4>
                <p className="text-xs text-voyare-slate mt-0.5">
                  Type: {selectedNode.type} • MCT required: {selectedNode.mct_required}m • Fare: €{selectedNode.cost} • Earliest Start: {selectedNode.earliest_start || selectedNode.start_time} • Latest Start: {selectedNode.latest_start || selectedNode.start_time}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] uppercase text-voyare-slate font-bold">Policy & Flexibility</div>
                  <div className="text-xs text-voyare-navy font-semibold">
                    {selectedNode.cancellation_deadline || "Standard Fare Rules"}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const simSection = document.querySelector('#simulator');
                    if (simSection) simSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-voyare-navy text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Inject Disruption on Node
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
