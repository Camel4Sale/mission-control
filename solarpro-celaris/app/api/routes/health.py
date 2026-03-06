"""
Health Check Endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import structlog

from app.database import get_db
from app.config import settings

logger = structlog.get_logger()
router = APIRouter()


@router.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": settings.BOT_NAME,
        "version": "1.0.0"
    }


@router.get("/health/ready")
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """Readiness check - verifies database connectivity"""
    try:
        # Test database connection
        from sqlalchemy import text
        await db.execute(text("SELECT 1"))
        
        return {
            "status": "ready",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error("Database connectivity check failed", error=str(e))
        return {
            "status": "not_ready",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }


@router.get("/api/status")
async def api_status():
    """Detailed API status with metrics"""
    return {
        "service": settings.BOT_NAME,
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "leads": "/api/leads",
            "calculator": "/api/calculator",
            "appointments": "/api/appointments",
            "emails": "/api/emails"
        },
        "features": {
            "solar_calculator": True,
            "lead_generation": True,
            "email_automation": True,
            "appointment_booking": True,
            "crm_integration": True
        },
        "timestamp": datetime.utcnow().isoformat()
    }
