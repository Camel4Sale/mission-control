/**
 * Price API Service - Live-Energiepreise
 */

interface PriceData {
  timestamp: string;
  pricePerKwh: number; // ct/kWh
  co2Intensity: number; // g/kWh
  renewableShare: number; // 0-1
}

interface PriceForecast {
  timestamp: string;
  pricePerKwh: number;
  confidence: number; // 0-1
}

export class PriceApiService {
  private apiEndpoint: string;
  private cache: Map<string, { data: PriceData[]; expires: number }> = new Map();

  constructor(apiEndpoint: string) {
    this.apiEndpoint = apiEndpoint;
  }

  async getCurrentPrices(region: string = 'DE'): Promise<PriceData[]> {
    const cacheKey = `current:${region}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${this.apiEndpoint}/prices/current?region=${region}`);
    if (!response.ok) {
      throw new Error(`Price API failed: ${response.status}`);
    }

    const data = await response.json();
    this.setCached(cacheKey, data);
    return data;
  }

  async getHistoricalPrices(
    region: string,
    days: number = 30,
  ): Promise<PriceData[]> {
    const cacheKey = `history:${region}:${days}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const response = await fetch(
      `${this.apiEndpoint}/prices/history?region=${region}&days=${days}`,
    );
    if (!response.ok) {
      throw new Error(`Price API failed: ${response.status}`);
    }

    const data = await response.json();
    this.setCached(cacheKey, data);
    return data;
  }

  async getForecast(region: string, hours: number = 48): Promise<PriceForecast[]> {
    const response = await fetch(
      `${this.apiEndpoint}/prices/forecast?region=${region}&hours=${hours}`,
    );
    if (!response.ok) {
      throw new Error(`Forecast API failed: ${response.status}`);
    }

    return await response.json();
  }

  async getAveragePrice(region: string, period: 'day' | 'week' | 'month' | 'year'): Promise<number> {
    const prices = await this.getHistoricalPrices(region, period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365);
    const sum = prices.reduce((acc, p) => acc + p.pricePerKwh, 0);
    return sum / prices.length;
  }

  private getCached(key: string): PriceData[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  private setCached(key: string, data: PriceData[]): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + 900000, // 15 Minuten
    });
  }
}
