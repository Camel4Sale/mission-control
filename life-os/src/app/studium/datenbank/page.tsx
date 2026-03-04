'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Search, Filter, MoreHorizontal, Trash2, Edit2, Copy, 
  GripVertical, Calendar, List, LayoutGrid, Table as TableIcon,
  Check, X, ChevronDown, ChevronRight, Tag, Clock, Flag, Hash,
  ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';

// Property Types
type PropertyType = 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'checkbox' | 'tags';

interface Property {
  id: string;
  name: string;
  type: PropertyType;
  options?: string[]; // For select/multi-select
}

interface DatabaseItem {
  id: string;
  name: string;
  [key: string]: any; // Dynamic properties
}

// Property configuration for the database
const defaultProperties: Property[] = [
  { id: 'status', name: 'Status', type: 'select', options: ['To Do', 'In Progress', 'Done'] },
  { id: 'tags', name: 'Tags', type: 'multi-select', options: ['Wichtig', 'Uni', 'Arbeit', 'Privat', 'Lernen', 'Projekt'] },
  { id: 'date', name: 'Datum', type: 'date' },
  { id: 'priority', name: 'Priorität', type: 'select', options: ['🔴 Hoch', '🟡 Mittel', '🟢 Niedrig'] },
  { id: 'estimatedHours', name: 'Aufwand (h)', type: 'number' },
  { id: 'completed', name: 'Erledigt', type: 'checkbox' },
];

// View Types
type ViewType = 'table' | 'board' | 'calendar' | 'list' | 'gallery';

interface View {
  id: string;
  name: string;
  type: ViewType;
}

// Sample data
const sampleData: DatabaseItem[] = [
  { id: '1', name: 'Klausur Marketing vorbereiten', status: 'In Progress', tags: ['Uni', 'Wichtig'], date: '2026-03-15', priority: '🔴 Hoch', estimatedHours: 8, completed: false },
  { id: '2', name: 'Masterarbeit Literaturrecherche', status: 'To Do', tags: ['Uni', 'Projekt'], date: '2026-03-20', priority: '🔴 Hoch', estimatedHours: 20, completed: false },
  { id: '3', name: 'Finance 1 Übungsblätter', status: 'Done', tags: ['Uni', 'Lernen'], date: '2026-03-10', priority: '🟡 Mittel', estimatedHours: 5, completed: true },
  { id: '4', name: 'Projektmeeting Pathium', status: 'In Progress', tags: ['Arbeit', 'Projekt'], date: '2026-03-05', priority: '🟡 Mittel', estimatedHours: 2, completed: false },
  { id: '5', name: 'Notizen aus Vorlesung', status: 'Done', tags: ['Uni', 'Lernen'], date: '2026-03-01', priority: '🟢 Niedrig', estimatedHours: 1, completed: true },
  { id: '6', name: 'Bewerbung schreiben', status: 'To Do', tags: ['Privat', 'Wichtig'], date: '2026-04-01', priority: '🔴 Hoch', estimatedHours: 4, completed: false },
];

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// ===== VIEWS =====

