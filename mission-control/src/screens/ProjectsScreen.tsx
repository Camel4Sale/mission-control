'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project, Milestone } from '@/types';
import { FolderKanban, Clock, CheckCircle2, Pause, TrendingUp, MoreHorizontal, Plus, X, Save, Trash2, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { loadFromStorage, saveToStorage, defaultProjects } from '@/lib/storage';

const STORAGE_KEY = 'mc_projects';

const projectStatuses = [
  { id: 'planning', label: 'Planung', color: '#6e6e73' },
  { id: 'active', label: 'Aktiv', color: '#34d399' },
  { id: 'paused', label: 'Pausiert', color: '#fbbf24' },
  { id: 'completed', label: 'Abgeschlossen', color: '#5e6ad2' },
] as const;

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  onDelete?: (id: string) => void;
}

function ProjectModal({ project, isOpen, onClose, onSave, onDelete }: ProjectModalProps) {
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [newMilestone, setNewMilestone] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({ ...project });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'planning',
        progress: 0,
        tasks: 0,
        milestones: [],
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];
    const newProject: Project = {
      id: project?.id || Date.now().toString(),
      name: formData.name || 'Untitled Project',
      description: formData.description || '',
      status: formData.status || 'planning',
      progress: formData.progress || 0,
      tasks: formData.tasks || 0,
      milestones: formData.milestones || [],
      updatedAt: now,
    };
    onSave(newProject);
    onClose();
  };

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    const milestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestone,
      completed: false,
      date: milestoneDate || format(new Date(), 'yyyy-MM-dd'),
    };
    setFormData({
      ...formData,
      milestones: [...(formData.milestones || []), milestone],
    });
    setNewMilestone('');
    setMilestoneDate('');
  };

  const toggleMilestone = (id: string) => {
    setFormData({
      ...formData,
      milestones: formData.milestones?.map(m => 
        m.id === id ? { ...m, completed: !m.completed } : m
      ),
    });
  };

  const removeMilestone = (id: string) => {
    setFormData({
      ...formData,
      milestones: formData.milestones?.filter(m => m.id !== id),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold">{project ? 'Projekt bearbeiten' : 'Neues Projekt'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--bg-hover)] rounded">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Projektname *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="linear-input w-full"
              placeholder="Projektname..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Beschreibung</label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="linear-input w-full h-24 resize-none"
              placeholder="Projektbeschreibung..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status || 'planning'}
                onChange={e => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                className="linear-input w-full"
              >
                {projectStatuses.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fortschritt %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress || 0}
                onChange={e => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                className="linear-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tasks</label>
              <input
                type="number"
                min="0"
                value={formData.tasks || 0}
                onChange={e => setFormData({ ...formData, tasks: parseInt(e.target.value) || 0 })}
                className="linear-input w-full"
              />
            </div>
          </div>

          {/* Milestones */}
          <div>
            <label className="block text-sm font-medium mb-2">Meilensteine</label>
            <div className="space-y-2 mb-3">
              {formData.milestones?.map(milestone => (
                <div key={milestone.id} className="flex items-center gap-2 p-2 bg-[var(--bg-tertiary)] rounded">
                  <button
                    type="button"
                    onClick={() => toggleMilestone(milestone.id)}
                    className={`w-5 h-5 rounded flex items-center justify-center ${
                      milestone.completed ? 'bg-[var(--success)] text-white' : 'border border-[var(--border)]'
                    }`}
                  >
                    {milestone.completed && <CheckCircle2 size={14} />}
                  </button>
                  <span className={`flex-1 text-sm ${milestone.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>
                    {milestone.title}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{format(parseISO(milestone.date), 'd.MM.yyyy')}</span>
                  <button type="button" onClick={() => removeMilestone(milestone.id)} className="text-[var(--text-muted)] hover:text-[var(--danger)]">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMilestone}
                onChange={e => setNewMilestone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                className="linear-input flex-1"
                placeholder="Neuer Meilenstein..."
              />
              <input
                type="date"
                value={milestoneDate}
                onChange={e => setMilestoneDate(e.target.value)}
                className="linear-input w-36"
              />
              <button type="button" onClick={addMilestone} className="linear-btn-secondary px-3">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            {project && onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(project.id); onClose(); }}
                className="text-[var(--danger)] hover:bg-[var(--danger)]/10 px-3 py-2 rounded flex items-center gap-2"
              >
                <Trash2 size={16} />
                Löschen
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

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  // Load projects from localStorage
  useEffect(() => {
    const stored = loadFromStorage<Project[]>(STORAGE_KEY, defaultProjects);
    setProjects(stored);
  }, []);

  // Save projects to localStorage
  const saveProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    saveToStorage(STORAGE_KEY, newProjects);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
    return projectStatuses.find(s => s.id === status)?.label || status;
  };

  const handleSaveProject = (project: Project) => {
    const existingIndex = projects.findIndex(p => p.id === project.id);
    let newProjects: Project[];
    
    if (existingIndex >= 0) {
      newProjects = projects.map(p => p.id === project.id ? project : p);
      showToast('Projekt aktualisiert');
    } else {
      newProjects = [...projects, project];
      showToast('Projekt erstellt');
    }
    
    saveProjects(newProjects);
  };

  const handleDeleteProject = (id: string) => {
    const newProjects = projects.filter(p => p.id !== id);
    saveProjects(newProjects);
    showToast('Projekt gelöscht', 'error');
  };

  const toggleExpanded = (id: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const activeProjects = projects.filter(p => p.status === 'active');
  const planningProjects = projects.filter(p => p.status === 'planning');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const pausedProjects = projects.filter(p => p.status === 'paused');

  return (
    <div className="h-full flex flex-col">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-slideUp ${
          toast.type === 'success' ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'
        } text-white`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Projekte</h1>
          <p className="text-sm text-[var(--text-secondary)]">Projekt-Management mit Meilensteinen</p>
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
          <button 
            onClick={() => { setEditingProject(null); setModalOpen(true); }}
            className="linear-btn flex items-center gap-2"
          >
            <Plus size={16} />
            Neues Projekt
          </button>
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
          {activeProjects.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
                Aktive Projekte
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {activeProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    isExpanded={expandedProjects.has(project.id)}
                    onToggle={() => toggleExpanded(project.id)}
                    onEdit={() => { setEditingProject(project); setModalOpen(true); }}
                    getStatusIcon={getStatusIcon}
                    getStatusBadge={getStatusBadge}
                    getStatusLabel={getStatusLabel}
                  />
                ))}
              </div>
            </section>
          )}

          {planningProjects.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--text-muted)]"></span>
                In Planung
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {planningProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project}
                    isExpanded={expandedProjects.has(project.id)}
                    onToggle={() => toggleExpanded(project.id)}
                    onEdit={() => { setEditingProject(project); setModalOpen(true); }}
                    getStatusIcon={getStatusIcon}
                    getStatusBadge={getStatusBadge}
                    getStatusLabel={getStatusLabel}
                  />
                ))}
              </div>
            </section>
          )}

          {pausedProjects.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--warning)]"></span>
                Pausiert
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {pausedProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project}
                    isExpanded={expandedProjects.has(project.id)}
                    onToggle={() => toggleExpanded(project.id)}
                    onEdit={() => { setEditingProject(project); setModalOpen(true); }}
                    getStatusIcon={getStatusIcon}
                    getStatusBadge={getStatusBadge}
                    getStatusLabel={getStatusLabel}
                  />
                ))}
              </div>
            </section>
          )}

          {completedProjects.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                Abgeschlossen
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {completedProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project}
                    isExpanded={expandedProjects.has(project.id)}
                    onToggle={() => toggleExpanded(project.id)}
                    onEdit={() => { setEditingProject(project); setModalOpen(true); }}
                    getStatusIcon={getStatusIcon}
                    getStatusBadge={getStatusBadge}
                    getStatusLabel={getStatusLabel}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={editingProject}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProject(null); }}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
      />
    </div>
  );
}

