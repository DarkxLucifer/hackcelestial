# ========================================================================
# Stage 1: Build Vite / React Frontend
# ========================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci || npm install

COPY frontend/ ./
RUN npm run build

# ========================================================================
# Stage 2: Python 3.11 FastAPI Backend + Pre-built Static Frontend
# ========================================================================
FROM python:3.11-slim

WORKDIR /app

# Install minimal build tools for compiled packages (e.g. ortools, greenlet)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application, trained models & data assets
COPY backend/ ./backend/
COPY data/ ./data/
COPY corpus/ ./corpus/

# Copy built frontend dist from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Cloud runtime environment defaults
ENV PORT=8000
ENV HOST=0.0.0.0
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Start Uvicorn bound to dynamic cloud $PORT or fallback to 8000
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