// Table View Component
function TableView({ 
  data, 
  properties, 
  onUpdate, 
  onDelete,
  sortConfig,
  onSort
}: { 
  data: DatabaseItem[]; 
  properties: Property[];
  onUpdate: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
}) {
  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={12} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  const renderCell = (item: DatabaseItem, prop: Property) => {
    const value = item[prop.id];
    
    switch (prop.type) {
      case 'checkbox':
        return (
          <button
            onClick={() => onUpdate(item.id, prop.id, !value)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              value ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[var(--border)]'
            }`}
          >
            {value && <Check size={12} className="text-white" />}
          </button>
        );
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onUpdate(item.id, prop.id, e.target.value)}
            className="bg-transparent border-none text-sm focus:outline-none"
          >
            <option value="">—</option>
            {prop.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'multi-select':
        return (
          <div className="flex flex-wrap gap-1">
            {(value || []).map((tag: string) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">
                {tag}
              </span>
            ))}
            <button
              onClick={() => {
                // Simple add tag dialog
                const newTag = prompt('Tag hinzufügen:', '');
                if (newTag && prop.options?.includes(newTag)) {
                  onUpdate(item.id, prop.id, [...(value || []), newTag]);
                }
              }}
              className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)]"
            >
              +
            </button>
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onUpdate(item.id, prop.id, e.target.value)}
            className="bg-transparent border-none text-sm focus:outline-none"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onUpdate(item.id, prop.id, parseFloat(e.target.value) || 0)}
            className="bg-transparent border-none text-sm w-16 focus:outline-none"
          />
        );
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onUpdate(item.id, prop.id, e.target.value)}
            className="bg-transparent border-none text-sm focus:outline-none w-full"
          />
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="text-left p-3 w-8">
              <GripVertical size={14} className="text-[var(--text-muted)]" />
            </th>
            <th className="text-left p-3 min-w-[200px]">
              <button onClick={() => onSort('name')} className="flex items-center gap-1 font-medium text-sm">
                Name
                <SortIcon columnKey="name" />
              </button>
            </th>
            {properties.map(prop => (
              <th key={prop.id} className="text-left p-3 min-w-[120px]">
                <button onClick={() => onSort(prop.id)} className="flex items-center gap-1 font-medium text-sm">
                  {prop.name}
                  <SortIcon columnKey={prop.id} />
                </button>
              </th>
            ))}
            <th className="text-left p-3 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-hover)] group">
              <td className="p-3">
                <GripVertical size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 cursor-grab" />
              </td>
              <td className="p-3">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
                  className="bg-transparent border-none font-medium focus:outline-none w-full"
                />
              </td>
              {properties.map(prop => (
                <td key={prop.id} className="p-3">
                  {renderCell(item, prop)}
                </td>
              ))}
              <td className="p-3">
                <button
                  onClick={() => onDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[rgba(239,68,68,0.15)] rounded transition-opacity"
                >
                  <Trash2 size={14} className="text-[#ef4444]" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Board View Component (Kanban)
function BoardView({ 
  data, 
  properties,
  onUpdate,
  onDelete
}: { 
  data: DatabaseItem[]; 
  properties: Property[];
  onUpdate: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
}) {
  const statusOptions = properties.find(p => p.id === 'status')?.options || ['To Do', 'In Progress', 'Done'];
  
  const statusColors: Record<string, string> = {
    'To Do': 'bg-[var(--bg-tertiary)]',
    'In Progress': 'bg-[rgba(245,158,11,0.15)]',
    'Done': 'bg-[rgba(34,197,94,0.15)]',
  };

  const getPriorityColor = (priority: string) => {
    if (priority?.includes('Hoch')) return 'text-[#ef4444]';
    if (priority?.includes('Mittel')) return 'text-[#f59e0b]';
    return 'text-[#22c55e]';
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
      {statusOptions.map(status => {
        const items = data.filter(item => item.status === status);
        
        return (
          <div key={status} className="flex-shrink-0 w-72">
            <div className={`rounded-t-lg px-3 py-2 font-medium text-sm flex items-center justify-between ${statusColors[status]}`}>
              <span>{status}</span>
              <span className="text-xs bg-[var(--bg-primary)] px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-b-lg p-2 min-h-[400px] space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className="card p-3 cursor-pointer hover:ring-1 hover:ring-[var(--accent)] transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
                      className="bg-transparent border-none font-medium text-sm focus:outline-none flex-1 mr-2"
                    />
                    <button
                      onClick={() => onDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1"
                    >
                      <Trash2 size={12} className="text-[#ef4444]" />
                    </button>
                  </div>
                  
                  {/* Tags */}
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </span>
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(item.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => {
                  const newItem: DatabaseItem = {
                    id: generateId(),
                    name: 'Neuer Eintrag',
                    status,
                    tags: [],
                    date: '',
                    priority: '🟡 Mittel',
                    estimatedHours: 0,
                    completed: false,
                  };
                  onUpdate(newItem.id, 'status', status);
                  // This would need to be handled differently - for now we just add
                }}
                className="w-full p-2 rounded-lg border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Hinzufügen
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Calendar View Component
function CalendarView({ 
  data, 
  onUpdate 
}: { 
  data: DatabaseItem[]; 
  onUpdate: (id: string, field: string, value: any) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  
  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return data.filter(item => item.date === dateStr);
  };

  const getPriorityColor = (priority: string) => {
    if (priority?.includes('Hoch')) return 'bg-[#ef4444]';
    if (priority?.includes('Mittel')) return 'bg-[#f59e0b]';
    return 'bg-[#22c55e]';
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  return (
    <div className="h-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="btn btn-secondary px-3">
            ←
          </button>
          <button onClick={() => setCurrentDate(new Date(2026, 2, 1))} className="btn btn-secondary text-sm">
            Heute
          </button>
          <button onClick={nextMonth} className="btn btn-secondary px-3">
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-[var(--text-muted)] p-2">
            {day}
          </div>
        ))}
        
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px] bg-[var(--bg-secondary)] rounded" />
        ))}
        
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const events = getEventsForDay(day);
          const isToday = currentDate.getMonth() === 2 && currentDate.getFullYear() === 2026 && day === 4;
          
          return (
            <div 
              key={day} 
              className={`min-h-[100px] bg-[var(--bg-secondary)] rounded p-1 ${
                isToday ? 'ring-2 ring-[var(--accent)]' : ''
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-[var(--accent)]' : ''}`}>
                {day}
              </div>
              <div className="space-y-1">
                {events.map(event => (
                  <div
                    key={event.id}
                    className={`text-[10px] px-1.5 py-0.5 rounded text-white truncate ${getPriorityColor(event.priority)}`}
                    title={event.name}
                  >
                    {event.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// List View Component
function ListView({ 
  data, 
  properties,
  onUpdate,
  onDelete
}: { 
  data: DatabaseItem[]; 
  properties: Property[];
  onUpdate: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-[#22c55e]';
      case 'In Progress': return 'bg-[#f59e0b]';
      default: return 'bg-[var(--bg-tertiary)]';
    }
  };

  return (
    <div className="space-y-1">
      {data.map(item => (
        <div 
          key={item.id}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--bg-hover)] group"
        >
          <button
            onClick={() => onUpdate(item.id, 'completed', !item.completed)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
              item.completed ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[var(--border)]'
            }`}
          >
            {item.completed && <Check size={12} className="text-white" />}
          </button>
          
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
            className={`flex-1 bg-transparent border-none focus:outline-none ${
              item.completed ? 'line-through text-[var(--text-muted)]' : ''
            }`}
          />
          
          <div className="flex items-center gap-3 flex-shrink-0">
            {item.status && (
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)} text-white`}>
                {item.status}
              </span>
            )}
            
            {item.tags?.length > 0 && (
              <div className="flex gap-1">
                {item.tags.slice(0, 2).map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">
                    {tag}
                  </span>
                ))}
                {item.tags.length > 2 && (
                  <span className="text-xs text-[var(--text-muted)]">+{item.tags.length - 2}</span>
                )}
              </div>
            )}
            
            {item.date && (
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Calendar size={12} />
                {new Date(item.date).toLocaleDateString('de-DE')}
              </span>
            )}
            
            <button
              onClick={() => onDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[rgba(239,68,68,0.15)] rounded transition-opacity"
            >
              <Trash2 size={14} className="text-[#ef4444]" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Gallery View Component
function GalleryView({ 
  data, 
  properties,
  onUpdate,
  onDelete
}: { 
  data: DatabaseItem[]; 
  properties: Property[];
  onUpdate: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'text-[#22c55e]';
      case 'In Progress': return 'text-[#f59e0b]';
      default: return 'text-[var(--text-muted)]';
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority?.includes('Hoch')) return 'bg-[#ef4444]';
    if (priority?.includes('Mittel')) return 'bg-[#f59e0b]';
    return 'bg-[#22c55e]';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map(item => (
        <div
          key={item.id}
          className="card p-4 hover:ring-1 hover:ring-[var(--accent)] transition-all cursor-pointer group"
        >
          {/* Card Header - colored bar */}
          <div className={`h-1 rounded-full mb-3 ${getPriorityColor(item.priority)}`} />
          
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(item.id, 'completed', !item.completed);
            }}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mb-2 ${
              item.completed ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[var(--border)]'
            }`}
          >
            {item.completed && <Check size={12} className="text-white" />}
          </button>
          
          {/* Name */}
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
            className="w-full bg-transparent border-none font-medium mb-2 focus:outline-none"
          />
          
          {/* Status */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
          
          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {item.tags.map((tag: string) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)]">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
            {item.date && (
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Calendar size={10} />
                {new Date(item.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
              </span>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[rgba(239,68,68,0.15)] rounded transition-opacity"
            >
              <Trash2 size={12} className="text-[#ef4444]" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== MAIN COMPONENT =====

export default function DatabasePage() {
  const [data, setData] = useState<DatabaseItem[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [views, setViews] = useState<View[]>([
    { id: 'default-table', name: 'Table', type: 'table' },
    { id: 'default-board', name: 'Board', type: 'board' },
    { id: 'default-calendar', name: 'Calendar', type: 'calendar' },
    { id: 'default-list', name: 'List', type: 'list' },
    { id: 'default-gallery', name: 'Gallery', type: 'gallery' },
  ]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('life-os-database');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved data:', e);
        setData(sampleData);
      }
    } else {
      setData(sampleData);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem('life-os-database', JSON.stringify(data));
    }
  }, [data]);

  // Filter data
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort data
  const sortedData = useCallback(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === undefined || aVal === '') return 1;
      if (bVal === undefined || bVal === '') return -1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // CRUD Operations
  const handleUpdate = (id: string, field: string, value: any) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddNew = () => {
    const newItem: DatabaseItem = {
      id: generateId(),
      name: 'Neuer Eintrag',
      status: 'To Do',
      tags: [],
      date: '',
      priority: '🟡 Mittel',
      estimatedHours: 0,
      completed: false,
    };
    setData([...data, newItem]);
    setShowNewItemForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Möchtest du diesen Eintrag wirklich löschen?')) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const viewIcons: Record<ViewType, React.ReactNode> = {
    table: <TableIcon size={16} />,
    board: <LayoutGrid size={16} />,
    calendar: <Calendar size={16} />,
    list: <List size={16} />,
    gallery: <LayoutGrid size={16} />,
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
            <DatabaseIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Datenbank</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {data.length} Einträge • {filteredData.length} angezeigt
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAddNew}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Neuer Eintrag
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] w-64"
          />
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-secondary)] rounded-lg">
          {(views).map(view => (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.type)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                currentView === view.type 
                  ? 'bg-[var(--accent)] text-white' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {viewIcons[view.type]}
              <span className="hidden md:inline">{view.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-auto">
        {currentView === 'table' && (
          <TableView 
            data={sortedData()} 
            properties={defaultProperties}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}
        
        {currentView === 'board' && (
          <BoardView 
            data={sortedData()} 
            properties={defaultProperties}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
        
        {currentView === 'calendar' && (
          <CalendarView 
            data={sortedData()} 
            onUpdate={handleUpdate}
          />
        )}
        
        {currentView === 'list' && (
          <ListView 
            data={sortedData()} 
            properties={defaultProperties}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
        
        {currentView === 'gallery' && (
          <GalleryView 
            data={sortedData()} 
            properties={defaultProperties}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}

        {sortedData().length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
            <DatabaseIcon size={48} className="mb-4 opacity-30" />
            <p className="text-lg mb-2">Keine Einträge gefunden</p>
            <p className="text-sm mb-4">Erstelle einen neuen Eintrag, um zu beginnen</p>
            <button onClick={handleAddNew} className="btn btn-primary">
              <Plus size={16} className="mr-2" />
              Neuer Eintrag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Database Icon component
function DatabaseIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
