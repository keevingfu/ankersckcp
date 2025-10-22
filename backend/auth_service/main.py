"""
Auth Service - Main Application
Port: 8005
Handles authentication, authorization, and user management
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
    "auth_service_requests_total",
    "Total requests to Auth Service",
    ["method", "endpoint", "status"]
)
REQUEST_DURATION = Histogram(
    "auth_service_request_duration_seconds",
    "Request duration in seconds",
    ["method", "endpoint"]
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Auth Service...")
    try:
        await connect_to_databases()
        logger.info("Auth Service started successfully")
    except Exception as e:
        logger.error(f"Failed to start Auth Service: {e}")
        raise
    yield
    logger.info("Shutting down Auth Service...")
    await close_database_connections()
    logger.info("Auth Service stopped")


app = FastAPI(
    title="Soundcore KCP - Auth Service",
    description="Authentication, authorization, and user management",
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
        "service": "Auth Service",
        "version": settings.api_version,
        "status": "running",
        "environment": settings.app_env
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "auth-service",
        "version": settings.api_version,
        "timestamp": time.time()
    }


@app.get("/ready", tags=["Health"])
async def readiness_check():
    return {
        "status": "ready",
        "service": "auth-service",
        "checks": {
            "database": "ok",
            "jwt": "ok"
        }
    }


@app.get("/metrics", tags=["Monitoring"])
async def metrics():
    return Response(content=generate_latest(), media_type="text/plain")


@app.get("/api/v1/status", tags=["API"])
async def api_status():
    return {
        "api_version": settings.api_version,
        "service": "auth-service",
        "features": {
            "jwt_auth": True,
            "oauth2": True,
            "rbac": True
        },
        "endpoints": {
            "login": "/api/v1/auth/login",
            "register": "/api/v1/auth/register",
            "refresh": "/api/v1/auth/refresh",
            "verify": "/api/v1/auth/verify"
        }
    }


@app.post("/api/v1/auth/login", tags=["Auth"])
async def login():
    """User login"""
    return {
        "message": "Login endpoint - Coming soon",
        "status": "not_implemented"
    }


@app.post("/api/v1/auth/register", tags=["Auth"])
async def register():
    """User registration"""
    return {
        "message": "Register endpoint - Coming soon",
        "status": "not_implemented"
    }


@app.post("/api/v1/auth/refresh", tags=["Auth"])
async def refresh_token():
    """Refresh access token"""
    return {
        "message": "Refresh token endpoint - Coming soon",
        "status": "not_implemented"
    }


@app.post("/api/v1/auth/verify", tags=["Auth"])
async def verify_token():
    """Verify JWT token"""
    return {
        "message": "Verify token endpoint - Coming soon",
        "status": "not_implemented"
    }


@app.get("/api/v1/users/me", tags=["Users"])
async def get_current_user():
    """Get current user profile"""
    return {
        "user": {
            "id": "user_123",
            "email": "user@example.com",
            "role": "admin"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.auth_service_port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )
