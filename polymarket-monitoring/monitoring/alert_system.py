"""
Alert System - Multi-Channel Notifications
"""
import asyncio
import aiohttp
from datetime import datetime
from typing import Optional, Dict
from dataclasses import dataclass
from enum import Enum

class AlertPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertChannel(Enum):
    TELEGRAM = "telegram"
    DISCORD = "discord"
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"

@dataclass
class Alert:
    timestamp: datetime
    message: str
    priority: AlertPriority
    channel: AlertChannel
    data: Optional[Dict] = None

class AlertSystem:
    """Multi-channel alert system"""
    
    def __init__(self, config):
        self.config = config
        self.alerts_history: list[Alert] = []
        self.session: Optional[aiohttp.ClientSession] = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def send_telegram(self, message: str, priority: AlertPriority = AlertPriority.MEDIUM):
        """Send alert via Telegram"""
        if not self.config.alerts.telegram_bot_token or not self.config.alerts.telegram_chat_id:
            print("⚠️ Telegram not configured")
            return False
        
        url = f"https://api.telegram.org/bot{self.config.alerts.telegram_bot_token}/sendMessage"
        payload = {
            "chat_id": self.config.alerts.telegram_chat_id,
            "text": message,
            "parse_mode": "HTML"
        }
        
        try:
            async with self.session.post(url, json=payload) as response:
                result = await response.json()
                if result.get("ok"):
                    print(f"✅ Telegram alert sent: {message[:50]}...")
                    return True
                else:
                    print(f"❌ Telegram error: {result}")
                    return False
        except Exception as e:
            print(f"❌ Telegram exception: {e}")
            return False
    
    async def send_discord(self, message: str, priority: AlertPriority = AlertPriority.MEDIUM):
        """Send alert via Discord webhook"""
        if not self.config.alerts.discord_webhook_url:
            print("⚠️ Discord not configured")
            return False
        
        # Color based on priority
        colors = {
            AlertPriority.LOW: 3066993,  # Green
            AlertPriority.MEDIUM: 3447003,  # Blue
            AlertPriority.HIGH: 15158332,  # Orange
            AlertPriority.CRITICAL: 15105570  # Red
        }
        
        payload = {
            "embeds": [{
                "title": "🧊 Polymarket Alert",
                "description": message,
                "color": colors.get(priority, 3447003),
                "timestamp": datetime.now().isoformat(),
                "footer": {
                    "text": "Polymarket Monitoring"
                }
            }]
        }
        
        try:
            async with self.session.post(self.config.alerts.discord_webhook_url, json=payload) as response:
                if response.status == 204:
                    print(f"✅ Discord alert sent: {message[:50]}...")
                    return True
                else:
                    print(f"❌ Discord error: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Discord exception: {e}")
            return False
    
    async def send_email(self, subject: str, body: str):
        """Send alert via Email (using AgentMail)"""
        # For now, log the email - in production, integrate with AgentMail API
        print(f"📧 Email would be sent:")
        print(f"   To: {self.config.alerts.email_to}")
        print(f"   Subject: {subject}")
        print(f"   Body: {body[:200]}...")
        return True
    
    async def send_sms(self, message: str):
        """Send critical alert via SMS"""
        if not self.config.alerts.sms_api_key or not self.config.alerts.sms_phone:
            print("⚠️ SMS not configured")
            return False
        
        # Example: Twilio integration
        # In production, use actual SMS provider
        print(f"📱 SMS would be sent to {self.config.alerts.sms_phone}: {message[:100]}...")
        return True
    
    async def send_push(self, title: str, message: str):
        """Send push notification to dashboard"""
        # Store for dashboard to pick up via WebSocket/API
        alert = Alert(
            timestamp=datetime.now(),
            message=f"{title}: {message}",
            priority=AlertPriority.MEDIUM,
            channel=AlertChannel.PUSH
        )
        self.alerts_history.append(alert)
        print(f"🔔 Push notification: {title} - {message}")
        return True
    
    async def send_trade_execution(self, trade_type: str, market: str, outcome: str, amount: float, price: float):
        """Alert for trade execution (Telegram)"""
        emoji = "🟢" if trade_type == "BUY" else "🔴"
        message = f"""
{emoji} <b>Trade Execution</b>

<b>Market:</b> {market}
<b>Outcome:</b> {outcome}
<b>Type:</b> {trade_type}
<b>Amount:</b> ${amount:,.2f}
<b>Price:</b> ${price:.4f}
<b>Time:</b> {datetime.now().strftime('%H:%M:%S')}
        """.strip()
        
        await self.send_telegram(message, AlertPriority.HIGH)
    
    async def send_pnl_update(self, unrealized_pnl: float, realized_pnl: float, roi: float):
        """Hourly P&L update (Discord)"""
        pnl_emoji = "📈" if unrealized_pnl >= 0 else "📉"
        roi_emoji = "🟢" if roi >= 0 else "🔴"
        
        message = f"""
{pnl_emoji} <b>Hourly P&L Update</b>

Unrealized P&L: ${unrealized_pnl:,.2f}
Realized P&L: ${realized_pnl:,.2f}
Total ROI: {roi_emoji} {roi*100:.2f}%
        """.strip()
        
        await self.send_discord(message, AlertPriority.MEDIUM)
    
    async def send_daily_summary(self, daily_pnl: float, trades_count: int, best_trade: str, worst_trade: str):
        """Daily summary email (20:00)"""
        subject = f"🧊 Daily Polymarket Summary - {datetime.now().strftime('%Y-%m-%d')}"
        body = f"""
Daily P&L: ${daily_pnl:,.2f}
Total Trades: {trades_count}
Best Trade: {best_trade}
Worst Trade: {worst_trade}

Keep grinding! 🧊
        """.strip()
        
        await self.send_email(subject, body)
    
    async def send_circuit_breaker_alert(self, trigger_type: str, loss_amount: float, loss_percent: float):
        """Critical circuit breaker alert (SMS + all channels)"""
        message = f"""
🚨 CIRCUIT BREAKER TRIGGERED 🚨

Type: {trigger_type}
Loss: ${loss_amount:,.2f} ({loss_percent*100:.2f}%)
Status: TRADING HALTED

Immediate action required!
        """.strip()
        
        # Send to all channels
        await asyncio.gather(
            self.send_telegram(message, AlertPriority.CRITICAL),
            self.send_discord(message, AlertPriority.CRITICAL),
            self.send_sms(message),
            self.send_push("🚨 Circuit Breaker", f"{trigger_type} triggered - Trading halted")
        )
    
    async def send_rebalance_report(self, deviations: Dict[str, float], actions_taken: list):
        """Rebalancing report"""
        message = f"""
🔄 <b>Portfolio Rebalanced</b>

Deviations corrected:
{chr(10).join(f"• {market}: {dev*100:.1f}%" for market, dev in deviations.items())}

Actions taken:
{chr(10).join(f"• {action}" for action in actions_taken)}
        """.strip()
        
        await self.send_discord(message, AlertPriority.LOW)
    
    def get_recent_alerts(self, limit: int = 50) -> list:
        """Get recent alerts for dashboard"""
        return sorted(self.alerts_history, key=lambda x: x.timestamp, reverse=True)[:limit]
