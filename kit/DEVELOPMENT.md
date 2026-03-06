# 🛠️ Development Guide

**Technische Dokumentation für Contributors**

## Architektur-Übersicht

```
kit/
├── plugins/                    # 5 eigenständige Next.js Apps
│   ├── noten-spiegel/         # Port 3001 - Orange Theme
│   ├── klausur-ai/            # Port 3002 - Blue Theme
│   ├── lerngruppen-matcher/   # Port 3003 - Pink Theme
│   ├── praktikums-board/      # Port 3004 - Emerald Theme
│   └── modul-empfehler/       # Port 3005 - Violet Theme
├── shared/                     # (Future) Shared Components
├── docs/                       # (Future) Zentrale Docs
└── README.md
```

## Tech Stack Details

### Core Technologies

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3
- Framer Motion (Animations)

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth.js

**AI:**
- Ollama (lokal) oder OpenRouter
- AI SDK (Vercel)
- Embeddings für Search

**Infrastruktur:**
- Docker (PostgreSQL)
- Stripe (Payments)
- Discord.js (Bot Integration)
- Resend (Email)

## Design System

### Fonts
```typescript
// Alle Plugins nutzen dieselben Fonts
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Headings nutzen Fraunces (wird in globals.css geladen)
```

### Colors

Jedes Plugin hat eine eigene Primary Color:

| Plugin | Color | Hex |
|--------|-------|-----|
| Noten-Spiegel | Orange | #f97316 |
| Klausur-AI | Blue | #3b82f6 |
| Lerngruppen-Matcher | Pink | #ec4899 |
| Praktikums-Board | Emerald | #059669 |
| Modul-Empfehler | Violet | #7c3aed |

### Border Radius
```typescript
// Einheitlich in allen Plugins
borderRadius: {
  'xl': '1rem',    // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem',   // 32px
}
```

## Datenbank Schemas

### Noten-Spiegel

```prisma
Grade, Professor, ModuleStats
```

**Wichtige Indizes:**
- `moduleId` für schnelle Modulsuche
- `semester` für Historie

### Klausur-AI

```prisma
Exam, Solution, PremiumUser, Upload, SearchIndex
```

**Wichtige Features:**
- Full-Text Search über `SearchIndex`
- Stripe Integration für Premium
- AI-Embeddings für Similarity

### Lerngruppen-Matcher

```prisma
User, Swipe, Match, Group, GroupMember, Message, Event
```

**Wichtige Features:**
- Discord Sync über Webhooks
- Realtime Chat mit Socket.io
- Matching Algorithmus

### Praktikums-Board

```prisma
Company, Job, Student, Application, InterviewPrep
```

**Wichtige Features:**
- Stripe Connect für Provision
- AI-Matching Score
- Email Templates

### Modul-Empfehler

```prisma
Module, Review, User, StudyPlan, CareerPath, Recommendation, AlumniData
```

**Wichtige Features:**
- Pflichtbereich-Tracking
- AI-Empfehlungen
- Alumni-Datenbank

## API Design Patterns

### RESTful Endpoints

```typescript
// GET Collection
GET /api/resource          // Alle Resources
GET /api/resource/:id      // Einzelne Resource
GET /api/resource/search   // Suche mit Query-Params

// POST Create
POST /api/resource
{
  "field1": "value",
  "field2": "value"
}

// PUT Update
PUT /api/resource/:id
{
  "field1": "updated"
}

// DELETE
DELETE /api/resource/:id
```

### Response Format

```typescript
// Success
{
  "data": {...},
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}

// Error
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### Authentication

```typescript
// NextAuth Session prüfen
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Continue...
}
```

## AI Integration

### Ollama Setup

```typescript
// lib/ai.ts
import { createOllama } from 'ollama-ai-provider';

const ollama = createOllama({
  baseURL: 'http://localhost:11434/api',
});

export const chatModel = ollama('qwen2.5-coder:32b');
```

### AI Lösung generieren

```typescript
// app/api/ai/solve/route.ts
import { streamText } from 'ai';
import { chatModel } from '@/lib/ai';

export async function POST(req: Request) {
  const { exam, question } = await req.json();
  
  const result = streamText({
    model: chatModel,
    prompt: `Löse diese Klausuraufgabe Schritt für Schritt:
    
    Modul: ${exam.moduleName}
    Aufgabe: ${question}
    
    Erkläre jeden Schritt detailliert.`,
  });
  
  return result.toDataStreamResponse();
}
```

### Matching Algorithmus

```typescript
// lib/matching.ts
export function calculateMatchScore(student, job): number {
  let score = 0;
  
  // Skills Match (40%)
  const skillOverlap = intersection(
    student.skills,
    job.requirements
  ).length;
  score += (skillOverlap / job.requirements.length) * 40;
  
  // Noten Match (20%)
  if (job.gradeRequirement && student.avgGrade) {
    const gradeDiff = student.avgGrade - job.gradeRequirement;
    score += Math.max(0, 20 - gradeDiff * 10);
  }
  
  // Interessen Match (30%)
  const interestOverlap = intersection(
    student.interests,
    job.tags
  ).length;
  score += (interestOverlap / Math.max(student.interests.length, 1)) * 30;
  
  // Location Match (10%)
  if (student.preferredLocation === job.location) {
    score += 10;
  }
  
  return score;
}
```

## Testing

### Jest Setup

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Example Test

```typescript
// __tests__/page.test.tsx
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
```

## Deployment

### Docker Setup

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  noten-spiegel:
    build: ./plugins/noten-spiegel
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=postgresql://...
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=kit
      - POSTGRES_PASSWORD=kit123
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Vercel Deployment

```bash
# vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## Contributing Guidelines

### Branch Naming

```
feature/add-grade-upload
bugfix/fix-matching-algorithm
docs/update-api-docs
refactor/database-schema
```

### Commit Messages

```
feat: add grade upload functionality
fix: resolve matching score calculation bug
docs: update API documentation
style: improve button hover states
refactor: simplify database queries
test: add unit tests for matching
```

### Pull Request Template

```markdown
## Description
What does this PR do?

## Changes
- [ ] Feature A
- [ ] Bugfix B
- [ ] Tests C

## Testing
How to test this PR?

## Screenshots
(if applicable)
```

## Performance Optimization

### Database

- Indizes auf häufig abgefragten Feldern
- Pagination bei großen Collections
- Caching mit Redis (optional)

### Frontend

- Next.js Image Optimization
- Lazy Loading für Components
- Code Splitting pro Route

### API

- Rate Limiting
- Response Caching
- Compression (gzip)

## Security

### Best Practices

- Environment Variables nie committen
- SQL Injection Prevention (Prisma ORM)
- XSS Protection (Next.js default)
- CSRF Tokens (NextAuth)
- Rate Limiting für API Endpoints

### Environment Variables

```env
# NIEMALS committen!
DATABASE_URL="..."
NEXTAUTH_SECRET="..."
STRIPE_SECRET_KEY="..."
DISCORD_TOKEN="..."
```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
lsof -ti:3001 | xargs kill
```

**Prisma Migration Error:**
```bash
npx prisma migrate reset
npx prisma migrate dev
```

**Next.js Cache:**
```bash
rm -rf .next
npm run dev
```

**Node Modules:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Discord.js Guide](https://discordjs.guide/)
- [Stripe Docs](https://stripe.com/docs)

---

**Happy Coding! 🚀**
