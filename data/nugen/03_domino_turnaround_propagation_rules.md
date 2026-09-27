# Domino Turnaround Propagation & Multi-Modal Resilience Rules
## Architectural Rules for Autonomous Disruption Management

### 1. Tail Routing Domino Multiplier
Commercial airframes execute 4 to 6 discrete flight legs per calendar day. When Leg 1 sustains a weather delay:
- **Delay Absorption**: Turnaround buffers at hub gates are typically 40-55 minutes. Delays under 30 minutes are partially absorbed.
- **Critical Threshold (>45 minutes)**: When weather delay exceeds 45 minutes, absorption capacity collapses. 100% of remaining delay propagates to Leg 2.
- **Late Aircraft Correlation Factor**: Empirical data confirms that 71.4% of weather delays create compounding late aircraft turnaround delays on subsequent legs.
- **Crew Duty Limitations (FAR Part 117 / DGCA CAR)**: Flights delayed past 90 minutes carry a 34% risk of flight crew duty-time expiration, escalating a delay into a structural overnight cancellation.

### 2. Multi-Modal Inter-Connection Thresholds
When an air journey connects to regional transit (Express Train, Long-Distance Rail, Inter-City Coach, Ferry):
- **Standard Connection Minimum**: 45 minutes for domestic flights; 90 minutes for international customs/baggage.
- **Weather-Compounded Buffer**: If departure airport reports rain >10 mm/h or winds >35 km/h, the required Minimum Connection Time (MCT) must be dynamically expanded by +35 minutes.
- **Autonomous Ghost Hold Trigger**: If projected arrival time exceeds transfer departure time minus MCT, the system must trigger automated provisional holds on next-available high-speed train or luxury coach corridors.

### 3. Hospitality & Hotel Late Check-in Protection
- **Check-in Cutoff Danger Zone**: European and Indian boutique and resort hotels maintain rigid front-desk cutoffs at 21:00 to 23:00 local time.
- **No-Show Cancellation Risk**: If final arrival is delayed past 22:00, automated reservation systems mark guests as 'No Show', releasing rooms and imposing 100% penalty fees.
- **Autonomous Twin Action**: The Voyage Digital Twin must dispatch an authenticated hotel late check-in notification when cumulative itinerary delay breaches 45 minutes, locking the reservation until 03:00 AM.