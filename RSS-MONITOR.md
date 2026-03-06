# 📰 RSS/Feed Monitor — Eigenes Tool

**Stand:** 2026-03-06  
**Status:** 🔄 In Entwicklung (blogwatcher nicht verfügbar)

---

## 🎯 Alternative Lösungen

### Option 1: Eigenes Node.js Tool bauen

**Vorteile:**
- ✅ Vollständige Kontrolle
- ✅ Genau auf unsere Needs zugeschnitten
- ✅ Integration mit OpenClaw direkt
- ✅ Keine externen Dependencies

**Tech-Stack:**
```javascript
// packages: feedparser, node-fetch, node-cron
const FeedParser = require('feedparser');
const fetch = require('node-fetch');
const cron = require('node-cron');
```

---

### Option 2: Python feedparser

**Vorteile:**
- ✅ Ausgereiftes Library
- ✅ Unterstützt RSS + Atom
- ✅ Leicht zu integrieren

**Installation:**
```bash
pip install feedparser
```

**Code-Beispiel:**
```python
import feedparser

feed = feedparser.parse('https://news.ycombinator.com/rss')
for entry in feed.entries:
    print(entry.title, entry.link)
```

---

### Option 3: Web-basierte APIs

**RSS2JSON:**
- https://rss2json.com/
- Free Tier: 10.000 requests/day
- Einfach zu nutzen

**Beispiel:**
```bash
curl "https://api.rss2json.com/v1/api.json?rss_url=https://news.ycombinator.com/rss"
```

---

## 🏗️ Eigenes Tool: `rss-monitor`

### Struktur
```
rss-monitor/
├── config.json (Feeds, Categories, Intervals)
├── monitor.js (Haupt-Script)
├── feeds/ (Cached Feed-Daten)
└── output/ (Exported Summaries)
```

### config.json
```json
{
  "feeds": [
    {
      "name": "HackerNews",
      "url": "https://news.ycombinator.com/rss",
      "category": "tech",
      "checkInterval": 3600
    },
    {
      "name": "Product Hunt",
      "url": "https://www.producthunt.com/feed",
      "category": "trends",
      "checkInterval": 3600
    },
    {
      "name": "OpenAI Blog",
      "url": "https://openai.com/blog/rss",
      "category": "ai",
      "checkInterval": 7200
    }
  ],
  "outputDir": "./output",
  "cacheDir": "./feeds"
}
```

### Features
- ✅ Multi-Feed-Support (RSS + Atom)
- ✅ Kategorien (tech, ai, crypto, trends, student)
- ✅ Caching (keine Duplikate)
- ✅ JSON-Export
- ✅ Cron-Integration
- ✅ New-Item-Alerts (Telegram)

---

## 🚀 Implementation Plan

### Phase 1: Basic (heute)
- [ ] Python feedparser installieren
- [ ] Grundgerüst bauen
- [ ] 5-10 Test-Feeds konfigurieren
- [ ] Ersten Check ausführen

### Phase 2: Integration (morgen)
- [ ] Cron-Job erstellen (täglich 9:00)
- [ ] Output in trending/ Ordner
- [ ] Project Generator verknüpfen

### Phase 3: Advanced (diese Woche)
- [ ] Telegram-Alerts bei neuen Items
- [ ] NLP für Relevanz-Scoring
- [ ] Auto-Summary generieren

---

**Eigenes RSS-Monitor-Tool wird gebaut!** 📰🔧
