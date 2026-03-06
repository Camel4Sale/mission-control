# Strompreis-Tracker ⚡

Live-Energiepreise, Prognosen und intelligente Tarif-Empfehlungen.

## Features

- 📊 Live-Energiepreise (API)
- 📈 Preis-Historie (Charts)
- 🔮 Prognose (AI-basiert)
- 💰 Einsparungs-Rechner
- 🔄 Tarif-Vergleich
- 💡 Wechsel-Empfehlung
- 🚨 Alert bei Preis-Spitzen

## Installation

```bash
npm install @celaris/strompreis-tracker
```

## Usage

```typescript
import { StrompreisTracker } from '@celaris/strompreis-tracker';

const tracker = new StrompreisTracker({
  apiEndpoint: process.env.ENERGY_PRICE_API,
  region: 'DE',
});

// Aktuelle Preise
const prices = await tracker.getCurrentPrices();
console.log(`Aktueller Preis: ${prices[0].pricePerKwh} ct/kWh`);

// Analyse
const analysis = await tracker.analyze({ days: 30 });
console.log(`Durchschnitt: ${analysis.average} ct/kWh`);
console.log(`Trend: ${analysis.trend}`);

// Einsparungspotenzial
const savings = await tracker.calculateSavings({
  annualConsumption: 4000, // kWh
  currentTarif: { basePrice: 10, workingPrice: 35 },
});
console.log(`Potenzielle Ersparnis: ${savings.potentialSavings} €/Jahr`);

// Alarm erstellen
await tracker.createAlert({
  type: 'spike',
  threshold: 50, // ct/kWh
  channels: ['push'],
});
```

## API Endpoints

### GET /api/strompreis/current

```json
{
  "region": "DE",
  "prices": [
    {
      "timestamp": "2026-03-06T11:00:00Z",
      "pricePerKwh": 32.5,
      "co2Intensity": 400,
      "renewableShare": 0.45
    }
  ]
}
```

### GET /api/strompreis/forecast

```json
{
  "forecast": [
    {
      "timestamp": "2026-03-06T12:00:00Z",
      "pricePerKwh": 28.3,
      "confidence": 0.85
    }
  ]
}
```

### POST /api/strompreis/compare

```json
{
  "annualConsumption": 4000,
  "currentTarif": {
    "basePrice": 10,
    "workingPrice": 35
  }
}
```

### POST /api/strompreis/alert

```json
{
  "type": "spike",
  "threshold": 50,
  "direction": "above",
  "channels": ["push", "email"]
}
```

## Environment Variables

```env
ENERGY_PRICE_API_KEY=your_key_here
ENERGY_PRICE_API_ENDPOINT=https://api.awattar.de/v1
REGION=DE
```

## Response Schema

```typescript
interface PriceData {
  timestamp: string;
  pricePerKwh: number; // ct/kWh
  co2Intensity: number; // g/kWh
  renewableShare: number; // 0-1
}

interface PriceAnalysis {
  average: number;
  min: number;
  max: number;
  volatility: number;
  trend: 'rising' | 'falling' | 'stable';
  bestHours: string[];
  worstHours: string[];
}

interface SavingsOpportunity {
  potentialSavings: number; // €/Jahr
  optimalUsageHours: string[];
  recommendation: string;
}

interface TarifComparison {
  currentCost: number; // €/Jahr
  potentialTariffs: Array<{
    tarif: Tarif;
    annualCost: number;
    savings: number;
  }>;
  recommendation: Tarif | null;
}
```

## Datenquellen

- **awattar**: Strombörse EPEX Spot
- **Fraunhofer ISE**: CO₂-Intensität
- **SMARD**: Erneuerbare-Anteile
- **Vergleichsportale**: Tarif-Daten

## License

MIT © Celaris
