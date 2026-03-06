// Solar Calculator Utilities

import { SolarInput, SolarCalculation } from '@/types';

// Ausrichtung-Faktoren (Süden ist optimal)
const AUSRICHTUNG_FAKTOREN: Record<string, number> = {
  'S': 1.0,
  'SO': 0.95,
  'O': 0.90,
  'NO': 0.85,
  'N': 0.70,
  'NW': 0.85,
  'W': 0.90,
  'SW': 0.95,
};

// Neigungswinkel-Optimierung (35° ist ideal in Deutschland)
function getNeigungsfaktor(winkel: number): number {
  const optimal = 35;
  const diff = Math.abs(winkel - optimal);
  if (diff <= 10) return 1.0;
  if (diff <= 20) return 0.95;
  if (diff <= 30) return 0.90;
  return 0.85;
}

// Berechnet maximale Leistung (kWp)
// Ca. 170 Wp pro m² bei modernen Modulen
export function calculateMaxLeistung(dachflaeche: number): number {
  return (dachflaeche * 170) / 1000;
}

// Berechnet Jahresertrag (kWh)
// Deutschland: ca. 1000 kWh pro kWp installierter Leistung
export function calculateJahresertrag(leistung: number, ausrichtung: string, neigung: number): number {
  const ausrichtungsFaktor = AUSRICHTUNG_FAKTOREN[ausrichtung] || 0.85;
  const neigungsFaktor = getNeigungsfaktor(neigung);
  const basisErtrag = leistung * 1000; // 1000 kWh pro kWp
  return Math.round(basisErtrag * ausrichtungsFaktor * neigungsFaktor);
}

// Berechnet Einsparung (€/Jahr)
// Aktueller Strompreis: ca. 0.30 €/kWh
export function calculateEinsparung(jahresertrag: number, stromverbrauch: number): number {
  // Eigenverbrauch typisch 30-40% ohne Speicher
  const eigenverbrauch = Math.min(jahresertrag * 0.35, stromverbrauch);
  const einspeisung = jahresertrag - eigenverbrauch;
  
  // Einsparung durch Eigenverbrauch
  const einsparungEigenverbrauch = eigenverbrauch * 0.30;
  
  // Einspeisevergütung (ca. 0.08 €/kWh)
  const einspeiseVerguetung = einspeisung * 0.08;
  
  return Math.round(einsparungEigenverbrauch + einspeiseVerguetung);
}

// Berechnet CO₂-Einsparung (kg/Jahr)
// Deutscher Strommix: ca. 0.4 kg CO₂ pro kWh
export function calculateCO2Einsparung(jahresertrag: number): number {
  return Math.round(jahresertrag * 0.4);
}

// Berechnet Amortisation (Jahre)
export function calculateAmortisation(gesamtKosten: number, jahresEinsparung: number): number {
  if (jahresEinsparung <= 0) return Infinity;
  return Math.round((gesamtKosten / jahresEinsparung) * 10) / 10;
}

// Berechnet Förderung (BAFA, KfW)
export function calculateFoerderung(leistung: number, mitSpeicher: boolean): {
  bafa: number;
  kfw: number;
  gesamt: number;
} {
  // BAFA: ca. 150 € pro kWp
  const bafa = Math.round(leistung * 150);
  
  // KfW: bis zu 25% der Kosten, max. 5000 €
  const gesamtKosten = leistung * 1500; // ca. 1500 € pro kWp
  const kfw = mitSpeicher ? Math.min(gesamtKosten * 0.25, 5000) : Math.min(gesamtKosten * 0.15, 3000);
  
  return {
    bafa,
    kfw: Math.round(kfw),
    gesamt: bafa + Math.round(kfw),
  };
}

// Hauptfunktion: Komplette Berechnung
export function calculateSolar(input: SolarInput, gesamtKosten: number, mitSpeicher: boolean): SolarCalculation {
  const maxLeistung = calculateMaxLeistung(input.dachflaeche);
  const jahresertrag = calculateJahresertrag(maxLeistung, input.ausrichtung, input.neigungswinkel);
  const einsparung = calculateEinsparung(jahresertrag, input.stromverbrauch);
  const co2Einsparung = calculateCO2Einsparung(jahresertrag);
  const amortisation = calculateAmortisation(gesamtKosten, einsparung);
  const foerderung = calculateFoerderung(maxLeistung, mitSpeicher);
  
  return {
    maxLeistung: Math.round(maxLeistung * 10) / 10,
    jahresertrag,
    einsparung,
    co2Einsparung,
    amortisation,
    foerderung,
  };
}

// Potenzial-Scoring für Leads (A-F)
export function calculatePotenzialScore(dachflaeche: number, ausrichtung: string, neigung: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' {
  const leistung = calculateMaxLeistung(dachflaeche);
  const ertrag = calculateJahresertrag(leistung, ausrichtung, neigung);
  
  // Score basierend auf Jahresertrag
  if (ertrag >= 8000) return 'A';
  if (ertrag >= 6000) return 'B';
  if (ertrag >= 4000) return 'C';
  if (ertrag >= 2500) return 'D';
  if (ertrag >= 1500) return 'E';
  return 'F';
}
