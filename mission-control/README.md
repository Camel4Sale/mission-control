# 🎛️ Mission Control

**Analytics & Dashboard Platform für alle Projekte**

Mission Control ist das zentrale Dashboard für Analytics, Metriken und Projekt-Übersichten aller deiner Projekte - von Life OS über Celaris bis zu Polymarket Bots.

---

## ✨ Features

### 📊 Analytics Dashboard
- **Projekt-Übersicht** - Alle Projekte an einem Ort
- **Live-Metriken** - Echtzeit-Daten aus allen Systemen
- **Custom Widgets** - Deine wichtigsten KPIs
- **Historie** - Zeitreihen und Trends

### 🌙 Dark/Light Mode
- **Auto-Switch** - Nach Sonnenstand
- **Manuell** - Preference speichern
- **Perfekt abgestimmt** - Beide Modi vollwertig

### ♿ Accessibility
- **ARIA Labels** - Vollständig barrierefrei
- **Keyboard Navigation** - Alle Features nutzbar
- **High Contrast** - WCAG 2.1 AA konform
- **Screen Reader** - Optimiert

---

## 🎨 Design Philosophy

**CLEAN & PROFESSIONAL** - Datenfokussiert, nicht überladen

### Typography
- **Display:** Inter (Clean, neutral)
- **Body:** Inter (Konsistent)
- **Mono:** JetBrains Mono (Daten, Zahlen)

### Farbpalette

#### Dark Mode
```
Background: #0a0a0a
Surface: #141414
Border: rgba(255,255,255,0.1)
Text Primary: #fafafa
Text Secondary: #a1a1aa
Accent: #3b82f6 (Blue)
Success: #22c55e
Warning: #eab308
Danger: #f43f5e
```

#### Light Mode
```
Background: #ffffff
Surface: #f8fafc
Border: rgba(0,0,0,0.1)
Text Primary: #0f172a
Text Secondary: #64748b
Accent: #2563eb
```

### Components
- **Cards** - Subtle shadows, clean borders
- **Charts** - Recharts mit smooth animations
- **Tables** - Sortable, filterable
- **Badges** - Status indicators

---

## 🚀 Quick Start

### Installation

```bash
cd mission-control
npm install
cp .env.example .env
npm run dev
```

👉 Öffne **http://localhost:3000**

### Environment Variables

```env
# API Endpoints
LIFE_OS_API=http://localhost:3001
CEALARIS_API=http://localhost:3002
POLYMARKET_API=http://localhost:8000

# Analytics
ANALYTICS_ID=your-analytics-id

# Auth (optional)
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 📁 Projektstruktur

```
mission-control/
├── life-os/                    # Life OS Integration
│   ├── src/
│   │   ├── app/
│   │   │   ├── (with-nav)/    # Hauptbereich
│   │   │   ├── studium/       # Studium Features
│   │   │   ├── unternehmen/   # Unternehmens-Dashboards
│   │   │   └── docs/          # Dokumentation
│   │   ├── components/
│   │   │   ├── ui/            # Design System
│   │   │   ├── Navigation.tsx
│   │   │   └── TopBar.tsx
│   │   └── lib/
│   └── README.md
├── analytics/
│   ├── page.tsx               # /analytics Dashboard
│   ├── components/
│   │   ├── MetricsGrid.tsx
│   │   ├── TimeSeriesChart.tsx
│   │   └── ProjectCards.tsx
│   └── lib/
│       └── metrics.ts
├── public/
├── package.json
└── README.md
```

---

## 📊 Analytics Endpoints

### Projekt-Metriken

```typescript
// Life OS Stats
GET /api/life-os/stats
{
  studyHours: number,
  modulesCompleted: number,
  avgGrade: number,
  tasksCompleted: number
}

// Celaris Leads
GET /api/celaris/leads
{
  totalLeads: number,
  conversionRate: number,
  revenue: number
}

// Polymarket PnL
GET /api/polymarket/pnl
{
  totalPnL: number,
  winRate: number,
  trades: number
}
```

### Aggregierte Metrics

```typescript
// Alle Projekte
GET /api/analytics/overview
{
  projects: Project[],
  totalUsers: number,
  totalRevenue: number,
  growth: number
}
```

---

## 🎯 Roadmap

### Q2 2026 - Foundation ✅
- [x] Core Dashboard
- [x] Dark/Light Mode
- [x] Basic Analytics
- [ ] Alle Projekt-Integrationen
- [ ] Real-Time Updates

### Q3 2026 - Features
- [ ] Custom Widgets
- [ ] Alerting System
- [ ] Export (CSV, PDF)
- [ ] Mobile App

### Q4 2026 - AI
- [ ] AI Insights
- [ ] Anomaly Detection
- [ ] Predictive Analytics
- [ ] Natural Language Queries

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS Variables |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context + SWR |
| Deployment | Vercel |

---

## 📊 Performance Targets

- ✅ Lighthouse Score: 95+
- ✅ First Contentful Paint: < 1.5s
- ✅ Time to Interactive: < 3.5s
- ✅ Cumulative Layout Shift: < 0.1
- ✅ Chart Updates: 60fps

---

## ♿ Accessibility Checklist

- [x] Semantic HTML
- [x] ARIA Labels für alle interaktiven Elemente
- [x] Keyboard Navigation (Tab, Enter, Escape)
- [x] Focus Indicators (sichtbar)
- [x] Color Contrast (WCAG AA)
- [x] Screen Reader Tests
- [ ] Skip Links
- [ ] Reduced Motion Option

---

## 🔒 Security

- Environment Variables für API Keys
- CORS für API-Zugriffe
- Rate Limiting für Endpoints
- No Third-Party Tracker (privacy-first)

---

## 🤝 Contributing

1. Forken
2. Feature Branch (`git checkout -b feature/add-metric`)
3. Commiten (`git commit -m 'Add new metric'`)
4. Pushen (`git push origin feature/add-metric`)
5. Pull Request öffnen

---

## 📞 Support

- **Discord:** https://discord.gg/UGkgpRFj
- **Issues:** GitHub Issues
- **Analytics Docs:** `/analytics/docs`

---

## 🙏 Credits

**Built with ❤️** for data-driven decisions  
**License:** MIT  
**Not affiliated with:** Any of the integrated projects

---

**📊 Know your numbers, grow your projects.**

*Made in Karlsruhe*
