'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  GraduationCap, Timer, Brain, FileText, BarChart3,
  Play, Pause, RotateCcw, Plus, X, ChevronLeft, ChevronRight,
  Check, Minus, BookOpen, Calendar, Target, TrendingUp
} from 'lucide-react';

// Types
interface Flashcard {
  id: string;
  front: string;
  back: string;
  nextReview: number;
  interval: number;
  easeFactor: number;
  reviewCount: number;
}

interface StudySession {
  id: string;
  moduleId: string;
  minutes: number;
  date: string;
}

interface QuickNote {
  id: string;
  content: string;
  updatedAt: number;
}

// Pomodoro Timer Component
function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessions, setSessions] = useState({ today: 0, week: 0, month: 0 });

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem('study-sessions');
    if (saved) {
      const allSessions: StudySession[] = JSON.parse(saved);
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      setSessions({
        today: allSessions.filter(s => s.date === today).length,
        week: allSessions.filter(s => s.date >= weekAgo).length,
        month: allSessions.filter(s => s.date >= monthAgo).length,
      });
    }
  }, []);

  const modes = {
    work: { label: 'Fokus', defaultTime: 25, color: '#8b5cf6' },
    break: { label: 'Pause', defaultTime: 5, color: '#22c55e' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
            // Save session if work mode completed
            if (mode === 'work') {
              const newSession: StudySession = {
                id: Date.now().toString(),
                moduleId: 'general',
                minutes: 25,
                date: new Date().toISOString().split('T')[0],
              };
              const saved = localStorage.getItem('study-sessions');
              const sessions = saved ? JSON.parse(saved) : [];
              sessions.push(newSession);
              localStorage.setItem('study-sessions', JSON.stringify(sessions));
              
              setSessions(s => ({
                ...s,
                today: s.today + 1,
                week: s.week + 1,
                month: s.month + 1,
              }));
            }
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

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Timer size={18} className="text-[#8b5cf6]" />
        <h3 className="font-semibold">Focus Timer</h3>
      </div>

      <div className="text-center py-2">
        <div 
          className="text-5xl font-bold font-mono"
          style={{ color: modes[mode].color }}
        >
          {formatTime(minutes, seconds)}
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-1">{modes[mode].label} Mode</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors"
          style={{ backgroundColor: modes[mode].color, color: 'white' }}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="p-2.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={toggleMode}
          className="px-3 py-2.5 rounded-lg text-sm font-medium bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          {mode === 'work' ? 'Break' : 'Work'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)]">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#8b5cf6]">{sessions.today}</p>
          <p className="text-xs text-[var(--text-muted)]">Heute</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#06b6d4]">{sessions.week}</p>
          <p className="text-xs text-[var(--text-muted)]">Woche</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#22c55e]">{sessions.month}</p>
          <p className="text-xs text-[var(--text-muted)]">Monat</p>
        </div>
      </div>
    </div>
  );
}

