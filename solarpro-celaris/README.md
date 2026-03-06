# 🤖 SOLARPRO-CELARIS BOT

**Automatisierter Kunden-Anfrage-Bot für Celaris (Solar-Unternehmen)**

---

## 🎯 FEATURES

1. **Solar-Rechner** — Verbrauch → ROI (Amortisation, 20-Jahres-Prognose)
2. **Lead-Generator** — Website-Anfragen → CRM (Life OS)
3. **Email-Automation** — Auto-Follow-ups (AgentMail)
4. **Termin-Booking** — Besichtigungen automatisch buchen
5. **CRM-Integration** — Life OS Kundenverwaltung

---

## 📁 STRUCTURE

```
solarpro-celaris/
├── app/
│   ├── services/
│   │   ├── solar_calculator.py (8.9KB) ✅
│   │   ├── crm_service.py (Life OS)
│   │   └── email_service.py (AgentMail)
│   ├── api/
│   │   ├── routes.py (FastAPI)
│   │   └── webhooks.py
│   └── bot.py (Hauptscript)
├── config/
│   └── settings.py
├── scripts/
│   ├── deploy.sh
│   └── test_bot.py
└── README.md
```

---

## 🚀 QUICK START

### 1. Environment Setup
```bash
cd solarpro-celaris
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Config (.env)
```bash
# Celaris Config
CELARIS_API_KEY=your_key_here
CELARIS_CRM_URL=http://localhost:3002/unternehmen/celaris

# AgentMail
AGENTMAIL_API_KEY=your_key_here
AGENTMAIL_INBOX=frailyouth829@agentmail.to

# Life OS
LIFE_OS_URL=http://localhost:3002
```

### 3. Bot Starten
```bash
# Development
python3 app/bot.py --dev

# Production
python3 app/bot.py --prod
```

---

## 📊 USAGE

### Solar Calculator
```python
from services.solar_calculator import SolarCalculator

calc = SolarCalculator()
result = calc.calculate(
    consumption_kwh=4000,
    roof_size_m2=50,
    location="Karlsruhe"
)

print(f"ROI: {result.roi}%")
print(f"Amortisation: {result.payback_years} Jahre")
print(f"20-Jahres-Gewinn: €{result.profit_20y:,.2f}")
```

### Lead erfassen
```python
from services.crm_service import CRMService

crm = CRMService()
lead = crm.create_lead(
    name="Max Mustermann",
    email="max@example.com",
    phone="+49123456789",
    consumption_kwh=4000,
    region="Baden-Württemberg"
)
```

### Email senden
```python
from services.email_service import EmailService

email = EmailService()
email.send_followup(
    to="max@example.com",
    template="solar-consulting",
    data={"name": "Max", "roi": "12%"}
)
```

---

## 🔧 API-ENDPOINTS

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/calculate` | POST | Solar-Rechner |
| `/api/leads` | POST | Lead erfassen |
| `/api/appointments` | POST | Termin buchen |
| `/api/email/send` | POST | Email senden |
| `/api/webhooks/celaris` | POST | Celaris Webhooks |

---

## 📈 METRICS

| Metrik | Ziel | Aktuell |
|--------|------|---------|
| **Leads/Tag** | >10 | - |
| **Conversion-Rate** | >5% | - |
| **Response-Time** | <1h | - |
| **ROI (Kunden)** | >10% | - |

---

## 🛡️ SECURITY

- ✅ API-Keys in `.env` (nicht committen!)
- ✅ HTTPS für Production
- ✅ Rate-Limiting (100 Requests/Min)
- ✅ Input-Validation (Pydantic)
- ✅ Logging (alle Aktionen)

---

## 📝 TODO (Production)

- [ ] Unit Tests schreiben
- [ ] Integration Tests (Life OS, AgentMail)
- [ ] Docker-Container erstellen
- [ ] Monitoring (Prometheus)
- [ ] Alerting (Telegram bei Errors)

---

**READY TO DEPLOY!** ☀️🚀

*Last Updated: 2026-03-06 15:49*
