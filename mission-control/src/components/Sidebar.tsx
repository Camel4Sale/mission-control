'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderKanban, 
  Brain, 
  FileText, 
  Users, 
  Building2,
  Settings,
  X
} from 'lucide-react';

export type Screen = 'tasks' | 'calendar' | 'projects' | 'memory' | 'docs' | 'team' | 'office';

interface SidebarProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

const menuItems: { id: Screen; label: string; icon: React.ReactNode }[] = [
  { id: 'tasks', label: 'Tasks', icon: <FolderKanban size={18} /> },
  { id: 'calendar', label: 'Kalender', icon: <Calendar size={18} /> },
  { id: 'projects', label: 'Projekte', icon: <LayoutDashboard size={18} /> },
  { id: 'memory', label: 'Memory', icon: <Brain size={18} /> },
  { id: 'docs', label: 'Docs', icon: <FileText size={18} /> },
  { id: 'team', label: 'Team', icon: <Users size={18} /> },
  { id: 'office', label: 'Office', icon: <Building2 size={18} /> },
];

export default function Sidebar({ activeScreen, onScreenChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={`h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--border)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--accent)] flex items-center justify-center">
              <span className="text-xs font-bold">M</span>
            </div>
            <span className="font-semibold text-sm">Mission Control</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
        >
          {collapsed ? <LayoutDashboard size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onScreenChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeScreen === item.id 
                    ? 'bg-[var(--accent-muted)] text-[var(--accent)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border)]">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
          <Settings size={18} />
          {!collapsed && <span>Einstellungen</span>}
        </button>
      </div>
    </aside>
  );
}
