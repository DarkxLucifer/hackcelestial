from typing import Dict, List
from .models import (
    Itinerary, ItineraryNode, ItineraryEdge, NodeType, TransportMode,
    ReservationType, NodeStatus, Coordinates
)

def get_alpine_cascade_itinerary() -> Itinerary:
    """
    The Alpine Disruption Cascade:
    London Heathrow -> Zurich -> Visp -> Zermatt
    Features critical hotel reception cutoff at 21:00.
    """
    nodes = [
        ItineraryNode(
            id="node_flight_1",
            name="British Airways BA 712",
            type=NodeType.TRANSPORT,
            mode=TransportMode.FLIGHT,
            carrier="British Airways",
            service_number="BA 712",
            origin="London Heathrow (LHR)",
            destination="Zurich Airport (ZRH)",
            origin_coords=Coordinates(lat=51.4700, lng=-0.4543),
            dest_coords=Coordinates(lat=47.4582, lng=8.5555),
            start_time="14:00",
            end_time="16:45",
            duration_minutes=165,
            cost=240.0,
            currency="EUR",
            status=NodeStatus.CONFIRMED,
            mct_required=45,
            details={"aircraft": "Airbus A320neo", "terminal": "T5 -> T1"}
        ),
        ItineraryNode(
            id="node_transfer_1",
            name="Zurich Airport Transit Shuttle",
            type=NodeType.TRANSPORT,
            mode=TransportMode.WALK,
            carrier="Zurich Airport Ground",
            service_number="Air-Rail Link",
            origin="ZRH Terminal 1",
            destination="Zurich Flughafen Rail Station",
            start_time="17:15",
            end_time="17:35",
            duration_minutes=20,
            cost=0.0,
            currency="EUR",
            status=NodeStatus.CONFIRMED,
            mct_required=15,
            details={"connection_type": "Terminal Walking Link"}
        ),
        ItineraryNode(
            id="node_train_1",
            name="SBB InterCity IC 8",
            type=NodeType.TRANSPORT,
            mode=TransportMode.TRAIN,
            carrier="Swiss Federal Railways (SBB)",
            service_number="IC 8 #830",
            origin="Zurich HB",
            destination="Visp Station",
            origin_coords=Coordinates(lat=47.3781, lng=8.5401),
            dest_coords=Coordinates(lat=46.2936, lng=7.8812),
            start_time="18:02",
            end_time="20:02",
            duration_minutes=120,
            cost=98.0,
            currency="EUR",
            status=NodeStatus.CONFIRMED,
            mct_required=10,
            details={"platform": "31", "route": "via Bern Tunnel"}
        ),
        ItineraryNode(
            id="node_train_2",
            name="Matterhorn Gotthard Bahn Regional",
            type=NodeType.TRANSPORT,
            mode=TransportMode.TRAIN,
            carrier="MGB",
            service_number="MGB Reg 138",
            origin="Visp Station",
            destination="Zermatt Terminal",
            origin_coords=Coordinates(lat=46.2936, lng=7.8812),
            dest_coords=Coordinates(lat=45.9765, lng=7.7491),
            start_time="20:10",
            end_time="21:14",
            duration_minutes=64,
            cost=42.0,
            currency="EUR",
            status=NodeStatus.CONFIRMED,
            mct_required=8,
            details={"scenic": "Matter Valley Rack Rail"}
        ),
        ItineraryNode(
            id="node_hotel_1",
            name="Boutique Hotel Matterhorn Lodge",
            type=NodeType.RESERVATION,
            reservation_type=ReservationType.HOTEL,
            carrier="Matterhorn Hospitality",
            service_number="RES-88219",
            origin="Zermatt Dorf",
            destination="Zermatt Dorf",
            origin_coords=Coordinates(lat=45.9765, lng=7.7491),
            dest_coords=Coordinates(lat=45.9765, lng=7.7491),
            start_time="20:30",
            end_time="23:59",
            duration_minutes=209,
            cost=320.0,
            currency="EUR",
            status=NodeStatus.CONFIRMED,
            checkin_cutoff="21:00",  # CRITICAL ZERO-SLACK ANCHOR!
            cancellation_deadline="24h prior",
            refundable_amount=0.0,
            critical_anchor=True,
            details={"reception_closure": "21:00 strict cutoff without lockbox key code"}
        )
    ]

    edges = [
        ItineraryEdge(
            source_id="node_flight_1",
            target_id="node_transfer_1",
            min_connection_time=30,
            transfer_duration=15,
            relation="deplanes_to"
        ),
        ItineraryEdge(
            source_id="node_transfer_1",
            target_id="node_train_1",
            min_connection_time=20,
            transfer_duration=10,
            relation="boards"
        ),
        ItineraryEdge(
            source_id="node_train_1",
            target_id="node_train_2",
            min_connection_time=8,
            transfer_duration=5,
            relation="transfers_to"
        ),
        ItineraryEdge(
            source_id="node_train_2",
            target_id="node_hotel_1",
            min_connection_time=15,
            transfer_duration=15,
            relation="checks_into"
        )
    ]

    return Itinerary(
        id="itinerary_alpine_cascade",
        title="The Alpine Expedition: London to Zermatt",
        traveler_name="Elena Vance (Corporate / Leisure)",
        total_cost=700.0,
        currency="EUR",
        nodes=nodes,
        edges=edges,
        domino_risk_index=48.2
    )

