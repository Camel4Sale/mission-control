# 🧊 Polymarket Monitoring System

**Build the eyes! 👀**

Complete monitoring and operations system for Polymarket trading with real-time P&L tracking, automated alerts, portfolio rebalancing, and risk management.

## 🚀 Features

### 1. P&L Tracker
- **Real-Time**: Track all open positions
- **Unrealized P&L**: Current value calculations
- **Realized P&L**: Closed trades history
- **ROI**: Total return on investment
- **Charts**: Daily/Weekly/Monthly performance

### 2. Alert System
- **Telegram**: Trade execution notifications
- **Discord**: Hourly P&L updates
- **Email**: Daily summary at 20:00
- **SMS**: Critical circuit breaker alerts
- **Push**: Dashboard notifications

### 3. Auto-Rebalance
- **Daily Check**: Portfolio allocation review
- **Threshold**: >10% deviation triggers rebalance
- **Tax-Optimized**: Loss harvesting enabled
- **Reports**: Detailed rebalancing reports

### 4. Circuit Breaker
- **Daily Loss**: -10% → Stop trading
- **Weekly Loss**: -20% → Stop trading
- **System Error**: Auto-exit all positions
- **Manual Override**: User can halt/resume
- **Instant Alerts**: Immediate notification on trigger

## 📁 Project Structure

```
polymarket-monitoring/
├── monitoring/
│   ├── __init__.py
│   ├── config.py           # Configuration management
│   ├── pnl_tracker.py      # P&L tracking engine
│   ├── alert_system.py     # Multi-channel alerts
│   ├── auto_rebalance.py   # Portfolio rebalancing
│   └── circuit_breaker.py  # Risk management
├── dashboard/
│   ├── app/
│   │   ├── page.tsx        # Main dashboard UI
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── package.json
│   └── next.config.js
├── api_server.py           # FastAPI backend
├── main.py                 # Main orchestrator
├── requirements.txt
└── README.md
```

## 🛠️ Installation

### 1. Clone & Setup

```bash
cd /data/.openclaw/workspace/polymarket-monitoring

# Install Python dependencies
pip install -r requirements.txt

# Install dashboard dependencies
cd dashboard
npm install
cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys and credentials
```

### 3. Run the System

**Option A: Run everything together**
```bash
# Terminal 1: Start API server
python api_server.py

# Terminal 2: Start monitoring
python main.py

# Terminal 3: Start dashboard
cd dashboard
npm run dev -- -p 3010
```

**Option B: Production with PM2**
```bash
pm2 start api_server.py --name polymarket-api
pm2 start main.py --name polymarket-monitor
cd dashboard && pm2 start npm --name polymarket-dashboard -- start -- -p 3010
```

## 📊 Usage

### Dashboard
- **URL**: http://localhost:3010
- Real-time P&L overview
- Position management
- Circuit breaker status
- Performance charts

### API
- **URL**: http://localhost:8000
- **Docs**: http://localhost:8000/docs

#### Key Endpoints:
```bash
# Get current P&L
GET /api/pnl

# Get positions
GET /api/positions

# Add position
POST /api/positions
{
  "market_id": "123",
  "market_name": "Fed Rate March",
  "outcome": "Yes",
  "shares": 100,
  "entry_price": 0.45,
  "current_price": 0.45
}

# Close position
DELETE /api/positions/{market_id}?exit_price=0.55

# Circuit breaker status
GET /api/circuit-breaker

# Manual halt
POST /api/circuit-breaker/halt
{
  "reason": "Manual override"
}

# Resume trading
POST /api/circuit-breaker/resume

# Rebalancing status
GET /api/rebalance/status

# Execute rebalance
POST /api/rebalance/execute
{
  "dry_run": true
}
```

### Python API

```python
from monitoring import PnLTracker, AlertSystem, CircuitBreaker, config

# Initialize
tracker = PnLTracker()
alerts = AlertSystem(config)
breaker = CircuitBreaker(tracker, alerts, config)

# Add position
from monitoring import Position
from datetime import datetime

position = Position(
    market_id="123",
    market_name="Fed Rate March",
    outcome="Yes",
    shares=100,
    entry_price=0.45,
    current_price=0.45,
    entry_time=datetime.now()
)
tracker.add_position(position)

# Check circuit breaker
current_pnl = tracker.get_total_unrealized_pnl()
breaker.check_daily_loss(current_pnl)

# Send alert
await alerts.send_trade_execution(
    "BUY", "Fed Rate March", "Yes", 45.00, 0.45
)
```

## 🔔 Alert Configuration

### Telegram
1. Create bot via @BotFather
2. Get bot token
3. Add bot to channel/group
4. Get chat ID

### Discord
1. Create webhook in server settings
2. Copy webhook URL
3. Add to `.env`

### Email (AgentMail)
- Pre-configured: `frailyouth829@agentmail.to`
- Set recipient in `EMAIL_TO`

### SMS
- Configure Twilio or similar provider
- Add API key and phone number

## ⚙️ Configuration

Edit `monitoring/config.py` or environment variables:

```python
# Circuit Breaker Limits
daily_loss_limit = -0.10    # -10%
weekly_loss_limit = -0.20   # -20%

# Rebalancing
deviation_threshold = 0.10  # 10%
check_interval_hours = 24

# Alerts
auto_exit_on_error = True
manual_override_enabled = True
```

## 📈 Monitoring

### Health Check
```bash
curl http://localhost:8000/
# {"status": "ok", "service": "Polymarket Monitoring API"}
```

### Logs
```bash
# View monitoring logs
tail -f ~/.pm2/logs/polymarket-monitor-out.log

# View API logs
tail -f ~/.pm2/logs/polymarket-api-out.log
```

## 🧪 Testing

### Test Circuit Breaker
```python
from monitoring import PnLTracker, CircuitBreaker, config

tracker = PnLTracker()
breaker = CircuitBreaker(tracker, None, config)

# Initialize with starting P&L
breaker.initialize(10000)

# Simulate daily loss
breaker.check_daily_loss(9000)  # -10% → Should trigger!
```

### Test Rebalancing
```python
from monitoring import AutoRebalance, TargetAllocation

rebalance = AutoRebalance(tracker, alerts, config)

# Set target allocations
rebalance.set_target_allocations([
    TargetAllocation("1", "Market A", "Yes", 0.50),
    TargetAllocation("2", "Market B", "No", 0.30),
    TargetAllocation("3", "Market C", "Yes", 0.20),
])

# Check if rebalance needed
needs_rebalance, deviations = rebalance.check_rebalance_needed()
```

## 🚨 Safety Features

1. **Circuit Breaker**: Automatic trading halt on losses
2. **Manual Override**: User can stop trading anytime
3. **Dry Run Mode**: Test rebalancing without execution
4. **Error Tracking**: Consecutive error monitoring
5. **Auto-Exit**: Emergency position closure on system errors

## 📝 License

MIT License - Build the eyes! 👀

---

**Created by Molty 🧊** for Polymarket Operations
