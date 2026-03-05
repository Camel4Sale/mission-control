"use client";

import { useState, useEffect } from "react";
import { Bot, Play, Square, Trash2, Plus, RefreshCw, Server, Activity } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
  board_id: string | null;
  last_seen_at: string;
  created_at: string;
  openclaw_session_id: string | null;
}

const STORAGE_KEY = "mission_control_agents";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Load agents from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAgents(JSON.parse(stored));
    } else {
      // Initialize with demo agents
      const demoAgents: Agent[] = [
        {
          id: "1",
          name: "Main Agent",
          status: "running",
          board_id: "default",
          last_seen_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          openclaw_session_id: "session-001"
        },
        {
          id: "2",
          name: "Dev Agent",
          status: "stopped",
          board_id: "dev",
          last_seen_at: new Date(Date.now() - 3600000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString(),
          openclaw_session_id: null
        }
      ];
      setAgents(demoAgents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoAgents));
    }
    setLoading(false);
  }, []);

  const saveAgents = (newAgents: Agent[]) => {
    setAgents(newAgents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgents));
  };

  const startAgent = (id: string) => {
    saveAgents(agents.map(a => 
      a.id === id ? { ...a, status: "running" as const, last_seen_at: new Date().toISOString() } : a
    ));
  };

  const stopAgent = (id: string) => {
    saveAgents(agents.map(a => 
      a.id === id ? { ...a, status: "stopped" as const } : a
    ));
  };

  const deleteAgent = (id: string) => {
    saveAgents(agents.filter(a => a.id !== id));
    setSelectedAgent(null);
  };

  const createAgent = () => {
    if (!newAgentName.trim()) return;
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: newAgentName,
      status: "stopped",
      board_id: null,
      last_seen_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      openclaw_session_id: null
    };
    saveAgents([...agents, newAgent]);
    setNewAgentName("");
    setShowNewForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

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
            <Bot className="w-7 h-7" />
            Agents
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            {agents.length} Agent{agents.length !== 1 ? "en" : ""} insgesamt
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Neuer Agent
        </button>
      </div>

      {/* New Agent Form */}
      {showNewForm && (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Neuen Agent erstellen</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              placeholder="Agent Name"
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              autoFocus
            />
            <button
              onClick={createAgent}
              className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg"
            >
              Erstellen
            </button>
            <button
              onClick={() => { setShowNewForm(false); setNewAgentName(""); }}
              className="px-4 py-2 bg-[var(--bg-tertiary)] rounded-lg"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Agent List */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--bg-tertiary)]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Board</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Zuletzt aktiv</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className="border-t border-[var(--border)] hover:bg-[var(--bg-hover)]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Bot size={18} className="text-[var(--accent)]" />
                    <span className="font-medium">{agent.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${agent.status === 'running' ? 'bg-green-500/20 text-green-400' : agent.status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                    {agent.status === "running" ? "Läuft" : agent.status === "error" ? "Fehler" : "Gestoppt"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--text-muted)]">
                  {agent.board_id || "—"}
                </td>
                <td className="px-4 py-3 text-[var(--text-muted)] text-sm">
                  {formatDate(agent.last_seen_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {agent.status === "running" ? (
                      <button
                        onClick={() => stopAgent(agent.id)}
                        className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-amber-400"
                        title="Stoppen"
                      >
                        <Square size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => startAgent(agent.id)}
                        className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-green-400"
                        title="Starten"
                      >
                        <Play size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                      title="Details"
                    >
                      <Activity size={16} />
                    </button>
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-red-400"
                      title="Löschen"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {agents.length === 0 && (
          <div className="p-8 text-center text-[var(--text-muted)]">
            <Bot size={48} className="mx-auto mb-4 opacity-50" />
            <p>Noch keine Agents erstellt</p>
            <button
              onClick={() => setShowNewForm(true)}
              className="mt-4 text-[var(--accent)] hover:underline"
            >
              Ersten Agent erstellen
            </button>
          </div>
        )}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 w-full max-w-md border border-[var(--border)]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Bot className="w-5 h-5 text-[var(--accent)]" />
              {selectedAgent.name}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedAgent.status === 'running' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {selectedAgent.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Board ID</span>
                <span>{selectedAgent.board_id || "—"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Session ID</span>
                <span className="text-sm font-mono">{selectedAgent.openclaw_session_id || "—"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Erstellt</span>
                <span className="text-sm">{formatDate(selectedAgent.created_at)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[var(--text-muted)]">Zuletzt aktiv</span>
                <span className="text-sm">{formatDate(selectedAgent.last_seen_at)}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {selectedAgent.status === "running" ? (
                <button
                  onClick={() => stopAgent(selectedAgent.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30"
                >
                  <Square size={16} />
                  Stoppen
                </button>
              ) : (
                <button
                  onClick={() => startAgent(selectedAgent.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                >
                  <Play size={16} />
                  Starten
                </button>
              )}
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 bg-[var(--bg-tertiary)] rounded-lg"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
