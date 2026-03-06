# 💼 Praktikums-Board

**Job-Plattform für KIT Studenten mit AI-Matching**

## Features

- **Stellen posten** - Firmen erstellen Listings
- **AI-Matching** - Profil ↔ Stelle automatisch matchen
- **Gehalts-Transparenz** - Alle sehen die Range
- **Bewerbungs-Templates** - Anschreiben generieren
- **Interview-Prep** - AI-Training
- **Provision** - Bei Erfolg (optional)

## Tech Stack

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Stripe Connect (Provision)
- AI: Ollama/OpenRouter
- Email Integration

## Installation

```bash
cd praktikums-board
npm install
cp .env.example .env
# DATABASE_URL, STRIPE_KEY, AI_PROVIDER setzen
npx prisma migrate dev
npm run dev
```

## API Endpoints

### Jobs
- `GET /api/jobs` - Alle Stellen (filterbar)
- `GET /api/jobs/:id` - Job-Details
- `POST /api/jobs` - Stelle erstellen (Firmen)
- `PUT /api/jobs/:id` - Update
- `DELETE /api/jobs/:id` - Löschen

### Bewerbungen
- `POST /api/apply` - Bewerben
- `GET /api/applications` - Meine Bewerbungen
- `GET /api/applications/:id` - Details
- `PUT /api/applications/:id/status` - Status update

### AI Features
- `POST /api/ai/match` - Job-Matching Score
- `POST /api/ai/cover-letter` - Anschreiben generieren
- `POST /api/ai/interview` - Interview Prep
- `POST /api/ai/salary` - Gehalts-Analyse

### Company
- `GET /api/companies` - Alle Firmen
- `GET /api/companies/:id` - Firmen-Profil
- `POST /api/companies` - Firma registrieren

## Datenbank Schema

```prisma
model Job {
  id          String   @id @default(uuid())
  companyId   String
  title       String
  description String   @db.Text
  location    String
  remote      Boolean  @default(false)
  salaryMin   Int?
  salaryMax   Int?
  type        String   // "internship", "working_student", "thesis"
  duration    Int?     // Monate
  start       DateTime?
  requirements String[]
  benefits    String[]
  applicationDeadline DateTime?
  isActive    Boolean  @default(true)
  views       Int      @default(0)
  applications Int     @default(0)
  createdAt   DateTime @default(now())
  
  company     Company  @relation(fields: [companyId], references: [id])
  applications Application[]
}

model Company {
  id          String   @id @default(uuid())
  name        String
  description String?
  website     String
  logoUrl     String?
  industry    String
  size        String   // "1-10", "11-50", etc.
  verified    Boolean  @default(false)
  stripeAccountId String?
  createdAt   DateTime @default(now())
  
  jobs        Job[]
}

model Student {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  avatar    String?
  cvUrl     String?
  modules   String[]
  avgGrade  Float?
  semester  Int
  skills    String[]
  interests String[]
  preferredLocation String?
  preferredType String?
  availability DateTime?
  createdAt DateTime @default(now())
  
  applications Application[]
}

model Application {
  id        String   @id @default(uuid())
  jobId     String
  studentId String
  coverLetter String?
  cvUrl     String?
  status    String   @default("pending") // pending, reviewed, interview, offer, rejected
  matchScore Float?
  aiGenerated Boolean @default(false)
  createdAt DateTime @default(now())
  
  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  @@unique([jobId, studentId])
}

model InterviewPrep {
  id        String   @id @default(uuid())
  studentId String
  jobId     String?
  questions Json     // AI-generierte Fragen
  answers   Json?    // User-Antworten
  feedback  String?  // AI-Feedback
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

## AI Features

### Job Matching
```typescript
POST /api/ai/match
{
  "studentId": "uuid",
  "jobId": "uuid"
}

Response:
{
  "score": 0.87,
  "strengths": ["Passende Skills", "Gute Noten"],
  "gaps": ["Fehlende Erfahrung"],
  "recommendation": "Bewerben!"
}
```

### Anschreiben generieren
```typescript
POST /api/ai/cover-letter
{
  "studentId": "uuid",
  "jobId": "uuid",
  "tone": "formal" // oder "casual"
}

Response:
{
  "coverLetter": "Sehr geehrte Damen und Herren...",
  "highlights": ["Betont relevante Projekte", "Erwähnt KIT"]
}
```

### Interview Prep
```typescript
POST /api/ai/interview
{
  "jobId": "uuid",
  "studentId": "uuid"
}

Response:
{
  "questions": [
    {"question": "Warum wollen Sie hier arbeiten?", "category": "motivation"},
    {"question": "Erklären Sie Projekt X", "category": "technical"}
  ],
  "tips": ["Übe STAR-Methode", "Forsch die Firma"]
}
```

## Provision Model

- **Free:** Studenten bewerben sich kostenlos
- **Company:** Firmen zahlen bei Erfolg (5-10% vom Monatsgehalt)
- **Stripe Connect:** Automatische Abrechnung

## Design

- **Font:** Fraunces + Plus Jakarta Sans
- **Farbe:** Warm Orange (#f97316) + Professional Blue
- **Style:** Clean, vertrauenswürdig, modern
- **Mobile-First**

## Environment Variables

```env
DATABASE_URL="postgresql://..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXTAUTH_SECRET="..."
AI_PROVIDER="ollama"
```

## Contributing

1. Forken
2. Feature Branch
3. Commiten & Pushen
4. PR öffnen

## License

MIT - Built for KIT Students 🎓
