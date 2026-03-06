# Celaris Solar Tool Suite ☀️

Komplette Plugin-Suite für Solar-Potenzialanalyse, Fördermittel, Strompreise, ROI-Berechnung und Community-Vergleich.

## 🚀 Quick Start

```bash
# Installation
npm install @celaris/solar-scout
npm install @celaris/foerdermittel-finder
npm install @celaris/strompreis-tracker
npm install @celaris/roi-rechner
npm install @celaris/nachbar-vergleich
```

## 📦 Plugins

### 1. Solar-Scout API 🛰️
Satellitenbild-basierte Dach-Potenzialanalyse

- Google Maps Integration
- AI-Vision für Dach-Erkennung
- Verschattungsberechnung
- Potenzial-Score (0-100)

```typescript
import { SolarScout } from '@celaris/solar-scout';
const scout = new SolarScout({ googleMapsApiKey, aiVisionEndpoint });
const result = await scout.analyze({ address: '...' });
```

[📖 Dokumentation](./plugins/solar-scout/README.md)

---

### 2. Fördermittel-Finder 💰
Automatisierte Förderungssuche

- BAFA, KfW, Landes- und Kommunalförderungen
- Auto-Eligibility-Check
- Antrags-Assistent
- Fristen-Tracker

```typescript
import { FoerdermittelFinder } from '@celaris/foerdermittel-finder';
const finder = new FoerdermittelFinder({ region: 'BW' });
const result = await finder.find({ projectType: 'photovoltaik' });
```

[📖 Dokumentation](./plugins/foerdermittel-finder/README.md)

---

### 3. Strompreis-Tracker ⚡
Live-Energiepreise und Tarif-Optimierung

- Live-Preise (API)
- AI-Prognose
- Tarif-Vergleich
- Preis-Alarme

```typescript
import { StrompreisTracker } from '@celaris/strompreis-tracker';
const tracker = new StrompreisTracker({ apiEndpoint, region: 'DE' });
const prices = await tracker.getCurrentPrices();
```

[📖 Dokumentation](./plugins/strompreis-tracker/README.md)

---

### 4. ROI-Rechner Pro 📊
Rendite-Berechnung mit 20-Jahres-Prognose

- Ertragsprognose
- Amortisation
- CO₂-Bilanz
- Steuerliche Optimierung

```typescript
import { RoiRechner } from '@celaris/roi-rechner';
const rechner = new RoiRechner({ location, electricityPrice, feedInTariff });
const roi = await rechner.calculateRoi({ investmentCost: 15000, ... });
```

[📖 Dokumentation](./plugins/roi-rechner/README.md)

---

### 5. Nachbar-Vergleich 🏡
Gamification und Community

- Leaderboard
- Social Sharing
- Viral Challenges
- Lead-Generation

```typescript
import { NachbarVergleich } from '@celaris/nachbar-vergleich';
const vergleich = new NachbarVergleich({ region, city });
const leaderboard = await vergleich.getLeaderboard('production');
```

[📖 Dokumentation](./plugins/nachbar-vergleich/README.md)

---

## 🎨 Design System

- **Farben**: Eco-Friendly (Grün, Weiß, Natur)
- **Stil**: Clean, Modern, Trust-building
- **Optimierung**: Conversion-optimized
- **Responsive**: Mobile-First

```typescript
// Tailwind CSS Config
module.exports = {
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
      },
    },
  },
};
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Google Maps API
- **AI**: Vision API für Satellitenbilder
- **Database**: PostgreSQL (empfohlen)

## 📁 Projektstruktur

```
celaris/
├── plugins/
│   ├── solar-scout/
│   │   ├── index.ts
│   │   ├── services/
│   │   └── README.md
│   ├── foerdermittel-finder/
│   │   ├── index.ts
│   │   ├── services/
│   │   └── README.md
│   ├── strompreis-tracker/
│   │   ├── index.ts
│   │   ├── services/
│   │   └── README.md
│   ├── roi-rechner/
│   │   ├── index.ts
│   │   ├── services/
│   │   └── README.md
│   └── nachbar-vergleich/
│       ├── index.ts
│       ├── services/
│       └── README.md
├── package.json
└── README.md
```

## 🔌 API Integration

### Google Maps API

```env
GOOGLE_MAPS_API_KEY=your_key_here
```

[API Key erhalten](https://console.cloud.google.com/)

### Energiepreis-API

```env
ENERGY_PRICE_API_ENDPOINT=https://api.awattar.de/v1
```

### AI Vision API

```env
AI_VISION_ENDPOINT=https://your-vision-api.com/analyze
```

## 🚀 Deployment

```bash
# Build
npm run build

# Test
npm test

# Deploy
npm publish
```

## 📊 Beispiel-Workflow

```typescript
import { SolarScout } from '@celaris/solar-scout';
import { FoerdermittelFinder } from '@celaris/foerdermittel-finder';
import { RoiRechner } from '@celaris/roi-rechner';
import { StrompreisTracker } from '@celaris/strompreis-tracker';
import { NachbarVergleich } from '@celaris/nachbar-vergleich';

// 1. Dach analysieren
const scout = new SolarScout(config);
const dach = await scout.analyze({ address: 'Musterstraße 1, Stuttgart' });

// 2. Förderungen finden
const finder = new FoerdermittelFinder({ region: 'BW' });
const foerderung = await finder.find({
  projectType: 'photovoltaik',
  investmentAmount: 15000,
});

// 3. ROI berechnen
const rechner = new RoiRechner({
  location: { lat: 48.77, lng: 9.18 },
  electricityPrice: 35,
  feedInTariff: 8.2,
});
const roi = await rechner.calculateRoi({
  investmentCost: 15000,
  annualSavings: 1200,
  annualRevenue: 300,
  annualMaintenance: 150,
  taxRate: 0.3,
  inflationRate: 0.02,
  energyPriceIncrease: 0.05,
  systemLifetime: 20,
});

// 4. Strompreis-Optimierung
const tracker = new StrompreisTracker({ apiEndpoint, region: 'DE' });
const preise = await tracker.getCurrentPrices();

// 5. Community beitreten
const vergleich = new NachbarVergleich({ region: 'BW', city: 'Stuttgart' });
await vergleich.registerDach({
  id: 'dach_123',
  kwp: dach.estimatedKwp,
  annualProduction: dach.estimatedKwp * 950,
  co2Savings: dach.estimatedKwp * 400,
  potentialScore: dach.potentialScore,
});
```

## 📈 Roadmap

- [ ] Next.js Frontend Integration
- [ ] Google Maps API Live-Integration
- [ ] AI Vision Model Training
- [ ] Fördermittel-API Anbindung
- [ ] Echtzeit-Strompreise
- [ ] Mobile App (React Native)

## 📄 License

MIT © 2026 Celaris

---

**Build the future of solar! ☀️🚀**
