# Celaris Landing Page Mockup

## 🎯 Design-Entscheidungen

### Conversion-Optimierung

**1. Hero-Section (Above the Fold)**
- Klare Value Proposition: "Solaranlage in nur 30 Tagen"
- Trust-Signale sofort sichtbar (5.000+ Installationen, 25 Jahre Garantie)
- Duale CTA-Strategie: Primär (Beratung) + Sekundär (ROI-Rechner)
- Warme Farbpalette (Amber/Orange) für positive Assoziation mit Sonne/Energie

**2. Solar-Calculator (ROI-Rechner)**
- **Interaktivität**: Slider + Input-Felder für spielerische Bedienung
- **Sofortiges Feedback**: Live-Berechnung aller Kennzahlen
- **Transparenz**: Alle Kosten und Einsparungen auf einen Blick
- **Psychologie**: Grüne Farben bei Ersparnis/Förderung (positiver Anker)
- **Conversion-Push**: CTA direkt unter den Ergebnissen platziert

**3. Lead-Form**
- **Reduzierte Hürden**: Nur 2 Pflichtfelder (Name, E-Mail)
- **Vertrauen**: Datenschutz-Hinweis direkt am Submit-Button
- **Visuelle Hierarchie**: Dunkler Button auf hellem Hintergrund (Kontrast)
- **Position**: Nach Social Proof platziert (höhere Conversion-Rate)

**4. Features / USPs**
- **Icon-basiert**: Schnelle visuelle Erfassung (Sun, Euro, Shield, Zap)
- **Farb-Kodierung**: Jede USP hat eigene Akzentfarbe
- **Knapper Copy**: Max. 2 Sätze pro Feature
- **Shadow-Hover**: Interaktives Feedback für Engagement

**5. Testimonials (Social Proof)**
- **5-Sterne-Display**: Volle Bewertung sofort sichtbar
- **Lokale Verankerung**: Städte/Regionen genannt (München, Stuttgart, Hamburg)
- **Konkrete Zahlen**: "85% gesunken", "6 Jahre amortisiert"
- **Trustpilot-Badge**: Externe Validierung mit echter Bewertungszahl

**6. Final CTA**
- **Wiederholung der Haupt-CTA**: Konsistente Handlungsaufforderung
- **Alternative Kontaktmöglichkeit**: Telefonnummer für Call-Preferrer
- **Risk-Reversal**: "Kostenlos", "Unverbindlich", "24h Rückmeldung"

### Tech-Stack Entscheidungen

**Next.js (App Router)**
- ✅ Server Components für SEO-Optimierung
- ✅ Schnelle Ladezeiten durch Streaming
- ✅ Konsistent mit Life OS Architecture

**TailwindCSS**
- ✅ Rapid Prototyping
- ✅ Konsistente Design-Tokens
- ✅ Mobile-First Responsive Design

**shadcn/ui Components**
- ✅ Button, Card, Input, Slider, Badge
- ✅ Accessibility built-in
- ✅ Customizable Design-Tokens

### Farb-Psychologie

| Farbe | Verwendung | Psychologische Wirkung |
|-------|-----------|------------------------|
| Amber/Orange (#F59E0B) | Primary Actions, Sonne | Energie, Wärme, Optimismus |
| Grün (#16A34A) | Ersparnis, Förderung | Wachstum, Sicherheit, Geld |
| Grau (#111827) | Text, Footer | Professionalität, Seriosität |
| Weiß/Off-White | Backgrounds | Klarheit, Sauberkeit |

### Mobile-First Ansatz

- Alle Sections responsive (Grid-Flex-Hybride)
- Touch-freundliche Buttons (min. 44px Height)
- Slider für mobile Bedienung optimiert
- Stacking-Order für sinnvolle Mobile-Hierarchie

### Conversion-Funnel

```
Hero (Awareness) 
  ↓
ROI-Rechner (Interest) 
  ↓
Features (Consideration) 
  ↓
Testimonials (Trust) 
  ↓
Lead-Form (Action) 
  ↓
Final CTA (Urgency)
```

## 📁 Datei-Struktur

```
celaris-landing/
├── src/
│   └── app/
│       └── page.tsx          # Haupt-Komponente (alles in One-File für Mockup)
├── README.md                 # Dieses Dokument
└── package.json              # (wird benötigt für Production)
```

## 🚀 Next Steps (Production)

1. **Component-Splitting**:
   - `components/Hero.tsx`
   - `components/ROICalculator.tsx`
   - `components/LeadForm.tsx`
   - `components/Features.tsx`
   - `components/Testimonials.tsx`
   - `components/Footer.tsx`

2. **State-Management**:
   - Calculator-State in Context oder Zustand
   - Form-Handling mit React Hook Form

3. **API-Integration**:
   - Form-Submission an Backend/CRM
   - Calculator mit echten Förderdaten

4. **SEO-Optimierung**:
   - Meta-Tags hinzufügen
   - Structured Data (LocalBusiness)
   - Open Graph Images

5. **Analytics**:
   - Google Analytics 4
   - Conversion-Tracking (Form-Submits, CTA-Clicks)
   - Heatmaps (Hotjar/Clarity)

## 🎨 Design-Prinzipien

1. **Clarity over Cleverness**: Klare Sprache, keine Wortspiele
2. **Visual Hierarchy**: Wichtige Elemente größer/fetter/farbiger
3. **White Space**: Ausreichend Padding für Lesbarkeit
4. **Consistency**: Gleiche Buttons = gleiche Aktion
5. **Trust First**: Bewertungen, Garantien, Zahlen immer sichtbar

---

**Erstellt von:** Molty 🧊  
**Datum:** 2026-03-06  
**Deadline:** 17:00 ✅ (eingehalten)
