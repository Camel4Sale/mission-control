/**
 * API utilities for fetching real estate data
 * In production, these would connect to real estate APIs
 * For now, provides mock data and estimation helpers
 */

import { ScenarioConfig } from '@/types';

/**
 * Mock API base URL - replace with actual API in production
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.elysium.local';

/**
 * Fetch current market interest rates
 */
export async function fetchCurrentInterestRates(): Promise<{
  averageRate: number;
  minRate: number;
  maxRate: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}> {
  // In production: fetch from API
  // For now: return realistic mock data based on current market
  return {
    averageRate: 3.8,
    minRate: 3.2,
    maxRate: 4.5,
    trend: 'stable',
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Fetch rental price estimates for a location
 */
export async function fetchRentalEstimates(
  city: string,
  zipCode: string,
  sqm: number,
  propertyType: 'apartment' | 'house'
): Promise<{
  coldRentPerSqm: number;
  estimatedColdRent: number;
  warmRentPerSqm: number;
  estimatedWarmRent: number;
  confidence: 'low' | 'medium' | 'high';
  comparableProperties: number;
}> {
  // Mock data - in production, fetch from real estate API
  const baseRentPerSqm: Record<string, number> = {
    'Berlin': 12.5,
    'München': 18.0,
    'Hamburg': 11.0,
    'Köln': 10.5,
    'Frankfurt': 14.0,
    'Stuttgart': 13.5,
    'Düsseldorf': 11.5,
    'Leipzig': 9.0,
    'Dresden': 8.5,
    'default': 8.0,
  };

  const rentPerSqm = baseRentPerSqm[city] || baseRentPerSqm.default;
  const coldRent = rentPerSqm * sqm;
  const warmRent = coldRent * 1.3; // Estimate 30% for utilities

  return {
    coldRentPerSqm: rentPerSqm,
    estimatedColdRent: Math.round(coldRent),
    warmRentPerSqm: rentPerSqm * 1.3,
    estimatedWarmRent: Math.round(warmRent),
    confidence: 'medium',
    comparableProperties: 50,
  };
}

/**
 * Fetch property value estimates
 */
export async function fetchPropertyValuation(
  city: string,
  zipCode: string,
  sqm: number,
  propertyType: 'apartment' | 'house',
  yearBuilt: number
): Promise<{
  estimatedValue: number;
  valuePerSqm: number;
  priceRange: { min: number; max: number };
  confidence: 'low' | 'medium' | 'high';
  marketTrend: 'appreciating' | 'stable' | 'depreciating';
}> {
  // Mock data
  const baseValuePerSqm: Record<string, number> = {
    'Berlin': 5500,
    'München': 8500,
    'Hamburg': 5000,
    'Köln': 4500,
    'Frankfurt': 6000,
    'Stuttgart': 5500,
    'Düsseldorf': 5000,
    'Leipzig': 3500,
    'Dresden': 3200,
    'default': 3000,
  };

  const valuePerSqm = baseValuePerSqm[city] || baseValuePerSqm.default;
  const estimatedValue = valuePerSqm * sqm;

  // Adjust for property age
  const age = new Date().getFullYear() - yearBuilt;
  const ageFactor = Math.max(0.7, 1 - (age * 0.005)); // 0.5% depreciation per year
  const adjustedValue = estimatedValue * ageFactor;

  return {
    estimatedValue: Math.round(adjustedValue),
    valuePerSqm: Math.round(valuePerSqm * ageFactor),
    priceRange: {
      min: Math.round(adjustedValue * 0.9),
      max: Math.round(adjustedValue * 1.1),
    },
    confidence: 'medium',
    marketTrend: 'stable',
  };
}

/**
 * Fetch historical property value data
 */
export async function fetchHistoricalValues(
  city: string,
  years: number = 20
): Promise<{
  year: number;
  averageValuePerSqm: number;
  changePercent: number;
}[]> {
  // Mock historical data with realistic growth
  const baseValue = 3000;
  const growthRate = 0.025; // 2.5% average annual growth

  const history = [];
  const currentYear = new Date().getFullYear();

  for (let i = years; i >= 0; i--) {
    const year = currentYear - i;
    const valuePerSqm = baseValue * Math.pow(1 + growthRate, i);
    const changePercent = i === years ? 0 : ((Math.pow(1 + growthRate, i) - Math.pow(1 + growthRate, i + 1)) / Math.pow(1 + growthRate, i + 1)) * 100;

    history.push({
      year,
      averageValuePerSqm: Math.round(valuePerSqm),
      changePercent: Math.round(changePercent * 100) / 100,
    });
  }

  return history;
}

/**
 * Fetch inflation and economic indicators
 */
export async function fetchEconomicIndicators(): Promise<{
  inflationRate: number;
  gdpGrowth: number;
  unemploymentRate: number;
  centralBankRate: number;
  forecast: {
    inflationNextYear: number;
    gdpGrowthNextYear: number;
  };
}> {
  // Mock data - in production, fetch from economic data API
  return {
    inflationRate: 2.5,
    gdpGrowth: 1.2,
    unemploymentRate: 5.8,
    centralBankRate: 4.0,
    forecast: {
      inflationNextYear: 2.2,
      gdpGrowthNextYear: 1.5,
    },
  };
}

/**
 * Calculate recommended scenarios based on current market data
 */
export async function getRecommendedScenarios(): Promise<ScenarioConfig[]> {
  const interestRates = await fetchCurrentInterestRates();
  const economicIndicators = await fetchEconomicIndicators();

  const baseRentGrowth = economicIndicators.inflationRate;
  const baseValueGrowth = economicIndicators.inflationRate + 0.5;

  return [
    {
      name: 'Basis',
      rentGrowthAnnual: baseRentGrowth,
      propertyValueGrowthAnnual: baseValueGrowth,
      description: 'Erwartete Entwicklung basierend auf aktuellen Marktdaten',
    },
    {
      name: 'Optimistisch',
      rentGrowthAnnual: baseRentGrowth + 3,
      propertyValueGrowthAnnual: baseValueGrowth + 1.5,
      description: 'Starker Mietmarkt + überdurchschnittliche Wertsteigerung',
    },
    {
      name: 'Pessimistisch',
      rentGrowthAnnual: -2,
      propertyValueGrowthAnnual: 0,
      description: 'Wirtschaftliche Abkühlung, stagnierende Preise',
    },
    {
      name: 'Zins-Schock',
      rentGrowthAnnual: baseRentGrowth,
      propertyValueGrowthAnnual: Math.max(0, baseValueGrowth - 1.5),
      interestRateChange: 3,
      description: `Zinsen steigen um +3% (aktuell: ${interestRates.averageRate}%)`,
    },
  ];
}

/**
 * Fetch comparable properties in area
 */
export async function fetchComparableProperties(
  city: string,
  zipCode: string,
  propertyType: 'apartment' | 'house',
  sqm: number
): Promise<{
  address: string;
  sqm: number;
  price: number;
  pricePerSqm: number;
  rentEstimate: number;
  yield: number;
}[]> {
  // Mock comparables
  const comparables = [];
  const basePricePerSqm = 5000;

  for (let i = 0; i < 5; i++) {
    const compSqm = sqm * (0.9 + Math.random() * 0.2);
    const compPrice = basePricePerSqm * compSqm * (0.95 + Math.random() * 0.1);
    const rentEstimate = compPrice * 0.04 / 12; // 4% yield
    const yieldPercent = (rentEstimate * 12 / compPrice) * 100;

    comparables.push({
      address: `${Math.floor(Math.random() * 100)} Musterstraße, ${city}`,
      sqm: Math.round(compSqm),
      price: Math.round(compPrice),
      pricePerSqm: Math.round(compPrice / compSqm),
      rentEstimate: Math.round(rentEstimate),
      yield: Math.round(yieldPercent * 100) / 100,
    });
  }

  return comparables;
}