function ProjectCard({ 
  project, 
  isExpanded,
  onToggle,
  onEdit,
  getStatusIcon, 
  getStatusBadge, 
  getStatusLabel 
}: { 
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  getStatusIcon: (s: Project['status']) => React.ReactElement;
  getStatusBadge: (s: Project['status']) => string;
  getStatusLabel: (s: Project['status']) => string;
}) {
  const completedMilestones = project.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = project.milestones?.length || 0;

  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon(project.status)}
          <h3 className="font-medium">{project.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-1 hover:bg-[var(--bg-hover)] rounded text-[var(--text-muted)]">
            <MoreHorizontal size={16} />
          </button>
          {project.milestones && project.milestones.length > 0 && (
            <button onClick={onToggle} className="p-1 hover:bg-[var(--bg-hover)] rounded text-[var(--text-muted)]">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
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
        <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
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

      {/* Milestones (Expandable) */}
      {isExpanded && project.milestones && project.milestones.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Meilensteine</span>
            <span className="text-xs text-[var(--text-muted)]">
              {completedMilestones}/{totalMilestones}
            </span>
          </div>
          <div className="space-y-2">
            {project.milestones.map(milestone => (
              <div key={milestone.id} className="flex items-center gap-2 text-xs">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  milestone.completed ? 'bg-[var(--success)]' : 'border border-[var(--border)]'
                }`}>
                  {milestone.completed && <CheckCircle2 size={10} className="text-white" />}
                </div>
                <span className={milestone.completed ? 'text-[var(--text-muted)] line-through' : ''}>
                  {milestone.title}
                </span>
                <span className="text-[var(--text-muted)] ml-auto">
                  {format(parseISO(milestone.date), 'd.MM.yyyy')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
