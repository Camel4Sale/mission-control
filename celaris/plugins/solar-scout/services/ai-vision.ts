/**
 * AI Vision Service - Satellitenbild-Analyse mit Computer Vision
 */

import { Obstacle } from '../index';

interface VisionAnalysisResult {
  roofDetected: boolean;
  roofType: 'flat' | 'pitched' | 'mixed';
  roofMaterial: 'tile' | 'metal' | 'slate' | 'other';
  obstacles: Obstacle[];
  vegetation: {
    trees: number;
    coverage: number; // 0-1
  };
  nearbyBuildings: {
    count: number;
    avgHeight: number;
    avgDistance: number;
  };
}

export class AIVisionService {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async analyze(satelliteImageBase64: string): Promise<VisionAnalysisResult> {
    // Call AI Vision API
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: satelliteImageBase64,
        tasks: ['roof_detection', 'obstacle_detection', 'vegetation_analysis'],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI Vision API failed: ${response.status}`);
    }

    return await response.json();
  }

  async detectRoofEdges(imageBase64: string): Promise<Array<{ x: number; y: number }>> {
    const response = await fetch(`${this.endpoint}/edges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!response.ok) {
      throw new Error(`Edge detection failed: ${response.status}`);
    }

    return await response.json();
  }

  async classifyRoofType(imageBase64: string): Promise<'flat' | 'pitched' | 'mixed'> {
    const analysis = await this.analyze(imageBase64);
    return analysis.roofType;
  }

  async estimateShading(
    imageBase64: string,
    coordinates: { lat: number; lng: number },
    timeRange: { start: string; end: string },
  ): Promise<number> {
    // Verschattung über Tagesverlauf analysieren
    const response = await fetch(`${this.endpoint}/shading`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageBase64,
        coordinates,
        timeRange,
      }),
    });

    if (!response.ok) {
      throw new Error(`Shading analysis failed: ${response.status}`);
    }

    const result = await response.json();
    return result.shadingFactor; // 0-1
  }
}
