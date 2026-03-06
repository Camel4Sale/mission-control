/**
 * Roof Analyzer - Dach-Potenzial Berechnungen
 */

import { RoofSegment } from '../index';
import type { VisionAnalysisResult } from './ai-vision';

interface RoofAnalysisData {
  totalArea: number;
  primaryOrientation: number;
  averageInclination: number;
  shadingFactor: number;
  segments: RoofSegment[];
  sunHours: number;
}

export class RoofAnalyzer {
  analyze(visionResult: VisionAnalysisResult, coordinates: { lat: number; lng: number }): RoofAnalysisData {
    // 1. Dachfläche schätzen (basierend auf Bildanalyse)
    const totalArea = this.estimateRoofArea(visionResult);

    // 2. Ausrichtung bestimmen
    const primaryOrientation = this.determineOrientation(visionResult, coordinates);

    // 3. Neigung schätzen
    const averageInclination = this.estimateInclination(visionResult);

    // 4. Verschattungsfaktor berechnen
    const shadingFactor = this.calculateShadingFactor(visionResult);

    // 5. Segmente aufteilen
    const segments = this.createSegments(visionResult, totalArea);

    // 6. Sonnenstunden berechnen (basierend auf Breitengrad)
    const sunHours = this.calculateSunHours(coordinates.lat);

    return {
      totalArea,
      primaryOrientation,
      averageInclination,
      shadingFactor,
      segments,
      sunHours,
    };
  }

  private estimateRoofArea(visionResult: VisionAnalysisResult): number {
    // Placeholder: In Produktion echte Pixel-zu-m²-Umrechnung
    const baseArea = 80; // m² Durchschnitt

    if (visionResult.roofType === 'flat') {
      return baseArea * 1.2;
    }

    return baseArea;
  }

  private determineOrientation(visionResult: VisionAnalysisResult, coordinates: { lat: number; lng: number }): number {
    // Placeholder: In Produktion Schattenanalyse für echte Ausrichtung
    // Default: Süd (180°)
    return 180;
  }

  private estimateInclination(visionResult: VisionAnalysisResult): number {
    if (visionResult.roofType === 'flat') {
      return 5; // Flachdach ~5°
    }
    if (visionResult.roofType === 'pitched') {
      return 35; // Satteldach ~35°
    }
    return 25; // Mixed
  }

  private calculateShadingFactor(visionResult: VisionAnalysisResult): number {
    let factor = 1.0;

    // Vegetation reduziert Faktor
    factor -= visionResult.vegetation.coverage * 0.3;

    // Nahe Gebäude reduzieren Faktor
    if (visionResult.nearbyBuildings.avgDistance < 20) {
      factor -= 0.2;
    }

    return Math.max(0.5, Math.min(1.0, factor));
  }

  private createSegments(visionResult: VisionAnalysisResult, totalArea: number): RoofSegment[] {
    // Dach in Segmente aufteilen (für komplexe Dächer)
    const segments: RoofSegment[] = [];

    if (visionResult.roofType === 'pitched') {
      // Zwei Segmente für Satteldach
      segments.push({
        area: totalArea * 0.5,
        orientation: 180, // Süd
        inclination: 35,
        shadingFactor: 0.9,
      });
      segments.push({
        area: totalArea * 0.5,
        orientation: 0, // Nord (weniger relevant)
        inclination: 35,
        shadingFactor: 0.7,
      });
    } else {
      // Ein Segment für Flachdach
      segments.push({
        area: totalArea,
        orientation: 180,
        inclination: 5,
        shadingFactor: 0.85,
      });
    }

    return segments;
  }

  private calculateSunHours(latitude: number): number {
    // Durchschnittliche Sonnenstunden pro Tag basierend auf Breitengrad
    // Deutschland: ~2.5-4.5 Stunden/Tag Jahresdurchschnitt
    const baseHours = 3.5;
    const latitudeFactor = 1 - Math.abs(latitude - 51) / 100; // 51° = Deutschland Mitte
    return baseHours * latitudeFactor;
  }

  calculateYield(segments: RoofSegment[], sunHours: number): number {
    // Jahresertrag in kWh berechnen
    const specificYield = 950; // kWh/kWp für Deutschland

    return segments.reduce((total, segment) => {
      const kwp = segment.area * 0.15; // 150Wp/m²
      const orientationFactor = this.getOrientationFactor(segment.orientation);
      const inclinationFactor = this.getInclinationFactor(segment.inclination);

      return (
        total +
        kwp * specificYield * orientationFactor * inclinationFactor * segment.shadingFactor * (sunHours / 3.5)
      );
    }, 0);
  }

  private getOrientationFactor(orientation: number): number {
    const diff = Math.abs(orientation - 180);
    return 1 - diff / 360; // Süd = 1.0, Ost/West = 0.75, Nord = 0.5
  }

  private getInclinationFactor(inclination: number): number {
    const optimal = 35;
    const diff = Math.abs(inclination - optimal);
    return 1 - diff / 100;
  }
}
