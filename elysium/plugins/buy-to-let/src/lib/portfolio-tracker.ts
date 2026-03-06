import { PropertyObject, PortfolioOverview, LongTermProjection } from '@/types';
import { createLongTermProjection } from './long-term-projection';

/**
 * Track and analyze a portfolio of buy-to-let properties
 */
export function analyzePortfolio(properties: PropertyObject[]): PortfolioOverview {
  if (properties.length === 0) {
    return {
      totalProperties: 0,
      totalInvestment: 0,
      totalEquity: 0,
      totalDebt: 0,
      totalMonthlyRent: 0,
      totalMonthlyCashflow: 0,
      averageYield: 0,
      averageCashOnCash: 0,
      cities: {},
      propertyTypes: {},
      concentrationRisk: 'low',
    };
  }

  let totalInvestment = 0;
  let totalEquity = 0;
  let totalDebt = 0;
  let totalMonthlyRent = 0;
  let totalMonthlyCashflow = 0;
  let totalYield = 0;
  let totalCashOnCash = 0;
  const cities: Record<string, number> = {};
  const propertyTypes: Record<string, number> = {};

  properties.forEach((property) => {
    // Investment totals
    totalInvestment += property.purchasePrice;
    totalEquity += property.financing.equityCapital;
    totalDebt += property.financing.loanAmount;

    // Rental income
    totalMonthlyRent += property.rentalIncome.coldRent;

    // Calculate cashflow for this property
    const monthlyCashflow = calculatePropertyCashflow(property);
    totalMonthlyCashflow += monthlyCashflow;

    // Yield calculations
    const grossYield = (property.rentalIncome.coldRent * 12 / property.purchasePrice) * 100;
    totalYield += grossYield;

    const cashOnCash = (monthlyCashflow * 12 / property.financing.equityCapital) * 100;
    totalCashOnCash += cashOnCash;

    // Track cities
    cities[property.city] = (cities[property.city] || 0) + 1;

    // Track property types
    propertyTypes[property.propertyType] = (propertyTypes[property.propertyType] || 0) + 1;
  });

  const averageYield = totalYield / properties.length;
  const averageCashOnCash = totalCashOnCash / properties.length;

  // Calculate concentration risk
  const maxCityCount = Math.max(...Object.values(cities));
  const maxTypeCount = Math.max(...Object.values(propertyTypes));
  const cityConcentration = maxCityCount / properties.length;
  const typeConcentration = maxTypeCount / properties.length;

  let concentrationRisk: 'low' | 'medium' | 'high' = 'low';
  if (cityConcentration > 0.7 || typeConcentration > 0.7) {
    concentrationRisk = 'high';
  } else if (cityConcentration > 0.5 || typeConcentration > 0.5) {
    concentrationRisk = 'medium';
  }

  return {
    totalProperties: properties.length,
    totalInvestment: Math.round(totalInvestment),
    totalEquity: Math.round(totalEquity),
    totalDebt: Math.round(totalDebt),
    totalMonthlyRent: Math.round(totalMonthlyRent * 100) / 100,
    totalMonthlyCashflow: Math.round(totalMonthlyCashflow * 100) / 100,
    averageYield: Math.round(averageYield * 100) / 100,
    averageCashOnCash: Math.round(averageCashOnCash * 100) / 100,
    cities,
    propertyTypes,
    concentrationRisk,
  };
}

function calculatePropertyCashflow(property: PropertyObject): number {
  const monthlyRent = property.rentalIncome.coldRent;
  const monthlyCosts =
    property.operatingCosts.propertyManagement +
    property.operatingCosts.maintenanceReserve +
    property.operatingCosts.propertyTax / 12 +
    property.operatingCosts.insurance / 12 +
    property.operatingCosts.otherCosts / 12;
  
  const monthlyFinancing = property.financing.loanAmount > 0
    ? calculateMonthlyPayment(property.financing)
    : 0;

  return monthlyRent - monthlyCosts - monthlyFinancing;
}

function calculateMonthlyPayment(financing: PropertyObject['financing']): number {
  const monthlyRate = financing.interestRate / 100 / 12;
  const totalMonths = financing.loanTermYears * 12;
  
  return financing.loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
}

/**
 * Calculate portfolio-wide projections
 */
