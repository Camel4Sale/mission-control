'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Command, Bell, Settings, User, Search, Wifi, WifiOff } from 'lucide-react';

type Theme = 'dark' | 'light';

export default function TopBar() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);

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

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-quick-add'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header 
        className="h-14 flex items-center justify-between px-5"
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {/* Left: Search */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowShortcuts(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm transition-all duration-200"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-body)',
              minWidth: '200px',
            }}
          >
            <Search size={14} />
            <span className="flex-1 text-left">Search...</span>
            <kbd 
              className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* System Status */}
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: isOnline ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: isOnline ? '#22c55e' : '#ef4444',
            }}
          >
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Clock */}
          <div 
            className="text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{ 
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-tertiary)',
            }}
          >
            {time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
            <span style={{ opacity: 0.5, marginLeft: '4px' }}>
              {time.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' })}
            </span>
          </div>

          {/* Divider */}
          <div 
            className="w-px h-5 mx-1"
            style={{ background: 'var(--border-subtle)' }}
          />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-200"
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
            }}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications */}
          <button 
            className="p-2 rounded-lg transition-all duration-200 relative"
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
            }}
          >
            <Bell size={16} />
            <span 
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#00d4ff' }}
            />
          </button>

          {/* Settings */}
          <button 
            className="p-2 rounded-lg transition-all duration-200"
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
            }}
          >
            <Settings size={16} />
          </button>

          {/* Divider */}
          <div 
            className="w-px h-5 mx-1"
            style={{ background: 'var(--border-subtle)' }}
          />

          {/* User */}
          <button 
            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
              }}
            >
              <User size={14} className="text-white" />
            </div>
            <span 
              className="text-sm font-medium"
              style={{ 
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Molty
            </span>
          </button>
        </div>
      </header>

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowShortcuts(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-5 animate-scale-in"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--accent-cyan-muted)',
                  color: '#00d4ff',
                }}
              >
                <Command size={16} />
              </div>
              <h3 
                className="font-bold text-lg"
                style={{ 
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                }}
              >
                Keyboard Shortcuts
              </h3>
            </div>
            
            <div className="space-y-2" style={{ fontFamily: 'var(--font-body)' }}>
              {[
                { label: 'Command Palette', key: '⌘ K' },
                { label: 'New Task', key: '⌘ N' },
                { label: 'Go to Tasks', key: 'G T' },
                { label: 'Go to Calendar', key: 'G C' },
                { label: 'Go to Projects', key: 'G P' },
                { label: 'Go to Memory', key: 'G M' },
                { label: 'Toggle Theme', key: '⌘ ⌥ T' },
              ].map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
                  style={{ 
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {item.label}
                  </span>
                  <kbd 
                    className="text-[11px] px-2 py-1 rounded-md font-medium"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setShowShortcuts(false)}
              className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