def get_transatlantic_itinerary() -> Itinerary:
    """
    New York JFK -> Paris CDG -> Venice Cruise
    """
    nodes = [
        ItineraryNode(
            id="node_flight_jfk",
            name="Air France AF 007",
            type=NodeType.TRANSPORT,
            mode=TransportMode.FLIGHT,
            carrier="Air France",
            service_number="AF 007",
            origin="New York (JFK)",
            destination="Paris (CDG)",
            start_time="19:00",
            end_time="08:30",
            duration_minutes=450,
            cost=850.0,
            currency="USD",
            status=NodeStatus.CONFIRMED,
            mct_required=60
        ),
        ItineraryNode(
            id="node_flight_venice",
            name="Air France Connecting AF 1126",
            type=NodeType.TRANSPORT,
            mode=TransportMode.FLIGHT,
            carrier="Air France",
            service_number="AF 1126",
            origin="Paris (CDG)",
            destination="Venice Marco Polo (VCE)",
            start_time="10:15",
            end_time="11:55",
            duration_minutes=100,
            cost=190.0,
            currency="USD",
            status=NodeStatus.CONFIRMED,
            mct_required=45
        ),
        ItineraryNode(
            id="node_cruise_1",
            name="Mediterranean Serenissima Cruise Embarkation",
            type=NodeType.RESERVATION,
            reservation_type=ReservationType.EVENT,
            carrier="Serenissima Cruises",
            service_number="CRUISE-VCE-90",
            origin="Port of Venice",
            destination="Port of Venice",
            start_time="14:00",
            end_time="17:00",
            duration_minutes=180,
            cost=1450.0,
            currency="USD",
            checkin_cutoff="16:00",
            critical_anchor=True
        )
    ]
    edges = [
        ItineraryEdge(source_id="node_flight_jfk", target_id="node_flight_venice", min_connection_time=60, transfer_duration=30),
        ItineraryEdge(source_id="node_flight_venice", target_id="node_cruise_1", min_connection_time=90, transfer_duration=45)
    ]
    return Itinerary(
        id="itinerary_transatlantic",
        title="Transatlantic Luxury: NYC to Venice Cruise",
        traveler_name="Marcus Sterling",
        total_cost=2490.0,
        currency="USD",
        nodes=nodes,
        edges=edges,
        domino_risk_index=62.0
    )
