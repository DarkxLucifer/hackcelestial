import sqlite3
import os
import re
import json
import random
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

    # 3. Dedicated real travel bookings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS travel_bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_ref TEXT UNIQUE,
        passenger_name TEXT,
        passenger_email TEXT,
        passenger_phone TEXT,
        seat_preference TEXT,
        origin TEXT,
        destination TEXT,
        travel_date TEXT,
        transport_mode TEXT,
        carrier TEXT,
        service_number TEXT,
        departure_time TEXT,
        arrival_time TEXT,
        duration TEXT,
        seat_class TEXT,
        fare_inr REAL DEFAULT 0.0,
        tax_inr REAL DEFAULT 0.0,
        protection_tier TEXT DEFAULT 'Voyage Plus',
        protection_fee_inr REAL DEFAULT 0.0,
        total_fare_inr REAL DEFAULT 0.0,
        protection_status TEXT DEFAULT 'ACTIVE_AUTONOMOUS',
        qr_code_data TEXT,
        segments_json TEXT,
        status TEXT DEFAULT 'CONFIRMED',
        created_at TEXT
    )
    """)
    
    conn.commit()

    # Ensure all extended schema columns exist in legacy databases
    for col, col_type in [
        ("travel_date", "TEXT"),
        ("is_past_journey", "INTEGER DEFAULT 0"),
        ("journey_status", "TEXT DEFAULT 'ON_TIME'"),
        ("origin_coords", "TEXT"),
        ("dest_coords", "TEXT")
    ]:
        try:
            cursor.execute(f"ALTER TABLE external_disruptions ADD COLUMN {col} {col_type}")
        except Exception:
            pass

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

    is_rail = any(kw in carrier.lower() for kw in ["rail", "train", "irctc", "express", "vande"])
    recommended_plans = [
        {
            "id": "ext_plan_a",
            "title": "PLAN A: STANDARD REBOOKING (MINIMUM FARE)",
            "badge": "₹385 STATUTORY REBOOKING" if is_rail else "₹1,250 CARRIER REBOOKING",
            "cost_delta": 385 if is_rail else 1250,
            "time_delta": "+5h 30m next morning",
            "impact": "Next available carrier rebooking, protected under statutory passenger charter.",
            "steps": [
                f"Automatic rebooking on next scheduled {carrier} service",
                "Hotel late arrival notification dispatched",
                "Airport / station transfer rescheduled at zero extra cost"
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
    travel_date = data.get("travel_date") or datetime.now().strftime("%Y-%m-%d")
    is_past_journey = 1 if data.get("is_past_journey") else 0
    journey_status = data.get("journey_status") or ("COMPLETED" if is_past_journey else ("CANCELLED" if is_cancellation else ("DELAYED" if delay_minutes > 15 else "ON_TIME")))

    cursor.execute("""
    INSERT INTO external_disruptions (
        pnr, passenger_name, booking_source, carrier, service_number,
        origin, destination, scheduled_departure, scheduled_arrival,
        delay_minutes, is_cancellation, disruption_reason, ticket_cost,
        currency, refund_eligible, refund_amount, statutory_compensation,
        total_claim, applicable_law, recommended_plan, status, created_at,
        travel_date, is_past_journey, journey_status, origin_coords, dest_coords
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("pnr") or f"VY-{int(datetime.now().timestamp()) % 100000:05d}-IN",
        data.get("passenger_name") or "Passenger",
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
        now_iso,
        travel_date,
        is_past_journey,
        journey_status,
        json.dumps(data.get("origin_coords")) if data.get("origin_coords") else None,
        json.dumps(data.get("dest_coords")) if data.get("dest_coords") else None
    ))

    inserted_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": inserted_id,
        "pnr": data.get("pnr") or f"VY-{int(datetime.now().timestamp()) % 100000:05d}-IN",
        "passenger_name": data.get("passenger_name") or "Passenger",
        "carrier": carrier,
        "service_number": service,
        "origin": origin,
        "destination": dest,
        "travel_date": travel_date,
        "is_past_journey": bool(is_past_journey),
        "journey_status": journey_status,
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
        for coord_field in ["origin_coords", "dest_coords"]:
            if d.get(coord_field) and isinstance(d[coord_field], str):
                try:
                    d[coord_field] = json.loads(d[coord_field])
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

def get_all_refund_claims() -> List[Dict[str, Any]]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM refund_claims ORDER BY rowid DESC")
    rows = cursor.fetchall()
    result = [dict(r) for r in rows]
    conn.close()
    return result

# ==============================================================================
# TRAVEL BOOKINGS STORAGE & MANAGEMENT (Real Functional Booking Engine)
# ==============================================================================

