'use client';

import { SubAgentActivity, formatDuration, formatRelativeTime } from '@/lib/analytics';
import { Bot, Play, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SubAgentActivityProps {
  agents: SubAgentActivity[];
}

export function SubAgentActivityPanel({ agents }: SubAgentActivityProps) {
  const running = agents.filter(a => a.status === 'running');
  const completed = agents.filter(a => a.status === 'completed');
  const failed = agents.filter(a => a.status === 'failed');

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-bold">Sub-Agent Activity</h3>
        <div className="flex gap-2">
          <span className="badge badge-success">{running.length} running</span>
          <span className="badge badge-default">{completed.length} done</span>
          <span className="badge badge-danger">{failed.length} failed</span>
        </div>
      </div>

      <div className="space-y-2">
        {agents.slice(0, 8).map(agent => (
          <AgentRow key={agent.id} agent={agent} />
        ))}
      </div>

      {agents.length > 8 && (
        <div className="text-center text-sm text-muted mt-4">
          +{agents.length - 8} more agents
        </div>
      )}
    </div>
  );
}

function AgentRow({ agent }: { agent: SubAgentActivity }) {
  const statusIcon = {
    running: <Play className="w-4 h-4 text-accent" />,
    completed: <CheckCircle className="w-4 h-4 text-success" />,
    failed: <XCircle className="w-4 h-4 text-danger" />,
  };

  const statusBadge = {
    running: 'badge-accent',
    completed: 'badge-success',
    failed: 'badge-danger',
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border-subtle hover:border-border-default transition-colors">
      <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center">
        <Bot className="w-5 h-5 text-accent" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary truncate">{agent.name}</span>
          <span className={`badge ${statusBadge[agent.status]} px-2 py-0.5 text-xs`}>
            {agent.status}
          </span>
        </div>
        <div className="text-sm text-secondary truncate">{agent.task}</div>
      </div>

      <div className="text-right text-xs text-muted">
        <div className="flex items-center gap-1 justify-end">
          <Clock className="w-3 h-3" />
          {agent.duration ? formatDuration(agent.duration / 1000) : 'Running'}
        </div>
        <div>{formatRelativeTime(agent.startedAt)}</div>
      </div>
    </div>
  );
}
