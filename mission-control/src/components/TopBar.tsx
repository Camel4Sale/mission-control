'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Command, Bell, Settings, User } from 'lucide-react';

type Theme = 'dark' | 'light';

export default function TopBar() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      // Quick Add with N
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        // Dispatch custom event for QuickAdd
        window.dispatchEvent(new CustomEvent('open-quick-add'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-12 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between px-4">
        {/* Left: Search / Command */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowShortcuts(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <Command size={14} />
            <span>Search...</span>
            <kbd className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-secondary)]">⌘K</kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* System Status */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--bg-tertiary)] text-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
            <span className="text-[var(--text-muted)]">Online</span>
          </div>

          {/* Clock */}
          <div className="text-xs text-[var(--text-muted)] px-2">
            {time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors relative">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent)] rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors">
            <Settings size={16} />
          </button>

          {/* User */}
          <button className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
            <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <span className="text-sm">Molty</span>
          </button>
        </div>
      </header>

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShortcuts(false)}>
          <div className="w-full max-w-md bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-medium mb-3">Keyboard Shortcuts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Command Palette</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">⌘ K</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Go to Tasks</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">G T</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Go to Calendar</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">G C</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Go to Projects</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">G P</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Go to Memory</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">G M</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Toggle Theme</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">⌘ ⌥ T</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">New Task</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">N</kbd>
              </div>
            </div>
            <button 
              onClick={() => setShowShortcuts(false)}
              className="mt-4 w-full py-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
