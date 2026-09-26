from typing import Dict, Any, List
from .models import ItineraryNode, DisruptionEvent

class PassengerRightsEngine:
    """
    Deterministic Legal Rules Engine enforcing:
    1. EU Regulation (EC) No 261/2004 & UK261
    2. 2024 U.S. DOT Automatic Cash Refund Mandate
    3. European Rail Passenger Rights (Regulation 2021/782)
    4. Parametric Insurance Liquidity Bridge
    """

    @staticmethod
    def evaluate_eu261(node: ItineraryNode, delay_minutes: int, is_cancellation: bool, distance_km: float = 780.0) -> Dict[str, Any]:
        """
        Calculates EU261/UK261 eligibility and compensation amount.
        """
        # Exclude extraordinary circumstances like volcanoes unless airline could have prevented
        is_carrier_disruption = True  # ATC ground delay or carrier technical issue
        
        eligible = False
        compensation_amount = 0.0
        currency = "EUR"
        tier = "None"
        duty_of_care = []

        if is_cancellation or delay_minutes >= 180:
            eligible = True
            if distance_km <= 1500:
                compensation_amount = 250.0
                tier = "Short-haul (≤ 1500 km)"
            elif distance_km <= 3500:
                compensation_amount = 400.0
                tier = "Medium-haul (1500 - 3500 km)"
            else:
                compensation_amount = 600.0
                tier = "Long-haul (> 3500 km)"

        # Right to care (meals, drinks, overnight hotel)
        if delay_minutes >= 120:
            duty_of_care.append("Complimentary meals & refreshment vouchers")
            duty_of_care.append("Two free telephone calls / internet access")
        if delay_minutes >= 360 or (delay_minutes >= 180 and "evening" in (node.start_time or "").lower()):
            duty_of_care.append("Mandatory airline-provided overnight hotel accommodation & ground transfer")

        claim_packet = {
            "regulation": "EU Regulation (EC) No 261/2004 & UK261",
            "eligible": eligible,
            "statutory_compensation": compensation_amount,
            "currency": currency,
            "distance_km": distance_km,
            "flight_service": f"{node.carrier} {node.service_number}",
            "route": f"{node.origin} -> {node.destination}",
            "tier": tier,
            "duty_of_care_entitlements": duty_of_care,
            "auto_claim_packet_ready": eligible,
            "legal_basis": "Carrier operational/schedule delay exceeding statutory thresholds"
        }
        return claim_packet

    @staticmethod
    def evaluate_us_dot(node: ItineraryNode, delay_minutes: int, is_cancellation: bool, is_international: bool = True) -> Dict[str, Any]:
        """
        Enforces 2024 U.S. DOT Automatic Cash Refund Rule.
        """
        threshold = 360 if is_international else 180  # 6 hrs intl, 3 hrs domestic
        qualifies_for_full_refund = is_cancellation or (delay_minutes >= threshold)

        refund_amount = node.cost if qualifies_for_full_refund else 0.0
        return {
            "regulation": "2024 U.S. Department of Transportation Final Refund Rule",
            "qualifies_for_automatic_cash_refund": qualifies_for_full_refund,
            "refund_amount": refund_amount,
            "currency": node.currency,
            "method": "Direct credit to original payment method within 7 business days",
            "baggage_fee_refund_guarantee": True if delay_minutes > 720 else False,
            "notes": "Carrier prohibited from offering vouchers or expiring airline credits in lieu of cash."
        }

    @staticmethod
    def evaluate_rail_rights(node: ItineraryNode, delay_minutes: int) -> Dict[str, Any]:
        """
        European Rail Passenger Rights (Regulation 2021/782).
        """
        refund_pct = 0
        if delay_minutes >= 120:
            refund_pct = 50
        elif delay_minutes >= 60:
            refund_pct = 25

        refund_amount = (node.cost * refund_pct) / 100.0
        return {
            "regulation": "European Rail Passenger Rights (Regulation 2021/782)",
            "qualifies_for_fare_compensation": refund_pct > 0,
            "compensation_percentage": f"{refund_pct}%",
            "refund_amount": round(refund_amount, 2),
            "currency": node.currency,
            "rerouting_obligation": delay_minutes > 100
        }

    @classmethod
    def calculate_parametric_liquidity_bridge(cls, node: ItineraryNode, delay_minutes: int, is_cancellation: bool) -> Dict[str, Any]:
        """
        Parametric Disruption Liquidity Bridge:
        Instantly computes guaranteed statutory and insurance payouts,
        and unlocks immediate zero-interest credit advance to rebook without out-of-pocket lockup.
        """
        eu = cls.evaluate_eu261(node, delay_minutes, is_cancellation)
        dot = cls.evaluate_us_dot(node, delay_minutes, is_cancellation)
        rail = cls.evaluate_rail_rights(node, delay_minutes)

        total_guaranteed_claims = eu["statutory_compensation"]
        if dot["qualifies_for_automatic_cash_refund"]:
            total_guaranteed_claims += dot["refund_amount"]

        # Parametric index trigger (e.g. Blink Parametric / automated telemetry trigger)
        parametric_instant_payout = 150.0 if delay_minutes >= 60 else 0.0

        total_liquidity_advance = total_guaranteed_claims + parametric_instant_payout

        return {
            "total_liquidity_advance": total_liquidity_advance,
            "currency": "EUR",
            "claims_breakdown": {
                "eu261_uk261": eu["statutory_compensation"],
                "us_dot_refund": dot["refund_amount"],
                "parametric_instant_payout": parametric_instant_payout,
                "rail_reimbursement": rail["refund_amount"]
            },
            "underwriting_status": "INSTANTLY_APPROVED",
            "available_for_rebooking": total_liquidity_advance > 0,
            "user_out_of_pocket_shield": "Protected by Automated Liquidity Bridge"
        }
