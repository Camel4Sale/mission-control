"""
Signal Generator - Engine Component

Kombiniert Signale von allen Strategien:
- Scoring (0-100) pro Signal
- Weighting basierend auf historischer Performance
- Ranking und Filterung
- Output: Top-Signale für Execution
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
class SignalScore:
    """Bewertung eines Signals"""
    signal: Signal
    raw_score: float  # Original confidence
    weighted_score: float  # Nach Strategy-Weighting
    historical_accuracy: float  # Strategy accuracy für diesen Signal-Typ
    recency_factor: float  # Bonus für frische Signale
    final_score: float  # Gesamtscore
    rank: int = 0


@dataclass
class StrategyPerformance:
    """Historische Performance einer Strategie"""
    strategy_name: str
    total_signals: int = 0
    profitable_signals: int = 0
    win_rate: float = 0.0
    avg_profit: float = 0.0
    sharpe_ratio: float = 0.0
    last_updated: Optional[datetime] = None


class SignalGenerator:
    """
    Generiert und bewertet Trading-Signale
    
    Aggregiert Signale von allen Alpha-Strategien,
    bewertet sie und liefert die besten für Execution
    """
    
    # Strategy-Weightings (werden dynamisch angepasst)
    STRATEGY_WEIGHTS = {
        'OnChainStrategy': 0.25,
        'SocialMediaStrategy': 0.20,
        'NewsAPIStrategy': 0.30,
        'CorrelationStrategy': 0.25,
    }
    
    # Schwellenwerte
    MIN_FINAL_SCORE = 60  # Minimum für Execution
    TOP_N_SIGNALS = 10  # Nur Top 10 Signale weitergeben
    
    def __init__(self, strategies: List[AlphaStrategy]):
        self.strategies = {s.name: s for s in strategies}
        self.signal_history: List[SignalScore] = []
        self.strategy_performance: Dict[str, StrategyPerformance] = {}
        self.pending_signals: List[SignalScore] = []
        
        # Initialize performance tracking
        for strategy_name in self.strategies:
            self.strategy_performance[strategy_name] = StrategyPerformance(
                strategy_name=strategy_name
            )
        
        logger.info(f"SignalGenerator initialized with {len(strategies)} strategies")
    
    async def generate_signals(self) -> List[SignalScore]:
        """
        Generiert bewertete Signale von allen Strategien
        
        Returns:
            Liste von SignalScore-Objekten, sortiert nach final_score
        """
        all_signals: List[Signal] = []
        
        # 1. Signale von allen Strategien sammeln
        for strategy in self.strategies.values():
            try:
                signals = await strategy.generate_signals()
                all_signals.extend(signals)
                logger.debug(f"{strategy.name} generated {len(signals)} signals")
            except Exception as e:
                logger.error(f"{strategy.name} failed: {e}")
        
        # 2. Signale bewerten
        scored_signals = await self._score_signals(all_signals)
        
        # 3. Sortieren und Top N auswählen
        scored_signals.sort(key=lambda x: x.final_score, reverse=True)
        
        for i, signal in enumerate(scored_signals[:self.TOP_N_SIGNALS]):
            signal.rank = i + 1
        
        self.pending_signals = scored_signals[:self.TOP_N_SIGNALS]
        
        logger.info(f"Generated {len(self.pending_signals)} top signals")
        return self.pending_signals
    
    async def _score_signals(self, signals: List[Signal]) -> List[SignalScore]:
        """Bewertet alle Signale"""
        scored = []
        
        for signal in signals:
            # Skip expired signals
            if signal.is_expired():
                continue
            
            # Get strategy performance
            perf = self.strategy_performance.get(signal.strategy_name, StrategyPerformance(signal.strategy_name))
            
            # Calculate factors
            raw_score = float(signal.confidence)
            
            # Historical accuracy factor
            historical_accuracy = perf.win_rate if perf.win_rate > 0 else 0.5
            
            # Recency factor (newer = better)
            age_minutes = (datetime.utcnow() - signal.timestamp).total_seconds() / 60
            recency_factor = max(0, 1 - age_minutes / 60)  # Nach 60 Min = 0
            
            # Strategy weight
            strategy_weight = self.STRATEGY_WEIGHTS.get(signal.strategy_name, 0.2)
            
            # Calculate weighted score
            weighted_score = (
                raw_score * 0.4 +  # Original confidence
                historical_accuracy * 100 * 0.3 +  # Historical performance
                recency_factor * 100 * 0.15 +  # Recency
                strategy_weight * 100 * 0.15  # Strategy weight
            )
            
            signal_score = SignalScore(
                signal=signal,
                raw_score=raw_score,
                weighted_score=weighted_score,
                historical_accuracy=historical_accuracy,
                recency_factor=recency_factor,
                final_score=weighted_score,
            )
            scored.append(signal_score)
        
        # Filter minimum score
        scored = [s for s in scored if s.final_score >= self.MIN_FINAL_SCORE]
        
        return scored
    
    def update_strategy_performance(
        self,
        strategy_name: str,
        profitable: bool,
        profit_amount: float = 0.0
    ):
        """
        Updated Performance-Statistiken einer Strategie
        
        Args:
            strategy_name: Name der Strategie
            profitable: War das Signal profitabel?
            profit_amount: Profit/Verlust Betrag
        """
        perf = self.strategy_performance.get(strategy_name)
        if not perf:
            perf = StrategyPerformance(strategy_name=strategy_name)
            self.strategy_performance[strategy_name] = perf
        
        perf.total_signals += 1
        if profitable:
            perf.profitable_signals += 1
        
        # Update win rate
        perf.win_rate = perf.profitable_signals / perf.total_signals
        
        # Update average profit (simple moving average)
        perf.avg_profit = (perf.avg_profit * (perf.total_signals - 1) + profit_amount) / perf.total_signals
        
        perf.last_updated = datetime.utcnow()
        
        logger.info(
            f"Updated {strategy_name} performance: "
            f"win_rate={perf.win_rate:.2%}, avg_profit={perf.avg_profit:.2f}"
        )
    
    def get_strategy_stats(self) -> Dict[str, Dict[str, Any]]:
        """Returns Performance-Statistiken aller Strategien"""
        stats = {}
        
        for name, perf in self.strategy_performance.items():
            stats[name] = {
                'total_signals': perf.total_signals,
                'win_rate': perf.win_rate,
                'avg_profit': perf.avg_profit,
                'sharpe_ratio': perf.sharpe_ratio,
                'last_updated': perf.last_updated.isoformat() if perf.last_updated else None,
            }
        
        return stats
    
    def get_pending_signals(self) -> List[SignalScore]:
        """Returns aktuelle pending Signale"""
        return self.pending_signals
    
    def to_dict(self) -> Dict[str, Any]:
        """Exportiert SignalGenerator Status"""
        return {
            'strategies': list(self.strategies.keys()),
            'strategy_weights': self.STRATEGY_WEIGHTS,
            'pending_signals': [
                {
                    'rank': s.rank,
                    'strategy': s.signal.strategy_name,
                    'market': s.signal.market_name,
                    'action': s.signal.action,
                    'final_score': s.final_score,
                    'raw_score': s.raw_score,
                }
                for s in self.pending_signals
            ],
            'strategy_performance': self.get_strategy_stats(),
        }
