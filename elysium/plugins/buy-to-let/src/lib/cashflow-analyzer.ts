import {
  RentalIncome,
  OperatingCosts,
  TaxConfig,
  FinancingCalculation,
  CashflowAnalysis,
} from '@/types';

/**
 * Calculate comprehensive cashflow analysis
 */
export function analyzeCashflow(
  rentalIncome: RentalIncome,
  operatingCosts: OperatingCosts,
  financing: FinancingCalculation,
  taxConfig: TaxConfig,
  purchasePrice: number,
  equityCapital: number
): CashflowAnalysis {
  // Calculate rental income
  let monthlyRentalIncome = rentalIncome.coldRent;
  
  if (rentalIncome.rentalType === 'warm' && rentalIncome.warmRent) {
    monthlyRentalIncome = rentalIncome.warmRent;
  }

  const annualRentalIncome = monthlyRentalIncome * 12;

  // Apply vacancy rate
  const effectiveAnnualRent = annualRentalIncome * (1 - rentalIncome.vacancyRate / 100);

  // Calculate operating costs
  const monthlyOperatingCosts =
    operatingCosts.propertyManagement +
    operatingCosts.maintenanceReserve +
    operatingCosts.propertyTax / 12 +
    operatingCosts.insurance / 12 +
    operatingCosts.otherCosts / 12;

  const annualOperatingCosts = monthlyOperatingCosts * 12;

  // Financing costs
  const monthlyFinancingCost = financing.monthlyRate;
  const annualFinancingCost = financing.annualRate;

  // Calculate cashflow
  const monthlyCashflow = monthlyRentalIncome - monthlyOperatingCosts - monthlyFinancingCost;
  const annualCashflow = effectiveAnnualRent - annualOperatingCosts - annualFinancingCost;

  // Tax calculation (simplified)
  const taxableIncome = Math.max(0, annualCashflow);
  const incomeTax = taxableIncome * (taxConfig.incomeTaxRate / 100);
  const afterTaxCashflow = annualCashflow - incomeTax;

  // Returns
  const cashOnCashReturn = equityCapital > 0 
    ? (afterTaxCashflow / equityCapital) * 100 
    : 0;
  
  const grossYield = purchasePrice > 0 
    ? (annualRentalIncome / purchasePrice) * 100 
    : 0;
  
  const netYield = purchasePrice > 0 
    ? ((effectiveAnnualRent - annualOperatingCosts) / purchasePrice) * 100 
    : 0;

  return {
    monthlyRentalIncome: Math.round(monthlyRentalIncome * 100) / 100,
    annualRentalIncome: Math.round(annualRentalIncome * 100) / 100,
    monthlyOperatingCosts: Math.round(monthlyOperatingCosts * 100) / 100,
    annualOperatingCosts: Math.round(annualOperatingCosts * 100) / 100,
    monthlyFinancingCost: Math.round(monthlyFinancingCost * 100) / 100,
    annualFinancingCost: Math.round(annualFinancingCost * 100) / 100,
    monthlyCashflow: Math.round(monthlyCashflow * 100) / 100,
    annualCashflow: Math.round(annualCashflow * 100) / 100,
    cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
    grossYield: Math.round(grossYield * 100) / 100,
    netYield: Math.round(netYield * 100) / 100,
  };
}

/**
 * Calculate depreciation (AfA) benefits
 */
export function calculateDepreciationBenefit(
  purchasePrice: number,
  buildingValueRatio: number = 0.7, // Typically 70% of purchase price is building
  depreciationRate: number = 0.02, // 2% linear depreciation
  taxRate: number = 0.35 // Marginal tax rate
): {
  annualDepreciation: number;
  taxSaving: number;
  depreciationPeriod: number;
} {
  const buildingValue = purchasePrice * buildingValueRatio;
  const annualDepreciation = buildingValue * depreciationRate;
  const taxSaving = annualDepreciation * taxRate;
  const depreciationPeriod = 1 / depreciationRate;

  return {
    annualDepreciation: Math.round(annualDepreciation * 100) / 100,
    taxSaving: Math.round(taxSaving * 100) / 100,
    depreciationPeriod: Math.round(depreciationPeriod),
  };
}

/**
 * Project rental income development over time
 */
export function projectRentalIncome(
  baseRent: number,
  annualGrowthRate: number,
  years: number,
  vacancyRate: number = 0.05
): {
  year: number;
  monthlyRent: number;
  annualRent: number;
  effectiveAnnualRent: number;
}[] {
  const projections = [];

  for (let year = 1; year <= years; year++) {
    const monthlyRent = baseRent * Math.pow(1 + annualGrowthRate / 100, year - 1);
    const annualRent = monthlyRent * 12;
    const effectiveAnnualRent = annualRent * (1 - vacancyRate / 100);

    projections.push({
      year,
      monthlyRent: Math.round(monthlyRent * 100) / 100,
      annualRent: Math.round(annualRent * 100) / 100,
      effectiveAnnualRent: Math.round(effectiveAnnualRent * 100) / 100,
    });
  }

  return projections;
}

/**
 * Calculate operating cost projections with inflation
 */
export function projectOperatingCosts(
  baseCosts: OperatingCosts,
  inflationRate: number,
  years: number
): {
  year: number;
  totalAnnualCosts: number;
  breakdown: OperatingCosts;
}[] {
  const projections = [];

  for (let year = 1; year <= years; year++) {
    const growthFactor = Math.pow(1 + inflationRate / 100, year - 1);

    const projectedCosts: OperatingCosts = {
      propertyManagement: baseCosts.propertyManagement * growthFactor,
      maintenanceReserve: baseCosts.maintenanceReserve * growthFactor,
      propertyTax: baseCosts.propertyTax * growthFactor,
      insurance: baseCosts.insurance * growthFactor,
      otherCosts: baseCosts.otherCosts * growthFactor,
    };

    const totalAnnualCosts =
      projectedCosts.propertyManagement * 12 +
      projectedCosts.maintenanceReserve * 12 +
      projectedCosts.propertyTax +
      projectedCosts.insurance +
      projectedCosts.otherCosts;

    projections.push({
      year,
      totalAnnualCosts: Math.round(totalAnnualCosts * 100) / 100,
      breakdown: {
        propertyManagement: Math.round(projectedCosts.propertyManagement * 100) / 100,
        maintenanceReserve: Math.round(projectedCosts.maintenanceReserve * 100) / 100,
        propertyTax: Math.round(projectedCosts.propertyTax * 100) / 100,
        insurance: Math.round(projectedCosts.insurance * 100) / 100,
        otherCosts: Math.round(projectedCosts.otherCosts * 100) / 100,
      },
    });
  }

  return projections;
}
