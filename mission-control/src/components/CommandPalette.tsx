'use client';

import { useState, useEffect, useCallback } from 'react';
import { Command, X, Calendar, FolderKanban, Brain, FileText, Users, Building2, ArrowRight, Search } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
  icon: React.ReactNode;
  category: string;
}

interface CommandPaletteProps {
  onNavigate: (page: string) => void;
}

export default function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    // Navigation
    { id: 'tasks', label: 'Tasks', shortcut: 'G T', action: () => onNavigate('/tasks'), icon: <FolderKanban size={16} />, category: 'Navigation' },
    { id: 'calendar', label: 'Calendar', shortcut: 'G C', action: () => onNavigate('/calendar'), icon: <Calendar size={16} />, category: 'Navigation' },
    { id: 'projects', label: 'Projects', shortcut: 'G P', action: () => onNavigate('/projects'), icon: <FolderKanban size={16} />, category: 'Navigation' },
    { id: 'memory', label: 'Memory', shortcut: 'G M', action: () => onNavigate('/memory'), icon: <Brain size={16} />, category: 'Navigation' },
    { id: 'docs', label: 'Docs', shortcut: 'G D', action: () => onNavigate('/docs'), icon: <FileText size={16} />, category: 'Navigation' },
    { id: 'team', label: 'Team', action: () => onNavigate('/team'), icon: <Users size={16} />, category: 'Navigation' },
    { id: 'office', label: 'Office', action: () => onNavigate('/office'), icon: <Building2 size={16} />, category: 'Navigation' },
    { id: 'molty', label: 'Molty AI Status', shortcut: 'G A', action: () => onNavigate('/molty'), icon: <Brain size={16} className="text-[#6366f1]" />, category: 'Navigation' },
    // Quick Actions
    { id: 'new-task', label: 'Neue Task erstellen', shortcut: 'N', action: () => onNavigate('/tasks'), icon: <FolderKanban size={16} />, category: 'Actions' },
    { id: 'refresh', label: 'Refresh Data', shortcut: 'R', action: () => window.location.reload(), icon: <Search size={16} />, category: 'Actions' },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Open with Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen(true);
    }
    
    if (!open) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          setOpen(false);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  }, [open, filteredCommands, selectedIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-[var(--accent)] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
    >
      <Command size={20} />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] z-50" onClick={() => setOpen(false)}>
      <div 
        className="w-full max-w-lg bg-[var(--bg-secondary)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search size={18} className="text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="text-xs px-2 py-1 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">ESC</kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-[300px] overflow-y-auto py-2">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category}>
              <div className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase">
                {category}
              </div>
              {cmds.map((cmd, idx) => {
                const globalIdx = filteredCommands.findIndex(c => c.id === cmd.id);
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      selectedIndex === globalIdx 
                        ? 'bg-[var(--accent-muted)] text-[var(--accent)]' 
                        : 'hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    {cmd.icon}
                    <span className="flex-1 text-left">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-[var(--text-muted)]">
              No commands found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[var(--border)] flex items-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)]">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)]">↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)]">G</kbd>
            + key = Go to
          </span>
        </div>
      </div>
    </div>
  );
}
