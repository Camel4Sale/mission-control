'use client';

import { useState, useEffect } from 'react';
import { compareScenarios, STANDARD_SCENARIOS } from '@/lib/long-term-projection';
import { calculateFinancing } from '@/lib/financing-calculator';
import type { FinancingConfig, RentalIncome, OperatingCosts, TaxConfig, ScenarioResult } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { PieChart, Pie, Sector } from 'recharts';
import { Columns, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];

export function ScenarioComparison() {
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [selectedYears, setSelectedYears] = useState<10 | 20 | 30>(20);

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

  useEffect(() => {
    const scenarioResults = compareScenarios(
      financingConfig,
      rentalIncome,
      operatingCosts,
      taxConfig,
      STANDARD_SCENARIOS,
      selectedYears
    );
    setResults(scenarioResults);
  }, [selectedYears]);

  const bestScenario = results.length > 0 
    ? results.reduce((max, r) => r.totalReturn > max.totalReturn ? r : max, results[0])
    : null;

  const worstScenario = results.length > 0 
    ? results.reduce((min, r) => r.totalReturn < min.totalReturn ? r : min, results[0])
    : null;

  const chartData = results.map((r) => ({
    name: r.scenario.name,
    'Gesamtrendite': r.totalReturn,
    'Endkapital': r.finalEquity,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <Columns className="w-5 h-5 mr-2 text-blue-600" />
              Szenario-Vergleich
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Vergleichen Sie verschiedene Marktentwicklungen
            </p>
          </div>
          
          <select
            value={selectedYears}
            onChange={(e) => setSelectedYears(Number(e.target.value) as 10 | 20 | 30)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          >
            <option value={10}>10 Jahre</option>
            <option value={20}>20 Jahre</option>
            <option value={30}>30 Jahre</option>
          </select>
        </div>
      </div>

      {/* Best/Worst Cards */}
      {bestScenario && worstScenario && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Bestes Szenario</h3>
            </div>
            <div className="text-2xl font-bold mb-1">{bestScenario.scenario.name}</div>
            <p className="text-sm opacity-90 mb-4">{bestScenario.scenario.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="opacity-80">Gesamtrendite</div>
                <div className="text-xl font-bold">{(bestScenario.totalReturn / 1000).toFixed(1)}k €</div>
              </div>
              <div>
                <div className="opacity-80">Ø pro Jahr</div>
                <div className="text-xl font-bold">{bestScenario.averageAnnualReturn.toLocaleString('de-DE')} €</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Schlechtestes Szenario</h3>
            </div>
            <div className="text-2xl font-bold mb-1">{worstScenario.scenario.name}</div>
            <p className="text-sm opacity-90 mb-4">{worstScenario.scenario.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="opacity-80">Gesamtrendite</div>
                <div className="text-xl font-bold">{(worstScenario.totalReturn / 1000).toFixed(1)}k €</div>
              </div>
              <div>
                <div className="opacity-80">Ø pro Jahr</div>
                <div className="text-xl font-bold">{worstScenario.averageAnnualReturn.toLocaleString('de-DE')} €</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bar Chart Comparison */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Gesamtrendite nach Szenario
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString('de-DE')} €`} />
              <Legend />
              <Bar dataKey="Gesamtrendite" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Scenario Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((result, index) => (
          <div
            key={result.scenario.name}
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border-2 transition-all ${
              result.scenario.name === bestScenario?.scenario.name
                ? 'border-green-500'
                : result.scenario.name === worstScenario?.scenario.name
                ? 'border-red-500'
                : 'border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white">{result.scenario.name}</h4>
              {result.scenario.name === bestScenario?.scenario.name && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {result.scenario.name === worstScenario?.scenario.name && (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
              {result.scenario.description}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Mietwachstum</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {result.scenario.rentGrowthAnnual > 0 ? '+' : ''}{result.scenario.rentGrowthAnnual}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wertwachstum</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {result.scenario.propertyValueGrowthAnnual > 0 ? '+' : ''}{result.scenario.propertyValueGrowthAnnual}%
                </span>
              </div>
              {result.scenario.interestRateChange && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Zinsänderung</span>
                  <span className="font-medium text-red-600">+{result.scenario.interestRateChange}%</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Gesamtrendite</div>
              <div className={`text-2xl font-bold ${
                result.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(result.totalReturn / 1000).toFixed(1)}k €
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scenario Details Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 overflow-hidden">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Detaillierter Vergleich
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400">Szenario</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Gesamtrendite</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Ø Jahresrendite</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Endkapital</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Immobilienwert</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Unterschied</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const diffFromBest = bestScenario && bestScenario.totalReturn !== result.totalReturn
                  ? ((result.totalReturn - bestScenario.totalReturn) / bestScenario.totalReturn * 100)
                  : 0;
                
                return (
                  <tr key={result.scenario.name} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{result.scenario.name}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-semibold">
                      {(result.totalReturn / 1000).toFixed(1)}k €
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">
                      {(result.averageAnnualReturn / 1000).toFixed(1)}k €
                    </td>
                    <td className="py-3 px-4 text-right text-blue-600">
                      {(result.finalEquity / 1000).toFixed(1)}k €
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">
                      {(result.finalPropertyValuation / 1000).toFixed(1)}k €
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      diffFromBest === 0 ? 'text-slate-400' : 'text-red-600'
                    }`}>
                      {diffFromBest === 0 ? '—' : `${diffFromBest.toFixed(1)}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          💡 Erkenntnisse aus dem Szenario-Vergleich
        </h4>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
          <li>• Die Spanne zwischen bestem und schlechtestem Szenario beträgt {
            bestScenario && worstScenario 
              ? ((bestScenario.totalReturn - worstScenario.totalReturn) / 1000).toFixed(1)
              : '0'
          }k € nach {selectedYears} Jahren</li>
          <li>• Selbst im pessimistischen Szenario bleibt die Immobilie ein werthaltiges Investment</li>
          <li>• Langfristige Halteperioden reduzieren das Risiko negativer Entwicklungen</li>
          <li>• Zinsänderungen haben signifikanten Einfluss auf die Rendite</li>
        </ul>
      </div>
    </div>
  );
}
