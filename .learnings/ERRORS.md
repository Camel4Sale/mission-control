# Errors Log

Fehler und Probleme für kontinuierliche Verbesserung.

---

## [ERR-20260307-001] uptime-check-all - Cron Timeout

**Logged**: 2026-03-07T07:49:00+01:00
**Priority**: high
**Status**: resolved
**Area**: infra

### Summary
Cron-Job `uptime-check-all` läuft wiederholt in Timeout (60s) mit 6 konsekutiven Fehlern.

### Error
```
cron: job execution timed out
lastDurationMs: 60009
consecutiveErrors: 6
```

### Context
- Job-ID: `547d9029-c495-4165-90f0-f638aefebf27`
- Schedule: `*/15 * * * *` (alle 15 Minuten)
- Payload: Prüft ALLE Projekte auf Uptime
- Timeout: 60 Sekunden im Cron-Job selbst

### Suggested Fix
1. Timeout auf 120-180s erhöhen
2. Job optimieren (weniger Projekte pro Run)
3. Auf parallele Checks umstellen

### Metadata
- Reproducible: yes
- Related Files: Cron-Job Config im Gateway
- See Also: ERR-20260307-002 (uptime-check channel Fehler)

### Resolution
- **Resolved**: 2026-03-07T07:53:00+01:00
- **Fix**: Timeout auf 180s erhöht + delivery.channel gesetzt

---

## [ERR-20260307-002] uptime-check - Channel Required Error

**Logged**: 2026-03-07T07:49:00+01:00
**Priority**: medium
**Status**: resolved
**Area**: config

### Summary
Cron-Job `uptime-check` schlägt fehl weil `delivery.channel` nicht explizit gesetzt ist bei Multi-Channel-Setup.

### Error
```
Channel is required when multiple channels are configured: telegram, discord
Set delivery.channel explicitly or use a main session with a previous channel.
consecutiveErrors: 6
```

### Context
- Job-ID: `9d8b3537-0a1b-42f3-8614-9f6e74105b07`
- Schedule: alle 15 Minuten (900000ms)
- Delivery: `{ mode: "announce" }` ohne channel
- Gateway hat telegram + discord konfiguriert

### Suggested Fix
Delivery explizit setzen:
```json
"delivery": {
  "mode": "announce",
  "channel": "telegram"
}
```

### Metadata
- Reproducible: yes
- Related Files: Gateway Cron Config
- See Also: ERR-20260307-003 (disk-usage-alert gleicher Fehler)

### Resolution
- **Resolved**: 2026-03-07T07:53:00+01:00
- **Fix**: delivery.channel + to explizit gesetzt

---

## [ERR-20260307-003] disk-usage-alert - Channel Required Error

**Logged**: 2026-03-07T07:49:00+01:00
**Priority**: medium
**Status**: resolved
**Area**: config

### Summary
Gleicher Fehler wie ERR-20260307-002 - `disk-usage-alert` Job braucht expliziten Channel.

### Error
```
Channel is required when multiple channels are configured: telegram, discord
Set delivery.channel explicitly or use a main session with a previous channel.
consecutiveErrors: 2
```

### Context
- Job-ID: `222be8df-e173-4bce-99ee-dc43d97d9cf5`
- Schedule: `0 6 * * *` (täglich 6:00)
- Delivery: `{ mode: "announce" }` ohne channel

### Suggested Fix
Delivery explizit setzen:
```json
"delivery": {
  "mode": "announce",
  "channel": "telegram"
}
```

### Metadata
- Reproducible: yes
- Related Files: Gateway Cron Config
- See Also: ERR-20260307-002

### Resolution
- **Resolved**: 2026-03-07T07:53:00+01:00
- **Fix**: delivery.channel + to explizit gesetzt

---

## [ERR-20260307-004] user-feedback-collector - Telegram Delivery Error

**Logged**: 2026-03-07T07:49:00+01:00
**Priority**: medium
**Status**: resolved
**Area**: config

### Summary
Telegram-Delivery schlägt fehl weil `target` (chatId) nicht gesetzt ist.

### Error
```
Delivering to Telegram requires target <chatId>
consecutiveErrors: 5
```

### Context
- Job-ID: `user-feed-007`
- Schedule: alle 30 Minuten (1800000ms)
- Delivery: `{ mode: "announce", channel: "telegram" }` aber kein `to`

### Suggested Fix
Target (chatId) explizit setzen:
```json
"delivery": {
  "mode": "announce",
  "channel": "telegram",
  "to": "8394473933"
}
```

### Metadata
- Reproducible: yes
- Related Files: Gateway Cron Config

### Resolution
- **Resolved**: 2026-03-07T07:53:00+01:00
- **Fix**: delivery.to explizit gesetzt

---

## [ERR-20260307-005] stock-research-morning - Delivery Failed

**Logged**: 2026-03-07T07:49:00+01:00
**Priority**: low
**Status**: pending
**Area**: config

### Summary
Stock-Research Job läuft erfolgreich, aber Delivery an Discord schlägt fehl.

### Error
```
cron announce delivery failed
lastDeliveryStatus: not-delivered
```

### Context
- Job-ID: `535366d2-3783-45eb-a43e-efeeb00ae507`
- Schedule: `0 7 * * *` (täglich 7:00)
- Delivery: `{ channel: "discord", mode: "announce", to: "8394473933" }`
- Job selbst: OK (15s Laufzeit)

### Suggested Fix
1. Discord Bot Permissions prüfen
2. Channel-ID validieren (ist `8394473933` eine valide Discord-User-ID?)
3. Bot muss DMs senden dürfen oder Channel muss existieren

### Metadata
- Reproducible: unknown
- Related Files: Discord Bot Config

---
