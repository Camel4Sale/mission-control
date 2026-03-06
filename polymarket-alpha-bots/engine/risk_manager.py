"""
Risk Manager - Engine Component

Überwacht und kontrolliert Trading-Risiken:
- Position-Limits
- Exposure-Limits
- Stop-Loss / Take-Profit
- Circuit Breaker
- Portfolio-Diversifikation
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
import logging

from bots.alpha.base import Signal

logger = logging.getLogger(__name__)


@dataclass
class Position:
    """Eine offene Position"""
    market_id: str
    market_name: str
    entry_price: float
    current_price: float
    position_size: float  # In USD
    shares: float
    entry_time: datetime
    stop_loss: float
    take_profit: float
    pnl_unrealized: float = 0.0
    pnl_percent: float = 0.0


@dataclass
class RiskMetrics:
    """Aktuelle Risk-Metriken"""
    total_exposure: float  # Total invested
    exposure_pct: float  # % des Portfolios
    daily_pnl: float
    weekly_pnl: float
    max_drawdown: float
    sharpe_ratio: float
    var_95: float  # Value at Risk (95%)
    positions_count: int


class RiskManager:
    """
    Risk-Management für Polymarket Trading
    
    Stellt sicher dass alle Trades innerhalb der Risk-Limits bleiben
    """
    
    # Default Risk-Parameter
    DEFAULT_PARAMS = {
        'max_daily_loss': 0.10,  # 10%
        'max_weekly_loss': 0.20,  # 20%
        'max_total_exposure': 0.50,  # 50%
        'max_position_per_market': 0.10,  # 10%
        'min_diversification': 5,  # Min 5 Märkte
        'stop_loss_pct': 0.20,  # 20%
        'take_profit_pct': 0.50,  # 50%
    }
    
    def __init__(
        self,
        portfolio_value: float,
        risk_params: Dict[str, float] = None
    ):
        self.portfolio_value = portfolio_value
        self.risk_params = risk_params or self.DEFAULT_PARAMS.copy()
        
        self.positions: Dict[str, Position] = {}
        self.daily_pnl = 0.0
        self.weekly_pnl = 0.0
        self.total_pnl = 0.0
        self.max_drawdown = 0.0
        self.peak_value = portfolio_value
        
        self.circuit_breaker_active = False
        self.last_reset = datetime.utcnow()
        
        logger.info(f"RiskManager initialized with portfolio ${portfolio_value:,.2f}")
    
    def can_open_position(self, signal: Signal, position_size: float) -> tuple[bool, str]:
        """
        Prüft ob eine neue Position eröffnet werden darf
        
        Args:
            signal: Trading-Signal
            position_size: Gewünschte Positionsgröße in USD
            
        Returns:
            (allowed, reason)
        """
        # Circuit Breaker check
        if self.circuit_breaker_active:
            return False, "Circuit Breaker active - trading halted"
        
        # Daily Loss check
        if self.daily_pnl < -self.portfolio_value * self.risk_params['max_daily_loss']:
            return False, f"Daily loss limit reached: ${self.daily_pnl:,.2f}"
        
        # Weekly Loss check
        if self.weekly_pnl < -self.portfolio_value * self.risk_params['max_weekly_loss']:
            return False, f"Weekly loss limit reached: ${self.weekly_pnl:,.2f}"
        
        # Total Exposure check
        current_exposure = sum(p.position_size for p in self.positions.values())
        if current_exposure + position_size > self.portfolio_value * self.risk_params['max_total_exposure']:
            return False, f"Total exposure limit would be exceeded"
        
        # Single Market check
        if signal.market_id in self.positions:
            existing = self.positions[signal.market_id]
            if existing.position_size + position_size > self.portfolio_value * self.risk_params['max_position_per_market']:
                return False, f"Single market limit exceeded for {signal.market_name}"
        
        # Diversification check (wenn viele Positionen)
        if len(self.positions) >= 20:
            return False, "Maximum number of positions reached (20)"
        
        return True, "OK"
    
    def calculate_position_size(
        self,
        signal: Signal,
        confidence: int
    ) -> float:
        """
        Berechnet optimale Positionsgröße basierend auf Confidence
        
        Args:
            signal: Trading-Signal
            confidence: Signal confidence (0-100)
            
        Returns:
            Position size in USD
        """
        # Base size: 2% of portfolio
        base_size = self.portfolio_value * 0.02
        
        # Confidence multiplier (50 = 1x, 100 = 2x)
        confidence_mult = 0.5 + (confidence / 100)
        
        # Calculate size
        size = base_size * confidence_mult
        
        # Apply limits
        max_size = self.portfolio_value * self.risk_params['max_position_per_market']
        size = min(size, max_size)
        
        # Check remaining exposure
        current_exposure = sum(p.position_size for p in self.positions.values())
        max_exposure = self.portfolio_value * self.risk_params['max_total_exposure']
        remaining = max_exposure - current_exposure
        
        size = min(size, remaining)
        
        return max(0, size)
    
    def open_position(
        self,
        signal: Signal,
        entry_price: float,
        position_size: float
    ) -> Optional[Position]:
        """
        Eröffnet eine neue Position
        
        Args:
            signal: Trading-Signal
            entry_price: Einstiegspreis
            position_size: Positionsgröße in USD
            
        Returns:
            Position object or None if failed
        """
        # Check ob erlaubt
        allowed, reason = self.can_open_position(signal, position_size)
        if not allowed:
            logger.warning(f"Position rejected: {reason}")
            return None
        
        # Calculate shares
        shares = position_size / entry_price
        
        # Stop-Loss und Take-Profit
        stop_loss = entry_price * (1 - self.risk_params['stop_loss_pct'])
        take_profit = entry_price * (1 + self.risk_params['take_profit_pct'])
        
        position = Position(
            market_id=signal.market_id,
            market_name=signal.market_name,
            entry_price=entry_price,
            current_price=entry_price,
            position_size=position_size,
            shares=shares,
            entry_time=datetime.utcnow(),
            stop_loss=stop_loss,
            take_profit=take_profit,
        )
        
        self.positions[signal.market_id] = position
        
        logger.info(
            f"Opened position: {signal.market_name} "
            f"${position_size:,.2f} @ {entry_price:.3f}"
        )
        
        return position
    
    def close_position(self, market_id: str, exit_price: float) -> float:
        """
        Schließt eine Position
        
        Args:
            market_id: Market ID
            exit_price: Ausstiegspreis
            
        Returns:
            PnL in USD
        """
        position = self.positions.get(market_id)
        if not position:
            logger.warning(f"Position {market_id} not found")
            return 0.0
        
        # Calculate PnL
        pnl = (exit_price - position.entry_price) * position.shares
        pnl_pct = (exit_price - position.entry_price) / position.entry_price
        
        position.pnl_unrealized = pnl
        position.pnl_percent = pnl_pct
        
        # Update totals
        self.total_pnl += pnl
        self.daily_pnl += pnl
        self.weekly_pnl += pnl
        
        # Update peak and drawdown
        current_value = self.portfolio_value + self.total_pnl
        if current_value > self.peak_value:
            self.peak_value = current_value
        
        drawdown = (self.peak_value - current_value) / self.peak_value
        if drawdown > self.max_drawdown:
            self.max_drawdown = drawdown
        
        # Remove position
        del self.positions[market_id]
        
        logger.info(
            f"Closed position: {position.market_name} "
            f"PnL: ${pnl:,.2f} ({pnl_pct:.2%})"
        )
        
        return pnl
    
    def update_prices(self, prices: Dict[str, float]):
        """
        Updated aktuelle Preise aller Positionen
        
        Args:
            prices: Dict {market_id: current_price}
        """
        for market_id, price in prices.items():
            if market_id in self.positions:
                position = self.positions[market_id]
                position.current_price = price
                
                # Update unrealized PnL
                position.pnl_unrealized = (price - position.entry_price) * position.shares
                position.pnl_percent = (price - position.entry_price) / position.entry_price
                
                # Check Stop-Loss / Take-Profit
                if price <= position.stop_loss:
                    logger.warning(f"Stop-Loss hit for {position.market_name}")
                    # Auto-close würde hier triggeren
                
                if price >= position.take_profit:
                    logger.info(f"Take-Profit hit for {position.market_name}")
                    # Auto-close würde hier triggern
    
    def check_circuit_breaker(self) -> bool:
        """
        Prüft ob Circuit Breaker aktiviert werden muss
        
        Returns:
            True wenn Circuit Breaker aktiv
        """
        # Daily Loss Circuit Breaker
        if self.daily_pnl < -self.portfolio_value * self.risk_params['max_daily_loss']:
            self.circuit_breaker_active = True
            logger.critical("CIRCUIT BREAKER: Daily loss limit reached!")
            return True
        
        # Weekly Loss Circuit Breaker
        if self.weekly_pnl < -self.portfolio_value * self.risk_params['max_weekly_loss']:
            self.circuit_breaker_active = True
            logger.critical("CIRCUIT BREAKER: Weekly loss limit reached!")
            return True
        
        return False
    
    def reset_circuit_breaker(self):
        """Reset Circuit Breaker (manuell oder nach Timeout)"""
        self.circuit_breaker_active = False
        self.last_reset = datetime.utcnow()
        logger.info("Circuit Breaker reset")
    
    def get_risk_metrics(self) -> RiskMetrics:
        """Returns aktuelle Risk-Metriken"""
        total_exposure = sum(p.position_size for p in self.positions.values())
        
        return RiskMetrics(
            total_exposure=total_exposure,
            exposure_pct=total_exposure / self.portfolio_value,
            daily_pnl=self.daily_pnl,
            weekly_pnl=self.weekly_pnl,
            max_drawdown=self.max_drawdown,
            sharpe_ratio=self._calculate_sharpe(),
            var_95=self._calculate_var_95(),
            positions_count=len(self.positions),
        )
    
    def _calculate_sharpe(self) -> float:
        """Berechnet Sharpe Ratio (vereinfacht)"""
        # In Production: Mit historischen Returns
        if self.total_pnl == 0:
            return 0.0
        
        # Simple proxy
        return self.total_pnl / (self.portfolio_value * 0.1)  # Annahme: 10% Vol
    
    def _calculate_var_95(self) -> float:
        """Berechnet Value at Risk (95%)"""
        # In Production: Historical Simulation oder Parametric
        # Hier: Simple Schätzung
        return self.portfolio_value * 0.05  # 5% VaR
    
    def get_positions_summary(self) -> List[Dict[str, Any]]:
        """Returns Zusammenfassung aller Positionen"""
        return [
            {
                'market': p.market_name,
                'entry_price': p.entry_price,
                'current_price': p.current_price,
                'position_size': p.position_size,
                'pnl': p.pnl_unrealized,
                'pnl_pct': p.pnl_percent,
            }
            for p in self.positions.values()
        ]
    
    def to_dict(self) -> Dict[str, Any]:
        """Exportiert RiskManager Status"""
        metrics = self.get_risk_metrics()
        
        return {
            'portfolio_value': self.portfolio_value,
            'circuit_breaker_active': self.circuit_breaker_active,
            'metrics': {
                'total_exposure': metrics.total_exposure,
                'exposure_pct': metrics.exposure_pct,
                'daily_pnl': metrics.daily_pnl,
                'weekly_pnl': metrics.weekly_pnl,
                'max_drawdown': metrics.max_drawdown,
                'sharpe_ratio': metrics.sharpe_ratio,
                'positions_count': metrics.positions_count,
            },
            'positions': self.get_positions_summary(),
        }
