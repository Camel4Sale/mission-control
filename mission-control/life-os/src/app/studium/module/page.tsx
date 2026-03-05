'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, Award, TrendingUp, Clock, CheckCircle, 
  AlertCircle, Plus, Target, GraduationCap
} from 'lucide-react';
import { fetchModules, fetchExams } from '@/lib/api';
import { Module, Exam } from '@/types';
import { format, differenceInDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

const categoryConfig = {
  'pflicht': { label: 'Pflicht', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  'wahlpflicht-ing': { label: 'Wahlpflicht Ingenieur', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  'wahlpflicht-wiwi': { label: 'Wahlpflicht Wirtschaft', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  'vertiefung': { label: 'Vertiefung', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
};

const statusConfig = {
  'passed': { label: 'Bestanden', icon: CheckCircle, color: '#22c55e' },
  'registered': { label: 'Angemeldet', icon: Clock, color: '#f59e0b' },
  'upcoming': { label: 'Kommend', icon: AlertCircle, color: '#6b7280' },
};

export default function ModulePage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [m, e] = await Promise.all([fetchModules(), fetchExams()]);
      setModules(m);
      setExams(e);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b5cf6]"></div>
      </div>
    );
  }

  // Calculate stats
  const totalEcts = modules.reduce((sum, m) => sum + m.ects, 0);
  const earnedEcts = modules.filter(m => m.status === 'passed').reduce((sum, m) => sum + m.ects, 0);
  const avgGrade = modules
    .filter(m => m.grade)
    .reduce((sum, m, _, arr) => sum + (m.grade || 0) / arr.length, 0);

  // Group by category
  const modulesByCategory = modules.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {} as Record<string, Module[]>);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap size={28} className="text-[#8b5cf6]" />
          <div>
            <h1 className="text-2xl font-semibold">Module</h1>
            <p className="text-sm text-[var(--text-secondary)]">Master Wirtschaftsingenieurwesen</p>
          </div>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          Modul hinzufügen
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center">
              <Target size={20} className="text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{earnedEcts}/{totalEcts}</p>
              <p className="text-xs text-[var(--text-muted)]">ECTS gesamt</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.15)] flex items-center justify-center">
              <Award size={20} className="text-[#22c55e]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{modules.filter(m => m.status === 'passed').length}</p>
              <p className="text-xs text-[var(--text-muted)]">Bestanden</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.15)] flex items-center justify-center">
              <TrendingUp size={20} className="text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{avgGrade.toFixed(1)}</p>
              <p className="text-xs text-[var(--text-muted)]">Notendurchschnitt</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
              <BookOpen size={20} className="text-[#06b6d4]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{modules.length}</p>
              <p className="text-xs text-[var(--text-muted)]">Module gesamt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Semesterfortschritt</span>
          <span className="text-sm text-[var(--text-muted)]">{Math.round((earnedEcts / 120) * 100)}%</span>
        </div>
        <div className="progress-bar h-3">
          <div 
            className="progress-bar-fill bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]" 
            style={{ width: `${(earnedEcts / 120) * 100}%` }} 
          />
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">Ziel: 120 ECTS (Master)</p>
      </div>

      {/* Upcoming Exams */}
      {exams.length > 0 && (
        <div className="card p-4">
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="text-[#f59e0b]" />
            Anstehende Klausuren
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {exams.map(exam => {
              const module = modules.find(m => m.id === exam.moduleId);
              const daysUntil = differenceInDays(parseISO(exam.date), new Date());
              
              return (
                <div key={exam.id} className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{module?.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      daysUntil <= 7 ? 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]' :
                      daysUntil <= 14 ? 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]' :
                      'bg-[rgba(34,197,94,0.15)] text-[#22c55e]'
                    }`}>
                      {daysUntil} Tage
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mb-2">
                    {format(parseISO(exam.date), 'd. MMM yyyy', { locale: de })}
                  </div>
                  {/* Preparation Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Vorbereitung</span>
                      <span>{exam.preparationProgress}%</span>
                    </div>
                    <div className="progress-bar h-1.5">
                      <div 
                        className="progress-bar-fill bg-[#f59e0b]" 
                        style={{ width: `${exam.preparationProgress}%` }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modules by Category */}
      <div className="space-y-6">
        {Object.entries(modulesByCategory).map(([category, categoryModules]) => {
          const config = categoryConfig[category as keyof typeof categoryConfig];
          const categoryEcts = categoryModules.reduce((sum, m) => sum + m.ects, 0);
          const earnedCategoryEcts = categoryModules.filter(m => m.status === 'passed').reduce((sum, m) => sum + m.ects, 0);
          
          return (
            <section key={category}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  {config.label}
                </h2>
                <span className="text-xs text-[var(--text-muted)]">
                  {earnedCategoryEcts}/{categoryEcts} ECTS
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {categoryModules.map(module => {
                  const status = statusConfig[module.status];
                  const StatusIcon = status.icon;
                  
                  return (
                    <div 
                      key={module.id} 
                      className="card card-hover p-4"
                      style={{ borderLeftColor: config.color, borderLeftWidth: 3 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{module.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{module.code}</p>
                        </div>
                        <StatusIcon size={16} style={{ color: status.color }} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)]">
                          {module.ects} ECTS • Semester {module.semester}
                        </span>
                        {module.grade && (
                          <span 
                            className="text-sm font-semibold"
                            style={{ color: module.grade <= 1.3 ? '#22c55e' : module.grade <= 2.0 ? '#84cc16' : '#f59e0b' }}
                          >
                            {module.grade.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
