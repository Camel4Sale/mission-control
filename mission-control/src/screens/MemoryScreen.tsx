'use client';

import { useState } from 'react';
import { MemoryEntry, LongTermMemory } from '@/types';
import { Brain, BookOpen, Calendar, ChevronRight, Search, Plus, Tag, Lightbulb, MessageSquare, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface MemoryScreenProps {
  memoryEntries: MemoryEntry[];
  longTermMemory: LongTermMemory[];
}

export default function MemoryScreen({ memoryEntries, longTermMemory }: MemoryScreenProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'longterm'>('daily');
  const [searchQuery, setSearchQuery] = useState('');

  // Group memory entries by date
  const groupedEntries = memoryEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, MemoryEntry[]>);

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));

  const filteredEntries = searchQuery
    ? memoryEntries.filter(e => 
        e.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getCategoryIcon = (category: MemoryEntry['category']) => {
    switch (category) {
      case 'conversation': return <MessageSquare size={14} />;
      case 'decision': return <CheckCircle size={14} />;
      case 'insight': return <Lightbulb size={14} />;
      case 'todo': return <Tag size={14} />;
    }
  };

  const getCategoryLabel = (category: MemoryEntry['category']) => {
    switch (category) {
      case 'conversation': return 'Gespräch';
      case 'decision': return 'Entscheidung';
      case 'insight': return 'Erkenntnis';
      case 'todo': return 'Aufgabe';
    }
  };

  const getCategoryColor = (category: MemoryEntry['category']) => {
    switch (category) {
      case 'conversation': return 'text-[var(--accent)]';
      case 'decision': return 'text-[var(--success)]';
      case 'insight': return 'text-[var(--warning)]';
      case 'todo': return 'text-[var(--danger)]';
    }
  };

  const getLongTermCategoryLabel = (category: LongTermMemory['category']) => {
    switch (category) {
      case 'identity': return 'Identität';
      case 'goals': return 'Ziele';
      case 'preferences': return 'Präferenzen';
      case 'learnings': return 'Erkenntnisse';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Memory</h1>
          <p className="text-sm text-[var(--text-secondary)]">Langzeitgedächtnis & Tagesnotizen</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-[var(--bg-secondary)] p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'daily'
              ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            Tagesnotizen
          </div>
        </button>
        <button
          onClick={() => setActiveTab('longterm')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'longterm'
              ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Brain size={16} />
            Langzeitgedächtnis
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Suchen..."
          className="linear-input w-full pl-10"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery && filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-secondary)]">Keine Ergebnisse gefunden</p>
          </div>
        ) : activeTab === 'daily' ? (
          <div className="space-y-8">
            {sortedDates.map(date => (
              <section key={date}>
                <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                  <Calendar size={14} />
                  {format(new Date(date), 'EEEE, d. MMMM yyyy', { locale: de })}
                </h2>
                <div className="space-y-3">
                  {groupedEntries[date].map(entry => (
                    <div key={entry.id} className="card">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${getCategoryColor(entry.category)}`}>
                          {getCategoryIcon(entry.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs ${getCategoryColor(entry.category)}`}>
                              {getCategoryLabel(entry.category)}
                            </span>
                          </div>
                          <p className="text-sm">{entry.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {longTermMemory.map(entry => (
              <div key={entry.id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain size={16} className="text-[var(--accent)]" />
                    <h3 className="font-medium">{entry.title}</h3>
                  </div>
                  <span className="badge badge-info text-xs">
                    {getLongTermCategoryLabel(entry.category)}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{entry.content}</p>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Aktualisiert: {format(new Date(entry.updatedAt), 'd. MMM yyyy', { locale: de })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
