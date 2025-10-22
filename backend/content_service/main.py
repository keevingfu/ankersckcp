"""
Content Service - Main Application
Port: 8002
Handles AI content generation (blogs, social media, emails, product descriptions)
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

# Configure logging
logging.basicConfig(
    level=settings.log_level,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Prometheus metrics
REQUEST_COUNT = Counter(
    "content_service_requests_total",
    "Total requests to Content Service",
    ["method", "endpoint", "status"]
)
REQUEST_DURATION = Histogram(
    "content_service_request_duration_seconds",
    "Request duration in seconds",
    ["method", "endpoint"]
)


# ============================================================================
# Lifespan Events
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Content Service...")
    try:
        await connect_to_databases()
        logger.info("Content Service started successfully")
    except Exception as e:
        logger.error(f"Failed to start Content Service: {e}")
        raise

    yield

    # Shutdown
    logger.info("Shutting down Content Service...")
    await close_database_connections()
    logger.info("Content Service stopped")


# ============================================================================
# FastAPI Application
# ============================================================================

app = FastAPI(
    title="Soundcore KCP - Content Service",
    description="AI content generation for blogs, social media, emails",
    version=settings.api_version,
    lifespan=lifespan,
    debug=settings.debug,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)


# Request Timing Middleware
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


# ============================================================================
# Health Check Endpoints
# ============================================================================

@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "Content Service",
        "version": settings.api_version,
        "status": "running",
        "environment": settings.app_env
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "content-service",
        "version": settings.api_version,
        "timestamp": time.time()
    }


@app.get("/ready", tags=["Health"])
async def readiness_check():
    return {
        "status": "ready",
        "service": "content-service",
        "checks": {
            "database": "ok",
            "llm": "ok"
        }
    }


@app.get("/metrics", tags=["Monitoring"])
async def metrics():
    return Response(content=generate_latest(), media_type="text/plain")


# ============================================================================
# API Routes
# ============================================================================

@app.get("/api/v1/status", tags=["API"])
async def api_status():
    return {
        "api_version": settings.api_version,
        "service": "content-service",
        "features": {
            "blog_generation": settings.enable_content_generation,
            "social_media": settings.enable_content_generation,
            "email_generation": settings.enable_content_generation
        },
        "endpoints": {
            "generate": "/api/v1/content/generate",
            "templates": "/api/v1/content/templates",
            "history": "/api/v1/content/history"
        }
    }


# Placeholder endpoints
@app.post("/api/v1/content/generate", tags=["Content"])
async def generate_content():
    """Generate AI content (blogs, social, emails)"""
    return {
        "message": "Content generation endpoint - Coming soon",
        "status": "not_implemented"
    }


@app.get("/api/v1/content/templates", tags=["Content"])
async def list_templates():
    """List available content templates"""
    return {
        "templates": [
            {"id": "blog", "name": "Blog Post", "description": "SEO-optimized blog articles"},
            {"id": "social", "name": "Social Media", "description": "Social media posts"},
            {"id": "email", "name": "Email", "description": "Marketing emails"}
        ]
    }


@app.get("/api/v1/content/history", tags=["Content"])
async def content_history():
    """Get content generation history"""
    return {
        "history": [],
        "total": 0
    }


# ============================================================================
# Main Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.content_service_port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )
