'use client';

import { useState } from 'react';
import { analyzePortfolio, projectPortfolioPerformance, identifyOptimizationOpportunities } from '@/lib/portfolio-tracker';
import type { PropertyObject, PortfolioOverview } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, MapPin, Home, AlertTriangle, TrendingUp, Plus } from 'lucide-react';

// Mock portfolio data
const MOCK_PROPERTIES: PropertyObject[] = [
  {
    id: '1',
    name: 'Mietwohnung Berlin Mitte',
    address: 'Musterstraße 1',
    city: 'Berlin',
    propertyType: 'apartment',
    purchasePrice: 300000,
    purchaseDate: '2020-01-15',
    sqm: 65,
    financing: {
      purchasePrice: 300000,
      equityCapital: 60000,
      loanAmount: 240000,
      interestRate: 2.5,
      loanTermYears: 20,
      specialRepaymentAnnual: 2400,
    },
    rentalIncome: {
      coldRent: 1500,
      rentalType: 'cold',
      rentIncreaseAnnual: 2,
      vacancyRate: 5,
    },
    operatingCosts: {
      propertyManagement: 100,
      maintenanceReserve: 150,
      propertyTax: 600,
      insurance: 300,
      otherCosts: 120,
    },
    taxConfig: {
      incomeTaxRate: 35,
      depreciationRate: 2,
      speculationPeriodYears: 10,
      capitalGainsTaxRate: 26.375,
    },
    currentValuation: 340000,
  },
  {
    id: '2',
    name: 'Mietwohnung Hamburg Altona',
    address: 'Beispielweg 2',
    city: 'Hamburg',
    propertyType: 'apartment',
    purchasePrice: 250000,
    purchaseDate: '2021-06-01',
    sqm: 55,
    financing: {
      purchasePrice: 250000,
      equityCapital: 50000,
      loanAmount: 200000,
      interestRate: 2.8,
      loanTermYears: 20,
      specialRepaymentAnnual: 2000,
    },
    rentalIncome: {
      coldRent: 1200,
      rentalType: 'cold',
      rentIncreaseAnnual: 2,
      vacancyRate: 5,
    },
    operatingCosts: {
      propertyManagement: 90,
      maintenanceReserve: 130,
      propertyTax: 500,
      insurance: 250,
      otherCosts: 100,
    },
    taxConfig: {
      incomeTaxRate: 35,
      depreciationRate: 2,
      speculationPeriodYears: 10,
      capitalGainsTaxRate: 26.375,
    },
    currentValuation: 265000,
  },
  {
    id: '3',
    name: 'Mietwohnung München Schwabing',
    address: 'Teststraße 3',
    city: 'München',
    propertyType: 'apartment',
    purchasePrice: 450000,
    purchaseDate: '2019-03-20',
    sqm: 75,
    financing: {
      purchasePrice: 450000,
      equityCapital: 90000,
      loanAmount: 360000,
      interestRate: 2.2,
      loanTermYears: 20,
      specialRepaymentAnnual: 3600,
    },
    rentalIncome: {
      coldRent: 2100,
      rentalType: 'cold',
      rentIncreaseAnnual: 2.5,
      vacancyRate: 3,
    },
    operatingCosts: {
      propertyManagement: 150,
      maintenanceReserve: 200,
      propertyTax: 900,
      insurance: 400,
      otherCosts: 180,
    },
    taxConfig: {
      incomeTaxRate: 35,
      depreciationRate: 2,
      speculationPeriodYears: 10,
      capitalGainsTaxRate: 26.375,
    },
    currentValuation: 520000,
  },
];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function PortfolioTracker() {
  const [properties, setProperties] = useState<PropertyObject[]>(MOCK_PROPERTIES);
  const portfolio = analyzePortfolio(properties);
  const optimization = identifyOptimizationOpportunities(portfolio, properties);
  const [projections] = useState(() => projectPortfolioPerformance(properties, 20));

  const cityData = Object.entries(portfolio.cities).map(([city, count]) => ({
    name: city,
    value: count,
    percentage: ((count / portfolio.totalProperties) * 100).toFixed(0),
  }));

  const typeData = Object.entries(portfolio.propertyTypes).map(([type, count]) => ({
    name: type === 'apartment' ? 'Wohnung' : type === 'house' ? 'Haus' : type,
    value: count,
  }));

  const performanceData = projections.map((p) => ({
    year: p.year,
    'Gesamtwert': p.totalPropertyValue,
    'Eigenkapital': p.totalEquity,
    'Kumulierter Cashflow': p.cumulativeCashflow,
  }));

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-6 h-6 opacity-80" />
            <span className="text-2xl font-bold">{portfolio.totalProperties}</span>
          </div>
          <div className="text-sm opacity-90">Objekte im Portfolio</div>
          <div className="mt-3 text-xs opacity-75">
            Gesamtinvestition: {(portfolio.totalInvestment / 1000).toFixed(0)}k €
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Monatliche Mieteinnahmen</div>
          <div className="text-3xl font-bold">
            {portfolio.totalMonthlyRent.toLocaleString('de-DE')} €
          </div>
          <div className="text-xs opacity-75 mt-1">
            {(portfolio.totalMonthlyRent * 12 / 1000).toFixed(1)}k € jährlich
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Monatlicher Cashflow</div>
          <div className={`text-3xl font-bold ${portfolio.totalMonthlyCashflow >= 0 ? '' : 'text-red-300'}`}>
            {portfolio.totalMonthlyCashflow >= 0 ? '+' : ''}{portfolio.totalMonthlyCashflow.toLocaleString('de-DE')} €
          </div>
          <div className="text-xs opacity-75 mt-1">
            Ø {portfolio.averageCashOnCash}% Cash-on-Cash
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Durchschnittliche Rendite</div>
          <div className="text-3xl font-bold">{portfolio.averageYield}%</div>
          <div className="text-xs opacity-75 mt-1">
            Brutto-Mietrendite
          </div>
        </div>
      </div>

      {/* Diversification Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* City Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Geografische Verteilung
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Types */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Home className="w-5 h-5 mr-2 text-green-600" />
            Objekttypen
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Portfolio Performance */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Portfolio-Entwicklung (Prognose)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData.filter((_, i) => i % 2 === 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" label={{ value: 'Jahr', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString('de-DE')} €`} />
              <Legend />
              <Bar dataKey="Gesamtwert" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Eigenkapital" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Risiko-Analyse
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Konzentrationsrisiko</div>
            <div className={`text-2xl font-bold ${
              portfolio.concentrationRisk === 'low'
                ? 'text-green-600'
                : portfolio.concentrationRisk === 'medium'
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
              {portfolio.concentrationRisk === 'low' ? 'Niedrig' : portfolio.concentrationRisk === 'medium' ? 'Mittel' : 'Hoch'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {portfolio.totalProperties} Objekte in {Object.keys(portfolio.cities).length} Städten
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Verschuldungsgrad</div>
            <div className={`text-2xl font-bold ${
              (portfolio.totalDebt / portfolio.totalInvestment) < 0.7
                ? 'text-green-600'
                : (portfolio.totalDebt / portfolio.totalInvestment) < 0.8
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
              {((portfolio.totalDebt / portfolio.totalInvestment) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {portfolio.totalDebt.toLocaleString('de-DE')} € Gesamtfinanzierung
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Cashflow-Risiko</div>
            <div className={`text-2xl font-bold ${
              portfolio.totalMonthlyCashflow > 500
                ? 'text-green-600'
                : portfolio.totalMonthlyCashflow > 0
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
              {portfolio.totalMonthlyCashflow > 0 ? 'Positiv' : 'Negativ'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {portfolio.totalMonthlyCashflow.toLocaleString('de-DE')} € monatlich
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Opportunities */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
          Optimierungspotenziale
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {optimization.diversificationIssues.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                Diversifikation
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                {optimization.diversificationIssues.map((issue, i) => (
                  <li key={i}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}

          {optimization.cashflowOptimization.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">
                Cashflow-Optimierung
              </h4>
              <ul className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
                {optimization.cashflowOptimization.map((issue, i) => (
                  <li key={i}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {optimization.riskWarnings.length > 0 && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
              Risikowarnungen
            </h4>
            <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
              {optimization.riskWarnings.map((warning, i) => (
                <li key={i}>⚠ {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {optimization.recommendations.length > 0 && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
              💡 Empfehlungen
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
              {optimization.recommendations.map((rec, i) => (
                <li key={i}>✓ {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Property List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Objekte im Portfolio
          </h3>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Objekt hinzufügen
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400">Objekt</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Kaufpreis</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Miete (kalt)</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Rendite</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Cashflow</th>
                <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-400">Wert</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => {
                const yieldPercent = (property.rentalIncome.coldRent * 12 / property.purchasePrice) * 100;
                return (
                  <tr key={property.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-white">{property.name}</div>
                      <div className="text-xs text-slate-500">{property.city} • {property.sqm} m²</div>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">
                      {(property.purchasePrice / 1000).toFixed(0)}k €
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">
                      {property.rentalIncome.coldRent.toLocaleString('de-DE')} €
                    </td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">
                      {yieldPercent.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">
                      — €
                    </td>
                    <td className="py-3 px-4 text-right text-blue-600">
                      {(property.currentValuation / 1000).toFixed(0)}k €
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
