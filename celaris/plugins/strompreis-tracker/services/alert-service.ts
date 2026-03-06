/**
 * Alert Service - Preis-Alarme
 */

interface AlertConfig {
  id: string;
  type: 'price_high' | 'price_low' | 'spike' | 'forecast';
  threshold: number;
  direction: 'above' | 'below';
  channels: ('email' | 'push' | 'sms')[];
  active: boolean;
  createdAt: string;
  lastTriggered?: string;
}

interface AlertTrigger {
  alertId: string;
  timestamp: string;
  price: number;
  message: string;
}

export class AlertService {
  private alerts: Map<string, AlertConfig> = new Map();
  private triggers: AlertTrigger[] = [];
  private cooldownPeriod: number = 3600000; // 1 Stunde

  createAlert(config: Omit<AlertConfig, 'id' | 'createdAt'>): AlertConfig {
    const alert: AlertConfig = {
      ...config,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  checkAlerts(currentPrice: number): AlertTrigger[] {
    const triggered: AlertTrigger[] = [];

    for (const alert of this.alerts.values()) {
      if (!alert.active) continue;

      // Cooldown prüfen
      if (alert.lastTriggered && Date.now() - new Date(alert.lastTriggered).getTime() < this.cooldownPeriod) {
        continue;
      }

      // Bedingung prüfen
      const shouldTrigger =
        alert.direction === 'above' ? currentPrice > alert.threshold : currentPrice < alert.threshold;

      if (shouldTrigger) {
        const trigger: AlertTrigger = {
          alertId: alert.id,
          timestamp: new Date().toISOString(),
          price: currentPrice,
          message: this.generateAlertMessage(alert, currentPrice),
        };

        triggered.push(trigger);
        alert.lastTriggered = trigger.timestamp;
      }
    }

    return triggered;
  }

  private generateAlertMessage(alert: AlertConfig, price: number): string {
    const emojis = {
      price_high: '📈',
      price_low: '📉',
      spike: '🚨',
      forecast: '🔮',
    };

    const directionText = alert.direction === 'above' ? 'überstiegen' : 'unterschritten';

    return `${emojis[alert.type]} Strompreis-Alarm: ${price.toFixed(2)} ct/kWh ${directionText} ${alert.threshold.toFixed(2)} ct/kWh`;
  }

  getActiveAlerts(): AlertConfig[] {
    return Array.from(this.alerts.values()).filter((a) => a.active);
  }

  deactivateAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;
    alert.active = false;
    return true;
  }

  deleteAlert(alertId: string): boolean {
    return this.alerts.delete(alertId);
  }

  getTriggerHistory(hours: number = 24): AlertTrigger[] {
    const cutoff = Date.now() - hours * 3600000;
    return this.triggers.filter((t) => new Date(t.timestamp).getTime() > cutoff);
  }

  createSpikeAlert(threshold: number = 50, channels: ('email' | 'push' | 'sms')[] = ['push']): AlertConfig {
    return this.createAlert({
      type: 'spike',
      threshold,
      direction: 'above',
      channels,
      active: true,
    });
  }

  createLowPriceAlert(threshold: number = 20, channels: ('email' | 'push' | 'sms')[] = ['push']): AlertConfig {
    return this.createAlert({
      type: 'price_low',
      threshold,
      direction: 'below',
      channels,
      active: true,
    });
  }
}
