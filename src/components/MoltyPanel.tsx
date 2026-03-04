'use client';

import { useState, useEffect } from 'react';
import { Brain, Activity, Clock, Zap, MessageCircle, GitBranch, Terminal } from 'lucide-react';

interface MoltyStatus {
  name: string;
  role: string;
  version: string;
  uptime?: number;
  model?: string;
  timestamp?: string;
}

interface CronJob {
  name: string;
  nextRun: string;
  enabled: boolean;
}

interface Channel {
  configured: boolean;
  active?: boolean;
  linked?: boolean;
}

interface Skills {
  installed: string[];
  available: string[];
}

export default function MoltyPanel() {
  const [status, setStatus] = useState<MoltyStatus | null>(null);
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [channels, setChannels] = useState<Record<string, Channel>>({});
  const [skills, setSkills] = useState<Skills | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'cron' | 'channels' | 'skills'>('overview');

  useEffect(() => {
    async function fetchData() {
      try {
        const [statusRes, cronRes, channelsRes, skillsRes] = await Promise.all([
          fetch('/api/molty?type=status'),
          fetch('/api/molty?type=cron'),
          fetch('/api/molty?type=channels'),
          fetch('/api/molty?type=skills')
        ]);

        setStatus(await statusRes.json());
        setCronJobs((await cronRes.json()).jobs);
        setChannels(await channelsRes.json());
        setSkills(await skillsRes.json());
      } catch (error) {
        console.error('Failed to fetch Molty status:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-pulse text-[var(--text-muted)]">Lade Molty Status...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold">{status?.name || 'Molty'}</h3>
            <p className="text-xs text-[var(--text-muted)]">{status?.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
          <span className="text-xs text-[var(--text-muted)]">Online</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)] pb-2">
        {(['overview', 'cron', 'channels', 'skills'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTab === tab
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4">
            <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
              <Activity size={14} />
              <span className="text-xs">Uptime</span>
            </div>
            <div className="font-semibold">
              {status?.uptime ? formatUptime(status.uptime) : '--'}
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
              <Terminal size={14} />
              <span className="text-xs">Model</span>
            </div>
            <div className="font-semibold text-sm">{status?.model || 'minimax-m2.5'}</div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
              <Zap size={14} />
              <span className="text-xs">Version</span>
            </div>
            <div className="font-semibold">{status?.version || '1.0.0'}</div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
              <Clock size={14} />
              <span className="text-xs">Letzte Activity</span>
            </div>
            <div className="font-semibold text-sm">Gerade eben</div>
          </div>
        </div>
      )}

      {activeTab === 'cron' && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {cronJobs.map((job) => (
            <div key={job.name} className="card p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${job.enabled ? 'bg-[var(--success)]' : 'bg-[var(--text-muted)]'}`}></span>
                <span className="text-sm">{job.name}</span>
              </div>
              <span className="text-xs text-[var(--text-muted)]">{job.nextRun}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'channels' && (
        <div className="space-y-2">
          {Object.entries(channels).map(([name, channel]) => (
            <div key={name} className="card p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-[var(--text-muted)]" />
                <span className="text-sm capitalize">{name}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                channel.configured || channel.linked
                  ? 'bg-[var(--success)]/15 text-[var(--success)]'
                  : 'bg-[var(--text-muted)]/15 text-[var(--text-muted)]'
              }`}>
                {channel.configured || channel.linked ? 'Verbunden' : 'Nicht konfiguriert'}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'skills' && skills && (
        <div className="space-y-3">
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-2">Installiert</div>
            <div className="flex flex-wrap gap-2">
              {skills.installed.map((skill) => (
                <span key={skill} className="px-2 py-1 rounded bg-[var(--accent)]/15 text-[var(--accent)] text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-2">Verfügbar</div>
            <div className="flex flex-wrap gap-2">
              {skills.available.map((skill) => (
                <span key={skill} className="px-2 py-1 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
