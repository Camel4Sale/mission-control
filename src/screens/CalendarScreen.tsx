'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '@/types';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, X, Save, Trash2, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { loadFromStorage, saveToStorage, defaultEvents } from '@/lib/storage';

const STORAGE_KEY = 'mc_calendar';

type ViewMode = 'month' | 'week' | 'day';

const eventTypes = [
  { id: 'meeting', label: 'Meeting', color: '#f87171' },
  { id: 'reminder', label: 'Reminder', color: '#fbbf24' },
  { id: 'deadline', label: 'Deadline', color: '#f87171' },
  { id: 'recurring', label: 'Wiederkehrend', color: '#34d399' },
  { id: 'review', label: 'Review', color: '#5e6ad2' },
] as const;

interface EventModalProps {
  event: CalendarEvent | null;
  selectedDate: Date;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
}

function EventModal({ event, selectedDate, isOpen, onClose, onSave, onDelete }: EventModalProps) {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({});

  useEffect(() => {
    if (event) {
      setFormData({ ...event });
    } else {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      setFormData({
        title: '',
        date: dateStr,
        time: '09:00',
        description: '',
        type: 'meeting',
        color: '#f87171',
      });
    }
  }, [event, selectedDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: CalendarEvent = {
      id: event?.id || Date.now().toString(),
      title: formData.title || 'Untitled',
      date: formData.date || format(selectedDate, 'yyyy-MM-dd'),
      time: formData.time,
      description: formData.description,
      type: formData.type || 'meeting',
      color: formData.color || '#f87171',
    };
    onSave(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold">{event ? 'Termin bearbeiten' : 'Neuer Termin'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--bg-hover)] rounded">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titel *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="linear-input w-full"
              placeholder="Termin-Titel..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Datum</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="linear-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Uhrzeit</label>
              <input
                type="time"
                value={formData.time || ''}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="linear-input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Typ</label>
            <select
              value={formData.type || 'meeting'}
              onChange={e => {
                const type = e.target.value as CalendarEvent['type'];
                const color = eventTypes.find(t => t.id === type)?.color || '#f87171';
                setFormData({ ...formData, type, color });
              }}
              className="linear-input w-full"
            >
              {eventTypes.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Beschreibung</label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="linear-input w-full h-20 resize-none"
              placeholder="Beschreibung..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            {event && onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(event.id); onClose(); }}
                className="text-[var(--danger)] hover:bg-[var(--danger)]/10 px-3 py-2 rounded flex items-center gap-2"
              >
                <Trash2 size={16} />
                Löschen
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button type="button" onClick={onClose} className="linear-btn-secondary">
                Abbrechen
              </button>
              <button type="submit" className="linear-btn flex items-center gap-2">
                <Save size={16} />
                Speichern
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CalendarScreen() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  // Load events from localStorage
  useEffect(() => {
    const stored = loadFromStorage<CalendarEvent[]>(STORAGE_KEY, defaultEvents);
    setEvents(stored);
  }, []);

  // Save events to localStorage
  const saveEvents = useCallback((newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
    saveToStorage(STORAGE_KEY, newEvents);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Month view calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weeks = Math.ceil(days.length / 7);

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (e: CalendarEvent, date: Date) => {
    e.stopPropagation();
    setSelectedDate(date);
    setEditingEvent(e);
    setModalOpen(true);
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    const existingIndex = events.findIndex(ev => ev.id === event.id);
    let newEvents: CalendarEvent[];
    
    if (existingIndex >= 0) {
      newEvents = events.map(ev => ev.id === event.id ? event : ev);
      showToast('Termin aktualisiert');
    } else {
      newEvents = [...events, event];
      showToast('Termin erstellt');
    }
    
    saveEvents(newEvents);
  };

  const handleDeleteEvent = (id: string) => {
    const newEvents = events.filter(ev => ev.id !== id);
    saveEvents(newEvents);
    showToast('Termin gelöscht', 'error');
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="h-full flex flex-col">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-slideUp ${
          toast.type === 'success' ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'
        } text-white`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Kalender</h1>
          <p className="text-sm text-[var(--text-secondary)]">Termine & Events verwalten</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] p-1">
            {(['month', 'week', 'day'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded text-sm capitalize ${
                  viewMode === mode 
                    ? 'bg-[var(--accent)] text-white' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {mode === 'month' ? 'Monat' : mode === 'week' ? 'Woche' : 'Tag'}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => { setEditingEvent(null); setModalOpen(true); }}
            className="linear-btn flex items-center gap-2"
          >
            <Plus size={16} />
            Termin
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-md"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-lg font-medium min-w-[180px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: de })}
          </span>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-md"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        
        <button
          onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
          className="text-sm text-[var(--accent)] hover:underline"
        >
          Heute
        </button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Calendar Grid */}
        <div className="flex-1 card p-0 overflow-hidden flex flex-col">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-[var(--border)]">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-[var(--text-muted)] py-3">
                {day}
              </div>
            ))}
          </div>
          
          {/* Days grid */}
          <div className="flex-1 grid grid-cols-7 auto-rows-fr">
            {days.map((day, i) => {
              const dayEvents = getEventsForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => { setSelectedDate(day); handleDateClick(day); }}
                  className={`min-h-[80px] p-1 border-r border-b border-[var(--var(--border))] text-left transition-colors relative ${
                    isSelected 
                      ? 'bg-[var(--accent-muted)]' 
                      : isCurrentMonth ? 'hover:bg-[var(--bg-hover)]' : 'bg-[var(--bg-tertiary)]/50'
                  }`}
                >
                  <span className={`text-sm ${
                    !isCurrentMonth ? 'text-[var(--text-muted)] opacity-50' :
                    isToday ? 'text-[var(--accent)] font-bold' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  
                  {/* Events */}
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        onClick={(e) => handleEventClick(event, day)}
                        className="text-[10px] px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: event.color + '20', color: event.color }}
                      >
                        {event.time && <span className="opacity-70">{event.time} </span>}
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-[var(--text-muted)]">
                        +{dayEvents.length - 2} mehr
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Selected Date */}
        <div className="w-72 flex flex-col">
          <div className="card flex-1">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon size={18} className="text-[var(--accent)]" />
              <h2 className="font-semibold">
                {format(selectedDate, 'EEEE, d. MMMM', { locale: de })}
              </h2>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[var)] mb-4(--text-muted">Keine Termine</p>
                <button 
                  onClick={() => handleDateClick(selectedDate)}
                  className="text-sm text-[var(--accent)] hover:underline"
                >
                  + Termin hinzufügen
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map(event => (
                  <div 
                    key={event.id}
                    onClick={() => handleEventClick(event, selectedDate)}
                    className="p-3 rounded-lg cursor-pointer hover:scale-[1.02] transition-transform"
                    style={{ backgroundColor: event.color + '15', borderLeft: `3px solid ${event.color}` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{event.title}</span>
                      {event.time && (
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <Clock size={10} />
                          {event.time}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-xs text-[var(--text-secondary)]">{event.description}</p>
                    )}
                    <span className="inline-block mt-2 text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)]">
                      {eventTypes.find(t => t.id === event.type)?.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="card mt-4">
            <h3 className="text-sm font-medium mb-3">Kommende Termine</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {events
                .filter(e => new Date(e.date) >= new Date())
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 5)
                .map(event => (
                  <div 
                    key={event.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-[var(--bg-hover)] cursor-pointer"
                    onClick={() => { 
                      setSelectedDate(parseISO(event.date));
                      handleEventClick(event, parseISO(event.date));
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    <span className="text-sm flex-1 truncate">{event.title}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {format(parseISO(event.date), 'd.MM')}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        event={editingEvent}
        selectedDate={selectedDate}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEvent(null); }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
