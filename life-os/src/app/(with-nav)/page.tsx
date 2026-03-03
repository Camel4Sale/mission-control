'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, Kanban, Activity, AlertTriangle, CheckCircle, 
  Clock, TrendingUp, Users, DollarSign, Zap, Sun,
  Building, GraduationCap, Code, AlertCircle
} from 'lucide-react';
import { 
  fetchHealthStatus, fetchTasks, fetchCalendarEvents,
  fetchSprint, fetchDevOpsMetrics, fetchPathiumFinancials,
  fetchSalesLeads, fetchInstallationProjects, fetchSolarFinancials,
  fetchDealPipeline, fetchPortfolioFinance
} from '@/lib/api';
import { Area, HealthStatus, Task, CalendarEvent, Sprint, DevOpsMetrics, Financials, SalesLead, InstallationProject, SolarFinancials, DealPipeline, PortfolioFinance } from '@/types';
import { format, differenceInDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

// Area config
const areaConfig: Record<Area, { name: string; color: string; bg: string; icon: any }> = {
  kit: { name: 'KIT Studium', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', icon: GraduationCap },
  pathium: { name: 'Pathium', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', icon: Code },
  celaris: { name: 'Celaris', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: Sun },
  elysium: { name: 'Elysium', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: Building },
};

const priorityColors: Record<string, string> = {
  urgent: '#ef4444',
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#eab308',
  low: '#22c55e',
};

const statusColumns = ['backlog', 'todo', 'in-progress', 'done'] as const;

export default function CommandCenter() {
  const [health, setHealth] = useState<HealthStatus[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [h, t, e] = await Promise.all([
        fetchHealthStatus(),
        fetchTasks(),
        fetchCalendarEvents(),
      ]);
      setHealth(h);
      setTasks(t);
      setEvents(e);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  // Get today's events
  const today = new Date();
  const upcomingEvents = events
    .filter(e => new Date(e.start) >= today)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  // Get urgent tasks
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' || t.priority === 'critical');

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Command Center</h1>
          <p className="text-[var(--text-secondary)]">
            {format(today, 'EEEE, d. MMMM yyyy', { locale: de })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[var(--text-muted)]" />
          <span className="text-sm text-[var(--text-muted)]">
            {format(today, 'HH:mm')} Uhr
          </span>
        </div>
      </div>

      {/* Health Status Grid */}
      <section>
        <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <Activity size={16} />
          Health Check
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {health.map((h) => {
            const config = areaConfig[h.area];
            const StatusIcon = h.status === 'green' ? CheckCircle : h.status === 'yellow' ? AlertTriangle : AlertCircle;
            return (
              <div 
                key={h.area} 
                className="card p-4"
                style={{ borderLeftColor: config.color, borderLeftWidth: 3 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <config.icon size={16} style={{ color: config.color }} />
                    <span className="font-medium text-sm">{config.name}</span>
                  </div>
                  <StatusIcon 
                    size={16} 
                    className={h.status === 'green' ? 'text-[var(--success)]' : h.status === 'yellow' ? 'text-[var(--warning)]' : 'text-[var(--danger)]'} 
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{h.message}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Calendar & Tasks */}
        <div className="col-span-2 space-y-6">
          {/* Upcoming Events */}
          <section className="card p-4">
            <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Calendar size={16} />
              Kommende Termine
            </h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const config = areaConfig[event.area];
                const eventDate = parseISO(event.start);
                const daysUntil = differenceInDays(eventDate, today);
                
                return (
                  <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                    <div 
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {format(eventDate, 'EEE, d. MMM • HH:mm', { locale: de })}
                        {event.location && ` • ${event.location}`}
                      </p>
                    </div>
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: config.bg, color: config.color }}
                    >
                      {config.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Unified Task Board */}
          <section className="card p-4">
            <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Kanban size={16} />
              Task Board
              {urgentTasks.length > 0 && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[var(--danger)] text-white">
                  {urgentTasks.length} urgent
                </span>
              )}
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {statusColumns.map((status) => {
                const statusTasks = tasks.filter(t => t.status === status);
                return (
                  <div key={status} className="space-y-2">
                    <div className="text-xs font-medium text-[var(--text-muted)] uppercase flex items-center justify-between">
                      <span>{status.replace('-', ' ')}</span>
                      <span className="w-5 h-5 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                        {statusTasks.length}
                      </span>
                    </div>
                    <div className="space-y-2 min-h-[100px]">
                      {statusTasks.slice(0, 4).map((task) => {
                        const config = areaConfig[task.area];
                        return (
                          <div 
                            key={task.id}
                            className="p-3 rounded-lg bg-[var(--bg-tertiary)] border-l-2 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                            style={{ borderLeftColor: config.color }}
                          >
                            <p className="text-xs font-medium line-clamp-2">{task.title}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span 
                                className="text-[10px] px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: config.bg, color: config.color }}
                              >
                                {config.name}
                              </span>
                              {task.dueDate && (
                                <span className="text-[10px] text-[var(--text-muted)]">
                                  {differenceInDays(parseISO(task.dueDate), today)}d
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Quick Stats */}
        <div className="space-y-6">
          {/* KIT Stats */}
          <section className="card p-4" style={{ borderTopColor: areaConfig.kit.color, borderTopWidth: 3 }}>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <GraduationCap size={16} style={{ color: areaConfig.kit.color }} />
              KIT
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                <p className="text-xs text-[var(--text-muted)]">Nächste Klausur</p>
                <p className="text-lg font-semibold">14 Tage</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                <p className="text-xs text-[var(--text-muted)]">ECTS bestanden</p>
                <p className="text-lg font-semibold">14</p>
              </div>
            </div>
          </section>

          {/* Pathium Stats */}
          <section className="card p-4" style={{ borderTopColor: areaConfig.pathium.color, borderTopWidth: 3 }}>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Code size={16} style={{ color: areaConfig.pathium.color }} />
              Pathium
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-muted)]">MRR</span>
                <span className="text-sm font-semibold">€24.500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-muted)]">Sprint</span>
                <span className="text-sm font-semibold">34/42 SP</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill bg-[var(--pathium)]" style={{ width: '81%' }} />
              </div>
            </div>
          </section>

          {/* Celaris Stats */}
          <section className="card p-4" style={{ borderTopColor: areaConfig.celaris.color, borderTopWidth: 3 }}>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Sun size={16} style={{ color: areaConfig.celaris.color }} />
              Celaris
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-muted)]">Umsatz MTD</span>
                <span className="text-sm font-semibold">€285.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-muted)]">Offene Leads</span>
                <span className="text-sm font-semibold">3</span>
              </div>
            </div>
          </section>

          {/* Elysium Stats */}
          <section className="card p-4" style={{ borderTopColor: areaConfig.elysium.color, borderTopWidth: 3 }}>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Building size={16} style={{ color: areaConfig.elysium.color }} />
              Elysium
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-muted)]">Aktive Deals</span>
                <span className="text-sm font-semibold">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-muted)]">Gewinn 12M</span>
                <span className="text-sm font-semibold text-[var(--success)]">€387.000</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
