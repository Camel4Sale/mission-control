# Learnings Log

Korrekturen, Wissenslücken und Best Practices für kontinuierliche Verbesserung.

---

## [LRN-20260307-001] best_practice - Cron Delivery bei Multi-Channel

**Logged**: 2026-03-07T07:49:00+01:00
**Priority**: high
**Status**: resolved
**Area**: config

### Summary
Bei Multi-Channel-Setup (telegram + discord) MUSS `delivery.channel` explizit gesetzt werden.

### Details
OpenClaw Gateway kann mehrere Channels konfigurieren. Wenn ein Cron-Job nur `{ mode: "announce" }` hat, weiß das System nicht wohin. Fehler:
```
Channel is required when multiple channels are configured: telegram, discord
```

### Suggested Action
IMMER explizit setzen wenn Channels > 1:
```json
"delivery": {
  "mode": "announce",
  "channel": "telegram",
  "to": "8394473933"
}
```

### Metadata
- Source: error
- Related Files: Gateway Cron Config
- Tags: cron, delivery, multi-channel
- Pattern-Key: cron.delivery.explicit
- Recurrence-Count: 3
- First-Seen: 2026-03-07
- Last-Seen: 2026-03-07

### Resolution
- **Resolved**: 2026-03-07T07:53:00+01:00
- **Fix**: Alle Cron-Jobs mit delivery.channel + to aktualisiert

---

## [LRN-20260307-002] best_practice - Telegram Target Required

**Logged**: 2026-03-07T07:49:00+01:00
**Priority**: high
**Status**: resolved
**Area**: config

### Summary
Telegram-Delivery braucht zwingend `to` (chatId) im Delivery-Objekt.

### Details
Auch wenn `channel: "telegram"` gesetzt ist, reicht das nicht. Telegram braucht eine Ziel-ID:
```
Delivering to Telegram requires target <chatId>
```

### Suggested Action
Für Telegram immer `to` setzen:
```json
"delivery": {
  "mode": "announce",
  "channel": "telegram",
  "to": "8394473933"
}
```

### Metadata
- Source: error
- Related Files: Gateway Cron Config
- Tags: telegram, delivery, target
- Pattern-Key: telegram.target.required

### Resolution
- **Resolved**: 2026-03-07T07:53:00+01:00
- **Fix**: delivery.to bei allen Telegram-Jobs gesetzt

---

## [LRN-20260307-003] knowledge_gap - Uptime-Check Timeout bei vielen Projekten

**Logged**: 2026-03-07T07:49:00+01:00
**Priority**: medium
**Status**: resolved
**Area**: infra

### Summary
Uptime-Check für ALLE Projekte parallel kann 60s Timeout überschreiten.

### Details
Job `uptime-check-all` mit Payload "prüfe ALLE Projekte" läuft in Timeout:
- Timeout: 60s
- Tatsächliche Laufzeit: >60s
- Fehler: `cron: job execution timed out`

### Suggested Action
Optionen:
1. Timeout auf 120-180s erhöhen
2. Projekte batchen (5 pro Run)
3. Parallele Requests statt sequentiell

### Metadata
- Source: error
- Related Files: Cron-Job Config
- Tags: uptime, timeout, performance
- Pattern-Key: uptime.timeout.batching

### Resolution
- **Resolved**: 2026-03-07T07:53:00+01:00
- **Fix**: Timeout von 60s auf 180s erhöht

---

## [LRN-20260307-004] best_practice - Morning Check Struktur

**Logged**: 2026-03-07T07:49:00+01:00
**Priority**: medium
**Status**: pending
**Area**: config

### Summary
Morning Check sollte strukturiert sein: Wetter → Termine → Tasks → Cron Issues.

### Details
HEARTBEAT.md definiert Morning-Routine (8:00-9:00):
- Wetter für Karlsruhe
- Termine heute
- Offene Tasks analysieren
- Ggf. Morning Briefing

Praktisch erweitert um:
- Cron-Job Status (Fehler erkennen)
- Disk Usage (wenn >70%)
- Neue Learnings/Errors

### Suggested Action
Morning-Check als Template festhalten:
1. Wetter (wttr.in)
2. Cron-Jobs mit Errors filtern
3. Memory-File heute + gestern lesen
4. Zusammenfassung mit Issues

### Metadata
- Source: conversation
- Related Files: HEARTBEAT.md
- Tags: morning, routine, heartbeat
- Pattern-Key: morning.check.structure

---
