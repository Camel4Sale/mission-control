# 🚀 Deployment Guide

## Quick Start

### 1. Start All Services

```bash
# Terminal 1: API Server
cd /data/.openclaw/workspace/polymarket-monitoring
/home/linuxbrew/.linuxbrew/bin/python3 api_server.py

# Terminal 2: Dashboard
cd /data/.openclaw/workspace/polymarket-monitoring/dashboard
npm run dev

# Terminal 3: Monitoring (optional - runs background tasks)
cd /data/.openclaw/workspace/polymarket-monitoring
/home/linuxbrew/.linuxbrew/bin/python3 main.py
```

### 2. Access

- **Dashboard**: http://localhost:3010
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Production Deployment with PM2

### Install PM2

```bash
npm install -g pm2
```

### Create PM2 Ecosystem Config

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'polymarket-api',
      script: '/data/.openclaw/workspace/polymarket-monitoring/api_server.py',
      interpreter: '/home/linuxbrew/.linuxbrew/bin/python3',
      env: {
        PYTHONPATH: '/home/linuxbrew/.linuxbrew/lib/python3.14/site-packages'
      }
    },
    {
      name: 'polymarket-monitor',
      script: '/data/.openclaw/workspace/polymarket-monitoring/main.py',
      interpreter: '/home/linuxbrew/.linuxbrew/bin/python3',
      env: {
        PYTHONPATH: '/home/linuxbrew/.linuxbrew/lib/python3.14/site-packages'
      }
    },
    {
      name: 'polymarket-dashboard',
      cwd: '/data/.openclaw/workspace/polymarket-monitoring/dashboard',
      script: 'npm',
      args: 'start',
      env: {
        PORT: '3010',
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### Start Services

```bash
cd /data/.openclaw/workspace/polymarket-monitoring
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Management Commands

```bash
# View status
pm2 status

# View logs
pm2 logs polymarket-api
pm2 logs polymarket-monitor
pm2 logs polymarket-dashboard

# Restart services
pm2 restart polymarket-api
pm2 restart polymarket-monitor
pm2 restart polymarket-dashboard

# Stop all
pm2 stop all

# Delete all
pm2 delete all
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
nano .env
```

### Required Variables

**Polymarket API** (for live trading):
- `POLYMARKET_API_KEY`
- `POLYMARKET_API_SECRET`

**Telegram Alerts**:
- `TELEGRAM_BOT_TOKEN` - Get from @BotFather
- `TELEGRAM_CHAT_ID` - Your channel/group ID

**Discord Alerts**:
- `DISCORD_WEBHOOK_URL` - Server webhook URL

**Email** (AgentMail pre-configured):
- `EMAIL_FROM` - frailyouth829@agentmail.to
- `EMAIL_TO` - Your email address

**SMS** (Critical alerts only):
- `SMS_API_KEY` - Twilio or similar
- `SMS_PHONE` - Your phone number

## Security

### Firewall Rules

```bash
# Allow only necessary ports
sudo ufw allow 3010/tcp  # Dashboard (if external access needed)
sudo ufw allow 8000/tcp  # API (if external access needed)
sudo ufw enable
```

### HTTPS Setup (Optional)

For production with HTTPS, use nginx as reverse proxy:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3010;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring & Maintenance

### Health Checks

```bash
# API health
curl http://localhost:8000/

# Dashboard health
curl http://localhost:3010

# Circuit breaker status
curl http://localhost:8000/api/circuit-breaker
```

### Log Rotation

PM2 handles log rotation automatically. Configure in `ecosystem.config.js`:

```javascript
{
  max_memory_restart: '1G',
  log_date_format: 'YYYY-MM-DD HH:mm:ss',
  error_file: './logs/error.log',
  out_file: './logs/out.log',
}
```

### Backup

```bash
# Backup configuration
tar -czf polymarket-backup-$(date +%Y%m%d).tar.gz \
  .env \
  monitoring/config.py \
  ecosystem.config.js
```

## Troubleshooting

### Dashboard Not Loading

```bash
# Check if running
pm2 status polymarket-dashboard

# View logs
pm2 logs polymarket-dashboard

# Restart
pm2 restart polymarket-dashboard
```

### API Not Responding

```bash
# Check Python path
/home/linuxbrew/.linuxbrew/bin/python3 -c "import fastapi; print(fastapi.__version__)"

# Check if port is in use
lsof -i :8000

# Restart API
pm2 restart polymarket-api
```

### Circuit Breaker Triggered

1. Check status: `curl http://localhost:8000/api/circuit-breaker`
2. Review P&L: `curl http://localhost:8000/api/pnl`
3. Resume when ready: 
   ```bash
   curl -X POST http://localhost:8000/api/circuit-breaker/resume
   ```

### Memory Issues

```bash
# Check memory usage
pm2 monit

# Restart with memory limit
pm2 restart polymarket-api --max-memory-restart 500M
```

## Updates

### Update Code

```bash
cd /data/.openclaw/workspace/polymarket-monitoring
git pull  # If using git

# Restart services
pm2 restart all
```

### Update Dependencies

```bash
# Python
/home/linuxbrew/.linuxbrew/bin/python3 -m pip install --upgrade fastapi uvicorn pydantic

# Node.js
cd dashboard
npm update

# Restart
pm2 restart all
```

## Support

For issues or questions:
1. Check logs: `pm2 logs`
2. Review API docs: http://localhost:8000/docs
3. Test components: `/home/linuxbrew/.linuxbrew/bin/python3 test_system.py`

---

**Built with 🧊 by Molty**
