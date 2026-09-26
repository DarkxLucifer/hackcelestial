import React, { useState, useEffect, useRef } from 'react';
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
import RecoveryPlanCards from './RecoveryPlanCards';

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
  
  // Real Ingested Disruption Record (null if no dispute occurred)
  const [disruptedTicket, setDisruptedTicket] = useState(null);

  // File upload ref for uploading other tickets from active view
  const pageFileInputRef = useRef(null);
  const [isPageUploading, setIsPageUploading] = useState(false);

  // Refund policy modal state
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundModalData, setRefundModalData] = useState(null);
  const [filedReceipt, setFiledReceipt] = useState(null);

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
      disruption_reason: "Operational schedule delay"
    };

    setRefundModalData(dataToUse);
    setIsRefundModalOpen(true);
  };

  const handleTicketProcessed = (record) => {
    setDisruptedTicket(record);
    // Smoothly minimize chatbot into "Contact Us" pill and directly scroll to connection map
    setIsChatMinimized(true);
    setTimeout(() => {
      const mapElement = document.getElementById('connection-map-section');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handlePageMultiFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsPageUploading(true);
    let lastRecord = null;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/ai/upload-document', {
          method: 'POST',
          body: formData
        });
        const resData = await response.json();
        if (resData.structured_data) {
          lastRecord = resData.structured_data;
        }
      } catch (err) {
        console.error("Multi upload error:", err);
      }
    }

    if (lastRecord) {
      handleTicketProcessed(lastRecord);
    }
    setIsPageUploading(false);
    if (pageFileInputRef.current) pageFileInputRef.current.value = '';
  };

  const handleEndChat = (record) => {
    if (record) {
      setDisruptedTicket(record);
    }
    setHasEndedChat(true);
    setIsChatMinimized(true);
  };

  const handleExecutePlan = (planKey) => {
    if (onOpenSaga) {
      const planNames = {
        plan_a: { title: "PLAN A: Airline Rebooking", cost: "₹0 out-of-pocket" },
        plan_b: { title: "PLAN B: Flight + Rail Recovery", cost: "₹2,850 additional cost" },
        plan_c: { title: "PLAN C: Private Road Recovery", cost: "₹6,900 additional cost" }
      };
      const p = planNames[planKey] || planNames.plan_b;
      onOpenSaga({
        title: p.title,
        cost: p.cost,
        description: "Executing automated multi-modal recovery via Agentic Saga."
      });
    }
  };

  // Condition: Has a dispute or disruption actually occurred?
  const isDisputeActive = Boolean(activeDisruption || disruptedTicket);

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

        {/* Sync Existing Voyage PNR */}
        <div className="flex items-center gap-2">
          {!hasVoyageBooking ? (
            <form onSubmit={handleLinkVoyageBooking} className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
              <input
                type="text"
                value={voyagePnrInput}
                onChange={(e) => setVoyagePnrInput(e.target.value)}
                placeholder="Sync PNR (e.g. VY-9904)..."
                className="text-xs px-3 py-1.5 bg-transparent focus:outline-none w-44 font-mono text-[#181E4B]"
              />
              <button
                type="submit"
                disabled={isLinkingBooking || !voyagePnrInput.trim()}
                className="px-3 py-1.5 rounded-xl text-xs font-googleSans font-bold text-white bg-[#181E4B] hover:bg-[#232a68] disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
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
            Multi-modal connection analysis, live radar telemetry across flights, trains, metro and buses, and automated travel recovery.
          </p>
        </div>

        {/* Quick Simulation trigger for testing */}
        <div className="flex items-center gap-2">
          {!isDisputeActive ? (
            <button
              onClick={() => onSimulateAlpine({
                node_id: "node_flight_1",
                delay_minutes: 45,
                is_cancellation: false,
                reason: "Air Traffic Control Ground Delay Program at BOM (+45m)"
              })}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#A35645] hover:bg-[#b8614e] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Simulate BOM Delay (+45m)</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (onResetDisruption) onResetDisruption();
                setDisruptedTicket(null);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Disruption</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. NOMINAL STATE (NO DISPUTE OCCURRED)                                    */}
      {/* Minimal clean view: Multi-Modal Connection Radar + AI Concierge            */}
      {/* (NO plan suggestions or fake alerts shown when no dispute occurs)         */}
      {/* ========================================================================= */}
      {!isDisputeActive && (
        <div className="space-y-6">
          
          {/* AI Travel Assistant (Chat, Voice, Document Dropzone) */}
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

          {/* Multi-Modal Connection Radar (Shows all options clearly) */}
          <MultiModalTravelTool />

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DISPUTE ACTIVE STATE (A DISPUTE / DELAY HAS OCCURRED)                   */}
      {/* Displays: Disruption Alert -> Interactive Graph -> RECOVERY PLANS BELOW   */}
      {/* ========================================================================= */}
      {isDisputeActive && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* High-Priority Disruption Alert Bar */}
          <div className="p-5 rounded-3xl bg-amber-50/90 border border-amber-200/90 text-amber-950 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-amber-900">
                    Disruption Detected: {disruptedTicket?.carrier || "Air India"} ({disruptedTicket?.service_number || "AI 882"})
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200/80 text-amber-900">
                    CASCADE RISK
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Operational delay of <strong className="font-semibold">+{disruptedTicket?.delay_minutes || (activeDisruption ? 45 : 210)} mins</strong> on {disruptedTicket?.origin || "Mumbai (BOM)"} ➔ {disruptedTicket?.destination || "Delhi (DEL)"}. Downstream connection window impacted.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setHasEndedChat(false);
                  setIsChatMinimized(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-xl font-bold text-xs text-[#181E4B] bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#181E4B]" />
                <span>Chat with Assistant</span>
              </button>

              <button
                onClick={() => pageFileInputRef.current?.click()}
                disabled={isPageUploading}
                className="px-3.5 py-2 rounded-xl font-bold text-xs text-purple-800 bg-purple-100 hover:bg-purple-200 border border-purple-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <UploadCloud className="w-3.5 h-3.5 text-purple-700" />
                <span>{isPageUploading ? "Uploading..." : "Upload Other Tickets"}</span>
              </button>

              <button
                onClick={() => handleOpenRefundModal(disruptedTicket)}
                className="px-3.5 py-2 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300/80 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Check Refund Policy</span>
              </button>
            </div>
          </div>

          {/* Hidden multi-file upload for uploading other tickets */}
          <input
            type="file"
            ref={pageFileInputRef}
            onChange={handlePageMultiFileUpload}
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            multiple
            className="hidden"
          />

          {/* SECTION 1: Interactive Connection Graph / Map */}
          <div id="connection-map-section" className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/70 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-volkhov font-bold text-xl text-[#181E4B]">
                  Interactive Journey Visualizer
                </h3>
                <p className="text-xs text-[#5E6282]">
                  Topological graph and Google Maps basemap showing slack buffers and critical connections.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                CARTO / TDAG ENGINE
              </span>
            </div>

            {/* Live Map / TDAG Component */}
            <DemoJourneyGraph
              itinerary={itinerary}
              disruptedTicket={disruptedTicket}
              activeDisruption={activeDisruption || {
                node_id: "node_flight_1",
                delay_minutes: disruptedTicket?.delay_minutes || 45,
                reason: disruptedTicket?.disruption_reason || "Flight schedule delay"
              }}
              onSimulateAlpine={onSimulateAlpine}
              onOpenSaga={onOpenSaga}
              t={t}
            />
          </div>

          {/* SECTION 2: PARETO RECOVERY PLANS (SHOWN BELOW GRAPH, EXACTLY AS IN IMAGE) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-volkhov font-bold text-2xl text-[#181E4B]">
                  Pareto Recovery Alternatives
                </h3>
                <p className="text-xs text-[#5E6282]">
                  Mathematical trade-offs between recovery cost, speed, and passenger comfort.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#A35645] bg-[#A35645]/10 px-3 py-1 rounded-full">
                3 Validated Recovery Plans
              </span>
            </div>

            {/* 3 Recovery Plan Cards from media_1790426191925.png */}
            <RecoveryPlanCards 
              onSelectPlan={handleExecutePlan}
              routeCorridor={disruptedTicket ? `${disruptedTicket.origin} → ${disruptedTicket.destination} → Jaipur` : "Mumbai → Delhi → Jaipur"}
            />
          </div>

          {/* Multi-Modal Connection Radar */}
          <div className="pt-4">
            <MultiModalTravelTool />
          </div>

        </div>
      )}

      {/* Floating AI Chatbot in Bottom Right Corner */}
      {/* If minimized: shows "AI Chatbot" pill matching media_1790441117824.jpg */}
      {/* If expanded: shows floating responsive AI concierge window */}
      {isDisputeActive && (
        <DisruptionChatbot
          isOpen={!isChatMinimized}
          isMinimized={isChatMinimized}
          isFloating={true}
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
