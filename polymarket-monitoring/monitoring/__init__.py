"""
Polymarket Monitoring System
Build the eyes! 👀
"""
from .config import Config, config
from .pnl_tracker import PnLTracker, Position, ClosedTrade, PnLSnapshot
from .alert_system import AlertSystem, AlertPriority, AlertChannel
from .auto_rebalance import AutoRebalance, TargetAllocation, RebalanceAction
from .circuit_breaker import CircuitBreaker, CircuitState

__version__ = "1.0.0"
__all__ = [
    "Config",
    "config",
    "PnLTracker",
    "Position",
    "ClosedTrade",
    "PnLSnapshot",
    "AlertSystem",
    "AlertPriority",
    "AlertChannel",
    "AutoRebalance",
    "TargetAllocation",
    "RebalanceAction",
    "CircuitBreaker",
    "CircuitState",
]
