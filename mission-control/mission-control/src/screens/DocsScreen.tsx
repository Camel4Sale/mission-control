'use client';

import { useState, useEffect } from 'react';
import { Document } from '@/types';
import { FileText, Search, Tag, Plus, FolderOpen, ChevronRight, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface DocsScreenProps {
  documents?: Document[];
}

export default function DocsScreen({ documents: propDocuments }: DocsScreenProps) {
  const [documents, setDocuments] = useState<Document[]>(propDocuments || []);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'onboarding', label: 'Onboarding', icon: '🚀' },
    { id: 'setup', label: 'Setup', icon: '⚙️' },
    { id: 'notes', label: 'Notizen', icon: '📝' },
    { id: 'docs', label: 'Dokumente', icon: '📄' },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? doc.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: Document['category']) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '📄';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Dokumente</h1>
          <p className="text-sm text-[var(--text-secondary)]">Alle erstellten Dokumente & Notizen</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Dokumente durchsuchen..."
            className="linear-input w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              !selectedCategory
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Alle
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Document List */}
        <div className="w-80 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                <p className="text-[var(--text-secondary)]">Keine Dokumente gefunden</p>
              </div>
            ) : (
              filteredDocs.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedDoc?.id === doc.id
                      ? 'bg-[var(--accent-muted)] border-[var(--accent)]'
                      : 'bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getCategoryIcon(doc.category)}</span>
                    <span className="font-medium text-sm truncate">{doc.title}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-2">
                    {doc.content}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)]">
                      {format(new Date(doc.createdAt), 'd. MMM yyyy', { locale: de })}
                    </span>
                    <div className="flex gap-1">
                      {doc.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Document Preview */}
        <div className="flex-1 card overflow-hidden flex flex-col">
          {selectedDoc ? (
            <>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getCategoryIcon(selectedDoc.category)}</span>
                    <h2 className="text-lg font-semibold">{selectedDoc.title}</h2>
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">
                    Erstellt am {format(new Date(selectedDoc.createdAt), 'd. MMMM yyyy', { locale: de })}
                  </p>
                </div>
                <button className="linear-btn-secondary p-2">
                  <ExternalLink size={16} />
                </button>
              </div>
              
              <div className="flex gap-2 mb-4">
                {selectedDoc.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 bg-[var(--bg-tertiary)] rounded">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedDoc.content}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText size={64} className="mx-auto text-[var(--text-muted)] mb-4" />
                <p className="text-[var(--text-secondary)]">Wähle ein Dokument aus</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
