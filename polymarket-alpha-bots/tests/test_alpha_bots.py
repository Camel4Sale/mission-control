"""
Unit-Tests für Polymarket Alpha Bots

Tests für alle 4 Strategien + Engine Components
"""

import pytest
import asyncio
from datetime import datetime, timedelta
from unittest.mock import AsyncMock, MagicMock, patch

from bots.alpha.base import Signal, SignalStrength, AlphaStrategy
from bots.alpha.on_chain import OnChainStrategy
from bots.alpha.social_media import SocialMediaStrategy
from bots.alpha.news_api import NewsAPIStrategy
from bots.alpha.correlation import CorrelationStrategy
from engine.signal_generator import SignalGenerator, SignalScore
from engine.risk_manager import RiskManager, Position
from engine.backtester import Backtester, BacktestResult


class TestSignal:
    """Tests für Signal-Klasse"""
    
    def test_signal_creation(self):
        """Test Signal-Erstellung"""
        signal = Signal(
            strategy_name='TestStrategy',
            market_id='market-123',
            market_name='Test Market',
            action='BUY',
            confidence=75,
        )
        
        assert signal.strategy_name == 'TestStrategy'
        assert signal.confidence == 75
        assert signal.action == 'BUY'
        assert not signal.is_expired()
    
    def test_signal_expiration(self):
        """Test Signal-Ablauf"""
        signal = Signal(
            strategy_name='Test',
            market_id='123',
            market_name='Test',
            action='BUY',
            confidence=50,
            expires_at=datetime.utcnow() - timedelta(hours=1),
        )
        
        assert signal.is_expired()
    
    def test_signal_to_dict(self):
        """Test Signal-zu-Dict Konvertierung"""
        signal = Signal(
            strategy_name='Test',
            market_id='123',
            market_name='Test Market',
            action='SELL',
            confidence=80,
        )
        
        d = signal.to_dict()
        assert d['strategy_name'] == 'Test'
        assert d['confidence'] == 80
        assert 'timestamp' in d


class TestOnChainStrategy:
    """Tests für On-Chain Strategie"""
    
    @pytest.mark.asyncio
    async def test_initialization(self):
        """Test Initialisierung"""
        config = {'polygonscan_api_key': 'test_key'}
        strategy = OnChainStrategy(config, paper_trading=True)
        
        result = await strategy.initialize()
        
        assert strategy.session is not None
        assert result is True
    
    @pytest.mark.asyncio
    async def test_signal_generation(self):
        """Test Signal-Generierung"""
        config = {'polygonscan_api_key': 'test_key'}
        strategy = OnChainStrategy(config, paper_trading=True)
        await strategy.initialize()
        
        signals = await strategy.generate_signals()
        
        assert isinstance(signals, list)
        # Signale sollten Signal-Objekte sein
    
    @pytest.mark.asyncio
    async def test_health_check(self):
        """Test Health-Check"""
        config = {'polygonscan_api_key': 'test_key'}
        strategy = OnChainStrategy(config, paper_trading=True)
        await strategy.initialize()
        
        health = await strategy.health_check()
        
        assert 'status' in health
        assert 'whale_wallets_tracked' in health


class TestSocialMediaStrategy:
    """Tests für Social Media Strategie"""
    
    @pytest.mark.asyncio
    async def test_initialization(self):
        """Test Initialisierung"""
        config = {'twitter_bearer_token': 'test_token'}
        strategy = SocialMediaStrategy(config, paper_trading=True)
        
        result = await strategy.initialize()
        
        assert strategy.session is not None
    
    @pytest.mark.asyncio
    async def test_sentiment_analysis(self):
        """Test Sentiment-Analyse"""
        from textblob import TextBlob
        
        positive = TextBlob("This is great and amazing!")
        assert positive.sentiment.polarity > 0
        
        negative = TextBlob("This is terrible and awful!")
        assert negative.sentiment.polarity < 0


class TestNewsAPIStrategy:
    """Tests für News API Strategie"""
    
    @pytest.mark.asyncio
    async def test_initialization(self):
        """Test Initialisierung"""
        config = {'cryptopanic_api_key': 'test_key'}
        strategy = NewsAPIStrategy(config, paper_trading=True)
        
        result = await strategy.initialize()
        
        assert strategy.session is not None


