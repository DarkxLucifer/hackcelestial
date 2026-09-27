"""
Generates domain-specific benchmark evaluation datasets for Nugen Intelligence.
STRICT SCHEMA SPECIFICATION:
Each question object MUST have exactly these fields:
[
  {
    "question_num": 1,
    "question": "What is...",
    "answer": "The answer is..."
  }
]
question_num (integer), question (string), answer (string) are required.
No extra fields (no id, prompt, reference, category) so Nugen schema validation passes 100%.

Outputs:
- data/nugen_upload_pack/nugen_domain_benchmark.json
- data/nugen_upload_pack/nugen_domain_benchmark.jsonl
- data/nugen_upload_pack/nugen_domain_benchmark.csv
- data/nugen/nugen_domain_benchmark.json
- data/nugen/nugen_domain_benchmark.jsonl
- data/nugen/nugen_domain_benchmark.csv
"""

import json
import csv
from pathlib import Path

BENCHMARK_PAIRS = [
    {
        "question_num": 1,
        "question": "What is the historical weather delay rate and average delay duration for departures at Chicago O'Hare (ORD)?",
        "answer": "Chicago O'Hare (ORD) records an average weather delay rate of 1.9% to 2.1% across departures, with an average delay duration of 61.2 minutes when impacted by adverse weather. Severe winter snowstorms and mandatory de-icing operations push average turnaround delays up to 78 minutes."
    },
    {
        "question_num": 2,
        "question": "How do convective summer thunderstorms in Atlanta (ATL) differ in delay impact compared to winter blizzards at Chicago O'Hare (ORD)?",
        "answer": "Atlanta (ATL) summer convective storms are characterized by high intensity but short duration (45-90 minutes), triggering sudden ground stops and ramp closures due to lightning. Aircraft turnaround stalls sharply, but operations recover within 2-3 hours after the squall line clears. In contrast, ORD winter blizzards last 6-18 hours with prolonged de-icing queues, higher cancellation rates (3.8% vs 1.1%), and compounding multi-leg delays."
    },
    {
        "question_num": 3,
        "question": "If Flight AA114 arrives 65 minutes late at ORD and the traveler has an intermodal Amtrak train scheduled with 30 minutes of slack, what is the net connection outcome?",
        "answer": "The 30-minute slack is completely exhausted, resulting in a net missed connection of -35 minutes. Under Voyage multi-modal resilience logic, the engine detects this critical slack breach before landing, places a Ghost Hold on the subsequent rail departure (Amtrak Regional +90m), and alerts the hotel of a revised arrival time."
    },
    {
        "question_num": 4,
        "question": "How does low marine layer fog at San Francisco International Airport (SFO) affect runway acceptance rates and flight schedules?",
        "answer": "Because SFO's parallel runways are separated by only 750 feet, low cloud ceiling and marine fog prevent simultaneous visual approaches. FAA Ground Delay Programs (GDP) reduce Arrival Acceptance Rates (AAR) by up to 50% (from 60 arrivals/hour down to 30), producing average departure ground delays of 58 minutes across feeder West Coast routes."
    },
    {
        "question_num": 5,
        "question": "Under DGCA CAR Section 3 and EU261 regulations, what statutory passenger protections apply when a flight is delayed over 4 hours due to weather?",
        "answer": "Adverse meteorological conditions are categorized as extraordinary circumstances (force majeure), exempting airlines from statutory fixed cash compensation. However, airlines remain strictly obligated to provide 'Duty of Care': free meals, refreshments, telecommunication access, and hotel accommodation with ground transfers if an overnight stay becomes necessary."
    },
    {
        "question_num": 6,
        "question": "What is the primary operational cause of Late Aircraft Turnaround Delay compounding across multiple legs?",
        "answer": "When an aircraft's scheduled turnaround time at the gate (typically 45-55 minutes for narrow-body aircraft) is smaller than the inbound arrival delay, the remaining delay is directly transferred to the next departure leg. This creates a downstream domino effect, often propagating through 3 to 5 subsequent legs before an overnight buffer halts the ripple."
    },
    {
        "question_num": 7,
        "question": "At what projected arrival time does the Voyage resilience engine trigger an automated hotel late check-in notification?",
        "answer": "If simulated or actual flight delay pushes the estimated hotel arrival past 21:00 (9:00 PM) local time, Voyage initiates an automated priority check-in notice. If projected arrival slips past 22:00 (10:00 PM), it flags a 'BREACH_CRITICAL' forfeiture hazard and dispatches a verified late check-in guarantee to prevent reservation cancellation."
    },
    {
        "question_num": 8,
        "question": "What is a 'Ghost Hold' in the Voyage Autonomous Resilience framework?",
        "answer": "A Ghost Hold is a soft, zero-penalty provisional hold automatically secured on alternative transportation inventory (e.g. an express rail seat or subsequent flight departure) while the original journey is still underway. It gives the passenger guaranteed backup seating without requiring an immediate non-refundable purchase until connection breach is certain."
    },
    {
        "question_num": 9,
        "question": "In the Digital Twin What-If simulator, how does a rainfall intensity of 35 mm/h impact runway operations and taxi times?",
        "answer": "35 mm/h represents torrential downpour conditions. Runway braking friction degrades to 'Medium to Poor', requiring increased aircraft landing separation. Airport arrival capacity drops by 35-50%, base delays increase by 45-75 minutes, and ground taxi-in/taxi-out times increase by an average of 18 minutes due to reduced surface towing and visibility."
    },
    {
        "question_num": 10,
        "question": "What is the Minimum Connection Time (MCT) standard applied between an incoming domestic flight and an onward rail departure?",
        "answer": "The recommended intermodal MCT standard is 60 minutes for co-located airport-rail stations (e.g. Frankfurt FRA, Newark EWR) and 90 to 120 minutes when cross-city transfer is required (e.g. JFK to Penn Station, or Mumbai BOM to CSMT). If delay reduces connection buffer below 30 minutes, connection probability falls below 20%."
    },
    {
        "question_num": 11,
        "question": "How do winter blizzards at Denver International Airport (DEN) propagate across regional hub networks?",
        "answer": "Because Denver is a major high-altitude hub with extensive mountain feeder traffic (e.g., Aspen, Vail, Colorado Springs), blizzards at DEN lead to high turnaround delays averaging 56.4 minutes. Over 71% of weather delays at DEN result in late turnaround propagation to regional and transcontinental routes, peaking in network disruptions 4 to 6 hours after storm onset."
    },
    {
        "question_num": 12,
        "question": "Under what condition does US Department of Transportation (DOT) rule 14 CFR Part 259 require carriers to provide deplaning during tarmac delays?",
        "answer": "For domestic flights, airlines must provide passengers the opportunity to deplane before the tarmac delay exceeds 3 hours. For international flights, the limit is 4 hours. Carriers must also provide food and potable water no later than 2 hours after tarmac delay begins, along with operable lavatories and adequate medical attention."
    },
    {
        "question_num": 13,
        "question": "How does the Voyage multi-modal engine evaluate switching an air passenger to express rail during severe weather ground stops?",
        "answer": "When airport weather causes projected departure delays exceeding 90 minutes on short-haul corridors (<500 km, e.g. New York to Washington, or Mumbai to Pune), high-speed or express rail often delivers equal or faster door-to-door arrival with 98% lower weather cancellation probability. The engine verifies seat availability and calculates net arrival delta before recommending the switch."
    },
    {
        "question_num": 14,
        "question": "What is the historical diversion rate during severe weather, and which alternate airports serve as primary diversions for Chicago ORD?",
        "answer": "Nationwide, weather-related flight diversions occur in approximately 0.28% of all flights during severe weather events. For Chicago ORD, standard designated diversion airports include Milwaukee General Mitchell (MKE), Indianapolis (IND), and Rockford (RFD), which absorb diverted air traffic during prolonged runway snow clearing."
    },
    {
        "question_num": 15,
        "question": "How does the Voyage Saga recovery pattern ensure data consistency when executing multi-service re-bookings?",
        "answer": "The Saga pattern orchestrates distributed transactions across disparate travel APIs (airline PNR, rail ticketing, hotel PMS) using compensating transactions. If a subsequent rail booking fails after an airline flight cancellation is confirmed, the Saga engine triggers automatic rollback compensations to prevent orphaned tickets or stranded financial liability."
    },
    {
        "question_num": 16,
        "question": "What impact does wind shear and sustained crosswinds over 35 knots have on Dallas/Fort Worth (DFW) arrivals?",
        "answer": "At DFW, sustained crosswinds or gust fronts from severe supercells force the tower to close crosswind runways and operate in single-direction configurations. Arrival spacing increases by 4 to 6 nautical miles, leading to an average delay increase of 42 minutes and holding pattern fuel diversions to AUS or SAT."
    },
    {
        "question_num": 17,
        "question": "How does Indian Railways track waterlogging during monsoon in Mumbai (e.g. Kurla, Sion, Kalyan) impact multi-modal connections to Chhatrapati Shivaji Maharaj International Airport (BOM)?",
        "answer": "Waterlogging on Central and Western suburban and mail lines restricts train speeds to 10-15 km/h, causing cumulative rail delays of 60 to 180 minutes. Travelers connecting from trains to BOM departures frequently face missed check-in cutoffs. The Voyage system enforces an expanded 120-minute buffer and recommends road-based express bypasses when track water levels exceed 100mm."
    },
    {
        "question_num": 18,
        "question": "What is the delay threshold after which EU261 mandates reimbursement or alternative routing for a delayed flight?",
        "answer": "Under EU261 Article 8, if a flight delay reaches 5 hours or more, the passenger has the legal right to cancel the trip and receive a full refund within 7 days for the part of the journey not made, along with a return flight to the first point of departure if the purpose of travel is lost."
    },
    {
        "question_num": 19,
        "question": "How does the Nugen-aligned Voyage model calculate connection confidence score on a multi-leg journey?",
        "answer": "Connection confidence is computed using an itinerary Directed Acyclic Graph (DAG) that evaluates scheduled buffer minus predicted delay distribution. If slack exceeds 45 minutes, confidence is >90% (Green). If slack drops between 15-45 minutes, confidence degrades to 50-80% (Amber). If slack is under 15 minutes, confidence drops below 30% (Critical Red)."
    },
    {
        "question_num": 20,
        "question": "Why does a 40-minute morning departure delay from New York JFK frequently result in evening cancellation of subsequent legs?",
        "answer": "Because narrow-body commercial airliners operate tight multi-hop rotations (e.g. JFK-MIA-BOS-ORD), each turnaround consumes 10-15 minutes of spare buffer. By leg 4 or 5, cumulative late aircraft delay reaches 90-120 minutes. If this causes the crew to exceed FAA maximum duty time limits (Part 117), the flight faces mandatory cancellation due to crew timeout."
    }
]

