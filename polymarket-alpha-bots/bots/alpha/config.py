"""
Konfiguration für Polymarket Alpha Bots

Enthält alle API-Keys, Strategie-Parameter und Trading-Einstellungen
"""

import os
from typing import Dict, Any
from dataclasses import dataclass, field


@dataclass
class StrategyConfig:
    """Konfiguration für eine Alpha-Strategie"""
    enabled: bool = True
    paper_trading: bool = True
    min_confidence: int = 50  # Minimum Confidence-Score für Trades
    max_position_size: float = 0.05  # Max 5% pro Trade
    stop_loss: float = 0.20  # 20% Stop-Loss
    take_profit: float = 0.50  # 50% Take-Profit


@dataclass
class RiskConfig:
    """Risk-Management Konfiguration"""
    max_daily_loss: float = 0.10  # 10% max daily loss
    max_weekly_loss: float = 0.20  # 20% max weekly loss
    max_total_exposure: float = 0.50  # Max 50% des Portfolios invested
    max_position_per_market: float = 0.10  # Max 10% pro Markt
    diversification_min_markets: int = 5  # Mindestens 5 verschiedene Märkte


@dataclass
class APIConfig:
    """API-Key Konfiguration"""
    # On-Chain
    polygonscan_api_key: str = ''
    nansen_api_key: str = ''
    arkham_api_key: str = ''
    
    # Social Media
    twitter_bearer_token: str = ''
    twitter_api_key: str = ''
    twitter_api_secret: str = ''
    reddit_client_id: str = ''
    reddit_client_secret: str = ''
    
    # News
    cryptopanic_api_key: str = ''
    google_news_api_key: str = ''
    bloomberg_api_key: str = ''
    
    # Prediction Markets
    predictit_api_key: str = ''
    betfair_api_key: str = ''
    betfair_cert_path: str = ''
    kalshi_api_key: str = ''
    
    # Polymarket (Trading)
    polymarket_api_key: str = ''
    polygon_rpc_url: str = 'https://polygon-rpc.com'
    wallet_private_key: str = ''


