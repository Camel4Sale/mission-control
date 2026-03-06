# Changelog

All notable changes to the Location Analyzer plugin will be documented in this file.

## [1.0.0] - 2024-03-06

### Added
- **Initial Release** - Complete neighborhood analysis plugin for real estate

#### Core Features
- Kriminalitäts-Statistik mit Heatmap-Visualisierung
- Bildung & Betreuung (Schulen, Kitas, Bewertungen)
- Infrastruktur-Score (ÖPNV, Einkaufen, Gesundheit, Freizeit)
- Umwelt & Lebensqualität (Luftqualität, Lärm, Grünflächen)
- Demografie (Bevölkerung, Einkommen, Bildung)
- Zukünftige Entwicklung (Bauprojekte, Wertprognose)

#### Components
- `LocationAnalyzer` - Hauptkomponente für vollständige Analyse
- `ScoreCard` - Übersichtliche Score-Anzeige
- `CrimeHeatmap` - Interaktive Kriminalitäts-Heatmap

#### Hooks
- `useLocationAnalyzer` - Analyse einzelner Standorte
- `useLocationComparison` - Vergleich mehrerer Standorte
- `useAnalysisCategory` - Spezifische Kategorien abrufen
- `useGeolocationAnalysis` - Echtzeit-Analyse mit GPS

#### Services
- OpenStreetMap Overpass API Integration
- OpenRouteService für Routing
- Umweltbundesamt (UBA) Daten
- Destatis Statistik

#### API Routes
- `POST /api/location-analyzer/analyze` - Einzelanalyse
- `POST /api/location-analyzer/compare` - Standortvergleich
- `GET /api/location-analyzer/crime` - Kriminalitätsdaten
- `GET /api/location-analyzer/education` - Bildungsdaten
- `GET /api/location-analyzer/infrastructure` - Infrastruktur
- `GET /api/location-analyzer/environment` - Umweltdaten
- `GET /api/location-analyzer/demographics` - Demografie
- `GET /api/location-analyzer/development` - Entwicklung

#### Utilities
- Distanz- und Zeitberechnungen
- Score-Normalisierung
- Formatierungsfunktionen
- Trend-Indikatoren

### Tech Stack
- Next.js Plugin
- TypeScript
- React 19
- OpenStreetMap
- Lucide Icons

---

## Future Releases

### [1.1.0] - Planned
- Google Maps API Integration
- PDF Report Export
- Vergleichs-Reports für mehrere Standorte
- Investment-Empfehlung mit ML-Modell

### [1.2.0] - Planned
- Historische Datenanalyse
- Preisentwicklungs-Charts
- Benutzerdefinierte Gewichtungen
- Export als CSV/Excel

### [2.0.0] - Planned
- Echtzeit-Datenupdates
- WebSocket für Live-Änderungen
- Benutzerkonten & gespeicherte Analysen
- Team-Kollaboration
