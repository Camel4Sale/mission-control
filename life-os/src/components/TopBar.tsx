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
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <Search size={14} />
            <span>Search...</span>
            <kbd className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-secondary)]">⌘K</kbd>
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

          {/* User */}
          <button className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
            <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
          </button>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] z-50" onClick={() => setSearchOpen(false)}>
          <div 
            className="w-full max-w-lg bg-[var(--bg-secondary)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <Search size={18} className="text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search pages, actions..."
                className="flex-1 bg-transparent outline-none text-sm"
                autoFocus
              />
              <kbd className="text-xs px-2 py-1 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">ESC</kbd>
            </div>
            <div className="p-4">
              <div className="text-xs text-[var(--text-muted)] mb-2">QUICK NAVIGATION</div>
              <div className="space-y-1">
                <div className="px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] text-sm cursor-pointer flex items-center gap-3">
                  <span className="text-[var(--accent)]">📚</span>
                  <span>Studium / Module</span>
                </div>
                <div className="px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] text-sm cursor-pointer flex items-center gap-3">
                  <span className="text-[var(--accent)]">📝</span>
                  <span>Studium / Klausuren</span>
                </div>
                <div className="px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] text-sm cursor-pointer flex items-center gap-3">
                  <span className="text-[var(--accent)]">🎓</span>
                  <span>Studium / Masterarbeit</span>
                </div>
                <div className="px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] text-sm cursor-pointer flex items-center gap-3">
                  <span className="text-[var(--accent)]">🏢</span>
                  <span>Unternehmen / Pathium</span>
                </div>
                <div className="px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] text-sm cursor-pointer flex items-center gap-3">
                  <span className="text-[var(--accent)]">🚀</span>
                  <span>Command Center</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShortcuts(false)}>
          <div className="w-full max-w-md bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-medium mb-3">Keyboard Shortcuts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Quick Search</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">⌘ K</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Toggle Theme</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">⌘ ⌥ T</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Shortcuts</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">⌘ /</kbd>
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
