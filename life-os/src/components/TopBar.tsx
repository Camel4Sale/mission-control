'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Command, Bell, Settings, User, Search, Cloud, CloudRain, CloudSun, Sun as SunIcon, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Theme = 'dark' | 'light';

interface TopBarProps {
  title: string;
  breadcrumbs?: { label: string; href: string }[];
}

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
}

export default function TopBar({ title, breadcrumbs = [] }: TopBarProps) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [time, setTime] = useState(new Date());
  const [searchOpen, setSearchOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather on mount
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://wttr.in/Karlsruhe?format=j1');
        const data = await res.json();
        if (data.current_condition?.[0]) {
          setWeather({
            temp: parseInt(data.current_condition[0].temp_C),
            condition: data.current_condition[0].weatherDesc[0].value,
            location: 'Karlsruhe'
          });
        }
      } catch (e) {
        // Weather unavailable
      }
    };
    fetchWeather();
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-quick-add'));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-14 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between px-4">
        {/* Left: Title + Breadcrumbs */}
        <div className="flex items-center gap-3">
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={12} />}
                  {i < breadcrumbs.length - 1 ? (
                    <Link href={crumb.href} className="hover:text-[var(--text-primary)] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[var(--text-primary)]">{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button 
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)] transition-all duration-200 border border-transparent hover:border-[var(--border-default)]"
          >
            <Search size={14} />
            <span className="min-w-[60px]">Search...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)]">⌘K</kbd>
          </button>

          {/* Weather Widget */}
          {weather && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-xs">
              {weather.condition.toLowerCase().includes('rain') ? (
                <CloudRain size={14} className="text-[var(--celaris)]" />
              ) : weather.condition.toLowerCase().includes('cloud') ? (
                <Cloud size={14} className="text-[var(--text-muted)]" />
              ) : (
                <SunIcon size={14} className="text-[var(--celaris)]" />
              )}
              <span className="text-[var(--text-secondary)] font-medium">{weather.temp}°</span>
              <span className="text-[var(--text-muted)]">{weather.location}</span>
            </div>
          )}

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
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-all duration-200 hover:scale-105"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-all duration-200 hover:scale-105 relative group">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full ring-2 ring-[var(--bg-secondary)]"></span>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-[var(--bg-tertiary)] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Notifications</span>
          </button>

          {/* User */}
          <button className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-all duration-200 hover:scale-[1.02]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--kit)] flex items-center justify-center ring-2 ring-[var(--bg-tertiary)]">
              <User size={14} className="text-white" />
            </div>
            <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">Profile</span>
          </button>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] z-50 animate-fade-in" onClick={() => setSearchOpen(false)}>
          <div 
            className="w-full max-w-lg bg-[var(--bg-secondary)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)] bg-[var(--bg-tertiary)]/50">
              <Search size={18} className="text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search pages, actions..."
                className="flex-1 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                autoFocus
              />
              <kbd className="text-[10px] px-2 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-mono">ESC</kbd>
            </div>
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-3 py-2">Quick Navigation</div>
              <div className="space-y-1">
                <div className="px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] text-sm cursor-pointer flex items-center gap-3 transition-colors group">
                  <span className="text-[var(--accent)] opacity-70 group-hover:opacity-100">📚</span>
                  <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Studium / Module</span>
                </div>
                <div className="px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] text-sm cursor-pointer flex items-center gap-3 transition-colors group">
                  <span className="text-[var(--accent)] opacity-70 group-hover:opacity-100">📝</span>
                  <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Studium / Klausuren</span>
                </div>
                <div className="px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] text-sm cursor-pointer flex items-center gap-3 transition-colors group">
                  <span className="text-[var(--accent)] opacity-70 group-hover:opacity-100">🎓</span>
                  <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Studium / Masterarbeit</span>
                </div>
                <div className="px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] text-sm cursor-pointer flex items-center gap-3 transition-colors group">
                  <span className="text-[var(--accent)] opacity-70 group-hover:opacity-100">🏢</span>
                  <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Unternehmen / Pathium</span>
                </div>
                <div className="px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] text-sm cursor-pointer flex items-center gap-3 transition-colors group">
                  <span className="text-[var(--accent)] opacity-70 group-hover:opacity-100">🚀</span>
                  <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Command Center</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowShortcuts(false)}>
          <div className="w-full max-w-sm bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-5 animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)]">
                <span className="text-sm text-[var(--text-secondary)]">Quick Search</span>
                <kbd className="px-2.5 py-1 rounded bg-[var(--bg-tertiary)] text-xs font-mono text-[var(--text-muted)] border border-[var(--border-subtle)]">⌘ K</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)]">
                <span className="text-sm text-[var(--text-secondary)]">Toggle Theme</span>
                <kbd className="px-2.5 py-1 rounded bg-[var(--bg-tertiary)] text-xs font-mono text-[var(--text-muted)] border border-[var(--border-subtle)]">⌘ ⌥ T</kbd>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-[var(--text-secondary)]">Shortcuts</span>
                <kbd className="px-2.5 py-1 rounded bg-[var(--bg-tertiary)] text-xs font-mono text-[var(--text-muted)] border border-[var(--border-subtle)]">⌘ /</kbd>
              </div>
            </div>
            <button 
              onClick={() => setShowShortcuts(false)}
              className="mt-5 w-full py-2.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-sm font-medium text-[var(--text-secondary)] transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
