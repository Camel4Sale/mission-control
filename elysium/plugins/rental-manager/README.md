# Elysium Rental Manager 🏠🔑

Vollständiges Vermieter-Toolkit für die Elysium-Plattform.

## Features

### 1. Mietvertrag-Generator
- Verschiedene Vorlagen (Wohnung, Haus, Gewerbe)
- Rechtssicher mit aktuellen Gesetzen (DSGVO, Mietrecht)
- Individualisierung mit User- und Objekt-Daten
- PDF-Export, unterschriftsreif
- Mehrere Sprachen: DE, EN, TR

### 2. Nebenkosten-Abrechnung
- Standard-Vorlagen
- Verteilerschlüssel: Nach qm, Personen, Verbrauch
- Belege-Verwaltung mit Upload und Kategorisierung
- PDF-Export, fristgerecht
- Archiv mit Historie aller Abrechnungen

### 3. Mieteingänge-Tracker
- Bank-Integration via FinTS-API
- Auto-Matching: Welche Miete gehört zu welchem Mieter
- Mahnwesen mit automatischen Erinnerungen
- Dashboard: Offen, Bezahlt, Überfällig
- Export: DATEV, Excel

### 4. Mängelmelder
- Mieter-Portal mit eigenem Login
- Foto-Upload mit Beschreibung
- Priorisierung: Dringend, Normal, Geplant
- Handwerker-Zuweisung mit Kontakt
- Status-Tracking: Offen, In Arbeit, Erledigt

### 5. Handwerker-Verwaltung
- Kontakte: Name, Telefon, Email, Gewerk
- Bewertungen: Preis, Qualität, Pünktlichkeit
- Einsatz-Historie
- Kosten-Tracking pro Objekt

### 6. Mieter-Screening
- SCHUFA-Integration (mit Einwilligung)
- Bonitäts-Check mit Score + Details
- Vorvermieter-Kontakt mit Template-Email
- Einkommens-Nachweis-Prüfung
- Risikobewertung: Grün/Gelb/Rot

### 7. Objekt-Verwaltung
- Alle Objekte in Übersicht
- Details: qm, Zimmer, Baujahr, Lage
- Dokumente: Grundbuch, Energieausweis, etc.
- Wert-Entwicklung: Historie + Prognose

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **PDF:** pdf-lib
- **Banking:** FinTS-API
- **Excel:** ExcelJS
- **Forms:** React Hook Form
- **Validation:** Zod

## Installation

```bash
cd /data/.openclaw/workspace/elysium/plugins/rental-manager
npm install
```

## Entwicklung

```bash
npm run dev
```

Öffne http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Struktur

```
rental-manager/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React-Komponenten
│   │   ├── Dashboard.tsx
│   │   ├── PropertyManager.tsx
│   │   ├── ContractGenerator.tsx
│   │   ├── UtilityBillCreator.tsx
│   │   ├── RentTracker.tsx
│   │   ├── DefectReporter.tsx
│   │   ├── CraftsmenManager.tsx
│   │   └── TenantScreening.tsx
│   ├── lib/              # Business-Logik
│   │   ├── pdf-generator.ts
│   │   ├── banking.ts
│   │   ├── schufa.ts
│   │   └── excel-export.ts
│   ├── types/            # TypeScript-Typen
│   │   └── index.ts
│   └── styles/           # Globale Styles
├── templates/            # PDF-Vorlagen
├── public/              # Statische Assets
└── package.json
```

## API-Integrationen

### FinTS (Banking)
- Bankverbindung herstellen
- Transaktionen abrufen
- Zahlungen automatisch zuordnen

### SCHUFA (Screening)
- Bonitätsprüfung mit Einwilligung
- Score und Details abrufen
- Risikobewertung erstellen

## Rechtliche Hinweise

- Alle Verträge und Abrechnungen sind Muster
- Vor Verwendung durch Rechtsberater prüfen
- DSGVO-konforme Datenverarbeitung implementiert
- Einwilligungen für SCHUFA erforderlich

## Lizenz

Proprietär - Elysium Plattform
