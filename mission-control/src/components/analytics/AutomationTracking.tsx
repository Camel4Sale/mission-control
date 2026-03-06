'use client';

import { AutomationTracking, CronJob } from '@/lib/analytics';
import { Clock, AlertTriangle, Wrench, Clock3 } from 'lucide-react';

interface AutomationTrackingProps {
  tracking: AutomationTracking;
  cronJobs: CronJob[];
}

export function AutomationTrackingPanel({ tracking, cronJobs }: AutomationTrackingProps) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-display font-bold mb-4">Automation Tracking (24h)</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AutomationMetric
          icon={Clock}
          label="Jobs Executed"
          value={tracking.cronJobsExecuted24h.toString()}
          color="accent"
        />
        
        <AutomationMetric
          icon={AlertTriangle}
          label="Errors Caught"
          value={tracking.errorsCaught.toString()}
          color="danger"
        />
        
        <AutomationMetric
          icon={Wrench}
          label="Auto-Fixes"
          value={tracking.autoFixesApplied.toString()}
          color="success"
        />
        
        <AutomationMetric
          icon={Clock3}
          label="Time Saved"
          value={`${Math.round(tracking.timeSavedEstimate / 60)}h ${tracking.timeSavedEstimate % 60}m`}
          color="info"
        />
      </div>

      {/* Recent Cron Executions */}
      <div className="mt-6">
        <h4 className="text-sm font-bold text-secondary mb-3">Recent Executions</h4>
        <div className="space-y-2">
          {cronJobs.slice(0, 5).map(job => (
            <div 
              key={job.id}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border-subtle"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  job.status === 'active' ? 'bg-success' : job.status === 'error' ? 'bg-danger' : 'bg-muted'
                }`} />
                <span className="text-sm text-primary">{job.name}</span>
              </div>
              <div className="text-xs text-muted font-mono">{job.schedule}</div>
              {job.errorCount > 0 && (
                <span className="badge badge-danger px-2 py-0.5 text-xs">
                  {job.errorCount} errors
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AutomationMetricProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'accent' | 'danger' | 'success' | 'info';
}

function AutomationMetric({ icon: Icon, label, value, color }: AutomationMetricProps) {
  const colorClasses = {
    accent: 'text-accent bg-accent-subtle',
    danger: 'text-danger bg-danger-bg',
    success: 'text-success bg-success-bg',
    info: 'text-info bg-info-bg',
  };

  return (
    <div className="bg-secondary rounded-lg p-4 border border-border-subtle">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs text-muted uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-2xl font-display font-bold text-primary">{value}</div>
    </div>
  );
}
