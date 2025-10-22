"""
Analytics Service - Main Application
Port: 8004
Handles data analytics, metrics aggregation, and reporting
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import Counter, Histogram, generate_latest
from starlette.responses import Response
import logging
import time

from config import settings
from models import connect_to_databases, close_database_connections

logging.basicConfig(
    level=settings.log_level,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

REQUEST_COUNT = Counter(
    "analytics_service_requests_total",
    "Total requests to Analytics Service",
    ["method", "endpoint", "status"]
)
REQUEST_DURATION = Histogram(
    "analytics_service_request_duration_seconds",
    "Request duration in seconds",
    ["method", "endpoint"]
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Analytics Service...")
    try:
        await connect_to_databases()
        logger.info("Analytics Service started successfully")
    except Exception as e:
        logger.error(f"Failed to start Analytics Service: {e}")
        raise
    yield
    logger.info("Shutting down Analytics Service...")
    await close_database_connections()
    logger.info("Analytics Service stopped")


app = FastAPI(
    title="Soundcore KCP - Analytics Service",
    description="Data analytics, metrics aggregation, and reporting",
    version=settings.api_version,
    lifespan=lifespan,
    debug=settings.debug,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)

    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    REQUEST_DURATION.labels(
        method=request.method,
        endpoint=request.url.path
    ).observe(process_time)

    return response


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "Analytics Service",
        "version": settings.api_version,
        "status": "running",
        "environment": settings.app_env
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "analytics-service",
        "version": settings.api_version,
        "timestamp": time.time()
    }


@app.get("/ready", tags=["Health"])
async def readiness_check():
    return {
        "status": "ready",
        "service": "analytics-service",
        "checks": {
            "database": "ok",
            "metrics": "ok"
        }
    }


@app.get("/metrics", tags=["Monitoring"])
async def metrics():
    return Response(content=generate_latest(), media_type="text/plain")


@app.get("/api/v1/status", tags=["API"])
async def api_status():
    return {
        "api_version": settings.api_version,
        "service": "analytics-service",
        "features": {
            "real_time_metrics": True,
            "historical_reports": True,
            "trend_analysis": True
        },
        "endpoints": {
            "overview": "/api/v1/analytics/overview",
            "user_metrics": "/api/v1/analytics/users",
            "content_metrics": "/api/v1/analytics/content",
            "search_metrics": "/api/v1/analytics/search"
        }
    }


@app.get("/api/v1/analytics/overview", tags=["Analytics"])
async def get_overview():
    """Get analytics overview"""
    return {
        "total_users": 12543,
        "content_views": 89234,
        "chat_sessions": 45678,
        "avg_engagement": 0.78,
        "period": "last_7_days"
    }


@app.get("/api/v1/analytics/users", tags=["Analytics"])
async def get_user_metrics():
    """Get user analytics"""
    return {
        "active_users": 12543,
        "new_users": 1234,
        "returning_users": 11309,
        "churn_rate": 0.02
    }


@app.get("/api/v1/analytics/content", tags=["Analytics"])
async def get_content_metrics():
    """Get content analytics"""
    return {
        "total_content": 5000,
        "views_today": 8920,
        "most_viewed": [
            {"title": "Liberty 4 NC Review", "views": 1234},
            {"title": "Best Earbuds 2024", "views": 987}
        ]
    }


@app.get("/api/v1/analytics/search", tags=["Analytics"])
async def get_search_metrics():
    """Get search analytics"""
    return {
        "total_searches": 15000,
        "avg_results": 8.5,
        "top_queries": [
            {"query": "how to connect", "count": 234},
            {"query": "battery life", "count": 189}
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.analytics_service_port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )
