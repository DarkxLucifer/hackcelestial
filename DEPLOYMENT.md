# Voyage AI — Free Cloud Deployment Guide

This project is completely production-ready and deployed on modern cloud hosting providers.

## 🟢 Live Production Deployments

- **Frontend (Live on Vercel)**: **[https://frontend-eight-beta-dvinkob29r.vercel.app](https://frontend-eight-beta-dvinkob29r.vercel.app)**
- **Backend API (Live on Render)**: **[https://hackcelestial-dm4q.onrender.com](https://hackcelestial-dm4q.onrender.com)**
- **Interactive Swagger API Docs**: **[https://hackcelestial-dm4q.onrender.com/docs](https://hackcelestial-dm4q.onrender.com/docs)**
- **GitHub Repository**: **[https://github.com/DarkxLucifer/hackcelestial](https://github.com/DarkxLucifer/hackcelestial)**

---

## 🚀 Option 1: Vercel (Frontend) + Render (Backend) — *Recommended*

This is the standard, best-practice architecture:
- **Frontend** runs on **Vercel** (Global edge CDN, instant loads, free SSL, zero maintenance).
- **Backend** runs on **Render** (Free Python Web Service, free SSL, automatic git deploys).

---

### Step 1: Deploy Backend to Render (Free)

1. Go to **[Render.com](https://render.com/)** and sign in (using GitHub).
2. Click **New +** ➔ **Web Service**.
3. Connect your repository: `https://github.com/DarkxLucifer/hackcelestial`.
4. Configure the service settings:
   - **Name**: `voyage-resilience-backend` (or your choice)
   - **Region**: Oregon (US West) or Frankfurt (EU)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free** ($0/month)
5. Under **Environment Variables**, add:
   - `PYTHON_VERSION`: `3.11.9`
   - `HOST`: `0.0.0.0`
   - *(Optional)* `GEMINI_API_KEY`: *(your Gemini key if using Gemini)*
   - *(Optional)* `GROQ_API_KEY`: *(your Groq key if using Groq)*
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide your public URL, e.g.:
   ```
   https://voyage-resilience-backend.onrender.com
   ```
   *(Test it in your browser: `https://voyage-resilience-backend.onrender.com/docs` to see Swagger API documentation).*

---

### Step 2: Deploy Frontend to Vercel (Free)

1. Go to **[Vercel.com](https://vercel.com/)** and sign in with GitHub.
2. Click **Add New…** ➔ **Project**.
3. Import your GitHub repository: `hackcelestial`.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Build Command**: `npm run build` *(auto-detected)*
   - **Output Directory**: `dist` *(auto-detected)*
5. Open **Environment Variables** and add:
   - **Key**: `VITE_BACKEND_URL`
   - **Value**: `https://voyage-resilience-backend.onrender.com` *(your Render backend URL from Step 1)*
6. Click **Deploy**.
7. In ~30 seconds, Vercel gives you your live production URL (e.g. `https://hackcelestial.vercel.app`)!

---

## 🐳 Option 2: Single All-in-One Container (Render / Koyeb / Railway)

If you prefer to host **both the React frontend and FastAPI backend inside a single free container**:

The repository includes a production multi-stage [`Dockerfile`](file:///d:/project/aiml%20prime/project/hackcelestial/Dockerfile) that:
1. Builds the React frontend bundle.
2. Installs Python dependencies.
3. Automatically serves the static React frontend from FastAPI while exposing all API endpoints at `/api/...`.

### Deploying the Dockerfile on Render:
1. In Render, click **New +** ➔ **Web Service**.
2. Select repository `hackcelestial`.
3. Choose **Docker** as the environment.
4. Select the **Free** tier and click **Deploy**.

### Deploying on Koyeb (Free):
1. Sign in to **[Koyeb.com](https://www.koyeb.com/)**.
2. Click **Create App** ➔ **GitHub**.
3. Select `hackcelestial` with Docker builder.
4. Select the **Nano (Free)** instance type and deploy.

---

## 🛠️ Configuration Files Included in Repository

| File | Purpose |
| :--- | :--- |
| [`requirements.txt`](file:///d:/project/aiml%20prime/project/hackcelestial/requirements.txt) | Production Python dependencies for FastAPI, XGBoost, NetworkX, OR-Tools, etc. |
| [`render.yaml`](file:///d:/project/aiml%20prime/project/hackcelestial/render.yaml) | Render Blueprint for 1-click backend deployment. |
| [`frontend/vercel.json`](file:///d:/project/aiml%20prime/project/hackcelestial/frontend/vercel.json) | Vercel SPA rewrite rules for `/booking`, `/profile`, and `/disruption`. |
| [`Dockerfile`](file:///d:/project/aiml%20prime/project/hackcelestial/Dockerfile) | Production multi-stage Docker build for all-in-one container deployment. |
| [`.dockerignore`](file:///d:/project/aiml%20prime/project/hackcelestial/.dockerignore) | Excludes large files (`flights.csv`, `.venv`) for lightning-fast container builds. |
| [`Procfile`](file:///d:/project/aiml%20prime/project/hackcelestial/Procfile) | Standard cloud buildpack process definition. |
| [`.python-version`](file:///d:/project/aiml%20prime/project/hackcelestial/.python-version) | Declares Python 3.11.9 runtime compatibility. |
| [`frontend/src/api.js`](file:///d:/project/aiml%20prime/project/hackcelestial/frontend/src/api.js) | Dynamic API resolver supporting `VITE_BACKEND_URL`, relative proxy, and localhost fallback. |

---

## 🧪 Local Testing Before Cloud Deployment

To verify locally that the production build runs cleanly:

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Run backend (which serves the frontend dist automatically)
cd ..
uv run uvicorn backend.main:app --port 8000
```
Open `http://localhost:8000` in your browser.
