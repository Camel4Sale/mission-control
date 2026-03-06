/**
 * Tarif Comparator - Tarif-Vergleich und Wechsel-Empfehlung
 */

interface Tarif {
  id: string;
  provider: string;
  name: string;
  basePrice: number; // €/Monat
  workingPrice: number; // ct/kWh
  contractDuration: number; // Monate
  priceGuarantee: number; // Monate
  cancellationPeriod: number; // Wochen
  bonus?: number; // € Neukundenbonus
  greenEnergy: boolean;
  dynamicPricing?: boolean;
}

interface TarifComparison {
  currentCost: number; // €/Jahr
  potentialTariffs: Array<{
    tarif: Tarif;
    annualCost: number;
    savings: number;
    paybackPeriod: number; // Monate bis Bonus verrechnet
  }>;
  recommendation: Tarif | null;
}

export class TarifComparator {
  private tariffs: Tarif[] = [];

  addTariff(tarif: Tarif): void {
    this.tariffs.push(tarif);
  }

  compare(currentTarif: Tarif, annualConsumption: number): TarifComparison {
    // Aktuelle Kosten berechnen
    const currentCost = currentTarif.basePrice * 12 + (currentTarif.workingPrice * annualConsumption) / 100;

    // Alle Tarife durchgehen
    const potentialTariffs = this.tariffs.map((tarif) => {
      const annualCost = tarif.basePrice * 12 + (tarif.workingPrice * annualConsumption) / 100 - (tarif.bonus || 0);
      const savings = currentCost - annualCost;
      const paybackPeriod = tarif.bonus ? Math.ceil((tarif.basePrice * 12) / (tarif.bonus / 12)) : 0;

      return {
        tarif,
        annualCost: Math.round(annualCost * 100) / 100,
        savings: Math.round(savings * 100) / 100,
        paybackPeriod,
      };
    });

    // Nach Ersparnis sortieren
    potentialTariffs.sort((a, b) => b.savings - a.savings);

    // Beste Empfehlung finden (nicht nur cheapest, auch vertrauenswürdig)
    const recommendation = this.selectBestTariff(potentialTariffs, currentTarif);

    return {
      currentCost: Math.round(currentCost * 100) / 100,
      potentialTariffs: potentialTariffs.slice(0, 5), // Top 5
      recommendation,
    };
  }

  private selectBestTariff(
    candidates: Array<{ tarif: Tarif; annualCost: number; savings: number; paybackPeriod: number }>,
    currentTarif: Tarif,
  ): Tarif | null {
    if (candidates.length === 0) return null;

    // Filter: Nur Tarife mit positiver Ersparnis
    const viable = candidates.filter((c) => c.savings > 0);
    if (viable.length === 0) return null;

    // Score berechnen (Ersparnis + Bonus + Preisgarantie)
    const scored = viable.map((c) => ({
      ...c,
      score: c.savings * 0.5 + (c.tarif.bonus || 0) * 0.3 + c.tarif.priceGuarantee * 0.2,
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored[0].tarif;
  }

  generateSwitchingRecommendation(
    currentTarif: Tarif,
    recommended: Tarif,
    annualConsumption: number,
  ): {
    steps: string[];
    timeline: string[];
    documents: string[];
    warnings: string[];
  } {
    const steps = [
      '1. Verbrauch prüfen (letzte Jahresabrechnung)',
      '2. Vergleichsrechner verwenden (wir haben das erledigt)',
      '3. Online-Wechsel beauftragen',
      '4. Bestätigung abwarten',
      '5. Zählerstand dokumentieren',
      '6. Alte Kündigung bestätigen lassen',
    ];

    const timeline = [
      'Tag 1: Wechsel beauftragen',
      'Tag 2-7: Bestätigung vom neuen Anbieter',
      'Tag 7-14: Kündigung vom alten Anbieter',
      'Tag 30-60: Wechsel erfolgt',
    ];

    const documents = [
      'Letzte Jahresabrechnung',
      'Zählernummer',
      'Aktueller Zählerstand',
      'IBAN für Lastschrift',
    ];

    const warnings: string[] = [];

    if (currentTarif.contractDuration && currentTarif.contractDuration > 0) {
      warnings.push('⚠️ Aktueller Tarif hat noch Vertragslaufzeit - Kündigungsfrist prüfen!');
    }

    if (recommended.contractDuration > 12) {
      warnings.push('ℹ️ Empfohlener Tarif hat lange Laufzeit - Preisgarantie prüfen');
    }

    return { steps, timeline, documents, warnings };
  }

  calculateRoi(switchingCosts: number, annualSavings: number): number {
    // ROI in Monaten berechnen
    if (annualSavings <= 0) return Infinity;
    return Math.ceil((switchingCosts / annualSavings) * 12);
  }
}
