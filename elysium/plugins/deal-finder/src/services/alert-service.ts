import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { Deal, AlertConfig, Alert } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AlertServiceConfig {
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  twilioConfig?: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  pushConfig?: {
    vapidPublicKey: string;
    vapidPrivateKey: string;
    vapidSubject: string;
  };
}

class AlertService {
  private emailTransporter: nodemailer.Transporter | null = null;
  private twilioClient: any = null;
  private config: AlertServiceConfig;

  constructor(config: AlertServiceConfig) {
    this.config = config;
    
    if (config.smtpConfig) {
      this.emailTransporter = nodemailer.createTransport(config.smtpConfig);
    }
    
    if (config.twilioConfig) {
      this.twilioClient = twilio(
        config.twilioConfig.accountSid,
        config.twilioConfig.authToken
      );
    }
  }

  async sendAlerts(deal: Deal, alertConfigs: AlertConfig[]): Promise<Alert[]> {
    const alerts: Alert[] = [];

    for (const config of alertConfigs) {
      if (!config.enabled) continue;

      // Check if deal matches user's filters
      if (!this.matchesUserFilters(deal, config)) continue;

      // Determine alert types
      const alertTypes = this.determineAlertTypes(deal, config);

      for (const type of alertTypes) {
        try {
          const alert = await this.sendAlert(deal, config, type);
          alerts.push(alert);
        } catch (error) {
          console.error(`Failed to send ${type} alert:`, error);
        }
      }
    }

    return alerts;
  }

  private matchesUserFilters(deal: Deal, config: AlertConfig): boolean {
    const filters = config.filters;

    if (filters.minPrice && deal.price < filters.minPrice) return false;
    if (filters.maxPrice && deal.price > filters.maxPrice) return false;
    if (filters.minSize && deal.size < filters.minSize) return false;
    if (filters.maxSize && deal.size > filters.maxSize) return false;
    
    if (filters.cities && filters.cities.length > 0) {
      if (!filters.cities.includes(deal.location.city)) return false;
    }

    if (filters.zipCodes && filters.zipCodes.length > 0) {
      if (!filters.zipCodes.includes(deal.location.zipCode)) return false;
    }

    if (filters.minRentalYield && deal.analysis) {
      if (deal.analysis.rentalYield.gross < filters.minRentalYield) return false;
    }

    if (filters.minPotentialScore && deal.analysis) {
      if (deal.analysis.potentialScore < filters.minPotentialScore) return false;
    }

    return true;
  }

  private determineAlertTypes(deal: Deal, config: AlertConfig): ('push' | 'email' | 'sms')[] {
    const types: ('push' | 'email' | 'sms')[] = [];

    // Always send push if enabled
    if (config.pushEnabled) {
      types.push('push');
    }

    // Send email based on schedule
    if (config.emailEnabled) {
      types.push('email');
    }

    // Send SMS only for top deals (>30% under market value)
    if (config.smsEnabled && deal.analysis) {
      const discount = ((deal.analysis.marketValue - deal.price) / deal.analysis.marketValue) * 100;
      if (discount >= config.smsThreshold) {
        types.push('sms');
      }
    }

    return types;
  }

  private async sendAlert(
    deal: Deal,
    config: AlertConfig,
    type: 'push' | 'email' | 'sms'
  ): Promise<Alert> {
    const message = this.createAlertMessage(deal, type);

    switch (type) {
      case 'push':
        await this.sendPushNotification(config.userId, message, deal);
        break;
      case 'email':
        await this.sendEmail(config.userId, message, deal);
        break;
      case 'sms':
        await this.sendSMS(config.userId, message);
        break;
    }

    return {
      id: uuidv4(),
      userId: config.userId,
      type,
      deal,
      message,
      sentAt: new Date(),
      delivered: true,
    };
  }

  private createAlertMessage(deal: Deal, type: 'push' | 'email' | 'sms'): string {
    const analysis = deal.analysis;
    
    if (type === 'sms') {
      return `🔥 TOP DEAL! ${deal.location.city}: ${deal.size}m² für ${deal.price}€ (${analysis?.potentialScore}/100 Punkte). Jetzt ansehen!`;
    }

    if (type === 'push') {
      const emoji = analysis?.priceRecommendation === 'schnaeppchen' ? '🔥' : '🏠';
      return `${emoji} Neues Angebot: ${deal.title} - ${deal.price}€ | ${deal.size}m² | ${deal.location.city}`;
    }

    // Email (more detailed)
    return `
${analysis?.priceRecommendation === 'schnaeppchen' ? '🔥 SCHNÄPPCHEN!' : '🏠 Neues Angebot'}

${deal.title}
${deal.price.toLocaleString('de-DE')}€ | ${deal.size}m² | ${deal.rooms || 'N/A'} Zimmer
📍 ${deal.location.city}, ${deal.location.zipCode}

${analysis ? `
💰 Geschätzter Marktwert: ${analysis.marketValue.toLocaleString('de-DE')}€
📊 Potenzial-Score: ${analysis.potentialScore}/100
📈 Mietrendite: ${analysis.rentalYield.gross}% (brutto)
💡 Empfehlung: ${this.getRecommendationText(analysis.priceRecommendation)}
` : ''}

🔗 ${deal.url}
    `.trim();
  }

