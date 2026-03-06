import { ExitPlan, LongTermProjection, TaxConfig } from '@/types';

/**
 * Plan exit strategy for a buy-to-let investment
 */
export function planExit(
  projections: LongTermProjection[],
  taxConfig: TaxConfig,
  saleYear: number,
  installmentSale?: boolean
): ExitPlan {
  if (saleYear < 1 || saleYear > projections.length) {
    throw new Error('Sale year must be within projection period');
  }

  const projection = projections[saleYear - 1];
  const salePrice = projection.propertyValue;
  const remainingDebt = projection.remainingDebt;

  // Calculate gross profit
  // Profit = Sale price - remaining debt - original purchase price
  const originalPurchasePrice = projections[0].propertyValue - projections[0].equity + projections[0].remainingDebt;
  const grossProfit = salePrice - remainingDebt - originalPurchasePrice;

  // Check if within speculation period (10 years in Germany)
  const isWithinSpeculationPeriod = saleYear <= taxConfig.speculationPeriodYears;
  const isTaxFree = isWithinSpeculationPeriod && grossProfit <= 0; // Only tax-free if no profit

  // Calculate capital gains tax
  let capitalGainsTax = 0;
  if (grossProfit > 0) {
    if (isWithinSpeculationPeriod) {
      // Full taxation as ordinary income
      capitalGainsTax = grossProfit * (taxConfig.incomeTaxRate / 100);
    } else {
      // After speculation period: tax-free for private sales
      capitalGainsTax = 0;
    }
  }

  // Net profit after tax
  const netProfit = grossProfit - capitalGainsTax;

  // Installment sale calculation (Ratenverkauf)
  let installmentSaleDetails: ExitPlan['installmentSale'] | undefined;
  if (installmentSale && grossProfit > 0 && isWithinSpeculationPeriod) {
    // Spread profit recognition over multiple years
    const installmentYears = 5;
    const annualPayment = salePrice / installmentYears;
    const annualProfit = grossProfit / installmentYears;
    const annualTax = annualProfit * (taxConfig.incomeTaxRate / 100);
    const totalTaxWithInstallments = annualTax * installmentYears;
    const taxDeferral = capitalGainsTax - totalTaxWithInstallments;

    installmentSaleDetails = {
      annualPayments: Math.round(annualPayment),
      years: installmentYears,
      taxDeferral: Math.round(taxDeferral * 100) / 100,
    };
  }

  return {
    saleYear,
    salePrice: Math.round(salePrice),
    remainingDebt: Math.round(remainingDebt),
    grossProfit: Math.round(grossProfit * 100) / 100,
    capitalGainsTax: Math.round(capitalGainsTax * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    isTaxFree: saleYear > taxConfig.speculationPeriodYears,
    installmentSale: installmentSaleDetails,
  };
}

/**
 * Compare different exit strategies
 */
export function compareExitStrategies(
  projections: LongTermProjection[],
  taxConfig: TaxConfig,
  saleYears: number[] = [5, 10, 15, 20, 30]
): {
  saleYear: number;
  salePrice: number;
  netProfit: number;
  isTaxFree: boolean;
  annualizedReturn: number;
}[] {
  return saleYears
    .filter((year) => year <= projections.length)
    .map((year) => {
      const exitPlan = planExit(projections, taxConfig, year);
      const projection = projections[year - 1];
      
      // Calculate annualized return
      const totalReturn = exitPlan.netProfit + projection.cumulativeCashflow;
      const initialInvestment = projection.propertyValue - projection.remainingDebt + projection.cumulativeCashflow - projection.totalReturn;
      const annualizedReturn = initialInvestment > 0 
        ? (Math.pow(1 + totalReturn / initialInvestment, 1 / year) - 1) * 100 
        : 0;

      return {
        saleYear: year,
        salePrice: exitPlan.salePrice,
        netProfit: exitPlan.netProfit,
        isTaxFree: exitPlan.isTaxFree,
        annualizedReturn: Math.round(annualizedReturn * 100) / 100,
      };
    });
}

/**
 * Calculate optimal exit timing based on tax and market conditions
 */
export function findOptimalExitTiming(
  projections: LongTermProjection[],
  taxConfig: TaxConfig,
  targetNetProfit: number = 0
): {
  optimalYear: number;
  reasoning: string;
  netProfit: number;
  taxSavings: number;
  alternativeYears: number[];
} {
  const strategies = compareExitStrategies(projections, taxConfig);
  
  // Find first tax-free sale year with positive profit
  const taxFreeYears = strategies.filter((s) => s.isTaxFree && s.netProfit > 0);
  
  // Find year with maximum net profit
  const maxProfitYear = strategies.reduce((max, current) => 
    current.netProfit > max.netProfit ? current : max, strategies[0]);

  let optimalYear: number;
  let reasoning: string;

  if (taxFreeYears.length > 0) {
    // Prefer tax-free sale after speculation period
    optimalYear = taxFreeYears[0].saleYear;
    reasoning = `Steuerfreier Verkauf nach ${taxConfig.speculationPeriodYears} Jahren (Spekulationsfrist)`;
  } else {
    // Maximize profit if no tax-free option
    optimalYear = maxProfitYear.saleYear;
    reasoning = 'Maximierung des Nettogewinns';
  }

  const optimalStrategy = strategies.find((s) => s.saleYear === optimalYear)!;
  
  // Calculate tax savings vs. selling immediately
  const immediateSale = strategies[0];
  const taxSavings = optimalStrategy.netProfit - immediateSale.netProfit;

  // Alternative years (within 2 years of optimal)
  const alternativeYears = strategies
    .filter((s) => Math.abs(s.saleYear - optimalYear) <= 2 && s.saleYear !== optimalYear)
    .map((s) => s.saleYear);

  return {
    optimalYear,
    reasoning,
    netProfit: optimalStrategy.netProfit,
    taxSavings: Math.round(taxSavings * 100) / 100,
    alternativeYears,
  };
}

/**
 * 1% Rule check for speculative sales
 * In Germany: If you sell within 10 years and make >€1000 profit, it's fully taxed
 */
export function checkOnePercentRule(
  saleYear: number,
  grossProfit: number,
  speculationPeriodYears: number = 10
): {
  isWithinSpeculationPeriod: boolean;
  isTaxable: boolean;
  taxableAmount: number;
  recommendation: string;
} {
  const isWithinSpeculationPeriod = saleYear <= speculationPeriodYears;
  
  // German tax rule: Private sales within 10 years are fully taxed as income
  // There's a €1000 allowance, but if you exceed it, the entire amount is taxed
  const isTaxable = isWithinSpeculationPeriod && grossProfit > 1000;
  const taxableAmount = isTaxable ? grossProfit : 0;

  let recommendation: string;
  if (!isWithinSpeculationPeriod) {
    recommendation = 'Verkauf ist steuerfrei (nach Spekulationsfrist)';
  } else if (grossProfit <= 1000) {
    recommendation = 'Gewinn unter Freibetrag - steuerfrei';
  } else {
    recommendation = `Gewinn wird voll versteuert (ca. ${Math.round(grossProfit * 0.42)}€ Steuern bei 42% Steuersatz)`;
  }

  return {
    isWithinSpeculationPeriod,
    isTaxable,
    taxableAmount,
    recommendation,
  };
}
