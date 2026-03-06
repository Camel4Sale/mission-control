import {
  FinancingConfig,
  RentalIncome,
  OperatingCosts,
  TaxConfig,
  FinancingCalculation,
  LongTermProjection,
  ScenarioConfig,
  ScenarioResult,
} from '@/types';
import { calculateFinancing } from './financing-calculator';
import { analyzeCashflow, projectRentalIncome, projectOperatingCosts } from './cashflow-analyzer';

/**
 * Create long-term projection for a buy-to-let investment
 */
export function createLongTermProjection(
  financingConfig: FinancingConfig,
  rentalIncome: RentalIncome,
  operatingCosts: OperatingCosts,
  taxConfig: TaxConfig,
  projectionYears: number = 30,
  rentGrowthRate: number = 2.0,
  propertyValueGrowthRate: number = 2.5,
  inflationRate: number = 2.0
): LongTermProjection[] {
  const projections: LongTermProjection[] = [];
  
  // Initial values
  let currentPropertyValuation = financingConfig.purchasePrice;
  let currentRent = rentalIncome.coldRent;
  
  // Calculate initial financing
  const financing = calculateFinancing(financingConfig);
  
  let cumulativeCashflow = 0;
  let totalInvested = financingConfig.equityCapital;

  for (let year = 1; year <= projectionYears; year++) {
    // Property value development
    currentPropertyValuation = financingConfig.purchasePrice * 
      Math.pow(1 + propertyValueGrowthRate / 100, year);

    // Rent development
    currentRent = rentalIncome.coldRent * Math.pow(1 + rentGrowthRate / 100, year - 1);

    // Update rental income for this year
    const currentRentalIncome: RentalIncome = {
      ...rentalIncome,
      coldRent: currentRent,
    };

    // Get remaining debt from financing calculation
    const remainingDebt = financing.remainingDebt[year] || 0;

    // Calculate equity
    const equity = currentPropertyValuation - remainingDebt;

    // Calculate cashflow for this year
    const updatedOperatingCosts: OperatingCosts = {
      propertyManagement: operatingCosts.propertyManagement * Math.pow(1 + inflationRate / 100, year - 1),
      maintenanceReserve: operatingCosts.maintenanceReserve * Math.pow(1 + inflationRate / 100, year - 1),
      propertyTax: operatingCosts.propertyTax * Math.pow(1 + inflationRate / 100, year - 1),
      insurance: operatingCosts.insurance * Math.pow(1 + inflationRate / 100, year - 1),
      otherCosts: operatingCosts.otherCosts * Math.pow(1 + inflationRate / 100, year - 1),
    };

    // Recalculate financing for remaining debt if needed
    const cashflowAnalysis = analyzeCashflow(
      currentRentalIncome,
      updatedOperatingCosts,
      financing,
      taxConfig,
      financingConfig.purchasePrice,
      financingConfig.equityCapital
    );

    // Update cumulative cashflow
    cumulativeCashflow += cashflowAnalysis.annualCashflow;

    // Calculate total return (equity + cumulative cashflow - initial investment)
    const totalReturn = equity + cumulativeCashflow - totalInvested;

    // Calculate ROI
    const roi = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    // Calculate real value (inflation-adjusted)
    const inflationFactor = Math.pow(1 + inflationRate / 100, year);
    const realPropertyValue = currentPropertyValuation / inflationFactor;
    const realEquity = equity / inflationFactor;

    projections.push({
      year,
      propertyValue: Math.round(currentPropertyValuation),
      remainingDebt: Math.round(remainingDebt),
      equity: Math.round(equity),
      annualRent: Math.round(currentRent * 12),
      annualCashflow: Math.round(cashflowAnalysis.annualCashflow),
      cumulativeCashflow: Math.round(cumulativeCashflow),
      totalReturn: Math.round(totalReturn),
      roi: Math.round(roi * 100) / 100,
    });
  }

  return projections;
}

/**
 * Define standard scenarios for comparison
 */
