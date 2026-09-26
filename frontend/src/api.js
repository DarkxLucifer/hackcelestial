const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchItinerary() {
  try {
    const res = await fetch(`${API_BASE}/itinerary`);
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (err) {
    console.warn("Using offline fallback for fetchItinerary:", err);
    return null;
  }
}

export async function resetItinerary(scenario = "alpine") {
  try {
    const res = await fetch(`${API_BASE}/itinerary/reset?scenario=${scenario}`, {
      method: "POST"
    });
    if (!res.ok) throw new Error("Reset failed");
    return await res.json();
  } catch (err) {
    console.warn("Offline reset:", err);
    return null;
  }
}

export async function simulateDisruption(payload) {
  try {
    const res = await fetch(`${API_BASE}/disruption/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Simulation failed");
    return await res.json();
  } catch (err) {
    console.warn("Offline simulateDisruption:", err);
    return null;
  }
}

export async function fetchRecoveryPlans(weights) {
  try {
    const res = await fetch(`${API_BASE}/recovery/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(weights || {})
    });
    if (!res.ok) throw new Error("Recovery plans failed");
    return await res.json();
  } catch (err) {
    console.warn("Offline recovery plans:", err);
    return null;
  }
}

export async function commitRecoveryPlan(plan) {
  try {
    const res = await fetch(`${API_BASE}/recovery/commit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan })
    });
    if (!res.ok) throw new Error("Saga commit failed");
    return await res.json();
  } catch (err) {
    console.warn("Offline commit:", err);
    return null;
  }
}

export async function fetchGhostHolds() {
  try {
    const res = await fetch(`${API_BASE}/ghost-holds`);
    if (!res.ok) throw new Error("Failed to fetch ghost holds");
    return await res.json();
  } catch (err) {
    return {
      ghost_holds: [
        {
          hold_id: "HOLD-SBB-EXPRESS-75",
          service: "Swiss Federal Railways (SBB)",
          details: "Train IR 75 / IC 61 Zurich Airport -> Visp (Depart 18:32)",
          seats_held: 2,
          expires_in_minutes: 74,
          status: "RESERVED_GHOST",
          cancellation_penalty: 0.0,
          inventory_provider: "SBB Direct NDC Connect"
        },
        {
          hold_id: "HOLD-MGB-SHUTTLE-204",
          service: "Matterhorn Gotthard Bahn",
          details: "Priority Shuttle Visp -> Zermatt (Depart 20:55)",
          seats_held: 2,
          expires_in_minutes: 82,
          status: "RESERVED_GHOST",
          cancellation_penalty: 0.0,
          inventory_provider: "Swiss Travel Hub API"
        }
      ]
    };
  }
}

export async function fetchPassengerRights() {
  try {
    const res = await fetch(`${API_BASE}/passenger-rights`);
    if (!res.ok) throw new Error("Failed to fetch rights");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchTelemetryFeed() {
  try {
    const res = await fetch(`${API_BASE}/telemetry/feed`);
    if (!res.ok) throw new Error("Failed to fetch telemetry");
    return await res.json();
  } catch (err) {
    return {
      radar: {
        flight: "BA 712",
        tail_number: "G-TTNP (A320neo)",
        altitude_ft: 31000,
        groundspeed_kts: 455,
        departure_delay_mins: 65,
        estimated_touchdown_zrh: "17:50 CET",
        status: "GROUND_DELAY_PROGRAM_EN_ROUTE"
      },
      weather: {
        LHR: { condition: "Fog / Low Visibility", metar: "EGLL 261150Z 09006KT 3200 BR SCT004 12/10 Q1018" },
        ZRH: { condition: "Clear Sky / Calm", metar: "LSZH 261150Z 28004KT CAVOK 14/06 Q1020" }
      },
      mct_status: {
        ZRH_airport_rail_buffer: -10,
        flag: "BREACH_PREDICTED",
        prediction_confidence: "94.2%"
      }
    };
  }
}
