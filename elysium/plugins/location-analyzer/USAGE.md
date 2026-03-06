# Location Analyzer Plugin - Nutzungshandbuch

## Schnellstart

### Installation

```bash
cd /data/.openclaw/workspace/elysium/plugins/location-analyzer
npm install
```

### Grundlegende Verwendung

```tsx
import { LocationAnalyzer } from '@elysium/location-analyzer';

function PropertyPage() {
  return (
    <LocationAnalyzer
      latitude={52.5200}
      longitude={13.4050}
      radius={1000}
      onAnalysisComplete={(analysis) => {
        console.log('Analyse abgeschlossen:', analysis);
      }}
    />
  );
}
```

## Komponenten

### LocationAnalyzer

Die Hauptkomponente für vollständige Standortanalysen.

**Props:**
- `latitude: number` - Breitengrad (Pflicht)
- `longitude: number` - Längengrad (Pflicht)
- `radius?: number` - Suchradius in Metern (Standard: 1000)
- `onAnalysisComplete?: (analysis) => void` - Callback bei Abschluss

**Beispiel:**
```tsx
<LocationAnalyzer
  latitude={48.1351}
  longitude={11.5820}
  radius={1500}
  onAnalysisComplete={(data) => saveToDatabase(data)}
/>
```

### ScoreCard

Zeigt die Analyse-Scores in kompakter oder ausführlicher Ansicht.

**Props:**
- `analysis: LocationAnalysis` - Analyse-Daten (Pflicht)
- `compact?: boolean` - Kompakte Ansicht (Standard: false)

**Beispiel:**
```tsx
<ScoreCard analysis={analysisData} compact={true} />
```

### CrimeHeatmap

Interaktive Heatmap für Kriminalitätsdaten.

**Props:**
- `points: HeatmapPoint[]` - Heatmap-Datenpunkte
- `center: { latitude, longitude }` - Zentrum der Karte
- `radius: number` - Radius in Metern
- `selectedCategory?: CrimeCategory | 'all'` - Gefilterte Kategorie
- `onPointClick?: (point) => void` - Klick-Handler

**Beispiel:**
```tsx
<CrimeHeatmap
  points={crimeData.heatmapPoints}
  center={{ latitude: 52.52, longitude: 13.405 }}
  radius={1000}
  selectedCategory="all"
  onPointClick={(point) => console.log(point)}
/>
```

## Hooks

### useLocationAnalyzer

Analysiert einen einzelnen Standort.

```tsx
import { useLocationAnalyzer } from '@elysium/location-analyzer';

function MyComponent() {
  const { analysis, loading, error, runAnalysis } = useLocationAnalyzer(
    { latitude: 52.52, longitude: 13.405 },
    { radius: 1000, autoAnalyze: true }
  );

  if (loading) return <div>Lädt...</div>;
  if (error) return <div>Fehler: {error}</div>;

  return <div>Score: {analysis?.overallScore}</div>;
}
```

**Optionen:**
- `radius?: number` - Suchradius (Standard: 1000)
- `autoAnalyze?: boolean` - Automatische Analyse (Standard: true)
- `debounceMs?: number` - Debounce-Zeit (Standard: 500)

### useLocationComparison

Vergleicht mehrere Standorte miteinander.

```tsx
import { useLocationComparison } from '@elysium/location-analyzer';

function ComparisonTool() {
  const {
    locations,
    analyses,
    winner,
    addLocation,
    removeLocation,
    compare,
  } = useLocationComparison(1000);

  const handleCompare = async () => {
    await compare();
    console.log('Gewinner:', winner);
  };

  return (
    <div>
      <button onClick={handleCompare}>Vergleichen</button>
      {winner && <p>Bester Standort: {winner}</p>}
    </div>
  );
}
```

### useAnalysisCategory

Ruft spezifische Kategorien separat ab.

```tsx
import { useAnalysisCategory } from '@elysium/location-analyzer';

function CrimeView() {
  const { data: crimeData, loading, refresh } = useAnalysisCategory(
    { latitude: 52.52, longitude: 13.405 },
    'crime',
    1000
  );

  return <div>Safety Score: {crimeData?.safetyScore}</div>;
}
```

**Kategorien:**
- `'crime'` - Kriminalität
- `'education'` - Bildung
- `'infrastructure'` - Infrastruktur
- `'environment'` - Umwelt
- `'demographics'` - Demografie
- `'development'` - Entwicklung

### useGeolocationAnalysis

Analysiert den aktuellen GPS-Standort.

```tsx
import { useGeolocationAnalysis } from '@elysium/location-analyzer';

function CurrentLocationAnalysis() {
  const {
    currentCoordinates,
    analysis,
    permission,
    loading,
  } = useGeolocationAnalysis({
    radius: 1000,
    watchPosition: true,
    enableHighAccuracy: true,
  });

  if (permission === 'denied') {
    return <div>Standortzugriff verweigert</div>;
  }

  return <div>Aktueller Score: {analysis?.overallScore}</div>;
}
```

## API Routes

### Analyse eines Standorts

```typescript
POST /api/location-analyzer/analyze

Body:
{
  "latitude": 52.5200,
  "longitude": 13.4050,
  "radius": 1000
}

Response: LocationAnalysis
```

### Vergleich mehrerer Standorte

```typescript
POST /api/location-analyzer/compare

Body:
{
  "locations": [
    { "id": "loc1", "latitude": 52.52, "longitude": 13.405, "radius": 1000 },
    { "id": "loc2", "latitude": 48.135, "longitude": 11.582, "radius": 1000 }
  ]
}

Response:
{
  "locations": [...],
  "winner": "loc1",
  "scores": { ... }
}
```

### Einzelne Kategorien abrufen

```typescript
GET /api/location-analyzer/crime?lat=52.52&lon=13.405&radius=1000
GET /api/location-analyzer/education?lat=52.52&lon=13.405
GET /api/location-analyzer/infrastructure?lat=52.52&lon=13.405
GET /api/location-analyzer/environment?lat=52.52&lon=13.405
GET /api/location-analyzer/demographics?lat=52.52&lon=13.405
GET /api/location-analyzer/development?lat=52.52&lon=13.405
```

## Datenstrukturen

### LocationAnalysis

```typescript
interface LocationAnalysis {
  location: Location;
  radius: number;
  timestamp: string;
  
  crime: CrimeData;
  education: EducationData;
  infrastructure: InfrastructureData;
  environment: EnvironmentData;
  demographics: DemographicData;
  development: DevelopmentData;
  
  overallScore: number; // 0-100
  investmentRecommendation: 'buy' | 'hold' | 'avoid';
  recommendationReasons: string[];
}
```

### Scores

Alle Scores reichen von 0-100:
- **90-100:** Exzellent
- **75-89:** Sehr gut
- **60-74:** Gut
- **40-59:** Durchschnittlich
- **0-39:** Schlecht

## Best Practices

### Performance

1. **Caching:** Analysen für gleiche Koordinaten cachen
2. **Debounce:** Bei sich ändernden Koordinaten Debounce verwenden
3. **Lazy Loading:** Komponenten nur bei Bedarf laden

```tsx
// Gutes Beispiel
const { analysis } = useLocationAnalyzer(coords, {
  debounceMs: 1000,
  autoAnalyze: true,
});
```

### Fehlerbehandlung

```tsx
const { analysis, loading, error, runAnalysis } = useLocationAnalyzer(coords);

if (error) {
  return (
    <div>
      <p>Fehler: {error}</p>
      <button onClick={runAnalysis}>Erneut versuchen</button>
    </div>
  );
}
```

### Barrierefreiheit

- Alle interaktiven Elemente mit Tastatur bedienbar
- Ausreichende Kontraste für Scores
- Screen-Reader-freundliche Labels

## API Keys konfigurieren

Für volle Funktionalität API Keys in `.env.local` hinterlegen:

```env
GOOGLE_MAPS_API_KEY=AIzaSy...
OPENROUTESERVICE_API_KEY=5b3ce359...
```

## Support

Bei Fragen oder Problemen:
- Dokumentation: `/elysium/plugins/location-analyzer/README.md`
- Issues: GitHub Issues erstellen
- Beispiele: `/tests/` Ordner
