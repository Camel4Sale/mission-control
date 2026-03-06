# 🤖 Klausur-AI

**AI-gestützte Altklausur-Sammlung mit intelligenten Lösungen**

Lade Altklausuren hoch, lass dir von AI Schritt-für-Schritt Lösungen erklären und bereite dich optimal auf deine Prüfungen vor.

---

## ✨ Features

### 📚 Altklausur-Sammlung
- **Community-Uploads** - Studenten teilen Klausuren
- **Volltext-Suche** - Schnell die richtige Klausur finden
- **Filter** - Nach Modul, Semester, Dozent
- **Vorschau** - PDF-Viewer integriert

### 🧠 AI Features (Premium)
- **Lösungen generieren** - AI löst Klausuraufgaben
- **Schritt-für-Schritt** - Verständliche Erklärungen
- **Similarity-Check** - Plagiatserkennung
- **Zusammenfassung** - Wichtige Konzepte extrahieren

### 💳 Monetarisierung
- **Free** - Klausuren ansehen & suchen
- **Premium €5/Monat** - Alle AI-Features
- **Stripe Integration** - Sichere Zahlungen

---

## 🚀 Quick Start

### Installation (5 Minuten)

```bash
# 1. Repository klonen
cd kit/plugins/klausur-ai

# 2. Dependencies installieren
npm install

# 3. Environment kopieren
cp .env.example .env

# 4. Environment setzen
# - DATABASE_URL (PostgreSQL)
# - NEXTAUTH_SECRET (openssl rand -base64 32)
# - STRIPE_SECRET_KEY (https://dashboard.stripe.com)
# - AI_PROVIDER ("ollama" oder "openrouter")
# - AI_MODEL (z.B. "qwen2.5-coder:32b")

# 5. Database migrieren
npx prisma migrate dev

# 6. Development Server starten
npm run dev
```

👉 Öffne **http://localhost:3000**

---

## 📁 Projektstruktur

```
klausur-ai/
├── app/
│   ├── page.tsx              # Home: Suche & Upload
│   ├── exams/
│   │   ├── [id]/page.tsx     # Klausur-Detail + Viewer
│   │   └── upload/page.tsx   # Upload Formular
│   ├── premium/
│   │   └── page.tsx          # Premium Landing
│   └── api/
│       ├── exams/
│       │   ├── route.ts      # GET alle, POST upload
│       │   └── [id]/route.ts # GET detail
│       ├── ai/
│       │   ├── solve/route.ts
│       │   ├── explain/route.ts
│       │   └── similarity/route.ts
│       └── stripe/
│           ├── checkout/route.ts
│           └── webhook/route.ts
├── components/
│   ├── ExamSearch.tsx        # Suche mit Filtern
│   ├── ExamCard.tsx          # Klausur Card
│   ├── PDFViewer.tsx         # PDF.js Viewer
│   ├── AIExplanation.tsx     # AI Lösung
│   └── PremiumPaywall.tsx    # Stripe Checkout
├── lib/
│   ├── prisma.ts             # DB Client
│   ├── ai.ts                 # AI Provider (Ollama/OpenRouter)
│   ├── stripe.ts             # Stripe Config
│   └── search.ts             # QMD Local Search
├── prisma/
│   └── schema.prisma
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
| AI | Ollama / OpenRouter |
| Payments | Stripe |
| PDF | PDF.js |
| Search | QMD (Local Search) |
| Icons | Lucide React |

---

## 📊 API Dokumentation

### Public Endpoints

```typescript
// Alle Klausuren (mit Filtern)
GET /api/exams?moduleId=WIWI-BW201&semester=WS2025
Response: {
  "exams": [
    {
      "id": "uuid",
      "moduleId": "WIWI-BW201",
      "moduleName": "Investition & Finanzierung",
      "professor": "Prof. Dr. Mustermann",
      "semester": "WS2025",
      "examDate": "2025-02-15",
      "duration": 120,
      "ects": 6,
      "difficulty": 3,
      "views": 142,
      "uploads": 8,
      "tags": ["Finance", "BWL"]
    }
  ]
}

// Klausur-Detail
GET /api/exams/:id
Response: {
  "exam": {...},
  "solutions": [...],
  "relatedExams": [...]
}

// Upload (Auth required)
POST /api/exams/upload
{
  "moduleId": "WIWI-BW201",
  "moduleName": "Investition & Finanzierung",
  "professor": "Prof. Dr. Mustermann",
  "semester": "WS2025",
  "examDate": "2025-02-15",
  "duration": 120,
  "ects": 6,
  "file": "base64...",
  "tags": ["Finance", "BWL"]
}

// Volltext-Suche
GET /api/search?q=capital+asset+pricing
Response: {
  "results": [...],
  "total": 15
}
```

### Premium Endpoints (AI)

```typescript
// AI Lösung generieren
POST /api/ai/solve
{
  "examId": "uuid",
  "question": "Aufgabe 1a: Berechnen Sie den CAPM-Beta...",
  "context": "Erwartete Rendite: 8%, risikofreier Zins: 2%..."
}

