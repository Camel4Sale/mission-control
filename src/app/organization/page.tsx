"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Users, Shield, Settings, Crown, User, RefreshCw, Mail, Plus } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatar?: string;
  status: "active" | "invited";
  joined_at: string;
}

interface Organization {
  name: string;
  created_at: string;
  plan: "free" | "pro" | "enterprise";
}

const STORAGE_KEY = "mission_control_organization";

export default function OrganizationPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "members">("overview");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setOrganization(data.organization);
      setMembers(data.members);
    } else {
      const demoOrg: Organization = {
        name: "Camel4Sale",
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        plan: "pro"
      };
      
      const demoMembers: TeamMember[] = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@camel4sale.com",
          role: "owner",
          status: "active",
          joined_at: new Date(Date.now() - 86400000 * 30).toISOString()
        },
        {
          id: "2",
          name: "Dev Agent",
          email: "dev@camel4sale.com",
          role: "admin",
          status: "active",
          joined_at: new Date(Date.now() - 86400000 * 20).toISOString()
        },
        {
          id: "3",
          name: "Test User",
          email: "test@camel4sale.com",
          role: "member",
          status: "active",
          joined_at: new Date(Date.now() - 86400000 * 10).toISOString()
        },
        {
          id: "4",
          name: "New Member",
          email: "new@camel4sale.com",
          role: "member",
          status: "invited",
          joined_at: new Date().toISOString()
        }
      ];
      
      setOrganization(demoOrg);
      setMembers(demoMembers);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ organization: demoOrg, members: demoMembers }));
    }
    setLoading(false);
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner": return <Crown className="w-4 h-4 text-amber-400" />;
      case "admin": return <Shield className="w-4 h-4 text-violet-400" />;
      default: return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "owner": return "Inhaber";
      case "admin": return "Administrator";
      default: return "Mitglied";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "admin": return "bg-violet-500/20 text-violet-400 border-violet-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "enterprise": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "pro": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const ownerCount = members.filter(m => m.role === "owner").length;
  const adminCount = members.filter(m => m.role === "admin").length;
  const memberCount = members.filter(m => m.role === "member").length;
  const activeCount = members.filter(m => m.status === "active").length;

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
            <LinkIcon className="w-7 h-7" />
            Organization
          </h1>
          {organization && (
            <p className="text-[var(--text-muted)] mt-1">
              {organization.name} • 
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs border ${getPlanBadge(organization.plan)}`}>
                {organization.plan === "pro" ? "Pro" : organization.plan === "enterprise" ? "Enterprise" : "Free"}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
          }`}
        >
          Übersicht
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "members"
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
          }`}
        >
          <Users size={16} />
          Mitglieder
          <span className="px-1.5 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-xs">
            {members.length}
          </span>
        </button>
      </div>

      {activeTab === "overview" && organization && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stats Cards */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-[var(--text-muted)]">Mitglieder</span>
            </div>
            <p className="text-3xl font-bold">{members.length}</p>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-[var(--text-muted)]">Aktiv</span>
            </div>
            <p className="text-3xl font-bold">{activeCount}</p>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[var(--text-muted)]">Inhaber</span>
            </div>
            <p className="text-3xl font-bold">{ownerCount}</p>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-[var(--text-muted)]">Admins</span>
            </div>
            <p className="text-3xl font-bold">{adminCount}</p>
          </div>

          {/* Organization Details */}
          <div className="col-span-full bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border)]">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings size={18} />
              Organization Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-[var(--text-muted)]">Name</span>
                <p className="font-medium">{organization.name}</p>
              </div>
              <div>
                <span className="text-sm text-[var(--text-muted)]">Plan</span>
                <p className="font-medium capitalize">{organization.plan}</p>
              </div>
              <div>
                <span className="text-sm text-[var(--text-muted)]">Erstellt am</span>
                <p className="font-medium">{formatDate(organization.created_at)}</p>
              </div>
              <div>
                <span className="text-sm text-[var(--text-muted)]">Mitglieder</span>
                <p className="font-medium">{members.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "members" && (
        <div className="space-y-4">
          {/* Invite Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity">
              <Plus size={18} />
              Einladen
            </button>
          </div>

          {/* Members List */}
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[var(--bg-tertiary)]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Mitglied</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Rolle</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Beigetreten</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-t border-[var(--border)] hover:bg-[var(--bg-hover)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-[var(--accent)]">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(member.role)}`}>
                        {getRoleIcon(member.role)}
                        {getRoleLabel(member.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === "active" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {member.status === "active" ? "Aktiv" : "Ausstehend"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                      {formatDate(member.joined_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
