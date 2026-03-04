'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderKanban, 
  Brain, 
  FileText, 
  Users, 
  Building2,
  Settings,
  X,
  Bot,
  Activity,
  ChevronLeft,
  ChevronRight,
  Server,
  Shield,
  Clock,
  Link as LinkIcon
} from 'lucide-react';

export type Screen = 'tasks' | 'calendar' | 'projects' | 'memory' | 'docs' | 'team' | 'office' | 'molty' | 'openclaw' | 'agents' | 'gateways' | 'activity' | 'approvals' | 'organization';

interface SidebarProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

const menuItems: { id: Screen; label: string; icon: React.ReactNode; shortcut: string; href?: string }[] = [
  { id: 'tasks', label: 'Tasks', icon: <FolderKanban size={18} />, shortcut: 'G T' },
  { id: 'calendar', label: 'Kalender', icon: <Calendar size={18} />, shortcut: 'G C' },
  { id: 'projects', label: 'Projekte', icon: <LayoutDashboard size={18} />, shortcut: 'G P' },
  { id: 'memory', label: 'Memory', icon: <Brain size={18} />, shortcut: 'G M' },
  { id: 'docs', label: 'Docs', icon: <FileText size={18} />, shortcut: 'G D' },
  { id: 'team', label: 'Team', icon: <Users size={18} />, shortcut: '' },
  { id: 'office', label: 'Office', icon: <Building2 size={18} />, shortcut: '' },
  { id: 'molty', label: 'Molty AI', icon: <Bot size={18} className="text-[#6366f1]" />, shortcut: 'G A' },
  { id: 'openclaw', label: 'OpenClaw', icon: <Activity size={18} className="text-[#10b981]" />, shortcut: 'G O' },
  // OpenClaw Features
  { id: 'agents', label: 'Agents', icon: <Bot size={18} />, shortcut: '', href: '/agents' },
  { id: 'gateways', label: 'Gateways', icon: <Server size={18} />, shortcut: '', href: '/gateways' },
  { id: 'activity', label: 'Activity', icon: <Clock size={18} />, shortcut: '', href: '/activity' },
  { id: 'approvals', label: 'Approvals', icon: <Shield size={18} />, shortcut: '', href: '/approvals' },
  { id: 'organization', label: 'Organization', icon: <LinkIcon size={18} />, shortcut: '', href: '/organization' },
];

export default function Sidebar({ activeScreen, onScreenChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<Screen | null>(null);
  const router = useRouter();

  const handleClick = (item: typeof menuItems[0]) => {
    if (item.href) {
      router.push(item.href);
    } else {
      onScreenChange(item.id);
    }
  };

  return (
    <aside 
      className={`h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col transition-all duration-300 ease-out ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-[var(--border)]">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[#8b5cf6] flex items-center justify-center shadow-md">
              <span className="text-xs font-bold text-white">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-tight">Mission</span>
              <span className="text-[10px] text-[var(--text-muted)] -mt-0.5">Control</span>
            </div>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-all duration-200 hover:scale-105"
          title={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeScreen === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
                    text-sm font-medium transition-all duration-200
                    relative overflow-hidden group
                    ${isActive 
                      ? 'bg-[var(--accent-muted)] text-[var(--accent)] shadow-sm' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                    }
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[var(--accent)] rounded-r-full" />
                  )}
                  
                  {/* Icon */}
                  <span className={`
                    flex-shrink-0 transition-transform duration-200
                    ${isHovered && !isActive ? 'scale-110' : ''}
                  `}>
                    {item.icon}
                  </span>
                  
                  {/* Label */}
                  {!collapsed && (
                    <span className="flex-1 text-left truncate">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Shortcut hint */}
                  {!collapsed && item.shortcut && (
                    <span className={`
                      text-[10px] px-1.5 py-0.5 rounded
                      transition-opacity duration-200
                      ${isActive 
                        ? 'bg-[var(--accent)]/20 text-[var(--accent)]' 
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                      }
                    `}>
                      {item.shortcut}
                    </span>
                  )}
                  
                  {/* Hover glow effect */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/5 to-[var(--accent)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-[var(--border)]">
        <button 
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
            text-sm font-medium transition-all duration-200
            text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]
            relative overflow-hidden group
          `}
        >
          <Settings size={18} className="flex-shrink-0 transition-transform duration-200 group-hover:rotate-90" />
          {!collapsed && <span>Einstellungen</span>}
          
          {/* Hover indicator */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[var(--accent)] rounded-r-full opacity-0 group-hover:h-4 group-hover:opacity-100 transition-all duration-200" />
        </button>
        
        {/* Version info */}
        {!collapsed && (
          <div className="mt-2 px-3 py-1.5 text-[10px] text-[var(--text-muted)] text-center">
            v1.0.0 • Mission Control
          </div>
        )}
      </div>
    </aside>
  );
}
