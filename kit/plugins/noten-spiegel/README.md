# 📊 Noten-Spiegel Community

**Anonyme Noten-Plattform für Transparenz am KIT**

Upload deine Noten anonym, vergleiche dich mit anderen und finde heraus, wie du im Modul abschneidest. 100% anonym, 100% transparent.

---

## ✨ Features

### 📈 Analytics
- **Modulschnitte berechnen** - Durchschnittsnote pro Modul automatisch
- **Ranking pro Modul** - Top-Performers sehen (anonym)
- **Semester-Vergleiche** - Trends über Zeit erkennen
- **Notenverteilung** - Histogramme & Statistiken

### 👨‍🏫 Dozenten-Bewertungen
- **Prof-Ratings** - Dozenten bewerten (1-5 Sterne)
- **Schwierigkeits-Rating** - Wie hart ist das Modul?
- **Kommentare** - Erfahrungsberichte teilen

### 📤 Export
- **CSV Download** - Alle Daten für eigene Analysen
- **PDF Report** - Schöner Übersichtreport
- **API Access** - Für eigene Projekte

### 🔒 Privacy First
- **100% Anonym** - Keine persönlichen Daten
- **DSGVO konform** - Europäische Datenschutz-Grundverordnung
- **Kein Tracking** - Keine Third-Party Tracker

---

## 🚀 Quick Start

### Installation (5 Minuten)

```bash
# 1. Repository klonen
cd kit/plugins/noten-spiegel

# 2. Dependencies installieren
npm install

# 3. Environment kopieren
cp .env.example .env

# 4. Environment setzen
# - DATABASE_URL (PostgreSQL)
# - NEXTAUTH_SECRET (openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000)

# 5. Database migrieren
npx prisma migrate dev

# 6. Development Server starten
npm run dev
```

👉 Öffne **http://localhost:3000**

### Docker (Optional)

```bash
docker compose up -d postgres
# DATABASE_URL="postgresql://user:pass@localhost:5432/notenspiegel"
```

---

## 📁 Projektstruktur

```
noten-spiegel/
├── app/
│   ├── page.tsx              # Home: Upload & Übersicht
│   ├── ranking/
│   │   └── page.tsx          # Modul-Rankings
│   ├── history/
│   │   └── page.tsx          # Semester-Vergleiche
│   ├── professors/
│   │   └── page.tsx          # Dozenten-Bewertungen
│   └── api/
│       ├── grades/
│       │   ├── upload/route.ts
│       │   ├── [moduleId]/route.ts
│       │   └── ranking/route.ts
│       ├── professors/
│       │   ├── rate/route.ts
│       │   └── [profId]/route.ts
│       └── export/
│           ├── csv/route.ts
│           └── pdf/route.ts
├── components/
│   ├── GradeUpload.tsx       # Upload Formular
│   ├── RankingTable.tsx      # Ranking Tabelle
│   ├── ProfessorCard.tsx     # Prof Card
│   └── Charts/
│       ├── GradeDistribution.tsx
│       └── SemesterTrend.tsx
├── lib/
│   ├── prisma.ts             # DB Client
│   ├── auth.ts               # NextAuth Config
│   └── stats.ts              # Statistik-Berechnungen
├── prisma/
│   └── schema.prisma         # Datenbank Schema
├── public/
└── package.json
```

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth.js |
| Charts | Recharts |
| PDF | @react-pdf/renderer |
| Icons | Lucide React |

---

## 📊 API Dokumentation

### Noten Endpoints

```typescript
// Note hochladen
POST /api/grades/upload
{
  "moduleId": "WIWI-BW201",
  "moduleName": "Investition & Finanzierung",
  "grade": 2.3,
  "semester": "WS2025",
  "anonymous": true
}

// Modul-Noten abrufen
GET /api/grades/module/:moduleId
Response: {
  "grades": [{ grade, semester, createdAt }],
  "average": 2.45,
  "count": 42
}

// Ranking für Modul
GET /api/grades/ranking/:moduleId
Response: {
  "ranking": [
    { "rank": 1, "grade": 1.0, "semester": "WS2025" },
    { "rank": 2, "grade": 1.3, "semester": "WS2025" }
  ],
  "yourGrade": { "rank": 15, "percentile": 85 }
}

// Historie / Trend
GET /api/grades/history/:moduleId
Response: {
  "history": [
    { "semester": "WS2024", "average": 2.8, "count": 35 },
    { "semester": "SS2025", "average": 2.6, "count": 40 }
  ]
}
```

### Dozenten Endpoints

