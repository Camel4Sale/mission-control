# 💕 Lerngruppen-Matcher

**"Tinder für Kommilitonen" - Finde deine perfekte Lerngruppe**

## Features

- **Smart Matching** - Nach Modul, Notenschnitt, Verfügbarkeit
- **Discord Integration** - Chat & Voice Channels
- **Gruppen erstellen** - Öffentlich oder privat
- **Termine finden** - Automatische Zeitplanung
- **File-Sharing** - Materialien teilen
- **Bewertungen** - Feedback geben

## Tech Stack

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Discord Bot API
- Socket.io für Realtime
- Calendar Integration

## Installation

```bash
cd lerngruppen-matcher
npm install
cp .env.example .env
# DISCORD_TOKEN, DATABASE_URL setzen
npx prisma migrate dev
npm run dev
```

## API Endpoints

### Profile & Matching
- `GET /api/profile` - Eigenes Profil
- `PUT /api/profile` - Profil aktualisieren
- `GET /api/matches` - Vorschläge bekommen
- `POST /api/matches/:id/swipe` - Liken/Disliken

### Gruppen
- `GET /api/groups` - Alle Gruppen
- `POST /api/groups` - Gruppe erstellen
- `GET /api/groups/:id` - Gruppendetails
- `POST /api/groups/:id/join` - Beitreten
- `POST /api/groups/:id/leave` - Verlassen

### Chat & Termine
- `GET /api/chat/:groupId` - Chat-Historie
- `POST /api/chat/:groupId` - Nachricht senden
- `GET /api/schedule/:groupId` - Termine
- `POST /api/schedule/:groupId` - Termin erstellen

## Datenbank Schema

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  avatar        String?
  modules       String[]
  avgGrade      Float?
  semester      Int
  availability  Json      // {"monday": ["10-12"], ...}
  studyStyle    String    // "early", "night", "mixed"
  bio           String?
  discordId     String?
  createdAt     DateTime  @default(now())
  
  swipes        Swipe[]
  matches       Match[]
  groups        GroupMember[]
}

model Swipe {
  id         String   @id @default(uuid())
  fromUserId String
  toUserId   String
  liked      Boolean
  createdAt  DateTime @default(now())
  
  @@unique([fromUserId, toUserId])
}

model Match {
  id         String   @id @default(uuid())
  user1Id    String
  user2Id    String
  matchedAt  DateTime @default(now())
  chat       Message[]
  
  @@unique([user1Id, user2Id])
}

model Group {
  id          String   @id @default(uuid())
  name        String
  description String?
  moduleId    String
  isPrivate   Boolean  @default(false)
  maxMembers  Int      @default(6)
  discordChannelId String?
  createdAt   DateTime @default(now())
  
  members     GroupMember[]
  messages    Message[]
  events      Event[]
}

model GroupMember {
  id        String   @id @default(uuid())
  groupId   String
  userId    String
  role      String   @default("member") // admin, member
  joinedAt  DateTime @default(now())
  
  @@unique([groupId, userId])
}

model Message {
  id        String   @id @default(uuid())
  groupId   String?
  matchId   String?
  userId    String
  content   String
  createdAt DateTime @default(now())
}

model Event {
  id        String   @id @default(uuid())
  groupId   String
  title     String
  start     DateTime
  end       DateTime
  location  String?
  createdAt DateTime @default(now())
}
```

## Matching Algorithm

```typescript
// Matching Score Berechnung
function calculateMatchScore(user1, user2): number {
  let score = 0;
  
  // Gleiche Module (40%)
  const moduleOverlap = intersection(user1.modules, user2.modules).length;
  score += (moduleOverlap / Math.max(user1.modules.length, user2.modules.length)) * 40;
  
  // Ähnlicher Notenschnitt (20%)
  const gradeDiff = Math.abs(user1.avgGrade - user2.avgGrade);
  score += Math.max(0, 20 - gradeDiff * 10);
  
  // Verfügbarkeit (30%)
  const timeOverlap = calculateTimeOverlap(user1.availability, user2.availability);
  score += timeOverlap * 30;
  
  // Lernstil (10%)
  if (user1.studyStyle === user2.studyStyle) score += 10;
  
  return score;
}
```

## Discord Integration

### Bot Commands
- `/create-group` - Discord Channel erstellen
- `/invite` - Freunde einladen
- `/schedule` - Termin finden
- `/share` - Datei teilen

### Auto-Sync
- Neue Gruppe → Discord Channel
- Member join/leave → Discord Roles
- Events → Discord Calendar

## Design

- **Font:** Fraunces + Plus Jakarta Sans
- **Farbe:** Warm Orange (#f97316) + Pink Akzente
- **Style:** Playful, modern, dating-app vibe
- **Mobile-First** Swipe Interface

## Environment Variables

```env
DATABASE_URL="postgresql://..."
DISCORD_BOT_TOKEN="..."
DISCORD_GUILD_ID="..."
NEXTAUTH_SECRET="..."
```

## Contributing

1. Forken
2. Feature Branch
3. Commiten & Pushen
4. PR öffnen

## License

MIT - Built for KIT Students 🎓
