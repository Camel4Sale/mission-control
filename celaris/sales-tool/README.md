# ☀️ Celaris Solar Sales Tool

Ein modernes Sales-Tool für Solar-Unternehmen zur Lead-Generierung und Angebotserstellung.

## 🚀 Features

### 1. Solar-Rechner (ROI Calculator)
- Dachfläche, Ausrichtung, Neigungswinkel, Stromverbrauch eingeben
- Berechnet automatisch:
  - Max. Leistung (kWp)
  - Jahresertrag (kWh)
  - Einsparung (€/Jahr)
  - CO₂-Einsparung (kg/Jahr)
  - Amortisation (Jahre)
  - Förderung (BAFA, KfW)

### 2. Lead-Generator
- Lead-Management mit Pipeline (Neu, Kontaktiert, Angebot, Abschluss)
- Potenzial-Scoring (A-F)
- Kunden-Historie und Notizen
- Tasks & Reminders

### 3. Angebotsersteller
- PDF-Generator mit pdf-lib
- Multiple Varianten (Basic, Pro, Premium)
- Module-Auswahl (Tesla, SunPower, etc.)
- Speicher-Optionen
- Finanzierung (Kredit, Lease, PPA)

### 4. CRM Light
- Leads verwalten
- Pipeline-Übersicht
- Kunden-Historie
- Notizen & Tasks

### 5. Vergleichs-Rechner
- Celaris vs. Wettbewerber
- Preis-, Leistungs- und Garantie-Vergleich
- Automatische Vorteils-Darstellung

### 6. Referenz-Projekte
- Gallery mit Installationen
- Vorher/Nachher Darstellung
- Kunden-Testimonials
- Statistiken (kWp installiert, CO₂ gespart)

### 7. Termin-Bucher
- Kalender-Integration
- Slot-Auswahl
- Auto-Confirmations
- Reminder (E-Mail, SMS)

## 🛠 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **PDF:** pdf-lib
- **Icons:** Lucide React
- **Deployment:** Vercel-ready

## 📦 Installation

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn

### Setup

```bash
# Clone repository
cd celaris/sales-tool

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die App ist nun unter http://localhost:3000 verfügbar.

## 🌐 Deployment auf Vercel

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel
```

Oder direkt über GitHub:
1. Repository auf GitHub pushen
2. Unter vercel.com importieren
3. Automatische Deployments bei jedem Push

## 📁 Projektstruktur

```
celaris/sales-tool/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Solar-Rechner (Home)
│   │   ├── leads/
│   │   │   └── page.tsx          # Lead Management
│   │   ├── quotes/
│   │   │   └── page.tsx          # Angebotserstellung
│   │   ├── comparison/
│   │   │   └── page.tsx          # Vergleichs-Rechner
│   │   ├── references/
│   │   │   └── page.tsx          # Referenz-Projekte
│   │   ├── appointments/
│   │   │   └── page.tsx          # Termin-Bucher
│   │   ├── layout.tsx            # Root Layout mit Navigation
│   │   └── globals.css           # Globale Styles
│   ├── components/
│   │   └── Navigation.tsx        # Hauptnavigation
│   ├── lib/
│   │   └── solar-calculator.ts   # Solar-Berechnungslogik
│   └── types/
│       └── index.ts              # TypeScript Types
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Design-Prinzipien

- **Eco-Friendly:** Grün, Weiß, Natur-Farben
- **Clean & Modern:** Vertrauensaufbauend
- **Mobile-First:** Optimiert für unterwegs
- **Conversion-optimized:** Klare CTAs, einfache Bedienung

## 💰 Monetarisierung

- **White-Label:** €99/mo pro Solar-Firma
- **Provision:** Optional pro Abschluss

## 🔧 Konfiguration

### Google Maps API (für Lead-Generator)

1. API Key unter https://console.cloud.google.com erstellen
2. In `.env.local` eintragen:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key-here
```

### E-Mail Benachrichtigungen

Für Auto-Email Sequences und Reminders kann ein SMTP-Service (z.B. SendGrid, Resend) integriert werden.

## 📝 Lizenz

Proprietär - Celaris GmbH

## 👨‍💻 Entwickler

Erstellt für Celaris GmbH - Ihr Partner für Solarenergie.

---

**🌞 Lassen Sie uns die Welt ein Stückchen grüner machen!**
