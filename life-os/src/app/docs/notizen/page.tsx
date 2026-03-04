'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Folder, FileText, ChevronRight, ChevronDown,
  MoreHorizontal, Edit2, Trash2, Copy, ExternalLink, X,
  Bold, Italic, List, ListOrdered, Link as LinkIcon, Code,
  Heading1, Heading2, Quote, Image
} from 'lucide-react';

interface Doc {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

const sampleDocs: Doc[] = [
  { 
    id: '1', 
    title: '📚 Vorlesungsnotizen', 
    content: '# Vorlesungsnotizen\n\nHier sammle ich alle Notizen aus den Vorlesungen.\n\n## Finance 1\n\n- Grundlagen der Finanzierung\n- Investitionsrechnung\n- Finanzierungsformen\n\n## Operations Research\n\n- Lineare Optimierung\n- Simplex-Verfahren', 
    parentId: null, 
    createdAt: '2026-01-15', 
    updatedAt: '2026-03-01' 
  },
  { 
    id: '2', 
    title: '💼 Projekt Pathium', 
    content: '# Pathium Projekt\n\n## Ziele\n- MVP fertigstellen\n- Erste Nutzer gewinnen\n- Feedback sammeln\n\n## To-Do\n- [ ] Landing Page\n- [ ] Auth\n- [ ] Dashboard', 
    parentId: null, 
    createdAt: '2026-02-01', 
    updatedAt: '2026-03-03' 
  },
  { 
    id: '3', 
    title: '🎯 Masterarbeit', 
    content: '# Masterarbeit\n\n## Thema\nOptimierung von Supply Chain Management mit ML\n\n## Fortschritt\n- [x] Thema festgelegt\n- [ ] Literaturrecherche\n- [ ] Methodik\n- [ ] Schreiben', 
    parentId: null, 
    createdAt: '2026-01-20', 
    updatedAt: '2026-03-02' 
  },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function NotizenPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('life-os-docs');
    if (saved) {
      try {
        setDocs(JSON.parse(saved));
      } catch (e) {
        setDocs(sampleDocs);
      }
    } else {
      setDocs(sampleDocs);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (docs.length > 0) {
      localStorage.setItem('life-os-docs', JSON.stringify(docs));
    }
  }, [docs]);

  const filteredDocs = docs.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDoc = () => {
    if (!newDocTitle.trim()) return;
    
    const newDoc: Doc = {
      id: generateId(),
      title: newDocTitle,
      content: '# ' + newDocTitle + '\n\nStart writing here...',
      parentId: null,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    setDocs([...docs, newDoc]);
    setSelectedDoc(newDoc);
    setNewDocTitle('');
    setShowNewDocModal(false);
    setIsEditing(true);
    setEditContent(newDoc.content);
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm('Möchtest du dieses Dokument wirklich löschen?')) {
      setDocs(docs.filter(d => d.id !== id));
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
    }
  };

  const handleSaveDoc = () => {
    if (!selectedDoc) return;
    
    setDocs(docs.map(d => 
      d.id === selectedDoc.id 
        ? { ...d, content: editContent, updatedAt: new Date().toISOString().split('T')[0] } 
        : d
    ));
    setSelectedDoc({ ...selectedDoc, content: editContent, updatedAt: new Date().toISOString().split('T')[0] });
    setIsEditing(false);
  };

  const handleSelectDoc = (doc: Doc) => {
    setSelectedDoc(doc);
    setIsEditing(false);
  };

