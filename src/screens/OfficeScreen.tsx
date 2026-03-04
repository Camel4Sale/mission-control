'use client';

import { useState, useEffect, useCallback } from 'react';
import { Document, Folder } from '@/types';
import { 
  Building2, Folder as FolderIcon, FileText, Upload, Plus, X, Save, Trash2, 
  FolderPlus, File, Search, ChevronRight, ChevronDown, MoreHorizontal,
  Download, ExternalLink, Tag
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { loadFromStorage, saveToStorage, defaultDocuments } from '@/lib/storage';

const STORAGE_KEY_DOCS = 'mc_documents';
const STORAGE_KEY_FOLDERS = 'mc_folders';

const categories = [
  { id: 'onboarding', label: 'Onboarding', color: '#34d399' },
  { id: 'setup', label: 'Setup', color: '#5e6ad2' },
  { id: 'notes', label: 'Notes', color: '#fbbf24' },
  { id: 'docs', label: 'Docs', color: '#f87171' },
] as const;

interface DocumentModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: Document) => void;
  onDelete?: (id: string) => void;
}

function DocumentModal({ document, isOpen, onClose, onSave, onDelete }: DocumentModalProps) {
  const [formData, setFormData] = useState<Partial<Document>>({});

  useEffect(() => {
    if (document) {
      setFormData({ ...document });
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'notes',
        folder: 'Dokumente',
        tags: [],
      });
    }
  }, [document, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: Document = {
      id: document?.id || Date.now().toString(),
      title: formData.title || 'Untitled',
      content: formData.content || '',
      category: formData.category || 'notes',
      folder: formData.folder || 'Dokumente',
      createdAt: document?.createdAt || new Date().toISOString(),
      tags: formData.tags || [],
      fileSize: formData.fileSize || '0 KB',
    };
    onSave(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold">{document ? 'Dokument bearbeiten' : 'Neues Dokument'}</h2>
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
              placeholder="Dokumenttitel..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kategorie</label>
              <select
                value={formData.category || 'notes'}
                onChange={e => setFormData({ ...formData, category: e.target.value as Document['category'] })}
                className="linear-input w-full"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ordner</label>
              <input
                type="text"
                value={formData.folder || ''}
                onChange={e => setFormData({ ...formData, folder: e.target.value })}
                className="linear-input w-full"
                placeholder="Ordner..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Inhalt</label>
            <textarea
              value={formData.content || ''}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="linear-input w-full h-32 resize-none"
              placeholder="Dokumentinhalt..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              type="text"
              value={formData.tags?.join(', ') || ''}
              onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
              className="linear-input w-full"
              placeholder="tag1, tag2, tag3..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            {document && onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(document.id); onClose(); }}
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

// Simulated file upload
function simulateUpload(fileName: string): Promise<{ size: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sizes = ['1.2 KB', '2.4 KB', '4.8 KB', '8.1 KB', '15.3 KB'];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      resolve({ size });
    }, 500);
  });
}

