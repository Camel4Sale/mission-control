# 🏠 Buy-to-Let Analyzer

**Elysium Plugin für umfassende Immobilien-Investmentanalyse**

Ein professionelles Next.js-Plugin zur Analyse von Buy-to-Let Immobilieninvestments mit kompletter Finanzierungsrechnung, Cashflow-Analyse, Langzeitprognosen und ETF-Vergleich.

## ✨ Features

### 1. Finanzierungs-Rechner
- Eigenkapital-Optimierung
- Fremdkapital-Berechnung
- Zinssatz (aktuell + Prognose)
- Laufzeiten: 10/15/20/30 Jahre
- Sondertilgung
- Effektivzins-Berechnung

### 2. Cashflow-Analyse
- Mieteinnahmen (Kalt, Warm, Staffel)
- Betriebskosten (Verwaltung, Instandhaltung)
- Finanzierungskosten (Rate, Zinsen)
- Steuern (Einkommen, AfA)
- Cashflow (monatlich, jährlich)
- Cash-on-Cash Rendite
- Brutto- und Nettorendite

### 3. Langzeit-Prognose
- 10/20/30 Jahre Projektion
- Miet-Entwicklung (Inflation, Markt)
- Zins-Entwicklung (Szenarien)
- Wert-Entwicklung (historisch + Prognose)
- Inflation-Hedge (Realwert)

### 4. Szenario-Vergleich
- **Basis**: Erwartete Entwicklung
- **Optimistisch**: Miete +5%, Wert +4%
- **Pessimistisch**: Miete -2%, Wert 0%
- **Zins-Schock**: +3% nach 10 Jahren
- Alle Szenarien nebeneinander vergleichbar

### 5. ETF-Vergleich
- Immobilie vs. ETF (10/20/30 Jahre)
- Rendite-Vergleich (Ø pro Jahr)
- Risiko-Analyse (Volatilität, Drawdown)
- Steuer-Vergleich
- Liquiditäts-Vorteile
- Empfehlung basierend auf Anlegertyp

### 6. Portfolio-Tracker
- Alle Objekte im Überblick
- Gesamt-Rendite (Portfolio-weit)
- Diversifikation (Städte, Typen)
- Risiko-Analyse (Klumpenrisiko)
- Optimierungsempfehlungen

### 7. Exit-Planer
- Verkauf nach X Jahren
- Gewinn (vor/nach Steuer)
- 1%-Regel (Spekulationsfrist)
- Ratenverkauf (Steuer-Stundung)
- Optimaler Verkaufszeitpunkt

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **PDF Export**: jsPDF + autoTable
- **Icons**: Lucide React

## 📁 Projektstruktur

```
buy-to-let/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   └── Tabs.tsx
│   │   ├── FinancingCalculator.tsx
│   │   ├── CashflowAnalyzer.tsx
│   │   ├── LongTermProjection.tsx
│   │   ├── ScenarioComparison.tsx
│   │   ├── ETFComparison.tsx
│   │   ├── PortfolioTracker.tsx
│   │   └── ExitPlanner.tsx
│   ├── lib/
│   │   ├── financing-calculator.ts
│   │   ├── cashflow-analyzer.ts
│   │   ├── long-term-projection.ts
│   │   ├── etf-comparison.ts
│   │   ├── portfolio-tracker.ts
│   │   ├── exit-planner.ts
│   │   ├── pdf-export.ts
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   └── types/
│       └── index.ts
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Installation

```bash
cd /data/.openclaw/workspace/elysium/plugins/buy-to-let
npm install
```

## 🏃‍♂️ Entwicklung

```bash
# Development Server starten
npm run dev

# Production Build
npm run build

# Linting
npm run lint
```

## 📊 Berechnungsmethoden

### Finanzierung
- Annuitätenformel für monatliche Raten
- Effektivzins nach PAngV
- Sondertilgungs-Berücksichtigung

### Cashflow
- Bruttomiete abzüglich Betriebskosten
- Finanzierungskosten
- Steuervorteile durch AfA (2% linear)

### Langzeitprognose
- Compound Interest für Wertentwicklung
- Inflationsbereinigung
- Kumulierter Cashflow über Zeit

### ETF-Vergleich
- Historische Marktrendite: 7% p.a.
- Volatilität: 15%
- Maximaler Drawdown: 50%
- Abgeltungsteuer: 26,375%

## 📄 PDF Export

Das Plugin unterstützt den Export aller Analysen als PDF:
- Finanzierungszusammenfassung
- Cashflow-Analyse
- Langzeitprognosen
- Szenario-Vergleiche
- ETF-Vergleich
- Exit-Planung

## ⚠️ Disclaimer

Dies ist ein Planungstool und ersetzt **keine** professionelle Finanzberatung. Alle Berechnungen basieren auf Annahmen und Prognosen, die in der Realität abweichen können.

### Wichtige Hinweise:
- Steuerliche Behandlung kann individuell variieren
- Mietentwicklungen sind nicht garantiert
- Immobilienwerte können sinken
- Zinsänderungsrisiken beachten
- Liquiditätsreserven einplanen

## 🤝 Beitragende

Entwickelt für Elysium als Open-Source Plugin.

## 📝 Lizenz

MIT License

---

**Viel Erfolg bei deinen Immobilien-Investments! 🏠📈**
