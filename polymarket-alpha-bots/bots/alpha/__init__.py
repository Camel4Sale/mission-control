"""
Polymarket Alpha Bots - Informations-Vorteile Strategien

Enthält 4 modulare Alpha-Strategien:
1. On-Chain Analysis (Whale-Tracking)
2. Social Media Monitoring
3. News API Integration
4. Prediction Market Correlation
"""

from .base import AlphaStrategy, Signal, SignalStrength
from .on_chain import OnChainStrategy
from .social_media import SocialMediaStrategy
from .news_api import NewsAPIStrategy
from .correlation import CorrelationStrategy

__all__ = [
    'AlphaStrategy',
    'Signal',
    'SignalStrength',
    'OnChainStrategy',
    'SocialMediaStrategy',
    'NewsAPIStrategy',
    'CorrelationStrategy',
]

__version__ = '1.0.0'
