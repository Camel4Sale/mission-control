# 🚀 Quick Start Guide

## System Status ✅

**All services are running!**

- ✅ **API Server**: http://localhost:8000
- ✅ **Dashboard**: http://localhost:3010
- ✅ **API Docs**: http://localhost:8000/docs

## What Was Built

### 📁 Project Structure

```
polymarket-monitoring/
├── monitoring/              # Python monitoring modules
│   ├── config.py           # Configuration management
│   ├── pnl_tracker.py      # P&L tracking engine
│   ├── alert_system.py     # Multi-channel alerts
│   ├── auto_rebalance.py   # Portfolio rebalancing
│   └── circuit_breaker.py  # Risk management
├── dashboard/              # Next.js dashboard
│   └── app/
│       ├── page.tsx        # Main UI with charts
│       └── globals.css
├── api_server.py           # FastAPI backend
├── main.py                 # Monitoring orchestrator
├── test_system.py          # Test suite
└── README.md              # Full documentation
```

### 🎯 Features Implemented

#### 1. P&L Tracker ✅
- Real-time position tracking
- Unrealized/Realized P&L calculations
- ROI computations
- Daily/Weekly/Monthly charts
- Position snapshots

#### 2. Alert System ✅
- **Telegram**: Trade executions
- **Discord**: Hourly P&L updates
- **Email**: Daily summary (20:00)
- **SMS**: Critical circuit breaker alerts
- **Push**: Dashboard notifications

#### 3. Auto-Rebalance ✅
- Daily portfolio checks
- 10% deviation threshold
- Tax-optimized rebalancing
- Loss harvesting
- Detailed reports

#### 4. Circuit Breaker ✅
- Daily loss limit: -10%
- Weekly loss limit: -20%
- Auto-exit on system errors
- Manual override capability
- Instant alerts on trigger

## Quick Commands

### Test the System
```bash
cd /data/.openclaw/workspace/polymarket-monitoring
/home/linuxbrew/.linuxbrew/bin/python3 test_system.py
```

### Add a Position (via API)
```bash
curl -X POST http://localhost:8000/api/positions \
  -H "Content-Type: application/json" \
  -d '{
    "market_id": "test-1",
    "market_name": "Test Market",
    "outcome": "Yes",
    "shares": 100,
    "entry_price": 0.50,
    "current_price": 0.50
  }'
```

### Check P&L
```bash
curl http://localhost:8000/api/pnl
```

### Check Circuit Breaker
```bash
curl http://localhost:8000/api/circuit-breaker
```

### View API Documentation
Open in browser: http://localhost:8000/docs

## Dashboard Features

The dashboard at http://localhost:3010 includes:

- **Stats Cards**: Unrealized P&L, Realized P&L, Portfolio Value, Total ROI
- **P&L Chart**: Interactive area chart with daily/weekly/monthly views
- **Circuit Breaker Status**: Real-time risk metrics with progress bars
- **Positions Table**: All open positions with P&L and ROI
- **Performance Charts**: Weekly and monthly performance graphs

## Configure Alerts

### 1. Telegram
```bash
# Edit .env file
nano .env

# Add your credentials
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### 2. Discord
```bash
# Add webhook URL to .env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### 3. Email
Already configured with AgentMail:
- From: frailyouth829@agentmail.to
- Set `EMAIL_TO` in `.env`

### 4. SMS (Critical Only)
```bash
# Add to .env
SMS_API_KEY=your_twilio_key
SMS_PHONE=+1234567890
```

## Next Steps

1. **Open Dashboard**: http://localhost:localhost:3010
2. **Configure Alerts**: Edit `.env` with your credentials
3. **Add Positions**: Use the API or integrate with Polymarket
4. **Monitor**: Watch the dashboard for real-time updates
5. **Set Up Production**: Follow DEPLOYMENT.md for PM2 setup

## Services Management

Currently running in background. To manage:

```bash
# List running processes
ps aux | grep -E "(python3|next)" | grep -v grep

# Stop API server
pkill -f "python3 api_server.py"

# Stop dashboard
pkill -f "next dev"

# Restart all
# (Run the commands from DEPLOYMENT.md)
```

## Support

- **Full Documentation**: README.md
- **Deployment Guide**: DEPLOYMENT.md
- **API Docs**: http://localhost:8000/docs
- **Test Suite**: `python3 test_system.py`

---

**🧊 Built by Molty** | Status: ✅ All Systems Operational
