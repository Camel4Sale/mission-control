# Solar-Scout API 🛰️

Satellitenbild-basierte Dach-Potenzialanalyse mit Google Maps Integration.

## Features

- 🗺️ Google Maps Integration
- 🖼️ Satellitenbild-Analyse (AI-Vision)
- 🏠 Dach-Potenzial Erkennung
- 🌳 Verschattungsberechnung
- 🧭 Ausrichtung + Neigung
- 📊 Potenzial-Score (0-100)
- 🔌 REST API für andere Tools

## Installation

```bash
npm install @celaris/solar-scout
```

## Usage

```typescript
import { SolarScout } from '@celaris/solar-scout';

const scout = new SolarScout({
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  aiVisionEndpoint: process.env.AI_VISION_ENDPOINT,
});

// Analyse einer Adresse
const result = await scout.analyze({
  address: 'Musterstraße 1, 10117 Berlin',
  radius: 50, // Meter
});

console.log(result);
// {
//   coordinates: { lat: 52.52, lng: 13.405 },
//   roofArea: 85.5, // m²
//   orientation: 180, // Grad (Süd)
//   inclination: 35, // Grad
//   shadingFactor: 0.85, // 0-1
//   potentialScore: 78, // 0-100
//   estimatedKwp: 12.5,
//   satelliteImage: 'data:image/png;base64,...'
// }
```

## API Endpoints

### POST /api/solar-scout/analyze

```json
{
  "address": "string",
  "radius": "number (optional, default: 50)"
}
```

### POST /api/solar-scout/coordinates

```json
{
  "lat": "number",
  "lng": "number",
  "radius": "number (optional)"
}
```

## Environment Variables

```env
GOOGLE_MAPS_API_KEY=your_key_here
AI_VISION_ENDPOINT=https://your-ai-vision-api.com
```

## Response Schema

```typescript
interface SolarScoutResult {
  coordinates: { lat: number; lng: number };
  roofArea: number; // m²
  orientation: number; // Grad (0-360)
  inclination: number; // Grad (0-90)
  shadingFactor: number; // 0-1 (1 = keine Verschattung)
  potentialScore: number; // 0-100
  estimatedKwp: number;
  satelliteImage?: string; // Base64
  analysis: {
    roofSegments: RoofSegment[];
    obstacles: Obstacle[];
    sunHours: number; // Jahresdurchschnitt
  };
}
```

## License

MIT © Celaris
