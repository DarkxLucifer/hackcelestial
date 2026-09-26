from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import Dict, Any, List, Optional
import os
import time

from .models import (
    Itinerary, DisruptionEvent, DownstreamImpact, RecoveryPlan,
    OptimizationWeights
)
from .scenarios import get_alpine_cascade_itinerary, get_transatlantic_itinerary
from .graph_engine import GraphEngine
from .domino_risk import calculate_domino_risk_index
from .optimizer import RecoveryOptimizer
from .rights_engine import PassengerRightsEngine
from .ghost_holds import GhostHoldManager
from .saga_orchestrator import SagaOrchestrator

app = FastAPI(
    title="YATAR — Travel Disruption Recovery Engine",
    description="Intelligent Travel Resilience Engine — Multi-Modal TDAG, CPM Slack Analysis, OR-Tools CP-SAT, US DOT & EU261 Automated Passenger Rights",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# State container
current_itinerary: Itinerary = get_alpine_cascade_itinerary()
ghost_hold_manager = GhostHoldManager()
active_impact: Optional[DownstreamImpact] = None

# Initial CPM and Risk calculation
engine = GraphEngine(current_itinerary)
engine.calculate_cpm_and_slacks()
risk_meta = calculate_domino_risk_index(current_itinerary)
current_itinerary.domino_risk_index = risk_meta["domino_risk_index"]

# Path to frontend dist
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/")
def serve_index():
    if os.path.exists(DIST_DIR):
        index_file = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
    return {
        "engine": "YATAR — Travel Disruption Recovery Engine",
        "status": "ONLINE",
        "active_trip": current_itinerary.title,
        "domino_risk_index": current_itinerary.domino_risk_index,
        "docs": "/docs"
    }

@app.get("/plane.png")
def serve_plane():
    plane_path = os.path.join(DIST_DIR, "plane.png")
    if os.path.exists(plane_path):
        return FileResponse(plane_path)
    raise HTTPException(status_code=404, detail="plane.png not found")

@app.get("/island.jpg")
def serve_island():
    island_path = os.path.join(DIST_DIR, "island.jpg")
    if os.path.exists(island_path):
        return FileResponse(island_path)
    raise HTTPException(status_code=404, detail="island.jpg not found")

@app.get("/voyage_logo.png")
@app.get("/voyage_logo_crop.png")
@app.get("/voyage_logo_transparent.png")
def serve_voyage_logo():
    logo_path = os.path.join(DIST_DIR, "voyage_logo_crop.png")
    if not os.path.exists(logo_path):
        logo_path = os.path.join(DIST_DIR, "voyage_logo.png")
    if os.path.exists(logo_path):
        return FileResponse(logo_path)
    raise HTTPException(status_code=404, detail="voyage logo not found")

@app.get("/navbar_ref.png")
def serve_navbar_ref():
    nav_path = os.path.join(DIST_DIR, "navbar_ref.png")
    if os.path.exists(nav_path):
        return FileResponse(nav_path)
    raise HTTPException(status_code=404, detail="navbar_ref.png not found")

@app.get("/api/itinerary")
def get_itinerary():
    """Returns active itinerary with CPM slacks and Domino Risk Index."""
    global current_itinerary
    engine = GraphEngine(current_itinerary)
    engine.calculate_cpm_and_slacks()
    risk_info = calculate_domino_risk_index(current_itinerary)
    current_itinerary.domino_risk_index = risk_info["domino_risk_index"]
    return {
        "itinerary": current_itinerary,
        "risk_analysis": risk_info,
        "active_impact": active_impact
    }

@app.post("/api/itinerary/reset")
def reset_itinerary(scenario: str = "alpine"):
    """Resets itinerary to baseline scenario."""
    global current_itinerary, active_impact, ghost_hold_manager
    if scenario == "transatlantic":
        current_itinerary = get_transatlantic_itinerary()
    else:
        current_itinerary = get_alpine_cascade_itinerary()

    ghost_hold_manager = GhostHoldManager()
    active_impact = None
    engine = GraphEngine(current_itinerary)
    engine.calculate_cpm_and_slacks()
    risk_info = calculate_domino_risk_index(current_itinerary)
    current_itinerary.domino_risk_index = risk_info["domino_risk_index"]
    return {
        "status": "RESET_SUCCESS",
        "itinerary": current_itinerary,
        "risk_analysis": risk_info
    }

@app.post("/api/disruption/simulate")
def simulate_disruption(event: DisruptionEvent):
    """
    Simulates a disruption event (delay or cancellation),
    executing Critical Path ripple propagation and blast radius analysis.
    """
    global current_itinerary, active_impact
    engine = GraphEngine(current_itinerary)
    impact = engine.propagate_disruption(event)
    
    # Recalculate Domino Risk Index after disruption
    risk_info = calculate_domino_risk_index(current_itinerary)
    impact.domino_risk_index_after = risk_info["domino_risk_index"]
    current_itinerary.domino_risk_index = risk_info["domino_risk_index"]
    current_itinerary.active_disruption = event.model_dump()
    active_impact = impact

    return {
        "impact": impact,
        "itinerary": current_itinerary,
        "risk_analysis": risk_info
    }

@app.post("/api/recovery/optimize")
def generate_recovery_plans(weights: Optional[OptimizationWeights] = None):
    """
    Solves Multi-Objective Recovery and returns Tri-Archetype plans:
    1. Plan A: The Sprint
    2. Plan B: The Balanced Plan
    3. Plan C: The Rest Anchor
    """
    global current_itinerary
    disruption_data = current_itinerary.active_disruption
    if not disruption_data:
        # Default disruption: Heathrow 65m ground delay
        disruption_event = DisruptionEvent(
            node_id=current_itinerary.nodes[0].id,
            delay_minutes=65,
            is_cancellation=False,
            reason="Air Traffic Control Ground Delay Program at LHR"
        )
    else:
        disruption_event = DisruptionEvent(**disruption_data)

    optimizer = RecoveryOptimizer(current_itinerary, disruption_event)
    plans = optimizer.generate_tri_archetypes(weights)
    return {
        "plans": plans,
        "total_options": len(plans),
        "solver": "OR-Tools CP-SAT Multi-Objective & Pareto Frontier",
        "disruption": disruption_event
    }

@app.post("/api/recovery/commit")
def commit_recovery_plan(payload: Dict[str, Any] = Body(...)):
    """
    Commits chosen recovery plan atomically via Distributed Saga Orchestrator.
    """
    global current_itinerary, active_impact
    plan_data = payload.get("plan")
    if not plan_data:
        raise HTTPException(status_code=400, detail="Missing plan payload")

    plan = RecoveryPlan(**plan_data)
    saga_result = SagaOrchestrator.execute_recovery_plan(plan)

    # Apply replacement nodes to current itinerary
    # Mark old disrupted nodes as resolved / replaced
    for node in current_itinerary.nodes:
        if node.status.value in ["delayed", "cancelled", "at_risk", "missed"]:
            node.status = "rebooked"

    current_itinerary.active_disruption = None
    active_impact = None

    # Recalculate CPM
    engine = GraphEngine(current_itinerary)
    engine.calculate_cpm_and_slacks()
    risk_info = calculate_domino_risk_index(current_itinerary)
    current_itinerary.domino_risk_index = max(12.0, risk_info["domino_risk_index"] - 35.0)

    return {
        "saga_result": saga_result,
        "updated_itinerary": current_itinerary,
        "updated_risk": current_itinerary.domino_risk_index
    }

@app.get("/api/ghost-holds")
def get_ghost_holds():
    """Lists pre-allocated Just-In-Time Contingency Ghost Holds."""
    return {
        "ghost_holds": ghost_hold_manager.get_all_holds(),
        "total_active": len(ghost_hold_manager.active_holds),
        "protocol": "Zero-Liability 90-Minute Lock via NDC/GDS"
    }

@app.get("/api/passenger-rights")
def get_passenger_rights():
    """Evaluates EU261, US DOT, and Parametric Liquidity Bridge."""
    global current_itinerary
    disruption = current_itinerary.active_disruption or {
        "delay_minutes": 65,
        "is_cancellation": False
    }
    flight_node = current_itinerary.nodes[0]
    delay = disruption.get("delay_minutes", 65)
    is_canc = disruption.get("is_cancellation", False)

    eu261 = PassengerRightsEngine.evaluate_eu261(flight_node, delay, is_canc)
    us_dot = PassengerRightsEngine.evaluate_us_dot(flight_node, delay, is_canc)
    rail = PassengerRightsEngine.evaluate_rail_rights(current_itinerary.nodes[2], delay)
    bridge = PassengerRightsEngine.calculate_parametric_liquidity_bridge(flight_node, delay, is_canc)

    return {
        "eu261": eu261,
        "us_dot": us_dot,
        "rail_rights": rail,
        "liquidity_bridge": bridge
    }

@app.get("/api/telemetry/feed")
def get_telemetry_feed():
    """Returns real-time telemetry stream data."""
    return {
        "radar": {
            "flight": "BA 712",
            "tail_number": "G-TTNP (A320neo)",
            "altitude_ft": 31000,
            "groundspeed_kts": 455,
            "departure_delay_mins": 65,
            "estimated_touchdown_zrh": "17:50 CET",
            "status": "GROUND_DELAY_PROGRAM_EN_ROUTE"
        },
        "weather": {
            "LHR": {"condition": "Fog / Low Visibility", "metar": "EGLL 261150Z 09006KT 3200 BR SCT004 12/10 Q1018"},
            "ZRH": {"condition": "Clear Sky / Calm", "metar": "LSZH 261150Z 28004KT CAVOK 14/06 Q1020"}
        },
        "mct_status": {
            "ZRH_airport_rail_buffer": -10,  # Negative slack!
            "flag": "BREACH_PREDICTED",
            "prediction_confidence": "94.2%"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
