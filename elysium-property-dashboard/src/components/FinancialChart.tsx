'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface FinancialChartProps {
  data: any;
  type: 'value-history' | 'cashflow' | 'roi' | 'income-expense';
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function FinancialChart({ data, type }: FinancialChartProps) {
  switch (type) {
    case 'value-history':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).getFullYear().toString()}
              stroke="#9ca3af"
            />
            <YAxis 
              stroke="#9ca3af"
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M€`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M€`, 'Wert']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('de-DE')}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'cashflow':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis 
              stroke="#9ca3af"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K€`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value.toFixed(2)}€`, '']}
            />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Einnahmen" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" name="Ausgaben" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cashflow" fill="#3b82f6" name="Cashflow" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'roi':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              type="number" 
              stroke="#9ca3af"
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#9ca3af"
              width={120}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'ROI']}
            />
            <Bar dataKey="roi" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );

    case 'income-expense':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${(value / 1000).toFixed(1)}K€`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value.toFixed(2)}€`, '']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
}
