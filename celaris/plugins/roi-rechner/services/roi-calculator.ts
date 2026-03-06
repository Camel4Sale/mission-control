/**
 * ROI Calculator - Amortisation und Rendite
 */

interface RoiInput {
  investmentCost: number; // €
  annualSavings: number; // €/Jahr
  annualRevenue: number; // €/Jahr (Einspeisevergütung)
  annualMaintenance: number; // €/Jahr
  taxRate: number; // 0-1
  inflationRate: number; // 0-1
  energyPriceIncrease: number; // 0-1
  systemLifetime: number; // Jahre
}

interface RoiResult {
  paybackPeriod: number; // Jahre
  roi: number; // %
  roiAfterTax: number; // %
  netPresentValue: number; // €
  internalRateOfReturn: number; // %
  totalProfit: number; // €
  breakEvenYear: number;
}

interface YearlyProjection {
  year: number;
  savings: number;
  revenue: number;
  maintenance: number;
  cumulativeCashFlow: number;
}

export class RoiCalculator {
  calculate(input: RoiInput): RoiResult {
    const annualNetBenefit = input.annualSavings + input.annualRevenue - input.annualMaintenance;

    // Einfache Amortisation
    const paybackPeriod = input.investmentCost / annualNetBenefit;

    // ROI (vor Steuer)
    const roi = (annualNetBenefit / input.investmentCost) * 100;

    // ROI (nach Steuer)
    const taxedBenefit = annualNetBenefit * (1 - input.taxRate);
    const roiAfterTax = (taxedBenefit / input.investmentCost) * 100;

    // Kapitalwert (NPV) über Systemlebensdauer
    const npv = this.calculateNPV(input, annualNetBenefit);

    // Interner Zinsfuß (IRR) - Näherung
    const irr = this.calculateIRR(input, annualNetBenefit);

    // Gesamtgewinn
    const totalProfit = annualNetBenefit * input.systemLifetime - input.investmentCost;

    // Break-Even Jahr
    const breakEvenYear = Math.ceil(paybackPeriod);

    return {
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      roi: Math.round(roi * 100) / 100,
      roiAfterTax: Math.round(roiAfterTax * 100) / 100,
      netPresentValue: Math.round(npv),
      internalRateOfReturn: Math.round(irr * 100) / 100,
      totalProfit: Math.round(totalProfit),
      breakEvenYear,
    };
  }

  private calculateNPV(input: RoiInput, annualBenefit: number): number {
    let npv = -input.investmentCost;
    const discountRate = input.inflationRate + 0.02; // Realzins

    for (let year = 1; year <= input.systemLifetime; year++) {
      const adjustedBenefit = annualBenefit * Math.pow(1 + input.energyPriceIncrease, year - 1);
      npv += adjustedBenefit / Math.pow(1 + discountRate, year);
    }

    return npv;
  }

  private calculateIRR(input: RoiInput, annualBenefit: number): number {
    // IRR mit Newton-Verfahren nähern
    let irr = 0.1; // Startschätzung 10%
    const maxIterations = 100;
    const tolerance = 0.0001;

    for (let i = 0; i < maxIterations; i++) {
      let npv = -input.investmentCost;
      let derivative = 0;

      for (let year = 1; year <= input.systemLifetime; year++) {
        const adjustedBenefit = annualBenefit * Math.pow(1 + input.energyPriceIncrease, year - 1);
        npv += adjustedBenefit / Math.pow(1 + irr, year);
        derivative -= year * adjustedBenefit / Math.pow(1 + irr, year + 1);
      }

      const newIrr = irr - npv / derivative;

      if (Math.abs(newIrr - irr) < tolerance) {
        irr = newIrr;
        break;
      }

      irr = newIrr;
    }

    return irr;
  }

  generateYearlyProjection(input: RoiInput, years: number = 20): YearlyProjection[] {
    const projections: YearlyProjection[] = [];
    let cumulativeCashFlow = -input.investmentCost;

    for (let year = 1; year <= years; year++) {
      const savings = input.annualSavings * Math.pow(1 + input.energyPriceIncrease, year - 1);
      const revenue = input.annualRevenue * Math.pow(1 + input.energyPriceIncrease, year - 1);
      const maintenance = input.annualMaintenance * Math.pow(1 + input.inflationRate, year - 1);

      cumulativeCashFlow += savings + revenue - maintenance;

      projections.push({
        year,
        savings: Math.round(savings),
        revenue: Math.round(revenue),
        maintenance: Math.round(maintenance),
        cumulativeCashFlow: Math.round(cumulativeCashFlow),
      });
    }

    return projections;
  }

  calculateTaxBenefits(input: { investmentCost: number; taxRate: number; depreciationYears: number }): {
    annualDepreciation: number;
    taxSavings: number;
    totalTaxSavings: number;
  } {
    const annualDepreciation = input.investmentCost / input.depreciationYears;
    const annualTaxSavings = annualDepreciation * input.taxRate;
    const totalTaxSavings = annualTaxSavings * input.depreciationYears;

    return {
      annualDepreciation: Math.round(annualDepreciation),
      taxSavings: Math.round(annualTaxSavings),
      totalTaxSavings: Math.round(totalTaxSavings),
    };
  }

  compareScenarios(baseScenario: RoiInput, alternative: RoiInput): {
    baseRoi: RoiResult;
    alternativeRoi: RoiResult;
    difference: {
      paybackPeriod: number;
      roi: number;
      totalProfit: number;
    };
  } {
    const baseRoi = this.calculate(baseScenario);
    const alternativeRoi = this.calculate(alternative);

    return {
      baseRoi,
      alternativeRoi,
      difference: {
        paybackPeriod: Math.round((alternativeRoi.paybackPeriod - baseRoi.paybackPeriod) * 10) / 10,
        roi: Math.round((alternativeRoi.roi - baseRoi.roi) * 100) / 100,
        totalProfit: alternativeRoi.totalProfit - baseRoi.totalProfit,
      },
    };
  }
}
