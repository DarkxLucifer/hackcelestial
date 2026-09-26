import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, ShieldCheck, Zap, ArrowLeft, ArrowRight, 
  RotateCcw, CheckCircle2, Clock, Train, Plane, Building2, 
  FileText, Shield, Sparkles, AlertCircle, Compass, HelpCircle,
  MessageSquare, UploadCloud, ChevronRight, DollarSign, RefreshCw,
  Search, Link2, Check, Radio, Bus, Navigation
} from 'lucide-react';
import DemoJourneyGraph from '../components/DemoJourneyGraph';
import DisruptionChatbot from './DisruptionChatbot';
import RefundPolicyModal from './RefundPolicyModal';
import MultiModalTravelTool from './MultiModalTravelTool';

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
  // Booking connection state (Real website: default false unless synced)
  const [hasVoyageBooking, setHasVoyageBooking] = useState(false);
  const [voyagePnrInput, setVoyagePnrInput] = useState('');
  const [isLinkingBooking, setIsLinkingBooking] = useState(false);

  // Chatbot states
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [hasEndedChat, setHasEndedChat] = useState(false);
  
  // Structured Disruption Record
  const [disruptedTicket, setDisruptedTicket] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState('plan_b');

  // Multi-Modal Travel Radar expand/collapse
  const [showTravelRadar, setShowTravelRadar] = useState(true);

  // Refund policy modal state
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundModalData, setRefundModalData] = useState(null);
  const [filedReceipt, setFiledReceipt] = useState(null);

  // Fetch recent disruption from database on load
  useEffect(() => {
    fetchLatestDisruption();
  }, []);

  const fetchLatestDisruption = async () => {
    try {
      const res = await fetch('/api/disruptions/external');
      const data = await res.json();
      if (data && data.disruptions && data.disruptions.length > 0) {
        setDisruptedTicket(data.disruptions[0]);
      }
    } catch (e) {
      console.warn("Could not fetch disruptions from database:", e);
    }
  };

  // Link Voyage Booking Handler
  const handleLinkVoyageBooking = (e) => {
    e.preventDefault();
    if (!voyagePnrInput.trim()) return;
    setIsLinkingBooking(true);
    setTimeout(() => {
      setHasVoyageBooking(true);
      setIsLinkingBooking(false);
    }, 600);
  };

  // Pareto Recovery Plans for Ingested Ticket
  const getDynamicPlans = () => {
    const carrier = disruptedTicket?.carrier || "Air India";
    const origin = disruptedTicket?.origin || "Mumbai (BOM)";
    const dest = disruptedTicket?.destination || "Delhi (DEL)";

    return [
      {
        id: "plan_a",
        title: "PLAN A: MINIMUM COST (CARRIER REBOOKING)",
        badge: "₹0 OUT-OF-POCKET",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        costDelta: "₹0 extra fee",
        timeDelta: "Next Morning (+6h 40m)",
        riskScore: "Downstream Hotel Delay",
        description: `Automatic rebooking on next scheduled flight with ${carrier}. Late arrival notice dispatched to destination lodge. Trade-off: Arrives next morning.`,
        steps: [
          `Rebooking on next available ${carrier} departure`,
          "Destination hotel notified of delayed arrival",
          "Airline delay refreshment vouchers claimed under DGCA"
        ]
      },
      {
        id: "plan_b",
        title: "PLAN B: FASTEST MULTI-MODAL RECOVERY",
        badge: "RECOMMENDED (₹2,850 EXTRA)",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
        costDelta: "₹2,850 recovery cost",
        timeDelta: "Tonight 23:15 (~9h 25m saved)",
        riskScore: "Protected Check-in",
        description: `Early alternative flight secured from ${origin} + Vande Bharat Express rail bridge. Hotel check-in extended until 23:59 midnight guarantee.`,
        steps: [
          `Alternative confirmed departure secured from ${origin}`,
          `Direct express rail connection to ${dest}`,
          "Destination hotel check-in preserved tonight"
        ]
      },
      {
        id: "plan_c",
        title: "PLAN C: EXECUTIVE PRIVATE RECOVERY",
        badge: "DOOR-TO-DOOR (₹6,900 EXTRA)",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        costDelta: "₹6,900 additional cost",
        timeDelta: "Tonight 22:10 (~10h 30m saved)",
        riskScore: "Zero Layover Friction",
        description: `Alternative direct flight + private chauffeured inter-city express transfer directly to hotel with dedicated luggage concierge.`,
        steps: [
          "Priority alternative flight departure",
          "Dedicated private executive sedan at arrival terminal",
          "Door-to-door luggage handling and concierge check-in"
        ]
      }
    ];
  };

  const currentPlans = getDynamicPlans();

  const handleExecuteSelectedPlan = () => {
    const chosen = currentPlans.find(p => p.id === selectedPlanId) || currentPlans[1];
    if (onOpenSaga) {
      onOpenSaga({
        title: chosen.title,
        cost: chosen.costDelta,
        description: chosen.description
      });
    }
  };

  const handleOpenRefundModal = (customData = null) => {
    const dataToUse = customData || disruptedTicket || {
      pnr: "VY-88294-IN",
      carrier: "IndiGo",
      service_number: "6E 521",
      origin: "Mumbai (BOM)",
      destination: "Delhi (DEL)",
      delay_minutes: 210,
      ticket_cost: 6450,
      is_cancellation: false,
      disruption_reason: "Operational delay exceeding 3 hours"
    };

    setRefundModalData(dataToUse);
    setIsRefundModalOpen(true);
  };

  const handleTicketProcessed = (record) => {
    setDisruptedTicket(record);
  };

  const handleEndChat = (record) => {
    if (record) {
      setDisruptedTicket(record);
    }
    setHasEndedChat(true);
    setIsChatMinimized(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#181E4B] font-poppins pt-28 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Top Header / Minimal Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between pb-5 border-b border-slate-200/60 gap-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#5E6282] hover:text-[#181E4B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => onNavigate('/booking')}
            className="text-xs font-semibold text-[#5E6282] hover:text-[#181E4B] transition-colors cursor-pointer"
          >
            Bookings
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-bold text-[#A35645]">Disruption Resolver</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Statutory Refund Rights Evaluation Button */}
          <button
            onClick={() => handleOpenRefundModal()}
            className="text-xs font-mono text-[#A35645] bg-[#A35645]/10 hover:bg-[#A35645]/20 px-3.5 py-1.5 rounded-full border border-[#A35645]/20 flex items-center gap-1.5 font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A35645]" />
            <span>DGCA &amp; EU261 REFUND RIGHTS</span>
          </button>
        </div>
      </div>

      {/* Main Page Title */}
      <div className="mt-8 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F1A501]" />
            <span>Autonomous Travel Resilience &amp; Multi-Modal Rerouting</span>
          </div>
          <h1 className="font-volkhov font-bold text-3xl sm:text-4xl text-[#181E4B]">
            Disruption &amp; Dispute Resolver
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6282] mt-1 max-w-2xl leading-relaxed">
            Multi-modal topological slack analysis, real-time telemetry (AviationStack, RailRadar, GTFS, redBus), and automated statutory passenger refunds.
          </p>
        </div>

        {/* Sync Existing Voyage PNR */}
        <div className="flex items-center gap-2">
          {!hasVoyageBooking ? (
            <form onSubmit={handleLinkVoyageBooking} className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
              <input
                type="text"
                value={voyagePnrInput}
                onChange={(e) => setVoyagePnrInput(e.target.value)}
                placeholder="Sync PNR (e.g. VY-9904)..."
                className="text-xs px-3 py-2 bg-transparent focus:outline-none w-44 font-mono text-[#181E4B]"
              />
              <button
                type="submit"
                disabled={isLinkingBooking || !voyagePnrInput.trim()}
                className="px-3 py-2 rounded-xl text-xs font-googleSans font-bold text-white bg-[#181E4B] hover:bg-[#232a68] disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{isLinkingBooking ? "Syncing..." : "Sync"}</span>
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-2xl text-xs font-mono font-bold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>LINKED: VY-9904-IN</span>
              <button
                onClick={() => setHasVoyageBooking(false)}
                className="text-slate-400 hover:text-slate-600 ml-1.5 underline cursor-pointer text-[10px]"
              >
                Unlink
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FRESH VISITOR VIEW (No Booking Synced Yet)                            */}
      {/* Pure Minimal Design: AI Travel Concierge with Voice, Document Upload, & Tools */}
      {/* ========================================================================= */}
      {!hasVoyageBooking && !hasEndedChat && (
        <div className="space-y-6">
          
          {/* Minimal Guidance Strip */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/70 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#A35645] font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>AI DISRUPTION CONCIERGE &bull; DUAL-PROVIDER (GROQ + GEMINI)</span>
              </div>
              <p className="text-xs text-[#5E6282] mt-1 max-w-2xl leading-relaxed">
                Describe your flight delay, speak using the microphone, or upload your ticket file (PDF / Image). The agent automatically evaluates downstream connection risks and calculates your refund under DGCA &amp; EU261.
              </p>
            </div>

            {disruptedTicket && (
              <button
                onClick={() => handleEndChat(disruptedTicket)}
                className="shrink-0 px-4 py-2.5 rounded-2xl font-googleSans font-bold text-xs text-white bg-[#181E4B] hover:bg-[#232a68] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Dispute Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* AI Disruption Chatbot */}
          <DisruptionChatbot
            isOpen={true}
            isMinimized={isChatMinimized}
            onMinimize={() => setIsChatMinimized(true)}
            onRestore={() => setIsChatMinimized(false)}
            onEndChat={handleEndChat}
            onTicketProcessed={handleTicketProcessed}
            onCheckRefundPolicy={handleOpenRefundModal}
            t={t}
          />

          {/* Real-time Multi-Modal Travel Radar Tool */}
          <MultiModalTravelTool />

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DISPUTE MANAGEMENT DASHBOARD                                          */}
      {/* Renders when PNR is linked OR after Ticket Ingestion / Ending Chat        */}
      {/* ========================================================================= */}
      {(hasVoyageBooking || hasEndedChat || (disruptedTicket && isChatMinimized)) && (
        <div className="space-y-6">
          
          {/* High-Priority Disruption Alert Bar */}
          <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200/80 text-amber-950 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-2xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-amber-900">
                    Disruption Detected: {disruptedTicket?.carrier || "IndiGo"} ({disruptedTicket?.service_number || "6E 521"})
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200/80 text-amber-900">
                    STRUCTURED IN DB
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Operational delay of <strong className="font-semibold">+{disruptedTicket?.delay_minutes || 210} mins</strong> on {disruptedTicket?.origin || "Mumbai (BOM)"} ➔ {disruptedTicket?.destination || "Delhi (DEL)"}.
                  Downstream transfer margin breached. Evaluated under DGCA CAR Section 3 &amp; EU261.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => handleOpenRefundModal(disruptedTicket)}
                className="px-3.5 py-2 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300/80 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Check Refund Policy</span>
              </button>
              <button
                onClick={handleExecuteSelectedPlan}
                className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#181E4B] hover:bg-[#232a68] shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                Execute Recovery Plan
              </button>
            </div>
          </div>

          {/* Grid: Google Maps / TDAG Visualizer (Left) + Recovery Plans (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Journey Visualizer */}
            <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/70 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-volkhov font-bold text-lg text-[#181E4B]">
                    Interactive Journey Visualizer
                  </h3>
                  <p className="text-xs text-[#5E6282]">
                    Google Maps Basemap &amp; Topological Graph showing connection slacks and rerouting paths.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  CARTO / TDAG ENGINE
                </span>
              </div>

              {/* Live Map / TDAG Component */}
              <DemoJourneyGraph
                itinerary={itinerary}
                activeDisruption={activeDisruption || {
                  node_id: "node_flight_1",
                  delay_minutes: disruptedTicket?.delay_minutes || 210,
                  reason: disruptedTicket?.disruption_reason || "Flight schedule delay"
                }}
                onSimulateAlpine={onSimulateAlpine}
                onOpenSaga={onOpenSaga}
                t={t}
              />

              {/* Ingested Ticket Record Pill */}
              {disruptedTicket && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-[#181E4B] pb-1.5 border-b border-slate-200/70">
                    <span className="flex items-center gap-1.5 font-poppins">
                      <FileText className="w-3.5 h-3.5 text-[#A35645]" />
                      <span>Ingested Ticket Record (SQLite)</span>
                    </span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      RECORD #{disruptedTicket.id || 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                    <div>Carrier: <strong className="text-slate-900">{disruptedTicket.carrier} ({disruptedTicket.service_number})</strong></div>
                    <div>Route: <strong className="text-slate-900">{disruptedTicket.origin} ➔ {disruptedTicket.destination}</strong></div>
                    <div>Recorded Fare: <strong className="text-slate-900">₹{disruptedTicket.ticket_cost || 6450} INR</strong></div>
                    <div>Delay: <strong className="text-amber-800">+{disruptedTicket.delay_minutes || 210} mins</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Recovery Plans */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/70 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-volkhov font-bold text-lg text-[#181E4B]">
                      Pareto Recovery Alternatives
                    </h3>
                    <p className="text-xs text-[#5E6282]">
                      Optimal trade-offs between recovery speed, cost, and comfort.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#A35645] bg-[#A35645]/10 px-2.5 py-0.5 rounded-full shrink-0">
                    {currentPlans.length} Validated Plans
                  </span>
                </div>

                <div className="space-y-3">
                  {currentPlans.map((p) => {
                    const isSelected = selectedPlanId === p.id;
                    const isRecommended = p.id === 'plan_b';
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlanId(p.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-[#181E4B] bg-slate-50/90 shadow-2xs ring-1 ring-[#181E4B]/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {isRecommended && (
                          <div className="absolute -top-2.5 right-4 bg-[#A35645] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                            BEST RECOMMENDED PLAN
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-1 pt-0.5">
                          <span className="font-bold text-xs sm:text-sm text-[#181E4B]">
                            {p.title}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                            {p.badge}
                          </span>
                        </div>

                        <p className="text-xs text-[#5E6282] leading-relaxed mb-2.5">
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
                            <span className="text-slate-400">Impact: </span>
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
                  className="mt-4 w-full py-3 rounded-2xl font-googleSans font-bold text-xs sm:text-sm text-white bg-[#181E4B] hover:bg-[#232a68] shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Execute Selected Recovery with Agentic Saga</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Refund Card */}
              <div className="bg-gradient-to-r from-emerald-950 to-[#072422] text-white p-5 rounded-3xl shadow-2xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DGCA &amp; AIRLINE REFUND GUARANTEE</span>
                </div>
                <h4 className="font-volkhov font-bold text-base sm:text-lg text-white">
                  Eligible for Full Refund &amp; Statutory Compensation?
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Under DGCA CAR Section 3 &amp; EU261, delays exceeding 3 hours or unnotified cancellations qualify for 100% fare recovery plus up to ₹5,000 statutory compensation.
                </p>
                <button
                  onClick={() => handleOpenRefundModal(disruptedTicket)}
                  className="w-full py-2 rounded-xl font-googleSans font-bold text-xs text-emerald-950 bg-emerald-300 hover:bg-emerald-200 transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  <span>Evaluate Statutory Claim Packet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Real-time Multi-Modal Travel Radar Tool */}
          <MultiModalTravelTool />

        </div>
      )}

      {/* Floating Voyage Logo in Bottom Right Corner ("bottom right crack") */}
      {/* Minimized chatbot widget that allows re-opening anytime */}
      {isChatMinimized && (
        <DisruptionChatbot
          isOpen={false}
          isMinimized={true}
          onMinimize={() => setIsChatMinimized(true)}
          onRestore={() => {
            setHasEndedChat(false);
            setIsChatMinimized(false);
          }}
          onEndChat={handleEndChat}
          onTicketProcessed={handleTicketProcessed}
          onCheckRefundPolicy={handleOpenRefundModal}
          t={t}
        />
      )}

      {/* Refund Policy Popup / Modal */}
      <RefundPolicyModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        ticketData={refundModalData}
        onClaimFiled={(receipt) => setFiledReceipt(receipt)}
        t={t}
      />

    </div>
  );
}
