"""
Circuit Breaker - Risk Management & Auto-Exit
"""
import asyncio
from datetime import datetime, timedelta
from typing import Optional, Dict, Callable
from dataclasses import dataclass
from enum import Enum

class CircuitState(Enum):
    ACTIVE = "active"  # Trading allowed
    HALTED = "halted"  # Trading halted due to loss limit
    ERROR = "error"  # Trading halted due to system error
    MANUAL = "manual"  # Trading halted by user

@dataclass
class CircuitBreakerEvent:
    timestamp: datetime
    event_type: str
    trigger_value: float
    trigger_percent: float
    state: CircuitState
    message: str

class CircuitBreaker:
    """Circuit breaker for risk management"""
    
    def __init__(self, pnl_tracker, alert_system, config):
        self.pnl_tracker = pnl_tracker
        self.alert_system = alert_system
        self.config = config.circuit_breaker
        self.state = CircuitState.ACTIVE
        self.events: list[CircuitBreakerEvent] = []
        
        # Track daily and weekly P&L
        self.daily_start_pnl: Optional[float] = None
        self.weekly_start_pnl: Optional[float] = None
        self.last_daily_reset: Optional[datetime] = None
        self.last_weekly_reset: Optional[datetime] = None
        
        # Manual override flag
        self.manual_override_active = False
        
        # System health
        self.system_errors: list = []
        self.consecutive_errors = 0
        self.max_consecutive_errors = 5
        
        # Callbacks
        self.on_halt_callback: Optional[Callable] = None
        self.on_resume_callback: Optional[Callable] = None
        
    def initialize(self, current_pnl: float):
        """Initialize daily and weekly tracking"""
        self.daily_start_pnl = current_pnl
        self.weekly_start_pnl = current_pnl
        self.last_daily_reset = datetime.now()
        self.last_weekly_reset = datetime.now()
        print(f"🧊 Circuit breaker initialized. Starting P&L: ${current_pnl:.2f}")
    
    def check_daily_loss(self, current_pnl: float) -> bool:
        """Check if daily loss limit exceeded"""
        if self.daily_start_pnl is None:
            return False
        
        daily_change = current_pnl - self.daily_start_pnl
        daily_percent = daily_change / abs(self.daily_start_pnl) if self.daily_start_pnl != 0 else 0
        
        if daily_percent <= self.config.daily_loss_limit:
            self._trigger_circuit_breaker(
                "DAILY_LOSS",
                daily_change,
                daily_percent,
                f"Daily loss limit exceeded: {daily_percent*100:.2f}%"
            )
            return True
        
        return False
    
    def check_weekly_loss(self, current_pnl: float) -> bool:
        """Check if weekly loss limit exceeded"""
        if self.weekly_start_pnl is None:
            return False
        
        weekly_change = current_pnl - self.weekly_start_pnl
        weekly_percent = weekly_change / abs(self.weekly_start_pnl) if self.weekly_start_pnl != 0 else 0
        
        if weekly_percent <= self.config.weekly_loss_limit:
            self._trigger_circuit_breaker(
                "WEEKLY_LOSS",
                weekly_change,
                weekly_percent,
                f"Weekly loss limit exceeded: {weekly_percent*100:.2f}%"
            )
            return True
        
        return False
    
    def check_system_error(self, error: str) -> bool:
        """Record system error and check if threshold exceeded"""
        self.system_errors.append({
            "timestamp": datetime.now(),
            "error": error
        })
        self.consecutive_errors += 1
        
        if self.consecutive_errors >= self.max_consecutive_errors:
            self._trigger_circuit_breaker(
                "SYSTEM_ERROR",
                0,
                0,
                f"System error threshold exceeded: {self.consecutive_errors} consecutive errors"
            )
            return True
        
        return False
    
    def reset_errors(self):
        """Reset error counter after successful operation"""
        self.consecutive_errors = 0
    
    def _trigger_circuit_breaker(self, trigger_type: str, change: float, percent: float, message: str):
        """Trigger circuit breaker"""
        if self.state != CircuitState.ACTIVE:
            return  # Already halted
        
        self.state = CircuitState.HALTED if trigger_type in ["DAILY_LOSS", "WEEKLY_LOSS"] else CircuitState.ERROR
        
        event = CircuitBreakerEvent(
            timestamp=datetime.now(),
            event_type=trigger_type,
            trigger_value=change,
            trigger_percent=percent,
            state=self.state,
            message=message
        )
        self.events.append(event)
        
        print(f"🚨 CIRCUIT BREAKER TRIGGERED: {message}")
        
        # Send alerts
        if self.alert_system:
            asyncio.create_task(
                self.alert_system.send_circuit_breaker_alert(trigger_type, change, percent)
            )
        
        # Execute auto-exit if configured
        if self.config.auto_exit_on_error and trigger_type == "SYSTEM_ERROR":
            asyncio.create_task(self._auto_exit_all_positions())
        
        # Call halt callback
        if self.on_halt_callback:
            self.on_halt_callback(self.state, message)
    
    async def _auto_exit_all_positions(self):
        """Auto-exit all positions (emergency shutdown)"""
        print("🚨 AUTO-EXIT: Closing all positions...")
        
        for market_id, position in list(self.pnl_tracker.positions.items()):
            # In production, execute actual exit via Polymarket API
            print(f"  Exiting {position.market_name}: {position.shares} shares @ {position.current_price}")
            self.pnl_tracker.remove_position(market_id, position.current_price)
        
        print("✅ All positions closed")
    
    def manual_halt(self, reason: str = "Manual override"):
        """Manually halt trading"""
        if not self.config.manual_override_enabled and self.state != CircuitState.ACTIVE:
            print("⚠️ Manual override not enabled")
            return
        
        self.state = CircuitState.MANUAL
        self.manual_override_active = True
        
        event = CircuitBreakerEvent(
            timestamp=datetime.now(),
            event_type="MANUAL_HALT",
            trigger_value=0,
            trigger_percent=0,
            state=self.state,
            message=reason
        )
        self.events.append(event)
        
        print(f"✋ Trading halted manually: {reason}")
        
        if self.on_halt_callback:
            self.on_halt_callback(self.state, reason)
    
    def resume_trading(self) -> bool:
        """Resume trading after halt"""
        if self.state == CircuitState.ACTIVE:
            print("⚠️ Trading already active")
            return False
        
        previous_state = self.state
        self.state = CircuitState.ACTIVE
        self.manual_override_active = False
        
        # Reset daily/weekly tracking on resume
        current_pnl = self.pnl_tracker.get_total_unrealized_pnl() + self.pnl_tracker.get_total_realized_pnl()
        self.daily_start_pnl = current_pnl
        self.weekly_start_pnl = current_pnl
        self.last_daily_reset = datetime.now()
        self.last_weekly_reset = datetime.now()
        
        print(f"✅ Trading resumed (previous state: {previous_state.value})")
        
        if self.on_resume_callback:
            self.on_resume_callback(previous_state)
        
        return True
    
    def reset_daily(self):
        """Reset daily tracking (called at start of trading day)"""
        current_pnl = self.pnl_tracker.get_total_unrealized_pnl() + self.pnl_tracker.get_total_realized_pnl()
        self.daily_start_pnl = current_pnl
        self.last_daily_reset = datetime.now()
        print(f"📅 Daily tracking reset. Starting P&L: ${current_pnl:.2f}")
    
    def reset_weekly(self):
        """Reset weekly tracking (called at start of trading week)"""
        current_pnl = self.pnl_tracker.get_total_unrealized_pnl() + self.pnl_tracker.get_total_realized_pnl()
        self.weekly_start_pnl = current_pnl
        self.last_weekly_reset = datetime.now()
        print(f"📅 Weekly tracking reset. Starting P&L: ${current_pnl:.2f}")
    
    def check_and_reset_periods(self):
        """Check if daily/weekly reset is needed based on time"""
        now = datetime.now()
        
        # Daily reset at midnight
        if self.last_daily_reset:
            if now.date() > self.last_daily_reset.date():
                self.reset_daily()
        
        # Weekly reset on Monday
        if self.last_weekly_reset:
            if now.weekday() == 0 and self.last_weekly_reset.weekday() != 0:
                self.reset_weekly()
    
    def is_trading_allowed(self) -> bool:
        """Check if trading is currently allowed"""
        return self.state == CircuitState.ACTIVE
    
    def get_status(self) -> Dict:
        """Get current circuit breaker status"""
        current_pnl = self.pnl_tracker.get_total_unrealized_pnl() + self.pnl_tracker.get_total_realized_pnl()
        
        daily_pnl = current_pnl - (self.daily_start_pnl or 0)
        daily_percent = daily_pnl / abs(self.daily_start_pnl) if self.daily_start_pnl else 0
        
        weekly_pnl = current_pnl - (self.weekly_start_pnl or 0)
        weekly_percent = weekly_pnl / abs(self.weekly_start_pnl) if self.weekly_start_pnl else 0
        
        return {
            "state": self.state.value,
            "trading_allowed": self.is_trading_allowed(),
            "manual_override_active": self.manual_override_active,
            "daily_pnl": daily_pnl,
            "daily_percent": daily_percent * 100,
            "daily_limit": self.config.daily_loss_limit * 100,
            "daily_remaining": (self.config.daily_loss_limit - daily_percent) * 100 if daily_percent < 0 else 100,
            "weekly_pnl": weekly_pnl,
            "weekly_percent": weekly_percent * 100,
            "weekly_limit": self.config.weekly_loss_limit * 100,
            "weekly_remaining": (self.config.weekly_loss_limit - weekly_percent) * 100 if weekly_percent < 0 else 100,
            "consecutive_errors": self.consecutive_errors,
            "max_errors": self.max_consecutive_errors,
            "last_daily_reset": self.last_daily_reset.isoformat() if self.last_daily_reset else None,
            "last_weekly_reset": self.last_weekly_reset.isoformat() if self.last_weekly_reset else None,
            "events_count": len(self.events)
        }
    
    def get_events(self, limit: int = 50) -> list:
        """Get recent circuit breaker events"""
        return sorted(self.events, key=lambda x: x.timestamp, reverse=True)[:limit]
    
    def generate_status_report(self) -> str:
        """Generate human-readable status report"""
        status = self.get_status()
        
        state_emoji = {
            CircuitState.ACTIVE: "🟢",
            CircuitState.HALTED: "🔴",
            CircuitState.ERROR: "⚠️",
            CircuitState.MANUAL: "✋"
        }
        
        report = [
            "🚨 CIRCUIT BREAKER STATUS",
            "=" * 40,
            f"State: {state_emoji.get(self.state, '❓')} {self.state.value.upper()}",
            f"Trading Allowed: {'Yes ✅' if status['trading_allowed'] else 'No ❌'}",
            "",
            "📊 Daily P&L:",
            f"  Current: ${status['daily_pnl']:.2f} ({status['daily_percent']:+.2f}%)",
            f"  Limit: {status['daily_limit']:.1f}%",
            f"  Remaining: {status['daily_remaining']:.1f}%",
            "",
            "📊 Weekly P&L:",
            f"  Current: ${status['weekly_pnl']:.2f} ({status['weekly_percent']:+.2f}%)",
            f"  Limit: {status['weekly_limit']:.1f}%",
            f"  Remaining: {status['weekly_remaining']:.1f}%",
            "",
            "⚙️ System Health:",
            f"  Consecutive Errors: {status['consecutive_errors']}/{status['max_errors']}",
            f"  Total Events: {status['events_count']}",
        ]
        
        return "\n".join(report)
