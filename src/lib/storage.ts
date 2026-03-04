// Mission Control - LocalStorage Data Store
// All data persisted to localStorage with typed hooks

import { Task, CalendarEvent, Project, TeamMember, Document, AppSettings } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  TASKS: 'mc_tasks',
  CALENDAR: 'mc_calendar',
  PROJECTS: 'mc_projects',
  TEAM: 'mc_team',
  DOCUMENTS: 'mc_documents',
  SETTINGS: 'mc_settings',
} as const;

// Default data
export const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Mission Control Dashboard erstellen',
    description: 'Next.js Dashboard mit allen Screens bauen',
    status: 'in-progress',
    priority: 'high',
    tags: ['dashboard', 'frontend'],
    deadline: '2026-03-10',
    createdAt: '2026-03-03',
    updatedAt: '2026-03-03',
    assignee: 'Molty'
  },
  {
    id: '2',
    title: 'GitHub Auth konfigurieren',
    description: 'gh auth login durchführen',
    status: 'todo',
    priority: 'medium',
    tags: ['github', 'auth'],
    deadline: '2026-03-15',
    createdAt: '2026-03-03',
    updatedAt: '2026-03-03'
  },
  {
    id: '3',
    title: 'Security Audit wöchentlich',
    description: 'openclaw security audit --fix laufen lassen',
    status: 'backlog',
    priority: 'low',
    tags: ['security', 'audit'],
    createdAt: '2026-03-03',
    updatedAt: '2026-03-03'
  },
  {
    id: '4',
    title: 'Performance Optimierung',
    description: 'Ladezeiten reduzieren und Caching implementieren',
    status: 'backlog',
    priority: 'medium',
    tags: ['performance', 'optimization'],
    createdAt: '2026-03-03',
    updatedAt: '2026-03-03'
  }
];

export const defaultEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Weather Check',
    date: '2026-03-04',
    time: '09:00',
    description: 'Tägliches Wetter-Update',
    type: 'recurring',
    color: '#34d399'
  },
  {
    id: '2',
    title: 'Morning Standup',
    date: '2026-03-04',
    time: '09:30',
    description: 'Tägliches Team-Update',
    type: 'recurring',
    color: '#5e6ad2'
  },
  {
    id: '3',
    title: 'Sprint Planning',
    date: '2026-03-05',
    time: '14:00',
    description: 'Nächste Sprint-Planung',
    type: 'meeting',
    color: '#f87171'
  },
  {
    id: '4',
    title: 'Code Review',
    date: '2026-03-06',
    time: '11:00',
    description: 'PR-Review für Mission Control',
    type: 'review',
    color: '#fbbf24'
  }
];

export const defaultProjects: Project[] = [
  {
    id: '1',
    name: 'Mission Control Dashboard',
    description: 'Next.js Dashboard zur Steuerung und Überwachung aller Agenten-Aktivitäten',
    status: 'active',
    progress: 35,
    tasks: 7,
    milestones: [
      { id: 'm1', title: 'Grundgerüst', completed: true, date: '2026-03-01' },
      { id: 'm2', title: 'Task Board', completed: true, date: '2026-03-02' },
      { id: 'm3', title: 'Calendar', completed: false, date: '2026-03-10' },
      { id: 'm4', title: 'Projects & Team', completed: false, date: '2026-03-15' },
    ],
    updatedAt: '2026-03-03'
  },
  {
    id: '2',
    name: 'Onboarding & Setup',
    description: 'Ersteinrichtung von Molty mit allen Tools und Skills',
    status: 'completed',
    progress: 100,
    tasks: 5,
    milestones: [
      { id: 'm1', title: 'Basis-Setup', completed: true, date: '2026-03-01' },
      { id: 'm2', title: 'Skills installieren', completed: true, date: '2026-03-02' },
      { id: 'm3', title: 'Security Audit', completed: true, date: '2026-03-03' },
    ],
    updatedAt: '2026-03-03'
  },
  {
    id: '3',
    name: 'GitHub Integration',
    description: 'GH CLI Auth und Repository Management',
    status: 'planning',
    progress: 10,
    tasks: 3,
    milestones: [
      { id: 'm1', title: 'Auth konfigurieren', completed: false, date: '2026-03-15' },
      { id: 'm2', title: 'Repo verknüpfen', completed: false, date: '2026-03-20' },
    ],
    updatedAt: '2026-03-03'
  }
];

export const defaultTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Molty',
    emoji: '🧊',
    role: 'admin',
    email: 'molty@local',
    status: 'working',
    currentTask: 'Mission Control Dashboard',
    avatar: null
  },
  {
    id: '2',
    name: 'Codex',
    emoji: '🤖',
    role: 'member',
    email: 'codex@local',
    status: 'idle',
    currentTask: null,
    avatar: null
  },
  {
    id: '3',
    name: 'Weather',
    emoji: '🌤️',
    role: 'member',
    email: 'weather@local',
    status: 'waiting',
    currentTask: 'Wetterdaten überwachen',
    avatar: null
  },
  {
    id: '4',
    name: 'Himalaya',
    emoji: '📧',
    role: 'viewer',
    email: 'himalaya@local',
    status: 'idle',
    currentTask: null,
    avatar: null
  }
];

export const defaultDocuments: Document[] = [
  {
    id: '1',
    title: 'Onboarding Zusammenfassung',
    content: 'Komplette Einrichtung vom 2026-03-03. Alle kritischen Security Issues behoben.',
    category: 'onboarding',
    folder: 'Dokumente',
    createdAt: '2026-03-03',
    tags: ['setup', 'security', 'onboarding'],
    fileSize: '2.4 KB'
  },
  {
    id: '2',
    title: 'Skills & Tools Liste',
    content: 'Aktive Skills: weather, himalaya, github, healthcheck, summarize. Installierte Tools: gh, yt-dlp.',
    category: 'setup',
    folder: 'Konfiguration',
    createdAt: '2026-03-03',
    tags: ['skills', 'tools', 'configuration'],
    fileSize: '1.8 KB'
  },
  {
    id: '3',
    title: 'Meeting Notes - Sprint 1',
    content: 'Besprechung vom 2026-03-03: Todo-Liste erstellt, Prioritäten definiert.',
    category: 'notes',
    folder: 'Meetings',
    createdAt: '2026-03-03',
    tags: ['meeting', 'sprint', 'notes'],
    fileSize: '1.2 KB'
  }
];

export const defaultSettings: AppSettings = {
  theme: 'dark',
  sidebarCollapsed: false,
  commandPaletteEnabled: true,
  notifications: true,
};

// Helper functions
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Initialize data on first load
export function initializeData(): void {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    saveToStorage(STORAGE_KEYS.TASKS, defaultTasks);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CALENDAR)) {
    saveToStorage(STORAGE_KEYS.CALENDAR, defaultEvents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    saveToStorage(STORAGE_KEYS.PROJECTS, defaultProjects);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEAM)) {
    saveToStorage(STORAGE_KEYS.TEAM, defaultTeam);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    saveToStorage(STORAGE_KEYS.DOCUMENTS, defaultDocuments);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    saveToStorage(STORAGE_KEYS.SETTINGS, defaultSettings);
  }
}
