"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle, XCircle, Clock, RefreshCw, MessageSquare, User } from "lucide-react";

interface Approval {
  id: string;
  title: string;
  description: string;
  requested_by: string;
  requested_at: string;
  status: "pending" | "approved" | "rejected";
  task_id: string | null;
  board_name: string | null;
  priority: "low" | "medium" | "high";
}

const STORAGE_KEY = "mission_control_approvals";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApprovals(JSON.parse(stored));
    } else {
      const demoApprovals: Approval[] = [
        {
          id: "1",
          title: "Deploy to Production",
          description: "Deploy version 2.0.0 to production environment. This includes new features and bug fixes.",
          requested_by: "Dev Agent",
          requested_at: new Date().toISOString(),
          status: "pending",
          task_id: "task-123",
          board_name: "Main Board",
          priority: "high"
        },
        {
          id: "2",
          title: "Delete Test Data",
          description: "Remove all test user accounts from the database to comply with GDPR.",
          requested_by: "Main Agent",
          requested_at: new Date(Date.now() - 3600000).toISOString(),
          status: "pending",
          task_id: "task-124",
          board_name: "Main Board",
          priority: "medium"
        },
        {
          id: "3",
          title: "Update API Rate Limits",
          description: "Increase API rate limits from 1000 to 5000 requests per hour.",
          requested_by: "Dev Agent",
          requested_at: new Date(Date.now() - 7200000).toISOString(),
          status: "approved",
          task_id: "task-125",
          board_name: "Dev Board",
          priority: "low"
        },
        {
          id: "4",
          title: "Grant Admin Access",
          description: "Grant admin access to user 'john.doe@company.com'",
          requested_by: "Admin",
          requested_at: new Date(Date.now() - 86400000).toISOString(),
          status: "rejected",
          task_id: null,
          board_name: "Main Board",
          priority: "high"
        }
      ];
      setApprovals(demoApprovals);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoApprovals));
    }
    setLoading(false);
  }, []);

  const saveApprovals = (newApprovals: Approval[]) => {
    setApprovals(newApprovals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newApprovals));
  };

  const approveRequest = (id: string) => {
    saveApprovals(approvals.map(a => 
      a.id === id ? { ...a, status: "approved" as const } : a
    ));
  };

  const rejectRequest = (id: string) => {
    saveApprovals(approvals.map(a => 
      a.id === id ? { ...a, status: "rejected" as const } : a
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "rejected": return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-amber-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "Genehmigt";
      case "rejected": return "Abgelehnt";
      default: return "Ausstehend";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 3600000) return `Vor ${Math.floor(diff / 60000)} Min.`;
    if (diff < 86400000) return `Vor ${Math.floor(diff / 3600000)} Std.`;
    return date.toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const filteredApprovals = approvals.filter(a => 
    filter === "all" || a.status === filter
  );

  const pendingCount = approvals.filter(a => a.status === "pending").length;

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
            <Shield className="w-7 h-7" />
            Approvals
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            {pendingCount} ausstehende Genehmigungen
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status 
                ? 'bg-[var(--accent)] text-white' 
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            {status === "all" ? "Alle" : getStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* Approval Cards */}
      <div className="space-y-4">
        {filteredApprovals.map((approval) => (
          <div 
            key={approval.id}
            className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBadge(approval.status)}`}>
                  {getStatusIcon(approval.status)}
                </div>
                <div>
                  <h3 className="font-semibold">{approval.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadge(approval.status)}`}>
                      {getStatusLabel(approval.status)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityBadge(approval.priority)}`}>
                      {approval.priority === "high" ? "Hoch" : approval.priority === "medium" ? "Mittel" : "Niedrig"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] mb-4">
              {approval.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  {approval.requested_by}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatTime(approval.requested_at)}
                </div>
                {approval.board_name && (
                  <span>{approval.board_name}</span>
                )}
              </div>

              {approval.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => rejectRequest(approval.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <XCircle size={14} />
                    Ablehnen
                  </button>
                  <button
                    onClick={() => approveRequest(approval.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                  >
                    <CheckCircle size={14} />
                    Genehmigen
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredApprovals.length === 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-8 text-center border border-[var(--border)]">
          <Shield size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
          <p className="text-[var(--text-muted)]">Keine Genehmigungen gefunden</p>
        </div>
      )}
    </div>
  );
}
