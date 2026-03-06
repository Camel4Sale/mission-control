# 🚀 Quickstart Guide

**KIT Study Tools Suite in 5 Minuten starten**

## Voraussetzungen

- Node.js 18+ (`node -v`)
- npm (`npm -v`)
- PostgreSQL (lokal oder Docker)
- Git

## Installation (Alle Plugins)

### 1. Repository klonen
```bash
cd /data/.openclaw/workspace/kit
```

### 2. Plugin installieren & starten

Jedes Plugin ist eigenständig. Wähle eines oder installiere alle:

#### Noten-Spiegel
```bash
cd plugins/noten-spiegel
npm install
cp .env.example .env
# DATABASE_URL in .env anpassen
npx prisma migrate dev
npm run dev
# → http://localhost:3001
```

#### Klausur-AI
```bash
cd plugins/klausur-ai
npm install
cp .env.example .env
# DATABASE_URL, STRIPE_KEY anpassen
npx prisma migrate dev
npm run dev
# → http://localhost:3002
```

#### Lerngruppen-Matcher
```bash
cd plugins/lerngruppen-matcher
npm install
cp .env.example .env
# DATABASE_URL, DISCORD_TOKEN anpassen
npx prisma migrate dev
npm run dev
# → http://localhost:3003
```

#### Praktikums-Board
```bash
cd plugins/praktikums-board
npm install
cp .env.example .env
# DATABASE_URL, STRIPE_KEY anpassen
npx prisma migrate dev
npm run dev
# → http://localhost:3004
```

#### Modul-Empfehler
```bash
cd plugins/modul-empfehler
npm install
cp .env.example .env
# DATABASE_URL anpassen
npx prisma migrate dev
npm run dev
# → http://localhost:3005
```

## PostgreSQL Setup (Docker)

Falls du kein PostgreSQL installiert hast:

```bash
docker run -d \
  --name kit-study-tools-db \
  -e POSTGRES_USER=kit \
  -e POSTGRES_PASSWORD=kit123 \
  -e POSTGRES_DB=kit_tools \
  -p 5432:5432 \
  postgres:15
```

DATABASE_URL für alle Plugins:
```
DATABASE_URL="postgresql://kit:kit123@localhost:5432/kit_tools"
```

## Ports Übersicht

| Plugin | Port |
|--------|------|
| Noten-Spiegel | 3001 |
| Klausur-AI | 3002 |
| Lerngruppen-Matcher | 3003 |
| Praktikums-Board | 3004 |
| Modul-Empfehler | 3005 |

## Environment Variables (Shared)

Diese Variablen werden in den meisten Plugins benötigt:

```env
DATABASE_URL="postgresql://kit:kit123@localhost:5432/kit_tools"
NEXTAUTH_SECRET="dein-geheimer-schluessel-hier"
NEXTAUTH_URL="http://localhost:300X"
```

### Plugin-spezifische Keys

**Klausur-AI & Praktikums-Board:**
```env
STRIPE_SECRET_KEY="sk_test_..."
```

**Lerngruppen-Matcher:**
```env
DISCORD_BOT_TOKEN="..."
DISCORD_GUILD_ID="..."
```

**AI-Features (Klausur-AI, Modul-Empfehler):**
```env
AI_PROVIDER="ollama"  # oder "openrouter"
AI_MODEL="qwen2.5-coder:32b"
```

## Development Tips

### Hot Reload
Alle Plugins unterstützen Next.js Hot Reload. Änderungen an Code werden sofort übernommen.

### Prisma Studio
Database GUI für jedes Plugin:
```bash
npx prisma studio
# → http://localhost:5555
```

### Logs
Next.js Logs zeigen alle Requests und Errors im Terminal.

## Production Build

Für jedes Plugin:
```bash
npm run build
npm run start
```

## Nächste Schritte

1. ✅ Plugins lokal starten
2. ✅ Testdaten eingeben
3. ✅ Discord Bot konfigurieren (Lerngruppen)
4. ✅ Stripe Setup (Klausur-AI, Praktikums)
5. ✅ AI Provider konfigurieren

## Support

- **Discord:** https://discord.gg/UGkgpRFj
- **Issues:** GitHub Issues pro Plugin
- **Docs:** README.md in jedem Plugin-Ordner

---

**Viel Erfolg! 🎓**
