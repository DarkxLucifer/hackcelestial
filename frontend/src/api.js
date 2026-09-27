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

// ==============================================================================
// WEATHER DIGITAL TWIN & NUGEN INTELLIGENCE API CLIENTS
// ==============================================================================

export async function fetchLiveWeather(location = "BOM", lat = null, lon = null) {
  try {
    let url = `${API_BASE}/weather/live?location=${encodeURIComponent(location)}`;
    if (lat !== null && lon !== null && typeof lat === 'number' && typeof lon === 'number') {
      url += `&lat=${lat}&lon=${lon}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather API failed");
    return await res.json();
  } catch (err) {
    console.warn("Weather API fallback:", err);
    return null;
  }
}

export async function fetchLiveCorridor(origin = "NGP", destination = "BOM", carrier = "IndiGo Airlines", service = "6E 534", isRail = 0) {
  try {
    const url = `${API_BASE}/weather/live-corridor?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&carrier=${encodeURIComponent(carrier)}&service=${encodeURIComponent(service)}&is_rail=${isRail}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Live corridor weather API failed");
    return await res.json();
  } catch (err) {
    console.warn("Live corridor fallback:", err);
    return null;
  }
}

export async function simulateDigitalTwin(params) {
  try {
    const res = await fetch(`${API_BASE}/digital-twin/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Digital Twin simulation failed");
    return await res.json();
  } catch (err) {
    console.warn("Digital Twin fallback:", err);
    return null;
  }
}

export async function fetchXGBoostPresets() {
  try {
    const res = await fetch(`${API_BASE}/weather/xgboost-presets`);
    if (!res.ok) throw new Error("Failed to fetch XGBoost presets");
    return await res.json();
  } catch (err) {
    console.warn("XGBoost presets fallback:", err);
    return null;
  }
}

export async function simulateXGBoostScenario(params) {
  try {
    const res = await fetch(`${API_BASE}/weather/xgboost-simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("XGBoost simulation failed");
    return await res.json();
  } catch (err) {
    console.warn("XGBoost simulation fallback:", err);
    return null;
  }
}

export async function fetchSocialSignals(corridor = "Nagpur ➔ Mumbai CSMT") {
  try {
    const res = await fetch(`${API_BASE}/social-signals/live?corridor=${encodeURIComponent(corridor)}`);
    if (!res.ok) throw new Error("Social signals API failed");
    return await res.json();
  } catch (err) {
    console.warn("Social signals fallback:", err);
    return { signals: [] };
  }
}

export async function fetchNugenStatus() {
  try {
    const res = await fetch(`${API_BASE}/nugen/status`);
    if (!res.ok) throw new Error("Nugen status failed");
    return await res.json();
  } catch (err) {
    console.warn("Nugen status fallback:", err);
    return null;
  }
}

export async function triggerNugenAlignment(apiKey) {
  try {
    const res = await fetch(`${API_BASE}/nugen/trigger-alignment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey })
    });
    if (!res.ok) throw new Error("Nugen trigger alignment failed");
    return await res.json();
  } catch (err) {
    console.warn("Nugen alignment fallback:", err);
    return null;
  }
}

export async function queryNugenChat(query, model) {
  try {
    const res = await fetch(`${API_BASE}/nugen/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, model })
    });
    if (!res.ok) throw new Error("Nugen chat failed");
    return await res.json();
  } catch (err) {
    console.warn("Nugen chat fallback:", err);
    return null;
  }
}

export async function fetchNugenCorpus() {
  try {
    const res = await fetch(`${API_BASE}/nugen/corpus`);
    if (!res.ok) throw new Error("Nugen corpus failed");
    return await res.json();
  } catch (err) {
    console.warn("Nugen corpus fallback:", err);
    return null;
  }
}

// ==============================================================================
// REAL MULTI-MODAL BOOKING & RESERVATIONS API
// ==============================================================================

export async function searchBookingInventory({ origin = "Mumbai (BOM)", destination = "Delhi (DEL)", date, mode = "all" } = {}) {
  try {
    const params = new URLSearchParams({ origin, destination, mode });
    if (date) params.append("date", date);
    const res = await fetch(`${API_BASE}/booking/search?${params.toString()}`);
    if (!res.ok) throw new Error("Booking search failed");
    return await res.json();
  } catch (err) {
    console.warn("Using offline fallback for searchBookingInventory:", err);
    return null;
  }
}

export async function createBooking(payload) {
  try {
    const res = await fetch(`${API_BASE}/booking/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Booking creation failed");
    return await res.json();
  } catch (err) {
    console.warn("Offline createBooking error:", err);
    return null;
  }
}

export async function fetchBookingsList() {
  try {
    const res = await fetch(`${API_BASE}/booking/list`);
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return await res.json();
  } catch (err) {
    console.warn("Using offline fallback for fetchBookingsList:", err);
    return null;
  }
}

export async function fetchBookingDetails(bookingRef) {
  try {
    const res = await fetch(`${API_BASE}/booking/${encodeURIComponent(bookingRef)}`);
    if (!res.ok) throw new Error("Failed to fetch booking details");
    return await res.json();
  } catch (err) {
    console.warn("Offline fetchBookingDetails error:", err);
    return null;
  }
}

export async function cancelBooking(bookingRef) {
  try {
    const res = await fetch(`${API_BASE}/booking/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_ref: bookingRef })
    });
    if (!res.ok) throw new Error("Cancellation failed");
    return await res.json();
  } catch (err) {
    console.warn("Offline cancelBooking error:", err);
    return null;
  }
}