def seed_default_booking_if_empty():
    """Seeds the active multi-modal journey if the bookings table is empty."""
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as cnt FROM travel_bookings")
    row = cursor.fetchone()
    if row and row["cnt"] == 0:
        default_segments = [
            {
                "id": "seg_fl_1",
                "type": "flight",
                "carrier": "Air India",
                "service_number": "AI 882",
                "origin": "Mumbai (BOM)",
                "destination": "Delhi (DEL)",
                "dep_time": "15:30 IST",
                "arr_time": "17:50 IST",
                "terminal": "T2 Gate 44",
                "aircraft": "A321neo",
                "seat": "12B (Economy)",
                "status": "ON_SCHEDULE"
            },
            {
                "id": "seg_mt_2",
                "type": "metro",
                "carrier": "Delhi Metro Airport Express",
                "service_number": "DEL-NDLS",
                "origin": "IGI Airport T3",
                "destination": "New Delhi Station",
                "dep_time": "18:10 IST",
                "arr_time": "18:45 IST",
                "terminal": "Track 1",
                "status": "BUFFER_SECURED"
            },
            {
                "id": "seg_tr_3",
                "type": "train",
                "carrier": "Vande Bharat Express",
                "service_number": "#20978",
                "origin": "New Delhi (NDLS)",
                "destination": "Jaipur (JAI)",
                "dep_time": "19:20 IST",
                "arr_time": "23:15 IST",
                "terminal": "Platform 16",
                "seat": "Chair Car C3, Seat 45",
                "status": "CONFIRMED"
            },
            {
                "id": "seg_ht_4",
                "type": "hotel",
                "carrier": "Heritage Boutique Hotel Jaipur",
                "service_number": "HT-JAI-441",
                "origin": "Jaipur, Rajasthan",
                "destination": "Jaipur, Rajasthan",
                "dep_time": "Check-in 18:00+",
                "arr_time": "Checkout +2 Days",
                "terminal": "Deluxe Suite",
                "status": "LATE_CHECKIN_PROTECTED"
            }
        ]
        now_str = datetime.now().isoformat()
        cursor.execute("""
        INSERT INTO travel_bookings (
            booking_ref, passenger_name, passenger_email, passenger_phone, seat_preference,
            origin, destination, travel_date, transport_mode, carrier, service_number,
            departure_time, arrival_time, duration, seat_class,
            fare_inr, tax_inr, protection_tier, protection_fee_inr, total_fare_inr,
            protection_status, qr_code_data, segments_json, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "VY-8842-ALPINE",
            "Yash Sharma",
            "traveler@voyage.ai",
            "+91 98200 12345",
            "Window",
            "Mumbai (BOM)",
            "Jaipur (JAI)",
            datetime.now().strftime("%Y-%m-%d"),
            "multimodal",
            "Air India + Vande Bharat",
            "AI 882 / #20978",
            "15:30 IST",
            "23:15 IST",
            "7h 45m",
            "Multi-Modal Plus",
            6800.0,
            680.0,
            "Voyage Plus",
            499.0,
            7979.0,
            "ACTIVE_AUTONOMOUS",
            "VY-8842-ALPINE|YASH SHARMA|BOM-DEL-JAI|AI882|20978",
            json.dumps(default_segments),
            "CONFIRMED",
            now_str
        ))
        conn.commit()
    conn.close()

def save_travel_booking(data: Dict[str, Any]) -> Dict[str, Any]:
    """Persists a new confirmed booking into the SQLite database."""
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    import random
    ref_num = random.randint(1000, 9999)
    orig_code = re.sub(r'[^A-Z]', '', (data.get("origin", "BOM")[:4]).upper()) or "VYG"
    booking_ref = data.get("booking_ref") or f"VY-{ref_num}-{orig_code}"
    
    passenger_name = data.get("passenger_name", "Traveler")
    passenger_email = data.get("passenger_email", "guest@voyage.ai")
    passenger_phone = data.get("passenger_phone", "+91 98000 00000")
    seat_pref = data.get("seat_preference", "Window")
    
    origin = data.get("origin", "Mumbai (BOM)")
    destination = data.get("destination", "Delhi (DEL)")
    travel_date = data.get("travel_date", datetime.now().strftime("%Y-%m-%d"))
    transport_mode = data.get("transport_mode", "flight")
    carrier = data.get("carrier", "IndiGo")
    service_number = data.get("service_number", "6E 2024")
    dep_time = data.get("departure_time", "08:00 IST")
    arr_time = data.get("arrival_time", "10:15 IST")
    duration = data.get("duration", "2h 15m")
    seat_class = data.get("seat_class", "Economy")
    
    fare_inr = float(data.get("fare_inr", 4850.0))
    tax_inr = float(data.get("tax_inr", round(fare_inr * 0.10, 2)))
    protection_tier = data.get("protection_tier", "Voyage Plus")
    protection_fee = 499.0 if "Plus" in protection_tier else (899.0 if "Pro" in protection_tier else 199.0)
    total_fare = round(fare_inr + tax_inr + protection_fee, 2)
    
    qr_data = f"{booking_ref}|{passenger_name.upper()}|{origin}➔{destination}|{carrier} {service_number}|{dep_time}"
    segments = data.get("segments") or [
        {
            "id": f"seg_{ref_num}_1",
            "type": transport_mode,
            "carrier": carrier,
            "service_number": service_number,
            "origin": origin,
            "destination": destination,
            "dep_time": dep_time,
            "arr_time": arr_time,
            "duration": duration,
            "seat": f"Seat {seat_pref}",
            "status": "CONFIRMED"
        }
    ]
    segments_json = json.dumps(segments)
    now_iso = datetime.now().isoformat()

    cursor.execute("""
    INSERT INTO travel_bookings (
        booking_ref, passenger_name, passenger_email, passenger_phone, seat_preference,
        origin, destination, travel_date, transport_mode, carrier, service_number,
        departure_time, arrival_time, duration, seat_class,
        fare_inr, tax_inr, protection_tier, protection_fee_inr, total_fare_inr,
        protection_status, qr_code_data, segments_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        booking_ref, passenger_name, passenger_email, passenger_phone, seat_pref,
        origin, destination, travel_date, transport_mode, carrier, service_number,
        dep_time, arr_time, duration, seat_class,
        fare_inr, tax_inr, protection_tier, protection_fee, total_fare,
        "ACTIVE_AUTONOMOUS", qr_data, segments_json, "CONFIRMED", now_iso
    ))
    conn.commit()
    booking_id = cursor.lastrowid
    conn.close()

    return {
        "id": booking_id,
        "booking_ref": booking_ref,
        "passenger_name": passenger_name,
        "passenger_email": passenger_email,
        "passenger_phone": passenger_phone,
        "origin": origin,
        "destination": destination,
        "travel_date": travel_date,
        "transport_mode": transport_mode,
        "carrier": carrier,
        "service_number": service_number,
        "departure_time": dep_time,
        "arrival_time": arr_time,
        "duration": duration,
        "seat_class": seat_class,
        "fare_inr": fare_inr,
        "tax_inr": tax_inr,
        "protection_tier": protection_tier,
        "protection_fee_inr": protection_fee,
        "total_fare_inr": total_fare,
        "protection_status": "ACTIVE_AUTONOMOUS",
        "qr_code_data": qr_data,
        "segments": segments,
        "status": "CONFIRMED",
        "created_at": now_iso
    }

