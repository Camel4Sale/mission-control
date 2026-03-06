# Fördermittel-Finder 💰

Automatisierte Förderungssuche für Solaranlagen mit BAFA, KfW und regionalen Programmen.

## Features

- 🏛️ BAFA-Förderungen (alle Programme)
- 🏦 KfW-Kredite (alle Varianten)
- 🗺️ Landes-Förderungen (BW, BY, etc.)
- 🏘️ Kommunale Förderungen
- ✅ Auto-Eligibility-Check
- 📝 Antrags-Assistent
- 📅 Fristen-Tracker

## Installation

```bash
npm install @celaris/foerdermittel-finder
```

## Usage

```typescript
import { FoerdermittelFinder } from '@celaris/foerdermittel-finder';

const finder = new FoerdermittelFinder({
  region: 'BW', // Baden-Württemberg
  postalCode: '70173',
});

// Verfügbare Förderungen finden
const results = await finder.find({
  projectType: 'photovoltaik',
  investmentAmount: 15000, // €
  roofArea: 80, // m²
});

console.log(results);
// {
//   totalPotential: 4500, // €
//   programs: [
//     {
//       name: 'BAFA PV-Speicher',
//       amount: 1500,
//       type: 'grant',
//       deadline: '2026-12-31',
//       eligibility: { met: true, score: 95 }
//     },
//     // ...
//   ]
// }

// Antrags-Assistent starten
const application = await finder.createApplication('bafa-pv-speicher', {
  applicant: { name: 'Max Mustermann', address: '...' },
  system: { kwp: 10, storage: 8 },
});
```

## API Endpoints

### POST /api/foerdermittel/find

```json
{
  "projectType": "photovoltaik | solarthermie | speicher",
  "investmentAmount": "number",
  "roofArea": "number",
  "postalCode": "string",
  "region": "string"
}
```

### GET /api/foerdermittel/programs/:programId

```json
{
  "id": "string",
  "name": "string",
  "provider": "BAFA | KfW | Land | Kommune",
  "description": "string",
  "maxAmount": "number",
  "conditions": "array",
  "deadline": "string | null",
  "applicationUrl": "string"
}
```

### POST /api/foerdermittel/application/create

```json
{
  "programId": "string",
  "applicant": "object",
  "system": "object",
  "documents": "array"
}
```

## Förderprogramme (Beispiele)

### BAFA

- **PV-Speicher**: Bis zu 1.500€ für Batteriespeicher
- **Solarthermie**: Bis zu 2.500€ für Warmwasser
- **Kombinationsbonus**: +30% bei PV + Speicher

### KfW

- **KfW 270**: Erneuerbare Energien (bis 100% Finanzierung)
- **KfW 300**: Wohneigentum (niedriger Zins)
- **KfW 461**: Energieeffizienz-Experte

### Landesförderungen

- **BW**: Solaroffensive Baden-Württemberg
- **BY**: Bayern Solar
- **NRW**: Progressiv NRW
- **HE**: Hessen Energie

## Environment Variables

```env
FOERDERMITTEL_API_KEY=your_key_here
REGION_API_ENDPOINT=https://api.foerderdatenbank.de
```

## Response Schema

```typescript
interface Foerderprogramm {
  id: string;
  name: string;
  provider: 'BAFA' | 'KfW' | 'Land' | 'Kommune';
  type: 'grant' | 'loan' | 'tax_credit';
  amount: number; // € oder %
  maxAmount?: number; // €
  interestRate?: number; // % bei Krediten
  conditions: string[];
  eligibility: {
    met: boolean;
    score: number; // 0-100
    missing: string[];
  };
  deadline?: string; // ISO date
  applicationUrl: string;
  documents: string[];
  processingTime: string; // "4-6 Wochen"
}

interface FoerdermittelResult {
  totalPotential: number; // €
  programs: Foerderprogramm[];
  recommended: Foerderprogramm[];
  applicationDeadline?: string;
  nextSteps: string[];
}
```

## License

MIT © Celaris