  // Simple markdown parser
  const renderMarkdown = (content: string) => {
    let html = content
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-[var(--bg-tertiary)] p-3 rounded-lg my-3 overflow-x-auto text-sm"><code>$1</code></pre>')
      // Inline code
      .replace(/`(.*?)`/g, '<code class="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-sm">$1</code>')
      // Checkboxes
      .replace(/- \[x\] (.*$)/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" checked disabled class="w-4 h-4 rounded border-[var(--border)] bg-[#22c55e]" /><span class="line-through text-[var(--text-muted)]">$1</span></div>')
      .replace(/- \[ \] (.*$)/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" disabled class="w-4 h-4 rounded border-[var(--border)]" /><span>$1</span></div>')
      // Unordered lists
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[var(--accent)] hover:underline" target="_blank" rel="noopener">$1</a>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="my-2">')
      // Line breaks
      .replace(/\n/g, '<br />');
    
    return `<p class="my-2">${html}</p>`;
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-[var(--border)] flex flex-col bg-[var(--bg-secondary)]">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-[#8b5cf6]" />
            <span className="font-semibold">Notizen</span>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
        </div>

        {/* Doc List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                selectedDoc?.id === doc.id 
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)]' 
                  : 'hover:bg-[var(--bg-hover)]'
              }`}
            >
              <FileText size={14} className="flex-shrink-0" />
              <span className="flex-1 truncate text-sm">{doc.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDoc(doc.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[rgba(239,68,68,0.15)] rounded transition-opacity"
              >
                <Trash2 size={12} className="text-[#ef4444]" />
              </button>
            </div>
          ))}
          
          {filteredDocs.length === 0 && (
            <div className="text-center py-8 text-[var(--text-muted)] text-sm">
              Keine Dokumente gefunden
            </div>
          )}
        </div>

        {/* New Doc Button */}
        <div className="p-3 border-t border-[var(--border)]">
          <button
            onClick={() => setShowNewDocModal(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Neue Seite
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedDoc ? (
          <>
            {/* Document Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <div>
                <h1 className="text-xl font-semibold">{selectedDoc.title}</h1>
                <p className="text-xs text-[var(--text-muted)]">
                  Zuletzt aktualisiert: {selectedDoc.updatedAt}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="btn btn-secondary"
                    >
                      Abbrechen
                    </button>
                    <button 
                      onClick={handleSaveDoc}
                      className="btn btn-primary"
                    >
                      Speichern
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      setIsEditing(true);
                      setEditContent(selectedDoc.content);
                    }}
                    className="btn btn-secondary"
                  >
                    <Edit2 size={14} className="mr-2" />
                    Bearbeiten
                  </button>
                )}
              </div>
            </div>

            {/* Editor/Preview */}
            <div className="flex-1 overflow-y-auto p-6">
              {isEditing ? (
                <div className="h-full flex flex-col">
                  {/* Markdown Toolbar */}
                  <div className="flex items-center gap-1 p-2 mb-3 border-b border-[var(--border)]">
                    <button className="p-2 hover:bg-[var(--bg-hover)] rounded" title="Fett">
                      <Bold size={16} />
                    </button>
                    <button className="p-2 hover:bg-[var(--bg-hover)] rounded" title="Kursiv">
                      <Italic size={16} />
                    </button>
                    <div className="w-px h-6 bg-[var(--border)] mx-1" />
                    <button className="p-2 hover:bg-[var(--bg-hover)] rounded" title="Überschrift">
                      <Heading1 size={16} />
                    </button>
                    <button className="p-2 hover:bg-[var(--bg-hover)] rounded" title="Liste">
                      <List size={16} />
                    </button>
                    <button className="p-2 hover:bg-[var(--bg-hover)] rounded" title="Nummerierte Liste">
                      <ListOrdered size={16} />
                    </button>
                    <div className="w-px h-6 bg-[var(--border)] mx-1" />
                    <button className="p-2 hover:bg-[var(--bg-hover)] rounded" title="Link">
                      <LinkIcon size={16} />
                    </button>
                    <button className="p-2 hover:bg-[var(--bg-hover)] rounded" title="Code">
                      <Code size={16} />
                    </button>
                  </div>
                  
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 w-full p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-mono text-sm resize-none"
                    placeholder="Schreibe hier in Markdown..."
                  />
                </div>
              ) : (
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedDoc.content) }}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)]">
            <FileText size={64} className="mb-4 opacity-20" />
            <p className="text-lg mb-2">Keine Seite ausgewählt</p>
            <p className="text-sm mb-4">Wähle eine Seite aus der Seitenleiste oder erstelle eine neue</p>
            <button
              onClick={() => setShowNewDocModal(true)}
              className="btn btn-primary"
            >
              <Plus size={16} className="mr-2" />
              Neue Seite
            </button>
          </div>
        )}
      </div>

      {/* New Doc Modal */}
      {showNewDocModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Neue Seite</h3>
              <button onClick={() => setShowNewDocModal(false)} className="p-1 hover:bg-[var(--bg-tertiary)] rounded">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titel</label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="Seitentitel..."
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowNewDocModal(false)}
                className="btn btn-secondary"
              >
                Abbrechen
              </button>
              <button 
                onClick={handleCreateDoc}
                className="btn btn-primary"
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
