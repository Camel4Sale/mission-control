'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MarketAnalysis } from '../types';

interface MarketChartProps {
  analysis: MarketAnalysis;
  compact?: boolean;
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

const MarketChart: React.FC<MarketChartProps> = ({ analysis, compact = false }) => {
  // Price Development Chart
  const PriceDevelopmentChart = () => (
    <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
      <LineChart data={analysis.priceDevelopment}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => new Date(date).toLocaleDateString('de-DE', { month: 'short' })}
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => `${value.toLocaleString('de-DE')}€`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
          labelFormatter={(label) => new Date(label).toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })}
          formatter={(value: number) => [`${value.toLocaleString('de-DE')}€`, 'Durchschnittspreis']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="averagePrice" 
          stroke="#667eea" 
          strokeWidth={2}
          dot={{ fill: '#667eea', strokeWidth: 2 }}
          name="Preis"
        />
        <Line 
          type="monotone" 
          dataKey="listings" 
          stroke="#764ba2" 
          strokeWidth={2}
          dot={{ fill: '#764ba2', strokeWidth: 2 }}
          name="Angebote"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Supply Demand Chart
  const SupplyDemandChart = () => {
    const data = [
      { name: 'Angebot', value: analysis.supplyDemandRatio > 1 ? 100 : (100 / analysis.supplyDemandRatio) },
      { name: 'Nachfrage', value: analysis.supplyDemandRatio > 1 ? (100 / analysis.supplyDemandRatio) : 100 },
    ];

    return (
      <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={compact ? 60 : 80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // District Comparison Chart
  const DistrictComparisonChart = () => {
    const data = analysis.comparableCities.map(city => ({
      name: city.name,
      pricePerSqm: city.pricePerSqm,
      difference: city.difference,
    }));

    return (
      <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `${value}€/m²`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`${value}€/m²`]}
          />
          <Legend />
          <Bar dataKey="pricePerSqm" fill="#667eea" name="Ø Preis/m²" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-80">Ø Preis/m²</div>
          <div className="text-2xl font-bold">{analysis.pricePerSqm.toLocaleString('de-DE')}€</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-80">Ø Mietrendite</div>
          <div className="text-2xl font-bold">{analysis.rentalYieldAverage.toFixed(1)}%</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-80">Angebote</div>
          <div className="text-2xl font-bold">{analysis.totalListings}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-80">Ø Marktzeit</div>
          <div className="text-2xl font-bold">{analysis.averageDaysOnMarket} Tage</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Preisentwicklung</h3>
          <PriceDevelopmentChart />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚖️ Angebot & Nachfrage</h3>
          <SupplyDemandChart />
        </div>
      </div>

      {/* District Comparison */}
      {analysis.comparableCities.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏘️ Stadtvergleich</h3>
          <DistrictComparisonChart />
        </div>
      )}
    </div>
  );
};

export default MarketChart;
