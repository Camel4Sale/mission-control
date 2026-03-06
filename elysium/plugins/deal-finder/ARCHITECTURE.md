# 🏗️ Architektur-Dokumentation

## System-Übersicht

```
┌─────────────────────────────────────────────────────────────────┐
│                     Elysium Platform                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Deal-Finder Pro Plugin                       │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │   Scraper   │  │  Analyzer   │  │   Alerts    │       │  │
│  │  │  Service    │  │  Service    │  │  Service    │       │  │
│  │  │             │  │             │  │             │       │  │
│  │  │ - Puppeteer │  │ - OpenAI    │  │ - Email     │       │  │
│  │  │ - Cheerio   │  │ - Scoring   │  │ - SMS       │       │  │
│  │  │ - Cron      │  │ - Compare   │  │ - Push      │       │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │  │
│  │         │                │                │               │  │
│  │         └────────────────┼────────────────┘               │  │
│  │                          │                                │  │
│  │                 ┌────────▼────────┐                       │  │
│  │                 │  Deal Store     │                       │  │
│  │                 │  (In-Memory)    │                       │  │
│  │                 └────────┬────────┘                       │  │
│  │                          │                                │  │
│  │  ┌───────────────────────┼───────────────────────┐       │  │
│  │  │                  Next.js App                   │       │  │
│  │  │  ┌─────────┐  ┌──────▼──────┐  ┌──────────┐   │       │  │
│  │  │  │  Pages  │  │ API Routes  │  │ Components│   │       │  │
│  │  │  └─────────┘  └─────────────┘  └──────────┘   │       │  │
│  │  └───────────────────────────────────────────────┘       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Datenfluss

### 1. Scraping Pipeline

```
ImmoScout24 ──┐
Immowelt  ────┼──► Scraper ──► Property Objects ──► Deal Store
Kleinanzeigen─┘
```

**Schritte:**
1. Scheduler triggert alle 15 Minuten
2. Puppeteer öffnet Browser-Instanzen
3. Seiten werden geparst (Cheerio)
4. Daten werden normalisiert
5. Properties als Deals gespeichert

### 2. Analyse Pipeline

```
Deal Store ──► Analyzer ──► OpenAI API ──► AI Analysis ──► Deal Update
```

**Schritte:**
1. Neue Deals identifizieren (status='neu')
2. Vergleichbare Properties suchen
3. Marktwert berechnen
4. AI-Insights generieren
5. Potenzial-Score berechnen
6. Deal mit Analysis updaten

### 3. Alert Pipeline

```
Deal Update ──► Alert Service ──► User Filters ──► Send Alert
                                      │
                                      ├──► Push
                                      ├──► Email
                                      └──► SMS
