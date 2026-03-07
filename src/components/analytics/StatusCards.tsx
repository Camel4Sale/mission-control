'use client';

import { GatewayHealth, CronJob, formatUptime, formatRelativeTime } from '@/lib/analytics';
import { Activity, Server, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface StatusCardsProps {
  gatewayHealth: GatewayHealth;
  cronJobs: CronJob[];
}

export function StatusCards({ gatewayHealth, cronJobs }: StatusCardsProps) {
  const activeCrons = cronJobs.filter(j => j.status === 'active').length;
  const errorCrons = cronJobs.filter(j => j.status === 'error').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Gateway Status */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted">Gateway</span>
          </div>
          <StatusBadge status={gatewayHealth.status} />
        </div>
        <div className="metric-value text-2xl">
          {gatewayHealth.rpcConnected ? 'Connected' : 'Disconnected'}
        </div>
        <div className="metric-label mt-2">
          Uptime: {formatUptime(gatewayHealth.uptime)}
        </div>
      </div>

      {/* Services */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted">Services</span>
          </div>
        </div>
        <div className="metric-value text-2xl">
          {gatewayHealth.services.filter(s => s.status === 'running').length}/{gatewayHealth.services.length}
        </div>
        <div className="metric-label mt-2">
          Running
        </div>
        <div className="flex gap-1 mt-3 flex-wrap">
          {gatewayHealth.services.map(service => (
            <span
              key={service.name}
              className={`badge ${service.status === 'running' ? 'badge-success' : service.status === 'error' ? 'badge-danger' : 'badge-default'}`}
            >
              {service.name}
            </span>
          ))}
        </div>
      </div>

      {/* Cron Jobs */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted">Cron Jobs</span>
          </div>
        </div>
        <div className="metric-value text-2xl">{activeCrons}</div>
        <div className="metric-label mt-2">
          Active / {errorCrons > 0 && <span className="text-danger">{errorCrons} errors</span>}
        </div>
        <div className="mt-3 space-y-1">
          {cronJobs.slice(0, 3).map(job => (
            <div key={job.id} className="flex items-center justify-between text-xs">
              <span className="text-secondary truncate max-w-[120px]">{job.name}</span>
              <span className={`badge ${job.status === 'active' ? 'badge-success' : job.status === 'error' ? 'badge-danger' : 'badge-default'} px-2 py-0.5`}>
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Last Check */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted">Health Check</span>
          </div>
        </div>
        <div className="metric-value text-2xl">OK</div>
        <div className="metric-label mt-2">
          {formatRelativeTime(gatewayHealth.lastCheck)}
        </div>
        <div className="mt-3 flex gap-1 flex-wrap">
          {gatewayHealth.ports.map(port => (
            <span
              key={port.port}
              className={`badge ${port.status === 'open' ? 'badge-success' : 'badge-danger'} px-2 py-0.5 text-xs`}
            >
              :{port.port}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'healthy') {
    return <span className="badge badge-success">Healthy</span>;
  }
  if (status === 'degraded') {
    return <span className="badge badge-warning">Degraded</span>;
  }
  return <span className="badge badge-danger">Offline</span>;
}
