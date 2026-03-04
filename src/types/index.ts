// Mission Control Types - Complete Type Definitions

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  type: 'meeting' | 'reminder' | 'deadline' | 'recurring' | 'review';
  color: string;
  endTime?: string;
  allDay?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  progress: number;
  tasks: number;
  milestones?: Milestone[];
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  emoji: string;
  role: 'admin' | 'member' | 'viewer';
  email?: string;
  status: 'idle' | 'working' | 'waiting';
  currentTask?: string | null;
  avatar?: string | null;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  category: 'onboarding' | 'setup' | 'notes' | 'docs';
  folder: string;
  createdAt: string;
  tags: string[];
  fileSize?: string;
  fileType?: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  commandPaletteEnabled: boolean;
  notifications: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Legacy types (for compatibility)
export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  status: 'active' | 'paused';
  description?: string;
}

export interface MemoryEntry {
  id: string;
  date: string;
  content: string;
  category: 'conversation' | 'decision' | 'insight' | 'todo';
}

export interface LongTermMemory {
  id: string;
  title: string;
  content: string;
  category: 'identity' | 'goals' | 'preferences' | 'learnings';
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  status: 'idle' | 'working' | 'waiting';
  currentTask?: string;
  deskPosition?: { x: number; y: number };
}

export interface OfficePosition {
  x: number;
  y: number;
}
