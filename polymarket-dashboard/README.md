# 🧊 Polymarket Dashboard

Ein hochwertiges Trading-Dashboard für Polymarket Bots mit modernstem UI/UX.

## 🎨 Design-Prinzipien

### Typography
- **Display:** Syne (distinctive, bold headers)
- **Body:** Plus Jakarta Sans (clean, readable)
- **Mono:** JetBrains Mono (Zahlen, Daten, Preise)

### Farben
- **Primary:** Electric Blue (#2563eb)
- **Profit:** Emerald Green (#10b981)
- **Loss:** Rose Red (#f43f5e)
- **Background:** Dark Slate (#0f172a)
- **Cards:** Semi-transparent mit Blur-Effekt

### Layout
- **12-Column Grid** für konsistente Ausrichtung
- **Bento-Box Style** inspiriert von Linear & Vercel
- **Dense Information** aber clean und übersichtlich
- **Priority-Visualisierung** (wichtige Daten größer)

## 📁 Struktur

```
polymarket-dashboard/
├── index.html          # Main Dashboard
├── markets.html        # Markets Screen
├── styles.css          # Haupt-Stylesheet
├── markets.css         # Markets-spezifische Styles
├── app.js              # Dashboard Logic
├── markets.js          # Markets Logic
└── README.md           # Diese Datei
```

## 🚀 Features

### Main Dashboard (`/`)

#### Hero-Section
- **Total P&L** - Groß und prominent mit Change-Indikator
- **24h Change** - Prozentuale Änderung
- **Active Positions** - Anzahl offener Positionen
- **Available Balance** - USDC Guthaben

#### Key Metrics (6 Cards)
- Win Rate (%)
- Total Trades
- Avg Trade Duration
- Best Strategy (by P&L)
- Sharpe Ratio
- Max Drawdown

#### Live Positions Table
- Market Name mit Icon
- Position (YES/NO)
- Entry Price vs Current Price
- Position Size
- Real-time P&L
- Exit Button

#### Recent Trades
- Zeitstempel
- Market
- Side (Buy/Sell)
- Price & Size
- P&L

#### Strategy Performance
- Bar Chart (P&L per Strategy)
- Win Rate per Strategy
- Trade Count per Strategy

### Markets Screen (`/markets`)

#### Market Scanner
- Live Feed aller aktiven Märkte
- Filter: Category, Volume, End Date
- Sort: Volume, Liquidity, Change, Ending Soon

#### Opportunity Alerts
- 💎 Arbitrage Opportunities
- 🔥 High Volume Markets
- ⏱️ Ending Soon

#### Market Cards
- Kategorie & Badges (Hot, Trending, etc.)
- Mini-Chart (24h Verlauf)
- YES/NO Preise mit Progress Bars
- Stats: Volume, Liquidity, 24h Change, End Date
- Quick Trade Buttons

#### Market Detail Modal
- Großes Price Chart (1H/24H/7D/30D)
- Order Book (Bid/Ask)
- Trade History
- Volume Stats
- Quick Trade

## ⌨️ Keyboard Shortcuts

| Shortcut | Aktion |
|----------|--------|
| `⌘K` / `Ctrl+K` | Quick Trade / Search |
| `⌘R` / `Ctrl+R` | Daten aktualisieren |
| `Esc` | Modal schließen |

## 🎯 Interaktionen

### Real-time Updates
- **P&L** aktualisiert alle 5 Sekunden
- **Positionen** aktualisieren alle 3 Sekunden
- **Marktpreise** simulieren Live-Bewegungen
- **Flash-Effekte** bei signifikanten Änderungen

### Navigation
- Sidebar-Navigation zwischen Pages
- Aktiver Status wird hervorgehoben
- Smooth Transitions

### Trading
- Exit-Position Buttons mit Confirmation
- Quick Trade Modal
- Filter & Sort für Märkte
- Search-Funktion

## 🎨 UI-Highlights

### Glassmorphism
- Semi-transparente Cards
- Blur-Backdrop-Effekte
- Subtile Borders

### Animations
- Hover-Effekte auf Cards
- Pulse-Animation für Status
- Smooth Transitions
- Chart-Animationen

### Visual Hierarchy
- Wichtige Daten größer
- Farben für Profit/Loss
- Icons für schnelle Erkennung
- Badges für Status

## 📱 Responsive

- **Desktop:** Volles Layout mit Sidebar
- **Tablet:** 2-Spalten Grids
- **Mobile:** Single Column, Sidebar ausgeblendet

## 🔧 Anpassung

### Farben ändern
In `styles.css` die CSS-Variablen anpassen:
```css
:root {
    --primary: #2563eb;
    --profit: #10b981;
    --loss: #f43f5e;
    /* ... */
}
```

### Fonts ändern
Google Fonts Links in HTML anpassen und CSS-Variablen updaten.

### Daten-Integration
Die JavaScript-Dateien enthalten Placeholder für:
- WebSocket Connection (`initWebSocket()`)
- API Calls für echte Daten
- Event Handler für Trades

## 🚀 Next Steps

1. **API Integration** - Polymarket API anbinden
2. **WebSocket** - Echtzeit-Daten streamen
3. **Trading Logic** - Buy/Sell Orders implementieren
4. **Auth** - Wallet Connect (MetaMask, etc.)
5. **Settings** - Bot-Konfiguration
6. **Analytics** - Erweiterte Charts & Statistiken

## 📄 Lizenz

Für interne Nutzung im Polymarket Bot Projekt.

---

**Design:** BOLD, kein AI Slop! ✨
**Build:** Mit 🧊 von Molty
