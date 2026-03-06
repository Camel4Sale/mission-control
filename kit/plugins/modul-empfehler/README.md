# 🎯 Modul-Empfehler

**KI-basierte Studienplanung für KIT Master**

## Features

- **KI-Empfehlungen** - Personalisierte Modulvorschläge
- **Pflichtbereich-Checker** - BWL 18 ECTS, VWL 6 ECTS, etc.
- **Interessen-basiert** - Nach Karrierezielen
- **Karriere-Pfade** - Consulting, Tech, Finance, etc.
- **Alumni-Empfehlungen** - Was haben andere genommen?
- **Workload-Schätzung** - Realistische Planung
- **Optimaler Studienplan** - Semester-für-Semester

## Tech Stack

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- AI: Ollama/OpenRouter
- QMD für Local Search
- Graph-Database (Neo4j optional)

## Installation

```bash
cd modul-empfehler
npm install
cp .env.example .env
# DATABASE_URL, AI_PROVIDER setzen
npx prisma migrate dev
npm run dev
```

## API Endpoints

### Module
- `GET /api/modules` - Alle Module
- `GET /api/modules/:id` - Modul-Details
- `GET /api/modules/search` - Suche mit Filtern

### Empfehlungen
- `POST /api/recommend` - Personalisierte Empfehlungen
- `GET /api/recommend/:userId` - Gespeicherte Empfehlungen
- `POST /api/recommend/feedback` - Feedback geben

### Studienplan
- `POST /api/study-plan` - Optimalen Plan erstellen
- `GET /api/study-plan/:userId` - Eigenen Plan abrufen
- `PUT /api/study-plan/:userId` - Plan anpassen

### Karriere
- `GET /api/career-paths` - Alle Karriere-Pfade
- `GET /api/career-paths/:id` - Pfad-Details
- `POST /api/career-paths/:id/track` - Fortschritt tracken

## Datenbank Schema

```prisma
model Module {
  id          String   @id @default(uuid())
  code        String   @unique // z.B. "WIWI-001"
  name        String
  description String   @db.Text
  ects        Int
  semester    Int      // Empfohlenes Semester
  area        String   // "BWL", "VWL", "Tech", "Soft Skills"
  workload    Int      // Stunden/Woche
  difficulty  Int      // 1-5
  language    String   // "de", "en"
  professor   String?
  prerequisites String[]
  topics      String[]
  createdAt   DateTime @default(now())
  
  reviews     Review[]
  recommendations Recommendation[]
}

model Review {
  id        String   @id @default(uuid())
  moduleId  String
  userId    String
  rating    Int      // 1-5
  workload  Int      // 1-5
  difficulty Int     // 1-5
  comment   String?
  semester  String   // "SS24", "WS23"
  createdAt DateTime @default(now())
  
  module    Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  program   String   // "M.Sc. WIWI", "M.Sc. Informatik"
  semester  Int
  interests String[]
  careerGoals String[]
  completedModules String[]
  createdAt DateTime @default(now())
  
  studyPlan StudyPlan?
  recommendations Recommendation[]
}

model StudyPlan {
  id        String   @id @default(uuid())
  userId    String   @unique
  semesters Json     // [{semester: 1, modules: ["id1", "id2"]}]
  totalEcts Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CareerPath {
  id          String   @id @default(uuid())
  name        String
  description String
  modules     String[] // Empfohlene Module
  skills      String[]
  companies   String[] // Typische Arbeitgeber
  avgSalary   Int?
  createdAt   DateTime @default(now())
  
  recommendations Recommendation[]
}

model Recommendation {
  id        String   @id @default(uuid())
  userId    String?
  moduleId  String
  careerPathId String?
  score     Float
  reason    String
  source    String   // "ai", "alumni", "required"
  createdAt DateTime @default(now())
  
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  module    Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  careerPath CareerPath? @relation(fields: [careerPathId], references: [id])
}

model AlumniData {
  id        String   @id @default(uuid())
  program   String
  graduationYear Int
  modules   String[]
  thesis    String?
  currentJob String?
  company   String?
  salary    Int?
  createdAt DateTime @default(now())
}
```

## AI Features

### Modul-Empfehlung
```typescript
POST /api/recommend
{
  "userId": "uuid",
  "completedModules": ["WIWI-001", "WIWI-002"],
  "interests": ["Finance", "Data Science"],
  "careerGoal": "Investment Banking"
}

Response:
{
  "recommendations": [
    {
      "module": "WIWI-015",
      "name": "Corporate Finance",
      "score": 0.95,
      "reason": "Perfekt für Investment Banking, 87% der Alumni empfehlen",
      "ects": 6,
      "workload": 8
    }
  ],
  "missingRequirements": ["Noch 3 ECTS VWL nötig"]
}
```

### Studienplan-Generator
```typescript
POST /api/study-plan
{
  "userId": "uuid",
  "program": "M.Sc. WIWI",
  "preferences": {
    "workload": "balanced",
    "focus": "Finance"
  }
}

Response:
{
  "plan": {
    "semester1": {
      "modules": ["WIWI-001", "WIWI-002", "WIWI-003"],
      "ects": 24,
      "workload": "medium"
    },
    "semester2": {...}
  },
  "totalEcts": 120,
  "feasibility": "realistic"
}
```

### Pflichtbereich-Checker
```typescript
GET /api/requirements/check/:userId

Response:
{
  "BWL": {"required": 18, "completed": 12, "remaining": 6},
  "VWL": {"required": 6, "completed": 6, "remaining": 0},
  "Tech": {"required": 12, "completed": 0, "remaining": 12},
  "SoftSkills": {"required": 6, "completed": 3, "remaining": 3},
  "thesis": {"required": 24, "completed": 0, "remaining": 24}
}
```

## Karriere-Pfade

### Consulting
- **Module:** Strategy, Operations, Case Study
- **Skills:** Problem Solving, Presentation
- **Companies:** MBB, Big4, Boutiques
- **Avg Salary:** €65-85k

### Tech
- **Module:** Data Science, ML, Software Engineering
- **Skills:** Python, SQL, Cloud
- **Companies:** FAANG, Startups
- **Avg Salary:** €70-95k

### Finance
- **Module:** Corporate Finance, Valuation, Accounting
- **Skills:** Financial Modeling, Excel
- **Companies:** IB, PE, VC
- **Avg Salary:** €80-120k

## Design

- **Font:** Fraunces + Plus Jakarta Sans
- **Farbe:** Warm Orange (#f97316) + Academic Blue
- **Style:** Clean, akademisch, modern
- **Mobile-First**

## Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
AI_PROVIDER="ollama"
AI_MODEL="qwen2.5-coder:32b"
```

## Contributing

1. Forken
2. Feature Branch
3. Commiten & Pushen
4. PR öffnen

## License

MIT - Built for KIT Students 🎓
