'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Clock, MapPin, User, Tag, X, Edit2, Trash2
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime?: string;
  category: string;
  location?: string;
  attendees?: string[];
}

const categories = [
  { id: 'uni', label: 'Uni', color: '#8b5cf6' },
  { id: 'arbeit', label: 'Arbeit', color: '#f59e0b' },
  { id: 'privat', label: 'Privat', color: '#22c55e' },
  { id: 'klausur', label: 'Klausur', color: '#ef4444' },
  { id: 'meeting', label: 'Meeting', color: '#06b6d4' },
];

const sampleEvents: CalendarEvent[] = [
  { id: '1', title: 'Vorlesung Finance 1', startDate: '2026-03-04', startTime: '09:00', endTime: '11:00', category: 'uni', location: 'Hörsaal A', attendees: [] },
  { id: '2', title: 'Projektmeeting Pathium', startDate: '2026-03-04', startTime: '14:00', endTime: '15:30', category: 'arbeit', location: 'Zoom', attendees: [] },
  { id: '3', title: 'Übung Operations Research', startDate: '2026-03-05', startTime: '10:00', endTime: '12:00', category: 'uni', location: 'Raum 301', attendees: [] },
  { id: '4', title: 'Klausur Marketing', startDate: '2026-03-15', startTime: '08:00', endTime: '10:00', category: 'klausur', location: 'Hörsaal B', attendees: [] },
  { id: '5', title: 'Masterarbeit Besprechung', startDate: '2026-03-10', startTime: '13:00', endTime: '14:00', category: 'uni', location: 'Büro Prof. Müller', attendees: [] },
  { id: '6', title: 'Bewerbungsgespräch', startDate: '2026-03-08', startTime: '10:30', endTime: '11:30', category: 'arbeit', location: 'Firma XYZ', attendees: [] },
  { id: '7', title: 'Geburtstag', startDate: '2026-03-20', startTime: '19:00', endTime: '23:00', category: 'privat', location: 'Restaurant', attendees: [] },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper functions
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const weekDaysFull = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

export default function KalenderPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    startDate: '',
    startTime: '09:00',
    endTime: '10:00',
    category: 'uni',
    location: '',
  });

  // Load events from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('life-os-calendar');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        setEvents(sampleEvents);
      }
    } else {
      setEvents(sampleEvents);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('life-os-calendar', JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.startDate === dateStr);
  };

  const getCategoryColor = (catId: string) => categories.find(c => c.id === catId)?.color || '#6366f1';

  // Navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date(2026, 2, 1));

  // CRUD
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startDate) return;
    
    const event: CalendarEvent = {
      id: generateId(),
      title: newEvent.title,
      description: newEvent.description,
      startDate: newEvent.startDate,
      startTime: newEvent.startTime || '09:00',
      endTime: newEvent.endTime,
      category: newEvent.category || 'uni',
      location: newEvent.location,
      attendees: newEvent.attendees,
    };
    
    setEvents([...events, event]);
    setShowEventModal(false);
    setNewEvent({ title: '', startDate: '', startTime: '09:00', endTime: '10:00', category: 'uni', location: '' });
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setNewEvent(event);
    setShowEventModal(true);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !newEvent.title) return;
    
    setEvents(events.map(e => 
      e.id === editingEvent.id ? { ...e, ...newEvent } as CalendarEvent : e
    ));
    setShowEventModal(false);
    setEditingEvent(null);
    setNewEvent({ title: '', startDate: '', startTime: '09:00', endTime: '10:00', category: 'uni', location: '' });
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Möchtest du dieses Event wirklich löschen?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const openNewEventModal = (date?: string) => {
    setEditingEvent(null);
    setNewEvent({
      title: '',
      startDate: date || `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
      startTime: '09:00',
      endTime: '10:00',
      category: 'uni',
      location: '',
    });
    setShowEventModal(true);
  };

  // Week view
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  // Day view
  const getSelectedDayEvents = () => {
    if (!selectedDate) return [];
    return events.filter(e => e.startDate === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#22c55e] flex items-center justify-center">
            <CalendarIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Kalender</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {events.length} Events • {monthNames[month]} {year}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => openNewEventModal()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Neues Event
          </button>
        </div>
      </div>

      {/* View Switcher & Navigation */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="btn btn-secondary px-2">
            <ChevronLeft size={18} />
          </button>
          <button onClick={goToToday} className="btn btn-secondary text-sm px-3">
            Heute
          </button>
          <button onClick={nextMonth} className="btn btn-secondary px-2">
            <ChevronRight size={18} />
          </button>
          <h2 className="text-lg font-semibold ml-2">
            {monthNames[month]} {year}
          </h2>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-secondary)] rounded-lg">
          {(['month', 'week', 'day'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                view === v 
                  ? 'bg-[var(--accent)] text-white' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {v === 'month' ? 'Monat' : v === 'week' ? 'Woche' : 'Tag'}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-auto">
        {view === 'month' && (
          <div className="h-full flex flex-col">
            {/* Week day headers */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-[var(--text-muted)] py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="flex-1 grid grid-cols-7 gap-1 auto-rows-fr">
              {/* Empty cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-[var(--bg-secondary)] rounded-lg" />
              ))}
              
              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvents = getEventsForDay(day);
                const isToday = dateStr === '2026-03-04';
                const isSelected = selectedDate === dateStr;
                
                return (
                  <div 
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`bg-[var(--bg-secondary)] rounded-lg p-2 min-h-[100px] cursor-pointer transition-all ${
                      isToday ? 'ring-2 ring-[var(--accent)]' : ''
                    } ${isSelected ? 'ring-2 ring-[var(--accent)] bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-[var(--accent)]' : ''}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                          className="text-[10px] px-1.5 py-0.5 rounded text-white truncate cursor-pointer hover:opacity-80"
                          style={{ backgroundColor: getCategoryColor(event.category) }}
                          title={event.title}
                        >
                          {event.startTime} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-[var(--text-muted)]">
                          +{dayEvents.length - 3} mehr
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'week' && (
          <div className="h-full flex flex-col">
            <div className="grid grid-cols-8 flex-1 gap-1">
              {/* Time column */}
              <div className="border-r border-[var(--border)] pr-2">
                {Array.from({ length: 14 }, (_, i) => (
                  <div key={i} className="h-12 text-xs text-[var(--text-muted)] text-right pr-2">
                    {String(8 + i).padStart(2, '0')}:00
                  </div>
                ))}
              </div>
              
              {/* Week days */}
              {getWeekDays().map((date, idx) => {
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const dayEvents = events.filter(e => e.startDate === dateStr);
                const isToday = dateStr === '2026-03-04';
                
                return (
                  <div key={idx} className="border-r border-[var(--border)] last:border-r-0">
                    <div className={`text-center py-2 border-b border-[var(--border)] ${isToday ? 'bg-[var(--accent)]/10' : ''}`}>
                      <div className="text-xs text-[var(--text-muted)]">{weekDays[idx]}</div>
                      <div className={`text-lg font-semibold ${isToday ? 'text-[var(--accent)]' : ''}`}>
                        {date.getDate()}
                      </div>
                    </div>
                    <div className="relative h-[336px]">
                      {dayEvents.map(event => {
                        const startHour = parseInt(event.startTime.split(':')[0]);
                        const startMin = parseInt(event.startTime.split(':')[1]);
                        const endHour = event.endTime ? parseInt(event.endTime.split(':')[0]) : startHour + 1;
                        const endMin = event.endTime ? parseInt(event.endTime.split(':')[1]) : 0;
                        const duration = (endHour - startHour) * 60 + (endMin - startMin);
                        
                        return (
                          <div
                            key={event.id}
                            onClick={() => handleEditEvent(event)}
                            className="absolute left-1 right-1 text-[10px] text-white rounded px-1 py-0.5 cursor-pointer hover:opacity-80 overflow-hidden"
                            style={{
                              top: `${(startHour - 8) * 48 + (startMin / 60) * 48}px`,
                              height: `${(duration / 60) * 48}px`,
                              backgroundColor: getCategoryColor(event.category),
                            }}
                            title={event.title}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="opacity-80">{event.startTime} - {event.endTime}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'day' && (
          <div className="h-full flex">
            {/* Day view */}
            <div className="flex-1 border-r border-[var(--border)] pr-4">
              <div className="text-center py-4 mb-4">
                <div className="text-2xl font-bold">
                  {selectedDate 
                    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
                    : weekDaysFull[new Date(year, month, currentDate.getDate()).getDay()] + ', ' + currentDate.getDate() + '. ' + monthNames[month]
                  }
                </div>
              </div>
              
              <div className="space-y-2">
                {getSelectedDayEvents().map(event => (
                  <div
                    key={event.id}
                    className="flex gap-4 p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] group"
                  >
                    <div className="w-16 text-sm text-[var(--text-muted)] flex-shrink-0">
                      {event.startTime}
                      {event.endTime && <span className="block text-xs">- {event.endTime}</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getCategoryColor(event.category) }}
                        />
                        <span className="font-medium">{event.title}</span>
                      </div>
                      {event.location && (
                        <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                          <MapPin size={12} /> {event.location}
                        </div>
                      )}
                      {event.description && (
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{event.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <button onClick={() => handleEditEvent(event)} className="p-1.5 hover:bg-[var(--bg-tertiary)] rounded">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="p-1.5 hover:bg-[rgba(239,68,68,0.15)] rounded">
                        <Trash2 size={14} className="text-[#ef4444]" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {getSelectedDayEvents().length === 0 && (
                  <div className="text-center py-12 text-[var(--text-muted)]">
                    <CalendarIcon size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Keine Events für diesen Tag</p>
                    <button 
                      onClick={() => openNewEventModal(selectedDate || undefined)}
                      className="btn btn-secondary mt-4"
                    >
                      <Plus size={14} className="mr-2" />
                      Event hinzufügen
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Upcoming events */}
            <div className="w-64 pl-4">
              <h3 className="font-medium text-sm text-[var(--text-muted)] mb-3">Kommende Events</h3>
              <div className="space-y-2">
                {events
                  .filter(e => e.startDate >= '2026-03-04')
                  .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.startTime.localeCompare(b.startTime))
                  .slice(0, 5)
                  .map(event => (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedDate(event.startDate);
                        setView('day');
                      }}
                      className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getCategoryColor(event.category) }}
                        />
                        <span className="text-sm font-medium truncate">{event.title}</span>
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {new Date(event.startDate + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} • {event.startTime}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Categories Legend */}
              <h3 className="font-medium text-sm text-[var(--text-muted)] mt-6 mb-3">Kategorien</h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingEvent ? 'Event bearbeiten' : 'Neues Event'}
              </h3>
              <button onClick={() => setShowEventModal(false)} className="p-1 hover:bg-[var(--bg-tertiary)] rounded">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Titel</label>
                <input
                  type="text"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event name..."
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              
              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Datum</label>
                  <input
                    type="date"
                    value={newEvent.startDate || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Uhrzeit</label>
                  <input
                    type="time"
                    value={newEvent.startTime || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
              </div>
              
              {/* End Time */}
              <div>
                <label className="block text-sm font-medium mb-1">Ende (optional)</label>
                <input
                  type="time"
                  value={newEvent.endTime || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Kategorie</label>
                <select
                  value={newEvent.category || 'uni'}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">Ort</label>
                <input
                  type="text"
                  value={newEvent.location || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Location..."
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Beschreibung</label>
                <textarea
                  value={newEvent.description || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Optional description..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-between mt-6">
              {editingEvent && (
                <button 
                  onClick={() => handleDeleteEvent(editingEvent.id)}
                  className="btn bg-[#ef4444] text-white hover:bg-[#dc2626]"
                >
                  <Trash2 size={14} className="mr-2" />
                  Löschen
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button 
                  onClick={() => setShowEventModal(false)}
                  className="btn btn-secondary"
                >
                  Abbrechen
                </button>
                <button 
                  onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                  className="btn btn-primary"
                >
                  {editingEvent ? 'Speichern' : 'Erstellen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