```

**Schritte:**
1. Deal erhalten (neu oder analysiert)
2. User Alert-Configs laden
3. Filter anwenden (PLZ, Preis, Score)
4. Alert-Typ bestimmen (Push/Email/SMS)
5. Nachricht formatieren
6. Versand durchführen

## Komponenten

### Scraper Service (`src/services/scraper.ts`)

**Verantwortlichkeit:** Properties von externen Quellen extrahieren

**Klassen:**
- `PropertyScraper` - Haupt-Scraper-Klasse
  - `scrapeAllSources()` - Alle Quellen parallel
  - `scrapeImmoScout24()` - ImmoScout24 spezifisch
  - `scrapeImmowelt()` - Immowelt spezifisch
  - `scrapeKleinanzeigen()` - Kleinanzeigen spezifisch

**Technologien:**
- Puppeteer - Browser-Automatisierung
- Cheerio - HTML-Parsing
- Axios - HTTP-Requests

### Analyzer Service (`src/services/analyzer.ts`)

**Verantwortlichkeit:** AI-gestützte Property-Analyse

**Klassen:**
- `PropertyAnalyzer`
  - `analyzeProperty()` - Hauptanalyse
  - `findComparableProperties()` - Vergleiche finden
  - `calculateMarketValue()` - Marktwert berechnen
  - `calculatePotentialScore()` - Score berechnen
  - `getAIInsights()` - OpenAI Insights

**Berechnungen:**
- **Marktwert:** Gewichteter Durchschnitt vergleichbarer Properties
- **Preis-Empfehlung:** 
  - >10% über Marktwert = "zu_teuer"
  - <-15% unter Marktwert = "schnaeppchen"
  - sonst = "fair"
- **Potenzial-Score:** 0-100 (AI + Algorithmus)
- **Mietrendite:** (Jahresmiete / Kaufpreis) × 100

### Alert Service (`src/services/alert-service.ts`)

**Verantwortlichkeit:** User-Benachrichtigungen

**Klassen:**
- `AlertService`
  - `sendAlerts()` - Hauptmethode
  - `sendPushNotification()` - Push
  - `sendEmail()` - Email mit HTML-Template
  - `sendSMS()` - SMS via Twilio
  - `sendDailyDigest()` - Zusammenfassung

**Alert-Typen:**
- **Push:** Sofort, für alle neuen Deals
- **Email:** Täglich oder sofort
- **SMS:** Nur bei Top-Deals (>30% unter Marktwert)

### Scheduler Service (`src/services/scheduler.ts`)

**Verantwortlichkeit:** Zeitgesteuerte Aufgaben

**Tasks:**
| Task | Cron | Beschreibung |
|------|------|--------------|
| Scrape | `*/15 * * * *` | Alle 15 Min scrapen |
| Analyze | `*/30 * * * *` | Alle 30 Min analysieren |
| Daily Digest | `0 8 * * *` | Täglich 8 Uhr Email |
| Cleanup | `0 3 * * 0` | Sonntags aufräumen |

### Frontend Components

**DealCard (`src/components/DealCard.tsx`)**
- Zeigt Deal-Details
- Score-Visualisierung
- Favorite-Button
- Status-Badges

**DealPipeline (`src/components/DealPipeline.tsx`)**
- Kanban-Board Ansicht
- Drag & Drop Status-Änderung
- Spalten nach Status

**MarketChart (`src/components/MarketChart.tsx`)**
- Preis-Entwicklung (Line Chart)
- Angebot/Nachfrage (Pie Chart)
- Stadt-Vergleich (Bar Chart)

## API-Design

### REST Endpoints

```
GET    /api/deals              # List deals
POST   /api/deals              # Create deal
GET    /api/deals/:id          # Get deal
PUT    /api/deals/:id          # Update deal
DELETE /api/deals/:id          # Delete deal
PATCH  /api/deals/:id/status   # Update status

POST   /api/analyze            # Analyze property
GET    /api/analyze/batch      # Batch analyze

GET    /api/alerts             # Get alert config
POST   /api/alerts             # Save alert config
DELETE /api/alerts             # Delete alert config

GET    /api/export?format=csv  # Export CSV
GET    /api/export?format=pdf  # Export PDF
```

### Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "count": 42
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

## Data Models

### Property
```typescript
{
  id: string (UUID)
  source: 'immoscout24' | 'immowelt' | 'kleinanzeigen'
  url: string
  title: string
  price: number
  size: number
  rooms?: number
  location: {
    address: string
    city: string
    zipCode: string
    district?: string
  }
  yearBuilt?: number
  createdAt: Date
  updatedAt: Date
}
```

### AIAnalysis
```typescript
{
  propertyId: string
  marketValue: number
  marketValueRange: { min: number, max: number }
  priceRecommendation: 'zu_teuer' | 'fair' | 'schnaeppchen'
  potentialScore: number (0-100)
  rentalYield: { gross: number, net: number }
  comparableProperties: Array<{ id, price, size, distance }>
  riskFactors: string[]
  opportunities: string[]
  analyzedAt: Date
}
```

### Deal
```typescript
{
  ...Property
  status: 'neu' | 'analysiert' | 'besichtigt' | 'angebot' | 'kauf' | 'abgelehnt'
  analysis?: AIAnalysis
  notes: Array<{ id, content, createdAt }>
  isFavorite: boolean
  tags: string[]
}
```

## Sicherheit

### API Security
- CORS Headers konfiguriert
- Rate Limiting empfohlen
- API Keys in Environment Variables

### Data Protection
- Keine sensiblen Daten im Client
- HTTPS in Production
- DSGVO-konform (keine personenbezogenen Daten)

## Performance

### Optimierungen
- Puppeteer im Headless-Mode
- Paralleles Scraping (Promise.allSettled)
- In-Memory Store für schnellen Zugriff
- Responsive Images

### Skalierung
- Database-Integration möglich (Prisma)
- Redis-Caching vorbereitbar
- Worker-Threads für Scraping

## Testing Strategy

### Unit Tests (TODO)
- Scraper Parsing-Logik
- Analyzer Berechnungen
- Alert-Filter

### Integration Tests (TODO)
- API Endpoints
- Scheduler Tasks

### E2E Tests (TODO)
- User Workflows
- Scraping-Pipeline

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Siehe `.env.example`

### Hosting-Optionen
- Vercel (empfohlen für Next.js)
- Docker Container
- Eigenes VPS

---

**Version:** 1.0.0  
**Letztes Update:** März 2026
