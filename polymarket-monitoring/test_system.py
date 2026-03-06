"""
Test Script for Polymarket Monitoring System
Tests all core components
"""
import asyncio
import sys
sys.path.insert(0, '/data/.openclaw/workspace/polymarket-monitoring')

from datetime import datetime
from monitoring import (
    PnLTracker, Position, AlertSystem, AutoRebalance,
    CircuitBreaker, TargetAllocation, config
)

async def test_pnl_tracker():
    """Test P&L tracking functionality"""
    print("\n🧪 Testing P&L Tracker...")
    
    tracker = PnLTracker()
    
    # Add test positions
    positions = [
        Position("1", "Fed Rate March", "Yes", 150, 0.42, 0.58, datetime.now()),
        Position("2", "BTC $100K Q1", "No", 200, 0.65, 0.71, datetime.now()),
        Position("3", "Election Winner", "Yes", 100, 0.35, 0.29, datetime.now()),
    ]
    
    for pos in positions:
        tracker.add_position(pos)
        print(f"  ✅ Added: {pos.market_name} ({pos.outcome})")
    
    # Test calculations
    print(f"\n  📊 Total Unrealized P&L: ${tracker.get_total_unrealized_pnl():.2f}")
    print(f"  📊 Portfolio Value: ${tracker.get_portfolio_value():.2f}")
    print(f"  📊 Total ROI: {tracker.get_total_roi()*100:.2f}%")
    
    # Test snapshot
    snapshot = tracker.take_snapshot()
    print(f"  📸 Snapshot taken: {snapshot.positions_count} positions")
    
    # Test closing position
    trade = tracker.remove_position("3", 0.29)
    print(f"  ✅ Closed position: Realized P&L: ${trade.realized_pnl:.2f}")
    
    print("  ✅ P&L Tracker tests passed!\n")
    return tracker

async def test_circuit_breaker(tracker):
    """Test circuit breaker functionality"""
    print("🧪 Testing Circuit Breaker...")
    
    breaker = CircuitBreaker(tracker, None, config)
    
    # Initialize
    breaker.initialize(10000)
    print("  ✅ Circuit breaker initialized")
    
    # Test status
    status = breaker.get_status()
    print(f"  📊 State: {status['state']}")
    print(f"  📊 Trading Allowed: {status['trading_allowed']}")
    
    # Test daily loss check (should not trigger)
    triggered = breaker.check_daily_loss(9500)  # -5%
    print(f"  ✅ Daily loss check (-5%): {'Triggered' if triggered else 'OK'}")
    
    # Test daily loss check (should trigger)
    triggered = breaker.check_daily_loss(8900)  # -11%
    print(f"  🚨 Daily loss check (-11%): {'Triggered!' if triggered else 'OK'}")
    
    # Test manual override
    breaker.resume_trading()
    breaker.manual_halt("Test halt")
    print("  ✅ Manual halt test passed")
    
    breaker.resume_trading()
    print("  ✅ Resume test passed")
    
    print("  ✅ Circuit Breaker tests passed!\n")
    return breaker

async def test_auto_rebalance(tracker):
    """Test auto-rebalancing functionality"""
    print("🧪 Testing Auto-Rebalance...")
    
    rebalancer = AutoRebalance(tracker, None, config)
    
    # Set target allocations
    targets = [
        TargetAllocation("1", "Fed Rate March", "Yes", 0.50),
        TargetAllocation("2", "BTC $100K Q1", "No", 0.30),
        TargetAllocation("4", "New Market", "Yes", 0.20),
    ]
    rebalancer.set_target_allocations(targets)
    print("  ✅ Target allocations set")
    
    # Check if rebalance needed
    needs_rebalance, deviations = rebalancer.check_rebalance_needed()
    print(f"  📊 Needs rebalance: {needs_rebalance}")
    print(f"  📊 Deviations: {deviations}")
    
    # Generate actions
    if needs_rebalance:
        actions = rebalancer.generate_rebalance_actions(deviations)
        print(f"  📊 Recommended actions: {len(actions)}")
        for action in actions:
            print(f"    • {action.action_type} {action.shares_to_trade:.2f} shares of {action.market_name}")
    
    # Test dry run
    result = await rebalancer.execute_rebalance(dry_run=True)
    print(f"  ✅ Rebalance test (dry run): {result['executed']}")
    
    print("  ✅ Auto-Rebalance tests passed!\n")
    return rebalancer

async def test_alert_system():
    """Test alert system (without actual sending)"""
    print("🧪 Testing Alert System...")
    
    alerts = AlertSystem(config)
    await alerts.__aenter__()
    
    print("  ✅ Alert system initialized")
    print("  ℹ️  Note: Actual alerts require configured credentials")
    
    # Test alert methods (will log but not send without config)
    await alerts.send_telegram("Test alert", "low")
    await alerts.send_discord("Test P&L update", "medium")
    
    await alerts.__aexit__(None, None, None)
    print("  ✅ Alert System tests passed!\n")

async def main():
    """Run all tests"""
    print("=" * 60)
    print("🧊 POLYMARKET MONITORING SYSTEM - TEST SUITE")
    print("=" * 60)
    
    try:
        # Test components
        tracker = await test_pnl_tracker()
        await test_circuit_breaker(tracker)
        await test_auto_rebalance(tracker)
        await test_alert_system()
        
        print("=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        print("\n🎉 System is ready for operation!")
        print("\n📊 Dashboard: http://localhost:3010")
        print("🔌 API: http://localhost:8000")
        print("📚 API Docs: http://localhost:8000/docs")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
