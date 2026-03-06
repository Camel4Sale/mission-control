'use client';

import { useState, useEffect } from 'react';
import { 
  Award, TrendingUp, Calculator, BarChart3, Plus, Trash2, 
  Edit2, Save, X, AlertCircle, Target, BookOpen
} from 'lucide-react';
import { fetchModules } from '@/lib/api';
import { Module } from '@/types';

interface GradeEntry {
  id: string;
  moduleId: string;
  moduleName: string;
  ects: number;
  grade: number;
  weight: number; // Gewichtung für Gesamtnote
  semester: number;
  category: string;
  examDate?: string;
}

interface Scenario {
  id: string;
  name: string;
  entries: GradeEntry[];
  predictedGrade: number;
}

export default function NotenRechnerPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [entries, setEntries] = useState<GradeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'scenarios' | 'history'>('current');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const saved = localStorage.getItem('noten-rechner-entries');
      const savedScenarios = localStorage.getItem('noten-rechner-scenarios');
      const apiModules = await fetchModules();
      setModules(apiModules);

      if (saved) {
        setEntries(JSON.parse(saved));
      } else {
        // Initialize with modules from API
        const initialEntries: GradeEntry[] = apiModules
          .filter(m => m.grade)
          .map(m => ({
            id: m.id,
            moduleId: m.id,
            moduleName: m.name,
            ects: m.ects,
            grade: m.grade!,
            weight: m.ects, // Default: ECTS als Gewichtung
            semester: m.semester,
            category: m.category,
          }));
        setEntries(initialEntries);
        localStorage.setItem('noten-rechner-entries', JSON.stringify(initialEntries));
      }

      if (savedScenarios) {
        setScenarios(JSON.parse(savedScenarios));
      }

      setLoading(false);
    };
    loadData();
  }, []);

  // Save entries
  const saveEntries = (newEntries: GradeEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('noten-rechner-entries', JSON.stringify(newEntries));
  };

  // Calculate weighted average
  const calculateAverage = (gradeEntries: GradeEntry[]) => {
    if (gradeEntries.length === 0) return 0;
    const totalWeight = gradeEntries.reduce((sum, e) => sum + e.weight, 0);
    const weightedSum = gradeEntries.reduce((sum, e) => sum + e.grade * e.weight, 0);
    return weightedSum / totalWeight;
  };

  // Calculate predicted final grade
  const calculatePredictedGrade = (currentEntries: GradeEntry[], plannedEcts: number, targetTotalEcts: number = 120) => {
    const currentEcts = currentEntries.reduce((sum, e) => sum + e.ects, 0);
    const currentWeightedSum = currentEntries.reduce((sum, e) => sum + e.grade * e.ects, 0);
    
    // Assume average grade of 2.0 for remaining modules
    const remainingEcts = targetTotalEcts - currentEcts;
    const assumedGrade = 2.0;
    
    const finalWeightedSum = currentWeightedSum + (remainingEcts * assumedGrade);
    return finalWeightedSum / targetTotalEcts;
  };

  // Grade distribution
  const getGradeDistribution = () => {
    const distribution: Record<number, number> = {};
    entries.forEach(e => {
      const rounded = Math.round(e.grade * 2) / 2; // Round to 0.5
      distribution[rounded] = (distribution[rounded] || 0) + 1;
    });
    return distribution;
  };

  const currentAverage = calculateAverage(entries);
  const totalEcts = entries.reduce((sum, e) => sum + e.ects, 0);
  const predictedGrade = calculatePredictedGrade(entries, totalEcts);

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
          <Calculator size={28} className="text-[#8b5cf6]" />
          <div>
            <h1 className="text-2xl font-semibold">Noten-Rechner</h1>
            <p className="text-sm text-[var(--text-secondary)]">Gewichtung, Prognose & Szenarien</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Note hinzufügen
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-lg w-fit">
        {[
          { id: 'current', label: 'Aktuell', icon: Calculator },
          { id: 'scenarios', label: 'Szenarien', icon: Target },
          { id: 'history', label: 'Historie', icon: TrendingUp },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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

      {/* Main Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-5 bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Award size={20} className="text-[#8b5cf6]" />
            <span className="text-sm text-[var(--text-muted)]">Ø Durchschnitt</span>
          </div>
          <p className="text-4xl font-bold" style={{ color: currentAverage <= 1.5 ? '#22c55e' : currentAverage <= 2.5 ? '#eab308' : '#ef4444' }}>
            {currentAverage.toFixed(2)}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{entries.length} bewertete Module</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={20} className="text-[#06b6d4]" />
            <span className="text-sm text-[var(--text-muted)]">ECTS</span>
          </div>
          <p className="text-4xl font-bold">{totalEcts}</p>
          <p className="text-xs text-[var(--text-muted)]">Mit Note bewertet</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <Target size={20} className="text-[#f59e0b]" />
            <span className="text-sm text-[var(--text-muted)]">Prognose</span>
          </div>
          <p className="text-4xl font-bold text-[#f59e0b]">{predictedGrade.toFixed(2)}</p>
          <p className="text-xs text-[var(--text-muted)]">Bei 2.0 in Rest</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={20} className="text-[#22c55e]" />
            <span className="text-sm text-[var(--text-muted)]">Bester</span>
          </div>
          <p className="text-4xl font-bold text-[#22c55e]">
            {entries.length > 0 ? Math.min(...entries.map(e => e.grade)).toFixed(1) : '-'}
          </p>
          <p className="text-xs text-[var(--text-muted)]">Beste Note</p>
        </div>
      </div>

      {/* Content based on tab */}
      {activeTab === 'current' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Module List */}
          <div className="card p-5">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-[#8b5cf6]" />
              Module mit Noten
            </h2>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {entries.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-8">
                  Noch keine Noten eingetragen
                </p>
              ) : (
                entries.map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{entry.moduleName}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {entry.ects} ECTS • Gewichtung: {entry.weight}%
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span 
                        className="text-xl font-bold"
                        style={{ 
                          color: entry.grade <= 1.3 ? '#22c55e' :
                            entry.grade <= 2.0 ? '#84cc16' :
                            entry.grade <= 3.0 ? '#f59e0b' : '#ef4444'
                        }}
                      >
                        {entry.grade.toFixed(1)}
                      </span>
                      <button 
                        onClick={() => {
                          const updated = entries.map(e => 
                            e.id === entry.id ? { ...e, grade: Math.max(1.0, e.grade - 0.3) } : e
                          );
                          saveEntries(updated);
                        }}
                        className="p-1.5 hover:bg-[var(--bg-hover)] rounded text-[var(--text-muted)]"
                        title="Verbessern (Demo)"
                      >
                        <TrendingUp size={14} className="text-[#22c55e]" />
                      </button>
                      <button 
                        onClick={() => {
                          const updated = entries.filter(e => e.id !== entry.id);
                          saveEntries(updated);
                        }}
                        className="p-1.5 hover:bg-[var(--bg-hover)] rounded text-[var(--text-muted)]"
                      >
                        <Trash2 size={14} className="text-[#ef4444]" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Grade Distribution Chart */}
          <div className="card p-5">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-[#8b5cf6]" />
              Notenverteilung
            </h2>
            
            <div className="space-y-3">
              {[1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0].map(grade => {
                const distribution = getGradeDistribution();
                const count = distribution[grade] || 0;
                const maxCount = Math.max(...Object.values(distribution), 1);
                const percentage = (count / maxCount) * 100;
                
                return (
                  <div key={grade} className="flex items-center gap-3">
                    <span 
                      className="text-sm font-medium w-10"
                      style={{ 
                        color: grade <= 1.7 ? '#22c55e' :
                          grade <= 2.7 ? '#eab308' : '#ef4444'
                      }}
                    >
                      {grade.toFixed(1)}
                    </span>
                    <div className="flex-1 h-8 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden">
                      <div 
                        className="h-full rounded-lg transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: grade <= 1.7 ? '#22c55e' :
                            grade <= 2.7 ? '#eab308' : '#ef4444'
                        }}
                      />
                    </div>
                    <span className="text-xs text-[var(--text-muted)] w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* What-If Calculator */}
            <div className="mt-6 pt-4 border-t border-[var(--border)]">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-[#f59e0b]" />
                Was-wenn Szenario
              </h3>
              <WhatIfCalculator 
                currentAverage={currentAverage}
                currentEcts={totalEcts}
                onResult={(newAverage) => {
                  console.log('New average:', newAverage);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scenarios' && (
        <ScenariosTab 
          scenarios={scenarios}
          entries={entries}
          onSaveScenario={(scenario) => {
            const newScenarios = [...scenarios, scenario];
            setScenarios(newScenarios);
            localStorage.setItem('noten-rechner-scenarios', JSON.stringify(newScenarios));
          }}
          onLoadScenario={(scenario) => {
            setEntries(scenario.entries);
            saveEntries(scenario.entries);
          }}
        />
      )}

      {activeTab === 'history' && (
        <HistoryChart entries={entries} />
      )}

      {/* Add Entry Modal */}
      {showAddModal && (
        <AddEntryModal
          modules={modules}
          onClose={() => setShowAddModal(false)}
          onAdd={(entry) => {
            saveEntries([...entries, entry]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

// What-If Calculator Component
function WhatIfCalculator({ 
  currentAverage, 
  currentEcts,
  onResult 
}: { 
  currentAverage: number; 
  currentEcts: number;
  onResult: (avg: number) => void;
}) {
  const [plannedGrade, setPlannedGrade] = useState(2.0);
  const [plannedEcts, setPlannedEcts] = useState(30);

  const result = ((currentAverage * currentEcts) + (plannedGrade * plannedEcts)) / (currentEcts + plannedEcts);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Geplante Note</label>
          <select
            value={plannedGrade}
            onChange={(e) => setPlannedGrade(Number(e.target.value))}
            className="input w-full text-sm"
          >
            {[1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0].map(g => (
              <option key={g} value={g}>{g.toFixed(1)}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Verbleibende ECTS</label>
          <input
            type="number"
            value={plannedEcts}
            onChange={(e) => setPlannedEcts(Number(e.target.value))}
            className="input w-full text-sm"
          />
        </div>
      </div>
      
      <div className="p-3 rounded-lg bg-[rgba(139,92,246,0.1)] text-center">
        <p className="text-xs text-[var(--text-muted)] mb-1">Neuer Durchschnitt</p>
        <p 
          className="text-3xl font-bold"
          style={{ 
            color: result <= 1.5 ? '#22c55e' : result <= 2.5 ? '#eab308' : '#ef4444'
          }}
        >
          {result.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

// Scenarios Tab Component
function ScenariosTab({ 
  scenarios, 
  entries,
  onSaveScenario,
  onLoadScenario 
}: { 
  scenarios: Scenario[];
  entries: GradeEntry[];
  onSaveScenario: (s: Scenario) => void;
  onLoadScenario: (s: Scenario) => void;
}) {
  const [newScenarioName, setNewScenarioName] = useState('');

  const saveCurrentAsScenario = () => {
    if (!newScenarioName.trim()) return;
    
    const avg = entries.reduce((sum, e) => sum + e.grade * e.weight, 0) / 
                entries.reduce((sum, e) => sum + e.weight, 0);
    
    onSaveScenario({
      id: Date.now().toString(),
      name: newScenarioName,
      entries,
      predictedGrade: avg,
    });
    setNewScenarioName('');
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Save Current Scenario */}
      <div className="card p-5">
        <h2 className="font-medium mb-4">Aktuelles Szenario speichern</h2>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Name</label>
            <input
              type="text"
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              className="input w-full"
              placeholder="z.B. Optimistisch 1.7"
            />
          </div>
          
          <button
            onClick={saveCurrentAsScenario}
            disabled={!newScenarioName.trim()}
            className="w-full py-2.5 rounded-lg bg-[#8b5cf6] text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Szenario speichern
          </button>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <p className="text-xs text-[var(--text-muted)] mb-2">Aktuelle Statistik</p>
          <p className="text-2xl font-bold text-[#8b5cf6]">
            {(entries.reduce((sum, e) => sum + e.grade * e.weight, 0) / 
              entries.reduce((sum, e) => sum + e.weight, 0)).toFixed(2)}
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            {entries.length} Module • {entries.reduce((sum, e) => sum + e.ects, 0)} ECTS
          </p>
        </div>
      </div>

      {/* Saved Scenarios */}
      <div className="card p-5">
        <h2 className="font-medium mb-4">Gespeicherte Szenarien</h2>
        
        <div className="space-y-2">
          {scenarios.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-8">
              Keine Szenarien gespeichert
            </p>
          ) : (
            scenarios.map(scenario => (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]"
              >
                <div>
                  <p className="font-medium text-sm">{scenario.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {scenario.entries.length} Module • Ø {scenario.predictedGrade.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onLoadScenario(scenario)}
                    className="px-3 py-1.5 rounded-lg bg-[#8b5cf6] text-white text-xs font-medium"
                  >
                    Laden
                  </button>
                  <button
                    onClick={() => {
                      const filtered = scenarios.filter(s => s.id !== scenario.id);
                      // Would need setScenarios here - simplified for now
                    }}
                    className="p-1.5 hover:bg-[var(--bg-hover)] rounded text-[var(--text-muted)]"
                  >
                    <Trash2 size={14} className="text-[#ef4444]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// History Chart Component
function HistoryChart({ entries }: { entries: GradeEntry[] }) {
  // Group by semester
  const bySemester = entries.reduce((acc, e) => {
    if (!acc[e.semester]) acc[e.semester] = [];
    acc[e.semester].push(e);
    return acc;
  }, {} as Record<number, GradeEntry[]>);

  const semesterAverages = Object.entries(bySemester).map(([sem, mods]) => ({
    semester: Number(sem),
    average: mods.reduce((sum, m) => sum + m.grade * m.ects, 0) / 
             mods.reduce((sum, m) => sum + m.ects, 0),
    ects: mods.reduce((sum, m) => sum + m.ects, 0),
  }));

  return (
    <div className="card p-5">
      <h2 className="font-medium mb-4 flex items-center gap-2">
        <TrendingUp size={16} className="text-[#8b5cf6]" />
        Noten-Historie nach Semester
      </h2>
      
      <div className="h-64 flex items-end justify-between gap-4 px-4">
        {semesterAverages.map(({ semester, average, ects }) => {
          const height = Math.min((average / 4) * 100, 100); // Max grade is 4.0
          
          return (
            <div key={semester} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative">
                <div 
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#8b5cf6] to-[#06b6d4] transition-all duration-500"
                  style={{ height: `${height}%`, minHeight: '20px' }}
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-bold">
                  {average.toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium">Sem. {semester}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{ects} ECTS</p>
              </div>
            </div>
          );
        })}
        
        {semesterAverages.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] w-full text-center py-16">
            Keine Daten verfügbar
          </p>
        )}
      </div>
    </div>
  );
}

// Add Entry Modal Component
function AddEntryModal({ 
  modules, 
  onClose, 
  onAdd 
}: { 
  modules: Module[];
  onClose: () => void;
  onAdd: (entry: GradeEntry) => void;
}) {
  const [selectedModule, setSelectedModule] = useState('');
  const [grade, setGrade] = useState(2.0);
  const [weight, setWeight] = useState(100);
  const [examDate, setExamDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const module = modules.find(m => m.id === selectedModule);
    if (!module) return;

    onAdd({
      id: Date.now().toString(),
      moduleId: module.id,
      moduleName: module.name,
      ects: module.ects,
      grade,
      weight,
      semester: module.semester,
      category: module.category,
      examDate,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Note hinzufügen</h2>
        
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
                <option key={m.id} value={m.id}>{m.name} ({m.ects} ECTS)</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Note</label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="input w-full"
              >
                {[1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0].map(g => (
                  <option key={g} value={g}>{g.toFixed(1)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Gewichtung (%)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="input w-full"
                min="1"
                max="100"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Klausurdatum</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="input w-full"
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
