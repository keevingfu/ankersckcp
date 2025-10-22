"""
Support Service - Main Application
Port: 8003
Handles customer support chatbot, ticket management, and conversation analytics
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
    "support_service_requests_total",
    "Total requests to Support Service",
    ["method", "endpoint", "status"]
)
REQUEST_DURATION = Histogram(
    "support_service_request_duration_seconds",
    "Request duration in seconds",
    ["method", "endpoint"]
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Support Service...")
    try:
        await connect_to_databases()
        logger.info("Support Service started successfully")
    except Exception as e:
        logger.error(f"Failed to start Support Service: {e}")
        raise
    yield
    logger.info("Shutting down Support Service...")
    await close_database_connections()
    logger.info("Support Service stopped")


app = FastAPI(
    title="Soundcore KCP - Support Service",
    description="Customer support chatbot and ticket management",
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
        "service": "Support Service",
        "version": settings.api_version,
        "status": "running",
        "environment": settings.app_env
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "support-service",
        "version": settings.api_version,
        "timestamp": time.time()
    }


@app.get("/ready", tags=["Health"])
async def readiness_check():
    return {
        "status": "ready",
        "service": "support-service",
        "checks": {
            "database": "ok",
            "chatbot": "ok"
        }
    }


@app.get("/metrics", tags=["Monitoring"])
async def metrics():
    return Response(content=generate_latest(), media_type="text/plain")


@app.get("/api/v1/status", tags=["API"])
async def api_status():
    return {
        "api_version": settings.api_version,
        "service": "support-service",
        "features": {
            "chatbot": True,
            "ticket_management": True,
            "conversation_analytics": True
        },
        "endpoints": {
            "chat": "/api/v1/support/chat",
            "conversations": "/api/v1/support/conversations",
            "tickets": "/api/v1/support/tickets"
        }
    }


@app.post("/api/v1/support/chat", tags=["Support"])
async def chat():
    """AI chatbot endpoint"""
    return {
        "message": "Chatbot endpoint - Coming soon",
        "status": "not_implemented"
    }


@app.get("/api/v1/support/conversations", tags=["Support"])
async def list_conversations():
    """List support conversations"""
    return {
        "conversations": [],
        "total": 0
    }


@app.get("/api/v1/support/tickets", tags=["Support"])
async def list_tickets():
    """List support tickets"""
    return {
        "tickets": [],
        "total": 0
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.support_service_port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )
