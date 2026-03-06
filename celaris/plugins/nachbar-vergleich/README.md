# Nachbar-Vergleich 🏡

Gamification und Community-Vergleich für Solaranlagen-Besitzer.

## Features

- 🎮 Gamification ("Dein Dach vs. Straße")
- 🏆 Leaderboard (beste Solar-Dächer)
- 📱 Social Sharing
- 🦠 Viral-Mechanik
- 🎯 Lead-Gen durch Teilen
- 📊 Community-Stats

## Installation

```bash
npm install @celaris/nachbar-vergleich
```

## Usage

```typescript
import { NachbarVergleich } from '@celaris/nachbar-vergleich';

const vergleich = new NachbarVergleich({
  region: 'Baden-Württemberg',
  city: 'Stuttgart',
});

// Dach registrieren
await vergleich.registerDach({
  id: 'dach_123',
  address: 'Musterstraße 1',
  kwp: 10,
  annualProduction: 9500,
  co2Savings: 4000,
  potentialScore: 85,
});

// Leaderboard abrufen
const leaderboard = await vergleich.getLeaderboard('production', 10);
console.log('Top 10 Stromproduzenten:', leaderboard);

// Eigene Platzierung
const ranking = await vergleich.getRanking('dach_123', 'efficiency');
console.log(`Dein Rang: ${ranking.rank} von ${ranking.total}`);

// Teilen
const shareUrl = vergleich.generateShareUrl('whatsapp', {
  title: 'Meine Solar-Anlage',
  description: 'Ich produziere jetzt sauberen Strom!',
  url: 'https://celaris.com/my-dach',
  hashtags: ['#Solar', '#CleanEnergy'],
});

// Community-Stats
const stats = await vergleich.getCommunityStats();
console.log(`Gesamt: ${stats.totalDächer} Dächer, ${stats.totalCo2Savings}t CO₂ gespart`);
```

## API Endpoints

### POST /api/nachbar/register

```json
{
  "address": "string",
  "kwp": "number",
  "annualProduction": "number",
  "co2Savings": "number",
  "potentialScore": "number"
}
```

### GET /api/nachbar/leaderboard/:category

```json
{
  "category": "production | efficiency | climate | potential | size",
  "limit": 10,
  "entries": [
    {
      "rank": 1,
      "score": 9500,
      "badge": "🏆",
      "dach": { "kwp": 10, "address": "..." }
    }
  ]
}
```

### GET /api/nachbar/ranking/:dachId

```json
{
  "dachId": "string",
  "category": "string",
  "ranking": {
    "rank": 5,
    "total": 100,
    "percentile": 95
  }
}
```

### POST /api/nachbar/share

```json
{
  "platform": "whatsapp | facebook | twitter",
  "dachId": "string",
  "message": "string (optional)"
}
```

## Gamification-Elemente

### Badges

- 🚀 **Pionier** - Erste Anlage in der Straße
- 🏆 **Champion** - Platz 1 in einer Kategorie
- ⭐ **Top 10** - Unter den besten 10
- 🌍 **Klimaretter** - 10+ Tonnen CO₂ gespart
- ⚡ **Stromproduzent** - 10.000+ kWh produziert
- 💎 **Effizient** - 1000+ kWh/kWp

### Leaderboard-Kategorien

1. **Stromproduzent** ⚡ - Meiste produzierte kWh
2. **Effizienz-Champion** 🎯 - Bester Ertrag pro kWp
3. **Klimaretter** 🌱 - Meiste CO₂-Einsparung
4. **Potenzial-König** 👑 - Höchster Potenzial-Score
5. **Kraftwerk** 🏭 - Größte Anlage (kWp)

## Viral-Mechanik

### Challenges

- **Nachbar-Challenge** - Wer hat das bessere Dach?
- **Straßen-Ranking** - Solaraktivste Straße
- **Stadt-Challenge** - Welche Stadt wird #1?

### Referral-Programm

- Teile deinen Link
- Freunde registrieren sich
- Beide erhalten Bonus-Punkte
- Steige im Ranking auf

## Privacy

- Adressen werden anonymisiert
- Eigentümer-Names optional
- Opt-out jederzeit möglich
- DSGVO-konform

## License

MIT © Celaris
