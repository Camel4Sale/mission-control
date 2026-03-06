"""
Email Service - AgentMail Integration
"""

import structlog
from typing import Optional, Dict, Any
from datetime import datetime
from app.config import settings
from app.models.lead import Lead

logger = structlog.get_logger()


class EmailService:
    """
    Email automation service using AgentMail
    
    Handles template-based email sending for lead nurturing
    """
    
    # Email templates
    TEMPLATES = {
        "welcome": {
            "subject": "Vielen Dank für Ihre Anfrage - SolarProCelaris",
            "body": """
Guten Tag {name},

vielen Dank für Ihr Interesse an Solarenergie! Wir haben Ihre Anfrage erhalten und freuen uns, 
Ihnen bei Ihrem Weg zu nachhaltiger Energie helfen zu können.

Ihre Angaben im Überblick:
- Jahresverbrauch: {stromverbrauch} kWh
- Verfügbare Dachfläche: {dachflaeche} m²
- Gewünschtes System: {interesse}

Was passiert als nächstes?

1. Unsere Experten prüfen Ihre Angaben (innerhalb von 24 Stunden)
2. Sie erhalten eine kostenlose Solar-Analyse mit ROI-Berechnung
3. Wir vereinbaren einen unverbindlichen Beratungstermin

Falls Sie Fragen haben, antworten Sie einfach auf diese E-Mail oder rufen Sie uns an.

Mit sonnigen Grüßen
Ihr Celaris Solar Team

---
Celaris Solar GmbH
Telefon: +49 30 12345678
E-Mail: support@celaris.de
            """.strip()
        },
        
        "roi_analysis": {
            "subject": "Ihre persönliche Solar-Analyse",
            "body": """
Guten Tag {name},

anbei Ihre persönliche Solar-Analyse basierend auf Ihren Angaben:

📊 Ihre Solar-Ergebnisse:

Empfohlene Anlagengröße: {recommended_capacity} kWp
Jährliche Stromproduktion: {annual_production} kWh
Eigenverbrauch: {eigenverbrauch} kWh ({self_consumption_rate}%)

💰 Wirtschaftlichkeit:

Geschätzte Anschaffungskosten: {system_cost} €
Jährliche Einsparung: {annual_savings} €
Jährliche Einspeisevergütung: {annual_feedin} €
Amortisation nach: {payback_years} Jahren

🌱 Umweltbeitrag:

CO₂-Einsparung pro Jahr: {co2_saved} kg
Entspricht ca. {trees_equivalent} Bäumen

Diese Analyse ist unverbindlich und dient als erste Orientierung. Gerne erstellen wir 
Ihnen ein detailliertes Angebot nach einer persönlichen Beratung.

Mit sonnigen Grüßen
Ihr Celaris Solar Team
            """.strip()
        },
        
        "appointment_confirmation": {
            "subject": "Ihr Termin mit Celaris Solar",
            "body": """
Guten Tag {name},

Ihr Termin wurde erfolgreich gebucht!

📅 Termin-Details:

Datum: {appointment_date}
Uhrzeit: {appointment_time}
Art: {appointment_type}
Ort: {location}

Bitte halten Sie folgende Unterlagen bereit:
- Letzte Stromrechnung (für genauen Verbrauch)
- Grundriss oder Fotos des Daches (falls vorhanden)
- Fragen, die Sie besprechen möchten

Falls Sie den Termin verschieben müssen, geben Sie uns bitte mindestens 24 Stunden Bescheid.

Wir freuen uns auf unser Gespräch!

Mit sonnigen Grüßen
Ihr Celaris Solar Team
            """.strip()
        },
        
        "follow_up": {
            "subject": "Kurze Nachfrage von Celaris Solar",
            "body": """
Guten Tag {name},

ich hoffe, es geht Ihnen gut!

Ich wollte mich kurz erkundigen, ob Sie noch Fragen zu Ihrer Solar-Analyse haben 
oder ob wir Sie bei der Entscheidungsfindung unterstützen können.

Gerne vereinbaren wir einen unverbindlichen Beratungstermin - telefonisch oder 
vor Ort bei Ihnen.

Was passt Ihnen am besten?
- Telefonat diese Woche?
- Vor-Ort-Besichtigung?
- Erstmal weitere Informationen?

Einfach auf diese E-Mail antworten - ich melde mich dann zeitnah bei Ihnen.

Mit sonnigen Grüßen
Ihr Celaris Solar Team
            """.strip()
        },
        
        "offer_sent": {
            "subject": "Ihr persönliches Solar-Angebot",
            "body": """
Guten Tag {name},

anbei erhalten Sie Ihr persönliches Angebot für Ihre Solaranlage.

📋 Angebots-Details:

Anlagengröße: {capacity} kWp
Gesamtpreis: {total_price} €
Enthaltene Leistungen:
- Planung & Genehmigung
- Montage & Installation
- Netzanschluss & Inbetriebnahme
- 25 Jahre Leistungsgarantie

💰 Finanzierung:

Option 1: Barzahlung (-2% Skonto)
Option 2: Ratenfinanzierung (ab 2,99% eff. Jahreszins)
Option 3: Miete (ab 99€/Monat)

📞 Nächste Schritte:

Gerne besprechen wir das Angebot in einem persönlichen Gespräch. 
Haben Sie Fragen oder möchten Sie Änderungen?

Mit sonnigen Grüßen
Ihr Celaris Solar Team
            """.strip()
        }
    }
    
    def __init__(self):
        self.inbox = settings.AGENTMAIL_INBOX
        self.support_email = settings.EMAIL_SUPPORT
    
    async def send_template_email(
        self,
        lead: Lead,
        template: str,
        custom_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Send email using template
        
        Args:
            lead: Lead object with customer data
            template: Template name (welcome, roi_analysis, etc.)
            custom_data: Additional data for template substitution
        
        Returns:
            Dict with send result
        """
        if template not in self.TEMPLATES:
            raise ValueError(f"Unknown template: {template}")
        
        template_data = self.TEMPLATES[template]
        
        # Build template context
        context = {
            "name": lead.name.split()[0] if lead.name else "Kunde",
            "stromverbrauch": f"{lead.stromverbrauch:.0f}" if lead.stromverbrauch else "N/A",
            "dachflaeche": f"{lead.dachflaeche:.0f}" if lead.dachflaeche else "N/A",
            "interesse": lead.interesse or "Solaranlage",
            "recommended_capacity": str(custom_data.get("recommended_capacity", "N/A")) if custom_data else "N/A",
            "annual_production": str(custom_data.get("annual_production", "N/A")) if custom_data else "N/A",
            "eigenverbrauch": str(custom_data.get("eigenverbrauch", "N/A")) if custom_data else "N/A",
            "self_consumption_rate": str(custom_data.get("self_consumption_rate", "N/A")) if custom_data else "N/A",
            "system_cost": str(custom_data.get("system_cost", "N/A")) if custom_data else "N/A",
            "annual_savings": str(custom_data.get("annual_savings", "N/A")) if custom_data else "N/A",
            "annual_feedin": str(custom_data.get("annual_feedin_revenue", "N/A")) if custom_data else "N/A",
            "payback_years": str(custom_data.get("payback_period", "N/A")) if custom_data else "N/A",
            "co2_saved": str(custom_data.get("co2_saved", "N/A")) if custom_data else "N/A",
            "trees_equivalent": str(custom_data.get("trees_equivalent", "N/A")) if custom_data else "N/A",
            "appointment_date": custom_data.get("appointment_date", "N/A") if custom_data else "N/A",
            "appointment_time": custom_data.get("appointment_time", "N/A") if custom_data else "N/A",
            "appointment_type": custom_data.get("appointment_type", "Beratung") if custom_data else "Beratung",
            "location": custom_data.get("location", "Bei Ihnen vor Ort") if custom_data else "Bei Ihnen vor Ort",
            "capacity": str(custom_data.get("capacity", "N/A")) if custom_data else "N/A",
            "total_price": str(custom_data.get("total_price", "N/A")) if custom_data else "N/A"
        }
        
        # Substitute template variables
        subject = template_data["subject"]
        body = template_data["body"].format(**context)
        
        # Send via AgentMail (placeholder - actual implementation depends on AgentMail SDK)
        result = await self._send_via_agentmail(
            to_email=lead.email,
            subject=subject,
            body=body
        )
        
        logger.info(
            "Template email sent",
            lead_id=lead.id,
            template=template,
            recipient=lead.email
        )
        
        return {
            "success": True,
            "subject": subject,
            "recipient": lead.email,
            "template": template,
            "sent_at": datetime.utcnow(),
            "metadata": {"message_id": result.get("message_id")}
        }
    
    async def _send_via_agentmail(
        self,
        to_email: str,
        subject: str,
        body: str
    ) -> Dict[str, Any]:
        """
        Send email via AgentMail
        
        Note: This is a placeholder. Actual implementation depends on
        the AgentMail SDK availability and configuration.
        """
        # TODO: Implement actual AgentMail integration
        # For now, log the email that would be sent
        
        logger.info(
            "Email would be sent via AgentMail",
            inbox=self.inbox,
            to=to_email,
            subject=subject
        )
        
        # Simulate successful send
        return {
            "message_id": f"msg_{datetime.utcnow().timestamp()}",
            "status": "sent"
        }
    
    async def send_followup_sequence(self, lead: Lead, days_since_last_contact: int):
        """
        Automated follow-up sequence based on days since last contact
        
        Day 1: Welcome email
        Day 3: ROI analysis
        Day 7: Follow-up
        Day 14: Final follow-up
        """
        if days_since_last_contact == 1:
            await self.send_template_email(lead, "welcome")
        elif days_since_last_contact == 3:
            # Would need calculator data
            pass
        elif days_since_last_contact == 7:
            await self.send_template_email(lead, "follow_up")
        elif days_since_last_contact == 14:
            await self.send_template_email(lead, "follow_up")


# Singleton instance
email_service = EmailService()