class TestCorrelationStrategy:
    """Tests für Correlation Strategie"""
    
    @pytest.mark.asyncio
    async def test_price_comparison(self):
        """Test Preis-Vergleich"""
        config = {}
        strategy = CorrelationStrategy(config, paper_trading=True)
        await strategy.initialize()
        
        # Test normalize_market_id
        normalized = strategy._normalize_market_id("Trump Wins 2024!")
        assert normalized == "trump wins 2024"


class TestSignalGenerator:
    """Tests für Signal Generator"""
    
    def test_scoring(self):
        """Test Signal-Bewertung"""
        # Mock strategies
        mock_strategies = []
        
        generator = SignalGenerator(mock_strategies)
        
        # Test sollte ohne Fehler laufen
        assert generator is not None
    
    def test_strategy_performance_tracking(self):
        """Test Performance-Tracking"""
        generator = SignalGenerator([])
        
        generator.update_strategy_performance('TestStrategy', profitable=True, profit_amount=100)
        
        perf = generator.strategy_performance['TestStrategy']
        assert perf.total_signals == 1
        assert perf.profitable_signals == 1
        assert perf.win_rate == 1.0


class TestRiskManager:
    """Tests für Risk Manager"""
    
    def test_position_sizing(self):
        """Test Positionsgrößen-Berechnung"""
        rm = RiskManager(portfolio_value=10000.0)
        
        signal = Signal(
            strategy_name='Test',
            market_id='123',
            market_name='Test Market',
            action='BUY',
            confidence=75,
        )
        
        size = rm.calculate_position_size(signal, confidence=75)
        
        assert size > 0
        assert size <= rm.portfolio_value * 0.10  # Max 10%
    
    def test_can_open_position(self):
        """Test Position-Opening-Check"""
        rm = RiskManager(portfolio_value=10000.0)
        
        signal = Signal(
            strategy_name='Test',
            market_id='123',
            market_name='Test Market',
            action='BUY',
            confidence=75,
        )
        
        allowed, reason = rm.can_open_position(signal, position_size=500)
        
        assert allowed is True
        assert reason == "OK"
    
    def test_circuit_breaker(self):
        """Test Circuit Breaker"""
        rm = RiskManager(portfolio_value=10000.0)
        
        # Simuliere großen Verlust
        rm.daily_pnl = -1500  # -15% (über 10% Limit)
        
        assert rm.check_circuit_breaker() is True
        assert rm.circuit_breaker_active is True
    
    def test_open_and_close_position(self):
        """Test Position-Opening und -Closing"""
        rm = RiskManager(portfolio_value=10000.0)
        
        signal = Signal(
            strategy_name='Test',
            market_id='123',
            market_name='Test Market',
            action='BUY',
            confidence=75,
        )
        
        # Open position
        position = rm.open_position(signal, entry_price=0.50, position_size=500)
        
        assert position is not None
        assert len(rm.positions) == 1
        
        # Close position
        pnl = rm.close_position('123', exit_price=0.60)
        
        assert pnl > 0  # Profit
        assert len(rm.positions) == 0


class TestBacktester:
    """Tests für Backtester"""
    
    @pytest.mark.asyncio
    async def test_backtest_result(self):
        """Test Backtest-Ergebnis"""
        backtester = Backtester(initial_capital=10000.0)
        
        # Mock strategy
        mock_strategy = AsyncMock()
        mock_strategy.name = 'MockStrategy'
        mock_strategy.generate_signals = AsyncMock(return_value=[])
        
        start_date = datetime.utcnow() - timedelta(days=30)
        end_date = datetime.utcnow()
        
        result = await backtester.run_backtest(
            strategy=mock_strategy,
            historical_data=[],
            start_date=start_date,
            end_date=end_date,
        )
        
        assert isinstance(result, BacktestResult)
        assert result.initial_capital == 10000.0
        assert result.strategy_name == 'MockStrategy'


class TestIntegration:
    """Integration Tests"""
    
    @pytest.mark.asyncio
    async def test_full_cycle(self):
        """Test kompletter Trading-Zyklus"""
        from bots.alpha.config import Config
        from main import PolymarketAlphaBot
        
        config = Config()
        bot = PolymarketAlphaBot(config, paper_trading=True)
        
        await bot.initialize()
        
        # One cycle
        await bot.run_cycle()
        
        # Check stats
        status = bot.get_status()
        assert 'signals_generated' in status
        assert 'trades_executed' in status
        
        await bot.shutdown()


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
