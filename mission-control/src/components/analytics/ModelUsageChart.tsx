'use client';

import { ModelUsage, formatNumber, formatCurrency } from '@/lib/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ModelUsageChartProps {
  models: ModelUsage[];
}

const COLORS = ['#c8ff00', '#00f0ff', '#a855f7', '#fb923c', '#34d399'];

export function ModelUsageChart({ models }: ModelUsageChartProps) {
  const data = models.map(m => ({
    name: m.model.split('/')[1] || m.model,
    tokens: m.totalTokens,
    cost: m.totalCost,
    requests: m.requests,
    latency: m.avgLatency.toFixed(2),
  }));

  return (
    <div className="card p-6">
      <h3 className="text-lg font-display font-bold mb-4">Model Usage</h3>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--text-muted)"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              stroke="var(--text-muted)"
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip 
              contentStyle={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
              }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '8px' }}
              formatter={(value, name) => {
                if (value === undefined || typeof value === 'string' || !name || typeof name !== 'string') return ['', ''];
                const numValue = Number(value);
                if (name === 'cost') return [formatCurrency(numValue), 'Cost'];
                if (name === 'latency') return [`${numValue.toFixed(2)}s`, 'Latency'];
                return [formatNumber(numValue), name.charAt(0).toUpperCase() + name.slice(1)];
              }}
            />
            <Bar dataKey="tokens" name="Tokens" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Model Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {models.map((model, i) => (
          <div key={model.model} className="bg-secondary rounded-lg p-3 border border-border-subtle">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-xs text-secondary truncate">
                {model.model.split('/')[1] || model.model}
              </span>
            </div>
            <div className="text-sm font-bold text-primary">{formatNumber(model.totalTokens)}</div>
            <div className="text-xs text-muted">{formatCurrency(model.totalCost)} • {model.requests} reqs</div>
            {model.fallbackCount > 0 && (
              <div className="text-xs text-warning mt-1">⚠ {model.fallbackCount} fallbacks</div>
            )}
            {model.rateLimitCount > 0 && (
              <div className="text-xs text-danger mt-1">🚫 {model.rateLimitCount} rate limits</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
