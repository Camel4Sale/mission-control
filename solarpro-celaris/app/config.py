"""
Configuration Settings for SolarProCelaris Bot
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    BOT_NAME: str = "SolarProCelaris"
    BOT_LANGUAGE: str = "de"
    TIMEZONE: str = "Europe/Berlin"
    
    # Database
    DATABASE_URL: str = "postgresql://solarpro:password@localhost:5432/solarpro"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # API Security
    API_SECRET_KEY: str = "change-me-to-secure-random-string-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AgentMail
    AGENTMAIL_INBOX: str = "frailyouth829@agentmail.to"
    AGENTMAIL_API_KEY: str = ""
    
    # Life OS CRM
    LIFEOS_API_KEY: str = ""
    LIFEOS_WEBHOOK_URL: str = ""
    
    # Calendar Integration
    GOOGLE_CALENDAR_API_KEY: str = ""
    GOOGLE_CALENDAR_ID: str = ""
    
    # Solar Calculator Defaults
    DEFAULT_STROMPREIS: float = 0.32  # €/kWh
    DEFAULT_EINSPEISEVERGUETUNG: float = 0.08  # €/kWh
    DEFAULT_ANLAGENKOSTEN_PRO_KWP: int = 2000  # €/kWp
    
    # Email Configuration
    EMAIL_FROM: str = "solarpro@celaris.de"
    EMAIL_SUPPORT: str = "support@celaris.de"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://celaris.de",
    ]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # OpenClaw
    OPENCLAW_WORKSPACE: str = "/data/.openclaw/workspace"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
