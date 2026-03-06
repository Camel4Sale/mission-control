"""
Prediction Market Correlation Strategie

Vergleicht Preise über verschiedene Prediction Markets:
- Polymarket (Crypto)
- PredictIt (US, reguliert)
- Betfair (Sport, Events)
- Kalshi (US, reguliert)

Signal: Wenn PredictIt höher als Polymarket → Polymarket kaufen
Auto-Trade bei Differenz > 5%

"""

import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging
from dataclasses import dataclass, field

import aiohttp

from .base import AlphaStrategy, Signal, SignalStrength

logger = logging.getLogger(__name__)


@dataclass
class MarketPrice:
    """Preis eines Marktes auf einer Plattform"""
    platform: str  # polymarket, predictit, betfair, kalshi
    market_id: str
    market_name: str
    outcome: str  # Yes/No oder spezifisches Outcome
    price: float  # 0.0 - 1.0 (oder 0-100¢)
    volume: float
    last_updated: datetime
    url: str = ''


@dataclass
class ArbitrageOpportunity:
    """Eine Arbitrage-Möglichkeit zwischen Plattformen"""
    market_a: MarketPrice
    market_b: MarketPrice
    price_diff: float  # Absoluter Unterschied
    price_diff_pct: float  # Prozentualer Unterschied
    expected_profit: float  # Nach Fees
    confidence: float  # 0-100


