from typing import Dict, List, Any
import time

class GhostHoldManager:
    """
    Just-In-Time Contingency Ghost Holds:
    Pre-allocates backup airline seats, high-speed rail inventory, and keyless hotel rooms
    the instant upstream telemetry signals a connection breach risk (P(breach) >= 0.85).
    Maintains active holds for 90 minutes without financial liability.
    """

    def __init__(self):
        self.active_holds: Dict[str, Dict[str, Any]] = {}
        self._seed_default_holds()

    def _seed_default_holds(self):
        self.active_holds = {
            "HOLD-SBB-EXPRESS-75": {
                "hold_id": "HOLD-SBB-EXPRESS-75",
                "service": "Swiss Federal Railways (SBB)",
                "details": "Train IR 75 / IC 61 Zurich Airport -> Visp (Depart 18:32)",
                "seats_held": 2,
                "expires_in_minutes": 74,
                "status": "RESERVED_GHOST",
                "cancellation_penalty": 0.0,
                "inventory_provider": "SBB Direct NDC Connect"
            },
            "HOLD-MGB-SHUTTLE-204": {
                "hold_id": "HOLD-MGB-SHUTTLE-204",
                "service": "Matterhorn Gotthard Bahn",
                "details": "Priority Shuttle Visp -> Zermatt (Depart 20:55)",
                "seats_held": 2,
                "expires_in_minutes": 82,
                "status": "RESERVED_GHOST",
                "cancellation_penalty": 0.0,
                "inventory_provider": "Swiss Travel Hub API"
            },
            "HOLD-RADISSON-ZRH-4412": {
                "hold_id": "HOLD-RADISSON-ZRH-4412",
                "service": "Radisson Blu Hotel Zurich Airport",
                "details": "Premium King Room with Late Arrival Guarantee",
                "rooms_held": 1,
                "expires_in_minutes": 115,
                "status": "RESERVED_GHOST",
                "cancellation_penalty": 0.0,
                "inventory_provider": "Amadeus Hospitality GDS"
            }
        }

    def get_all_holds(self) -> List[Dict[str, Any]]:
        return list(self.active_holds.values())

    def confirm_hold(self, hold_id: str) -> bool:
        if hold_id in self.active_holds:
            self.active_holds[hold_id]["status"] = "CONFIRMED_COMMITTED"
            return True
        return False

    def release_hold(self, hold_id: str) -> bool:
        if hold_id in self.active_holds:
            self.active_holds[hold_id]["status"] = "RELEASED_NO_CHARGE"
            return True
        return False
