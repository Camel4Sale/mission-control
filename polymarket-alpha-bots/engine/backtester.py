"""
Backtester - Engine Component

Backtestet Strategien auf historischen Daten:
- Historical Polymarket Markets
- Walk-Forward Testing
- Performance Metrics
- Strategy Optimization
"""

import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
import logging
import json

from bots.alpha.base import Signal, AlphaStrategy

logger = logging.getLogger(__name__)


@dataclass
class BacktestResult:
    """Ergebnis eines Backtests"""
    strategy_name: str
    start_date: datetime
    end_date: datetime
    initial_capital: float
    final_capital: float
    total_return: float
    total_return_pct: float
    sharpe_ratio: float
    max_drawdown: float
    win_rate: float
    total_trades: int
    winning_trades: int
    losing_trades: int
    avg_win: float
    avg_loss: float
    profit_factor: float
    equity_curve: List[Dict[str, Any]] = field(default_factory=list)
    trades: List[Dict[str, Any]] = field(default_factory=list)


@dataclass
class Trade:
    """Ein simulierter Trade"""
    market_id: str
    market_name: str
    entry_time: datetime
    entry_price: float
    exit_time: Optional[datetime]
    exit_price: Optional[float]
    position_size: float
    pnl: float
    pnl_pct: float
    signal_confidence: int


