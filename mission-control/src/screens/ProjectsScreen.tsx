'use client';

import React from 'react';
import { Project } from '@/types';
import { FolderKanban, Clock, CheckCircle2, Pause, TrendingUp, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectsScreenProps {
  projects: Project[];
}

export default function ProjectsScreen({ projects }: ProjectsScreenProps) {
  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active': return <TrendingUp size={16} className="text-[var(--success)]" />;
      case 'completed': return <CheckCircle2 size={16} className="text-[var(--accent)]" />;
      case 'paused': return <Pause size={16} className="text-[var(--warning)]" />;
      case 'planning': return <Clock size={16} className="text-[var(--text-muted)]" />;
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'completed': return 'badge-info';
      case 'paused': return 'badge-warning';
      case 'planning': return 'badge-danger';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'completed': return 'Abgeschlossen';
      case 'paused': return 'Pausiert';
      case 'planning': return 'Planung';
    }
  };

  // Group projects by status
  const activeProjects = projects.filter(p => p.status === 'active');
  const planningProjects = projects.filter(p => p.status === 'planning');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const pausedProjects = projects.filter(p => p.status === 'paused');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Projekte</h1>
          <p className="text-sm text-[var(--text-secondary)]">Übersicht aller aktiven Projekte</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--text-muted)]">Gesamt:</span>
            <span className="font-medium">{projects.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--success)]">●</span>
            <span>{activeProjects.length} aktiv</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
              <FolderKanban size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{projects.length}</p>
              <p className="text-xs text-[var(--text-secondary)]">Projekte</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(52,211,153,0.15)] flex items-center justify-center">
              <TrendingUp size={20} className="text-[var(--success)]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{activeProjects.length}</p>
              <p className="text-xs text-[var(--text-secondary)]">Aktiv</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(251,191,36,0.15)] flex items-center justify-center">
              <Clock size={20} className="text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{planningProjects.length}</p>
              <p className="text-xs text-[var(--text-secondary)]">Planung</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(94,106,210,0.15)] flex items-center justify-center">
              <CheckCircle2 size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{completedProjects.length}</p>
              <p className="text-xs text-[var(--text-secondary)]">Fertig</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6">
          {/* Active Projects */}
          {activeProjects.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
                Aktive Projekte
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {activeProjects.map(project => (
                  <ProjectCard key={project.id} project={project} getStatusIcon={getStatusIcon} getStatusBadge={getStatusBadge} getStatusLabel={getStatusLabel} />
                ))}
              </div>
            </section>
          )}

          {/* Planning Projects */}
          {planningProjects.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--text-muted)]"></span>
                In Planung
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {planningProjects.map(project => (
                  <ProjectCard key={project.id} project={project} getStatusIcon={getStatusIcon} getStatusBadge={getStatusBadge} getStatusLabel={getStatusLabel} />
                ))}
              </div>
            </section>
          )}

          {/* Completed Projects */}
          {completedProjects.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                Abgeschlossen
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {completedProjects.map(project => (
                  <ProjectCard key={project.id} project={project} getStatusIcon={getStatusIcon} getStatusBadge={getStatusBadge} getStatusLabel={getStatusLabel} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ 
  project, 
  getStatusIcon, 
  getStatusBadge, 
  getStatusLabel 
}: { 
  project: Project;
  getStatusIcon: (s: Project['status']) => React.ReactElement;
  getStatusBadge: (s: Project['status']) => string;
  getStatusLabel: (s: Project['status']) => string;
}) {
  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon(project.status)}
          <h3 className="font-medium">{project.name}</h3>
        </div>
        <button className="p-1 hover:bg-[var(--bg-hover)] rounded text-[var(--text-muted)]">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
        {project.description}
      </p>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-[var(--text-muted)]">Fortschritt</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`badge ${getStatusBadge(project.status)}`}>
          {getStatusLabel(project.status)}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          {project.tasks} Tasks
        </span>
      </div>
    </div>
  );
}
