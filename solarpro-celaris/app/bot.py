#!/usr/bin/env python3
"""
SolarPro Celaris Bot — Hauptscript

Automatisiert Kunden-Anfragen für Celaris Solar-Unternehmen.

Features:
- Solar-Rechner (Verbrauch → ROI)
- Lead-Generator (Website → CRM)
- Email-Automation (AgentMail)
- Termin-Booking

Usage:
    python3 bot.py --dev  # Development
    python3 bot.py --prod # Production
"""

import argparse
import logging
from datetime import datetime
from pathlib import Path

# Setup Logging
LOG_DIR = Path("/data/.openclaw/workspace/solarpro-celaris/logs")
LOG_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_DIR / f"bot-{datetime.now().strftime('%Y%m%d')}.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class SolarProBot:
    """
    Haupt-Bot-Klasse für Celaris Solar-Anfragen.
    
    Koordiniert:
    - Solar-Calculator Service
    - CRM Service (Life OS)
    - Email Service (AgentMail)
    - Appointment Booking
    """
    
    def __init__(self, mode: str = "dev"):
        self.mode = mode
        self.start_time = datetime.now()
        
        logger.info(f"🤖 SolarPro Bot gestartet ({mode}-mode)")
        logger.info(f"   Startzeit: {self.start_time}")
        
        # Services werden lazy geladen
        self._calculator = None
        self._crm = None
        self._email = None
    
    @property
    def calculator(self):
        """Lazy load Solar Calculator"""
        if self._calculator is None:
            from services.solar_calculator import SolarCalculator
            self._calculator = SolarCalculator()
        return self._calculator
    
    @property
    def crm(self):
        """Lazy load CRM Service"""
        if self._crm is None:
            from services.crm_service import CRMService
            self._crm = CRMService()
        return self._crm
    
    @property
    def email(self):
        """Lazy load Email Service"""
        if self._email is None:
            from services.email_service import EmailService
            self._email = EmailService()
        return self._email
    
    def handle_inquiry(self, inquiry: dict) -> dict:
        """
        Bearbeite Kunden-Anfrage.
        
        Args:
            inquiry: Dict mit name, email, phone, consumption_kwh, region
        
        Returns:
            dict: Result mit ROI, next_steps
        """
        logger.info(f"📩 Neue Anfrage von {inquiry.get('name', 'Unknown')}")
        
        # 1. Solar-Rechner
        roi_result = self.calculator.calculate(
            consumption_kwh=inquiry.get('consumption_kwh', 4000),
            roof_size_m2=inquiry.get('roof_size_m2', 50),
            location=inquiry.get('region', 'Baden-Württemberg')
        )
        
        # 2. Lead in CRM erfassen
        lead = self.crm.create_lead(
            name=inquiry.get('name'),
            email=inquiry.get('email'),
            phone=inquiry.get('phone'),
            consumption_kwh=inquiry.get('consumption_kwh'),
            region=inquiry.get('region'),
            roi=roi_result.roi
        )
        
        # 3. Follow-up Email senden
        self.email.send_followup(
            to=inquiry.get('email'),
            template="solar-consulting",
            data={
                "name": inquiry.get('name'),
                "roi": f"{roi_result.roi:.1f}%",
                "payback_years": f"{roi_result.payback_years:.1f}"
            }
        )
        
        # 4. Next Steps
        result = {
            "status": "success",
            "lead_id": lead.id,
            "roi": roi_result.roi,
            "payback_years": roi_result.payback_years,
            "next_steps": [
                "Email mit Angebot gesendet",
                "Anruf innerhalb 24h geplant",
                "Besichtigungstermin vorschlagen"
            ]
        }
        
        logger.info(f"✅ Anfrage bearbeitet: Lead-ID {lead.id}")
        return result
    
    def run(self):
        """
        Haupt-Loop (für Production).
        
        Pollt Celaris-API auf neue Anfragen.
        """
        logger.info("🔄 Starte Bot-Loop...")
        
        # TODO: Implement polling logic
        # while True:
        #     inquiries = self.fetch_new_inquiries()
        #     for inquiry in inquiries:
        #         self.handle_inquiry(inquiry)
        #     sleep(60)  # Check every minute
        
        logger.info("⏸️ Bot im Idle-Mode (manuelle Trigger)")
        return {"status": "idle", "message": "Bot ready for inquiries"}
    
    def get_stats(self) -> dict:
        """Bot-Statistiken"""
        uptime = datetime.now() - self.start_time
        return {
            "mode": self.mode,
            "uptime_seconds": uptime.total_seconds(),
            "start_time": str(self.start_time),
            "services_loaded": {
                "calculator": self._calculator is not None,
                "crm": self._crm is not None,
                "email": self._email is not None
            }
        }


def main():
    parser = argparse.ArgumentParser(description="SolarPro Celaris Bot")
    parser.add_argument("--mode", choices=["dev", "prod"], default="dev",
                       help="Betriebsmodus")
    parser.add_argument("--test", action="store_true",
                       help="Test-Modus (Demo-Anfrage)")
    
    args = parser.parse_args()
    
    # Bot erstellen
    bot = SolarProBot(mode=args.mode)
    
    if args.test:
        # Test-Anfrage
        logger.info("🧪 Test-Modus aktiv")
        test_inquiry = {
            "name": "Max Mustermann",
            "email": "max@example.com",
            "phone": "+49123456789",
            "consumption_kwh": 4000,
            "roof_size_m2": 50,
            "region": "Karlsruhe"
        }
        result = bot.handle_inquiry(test_inquiry)
        logger.info(f"✅ Test-Ergebnis: {result}")
    else:
        # Normaler Betrieb
        bot.run()
    
    # Stats
    stats = bot.get_stats()
    logger.info(f"📊 Stats: {stats}")


if __name__ == "__main__":
    main()