// Spaced Repetition Component
function SpacedRepetition() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Load cards
  useEffect(() => {
    const saved = localStorage.getItem('study-flashcards');
    if (saved) {
      setCards(JSON.parse(saved));
    }
  }, []);

  // Save cards
  const saveCards = (newCards: Flashcard[]) => {
    setCards(newCards);
    localStorage.setItem('study-flashcards', JSON.stringify(newCards));
  };

  // Get due cards
  const dueCards = cards.filter(c => c.nextReview <= Date.now());
  const newCards = cards.filter(c => c.reviewCount === 0);

  const addCard = () => {
    if (!newFront.trim() || !newBack.trim()) return;
    
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: newFront,
      back: newBack,
      nextReview: Date.now(),
      interval: 0,
      easeFactor: 2.5,
      reviewCount: 0,
    };
    
    saveCards([...cards, newCard]);
    setNewFront('');
    setNewBack('');
    setShowAddModal(false);
  };

  const startReview = () => {
    if (dueCards.length > 0) {
      setCurrentCard(dueCards[0]);
      setShowAnswer(false);
    } else if (newCards.length > 0) {
      setCurrentCard(newCards[0]);
      setShowAnswer(false);
    }
  };

  const rateCard = (rating: number) => {
    if (!currentCard) return;

    // SM-2 algorithm simplified
    let { interval, easeFactor } = currentCard;
    
    if (rating < 3) {
      interval = 0; // Again
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else {
      if (interval === 0) interval = 1;
      else if (interval === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      
      easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    }

    const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;
    
    const updatedCard = {
      ...currentCard,
      interval,
      easeFactor,
      nextReview,
      reviewCount: currentCard.reviewCount + 1,
    };

    const newCards = cards.map(c => c.id === currentCard.id ? updatedCard : c);
    saveCards(newCards);

    // Next card
    const remainingDue = newCards.filter(c => c.nextReview <= Date.now() && c.id !== currentCard.id);
    const remainingNew = newCards.filter(c => c.reviewCount === 0 && c.id !== currentCard.id);
    
    if (remainingDue.length > 0) {
      setCurrentCard(remainingDue[0]);
      setShowAnswer(false);
    } else if (remainingNew.length > 0) {
      setCurrentCard(remainingNew[0]);
      setShowAnswer(false);
    } else {
      setCurrentCard(null);
    }
  };

  const ratingLabels = [
    { label: 'Again', color: '#ef4444' },
    { label: 'Hard', color: '#f59e0b' },
    { label: 'Good', color: '#22c55e' },
    { label: 'Easy', color: '#06b6d4' },
  ];

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-[#8b5cf6]" />
          <h3 className="font-semibold">Spaced Repetition</h3>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)]"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex-1 p-3 rounded-lg bg-[rgba(139,92,246,0.1)] text-center">
          <p className="text-xl font-bold text-[#8b5cf6]">{cards.length}</p>
          <p className="text-xs text-[var(--text-muted)]">Gesamt</p>
        </div>
        <div className="flex-1 p-3 rounded-lg bg-[rgba(245,158,11,0.1)] text-center">
          <p className="text-xl font-bold text-[#f59e0b]">{dueCards.length}</p>
          <p className="text-xs text-[var(--text-muted)]">Fällig</p>
        </div>
        <div className="flex-1 p-3 rounded-lg bg-[rgba(6,182,212,0.1)] text-center">
          <p className="text-xl font-bold text-[#06b6d4]">{newCards.length}</p>
          <p className="text-xs text-[var(--text-muted)]">Neu</p>
        </div>
      </div>

      {/* Review Mode */}
      {currentCard ? (
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] space-y-4">
          <p className="text-lg font-medium text-center">{currentCard.front}</p>
          
          {showAnswer && (
            <>
              <hr className="border-[var(--border)]" />
              <p className="text-center text-[var(--text-secondary)]">{currentCard.back}</p>
            </>
          )}
          
          <div className="flex gap-2">
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-2 rounded-lg bg-[#8b5cf6] text-white font-medium"
              >
                Show Answer
              </button>
            ) : (
              <>
                {ratingLabels.map((r, i) => (
                  <button
                    key={r.label}
                    onClick={() => rateCard(i + 1)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium text-white"
                    style={{ backgroundColor: r.color }}
                  >
                    {r.label}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={startReview}
          disabled={dueCards.length === 0 && newCards.length === 0}
          className="w-full py-3 rounded-lg font-medium bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {dueCards.length > 0 || newCards.length > 0 
            ? `Lerne ${dueCards.length + newCards.length} Karten` 
            : 'Alles erledigt! 🎉'}
        </button>
      )}

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-5 w-full max-w-md mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Neue Karteikarte</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-[var(--bg-hover)] rounded">
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Vorderseite (Frage)</label>
                <textarea
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  className="input w-full h-20 resize-none"
                  placeholder="Was ist die Hauptstadt von Deutschland?"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Rückseite (Antwort)</label>
                <textarea
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  className="input w-full h-20 resize-none"
                  placeholder="Berlin"
                />
              </div>
            </div>
            
            <button
              onClick={addCard}
              disabled={!newFront.trim() || !newBack.trim()}
              className="w-full py-2.5 rounded-lg bg-[#8b5cf6] text-white font-medium disabled:opacity-50"
            >
              Karte hinzufügen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick Notes Component
function QuickNotes() {
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<QuickNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  // Load notes
  useEffect(() => {
    const saved = localStorage.getItem('study-notes');
    if (saved) {
      const notes = JSON.parse(saved);
      setSavedNotes(notes);
      if (notes.length > 0) {
        setSelectedNote(notes[0].id);
        setNote(notes[0].content);
      }
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (selectedNote) {
      const timer = setTimeout(() => {
        const updated = savedNotes.map(n => 
          n.id === selectedNote 
            ? { ...n, content: note, updatedAt: Date.now() }
            : n
        );
        setSavedNotes(updated);
        localStorage.setItem('study-notes', JSON.stringify(updated));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [note, selectedNote]);

  const createNote = () => {
    const newNote: QuickNote = {
      id: Date.now().toString(),
      content: '',
      updatedAt: Date.now(),
    };
    const updated = [newNote, ...savedNotes];
    setSavedNotes(updated);
    setSelectedNote(newNote.id);
    setNote('');
    localStorage.setItem('study-notes', JSON.stringify(updated));
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedNotes.filter(n => n.id !== id);
    setSavedNotes(updated);
    localStorage.setItem('study-notes', JSON.stringify(updated));
    if (selectedNote === id) {
      if (updated.length > 0) {
        setSelectedNote(updated[0].id);
        setNote(updated[0].content);
      } else {
        setSelectedNote(null);
        setNote('');
      }
    }
  };

  return (
    <div className="card p-5 space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-[#8b5cf6]" />
          <h3 className="font-semibold">Quick Notes</h3>
        </div>
        <button
          onClick={createNote}
          className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)]"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex gap-3 h-[280px]">
        {/* Notes List */}
        <div className="w-32 space-y-1 overflow-y-auto">
          {savedNotes.map(n => (
            <button
              key={n.id}
              onClick={() => { setSelectedNote(n.id); setNote(n.content); }}
              className={`w-full text-left p-2 rounded-lg text-xs truncate transition-colors ${
                selectedNote === n.id 
                  ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]' 
                  : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'
              }`}
            >
              {n.content.slice(0, 20) || 'Neue Notiz'}
              <button
                onClick={(e) => deleteNote(n.id, e)}
                className="ml-1 opacity-0 group-hover:opacity-100"
              >
                <X size={10} />
              </button>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Hier Notizen schreiben... (Markdown wird unterstützt)"
            className="input w-full h-full resize-none text-sm"
          />
        </div>
      </div>

      {savedNotes.length === 0 && (
        <p className="text-xs text-[var(--text-muted)] text-center">
          Klicke + um eine Notiz zu erstellen
        </p>
      )}
    </div>
  );
}

// Study Tracker Component
function StudyTracker() {
  const [modules, setModules] = useState<{ id: string; name: string; category: string }[]>([]);
  const [studyTime, setStudyTime] = useState<Record<string, number>>({});
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [tracking, setTracking] = useState(false);
  const [trackTime, setTrackTime] = useState(0);

  // Load modules from planer
  useEffect(() => {
    const saved = localStorage.getItem('kit-modul-planer');
    if (saved) {
      const planModules = JSON.parse(saved);
      setModules(planModules);
      if (planModules.length > 0) {
        setSelectedModule(planModules[0].id);
      }
    }

    const timeData = localStorage.getItem('study-time-by-module');
    if (timeData) {
      setStudyTime(JSON.parse(timeData));
    }
  }, []);

  // Track time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (tracking && selectedModule) {
      interval = setInterval(() => {
        setTrackTime(t => t + 1);
      }, 60000); // Every minute
    }
    return () => clearInterval(interval);
  }, [tracking, selectedModule]);

  const saveTime = () => {
    if (trackTime > 0 && selectedModule) {
      const updated = {
        ...studyTime,
        [selectedModule]: (studyTime[selectedModule] || 0) + trackTime,
      };
      setStudyTime(updated);
      localStorage.setItem('study-time-by-module', JSON.stringify(updated));
      setTrackTime(0);
    }
  };

  const startTracking = () => {
    if (!selectedModule) return;
    setTracking(true);
  };

  const stopTracking = () => {
    setTracking(false);
    saveTime();
  };

  // Calculate weekly stats
  const totalTime = Object.values(studyTime).reduce((a, b) => a + b, 0);
  
  const getWeekData = () => {
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const today = new Date();
    const weekData: Record<string, number> = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = days[date.getDay()];
      weekData[key] = Math.floor(Math.random() * 120); // Demo data
    }
    return weekData;
  };

  const weekData = getWeekData();
  const maxWeek = Math.max(...Object.values(weekData), 60);

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-[#8b5cf6]" />
          <h3 className="font-semibold">Study Tracker</h3>
        </div>
      </div>

      {/* Module Selection & Tracking */}
      <div className="flex gap-2">
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="input flex-1 text-sm"
        >
          {modules.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
          {modules.length === 0 && <option value="">Keine Module</option>}
        </select>
        
        {!tracking ? (
          <button
            onClick={startTracking}
            disabled={!selectedModule}
            className="px-4 py-2 rounded-lg bg-[#22c55e] text-white font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <Play size={14} /> Start
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="px-4 py-2 rounded-lg bg-[#ef4444] text-white font-medium flex items-center gap-2"
          >
            <Pause size={14} /> Stop
          </button>
        )}
      </div>

      {tracking && (
        <div className="text-center p-3 rounded-lg bg-[rgba(34,197,94,0.1)]">
          <p className="text-2xl font-bold text-[#22c55e]">{trackTime} min</p>
          <p className="text-xs text-[var(--text-muted)]">Aktuelle Session</p>
        </div>
      )}

      {/* Time per Module */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase">Zeit pro Modul</p>
        {Object.entries(studyTime).length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Noch keine Daten</p>
        ) : (
          Object.entries(studyTime)
            .filter(([_, time]) => time > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([modId, time]) => {
              const mod = modules.find(m => m.id === modId);
              return (
                <div key={modId} className="flex items-center gap-2">
                  <span className="text-xs w-24 truncate">{mod?.name || modId}</span>
                  <div className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#8b5cf6] rounded-full"
                      style={{ width: `${Math.min((time / totalTime) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono w-12 text-right">{time} min</span>
                </div>
              );
            })
        )}
      </div>

      {/* Weekly Overview */}
      <div className="space-y-2 pt-2 border-t border-[var(--border)]">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase">Wochenübersicht</p>
        <div className="flex items-end justify-between h-16 gap-1">
          {Object.entries(weekData).map(([day, time]) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-[#8b5cf6]/50 rounded-t"
                style={{ height: `${(time / maxWeek) * 100}%`, minHeight: time > 0 ? '4px' : '0' }}
              />
              <span className="text-[10px] text-[var(--text-muted)]">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function StudyPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'focus' | 'cards' | 'notes' | 'tracker'>('all');

  const tabs = [
    { id: 'all', label: 'Alle', icon: GraduationCap },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'cards', label: 'Karten', icon: Brain },
    { id: 'notes', label: 'Notizen', icon: FileText },
    { id: 'tracker', label: 'Tracker', icon: BarChart3 },
  ] as const;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Study Hub</h1>
            <p className="text-sm text-[var(--text-secondary)]">Dein Lernzentrum für KIT</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-[#8b5cf6]">25</p>
            <p className="text-[10px] text-[var(--text-muted)]">Min Focus</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#f59e0b]">12</p>
            <p className="text-[10px] text-[var(--text-muted)]">Karten fällig</p>
          <div className="text-center">
            <p className="text-lg font</div>
          -bold text-[#06b6d4]">3</p>
            <p className="text-[10px] text-[var(--text-muted)]">Module aktiv</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#8b5cf6] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className={`grid gap-6 ${
        activeTab === 'all' ? 'grid-cols-2' : 'grid-cols-1 max-w-2xl'
      }`}>
        {(activeTab === 'all' || activeTab === 'focus') && <FocusTimer />}
        {(activeTab === 'all' || activeTab === 'cards') && <SpacedRepetition />}
        {(activeTab === 'all' || activeTab === 'notes') && <QuickNotes />}
        {(activeTab === 'all' || activeTab === 'tracker') && <StudyTracker />}
      </div>
    </div>
  );
}
