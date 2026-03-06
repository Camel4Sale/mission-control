'use client';

import { SessionMetrics, formatDuration } from '@/lib/analytics';
import { Users, MessageSquare, Hammer, Clock } from 'lucide-react';

interface SessionMetricsProps {
  metrics: SessionMetrics;
}

export function SessionMetricsCard({ metrics }: SessionMetricsProps) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-display font-bold mb-4">Session Metrics</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricItem
          icon={Users}
          label="Active Sessions"
          value={metrics.activeSessions.toString()}
          subValue={`${metrics.totalSessions24h} in 24h`}
        />
        
        <MetricItem
          icon={Clock}
          label="Ø Duration"
          value={formatDuration(metrics.avgDuration)}
          subValue="Average"
        />
        
        <MetricItem
          icon={MessageSquare}
          label="Ø Messages"
          value={metrics.messagesPerSession.toString()}
          subValue="Per session"
        />
        
        <MetricItem
          icon={Hammer}
          label="Ø Tool Calls"
          value={metrics.toolCallsPerSession.toString()}
          subValue="Per session"
        />
      </div>
    </div>
  );
}

interface MetricItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue: string;
}

function MetricItem({ icon: Icon, label, value, subValue }: MetricItemProps) {
  return (
    <div className="bg-secondary rounded-lg p-4 border border-border-subtle">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-accent" />
        <span className="text-xs text-muted uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-2xl font-display font-bold text-primary">{value}</div>
      <div className="text-xs text-muted mt-1">{subValue}</div>
    </div>
  );
}
