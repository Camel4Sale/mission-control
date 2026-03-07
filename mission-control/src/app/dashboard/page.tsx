'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, CheckCircle, Clock, Zap, Target, Activity, Users, Calendar as CalendarIcon } from 'lucide-react';
import AnalyticsWidget from '@/components/AnalyticsWidget';
import QuickStatsWidget from '@/components/QuickStatsWidget';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  deadline?: string;
}

interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('mc_tasks');
    if (stored) {
      const loadedTasks = JSON.parse(stored);
      setTasks(loadedTasks);
      
      // Calculate metrics
      const completed = loadedTasks.filter((t: Task) => t.status === 'done').length;
      const inProgress = loadedTasks.filter((t: Task) => t.status === 'in-progress').length;
      const todo = loadedTasks.filter((t: Task) => t.status === 'todo').length;
      const completionRate = loadedTasks.length > 0 ? Math.round((completed / loadedTasks.length) * 100) : 0;
      
      setMetrics([
        {
          label: 'Erledigte Tasks',
          value: completed,
          change: 12.5,
          icon: <CheckCircle size={18} />,
          color: '#22c55e',
        },
        {
          label: 'In Arbeit',
          value: inProgress,
          change: 3.2,
          icon: <Clock size={18} />,
          color: '#38bdf8',
        },
        {
          label: 'To Do',
          value: todo,
          change: -5.4,
          icon: <Target size={18} />,
          color: '#fbbf24',
        },
        {
          label: 'Completion Rate',
          value: `${completionRate}%`,
          change: 8.7,
          icon: <Zap size={18} />,
          color: '#c8ff00',
        },
      ]);
    }
    setIsLoading(false);
  }, []);

  // Get upcoming deadlines
  const upcomingDeadlines = tasks
    .filter(t => t.deadline && t.status !== 'done')
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Willkommen zurück! 👋
        </h1>
        <p className="text-[var(--text-secondary)]">
          Hier ist dein Überblick für heute, {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="metric-card p-5 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] mb-3" />
              <div className="h-8 w-16 bg-[var(--bg-surface)] rounded mb-2" />
              <div className="h-4 w-24 bg-[var(--bg-surface)] rounded" />
            </div>
          ))
        ) : (
          metrics.map((metric, i) => (
            <div
              key={i}
              className="metric-card p-5"
              style={{
                animation: `fadeInUp 0.5s var(--ease-out-expo) forwards`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${metric.color}20`,
                    color: metric.color,
                  }}
                >
                  {metric.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${metric.change >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                  {metric.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {metric.value}
              </div>
              <div className="text-sm text-[var(--text-muted)]">{metric.label}</div>
            </div>
          ))
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Analytics Widget */}
        <div className="lg:col-span-2">
          <AnalyticsWidget />
        </div>
        
        {/* Quick Stats */}
        <div>
          <QuickStatsWidget />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(251, 191, 36, 0.12)',
                color: '#fbbf24',
              }}
            >
              <CalendarIcon size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base">Anstehende Deadlines</h3>
              <p className="text-xs text-[var(--text-muted)]">Nächste 5 Tasks</p>
            </div>
          </div>
          
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-2">
              {upcomingDeadlines.map((task, i) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-surface)]"
                  style={{
                    animation: `fadeInUp 0.4s var(--ease-out-expo) forwards`,
                    animationDelay: `${i * 0.05}s`,
                    opacity: 0,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {new Date(task.deadline!).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    task.priority === 'high' ? 'bg-[#f87171]/10 text-[#f87171]' :
                    task.priority === 'medium' ? 'bg-[#fbbf24]/10 text-[#fbbf24]' :
                    'bg-[#34d399]/10 text-[#34d399]'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--text-muted)] text-sm">
              Keine anstehenden Deadlines 🎉
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(0, 240, 255, 0.12)',
                color: '#00f0ff',
              }}
            >
              <Activity size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base">Aktivität</h3>
              <p className="text-xs text-[var(--text-muted)]">Letzte Aktionen</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { action: 'Task erstellt', time: 'vor 5 Min', icon: '✨' },
              { action: 'Projekt aktualisiert', time: 'vor 15 Min', icon: '📝' },
              { action: 'Meeting abgeschlossen', time: 'vor 1 Std', icon: '✅' },
              { action: 'Neues Teammitglied', time: 'vor 2 Std', icon: '👋' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                style={{
                  animation: `fadeInUp 0.4s var(--ease-out-expo) forwards`,
                  animationDelay: `${0.2 + i * 0.1}s`,
                  opacity: 0,
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-secondary)]">{item.action}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
