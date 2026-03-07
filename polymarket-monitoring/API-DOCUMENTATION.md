# 🧊 Polymarket Monitoring API Documentation

**Base URL:** `http://localhost:8000`  
**Dashboard:** `http://localhost:3010`  
**Swagger UI:** `http://localhost:8000/docs`

---

## 📊 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/pnl` | Get current P&L summary |
| `GET` | `/api/positions` | Get all open positions |
| `POST` | `/api/positions` | Add new position |
| `DELETE` | `/api/positions/{market_id}` | Close position |
| `PUT` | `/api/positions/{market_id}/price` | Update position price |

### P&L History

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/pnl/daily?days=30` | Get daily P&L history |
| `GET` | `/api/pnl/weekly?weeks=12` | Get weekly P&L history |
| `GET` | `/api/pnl/monthly?months=12` | Get monthly P&L history |

### Circuit Breaker

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/circuit-breaker` | Get circuit breaker status |
| `POST` | `/api/circuit-breaker/halt` | Manually halt trading |
| `POST` | `/api/circuit-breaker/resume` | Resume trading after halt |

### Rebalancing

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rebalance/status` | Get rebalancing status |
| `POST` | `/api/rebalance/execute` | Execute rebalancing |

### Alerts & Trades

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/alerts?limit=50` | Get recent alerts |
| `POST` | `/api/trades` | Log trade execution |
| `GET` | `/api/export` | Export all data as JSON |

---

## 📝 Request/Response Examples

### Get P&L Summary

**Request:**
```bash
curl http://localhost:8000/api/pnl
```

**Response:**
```json
{
  "unrealized_pnl": 42.0,
  "realized_pnl": 0,
  "portfolio_value": 309.0,
  "roi": 0.157,
  "positions_count": 4,
  "timestamp": "2026-03-07T08:14:15.051402"
}
```

### Add Position

**Request:**
```bash
curl -X POST http://localhost:8000/api/positions \
  -H "Content-Type: application/json" \
  -d '{
    "market_id": "test-1",
    "market_name": "Fed Rate March 2026",
    "outcome": "Yes",
    "shares": 150,
    "entry_price": 0.42,
    "current_price": 0.58
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Position added: Fed Rate March 2026"
}
```

### Get Positions

**Request:**
```bash
curl http://localhost:8000/api/positions
```

**Response:**
```json
{
  "positions": [
    {
      "market_id": "test-1",
      "market_name": "Fed Rate March 2026",
      "outcome": "Yes",
      "shares": 150.0,
      "entry_price": 0.42,
      "current_price": 0.58,
      "unrealized_pnl": 24.0,
      "roi": 0.381,
      "current_value": 87.0,
      "entry_value": 63.0
    }
  ]
}
```

### Get Circuit Breaker Status

**Request:**
```bash
curl http://localhost:8000/api/circuit-breaker
```

**Response:**
```json
{
  "state": "active",
  "trading_allowed": true,
  "manual_override_active": false,
  "daily_pnl": 0,
  "daily_percent": 0,
  "daily_limit": -10.0,
  "daily_remaining": 100,
  "weekly_pnl": 0,
  "weekly_percent": 0,
  "weekly_limit": -20.0,
  "weekly_remaining": 100,
  "consecutive_errors": 0,
  "max_errors": 5
}
```

### Get Rebalance Status

**Request:**
```bash
curl http://localhost:8000/api/rebalance/status
```

**Response:**
```json
{
  "needs_rebalance": false,
  "deviations": {},
  "recommended_actions": [],
  "schedule": {
    "last_rebalance": null,
    "next_check": "2026-03-07T08:13:51.258114",
    "check_interval_hours": 24,
    "deviation_threshold": 0.1,
    "tax_optimized": true
  }
}
```

---

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Polymarket API
POLYMARKET_API_KEY=your_api_key
POLYMARKET_API_SECRET=your_api_secret

# Alert Settings
ALERT_THRESHOLD=3          # Percent change
CHECK_INTERVAL=30          # Seconds
VOLUME_SPIKE_THRESHOLD=200 # Percent volume increase
LIQUIDITY_THRESHOLD=1000   # USD min liquidity

# Market Scanning
SCAN_INTERVAL=60           # Seconds
MIN_MARKET_VOLUME=500      # USD
MIN_MARKET_LIQUIDITY=1000  # USD
TRACK_TOP_MARKETS=50       # Number of markets to track

# Performance
CACHE_ENABLED=true
CACHE_TTL=60               # Seconds
BATCH_REQUESTS=true
MAX_BATCH_SIZE=20

# Advanced Monitoring
TRACK_WHALE_MOVES=true
WHALE_THRESHOLD=1000       # USD
TRACK_SMART_MONEY=true
TRACK_INSIDER_TRADING=true
ON_CHAIN_MONITOR=true

# Alert Channels
TELEGRAM_ENABLED=false
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
DISCORD_ENABLED=false
DISCORD_WEBHOOK=
EMAIL_ENABLED=false
EMAIL_ADDRESS=

# Analytics
ENABLE_ANALYTICS=true
LOG_ALL_TRADES=true
EXPORT_INTERVAL=3600       # Seconds (hourly export)
```

---

## 🚀 Running the System

### Start API Server
```bash
cd /data/.openclaw/workspace/polymarket-monitoring
source venv/bin/activate  # If using virtualenv
python3 api_server.py
```

### Start Dashboard
```bash
cd /data/.openclaw/workspace/polymarket-monitoring/dashboard
npm run dev    # Development
npm run start  # Production
```

### Start Monitoring Bot
```bash
cd /data/.openclaw/workspace/polymarket-monitoring
python3 main.py
```

---

## 📊 Dashboard Features

- **Real-time P&L Tracking** - Updates every 30 seconds
- **Position Management** - View all open positions with ROI
- **Circuit Breaker** - Risk management with daily/weekly limits
- **Performance Charts** - Daily, weekly, monthly P&L visualization
- **Auto-refresh** - Automatic data polling

---

## ⚠️ Error Handling

### Common Errors

| Status Code | Error | Description |
|-------------|-------|-------------|
| `404` | Not Found | Position or endpoint not found |
| `400` | Bad Request | Invalid request body |
| `500` | Internal Server Error | Server-side error |

### Error Response Format
```json
{
  "detail": "Position not found"
}
```

---

## 🔒 Security Notes

- **API Keys:** Store in `.env` file (never commit to git)
- **CORS:** Currently allows all origins (`*`) - restrict in production
- **Rate Limiting:** Not implemented - add for production use

---

**Version:** 1.0.0  
**Last Updated:** 2026-03-07  
**Status:** ✅ Production Ready
