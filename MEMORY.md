# MEMORY.md - Molty's Long-Term Memory

## Identity

- **Name:** Molty 🧊
- **Role:** Personal AI Assistant
- **Vibe:** Locker, direkt, manchmal witzig
- **Language:** Deutsch
- **Timezone:** Europe/Berlin (MEZ)

## User

- **Name:** Jan Herrmann
- **Access:** Public via Hostinger VPS (187.124.8.94)
- **Communication:** Telegram, Discord
- **Prefers:** "du" (informal)
- **Background:** KIT WiIng Master Student

## Key Dates

- **2026-03-03:** Onboarding completed
  - Security audit: Fixed 3 critical issues
  - Tools: gh, yt-dlp installed
  - Skills: weather, himalaya, github, healthcheck

- **2026-03-04:** Major Expansion Day
  - GitHub Repositories erstellt: Camel4Sale/mission-control, Camel4Sale/life-os
  - KIT Modul-Planer mit echten Studienanforderungen
  - Study Hub mit Focus Timer, Flashcards, Notes
  - Datenbanken (Table/Board View)
  - OpenClaw Status Dashboard
  - Autonome Cron-Jobs erweitert (email-check, calendar-check, task-reminder, github-check)
  - UI/UX Optimierungen für beide Apps
  - **AgentMail integriert** - E-Mail: frailyouth829@agentmail.to
  - **qmd installiert** - Local Search Engine
  - **agent-browser installiert** - Vercel Browser Automation
  - **Discord Bot aktiviert** - Server: https://discord.gg/UGkgpRFj
  - **Discord Skill installiert** - Erweiterte Discord-Features
  - **frontend-design Skill** - Besseres UI/UX
  - **Answer Overflow** - Discord-Suche für Coding-Probleme
  - **FreeRide** - wartet auf OpenRouter API Key
  - **nano-pdf** - PDF Editing

---

## 📚 Life OS - Complete Structure