Response: {
  "solution": "Der CAPM-Beta berechnet sich aus...",
  "steps": [
    {
      "step": 1,
      "description": "Identifiziere die gegebenen Werte",
      "formula": "E(R) = Rf + β * (E(Rm) - Rf)"
    },
    {
      "step": 2,
      "description": "Stelle nach β um",
      "formula": "β = (E(R) - Rf) / (E(Rm) - Rf)"
    },
    {
      "step": 3,
      "description": "Setze die Werte ein",
      "calculation": "β = (0.08 - 0.02) / (0.10 - 0.02) = 0.75"
    }
  ],
  "confidence": 0.95,
  "sources": ["Kapitel 3.2", "Folie 45"]
}

// Schritt-für-Schritt Erklärung
POST /api/ai/explain
{
  "concept": "Capital Asset Pricing Model",
  "level": "beginner"  // beginner, intermediate, advanced
}

Response: {
  "explanation": "Das CAPM ist ein Modell zur Berechnung...",
  "keyPoints": [...],
  "examples": [...],
  "commonMistakes": [...]
}

// Similarity Check (Plagiatserkennung)
POST /api/ai/similarity
{
  "text1": "Student Lösung...",
  "text2": "Vergleichslösung..."
}

Response: {
  "similarity": 0.23,
  "isPlagiarism": false,
  "threshold": 0.7,
  "matchedSegments": [
    {"start": 45, "end": 78, "similarity": 0.89}
  ]
}

// Zusammenfassung
POST /api/ai/summary
{
  "examId": "uuid",
  "maxLength": 500  // Wörter
}

Response: {
  "summary": "Diese Klausur behandelt folgende Themen...",
  "keyConcepts": ["CAPM", "Portfolio Theory", "Risk Management"],
  "difficulty": "medium"
}
```

### Payment Endpoints

```typescript
// Premium Checkout
POST /api/stripe/checkout
{
  "email": "student@kit.edu",
  "plan": "monthly"  // monthly (€5), yearly (€50)
}

Response: {
  "url": "https://checkout.stripe.com/..."
}

// Stripe Webhook
POST /api/stripe/webhook
// Handle: checkout.session.completed, customer.subscription.deleted
```

---

## 🗄️ Datenbank Schema

```prisma
model Exam {
  id          String   @id @default(uuid())
  moduleId    String
  moduleName  String
  professor   String?
  semester    String
  examDate    DateTime
  duration    Int      // Minuten
  ects        Int
  difficulty  Int      // 1-5 (Community Rating)
  fileUrl     String
  thumbnailUrl String?
  uploads     Int      @default(0)
  views       Int      @default(0)
  isPremium   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tags        String[]
  
  solutions   Solution[]
  
  @@index([moduleId, semester])
  @@index([tags])
}

model Solution {
  id        String   @id @default(uuid())
  examId    String
  content   String   @db.Text
  aiGenerated Boolean @default(false)
  steps     Json     // Schritt-für-Schritt
  rating    Float    @default(0)
  votes     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  exam      Exam     @relation(fields: [examId], references: [id])
  
  @@index([examId])
}

model PremiumUser {
  id        String   @id @default(uuid())
  email     String   @unique
  stripeId  String   @unique
  plan      String   @default("monthly")
  status    String   @default("active")  // active, canceled, expired
  expiresAt DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([email])
  @@index([stripeId])
}

model AIUsage {
  id        String   @id @default(uuid())
  userId    String
  action    String   // solve, explain, similarity, summary
  tokens    Int
  cost      Float
  createdAt DateTime @default(now())
  
  @@index([userId, createdAt])
}
```

---

## 🧠 AI Integration

### Provider Setup

```typescript
// lib/ai.ts
import OpenAI from 'openai';

// Ollama (Local)
const ollama = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

// OpenRouter (Cloud)
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://kit-study-tools.de',
    'X-Title': 'Klausur-AI',
  },
});

