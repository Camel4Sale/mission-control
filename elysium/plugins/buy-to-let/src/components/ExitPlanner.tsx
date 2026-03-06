'use client';

import { useState, useEffect } from 'react';
import { planExit, compareExitStrategies, findOptimalExitTiming, checkOnePercentRule } from '@/lib/exit-planner';
import { createLongTermProjection } from '@/lib/long-term-projection';
import { calculateFinancing } from '@/lib/financing-calculator';
import type { FinancingConfig, RentalIncome, OperatingCosts, TaxConfig, ExitPlan } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { LogOut, Calendar, Euro, Percent, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export function ExitPlanner() {
  const [exitPlan, setExitPlan] = useState<ExitPlan | null>(null);
  const [exitStrategies, setExitStrategies] = useState<Array<{
    saleYear: number;
    salePrice: number;
    netProfit: number;
    isTaxFree: boolean;
    annualizedReturn: number;
  }>>([]);
  const [optimalTiming, setOptimalTiming] = useState<any>(null);
  const [selectedSaleYear, setSelectedSaleYear] = useState(15);

  const [financingConfig] = useState<FinancingConfig>({
    purchasePrice: 300000,
    equityCapital: 60000,
    loanAmount: 240000,
    interestRate: 3.8,
    loanTermYears: 20,
    specialRepaymentAnnual: 0,
  });

  const [rentalIncome] = useState<RentalIncome>({
    coldRent: 1500,
    rentalType: 'cold',
    rentIncreaseAnnual: 2,
    vacancyRate: 5,
  });

  const [operatingCosts] = useState<OperatingCosts>({
    propertyManagement: 100,
    maintenanceReserve: 150,
    propertyTax: 600,
    insurance: 300,
    otherCosts: 120,
  });

  const [taxConfig] = useState<TaxConfig>({
    incomeTaxRate: 35,
    depreciationRate: 2,
    speculationPeriodYears: 10,
    capitalGainsTaxRate: 26.375,
  });

  const [projections] = useState(() => createLongTermProjection(
    financingConfig,
    rentalIncome,
    operatingCosts,
    taxConfig,
    30
  ));

  useEffect(() => {
    if (projections.length > 0) {
      const plan = planExit(projections, taxConfig, selectedSaleYear);
      setExitPlan(plan);

      const strategies = compareExitStrategies(projections, taxConfig, [5, 10, 15, 20, 25, 30]);
      setExitStrategies(strategies);

      const optimal = findOptimalExitTiming(projections, taxConfig);
      setOptimalTiming(optimal);
    }
  }, [selectedSaleYear, projections, taxConfig]);

  const onePercentCheck = exitPlan ? checkOnePercentRule(
    exitPlan.saleYear,
    exitPlan.grossProfit,
    taxConfig.speculationPeriodYears
  ) : null;

  const chartData = exitStrategies.map((s) => ({
    year: s.saleYear,
    'Nettogewinn': s.netProfit,
    'Verkaufspreis': s.salePrice,
    'Steuerfrei': s.isTaxFree ? 'Ja' : 'Nein',
  }));

  const profitData = exitStrategies.map((s) => ({
    year: s.saleYear,
    Nettogewinn: s.netProfit,
    AnnualisierteRendite: s.annualizedReturn,
  }));

  return (
    <div className="space-y-6">
      {/* Header with Sale Year Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <LogOut className="w-5 h-5 mr-2 text-blue-600" />
              Exit-Planung
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Optimieren Sie den Verkaufszeitpunkt für maximale Rendite
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Verkauf nach (Jahren)
              </label>
              <select
                value={selectedSaleYear}
                onChange={(e) => setSelectedSaleYear(Number(e.target.value))}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              >
                {[5, 10, 15, 20, 25, 30].map((year) => (
                  <option key={year} value={year}>{year} Jahre</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Optimal Timing Alert */}
      {optimalTiming && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start">
            <CheckCircle className="w-6 h-6 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Optimaler Verkaufszeitpunkt: Nach {optimalTiming.optimalYear} Jahren
              </h3>
              <p className="text-sm opacity-90 mb-2">{optimalTiming.reasoning}</p>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="opacity-80">Nettogewinn</div>
                  <div className="text-xl font-bold">{(optimalTiming.netProfit / 1000).toFixed(1)}k €</div>
                </div>
                <div>
                  <div className="opacity-80">Steuerersparnis</div>
                  <div className="text-xl font-bold">{(optimalTiming.taxSavings / 1000).toFixed(1)}k €</div>
                </div>
                <div>
                  <div className="opacity-80">Alternative Jahre</div>
                  <div className="text-xl font-bold">{optimalTiming.alternativeYears.join(', ')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Plan Details */}
      {exitPlan && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Main Exit Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Verkauf nach {exitPlan.saleYear} Jahren</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm opacity-80">Verkaufspreis</div>
                <div className="text-3xl font-bold">
                  {(exitPlan.salePrice / 1000).toFixed(1)}k €
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="opacity-80">Restschuld</div>
                  <div className="text-xl font-semibold">
                    {(exitPlan.remainingDebt / 1000).toFixed(1)}k €
                  </div>
                </div>
                <div>
                  <div className="opacity-80">Bruttogewinn</div>
                  <div className="text-xl font-semibold">
                    {(exitPlan.grossProfit / 1000).toFixed(1)}k €
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Steuern</span>
                  <span className="text-xl font-bold text-red-300">
                    {(exitPlan.capitalGainsTax / 1000).toFixed(1)}k €
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm opacity-80">Nettogewinn</span>
                  <span className="text-2xl font-bold text-green-300">
                    {(exitPlan.netProfit / 1000).toFixed(1)}k €
                  </span>
                </div>
              </div>

              <div className="flex items-center pt-2">
                {exitPlan.isTaxFree ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Steuerfrei
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Steuerpflichtig
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tax Analysis */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <Percent className="w-5 h-5 mr-2 text-orange-600" />
              Steuer-Analyse
            </h3>
            
            {onePercentCheck && (
              <div className={`rounded-lg p-4 mb-4 ${
                onePercentCheck.isTaxable
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              }`}>
                <div className="flex items-start">
                  {onePercentCheck.isTaxable ? (
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  )}
                  <div>
                    <div className={`font-medium ${
                      onePercentCheck.isTaxable ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'
                    }`}>
                      {onePercentCheck.recommendation}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Spekulationsfrist: {taxConfig.speculationPeriodYears} Jahre
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Verkauf innerhalb Spekulationsfrist</span>
                <span className={`font-medium ${
                  exitPlan.saleYear <= taxConfig.speculationPeriodYears ? 'text-red-600' : 'text-green-600'
                }`}>
                  {exitPlan.saleYear <= taxConfig.speculationPeriodYears ? 'Ja' : 'Nein'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Steuerpflichtiger Gewinn</span>
                <span className={`font-medium ${
                  onePercentCheck?.taxableAmount ? 'text-red-600' : 'text-green-600'
                }`}>
                  {onePercentCheck?.taxableAmount ? `${(onePercentCheck.taxableAmount / 1000).toFixed(1)}k €` : '0 €'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Kapitalertragsteuer</span>
                <span className="font-medium text-red-600">
                  {(exitPlan.capitalGainsTax / 1000).toFixed(1)}k €
                </span>
              </div>
              <div className="flex justify-between py-3 bg-slate-50 dark:bg-slate-700 px-3 rounded-lg">
                <span className="font-medium text-slate-900 dark:text-white">Nettogewinn nach Steuer</span>
                <span className="font-bold text-green-600">
                  {(exitPlan.netProfit / 1000).toFixed(1)}k €
                </span>
              </div>
            </div>

            {/* Installment Sale Option */}
            {exitPlan.installmentSale && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                  💡 Ratenverkauf möglich
                </h4>
                <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <div>• {exitPlan.installmentSale.years} Jahre à {exitPlan.installmentSale.annualPayments.toLocaleString('de-DE')} €</div>
                  <div>• Steuerstundung: {(exitPlan.installmentSale.taxDeferral / 1000).toFixed(1)}k €</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exit Strategy Comparison Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Verkaufsoptionen im Vergleich
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" label={{ value: 'Verkauf nach (Jahren)', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString('de-DE')} €`} />
              <Legend />
              <Bar dataKey="Nettogewinn" fill="#22c55e" radius={[4, 4, 0, 0]} name="Nettogewinn" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 overflow-hidden">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Detaillierte Exit-Strategien
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400">Verkauf nach</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Verkaufspreis</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Bruttogewinn</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Steuern</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Nettogewinn</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Steuerfrei</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Ø Rendite p.a.</th>
              </tr>
            </thead>
            <tbody>
              {exitStrategies.map((strategy) => {
                const projection = projections[strategy.saleYear - 1];
                const grossProfit = strategy.salePrice - projection.remainingDebt - financingConfig.purchasePrice;
                return (
                  <tr 
                    key={strategy.saleYear}
                    className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      strategy.saleYear === selectedSaleYear ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      {strategy.saleYear} Jahre
                      {strategy.saleYear === optimalTiming?.optimalYear && (
                        <span className="ml-2 text-xs text-green-600">✓ Optimal</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">
                      {(strategy.salePrice / 1000).toFixed(1)}k €
                    </td>
                    <td className="py-3 px-4 text-right text-blue-600">
                      {(grossProfit / 1000).toFixed(1)}k €
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      {(exitPlan && strategy.saleYear === exitPlan.saleYear ? exitPlan.capitalGainsTax : grossProfit > 0 && strategy.saleYear <= 10 ? grossProfit * 0.35 : 0) / 1000}k €
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      {(strategy.netProfit / 1000).toFixed(1)}k €
                    </td>
                    <td className="py-3 px-4 text-right">
                      {strategy.isTaxFree ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                          Ja
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                          Nein
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white font-medium">
                      {strategy.annualizedReturn.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
        <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">
          💡 Tipps für den optimalen Exit
        </h4>
        <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-400">
          <li>• <strong>Spekulationsfrist abwarten:</strong> Nach 10 Jahren ist der Verkauf steuerfrei (für private Verkäufer)</li>
          <li>• <strong>Ratenverkauf prüfen:</strong> Bei steuerpflichtigem Gewinn kann ein Ratenverkauf die Steuerlast verteilen</li>
          <li>• <strong>Marktzyklen beachten:</strong> In starken Märkten verkaufen maximiert den Gewinn</li>
          <li>• <strong>Zinsentwicklung:</strong> Steigende Zinsen können die Nachfrage und Preise drücken</li>
          <li>• <strong>10%-Klausel:</strong> Bei mehr als 3 verkauften Objekten in 5 Jahren gilt gewerblicher Handel</li>
        </ul>
      </div>
    </div>
  );
}
