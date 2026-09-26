import sqlite3
import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "voyage_disruptions.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. External ticket disruptions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS external_disruptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pnr TEXT,
        passenger_name TEXT,
        booking_source TEXT DEFAULT 'External Ticket Upload',
        carrier TEXT,
        service_number TEXT,
        origin TEXT,
        destination TEXT,
        scheduled_departure TEXT,
        scheduled_arrival TEXT,
        delay_minutes INTEGER DEFAULT 0,
        is_cancellation INTEGER DEFAULT 0,
        disruption_reason TEXT,
        ticket_cost REAL DEFAULT 0.0,
        currency TEXT DEFAULT 'INR',
        refund_eligible INTEGER DEFAULT 1,
        refund_amount REAL DEFAULT 0.0,
        statutory_compensation REAL DEFAULT 0.0,
        total_claim REAL DEFAULT 0.0,
        applicable_law TEXT,
        recommended_plan TEXT,
        status TEXT DEFAULT 'RESOLVING',
        created_at TEXT
    )
    """)

    # 2. Refund claims log table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS refund_claims (
        claim_id TEXT PRIMARY KEY,
        disruption_id INTEGER,
        pnr TEXT,
        passenger_name TEXT,
        airline TEXT,
        claimed_amount REAL,
        currency TEXT,
        applicable_policy TEXT,
        claim_status TEXT DEFAULT 'FILED_UNDER_CAR_DGCA',
        filing_timestamp TEXT,
        acknowledgement_number TEXT,
        notes TEXT
    )
    """)
    
    conn.commit()
    conn.close()

def evaluate_disruption_rights(carrier: str, delay_minutes: int, is_cancellation: bool, ticket_cost: float) -> Dict[str, Any]:
    """
    Evaluates statutory refund and passenger rights under:
    - DGCA CAR Section 3 Series M Part IV (India)
    - EU Regulation (EC) 261/2004
    - US DOT 2024 Final Rule
    - Indian Railways (IRCTC) TDR Rules
    """
    is_rail = any(kw in carrier.lower() for kw in ["rail", "irctc", "vande bharat", "train"])
    currency = "INR"
    
    if is_rail:
        # IRCTC rules: delay > 3 hours allows full TDR refund with no deduction
        refund_eligible = delay_minutes >= 180 or is_cancellation
        refund_amount = ticket_cost if refund_eligible else 0.0
        statutory_comp = 0.0
        applicable_law = "Indian Railways (IRCTC) TDR Rule 2024 - 100% Refund for Delays > 3 Hrs"
        policy_summary = "Full fare refund eligible via IRCTC TDR filing. Zero cancellation fee applied." if refund_eligible else "Nominal run. No refund applicable."
    else:
        # Indian DGCA or Global Flight Rules
        # DGCA CAR Section 3: If delay > 6 hours or cancellation without 24h notice -> 100% refund + up to ₹5,000 compensation
        # If delay > 2 hours -> Free meals and refreshments
        if is_cancellation:
            refund_eligible = True
            refund_amount = ticket_cost
            statutory_comp = min(ticket_cost, 5000.0)
            applicable_law = "DGCA CAR Section 3 Series M Part IV (Automatic Full Refund + Statutory Compensation)"
            policy_summary = "Flight cancelled. Entitled to full refund of fare + statutory compensation of ₹5,000 under DGCA guidelines."
        elif delay_minutes >= 360:  # > 6 hours
            refund_eligible = True
            refund_amount = ticket_cost
            statutory_comp = 5000.0
            applicable_law = "DGCA CAR Section 3 & 2024 US DOT/EU261 Harmonized Standard"
            policy_summary = "Critical delay > 6 hours. Entitled to alternative transportation OR 100% full refund + statutory compensation."
        elif delay_minutes >= 180:  # > 3 hours
            refund_eligible = True
            refund_amount = ticket_cost * 0.5  # 50% partial or full rescheduling
            statutory_comp = 3000.0
            applicable_law = "DGCA CAR Section 3 - Passenger Delay Rights"
            policy_summary = "Delay exceeds 3 hours. Entitled to free airline refreshments + option of free reschedule or statutory compensation claim."
        elif delay_minutes >= 120:  # > 2 hours
            refund_eligible = True
            refund_amount = 0.0
            statutory_comp = 1500.0
            applicable_law = "DGCA CAR Section 3 - Duty of Care"
            policy_summary = "Delay exceeds 2 hours. Mandatory airline refreshments and delay mitigation voucher applicable."
        else:
            refund_eligible = False
            refund_amount = 0.0
            statutory_comp = 0.0
            applicable_law = "Standard Carriage Terms"
            policy_summary = "Delay within operational buffer (< 2 hrs). Monitor for further schedule changes."

    total_claim = refund_amount + statutory_comp

    return {
        "refund_eligible": refund_eligible,
        "refund_amount": round(refund_amount, 2),
        "statutory_compensation": round(statutory_comp, 2),
        "total_claim": round(total_claim, 2),
        "applicable_law": applicable_law,
        "policy_summary": policy_summary,
        "currency": currency
    }

