"""
Polymarket Alpha Bots - Haupt-Runner

Startet alle 4 Alpha-Strategien und koordiniert:
- Signal-Generierung
- Risk-Management
- Trade-Execution (Paper-Trading)
- Monitoring
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any
from pathlib import Path

from bots.alpha import (
    OnChainStrategy,
    SocialMediaStrategy,
    NewsAPIStrategy,
    CorrelationStrategy,
)
from bots.alpha.config import Config
from engine.signal_generator import SignalGenerator
from engine.risk_manager import RiskManager
from engine.backtester import Backtester

# Logging konfigurieren
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('polymarket_alpha.log'),
    ]
)

logger = logging.getLogger(__name__)


class PolymarketAlphaBot:
    """
    Haupt-Klasse für Polymarket Alpha Bot System
    
    Koordiniert alle Strategien, Risk-Management und Execution
    """
    
    def __init__(self, config: Config, paper_trading: bool = True):
        self.config = config
        self.paper_trading = paper_trading
        
        # Initialize strategies
        self.strategies = self._init_strategies()
        
        # Initialize engine components
        self.signal_generator = SignalGenerator(self.strategies)
        self.risk_manager = RiskManager(
            portfolio_value=10000.0,  # $10k Startkapital
            risk_params=config.get_risk_config().__dict__
        )
        
        # Stats
        self.signals_generated = 0
        self.trades_executed = 0
        self.start_time = datetime.utcnow()
        
        logger.info(f"PolymarketAlphaBot initialized (paper_trading={paper_trading})")
    
    def _init_strategies(self) -> List:
        """Initialisiert alle Alpha-Strategien"""
        strategies = []
        api_config = self.config.get_api_config()
        
        # 1. On-Chain Strategy
        if self.config.get_strategy_config('on_chain').enabled:
            onchain = OnChainStrategy(
                config={
                    'polygonscan_api_key': api_config.polygonscan_api_key,
                    'nansen_api_key': api_config.nansen_api_key,
                },
                paper_trading=self.paper_trading,
            )
            strategies.append(onchain)
        
        # 2. Social Media Strategy
        if self.config.get_strategy_config('social_media').enabled:
            social = SocialMediaStrategy(
                config={
                    'twitter_bearer_token': api_config.twitter_bearer_token,
                    'reddit_client_id': api_config.reddit_client_id,
                },
                paper_trading=self.paper_trading,
            )
            strategies.append(social)
        
        # 3. News API Strategy
        if self.config.get_strategy_config('news_api').enabled:
            news = NewsAPIStrategy(
                config={
                    'cryptopanic_api_key': api_config.cryptopanic_api_key,
                    'google_news_api_key': api_config.google_news_api_key,
                },
                paper_trading=self.paper_trading,
            )
            strategies.append(news)
        
        # 4. Correlation Strategy
        if self.config.get_strategy_config('correlation').enabled:
            correlation = CorrelationStrategy(
                config={
                    'predictit_api_key': api_config.predictit_api_key,
                    'betfair_api_key': api_config.betfair_api_key,
                    'kalshi_api_key': api_config.kalshi_api_key,
                },
                paper_trading=self.paper_trading,
            )
            strategies.append(correlation)
        
        logger.info(f"Initialized {len(strategies)} strategies")
        return strategies
    
    async def initialize(self):
        """Initialisiert alle Komponenten"""
        logger.info("Initializing all strategies...")
        
        for strategy in self.strategies:
            success = await strategy.initialize()
            if not success:
                logger.warning(f"Strategy {strategy.name} initialization failed")
        
        logger.info("All strategies initialized")
    
    async def run_cycle(self):
        """
        Führt einen Trading-Zyklus aus
        
        1. Signale von allen Strategien generieren
        2. Signale bewerten und ranken
        3. Risk-Checks durchführen
        4. Trades ausführen (Paper-Trading)
        5. Status loggen
        """
        logger.info("=== Starting Trading Cycle ===")
        
        # 1. Signale generieren
        scored_signals = await self.signal_generator.generate_signals()
        self.signals_generated += len(scored_signals)
        
        logger.info(f"Generated {len(scored_signals)} signals")
        
        # 2. Top-Signale verarbeiten
        for signal_score in scored_signals[:5]:  # Top 5
            signal = signal_score.signal
            
            logger.info(
                f"Signal: {signal.action} {signal.market_name} "
                f"confidence={signal.confidence} score={signal_score.final_score:.1f}"
            )
            
            # 3. Position-Size berechnen
            position_size = self.risk_manager.calculate_position_size(
                signal, signal.confidence
            )
            
            if position_size <= 0:
                logger.debug("Position size too small, skipping")
                continue
            
            # 4. Risk-Check
            allowed, reason = self.risk_manager.can_open_position(signal, position_size)
            if not allowed:
                logger.warning(f"Trade rejected: {reason}")
                continue
            
            # 5. Execute Trade (Paper-Trading)
            if self.paper_trading:
                # Simulated entry price
                entry_price = 0.50  # Placeholder
                
                position = self.risk_manager.open_position(
                    signal, entry_price, position_size
                )
                
                if position:
                    self.trades_executed += 1
                    logger.info(
                        f"EXECUTED: {signal.market_name} "
                        f"${position_size:,.2f} @ {entry_price:.3f}"
                    )
        
        # 6. Circuit Breaker check
        if self.risk_manager.check_circuit_breaker():
            logger.critical("CIRCUIT BREAKER ACTIVATED - Trading halted!")
        
        # 7. Status loggen
        await self._log_status()
        
        logger.info("=== Trading Cycle Complete ===")
    
    async def _log_status(self):
        """Loggt aktuellen Status"""
        risk_metrics = self.risk_manager.get_risk_metrics()
        
        status = {
            'timestamp': datetime.utcnow().isoformat(),
            'uptime_hours': (datetime.utcnow() - self.start_time).total_seconds() / 3600,
            'signals_generated': self.signals_generated,
            'trades_executed': self.trades_executed,
            'risk_metrics': {
                'total_exposure': risk_metrics.total_exposure,
                'exposure_pct': risk_metrics.exposure_pct,
                'daily_pnl': risk_metrics.daily_pnl,
                'weekly_pnl': risk_metrics.weekly_pnl,
                'positions_count': risk_metrics.positions_count,
            },
            'strategy_stats': self.signal_generator.get_strategy_stats(),
        }
        
        logger.info(f"Status: {json.dumps(status, indent=2)}")
    
    async def run_continuous(self, interval_minutes: int = 5):
        """
        Läuft kontinuierlich im Hintergrund
        
        Args:
            interval_minutes: Intervall zwischen Trading-Zyklen
        """
        logger.info(f"Starting continuous run (interval={interval_minutes}min)")
        
        while True:
            try:
                await self.run_cycle()
                
                # Wait until next cycle
                await asyncio.sleep(interval_minutes * 60)
                
            except KeyboardInterrupt:
                logger.info("Interrupted by user")
                break
            except Exception as e:
                logger.error(f"Error in cycle: {e}")
                await asyncio.sleep(60)  # Wait 1 min before retry
    
    async def run_backtest(self, days: int = 30):
        """
        Führt Backtest durch
        
        Args:
            days: Anzahl der Tage für Backtest
        """
        logger.info(f"Running backtest for {days} days...")
        
        backtester = Backtester(initial_capital=10000.0)
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Backtest jede Strategie einzeln
        for strategy in self.strategies:
            result = await backtester.run_backtest(
                strategy=strategy,
                historical_data=[],  # In Production: Echte Daten
                start_date=start_date,
                end_date=end_date,
            )
            
            logger.info(
                f"Backtest {strategy.name}: "
                f"Return: {result.total_return_pct:.2%}, "
                f"Sharpe: {result.sharpe_ratio:.2f}, "
                f"Win-Rate: {result.win_rate:.2%}"
            )
    
    def get_status(self) -> Dict[str, Any]:
        """Returns aktueller Bot-Status"""
        return {
            'paper_trading': self.paper_trading,
            'uptime_hours': (datetime.utcnow() - self.start_time).total_seconds() / 3600,
            'strategies_active': len(self.strategies),
            'signals_generated': self.signals_generated,
            'trades_executed': self.trades_executed,
            'risk_manager': self.risk_manager.to_dict(),
            'signal_generator': self.signal_generator.to_dict(),
        }
    
    async def shutdown(self):
        """Fährt Bot ordnungsgemäß herunter"""
        logger.info("Shutting down...")
        
        # Close all strategy connections
        for strategy in self.strategies:
            if hasattr(strategy, 'close'):
                await strategy.close()
        
        logger.info("Shutdown complete")


async def main():
    """Main Entry Point"""
    # Konfiguration laden
    config = Config()
    
    # Bot initialisieren
    bot = PolymarketAlphaBot(config, paper_trading=True)
    
    # Initialisieren
    await bot.initialize()
    
    # Status anzeigen
    print("\n" + "="*60)
    print("POLYMARKET ALPHA BOT - READY")
    print("="*60)
    print(f"Paper Trading: {bot.paper_trading}")
    print(f"Strategies: {len(bot.strategies)}")
    print(f"  - On-Chain Analysis")
    print(f"  - Social Media Monitoring")
    print(f"  - News API Integration")
    print(f"  - Prediction Market Correlation")
    print("="*60 + "\n")
    
    # Run one cycle
    await bot.run_cycle()
    
    # ODER: Continuous mode
    # await bot.run_continuous(interval_minutes=5)
    
    # Shutdown
    await bot.shutdown()


if __name__ == '__main__':
    asyncio.run(main())
