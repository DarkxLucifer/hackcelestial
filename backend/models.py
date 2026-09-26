from typing import List, Dict, Optional, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class NodeType(str, Enum):
    TRANSPORT = "transport"
    RESERVATION = "reservation"
    FLEX = "flex"

class TransportMode(str, Enum):
    FLIGHT = "flight"
    TRAIN = "train"
    BUS = "bus"
    FERRY = "ferry"
    PRIVATE_TRANSFER = "private_transfer"
    WALK = "walk"

class ReservationType(str, Enum):
    HOTEL = "hotel"
    TOUR = "tour"
    EVENT = "event"
    CAR_RENTAL = "car_rental"
    DINING = "dining"

class DisruptionSeverity(str, Enum):
    STEP_LEVEL = "step_level"
    DAY_LEVEL = "day_level"
    PLAN_LEVEL = "plan_level"

class NodeStatus(str, Enum):
    CONFIRMED = "confirmed"
    DELAYED = "delayed"
    CANCELLED = "cancelled"
    AT_RISK = "at_risk"
    REBOOKED = "rebooked"
    MISSED = "missed"

class Coordinates(BaseModel):
    lat: float
    lng: float

class ItineraryNode(BaseModel):
    id: str
    name: str
    type: NodeType
    mode: Optional[TransportMode] = None
    reservation_type: Optional[ReservationType] = None
    carrier: Optional[str] = None
    service_number: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    origin_coords: Optional[Coordinates] = None
    dest_coords: Optional[Coordinates] = None
    start_time: str  # ISO-8601 or HH:MM
    end_time: str
    duration_minutes: int
    cost: float
    currency: str = "EUR"
    status: NodeStatus = NodeStatus.CONFIRMED
    slack_minutes: float = 0.0
    earliest_start: float = 0.0
    latest_start: float = 0.0
    # Specific attributes
    checkin_cutoff: Optional[str] = None
    cancellation_deadline: Optional[str] = None
    refundable_amount: float = 0.0
    mct_required: int = 45  # Minimum Connection Time in minutes
    critical_anchor: bool = False
    details: Dict[str, Any] = Field(default_factory=dict)

class ItineraryEdge(BaseModel):
    source_id: str
    target_id: str
    min_connection_time: int = 45  # MCT in mins
    transfer_duration: int = 30    # physical transit in mins
    slack: float = 0.0             # current calculated buffer - (mct + transit)
    is_breached: bool = False
    relation: str = "precedes"

class Itinerary(BaseModel):
    id: str
    title: str
    traveler_name: str
    total_cost: float
    currency: str = "EUR"
    nodes: List[ItineraryNode]
    edges: List[ItineraryEdge]
    domino_risk_index: float = 0.0
    active_disruption: Optional[Dict[str, Any]] = None

class DisruptionEvent(BaseModel):
    node_id: str
    delay_minutes: int = 0
    is_cancellation: bool = False
    reason: str
    detected_at: Optional[str] = None
    source: str = "ADS-B / GDS Telemetry"

class DownstreamImpact(BaseModel):
    disrupted_node_id: str
    delay_minutes: int
    blast_radius_node_ids: List[str]
    missed_connection_node_ids: List[str]
    at_risk_reservation_ids: List[str]
    total_downstream_delay: int
    estimated_financial_loss: float
    domino_risk_index_before: float
    domino_risk_index_after: float
    summary: str

class RecoveryCandidate(BaseModel):
    id: str
    name: str
    mode: str
    carrier: str
    service_number: str
    departure: str
    arrival: str
    cost: float
    currency: str = "EUR"
    available_seats: int = 9
    is_ghost_hold_available: bool = True
    co2_emissions_kg: Optional[float] = None
    comfort_score: float = 8.5
    notes: str = ""

class RecoveryPlan(BaseModel):
    id: str
    archetype: str  # "Sprint", "Balanced", "Rest Anchor"
    tagline: str
    description: str
    net_delay_minutes: int
    final_arrival_time: str
    gross_additional_cost: float
    statutory_refund_credit: float
    regulatory_compensation: float
    net_out_of_pocket: float
    currency: str = "EUR"
    intent_drift_score: float  # 0.0 to 1.0 (lower is better)
    comfort_score: float       # 0 to 10
    itinerary_affected_count: int
    replacement_nodes: List[Dict[str, Any]]
    ghost_holds_secured: List[str]
    passenger_rights_claims: List[Dict[str, Any]]
    liquidity_advance_offered: float
    diff_summary: Dict[str, Any]

class OptimizationWeights(BaseModel):
    weight_cost: float = 0.20
    weight_time: float = 0.20
    weight_intent: float = 0.50
    weight_comfort: float = 0.10
    budget_limit: float = 1000.0

class SagaStep(BaseModel):
    step_id: str
    action: str
    service: str
    status: str  # "pending", "executing", "completed", "failed", "compensated"
    payload: Dict[str, Any] = Field(default_factory=dict)
    compensation_action: Optional[str] = None
