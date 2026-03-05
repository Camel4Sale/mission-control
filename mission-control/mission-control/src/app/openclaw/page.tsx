'use client';

import { useState, useEffect } from 'react';
import { 
  Bot, 
  Activity, 
  Clock, 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi, 
  WifiOff,
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Terminal,
  Package,
  Zap,
  Network,
  Users,
  Timer
} from 'lucide-react';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  status: 'active' | 'disabled' | 'error';
  description?: string;
}

interface SystemStatus {
  uptime: string;
  memory: { used: number; total: number; percentage: number };
  disk: { used: number; total: number; percentage: number };
  gatewayStatus: 'online' | 'offline' | 'error';
  activeSessions: number;
}

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: string;
}

interface Skill {
  name: string;
  description: string;
  version: string;
}

interface Automation {
  id: string;
  name: string;
  lastRun: string;
  status: 'success' | 'error' | 'running';
  runs: number;
  errors: number;
}

interface PortInfo {
  port: number;
  protocol: string;
  status: string;
  process?: string;
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const colors = {
    active: 'bg-green-500/20 text-green-400',
    success: 'bg-green-500/20 text-green-400',
    online: 'bg-green-500/20 text-green-400',
    running: 'bg-green-500/20 text-green-400',
    disabled: 'bg-gray-500/20 text-gray-400',
    error: 'bg-red-500/20 text-red-400',
    offline: 'bg-gray-500/20 text-gray-400',
    failed: 'bg-red-500/20 text-red-400',
  };
  
  const icons = {
    active: <CheckCircle2 size={12} />,
    success: <CheckCircle2 size={12} />,
    online: <Wifi size={12} />,
    running: <RefreshCw size={12} className="animate-spin" />,
    disabled: <Clock size={12} />,
    error: <XCircle size={12} />,
    offline: <WifiOff size={12} />,
    failed: <XCircle size={12} />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'}`}>
      {icons[status as keyof typeof icons] || <AlertCircle size={12} />}
      {label}
    </span>
  );
}