export async function generateSolution(prompt: string) {
  const provider = process.env.AI_PROVIDER === 'openrouter' 
    ? openrouter 
    : ollama;
  
  const response = await provider.chat.completions.create({
    model: process.env.AI_MODEL || 'qwen2.5-coder:32b',
    messages: [
      {
        role: 'system',
        content: 'Du bist ein hilfreicher KI-Tutor am KIT. Erkläre Schritt-für-Schritt, verständlich und präzise.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,  // Präzise, nicht kreativ
    max_tokens: 2000,
  });
  
  return response.choices[0].message.content;
}
```

### Prompt Templates

```typescript
// Lösung generieren
const solvePrompt = `
Du bist ein erfahrener Tutor am KIT. Löse diese Klausuraufgabe Schritt-für-Schritt:

**Aufgabe:**
${question}

**Kontext:**
${context}

**Anforderungen:**
1. Erkläre jeden Schritt verständlich
2. Zeige alle Formeln und Berechnungen
3. Nenne die relevanten Konzepte
4. Gib am Ende eine kurze Zusammenfassung

**Format:**
- Verwende LaTeX für Formeln: $E = mc^2$
- Strukturiere mit Überschriften
- Füge Beispiele hinzu wenn hilfreich
`;

// Erklärung generieren
const explainPrompt = `
Erkläre dieses Konzept für einen ${level} Studenten:

**Konzept:** ${concept}

**Anforderungen:**
1. Beginne mit einer intuitiven Erklärung
2. Nenne die wichtigsten Formeln
3. Gib ein konkretes Beispiel
4. Erwähne häufige Fehler

**Level:**
- Beginner: Sehr einfach, mit Analogien
- Intermediate: Standard-Erklärung, Formeln
- Advanced: Tiefgehend, mathematisch rigoros
`;
```

---

## 💰 Pricing

### Free (€0)
✅ Klausuren ansehen  
✅ Volltext-Suche  
✅ Filter nach Modul/Semester  
✅ PDF-Viewer  
✅ Upload (Community-Beitrag)  

### Premium (€5/Monat)
✅ Alle Free Features  
✅ AI-Lösungen generieren  
✅ Schritt-für-Schritt Erklärungen  
✅ Similarity-Check  
✅ Zusammenfassungen  
✅ Unbegrenzte Downloads  
✅ Priority Support  

### Jahresabo (€50/Jahr)
✅ Alle Premium Features  
✅ 2 Monate gratis  
✅ Early Access zu neuen Features  

---

## 🎨 Design System

**Einheitlich mit allen KIT Plugins:**

### Typography
```css
--font-display: 'Fraunces', serif;
--font-body: 'Plus Jakarta Sans', sans-serif;
```

### Farbpalette
```css
--primary: #f97316;      /* Warm Orange */
--primary-hover: #fb923c;
--background: #fafaf9;
--text: #1a1a1a;
--success: #22c55e;
--warning: #eab308;
--danger: #f43f5e;
```

---

## 📊 Performance Targets

- ✅ Lighthouse Score: 95+
- ✅ First Contentful Paint: < 1.5s
- ✅ Time to Interactive: < 3.5s
- ✅ AI Response: < 5s (Ollama Local)
- ✅ AI Response: < 10s (OpenRouter Cloud)

---

## 🔒 Security

### Uploads
- **File Validation** - Nur PDF, max 10MB
- **Virus Scan** - ClamAV Integration (optional)
- **Content Moderation** - AI prüft auf unangemessene Inhalte

### Payments
- **Stripe** - PCI-DSS konform
- **Webhooks** - Signatur-Verifikation
- **No Card Data** - Niemals Kartendaten speichern

### Privacy
- **Anonyme Uploads** - Keine persönlichen Daten
- **DSGVO** - Europäische Datenschutz-Grundverordnung
- **Kein Tracking** - Privacy-first

---

## 🧪 Testing

```bash
# Unit Tests
npm test

# E2E Tests (Playwright)
npm run test:e2e

# Coverage
npm run test:coverage

# AI Tests (Mock Provider)
npm run test:ai
```

---

## 🚀 Deployment

### Vercel (Frontend + API)

```bash
vercel deploy

# Environment Variables:
# - DATABASE_URL (Neon/Supabase)
# - NEXTAUTH_SECRET
# - STRIPE_SECRET_KEY
# - AI_PROVIDER
# - AI_MODEL
```

### AI Provider

**Ollama (Local)**
```bash
# Auf Server installieren
curl -fsSL https://ollama.com/install.sh | sh

# Model pullen
ollama pull qwen2.5-coder:32b

# Läuft auf http://localhost:11434
```

**OpenRouter (Cloud)**
```bash
# API Key holen: https://openrouter.ai/keys
# Pay-per-Use, sehr günstig
# ~€0.01 pro Klausur-Lösung
```

---

## 📈 Roadmap

### Q2 2026 - MVP ✅
- [x] Upload & Suche
- [x] PDF Viewer
- [x] Stripe Integration
- [ ] AI Features vollständig
- [ ] Mobile App

### Q3 2026 - Growth
- [ ] Referral Programm (Free Month)
- [ ] Gruppen-Rabatte (Lerngruppen)
- [ ] Discord Bot Integration
- [ ] Push Notifications

### Q4 2026 - AI Expansion
- [ ] Voice Explanations (TTS)
- [ ] Personalized Learning Paths
- [ ] Adaptive Quizzes
- [ ] Study Group Matching

---

## 🤝 Contributing

1. Forken
2. Feature Branch (`git checkout -b feature/ai-improvements`)
3. Commiten (`git commit -m 'Improve AI solution quality'`)
4. Pushen (`git push origin feature/ai-improvements`)
5. PR öffnen

---

## 📞 Support

- **Discord:** https://discord.gg/UGkgpRFj
- **Issues:** GitHub Issues
- **Email:** support@kit-study-tools.de

---

## 🙏 Credits

**Built by:** KIT Students for KIT Students  
**AI:** Ollama / OpenRouter  
**License:** MIT  
**Not official:** Keine offizielle KIT-Verbindung

---

**🤖 AI-powered learning for KIT students.**

*Made with ❤️ and 🤖 at KIT*
