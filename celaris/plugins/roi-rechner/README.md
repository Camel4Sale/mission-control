# ROI-Rechner Pro 📊

Professionelle Rendite-Berechnung für Solaranlagen mit 20-Jahres-Prognose.

## Features

- 🏠 Dachfläche → Leistung (kWp)
- ⚡ Jahresertrag (kWh)
- 💰 Einsparung (€/Jahr)
- 🌱 CO₂-Einsparung (kg/Jahr)
- 📈 Amortisation (Jahre)
- 📉 ROI (vor/nach Steuer)
- 🔮 20-Jahres-Prognose

## Installation

```bash
npm install @celaris/roi-rechner
```

## Usage

```typescript
import { RoiRechner } from '@celaris/roi-rechner';

const rechner = new RoiRechner({
  location: { lat: 48.7758, lng: 9.1829 }, // Stuttgart
  electricityPrice: 35, // ct/kWh
  feedInTariff: 8.2, // ct/kWh (EEG 2024)
});

// Ertragsprognose
const production = await rechner.estimateProduction({
  kwp: 10,
  orientation: 180, // Süd
  inclination: 35,
  shadingFactor: 0.9,
  systemEfficiency: 0.85,
});

console.log(`Jahresertrag: ${production.annualProduction} kWh`);

// ROI berechnen
const roi = await rechner.calculateRoi({
  investmentCost: 15000, // €
  annualSavings: 1200, // €/Jahr
  annualRevenue: 300, // €/Jahr Einspeisevergütung
  annualMaintenance: 150, // €/Jahr
  taxRate: 0.3, // 30%
  inflationRate: 0.02,
  energyPriceIncrease: 0.05,
  systemLifetime: 20,
});

console.log(`Amortisation: ${roi.paybackPeriod} Jahre`);
console.log(`ROI: ${roi.roi}%`);

// CO₂-Bilanz
const co2 = await rechner.calculateCo2({
  annualProduction: 9500,
  selfConsumption: 3000,
  gridFeedIn: 6500,
});

console.log(`CO₂-Einsparung: ${co2.annualCo2Savings} kg/Jahr`);
```

## API Endpoints

### POST /api/roi/estimate

```json
{
  "kwp": 10,
  "orientation": 180,
  "inclination": 35,
  "location": { "lat": 48.77, "lng": 9.18 },
  "shadingFactor": 0.9
}
```

### POST /api/roi/calculate

```json
{
  "investmentCost": 15000,
  "annualSavings": 1200,
  "annualRevenue": 300,
  "annualMaintenance": 150,
  "taxRate": 0.3,
  "inflationRate": 0.02,
  "energyPriceIncrease": 0.05,
  "systemLifetime": 20
}
```

### GET /api/roi/co2

```json
{
  "annualProduction": 9500,
  "selfConsumption": 3000,
  "gridFeedIn": 6500,
  "co2FactorGrid": 420
}
```

## Response Schema

```typescript
interface ProductionEstimate {
  annualProduction: number; // kWh/Jahr
  monthlyProduction: number[]; // kWh pro Monat
  dailyAverage: number; // kWh/Tag
  specificYield: number; // kWh/kWp
  co2Avoided: number; // kg/Jahr
}

interface RoiResult {
  paybackPeriod: number; // Jahre
  roi: number; // %
  roiAfterTax: number; // %
  netPresentValue: number; // €
  internalRateOfReturn: number; // %
  totalProfit: number; // €
  breakEvenYear: number;
}

interface Co2Result {
  annualCo2Savings: number; // kg/Jahr
  lifetimeCo2Savings: number; // kg über Lebensdauer
  equivalentTrees: number; // Bäume
  equivalentCarKm: number; // km
  equivalentHouseholds: number; // Haushalte
}
```

## Annahmen

- **Basisertrag**: 950 kWh/kWp (Deutschland, optimal)
- **Systemlebensdauer**: 20-25 Jahre
- **Degradation**: 0.5% pro Jahr (in Prognose berücksichtigt)
- **Wartung**: 1% der Investition pro Jahr
- **CO₂-Faktor**: 420 g/kWh (deutscher Strommix 2024)

## License

MIT © Celaris
