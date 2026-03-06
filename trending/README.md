# 📰 Blogwatcher - RSS Feed Monitoring

Automatisches Feed-Monitoring für Trends, AI, Crypto, Tech und KIT-News.

## Installation

```bash
# Blogwatcher ist im Workspace installiert
cd /data/.openclaw/workspace/blogwatcher
npm install

# Global verfügbar machen
ln -sf /data/.openclaw/workspace/blogwatcher/bin/blogwatcher.js ~/.npm-global/bin/blogwatcher
```

## Konfiguration

Config-Datei: `~/.blogwatcherrc`

```json
{
  "feeds": {
    "trends": [...],
    "ai": [...],
    "crypto": [...],
    "tech": [...],
    "kit": [...]
  },
  "checkInterval": "0 * * * *",
  "outputDir": "/data/.openclaw/workspace/trending"
}
```

## Feed-Kategorien

| Kategorie | Zweck | Feeds |
|-----------|-------|-------|
| **trends** | Project Generator | Product Hunt, HackerNews, GitHub Trending, Reddit r/startups |
| **ai** | Model-Updates | OpenAI, Anthropic, Google AI, HuggingFace |
| **crypto** | Polymarket/Crypto | Polymarket, CryptoPanic, CoinDesk, TheBlock |
| **tech** | Auto-Optimization | CSS-Tricks, Smashing Magazine, Dev.to, Medium |
| **kit** | Student/Karlsruhe | KIT News, SWKA Mensa, Studierendenrat |

## Commands

```bash
blogwatcher init          # Default Config erstellen
blogwatcher check         # Alle Feeds prüfen
blogwatcher check trends  # Nur bestimmte Kategorie
blogwatcher watch         # Dauerbetrieb (stündlich)
blogwatcher config        # Aktuelle Config anzeigen
blogwatcher version       # Version anzeigen
```

## Output

- `/data/.openclaw/workspace/trending/latest.json` - Aktuelle Items (wird überschrieben)
- `/data/.openclaw/workspace/trending/feed-check-YYYY-MM-DDTHH-MM-SS.json` - Historische Checks
- `/data/.openclaw/workspace/trending/blogwatcher.log` - Log-Datei

## Integration

### Täglicher Check (9:00 Uhr)
Wird über HEARTBEAT.md im Morning-Routine ausgelöst:
```bash
blogwatcher check trends
```

### Project Generator
Der Project Generator liest Trends aus:
```bash
cat /data/.openclaw/workspace/trending/latest.json | jq '.[] | select(.category=="trends")'
```

## Status

- ✅ blogwatcher CLI installiert (v1.0.0)
- ✅ ~/.blogwatcherrc konfiguriert
- ✅ Erster Check erfolgreich (945+ Items)
- ✅ JSON Export funktioniert
- ✅ HEARTBEAT.md aktualisiert
- 📝 Cron-Job über Heartbeat (täglich 9:00)

## Troubleshooting

```bash
# Logs prüfen
tail -f /data/.openclaw/workspace/trending/blogwatcher.log

# Config validieren
blogwatcher config

# Manuelles Testing
blogwatcher check trends --verbose
```
