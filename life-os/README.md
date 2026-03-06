# 🧬 Life OS - Dein Persönliches Betriebssystem

**Ein alles-in-einem Dashboard für Leben, Studium, Unternehmen und Projekte**

Life OS ist dein zentrales Nervensystem - verbinde Studium, Arbeit, Projekte und persönliches Wachstum in einer eleganten, intuitiven Oberfläche.

---

## ✨ Features

### 📚 Studium
- **Modul-Planer** - Behalte deinen Studienplan im Blick
- **Noten-Tracker** - Alle Noten an einem Ort
- **Lern-Timer** - Pomodoro-Technik integriert
- **Klausur-Kalender** - Nie wieder eine Prüfung vergessen
- **Flashcards** - Aktives Recall für effizientes Lernen
- **Study Hub** - Alle Lernressourcen gebündelt

### 💼 Unternehmen
- **Celaris Dashboard** - Solar Sales Tools
- **Elysium Platform** - Immobilien-Management
- **Pathium Analytics** - Datenvisualisierung
- **CRM Integration** - Kundenbeziehungen pflegen
- **Projekt-Tracker** - Alle Projekte im Überblick

### 📊 Analytics
- **Persönliche Stats** - Produktivität, Lernen, Fortschritt
- **Dark/Light Mode** - Automatisch oder manuell
- **Custom Widgets** - Deine wichtigsten Metrics

---

## 🎨 Design Philosophy

**BOLD & ORGANIC** - Kein generisches AI-Slop!

- **Typography:** Fraunces (Display) + Plus Jakarta Sans (Body)
- **Farben:** Warme, atmosphärische Paletten
- **Micro-Interactions:** Subtile Hover-Effekte, smooth transitions
- **Mobile-First:** Perfekt auf allen Devices
- **Accessibility:** ARIA-konform, kontrastreich

---

## 🚀 Quick Start

### Voraussetzungen
- Node.js 18+
- npm oder bun

### Installation

```bash
# Clone & Install
cd life-os
npm install

# Environment setzen
cp .env.example .env

# Development Server
npm run dev
```

👉 Öffne **http://localhost:3000**

---

## 📁 Projektstruktur

```
life-os/
├── src/
│   ├── app/
│   │   ├── (with-nav)/          # Hauptbereich mit Navigation
│   │   │   ├── page.tsx         # Dashboard Home
│   │   │   └── layout.tsx
│   │   ├── studium/
│   │   │   ├── module/          # Modul-Planer
│   │   │   ├── noten/           # Noten-Tracker
│   │   │   ├── lern-timer/      # Pomodoro
│   │   │   ├── klausuren/       # Klausur-Kalender
│   │   │   └── study/           # Study Hub
│   │   ├── unternehmen/
│   │   │   ├── celaris/         # Celaris Dashboard
│   │   │   ├── elysium/         # Elysium Platform
│   │   │   └── pathium/         # Pathium Analytics
│   │   ├── docs/                # Dokumentation
│   │   └── projekte/            # Projekt-Übersicht
│   ├── components/
│   │   ├── ui/                  # Design System
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── index.ts
│   │   ├── Navigation.tsx       # Sidebar Nav
│   │   ├── TopBar.tsx           # Header
│   │   └── QuickAdd.tsx         # Quick Actions
│   └── lib/
│       └── api.ts               # API Utilities
├── public/
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 🎯 Roadmap

### Q2 2026 - Foundation ✅
- [x] Core Architecture
- [x] Design System
- [x] Navigation & Layout
- [ ] Alle Studium-Features
- [ ] Unternehmen-Dashboards

### Q3 2026 - Integration
- [ ] API-Integrationen (Google Calendar, Notion)
- [ ] Mobile App (React Native)
- [ ] Offline-Mode
- [ ] Sync zwischen Devices

### Q4 2026 - AI Features
- [ ] AI Study Assistant
- [ ] Automatische Zeitplanung
- [ ] Smart Notifications
- [ ] Voice Commands

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS Variables |
| Fonts | Fraunces + Plus Jakarta Sans |
| Icons | Lucide React |
| State | React Context + Hooks |
| Deployment | Vercel |

---

## 🎨 Design Tokens

```css
:root {
  /* Typography */
  --font-display: 'Fraunces', serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  
  /* Colors - Dark Mode */
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --bg-surface: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --accent: #f97316;  /* Warm Orange */
  --accent-secondary: #fb923c;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  
  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
}
```

---

## 📊 Performance Targets

- ✅ Lighthouse Score: 95+
- ✅ First Contentful Paint: < 1.5s
- ✅ Time to Interactive: < 3.5s
- ✅ Cumulative Layout Shift: < 0.1
- ✅ Bundle Size: < 200KB (gzipped)

---

## 🔒 Security

- Environment Variables für sensible Daten
- No Third-Party Tracker
- Local-First Architecture
- Optional: End-to-End Encryption

---

## 🤝 Contributing

1. Forken
2. Feature Branch (`git checkout -b feature/add-xyz`)
3. Commiten (`git commit -m 'Add XYZ feature'`)
4. Pushen (`git push origin feature/add-xyz`)
5. Pull Request öffnen

---

## 📞 Support

- **Discord:** https://discord.gg/UGkgpRFj
- **Issues:** GitHub Issues
- **Docs:** `/docs` in der App

---

## 🙏 Credits

**Built with ❤️** by KIT Students  
**License:** MIT  
**Not affiliated with KIT**

---

**🚀 Optimize your life, one module at a time.**

*Made in Karlsruhe*
