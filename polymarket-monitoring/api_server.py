"""
FastAPI Backend for Polymarket Monitoring
Provides REST API for dashboard and external integrations
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
import uvicorn

# Import monitoring modules
import sys
sys.path.insert(0, '/data/.openclaw/workspace/polymarket-monitoring')

from monitoring import (
    PnLTracker, Position, AlertSystem, AutoRebalance, 
    CircuitBreaker, TargetAllocation, config
)

app = FastAPI(title="Polymarket Monitoring API", version="1.0.0")

# CORS for dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
pnl_tracker = PnLTracker()
alert_system = None  # Will be initialized with config
circuit_breaker = CircuitBreaker(pnl_tracker, alert_system, config)
auto_rebalance = AutoRebalance(pnl_tracker, alert_system, config)

# Pydantic models
class PositionInput(BaseModel):
    market_id: str
    market_name: str
    outcome: str
    shares: float
    entry_price: float
    current_price: float

class TradeExecution(BaseModel):
    market_id: str
    market_name: str
    outcome: str
    trade_type: str  # BUY or SELL
    shares: float
    price: float

class RebalanceRequest(BaseModel):
    dry_run: bool = True

class ManualHaltRequest(BaseModel):
    reason: str = "Manual override"

# Routes
@app.get("/")
async def root():
    return {"status": "ok", "service": "Polymarket Monitoring API"}

@app.get("/api/pnl")
async def get_pnl():
    """Get current P&L summary"""
    return {
        "unrealized_pnl": pnl_tracker.get_total_unrealized_pnl(),
        "realized_pnl": pnl_tracker.get_total_realized_pnl(),
        "portfolio_value": pnl_tracker.get_portfolio_value(),
        "roi": pnl_tracker.get_total_roi(),
        "positions_count": len(pnl_tracker.positions),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/positions")
async def get_positions():
    """Get all open positions"""
    return {
        "positions": [
            {
                "market_id": p.market_id,
                "market_name": p.market_name,
                "outcome": p.outcome,
                "shares": p.shares,
                "entry_price": p.entry_price,
                "current_price": p.current_price,
                "unrealized_pnl": p.unrealized_pnl,
                "roi": p.roi,
                "current_value": p.current_value,
                "entry_value": p.entry_value
            }
            for p in pnl_tracker.positions.values()
        ]
    }

@app.post("/api/positions")
async def add_position(position: PositionInput):
    """Add or update a position"""
    pos = Position(
        market_id=position.market_id,
        market_name=position.market_name,
        outcome=position.outcome,
        shares=position.shares,
        entry_price=position.entry_price,
        current_price=position.current_price,
        entry_time=datetime.now()
    )
    pnl_tracker.add_position(pos)
    return {"status": "success", "message": f"Position added: {position.market_name}"}

@app.delete("/api/positions/{market_id}")
async def close_position(market_id: str, exit_price: float):
    """Close a position"""
    trade = pnl_tracker.remove_position(market_id, exit_price)
    if trade:
        return {
            "status": "success",
            "realized_pnl": trade.realized_pnl,
            "roi": trade.roi
        }
    raise HTTPException(status_code=404, detail="Position not found")

@app.put("/api/positions/{market_id}/price")
async def update_position_price(market_id: str, current_price: float):
    """Update current price for a position"""
    pnl_tracker.update_position_price(market_id, current_price)
    return {"status": "success", "market_id": market_id, "new_price": current_price}

@app.get("/api/pnl/daily")
async def get_daily_pnl(days: int = 30):
    """Get daily P&L history"""
    return {"daily_pnl": pnl_tracker.get_daily_pnl(days)}

@app.get("/api/pnl/weekly")
async def get_weekly_pnl(weeks: int = 12):
    """Get weekly P&L history"""
    return {"weekly_pnl": pnl_tracker.get_weekly_pnl(weeks)}

@app.get("/api/pnl/monthly")
async def get_monthly_pnl(months: int = 12):
    """Get monthly P&L history"""
    return {"monthly_pnl": pnl_tracker.get_monthly_pnl(months)}

@app.get("/api/circuit-breaker")
async def get_circuit_breaker_status():
    """Get circuit breaker status"""
    circuit_breaker.check_and_reset_periods()
    return circuit_breaker.get_status()

@app.post("/api/circuit-breaker/halt")
async def manual_halt(request: ManualHaltRequest):
    """Manually halt trading"""
    circuit_breaker.manual_halt(request.reason)
    return {"status": "success", "message": "Trading halted manually"}

@app.post("/api/circuit-breaker/resume")
async def resume_trading():
    """Resume trading after halt"""
    success = circuit_breaker.resume_trading()
    return {"status": "success" if success else "already_active", "trading_allowed": circuit_breaker.is_trading_allowed()}

@app.get("/api/rebalance/status")
async def get_rebalance_status():
    """Get rebalancing status and recommendations"""
    needs_rebalance, deviations = auto_rebalance.check_rebalance_needed()
    actions = auto_rebalance.generate_rebalance_actions(deviations) if needs_rebalance else []
    
    return {
        "needs_rebalance": needs_rebalance,
        "deviations": deviations,
        "recommended_actions": [
            {
                "action_type": a.action_type,
                "market": a.market_name,
                "deviation": a.deviation * 100,
                "shares_to_trade": a.shares_to_trade,
                "estimated_value": a.estimated_value
            }
            for a in actions
        ],
        "schedule": auto_rebalance.get_rebalance_schedule()
    }

@app.post("/api/rebalance/execute")
async def execute_rebalance(request: RebalanceRequest):
    """Execute rebalancing"""
    result = await auto_rebalance.execute_rebalance(dry_run=request.dry_run)
    return result

@app.get("/api/alerts")
async def get_alerts(limit: int = 50):
    """Get recent alerts"""
    if alert_system:
        return {"alerts": alert_system.get_recent_alerts(limit)}
    return {"alerts": []}

@app.post("/api/trades")
async def log_trade(trade: TradeExecution):
    """Log a trade execution"""
    if trade.trade_type == "BUY":
        pos = Position(
            market_id=trade.market_id,
            market_name=trade.market_name,
            outcome=trade.outcome,
            shares=trade.shares,
            entry_price=trade.price,
            current_price=trade.price,
            entry_time=datetime.now()
        )
        pnl_tracker.add_position(pos)
    elif trade.trade_type == "SELL":
        pnl_tracker.remove_position(trade.market_id, trade.price)
    
    # Send alert
    if alert_system:
        await alert_system.send_trade_execution(
            trade.trade_type,
            trade.market_name,
            trade.outcome,
            trade.shares * trade.price,
            trade.price
        )
    
    return {"status": "success", "message": f"{trade.trade_type} order logged"}

@app.get("/api/export")
async def export_data():
    """Export all data as JSON"""
    return pnl_tracker.export_to_json()

if __name__ == "__main__":
    print("🧊 Starting Polymarket Monitoring API...")
    print("📊 Dashboard: http://localhost:3010")
    print("🔌 API: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
