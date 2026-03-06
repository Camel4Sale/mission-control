'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Clock, AlertTriangle, CheckCircle, BookOpen, Target, 
  TrendingUp, Calendar, Plus, Trash2, Edit2, Download, Upload,
  Bell, BellOff, ChevronDown, ChevronUp
} from 'lucide-react';
import { fetchExams, fetchModules } from '@/lib/api';
import { Exam, Module } from '@/types';
import { format, differenceInDays, parseISO, addDays } from 'date-fns';
import { de } from 'date-fns/locale';

interface KlausurTracker {
  id: string;
  moduleId: string;
  moduleName: string;
  date: string;
  location?: string;
  daysUntil: number;
  learningPlan: LearningTask[];
  oldExams: OldExam[];
  notes: string;
  reminderEnabled: boolean;
}

interface LearningTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
}

interface OldExam {
  id: string;
  name: string;
  year: number;
  completed: boolean;
  score?: number;
}

export default function KlausurTrackerPage() {
  const [trackers, setTrackers] = useState<KlausurTracker[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedTracker, setExpandedTracker] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const saved = localStorage.getItem('klausur-tracker');
      const apiModules = await fetchModules();
      const apiExams = await fetchExams();
      setModules(apiModules);

      if (saved) {
        setTrackers(JSON.parse(saved));
      } else {
        // Initialize from API exams
        const initialTrackers: KlausurTracker[] = apiExams.map(exam => {
          const module = apiModules.find(m => m.id === exam.moduleId);
          const daysUntil = differenceInDays(parseISO(exam.date), new Date());
          
          return {
            id: exam.id,
            moduleId: exam.moduleId,
            moduleName: module?.name || 'Unbekannt',
            date: exam.date,
            daysUntil,
            learningPlan: generateLearningPlan(exam.date, module?.name || ''),
            oldExams: generateOldExams(),
            notes: '',
            reminderEnabled: true,
          };
        });
        setTrackers(initialTrackers);
        localStorage.setItem('klausur-tracker', JSON.stringify(initialTrackers));
      }

      setLoading(false);
    };
    loadData();
  }, []);

  // Generate learning plan based on exam date
  const generateLearningPlan = (examDate: string, moduleName: string): LearningTask[] => {
    const exam = parseISO(examDate);
    const weeks = differenceInDays(exam, new Date()) / 7;
    const tasks: LearningTask[] = [];
    
    // Create weekly milestones
    for (let i = Math.floor(weeks); i >= 1; i--) {
      const dueDate = format(addDays(exam, -i * 7), 'yyyy-MM-dd');
      tasks.push({
        id: `week-${i}`,
        title: `Woche ${weeks - i + 1}: ${moduleName} Kapitel ${i}`,
        completed: false,
        dueDate,
        priority: i <= 2 ? 'high' : i <= 4 ? 'medium' : 'low',
      });
    }
    
    // Add final review tasks
    tasks.push({
      id: 'review-1',
      title: 'Altklausuren durchgehen',
      completed: false,
      dueDate: format(addDays(exam, -3), 'yyyy-MM-dd'),
      priority: 'high',
    });
    tasks.push({
      id: 'review-2',
      title: 'Formelsammlung erstellen',
      completed: false,
      dueDate: format(addDays(exam, -2), 'yyyy-MM-dd'),
      priority: 'high',
    });
    tasks.push({
      id: 'review-3',
      title: 'Letzte Wiederholung',
      completed: false,
      dueDate: format(addDays(exam, -1), 'yyyy-MM-dd'),
      priority: 'medium',
    });
    
    return tasks;
  };

  const generateOldExams = (): OldExam[] => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => ({
      id: `old-${i}`,
      name: `Klausur ${currentYear - i - 1}`,
      year: currentYear - i - 1,
      completed: false,
    }));
  };

  // Save trackers
  const saveTrackers = (newTrackers: KlausurTracker[]) => {
    setTrackers(newTrackers);
    localStorage.setItem('klausur-tracker', JSON.stringify(newTrackers));
  };

  // Toggle task completion
  const toggleTask = (trackerId: string, taskId: string) => {
    const updated = trackers.map(t => {
      if (t.id !== trackerId) return t;
      return {
        ...t,
        learningPlan: t.learningPlan.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      };
    });
    saveTrackers(updated);
  };

  // Toggle old exam completion
  const toggleOldExam = (trackerId: string, examId: string) => {
    const updated = trackers.map(t => {
      if (t.id !== trackerId) return t;
      return {
        ...t,
        oldExams: t.oldExams.map(exam =>
          exam.id === examId ? { ...exam, completed: !exam.completed } : exam
        ),
      };
    });
    saveTrackers(updated);
  };

  // Calculate progress
  const calculateProgress = (tracker: KlausurTracker) => {
    const totalTasks = tracker.learningPlan.length + tracker.oldExams.length;
    const completedTasks = tracker.learningPlan.filter(t => t.completed).length +
                          tracker.oldExams.filter(e => e.completed).length;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b5cf6]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar size={28} className="text-[#8b5cf6]" />
          <div>
            <h1 className="text-2xl font-semibold">Klausur-Tracker</h1>
            <p className="text-sm text-[var(--text-secondary)]">Lernplan & Altklausuren</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Klausur hinzufügen
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(239,68,68,0.15)] flex items-center justify-center">
              <Clock size={20} className="text-[#ef4444]" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {trackers.filter(t => t.daysUntil <= 14).length}
              </p>
              <p className="text-xs text-[var(--text-muted)]">In 2 Wochen</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center">
              <BookOpen size={20} className="text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {trackers.reduce((sum, t) => sum + t.learningPlan.filter(l => l.completed).length, 0)}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Aufgaben erledigt</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.15)] flex items-center justify-center">
              <CheckCircle size={20} className="text-[#22c55e]" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {trackers.reduce((sum, t) => sum + t.oldExams.filter(e => e.completed).length, 0)}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Altklausuren</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.15)] flex items-center justify-center">
              <Target size={20} className="text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {trackers.length > 0 
                  ? Math.round(trackers.reduce((sum, t) => sum + calculateProgress(t), 0) / trackers.length)
                  : 0}%
              </p>
              <p className="text-xs text-[var(--text-muted)]">Ø Fortschritt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Klausuren List */}
      <div className="space-y-4">
        {trackers.map(tracker => {
          const progress = calculateProgress(tracker);
          const isExpanded = expandedTracker === tracker.id;
          const urgent = tracker.daysUntil <= 7;
          const warning = tracker.daysUntil <= 14;
          
          return (
            <div key={tracker.id} className="card overflow-hidden">
              <button
                onClick={() => setExpandedTracker(isExpanded ? null : tracker.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${
                    urgent ? 'bg-[rgba(239,68,68,0.15)]' : warning ? 'bg-[rgba(245,158,11,0.15)]' : 'bg-[rgba(34,197,94,0.15)]'
                  }`}>
                    <span className={`text-2xl font-bold ${
                      urgent ? 'text-[#ef4444]' : warning ? 'text-[#f59e0b]' : 'text-[#22c55e]'
                    }`}>
                      {tracker.daysUntil}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">Tage</span>
                  </div>
                  
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">{tracker.moduleName}</h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {format(parseISO(tracker.date), 'EEEE, d. MMMM yyyy', { locale: de })}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">
                        {tracker.learningPlan.filter(t => t.completed).length}/{tracker.learningPlan.length} Aufgaben
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">
                        {tracker.oldExams.filter(e => e.completed).length}/{tracker.oldExams.length} Altklausuren
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Progress Ring */}
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="var(--bg-tertiary)"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke={progress >= 70 ? '#22c55e' : progress >= 40 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${(progress / 100) * 126} 126`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">{progress}%</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = trackers.map(t =>
                        t.id === tracker.id ? { ...t, reminderEnabled: !t.reminderEnabled } : t
                      );
                      saveTrackers(updated);
                    }}
                    className={`p-2 rounded-lg ${
                      tracker.reminderEnabled 
                        ? 'bg-[#8b5cf6]/15 text-[#8b5cf6]' 
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                    }`}
                  >
                    {tracker.reminderEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                  </button>
                  
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>
              
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-[var(--border)]">
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    {/* Learning Plan */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Target size={16} className="text-[#8b5cf6]" />
                        Lernplan
                      </h4>
                      
                      <div className="space-y-2">
                        {tracker.learningPlan.map(task => (
                          <label
                            key={task.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)] cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTask(tracker.id, task.id)}
                              className="mt-0.5 rounded"
                            />
                            <div className="flex-1">
                              <p className={`text-sm ${task.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>
                                {task.title}
                              </p>
                              {task.dueDate && (
                                <p className="text-xs text-[var(--text-muted)] mt-1">
                                  Bis: {format(parseISO(task.dueDate), 'd. MMM', { locale: de })}
                                </p>
                              )}
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              task.priority === 'high' ? 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]' :
                              task.priority === 'medium' ? 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]' :
                              'bg-[rgba(34,197,94,0.15)] text-[#22c55e]'
                            }`}>
                              {task.priority === 'high' ? 'Hoch' : task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Old Exams */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <FileText size={16} className="text-[#06b6d4]" />
                        Altklausuren
                      </h4>
                      
                      <div className="space-y-2">
                        {tracker.oldExams.map(exam => (
                          <label
                            key={exam.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={exam.completed}
                                onChange={() => toggleOldExam(tracker.id, exam.id)}
                                className="rounded"
                              />
                              <div>
                                <p className={`text-sm ${exam.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>
                                  {exam.name}
                                </p>
                                {exam.score && (
                                  <p className="text-xs text-[var(--text-muted)]">
                                    Ergebnis: {exam.score}%
                                  </p>
                                )}
                              </div>
                            </div>
                            {exam.completed && (
                              <input
                                type="number"
                                placeholder="%"
                                className="w-16 px-2 py-1 rounded bg-[var(--bg-secondary)] text-sm text-right"
                                value={exam.score || ''}
                                onChange={(e) => {
                                  const updated = trackers.map(t => {
                                    if (t.id !== tracker.id) return t;
                                    return {
                                      ...t,
                                      oldExams: t.oldExams.map(ex =>
                                        ex.id === exam.id ? { ...ex, score: Number(e.target.value) } : ex
                                      ),
                                    };
                                  });
                                  saveTrackers(updated);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <BookOpen size={16} className="text-[#f59e0b]" />
                      Notizen
                    </h4>
                    <textarea
                      value={tracker.notes}
                      onChange={(e) => {
                        const updated = trackers.map(t =>
                          t.id === tracker.id ? { ...t, notes: e.target.value } : t
                        );
                        saveTrackers(updated);
                      }}
                      placeholder="Wichtige Formeln, Themen, Tipps..."
                      className="input w-full h-24 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {trackers.length === 0 && (
          <div className="card p-12 text-center">
            <Calendar size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
            <p className="text-lg font-medium mb-2">Keine Klausuren eingetragen</p>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Füge deine erste Klausur hinzu, um den Lernplan zu generieren
            </p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Klausur hinzufügen
            </button>
          </div>
        )}
      </div>

      {/* Add Klausur Modal */}
      {showAddModal && (
        <AddKlausurModal
          modules={modules}
          onClose={() => setShowAddModal(false)}
          onAdd={(newTracker) => {
            saveTrackers([...trackers, newTracker]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

// Add Klausur Modal Component
function AddKlausurModal({ 
  modules, 
  onClose, 
  onAdd 
}: { 
  modules: Module[];
  onClose: () => void;
  onAdd: (tracker: KlausurTracker) => void;
}) {
  const [selectedModule, setSelectedModule] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const module = modules.find(m => m.id === selectedModule);
    if (!module || !date) return;

    const daysUntil = differenceInDays(parseISO(date), new Date());
    
    // Generate learning plan
    const learningPlan: LearningTask[] = [];
    const weeks = Math.floor(daysUntil / 7);
    
    for (let i = weeks; i >= 1; i--) {
      const dueDate = format(addDays(parseISO(date), -i * 7), 'yyyy-MM-dd');
      learningPlan.push({
        id: `week-${i}`,
        title: `Woche ${weeks - i + 1}: ${module.name} lernen`,
        completed: false,
        dueDate,
        priority: i <= 2 ? 'high' : i <= 4 ? 'medium' : 'low',
      });
    }
    
    learningPlan.push(
      { id: 'review-1', title: 'Altklausuren durchgehen', completed: false, dueDate: format(addDays(parseISO(date), -3), 'yyyy-MM-dd'), priority: 'high' },
      { id: 'review-2', title: 'Formelsammlung erstellen', completed: false, dueDate: format(addDays(parseISO(date), -2), 'yyyy-MM-dd'), priority: 'high' },
      { id: 'review-3', title: 'Letzte Wiederholung', completed: false, dueDate: format(addDays(parseISO(date), -1), 'yyyy-MM-dd'), priority: 'medium' }
    );

    const oldExams: OldExam[] = Array.from({ length: 5 }, (_, i) => ({
      id: `old-${i}`,
      name: `Klausur ${new Date().getFullYear() - i - 1}`,
      year: new Date().getFullYear() - i - 1,
      completed: false,
    }));

    onAdd({
      id: Date.now().toString(),
      moduleId: module.id,
      moduleName: module.name,
      date,
      location,
      daysUntil,
      learningPlan,
      oldExams,
      notes: '',
      reminderEnabled: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Klausur hinzufügen</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Modul</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="input w-full"
              required
            >
              <option value="">Modul auswählen...</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Datum</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input w-full"
              required
            />
          </div>
          
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Ort (optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input w-full"
              placeholder="z.B. HS a.F., Geb. 20.40"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg bg-[var(--bg-tertiary)] font-medium">
              Abbrechen
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#8b5cf6] text-white font-medium">
              Hinzufügen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