class CorrelationStrategy(AlphaStrategy):
    """
    Prediction Market Correlation für Polymarket Alpha
    
    Nutzt Preis-Unterschiede zwischen verschiedenen Plattformen
    """
    
    # Unterstützte Plattformen
    PLATFORMS = ['polymarket', 'predictit', 'betfair', 'kalshi']
    
    # API-Endpoints
    API_ENDPOINTS = {
        'polymarket': 'https://gamma-api.polymarket.com',
        'predictit': 'https://www.predictit.org/api',
        'betfair': 'https://api.betfair.com/exchange/betting',
        'kalshi': 'https://api.kalshi.com',
    }
    
    # Trading-Schwellenwerte
    MIN_PRICE_DIFF = 0.05  # 5% minimum
    MIN_VOLUME = 1000  # Mindest-Volumen für Liquidität
    MAX_POSITION_SIZE = 0.10  # Max 10% des Portfolios
    
    def __init__(self, config: Dict[str, Any], paper_trading: bool = True):
        super().__init__(config, paper_trading)
        
        self.predictit_api_key = config.get('predictit_api_key')
        self.betfair_api_key = config.get('betfair_api_key')
        self.betfair_cert_path = config.get('betfair_cert_path')
        self.kalshi_api_key = config.get('kalshi_api_key')
        
        self.session: Optional[aiohttp.ClientSession] = None
        self.market_prices: Dict[str, List[MarketPrice]] = {}  # market_id -> prices
        self.opportunities: List[ArbitrageOpportunity] = []
        
    async def initialize(self) -> bool:
        """Initialisiert API-Clients"""
        try:
            self.session = aiohttp.ClientSession(
                headers={'User-Agent': 'PolymarketAlphaBot/1.0'}
            )
            
            # Initiale Preise laden
            await self._fetch_all_prices()
            
            self.logger.info("Correlation-Strategie initialisiert")
            return True
            
        except Exception as e:
            self.logger.error(f"Initialisierung fehlgeschlagen: {e}")
            return False
    
    async def generate_signals(self) -> List[Signal]:
        """Generiert Signale basierend auf Preis-Korrelationen"""
        signals = []
        
        try:
            # 1. Aktuelle Preise von allen Plattformen fetchen
            await self._fetch_all_prices()
            
            # 2. Preis-Vergleiche durchführen
            await self._compare_prices()
            
            # 3. Arbitrage-Möglichkeiten identifizieren
            opportunities = await self._identify_opportunities()
            
            # 4. Signale generieren
            for opp in opportunities:
                signal = self._create_signal_from_opportunity(opp)
                if signal:
                    signals.append(signal)
            
            self.last_run = datetime.utcnow()
            
            for signal in signals:
                self.log_signal(signal)
                
        except Exception as e:
            self.logger.error(f"Fehler bei Signal-Generierung: {e}")
        
        return signals
    
    async def _fetch_all_prices(self):
        """Fetcht Preise von allen Plattformen"""
        tasks = [
            self._fetch_polymarket_prices(),
            self._fetch_predictit_prices(),
            self._fetch_betfair_prices(),
            self._fetch_kalshi_prices(),
        ]
        
        await asyncio.gather(*tasks, return_exceptions=True)
    
    async def _fetch_polymarket_prices(self):
        """Fetcht Polymarket Preise"""
        url = f"{self.API_ENDPOINTS['polymarket']}/markets"
        params = {'limit': 100, 'active': 'true'}
        
        try:
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    for market in data.get('markets', []):
                        for outcome in market.get('outcomes', []):
                            price = MarketPrice(
                                platform='polymarket',
                                market_id=market.get('id', ''),
                                market_name=market.get('title', ''),
                                outcome=outcome.get('name', ''),
                                price=outcome.get('price', 0.0) / 100,  # Convert cents to 0-1
                                volume=market.get('volume', 0),
                                last_updated=datetime.utcnow(),
                                url=f"https://polymarket.com/market/{market.get('id', '')}",
                            )
                            
                            # Speichern nach market_id (normalisiert)
                            key = self._normalize_market_id(market.get('title', ''))
                            if key not in self.market_prices:
                                self.market_prices[key] = []
                            self.market_prices[key].append(price)
                    
        except Exception as e:
            self.logger.error(f"Polymarket API Error: {e}")
    
    async def _fetch_predictit_prices(self):
        """Fetcht PredictIt Preise"""
        if not self.predictit_api_key:
            return
        
        url = f"{self.API_ENDPOINTS['predictit']}/markets/all"
        
        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    for market in data.get('markets', []):
                        for contract in market.get('contracts', []):
                            yes_price = contract.get('yesBid', 0) / 100
                            no_price = contract.get('noBid', 0) / 100
                            
                            # Yes contract
                            price = MarketPrice(
                                platform='predictit',
                                market_id=market.get('id', ''),
                                market_name=market.get('name', ''),
                                outcome='Yes',
                                price=yes_price,
                                volume=contract.get('volume', 0),
                                last_updated=datetime.utcnow(),
                                url=f"https://www.predictit.org/m/{market.get('id', '')}",
                            )
                            
                            key = self._normalize_market_id(market.get('name', ''))
                            if key not in self.market_prices:
                                self.market_prices[key] = []
                            self.market_prices[key].append(price)
                            
        except Exception as e:
            self.logger.error(f"PredictIt API Error: {e}")
    
    async def _fetch_betfair_prices(self):
        """Fetcht Betfair Preise (Sport)"""
        if not self.betfair_api_key:
            return
        
        # In Production: Echte Betfair API mit Authentication
        # Hier: Placeholder
        pass
    
    async def _fetch_kalshi_prices(self):
        """Fetcht Kalshi Preise"""
        if not self.kalshi_api_key:
            return
        
        url = f"{self.API_ENDPOINTS['kalshi']}/markets"
        
        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    for market in data.get('markets', []):
                        price = MarketPrice(
                            platform='kalshi',
                            market_id=market.get('ticker', ''),
                            market_name=market.get('title', ''),
                            outcome='Yes',
                            price=market.get('yes_bid', 0) / 100,
                            volume=market.get('volume', 0),
                            last_updated=datetime.utcnow(),
                            url=f"https://kalshi.com/markets/{market.get('ticker', '')}",
                        )
                        
                        key = self._normalize_market_id(market.get('title', ''))
                        if key not in self.market_prices:
                            self.market_prices[key] = []
                        self.market_prices[key].append(price)
                        
        except Exception as e:
            self.logger.error(f"Kalshi API Error: {e}")
    
    def _normalize_market_id(self, title: str) -> str:
        """Normalisiert Market-Titel für Vergleich"""
        # Entfernt Sonderzeichen, lowercase
        normalized = ''.join(c.lower() for c in title if c.isalnum() or c.isspace())
        return normalized.strip()
    
    async def _compare_prices(self):
        """Vergleicht Preise über alle Plattformen"""
        # Wird automatisch in _fetch_all_prices gemacht
        pass
    
    async def _identify_opportunities(self) -> List[ArbitrageOpportunity]:
        """Identifiziert Arbitrage-Möglichkeiten"""
        opportunities = []
        
        for market_id, prices in self.market_prices.items():
            if len(prices) < 2:
                continue  # Brauchen mind. 2 Plattformen für Vergleich
            
            # Gruppiere nach Plattform
            by_platform = {p.platform: p for p in prices}
            
            # Vergleiche Polymarket mit anderen Plattformen
            poly_price = by_platform.get('polymarket')
            if not poly_price:
                continue
            
            for other_platform in ['predictit', 'betfair', 'kalshi']:
                other_price = by_platform.get(other_platform)
                if not other_price:
                    continue
                
                # Preis-Differenz berechnen
                diff = other_price.price - poly_price.price
                diff_pct = diff / poly_price.price if poly_price.price > 0 else 0
                
                # Prüfen ob über Threshold
                if abs(diff_pct) >= self.MIN_PRICE_DIFF:
                    # Volumen prüfen
                    if poly_price.volume >= self.MIN_VOLUME and other_price.volume >= self.MIN_VOLUME:
                        # Expected Profit berechnen (nach Fees)
                        fees = 0.05  # 5% Fees annehmen
                        expected_profit = abs(diff_pct) - fees
                        
                        if expected_profit > 0:
                            # Confidence berechnen
                            confidence = min(100, abs(diff_pct) * 200)  # Höhere Diff = höhere Confidence
                            
                            opp = ArbitrageOpportunity(
                                market_a=poly_price,
                                market_b=other_price,
                                price_diff=abs(diff),
                                price_diff_pct=abs(diff_pct),
                                expected_profit=expected_profit,
                                confidence=confidence,
                            )
                            opportunities.append(opp)
        
        self.opportunities = opportunities
        return opportunities
    
    def _create_signal_from_opportunity(self, opp: ArbitrageOpportunity) -> Signal:
        """Erstellt Trading-Signal aus Arbitrage-Opportunity"""
        # Action bestimmen
        if opp.market_b.price > opp.market_a.price:
            # PredictIt höher → Polymarket kaufen
            action = 'BUY'
            market = opp.market_a
        else:
            # Polymarket höher → Polymarket verkaufen
            action = 'SELL'
            market = opp.market_a
        
        signal = Signal(
            strategy_name='Correlation-Arbitrage',
            market_id=market.market_id,
            market_name=market.market_name,
            action=action,
            confidence=int(opp.confidence),
            metadata={
                'opportunity_type': 'cross_platform',
                'platform_a': opp.market_a.platform,
                'platform_b': opp.market_b.platform,
                'price_a': opp.market_a.price,
                'price_b': opp.market_b.price,
                'price_diff_pct': opp.price_diff_pct,
                'expected_profit': opp.expected_profit,
            },
            expires_at=datetime.utcnow() + timedelta(minutes=10),  # Arbitrage schnell weg
        )
        
        return signal
    
    async def health_check(self) -> Dict[str, Any]:
        """Prüft Gesundheitsstatus"""
        return {
            'strategy': self.name,
            'status': 'healthy' if self.session else 'uninitialized',
            'markets_tracked': len(self.market_prices),
            'opportunities_found': len(self.opportunities),
            'platforms_connected': sum([
                bool(self.predictit_api_key),
                bool(self.betfair_api_key),
                bool(self.kalshi_api_key),
            ]),
            'last_run': self.last_run.isoformat() if self.last_run else None,
        }
    
    async def close(self):
        """Schließt Connections"""
        if self.session:
            await self.session.close()