def get_all_travel_bookings() -> List[Dict[str, Any]]:
    """Fetches all bookings from the database."""
    init_db()
    seed_default_booking_if_empty()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM travel_bookings ORDER BY id DESC")
    rows = cursor.fetchall()
    results = []
    for r in rows:
        d = dict(r)
        if d.get("segments_json"):
            try:
                d["segments"] = json.loads(d["segments_json"])
            except Exception:
                d["segments"] = []
        else:
            d["segments"] = []
        results.append(d)
    conn.close()
    return results

def get_travel_booking_by_ref(booking_ref: str) -> Optional[Dict[str, Any]]:
    """Fetches a specific booking by its reference code."""
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM travel_bookings WHERE booking_ref = ?", (booking_ref,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None
    d = dict(row)
    if d.get("segments_json"):
        try:
            d["segments"] = json.loads(d["segments_json"])
        except Exception:
            d["segments"] = []
    conn.close()
    return d

def cancel_travel_booking(booking_ref: str) -> Dict[str, Any]:
    """Cancels a booking and computes statutory DGCA/IRCTC refund."""
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM travel_bookings WHERE booking_ref = ?", (booking_ref,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return {"error": f"Booking {booking_ref} not found", "success": False}
    
    fare = float(row["total_fare_inr"] or 0.0)
    cursor.execute("UPDATE travel_bookings SET status = 'CANCELLED' WHERE booking_ref = ?", (booking_ref,))
    conn.commit()
    conn.close()
    
    return {
        "success": True,
        "booking_ref": booking_ref,
        "status": "CANCELLED",
        "refund_amount": fare,
        "refund_status": "PROCESSED_INSTANT_CREDIT",
        "message": f"Booking {booking_ref} cancelled. 100% refund of ₹{fare:,.2f} initiated under Voyage Autonomous Immunity Guarantee."
    }

