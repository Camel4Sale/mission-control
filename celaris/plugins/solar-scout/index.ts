/**
 * Solar-Scout API - Satellitenbild-basierte Dach-Potenzialanalyse
 * © 2026 Celaris
 */

import { GoogleMapsService } from './services/google-maps';
import { AIVisionService } from './services/ai-vision';
import { RoofAnalyzer } from './services/roof-analyzer';

export interface SolarScoutConfig {
  googleMapsApiKey: string;
  aiVisionEndpoint: string;
  cacheTtl?: number; // Sekunden
}

export interface AnalysisOptions {
  address?: string;
  lat?: number;
  lng?: number;
  radius?: number; // Meter
}

export interface RoofSegment {
  area: number; // m²
  orientation: number; // Grad
  inclination: number; // Grad
  shadingFactor: number; // 0-1
}

export interface Obstacle {
  type: 'tree' | 'building' | 'chimney' | 'other';
  height: number; // Meter
  distance: number; // Meter vom Dach
  bearing: number; // Grad
}

export interface SolarScoutResult {
  coordinates: { lat: number; lng: number };
  roofArea: number; // m²
  orientation: number; // Grad (0-360, 180 = Süd)
  inclination: number; // Grad (0-90)
  shadingFactor: number; // 0-1 (1 = keine Verschattung)
  potentialScore: number; // 0-100
  estimatedKwp: number;
  satelliteImage?: string; // Base64 URL
  analysis: {
    roofSegments: RoofSegment[];
    obstacles: Obstacle[];
    sunHours: number; // Jahresdurchschnitt
  };
  address?: string;
  timestamp: string;
}

export class SolarScout {
  private googleMaps: GoogleMapsService;
  private aiVision: AIVisionService;
  private roofAnalyzer: RoofAnalyzer;
  private cache: Map<string, { result: SolarScoutResult; expires: number }> = new Map();
  private cacheTtl: number;

  constructor(config: SolarScoutConfig) {
    this.googleMaps = new GoogleMapsService(config.googleMapsApiKey);
    this.aiVision = new AIVisionService(config.aiVisionEndpoint);
    this.roofAnalyzer = new RoofAnalyzer();
    this.cacheTtl = config.cacheTtl || 3600; // 1 Stunde default
  }

  async analyze(options: AnalysisOptions): Promise<SolarScoutResult> {
    const cacheKey = this.getCacheKey(options);
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    // 1. Koordinaten ermitteln
    const coordinates = await this.getCoordinates(options);

    // 2. Satellitenbild abrufen
    const satelliteImage = await this.googleMaps.getSatelliteImage(coordinates, options.radius || 50);

    // 3. AI-Vision Analyse
    const visionResult = await this.aiVision.analyze(satelliteImage);

    // 4. Dach-Analyse
    const roofAnalysis = this.roofAnalyzer.analyze(visionResult, coordinates);

    // 5. Potenzial-Score berechnen
    const potentialScore = this.calculatePotentialScore(roofAnalysis);

    // 6. Ergebnis zusammenstellen
    const result: SolarScoutResult = {
      coordinates,
      roofArea: roofAnalysis.totalArea,
      orientation: roofAnalysis.primaryOrientation,
      inclination: roofAnalysis.averageInclination,
      shadingFactor: roofAnalysis.shadingFactor,
      potentialScore,
      estimatedKwp: this.calculateKwp(roofAnalysis.totalArea, potentialScore),
      satelliteImage,
      analysis: {
        roofSegments: roofAnalysis.segments,
        obstacles: visionResult.obstacles,
        sunHours: roofAnalysis.sunHours,
      },
      address: options.address,
      timestamp: new Date().toISOString(),
    };

    this.setCached(cacheKey, result);
    return result;
  }

  private async getCoordinates(options: AnalysisOptions): Promise<{ lat: number; lng: number }> {
    if (options.lat && options.lng) {
      return { lat: options.lat, lng: options.lng };
    }
    if (options.address) {
      return await this.googleMaps.geocode(options.address);
    }
    throw new Error('Either address or lat/lng must be provided');
  }

  private calculatePotentialScore(analysis: ReturnType<RoofAnalyzer['analyze']>): number {
    const weights = {
      area: 0.25,
      orientation: 0.30,
      inclination: 0.20,
      shading: 0.25,
    };

    const areaScore = Math.min(100, analysis.totalArea * 1.5); // 66m² = 100
    const orientationScore = this.scoreOrientation(analysis.primaryOrientation);
    const inclinationScore = this.scoreInclination(analysis.averageInclination);
    const shadingScore = analysis.shadingFactor * 100;

    return Math.round(
      areaScore * weights.area +
        orientationScore * weights.orientation +
        inclinationScore * weights.inclination +
        shadingScore * weights.shading,
    );
  }

  private scoreOrientation(orientation: number): number {
    // Süd (180°) = 100, Ost/West (90°/270°) = 70, Nord (0°) = 30
    const diff = Math.abs(orientation - 180);
    const normalizedDiff = diff > 180 ? 360 - diff : diff;
    return Math.max(30, 100 - (normalizedDiff * 0.5));
  }

  private scoreInclination(inclination: number): number {
    // Optimal: 30-40° = 100, flach/steil = weniger
    const optimal = 35;
    const diff = Math.abs(inclination - optimal);
    return Math.max(40, 100 - (diff * 2));
  }

  private calculateKwp(area: number, potentialScore: number): number {
    // ~150Wp pro m² bei optimaler Ausrichtung
    const baseKwp = area * 0.15;
    const factor = potentialScore / 100;
    return Math.round(baseKwp * factor * 10) / 10;
  }

  private getCacheKey(options: AnalysisOptions): string {
    if (options.address) return `addr:${options.address}`;
    if (options.lat && options.lng) return `coord:${options.lat},${options.lng}`;
    throw new Error('Invalid options');
  }

  private getCached(key: string): SolarScoutResult | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }
    return cached.result;
  }

  private setCached(key: string, result: SolarScoutResult): void {
    this.cache.set(key, {
      result,
      expires: Date.now() + this.cacheTtl * 1000,
    });
  }
}

export { GoogleMapsService } from './services/google-maps';
export { AIVisionService } from './services/ai-vision';
export { RoofAnalyzer } from './services/roof-analyzer';
