'use client';

import { Agent } from '@/types';
import { Users, MessageSquare, Lightbulb, Code, Zap, Target, Heart, Shield, ChevronRight } from 'lucide-react';

interface TeamScreenProps {
  agents: Agent[];
  missionStatement: string;
}

export default function TeamScreen({ agents, missionStatement }: TeamScreenProps) {
  const teamMembers = [
    {
      id: 'molty',
      name: 'Molty',
      emoji: '🧊',
      role: 'Hauptassistent',
      description: 'Projektmanagement, Kommunikation, Memory & proaktive Aufgaben',
      skills: ['Tasks', 'Memory', 'Calendar', 'Docs'],
      status: 'working'
    },
    {
      id: 'codex',
      name: 'Codex',
      emoji: '🤖',
      role: 'Coding Agent',
      description: 'Code schreiben, refactoren, Reviews & technische Implementierung',
      skills: ['Code', 'Debug', 'Refactor', 'Review'],
      status: 'idle'
    },
    {
      id: 'weather',
      name: 'Weather',
      emoji: '🌤️',
      role: 'Data Agent',
      description: 'Wetterdaten, Analysen & automatische Berichte',
      skills: ['API', 'Data', 'Reports'],
      status: 'waiting'
    }
  ];

  const principles = [
    { icon: <Zap size={18} />, title: 'Autonomie', desc: 'Selbstständiges Arbeiten ohne ständige Bestätigung' },
    { icon: <Shield size={18} />, title: 'Qualität', desc: 'Clean Code, sichere Systeme, durchdachte Lösungen' },
    { icon: <Heart size={18} />, title: 'Kontinuität', desc: 'Langzeitgedächtnis für nachhaltige Zusammenarbeit' },
    { icon: <Target size={18} />, title: 'Transparenz', desc: 'Klare Übersicht über alle Aktivitäten' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Team & Mission</h1>
        <p className="text-sm text-[var(--text-secondary)]">Unsere Vision und das Team</p>
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
            Agenten & Sub-Agents
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {teamMembers.map(member => (
              <div key={member.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-2xl">
                      {member.emoji}
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{member.role}</p>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${
                    member.status === 'working' ? 'bg-[var(--success)] animate-pulse' :
                    member.status === 'waiting' ? 'bg-[var(--warning)]' :
                    'bg-[var(--text-muted)]'
                  }`} />
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-3">{member.description}</p>
                <div className="flex flex-wrap gap-1">
                  {member.skills.map(skill => (
                    <span key={skill} className="text-xs px-2 py-0.5 bg-[var(--bg-tertiary)] rounded">
                      {skill}
                    </span>
                  ))}
                </div>
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
              <p className="text-2xl font-semibold text-[var(--accent)]">3</p>
              <p className="text-xs text-[var(--text-muted)]">Tage aktiv</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-semibold text-[var(--accent)]">7</p>
              <p className="text-xs text-[var(--text-muted)]">Tasks erstellt</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-semibold text-[var(--accent)]">2</p>
              <p className="text-xs text-[var(--text-muted)]">Cron Jobs</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-semibold text-[var(--accent)]">5</p>
              <p className="text-xs text-[var(--text-muted)]">Skills aktiv</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