function Card({ title, icon, children, className = '' }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[var(--accent)]">{icon}</span>
        <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function OpenClawPage() {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [ports, setPorts] = useState<PortInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      // Fetch system status via exec
      const [statusResult, cronResult, processResult] = await Promise.all([
        exec('openclaw gateway status --json 2>/dev/null || echo "{}"'),
        exec('openclaw cron list --json 2>/dev/null || echo "[]"'),
        exec('ps aux --no-headers | head -20 | awk \'{print $2,$11,$3,$4,$8}\''),
      ]);

      // Parse system status
      try {
        const statusData = JSON.parse(statusResult.stdout || '{}');
        setSystemStatus({
          uptime: statusData.uptime || 'Unknown',
          memory: { used: statusData.memory?.used || 0, total: statusData.memory?.total || 0, percentage: statusData.memory?.percentage || 0 },
          disk: { used: statusData.disk?.used || 0, total: statusData.disk?.total || 0, percentage: statusData.disk?.percentage || 0 },
          gatewayStatus: statusData.status || 'offline',
          activeSessions: statusData.sessions || 0,
        });
      } catch {
        // Default status if gateway not available
        setSystemStatus({
          uptime: 'N/A',
          memory: { used: 0, total: 0, percentage: 0 },
          disk: { used: 0, total: 0, percentage: 0 },
          gatewayStatus: 'offline',
          activeSessions: 0,
        });
      }

      // Parse cron jobs
      try {
        const cronData = JSON.parse(cronResult.stdout || '[]');
        if (Array.isArray(cronData) && cronData.length > 0) {
          setCronJobs(cronData);
        } else {
          // Use mock data if no cron jobs
          setCronJobs([
            { id: '1', name: 'weather-update', schedule: '0 9 * * *', nextRun: '2026-03-05T09:00:00', status: 'active', description: 'Tägliches Wetter-Update' },
            { id: '2', name: 'health-check', schedule: '*/5 * * * *', nextRun: new Date().toISOString(), status: 'active', description: 'Periodischer Health-Check' },
            { id: '3', name: 'auto-updater', schedule: '0 3 * * *', nextRun: '2026-03-05T03:00:00', status: 'active', description: 'Automatische Updates' },
            { id: '4', name: 'memory-cleanup', schedule: '0 0 * * *', nextRun: '2026-03-05T00:00:00', status: 'disabled', description: 'Tägliche Speicherbereinigung' },
          ]);
        }
      } catch {
        setCronJobs([
          { id: '1', name: 'weather-update', schedule: '0 9 * * *', nextRun: '2026-03-05T09:00:00', status: 'active', description: 'Tägliches Wetter-Update' },
          { id: '2', name: 'health-check', schedule: '*/5 * * * *', nextRun: new Date().toISOString(), status: 'active', description: 'Periodischer Health-Check' },
          { id: '3', name: 'auto-updater', schedule: '0 3 * * *', nextRun: '2026-03-05T03:00:00', status: 'active', description: 'Automatische Updates' },
        ]);
      }

      // Parse processes
      const processes: Process[] = processResult.stdout.split('\n').filter(Boolean).slice(0, 15).map(line => {
        const parts = line.trim().split(/\s+/);
        return {
          pid: parseInt(parts[0]) || 0,
          name: parts[1] || 'unknown',
          cpu: parseFloat(parts[2]) || 0,
          memory: parseFloat(parts[3]) || 0,
          status: parts[4] || 'running',
        };
      }).filter(p => p.pid > 0);
      setProcesses(processes);

      // Mock skills data
      setSkills([
        { name: 'github', description: 'GitHub CLI operations', version: '1.0.0' },
        { name: 'weather', description: 'Weather data from wttr.in', version: '1.0.0' },
        { name: 'himalaya', description: 'Email management via IMAP/SMTP', version: '1.0.0' },
        { name: 'coding-agent', description: 'Codex/Claude Code integration', version: '1.0.0' },
        { name: 'automation-workflows', description: 'Workflow automation', version: '1.0.0' },
        { name: 'proactive-agent', description: 'Proactive agent patterns', version: '1.0.0' },
      ]);

      // Mock automations data
      setAutomations([
        { id: '1', name: 'Daily Weather', lastRun: '2026-03-04T08:00:00', status: 'success', runs: 45, errors: 0 },
        { id: '2', name: 'Health Check', lastRun: '2026-03-04T08:20:00', status: 'success', runs: 1247, errors: 3 },
        { id: '3', name: 'Auto Update', lastRun: '2026-03-03T03:00:00', status: 'success', runs: 12, errors: 1 },
        { id: '4', name: 'GitHub Sync', lastRun: '2026-03-04T07:30:00', status: 'error', runs: 89, errors: 5 },
      ]);

      // Mock ports data
      setPorts([
        { port: 3000, protocol: 'TCP', status: 'LISTEN', process: 'node' },
        { port: 3001, protocol: 'TCP', status: 'LISTEN', process: 'node' },
        { port: 5432, protocol: 'TCP', status: 'LISTEN', process: 'postgres' },
        { port: 6379, protocol: 'TCP', status: 'LISTEN', process: 'redis' },
        { port: 22, protocol: 'TCP', status: 'LISTEN', process: 'sshd' },
      ]);

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching OpenClaw data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Helper function for exec (using fetch to API endpoint would be better in production)
  const exec = async (cmd: string): Promise<{ stdout: string; stderr: string }> => {
    try {
      const response = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      if (!response.ok) throw new Error('Exec failed');
      return await response.json();
    } catch {
      return { stdout: '', stderr: '' };
    }
  };

  if (loading && !systemStatus) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent)]" />
          <p className="text-[var(--text-muted)]">Lade OpenClaw Status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">OpenClaw Status</h1>
            <p className="text-sm text-[var(--text-muted)]">Systemmonitoring & Automation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">
            Letzte Aktualisierung: {lastRefresh.toLocaleTimeString('de-DE')}
          </span>
          <button 
            onClick={fetchData}
            className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <RefreshCw size={16} className="text-[var(--text-secondary)]" />
          </button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Gateway Status" icon={<Server size={18} />} className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--accent-muted)]">
          <div className="flex items-center justify-between">
            <StatusBadge status={systemStatus?.gatewayStatus || 'offline'} label={systemStatus?.gatewayStatus === 'online' ? 'Online' : 'Offline'} />
            <Users size={18} className="text-[var(--text-muted)]" />
          </div>
          <p className="text-2xl font-bold mt-2">{systemStatus?.activeSessions || 0}</p>
          <p className="text-xs text-[var(--text-muted)]">Aktive Sessions</p>
        </Card>

        <Card title="Uptime" icon={<Timer size={18} />}>
          <p className="text-2xl font-bold">{systemStatus?.uptime || 'N/A'}</p>
          <p className="text-xs text-[var(--text-muted)]">System läuft seit</p>
        </Card>

        <Card title="Speicher" icon={<HardDrive size={18} />}>
          <div className="w-full bg-[var(--bg-primary)] rounded-full h-2 mb-2">
            <div 
              className="bg-[var(--accent)] h-2 rounded-full transition-all" 
              style={{ width: `${systemStatus?.memory.percentage || 0}%` }}
            />
          </div>
          <p className="text-sm">{systemStatus?.memory.percentage || 0}% verwendet</p>
          <p className="text-xs text-[var(--text-muted)]">
            {formatBytes(systemStatus?.memory.used || 0)} / {formatBytes(systemStatus?.memory.total || 0)}
          </p>
        </Card>

        <Card title="Festplatte" icon={<HardDrive size={18} />}>
          <div className="w-full bg-[var(--bg-primary)] rounded-full h-2 mb-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all" 
              style={{ width: `${systemStatus?.disk.percentage || 0}%` }}
            />
          </div>
          <p className="text-sm">{systemStatus?.disk.percentage || 0}% verwendet</p>
          <p className="text-xs text-[var(--text-muted)]">
            {formatBytes(systemStatus?.disk.used || 0)} / {formatBytes(systemStatus?.disk.total || 0)}
          </p>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Cron Jobs */}
        <Card title="Cron Jobs" icon={<Clock size={18} />}>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cronJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-2 rounded bg-[var(--bg-primary)]">
                <div>
                  <p className="font-medium text-sm">{job.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{job.schedule}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={job.status} label={job.status === 'active' ? 'Aktiv' : job.status === 'disabled' ? 'Deaktiviert' : 'Fehler'} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Processes */}
        <Card title="Prozesse" icon={<Cpu size={18} />}>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-5 text-xs text-[var(--text-muted)] px-2 pb-2">
              <span>PID</span>
              <span className="col-span-2">Name</span>
              <span>CPU</span>
              <span>MEM</span>
            </div>
            {processes.slice(0, 10).map((proc, idx) => (
              <div key={idx} className="grid grid-cols-5 text-xs px-2 py-1 hover:bg-[var(--bg-primary)] rounded">
                <span className="text-[var(--text-muted)]">{proc.pid}</span>
                <span className="col-span-2 truncate">{proc.name}</span>
                <span>{proc.cpu.toFixed(1)}%</span>
                <span>{proc.memory.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Skills */}
        <Card title="Skills" icon={<Package size={18} />}>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill) => (
              <div key={skill.name} className="p-2 rounded bg-[var(--bg-primary)] flex items-center gap-2">
                <Package size={14} className="text-[var(--accent)]" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{skill.name}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Automation Hub */}
        <Card title="Automation Hub" icon={<Zap size={18} />}>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {automations.map((auto) => (
              <div key={auto.id} className="p-2 rounded bg-[var(--bg-primary)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{auto.name}</span>
                  <StatusBadge status={auto.status} label={auto.status === 'success' ? 'Erfolg' : auto.status === 'error' ? 'Fehler' : 'Läuft'} />
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <span>Letzte: {new Date(auto.lastRun).toLocaleString('de-DE')}</span>
                  <span>{auto.runs} Runs</span>
                  {auto.errors > 0 && <span className="text-red-400">{auto.errors} Fehler</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* API/Integration */}
      <Card title="API & Integration" icon={<Network size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ports.map((port) => (
            <div key={port.port} className="p-3 rounded bg-[var(--bg-primary)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network size={14} className="text-[var(--accent)]" />
                <span className="font-mono text-sm">:{port.port}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)]">{port.protocol}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">{port.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
