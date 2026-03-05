// Mission Control Data Store
import { Task, CronJob, Project, MemoryEntry, LongTermMemory, Document, Agent } from '@/types';

// Initial Tasks
export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Mission Control Dashboard erstellen',
    description: 'Next.js Dashboard mit allen Screens bauen',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2026-03-03',
    updatedAt: '2026-03-03',
    assignee: 'Molty'
  },
  {
    id: '2',
    title: 'GitHub Auth konfigurieren',
    description: 'gh auth login durchführen',
    status: 'backlog',
    priority: 'medium',
    createdAt: '2026-03-03',
    updatedAt: '2026-03-03'
  },
  {
    id: '3',
    title: 'Security Audit wöchentlich',
    description: 'openclaw security audit --fix laufen lassen',
    status: 'backlog',
    priority: 'low',
    createdAt: '2026-03-03',
    updatedAt: '2026-03-03'
  }
];

// Cron Jobs (from OpenClaw)
export const initialCronJobs: CronJob[] = [
  {
    id: 'be052eea',
    name: 'weather-karlsruhe',
    schedule: '0 9 * * *',
    nextRun: '2026-03-04T09:00:00',
    status: 'active',
    description: 'Tägliches Wetter-Update für Karlsruhe'
  },
  {
    id: 'ca08a9b0',
    name: 'morning-reminder',
    schedule: '0 9 * * *',
    nextRun: '2026-03-04T09:00:00',
    status: 'active',
    description: 'Morgendlicher Gruß von Molty'
  }
];

// Projects
export const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Mission Control Dashboard',
    description: 'Next.js Dashboard zur Steuerung und Überwachung aller Agenten-Aktivitäten',
    status: 'active',
    progress: 35,
    tasks: 7,
    updatedAt: '2026-03-03'
  },
  {
    id: '2',
    name: 'Onboarding & Setup',
    description: 'Ersteinrichtung von Molty mit allen Tools und Skills',
    status: 'completed',
    progress: 100,
    tasks: 5,
    updatedAt: '2026-03-03'
  },
  {
    id: '3',
    name: 'GitHub Integration',
    description: 'GH CLI Auth und Repository Management',
    status: 'planning',
    progress: 10,
    tasks: 3,
    updatedAt: '2026-03-03'
  }
];

// Memory Entries
export const initialMemoryEntries: MemoryEntry[] = [
  {
    id: '1',
    date: '2026-03-03',
    content: 'Onboarding abgeschlossen. User: Molty 🧊, digitaler Begleiter, locker, direkt, witzig. Sprache: Deutsch. Zeitzone: Berlin.',
    category: 'conversation'
  },
  {
    id: '2',
    date: '2026-03-03',
    content: 'Security Audit durchgeführt. 3 kritische Probleme behoben: deviceAuth, hostHeaderFallback, insecureAuth deaktiviert.',
    category: 'insight'
  },
  {
    id: '3',
    date: '2026-03-03',
    content: 'Skills installiert: weather, himalaya, github, healthcheck, summarize. Tools: gh, yt-dlp, codex-cli.',
    category: 'decision'
  },
  {
    id: '4',
    date: '2026-03-03',
    content: 'Cron Jobs eingerichtet: Tägliche Wetterchecks (9 Uhr) und Morning Reminder (9 Uhr) für Karlsruhe.',
    category: 'decision'
  }
];

// Long Term Memory
export const initialLongTermMemory: LongTermMemory[] = [
  {
    id: '1',
    title: 'Molty Identität',
    content: 'Name: Molty 🧊. Rolle: Personal AI Assistant. Vibe: Locker, direkt, manchmal witzig. Sprache: Deutsch.',
    category: 'identity',
    updatedAt: '2026-03-03'
  },
  {
    id: '2',
    title: 'User Präferenzen',
    content: 'Access: Public via Hostinger VPS. Kommunikation: Webchat. Form: "du" (informal).',
    category: 'preferences',
    updatedAt: '2026-03-03'
  },
  {
    id: '3',
    title: 'Sicherheit',
    content: 'Gateway gesichert mit Device Auth. Regelmäßige Security Audits empfohlen.',
    category: 'learnings',
    updatedAt: '2026-03-03'
  }
];

// Documents
export const initialDocuments: Document[] = [
  {
    id: '1',
    title: 'Onboarding Zusammenfassung',
    content: 'Komplette Einrichtung vom 2026-03-03. Alle kritischen Security Issues behoben.',
    category: 'onboarding',
    folder: 'docs',
    createdAt: '2026-03-03',
    tags: ['setup', 'security', 'onboarding']
  },
  {
    id: '2',
    title: 'Skills & Tools Liste',
    content: 'Aktive Skills: weather, himalaya, github, healthcheck, summarize. Installierte Tools: gh, yt-dlp.',
    category: 'setup',
    folder: 'docs',
    createdAt: '2026-03-03',
    tags: ['skills', 'tools', 'configuration']
  }
];

// Agents (Team)
export const initialAgents: Agent[] = [
  {
    id: '1',
    name: 'Molty',
    role: ' Hauptassistent & Projektmanager',
    emoji: '🧊',
    status: 'working',
    currentTask: 'Mission Control Dashboard erstellen',
    deskPosition: { x: 2, y: 2 }
  }
];

// Mission Statement
export const missionStatement = `
## Unser Mission Statement

**"Gemeinsam bauen wir die optimale digitale Infrastruktur für produktives Arbeiten und kontinuierliches Lernen."**

### Unsere Werte
- **Autonomie**: Molty arbeitet selbstständig und proaktiv
- **Qualität**: Clean Code, sichere Systeme, durchdachte Lösungen
- **Kontinuität**: Langzeitgedächtnis für nachhaltige Zusammenarbeit
- **Transparenz**: Klare Übersicht über alle Aktivitäten und Projekte

### Unser Ziel
Eine nahtlose Integration von KI-Assistenz in den Arbeitsalltag – von automatisierten Aufgaben über intelligente Erinnerungen bis hin zu eigenständiger Problemlösung.
`;
