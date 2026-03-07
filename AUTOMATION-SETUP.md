# 🤖 Automation Setup - RSS Monitor & Summarize

**Status:** ✅ **ACTIVE** - Beide Services automatisiert

---

## 📊 Übersicht

| Service | Schedule | Status | Job ID |
|---------|----------|--------|--------|
| **RSS Monitor** | Alle 30 Minuten | ✅ Active | `ce24ee59-8f82-442a-b7da-a780cfef11fb` |
| **Summarize Daily** | Täglich 18:00 | ✅ Active | `0e2e7b7a-4861-440c-86f4-c2545606928a` |

---

## 1. RSS Monitor (Alle 30 Minuten)

### Was es macht:
- Prüft 12 RSS-Feeds automatisch
- Extrahiert neue Artikel/Videos
- Speichert in `/data/.openclaw/workspace/trending/feeds-YYYY-MM-DD.json`
- Benachrichtigt bei neuen Einträgen

### Konfiguration:
```json
{
  "name": "rss-monitor",
  "schedule": {"everyMs": 1800000, "kind": "every"},
  "payload": {"kind": "systemEvent", "text": "RSS Monitor läuft - prüfe Feeds..."}
}
```

### Feeds:
1. Product Hunt (trends)
2. HackerNews (tech)
3. GitHub Trending (tech)
4. OpenAI Blog (ai)
5. Anthropic (ai)
6. HuggingFace (ai)
7. Polymarket Blog (crypto)
8. CryptoPanic (crypto)
9. CoinDesk (crypto)
10. CSS-Tricks (tech)
11. Dev.to (tech)
12. KIT News (student)

### Logs:
```bash
tail -f /tmp/rss-monitor.log
```

### Manuelles Ausführen:
```bash
cd /data/.openclaw/workspace/rss-monitor
python3 monitor.py
```

---

## 2. Daily Summarize (18:00 täglich)

### Was es macht:
- Liest trending Feeds vom Tag
- Extrahiert Top 3 YouTube-Videos
- Erstellt Transkripte & Zusammenfassungen
- Speichert in `/data/.openclaw/workspace/summaries/`

### Konfiguration:
```json
{
  "name": "summarize-daily",
  "schedule": {"expr": "0 18 * * *", "tz": "Europe/Berlin"},
  "payload": {"kind": "systemEvent", "text": "🧠 Daily Summarize startet..."}
}
```

### Output:
- `/data/.openclaw/workspace/summaries/summarize-YYYY-MM-DD_HH-MM-SS.log`
- JSON-Dateien mit Transkripten
- Markdown-Zusammenfassungen

### Manuelles Ausführen:
```bash
cd /data/.openclaw/workspace/summarize
./run-summarize-daily.sh
```

### Einzelnes Video summarizen:
```bash
python3 summarize.py https://youtube.com/watch?v=VIDEO_ID
```

---

## 📁 Dateistruktur

```
/data/.openclaw/workspace/
├── rss-monitor/
│   ├── monitor.py              # Hauptscript
│   ├── run-rss-monitor.sh      # Runner Script
│   └── config.json             # Feed-Konfiguration
├── summarize/
│   ├── summarize.py            # Hauptscript
│   ├── run-summarize-daily.sh  # Daily Runner
│   └── venv/                   # Python Virtualenv
├── cron-scripts/
│   ├── rss-monitor.sh          # Cron Wrapper
│   └── summarize-daily.sh      # Cron Wrapper
├── trending/
│   ├── feeds-2026-03-07.json   # Heute
│   └── latest.json             # Symlink zu heute
└── summaries/
    └── summarize-*.log         # Logs & Outputs
```

---

## 🔧 Cron-Jobs verwalten

### Status prüfen:
```bash
openclaw cron list
```

### Jobs anzeigen:
```bash
openclaw cron runs --id <JOB_ID>
```

### Job deaktivieren:
```bash
openclaw cron update --id <JOB_ID> --patch '{"enabled": false}'
```

### Job aktivieren:
```bash
openclaw cron update --id <JOB_ID> --patch '{"enabled": true}'
```

### Job sofort ausführen:
```bash
openclaw cron run --id <JOB_ID>
```

---

## 📊 Monitoring

### RSS Monitor Logs:
```bash
tail -f /tmp/rss-monitor.log
```

### Summarize Logs:
```bash
tail -f /tmp/summarize.log
ls -lah /data/.openclaw/workspace/summaries/
```

### Trending Feeds:
```bash
cat /data/.openclaw/workspace/trending/feeds-$(date +%Y-%m-%d).json | jq '.feeds[].items | length'
```

---

## ⚠️ Troubleshooting

### RSS Monitor läuft nicht:
1. Prüfe Python-Pfade: `which python3`
2. Teste manuell: `cd rss-monitor && python3 monitor.py`
3. Logs prüfen: `tail /tmp/rss-monitor.log`

### Summarize fehlschlägt:
1. yt-dlp installiert? `yt-dlp --version`
2. API Keys gesetzt? (falls benötigt)
3. Teste mit URL: `python3 summarize.py <URL>`

### Cron-Job feuert nicht:
1. Job Status: `openclaw cron list`
2. Nächster Run: `openclaw cron runs --id <JOB_ID>`
3. Manuell triggern: `openclaw cron run --id <JOB_ID>`

---

## 🎯 Nächste Schritte

### Optional:
1. **PM2 installieren** - Bessere Prozess-Verwaltung
   ```bash
   npm install -g pm2
   pm2 start rss-monitor/monitor.py --name rss-monitor
   pm2 start summarize/summarize.py --name summarize
   ```

2. **Slack/Telegram Alerts** - Bei Fehlern benachrichtigen

3. **Retention Policy** - Alte Logs automatisch löschen (>30 Tage)

4. **Dashboard** - Web-UI für Automation-Status

---

**Setup Complete!** ✅

- RSS Monitor: ✅ Alle 30 Minuten
- Summarize: ✅ Täglich 18:00
- Logs: ✅ `/tmp/*.log`
- Output: ✅ `/data/.openclaw/workspace/trending/` & `/summaries/`
