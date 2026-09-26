import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PeeledSheetPull from './components/PeeledSheetPull';
import AirplaneScrollPull from './components/AirplaneScrollPull';
import Hero from './components/Hero';
import ItineraryGraph from './components/ItineraryGraph';
import DisruptionSimulator from './components/DisruptionSimulator';
import BlastRadiusView from './components/BlastRadiusView';
import DominoRiskGauge from './components/DominoRiskGauge';
import PersonaWeightSliders from './components/PersonaWeightSliders';
import RecoveryComparison from './components/RecoveryComparison';
import PassengerRightsBridge from './components/PassengerRightsBridge';
import AgenticSagaModal from './components/AgenticSagaModal';
import Footer from './components/Footer';

import {
  fetchItinerary,
  simulateDisruption,
  fetchRecoveryPlans,
  commitRecoveryPlan,
  fetchPassengerRights,
  resetItinerary
} from './api';

export default function App() {
  const [itinerary, setItinerary] = useState(null);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [activeDisruption, setActiveDisruption] = useState(null);
  const [activeImpact, setActiveImpact] = useState(null);
  const [recoveryPlans, setRecoveryPlans] = useState([]);
  const [passengerRights, setPassengerRights] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Saga Modal state
  const [isSagaOpen, setIsSagaOpen] = useState(false);
  const [selectedPlanForSaga, setSelectedPlanForSaga] = useState(null);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const data = await fetchItinerary();
      if (data && data.itinerary) {
        setItinerary(data.itinerary);
        setRiskAnalysis(data.risk_analysis);
      } else {
        // Fallback demo state if backend not responding yet
        setItinerary({
          id: "itinerary_alpine_cascade",
          title: "The Alpine Expedition: London to Zermatt",
          traveler_name: "Elena Vance (Corporate / Leisure)",
          total_cost: 700.0,
          currency: "EUR",
          domino_risk_index: 48.2,
          nodes: [
            { id: "node_flight_1", name: "British Airways BA 712", type: "transport", mode: "flight", carrier: "British Airways", service_number: "BA 712", origin: "LHR", destination: "ZRH", start_time: "14:00", end_time: "16:45", duration_minutes: 165, cost: 240, status: "confirmed", slack_minutes: 45, mct_required: 45 },
            { id: "node_transfer_1", name: "Zurich Airport Transit Shuttle", type: "transport", mode: "walk", carrier: "Ground Link", service_number: "Air-Rail", origin: "ZRH T1", destination: "ZRH Rail", start_time: "17:15", end_time: "17:35", duration_minutes: 20, cost: 0, status: "confirmed", slack_minutes: 27, mct_required: 15 },
            { id: "node_train_1", name: "SBB InterCity IC 8", type: "transport", mode: "train", carrier: "SBB CFF FFS", service_number: "IC 8 #830", origin: "Zurich HB", destination: "Visp", start_time: "18:02", end_time: "20:02", duration_minutes: 120, cost: 98, status: "confirmed", slack_minutes: 8, mct_required: 10 },
            { id: "node_train_2", name: "Matterhorn Gotthard Bahn Regional", type: "transport", mode: "train", carrier: "MGB", service_number: "Reg 138", origin: "Visp", destination: "Zermatt", start_time: "20:10", end_time: "21:14", duration_minutes: 64, cost: 42, status: "confirmed", slack_minutes: 16, mct_required: 8 },
            { id: "node_hotel_1", name: "Boutique Hotel Matterhorn Lodge", type: "reservation", carrier: "Matterhorn Hospitality", service_number: "RES-88219", origin: "Zermatt", destination: "Zermatt", start_time: "20:30", end_time: "23:59", duration_minutes: 209, cost: 320, status: "confirmed", slack_minutes: 30, checkin_cutoff: "21:00", critical_anchor: true }
          ],
          edges: [
            { source_id: "node_flight_1", target_id: "node_transfer_1", slack: 30, min_connection_time: 30 },
            { source_id: "node_transfer_1", target_id: "node_train_1", slack: 27, min_connection_time: 20 },
            { source_id: "node_train_1", target_id: "node_train_2", slack: 8, min_connection_time: 8 },
            { source_id: "node_train_2", target_id: "node_hotel_1", slack: 16, min_connection_time: 15 }
          ]
        });
        setRiskAnalysis({
          domino_risk_index: 48.2,
          level: "MODERATE",
          color: "#F59E0B",
          advice: "Tight connections detected at Zurich and Visp. Hotel check-in closes at 21:00 strict."
        });
      }

      // Preload recovery plans
      const plansData = await fetchRecoveryPlans();
      if (plansData && plansData.plans) {
        setRecoveryPlans(plansData.plans);
      }

      // Preload rights data
      const rightsData = await fetchPassengerRights();
      if (rightsData) {
        setPassengerRights(rightsData);
      }
    } catch (e) {
      console.warn("Error loading initial data:", e);
    }
  };

  const handleSimulateDisruption = async (disruptionPayload) => {
    setIsSimulating(true);
    try {
      const res = await simulateDisruption(disruptionPayload);
      if (res) {
        setItinerary(res.itinerary);
        setActiveImpact(res.impact);
        setRiskAnalysis(res.risk_analysis);
        setActiveDisruption(disruptionPayload);
      } else {
        // Fallback local simulation if backend offline
        setActiveDisruption(disruptionPayload);
        const updatedNodes = itinerary.nodes.map(n => {
          if (n.id === disruptionPayload.node_id) {
            return { ...n, status: "delayed", slack_minutes: -10, details: { revised_end_time: "17:50" } };
          }
          if (n.id === "node_train_1") {
            return { ...n, status: "missed", slack_minutes: -18, details: { revised_start_time: "19:02" } };
          }
          if (n.id === "node_hotel_1") {
            return { ...n, status: "at_risk", details: { revised_start_time: "22:15" } };
          }
          return n;
        });
        setItinerary(prev => ({
          ...prev,
          nodes: updatedNodes,
          domino_risk_index: 99.0
        }));
        setActiveImpact({
          disrupted_node_id: disruptionPayload.node_id,
          delay_minutes: disruptionPayload.delay_minutes,
          blast_radius_node_ids: ["node_transfer_1", "node_train_1", "node_train_2", "node_hotel_1"],
          missed_connection_node_ids: ["node_train_1", "node_train_2"],
          at_risk_reservation_ids: ["node_hotel_1"],
          total_downstream_delay: 150,
          estimated_financial_loss: 418.0,
          domino_risk_index_before: 48.2,
          domino_risk_index_after: 99.0,
          summary: `Disruption on flight (+${disruptionPayload.delay_minutes}m) breached MCT buffer (-10m) and caused missed rail connections.`
        });
      }

      // Re-fetch optimal plans with the new disruption state
      const plansRes = await fetchRecoveryPlans();
      if (plansRes && plansRes.plans) {
        setRecoveryPlans(plansRes.plans);
      }

      // Re-fetch rights
      const rightsRes = await fetchPassengerRights();
      if (rightsRes) setPassengerRights(rightsRes);

      // Smooth scroll to impact section
      setTimeout(() => {
        const el = document.querySelector('#blast-radius');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = async () => {
    setActiveDisruption(null);
    setActiveImpact(null);
    await resetItinerary("alpine");
    await loadInitialData();
  };

  const handleUpdatePersonaWeights = async (weights) => {
    setIsOptimizing(true);
    try {
      const plansRes = await fetchRecoveryPlans(weights);
      if (plansRes && plansRes.plans) {
        setRecoveryPlans(plansRes.plans);
      }
    } catch (e) {
      console.warn("Failed updating persona weights:", e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleOpenSagaModal = (plan) => {
    setSelectedPlanForSaga(plan || recoveryPlans[1] || recoveryPlans[0]);
    setIsSagaOpen(true);
  };

  const handleCommitSuccess = async (plan) => {
    try {
      await commitRecoveryPlan(plan);
      setActiveDisruption(null);
      setActiveImpact(null);
      await loadInitialData();
    } catch (e) {
      console.warn("Commit error:", e);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#FAF9F6] text-voyare-navy font-poppins selection:bg-voyare-coral selection:text-white">
      
      {/* 1. Floating Pill Glassmorphic Navbar (appears on scroll) */}
      <Navbar
        activeDisruption={activeDisruption}
        onOpenSaga={() => handleOpenSagaModal(recoveryPlans[0])}
        onQuickSimulate={() => handleSimulateDisruption({
          node_id: "node_flight_1",
          delay_minutes: 65,
          is_cancellation: false,
          reason: "Air Traffic Control Ground Delay Program at LHR (+65m)"
        })}
      />

      {/* 2. Fullscreen Island & Airplane 3D Peeled Sheet Scroll Engine (matching reference images) */}
      <PeeledSheetPull
        activeDisruption={activeDisruption}
        onSimulateAlpine={() => handleSimulateDisruption({
          node_id: "node_flight_1",
          delay_minutes: 65,
          is_cancellation: false,
          reason: "Air Traffic Control Ground Delay Program at LHR (+65m)"
        })}
      >
        {/* Mission Telemetry & Active Trip Summary Card */}
        <Hero
          itinerary={itinerary}
          activeDisruption={activeDisruption}
          onSimulateAlpine={() => handleSimulateDisruption({
            node_id: "node_flight_1",
            delay_minutes: 65,
            is_cancellation: false,
            reason: "Air Traffic Control Ground Delay Program at LHR (+65m)"
          })}
          onOpenSaga={() => handleOpenSagaModal(recoveryPlans[0])}
        />

        {/* Spatio-Temporal Knowledge Graph & Critical Path Method Visualizer */}
        <ItineraryGraph
          itinerary={itinerary}
          activeDisruption={activeDisruption}
          onSelectNode={(node) => console.log("Selected node:", node)}
        />

        {/* Live Disruption Radar & Injection Simulator */}
        <DisruptionSimulator
          itinerary={itinerary}
          activeDisruption={activeDisruption}
          onSimulate={handleSimulateDisruption}
          onReset={handleReset}
          isSimulating={isSimulating}
        />

        {/* CPM Downstream Ripple Propagation & Blast Radius View */}
        <BlastRadiusView
          activeImpact={activeImpact}
          itinerary={itinerary}
          onReviewRecovery={() => {
            const el = document.querySelector('#recovery');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Domino Risk Index (DRI 0-100) Gauge */}
        <DominoRiskGauge
          riskAnalysis={riskAnalysis}
          itinerary={itinerary}
        />

        {/* Interactive Persona Multi-Objective Tuning Sliders */}
        <PersonaWeightSliders
          onUpdateWeights={handleUpdatePersonaWeights}
          isOptimizing={isOptimizing}
        />

        {/* Tri-Archetype Recovery Plan Framework & Visual Git-Diff Comparison */}
        <RecoveryComparison
          recoveryPlans={recoveryPlans}
          onSelectPlan={handleOpenSagaModal}
          activeDisruption={activeDisruption}
        />

        {/* Deterministic Statutory Passenger Rights & Parametric Liquidity Advance */}
        <PassengerRightsBridge
          passengerRights={passengerRights}
          onApplyLiquidity={() => handleOpenSagaModal(recoveryPlans[0])}
        />

        {/* Atomic Distributed Saga Orchestration Modal */}
        <AgenticSagaModal
          plan={selectedPlanForSaga}
          isOpen={isSagaOpen}
          onClose={() => setIsSagaOpen(false)}
          onCommitSuccess={handleCommitSuccess}
        />

        {/* Footer (matching user's specification) */}
        <Footer />
      </PeeledSheetPull>

    </div>
  );
}
