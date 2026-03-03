'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, Clock, CheckCircle, AlertCircle, BookOpen, Code, FileText, Send } from 'lucide-react';
import { fetchThesisPhases } from '@/lib/api';
import { ThesisPhase } from '@/types';
import { format, differenceInDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

const statusConfig = {
  'not-started': { label: 'Nicht gestartet', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)', icon: Clock },
  'in-progress': { label: 'In Bearbeitung', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: AlertCircle },
  'completed': { label: 'Abgeschlossen', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', icon: CheckCircle },
};

export default function ThesisPage() {
  const [phases, setPhases] = useState<ThesisPhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThesisPhases().then(data => {
      setPhases(data);
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

  const completedPhases = phases.filter(p => p.status === 'completed').length;
  const progress = (completedPhases / phases.length) * 100;
  const currentPhase = phases.find(p => p.status === 'in-progress');

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap size={28} className="text-[#8b5cf6]" />
          <div>
            <h1 className="text-2xl font-semibold">Masterarbeit</h1>
            <p className="text-sm text-[var(--text-secondary)]">Machine Learning in Supply Chain Optimization</p>
          </div>
        </div>
        <button className="btn btn-primary">
          <Send size={16} />
          Betreuer kontaktieren
        </button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-medium mb-1">Gesamtfortschritt</h2>
              <p className="text-sm text-[var(--text-muted)]">{completedPhases} von {phases.length} Phasen abgeschlossen</p>
            </div>
            <span className="text-3xl font-bold text-[#8b5cf6]">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar h-4">
            <div 
              className="progress-bar-fill bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#22c55e]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {currentPhase && (
            <div className="mt-4 p-3 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[#f59e0b]/20">
              <div className="flex items-center gap-2 text-[#f59e0b]">
                <AlertCircle size={16} />
                <span className="font-medium">Aktuelle Phase: {currentPhase.title}</span>
              </div>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-medium mb-4">Deadline</h3>
          <div className="text-center">
            <p className="text-4xl font-bold text-[#ef4444]">31</p>
            <p className="text-lg text-[var(--text-muted)]">Tage</p>
            <p className="text-sm text-[var(--text-muted)]">bis zur Abgabe</p>
          </div>
          <div className="mt-4 p-2 rounded-lg bg-[var(--bg-tertiary)] text-center">
            <p className="text-sm font-medium">31. März 2026</p>
          </div>
        </div>
      </div>

      {/* Phases Timeline */}
      <div className="card p-5">
        <h2 className="font-medium mb-6">Phasen</h2>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-[var(--bg-tertiary)]" />
          
          <div className="space-y-6">
            {phases.map((phase, index) => {
              const config = statusConfig[phase.status];
              const StatusIcon = config.icon;
              const isLast = index === phases.length - 1;
              
              return (
                <div key={phase.id} className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div 
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: config.bg }}
                  >
                    <StatusIcon size={18} style={{ color: config.color }} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: config.color }}>{phase.title}</h3>
                        <span 
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: config.bg, color: config.color }}
                        >
                          {config.label}
                        </span>
                      </div>
                      {phase.endDate && (
                        <p className="text-sm text-[var(--text-muted)]">
                          {phase.status === 'completed' ? 'Abgeschlossen: ' : 'Bis: '}
                          {format(parseISO(phase.endDate), 'd. MMM yyyy', { locale: de })}
                        </p>
                      )}
                    </div>
                    
                    {/* Progress for in-progress */}
                    {phase.status === 'in-progress' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
                          <span>Fortschritt</span>
                          <span>~{Math.round(Math.random() * 40 + 20)}%</span>
                        </div>
                        <div className="progress-bar h-2">
                          <div 
                            className="progress-bar-fill bg-[#f59e0b]"
                            style={{ width: `${Math.round(Math.random() * 40 + 20)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button className="card card-hover p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center">
            <BookOpen size={20} className="text-[#8b5cf6]" />
          </div>
          <div className="text-left">
            <p className="font-medium">Literatur</p>
            <p className="text-xs text-[var(--text-muted)]">Paper suchen</p>
          </div>
        </button>

        <button className="card card-hover p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
            <Code size={20} className="text-[#06b6d4]" />
          </div>
          <div className="text-left">
            <p className="font-medium">Code</p>
            <p className="text-xs text-[var(--text-muted)]">ML-Notebooks</p>
          </div>
        </button>

        <button className="card card-hover p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.15)] flex items-center justify-center">
            <FileText size={20} className="text-[#22c55e]" />
          </div>
          <div className="text-left">
            <p className="font-medium">Kapitel</p>
            <p className="text-xs text-[var(--text-muted)]">Dokumentation</p>
          </div>
        </button>
      </div>
    </div>
  );
}
