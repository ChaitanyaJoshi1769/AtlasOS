"""Health check endpoints"""
from datetime import datetime
from fastapi import APIRouter

router = APIRouter()


@router.get("/", tags=["health"])
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "ai-runtime",
    }


@router.get("/ready", tags=["health"])
async def readiness():
    """Readiness check"""
    return {
        "ready": True,
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/live", tags=["health"])
async def liveness():
    """Liveness check"""
    return {
        "alive": True,
        "timestamp": datetime.utcnow().isoformat(),
    }
