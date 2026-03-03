# MEMORY.md - Molty's Long-Term Memory

## Identity

- **Name:** Molty 🧊
- **Role:** Personal AI Assistant
- **Vibe:** Locker, direkt, manchmal witzig
- **Language:** Deutsch
- **Timezone:** Europe/Berlin (MEZ)

## User

- Access: Public via Hostinger VPS
- Communication: Webchat (this session)
- Prefers: "du" (informal)

## Key Dates

- **2026-03-03:** Onboarding completed
  - Security audit: Fixed 3 critical issues
  - Tools: gh, yt-dlp installed
  - Skills: weather, himalaya, github, healthcheck, summarize, coding-agent pending

- **2026-03-03 (Abend):** Life OS & Mission Control deployed
  - 16 Pages total (8 Life OS + 8 Mission Control)
  - KIT Module: module, klausuren, thesis, noten
  - Unternehmen: pathium, celaris, elysium
  - Mission Control: calendar, docs, memory, office, projects, tasks, team
  - Skills: qmd-skill, model-usage added

## Security

- Gateway secured (device auth enabled)
- Access via public internet

## Cron Jobs

- **weather-karlsruhe**: Täglich 9:00 Uhr (MEZ) – Wetter für Karlsruhe
- **morning-reminder**: Täglich 9:00 Uhr (MEZ) – Morgengruss

### Mission Control Optimierungen (22:11)
- Command Palette hinzugefügt (Cmd+K)
- Shortcuts: G+T (Tasks), G+C (Calendar), G+P (Projects), G+M (Memory), G+D (Docs)
- Sidebar Shortcuts angezeigt

### Mission Control Optimierungen (22:18)
- **TopBar** mit Theme Toggle, Clock, Online-Status
- **Quick Add** Button (⌘N) - Tasks, Notes, Events, Memories erstellen
- **Dark/Light Mode** mit persistenter Speicherung
- **Keyboard Shortcuts** Modal (⌘/)
- **Animations**: fadeIn, slideUp, pulse
- **System Status** Indicator

### Life OS Optimierungen (22:24)
- **TopBar**: Theme Toggle, Clock, Search (⌘K), Online-Status
- **Navigation Shortcuts**: G+H (Home), G+M (Module), G+K (Klausur), G+T (Thesis), G+N (Noten), G+P/C/E (Companies)
- **Quick Add** (⌘N): Module, Klausuren, Notes, Tasks, Companies
- **Dark/Light Mode**: persistent via localStorage
- **Keyboard Shortcuts** Modal (⌘/)
- **Animations**: fadeIn, slideUp, pulse
- **daily-briefing**: Täglich 8:00 Uhr – Wetter + Termine + Tasks
- **git-auto-commit**: Täglich 20:00 Uhr – Workspace sichern
- **weekly-summary**: Sonntag 18:00 Uhr – Wochenrückblick
- **security-audit**: Sonntag 2:00 Uhr – Sicherheitsprüfung
- **disk-usage-alert**: Täglich 6:00 Uhr – Speicherplatz-Check
- **uptime-check**: Alle 15 Min – Server-Status
- **skill-updates**: Montag 10:00 Uhr – Neue Skills finden

## TODO

- ~~Configure GitHub auth (gh auth login)~~
- ~~Test coding-agent with Codex~~

## Deployed Apps

- **Life OS** (Port 3002): `/`, `/studium/*`, `/unternehmen/*`
- **Mission Control** (Port 3001): `/`, `/calendar`, `/docs`, `/memory`, `/office`, `/projects`, `/tasks`, `/team`
