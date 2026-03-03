'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Command, GraduationCap, Building2, Sun, Home, 
  Briefcase, LayoutGrid, Settings, ChevronRight,
  GraduationCap as KITIcon,
  Code as PathiumIcon,
  Zap as CelarisIcon,
  Building as ElysiumIcon
} from 'lucide-react';

const navigation = [
  { name: 'Command Center', href: '/', icon: Command, shortcut: 'G H' },
  { 
    name: 'Studium (KIT)', 
    href: '/studium', 
    icon: GraduationCap,
    color: 'var(--kit)',
    items: [
      { name: 'Dashboard', href: '/studium' },
      { name: 'Module', href: '/studium/module', shortcut: 'G M' },
      { name: 'Klausuren', href: '/studium/klausuren', shortcut: 'G K' },
      { name: 'Masterarbeit', href: '/studium/thesis', shortcut: 'G T' },
      { name: 'Noten', href: '/studium/noten', shortcut: 'G N' },
    ]
  },
  { 
    name: 'Unternehmen', 
    href: '/unternehmen', 
    icon: Building2,
    color: 'var(--pathium)',
    items: [
      { name: 'Übersicht', href: '/unternehmen' },
      { name: 'Pathium', href: '/unternehmen/pathium', shortcut: 'G P', icon: PathiumIcon, color: 'var(--pathium)' },
      { name: 'Celaris', href: '/unternehmen/celaris', shortcut: 'G C', icon: CelarisIcon, color: 'var(--celaris)' },
      { name: 'Elysium', href: '/unternehmen/elysium', shortcut: 'G E', icon: ElysiumIcon, color: 'var(--elysium)' },
    ]
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>('unternehmen');

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleExpanded = (name: string) => {
    setExpanded(expanded === name ? null : name);
  };

  return (
    <aside className="w-64 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
            <Command size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Life OS</h1>
            <p className="text-[10px] text-[var(--text-muted)]">Command Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.items ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <item.icon size={18} style={{ color: item.color }} />
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronRight 
                      size={14} 
                      className={`transition-transform ${expanded === item.name ? 'rotate-90' : ''}`}
                    />
                  </button>
                  
                  {expanded === item.name && (
                    <ul className="ml-9 mt-1 space-y-1">
                      {item.items?.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              pathname === subItem.href
                                ? 'bg-[#6366f1]/10 text-[#6366f1]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{subItem.name}</span>
                              {subItem.shortcut && (
                                <kbd className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                                  {subItem.shortcut}
                                </kbd>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive(item.href)
                      ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <item.icon size={18} style={{ color: item.color || '#6366f1' }} />
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border)]">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
          <Settings size={16} />
          <span>Einstellungen</span>
        </button>
      </div>
    </aside>
  );
}
