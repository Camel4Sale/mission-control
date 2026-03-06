"""
Polymarket Monitoring - Main Entry Point
Orchestrates all monitoring components
"""
import asyncio
import signal
import sys
from datetime import datetime, time
from typing import Optional

sys.path.insert(0, '/data/.openclaw/workspace/polymarket-monitoring')

from monitoring import (
    PnLTracker, AlertSystem, AutoRebalance, 
    CircuitBreaker, Position, config
)

class PolymarketMonitor:
    """Main monitoring orchestrator"""
    
    def __init__(self):
        self.pnl_tracker = PnLTracker()
        self.alert_system: Optional[AlertSystem] = None
        self.circuit_breaker: Optional[CircuitBreaker] = None
        self.auto_rebalance: Optional[AutoRebalance] = None
        self.running = False
        self.shutdown_event = asyncio.Event()
        
    async def initialize(self):
        """Initialize all components"""
        print("🧊 Initializing Polymarket Monitoring System...")
        
        # Initialize alert system
        self.alert_system = AlertSystem(config)
        await self.alert_system.__aenter__()
        
        # Initialize circuit breaker
        self.circuit_breaker = CircuitBreaker(
            self.pnl_tracker, 
            self.alert_system, 
            config
        )
        
        # Initialize auto-rebalance
        self.auto_rebalance = AutoRebalance(
            self.pnl_tracker,
            self.alert_system,
            config
        )
        
        # Set up signal handlers
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
        
        print("✅ All components initialized")
        
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        print("\n🛑 Shutdown signal received...")
        self.running = False
        self.shutdown_event.set()
    
    async def monitor_loop(self):
        """Main monitoring loop"""
        print("👀 Starting monitoring loop...")
        
        while self.running:
            try:
                # Check circuit breaker periods
                if self.circuit_breaker:
                    self.circuit_breaker.check_and_reset_periods()
                
                # Update position prices (in production, fetch from Polymarket API)
                await self.update_prices()
                
                # Check circuit breaker limits
                current_pnl = (
                    self.pnl_tracker.get_total_unrealized_pnl() + 
                    self.pnl_tracker.get_total_realized_pnl()
                )
                
                if self.circuit_breaker:
                    self.circuit_breaker.check_daily_loss(current_pnl)
                    self.circuit_breaker.check_weekly_loss(current_pnl)
                
                # Take P&L snapshot
                self.pnl_tracker.take_snapshot()
                
                # Check rebalancing (every 24 hours)
                if self.auto_rebalance:
                    needs_rebalance, deviations = self.auto_rebalance.check_rebalance_needed()
                    if needs_rebalance:
                        print("🔄 Rebalancing needed...")
                        await self.auto_rebalance.execute_rebalance(dry_run=False)
                
                # Send hourly P&L update to Discord
                if self.alert_system and datetime.now().minute == 0:
                    await self.alert_system.send_pnl_update(
                        self.pnl_tracker.get_total_unrealized_pnl(),
                        self.pnl_tracker.get_total_realized_pnl(),
                        self.pnl_tracker.get_total_roi()
                    )
                
                # Wait for next cycle
                await asyncio.sleep(60)  # Check every minute
                
            except Exception as e:
                print(f"❌ Error in monitoring loop: {e}")
                if self.circuit_breaker:
                    self.circuit_breaker.check_system_error(str(e))
                await asyncio.sleep(5)
    
    async def update_prices(self):
        """Update position prices from Polymarket API"""
        # In production, fetch actual prices from Polymarket
        # For now, simulate price updates
        for market_id, position in self.pnl_tracker.positions.items():
            # Simulate small price movement
            import random
            price_change = random.uniform(-0.02, 0.02)
            new_price = max(0.01, min(0.99, position.current_price + price_change))
            self.pnl_tracker.update_position_price(market_id, new_price)
    
    async def send_daily_summary(self):
        """Send daily summary email at 20:00"""
        while self.running:
            now = datetime.now()
            if now.hour == 20 and now.minute == 0:
                if self.alert_system:
                    daily_pnl = self.pnl_tracker.get_total_realized_pnl(days=1)
                    trades_count = len([
                        t for t in self.pnl_tracker.closed_trades
                        if (datetime.now() - t.exit_time).days == 0
                    ])
                    
                    # Find best and worst trades
                    today_trades = [
                        t for t in self.pnl_tracker.closed_trades
                        if (datetime.now() - t.exit_time).days == 0
                    ]
                    
                    best_trade = max(today_trades, key=lambda t: t.realized_pnl) if today_trades else None
                    worst_trade = min(today_trades, key=lambda t: t.realized_pnl) if today_trades else None
                    
                    await self.alert_system.send_daily_summary(
                        daily_pnl=daily_pnl,
                        trades_count=trades_count,
                        best_trade=f"{best_trade.market_name} (+${best_trade.realized_pnl:.2f})" if best_trade else "N/A",
                        worst_trade=f"{worst_trade.market_name} (-${abs(worst_trade.realized_pnl):.2f})" if worst_trade else "N/A"
                    )
                
                # Wait until next day
                await asyncio.sleep(3600)
            else:
                await asyncio.sleep(60)
    
    async def run(self):
        """Run the monitoring system"""
        await self.initialize()
        
        self.running = True
        
        # Start background tasks
        tasks = [
            asyncio.create_task(self.monitor_loop()),
            asyncio.create_task(self.send_daily_summary()),
        ]
        
        print("✅ Monitoring system started")
        print("📊 Dashboard: http://localhost:3010")
        print("🔌 API: http://localhost:8000")
        print("📚 API Docs: http://localhost:8000/docs")
        
        # Wait for shutdown
        await self.shutdown_event.wait()
        
        # Cleanup
        print("🛑 Shutting down...")
        self.running = False
        
        for task in tasks:
            task.cancel()
        
        if self.alert_system:
            await self.alert_system.__aexit__(None, None, None)
        
        print("✅ Shutdown complete")

async def main():
    monitor = PolymarketMonitor()
    await monitor.run()

if __name__ == "__main__":
    asyncio.run(main())
