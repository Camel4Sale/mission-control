'use client';

import { useState, useEffect } from 'react';
import { createLongTermProjection, calculateInflationHedge } from '@/lib/long-term-projection';
import { calculateFinancing } from '@/lib/financing-calculator';
import type { FinancingConfig, RentalIncome, OperatingCosts, TaxConfig, LongTermProjection as ProjectionType } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity, Shield } from 'lucide-react';

export function LongTermProjection() {
  const [projections, setProjections] = useState<ProjectionType[]>([]);
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

  const [rentGrowth, setRentGrowth] = useState(2.0);
  const [valueGrowth, setValueGrowth] = useState(2.5);
  const [inflation, setInflation] = useState(2.0);

  useEffect(() => {
    const result = createLongTermProjection(
      financingConfig,
      rentalIncome,
      operatingCosts,
      taxConfig,
      selectedYears,
      rentGrowth,
      valueGrowth,
      inflation
    );
    setProjections(result);
  }, [selectedYears, rentGrowth, valueGrowth, inflation]);

  const inflationHedge = projections.length > 0 ? calculateInflationHedge(projections, inflation) : null;
  const finalProjection = projections.length > 0 ? projections[projections.length - 1] : null;

  const chartData = projections.map((p) => ({
    year: p.year,
    Immobilienwert: p.propertyValue,
    Eigenkapital: p.equity,
    Restschuld: p.remainingDebt,
    KumulierterCashflow: p.cumulativeCashflow,
  }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Prognose-Zeitraum
            </label>
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

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Mietwachstum (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={rentGrowth}
              onChange={(e) => setRentGrowth(Number(e.target.value))}
              className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Wertwachstum (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={valueGrowth}
              onChange={(e) => setValueGrowth(Number(e.target.value))}
              className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Inflation (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {finalProjection && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Immobilienwert</div>
            <div className="text-3xl font-bold">
              {(finalProjection.propertyValue / 1000).toFixed(0)}k €
            </div>
            <div className="text-xs opacity-80 mt-1">
              +{((finalProjection.propertyValue / financingConfig.purchasePrice - 1) * 100).toFixed(0)}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Eigenkapital</div>
            <div className="text-3xl font-bold">
              {(finalProjection.equity / 1000).toFixed(0)}k €
            </div>
            <div className="text-xs opacity-80 mt-1">
              Nach {finalProjection.year} Jahren
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Kumulierter Cashflow</div>
            <div className="text-3xl font-bold">
              {(finalProjection.cumulativeCashflow / 1000).toFixed(0)}k €
            </div>
            <div className="text-xs opacity-80 mt-1">
              Gesamtüberschuss
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">Gesamtrendite (ROI)</div>
            <div className="text-3xl font-bold">
              {finalProjection.roi}%
            </div>
            <div className="text-xs opacity-80 mt-1">
              Auf Eigenkapital
            </div>
          </div>
        </div>
      )}

      {/* Main Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Wertentwicklung über Zeit
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorImmobilienwert" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEigenkapital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" label={{ value: 'Jahr', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number) => `${value.toLocaleString('de-DE')} €`}
                labelFormatter={(label) => `Jahr ${label}`}
              />
              <Legend />
              <Area type="monotone" dataKey="Immobilienwert" stroke="#3b82f6" fillOpacity={1} fill="url(#colorImmobilienwert)" />
              <Area type="monotone" dataKey="Eigenkapital" stroke="#22c55e" fillOpacity={1} fill="url(#colorEigenkapital)" />
              <Line type="monotone" dataKey="Restschuld" stroke="#ef4444" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inflation Hedge Analysis */}
      {inflationHedge && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-purple-600" />
            Inflationsschutz-Analyse
          </h3>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Nominaler Endwert</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {inflationHedge.nominalFinalValue.toLocaleString('de-DE')} €
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Realer Wert (inflationsbereinigt)</div>
              <div className="text-2xl font-bold text-blue-600">
                {inflationHedge.realFinalValue.toLocaleString('de-DE')} €
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Werterhalt durch Inflation</div>
              <div className="text-2xl font-bold text-green-600">
                {inflationHedge.hedgeEffectiveness}%
              </div>
            </div>
          </div>
          
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Bei einer Inflation von {inflation}% pro Jahr verliert Geld an Kaufkraft. Immobilien gelten als Inflationsschutz, 
            da sowohl Mieten als auch Immobilienwerte typischerweise mit der Inflation steigen.
          </p>
        </div>
      )}

      {/* Detailed Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 overflow-hidden">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Detaillierte Projektion
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400">Jahr</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Immobilienwert</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Restschuld</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Eigenkapital</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Jahresmiete</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Cashflow (jährlich)</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">ROI</th>
              </tr>
            </thead>
            <tbody>
              {projections.filter((_, i) => i % 5 === 0 || i === projections.length - 1).map((proj) => (
                <tr key={proj.year} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{proj.year}</td>
                  <td className="py-3 px-4 text-right text-slate-900 dark:text-white">{proj.propertyValue.toLocaleString('de-DE')} €</td>
                  <td className="py-3 px-4 text-right text-red-600">{proj.remainingDebt.toLocaleString('de-DE')} €</td>
                  <td className="py-3 px-4 text-right text-green-600">{proj.equity.toLocaleString('de-DE')} €</td>
                  <td className="py-3 px-4 text-right text-slate-900 dark:text-white">{proj.annualRent.toLocaleString('de-DE')} €</td>
                  <td className="py-3 px-4 text-right">{proj.annualCashflow >= 0 ? '+' : ''}{proj.annualCashflow.toLocaleString('de-DE')} €</td>
                  <td className="py-3 px-4 text-right font-medium">{proj.roi}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
