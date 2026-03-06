"""
SolarProCelaris Bot - Main Application
======================================
FastAPI-based REST API for solar lead generation, ROI calculation,
email automation, and appointment booking.
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import structlog

from app.config import settings
from app.database import get_db, init_db
from app.api.routes import leads, calculator, appointments, emails, health
from app.services.openclaw_integration import OpenClawService

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=structlog.threadlocal.wrap_dict(dict),
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Security
security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify API token"""
    if credentials.credentials != settings.API_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    return credentials.credentials

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting SolarProCelaris Bot", version="1.0.0")
    await init_db()
    
    # Initialize OpenClaw integration
    openclaw = OpenClawService()
    await openclaw.initialize()
    app.state.openclaw = openclaw
    
    logger.info("Application started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down SolarProCelaris Bot")
    await openclaw.close()

# Create FastAPI application
app = FastAPI(
    title="SolarProCelaris Bot",
    description="Automatischer KI-Bot für Solar-Unternehmen: Lead-Generierung, ROI-Rechner, Email-Automation, Termin-Booking",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(leads.router, prefix="/api/leads", tags=["Leads"], dependencies=[Depends(verify_token)])
app.include_router(calculator.router, prefix="/api/calculator", tags=["Solar Calculator"], dependencies=[Depends(verify_token)])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"], dependencies=[Depends(verify_token)])
app.include_router(emails.router, prefix="/api/emails", tags=["Email Automation"], dependencies=[Depends(verify_token)])

@app.get("/")
async def root():
    """Root endpoint - API info"""
    return {
        "name": "SolarProCelaris Bot",
        "version": "1.0.0",
        "description": "Automatischer KI-Bot für Solar-Unternehmen",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
