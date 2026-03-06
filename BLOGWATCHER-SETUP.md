# 📰 Blogwatcher — RSS/Atom Feed Monitor

**Installiert:** 2026-03-06  
**Integration:** Project Generator + Auto-Optimization System

---

## 🎯 Purpose

Automatisches Monitoring von Tech-Blogs, News-Seiten und RSS-Feeds für:
- **Trend-Scouting** (neue Technologien, Frameworks)
- **Competitor-Monitoring** (Feature-Releases, Updates)
- **AI-News** (neue Models, APIs, Tools)
- **Crypto/Polymarket** (Regulation, neue Märkte)
- **KIT/Student-News** (Praktika, Events, Deadlines)

---

## 📦 Installation

```bash
npm install -g blogwatcher
```

---

## 🔧 Konfiguration

### Config-File: `~/.blogwatcherrc`

```json
{
  "feeds": [
    {
      "name": "Product Hunt",
      "url": "https://www.producthunt.com/feed",
      "category": "trends"
    },
    {
      "name": "HackerNews",
      "url": "https://news.ycombinator.com/rss",
      "category": "tech"
    },
    {
      "name": "OpenAI Blog",
      "url": "https://openai.com/blog/rss",
      "category": "ai"
    },
    {
      "name": "Anthropic Updates",
      "url": "https://www.anthropic.com/news/rss",
      "category": "ai"
    },
    {
      "name": "Polymarket Blog",
      "url": "https://polymarket.com/blog/rss",
      "category": "crypto"
    },
    {
      "name": "KIT News",
      "url": "https://www.kit.edu/kit/newsliste.php?feed=rss2",
      "category": "student"
    }
  ],
  "checkInterval": 3600,
  "outputDir": "~/.blogwatcher/output",
  "notifyNew": true
}
```

---

## 🚀 Commands

### Alle Feeds checken
```bash
blogwatcher check
```

### Spezifischen Feed checken
```bash
blogwatcher check --feed "Product Hunt"
```

### Neue Einträge anzeigen
```bash
blogwatcher list --new
```

### Nach Kategorie filtern
```bash
blogwatcher list --category ai
blogwatcher list --category crypto
blogwatcher list --category trends
```

### Export als JSON
```bash
blogwatcher export --format json > feeds-2026-03-06.json
```

---

## 🔄 Integration in Auto-Optimization

### Cron-Job: Trend-Scout (täglich 9:00)

**Task:** Blogwatcher ausführen + neue Einträge analysieren

```bash
blogwatcher check
blogwatcher export --format json > /data/.openclaw/workspace/trending/feeds-$(date +%Y-%m-%d).json
```

### Cron-Job: Competitor-Monitor (täglich 10:00)

**Task:** Competitor-Blogs checken + Feature-Updates extrahieren

```bash
blogwatcher check --category competitors
blogwatcher list --new --since yesterday
```

### Cron-Job: AI-News (alle 6h)

**Task:** AI-Blogs monitorieren für Model-Updates

```bash
blogwatcher check --category ai
blogwatcher list --new
```

---

## 📊 Output-Verarbeitung

### Feed-Daten speichern
```
/data/.openclaw/workspace/trending/
├── feeds-2026-03-06.json
├── feeds-2026-03-07.json
└── summary-2026-W10.md
```

### Zusammenfassung generieren
```bash
blogwatcher summary --week 10 --year 2026
```

---

## 🎯 Use-Cases

### 1. Project Generator (8:00 + 14:00)
- Product Hunt Trends → Neue Startup-Ideen
- HackerNews → Tech-Trends
- AI-Blogs → Neue Models/APIs

### 2. Polymarket Bots
- Polymarket Blog → Neue Märkte
- Crypto-News → Regulation, Events
- Prediction-Market-Updates

### 3. KIT Study Tools
- KIT News → Praktika, Events, Deadlines
- Student-Blogs → Learning-Tips

### 4. Auto-Optimization
- Tech-Blogs → Neue Frameworks, Tools
- Competitor-Blogs → Feature-Releases

---

## 📈 Success Metrics

### Täglich tracken:
- **Neue Einträge:** Anzahl
- **Relevante Trends:** Score > 70
- **Actionable Insights:** ≥ 3/Tag

### Wöchentlich:
- **Top-Trends:** Top 5 der Woche
- **Projekt-Ideen:** Aus Trends generiert
- **Competitor-Updates:** Features, Pricing

---

**Blogwatcher ist bereit für automatisches Trend-Monitoring!** 📰🚀
