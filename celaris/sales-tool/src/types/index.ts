// Solar Calculator Types
export interface SolarInput {
  dachflaeche: number; // m²
  ausrichtung: string; // N, NE, O, SE, S, SW, W, NW
  neigungswinkel: number; // Grad
  stromverbrauch: number; // kWh/Jahr
}

export interface SolarCalculation {
  maxLeistung: number; // kWp
  jahresertrag: number; // kWh
  einsparung: number; // €/Jahr
  co2Einsparung: number; // kg/Jahr
  amortisation: number; // Jahre
  foerderung: {
    bafa: number;
    kfw: number;
    gesamt: number;
  };
}

// Lead Types
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  dachflaeche?: number;
  potenzialScore: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  status: 'neu' | 'kontaktiert' | 'angebot' | 'abschluss';
  notizen: string[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  type: 'email' | 'call' | 'meeting' | 'followup';
}

// Quote/Angebot Types
export interface Quote {
  id: string;
  leadId: string;
  variant: 'basic' | 'pro' | 'premium';
  moduleHersteller: string;
  modulLeistung: number; // kWp
  speicherKapazitaet: number; // kWh
  montageKosten: number;
  gesamtPreis: number;
  finanzierung: 'kauf' | 'kredit' | 'lease' | 'ppa';
  monatlicheRate?: number;
  createdAt: Date;
}

// Reference Project Types
export interface ReferenceProject {
  id: string;
  title: string;
  location: string;
  imageBefore: string;
  imageAfter: string;
  leistung: number; // kWp
  co2Gespart: number; // kg/Jahr
  kundeName: string;
  testimonial: string;
  completedAt: Date;
}

// Competitor Comparison
export interface Competitor {
  name: string;
  preisProKwp: number;
  garantieJahre: number;
  leistungGarantie: number; // %
}

export interface ComparisonResult {
  celaris: Competitor;
  competitors: Competitor[];
  vorteile: string[];
}

// Appointment Types
export interface Appointment {
  id: string;
  leadId: string;
  date: Date;
  time: string;
  type: 'beratung' | 'besichtigung' | 'montage';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}
