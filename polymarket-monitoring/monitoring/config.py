"""
Polymarket Monitoring Configuration
"""
import os
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class AlertConfig:
    telegram_bot_token: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    telegram_chat_id: str = os.getenv("TELEGRAM_CHAT_ID", "")
    discord_webhook_url: str = os.getenv("DISCORD_WEBHOOK_URL", "")
    email_from: str = os.getenv("EMAIL_FROM", "frailyouth829@agentmail.to")
    email_to: str = os.getenv("EMAIL_TO", "")
    sms_api_key: str = os.getenv("SMS_API_KEY", "")
    sms_phone: str = os.getenv("SMS_PHONE", "")

@dataclass
class CircuitBreakerConfig:
    daily_loss_limit: float = -0.10  # -10%
    weekly_loss_limit: float = -0.20  # -20%
    auto_exit_on_error: bool = True
    manual_override_enabled: bool = True

@dataclass
class RebalanceConfig:
    check_interval_hours: int = 24
    deviation_threshold: float = 0.10  # 10%
    tax_optimized: bool = True

@dataclass
class PolymarketConfig:
    api_key: str = os.getenv("POLYMARKET_API_KEY", "")
    api_secret: str = os.getenv("POLYMARKET_API_SECRET", "")
    base_url: str = "https://api.polymarket.com"

@dataclass
class Config:
    alerts: AlertConfig = None
    circuit_breaker: CircuitBreakerConfig = None
    rebalance: RebalanceConfig = None
    polymarket: PolymarketConfig = None
    
    def __post_init__(self):
        self.alerts = self.alerts or AlertConfig()
        self.circuit_breaker = self.circuit_breaker or CircuitBreakerConfig()
        self.rebalance = self.rebalance or RebalanceConfig()
        self.polymarket = self.polymarket or PolymarketConfig()

# Global config instance
config = Config()
