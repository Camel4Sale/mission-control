'use client';

import { useState, useEffect } from 'react';
import { FileText, Clock, AlertTriangle, CheckCircle, BookOpen, Target, TrendingUp } from 'lucide-react';
import { fetchExams, fetchModules } from '@/lib/api';
import { Exam, Module } from '@/types';
import { format, differenceInDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

export default function KlausurenPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchExams(), fetchModules()]).then(([e, m]) => {
      setExams(e);
      setModules(m);
      setLoading(false);
    });
  }, []);

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
          <FileText size={28} className="text-[#8b5cf6]" />
          <div>
            <h1 className="text-2xl font-semibold">Klausuren</h1>
            <p className="text-sm text-[var(--text-secondary)]">Vorbereitung & Termine</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(239,68,68,0.15)] flex items-center justify-center">
              <AlertTriangle size={20} className="text-[#ef4444]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{exams.length}</p>
              <p className="text-xs text-[var(--text-muted)]">Anstehende Klausuren</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.15)] flex items-center justify-center">
              <Clock size={20} className="text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {exams.reduce((sum, e) => sum + e.exercisesCompleted, 0)}/{exams.reduce((sum, e) => sum + e.totalExercises, 0)}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Übungen</p>
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
                {exams.reduce((sum, e) => sum + e.oldExamsCompleted, 0)}/{exams.reduce((sum, e) => sum + e.totalOldExams, 0)}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Altklausuren</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.15)] flex items-center justify-center">
              <Target size={20} className="text-[#22c55e]" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round(exams.reduce((sum, e) => sum + e.preparationProgress, 0) / exams.length)}%
              </p>
              <p className="text-xs text-[var(--text-muted)]">Ø Fortschritt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exams */}
      <div className="grid grid-cols-2 gap-6">
        {exams.map(exam => {
          const module = modules.find(m => m.id === exam.moduleId);
          const daysUntil = differenceInDays(parseISO(exam.date), new Date());
          
          return (
            <div key={exam.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{module?.name}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{module?.code} • {module?.ects} ECTS</p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${
                    daysUntil <= 7 ? 'text-[#ef4444]' :
                    daysUntil <= 14 ? 'text-[#f59e0b]' : 'text-[#22c55e]'
                  }`}>
                    {daysUntil}
                  </span>
                  <p className="text-xs text-[var(--text-muted)]">Tage</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-[var(--text-muted)]">Vorbereitungsfortschritt</span>
                  <span className="font-medium">{exam.preparationProgress}%</span>
                </div>
                <div className="progress-bar h-2">
                  <div 
                    className="progress-bar-fill bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]"
                    style={{ width: `${exam.preparationProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={14} className="text-[#8b5cf6]" />
                    <span className="text-[var(--text-muted)]">Altklausuren</span>
                  </div>
                  <p className="font-semibold">{exam.oldExamsCompleted}/{exam.totalOldExams}</p>
                  <div className="progress-bar h-1 mt-1">
                    <div 
                      className="progress-bar-fill bg-[#8b5cf6]"
                      style={{ width: `${(exam.oldExamsCompleted / exam.totalOldExams) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen size={14} className="text-[#06b6d4]" />
                    <span className="text-[var(--text-muted)]">Übungen</span>
                  </div>
                  <p className="font-semibold">{exam.exercisesCompleted}/{exam.totalExercises}</p>
                  <div className="progress-bar h-1 mt-1">
                    <div 
                      className="progress-bar-fill bg-[#06b6d4]"
                      style={{ width: `${(exam.exercisesCompleted / exam.totalExercises) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-[rgba(139,92,246,0.1)] border border-[#8b5cf6]/20">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#8b5cf6]" />
                  <span className="text-sm">
                    {format(parseISO(exam.date), 'EEEE, d. MMMM yyyy', { locale: de })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
