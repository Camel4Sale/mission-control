/**
 * Google Maps Service - Geocoding & Satellite Images
 */

export class GoogleMapsService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async geocode(address: string): Promise<{ lat: number; lng: number }> {
    const url = `${this.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results?.[0]) {
      throw new Error(`Geocoding failed: ${data.status}`);
    }

    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }

  async getSatelliteImage(
    coordinates: { lat: number; lng: number },
    radius: number = 50,
    size: { width: number; height: number } = { width: 640, height: 640 },
  ): Promise<string> {
    // Static Maps API für Satellitenbild
    const zoom = this.calculateZoom(radius);
    const url = `${this.baseUrl}/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=${zoom}&size=${size.width}x${size.height}&maptype=satellite&key=${this.apiKey}`;

    // Bild als Base64 zurückgeben
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:image/png;base64,${base64}`;
  }

  async getElevation(coordinates: { lat: number; lng: number }): Promise<number> {
    const url = `${this.baseUrl}/elevation/json?locations=${coordinates.lat},${coordinates.lng}&key=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results?.[0]) {
      throw new Error(`Elevation failed: ${data.status}`);
    }

    return data.results[0].elevation;
  }

  private calculateZoom(radius: number): number {
    // Zoom-Level basierend auf Radius berechnen
    if (radius <= 25) return 20;
    if (radius <= 50) return 19;
    if (radius <= 100) return 18;
    if (radius <= 200) return 17;
    return 16;
  }

  async getBuildingFootprint(coordinates: { lat: number; lng: number }): Promise<GeoJSON.Polygon | null> {
    // Placeholder für Building Footprint API
    // In Produktion: Google Buildings API oder OpenStreetMap Overpass
    return null;
  }
}