```typescript
// Dozent bewerten
POST /api/professors/rate
{
  "professorId": "prof-123",
  "moduleId": "WIWI-BW201",
  "rating": 4,        // 1-5
  "difficulty": 3,    // 1-5
  "comment": "Guter Dozent, faire Klausur"
}

// Dozent-Details
GET /api/professors/:profId
Response: {
  "name": "Prof. Dr. Mustermann",
  "averageRating": 4.2,
  "totalReviews": 28,
  "averageDifficulty": 3.1,
  "modules": ["WIWI-BW201", "WIWI-VWL305"]
}
```

### Export Endpoints

```typescript
// CSV Export
GET /api/export/csv?moduleId=WIWI-BW201
Content-Type: text/csv

// PDF Report
GET /api/export/pdf?moduleId=WIWI-BW201
Content-Type: application/pdf
```

---

## 🗄️ Datenbank Schema

```prisma
model Grade {
  id        String   @id @default(uuid())
  moduleId  String
  moduleName String
  grade     Float
  semester  String
  ects      Int?
  createdAt DateTime @default(now())
  anonymous Boolean  @default(true)
  
  // Index für schnelle Queries
  @@index([moduleId, semester])
}

model Professor {
  id        String   @id @default(uuid())
  name      String
  moduleId  String
  rating    Float    @default(0)
  reviews   Int      @default(0)
  difficulty Float   @default(0)
  comments  Comment[]
  
  @@index([moduleId])
}

model Comment {
  id        String   @id @default(uuid())
  professorId String
  content   String
  rating    Int
  difficulty Int
  createdAt DateTime @default(now())
}
```

---

## 🎨 Design System

**Einheitlich mit allen KIT Plugins:**

### Typography
```css
--font-display: 'Fraunces', serif;      /* Headings */
--font-body: 'Plus Jakarta Sans', sans-serif;  /* Body */
```

### Farbpalette
```css
--primary: #f97316;      /* Warm Orange */
--primary-hover: #fb923c;
--background: #fafaf9;   /* Warm White */
--text: #1a1a1a;         /* Charcoal */
--success: #22c55e;
--warning: #eab308;
--danger: #f43f5e;
```

### Components
- **Button** - Primary, Secondary, Ghost
- **Card** - Subtle shadow, hover effects
- **Input** - Clean, focus states
- **Badge** - Status indicators
- **Table** - Sortable, responsive

---

## 📊 Performance Targets

- ✅ Lighthouse Score: 95+
- ✅ First Contentful Paint: < 1.5s
- ✅ Time to Interactive: < 3.5s
- ✅ Database Queries: < 100ms
- ✅ API Response: < 200ms

---

## 🔒 Security & Privacy

### Anonymität
- **Keine Namen** - Niemals persönliche Daten speichern
- **Keine IPs** - Keine IP-Adressen loggen
- **Kein Tracking** - Keine Third-Party Cookies
- **Aggregierte Daten** - Nur Statistiken anzeigen

### DSGVO
- **Recht auf Löschung** - Daten jederzeit löschbar
- **Datenminimierung** - Nur notwendige Daten
- **Encryption** - TLS für alle Verbindungen
- **EU-Server** - Database in Europa

---

## 🧪 Testing

```bash
# Unit Tests
npm test

# E2E Tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 🚀 Deployment

### Vercel (Empfohlen)

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel

# Environment Variables im Dashboard setzen:
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
```

### Database (Neon/Supabase)

```bash
# Neon (Serverless Postgres)
# https://neon.tech
# Kostenlos, unlimited, branchable

# Supabase
# https://supabase.com
# PostgreSQL + Auth + Storage
```

---

## 📈 Roadmap

### Q2 2026 - MVP ✅
- [x] Upload & Anzeige
- [x] Rankings
- [x] Professor Ratings
- [ ] CSV/PDF Export
- [ ] Mobile App

### Q3 2026 - Features
- [ ] Discord Bot (Noten-Benachrichtigungen)
- [ ] Notifier (Neue Noten)
- [ ] Vergleich mit Freunden (opt-in)
- [ ] Lerngruppen-Empfehlungen

### Q4 2026 - AI
- [ ] Notenvorhersage (basierend auf Historie)
- [ ] Modul-Empfehlungen
- [ ] Chatbot für Fragen

---

## 🤝 Contributing

### Guidelines
1. **Forken** - Repository forken
2. **Branch** - `git checkout -b feature/amazing`
3. **Commit** - `git commit -m 'Add amazing feature'`
4. **Push** - `git push origin feature/amazing`
5. **PR** - Pull Request öffnen

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Components als Functions
- Hooks für Logic

---

## 📞 Support

- **Discord:** https://discord.gg/UGkgpRFj
- **Issues:** GitHub Issues
- **Email:** support@kit-study-tools.de

---

## 🙏 Credits

**Built by:** KIT Students for KIT Students  
**License:** MIT  
**Not official:** Keine offizielle KIT-Verbindung

---

**🎓 Transparenz schafft Fairness.**

*Made with ❤️ at KIT*
