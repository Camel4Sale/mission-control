/**
 * Price Analyzer - Preis-Analyse und Prognose
 */

import { PriceData, PriceForecast } from './price-api';

interface PriceAnalysis {
  average: number;
  min: number;
  max: number;
  volatility: number;
  trend: 'rising' | 'falling' | 'stable';
  bestHours: string[];
  worstHours: string[];
}

interface SavingsOpportunity {
  potentialSavings: number; // €/Jahr
  optimalUsageHours: string[];
  recommendation: string;
}

export class PriceAnalyzer {
  analyze(prices: PriceData[]): PriceAnalysis {
    const priceValues = prices.map((p) => p.pricePerKwh);

    const average = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;
    const min = Math.min(...priceValues);
    const max = Math.max(...priceValues);

    // Volatilität (Standardabweichung)
    const variance = priceValues.reduce((sum, p) => sum + Math.pow(p - average, 2), 0) / priceValues.length;
    const volatility = Math.sqrt(variance);

    // Trend berechnen (linear regression slope)
    const trend = this.calculateTrend(prices);

    // Beste und schlechteste Stunden finden
    const sorted = [...prices].sort((a, b) => a.pricePerKwh - b.pricePerKwh);
    const bestHours = sorted.slice(0, 5).map((p) => p.timestamp);
    const worstHours = sorted.slice(-5).map((p) => p.timestamp);

    return {
      average: Math.round(average * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      volatility: Math.round(volatility * 100) / 100,
      trend,
      bestHours,
      worstHours,
    };
  }

  calculateSavings(currentUsage: number, prices: PriceData[]): SavingsOpportunity {
    // Annahme: Nutzer kann 30% des Verbrauchs in günstige Stunden verschieben
    const shiftableUsage = currentUsage * 0.3;

    const sorted = [...prices].sort((a, b) => a.pricePerKwh - b.pricePerKwh);
    const cheapestAvg = sorted.slice(0, 8).reduce((sum, p) => sum + p.pricePerKwh, 0) / 8;
    const currentAvg = prices.reduce((sum, p) => sum + p.pricePerKwh, 0) / prices.length;

    const potentialSavings = ((currentAvg - cheapestAvg) * shiftableUsage) / 100; // ct zu €

    const optimalHours = sorted.slice(0, 8).map((p) => {
      const hour = new Date(p.timestamp).getHours();
      return `${hour.toString().padStart(2, '0')}:00`;
    });

    return {
      potentialSavings: Math.round(potentialSavings * 100) / 100,
      optimalUsageHours: [...new Set(optimalHours)],
      recommendation: this.generateRecommendation(prices),
    };
  }

  generateForecast(historical: PriceData[], forecast: PriceForecast[]): PriceAnalysis {
    const combined = [...historical.slice(-24), ...forecast];
    return this.analyze(combined);
  }

  private calculateTrend(prices: PriceData[]): 'rising' | 'falling' | 'stable' {
    if (prices.length < 2) return 'stable';

    const firstHalf = prices.slice(0, Math.floor(prices.length / 2));
    const secondHalf = prices.slice(Math.floor(prices.length / 2));

    const firstAvg = firstHalf.reduce((sum, p) => sum + p.pricePerKwh, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p.pricePerKwh, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (change > 5) return 'rising';
    if (change < -5) return 'falling';
    return 'stable';
  }

  private generateRecommendation(prices: PriceData[]): string {
    const analysis = this.analyze(prices);

    if (analysis.trend === 'rising') {
      return 'Preise steigen - prüfen Sie langfristigen Festpreis-Tarif';
    }

    if (analysis.trend === 'falling') {
      return 'Preise fallen - variabler Tarif könnte sich lohnen';
    }

    if (analysis.volatility > 5) {
      return 'Hohe Volatilität - Smart-Home-Steuerung kann viel sparen';
    }

    return 'Stabile Preise - aktueller Tarif ist wahrscheinlich optimal';
  }

  detectPriceSpikes(prices: PriceData[], threshold: number = 50): Array<{ timestamp: string; price: number }> {
    return prices.filter((p) => p.pricePerKwh > threshold).map((p) => ({
      timestamp: p.timestamp,
      price: p.pricePerKwh,
    }));
  }

  calculateOptimalChargingSchedule(prices: PriceData[], requiredKwh: number, maxPowerKw: number): Array<{ time: string; power: number }> {
    // Optimale Ladezeiten für E-Auto oder Speicher berechnen
    const sorted = [...prices].sort((a, b) => a.pricePerKwh - b.pricePerKwh);
    const schedule: Array<{ time: string; power: number }> = [];

    let remainingKwh = requiredKwh;

    for (const price of sorted) {
      if (remainingKwh <= 0) break;

      const hoursNeeded = Math.min(remainingKwh / maxPowerKw, 1);
      schedule.push({
        time: price.timestamp,
        power: Math.min(requiredKwh, maxPowerKw) * hoursNeeded,
      });

      remainingKwh -= maxPowerKw * hoursNeeded;
    }

    return schedule;
  }
}