export default function OfficeScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');

  // Load documents from localStorage
  useEffect(() => {
    const storedDocs = loadFromStorage<Document[]>(STORAGE_KEY_DOCS, defaultDocuments);
    const storedFolders = loadFromStorage<Folder[]>(STORAGE_KEY_FOLDERS, [
      { id: '1', name: 'Dokumente', createdAt: '2026-03-03' },
      { id: '2', name: 'Konfiguration', createdAt: '2026-03-03' },
      { id: '3', name: 'Meetings', createdAt: '2026-03-03' },
    ]);
    setDocuments(storedDocs);
    setFolders(storedFolders);
  }, []);

  // Save documents to localStorage
  const saveDocuments = useCallback((newDocs: Document[]) => {
    setDocuments(newDocs);
    saveToStorage(STORAGE_KEY_DOCS, newDocs);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveDocument = (doc: Document) => {
    const existingIndex = documents.findIndex(d => d.id === doc.id);
    let newDocs: Document[];
    
    if (existingIndex >= 0) {
      newDocs = documents.map(d => d.id === doc.id ? doc : d);
      showToast('Dokument aktualisiert');
    } else {
      newDocs = [...documents, doc];
      showToast('Dokument erstellt');
    }
    
    saveDocuments(newDocs);
  };

  const handleDeleteDocument = (id: string) => {
    const newDocs = documents.filter(d => d.id !== id);
    saveDocuments(newDocs);
    showToast('Dokument gelöscht', 'error');
  };

  const handleFileUpload = async () => {
    if (!uploadFileName.trim()) return;
    
    setUploading(true);
    const { size } = await simulateUpload(uploadFileName);
    
    const newDoc: Document = {
      id: Date.now().toString(),
      title: uploadFileName,
      content: '',
      category: 'docs',
      folder: 'Dokumente',
      createdAt: new Date().toISOString(),
      tags: ['upload'],
      fileSize: size,
    };
    
    saveDocuments([...documents, newDoc]);
    setUploadFileName('');
    setUploading(false);
    showToast('Datei hochgeladen (simuliert)');
  };

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedFolder && doc.folder !== selectedFolder) return false;
    if (selectedCategory && doc.category !== selectedCategory) return false;
    return true;
  });

  // Group by folder
  const docsByFolder = filteredDocs.reduce((acc, doc) => {
    if (!acc[doc.folder]) acc[doc.folder] = [];
    acc[doc.folder].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  const getCategoryColor = (cat: string) => {
    return categories.find(c => c.id === cat)?.color || '#6e6e73';
  };

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
          <h1 className="text-xl font-semibold">Office & Dokumente</h1>
          <p className="text-sm text-[var(--text-secondary)]">Document Hub mit Ordnerstruktur</p>
        </div>
        <button 
          onClick={() => { setEditingDoc(null); setModalOpen(true); }}
          className="linear-btn flex items-center gap-2"
        >
          <Plus size={16} />
          Neues Dokument
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
              <FileText size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{documents.length}</p>
              <p className="text-xs text-[var(--text-secondary)]">Dokumente</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(52,211,153,0.15)] flex items-center justify-center">
              <FolderIcon size={20} className="text-[var(--success)]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{folders.length}</p>
              <p className="text-xs text-[var(--text-secondary)]">Ordner</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(251,191,36,0.15)] flex items-center justify-center">
              <Tag size={20} className="text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {new Set(documents.flatMap(d => d.tags)).size}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Tags</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(248,113,113,0.15)] flex items-center justify-center">
              <Building2 size={20} className="text-[var(--danger)]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {documents.reduce((acc, d) => acc + parseFloat(d.fileSize || '0'), 0).toFixed(1)} KB
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Gesamtgröße</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Sidebar - Folders */}
        <div className="w-64 flex flex-col">
          <div className="card flex-1">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <FolderIcon size={16} />
              Ordner
            </h3>
            
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                  !selectedFolder ? 'bg-[var(--accent-muted)] text-[var : 'hover(--accent)]':bg-[var(--bg-hover)]'
                }`}
              >
                <Building2 size={14} />
                Alle Dokumente
                <span className="ml-auto text-xs text-[var(--text-muted)]">{documents.length}</span>
              </button>
              
              {folders.map(folder => {
                const count = documents.filter(d => d.folder === folder.name).length;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.name)}
                    className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                      selectedFolder === folder.name ? 'bg-[var(--accent-muted)] text-[var(--accent)]' : 'hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <FolderIcon size={14} />
                    {folder.name}
                    <span className="ml-auto text-xs text-[var(--text-muted)]">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Categories */}
            <h3 className="text-sm font-medium mt-6 mb-3 flex items-center gap-2">
              <Tag size={16} />
              Kategorien
            </h3>
            <div className="space-y-1">
              {categories.map(cat => {
                const count = documents.filter(d => d.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                      selectedCategory === cat.id ? 'bg-[var(--accent-muted)]' : 'hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.label}
                    <span className="ml-auto text-xs text-[var(--text-muted)]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search & Upload */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Dokumente durchsuchen..."
                className="linear-input w-full pl-10"
              />
            </div>
            
            {/* Simulated Upload */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={uploadFileName}
                onChange={e => setUploadFileName(e.target.value)}
                placeholder="Dateiname..."
                className="linear-input w-48"
              />
              <button 
                onClick={handleFileUpload}
                disabled={uploading || !uploadFileName}
                className="linear-btn flex items-center gap-2"
              >
                <Upload size={16} />
                {uploading ? '...' : 'Upload'}
              </button>
            </div>
          </div>

          {/* Documents List */}
          <div className="flex-1 overflow-y-auto">
            {Object.keys(docsByFolder).length === 0 ? (
              <div className="card text-center py-12">
                <FileText size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                <p className="text-[var(--text-secondary)]">Keine Dokumente gefunden</p>
                <button 
                  onClick={() => { setEditingDoc(null); setModalOpen(true); }}
                  className="text-[var(--accent)] hover:underline mt-2"
                >
                  + Dokument erstellen
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(docsByFolder).map(([folder, docs]) => (
                  <div key={folder}>
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                      <FolderIcon size={14} />
                      {folder}
                      <span className="text-xs">({docs.length})</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {docs.map(doc => (
                        <div 
                          key={doc.id}
                          onClick={() => { setEditingDoc(doc); setModalOpen(true); }}
                          className="card card-hover cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: getCategoryColor(doc.category) + '20' }}
                            >
                              <FileText size={18} style={{ color: getCategoryColor(doc.category) }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{doc.title}</h4>
                              <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                                <span>{doc.fileSize}</span>
                                <span>•</span>
                                <span>{format(parseISO(doc.createdAt), 'd.MM.yyyy')}</span>
                              </div>
                              {doc.tags && doc.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {doc.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Modal */}
      <DocumentModal
        document={editingDoc}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingDoc(null); }}
        onSave={handleSaveDocument}
        onDelete={handleDeleteDocument}
      />
    </div>
  );
}
