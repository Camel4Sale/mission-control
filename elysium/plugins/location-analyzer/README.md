# Elysium Location Analyzer Plugin

Tiefgehende Nachbarschafts-Analyse für Immobilien mit umfassenden Daten zu Kriminalität, Bildung, Infrastruktur, Umwelt, Demografie und zukünftiger Entwicklung.

## Features

### 1. 🚨 Kriminalitäts-Statistik
- Polizeiliche Kriminalstatistik pro Stadtteil
- Heatmap-Visualisierung
- Kategorien: Gewalt, Eigentum, Drogen
- Trend-Analyse (steigend/fallend)
- Vergleich: Stadtteil vs. Stadt vs. Land

### 2. 🎓 Bildung & Betreuung
- Schulen & Kitas in der Nähe
- Bewertungen (Lehrer, Ausstattung, Noten)
- Verfügbarkeits-Check
- Entfernungen (Laufzeit, Fahrzeit)
- Geplante Bildungsprojekte

### 3. 🏗️ Infrastruktur-Score
- ÖPNV: Haltestellen, Taktung, Verbindungen
- Einkaufen: Supermärkte, Bäcker, Apotheke
- Gesundheit: Ärzte, Krankenhäuser
- Freizeit: Parks, Restaurants, Kino
- Gesamt-Score: 0-100

### 4. 🌳 Umwelt & Lebensqualität
- Luftqualität: Feinstaub, NO2, O3
- Lärm-Belastung: Straßenverkehr, Fluglärm
- Grünflächen: Parks, Wälder, Wasser
- Klima-Daten: Temperatur, Niederschlag

### 5. 👥 Demografie
- Bevölkerung: Alter, Geschlecht, Nationalität
- Einkommen: Ø Haushaltseinkommen
- Arbeitslosigkeit: Quote, Entwicklung
- Bildung: Akademiker-Quote

### 6. 📈 Zukünftige Entwicklung
- Bauprojekte: Geplant, In Bau
- Stadtentwicklung: Masterpläne
- Investitionen: Öffentliche Mittel
- Prognose: Wert-Entwicklung

### 7. 📄 Report-Generator
- PDF-Export: Komplette Analyse
- Score-Card: 1 Seite Summary
- Vergleich: Mehrere Standorte
- Investment-Empfehlung: Kaufen/Halten/Vermeiden

## Tech Stack

- **Framework:** Next.js Plugin
- **Language:** TypeScript
- **Karten:** Google Maps API + OpenStreetMap
- **Datenquellen:**
  - Umwelt-APIs (UBA - Umweltbundesamt)
  - Statistik-APIs (Destatis)
  - OpenStreetMap Overpass API
  - Polizeiliche Kriminalstatistik (BKA)

## Installation

```bash
cd /data/.openclaw/workspace/elysium/plugins/location-analyzer
npm install
```

## API Keys konfigurieren

Erstelle `.env.local`:

```env
GOOGLE_MAPS_API_KEY=your_key_here
OPENROUTESERVICE_API_KEY=your_key_here
```

## Nutzung

```typescript
import { LocationAnalyzer } from '@/elysium/plugins/location-analyzer';

<LocationAnalyzer
  latitude={52.5200}
  longitude={13.4050}
  radius={1000} // Meter
/>
```

## Daten-Integrationen

### Kriminalitätsdaten
- Quelle: BKA Polizeiliche Kriminalstatistik
- Update: Jährlich
- Granularität: Stadtteil-Ebene

### Bildungsdaten
- Quelle: OpenStreetMap + Schuldatenbanken
- Update: Echtzeit
- Granularität: Einzelne Einrichtungen

### Umweltdaten
- Quelle: Umweltbundesamt (UBA)
- Update: Stündlich/Täglich
- Granularität: Messstations-Ebene

### Demografiedaten
- Quelle: Destatis (Statistisches Bundesamt)
- Update: Jährlich
- Granularität: Stadtbezirk-Ebene

## License

MIT