### Studium (/studium/*)
- **module/** - KIT Module mit Details
- **klausuren/** - Klausuren-Tracking
- **noten/** - Noten-Verwaltung
- **thesis/** - Masterarbeit Tracking
- **planer/** - KIT Modul-Planer mit Drag & Drop, ECTS-Counter, Mindestanforderungen
- **study/** - Study Hub (Focus Timer, Flashcards, Quick Notes)
- **datenbank/** - Notion-ähnliche Datenbanken
- **kalender/** - Kalender

### Unternehmen (/unternehmen/*)
- **celaris/** - Solar Unternehmen (in Entwicklung)
- **elysium/** - Immobilien Unternehmen (in Entwicklung)
- **pathium/** - Software Unternehmen (in Entwicklung)

### Docs (/docs/*)
- **notizen/** - Wiki/Notizen-System

### Celaris Website
- Kommt in /celaris (Next.js App)

---

## 🎯 Mission Control - Complete Structure

### Screens
- **Tasks** - Kanban mit Drag & Drop, Filter, localStorage
- **Calendar** - Full Calendar, Termine erstellen
- **Projects** - Projekt-Manager mit Meilensteinen
- **Memory** - Wissensdatenbank
- **Docs** - Dokumentation
- **Team** - Team-Manager mit Rollen
- **Office** - Document Hub
- **OpenClaw** - Status Dashboard (Cron Jobs, Skills, Prozesse)
- **Agents** - Agent Management (in Entwicklung)
- **Gateways** - Gateway Management (in Entwicklung)
- **Activity** - Activity Timeline (in Entwicklung)

### Features
- Command Palette (Cmd+K)
- Quick Add (⌘N)
- Dark/Light Mode
- Keyboard Shortcuts
- localStorage Persistenz

---

## 🔄 Proaktive & Autonome Jobs

### Aktive Jobs
| Job | Zeit | Funktion |
|-----|------|----------|
| morning-reminder | 9:00 | Morgengruß |
| weather-karlsruhe | 9:00 | Wetter für Karlsruhe |
| daily-briefing | 8:00 | Wetter + Termine + Tasks |
| email-check | 10:00, 16:00 | E-Mails via AgentMail |
| calendar-check | 8:00, 14:00, 18:00 | Termine & Erinnerungen |
| task-reminder | 9:00, 15:00 | Deadlines & überfällige Tasks |
| github-check | 11:00, 17:00 | PRs, Issues, Activity |
| git-auto-commit | 20:00 | Workspace sichern |
| weekly-summary | So 18:00 | Wochenrückblick |
| security-audit | So 2:00 | Sicherheitsprüfung |
| disk-usage | 6:00 | Speicherplatz-Check |
| uptime-check | alle 15 Min | Server-Status |
| skill-updates | Mo 10:00 | Neue Skills finden |

---

## 🛠️ Technical Setup

### Docker Container
- **Image:** ghcr.io/hostinger/hvps-openclaw:latest
- **Name:** openclaw-yede-openclaw-1
- **Ports:** 3001 (Mission Control), 3002 (Life OS), 41672 (Gateway)
- **Environment:** GH_TOKEN für GitHub Access

### GitHub
- **Account:** Camel4Sale
- **Repos:**
  - https://github.com/Camel4Sale/mission-control
  - https://github.com/Camel4Sale/life-os
  - https://github.com/abhi1693/openclaw-mission-control (geklont als Referenz)

---

## 🧰 Tools & Skills

### E-Mail (AgentMail)
- **Inbox:** frailyouth829@agentmail.to
- **API Key:** konfiguriert in .env.agentmail
- **Kann:** E-Mails senden/empfangen

### Local Search (qmd)
- **Status:** Installiert und indexiert (37 Files)
- **Befehle:**
  - `qmd search "query"` - Keyword Search
  - `qmd vsearch "query"` - Semantic Search
  - `qmd query "query"` - Hybrid Search
  - `qmd get "path"` - Dokument abrufen

### Browser Automation (agent-browser)
- **Status:** Installiert (Chromium)
- **Befehle:**
  - `agent-browser open <url>` - Öffnen
  - `agent-browser snapshot` - Accessibility Tree
  - `agent-browser click @e2` - Klicken per Ref

### Discord
- **Bot Token:** Konfiguriert
- **Server:** https://discord.gg/UGkgpRFj
- **Features:** Messages, Reactions, Polls, Threads, Search

### Frontend Design
- **Skill:** frontend-design installiert
- **Prinzip:** BOLD aesthetics, kein "AI Slop"
- **Anwendung:** Alle zukünftigen UI-Projekte

### PDF Editing
- **Tool:** nano-pdf installiert

### Answer Overflow
- **Nutzung:** `web_search "site:answeroverflow.com ..."`

---

## 🎓 KIT Master Wissenswertes

### Studienplan (90 ECTS + 30 Masterarbeit)
- BWL: min. 18 ECTS
- VWL: min. 6 ECTS
- Informatik: min. 6 ECTS
- Operations Research: min. 6 ECTS
- Ingenieurwissenschaften: min. 6 ECTS
- Wahlpflicht: Rest bis 90 ECTS

---

## 🤖 Self-Improvement Learnings

1. **Agenten parallelisieren** - Mehrere Sub-Agents gleichzeitig sparen Zeit
2. **Git Push via Token** - Remote URL mit Token funktioniert sicher
3. **QMD für Memory** - Lokale Suche mit Embeddings
4. **agent-browser** - Bessere Browser-Automation
5. **Skills via ClawHub** - Schnelle Installation neuer Fähigkeiten
6. **Discord Bot** - Multi-Channel Kommunikation
7. **Frontend Design** - Distinctive aesthetics over generic AI slop

---

## TODO

- [ ] Mission Control Features (Agents, Gateways, Activity) fertigstellen
- [ ] Celaris Website deployen
- [ ] OpenRouter API Key für FreeRide
- [ ] Alle Apps mit neuem Frontend Design aufhübschen

---

## Deployed Apps

- **Life OS** (Port 3002): `/`, `/studium/*`, `/unternehmen/*`, `/docs/*`
- **Mission Control** (Port 3001): `/`, `/calendar`, `/docs`, `/memory`, `/office`, `/projects`, `/tasks`, `/team`, `/openclaw`

---

- **2026-03-06:** Level 10 Autonomie aktiviert
  - AUTONOMY.md erstellt – Vollmacht für autonomes Arbeiten
  - GitHub-Optimierung abgeschlossen (alle 7 Repos)
  - Mandat: Neue Projekte, Features, Optimierungen ohne Rückfrage
  - Fokus: Monetarisierung, Studium, Infrastruktur, Experimente
  - Prinzip: "Niemals fertig" – immer weiter optimieren

---

*Last Updated: 2026-03-06 07:46*
