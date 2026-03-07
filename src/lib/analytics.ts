/**
 * Analytics Data Layer
 * Mock data generator for OpenClaw metrics
 * In production, this would connect to real APIs
 */

export interface GatewayHealth {
  status: 'healthy' | 'degraded' | 'offline';
  rpcConnected: boolean;
  ports: { port: number; service: string; status: 'open' | 'closed' }[];
  services: { name: string; status: 'running' | 'stopped' | 'error' }[];
  uptime: number;
  lastCheck: Date;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  status: 'active' | 'paused' | 'error';
  lastRun?: Date;
  nextRun?: Date;
  errorCount: number;
}

export interface SubAgentActivity {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  task: string;
}

export interface TokenUsage {
  date: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export interface SessionMetrics {
  activeSessions: number;
  avgDuration: number;
  messagesPerSession: number;
  toolCallsPerSession: number;
  totalSessions24h: number;
}

export interface ModelUsage {
  model: string;
  totalTokens: number;
  totalCost: number;
  requests: number;
  avgLatency: number;
  fallbackCount: number;
  rateLimitCount: number;
}

export interface GitStatus {
  branch: string;
  commits24h: number;
  commits7d: number;
  commits30d: number;
  pushes24h: number;
  pushes7d: number;
  branches: number;
  uncommittedChanges: number;
}

export interface FileChanges {
  period: '24h' | '7d' | '30d';
  added: number;
  modified: number;
  deleted: number;
}

export interface StorageUsage {
  total: number;
  used: number;
  byCategory: { name: string; size: number; percentage: number }[];
}

export interface SkillInventory {
  total: number;
  active: number;
  disabled: number;
  skills: { name: string; version: string; lastUpdated: Date; status: 'active' | 'disabled' }[];
}

export interface AutomationTracking {
  cronJobsExecuted24h: number;
  errorsCaught: number;
  autoFixesApplied: number;
  timeSavedEstimate: number; // in minutes
}

// Mock data generators
export function generateGatewayHealth(): GatewayHealth {
  return {
    status: 'healthy',
    rpcConnected: true,
    ports: [
      { port: 3000, service: 'HTTP API', status: 'open' },
      { port: 3001, service: 'WebSocket', status: 'open' },
      { port: 5432, service: 'PostgreSQL', status: 'open' },
    ],
    services: [
      { name: 'Gateway', status: 'running' },
      { name: 'Scheduler', status: 'running' },
      { name: 'Agent Runner', status: 'running' },
      { name: 'Message Bridge', status: 'running' },
    ],
    uptime: 86400 * 7 + 3600 * 5 + 1800, // 7 days, 5 hours, 30 minutes
    lastCheck: new Date(),
  };
}

export function generateCronJobs(): CronJob[] {
  const jobs = [
    { name: 'Heartbeat Check', schedule: '*/30 * * * *' },
    { name: 'Daily Memory Cleanup', schedule: '0 3 * * *' },
    { name: 'Skill Auto-Update', schedule: '0 4 * * *' },
    { name: 'Usage Report', schedule: '0 9 * * 1' },
    { name: 'Health Check', schedule: '*/15 * * * *' },
  ];

  return jobs.map((job, i) => ({
    id: `cron-${i}`,
    name: job.name,
    schedule: job.schedule,
    status: Math.random() > 0.1 ? 'active' : Math.random() > 0.5 ? 'paused' : 'error',
    lastRun: new Date(Date.now() - Math.random() * 3600000),
    nextRun: new Date(Date.now() + Math.random() * 3600000),
    errorCount: Math.floor(Math.random() * 3),
  }));
}

export function generateSubAgentActivity(): SubAgentActivity[] {
  const tasks = [
    'Code Review',
    'Documentation Update',
    'Bug Fix Implementation',
    'Feature Development',
    'Testing',
    'Research',
  ];

  return Array.from({ length: 8 }, (_, i) => {
    const status = Math.random() > 0.7 ? 'running' : Math.random() > 0.2 ? 'completed' : 'failed';
    const startedAt = new Date(Date.now() - Math.random() * 86400000);
    return {
      id: `agent-${i}`,
      name: `Agent-${String.fromCharCode(65 + i)}`,
      status,
      startedAt,
      completedAt: status !== 'running' ? new Date(startedAt.getTime() + Math.random() * 3600000) : undefined,
      duration: status !== 'running' ? Math.random() * 3600000 : undefined,
      task: tasks[Math.floor(Math.random() * tasks.length)],
    };
  });
}

export function generateTokenUsage(): TokenUsage[] {
  const models = ['ollama/qwen3.5:cloud', 'claude-sonnet-4-5-20250929', 'gpt-4o', 'gemini-2.5-pro'];
  const days = 30;
  const data: TokenUsage[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    models.forEach(model => {
      data.push({
        date: date.toISOString().split('T')[0],
        model,
        inputTokens: Math.floor(Math.random() * 50000) + 10000,
        outputTokens: Math.floor(Math.random() * 30000) + 5000,
        cost: Math.random() * 0.5,
      });
    });
  }

  return data;
}

export function generateSessionMetrics(): SessionMetrics {
  return {
    activeSessions: Math.floor(Math.random() * 5) + 1,
    avgDuration: Math.floor(Math.random() * 1800) + 300,
    messagesPerSession: Math.floor(Math.random() * 50) + 10,
    toolCallsPerSession: Math.floor(Math.random() * 30) + 5,
    totalSessions24h: Math.floor(Math.random() * 100) + 20,
  };
}

export function generateModelUsage(): ModelUsage[] {
  const models = [
    { name: 'ollama/qwen3.5:cloud', baseCost: 0 },
    { name: 'claude-sonnet-4-5-20250929', baseCost: 0.000003 },
    { name: 'gpt-4o', baseCost: 0.0000025 },
    { name: 'gemini-2.5-pro', baseCost: 0.000001 },
  ];

  return models.map(model => ({
    model: model.name,
    totalTokens: Math.floor(Math.random() * 500000) + 100000,
    totalCost: model.baseCost === 0 ? 0 : Math.random() * 10,
    requests: Math.floor(Math.random() * 1000) + 100,
    avgLatency: Math.random() * 2 + 0.5,
    fallbackCount: Math.floor(Math.random() * 5),
    rateLimitCount: Math.floor(Math.random() * 10),
  }));
}

export function generateGitStatus(): GitStatus {
  return {
    branch: 'main',
    commits24h: Math.floor(Math.random() * 10) + 1,
    commits7d: Math.floor(Math.random() * 50) + 10,
    commits30d: Math.floor(Math.random() * 200) + 50,
    pushes24h: Math.floor(Math.random() * 5) + 1,
    pushes7d: Math.floor(Math.random() * 20) + 5,
    branches: Math.floor(Math.random() * 10) + 3,
    uncommittedChanges: Math.floor(Math.random() * 5),
  };
}

export function generateFileChanges(): FileChanges[] {
  return [
    { period: '24h', added: Math.floor(Math.random() * 20), modified: Math.floor(Math.random() * 50), deleted: Math.floor(Math.random() * 10) },
    { period: '7d', added: Math.floor(Math.random() * 100), modified: Math.floor(Math.random() * 200), deleted: Math.floor(Math.random() * 50) },
    { period: '30d', added: Math.floor(Math.random() * 300), modified: Math.floor(Math.random() * 500), deleted: Math.floor(Math.random() * 150) },
  ];
}

export function generateStorageUsage(): StorageUsage {
  const total = 500 * 1024 * 1024 * 1024; // 500GB
  const used = total * 0.65;
  
  return {
    total,
    used,
    byCategory: [
      { name: 'node_modules', size: used * 0.4, percentage: 40 },
      { name: '.next', size: used * 0.2, percentage: 20 },
      { name: 'Skills', size: used * 0.15, percentage: 15 },
      { name: 'Memory', size: used * 0.1, percentage: 10 },
      { name: 'Other', size: used * 0.15, percentage: 15 },
    ],
  };
}

export function generateSkillInventory(): SkillInventory {
  const skills = [
    'discord', 'frontend-design', 'answeroverflow', 'free-ride', 'nano-pdf',
    'weather', 'himalaya', 'github', 'healthcheck', 'clawhub',
    'coding-agent', 'gh-issues', 'mcporter', 'model-usage', 'tmux',
    'skill-creator', 'byterover', 'clawdhub', 'automation-workflows',
    'agentmail', 'auto-updater', 'proactive-agent', 'qmd', 'self-improvement',
    'youtube-transcript',
  ];

  return {
    total: skills.length,
    active: skills.length - 2,
    disabled: 2,
    skills: skills.map(name => ({
      name,
      version: `${Math.floor(Math.random() * 2)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      lastUpdated: new Date(Date.now() - Math.random() * 86400000 * 30),
      status: Math.random() > 0.08 ? 'active' : 'disabled',
    })),
  };
}

export function generateAutomationTracking(): AutomationTracking {
  return {
    cronJobsExecuted24h: Math.floor(Math.random() * 100) + 50,
    errorsCaught: Math.floor(Math.random() * 20) + 1,
    autoFixesApplied: Math.floor(Math.random() * 15),
    timeSavedEstimate: Math.floor(Math.random() * 300) + 60,
  };
}

// Format helpers
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export function formatCurrency(num: number): string {
  return `$${num.toFixed(2)}`;
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
