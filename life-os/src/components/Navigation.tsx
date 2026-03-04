'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Command, GraduationCap, Building2, Sun, Home, 
  Briefcase, LayoutGrid, Settings, ChevronRight, Play, Pause, RotateCcw,
  GraduationCap as KITIcon,
  Code as PathiumIcon,
  Zap as CelarisIcon,
  Building as ElysiumIcon,
  Timer
} from 'lucide-react';

const navigation = [
  { name: 'Command Center', href: '/', icon: Command, shortcut: 'G H' },
  { 
    name: 'Studium (KIT)', 
    href: '/studium', 
    icon: GraduationCap,
    color: 'var(--kit)',
    items: [
      { name: 'Dashboard', href: '/studium' },
      { name: 'Study Hub', href: '/studium/study', shortcut: 'G S' },
      { name: 'Planer', href: '/studium/planer', shortcut: 'G L' },
      { name: 'Datenbank', href: '/studium/datenbank', shortcut: 'G D' },
      { name: 'Kalender', href: '/studium/kalender', shortcut: 'G K' },
      { name: 'Module', href: '/studium/module', shortcut: 'G M' },
      { name: 'Klausuren', href: '/studium/klausuren', shortcut: 'G K' },
      { name: 'Masterarbeit', href: '/studium/thesis', shortcut: 'G T' },
      { name: 'Noten', href: '/studium/noten', shortcut: 'G N' },
    ]
  },
  { 
    name: 'Unternehmen', 
    href: '/unternehmen', 
    icon: Building2,
    color: 'var(--pathium)',
    items: [
      { name: 'Übersicht', href: '/unternehmen' },
      { name: 'Pathium', href: '/unternehmen/pathium', shortcut: 'G P', icon: PathiumIcon, color: 'var(--pathium)' },
      { name: 'Celaris', href: '/unternehmen/celaris', shortcut: 'G C', icon: CelarisIcon, color: 'var(--celaris)' },
      { name: 'Elysium', href: '/unternehmen/elysium', shortcut: 'G E', icon: ElysiumIcon, color: 'var(--elysium)' },
    ]
  },
];

// Focus Timer Component
function FocusTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  const modes = {
    work: { label: 'Fokus', defaultTime: 25, color: '#6366f1' },
    break: { label: 'Pause', defaultTime: 5, color: '#22c55e' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
            // Auto-switch mode
            setMode(m => m === 'work' ? 'break' : 'work');
            setMinutes(modes[mode === 'work' ? 'break' : 'work'].defaultTime);
            setSeconds(0);
          } else {
            setMinutes(m => m - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(s => s - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, mode]);

  const reset = () => {
    setIsRunning(false);
    setMinutes(modes[mode].defaultTime);
    setSeconds(0);
  };

  const toggleMode = () => {
    setMode(m => m === 'work' ? 'break' : 'work');
    setMinutes(modes[mode === 'work' ? 'break' : 'work'].defaultTime);
    setSeconds(0);
    setIsRunning(false);
  };

  const formatTime = (m: number, s: number) => 
    `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
      >
        <Timer size={16} />
        <span>Focus Timer</span>
      </button>
    );
  }

  return (
    <div className="mx-3 mb-3 p-4 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[var(--border)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer size={16} style={{ color: modes[mode].color }} />
          <span className="text-sm font-medium">{modes[mode].label}</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          ✕
        </button>
      </div>
      
      <div className="text-center mb-4">
        <div 
          className="text-4xl font-bold font-mono"
          style={{ color: modes[mode].color }}
        >
          {formatTime(minutes, seconds)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: modes[mode].color, color: 'white' }}
        >
          {isRunning ? <Pause size={14} /> : <Play size={14} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          <RotateCcw size={14} />
        </button>
        <button
          onClick={toggleMode}
          className="px-3 py-2 rounded-lg text-xs font-medium bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          {mode === 'work' ? 'Break' : 'Work'}
        </button>
      </div>
    </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>('unternehmen');

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleExpanded = (name: string) => {
    setExpanded(expanded === name ? null : name);
  };

  return (
    <aside className="w-64 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
            <Command size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Life OS</h1>
            <p className="text-[10px] text-[var(--text-muted)]">Command Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.items ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <item.icon size={18} style={{ color: item.color }} />
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronRight 
                      size={14} 
                      className={`transition-transform ${expanded === item.name ? 'rotate-90' : ''}`}
                    />
                  </button>
                  
                  {expanded === item.name && (
                    <ul className="ml-9 mt-1 space-y-1">
                      {item.items?.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              pathname === subItem.href
                                ? 'bg-[#6366f1]/10 text-[#6366f1]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{subItem.name}</span>
                              {subItem.shortcut && (
                                <kbd className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                                  {subItem.shortcut}
                                </kbd>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive(item.href)
                      ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <item.icon size={18} style={{ color: item.color || '#6366f1' }} />
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Focus Timer */}
      <FocusTimer />

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border)]">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
          <Settings size={16} />
          <span>Einstellungen</span>
        </button>
      </div>
    </aside>
  );
}
