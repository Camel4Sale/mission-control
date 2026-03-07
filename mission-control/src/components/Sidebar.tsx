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
  Bot,
  Activity,
  ChevronLeft,
  ChevronRight,
  Server,
  Shield,
  Clock,
  Link as LinkIcon,
  Zap
} from 'lucide-react';

export type Screen = 'tasks' | 'calendar' | 'projects' | 'memory' | 'docs' | 'team' | 'office' | 'molty' | 'openclaw' | 'dashboard' | 'agents' | 'gateways' | 'activity' | 'approvals' | 'organization';

interface SidebarProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

const menuItems: { id: Screen; label: string; icon: React.ReactNode; shortcut: string; href?: string; accent?: 'cyan' | 'amber' | 'violet' }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, shortcut: 'G D', accent: 'cyan', href: '/dashboard' },
  { id: 'tasks', label: 'Tasks', icon: <FolderKanban size={18} />, shortcut: 'G T', accent: 'cyan' },
  { id: 'calendar', label: 'Kalender', icon: <Calendar size={18} />, shortcut: 'G C', accent: 'cyan' },
  { id: 'projects', label: 'Projekte', icon: <LayoutDashboard size={18} />, shortcut: 'G P', accent: 'cyan' },
  { id: 'memory', label: 'Memory', icon: <Brain size={18} />, shortcut: 'G M', accent: 'violet' },
  { id: 'docs', label: 'Docs', icon: <FileText size={18} />, shortcut: 'G D', accent: 'amber' },
  { id: 'team', label: 'Team', icon: <Users size={18} />, shortcut: '' },
  { id: 'office', label: 'Office', icon: <Building2 size={18} />, shortcut: '' },
  { id: 'molty', label: 'Molty AI', icon: <Bot size={18} />, shortcut: 'G A', accent: 'cyan' },
  { id: 'openclaw', label: 'OpenClaw', icon: <Activity size={18} />, shortcut: 'G O', accent: 'cyan' },
  // OpenClaw Features
  { id: 'agents', label: 'Agents', icon: <Bot size={18} />, shortcut: '', href: '/agents' },
  { id: 'gateways', label: 'Gateways', icon: <Server size={18} />, shortcut: '', href: '/gateways' },
  { id: 'activity', label: 'Activity', icon: <Clock size={18} />, shortcut: '', href: '/activity' },
  { id: 'approvals', label: 'Approvals', icon: <Shield size={18} />, shortcut: '', href: '/approvals' },
  { id: 'organization', label: 'Organization', icon: <LinkIcon size={18} />, shortcut: '', href: '/organization' },
];

const accentColors = {
  cyan: {
    bg: 'rgba(0, 212, 255, 0.1)',
    text: '#00d4ff',
    glow: 'rgba(0, 212, 255, 0.3)',
  },
  amber: {
    bg: 'rgba(255, 170, 0, 0.1)',
    text: '#ffaa00',
    glow: 'rgba(255, 170, 0, 0.3)',
  },
  violet: {
    bg: 'rgba(139, 92, 246, 0.1)',
    text: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.3)',
  },
};

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
      className={`h-screen flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div 
        className="h-16 flex items-center justify-between px-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
              }}
            >
              <Zap size={18} className="text-white relative z-10" />
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
                }}
              />
            </div>
            <div className="flex flex-col">
              <span 
                className="font-bold text-sm leading-tight"
                style={{ 
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                }}
              >
                Mission
              </span>
              <span 
                className="text-[10px] -mt-0.5"
                style={{ 
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Control
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div 
            className="w-9 h-9 rounded-xl mx-auto flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
            }}
          >
            <Zap size={18} className="text-white" />
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-[28px] z-10 flex items-center justify-center transition-all duration-200"
        style={{
          left: collapsed ? '76px' : '244px',
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
        title={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeScreen === item.id;
            const isHovered = hoveredItem === item.id;
            const colors = item.accent ? accentColors[item.accent] : accentColors.cyan;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl 
                    transition-all duration-200 relative overflow-hidden
                    ${collapsed ? 'justify-center' : ''}
                  `}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: isActive ? '600' : '400',
                    fontSize: '0.875rem',
                    background: isActive ? colors.bg : 'transparent',
                    color: isActive ? colors.text : 'var(--text-secondary)',
                    border: isActive ? `1px solid ${colors.bg}` : '1px solid transparent',
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Hover/Active glow */}
                  {(isHovered || isActive) && (
                    <div 
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at left, ${colors.glow}, transparent 70%)`,
                        opacity: isActive ? 0.5 : 0.2,
                      }}
                    />
                  )}
                  
                  {/* Active indicator bar */}
                  {isActive && (
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                      style={{ background: colors.text }}
                    />
                  )}
                  
                  {/* Icon */}
                  <span className={`
                    flex-shrink-0 transition-transform duration-200 relative z-10
                    ${isHovered && !isActive ? 'scale-110' : ''}
                  `}>
                    {item.icon}
                  </span>
                  
                  {/* Label */}
                  {!collapsed && (
                    <span className="flex-1 text-left truncate relative z-10">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Shortcut hint */}
                  {!collapsed && item.shortcut && (
                    <span 
                      className="text-[10px] px-1.5 py-0.5 rounded-md font-medium relative z-10"
                      style={{
                        background: isActive ? `${colors.text}20` : 'var(--bg-tertiary)',
                        color: isActive ? colors.text : 'var(--text-muted)',
                      }}
                    >
                      {item.shortcut}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div 
        className="p-3"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <button 
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl 
            transition-all duration-200 relative overflow-hidden
            ${collapsed ? 'justify-center' : ''}
          `}
          style={{
            color: 'var(--text-secondary)',
          }}
        >
          <span className="flex-shrink-0">
            <Settings size={18} />
          </span>
          {!collapsed && (
            <span 
              className="font-medium"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}
            >
              Einstellungen
            </span>
          )}
        </button>
        
        {/* Version info */}
        {!collapsed && (
          <div 
            className="mt-3 px-3 py-2 rounded-lg text-center"
            style={{ 
              background: 'var(--bg-tertiary)',
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)' }}>v1.0.0</span>
            <span style={{ opacity: 0.5 }}> • Mission Control</span>
          </div>
        )}
      </div>
    </aside>
  );
}
