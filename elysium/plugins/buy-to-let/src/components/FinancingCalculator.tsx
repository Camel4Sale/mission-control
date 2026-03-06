'use client';

import { useState, useEffect } from 'react';
import { calculateFinancing, optimizeFinancing, calculateAcquisitionCosts } from '@/lib/financing-calculator';
import type { FinancingConfig, FinancingCalculation } from '@/types';
import { Calculator, TrendingUp, Euro, Percent, Calendar, AlertCircle } from 'lucide-react';

export function FinancingCalculator() {
  const [config, setConfig] = useState<FinancingConfig>({
    purchasePrice: 300000,
    equityCapital: 60000,
    loanAmount: 240000,
    interestRate: 3.8,
    loanTermYears: 20,
    specialRepaymentAnnual: 0,
  });

  const [calculation, setCalculation] = useState<FinancingCalculation | null>(null);
  const [showOptimization, setShowOptimization] = useState(false);

  useEffect(() => {
    const result = calculateFinancing(config);
    setCalculation(result);
  }, [config]);

  const handleOptimize = () => {
    const optimized = optimizeFinancing(config.purchasePrice, config.equityCapital, config.loanTermYears, config.interestRate);
    setConfig(optimized);
    setShowOptimization(true);
  };

  const equityRatio = (config.equityCapital / config.purchasePrice) * 100;
  const loanToValue = (config.loanAmount / config.purchasePrice) * 100;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
            Finanzierungskonfiguration
          </h2>
          <button
            onClick={handleOptimize}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Optimieren
          </button>
        </div>

        {showOptimization && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              ✓ Finanzierung optimiert für beste Rendite
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Kaufpreis (€)
            </label>
            <input
              type="number"
              value={config.purchasePrice}
              onChange={(e) => setConfig({ ...config, purchasePrice: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Eigenkapital (€)
            </label>
            <input
              type="number"
              value={config.equityCapital}
              onChange={(e) => {
                const equity = Number(e.target.value);
                setConfig({
                  ...config,
                  equityCapital: equity,
                  loanAmount: config.purchasePrice - equity,
                });
              }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
            <div className="mt-1 text-xs text-slate-500">
              Eigenkapitalquote: {equityRatio.toFixed(1)}%
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Kreditbetrag (€)
            </label>
            <input
              type="number"
              value={config.loanAmount}
              onChange={(e) => {
                const loan = Number(e.target.value);
                setConfig({
                  ...config,
                  loanAmount: loan,
                  equityCapital: config.purchasePrice - loan,
                });
              }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
            <div className="mt-1 text-xs text-slate-500">
              Beleihung: {loanToValue.toFixed(1)}%
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Zinssatz (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={config.interestRate}
              onChange={(e) => setConfig({ ...config, interestRate: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Laufzeit (Jahre)
            </label>
            <select
              value={config.loanTermYears}
              onChange={(e) => setConfig({ ...config, loanTermYears: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              <option value={10}>10 Jahre</option>
              <option value={15}>15 Jahre</option>
              <option value={20}>20 Jahre</option>
              <option value={25}>25 Jahre</option>
              <option value={30}>30 Jahre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sondertilgung pro Jahr (€)
            </label>
            <input
              type="number"
              value={config.specialRepaymentAnnual}
              onChange={(e) => setConfig({ ...config, specialRepaymentAnnual: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {calculation && (
          <>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-medium opacity-90 mb-1">Monatliche Rate</h3>
              <div className="text-4xl font-bold">
                {calculation.monthlyRate.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="opacity-80">Jährlich</div>
                  <div className="font-semibold">{calculation.annualRate.toLocaleString('de-DE')} €</div>
                </div>
                <div>
                  <div className="opacity-80">Effektivzins</div>
                  <div className="font-semibold">{calculation.effectiveInterestRate}%</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Gesamtkosten der Finanzierung
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Aufgenommener Kredit</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {config.loanAmount.toLocaleString('de-DE')} €
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Gesamtzinsen</span>
                  <span className="font-medium text-red-600">
                    {calculation.totalInterest.toLocaleString('de-DE')} €
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Gesamtrückzahlung</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {calculation.totalRepayment.toLocaleString('de-DE')} €
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-slate-50 dark:bg-slate-700 px-3 rounded-lg">
                  <span className="font-medium text-slate-900 dark:text-white">Zinsanteil</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {((calculation.totalInterest / calculation.totalRepayment) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Tilgungsplan (Auswahl)
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-2 text-slate-600 dark:text-slate-400">Jahr</th>
                      <th className="text-right py-2 text-slate-600 dark:text-slate-400">Restschuld</th>
                      <th className="text-right py-2 text-slate-600 dark:text-slate-400">Zinsen</th>
                      <th className="text-right py-2 text-slate-600 dark:text-slate-400">Tilgung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 5, 10, 15, 20].filter(y => y <= config.loanTermYears).map((year) => (
                      <tr key={year} className="border-b border-slate-100 dark:border-slate-700">
                        <td className="py-2 text-slate-900 dark:text-white font-medium">{year}</td>
                        <td className="py-2 text-right text-slate-900 dark:text-white">
                          {calculation.remainingDebt[year]?.toLocaleString('de-DE')} €
                        </td>
                        <td className="py-2 text-right text-red-600">
                          {calculation.interestPortion[year]?.toLocaleString('de-DE')} €
                        </td>
                        <td className="py-2 text-right text-green-600">
                          {calculation.repaymentPortion[year]?.toLocaleString('de-DE')} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {equityRatio < 20 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      Niedrige Eigenkapitalquote
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      Ihre Eigenkapitalquote liegt unter 20%. Eine höhere Eigenkapitalquote kann zu besseren Zinskonditionen führen.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
