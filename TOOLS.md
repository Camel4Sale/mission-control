# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## Discord Bot
- **Server:** https://discord.gg/UGkgpRFj
- **Bot Token:** Konfiguriert in openclaw.json
- **Features:** Messages, Reactions, Polls, Threads, Search

## E-Mail (AgentMail)
- **Inbox:** frailyouth829@agentmail.to
- **Nutzung:** `himalaya` CLI

## Browser Automation
- **Tool:** agent-browser
- **Befehle:** open, snapshot, click, fill, screenshot

## PDF Editing
- **Tool:** nano-pdf
- **Befehle:** `nano-pdf edit <file> <page> "<instruction>"`

## AI Models
- **FreeRide:** Wartet auf OpenRouter API Key
- **Aktuelles Model:** minimax-m2.5:cloud

## ClawHub Skills
- discord, frontend-design, answeroverflow, free-ride, nano-pdf
- weather, himalaya, github, healthcheck
- **self-improving-agent** - Lernt aus Fehlern & korrekturen (`.learnings/`)

## Cron Delivery Rules (Multi-Channel)

⚠️ **WICHTIG** - Bei Multi-Channel-Setup (telegram + discord):

```json
"delivery": {
  "mode": "announce",
  "channel": "telegram",    // PFLICHT bei >1 Channel
  "to": "8394473933"        // PFLICHT für Telegram
}
```

**Fehler ohne explizite Config:**
- `Channel is required when multiple channels are configured`
- `Delivering to Telegram requires target <chatId>`

**Betroffene Jobs (fixen!):**
- `uptime-check` - braucht channel + to
- `disk-usage-alert` - braucht channel + to
- `user-feedback-collector` - braucht to
