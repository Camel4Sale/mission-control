'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Users, CheckCircle, Clock, Zap, Target } from 'lucide-react';

interface MetricData {
  label: string;
  value: number | string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function AnalyticsWidget() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    const timer = setTimeout(() => {
      setMetrics([
        {
          label: 'Tasks Erledigt',
          value: 47,
          change: 12.5,
          icon: <CheckCircle size={18} />,
          color: '#22c55e',
        },
        {
          label: 'Aktive Projekte',
          value: 8,
          change: 3.2,
          icon: <Target size={18} />,
          color: '#38bdf8',
        },
        {
          label: 'Durchschn. Dauer',
          value: '2.3d',
          change: -8.4,
          icon: <Clock size={18} />,
          color: '#fbbf24',
        },
        {
          label: 'Produktivität',
          value: '94%',
          change: 5.7,
          icon: <Zap size={18} />,
          color: '#c8ff00',
        },
      ]);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [timeRange]);

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(200, 255, 0, 0.12)',
              color: '#c8ff00',
            }}
          >
            <Activity size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-base">Analytics Übersicht</h3>
            <p className="text-xs text-[var(--text-muted)]">Deine Performance diese Woche</p>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-1">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: timeRange === range ? 'var(--accent-muted)' : 'transparent',
                color: timeRange === range ? 'var(--accent)' : 'var(--text-secondary)',
                border: timeRange === range ? '1px solid var(--accent-muted)' : '1px solid transparent',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {isLoading ? (
          // Loading Skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3 rounded-xl bg-[var(--bg-surface)] animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-hover)] mb-2" />
              <div className="h-6 w-12 bg-[var(--bg-hover)] rounded mb-1" />
              <div className="h-3 w-16 bg-[var(--bg-hover)] rounded" />
            </div>
          ))
        ) : (
          metrics.map((metric, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-[var(--bg-surface)] transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg"
              style={{
                animation: `fadeInUp 0.4s var(--ease-out-expo) forwards`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
            >
              {/* Icon */}
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                style={{
                  background: `${metric.color}20`,
                  color: metric.color,
                }}
              >
                {metric.icon}
              </div>
              
              {/* Value */}
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {metric.value}
              </div>
              
              {/* Label & Change */}
              <div className="text-xs text-[var(--text-muted)] mb-1">{metric.label}</div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${metric.change >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                {metric.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(metric.change)}%
              </div>
            </div>
          ))
        )}
      </div>

      {/* Activity Graph Placeholder */}
      <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[var(--text-secondary)]">Aktivitätsverlauf</span>
          <span className="text-xs text-[var(--text-muted)]">Letzte 7 Tage</span>
        </div>
        <div className="h-16 flex items-end gap-1">
          {[65, 45, 78, 52, 89, 73, 91].map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md transition-all duration-300 hover:opacity-80"
              style={{
                height: `${height}%`,
                background: 'linear-gradient(180deg, #c8ff00 0%, rgba(200, 255, 0, 0.3) 100%)',
                animation: `fadeInUp 0.5s var(--ease-out-expo) forwards`,
                animationDelay: `${0.3 + i * 0.05}s`,
                opacity: 0,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-[var(--text-muted)]">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