class Config:
    """
    Haupt-Konfiguration für Polymarket Alpha Bots
    
    Lädt Konfiguration aus Environment-Variablen oder Config-Datei
    """
    
    def __init__(self, config_path: str = None):
        self.config_path = config_path
        self.api = APIConfig()
        self.risk = RiskConfig()
        self.strategies: Dict[str, StrategyConfig] = {}
        
        # Load from environment
        self._load_from_env()
        
        # Initialize strategy configs
        self._init_strategies()
    
    def _load_from_env(self):
        """Lädt API-Keys aus Environment-Variablen"""
        # On-Chain
        self.api.polygonscan_api_key = os.getenv('POLYGONSCAN_API_KEY', '')
        self.api.nansen_api_key = os.getenv('NANSEN_API_KEY', '')
        self.api.arkham_api_key = os.getenv('ARKHAM_API_KEY', '')
        
        # Social Media
        self.api.twitter_bearer_token = os.getenv('TWITTER_BEARER_TOKEN', '')
        self.api.twitter_api_key = os.getenv('TWITTER_API_KEY', '')
        self.api.twitter_api_secret = os.getenv('TWITTER_API_SECRET', '')
        self.api.reddit_client_id = os.getenv('REDDIT_CLIENT_ID', '')
        self.api.reddit_client_secret = os.getenv('REDDIT_CLIENT_SECRET', '')
        
        # News
        self.api.cryptopanic_api_key = os.getenv('CRYPTOPANIC_API_KEY', '')
        self.api.google_news_api_key = os.getenv('GOOGLE_NEWS_API_KEY', '')
        self.api.bloomberg_api_key = os.getenv('BLOOMBERG_API_KEY', '')
        
        # Prediction Markets
        self.api.predictit_api_key = os.getenv('PREDICTIT_API_KEY', '')
        self.api.betfair_api_key = os.getenv('BETFAIR_API_KEY', '')
        self.api.betfair_cert_path = os.getenv('BETFAIR_CERT_PATH', '')
        self.api.kalshi_api_key = os.getenv('KALSHI_API_KEY', '')
        
        # Polymarket
        self.api.polymarket_api_key = os.getenv('POLYMARKET_API_KEY', '')
        self.api.polygon_rpc_url = os.getenv('POLYGON_RPC_URL', 'https://polygon-rpc.com')
        self.api.wallet_private_key = os.getenv('WALLET_PRIVATE_KEY', '')
        
        # Risk-Management
        self.risk.max_daily_loss = float(os.getenv('MAX_DAILY_LOSS', '0.10'))
        self.risk.max_weekly_loss = float(os.getenv('MAX_WEEKLY_LOSS', '0.20'))
        self.risk.max_total_exposure = float(os.getenv('MAX_TOTAL_EXPOSURE', '0.50'))
    
    def _init_strategies(self):
        """Initialisiert Strategie-Konfigurationen"""
        self.strategies = {
            'on_chain': StrategyConfig(
                enabled=os.getenv('ON_CHAIN_ENABLED', 'true').lower() == 'true',
                paper_trading=os.getenv('PAPER_TRADING', 'true').lower() == 'true',
                min_confidence=int(os.getenv('ON_CHAIN_MIN_CONFIDENCE', '60')),
            ),
            'social_media': StrategyConfig(
                enabled=os.getenv('SOCIAL_MEDIA_ENABLED', 'true').lower() == 'true',
                paper_trading=os.getenv('PAPER_TRADING', 'true').lower() == 'true',
                min_confidence=int(os.getenv('SOCIAL_MEDIA_MIN_CONFIDENCE', '70')),
            ),
            'news_api': StrategyConfig(
                enabled=os.getenv('NEWS_API_ENABLED', 'true').lower() == 'true',
                paper_trading=os.getenv('PAPER_TRADING', 'true').lower() == 'true',
                min_confidence=int(os.getenv('NEWS_API_MIN_CONFIDENCE', '75')),
            ),
            'correlation': StrategyConfig(
                enabled=os.getenv('CORRELATION_ENABLED', 'true').lower() == 'true',
                paper_trading=os.getenv('PAPER_TRADING', 'true').lower() == 'true',
                min_confidence=int(os.getenv('CORRELATION_MIN_CONFIDENCE', '65')),
            ),
        }
    
    def get_strategy_config(self, strategy_name: str) -> StrategyConfig:
        """Returns Konfiguration für eine Strategie"""
        return self.strategies.get(strategy_name, StrategyConfig())
    
    def get_api_config(self) -> APIConfig:
        """Returns API-Konfiguration"""
        return self.api
    
    def get_risk_config(self) -> RiskConfig:
        """Returns Risk-Management Konfiguration"""
        return self.risk
    
    def to_dict(self) -> Dict[str, Any]:
        """Konvertiert gesamte Konfiguration zu Dictionary"""
        return {
            'api': {
                'polygonscan_api_key': '***' if self.api.polygonscan_api_key else '',
                'nansen_api_key': '***' if self.api.nansen_api_key else '',
                'twitter_bearer_token': '***' if self.api.twitter_bearer_token else '',
                'cryptopanic_api_key': '***' if self.api.cryptopanic_api_key else '',
                'predictit_api_key': '***' if self.api.predictit_api_key else '',
                'polymarket_api_key': '***' if self.api.polymarket_api_key else '',
            },
            'risk': {
                'max_daily_loss': self.risk.max_daily_loss,
                'max_weekly_loss': self.risk.max_weekly_loss,
                'max_total_exposure': self.risk.max_total_exposure,
            },
            'strategies': {
                name: {
                    'enabled': config.enabled,
                    'paper_trading': config.paper_trading,
                    'min_confidence': config.min_confidence,
                }
                for name, config in self.strategies.items()
            },
        }


# Globale Konfiguration-Instanz
config = Config()
