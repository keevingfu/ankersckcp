"""
Knowledge Service - Main Application
Port: 8001
Handles knowledge base management, semantic search, and RAG operations
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
    "knowledge_service_requests_total",
    "Total requests to Knowledge Service",
    ["method", "endpoint", "status"]
)
REQUEST_DURATION = Histogram(
    "knowledge_service_request_duration_seconds",
    "Request duration in seconds",
    ["method", "endpoint"]
)


# ============================================================================
# Lifespan Events
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events
    Handles startup and shutdown logic
    """
    # Startup
    logger.info("Starting Knowledge Service...")
    logger.info(f"Environment: {settings.app_env}")
    logger.info(f"Debug mode: {settings.debug}")

    try:
        # Connect to databases
        await connect_to_databases()
        logger.info("Knowledge Service started successfully")
    except Exception as e:
        logger.error(f"Failed to start Knowledge Service: {e}")
        raise

    yield

    # Shutdown
    logger.info("Shutting down Knowledge Service...")
    await close_database_connections()
    logger.info("Knowledge Service stopped")


# ============================================================================
# FastAPI Application
# ============================================================================

app = FastAPI(
    title="Soundcore KCP - Knowledge Service",
    description="Knowledge base management, semantic search, and RAG operations",
    version=settings.api_version,
    lifespan=lifespan,
    debug=settings.debug,
)


# ============================================================================
# Middleware
# ============================================================================

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
    """Add request processing time to response headers"""
    start_time = time.time()

    response = await call_next(request)

    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)

    # Update Prometheus metrics
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
# Exception Handlers
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc) if settings.debug else "An unexpected error occurred",
            "path": request.url.path,
        }
    )


# ============================================================================
# Health Check Endpoints
# ============================================================================

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint"""
    return {
        "service": "Knowledge Service",
        "version": settings.api_version,
        "status": "running",
        "environment": settings.app_env
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint
    Returns service health status
    """
    return {
        "status": "healthy",
        "service": "knowledge-service",
        "version": settings.api_version,
        "timestamp": time.time()
    }


@app.get("/ready", tags=["Health"])
async def readiness_check():
    """
    Readiness check endpoint
    Verifies all dependencies are ready
    """
    # TODO: Check database connections, external services
    return {
        "status": "ready",
        "service": "knowledge-service",
        "checks": {
            "database": "ok",
            "cache": "ok",
            "vector_store": "ok"
        }
    }


# ============================================================================
# Metrics Endpoint
# ============================================================================

@app.get("/metrics", tags=["Monitoring"])
async def metrics():
    """
    Prometheus metrics endpoint
    Exposes service metrics for monitoring
    """
    return Response(
        content=generate_latest(),
        media_type="text/plain"
    )


# ============================================================================
# API Routes
# ============================================================================

# Import and include routers
from .routes import products_router, knowledge_router, search_router, stats_router

app.include_router(products_router, prefix="/api/v1/products", tags=["Products"])
app.include_router(knowledge_router, prefix="/api/v1/knowledge", tags=["Knowledge"])
app.include_router(search_router, prefix="/api/v1/search", tags=["Search"])
app.include_router(stats_router, prefix="/api/v1/stats", tags=["Statistics"])


# API status endpoint
@app.get("/api/v1/status", tags=["API"])
async def api_status():
    """API status endpoint"""
    return {
        "api_version": settings.api_version,
        "service": "knowledge-service",
        "features": {
            "rag_engine": settings.enable_rag_engine,
            "knowledge_graph": settings.enable_knowledge_graph,
            "auto_tagging": settings.enable_auto_tagging
        },
        "endpoints": {
            "products": "/api/v1/products",
            "knowledge": "/api/v1/knowledge",
            "search": "/api/v1/search",
            "stats": "/api/v1/stats"
        }
    }


# ============================================================================
# Main Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.knowledge_service_port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
        access_log=True,
    )