  private getRecommendationText(recommendation: 'zu_teuer' | 'fair' | 'schnaeppchen'): string {
    switch (recommendation) {
      case 'schnaeppchen': return '✅ Schnäppchen - Sofort handeln!';
      case 'fair': return '👍 Fairer Preis - Besichtigung lohnt sich';
      case 'zu_teuer': return '⚠️ Zu teuer - Verhandeln oder warten';
    }
  }

  private async sendPushNotification(userId: string, message: string, deal: Deal): Promise<void> {
    // In production, integrate with web push or mobile push service
    // For now, log the notification
    console.log(`[PUSH] User ${userId}: ${message}`);
    
    // TODO: Implement actual push notification
    // - Use web-push library for browser notifications
    // - Use Firebase Cloud Messaging for mobile
    // - Store in database for in-app notifications
  }

  private async sendEmail(userId: string, message: string, deal: Deal): Promise<void> {
    if (!this.emailTransporter) {
      console.warn('Email transporter not configured');
      return;
    }

    // In production, fetch user's email from database
    const userEmail = `${userId}@example.com`; // Placeholder

    await this.emailTransporter.sendMail({
      from: '"Elysium Deal-Finder" <alerts@elysium.de>',
      to: userEmail,
      subject: `🏠 ${deal.priceRecommendation === 'schnaeppchen' ? 'TOP DEAL' : 'Neues Angebot'}: ${deal.location.city}`,
      text: message,
      html: this.createEmailHTML(deal),
    });
  }

  private createEmailHTML(deal: Deal): string {
    const analysis = deal.analysis;
    const scoreColor = analysis 
      ? analysis.potentialScore >= 70 ? '#22c55e' 
      : analysis.potentialScore >= 40 ? '#eab308' 
      : '#ef4444'
      : '#6b7280';

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .property-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .property-details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
    .detail-box { background: white; padding: 15px; border-radius: 8px; text-align: center; }
    .detail-value { font-size: 20px; font-weight: bold; color: #667eea; }
    .detail-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
    .score-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; color: white; font-weight: bold; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .analysis-box { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${analysis?.priceRecommendation === 'schnaeppchen' ? '🔥 TOP DEAL ALERT!' : '🏠 Neues Angebot'}</h1>
    </div>
    <div class="content">
      <div class="property-title">${deal.title}</div>
      <div style="color: #6b7280;">📍 ${deal.location.city}, ${deal.location.zipCode}</div>
      
      <div class="property-details">
        <div class="detail-box">
          <div class="detail-value">${deal.price.toLocaleString('de-DE')}€</div>
          <div class="detail-label">Kaufpreis</div>
        </div>
        <div class="detail-box">
          <div class="detail-value">${deal.size}m²</div>
          <div class="detail-label">Wohnfläche</div>
        </div>
        <div class="detail-box">
          <div class="detail-value">${deal.rooms || 'N/A'}</div>
          <div class="detail-label">Zimmer</div>
        </div>
      </div>

      ${analysis ? `
      <div class="analysis-box">
        <h3>📊 AI-Analyse</h3>
        <p>
          <span class="score-badge" style="background: ${scoreColor}">
            ${analysis.potentialScore}/100 Punkte
          </span>
        </p>
        <p><strong>Geschätzter Marktwert:</strong> ${analysis.marketValue.toLocaleString('de-DE')}€</p>
        <p><strong>Mietrendite:</strong> ${analysis.rentalYield.gross}% (brutto) / ${analysis.rentalYield.net}% (netto)</p>
        <p><strong>Bewertung:</strong> ${this.getRecommendationText(analysis.priceRecommendation)}</p>
      </div>
      ` : ''}

      <div style="text-align: center;">
        <a href="${deal.url}" class="cta-button">Jetzt ansehen →</a>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private async sendSMS(userId: string, message: string): Promise<void> {
    if (!this.twilioClient) {
      console.warn('Twilio client not configured');
      return;
    }

    // In production, fetch user's phone from database
    const userPhone = '+491234567890'; // Placeholder

    await this.twilioClient.messages.create({
      body: message,
      from: this.config.twilioConfig?.fromNumber,
      to: userPhone,
    });
  }

  async sendDailyDigest(userId: string, deals: Deal[], config: AlertConfig): Promise<void> {
    if (!config.emailEnabled || !this.emailTransporter) return;

    const userEmail = `${userId}@example.com`; // Placeholder
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .deal-item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
    .deal-header { display: flex; justify-content: space-between; align-items: center; }
    .score { background: #667eea; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📧 Dein Daily Deal-Report</h1>
    <p>${deals.length} neue Angebote gefunden</p>
    
    ${deals.map(deal => `
      <div class="deal-item">
        <div class="deal-header">
          <strong>${deal.title}</strong>
          ${deal.analysis ? `<span class="score">${deal.analysis.potentialScore}/100</span>` : ''}
        </div>
        <p>${deal.price.toLocaleString('de-DE')}€ | ${deal.size}m² | ${deal.location.city}</p>
        <a href="${deal.url}" style="color: #667eea;">Ansehen →</a>
      </div>
    `).join('')}
  </div>
</body>
</html>
    `;

    await this.emailTransporter.sendMail({
      from: '"Elysium Deal-Finder" <alerts@elysium.de>',
      to: userEmail,
      subject: `📧 Daily Deal-Report: ${deals.length} neue Angebote`,
      html,
    });
  }
}

export default AlertService;