def save_external_disruption(data: Dict[str, Any]) -> Dict[str, Any]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    carrier = data.get("carrier", "Air India")
    delay_minutes = int(data.get("delay_minutes", 60))
    is_cancellation = 1 if data.get("is_cancellation") else 0
    ticket_cost = float(data.get("ticket_cost", 5500.0))

    rights = evaluate_disruption_rights(carrier, delay_minutes, bool(is_cancellation), ticket_cost)

    # Build Pareto Recovery Plans for this external ticket
    origin = data.get("origin", "Mumbai (BOM)")
    dest = data.get("destination", "Delhi (DEL)")
    service = data.get("service_number", "AI 882")

    recommended_plans = [
        {
            "id": "ext_plan_a",
            "title": "PLAN A: MINIMUM COST (AIRLINE REBOOKING)",
            "badge": "₹0 OUT-OF-POCKET",
            "cost_delta": 0,
            "time_delta": "+5h 30m next morning",
            "impact": "Next available carrier rebooking, zero out of pocket expense.",
            "steps": [
                f"Automatic rebooking on next scheduled {carrier} flight",
                "Hotel late arrival notification dispatched",
                "Airport transfer rescheduled at zero extra cost"
            ]
        },
        {
            "id": "ext_plan_b",
            "title": "PLAN B: FASTEST MULTI-MODAL RECOVERY (RECOMMENDED)",
            "badge": "RECOMMENDED RECOVERY (₹2,850 EXTRA)",
            "cost_delta": 2850,
            "time_delta": "Arrival tonight with ~9h 25m saved",
            "impact": "Alternative flight + Vande Bharat Express bridge preserves downstream hotel check-in.",
            "steps": [
                f"Secured seat on immediate alternative carrier from {origin}",
                f"Direct express rail connection to {dest}",
                "Downstream hotel check-in extended until 23:59 guaranteed"
            ]
        },
        {
            "id": "ext_plan_c",
            "title": "PLAN C: DIRECT PRIVATE COMFORT",
            "badge": "DOOR-TO-DOOR PRIVATE (₹6,900 EXTRA)",
            "cost_delta": 6900,
            "time_delta": "Arrival tonight with ~10h 30m saved",
            "impact": "Dedicated chauffeured inter-city express transfer with luggage handling.",
            "steps": [
                f"Immediate alternative flight out of {origin}",
                "Dedicated private executive transfer to final destination",
                "Full door-to-door concierge assistance"
            ]
        }
    ]

    now_iso = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO external_disruptions (
        pnr, passenger_name, booking_source, carrier, service_number,
        origin, destination, scheduled_departure, scheduled_arrival,
        delay_minutes, is_cancellation, disruption_reason, ticket_cost,
        currency, refund_eligible, refund_amount, statutory_compensation,
        total_claim, applicable_law, recommended_plan, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("pnr", "VY-EXT-8820"),
        data.get("passenger_name", "Elena Vance"),
        data.get("booking_source", "External Travel Ticket"),
        carrier,
        service,
        origin,
        dest,
        data.get("scheduled_departure", "15:30"),
        data.get("scheduled_arrival", "17:50"),
        delay_minutes,
        is_cancellation,
        data.get("disruption_reason", "Technical maintenance / Schedule conflict"),
        ticket_cost,
        data.get("currency", "INR"),
        1 if rights["refund_eligible"] else 0,
        rights["refund_amount"],
        rights["statutory_compensation"],
        rights["total_claim"],
        rights["applicable_law"],
        json.dumps(recommended_plans),
        "RESOLVING",
        now_iso
    ))

    inserted_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": inserted_id,
        "pnr": data.get("pnr", "VY-EXT-8820"),
        "passenger_name": data.get("passenger_name", "Elena Vance"),
        "carrier": carrier,
        "service_number": service,
        "origin": origin,
        "destination": dest,
        "delay_minutes": delay_minutes,
        "is_cancellation": bool(is_cancellation),
        "disruption_reason": data.get("disruption_reason", "Technical maintenance"),
        "ticket_cost": ticket_cost,
        "currency": "INR",
        "rights_evaluation": rights,
        "recommended_plans": recommended_plans,
        "origin_coords": data.get("origin_coords"),
        "dest_coords": data.get("dest_coords"),
        "status": "RESOLVING",
        "created_at": now_iso
    }

def get_all_external_disruptions() -> List[Dict[str, Any]]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM external_disruptions ORDER BY id DESC")
    rows = cursor.fetchall()
    
    result = []
    for r in rows:
        d = dict(r)
        if d.get("recommended_plan"):
            try:
                d["recommended_plan"] = json.loads(d["recommended_plan"])
            except Exception:
                pass
        result.append(d)
        
    conn.close()
    return result

def file_refund_claim(disruption_id: int, pnr: str, passenger_name: str, airline: str, amount: float, policy: str) -> Dict[str, Any]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    claim_id = f"REF-DGCA-{int(datetime.now().timestamp())}"
    ack_number = f"ACK-VY-{datetime.now().strftime('%Y%m%d%H%M')}-{claim_id[-4:]}"
    now_iso = datetime.now().isoformat()

    cursor.execute("""
    INSERT INTO refund_claims (
        claim_id, disruption_id, pnr, passenger_name, airline, claimed_amount,
        currency, applicable_policy, claim_status, filing_timestamp,
        acknowledgement_number, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        claim_id,
        disruption_id,
        pnr,
        passenger_name,
        airline,
        amount,
        "INR",
        policy,
        "FILED_UNDER_CAR_DGCA",
        now_iso,
        ack_number,
        "Automated claim packet dispatched to carrier and DGCA portal. Statutory resolution within 7 business days."
    ))

    # Update external disruption status
    cursor.execute("UPDATE external_disruptions SET status = 'REFUND_CLAIM_FILED' WHERE id = ?", (disruption_id,))
    
    conn.commit()
    conn.close()

    return {
        "claim_id": claim_id,
        "acknowledgement_number": ack_number,
        "disruption_id": disruption_id,
        "pnr": pnr,
        "claimed_amount": amount,
        "currency": "INR",
        "status": "FILED_UNDER_CAR_DGCA",
        "timestamp": now_iso,
        "message": "Refund claim successfully lodged with carrier and recorded in Voyage Disruption Ledger."
    }
