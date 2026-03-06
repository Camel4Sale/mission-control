/**
 * ROI-Rechner Pro - Rendite-Berechnung für Solaranlagen
 * © 2026 Celaris
 */

import { RoiCalculator } from './services/roi-calculator';
import { Co2Calculator } from './services/co2-calculator';
import { ProductionEstimator } from './services/production-estimator';

export interface RoiConfig {
  location: { lat: number; lng: number };
  electricityPrice: number; // ct/kWh
  feedInTariff: number; // ct/kWh
}

export interface ProductionInput {
  kwp: number;
  orientation: number; // Grad
  inclination: number; // Grad
  shadingFactor: number; // 0-1
  systemEfficiency: number; // 0-1
}

export interface RoiInput {
  investmentCost: number; // €
  annualSavings: number; // €/Jahr
  annualRevenue: number; // €/Jahr
  annualMaintenance: number; // €/Jahr
  taxRate: number; // 0-1
  inflationRate: number; // 0-1
  energyPriceIncrease: number; // 0-1
  systemLifetime: number; // Jahre
}

export interface Co2Input {
  annualProduction: number; // kWh/Jahr
  selfConsumption: number; // kWh/Jahr
  gridFeedIn: number; // kWh/Jahr
  co2FactorGrid?: number; // g/kWh
}

export interface YearlyProjection {
  year: number;
  savings: number;
  revenue: number;
  maintenance: number;
  cumulativeCashFlow: number;
}

export class RoiRechner {
  private roiCalculator: RoiCalculator;
  private co2Calculator: Co2Calculator;
  private productionEstimator: ProductionEstimator;
  private config: RoiConfig;

  constructor(config: RoiConfig) {
    this.roiCalculator = new RoiCalculator();
    this.co2Calculator = new Co2Calculator();
    this.productionEstimator = new ProductionEstimator();
    this.config = config;
  }

  async estimateProduction(input: ProductionInput): Promise<{
    annualProduction: number;
    monthlyProduction: number[];
    dailyAverage: number;
    specificYield: number;
    co2Avoided: number;
  }> {
    return this.productionEstimator.estimate({
      ...input,
      location: this.config.location,
    });
  }

  async calculateRoi(input: RoiInput): Promise<{
    paybackPeriod: number;
    roi: number;
    roiAfterTax: number;
    netPresentValue: number;
    internalRateOfReturn: number;
    totalProfit: number;
    breakEvenYear: number;
  }> {
    return this.roiCalculator.calculate(input);
  }

  async calculateCo2(input: Co2Input): Promise<{
    annualCo2Savings: number;
    lifetimeCo2Savings: number;
    equivalentTrees: number;
    equivalentCarKm: number;
    equivalentHouseholds: number;
  }> {
    return this.co2Calculator.calculate({
      ...input,
      co2FactorGrid: input.co2FactorGrid || this.co2Calculator.getCo2FactorByCountry('DE'),
    });
  }

  async getYearlyProjection(input: RoiInput, years: number = 20): Promise<YearlyProjection[]> {
    return this.roiCalculator.generateYearlyProjection(input, years);
  }

  async calculateSelfConsumption(
    annualProduction: number,
    annualConsumption: number,
    storageSize?: number,
  ): Promise<{
    selfConsumptionRate: number;
    selfConsumptionKwh: number;
    gridFeedIn: number;
    gridPurchase: number;
  }> {
    return this.productionEstimator.calculateSelfConsumption(annualProduction, annualConsumption, storageSize);
  }

  async calculateFinancialBenefit(
    annualProduction: number,
    annualConsumption: number,
    storageSize?: number,
  ): Promise<{
    annualSavings: number;
    annualRevenue: number;
    totalBenefit: number;
  }> {
    const selfConsumption = await this.calculateSelfConsumption(annualProduction, annualConsumption, storageSize);
    return this.productionEstimator.calculateFinancialBenefit(
      { annualProduction, monthlyProduction: [], dailyAverage: 0, specificYield: 0, co2Avoided: 0 },
      selfConsumption,
      this.config.electricityPrice,
      this.config.feedInTariff,
    );
  }

  async getTaxBenefits(investmentCost: number, taxRate: number = 0.3): Promise<{
    annualDepreciation: number;
    taxSavings: number;
    totalTaxSavings: number;
  }> {
    return this.roiCalculator.calculateTaxBenefits({
      investmentCost,
      taxRate,
      depreciationYears: 20,
    });
  }

  async compareScenarios(
    scenario1: { investmentCost: number; annualSavings: number; annualRevenue: number },
    scenario2: { investmentCost: number; annualSavings: number; annualRevenue: number },
  ): Promise<{
    scenario1Roi: any;
    scenario2Roi: any;
    difference: { paybackPeriod: number; roi: number; totalProfit: number };
  }> {
    const baseInput: Partial<RoiInput> = {
      annualMaintenance: 150,
      taxRate: 0.3,
      inflationRate: 0.02,
      energyPriceIncrease: 0.05,
      systemLifetime: 20,
    };

    return this.roiCalculator.compareScenarios(
      { ...baseInput, ...scenario1 } as RoiInput,
      { ...baseInput, ...scenario2 } as RoiInput,
    );
  }

  generateImpactReport(
    production: number,
    selfConsumption: number,
    gridFeedIn: number,
  ): string {
    return this.co2Calculator.generateImpactReport({
      annualProduction: production,
      selfConsumption,
      gridFeedIn,
      co2FactorGrid: 420,
    });
  }
}

export { RoiCalculator } from './services/roi-calculator';
export { Co2Calculator } from './services/co2-calculator';
export { ProductionEstimator } from './services/production-estimator';
