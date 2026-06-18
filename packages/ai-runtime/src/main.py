"""
AtlasOS AI Runtime - Agent Orchestration and Memory System
"""
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.config import settings
from src.api.routes import health, agents, memory

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper()),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    logger.info("🚀 AtlasOS AI Runtime starting...")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug: {settings.debug}")
    yield
    logger.info("🛑 AtlasOS AI Runtime shutting down...")


# Create FastAPI app
app = FastAPI(
    title="AtlasOS AI Runtime",
    description="Agent orchestration and autonomous data reasoning",
    version="0.1.0",
    debug=settings.debug,
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])
app.include_router(memory.router, prefix="/api/memory", tags=["memory"])


@app.get("/", tags=["root"])
async def root():
    """Root endpoint"""
    return {
        "name": "AtlasOS AI Runtime",
        "version": "0.1.0",
        "status": "running",
        "environment": settings.environment,
    }


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error_type": type(exc).__name__,
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
    )