export function projectPortfolioPerformance(
  properties: PropertyObject[],
  projectionYears: number = 30
): {
  year: number;
  totalPropertyValue: number;
  totalDebt: number;
  totalEquity: number;
  totalAnnualRent: number;
  totalAnnualCashflow: number;
  cumulativeCashflow: number;
  portfolioROI: number;
}[] {
  const portfolioProjections: {
    year: number;
    totalPropertyValue: number;
    totalDebt: number;
    totalEquity: number;
    totalAnnualRent: number;
    totalAnnualCashflow: number;
    cumulativeCashflow: number;
    portfolioROI: number;
  }[] = [];

  const initialEquity = properties.reduce((sum, p) => sum + p.financing.equityCapital, 0);
  let cumulativeCashflow = 0;

  for (let year = 1; year <= projectionYears; year++) {
    let totalPropertyValue = 0;
    let totalDebt = 0;
    let totalAnnualRent = 0;
    let totalAnnualCashflow = 0;

    properties.forEach((property) => {
      // Create projection for this property
      const projections = createLongTermProjection(
        property.financing,
        property.rentalIncome,
        property.operatingCosts,
        property.taxConfig,
        year
      );

      const yearProjection = projections[projections.length - 1];

      totalPropertyValue += yearProjection.propertyValue;
      totalDebt += yearProjection.remainingDebt;
      totalAnnualRent += yearProjection.annualRent;
      totalAnnualCashflow += yearProjection.annualCashflow;
    });

    cumulativeCashflow += totalAnnualCashflow;
    const totalEquity = totalPropertyValue - totalDebt;
    const portfolioROI = ((totalEquity + cumulativeCashflow - initialEquity) / initialEquity) * 100;

    portfolioProjections.push({
      year,
      totalPropertyValue: Math.round(totalPropertyValue),
      totalDebt: Math.round(totalDebt),
      totalEquity: Math.round(totalEquity),
      totalAnnualRent: Math.round(totalAnnualRent),
      totalAnnualCashflow: Math.round(totalAnnualCashflow),
      cumulativeCashflow: Math.round(cumulativeCashflow),
      portfolioROI: Math.round(portfolioROI * 100) / 100,
    });
  }

  return portfolioProjections;
}

/**
 * Identify portfolio optimization opportunities
 */
export function identifyOptimizationOpportunities(
  portfolio: PortfolioOverview,
  properties: PropertyObject[]
): {
  diversificationIssues: string[];
  cashflowOptimization: string[];
  riskWarnings: string[];
  recommendations: string[];
} {
  const diversificationIssues: string[] = [];
  const cashflowOptimization: string[] = [];
  const riskWarnings: string[] = [];
  const recommendations: string[] = [];

  // Check diversification
  if (portfolio.concentrationRisk === 'high') {
    const topCity = Object.entries(portfolio.cities).sort((a, b) => b[1] - a[1])[0];
    if (topCity) {
      diversificationIssues.push(`Stark konzentriert in ${topCity[0]} (${topCity[1]} von ${portfolio.totalProperties} Objekten)`);
    }
  }

  if (Object.keys(portfolio.propertyTypes).length === 1) {
    diversificationIssues.push('Alle Objekte sind vom gleichen Typ');
  }

  // Check cashflow
  if (portfolio.totalMonthlyCashflow < 0) {
    cashflowOptimization.push('Negativer Cashflow - Mieten prüfen oder Finanzierung optimieren');
    riskWarnings.push('Monatliche Zuschüsse erforderlich');
  } else if (portfolio.averageCashOnCash < 3) {
    cashflowOptimization.push('Niedrige Cash-on-Cash Rendite - Nachfinanzierung oder Mietanpassung prüfen');
  }

  // Risk warnings
  if (portfolio.totalDebt / portfolio.totalInvestment > 0.8) {
    riskWarnings.push('Hohe Verschuldung (>80% LTV) - Zinsänderungsrisiko beachten');
  }

  if (portfolio.totalProperties === 1) {
    riskWarnings.push('Einzelobjekt - kein Diversifikationsvorteil');
  }

  // Recommendations
  if (diversificationIssues.length > 0) {
    recommendations.push('Portfolio diversifizieren (andere Städte/Objekttypen)');
  }

  if (portfolio.averageYield < 4) {
    recommendations.push('Auf Objekte mit höherer Mietrendite achten (>4%)');
  }

  if (portfolio.totalProperties < 3) {
    recommendations.push('Weiteres Objekt zur Diversifikation erwägen');
  }

  recommendations.push('Regelmäßige Neubewertung der Objekte durchführen');
  recommendations.push('Zinsbindung rechtzeitig erneuern');

  return {
    diversificationIssues,
    cashflowOptimization,
    riskWarnings,
    recommendations,
  };
}
