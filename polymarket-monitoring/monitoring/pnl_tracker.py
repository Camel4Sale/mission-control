"""
P&L Tracker - Real-Time Position Tracking
"""
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass, field
import json

@dataclass
class Position:
    market_id: str
    market_name: str
    outcome: str
    shares: float
    entry_price: float
    current_price: float
    entry_time: datetime
    last_updated: datetime = None
    
    def __post_init__(self):
        if self.last_updated is None:
            self.last_updated = datetime.now()
    
    @property
    def unrealized_pnl(self) -> float:
        """Calculate unrealized P&L"""
        return (self.current_price - self.entry_price) * self.shares
    
    @property
    def roi(self) -> float:
        """Calculate Return on Investment"""
        if self.entry_price == 0:
            return 0.0
        return (self.current_price - self.entry_price) / self.entry_price
    
    @property
    def current_value(self) -> float:
        """Current position value"""
        return self.current_price * self.shares
    
    @property
    def entry_value(self) -> float:
        """Entry position value"""
        return self.entry_price * self.shares

@dataclass
class ClosedTrade:
    market_id: str
    market_name: str
    outcome: str
    shares: float
    entry_price: float
    exit_price: float
    entry_time: datetime
    exit_time: datetime
    realized_pnl: float
    
    @property
    def roi(self) -> float:
        if self.entry_price == 0:
            return 0.0
        return (self.exit_price - self.entry_price) / self.entry_price

@dataclass
class PnLSnapshot:
    timestamp: datetime
    total_unrealized_pnl: float
    total_realized_pnl: float
    total_portfolio_value: float
    total_invested: float
    overall_roi: float
    positions_count: int

class PnLTracker:
    """Main P&L tracking engine"""
    
    def __init__(self):
        self.positions: Dict[str, Position] = {}
        self.closed_trades: List[ClosedTrade] = []
        self.snapshots: List[PnLSnapshot] = []
        self.daily_pnl: Dict[str, float] = {}  # date -> pnl
        self.weekly_pnl: Dict[str, float] = {}  # week -> pnl
        self.monthly_pnl: Dict[str, float] = {}  # month -> pnl
        
    def add_position(self, position: Position):
        """Add or update a position"""
        self.positions[position.market_id] = position
        
    def remove_position(self, market_id: str, exit_price: float) -> Optional[ClosedTrade]:
        """Close a position and record as trade"""
        if market_id not in self.positions:
            return None
            
        position = self.positions.pop(market_id)
        realized_pnl = (exit_price - position.entry_price) * position.shares
        
        trade = ClosedTrade(
            market_id=position.market_id,
            market_name=position.market_name,
            outcome=position.outcome,
            shares=position.shares,
            entry_price=position.entry_price,
            exit_price=exit_price,
            entry_time=position.entry_time,
            exit_time=datetime.now(),
            realized_pnl=realized_pnl
        )
        
        self.closed_trades.append(trade)
        self._record_daily_pnl(realized_pnl)
        
        return trade
    
    def update_position_price(self, market_id: str, current_price: float):
        """Update current price for a position"""
        if market_id in self.positions:
            self.positions[market_id].current_price = current_price
            self.positions[market_id].last_updated = datetime.now()
    
    def get_total_unrealized_pnl(self) -> float:
        """Sum of all unrealized P&L"""
        return sum(pos.unrealized_pnl for pos in self.positions.values())
    
    def get_total_realized_pnl(self, days: Optional[int] = None) -> float:
        """Sum of realized P&L, optionally filtered by days"""
        if days is None:
            return sum(trade.realized_pnl for trade in self.closed_trades)
        
        cutoff = datetime.now() - timedelta(days=days)
        return sum(
            trade.realized_pnl for trade in self.closed_trades 
            if trade.exit_time > cutoff
        )
    
    def get_total_roi(self) -> float:
        """Overall portfolio ROI"""
        total_invested = sum(pos.entry_value for pos in self.positions.values())
        total_current = sum(pos.current_value for pos in self.positions.values())
        
        if total_invested == 0:
            return 0.0
        return (total_current - total_invested) / total_invested
    
    def get_portfolio_value(self) -> float:
        """Current total portfolio value"""
        return sum(pos.current_value for pos in self.positions.values())
    
    def take_snapshot(self) -> PnLSnapshot:
        """Take a P&L snapshot for historical tracking"""
        total_invested = sum(pos.entry_value for pos in self.positions.values())
        
        snapshot = PnLSnapshot(
            timestamp=datetime.now(),
            total_unrealized_pnl=self.get_total_unrealized_pnl(),
            total_realized_pnl=self.get_total_realized_pnl(),
            total_portfolio_value=self.get_portfolio_value(),
            total_invested=total_invested,
            overall_roi=self.get_total_roi(),
            positions_count=len(self.positions)
        )
        
        self.snapshots.append(snapshot)
        return snapshot
    
    def _record_daily_pnl(self, pnl: float):
        """Record P&L for daily tracking"""
        date_key = datetime.now().strftime("%Y-%m-%d")
        self.daily_pnl[date_key] = self.daily_pnl.get(date_key, 0) + pnl
    
    def get_daily_pnl(self, days: int = 30) -> Dict[str, float]:
        """Get daily P&L for last N days"""
        result = {}
        for i in range(days):
            date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
            result[date] = self.daily_pnl.get(date, 0)
        return result
    
    def get_weekly_pnl(self, weeks: int = 12) -> Dict[str, float]:
        """Get weekly P&L for last N weeks"""
        result = {}
        for i in range(weeks):
            week_start = datetime.now() - timedelta(weeks=i)
            week_key = week_start.strftime("%Y-W%W")
            # Sum daily P&L for this week
            week_pnl = sum(
                pnl for date, pnl in self.daily_pnl.items()
                if datetime.strptime(date, "%Y-%m-%d") >= week_start - timedelta(days=week_start.weekday())
                and datetime.strptime(date, "%Y-%m-%d") < week_start
            )
            result[week_key] = week_pnl
        return result
    
    def get_monthly_pnl(self, months: int = 12) -> Dict[str, float]:
        """Get monthly P&L for last N months"""
        result = {}
        for i in range(months):
            month_date = datetime.now() - timedelta(days=30*i)
            month_key = month_date.strftime("%Y-%m")
            month_pnl = sum(
                pnl for date, pnl in self.daily_pnl.items()
                if date.startswith(month_key)
            )
            result[month_key] = month_pnl
        return result
    
    def export_to_json(self) -> dict:
        """Export current state to JSON"""
        return {
            "timestamp": datetime.now().isoformat(),
            "positions": [
                {
                    "market_id": p.market_id,
                    "market_name": p.market_name,
                    "outcome": p.outcome,
                    "shares": p.shares,
                    "entry_price": p.entry_price,
                    "current_price": p.current_price,
                    "unrealized_pnl": p.unrealized_pnl,
                    "roi": p.roi
                }
                for p in self.positions.values()
            ],
            "summary": {
                "total_unrealized_pnl": self.get_total_unrealized_pnl(),
                "total_realized_pnl": self.get_total_realized_pnl(),
                "total_portfolio_value": self.get_portfolio_value(),
                "overall_roi": self.get_total_roi(),
                "positions_count": len(self.positions)
            }
        }
