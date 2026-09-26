import math
from typing import List, Dict, Any
from .models import Itinerary, ItineraryNode, ItineraryEdge, NodeType

def calculate_domino_risk_index(itinerary: Itinerary) -> Dict[str, Any]:
    """
    Computes the Domino Risk Index (DRI, 0 to 100) based on mathematical formula:
    DRI = 100 * (1 - exp(-sum( lambda_i / max(sigma_i - MCT_i, 1) * Omega(v_{i+1}) )))
    """
    exponent_sum = 0.0
    risk_breakdown = []

    # Map node by id for fast lookup
    node_map = {n.id: n for n in itinerary.nodes}

    for edge in itinerary.edges:
        src = node_map.get(edge.source_id)
        tgt = node_map.get(edge.target_id)
        if not src or not tgt:
            continue

        # Scheduled connection buffer in minutes
        # sigma_i = edge.slack + MCT + transfer
        # Net buffer = sigma_i - MCT_i
        net_buffer = max(1.0, float(edge.slack))

        # Carrier delay sensitivity factor lambda_i
        carrier = (src.carrier or "").lower()
        if "british" in carrier or "lhr" in (src.origin or "").lower():
            lambda_i = 1.35  # Congested hub
        elif "air france" in carrier or "cdg" in (src.origin or "").lower():
            lambda_i = 1.25
        elif "sbb" in carrier or "train" in (src.service_number or "").lower():
            lambda_i = 0.85  # Swiss rail high punctuality
        else:
            lambda_i = 1.0

        # Downstream risk multiplier Omega(v_{i+1})
        omega = 1.0
        risk_flags = []
        if tgt.critical_anchor:
            omega = 5.0
            risk_flags.append("Final connection of day / Critical Anchor")
        elif tgt.type == NodeType.RESERVATION and tgt.checkin_cutoff:
            omega = 3.8
            risk_flags.append(f"Strict check-in cutoff ({tgt.checkin_cutoff})")
        elif tgt.cost > 300:
            omega = 2.5
            risk_flags.append(f"High non-refundable commitment (€{tgt.cost})")
        else:
            omega = 1.2

        # Status penalty
        if edge.is_breached or src.status.value in ["delayed", "cancelled"]:
            lambda_i *= 2.8

        term = (lambda_i / net_buffer) * omega
        exponent_sum += term

        risk_breakdown.append({
            "connection": f"{src.name} -> {tgt.name}",
            "net_buffer_minutes": round(net_buffer, 1),
            "carrier_sensitivity": lambda_i,
            "downstream_multiplier": omega,
            "risk_flags": risk_flags,
            "connection_risk_score": min(100.0, round((1.0 - math.exp(-term * 2.5)) * 100, 1))
        })

    # Total DRI
    raw_dri = 100.0 * (1.0 - math.exp(-exponent_sum * 0.45))
    dri = max(5.0, min(99.0, round(raw_dri, 1)))

    # Classification
    if dri < 30:
        level = "LOW"
        color = "#10B981"  # Emerald
        advice = "Itinerary structure is resilient with healthy connection buffers."
    elif dri < 65:
        level = "MODERATE"
        color = "#F59E0B"  # Amber
        advice = "Tight connections detected. Proactive ghost holds recommended."
    else:
        level = "CRITICAL"
        color = "#EF4444"  # Red
        advice = "High structural fragility. High probability of cascading failure if upstream delay occurs."

    return {
        "domino_risk_index": dri,
        "level": level,
        "color": color,
        "advice": advice,
        "risk_breakdown": risk_breakdown
    }
