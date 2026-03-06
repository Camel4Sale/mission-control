// Core Financial Types for Buy-to-Let Analysis

export interface FinancingConfig {
  purchasePrice: number;
  equityCapital: number;
  loanAmount: number;
  interestRate: number; // Annual interest rate in percent
  loanTermYears: number; // 10, 15, 20, 30
  specialRepaymentAnnual: number; // Sondertilgung per year
  effectiveInterestRate?: number;
}

export interface RentalIncome {
  coldRent: number; // Monthly cold rent
  warmRent?: number; // Monthly warm rent (optional)
  rentIncreaseAnnual: number; // Annual rent increase in percent
  vacancyRate: number; // Vacancy rate in percent
  rentalType: 'cold' | 'warm' | 'stepped';
  steppedRents?: {
    year: number;
    rent: number;
  }[];
}

export interface OperatingCosts {
  propertyManagement: number; // Monthly or annual
  maintenanceReserve: number; // Monthly maintenance reserve
  propertyTax: number; // Annual property tax
  insurance: number; // Annual building insurance
  otherCosts: number; // Other annual operating costs
}

export interface TaxConfig {
  incomeTaxRate: number; // Personal income tax rate in percent
  depreciationRate: number; // AfA rate in percent (typically 2-3%)
  speculationPeriodYears: number; // 10 years for tax-free sale
  capitalGainsTaxRate: number; // Tax rate on capital gains after speculation period
}

export interface FinancingCalculation {
  monthlyRate: number;
  annualRate: number;
  totalInterest: number;
  totalRepayment: number;
  remainingDebt: Record<number, number>; // Year -> remaining debt
  interestPortion: Record<number, number>;
  repaymentPortion: Record<number, number>;
  effectiveInterestRate: number;
}

export interface CashflowAnalysis {
  monthlyRentalIncome: number;
  annualRentalIncome: number;
  monthlyOperatingCosts: number;
  annualOperatingCosts: number;
  monthlyFinancingCost: number;
  annualFinancingCost: number;
  monthlyCashflow: number;
  annualCashflow: number;
  cashOnCashReturn: number; // Annual cashflow / equity capital
  grossYield: number; // Annual rent / purchase price
  netYield: number; // (Annual rent - operating costs) / purchase price
}

export interface LongTermProjection {
  year: number;
  propertyValue: number;
  remainingDebt: number;
  equity: number;
  annualRent: number;
  annualCashflow: number;
  cumulativeCashflow: number;
  totalReturn: number;
  roi: number;
}

export interface ScenarioConfig {
  name: string;
  rentGrowthAnnual: number; // Annual rent growth in percent
  propertyValueGrowthAnnual: number; // Annual property value growth
  interestRateChange?: number; // Interest rate change after 10 years
  description: string;
}

export interface ScenarioResult {
  scenario: ScenarioConfig;
  projections: LongTermProjection[];
  totalReturn: number;
  averageAnnualReturn: number;
  finalEquity: number;
  finalPropertyValuation: number;
}

export interface ETFComparison {
  investmentAmount: number;
  investmentPeriodYears: number;
  expectedAnnualReturn: number; // Expected ETF return in percent
  volatility: number; // ETF volatility in percent
  maxDrawdown: number; // Maximum historical drawdown
  finalValue: number;
  totalReturn: number;
  averageAnnualReturn: number;
  taxes: number;
  netReturn: number;
}

export interface PropertyObject {
  id: string;
  name: string;
  address: string;
  city: string;
  propertyType: 'apartment' | 'house' | 'commercial' | 'mixed';
  purchasePrice: number;
  purchaseDate: string;
  sqm: number;
  financing: FinancingConfig;
  rentalIncome: RentalIncome;
  operatingCosts: OperatingCosts;
  taxConfig: TaxConfig;
  currentValuation: number;
  lastValuationDate?: string;
}

export interface PortfolioOverview {
  totalProperties: number;
  totalInvestment: number;
  totalEquity: number;
  totalDebt: number;
  totalMonthlyRent: number;
  totalMonthlyCashflow: number;
  averageYield: number;
  averageCashOnCash: number;
  cities: Record<string, number>; // City -> count
  propertyTypes: Record<string, number>; // Type -> count
  concentrationRisk: 'low' | 'medium' | 'high';
}

export interface ExitPlan {
  saleYear: number;
  salePrice: number;
  remainingDebt: number;
  grossProfit: number;
  capitalGainsTax: number;
  netProfit: number;
  isTaxFree: boolean; // Within speculation period
  installmentSale?: {
    annualPayments: number;
    years: number;
    taxDeferral: number;
  };
}

export interface AnalysisResult {
  financing: FinancingCalculation;
  cashflow: CashflowAnalysis;
  projections: LongTermProjection[];
  scenarios: ScenarioResult[];
  etfComparison: ETFComparison;
  exitPlan: ExitPlan;
}