def main():
    out_dirs = [
        Path("data/nugen_upload_pack"),
        Path("data/nugen")
    ]

    for d in out_dirs:
        d.mkdir(parents=True, exist_ok=True)
        
        # 1. Standard JSON benchmark file matching Nugen exact schema:
        # [{"question_num": 1, "question": "...", "answer": "..."}]
        json_path = d / "nugen_domain_benchmark.json"
        json_path.write_text(json.dumps(BENCHMARK_PAIRS, indent=2), encoding="utf-8")
        print(f"Wrote exact Nugen schema JSON: {json_path} ({len(BENCHMARK_PAIRS)} pairs)")

        # 2. JSONL benchmark file (one JSON object per line)
        jsonl_path = d / "nugen_domain_benchmark.jsonl"
        with open(jsonl_path, "w", encoding="utf-8") as f:
            for pair in BENCHMARK_PAIRS:
                f.write(json.dumps({
                    "question_num": pair["question_num"],
                    "question": pair["question"],
                    "answer": pair["answer"]
                }) + "\n")
        print(f"Wrote exact Nugen schema JSONL: {jsonl_path}")

        # 3. CSV benchmark file (question_num, question, answer)
        csv_path = d / "nugen_domain_benchmark.csv"
        with open(csv_path, "w", encoding="utf-8", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["question_num", "question", "answer"])
            for pair in BENCHMARK_PAIRS:
                writer.writerow([pair["question_num"], pair["question"], pair["answer"]])
        print(f"Wrote exact Nugen schema CSV: {csv_path}")

    print("Benchmark evaluation files successfully rewritten to exact Nugen schema!")

if __name__ == "__main__":
    main()
