'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, X, BookOpen, FileText, Calendar, Brain, GraduationCap, Building2 } from 'lucide-react';

type QuickAddType = 'module' | 'klausur' | 'note' | 'task' | 'company';

interface QuickAddProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAdd({ isOpen, onClose }: QuickAddProps) {
  const [type, setType] = useState<QuickAddType>('module');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create:', { type, title, description });
    setTitle('');
    setDescription('');
    onClose();
  };

  const types = [
    { id: 'module', label: 'Modul', icon: GraduationCap, color: '#6366f1' },
    { id: 'klausur', label: 'Klausur', icon: BookOpen, color: '#f59e0b' },
    { id: 'note', label: 'Note', icon: FileText, color: '#8b5cf6' },
    { id: 'task', label: 'Task', icon: Brain, color: '#22c55e' },
    { id: 'company', label: 'Company', icon: Building2, color: '#06b6d4' },
  ] as const;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] z-50" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-[var(--bg-secondary)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Type Selector */}
        <div className="flex border-b border-[var(--border)] overflow-x-auto">
          {types.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors min-w-fit ${
                  type === t.id 
                    ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-b-2' 
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                }`}
                style={{ borderBottomColor: type === t.id ? t.color : 'transparent' }}
              >
                <Icon size={16} style={{ color: type === t.id ? t.color : 'currentColor' }} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <input
            ref={inputRef}
            type="text"
            placeholder={type === 'module' ? 'Modulname...' : type === 'klausur' ? 'Klausur...' : type === 'company' ? 'Company Name...' : 'Titel...'}
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-transparent outline-none text-lg mb-3"
            autoFocus
          />
          <textarea
            placeholder="Beschreibung (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-[var(--bg-tertiary)] rounded-lg p-3 text-sm outline-none resize-none h-24"
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)]">↵</kbd>
              speichern
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)]">esc</kbd>
              schließen
            </div>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
