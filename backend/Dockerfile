# ============================================================================
# Multi-stage Dockerfile for Soundcore KCP Backend Services
# ============================================================================

# Stage 1: Base Python image with dependencies
FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# ============================================================================
# Stage 2: Development image
# ============================================================================
FROM base AS development

# Copy application code
COPY . .

# Expose ports for all services
EXPOSE 8001 8002 8003 8004 8005 8006

# Default command (can be overridden)
CMD ["uvicorn", "knowledge_service.main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]

# ============================================================================
# Stage 3: Production image
# ============================================================================
FROM base AS production

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

# Expose ports
EXPOSE 8001 8002 8003 8004 8005 8006

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8001/health')" || exit 1

# Default command
CMD ["uvicorn", "knowledge_service.main:app", "--host", "0.0.0.0", "--port", "8001"]
