# ✈️ Voyage — Autonomous Multi-Modal Travel Resilience Engine

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![OR-Tools](https://img.shields.io/badge/Google%20OR--Tools-CP--SAT-4285F4.svg?logo=google&logoColor=white)](https://developers.google.com/optimization)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![XGBoost](https://img.shields.io/badge/XGBoost-ML%20Engine-EB6440.svg?logo=scikitlearn&logoColor=white)](https://xgboost.readthedocs.io/)

> **Voyage** is an autonomous, self-healing travel resilience engine engineered for modern multi-modal journeys across commercial aviation, high-speed rail, regional transit shuttles, and hospitality check-in locks.

---

## 🧭 Problem Statement

Modern travel consists of tightly coupled multi-modal bookings across airlines, railways, hotels, and ground transfers. A disruption in one leg creates a domino cascade: a 65-minute ground delay at London Heathrow or an unannounced signal failure outside Panvel causes a missed connecting rail transfer, which cascades to downstream hotel check-ins closing strictly at night, leaving travelers stranded.

Travelers currently must manually identify affected downstream bookings, decipher complex fare and refund policies, scramble for alternatives, calculate out-of-pocket costs, and reorganize remaining plans.

**Voyage solves this end-to-end autonomously.**

---

## 🌟 Core Architectural Innovations

### 1. Spatio-Temporal Knowledge Graph (STKG) & Temporal DAG (TDAG)
- Models multi-modal itineraries as a directed graph $G = (V, E, \mathcal{T}, \mathcal{S})$ partitioned into transport vertices ($V_{\text{trans}}$), fixed reservation anchors ($V_{\text{res}}$), and flexible buffer nodes ($V_{\text{flex}}$).
- Directed edges enforce strict Minimum Connection Time ($\tau_{\text{MCT}}$) and spatial transfer requirements across hubs.

### 2. Real-Time Critical Path Method (CPM) Forward & Backward Slack
- Continuous forward and backward passes calculate Earliest Start ($ES$), Earliest Finish ($EF$), Latest Start ($LS$), and Latest Finish ($LF$).
- Net Temporal Slack:
  $$\sigma_{ij} = t_{\text{start}}(v_j) - t_{\text{end}}(v_i) - \tau_{\text{transit}}(s_i, s_j)$$
- When upstream delay $\delta_k > \text{Slack}(v_k)$, topological ripple propagation identifies the complete blast radius in $\mathcal{O}(|V| + |E|)$ time hours before carriers issue official warnings.

### 3. Domino Risk Index (DRI 0–100)
- Predicts structural vulnerability using carrier historical delay factor ($\lambda_i$) and downstream zero-slack bottleneck multipliers ($\Omega(v_{i+1})$):
  $$\text{DRI} = 100 \times \left( 1 - \exp\left( -\sum_{i=1}^{N-1} \frac{\lambda_i}{\max(\sigma_i - \tau_{\text{MCT}, i}, 1)} \cdot \Omega(v_{i+1}) \right) \right)$$

### 4. XGBoost Delay Engine & Weather-Driven Digital Twin
- Combines live Open-Meteo atmospheric telemetry (rainfall rate, convective storm cells, temperature, and wind speed) with machine learning trees to isolate primary weather delay minutes from turnaround ripple cascades.
- Proactively generates risk-weighted recovery predictions before departure.

### 5. Multi-Modal Document Extraction & Live Transit Ingestion
- Zero-friction parsing of PDFs, images, and text tickets using a resilient cascading AI architecture (Gemini with automatic Groq failover and fallback rule-based regex parsers).
- Ingests real telemetry across Indian Railways (RailRadar), AviationStack (flights), MSRTC & intercity buses, and GTFS metro transit under a unified corridor view.

### 6. Google OR-Tools CP-SAT Combinatorial Multi-Objective Solver
- Explores the 4-dimensional Pareto frontier:
  $$\min \mathbf{F}(\mathbf{x}) = [w_{\text{cost}} f_{\text{cost}}, w_{\text{time}} f_{\text{time}}, w_{\text{intent}} f_{\text{intent\_drift}}, -w_{\text{comfort}} f_{\text{comfort}}]^T$$
- Synthesizes distinct actionable alternatives:
  - **Cheapest Plan**: Budget intermodal relay via confirmed state road/rail corridors, minimizing out-of-pocket expenses.
  - **Medium Plan (Balanced)**: Next-carrier bank protection, synchronized hotel check-in extension, and zero cancellation penalties.
  - **Fastest Plan (Priority)**: Earliest unconstrained corridor bypass via express high-speed rail or direct airline rerouting.

### 7. Deterministic Statutory Passenger Rights & Digital TDR Filing
- **Indian Railways / IRCTC**: Automated calculation of refundable fare amounts under Railway Passenger Charter and one-click Ticket Deposit Receipt (TDR) guidance.
- **EU / UK Regulation 261/2004**: Automated €250, €400, or €600 compensation claim dossier assembly.
- **2024 U.S. DOT 14 CFR Part 260**: Automatic prompt cash refund enforcement.

### 8. Atomic Distributed Saga Orchestration & Dynamic Carto GIS Mapping
- Pre-secures backup inventory with zero upfront cancellation penalty using 90-minute conditional holds.
- Commits multi-vendor rebookings atomically using the **Saga Pattern** with compensating rollback actions.
- Interactive vector journey map rendering live route polylines and weather overlays without default clutter.

---

## 📁 Repository Structure

```
hackcelestial/
├── backend/
│   ├── main.py               # FastAPI application & REST endpoints
│   ├── models.py             # Pydantic domain models for TDAG, disruptions & recovery
│   ├── graph_engine.py       # Spatio-temporal graph & CPM slack calculator
│   ├── domino_risk.py        # Domino Risk Index (DRI 0-100) mathematical engine
│   ├── optimizer.py          # Google OR-Tools CP-SAT multi-objective solver
│   ├── ai_engine.py          # Multimodal ticket parsing & LLM resilience cascades
│   ├── database.py           # SQLite persistence for external disruptions & tickets
│   ├── rights_engine.py      # IRCTC, EU261, UK261, US DOT & Rail rights evaluation
│   ├── ghost_holds.py        # Contingency inventory reservation manager
│   ├── saga_orchestrator.py  # Distributed Saga execution & rollback coordinator
│   └── scenarios.py          # Multi-modal disruption itineraries
├── frontend/
│   ├── public/               # Static assets (plane.png, voyage_logo.png)
│   ├── src/
│   │   ├── components/       # Core UI (Navbar, CartoJourneyMap, DemoJourneyGraph)
│   │   ├── disruption/       # DisruptionChatbot, DisruptionScenarioSimulator, MultiModalTravelTool
│   │   ├── api.js            # Axios/Fetch API client bindings
│   │   ├── App.jsx           # Main application coordinator
│   │   └── main.jsx          # React entry point
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Tailwind styling tokens
│   └── vite.config.js        # Vite bundler configuration
├── requirements.txt          # Python backend dependencies
├── run_app.py                # Single-command unified production server
└── README.md
```

---

## 🚀 Quickstart & Setup

### Prerequisites
- Python 3.10+ (`uv` recommended)
- Node.js 18+ (optional, production bundle is pre-built in `frontend/dist`)

### 1. Install Backend Dependencies
```bash
uv pip install -r requirements.txt
```
*(or `pip install -r requirements.txt`)*

### 2. Run the Unified Platform
```bash
uv run run_app.py
```
*(or `python run_app.py`)*

Open your browser at:
- **Full Application UI**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive OpenAPI Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. Frontend Development (Hot-Reloading)
```bash
cd frontend
npm install
npm run dev
```
Development server runs at `http://localhost:5173`.

---

## 🏆 Project Details
- **Project**: Voyage (Autonomous Multi-Modal Travel Resilience Engine)
- **Platform**: Multi-Modal TDAG • CPM Slack Analysis • Google OR-Tools CP-SAT • Distributed Saga Pattern • XGBoost Delay Trees • Deterministic Passenger Rights Engine
