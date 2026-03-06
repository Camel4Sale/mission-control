# 🏠 Deal-Finder Pro

**Elysium Plugin für intelligente Immobilien-Suche und Deal-Analyse**

![Deal-Finder Pro](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

---

## 🚀 Features

### 1. Property-Scraper
- **Quellen:** ImmoScout24, Immowelt, Kleinanzeigen
- **Daten:** Preis, Größe, Lage, Zimmer, Baujahr
- **Auto-Refresh:** Alle 15 Minuten
- **Filter:** PLZ, Preis, Größe, Rendite

### 2. AI-Bewertung
- **Marktwert-Analyse:** Vergleich mit ähnlichen Objekten
- **Preis-Empfehlung:** Zu teuer / Fair / Schnäppchen
- **Potenzial-Score:** 0-100 (Investment-Qualität)
- **Rendite-Schätzung:** Brutto/Netto

### 3. Alert-System
- **Push-Benachrichtigungen:** Neue Deals
- **Email-Alerts:** Tägliche Zusammenfassung
- **SMS-Alerts:** Bei Top-Deals (>30% unter Marktwert)
- **Custom-Filter:** User-definierte Kriterien

### 4. Deal-Pipeline
- **Status:** Neu, Analysiert, Besichtigt, Angebot, Kauf
- **Notizen:** Pro Objekt
- **Favoriten:** Merkliste
- **Export:** CSV, PDF

### 5. Markt-Analyse
- **Preis-Entwicklung:** Charts pro Stadtteil
- **Angebot-Nachfrage:** Verhältnis
- **Durchschnittspreise:** €/m²
- **Mietspiegel:** Integration

---

## 📦 Installation

### Voraussetzungen

- Node.js 18+ 
- npm oder yarn
- OpenAI API Key (für AI-Analyse)

### Schritte

```bash
# In den Plugin-Ordner navigieren
cd /data/.openclaw/workspace/elysium/plugins/deal-finder

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env.local

# .env.local bearbeiten und OpenAI API Key eintragen
# OPENAI_API_KEY=sk-your-api-key-here

# Entwicklungsserver starten
npm run dev
```

Die App ist dann unter `http://localhost:3000` verfügbar.

---

## 🔧 Konfiguration

### Umgebungsvariablen

| Variable | Beschreibung | Erforderlich |
|----------|--------------|--------------|
| `OPENAI_API_KEY` | OpenAI API Key für AI-Analyse | ✅ |
| `SMTP_HOST` | SMTP Server für Email-Alerts | ❌ |
| `SMTP_PORT` | SMTP Port | ❌ |
| `SMTP_USER` | SMTP Benutzer | ❌ |
| `SMTP_PASS` | SMTP Passwort | ❌ |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID für SMS | ❌ |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | ❌ |
| `TWILIO_FROM_NUMBER` | Twilio Telefonnummer | ❌ |

### Scraper-Konfiguration

Die Scraper-Einstellungen können in `src/services/scheduler.ts` angepasst werden:

```typescript
const config = {
  scraperConfig: {
    zipCodes: ['10115', '10117', '10119'], // PLZ-Bereiche
    minPrice: 500,
    maxPrice: 2000,
    minSize: 40,
    maxSize: 120,
  },
};
```

---

## 📖 API-Endpunkte

### Deals

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| `GET` | `/api/deals` | Alle Deals abrufen |
| `POST` | `/api/deals` | Neuen Deal erstellen |
| `GET` | `/api/deals/:id` | Deal nach ID |
| `PUT` | `/api/deals/:id` | Deal aktualisieren |
| `DELETE` | `/api/deals/:id` | Deal löschen |
| `PATCH` | `/api/deals/:id/status` | Status aktualisieren |

### Analyse

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| `POST` | `/api/analyze` | Property analysieren |
| `GET` | `/api/analyze/batch` | Batch-Analyse |

### Alerts

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| `GET` | `/api/alerts?userId=xxx` | Alert-Konfiguration |
| `POST` | `/api/alerts` | Alert-Konfiguration speichern |
| `DELETE` | `/api/alerts?userId=xxx` | Alert-Konfiguration löschen |

### Export

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| `GET` | `/api/export?format=csv` | Als CSV exportieren |
| `GET` | `/api/export?format=pdf` | Als PDF exportieren |

---

## 🏗️ Architektur

```
deal-finder/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   ├── deals/          # Deal CRUD
│   │   │   ├── analyze/        # AI-Analyse
│   │   │   ├── alerts/         # Alert-Config
│   │   │   └── export/         # Export
│   │   ├── page.tsx            # Hauptseite
│   │   ├── layout.tsx          # Root Layout
│   │   └── globals.css         # Globale Styles
│   ├── components/             # React Components
│   │   ├── DealCard.tsx        # Deal-Karte
│   │   ├── DealPipeline.tsx    # Pipeline-View
│   │   └── MarketChart.tsx     # Markt-Charts
│   ├── services/               # Business Logic
│   │   ├── scraper.ts          # Property-Scraper
│   │   ├── analyzer.ts         # AI-Analyse
│   │   ├── alert-service.ts    # Alert-System
│   │   └── scheduler.ts        # Cron-Jobs
│   └── types/                  # TypeScript Types
│       └── index.ts            # Alle Types
├── .env.example                # Umgebungsvariablen
├── next.config.js              # Next.js Config
├── tailwind.config.js          # Tailwind Config
├── tsconfig.json               # TypeScript Config
└── package.json                # Dependencies
```

---

## 🎯 Verwendung

### 1. Dashboard öffnen

Nach dem Start (`npm run dev`) öffne `http://localhost:3000`.

### 2. Deals durchsuchen

- Verwende die Filter für Stadt, Preis und Score
- Wechsle zwischen Grid-, Pipeline- und Markt-Ansicht

### 3. Deal analysieren

Neue Deals werden automatisch alle 15 Minuten gescraped und alle 30 Minuten analysiert.

### 4. Alerts konfigurieren

Über die API oder das Dashboard (in Entwicklung) können Alert-Präferenzen eingestellt werden.

### 5. Exportieren

- CSV: Für Excel/Sheets
- PDF: Für Präsentationen

---

## 🧪 Entwicklung

### Scripts

```bash
# Entwicklungsserver
npm run dev

# Production Build
npm run build

# Start Production
npm start

# Linting
npm run lint

# Scraper manuell ausführen
npm run scrape

# Analyse manuell ausführen
npm run analyze

# Alert-Service testen
npm run alert
```

### Testing (TODO)

```bash
# Tests ausführen
npm test
```

---

## 🔐 Sicherheit

- API-Keys niemals im Code speichern
- Umgebungsvariablen verwenden
- `.env.local` nicht committen
- Rate Limiting für API-Endpunkte implementieren
- CORS für Production konfigurieren

---

## 📝 Lizenz

MIT License - siehe LICENSE Datei

---

## 🤝 Contributing

1. Fork the repo
2. Create Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit Changes (`git commit -m 'Add amazing feature'`)
4. Push to Branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support

Fragen oder Probleme? Öffne ein Issue im Repository.

---

**Built with ❤️ for the Elysium Platform**
