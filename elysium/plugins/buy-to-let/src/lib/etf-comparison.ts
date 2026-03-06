import { ETFComparison, LongTermProjection } from '@/types';

/**
 * Compare real estate investment vs. ETF investment
 */
export function compareWithETF(
  equityInvestment: number,
  investmentPeriodYears: number,
  etfExpectedReturn: number = 7.0, // Historical average stock market return
  etfVolatility: number = 15.0, // Annual volatility
  etfMaxDrawdown: number = 50.0, // Worst historical drawdown
  capitalGainsTaxRate: number = 26.375 // German Abgeltungsteuer + Soli
): ETFComparison {
  // Calculate ETF final value with compound interest
  // FV = PV * (1 + r)^n
  const grossFinalValue = equityInvestment * Math.pow(1 + etfExpectedReturn / 100, investmentPeriodYears);
  
  // Calculate taxes on gains
  const totalGain = grossFinalValue - equityInvestment;
  const taxes = totalGain * (capitalGainsTaxRate / 100);
  const netFinalValue = grossFinalValue - taxes;
  
  const totalReturn = netFinalValue - equityInvestment;
  const averageAnnualReturn = (Math.pow(netFinalValue / equityInvestment, 1 / investmentPeriodYears) - 1) * 100;

  return {
    investmentAmount: equityInvestment,
    investmentPeriodYears,
    expectedAnnualReturn: etfExpectedReturn,
    volatility: etfVolatility,
    maxDrawdown: etfMaxDrawdown,
    finalValue: Math.round(grossFinalValue * 100) / 100,
    totalReturn: Math.round(totalReturn * 100) / 100,
    averageAnnualReturn: Math.round(averageAnnualReturn * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    netReturn: Math.round((netFinalValue - equityInvestment) * 100) / 100,
  };
}

/**
 * Calculate risk-adjusted returns for comparison
 */
export function calculateRiskAdjustedReturns(
  propertyReturn: number,
  propertyVolatility: number,
  etfReturn: number,
  etfVolatility: number,
  riskFreeRate: number = 2.0 // Assume 2% risk-free rate
): {
  propertySharpeRatio: number;
  etfSharpeRatio: number;
  betterRiskAdjusted: 'property' | 'etf';
} {
  // Sharpe Ratio = (Return - Risk-free rate) / Volatility
  const propertySharpeRatio = (propertyReturn - riskFreeRate) / propertyVolatility;
  const etfSharpeRatio = (etfReturn - riskFreeRate) / etfVolatility;

  return {
    propertySharpeRatio: Math.round(propertySharpeRatio * 100) / 100,
    etfSharpeRatio: Math.round(etfSharpeRatio * 100) / 100,
    betterRiskAdjusted: propertySharpeRatio > etfSharpeRatio ? 'property' : 'etf',
  };
}

/**
 * Generate investment recommendation based on comparison
 */
export function generateRecommendation(
  propertyProjections: LongTermProjection[],
  etfComparison: ETFComparison,
  investorProfile: 'conservative' | 'balanced' | 'aggressive' = 'balanced'
): {
  recommendation: 'property' | 'etf' | 'mixed';
  confidence: 'low' | 'medium' | 'high';
  reasoning: string[];
  optimalSplit?: {
    property: number;
    etf: number;
  };
} {
  const finalPropertyProjection = propertyProjections[propertyProjections.length - 1];
  const propertyTotalReturn = finalPropertyProjection.totalReturn;
  const propertyAnnualReturn = (finalPropertyProjection.roi / propertyProjections.length);
  
  const etfAnnualReturn = etfComparison.averageAnnualReturn;

  const reasoning: string[] = [];
  let recommendation: 'property' | 'etf' | 'mixed' = 'mixed';
  let confidence: 'low' | 'medium' | 'high' = 'medium';

  // Analyze returns
  if (propertyAnnualReturn > etfAnnualReturn + 2) {
    reasoning.push('Immobilie bietet signifikant höhere Rendite');
    recommendation = 'property';
  } else if (etfAnnualReturn > propertyAnnualReturn + 2) {
    reasoning.push('ETF bietet signifikant höhere Rendite');
    recommendation = 'etf';
  } else {
    reasoning.push('Renditen sind vergleichbar');
  }

  // Consider liquidity
  reasoning.push('ETF bietet höhere Liquidität (jederzeit verkaufbar)');
  if (recommendation !== 'etf') {
    reasoning.push('Immobilie bietet geringere Liquidität, aber stabilere Cashflows');
  }

  // Consider risk
  if (investorProfile === 'conservative') {
    reasoning.push('Für konservative Anleger: Immobilie bietet geringere Volatilität');
    if (recommendation === 'etf') {
      recommendation = 'mixed';
    }
  } else if (investorProfile === 'aggressive') {
    reasoning.push('Für aggressive Anleger: ETF bietet höhere Wachstumspotenziale');
  }

  // Tax considerations
  reasoning.push('Steuerlich: Immobilie ermöglicht AfA, ETF hat Abgeltungsteuer');

  // Diversification benefit
  if (recommendation === 'mixed') {
    confidence = 'high';
    reasoning.push('Empfehlung: Diversifikation über beide Anlageklassen');
  }

  // Optimal split for mixed recommendation
  let optimalSplit: { property: number; etf: number } | undefined;
  if (recommendation === 'mixed') {
    if (investorProfile === 'conservative') {
      optimalSplit = { property: 70, etf: 30 };
    } else if (investorProfile === 'aggressive') {
      optimalSplit = { property: 30, etf: 70 };
    } else {
      optimalSplit = { property: 50, etf: 50 };
    }
  }

  return {
    recommendation,
    confidence,
    reasoning,
    optimalSplit,
  };
}

/**
 * Compare leverage effects
 */
export function analyzeLeverageEffect(
  propertyReturn: number,
  loanInterestRate: number,
  loanToValue: number // Percentage of property financed with debt
): {
  unleveredReturn: number;
  leveredReturn: number;
  leverageGain: number;
  isPositiveLeverage: boolean;
} {
  // Simplified leverage calculation
  const equityRatio = 1 - loanToValue / 100;
  
  // Unlevered return (if bought entirely with equity)
  const unleveredReturn = propertyReturn;
  
  // Levered return (with debt financing)
  // Return on equity = (Property return - Debt cost * Debt ratio) / Equity ratio
  const debtCost = loanInterestRate;
  const leveredReturn = (propertyReturn - debtCost * (loanToValue / 100)) / equityRatio;
  
  const leverageGain = leveredReturn - unleveredReturn;
  const isPositiveLeverage = propertyReturn > loanInterestRate;

  return {
    unleveredReturn: Math.round(unleveredReturn * 100) / 100,
    leveredReturn: Math.round(leveredReturn * 100) / 100,
    leverageGain: Math.round(leverageGain * 100) / 100,
    isPositiveLeverage,
  };
}
