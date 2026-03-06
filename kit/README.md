# 🎓 KIT Study Tools Suite

**Komplette Student-Tools für KIT Master als modulare Suite**

Eine Sammlung von 5 Plugins, die das Studium am KIT besser machen - von Noten-Tracking bis Karriere-Planning.

## 🚀 Die 5 Plugins

### 1. 📊 [Noten-Spiegel Community](./plugins/noten-spiegel/)
**Anonyme Noten-Plattform für Transparenz**

- Noten uploaden (anonym)
- Modulschnitte berechnen
- Ranking pro Modul
- Semester-Vergleiche
- Dozenten-Bewertungen
- Schwierigkeits-Rating
- CSV/PDF Export

**Tech:** Next.js 14, Prisma, PostgreSQL, Recharts

---

### 2. 🤖 [Klausur-AI](./plugins/klausur-ai/)
**AI-gestützte Altklausur-Sammlung**

- Altklausur-Sammlung
- AI-Lösungen generieren
- Schritt-für-Schritt Erklärungen
- Similarity-Check (Plagiate)
- Upload-Portal
- Volltext-Suche
- **Premium: €5/Monat**

**Tech:** Next.js 14, Stripe, AI (Ollama/OpenRouter), PDF.js

---

### 3. 💕 [Lerngruppen-Matcher](./plugins/lerngruppen-matcher/)
**"Tinder für Kommilitonen"**

- Matching nach Modul, Notenschnitt, Zeit
- Discord Integration
- Gruppen erstellen
- Termine finden
- File-Sharing
- Bewertungen

**Tech:** Next.js 14, Discord.js, Socket.io, Framer Motion

---

### 4. 💼 [Praktikums-Board](./plugins/praktikums-board/)
**Job-Plattform mit AI-Matching**

- Firmen posten Stellen
- Studenten bewerben sich
- AI-Matching (Profil ↔ Stelle)
- Gehalts-Transparenz
- Bewerbungs-Templates
- Interview-Prep
- Provision bei Erfolg

**Tech:** Next.js 14, Stripe Connect, AI, Resend (Email)

---

### 5. 🎯 [Modul-Empfehler](./plugins/modul-empfehler/)
**KI-basierte Studienplanung**

- KI-Empfehlungen
- Pflichtbereich-Checker (BWL 18, VWL 6, etc.)
- Interessen-basiert
- Karriere-Pfade (Consulting, Tech, Finance)
- Alumni-Empfehlungen
- Workload-Schätzung
- Optimaler Studienplan

**Tech:** Next.js 14, AI, Recharts, QMD

---

## 🎨 Design System

**Einheitliches Design über alle Plugins:**

- **Fonts:** Fraunces (Display) + Plus Jakarta Sans (Body)
- **Primary Color:** Warm Orange (#f97316)
- **Style:** Organic, weich, elegant
- **Approach:** Mobile-First
- **Components:** Tailwind CSS + shadcn/ui Patterns

### Farbpalette
```
Primary: #f97316 (Orange)
Secondary: Platform-specific
Background: Warm White
Text: Charcoal #1a1a1a
```

---

## 🛠️ Tech Stack (Shared)

Alle Plugins teilen sich:

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js
- **AI:** Ollama / OpenRouter
- **Icons:** Lucide React
- **Utils:** class-variance-authority, clsx, tailwind-merge

---

## 📦 Installation (All Plugins)

Jedes Plugin ist eigenständig installierbar:

```bash
cd plugins/<plugin-name>
npm install
cp .env.example .env
# Environment Variables setzen
npx prisma migrate dev
npm run dev
```

### Shared Environment Variables
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/kit_tools"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
AI_PROVIDER="ollama"  # oder "openrouter"
```

---

## 📚 Community

### Guidelines
Siehe [COMMUNITY-GUIDELINES.md](./COMMUNITY-GUIDELINES.md)

### Discord
Join our community: https://discord.gg/UGkgpRFj

### Contributing
1. Forken
2. Feature Branch (`git checkout -b feature/amazing`)
3. Commiten (`git commit -m 'Add amazing feature'`)
4. Pushen (`git push origin feature/amazing`)
5. PR öffnen

---

## 🗺️ Roadmap

### Phase 1: MVP (Q2 2026)
- [x] Alle 5 Plugins grundlegend
- [ ] Authentication überall
- [ ] Database Schemas final
- [ ] Basic UI/UX

### Phase 2: Integration (Q3 2026)
- [ ] Single Sign-On über alle Plugins
- [ ] Shared Dashboard
- [ ] Cross-Plugin Features
- [ ] Discord Bot Integration

### Phase 3: AI Features (Q4 2026)
- [ ] Klausur-AI Premium
- [ ] Modul-Empfehler KI
- [ ] Praktikums-AI-Matching
- [ ] Interview-Prep AI

### Phase 4: Scale (2027)
- [ ] Andere Unis (TUM, RWTH, etc.)
- [ ] Mobile Apps (iOS/Android)
- [ ] Premium Features
- [ ] Partnerschaften

---

## 📊 Architecture

```
kit/
├── plugins/
│   ├── noten-spiegel/       # Noten-Tracking
│   ├── klausur-ai/          # Altklausuren + AI
│   ├── lerngruppen-matcher/ # Dating für Studenten
│   ├── praktikums-board/    # Job-Plattform
│   └── modul-empfehler/     # Studienplanung
├── shared/                  # (Future) Shared Components
├── COMMUNITY-GUIDELINES.md
└── README.md
```

---

## 💰 Monetarisierung

| Plugin | Free | Premium |
|--------|------|---------|
| Noten-Spiegel | ✅ Alle Features | - |
| Klausur-AI | Basis | €5/mo (AI) |
| Lerngruppen | ✅ Alle Features | - |
| Praktikums | ✅ Bewerben | - (Firmen zahlen Provision) |
| Modul-Empfehler | ✅ Alle Features | - |

**Prinzip:** Core-Features kostenlos für Studenten, Premium nur für AI-Features, Firmen zahlen Provision.

---

## 🔒 Security & Privacy

- **Anonymität:** Noten und Bewertungen standardmäßig anonym
- **DSGVO:** Europäische Datenschutz-Grundverordnung
- **Data Minimization:** Nur notwendige Daten speichern
- **Encryption:** Alle sensiblen Daten verschlüsselt
- **No Tracking:** Keine Third-Party Tracker

---

## 📞 Support

- **Discord:** https://discord.gg/UGkgpRFj
- **Email:** support@kit-study-tools.de
- **GitHub Issues:** Pro Plugin

---

## 🙏 Credits

**Built by:** KIT Students for KIT Students  
**License:** MIT  
**Not official:** Keine offizielle KIT-Verbindung

---

**🎓 Viel Erfolg im Studium!**

*Made with ❤️ and ☕ at KIT*
