'use client';

import { useState, useEffect } from 'react';
import { compareWithETF, generateRecommendation, analyzeLeverageEffect } from '@/lib/etf-comparison';
import { createLongTermProjection } from '@/lib/long-term-projection';
import { calculateFinancing } from '@/lib/financing-calculator';
import type { FinancingConfig, RentalIncome, OperatingCosts, TaxConfig, ETFComparison as ETFType } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Scale, Shield, Zap, AlertCircle } from 'lucide-react';

export function ETFComparison() {
  const [etfComparison, setEtfComparison] = useState<ETFType | null>(null);
  const [propertyReturn, setPropertyReturn] = useState(0);
  const [selectedYears, setSelectedYears] = useState<10 | 20 | 30>(20);
  const [investorProfile, setInvestorProfile] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');

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
    // Calculate property returns
    const projections = createLongTermProjection(
      financingConfig,
      rentalIncome,
      operatingCosts,
      taxConfig,
      selectedYears
    );
    
    const finalProjection = projections[projections.length - 1];
    const propertyAnnualReturn = finalProjection.roi / selectedYears;
    setPropertyReturn(propertyAnnualReturn);

    // Calculate ETF comparison
    const etfResult = compareWithETF(
      financingConfig.equityCapital,
      selectedYears,
      7.0, // Expected ETF return
      15.0, // Volatility
      50.0, // Max drawdown
      taxConfig.capitalGainsTaxRate
    );
    
    setEtfComparison(etfResult);
  }, [selectedYears]);

  const recommendation = etfComparison ? generateRecommendation(
    createLongTermProjection(financingConfig, rentalIncome, operatingCosts, taxConfig, selectedYears),
    etfComparison,
    investorProfile
  ) : null;

  const leverageAnalysis = analyzeLeverageEffect(
    propertyReturn,
    financingConfig.interestRate,
    (financingConfig.loanAmount / financingConfig.purchasePrice) * 100
  );

  const comparisonData = etfComparison ? [
    {
      name: 'Immobilie',
      'Endwert': financingConfig.equityCapital + propertyReturn * selectedYears * financingConfig.equityCapital / 100,
      'Rendite p.a.': propertyReturn,
      'Risiko': 'Mittel',
    },
    {
      name: 'ETF',
      'Endwert': etfComparison.finalValue - etfComparison.taxes,
      'Rendite p.a.': etfComparison.averageAnnualReturn,
      'Risiko': 'Hoch',
    },
  ] : [];

  const pieData = etfComparison ? [
    { name: 'Immobilie', value: 1, color: '#3b82f6' },
    { name: 'ETF', value: 1, color: '#22c55e' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Vergleichszeitraum
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
              Anlegertyp
            </label>
            <select
              value={investorProfile}
              onChange={(e) => setInvestorProfile(e.target.value as 'conservative' | 'balanced' | 'aggressive')}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              <option value="conservative">Konservativ</option>
              <option value="balanced">Ausgewogen</option>
              <option value="aggressive">Aggressiv</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Comparison Cards */}
      {etfComparison && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Property Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Immobilien-Investment</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm opacity-80">Endwert (nach {selectedYears} Jahren)</div>
                <div className="text-3xl font-bold">
                  {((financingConfig.equityCapital * (1 + propertyReturn / 100 * selectedYears)) / 1000).toFixed(1)}k €
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="opacity-80">Ø Rendite p.a.</div>
                  <div className="text-xl font-semibold">{propertyReturn.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="opacity-80">Hebelwirkung</div>
                  <div className="text-xl font-semibold">
                    {leverageAnalysis.isPositiveLeverage ? '+' : ''}{leverageAnalysis.leverageGain.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="text-xs opacity-80 mb-2">Vorteile</div>
                <ul className="text-sm space-y-1">
                  <li>✓ Hebelwirkung durch Fremdkapital</li>
                  <li>✓ Stetige Mieteinnahmen</li>
                  <li>✓ Sachwert (Inflationsschutz)</li>
                  <li>✓ Steuervorteile (AfA)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ETF Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">ETF-Investment</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm opacity-80">Endwert (nach {selectedYears} Jahren)</div>
                <div className="text-3xl font-bold">
                  {((etfComparison.finalValue - etfComparison.taxes) / 1000).toFixed(1)}k €
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="opacity-80">Ø Rendite p.a. (netto)</div>
                  <div className="text-xl font-semibold">{etfComparison.averageAnnualReturn.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="opacity-80">Volatilität</div>
                  <div className="text-xl font-semibold">{etfComparison.volatility}%</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="text-xs opacity-80 mb-2">Vorteile</div>
                <ul className="text-sm space-y-1">
                  <li>✓ Hohe Liquidität</li>
                  <li>✓ Keine Verwaltung</li>
                  <li>✓ Breite Diversifikation</li>
                  <li>✓ Geringe Einstiegshürde</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <Scale className="w-5 h-5 mr-2 text-blue-600" />
          Rendite-Vergleich
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" unit="%" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="Endwert" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Endwert (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Leverage Effect */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            Hebelwirkung
          </h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Ohne Hebel</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {leverageAnalysis.unleveredReturn}%
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Mit Hebel</div>
              <div className="text-xl font-bold text-blue-600">
                {leverageAnalysis.leveredReturn}%
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
              <div className={`text-sm font-medium ${
                leverageAnalysis.isPositiveLeverage ? 'text-green-600' : 'text-red-600'
              }`}>
                {leverageAnalysis.isPositiveLeverage ? '✓ Positiver Hebel' : '✗ Negativer Hebel'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Rendite {leverageAnalysis.isPositiveLeverage ? '>' : '<'} Zinssatz
              </div>
            </div>
          </div>
        </div>

        {/* Risk Comparison */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
            Risiko-Analyse
          </h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Immobilie Volatilität</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">Niedrig</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">ETF Volatilität</div>
              <div className="text-xl font-bold text-orange-600">{etfComparison?.volatility}%</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">ETF Max Drawdown</div>
              <div className="text-xl font-bold text-red-600">{etfComparison?.maxDrawdown}%</div>
            </div>
          </div>
        </div>

        {/* Tax Comparison */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
            Steuer-Vergleich
          </h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Immobilie (AfA)</div>
              <div className="text-xl font-bold text-green-600">Steuervorteil</div>
              <div className="text-xs text-slate-400">Jährliche Abschreibung</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">ETF (Abgeltung)</div>
              <div className="text-xl font-bold text-red-600">
                {etfComparison ? (etfComparison.taxes / 1000).toFixed(1) : 0}k € Steuern
              </div>
              <div className="text-xs text-slate-400">Nach {selectedYears} Jahren</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className={`rounded-xl shadow-lg p-6 ${
          recommendation.recommendation === 'property'
            ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
            : recommendation.recommendation === 'etf'
            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
            : 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500'
        }`}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            💡 Empfehlung für {investorProfile === 'conservative' ? 'konservative' : investorProfile === 'aggressive' ? 'aggressive' : 'ausgewogene'} Anleger
          </h3>
          
          <div className="flex items-center mb-4">
            <div className={`text-2xl font-bold ${
              recommendation.recommendation === 'property'
                ? 'text-blue-600'
                : recommendation.recommendation === 'etf'
                ? 'text-green-600'
                : 'text-purple-600'
            }`}>
              {recommendation.recommendation === 'property'
                ? 'Immobilie'
                : recommendation.recommendation === 'etf'
                ? 'ETF'
                : 'Kombination aus beiden'}
            </div>
            <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
              recommendation.confidence === 'high'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : recommendation.confidence === 'medium'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {recommendation.confidence === 'high' ? 'Hohe' : recommendation.confidence === 'medium' ? 'Mittlere' : 'Niedrige'} Sicherheit
            </span>
          </div>

          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
            {recommendation.reasoning.map((reason, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                {reason}
              </li>
            ))}
          </ul>

          {recommendation.optimalSplit && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                Optimale Aufteilung
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="h-4 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${recommendation.optimalSplit.property}%` }}
                    />
                  </div>
                  <div className="text-xs text-center mt-1 text-blue-600 dark:text-blue-400">
                    {recommendation.optimalSplit.property}% Immobilie
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-green-200 dark:bg-green-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${recommendation.optimalSplit.etf}%` }}
                    />
                  </div>
                  <div className="text-xs text-center mt-1 text-green-600 dark:text-green-400">
                    {recommendation.optimalSplit.etf}% ETF
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
