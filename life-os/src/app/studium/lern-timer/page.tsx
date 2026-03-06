'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Timer, Play, Pause, RotateCcw, Plus, Settings, BarChart3,
  Coffee, Brain, Target, TrendingUp, Calendar, Music, Volume2,
  CheckCircle, Award, Flame, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface FocusSession {
  id: string;
  date: string;
  duration: number; // minutes
  moduleId?: string;
  completed: boolean;
}

interface DailyGoal {
  targetMinutes: number;
  completedMinutes: number;
  streak: number;
}

const MODES = {
  focus: { label: 'Fokus', defaultTime: 25, color: '#8b5cf6', icon: Brain },
  shortBreak: { label: 'Kurze Pause', defaultTime: 5, color: '#22c55e', icon: Coffee },
  longBreak: { label: 'Lange Pause', defaultTime: 15, color: '#06b6d4', icon: Coffee },
};

export default function LernTimerPage() {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({ targetMinutes: 120, completedMinutes: 0, streak: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Audio ref for timer complete sound
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load data
  useEffect(() => {
    const savedSessions = localStorage.getItem('pomodoro-sessions');
    const savedGoal = localStorage.getItem('pomodoro-goal');
    const savedSettings = localStorage.getItem('pomodoro-settings');

    if (savedSessions) {
      const parsed: FocusSession[] = JSON.parse(savedSessions);
      setSessions(parsed);
      
      // Calculate today's progress
      const today = new Date().toISOString().split('T')[0];
      const todaySessions = parsed.filter(s => s.date === today && s.completed);
      const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
      
      if (savedGoal) {
        const goal: DailyGoal = JSON.parse(savedGoal);
        setDailyGoal({ ...goal, completedMinutes: todayMinutes });
      } else {
        setDailyGoal(prev => ({ ...prev, completedMinutes: todayMinutes }));
      }
    }

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAutoStartBreaks(settings.autoStartBreaks ?? false);
      setNotificationsEnabled(settings.notifications ?? true);
      setDailyGoal(prev => ({ ...prev, targetMinutes: settings.targetMinutes ?? 120 }));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save sessions
  const saveSession = (session: FocusSession) => {
    const updated = [...sessions, session];
    setSessions(updated);
    localStorage.setItem('pomodoro-sessions', JSON.stringify(updated));
    
    // Update daily goal
    if (session.completed && session.date === new Date().toISOString().split('T')[0]) {
      setDailyGoal(prev => {
        const updated = { ...prev, completedMinutes: prev.completedMinutes + session.duration };
        localStorage.setItem('pomodoro-goal', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete
            setIsRunning(false);
            handleTimerComplete();
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
  }, [isRunning, minutes, seconds]);

  const handleTimerComplete = () => {
    // Play sound
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    // Show notification
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer abgeschlossen!', {
        body: mode === 'focus' ? 'Zeit für eine Pause!' : 'Zurück an die Arbeit!',
        icon: '/favicon.ico',
      });
    }

    // Save session if focus mode
    if (mode === 'focus') {
      const session: FocusSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        duration: MODES.focus.defaultTime,
        completed: true,
      };
      saveSession(session);
      setCompletedPomodoros(p => p + 1);
    }

    // Auto-start next mode
    if (mode === 'focus') {
      if (completedPomodoros > 0 && (completedPomodoros + 1) % 4 === 0) {
        setMode('longBreak');
        setMinutes(MODES.longBreak.defaultTime);
      } else {
        setMode('shortBreak');
        setMinutes(MODES.shortBreak.defaultTime);
      }
      if (autoStartBreaks) setIsRunning(true);
    } else {
      setMode('focus');
      setMinutes(MODES.focus.defaultTime);
      if (autoStartBreaks) setIsRunning(true);
    }
    setSeconds(0);
  };

  const reset = () => {
    setIsRunning(false);
    setMinutes(MODES[mode].defaultTime);
    setSeconds(0);
  };

  const toggleMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setMinutes(MODES[newMode].defaultTime);
    setSeconds(0);
    setIsRunning(false);
  };

  const formatTime = (m: number, s: number) => 
    `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  // Calculate stats
  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const todaySessions = sessions.filter(s => s.date === today && s.completed);
    const weekSessions = sessions.filter(s => s.date >= weekAgo && s.completed);
    
    return {
      today: todaySessions.reduce((sum, s) => sum + s.duration, 0),
      week: weekSessions.reduce((sum, s) => sum + s.duration, 0),
      total: sessions.filter(s => s.completed).length,
      avgDaily: weekSessions.length > 0 ? weekSessions.reduce((sum, s) => sum + s.duration, 0) / 7 : 0,
    };
  };

  const stats = getStats();
  const goalProgress = (dailyGoal.completedMinutes / dailyGoal.targetMinutes) * 100;
  const ModeIcon = MODES[mode].icon;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Timer size={28} className="text-[#8b5cf6]" />
          <div>
            <h1 className="text-2xl font-semibold">Lern-Timer</h1>
            <p className="text-sm text-[var(--text-secondary)]">Pomodoro++ mit Stats & Goals</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)]"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="card p-4 space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Settings size={16} />
            Einstellungen
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Tägliches Ziel (Minuten)</label>
              <input
                type="number"
                value={dailyGoal.targetMinutes}
                onChange={(e) => {
                  const newTarget = Number(e.target.value);
                  setDailyGoal(prev => ({ ...prev, targetMinutes: newTarget }));
                  localStorage.setItem('pomodoro-goal', JSON.stringify({ ...dailyGoal, targetMinutes: newTarget }));
                }}
                className="input w-full"
              />
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoStartBreaks}
                  onChange={(e) => {
                    setAutoStartBreaks(e.target.checked);
                    localStorage.setItem('pomodoro-settings', JSON.stringify({ autoStartBreaks: e.target.checked, notifications: notificationsEnabled }));
                  }}
                  className="rounded"
                />
                Pausen automatisch starten
              </label>
              
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => {
                    setNotificationsEnabled(e.target.checked);
                    localStorage.setItem('pomodoro-settings', JSON.stringify({ autoStartBreaks, notifications: e.target.checked }));
                    if (e.target.checked && 'Notification' in window) {
                      Notification.requestPermission();
                    }
                  }}
                  className="rounded"
                />
                Benachrichtigungen
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Timer */}
      <div className="card p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          {Object.entries(MODES).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = mode === key;
            
            return (
              <button
                key={key}
                onClick={() => toggleMode(key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#8b5cf6] text-white' 
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div 
            className="text-8xl font-bold font-mono mb-2"
            style={{ color: MODES[mode].color }}
          >
            {formatTime(minutes, seconds)}
          </div>
          <p className="text-sm text-[var(--text-muted)]">{MODES[mode].label} Mode</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{ backgroundColor: MODES[mode].color, color: 'white' }}
          >
            {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          
          <button
            onClick={reset}
            className="w-14 h-14 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        {/* Pomodoro Counter */}
        {mode === 'focus' && (
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map(num => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full transition-colors ${
                  num <= (completedPomodoros % 4) || (completedPomodoros >= 4 && num <= 4)
                    ? 'bg-[#8b5cf6]'
                    : 'bg-[var(--bg-tertiary)]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Daily Goal Progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium flex items-center gap-2">
            <Target size={18} className="text-[#f59e0b]" />
            Tägliches Ziel
          </h2>
          <span className="text-sm font-medium">
            {dailyGoal.completedMinutes}/{dailyGoal.targetMinutes} min
          </span>
        </div>
        
        <div className="progress-bar h-3">
          <div 
            className="progress-bar-fill bg-gradient-to-r from-[#f59e0b] to-[#ef4444]" 
            style={{ width: `${Math.min(goalProgress, 100)}%` }} 
          />
        </div>
        
        {goalProgress >= 100 && (
          <div className="mt-3 p-3 rounded-lg bg-[rgba(34,197,94,0.1)] text-center">
            <p className="text-sm font-medium text-[#22c55e]">🎉 Ziel erreicht! Weiter so!</p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center">
              <Clock size={20} className="text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.today}</p>
              <p className="text-xs text-[var(--text-muted)]">Minuten heute</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.15)] flex items-center justify-center">
              <Flame size={20} className="text-[#22c55e]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dailyGoal.streak}</p>
              <p className="text-xs text-[var(--text-muted)]">Tage Serie</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
              <Award size={20} className="text-[#06b6d4]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-[var(--text-muted)]">Sessions gesamt</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.15)] flex items-center justify-center">
              <TrendingUp size={20} className="text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round(stats.avgDaily)}</p>
              <p className="text-xs text-[var(--text-muted)]">Ø Min/Tag</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Overview */}
      <WeeklyChart sessions={sessions} />

      {/* Spotify Integration Placeholder */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium flex items-center gap-2">
            <Music size={18} className="text-[#1DB954]" />
            Lernplaylists
          </h2>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-[#1DB954] text-white font-medium flex items-center gap-1">
            <Volume2 size={14} />
            Verbinden
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {['Deep Focus', 'Lo-Fi Beats', 'Classical Study'].map(playlist => (
            <div
              key={playlist}
              className="p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1DB954] to-[#1ed760] mx-auto mb-2 flex items-center justify-center">
                <Music size={20} className="text-white" />
              </div>
              <p className="text-xs font-medium">{playlist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src="/timer-complete.mp3" preload="auto" />
    </div>
  );
}

// Weekly Chart Component
function WeeklyChart({ sessions }: { sessions: FocusSession[] }) {
  const getWeeklyData = () => {
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const today = new Date();
    const data: { day: string; minutes: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const daySessions = sessions.filter(s => s.date === dateStr && s.completed);
      const minutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
      
      data.push({
        day: days[date.getDay()],
        minutes,
      });
    }
    
    return data;
  };

  const data = getWeeklyData();
  const maxMinutes = Math.max(...data.map(d => d.minutes), 60);

  return (
    <div className="card p-5">
      <h2 className="font-medium mb-4 flex items-center gap-2">
        <BarChart3 size={18} className="text-[#8b5cf6]" />
        Wochenübersicht
      </h2>
      
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map(({ day, minutes }) => {
          const height = (minutes / maxMinutes) * 100;
          const isToday = day === ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][new Date().getDay()];
          
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative flex items-end">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isToday ? 'bg-[#8b5cf6]' : 'bg-[#8b5cf6]/50'
                  }`}
                  style={{ height: `${Math.max(height, 4)}px`, minHeight: minutes > 0 ? '8px' : '4px' }}
                />
              </div>
              <span className={`text-[10px] ${isToday ? 'font-bold text-[#8b5cf6]' : 'text-[var(--text-muted)]'}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