export const STANDARD_SCENARIOS: ScenarioConfig[] = [
  {
    name: 'Basis',
    rentGrowthAnnual: 2.0,
    propertyValueGrowthAnnual: 2.5,
    description: 'Erwartete Entwicklung (Inflation + Marktwachstum)',
  },
  {
    name: 'Optimistisch',
    rentGrowthAnnual: 5.0,
    propertyValueGrowthAnnual: 4.0,
    description: 'Starker Mietmarkt + Wertsteigerung',
  },
  {
    name: 'Pessimistisch',
    rentGrowthAnnual: -2.0,
    propertyValueGrowthAnnual: 0.0,
    description: 'Mietspiegel sinkt, keine Wertsteigerung',
  },
  {
    name: 'Zins-Schock',
    rentGrowthAnnual: 2.0,
    propertyValueGrowthAnnual: 1.0,
    interestRateChange: 3.0,
    description: 'Zinsen steigen +3% nach 10 Jahren',
  },
];

/**
 * Run all scenarios and compare results
 */
export function compareScenarios(
  financingConfig: FinancingConfig,
  rentalIncome: RentalIncome,
  operatingCosts: OperatingCosts,
  taxConfig: TaxConfig,
  scenarios: ScenarioConfig[] = STANDARD_SCENARIOS,
  projectionYears: number = 30
): ScenarioResult[] {
  return scenarios.map((scenario) => {
    const projections = createLongTermProjection(
      financingConfig,
      rentalIncome,
      operatingCosts,
      taxConfig,
      projectionYears,
      scenario.rentGrowthAnnual,
      scenario.propertyValueGrowthAnnual
    );

    const finalProjection = projections[projections.length - 1];

    // Handle interest rate change scenario
    if (scenario.interestRateChange) {
      // Recalculate with adjusted interest rate after 10 years
      // This is a simplified adjustment
      const adjustedProjections = adjustForInterestRateChange(
        projections,
        scenario.interestRateChange,
        10
      );
      return createScenarioResult(scenario, adjustedProjections);
    }

    return createScenarioResult(scenario, projections);
  });
}

function adjustForInterestRateChange(
  projections: LongTermProjection[],
  rateIncrease: number,
  startYear: number
): LongTermProjection[] {
  // Simplified: reduce cashflow from startYear onwards
  return projections.map((proj, index) => {
    const year = index + 1;
    if (year <= startYear) return proj;

    // Estimate impact of rate increase on cashflow
    const cashflowReduction = proj.remainingDebt * (rateIncrease / 100);
    const adjustedCashflow = proj.annualCashflow - cashflowReduction;
    const adjustedCumulative = projections
      .slice(0, year)
      .reduce((sum, p, i) => sum + (i < startYear ? p.annualCashflow : adjustedCashflow), 0);

    return {
      ...proj,
      annualCashflow: Math.round(adjustedCashflow),
      cumulativeCashflow: Math.round(adjustedCumulative),
      totalReturn: Math.round(proj.equity + adjustedCumulative - proj.equity + proj.remainingDebt),
    };
  });
}

function createScenarioResult(
  scenario: ScenarioConfig,
  projections: LongTermProjection[]
): ScenarioResult {
  const finalProjection = projections[projections.length - 1];
  const totalInvestment = projections[0]?.equity || 0;
  const totalReturn = finalProjection.totalReturn;
  const years = projections.length;

  return {
    scenario,
    projections,
    totalReturn: Math.round(totalReturn),
    averageAnnualReturn: Math.round((totalReturn / years) * 100) / 100,
    finalEquity: Math.round(finalProjection.equity),
    finalPropertyValuation: Math.round(finalProjection.propertyValue),
  };
}

/**
 * Calculate inflation hedge effectiveness
 */
export function calculateInflationHedge(
  projections: LongTermProjection[],
  inflationRate: number = 2.0
): {
  nominalFinalValue: number;
  realFinalValue: number;
  inflationLoss: number;
  hedgeEffectiveness: number;
} {
  const finalProjection = projections[projections.length - 1];
  const years = projections.length;

  const nominalFinalValue = finalProjection.propertyValue;
  const inflationFactor = Math.pow(1 + inflationRate / 100, years);
  const realFinalValue = nominalFinalValue / inflationFactor;
  const inflationLoss = nominalFinalValue - realFinalValue;

  // Hedge effectiveness: how much of the value is preserved in real terms
  const hedgeEffectiveness = (realFinalValue / nominalFinalValue) * 100;

  return {
    nominalFinalValue: Math.round(nominalFinalValue),
    realFinalValue: Math.round(realFinalValue),
    inflationLoss: Math.round(inflationLoss),
    hedgeEffectiveness: Math.round(hedgeEffectiveness * 100) / 100,
  };
}
