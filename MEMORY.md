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

## TODO

- ~~Configure GitHub auth (gh auth login)~~
- ~~Test coding-agent with Codex~~

## Deployed Apps

- **Life OS** (Port 3002): `/`, `/studium/*`, `/unternehmen/*`
- **Mission Control** (Port 3001): `/`, `/calendar`, `/docs`, `/memory`, `/office`, `/projects`, `/tasks`, `/team`
