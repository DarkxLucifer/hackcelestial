import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, ShieldCheck, Zap, ArrowLeft, ArrowRight, 
  RotateCcw, CheckCircle2, Clock, Train, Plane, Building2, 
  FileText, Shield, Sparkles, AlertCircle, Compass, HelpCircle,
  MessageSquare, UploadCloud, ChevronRight, DollarSign, RefreshCw
} from 'lucide-react';
import DemoJourneyGraph from '../components/DemoJourneyGraph';
import DisruptionChatbot from './DisruptionChatbot';
import RefundPolicyModal from './RefundPolicyModal';

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
  // Mode: 'voyage' (internal website booking) vs 'external' (third-party ticket)
  const [bookingOrigin, setBookingOrigin] = useState('voyage');
  
  // Chatbot states
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [hasEndedChat, setHasEndedChat] = useState(false);
  
  // External ticket state (populated via AI chatbot or file upload)
  const [externalTicket, setExternalTicket] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState('plan_b');

  // Refund policy modal state
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundModalData, setRefundModalData] = useState(null);
  const [filedClaimReceipt, setFiledClaimReceipt] = useState(null);

  // Fetch recent external disruption from database if available
  useEffect(() => {
    fetchLatestExternalDisruption();
  }, []);

  const fetchLatestExternalDisruption = async () => {
    try {
      const res = await fetch('/api/disruptions/external');
      const data = await res.json();
      if (data && data.disruptions && data.disruptions.length > 0) {
        const latest = data.disruptions[0];
        setExternalTicket(latest);
      }
    } catch (e) {
      console.warn("Could not fetch external disruptions:", e);
    }
  };

  // Standard Pareto Plans for Voyage Booking
  const voyagePlans = [
    {
      id: "plan_a",
      title: "PLAN A: MINIMUM COST",
      badge: "₹0 EXTRA",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      costDelta: "₹0 out-of-pocket",
      timeDelta: "Tomorrow 08:40",
      riskScore: "2 bookings affected",
      description: "Airline rebooking on next available flight (Mumbai → Delhi) with hotel retention and rescheduled transfer. Trade-off: Arrives next morning and misses tonight's check-in window.",
      steps: [
        "Airline rebooking on next available flight",
        "Jaipur hotel reservation retained & late arrival notified",
        "Existing Jaipur transfer rescheduled (₹0 additional travel payment)"
      ]
    },
    {
      id: "plan_b",
      title: "PLAN B: FASTEST RECOVERY",
      badge: "RECOMMENDED RECOVERY (₹2,850 EXTRA)",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      costDelta: "₹2,850 additional cost",
      timeDelta: "Tonight 23:15 (~9h 25m saved)",
      riskScore: "Protected Check-in",
      description: "Flight + Rail Recovery: Earlier alternative flight secured + Delhi → Jaipur train connection found. Hotel check-in extended to 23:59.",
      steps: [
        "Earlier alternative flight secured (Mumbai → Delhi)",
        "Delhi → Jaipur train connection found & booked",
        "Hotel check-in extended to 23:59; Airport transfer adjusted"
      ]
    },
    {
      id: "plan_c",
      title: "PLAN C: COMFORT RECOVERY",
      badge: "MAXIMUM CONVENIENCE (₹6,900 EXTRA)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      costDelta: "₹6,900 additional cost",
      timeDelta: "Tonight 22:10 (~10h 30m saved)",
      riskScore: "Zero Train Transfer",
      description: "Private Road Recovery: Alternative flight + Private direct Delhi → Jaipur executive transfer with door-to-door luggage handling.",
      steps: [
        "Alternative Mumbai → Delhi flight secured",
        "Private Delhi → Jaipur transfer (door-to-door)",
        "Luggage handled throughout transfer; Hotel notified"
      ]
    }
  ];

  // Dynamic Plans for External Disrupted Ticket
  const externalPlans = [
    {
      id: "plan_a",
      title: "PLAN A: MINIMUM COST (CARRIER REBOOKING)",
      badge: "₹0 OUT-OF-POCKET",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      costDelta: "₹0 additional cost",
      timeDelta: "Next Morning (+6h 40m)",
      riskScore: "Downstream Hotel Delay",
      description: `Carrier rebooking on next available scheduled service for ${externalTicket?.carrier || "IndiGo"}. Late check-in waiver transmitted to destination lodge.`,
      steps: [
        `Rebooking on next available ${externalTicket?.carrier || "IndiGo"} departure`,
        "Downstream hotel notified of delayed morning arrival",
        "Complimentary airline refreshment vouchers claimed under DGCA"
      ]
    },
    {
      id: "plan_b",
      title: "PLAN B: FASTEST MULTI-MODAL RECOVERY (RECOMMENDED)",
      badge: "RECOMMENDED RECOVERY (₹2,850 EXTRA)",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      costDelta: "₹2,850 recovery cost",
      timeDelta: "Tonight 23:15 (~9h 25m saved)",
      riskScore: "Protected Check-in",
      description: "Alternative early flight hop secured + direct Vande Bharat rail connection to bypass airport choke points. Hotel check-in preserved tonight.",
      steps: [
        "Instant re-route on confirmed alternative flight departure",
        "Vande Bharat Express connection bridge pre-booked",
        "Hotel arrival guaranteed before 23:59 midnight cutoff"
      ]
    },
    {
      id: "plan_c",
      title: "PLAN C: EXECUTIVE PRIVATE TRANSFER",
      badge: "DOOR-TO-DOOR (₹6,900 EXTRA)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      costDelta: "₹6,900 additional cost",
      timeDelta: "Tonight 22:10 (~10h 30m saved)",
      riskScore: "Zero Layover Friction",
      description: "Chauffeured inter-city express transfer directly from arrival airport to destination hotel. Seamless luggage handling.",
      steps: [
        "Alternative flight to nearest transit hub",
        "Dedicated private sedan waiting at arrival terminal",
        "Zero train transit friction; Door-to-door concierge check-in"
      ]
    }
  ];

  const currentPlans = bookingOrigin === 'voyage' ? voyagePlans : externalPlans;

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
    const dataToUse = customData || (bookingOrigin === 'external' ? externalTicket : {
      pnr: "VY-9904-IN",
      carrier: "Air India",
      service_number: "AI 882",
      origin: "Mumbai (BOM)",
      destination: "Delhi (DEL)",
      delay_minutes: activeDisruption ? 45 : 195,
      ticket_cost: 6450,
      is_cancellation: false,
      disruption_reason: "ATC Ground Delay Program at BOM & Connection Breach"
    });

    setRefundModalData(dataToUse);
    setIsRefundModalOpen(true);
  };

  const handleTicketProcessed = (record) => {
    setExternalTicket(record);
  };

  const handleEndChat = (record) => {
    if (record) {
      setExternalTicket(record);
    }
    setHasEndedChat(true);
    setIsChatMinimized(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#181E4B] font-poppins pt-28 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#5E6282] hover:text-[#181E4B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voyage Home</span>
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => onNavigate('/booking')}
            className="text-xs font-semibold text-[#5E6282] hover:text-[#181E4B] transition-colors cursor-pointer"
          >
            My Bookings
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-bold text-[#A35645]">Disruption &amp; Dispute Resolver</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Statutory Refund Policy Check Button */}
          <button
            onClick={() => handleOpenRefundModal()}
            className="text-xs font-mono text-[#A35645] bg-[#A35645]/10 hover:bg-[#A35645]/20 px-3.5 py-1.5 rounded-full border border-[#A35645]/30 flex items-center gap-1.5 font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A35645]" />
            <span>CHECK REFUND POLICY &amp; RIGHTS</span>
          </button>
        </div>
      </div>

      {/* Main Title & Mode Selector */}
      <div className="mt-8 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F1A501]" />
            <span>Autonomous Multi-Modal Dispute &amp; Recovery Engine</span>
          </div>
          <h1 className="font-volkhov font-bold text-3xl sm:text-4xl text-[#181E4B]">
            Autonomous Disruption Resolver
          </h1>
          <p className="text-sm text-[#5E6282] mt-1 max-w-2xl">
            Real-time topological recovery and statutory passenger rights enforcement for flight delays, missed rail connections, and cancellations.
          </p>
        </div>

        {/* Source Toggle: Booked with Voyage vs External / Offline Ticket */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => {
              setBookingOrigin('voyage');
              setIsChatMinimized(true);
            }}
            className={`px-4 py-2.5 rounded-xl font-googleSans text-xs font-bold transition-all cursor-pointer ${
              bookingOrigin === 'voyage'
                ? 'bg-white text-[#181E4B] shadow-sm'
                : 'text-[#5E6282] hover:text-[#181E4B]'
            }`}
          >
            Booked with Voyage (Direct Sync)
          </button>
          <button
            onClick={() => {
              setBookingOrigin('external');
              setIsChatMinimized(false);
            }}
            className={`px-4 py-2.5 rounded-xl font-googleSans text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              bookingOrigin === 'external'
                ? 'bg-white text-[#181E4B] shadow-sm'
                : 'text-[#5E6282] hover:text-[#181E4B]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#A35645]" />
            <span>External Ticket (AI Concierge)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. EXTERNAL TICKET CHATBOT VIEW (If External and Chat is Active) */}
      {/* ========================================================================= */}
      {bookingOrigin === 'external' && !hasEndedChat && !isChatMinimized && (
        <div className="mb-10">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Have a disrupted external ticket?</strong> Type below, click the microphone for voice chat, or upload your ticket file (PDF/Image). Voyage will parse it and store it into the secure dispute database.
              </span>
            </div>
            <button
              onClick={() => handleEndChat(externalTicket)}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 underline whitespace-nowrap cursor-pointer"
            >
              Skip Chat &amp; View Plans →
            </button>
          </div>

          <DisruptionChatbot
            isOpen={true}
            isMinimized={false}
            onMinimize={() => setIsChatMinimized(true)}
            onRestore={() => setIsChatMinimized(false)}
            onEndChat={handleEndChat}
            onTicketProcessed={handleTicketProcessed}
            onCheckRefundPolicy={handleOpenRefundModal}
            t={t}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DISPUTE MANAGEMENT DASHBOARD (Default Voyage or External Post-Chat) */}
      {/* ========================================================================= */}
      {(bookingOrigin === 'voyage' || hasEndedChat || isChatMinimized) && (
        <>
          {/* Quick Simulation Bar (Only in Voyage mode) */}
          {bookingOrigin === 'voyage' && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-[#5E6282]">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Simulate flight delay to verify downstream cascade ripple and recovery:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSimulateAlpine({
                    node_id: "node_flight_1",
                    delay_minutes: 45,
                    is_cancellation: false,
                    reason: "Air Traffic Control Ground Delay Program at BOM (+45m)"
                  })}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#A35645] hover:bg-[#b8614e] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Simulate BOM Delay (+45m)</span>
                </button>

                {activeDisruption && (
                  <button
                    onClick={onResetDisruption}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-300 hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Nominal Schedule</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* HIGH-PRIORITY DISRUPTION ALERT BANNER */}
          {bookingOrigin === 'external' ? (
            /* External Disruption Alert */
            <div className="mb-8 p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-amber-900">
                      Disrupted External Ticket: {externalTicket?.carrier || "IndiGo"} ({externalTicket?.service_number || "6E 521"})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-800">
                      STORED IN DATABASE
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Schedule Delay of <strong className="font-bold">+{externalTicket?.delay_minutes || 210} minutes</strong> on {externalTicket?.origin || "Mumbai (BOM)"} → {externalTicket?.destination || "Delhi (DEL)"}.
                    Downstream connection margin is depleted. Evaluated under DGCA CAR Section 3 statutory rules.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => handleOpenRefundModal(externalTicket)}
                  className="px-4 py-2 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Check Refund (₹{externalTicket?.rights_evaluation?.total_claim?.toLocaleString() || "11,450"})</span>
                </button>
                <button
                  onClick={handleExecuteSelectedPlan}
                  className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#181E4B] hover:bg-[#232a68] shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  Execute Best Recovery
                </button>
              </div>
            </div>
          ) : activeDisruption ? (
            /* Voyage Active Disruption Alert */
            <div className="mb-8 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-rose-900">
                      Critical Disruption Detected on Leg 1
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-200 text-rose-800">
                      SEVERITY: CASCADE BREACH
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                    Air India AI 882 delayed by <span className="font-bold">+45 minutes</span>.
                    Downstream connection margin at Delhi Airport to New Delhi Railway station is reduced to <span className="font-bold">10 minutes</span>, risking a missed connection on Vande Bharat Express to Jaipur.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => handleOpenRefundModal()}
                  className="px-4 py-2 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Check Refund Policy</span>
                </button>
                <button
                  onClick={handleExecuteSelectedPlan}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  Execute 1-Click Recovery Plan
                </button>
              </div>
            </div>
          ) : (
            /* Nominal Schedule Bar */
            <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-sm">Nominal Schedule Active (Mumbai → Delhi → Jaipur)</span>
                  <p className="text-xs text-emerald-700">All connections have positive slack buffers. Zero cascade risks detected.</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full shrink-0">
                SLACK: SECURED
              </span>
            </div>
          )}

          {/* Grid: Journey Map Visualizer (Left) + Pareto Recovery Plans (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Map & Topological Visualizer */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-volkhov font-bold text-xl text-[#181E4B]">
                    Interactive Journey Visualizer
                  </h3>
                  <p className="text-xs text-[#5E6282]">
                    Google Maps Carto Basemap &amp; Topological Graph showing critical paths and connection slack.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {bookingOrigin === 'external' ? 'EXTERNAL RE-ROUTE' : 'VOYAGE TDAG v2.5'}
                </span>
              </div>

              {/* Map & Topological View */}
              <DemoJourneyGraph
                itinerary={itinerary}
                activeDisruption={activeDisruption || (bookingOrigin === 'external' ? {
                  node_id: "node_flight_1",
                  delay_minutes: externalTicket?.delay_minutes || 210,
                  reason: externalTicket?.disruption_reason || "External flight delay"
                } : null)}
                onSimulateAlpine={onSimulateAlpine}
                onOpenSaga={onOpenSaga}
                t={t}
              />

              {/* External Ticket Manifest Details (if external) */}
              {bookingOrigin === 'external' && externalTicket && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between font-bold text-[#181E4B] pb-2 border-b border-slate-200">
                    <span className="flex items-center gap-1.5 font-poppins">
                      <FileText className="w-4 h-4 text-[#A35645]" />
                      <span>Ingested Ticket Record</span>
                    </span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      DB RECORD #{externalTicket.id || 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>Carrier: <strong className="text-slate-900">{externalTicket.carrier}</strong></div>
                    <div>Flight: <strong className="text-slate-900">{externalTicket.service_number}</strong></div>
                    <div>Route: <strong className="text-slate-900">{externalTicket.origin} → {externalTicket.destination}</strong></div>
                    <div>Recorded Fare: <strong className="text-slate-900">₹{externalTicket.ticket_cost || 6450} INR</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Recovery Plans */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-volkhov font-bold text-lg text-[#181E4B]">
                      {bookingOrigin === 'external' ? 'Optimized Recovery Plans' : 'Pareto Recovery Alternatives'}
                    </h3>
                    <p className="text-xs text-[#5E6282]">
                      Algorithmic alternatives balanced between cost, recovery speed, and comfort.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#A35645] bg-[#A35645]/10 px-2.5 py-1 rounded-full shrink-0">
                    {currentPlans.length} Validated Plans
                  </span>
                </div>

                {/* Plans List */}
                <div className="space-y-3.5">
                  {currentPlans.map((p) => {
                    const isSelected = selectedPlanId === p.id;
                    const isRecommended = p.id === 'plan_b';
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlanId(p.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-[#181E4B] bg-slate-50/90 shadow-sm ring-1 ring-[#181E4B]/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {isRecommended && (
                          <div className="absolute -top-2.5 right-4 bg-[#A35645] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            BEST RECOMMENDED PLAN
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-1.5 pt-0.5">
                          <span className="font-bold text-sm text-[#181E4B]">
                            {p.title}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                            {p.badge}
                          </span>
                        </div>

                        <p className="text-xs text-[#5E6282] leading-relaxed mb-3">
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
                  className="mt-5 w-full py-3.5 rounded-2xl font-googleSans font-bold text-sm text-white bg-[#181E4B] hover:bg-[#232a68] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Execute Selected Recovery with Agentic Saga</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Refund Card */}
              <div className="bg-gradient-to-r from-emerald-900 to-[#072422] text-white p-6 rounded-3xl shadow-md space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>DGCA &amp; AIRLINE REFUND GUARANTEE</span>
                </div>
                <h4 className="font-volkhov font-bold text-xl text-white">
                  Eligible for Full Refund &amp; Cash Compensation?
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Under DGCA CAR Section 3 &amp; EU261, delays exceeding 3 hours or unnotified cancellations qualify for 100% fare recovery plus up to ₹5,000 statutory compensation.
                </p>
                <button
                  onClick={() => handleOpenRefundModal()}
                  className="w-full py-2.5 rounded-xl font-googleSans font-bold text-xs text-emerald-950 bg-emerald-300 hover:bg-emerald-200 transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <span>Evaluate Statutory Claim Packet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </>
      )}

      {/* Floating Voyage Logo in Bottom Right Corner ("bottom right crack") */}
      {/* Appears when chatbot is minimized, so user can re-open chat at any time */}
      {isChatMinimized && (
        <DisruptionChatbot
          isOpen={false}
          isMinimized={true}
          onMinimize={() => setIsChatMinimized(true)}
          onRestore={() => {
            setBookingOrigin('external');
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
        onClaimFiled={(receipt) => setFiledClaimReceipt(receipt)}
        t={t}
      />

    </div>
  );
}
