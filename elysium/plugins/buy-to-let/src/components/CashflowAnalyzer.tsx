'use client';

import { useState, useEffect } from 'react';
import { analyzeCashflow, calculateDepreciationBenefit } from '@/lib/cashflow-analyzer';
import { calculateFinancing } from '@/lib/financing-calculator';
import type { RentalIncome, OperatingCosts, TaxConfig, FinancingConfig, CashflowAnalysis } from '@/types';
import { DollarSign, TrendingUp, Home, AlertCircle, CheckCircle } from 'lucide-react';

export function CashflowAnalyzer() {
  const [financingConfig, setFinancingConfig] = useState<FinancingConfig>({
    purchasePrice: 300000,
    equityCapital: 60000,
    loanAmount: 240000,
    interestRate: 3.8,
    loanTermYears: 20,
    specialRepaymentAnnual: 0,
  });

  const [rentalIncome, setRentalIncome] = useState<RentalIncome>({
    coldRent: 1500,
    rentalType: 'cold',
    rentIncreaseAnnual: 2,
    vacancyRate: 5,
  });

  const [operatingCosts, setOperatingCosts] = useState<OperatingCosts>({
    propertyManagement: 100,
    maintenanceReserve: 150,
    propertyTax: 600,
    insurance: 300,
    otherCosts: 120,
  });

  const [taxConfig, setTaxConfig] = useState<TaxConfig>({
    incomeTaxRate: 35,
    depreciationRate: 2,
    speculationPeriodYears: 10,
    capitalGainsTaxRate: 26.375,
  });

  const [cashflow, setCashflow] = useState<CashflowAnalysis | null>(null);

  useEffect(() => {
    const financing = calculateFinancing(financingConfig);
    const result = analyzeCashflow(
      rentalIncome,
      operatingCosts,
      financing,
      taxConfig,
      financingConfig.purchasePrice,
      financingConfig.equityCapital
    );
    setCashflow(result);
  }, [financingConfig, rentalIncome, operatingCosts, taxConfig]);

  const depreciationBenefit = calculateDepreciationBenefit(
    financingConfig.purchasePrice,
    0.7,
    taxConfig.depreciationRate / 100,
    taxConfig.incomeTaxRate / 100
  );

  const isPositiveCashflow = cashflow ? cashflow.monthlyCashflow >= 0 : false;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Inputs */}
      <div className="lg:col-span-1 space-y-6">
        {/* Mieteinnahmen */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Mieteinnahmen
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Kaltmiete (€)
              </label>
              <input
                type="number"
                value={rentalIncome.coldRent}
                onChange={(e) => setRentalIncome({ ...rentalIncome, coldRent: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Miettyp
              </label>
              <select
                value={rentalIncome.rentalType}
                onChange={(e) => setRentalIncome({ ...rentalIncome, rentalType: e.target.value as 'cold' | 'warm' | 'stepped' })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="cold">Kaltmiete</option>
                <option value="warm">Warmmiete</option>
                <option value="stepped">Staffelmiete</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mietausfallquote (%)
              </label>
              <input
                type="number"
                value={rentalIncome.vacancyRate}
                onChange={(e) => setRentalIncome({ ...rentalIncome, vacancyRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Betriebskosten */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Home className="w-5 h-5 mr-2 text-blue-600" />
            Betriebskosten
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Hausverwaltung (€/Monat)
              </label>
              <input
                type="number"
                value={operatingCosts.propertyManagement}
                onChange={(e) => setOperatingCosts({ ...operatingCosts, propertyManagement: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Instandhaltung (€/Monat)
              </label>
              <input
                type="number"
                value={operatingCosts.maintenanceReserve}
                onChange={(e) => setOperatingCosts({ ...operatingCosts, maintenanceReserve: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Grundsteuer (€/Jahr)
              </label>
              <input
                type="number"
                value={operatingCosts.propertyTax}
                onChange={(e) => setOperatingCosts({ ...operatingCosts, propertyTax: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Versicherung (€/Jahr)
              </label>
              <input
                type="number"
                value={operatingCosts.insurance}
                onChange={(e) => setOperatingCosts({ ...operatingCosts, insurance: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Steuern */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Steuerkonfiguration
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Einkommensteuersatz (%)
              </label>
              <input
                type="number"
                value={taxConfig.incomeTaxRate}
                onChange={(e) => setTaxConfig({ ...taxConfig, incomeTaxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                AfA-Satz (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={taxConfig.depreciationRate}
                onChange={(e) => setTaxConfig({ ...taxConfig, depreciationRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 space-y-6">
        {cashflow && (
          <>
            {/* Main Cashflow Card */}
            <div className={`rounded-xl shadow-lg p-6 ${
              isPositiveCashflow
                ? 'bg-gradient-to-br from-green-500 to-green-600'
                : 'bg-gradient-to-br from-red-500 to-red-600'
            } text-white`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Monatlicher Cashflow</h3>
                {isPositiveCashflow ? (
                  <CheckCircle className="w-6 h-6 opacity-80" />
                ) : (
                  <AlertCircle className="w-6 h-6 opacity-80" />
                )}
              </div>
              <div className="text-5xl font-bold mb-4">
                {cashflow.monthlyCashflow.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="opacity-80">Jährlich</div>
                  <div className="font-semibold">{cashflow.annualCashflow.toLocaleString('de-DE')} €</div>
                </div>
                <div>
                  <div className="opacity-80">Cash-on-Cash</div>
                  <div className="font-semibold">{cashflow.cashOnCashReturn}%</div>
                </div>
                <div>
                  <div className="opacity-80">Nettorendite</div>
                  <div className="font-semibold">{cashflow.netYield}%</div>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Cashflow-Berechnung
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 px-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-slate-700 dark:text-slate-300">Mieteinnahmen (monatlich)</span>
                  <span className="font-bold text-green-600">+{cashflow.monthlyRentalIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-slate-700 dark:text-slate-300">Betriebskosten (monatlich)</span>
                  <span className="font-bold text-red-600">-{cashflow.monthlyOperatingCosts.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-slate-700 dark:text-slate-300">Finanzierungsrate (monatlich)</span>
                  <span className="font-bold text-red-600">-{cashflow.monthlyFinancingCost.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-slate-900 dark:text-white">Cashflow (monatlich)</span>
                    <span className={`text-2xl font-bold ${isPositiveCashflow ? 'text-green-600' : 'text-red-600'}`}>
                      {cashflow.monthlyCashflow > 0 ? '+' : ''}{cashflow.monthlyCashflow.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Bruttorendite</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {cashflow.grossYield}%
                </div>
                <div className="text-xs text-slate-400 mt-1">Vor Kosten & Finanzierung</div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Nettorendite</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {cashflow.netYield}%
                </div>
                <div className="text-xs text-slate-400 mt-1">Nach Betriebskosten</div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Cash-on-Cash</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {cashflow.cashOnCashReturn}%
                </div>
                <div className="text-xs text-slate-400 mt-1">Auf Eigenkapital</div>
              </div>
            </div>

            {/* Tax Benefits */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Steuervorteile (AfA)
              </h3>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Jährliche Abschreibung</div>
                  <div className="text-xl font-bold text-blue-600">
                    {depreciationBenefit.annualDepreciation.toLocaleString('de-DE')} €
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Steuerersparnis pro Jahr</div>
                  <div className="text-xl font-bold text-green-600">
                    {depreciationBenefit.taxSaving.toLocaleString('de-DE')} €
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Abschreibungsdauer</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {depreciationBenefit.depreciationPeriod} Jahre
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
