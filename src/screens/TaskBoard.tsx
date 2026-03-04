'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types';
import { Plus, GripVertical, MoreHorizontal, Calendar, Flag, X, Save, Trash2, Filter, Search } from 'lucide-react';
import { loadFromStorage, saveToStorage, defaultTasks } from '@/lib/storage';

const STORAGE_KEY = 'mc_tasks';

const columns = [
  { id: 'backlog', label: 'Backlog', color: '#6e6e73' },
  { id: 'todo', label: 'To Do', color: '#fbbf24' },
  { id: 'in-progress', label: 'In Progress', color: '#5e6ad2' },
  { id: 'done', label: 'Done', color: '#34d399' },
] as const;

const priorities = [
  { id: 'high', label: 'High', color: '#f87171' },
  { id: 'medium', label: 'Medium', color: '#fbbf24' },
  { id: 'low', label: 'Low', color: '#34d399' },
] as const;

const defaultTags = ['frontend', 'backend', 'design', 'bug', 'feature', 'docs', 'security', 'performance'];

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (id: string) => void;
}

function TaskModal({ task, isOpen, onClose, onSave, onDelete }: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({ ...task });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'backlog',
        tags: [],
        deadline: '',
        assignee: '',
      });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];
    const newTask: Task = {
      id: task?.id || Date.now().toString(),
      title: formData.title || 'Untitled',
      description: formData.description,
      priority: formData.priority || 'medium',
      status: formData.status || 'backlog',
      tags: formData.tags || [],
      deadline: formData.deadline,
      assignee: formData.assignee,
      createdAt: task?.createdAt || now,
      updatedAt: now,
    };
    onSave(newTask);
    onClose();
  };

  const addTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold">{task ? 'Task bearbeiten' : 'Neue Aufgabe'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--bg-hover)] rounded">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Titel *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="linear-input w-full"
              placeholder="Aufgabentitel..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Beschreibung</label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="linear-input w-full h-24 resize-none"
              placeholder="Beschreibung..."
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status || 'backlog'}
                onChange={e => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                className="linear-input w-full"
              >
                {columns.map(col => (
                  <option key={col.id} value={col.id}>{col.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priorität</label>
              <select
                value={formData.priority || 'medium'}
                onChange={e => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="linear-input w-full"
              >
                {priorities.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Deadline & Assignee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                value={formData.deadline || ''}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="linear-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Assignee</label>
              <input
                type="text"
                value={formData.assignee || ''}
                onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                className="linear-input w-full"
                placeholder="Assignee..."
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--accent-muted)] text-[var(--accent)] rounded text-xs">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="linear-input flex-1"
                placeholder="Tag hinzufügen..."
                list="default-tags"
              />
              <datalist id="default-tags">
                {defaultTags.map(tag => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
              <button type="button" onClick={addTag} className="linear-btn-secondary px-3">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            {task && onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(task.id); onClose(); }}
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

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterTag, setFilterTag] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  // Load tasks from localStorage
  useEffect(() => {
    const stored = loadFromStorage<Task[]>(STORAGE_KEY, defaultTasks);
    setTasks(stored);
  }, []);

  // Save tasks to localStorage
  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    saveToStorage(STORAGE_KEY, newTasks);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(t => {
      if (t.status !== status) return false;
      if (filterTag && !t.tags?.includes(filterTag)) return false;
      if (filterPriority && t.priority !== filterPriority) return false;
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task['status']) => {
    if (!draggedTask) return;
    const newTasks = tasks.map(t => 
      t.id === draggedTask ? { ...t, status, updatedAt: new Date().toISOString().split('T')[0] } : t
    );
    saveTasks(newTasks);
    showToast(`Task moved to ${status.replace('-', ' ')}`);
    setDraggedTask(null);
  };

  const handleSaveTask = (task: Task) => {
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    let newTasks: Task[];
    
    if (existingIndex >= 0) {
      newTasks = tasks.map(t => t.id === task.id ? task : t);
      showToast('Task aktualisiert');
    } else {
      newTasks = [...tasks, task];
      showToast('Task erstellt');
    }
    
    saveTasks(newTasks);
  };

  const handleDeleteTask = (id: string) => {
    const newTasks = tasks.filter(t => t.id !== id);
    saveTasks(newTasks);
    showToast('Task gelöscht', 'error');
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-[#f87171]';
      case 'medium': return 'text-[#fbbf24]';
      case 'low': return 'text-[#34d399]';
    }
  };

  const getPriorityBg = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-[#f87171]/10 border-[#f87171]/30';
      case 'medium': return 'bg-[#fbbf24]/10 border-[#fbbf24]/30';
      case 'low': return 'bg-[#34d399]/10 border-[#34d399]/30';
    }
  };

  // Get all unique tags
  const allTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])));

  return (
    <div className="h-full flex flex-col">
      {/* Toast Notification */}
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
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="text-sm text-[var(--text-secondary)]">Ultimate Kanban Board</p>
        </div>
        <button 
          onClick={() => { setEditingTask(null); setModalOpen(true); }}
          className="linear-btn flex items-center gap-2"
        >
          <Plus size={16} />
          Neue Aufgabe
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Search size={16} className="text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Suchen..."
            className="bg-transparent outline-none text-sm w-40"
          />
        </div>
        
        <div className="h-6 w-px bg-[var(--border)]" />
        
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--text-muted)]" />
          <select
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            className="bg-transparent outline-none text-sm"
          >
            <option value="">Alle Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="bg-transparent outline-none text-sm"
        >
          <option value="">Alle Prioritäten</option>
          {priorities.map(p => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
        
        {(filterTag || filterPriority || searchQuery) && (
          <button 
            onClick={() => { setFilterTag(''); setFilterPriority(''); setSearchQuery(''); }}
            className="text-xs text-[var(--accent)] hover:underline ml-auto"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="kanban-column flex flex-col flex-shrink-0"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div 
              className="kanban-column-header flex items-center justify-between"
              style={{ borderLeftColor: column.color, borderLeftWidth: 3 }}
            >
              <span className="flex items-center gap-2">
                {column.label}
                <span className="text-[var(--text-muted)] text-xs">
                  {getTasksByStatus(column.id).length}
                </span>
              </span>
            </div>
            
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {getTasksByStatus(column.id).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onClick={() => { setEditingTask(task); setModalOpen(true); }}
                  className={`card card-hover cursor-grab active:cursor-grabbing border-l-4 ${getPriorityBg(task.priority)}`}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical size={14} className="text-[var(--text-muted)] mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded">
                              {tag}
                            </span>
                          ))}
                          {task.tags.length > 3 && (
                            <span className="text-[10px] text-[var(--text-muted)]">+{task.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                            <Flag size={10} fill="currentColor" />
                            {task.priority}
                          </span>
                          {task.assignee && (
                            <span className="text-xs text-[var(--text-muted)]">
                              👤 {task.assignee}
                            </span>
                          )}
                        </div>
                        {task.deadline && (
                          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(task.deadline).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Drop zone indicator */}
              {draggedTask && (
                <div className="h-16 border-2 border-dashed border-[var(--accent)] rounded-lg flex items-center justify-center text-[var(--text-muted)] text-sm">
                  Hier ablegen
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      <TaskModal
        task={editingTask}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