class Backtester:
    """
    Backtesting Engine für Polymarket Strategien
    
    Testet Strategien auf historischen Daten
    """
    
    def __init__(self, initial_capital: float = 10000.0):
        self.initial_capital = initial_capital
        self.current_capital = initial_capital
        self.positions: Dict[str, Trade] = {}
        self.closed_trades: List[Trade] = []
        self.equity_curve: List[Dict[str, Any]] = []
        
        # Risk-Parameter
        self.position_size_pct = 0.02  # 2% pro Trade
        self.stop_loss_pct = 0.20
        self.take_profit_pct = 0.50
        
        logger.info(f"Backtester initialized with ${initial_capital:,.2f}")
    
    async def run_backtest(
        self,
        strategy: AlphaStrategy,
        historical_data: List[Dict[str, Any]],
        start_date: datetime,
        end_date: datetime
    ) -> BacktestResult:
        """
        Führt Backtest einer Strategie durch
        
        Args:
            strategy: Zu testende Strategie
            historical_data: Historische Marktdaten
            start_date: Startdatum
            end_date: Enddatum
            
        Returns:
            BacktestResult mit Performance-Metriken
        """
        logger.info(f"Starting backtest for {strategy.name}")
        
        # Reset state
        self.current_capital = self.initial_capital
        self.positions = {}
        self.closed_trades = []
        self.equity_curve = []
        
        # Simuliere Trading-Tage
        current_date = start_date
        while current_date <= end_date:
            # Setze aktuellen Zeitpunkt für Strategy
            # In Production: Historical data für diesen Tag
            
            # Generiere Signale
            signals = await strategy.generate_signals()
            
            # Verarbeite Signale
            for signal in signals:
                await self._process_signal(signal, current_date)
            
            # Update Positions mit aktuellen Preisen
            await self._update_positions(current_date)
            
            # Record equity
            self.equity_curve.append({
                'date': current_date.isoformat(),
                'equity': self.current_capital,
                'positions': len(self.positions),
            })
            
            # Nächster Tag
            current_date += timedelta(days=1)
        
        # Close all remaining positions
        await self._close_all_positions()
        
        # Calculate metrics
        result = self._calculate_result(strategy.name, start_date, end_date)
        
        logger.info(
            f"Backtest complete: {result.total_return_pct:.2%} return, "
            f"{result.sharpe_ratio:.2f} Sharpe, {result.max_drawdown:.2%} max DD"
        )
        
        return result
    
    async def _process_signal(self, signal: Signal, timestamp: datetime):
        """Verarbeitet ein Trading-Signal"""
        # Check if we can open position
        if len(self.positions) >= 10:  # Max 10 positions
            return
        
        # Calculate position size
        position_size = self.current_capital * self.position_size_pct
        
        # Open position
        # In Production: Echten Entry-Preis aus historical data
        entry_price = 0.50  # Placeholder
        
        trade = Trade(
            market_id=signal.market_id,
            market_name=signal.market_name,
            entry_time=timestamp,
            entry_price=entry_price,
            exit_time=None,
            exit_price=None,
            position_size=position_size,
            pnl=0.0,
            pnl_pct=0.0,
            signal_confidence=signal.confidence,
        )
        
        self.positions[signal.market_id] = trade
        self.current_capital -= position_size
        
        logger.debug(f"Opened position: {signal.market_name} @ {entry_price:.3f}")
    
    async def _update_positions(self, timestamp: datetime):
        """Updated alle offenen Positionen"""
        for market_id, trade in list(self.positions.items()):
            # In Production: Echten Preis aus historical data
            # Hier: Simulation
            import random
            price_change = random.uniform(-0.05, 0.05)  # Random walk
            current_price = trade.entry_price * (1 + price_change)
            
            # Check Stop-Loss
            if current_price <= trade.entry_price * (1 - self.stop_loss_pct):
                await self._close_position(market_id, current_price, timestamp)
                continue
            
            # Check Take-Profit
            if current_price >= trade.entry_price * (1 + self.take_profit_pct):
                await self._close_position(market_id, current_price, timestamp)
                continue
    
    async def _close_position(
        self,
        market_id: str,
        exit_price: float,
        timestamp: datetime
    ):
        """Schließt eine Position"""
        trade = self.positions.get(market_id)
        if not trade:
            return
        
        # Calculate PnL
        shares = trade.position_size / trade.entry_price
        pnl = (exit_price - trade.entry_price) * shares
        pnl_pct = (exit_price - trade.entry_price) / trade.entry_price
        
        trade.exit_time = timestamp
        trade.exit_price = exit_price
        trade.pnl = pnl
        trade.pnl_pct = pnl_pct
        
        # Move to closed trades
        self.closed_trades.append(trade)
        del self.positions[market_id]
        
        # Update capital
        self.current_capital += trade.position_size + pnl
        
        logger.debug(f"Closed position: {trade.market_name} PnL: ${pnl:,.2f}")
    
    async def _close_all_positions(self):
        """Schließt alle verbleibenden Positionen"""
        for market_id, trade in list(self.positions.items()):
            # Exit at current price (simulated)
            exit_price = trade.entry_price  # Neutral exit
            await self._close_position(market_id, exit_price, datetime.utcnow())
    
    def _calculate_result(
        self,
        strategy_name: str,
        start_date: datetime,
        end_date: datetime
    ) -> BacktestResult:
        """Berechnet Performance-Metriken"""
        total_return = self.current_capital - self.initial_capital
        total_return_pct = total_return / self.initial_capital
        
        # Win/Loss stats
        winning_trades = [t for t in self.closed_trades if t.pnl > 0]
        losing_trades = [t for t in self.closed_trades if t.pnl <= 0]
        
        win_rate = len(winning_trades) / max(1, len(self.closed_trades))
        
        avg_win = sum(t.pnl for t in winning_trades) / max(1, len(winning_trades))
        avg_loss = sum(t.pnl for t in losing_trades) / max(1, len(losing_trades))
        
        # Profit Factor
        gross_profit = sum(t.pnl for t in winning_trades)
        gross_loss = abs(sum(t.pnl for t in losing_trades))
        profit_factor = gross_profit / max(1, gross_loss)
        
        # Sharpe Ratio (annualized)
        if len(self.equity_curve) > 1:
            returns = []
            for i in range(1, len(self.equity_curve)):
                ret = (self.equity_curve[i]['equity'] - self.equity_curve[i-1]['equity']) / self.equity_curve[i-1]['equity']
                returns.append(ret)
            
            import statistics
            if len(returns) > 1 and statistics.stdev(returns) > 0:
                sharpe = (statistics.mean(returns) / statistics.stdev(returns)) * (252 ** 0.5)  # Annualized
            else:
                sharpe = 0.0
        else:
            sharpe = 0.0
        
        # Max Drawdown
        max_dd = 0.0
        peak = self.initial_capital
        for point in self.equity_curve:
            if point['equity'] > peak:
                peak = point['equity']
            dd = (peak - point['equity']) / peak
            if dd > max_dd:
                max_dd = dd
        
        return BacktestResult(
            strategy_name=strategy_name,
            start_date=start_date,
            end_date=end_date,
            initial_capital=self.initial_capital,
            final_capital=self.current_capital,
            total_return=total_return,
            total_return_pct=total_return_pct,
            sharpe_ratio=sharpe,
            max_drawdown=max_dd,
            win_rate=win_rate,
            total_trades=len(self.closed_trades),
            winning_trades=len(winning_trades),
            losing_trades=len(losing_trades),
            avg_win=avg_win,
            avg_loss=avg_loss,
            profit_factor=profit_factor,
            equity_curve=self.equity_curve,
            trades=[
                {
                    'market': t.market_name,
                    'entry_time': t.entry_time.isoformat(),
                    'exit_time': t.exit_time.isoformat() if t.exit_time else None,
                    'pnl': t.pnl,
                    'pnl_pct': t.pnl_pct,
                }
                for t in self.closed_trades
            ],
        )
    
    def run_walk_forward_test(
        self,
        strategy: AlphaStrategy,
        historical_data: List[Dict[str, Any]],
        n_splits: int = 5
    ) -> List[BacktestResult]:
        """
        Führt Walk-Forward Test durch
        
        Args:
            strategy: Zu testende Strategie
            historical_data: Historische Daten
            n_splits: Anzahl der Splits
            
        Returns:
            Liste von BacktestResults für jede Periode
        """
        # In Production: Echte Walk-Forward Logik
        logger.info(f"Running walk-forward test with {n_splits} splits")
        return []
