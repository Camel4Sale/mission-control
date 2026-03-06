/**
 * Strompreis-Tracker - Live-Energiepreise und Tarif-Optimierung
 * © 2026 Celaris
 */

import { PriceApiService } from './services/price-api';
import { PriceAnalyzer } from './services/price-analyzer';
import { TarifComparator } from './services/tarif-comparator';
import { AlertService } from './services/alert-service';

export interface StrompreisConfig {
  apiEndpoint: string;
  region: string;
}

export interface Tarif {
  id?: string;
  provider: string;
  name: string;
  basePrice: number; // €/Monat
  workingPrice: number; // ct/kWh
  contractDuration?: number; // Monate
  priceGuarantee?: number; // Monate
  cancellationPeriod?: number; // Wochen
  bonus?: number; // €
  greenEnergy: boolean;
  dynamicPricing?: boolean;
}

export interface PriceData {
  timestamp: string;
  pricePerKwh: number; // ct/kWh
  co2Intensity: number; // g/kWh
  renewableShare: number; // 0-1
}

export interface PriceForecast {
  timestamp: string;
  pricePerKwh: number;
  confidence: number; // 0-1
}

export interface PriceAnalysis {
  average: number;
  min: number;
  max: number;
  volatility: number;
  trend: 'rising' | 'falling' | 'stable';
  bestHours: string[];
  worstHours: string[];
}

export interface SavingsOpportunity {
  potentialSavings: number; // €/Jahr
  optimalUsageHours: string[];
  recommendation: string;
}

export interface AlertConfig {
  id?: string;
  type: 'price_high' | 'price_low' | 'spike' | 'forecast';
  threshold: number;
  direction: 'above' | 'below';
  channels: ('email' | 'push' | 'sms')[];
  active: boolean;
}

export class StrompreisTracker {
  private priceApi: PriceApiService;
  private analyzer: PriceAnalyzer;
  private comparator: TarifComparator;
  private alerts: AlertService;
  private region: string;

  constructor(config: StrompreisConfig) {
    this.priceApi = new PriceApiService(config.apiEndpoint);
    this.analyzer = new PriceAnalyzer();
    this.comparator = new TarifComparator();
    this.alerts = new AlertService();
    this.region = config.region;
  }

  async getCurrentPrices(): Promise<PriceData[]> {
    return await this.priceApi.getCurrentPrices(this.region);
  }

  async getHistoricalPrices(days: number = 30): Promise<PriceData[]> {
    return await this.priceApi.getHistoricalPrices(this.region, days);
  }

  async getForecast(hours: number = 48): Promise<PriceForecast[]> {
    return await this.priceApi.getForecast(this.region, hours);
  }

  async analyze(options?: { days?: number }): Promise<PriceAnalysis> {
    const prices = await this.getHistoricalPrices(options?.days || 30);
    return this.analyzer.analyze(prices);
  }

  async calculateSavings(options: {
    annualConsumption: number;
    currentTarif: Tarif;
  }): Promise<SavingsOpportunity> {
    const prices = await this.getHistoricalPrices(30);
    return this.analyzer.calculateSavings(options.annualConsumption, prices);
  }

  async compareTariffs(options: {
    annualConsumption: number;
    currentTarif: Tarif;
  }): Promise<{
    currentCost: number;
    potentialTariffs: Array<{ tarif: Tarif; annualCost: number; savings: number }>;
    recommendation: Tarif | null;
  }> {
    return this.comparator.compare(options.currentTarif, options.annualConsumption);
  }

  createAlert(config: Omit<AlertConfig, 'id' | 'active'>): AlertConfig {
    return this.alerts.createAlert({ ...config, active: true });
  }

  async checkAlerts(): Promise<Array<{ alertId: string; message: string; price: number }>> {
    const prices = await this.getCurrentPrices();
    const currentPrice = prices[0]?.pricePerKwh || 0;
    return this.alerts.checkAlerts(currentPrice);
  }

  async getAveragePrice(period: 'day' | 'week' | 'month' | 'year'): Promise<number> {
    return await this.priceApi.getAveragePrice(this.region, period);
  }

  detectPriceSpikes(threshold: number = 50): Promise<Array<{ timestamp: string; price: number }>> {
    return this.getHistoricalPrices(7).then((prices) => this.analyzer.detectPriceSpikes(prices, threshold));
  }

  async getOptimalChargingSchedule(requiredKwh: number, maxPowerKw: number): Promise<
    Array<{ time: string; power: number }>
  > {
    const prices = await this.getForecast(24);
    return this.analyzer.calculateOptimalChargingSchedule(
      prices.map((p) => ({ timestamp: p.timestamp, pricePerKwh: p.pricePerKwh, co2Intensity: 0, renewableShare: 0 })),
      requiredKwh,
      maxPowerKw,
    );
  }

  getActiveAlerts(): AlertConfig[] {
    return this.alerts.getActiveAlerts();
  }

  deactivateAlert(alertId: string): boolean {
    return this.alerts.deactivateAlert(alertId);
  }

  generateSwitchingGuide(currentTarif: Tarif, recommended: Tarif, annualConsumption: number): {
    steps: string[];
    timeline: string[];
    documents: string[];
    warnings: string[];
  } {
    return this.comparator.generateSwitchingRecommendation(currentTarif, recommended, annualConsumption);
  }
}

export { PriceApiService } from './services/price-api';
export { PriceAnalyzer } from './services/price-analyzer';
export { TarifComparator } from './services/tarif-comparator';
export { AlertService } from './services/alert-service';
