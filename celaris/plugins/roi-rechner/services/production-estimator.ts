/**
 * Production Estimator - Ertragsprognose
 */

interface ProductionInput {
  kwp: number; // kWp installierte Leistung
  orientation: number; // Grad (0-360, 180 = Süd)
  inclination: number; // Grad (0-90)
  location: {
    lat: number;
    lng: number;
  };
  shadingFactor: number; // 0-1 (1 = keine Verschattung)
  systemEfficiency: number; // 0-1 (typisch 0.8-0.9)
}

interface ProductionEstimate {
  annualProduction: number; // kWh/Jahr
  monthlyProduction: number[]; // kWh pro Monat
  dailyAverage: number; // kWh/Tag
  specificYield: number; // kWh/kWp
  co2Avoided: number; // kg/Jahr
}

export class ProductionEstimator {
  private readonly BASE_YIELD_GERMANY = 950; // kWh/kWp für Deutschland (Süd, 35°)

  estimate(input: ProductionInput): ProductionEstimate {
    // 1. Basisertrag berechnen
    const baseProduction = input.kwp * this.BASE_YIELD_GERMANY;

    // 2. Ausrichtungsfaktor
    const orientationFactor = this.getOrientationFactor(input.orientation);

    // 3. Neigungsfaktor
    const inclinationFactor = this.getInclinationFactor(input.inclination);

    // 4. Standortfaktor (Sonneneinstrahlung basierend auf Breitengrad)
    const locationFactor = this.getLocationFactor(input.location.lat);

    // 5. Verschattung und Effizienz
    const totalFactor =
      orientationFactor * inclinationFactor * locationFactor * input.shadingFactor * input.systemEfficiency;

    const annualProduction = baseProduction * totalFactor;

    // 6. Monatliche Verteilung (typisch für Deutschland)
    const monthlyDistribution = [0.04, 0.06, 0.09, 0.11, 0.13, 0.13, 0.14, 0.12, 0.1, 0.07, 0.04, 0.03];
    const monthlyProduction = monthlyDistribution.map((factor) => Math.round(annualProduction * factor));

    // 7. Durchschnitt pro Tag
    const dailyAverage = annualProduction / 365;

    // 8. Spezifischer Ertrag
    const specificYield = annualProduction / input.kwp;

    // 9. CO₂-Einsparung
    const co2Avoided = (annualProduction * 420) / 1000; // 420 g/kWh für deutschen Strommix

    return {
      annualProduction: Math.round(annualProduction),
      monthlyProduction,
      dailyAverage: Math.round(dailyAverage * 100) / 100,
      specificYield: Math.round(specificYield),
      co2Avoided: Math.round(co2Avoided),
    };
  }

  private getOrientationFactor(orientation: number): number {
    // Optimal: Süd (180°) = 1.0
    const diff = Math.abs(orientation - 180);
    const normalizedDiff = diff > 180 ? 360 - diff : diff;

    // Ost/West (90°/270°) = ~0.85, Nord (0°) = ~0.7
    return 1 - (normalizedDiff / 360) * 0.3;
  }

  private getInclinationFactor(inclination: number): number {
    // Optimal: 30-40° = 1.0
    const optimal = 35;
    const diff = Math.abs(inclination - optimal);

    // Flacher/steiler = weniger Ertrag
    return Math.max(0.85, 1 - diff / 100);
  }

  private getLocationFactor(latitude: number): number {
    // Deutschland: 47-55° Breitengrad
    // Süddeutschland = mehr Sonne als Norddeutschland
    const optimalLat = 47; // Süddeutschland
    const maxLat = 55; // Norddeutschland

    const factor = 1 - (Math.abs(latitude - optimalLat) / (maxLat - optimalLat)) * 0.15;
    return Math.max(0.85, Math.min(1.0, factor));
  }

  calculateSelfConsumption(
    annualProduction: number,
    annualConsumption: number,
    storageSize?: number,
  ): {
    selfConsumptionRate: number; // %
    selfConsumptionKwh: number; // kWh
    gridFeedIn: number; // kWh
    gridPurchase: number; // kWh
  } {
    // Ohne Speicher: typisch 30% Eigenverbrauch
    // Mit Speicher: bis zu 70% möglich
    let baseRate = 0.3;

    if (storageSize) {
      // Faustformel: 1 kWh Speicher pro 1 kWp erhöht Eigenverbrauch um ~10%
      const storageBoost = Math.min(0.4, storageSize / 10); // Max +40%
      baseRate += storageBoost;
    }

    const selfConsumptionKwh = Math.min(annualProduction, annualConsumption * baseRate);
    const selfConsumptionRate = (selfConsumptionKwh / annualProduction) * 100;
    const gridFeedIn = annualProduction - selfConsumptionKwh;
    const gridPurchase = annualConsumption - selfConsumptionKwh;

    return {
      selfConsumptionRate: Math.round(selfConsumptionRate * 10) / 10,
      selfConsumptionKwh: Math.round(selfConsumptionKwh),
      gridFeedIn: Math.round(gridFeedIn),
      gridPurchase: Math.round(Math.max(0, gridPurchase)),
    };
  }

  calculateFinancialBenefit(
    production: ProductionEstimate,
    selfConsumption: ReturnType<ProductionEstimator['calculateSelfConsumption']>,
    electricityPrice: number, // ct/kWh
    feedInTariff: number, // ct/kWh
  ): {
    annualSavings: number; // €
    annualRevenue: number; // €
    totalBenefit: number; // €
  } {
    const annualSavings = (selfConsumption.selfConsumptionKwh * electricityPrice) / 100;
    const annualRevenue = (selfConsumption.gridFeedIn * feedInTariff) / 100;
    const totalBenefit = annualSavings + annualRevenue;

    return {
      annualSavings: Math.round(annualSavings * 100) / 100,
      annualRevenue: Math.round(annualRevenue * 100) / 100,
      totalBenefit: Math.round(totalBenefit * 100) / 100,
    };
  }
}
