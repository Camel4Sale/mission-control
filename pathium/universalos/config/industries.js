/**
 * Pathium UniversalOS - Industry Configurations
 * Multi-Branch Support für 8+ Branchen
 * Jede Branche hat: KPIs, Terms, Color-Scheme, AI-Bundles
 */

const industries = {
  elektro: {
    id: 'elektro',
    icon: '⚡',
    name: 'Elektro & Energie',
    color: '#F97316',
    dim: '#C2540A',
    rgb: '249,115,22',
    companyName: 'Müller Elektro GmbH',
    terms: {
      jobs: 'Aufträge',
      job: 'Auftrag',
      customers: 'Kunden',
      team: 'Monteure',
      orders: 'Auftragsnummer',
      booking: 'Buchung'
    },
    kpis: [
      { id: 'open-orders', label: 'Offene Aufträge', icon: '📋', trend: 'up' },
      { id: 'revenue', label: 'Monatsumsatz', icon: '💶', trend: 'up' },
      { id: 'technicians', label: 'Techniker aktiv', icon: '🔧', trend: 'neutral' },
      { id: 'rating', label: 'Kundenbewertung', icon: '⭐', trend: 'up' }
    ],
    aiBundle: ['claude', 'openai', 'route-ai', 'doc-ai', 'whisper'],
    integrations: ['datev', 'lexware', 'sevdesk', 'hubspot', 'googlemaps', 'slack']
  },
  sanitaer: {
    id: 'sanitaer',
    icon: '🚿',
    name: 'Sanitär & Heizung',
    color: '#3B82F6',
    dim: '#1D4ED8',
    rgb: '59,130,246',
    companyName: 'Bauer Sanitär GmbH',
    terms: {
      jobs: 'Aufträge',
      job: 'Auftrag',
      customers: 'Kunden',
      team: 'Installateure',
      orders: 'Auftragsnummer',
      booking: 'Termin'
    },
    kpis: [
      { id: 'open-orders', label: 'Offene Aufträge', icon: '📋', trend: 'up' },
      { id: 'revenue', label: 'Monatsumsatz', icon: '💶', trend: 'up' },
      { id: 'installers', label: 'Installateure aktiv', icon: '🔧', trend: 'neutral' },
      { id: 'rating', label: 'Kundenbewertung', icon: '⭐', trend: 'up' }
    ],
    aiBundle: ['claude', 'route-ai', 'doc-ai', 'vision-ai'],
    integrations: ['datev', 'lexware', 'slack', 'stripe', 'googlemaps']
  },
  gastro: {
    id: 'gastro',
    icon: '🍽️',
    name: 'Restaurant & Gastronomie',
    color: '#EF4444',
    dim: '#B91C1C',
    rgb: '239,68,68',
    companyName: 'Bella Cucina GmbH',
    terms: {
      jobs: 'Bestellungen',
      job: 'Bestellung',
      customers: 'Gäste',
      team: 'Mitarbeiter',
      orders: 'Bestellnummer',
      booking: 'Reservierung'
    },
    kpis: [
      { id: 'orders-today', label: 'Bestellungen heute', icon: '🍽️', trend: 'up' },
      { id: 'daily-revenue', label: 'Tagesumsatz', icon: '💶', trend: 'up' },
      { id: 'staff-present', label: 'Personal anwesend', icon: '👨‍🍳', trend: 'neutral' },
      { id: 'guest-rating', label: 'Gäste-Bewertung', icon: '⭐', trend: 'up' }
    ],
    aiBundle: ['openai', 'claude', 'customer-ai', 'forecast-ai', 'vision-ai'],
    integrations: ['stripe', 'paypal', 'uber-eats', 'slack', 'teams', 'googlecalendar']
  },
  hotel: {
    id: 'hotel',
    icon: '🏨',
    name: 'Hotel & Hospitality',
    color: '#F59E0B',
    dim: '#B45309',
    rgb: '245,158,11',
    companyName: 'Grand Hotel GmbH',
    terms: {
      jobs: 'Buchungen',
      job: 'Buchung',
      customers: 'Gäste',
      team: 'Personal',
      orders: 'Buchungsnummer',
      booking: 'Aufenthalt'
    },
    kpis: [
      { id: 'active-bookings', label: 'Buchungen aktiv', icon: '🏨', trend: 'up' },
      { id: 'daily-revenue', label: 'Tagesumsatz', icon: '💶', trend: 'up' },
      { id: 'occupancy', label: 'Auslastung %', icon: '🛏️', trend: 'up' },
      { id: 'guest-rating', label: 'Gäste-Bewertung', icon: '⭐', trend: 'up' }
    ],
    aiBundle: ['openai', 'customer-ai', 'forecast-ai', 'claude', 'voice-ai'],
    integrations: ['stripe', 'booking', 'airbnb', 'slack', 'googlecalendar', 'hubspot']
  },
  handwerker: {
    id: 'handwerker',
    icon: '🔨',
    name: 'Handwerker & Bau',
    color: '#22C55E',
    dim: '#15803D',
    rgb: '34,197,94',
    companyName: 'Schmidt Bau GmbH',
    terms: {
      jobs: 'Projekte',
      job: 'Projekt',
      customers: 'Kunden',
      team: 'Handwerker',
      orders: 'Projektnummer',
      booking: 'Termin'
    },
    kpis: [
      { id: 'active-projects', label: 'Aktive Projekte', icon: '🔨', trend: 'up' },
      { id: 'revenue', label: 'Monatsumsatz', icon: '💶', trend: 'up' },
      { id: 'workers', label: 'Handwerker aktiv', icon: '👷', trend: 'neutral' },
      { id: 'completion', label: 'Termintreue %', icon: '📅', trend: 'up' }
    ],
    aiBundle: ['claude', 'route-ai', 'doc-ai', 'vision-ai', 'estimate-ai'],
    integrations: ['datev', 'lexware', 'baulogin', 'slack', 'googlemaps']
  },
  automotive: {
    id: 'automotive',
    icon: '🚗',
    name: 'Automotive & Werkstatt',
    color: '#6B7280',
    dim: '#374151',
    rgb: '107,114,128',
    companyName: 'Auto Service Center',
    terms: {
      jobs: 'Werkstatt-Aufträge',
      job: 'Werkstatt-Auftrag',
      customers: 'Kunden',
      team: 'Mechaniker',
      orders: 'Auftragsnummer',
      booking: 'Termin'
    },
    kpis: [
      { id: 'open-orders', label: 'Offene Aufträge', icon: '🔧', trend: 'up' },
      { id: 'revenue', label: 'Monatsumsatz', icon: '💶', trend: 'up' },
      { id: 'mechanics', label: 'Mechaniker aktiv', icon: '👨‍🔧', trend: 'neutral' },
      { id: 'cars-today', label: 'Fahrzeuge heute', icon: '🚗', trend: 'up' }
    ],
    aiBundle: ['claude', 'vision-ai', 'parts-ai', 'customer-ai'],
    integrations: ['datev', 'tecdoc', 'autodoc', 'slack', 'googlecalendar']
  },
  beauty: {
    id: 'beauty',
    icon: '💅',
    name: 'Beauty & Wellness',
    color: '#EC4899',
    dim: '#BE185D',
    rgb: '236,72,153',
    companyName: 'Beauty Lounge Studio',
    terms: {
      jobs: 'Termine',
      job: 'Termin',
      customers: 'Kunden',
      team: 'Stylisten',
      orders: 'Buchungsnummer',
      booking: 'Behandlung'
    },
    kpis: [
      { id: 'appointments-today', label: 'Termine heute', icon: '📅', trend: 'up' },
      { id: 'daily-revenue', label: 'Tagesumsatz', icon: '💶', trend: 'up' },
      { id: 'stylists', label: 'Stylisten aktiv', icon: '💇', trend: 'neutral' },
      { id: 'client-rating', label: 'Kunden-Bewertung', icon: '⭐', trend: 'up' }
    ],
    aiBundle: ['openai', 'customer-ai', 'schedule-ai', 'marketing-ai'],
    integrations: ['stripe', 'fresha', 'booksy', 'instagram', 'googlecalendar']
  },
  retail: {
    id: 'retail',
    icon: '🛒',
    name: 'Retail & Handel',
    color: '#14B8A6',
    dim: '#0F766E',
    rgb: '20,184,166',
    companyName: 'Handelshaus GmbH',
    terms: {
      jobs: 'Bestellungen',
      job: 'Bestellung',
      customers: 'Kunden',
      team: 'Verkäufer',
      orders: 'Bestellnummer',
      booking: 'Lieferung'
    },
    kpis: [
      { id: 'orders-today', label: 'Bestellungen heute', icon: '📦', trend: 'up' },
      { id: 'daily-revenue', label: 'Tagesumsatz', icon: '💶', trend: 'up' },
      { id: 'inventory', label: 'Lagerbestand', icon: '📊', trend: 'neutral' },
      { id: 'conversion', label: 'Conversion %', icon: '📈', trend: 'up' }
    ],
    aiBundle: ['openai', 'inventory-ai', 'forecast-ai', 'customer-ai'],
    integrations: ['shopify', 'woocommerce', 'stripe', 'paypal', 'dhl', 'hermes']
  }
};

// Export für Browser
if (typeof window !== 'undefined') {
  window.industries = industries;
}

// Export für Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { industries };
}
