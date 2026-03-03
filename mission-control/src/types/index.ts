// Mission Control Types

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  assignee?: string;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  status: 'active' | 'paused';
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  progress: number;
  tasks: number;
  updatedAt: string;
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

export interface Document {
  id: string;
  title: string;
  content: string;
  category: 'onboarding' | 'setup' | 'notes' | 'docs';
  createdAt: string;
  tags: string[];
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
