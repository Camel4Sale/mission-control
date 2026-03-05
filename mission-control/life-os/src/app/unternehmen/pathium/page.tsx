'use client';

import { useState, useEffect } from 'react';
import { 
  Code, Zap, AlertTriangle, CheckCircle, Clock, 
  Activity, Server, DollarSign, Users, ArrowUp, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { 
  fetchSprint, fetchJiraTickets, fetchDevOpsMetrics, 
  fetchPathiumFinancials, fetchProductMetrics, fetchSupportTickets 
} from '@/lib/api';
import { Sprint, JiraTicket, DevOpsMetrics, Financials, ProductMetrics, SupportTicket } from '@/types';
import { format, differenceInDays, parseISO } from 'date-fns';

const priorityColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#eab308',
  low: '#22c55e',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  'todo': { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' },
  'in-progress': { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
  'blocked': { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
  'review': { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' },
  'done': { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
};

export default function PathiumPage() {
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [tickets, setTickets] = useState<JiraTicket[]>([]);
  const [devops, setDevops] = useState<DevOpsMetrics | null>(null);
  const [financials, setFinancials] = useState<Financials | null>(null);
  const [metrics, setMetrics] = useState<ProductMetrics | null>(null);
  const [support, setSupport] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [s, t, d, f, m, su] = await Promise.all([
        fetchSprint(), fetchJiraTickets(), fetchDevOpsMetrics(),
        fetchPathiumFinancials(), fetchProductMetrics(), fetchSupportTickets()
      ]);
      setSprint(s); setTickets(t); setDevops(d);
      setFinancials(f); setMetrics(m); setSupport(su);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06b6d4]"></div>
      </div>
    );
  }

  const sprintProgress = sprint ? (sprint.storyPointsCompleted / sprint.storyPointsTotal) * 100 : 0;
  const blockedTickets = tickets.filter(t => t.status === 'blocked');
  const criticalTickets = tickets.filter(t => t.priority === 'critical');

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code size={28} className="text-[#06b6d4]" />
          <div>
            <h1 className="text-2xl font-semibold">Pathium</h1>
            <p className="text-sm text-[var(--text-secondary)]">Software Development</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge bg-[rgba(6,182,212,0.15)] text-[#06b6d4]">
            Sprint {sprint?.name}
          </span>
        </div>
      </div>

      {/* Sprint & Tickets Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Active Sprint */}
        <div className="col-span-2 card p-4">
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <Zap size={16} className="text-[#f59e0b]" />
            Aktueller Sprint
          </h2>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold">{sprint?.storyPointsCompleted}/{sprint?.storyPointsTotal} SP</p>
              <p className="text-xs text-[var(--text-muted)]">Velocity: {sprint?.velocity}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{Math.round(sprintProgress)}%</p>
              <p className="text-xs text-[var(--text-muted)]">
                {sprint && format(parseISO(sprint.endDate), 'd. MMM', { locale: require('date-fns/locale/de').de })} Ende
              </p>
            </div>
          </div>
          
          <div className="progress-bar h-3 mb-4">
            <div className="progress-bar-fill bg-gradient-to-r from-[#06b6d4] to-[#22c55e]" style={{ width: `${sprintProgress}%` }} />
          </div>

          {/* Jira Tickets */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">Tickets</h3>
            {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#06b6d4]">{ticket.key}</span>
                  <span className="text-sm line-clamp-1">{ticket.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span 
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: statusColors[ticket.status]?.bg, color: statusColors[ticket.status]?.text }}
                  >
                    {ticket.status.replace('-', ' ')}
                  </span>
                  {ticket.storyPoints && (
                    <span className="text-xs text-[var(--text-muted)]">{ticket.storyPoints} SP</span>
                  )}
                  {ticket.status === 'blocked' && <AlertTriangle size={14} className="text-[#ef4444]" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked & Critical Alerts */}
        <div className="space-y-4">
          {blockedTickets.length > 0 && (
            <div className="card p-4 border-[#ef4444]/30">
              <h3 className="font-medium mb-3 flex items-center gap-2 text-[#ef4444]">
                <AlertTriangle size={16} />
                Blocked Tickets
              </h3>
              <div className="space-y-2">
                {blockedTickets.map(t => (
                  <div key={t.id} className="p-2 rounded bg-[rgba(239,68,68,0.1)]">
                    <span className="font-mono text-xs">{t.key}</span>
                    <p className="text-sm line-clamp-1">{t.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="card p-4">
            <h3 className="font-medium mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-muted)]">Offene Tickets</span>
                <span className="font-medium">{tickets.filter(t => t.status !== 'done').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-muted)]">In Progress</span>
                <span className="font-medium text-[#f59e0b]">{tickets.filter(t => t.status === 'in-progress').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-muted)]">Review</span>
                <span className="font-medium text-[#8b5cf6]">{tickets.filter(t => t.status === 'review').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DevOps & Financials Row */}
      <div className="grid grid-cols-4 gap-4">
        {/* DevOps Metrics */}
        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Server size={14} className="text-[#06b6d4]" />
            DevOps
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-[var(--text-muted)]">Uptime</span>
              <span className="text-sm font-medium text-[#22c55e]">{devops?.uptime}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[var(--text-muted)]">API Latency</span>
              <span className="text-sm font-medium">{devops?.apiLatency}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[var(--text-muted)]">DB Load</span>
              <span className="text-sm font-medium">{devops?.dbLoad}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[var(--text-muted)]">Error Rate</span>
              <span className="text-sm font-medium text-[#22c55e]">{devops?.errorRate}%</span>
            </div>
          </div>
        </div>

        {/* Financials */}
        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <DollarSign size={14} className="text-[#22c55e]" />
            Financials
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xl font-bold">€{financials?.mrr.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)]">MRR</p>
            </div>
            <div className="flex items-center gap-1 text-[#22c55e]">
              <ArrowUp size={12} />
              <span className="text-sm">+{financials?.mrrGrowth}%</span>
            </div>
          </div>
        </div>

        {/* Product Metrics */}
        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Users size={14} className="text-[#8b5cf6]" />
            Users
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xl font-bold">{metrics?.dau.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)]">DAU</p>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUp size={12} className="text-[#22c55e]" />
              <span className="text-sm text-[#22c55e]">+{metrics?.activeUsersChange}%</span>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Activity size={14} className="text-[#f59e0b]" />
            Support
          </h3>
          <div className="space-y-2">
            {support.slice(0, 2).map(t => (
              <div key={t.id} className="flex items-center justify-between text-xs">
                <span className="line-clamp-1">{t.title}</span>
                <span 
                  className="px-1.5 py-0.5 rounded"
                  style={{ 
                    backgroundColor: priorityColors[t.priority] + '20', 
                    color: priorityColors[t.priority] 
                  }}
                >
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
