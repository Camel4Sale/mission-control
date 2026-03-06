"""
Polymarket Alpha Bots - Package

Modulare Alpha-Strategien für Polymarket Trading
"""

from .alpha import (
    AlphaStrategy,
    Signal,
    SignalStrength,
    OnChainStrategy,
    SocialMediaStrategy,
    NewsAPIStrategy,
    CorrelationStrategy,
)

from .alpha.config import Config, StrategyConfig, RiskConfig

__version__ = '1.0.0'
__author__ = 'Molty 🧊'

__all__ = [
    # Base
    'AlphaStrategy',
    'Signal',
    'SignalStrength',
    
    # Strategies
    'OnChainStrategy',
    'SocialMediaStrategy',
    'NewsAPIStrategy',
    'CorrelationStrategy',
    
    # Config
    'Config',
    'StrategyConfig',
    'RiskConfig',
]
