"use client";

import { useState, useEffect } from "react";
import { Clock, Filter, RefreshCw, Bot, MessageSquare, CheckCircle, XCircle, Plus, User } from "lucide-react";

interface ActivityEvent {
  id: string;
  event_type: "task.created" | "task.updated" | "task.status_changed" | "task.comment" | "agent.online" | "agent.offline" | "agent.created" | "approval.approved" | "approval.rejected";
  message: string;
  agent_name: string | null;
  task_title: string | null;
  board_name: string | null;
  created_at: string;
}

const STORAGE_KEY = "mission_control_activity";

export default function ActivityPage() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      const demoEvents: ActivityEvent[] = [
        {
          id: "1",
          event_type: "task.created",
          message: "Task 'Website Redesign' erstellt",
          agent_name: "Main Agent",
          task_title: "Website Redesign",
          board_name: "Main Board",
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          event_type: "task.status_changed",
          message: "Task 'API Integration' auf 'In Progress' geändert",
          agent_name: "Dev Agent",
          task_title: "API Integration",
          board_name: "Dev Board",
          created_at: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: "3",
          event_type: "task.comment",
          message: "Kommentar hinzugefügt zu 'Database Setup'",
          agent_name: "Main Agent",
          task_title: "Database Setup",
          board_name: "Main Board",
          created_at: new Date(Date.now() - 600000).toISOString()
        },
        {
          id: "4",
          event_type: "agent.online",
          message: "Agent 'Main Agent' ist jetzt online",
          agent_name: "Main Agent",
          task_title: null,
          board_name: null,
          created_at: new Date(Date.now() - 900000).toISOString()
        },
        {
          id: "5",
          event_type: "approval.approved",
          message: "Approval für 'Deploy to Production' genehmigt",
          agent_name: "Admin",
          task_title: "Deploy to Production",
          board_name: "Main Board",
          created_at: new Date(Date.now() - 1200000).toISOString()
        },
        {
          id: "6",
          event_type: "task.updated",
          message: "Task 'Bug Fix #42' aktualisiert",
          agent_name: "Dev Agent",
          task_title: "Bug Fix #42",
          board_name: "Dev Board",
          created_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: "7",
          event_type: "approval.rejected",
          message: "Approval für 'Delete Production DB' abgelehnt",
          agent_name: "Admin",
          task_title: "Delete Production DB",
          board_name: "Main Board",
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      setEvents(demoEvents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoEvents));
    }
    setLoading(false);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "task.created": return <Plus className="w-4 h-4 text-green-400" />;
      case "task.updated": return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case "task.status_changed": return <Clock className="w-4 h-4 text-amber-400" />;
      case "task.comment": return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case "agent.online": return <Bot className="w-4 h-4 text-green-400" />;
      case "agent.offline": return <Bot className="w-4 h-4 text-gray-400" />;
      case "agent.created": return <Bot className="w-4 h-4 text-violet-400" />;
      case "approval.approved": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "approval.rejected": return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case "task.created": return "Erstellt";
      case "task.updated": return "Aktualisiert";
      case "task.status_changed": return "Status";
      case "task.comment": return "Kommentar";
      case "agent.online": return "Online";
      case "agent.offline": return "Offline";
      case "agent.created": return "Agent";
      case "approval.approved": return "Genehmigt";
      case "approval.rejected": return "Abgelehnt";
      default: return "Unbekannt";
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case "task.created": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "task.updated": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "task.status_changed": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "task.comment": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "agent.online": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "agent.offline": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "agent.created": return "bg-violet-500/20 text-violet-400 border-violet-500/30";
      case "approval.approved": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "approval.rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "Gerade eben";
    if (diff < 3600000) return `Vor ${Math.floor(diff / 60000)} Min.`;
    if (diff < 86400000) return `Vor ${Math.floor(diff / 3600000)} Std.`;
    return date.toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const filteredEvents = events.filter(event => {
    const typeMatch = filter === "all" || event.event_type === filter;
    const agentMatch = agentFilter === "all" || event.agent_name === agentFilter;
    return typeMatch && agentMatch;
  });

  const uniqueAgents = [...new Set(events.map(e => e.agent_name).filter(Boolean))] as string[];
  const eventTypes = [...new Set(events.map(e => e.event_type))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin w-8 h-8 text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Clock className="w-7 h-7" />
            Activity
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            {events.length} Ereignisse
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[var(--text-muted)]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="all">Alle Typen</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{getEventLabel(type)}</option>
            ))}
          </select>
        </div>
        <select
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          <option value="all">Alle Agents</option>
          {uniqueAgents.map(agent => (
            <option key={agent} value={agent}>{agent}</option>
          ))}
        </select>
      </div>

      {/* Activity Feed */}
      <div className="space-y-3">
        {filteredEvents.map((event) => (
          <div 
            key={event.id}
            className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--bg-tertiary)] ${getEventBadge(event.event_type)}`}>
                {getEventIcon(event.event_type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getEventBadge(event.event_type)}`}>
                    {getEventLabel(event.event_type)}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {formatTime(event.created_at)}
                  </span>
                </div>
                <p className="text-sm">{event.message}</p>
                {event.task_title && (
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Task: {event.task_title}
                    {event.board_name && ` • ${event.board_name}`}
                  </p>
                )}
              </div>
              {event.agent_name && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <User size={12} />
                  {event.agent_name}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-8 text-center border border-[var(--border)]">
          <Clock size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
          <p className="text-[var(--text-muted)]">Keine Ereignisse gefunden</p>
        </div>
      )}
    </div>
  );
}
