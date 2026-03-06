/**
 * CO₂ Calculator - Emissionsberechnung
 */

interface Co2Input {
  annualProduction: number; // kWh/Jahr
  selfConsumption: number; // kWh/Jahr (Eigenverbrauch)
  gridFeedIn: number; // kWh/Jahr (Einspeisung)
  co2FactorGrid: number; // g/kWh (Strommix)
  co2FactorSolar: number; // g/kWh (Solar, typisch ~40)
}

interface Co2Result {
  annualCo2Savings: number; // kg/Jahr
  lifetimeCo2Savings: number; // kg über Lebensdauer
  equivalentTrees: number; // Bäume die gleiche Menge binden
  equivalentCarKm: number; // km die ein Auto fahren könnte
  equivalentHouseholds: number; // Haushalte die versorgt werden
}

export class Co2Calculator {
  private readonly CO2_PER_TREE_PER_YEAR = 10; // kg CO₂ pro Baum pro Jahr
  private readonly CO2_PER_CAR_KM = 150; // g CO₂ pro km (Durchschnittsauto)
  private readonly CO2_PER_HOUSEHOLD = 3500; // kg CO₂ pro Haushalt pro Jahr

  calculate(input: Co2Input, systemLifetime: number = 20): Co2Result {
    // CO₂-Einsparung durch Eigenverbrauch
    const co2SavedSelfConsumption = (input.selfConsumption * input.co2FactorGrid) / 1000; // g zu kg

    // CO₂-Einsparung durch Einspeisung (ersetzt konventionellen Strom)
    const co2SavedFeedIn = (input.gridFeedIn * (input.co2FactorGrid - input.co2FactorSolar)) / 1000;

    const annualCo2Savings = co2SavedSelfConsumption + co2SavedFeedIn;
    const lifetimeCo2Savings = annualCo2Savings * systemLifetime;

    // Äquivalente berechnen
    const equivalentTrees = Math.round(lifetimeCo2Savings / this.CO2_PER_TREE_PER_YEAR / systemLifetime);
    const equivalentCarKm = Math.round((lifetimeCo2Savings * 1000) / this.CO2_PER_CAR_KM);
    const equivalentHouseholds = Math.round((annualCo2Savings / this.CO2_PER_HOUSEHOLD) * 10) / 10;

    return {
      annualCo2Savings: Math.round(annualCo2Savings),
      lifetimeCo2Savings: Math.round(lifetimeCo2Savings),
      equivalentTrees,
      equivalentCarKm,
      equivalentHouseholds,
    };
  }

  calculateOffset(input: Co2Input): {
    offsetCost: number; // € für Kompensation
    certificates: number; // Anzahl Zertifikate (1 Zertifikat = 1 Tonne)
  } {
    const annualTonnes = input.annualProduction * input.co2FactorGrid / 1000000; // g zu Tonnen
    const certificatePrice = 25; // € pro Tonne (EU-ETS Durchschnitt)

    return {
      offsetCost: Math.round(annualTonnes * certificatePrice * 100) / 100,
      certificates: Math.round(annualTonnes * 10) / 10,
    };
  }

  getCo2FactorByCountry(country: string): number {
    // CO₂-Faktoren für Strommix (g/kWh) - Quelle: IEA, UBA
    const factors: Record<string, number> = {
      DE: 420, // Deutschland
      AT: 180, // Österreich
      CH: 50, // Schweiz
      FR: 80, // Frankreich
      NL: 350, // Niederlande
      BE: 250, // Belgien
      PL: 700, // Polen
      DK: 180, // Dänemark
      SE: 40, // Schweden
      NO: 30, // Norwegen
      EU: 295, // EU-Durchschnitt
    };

    return factors[country.toUpperCase()] || factors.EU;
  }

  generateImpactReport(input: Co2Input, systemLifetime: number = 20): string {
    const result = this.calculate(input, systemLifetime);

    return `🌱 Ihre CO₂-Bilanz

📊 Jährliche Einsparung: ${result.annualCo2Savings.toLocaleString()} kg CO₂
📈 Über ${systemLifetime} Jahre: ${result.lifetimeCo2Savings.toLocaleString()} kg CO₂

Das entspricht:
🌳 ${result.equivalentTrees} Bäume, die ${systemLifetime} Jahre wachsen
🚗 ${result.equivalentCarKm.toLocaleString()} km nicht mit dem Auto fahren
🏠 ${result.equivalentHouseholds} Haushalte ein Jahr mit Strom versorgen

💡 Mit Solar tragen Sie aktiv zum Klimaschutz bei!`;
  }
}
