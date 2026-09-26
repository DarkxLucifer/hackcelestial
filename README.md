# ✈️ YATAR — Intelligent Travel Disruption Recovery Engine

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![OR-Tools](https://img.shields.io/badge/Google%20OR--Tools-CP--SAT-4285F4.svg?logo=google&logoColor=white)](https://developers.google.com/optimization)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **YATAR** is an autonomous, self-healing travel resilience engine engineered for modern multi-modal journeys (commercial aviation, high-speed rail, private transit shuttles, hospitality check-in locks, and timed activities).

---

## 🧭 Problem Statement

Modern travel consists of tightly coupled multi-modal bookings across airlines, railways, hotels, and ground transfers. A disruption in one component creates a domino cascade: a 65-minute ground delay at London Heathrow causes a missed connecting rail transfer in Zurich, which cascades to Zermatt where hotel check-in closes strictly at 21:00, leaving travelers stranded late at night.

Travelers currently must manually identify affected downstream bookings, decipher complex fare and refund policies, scramble for alternatives, calculate out-of-pocket costs, and reorganize remaining plans.

**YATAR solves this end-to-end autonomously.**

---

## 🌟 Core Architectural Innovations

### 1. Spatio-Temporal Knowledge Graph (STKG) & Temporal DAG (TDAG)
- Models multi-modal itineraries as a directed graph $G = (V, E, \mathcal{T}, \mathcal{S})$ partitioned into transport vertices ($V_{\text{trans}}$), fixed reservation anchors ($V_{\text{res}}$), and flexible buffer nodes ($V_{\text{flex}}$).
- Directed edges enforce strict Minimum Connection Time ($\tau_{\text{MCT}}$) and spatial transfer requirements.

### 2. Real-Time Critical Path Method (CPM) Forward & Backward Slack
- Continuous forward and backward passes calculate Earliest Start ($ES$), Earliest Finish ($EF$), Latest Start ($LS$), and Latest Finish ($LF$).
- Net Temporal Slack:
  $$\sigma_{ij} = t_{\text{start}}(v_j) - t_{\text{end}}(v_i) - \tau_{\text{transit}}(s_i, s_j)$$
- When upstream delay $\delta_k > \text{Slack}(v_k)$, topological ripple propagation identifies the complete blast radius in $\mathcal{O}(|V| + |E|)$ time hours before carriers issue official warnings.

### 3. Domino Risk Index (DRI 0–100)
- Predicts structural vulnerability using carrier historical delay factor ($\lambda_i$) and downstream zero-slack bottleneck multipliers ($\Omega(v_{i+1})$):
  $$\text{DRI} = 100 \times \left( 1 - \exp\left( -\sum_{i=1}^{N-1} \frac{\lambda_i}{\max(\sigma_i - \tau_{\text{MCT}, i}, 1)} \cdot \Omega(v_{i+1}) \right) \right)$$

### 4. Google OR-Tools CP-SAT Combinatorial Multi-Objective Solver
- Explores the 4-dimensional Pareto frontier:
  $$\min \mathbf{F}(\mathbf{x}) = [w_{\text{cost}} f_{\text{cost}}, w_{\text{time}} f_{\text{time}}, w_{\text{intent}} f_{\text{intent\_drift}}, -w_{\text{comfort}} f_{\text{comfort}}]^T$$
- Curates the **Tri-Archetype Decision Framework**:
  - **Plan A: The Sprint** — Fastest arrival, intermodal high-speed rail via Bern, digital keypass check-in.
  - **Plan B: The Balanced Plan** — Full carrier protection, zero out-of-pocket, smart concierge rescheduling.
  - **Plan C: The Rest Anchor** — Duty-of-care 4-star airport hotel voucher, +€250 statutory cash compensation, scenic morning panoramic train.

### 5. Deterministic Statutory Passenger Rights & Parametric Liquidity Advance
- **EU / UK Regulation 261/2004**: Automated €250, €400, or €600 compensation claim dossier assembly.
- **2024 U.S. DOT 14 CFR Part 260**: Automatic prompt cash refund enforcement.
- **European Rail Passenger Rights (Reg 2021/782)**: Automatic 25%–50% delay compensation.
- **Parametric Liquidity Bridge**: Advances capital against pending airline payouts to travelers' digital wallets instantly with zero personal credit lockup.

### 6. JIT Ghost Holds & Atomic Distributed Saga Orchestration
- Pre-secures backup inventory with zero upfront cancellation penalty using 90-minute conditional NDC holds.
- Commits multi-vendor rebookings atomically using the **Saga Pattern** with compensating rollback actions.

### 7. Signature Aeroplane Elevating Scroll-Pull Landing Interface
- Cinematic tropical flight canvas with synchronized airplane hoisting choreography.
- The 3D curved content sheet is anchored just below the airliner, gliding upward in tandem to reveal the full resilience platform.

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
│   ├── rights_engine.py      # EU261, UK261, US DOT & Rail rights evaluation
│   ├── ghost_holds.py        # Contingency inventory reservation manager
│   ├── saga_orchestrator.py  # Distributed Saga execution & rollback coordinator
│   └── scenarios.py          # Preset multi-modal disruption itineraries
├── frontend/
│   ├── public/               # Static assets (plane.png, island.jpg)
│   ├── src/
│   │   ├── components/       # React UI components (PeeledSheetPull, Hero, Graph, etc.)
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
- Python 3.10+
- Node.js 18+ (optional, production bundle is pre-built in `frontend/dist`)

### 1. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Unified Platform
```bash
python run_app.py
```

Open your browser at:
- **Full Application UI**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive OpenAPI Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. Frontend Development (Optional for Hot-Reloading)
```bash
cd frontend
npm install
npm run dev
```
Development server runs at `http://localhost:5173`.

---

## 🏆 Hackathon Details
- **Project**: YATAR (Travel Disruption Recovery Engine)
- **Hackathon**: Celestial Hackathon 2026
- **Architecture**: Multi-Modal TDAG • CPM Slack Analysis • Google OR-Tools CP-SAT • Distributed Saga Pattern • Deterministic Passenger Rights Engine
