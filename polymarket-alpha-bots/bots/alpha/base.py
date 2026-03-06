"""
Abstract Base Class für alle Alpha-Strategien

Definiert das gemeinsame Interface für:
- Signal-Generierung
- Scoring (0-100)
- Paper-Trading Modus
- Logging & Monitoring
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any, List
import logging

logger = logging.getLogger(__name__)


class SignalStrength(Enum):
    """Signal-Stärke für Scoring"""
    VERY_WEAK = 10
    WEAK = 30
    MODERATE = 50
    STRONG = 70
    VERY_STRONG = 90
    EXTREME = 100


@dataclass
class Signal:
    """
    Einheitliches Signal-Format für alle Strategien
    
    Attributes:
        strategy_name: Name der Strategie die das Signal generiert hat
        market_id: Polymarket Market ID
        market_name: Menschlesbarer Markt-Name
        action: BUY oder SELL
        confidence: Score 0-100
        metadata: Strategie-spezifische Zusatzdaten
        timestamp: Wann das Signal generiert wurde
        expires_at: Wann das Signal ungültig wird
    """
    strategy_name: str
    market_id: str
    market_name: str
    action: str  # BUY oder SELL
    confidence: int  # 0-100
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    
    def is_expired(self) -> bool:
        """Prüft ob Signal abgelaufen ist"""
        if self.expires_at is None:
            return False
        return datetime.utcnow() > self.expires_at
    
    def to_dict(self) -> Dict[str, Any]:
        """Konvertiert Signal zu Dictionary"""
        return {
            'strategy_name': self.strategy_name,
            'market_id': self.market_id,
            'market_name': self.market_name,
            'action': self.action,
            'confidence': self.confidence,
            'metadata': self.metadata,
            'timestamp': self.timestamp.isoformat(),
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
        }


class AlphaStrategy(ABC):
    """
    Abstract Base Class für alle Alpha-Strategien
    
    Jede Strategie muss implementieren:
    - initialize(): Setup der API-Clients etc.
    - generate_signals(): Hauptlogik zur Signal-Generierung
    - health_check(): Status der Strategie prüfen
    """
    
    def __init__(self, config: Dict[str, Any], paper_trading: bool = True):
        """
        Initialisiert die Strategie
        
        Args:
            config: Strategie-spezifische Konfiguration
            paper_trading: Wenn True, kein echtes Trading
        """
        self.config = config
        self.paper_trading = paper_trading
        self.name = self.__class__.__name__
        self.enabled = True
        self.last_run: Optional[datetime] = None
        self.signals_generated = 0
        self.logger = logging.getLogger(self.name)
        
        self.logger.info(
            f"{self.name} initialized (paper_trading={paper_trading})"
        )
    
    @abstractmethod
    async def initialize(self) -> bool:
        """
        Initialisiert API-Clients, Connections, etc.
        
        Returns:
            True wenn erfolgreich, False sonst
        """
        pass
    
    @abstractmethod
    async def generate_signals(self) -> List[Signal]:
        """
        Generiert Trading-Signale basierend auf Strategie-Logik
        
        Returns:
            Liste von Signal-Objekten
        """
        pass
    
    @abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """
        Prüft Gesundheitsstatus der Strategie
        
        Returns:
            Dict mit Status-Informationen
        """
        pass
    
    def calculate_confidence_score(
        self,
        base_score: int,
        factors: Dict[str, float]
    ) -> int:
        """
        Berechnet finalen Confidence-Score (0-100)
        
        Args:
            base_score: Basis-Score der Strategie
            factors: Gewichtungsfaktoren {factor_name: weight}
            
        Returns:
            Score zwischen 0 und 100
        """
        score = base_score
        
        # Anwenden der Faktoren
        for factor, weight in factors.items():
            if factor == 'volume_multiplier':
                score = min(100, score * (1 + weight * 0.1))
            elif factor == 'recency_bonus':
                score = min(100, score + weight * 5)
            elif factor == 'historical_accuracy':
                score = min(100, score + weight * 10)
            elif factor == 'sentiment_boost':
                score = min(100, score + weight * 8)
        
        return int(min(100, max(0, score)))
    
    def log_signal(self, signal: Signal):
        """Loggt ein generiertes Signal"""
        self.signals_generated += 1
        self.logger.info(
            f"Signal: {signal.action} {signal.market_name} "
            f"confidence={signal.confidence}"
        )
    
    def get_stats(self) -> Dict[str, Any]:
        """Returns Strategie-Statistiken"""
        return {
            'name': self.name,
            'enabled': self.enabled,
            'paper_trading': self.paper_trading,
            'last_run': self.last_run.isoformat() if self.last_run else None,
            'signals_generated': self.signals_generated,
        }
