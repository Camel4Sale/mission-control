"use client";

import { useState, useEffect } from "react";
import { Server, Play, Square, RefreshCw, CheckCircle, XCircle, AlertCircle, Shield } from "lucide-react";

interface Gateway {
  id: string;
  name: string;
  status: "online" | "offline" | "error";
  nodes_connected: number;
  health_check: "healthy" | "unhealthy" | "unknown";
  last_health_check: string;
  version: string;
  created_at: string;
}

const STORAGE_KEY = "mission_control_gateways";

export default function GatewaysPage() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setGateways(JSON.parse(stored));
    } else {
      const demoGateways: Gateway[] = [
        {
          id: "1",
          name: "Main Gateway",
          status: "online",
          nodes_connected: 3,
          health_check: "healthy",
          last_health_check: new Date().toISOString(),
          version: "1.0.0",
          created_at: new Date(Date.now() - 86400000 * 7).toISOString()
        },
        {
          id: "2",
          name: "Backup Gateway",
          status: "offline",
          nodes_connected: 0,
          health_check: "unknown",
          last_health_check: new Date(Date.now() - 3600000).toISOString(),
          version: "1.0.0",
          created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ];
      setGateways(demoGateways);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoGateways));
    }
    setLoading(false);
  }, []);

  const saveGateways = (newGateways: Gateway[]) => {
    setGateways(newGateways);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGateways));
  };

  const runHealthCheck = (id: string) => {
    saveGateways(gateways.map(g => 
      g.id === id ? { 
        ...g, 
        health_check: Math.random() > 0.3 ? "healthy" as const : "unhealthy" as const,
        last_health_check: new Date().toISOString()
      } : g
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "error": return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case "healthy": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "unhealthy": return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
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
            <Server className="w-7 h-7" />
            Gateways
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            {gateways.filter(g => g.status === "online").length} von {gateways.length} Gateways online
          </p>
        </div>
      </div>

      {/* Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gateways.map((gateway) => (
          <div 
            key={gateway.id}
            className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors cursor-pointer"
            onClick={() => setSelectedGateway(gateway)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${gateway.status === 'online' ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                  <Server className={`w-5 h-5 ${gateway.status === 'online' ? 'text-green-400' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">{gateway.name}</h3>
                  <span className={`text-xs ${gateway.status === 'online' ? 'text-green-400' : gateway.status === 'error' ? 'text-red-400' : 'text-gray-400'}`}>
                    {gateway.status === "online" ? "Online" : gateway.status === "error" ? "Fehler" : "Offline"}
                  </span>
                </div>
              </div>
              {getStatusIcon(gateway.status)}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Verbundene Nodes</span>
                <span className="font-medium">{gateway.nodes_connected}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Health Check</span>
                <div className="flex items-center gap-1">
                  {getHealthIcon(gateway.health_check)}
                  <span className={gateway.health_check === 'healthy' ? 'text-green-400' : gateway.health_check === 'unhealthy' ? 'text-red-400' : 'text-gray-400'}>
                    {gateway.health_check === "healthy" ? "Healthy" : gateway.health_check === "unhealthy" ? "Unhealthy" : "Unbekannt"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Version</span>
                <span className="font-mono text-xs">{gateway.version}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)]">
                {formatDate(gateway.last_health_check)}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); runHealthCheck(gateway.id); }}
                className="flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
              >
                <RefreshCw size={12} />
                Check
              </button>
            </div>
          </div>
        ))}
      </div>

      {gateways.length === 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-8 text-center border border-[var(--border)]">
          <Server size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
          <p className="text-[var(--text-muted)]">Keine Gateways konfiguriert</p>
        </div>
      )}

      {/* Gateway Detail Modal */}
      {selectedGateway && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 w-full max-w-lg border border-[var(--border)]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Server className="w-5 h-5 text-[var(--accent)]" />
              {selectedGateway.name}
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Status</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedGateway.status)}
                  <span className={selectedGateway.status === 'online' ? 'text-green-400' : 'text-gray-400'}>
                    {selectedGateway.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Verbundene Nodes</span>
                <span>{selectedGateway.nodes_connected}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Health Check</span>
                <div className="flex items-center gap-2">
                  {getHealthIcon(selectedGateway.health_check)}
                  <span>{selectedGateway.health_check}</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Version</span>
                <span className="font-mono">{selectedGateway.version}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Letzter Check</span>
                <span className="text-sm">{formatDate(selectedGateway.last_health_check)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[var(--text-muted)]">Erstellt</span>
                <span className="text-sm">{formatDate(selectedGateway.created_at)}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => runHealthCheck(selectedGateway.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90"
              >
                <RefreshCw size={16} />
                Health Check
              </button>
              <button
                onClick={() => setSelectedGateway(null)}
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
