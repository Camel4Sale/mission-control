'use client';

import { useState, useEffect } from 'react';
import { Award, TrendingUp, BookOpen, Target, Trophy, Star } from 'lucide-react';
import { fetchModules } from '@/lib/api';
import { Module } from '@/types';

const categoryConfig = {
  'pflicht': { label: 'Pflicht', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  'wahlpflicht-ing': { label: 'Wahlpflicht Ingenieur', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  'wahlpflicht-wiwi': { label: 'Wahlpflicht Wirtschaft', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  'vertiefung': { label: 'Vertiefung', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
};

const gradeColors: Record<string, string> = {
  '1.0': '#22c55e', '1.3': '#22c55e', '1.7': '#84cc16',
  '2.0': '#eab308', '2.3': '#eab308', '2.7': '#f59e0b',
  '3.0': '#f59e0b', '3.3': '#f97316', '3.7': '#ef4444', '4.0': '#ef4444',
};

const getGradeColor = (grade: number) => {
  if (grade <= 1.7) return '#22c55e';
  if (grade <= 2.7) return '#eab308';
  return '#ef4444';
};

export default function NotenPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules().then(data => {
      setModules(data);
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

  const passedModules = modules.filter(m => m.status === 'passed');
  const totalEcts = modules.reduce((sum, m) => sum + m.ects, 0);
  const earnedEcts = passedModules.reduce((sum, m) => sum + m.ects, 0);
  
  const avgGrade = passedModules.length > 0
    ? passedModules.reduce((sum, m) => sum + (m.grade || 0), 0) / passedModules.length
    : 0;

  const bestGrade = passedModules.length > 0
    ? Math.min(...passedModules.map(m => m.grade || 0))
    : 0;

  const modulesByCategory = modules.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {} as Record<string, Module[]>);

  // Grade distribution
  const gradeDistribution = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0];
  const gradeCounts = gradeDistribution.map(g => passedModules.filter(m => m.grade === g).length);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award size={28} className="text-[#8b5cf6]" />
          <div>
            <h1 className="text-2xl font-semibold">Notenübersicht</h1>
            <p className="text-sm text-[var(--text-secondary)]">Master Wirtschaftsingenieurwesen</p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-5 bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={20} className="text-[#8b5cf6]" />
            <span className="text-sm text-[var(--text-muted)]">Durchschnitt</span>
          </div>
          <p className="text-4xl font-bold" style={{ color: getGradeColor(avgGrade) }}>
            {avgGrade.toFixed(1)}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{passedModules.length} Module</p>
        </div>

        <div className="card p-5 bg-gradient-to-br from-[rgba(34,197,94,0.15)] to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Star size={20} className="text-[#22c55e]" />
            <span className="text-sm text-[var(--text-muted)]">Beste Note</span>
          </div>
          <p className="text-4xl font-bold" style={{ color: getGradeColor(bestGrade) }}>
            {bestGrade.toFixed(1)}
          </p>
          <p className="text-xs text-[var(--text-muted)]">Bestes Ergebnis</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={20} className="text-[#06b6d4]" />
            <span className="text-sm text-[var(--text-muted)]">ECTS</span>
          </div>
          <p className="text-4xl font-bold">{earnedEcts}/{totalEcts}</p>
          <p className="text-xs text-[var(--text-muted)]">Bestanden</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <Target size={20} className="text-[#f59e0b]" />
            <span className="text-sm text-[var(--text-muted)]">Master</span>
          </div>
          <p className="text-4xl font-bold">{Math.round((earnedEcts / 120) * 100)}%</p>
          <p className="text-xs text-[var(--text-muted)]">Fortschritt</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Grade Distribution */}
        <div className="card p-5">
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#8b5cf6]" />
            Notenverteilung
          </h2>
          
          <div className="space-y-2">
            {gradeDistribution.map((grade, i) => {
              const count = gradeCounts[i];
              const maxCount = Math.max(...gradeCounts, 1);
              const percentage = (count / maxCount) * 100;
              
              return (
                <div key={grade} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8" style={{ color: getGradeColor(grade) }}>
                    {grade.toFixed(1)}
                  </span>
                  <div className="flex-1 h-6 bg-[var(--bg-tertiary)] rounded overflow-hidden">
                    <div 
                      className="h-full rounded transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: getGradeColor(grade)
                      }}
                    />
                  </div>
                  <span className="text-xs text-[var(--text-muted)] w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modules by Category */}
        <div className="col-span-2 card p-5">
          <h2 className="font-medium mb-4">Module nach Kategorie</h2>
          
          <div className="space-y-6">
            {Object.entries(modulesByCategory).map(([category, categoryModules]) => {
              const config = categoryConfig[category as keyof typeof categoryConfig];
              const passed = categoryModules.filter(m => m.status === 'passed');
              const categoryEcts = categoryModules.reduce((sum, m) => sum + m.ects, 0);
              const earnedEcts = passed.reduce((sum, m) => sum + m.ects, 0);
              
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="font-medium">{config.label}</span>
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">
                      {earnedEcts}/{categoryEcts} ECTS
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {categoryModules.map(module => (
                      <div 
                        key={module.id}
                        className="p-3 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{module.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{module.code} • {module.ects} ECTS</p>
                        </div>
                        {module.grade ? (
                          <span 
                            className="text-lg font-bold"
                            style={{ color: getGradeColor(module.grade) }}
                          >
                            {module.grade.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded bg-[rgba(107,114,128,0.15)] text-[#6b7280]">
                            {module.semester}. Sem
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
