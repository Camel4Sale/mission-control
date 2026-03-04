'use client';

import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '@/types';
import { Users, MessageSquare, Lightbulb, Code, Zap, Target, Heart, Shield, ChevronRight, Plus, X, Save, Trash2, Mail, User } from 'lucide-react';
import { loadFromStorage, saveToStorage, defaultTeam } from '@/lib/storage';

const STORAGE_KEY = 'mc_team';

const roles = [
  { id: 'admin', label: 'Admin', description: 'Volle Zugriffsrechte' },
  { id: 'member', label: 'Member', description: 'Kann bearbeiten' },
  { id: 'viewer', label: 'Viewer', description: 'Nur Leserechte' },
] as const;

const statusColors = {
  working: 'bg-[var(--success)] animate-pulse',
  idle: 'bg-[var(--text-muted)]',
  waiting: 'bg-[var(--warning)]',
};

interface MemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: TeamMember) => void;
  onDelete?: (id: string) => void;
}

function MemberModal({ member, isOpen, onClose, onSave, onDelete }: MemberModalProps) {
  const [formData, setFormData] = useState<Partial<TeamMember>>({});

  useEffect(() => {
    if (member) {
      setFormData({ ...member });
    } else {
      setFormData({
        name: '',
        emoji: '👤',
        role: 'member',
        email: '',
        status: 'idle',
        currentTask: null,
      });
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: TeamMember = {
      id: member?.id || Date.now().toString(),
      name: formData.name || 'Unnamed',
      emoji: formData.emoji || '👤',
      role: formData.role || 'member',
      email: formData.email,
      status: formData.status || 'idle',
      currentTask: formData.currentTask,
    };
    onSave(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold">{member ? 'Mitglied bearbeiten' : 'Neues Teammitglied'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--bg-hover)] rounded">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-4xl">
                {formData.emoji}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="linear-input w-full"
                placeholder="Name..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Emoji</label>
            <input
              type="text"
              value={formData.emoji || ''}
              onChange={e => setFormData({ ...formData, emoji: e.target.value })}
              className="linear-input w-20"
              maxLength={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rolle</label>
              <select
                value={formData.role || 'member'}
                onChange={e => setFormData({ ...formData, role: e.target.value as TeamMember['role'] })}
                className="linear-input w-full"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status || 'idle'}
                onChange={e => setFormData({ ...formData, status: e.target.value as TeamMember['status'] })}
                className="linear-input w-full"
              >
                <option value="idle">Idle</option>
                <option value="working">Working</option>
                <option value="waiting">Waiting</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="linear-input w-full"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Aktuelle Aufgabe</label>
            <input
              type="text"
              value={formData.currentTask || ''}
              onChange={e => setFormData({ ...formData, currentTask: e.target.value })}
              className="linear-input w-full"
              placeholder="Woran wird gearbeitet?"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            {member && onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(member.id); onClose(); }}
                className="text-[var(--danger)] hover:bg-[var(--danger)]/10 px-3 py-2 rounded flex items-center gap-2"
              >
                <Trash2 size={16} />
                Entfernen
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button type="button" onClick={onClose} className="linear-btn-secondary">
                Abbrechen
              </button>
              <button type="submit" className="linear-btn flex items-center gap-2">
                <Save size={16} />
                Speichern
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamScreen() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const missionStatement = `
## Unser Mission Statement

**"Gemeinsam bauen wir die optimale digitale Infrastruktur für produktives Arbeiten und kontinuierliches Lernen."**

### Unsere Werte
- **Autonomie**: Molty arbeitet selbstständig und proaktiv
- **Qualität**: Clean Code, sichere Systeme, durchdachte Lösungen
- **Kontinuität**: Langzeitgedächtnis für nachhaltige Zusammenarbeit
- **Transparenz**: Klare Übersicht über alle Aktivitäten und Projekte
`;

  // Load members from localStorage
  useEffect(() => {
    const stored = loadFromStorage<TeamMember[]>(STORAGE_KEY, defaultTeam);
    setMembers(stored);
  }, []);

  // Save members to localStorage
  const saveMembers = useCallback((newMembers: TeamMember[]) => {
    setMembers(newMembers);
    saveToStorage(STORAGE_KEY, newMembers);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveMember = (member: TeamMember) => {
    const existingIndex = members.findIndex(m => m.id === member.id);
    let newMembers: TeamMember[];
    
    if (existingIndex >= 0) {
      newMembers = members.map(m => m.id === member.id ? member : m);
      showToast('Mitglied aktualisiert');
    } else {
      newMembers = [...members, member];
      showToast('Mitglied hinzugefügt');
    }
    
    saveMembers(newMembers);
  };

  const handleDeleteMember = (id: string) => {
    const newMembers = members.filter(m => m.id !== id);
    saveMembers(newMembers);
    showToast('Mitglied entfernt', 'error');
  };

  const principles = [
    { icon: <Zap size={18} />, title: 'Autonomie', desc: 'Selbstständiges Arbeiten ohne ständige Bestätigung' },
    { icon: <Shield size={18} />, title: 'Qualität', desc: 'Clean Code, sichere Systeme, durchdachte Lösungen' },
    { icon: <Heart size={18} />, title: 'Kontinuität', desc: 'Langzeitgedächtnis für nachhaltige Zusammenarbeit' },
    { icon: <Target size={18} />, title: 'Transparenz', desc: 'Klare Übersicht über alle Aktivitäten' },
  ];

  const roleLabels = {
    admin: { label: 'Admin', color: 'text-[#f87171]' },
    member: { label: 'Member', color: 'text-[#5e6ad2]' },
    viewer: { label: 'Viewer', color: 'text-[var(--text-muted)]' },
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-slideUp ${
          toast.type === 'success' ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'
        } text-white`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Team & Mission</h1>
          <p className="text-sm text-[var(--text-secondary)]">Team-Management mit Rollen</p>
        </div>
        <button 
          onClick={() => { setEditingMember(null); setModalOpen(true); }}
          className="linear-btn flex items-center gap-2"
        >
          <Plus size={16} />
          Mitglied hinzufügen
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Mission Statement */}
        <section className="mb-8">
          <div className="card bg-gradient-to-br from-[var(--accent-muted)] to-transparent border-[var(--accent)]">
            <div className="flex items-center gap-2 mb-4">
              <Target size={20} className="text-[var(--accent)]" />
              <h2 className="font-semibold">Unser Mission Statement</h2>
            </div>
            <div className="prose prose-invert max-w-none text-sm leading-relaxed">
              {missionStatement.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.replace('## ', '')}</h3>;
                }
                if (line.startsWith('### ')) {
                  return <h4 key={i} className="font-medium mt-3 mb-1 text-[var(--accent)]">{line.replace('### ', '')}</h4>;
                }
                if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
                  if (match) {
                    return <li key={i} className="ml-4"><strong>{match[1]}</strong>: {match[2]}</li>;
                  }
                }
                if (line.trim()) {
                  return <p key={i} className="mb-2">{line}</p>;
                }
                return null;
              })}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-4">Unsere Werte</h2>
          <div className="grid grid-cols-4 gap-4">
            {principles.map((p, i) => (
              <div key={i} className="card text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-3 text-[var(--accent)]">
                  {p.icon}
                </div>
                <h3 className="font-medium text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-[var(--text-muted)]">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Members */}
        <section>
          <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-4 flex items-center gap-2">
            <Users size={16} />
            Team Mitglieder ({members.length})
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {members.map(member => (
              <div 
                key={member.id} 
                className="card cursor-pointer hover:border-[var(--accent)] transition-colors"
                onClick={() => { setEditingMember(member); setModalOpen(true); }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-2xl">
                        {member.emoji}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-secondary)] ${statusColors[member.status]}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className={`text-xs ${roleLabels[member.role].color}`}>
                        {roleLabels[member.role].label}
                      </p>
                    </div>
                  </div>
                </div>
                
                {member.email && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-2">
                    <Mail size={12} />
                    {member.email}
                  </div>
                )}
                
                {member.currentTask && (
                  <div className="text-sm text-[var(--text-secondary)] mb-3">
                    <span className="text-[var(--accent)]">→</span> {member.currentTask}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Molty Stats */}
        <section className="mt-8">
          <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-4 flex items-center gap-2">
            <Lightbulb size={16} />
            Molty Statistiken
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="card text-center">
              <p className="text-2xl font-semibold text-[var(--accent)]">{members.length}</p>
              <p className="text-xs text-[var(--text-muted)]">Teammitglieder</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-semibold text-[var(--accent)]">
                {members.filter(m => m.status === 'working').length}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Aktiv</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-semibold text-[var(--accent)]">
                {members.filter(m => m.role === 'admin').length}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Admins</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-semibold text-[var(--accent)]">3</p>
              <p className="text-xs text-[var(--text-muted)]">Tage aktiv</p>
            </div>
          </div>
        </section>
      </div>

      {/* Member Modal */}
      <MemberModal
        member={editingMember}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingMember(null); }}
        onSave={handleSaveMember}
        onDelete={handleDeleteMember}
      />
    </div>
  );
}
