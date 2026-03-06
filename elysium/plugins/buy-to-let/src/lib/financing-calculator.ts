import {
  FinancingConfig,
  FinancingCalculation,
  OperatingCosts,
  TaxConfig,
} from '@/types';

/**
 * Calculate financing details for a buy-to-let property
 */
export function calculateFinancing(config: FinancingConfig): FinancingCalculation {
  const {
    purchasePrice,
    equityCapital,
    loanAmount,
    interestRate,
    loanTermYears,
    specialRepaymentAnnual,
  } = config;

  // Calculate effective interest rate (simplified)
  const nominalRate = interestRate / 100;
  const effectiveInterestRate = nominalRate; // Could be adjusted for fees

  // Monthly interest rate
  const monthlyRate = nominalRate / 12;

  // Total months
  const totalMonths = loanTermYears * 12;

  // Calculate annuity (monthly payment)
  // Formula: A = P * [r(1+r)^n] / [(1+r)^n - 1]
  const annuity =
    loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const monthlyRate_payment = annuity;
  const annualRate_payment = annuity * 12;

  // Calculate remaining debt and interest/repayment portions per year
  const remainingDebt: Record<number, number> = {};
  const interestPortion: Record<number, number> = {};
  const repaymentPortion: Record<number, number> = {};

  let currentDebt = loanAmount;
  let totalInterest = 0;
  let totalRepayment = 0;

  for (let year = 1; year <= loanTermYears; year++) {
    let yearInterest = 0;
    let yearRepayment = 0;

    for (let month = 0; month < 12; month++) {
      const interestPayment = currentDebt * monthlyRate;
      const repaymentPayment = monthlyRate_payment - interestPayment;

      currentDebt -= repaymentPayment;
      yearInterest += interestPayment;
      yearRepayment += repaymentPayment;

      if (currentDebt < 0) currentDebt = 0;
    }

    // Apply special repayment at end of year
    if (specialRepaymentAnnual > 0 && currentDebt > 0) {
      const actualSpecialRepayment = Math.min(specialRepaymentAnnual, currentDebt);
      currentDebt -= actualSpecialRepayment;
      yearRepayment += actualSpecialRepayment;
    }

    remainingDebt[year] = Math.round(currentDebt * 100) / 100;
    interestPortion[year] = Math.round(yearInterest * 100) / 100;
    repaymentPortion[year] = Math.round(yearRepayment * 100) / 100;

    totalInterest += yearInterest;
    totalRepayment += yearRepayment;

    if (currentDebt <= 0) break;
  }

  return {
    monthlyRate: Math.round(monthlyRate_payment * 100) / 100,
    annualRate: Math.round(annualRate_payment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    remainingDebt,
    interestPortion,
    repaymentPortion,
    effectiveInterestRate: Math.round(effectiveInterestRate * 10000) / 100,
  };
}

/**
 * Calculate optimal financing based on equity and property price
 */
export function optimizeFinancing(
  purchasePrice: number,
  availableEquity: number,
  targetLoanTermYears: number = 20,
  maxInterestRate: number = 4.5
): FinancingConfig {
  // Recommended equity ratio: 20-30% for optimal financing
  const minEquityRatio = 0.20;
  const maxEquityRatio = 0.30;

  const minEquity = purchasePrice * minEquityRatio;
  const maxEquity = purchasePrice * maxEquityRatio;

  // Use optimal equity amount
  let equityCapital: number;
  if (availableEquity < minEquity) {
    equityCapital = availableEquity; // Use all available
  } else if (availableEquity > maxEquity) {
    equityCapital = maxEquity; // Keep some liquidity
  } else {
    equityCapital = availableEquity; // Use what's available
  }

  const loanAmount = purchasePrice - equityCapital;

  return {
    purchasePrice,
    equityCapital: Math.round(equityCapital * 100) / 100,
    loanAmount: Math.round(loanAmount * 100) / 100,
    interestRate: maxInterestRate,
    loanTermYears: targetLoanTermYears,
    specialRepaymentAnnual: 0,
  };
}

/**
 * Calculate total acquisition costs including purchase fees
 */
export function calculateAcquisitionCosts(
  purchasePrice: number,
  location: 'germany' | 'specific' = 'germany',
  notaryRate: number = 0.015,
  landTransferTaxRate: number = 0.06 // Varies by state (3.5% - 6.5%)
): {
  purchasePrice: number;
  notaryFees: number;
  landTransferTax: number;
  agentCommission: number;
  totalCost: number;
} {
  const notaryFees = purchasePrice * notaryRate;
  const landTransferTax = purchasePrice * landTransferTaxRate;
  const agentCommission = purchasePrice * 0.0357; // Typically 3.57% (shared)

  const totalCost = purchasePrice + notaryFees + landTransferTax + agentCommission;

  return {
    purchasePrice,
    notaryFees: Math.round(notaryFees * 100) / 100,
    landTransferTax: Math.round(landTransferTax * 100) / 100,
    agentCommission: Math.round(agentCommission * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
  };
}
