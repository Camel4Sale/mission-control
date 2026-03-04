'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, GripVertical, Trash2, RotateCcw, Sun, Moon, Check, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

// KIT WiIng Master Module - offizielle Struktur
const allModules = [
  // BWL Pflicht (min. 18 ECTS)
  { id: 'fin1', name: 'Finance 1', ects: 6, category: 'bwl', subcategory: 'pflicht' },
  { id: 'fin2', name: 'Finance 2', ects: 6, category: 'bwl', subcategory: 'pflicht' },
  { id: 'controlling', name: 'Controlling', ects: 6, category: 'bwl', subcategory: 'pflicht' },
  
  // BWL Wahlpflicht
  { id: 'fin3', name: 'Finance 3', ects: 6, category: 'bwl', subcategory: 'wahlpflicht' },
  { id: 'marketing', name: 'Marketing and Sales Management', ects: 6, category: 'bwl', subcategory: 'wahlpflicht' },
  { id: 'business', name: 'Business Strategy', ects: 6, category: 'bwl', subcategory: 'wahlpflicht' },
  
  // VWL (min. 6 ECTS)
  { id: 'vwl', name: 'Volkswirtschaftslehre (VWL)', ects: 6, category: 'vwl', subcategory: 'pflicht' },
  { id: 'vwl2', name: 'Applied Economics', ects: 6, category: 'vwl', subcategory: 'wahlpflicht' },
  
  // Informatik (min. 6 ECTS)
  { id: 'inf', name: 'Informatik', ects: 6, category: 'informatik', subcategory: 'pflicht' },
  { id: 'mlds', name: 'Advanced Machine Learning and Data Science', ects: 6, category: 'informatik', subcategory: 'wahlpflicht' },
  { id: 'ai', name: 'Artificial Intelligence', ects: 6, category: 'informatik', subcategory: 'wahlpflicht' },
  
  // Operations Research (min. 6 ECTS)
  { id: 'or', name: 'Operations Research', ects: 6, category: 'or', subcategory: 'pflicht' },
  { id: 'or_sc', name: 'Operations Research im Supply Chain Management', ects: 6, category: 'or', subcategory: 'wahlpflicht' },
  { id: 'optim', name: 'Optimization', ects: 6, category: 'or', subcategory: 'wahlpflicht' },
  
  // Ingenieurwissenschaften (min. 6 ECTS)
  { id: 'ing', name: 'Ingenieurwissenschaften', ects: 6, category: 'ingenieur', subcategory: 'pflicht' },
  { id: 'logistik', name: 'Logistik und Supply Chain Management', ects: 6, category: 'ingenieur', subcategory: 'wahlpflicht' },
  { id: 'produktion', name: 'Produktionstechnik', ects: 6, category: 'ingenieur', subcategory: 'wahlpflicht' },
  { id: 'maschinen', name: 'Maschinenbau Grundlagen', ects: 6, category: 'ingenieur', subcategory: 'wahlpflicht' },
  
  // Wahlpflicht (Rest bis 90)
  { id: 'analytics', name: 'Analytics und Statistik', ects: 6, category: 'wahlpflicht', subcategory: 'wahlpflicht' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', ects: 6, category: 'wahlpflicht', subcategory: 'wahlpflicht' },
  { id: 'innovation', name: 'Innovation Management', ects: 6, category: 'wahlpflicht', subcategory: 'wahlpflicht' },
  { id: 'ustainability', name: 'Sustainability', ects: 6, category: 'wahlpflicht', subcategory: 'wahlpflicht' },
];

// KIT Anforderungen pro Kategorie
const categoryRequirements: Record<string, { label: string; minEcts: number; color: string; bg: string }> = {
  bwl: { label: 'BWL', minEcts: 18, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  vwl: { label: 'VWL', minEcts: 6, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  informatik: { label: 'Informatik', minEcts: 6, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  or: { label: 'Operations Research', minEcts: 6, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  ingenieur: { label: 'Ingenieurwissenschaften', minEcts: 6, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  wahlpflicht: { label: 'Wahlpflicht', minEcts: 30, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
};

const subcategoryLabels: Record<string, string> = {
  pflicht: 'Pflicht',
  wahlpflicht: 'Wahlpflicht',
};

interface Module {
  id: string;
  name: string;
  ects: number;
  category: string;
  subcategory: string;
}

export default function PlanerPage() {
  const [selectedModules, setSelectedModules] = useState<Module[]>([]);
  const [draggedModule, setDraggedModule] = useState<Module | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['bwl', 'vwl', 'informatik', 'or', 'ingenieur', 'wahlpflicht']));

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kit-modul-planer');
    if (saved) {
      try {
        setSelectedModules(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved modules:', e);
      }
    }
    
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      setDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('kit-modul-planer', JSON.stringify(selectedModules));
  }, [selectedModules]);

  // Calculate ECTS per category
  const ectsByCategory = selectedModules.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + m.ects;
    return acc;
  }, {} as Record<string, number>);

  const totalEcts = selectedModules.reduce((sum, m) => sum + m.ects, 0);
  const remainingEcts = 90 - totalEcts; // 90 ohne Masterarbeit

  // Check if category requirements are met
  const categoryStatus = Object.entries(categoryRequirements).map(([cat, req]) => {
    const earned = ectsByCategory[cat] || 0;
    return {
      category: cat,
      ...req,
      earned,
      isMet: earned >= req.minEcts,
      remaining: Math.max(0, req.minEcts - earned),
    };
  });

  const allRequirementsMet = categoryStatus.every(c => c.isMet);
  const isMasterReady = allRequirementsMet && totalEcts >= 90;

  // Get available modules
  const availableModules = allModules.filter(
    (m) => !selectedModules.find((s) => s.id === m.id)
  );

  // Group by category
  const availableByCategory = availableModules.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {} as Record<string, Module[]>);

  const selectedByCategory = selectedModules.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {} as Record<string, Module[]>);

  // Drag & Drop handlers
  const handleDragStart = (module: Module) => {
    setDraggedModule(module);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setDraggedModule(null);
    setIsDragging(false);
  };

  const handleDropToSelected = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedModule) {
      if (!selectedModules.find((m) => m.id === draggedModule.id)) {
        setSelectedModules([...selectedModules, draggedModule]);
      }
    }
    handleDragEnd();
  };

  const handleRemoveModule = (moduleId: string) => {
    setSelectedModules(selectedModules.filter((m) => m.id !== moduleId));
  };

  const handleReset = () => {
    setSelectedModules([]);
    localStorage.removeItem('kit-modul-planer');
    setShowResetConfirm(false);
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap size={28} className="text-[#8b5cf6]" />
          <div>
            <h1 className="text-2xl font-semibold">Modul-Planer</h1>
            <p className="text-sm text-[var(--text-secondary)]">KIT WiIng Master • 90 ECTS (+30 Masterarbeit)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="btn btn-secondary" title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setShowResetConfirm(true)} className="btn btn-secondary" title="Zurücksetzen">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Haupt-Counter */}
      <div className={`card p-5 ${isMasterReady ? 'ring-2 ring-[#22c55e]' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">Gesamtfortschritt</span>
            {isMasterReady ? (
              <span className="badge bg-[rgba(34,197,94,0.15)] text-[#22c55e] flex items-center gap-1">
                <Check size={12} /> Master Ready!
              </span>
            ) : (
              <span className="badge bg-[rgba(245,158,11,0.15)] text-[#f59e0b]">
                {remainingEcts} ECTS fehlen
              </span>
            )}
          </div>
          <div className="text-right">
            <span className={`text-4xl font-bold ${isMasterReady ? 'text-[#22c55e]' : 'text-[#8b5cf6]'}`}>
              {totalEcts}
            </span>
            <span className="text-[var(--text-muted)]"> / 90 ECTS</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-bar h-4 mb-4">
          <div 
            className={`progress-bar-fill ${isMasterReady ? 'bg-[#22c55e]' : 'bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]'}`}
            style={{ width: `${Math.min((totalEcts / 90) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Kategorie-Fortschritte */}
      <div className="grid grid-cols-3 gap-3">
        {categoryStatus.map((cat) => {
          const config = categoryRequirements[cat.category];
          const percent = Math.min((cat.earned / cat.minEcts) * 100, 100);
          
          return (
            <div 
              key={cat.category} 
              className={`card p-4 ${!cat.isMet && cat.earned > 0 ? 'ring-1 ring-[#ef4444]/30' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                  <span className="font-medium text-sm">{config.label}</span>
                </div>
                {cat.isMet ? (
                  <Check size={16} className="text-[#22c55e]" />
                ) : cat.earned > 0 ? (
                  <AlertTriangle size={16} className="text-[#ef4444]" />
                ) : null}
              </div>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold" style={{ color: config.color }}>{cat.earned}</span>
                <span className="text-sm text-[var(--text-muted)]">/ {config.minEcts} ECTS</span>
              </div>
              
              <div className="progress-bar h-2">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${percent}%`, backgroundColor: config.color }}
                />
              </div>
              
              {!cat.isMet && (
                <p className="text-xs text-[#ef4444] mt-2 flex items-center gap-1">
                  <AlertTriangle size={10} />
                  Noch {cat.remaining} ECTS benötigt
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Drag & Drop Area */}
      <div className="grid grid-cols-2 gap-6">
        {/* Verfügbare Module */}
        <div className="space-y-3">
          <h2 className="font-medium text-[var(--text-secondary)] flex items-center gap-2">
            📚 Verfügbare Module
            <span className="text-xs bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
              {availableModules.length}
            </span>
          </h2>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {Object.entries(availableByCategory).map(([category, modules]) => {
              const config = categoryRequirements[category];
              const isExpanded = expandedCategories.has(category);
              const categoryEcts = modules.reduce((s, m) => s + m.ects, 0);
              
              return (
                <div key={category}>
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between mb-2 p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: config.color }}>
                        {config.label}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        ({categoryEcts} ECTS verfügbar)
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  
                  {isExpanded && (
                    <div className="space-y-2 ml-2">
                      {modules.map((module) => {
                        const subcatLabel = subcategoryLabels[module.subcategory] || module.subcategory;
                        return (
                          <div
                            key={module.id}
                            draggable
                            onDragStart={() => handleDragStart(module)}
                            onDragEnd={handleDragEnd}
                            className={`card p-3 cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-[1.02] ${
                              isDragging ? 'opacity-50' : ''
                            }`}
                            style={{ borderLeftColor: config.color, borderLeftWidth: 3 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <GripVertical size={14} className="text-[var(--text-muted)]" />
                                <span className="text-sm font-medium">{module.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  module.subcategory === 'pflicht' 
                                    ? 'bg-[rgba(139,92,246,0.15)] text-[#8b5cf6]' 
                                    : 'bg-[rgba(236,72,153,0.15)] text-[#ec4899]'
                                }`}>
                                  {subcatLabel}
                                </span>
                                <span className="text-xs bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                                  {module.ects} ECTS
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mein Plan - Drop Zone */}
        <div className="space-y-3">
          <h2 className="font-medium text-[var(--text-secondary)] flex items-center gap-2">
            🎯 Mein Plan
            <span className="text-xs bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
              {selectedModules.length}
            </span>
          </h2>
          
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropToSelected}
            className={`min-h-[500px] rounded-xl border-2 border-dashed transition-all duration-200 ${
              isDragging 
                ? 'border-[#8b5cf6] bg-[rgba(139,92,246,0.1)]' 
                : 'border-[var(--border)]'
            }`}
          >
            {selectedModules.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[500px] text-[var(--text-muted)]">
                <GraduationCap size={48} className="mb-4 opacity-30" />
                <p className="text-sm">Module hierher ziehen</p>
                <p className="text-xs mt-1">Ziehe Module aus der Liste links</p>
              </div>
            ) : (
              <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                {Object.entries(selectedByCategory).map(([category, modules]) => {
                  const config = categoryRequirements[category];
                  const catStatus = categoryStatus.find(c => c.category === category);
                  const categoryEcts = modules.reduce((s, m) => s + m.ects, 0);
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                          <span className="text-xs font-medium uppercase tracking-wide" style={{ color: config.color }}>
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${catStatus?.isMet ? 'text-[#22c55e]' : 'text-[var(--text-muted)]'}`}>
                            {categoryEcts} / {config.minEcts} ECTS
                          </span>
                          {catStatus?.isMet && <Check size={12} className="text-[#22c55e]" />}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {modules.map((module) => {
                          const subcatLabel = subcategoryLabels[module.subcategory] || module.subcategory;
                          return (
                            <div
                              key={module.id}
                              className="card p-3 flex items-center justify-between group"
                              style={{ borderLeftColor: config.color, borderLeftWidth: 3 }}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{module.name}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                  module.subcategory === 'pflicht' 
                                    ? 'bg-[rgba(139,92,246,0.15)] text-[#8b5cf6]' 
                                    : 'bg-[rgba(236,72,153,0.15)] text-[#ec4899]'
                                }`}>
                                  {subcatLabel}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                                  {module.ects} ECTS
                                </span>
                                <button
                                  onClick={() => handleRemoveModule(module.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[rgba(239,68,68,0.15)] rounded"
                                  title="Entfernen"
                                >
                                  <Trash2 size={14} className="text-[#ef4444]" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Plan zurücksetzen?</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Möchtest du wirklich alle ausgewählten Module entfernen?
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowResetConfirm(false)} className="btn btn-secondary">
                Abbrechen
              </button>
              <button onClick={handleReset} className="btn bg-[#ef4444] text-white hover:bg-[#dc2626]">
                Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
