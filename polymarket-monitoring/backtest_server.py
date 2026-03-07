"""
Backtest API Server
Provides endpoints for running backtests on Polymarket strategies
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import asyncio
import sys
import os

sys.path.insert(0, '/data/.openclaw/workspace/polymarket-monitoring')

from polymarket_api import PolymarketAPI

app = FastAPI(title="Polymarket Backtest API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class BacktestRequest(BaseModel):
    strategy: str  # "momentum", "mean_reversion", "flash_crash", etc.
    market_ids: Optional[List[str]] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    days: int = 30
    initial_capital: float = 1000.0
    position_size: float = 50.0
    stop_loss: float = 0.05
    take_profit: float = 0.15


class BacktestResult(BaseModel):
    strategy: str
    total_return_pct: float
    total_return_usdc: float
    annualized_return_pct: float
    max_drawdown_pct: float
    sharpe_ratio: float
    win_rate: float
    total_trades: int
    winning_trades: int
    losing_trades: int
    avg_win_pct: float
    avg_loss_pct: float
    profit_factor: float
    start_date: str
    end_date: str
    trades: List[Dict] = []


@app.get("/")
async def root():
    return {"status": "ok", "service": "Polymarket Backtest API"}


@app.get("/api/strategies")
async def list_strategies():
    """List available trading strategies."""
    return {
        "strategies": [
            {
                "id": "momentum",
                "name": "Momentum Trading",
                "description": "Multi-timeframe trend following with volume confirmation",
                "risk": "medium",
                "avg_holding_period": "2-5 days"
            },
            {
                "id": "mean_reversion",
                "name": "Mean Reversion",
                "description": "Trade price deviations from moving averages",
                "risk": "low",
                "avg_holding_period": "1-3 days"
            },
            {
                "id": "flash_crash",
                "name": "Flash Crash",
                "description": "Exploit sudden volatility spikes",
                "risk": "high",
                "avg_holding_period": "minutes"
            },
            {
                "id": "arbitrage",
                "name": "Arbitrage",
                "description": "Cross-market price discrepancies",
                "risk": "low",
                "avg_holding_period": "seconds"
            },
            {
                "id": "news_trading",
                "name": "News Trading",
                "description": "Trade based on news sentiment analysis",
                "risk": "medium",
                "avg_holding_period": "1-2 days"
            },
            {
                "id": "market_making",
                "name": "Market Making",
                "description": "Provide liquidity and earn spread",
                "risk": "medium",
                "avg_holding_period": "intraday"
            },
            {
                "id": "correlation",
                "name": "Correlation Trading",
                "description": "Trade correlated assets divergences",
                "risk": "medium",
                "avg_holding_period": "3-7 days"
            },
            {
                "id": "whale_copying",
                "name": "Whale Copying",
                "description": "Follow smart money movements",
                "risk": "high",
                "avg_holding_period": "1-5 days"
            }
        ]
    }


@app.get("/api/markets")
async def get_markets(category: Optional[str] = None, limit: int = 50, paper_trading: bool = True):
    """Get active Polymarket markets."""
    async with PolymarketAPI(paper_trading=paper_trading) as api:
        markets = await api.get_markets(category, limit)
        return {"markets": markets, "count": len(markets), "paper_trading": paper_trading}


@app.get("/api/markets/top")
async def get_top_markets(limit: int = 20, paper_trading: bool = True):
    """Get top markets by volume."""
    async with PolymarketAPI(paper_trading=paper_trading) as api:
        markets = await api.get_top_markets(limit)
        return {"markets": markets, "count": len(markets), "paper_trading": paper_trading}


@app.get("/api/markets/search")
async def search_markets(query: str, limit: int = 20):
    """Search markets by keyword."""
    async with PolymarketAPI() as api:
        markets = await api.search_markets(query, limit)
        return {"markets": markets, "count": len(markets)}


@app.get("/api/history/{market_id}")
async def get_market_history(market_id: str, days: int = 30, paper_trading: bool = True):
    """Get historical price data for a market."""
    async with PolymarketAPI(paper_trading=paper_trading) as api:
        history = await api.get_price_history(market_id, days)
        return {"history": history, "count": len(history), "paper_trading": paper_trading}


@app.post("/api/backtest")
async def run_backtest(request: BacktestRequest):
    """
    Run backtest for a strategy.
    Note: This is a placeholder - full backtesting requires strategy implementation.
    """
    # Validate dates
    if request.start_date:
        start = datetime.fromisoformat(request.start_date)
    else:
        start = datetime.now() - timedelta(days=request.days)
    
    if request.end_date:
        end = datetime.fromisoformat(request.end_date)
    else:
        end = datetime.now()
    
    # Fetch market data
    async with PolymarketAPI() as api:
        if request.market_ids:
            markets = []
            for mid in request.market_ids:
                history = await api.get_price_history(mid, days=request.days)
                markets.append({"market_id": mid, "history": history})
        else:
            # Get top markets
            top_markets = await api.get_top_markets(limit=10)
            markets = []
            for m in top_markets[:5]:
                mid = m.get('id')
                if mid:
                    history = await api.get_price_history(mid, days=request.days)
                    markets.append({"market_id": mid, "history": history})
    
    # Mock backtest results (placeholder)
    # In production, this would run actual strategy backtesting
    mock_result = {
        "strategy": request.strategy,
        "total_return_pct": 15.7,
        "total_return_usdc": 157.0,
        "annualized_return_pct": 189.4,
        "max_drawdown_pct": 8.2,
        "sharpe_ratio": 1.87,
        "win_rate": 0.64,
        "total_trades": 42,
        "winning_trades": 27,
        "losing_trades": 15,
        "avg_win_pct": 8.3,
        "avg_loss_pct": -3.2,
        "profit_factor": 2.59,
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "trades": [
            {
                "timestamp": (start + timedelta(days=i)).isoformat(),
                "market_id": f"market-{i}",
                "side": "buy" if i % 2 == 0 else "sell",
                "entry_price": 0.45 + (i * 0.02),
                "exit_price": 0.48 + (i * 0.02),
                "pnl_usdc": 15.0 if i % 3 != 0 else -8.0,
                "pnl_pct": 0.08 if i % 3 != 0 else -0.03
            }
            for i in range(10)
        ]
    }
    
    return mock_result


@app.get("/api/backtest/compare")
async def compare_strategies(days: int = 30, initial_capital: float = 1000.0):
    """Compare performance of all strategies."""
    strategies = ["momentum", "mean_reversion", "flash_crash", "arbitrage", "news_trading"]
    
    # Mock comparison results
    comparison = []
    for strategy in strategies:
        comparison.append({
            "strategy": strategy,
            "total_return_pct": 10.0 + (hash(strategy) % 20),
            "sharpe_ratio": 1.0 + (hash(strategy) % 10) / 10,
            "max_drawdown_pct": 5.0 + (hash(strategy) % 15),
            "win_rate": 0.5 + (hash(strategy) % 30) / 100,
            "total_trades": 20 + (hash(strategy) % 50)
        })
    
    # Sort by return
    comparison.sort(key=lambda x: x["total_return_pct"], reverse=True)
    
    return {
        "period_days": days,
        "initial_capital": initial_capital,
        "comparison": comparison
    }


if __name__ == "__main__":
    import uvicorn
    print("🧊 Starting Polymarket Backtest API...")
    print("📊 Backtest UI: http://localhost:3011")
    print("🔌 API: http://localhost:8001")
    print("📚 Docs: http://localhost:8001/docs")
    uvicorn.run(app, host="0.0.0.0", port=8001)
