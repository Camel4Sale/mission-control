'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Zap } from 'lucide-react';
import Sidebar, { Screen } from '@/components/Sidebar';
import CommandPalette from '@/components/CommandPalette';
import TopBar from '@/components/TopBar';
import QuickAdd from '@/components/QuickAdd';
import TaskBoard from '@/screens/TaskBoard';
import CalendarScreen from '@/screens/CalendarScreen';
import ProjectsScreen from '@/screens/ProjectsScreen';
import MemoryScreen from '@/screens/MemoryScreen';
import DocsScreen from '@/screens/DocsScreen';
import TeamScreen from '@/screens/TeamScreen';
import OfficeScreen from '@/screens/OfficeScreen';
import MoltyPanel from '@/components/MoltyPanel';
import OpenClawPage from '@/app/openclaw/page';

const screenMap: Record<string, Screen> = {
  'tasks': 'tasks',
  'calendar': 'calendar',
  'projects': 'projects',
  'memory': 'memory',
  'docs': 'docs',
  'team': 'team',
  'office': 'office',
  'molty': 'molty',
  'openclaw': 'openclaw',
};

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<Screen>('tasks');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const router = useRouter();

  // Listen for QuickAdd event
  useEffect(() => {
    const handleQuickAdd = () => setQuickAddOpen(true);
    window.addEventListener('open-quick-add', handleQuickAdd);
    return () => window.removeEventListener('open-quick-add', handleQuickAdd);
  }, []);

  // Global keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only handle if not in input
    if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
    
    const key = e.key.toLowerCase();
    const isMod = e.metaKey || e.ctrlKey;

    if (isMod && key === 'n') {
      e.preventDefault();
      setQuickAddOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNavigate = (path: string) => {
    const screen = screenMap[path];
    if (screen) {
      setActiveScreen(screen);
    } else {
      router.push(path);
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'tasks':
        return <TaskBoard />;
      case 'calendar':
        return <CalendarScreen />;
      case 'projects':
        return <ProjectsScreen />;
      case 'memory':
        return <MemoryScreen />;
      case 'docs':
        return <DocsScreen />;
      case 'team':
        return <TeamScreen />;
      case 'office':
        return <OfficeScreen />;
      case 'molty':
        return <MoltyPanel />;
      case 'openclaw':
        return <OpenClawPage />;
      default:
        return <TaskBoard />;
    }
  };

  return (
    <div 
      className="h-screen flex flex-col"
      style={{ background: 'var(--bg-void)' }}
    >
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main 
            className="flex-1 overflow-hidden"
            style={{ padding: 'var(--space-6)' }}
          >
            {renderScreen()}
          </main>
        </div>
        <CommandPalette onNavigate={handleNavigate} />
        
        {/* Quick Add FAB */}
        <button
          onClick={() => setQuickAddOpen(true)}
          className="fixed bottom-6 right-6 group z-40"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            border: 'none',
            cursor: 'pointer',
          }}
          title="Quick Add (⌘N)"
        >
          <Plus 
            size={24} 
            className="text-white transition-transform duration-300 group-hover:rotate-90" 
          />
        </button>
      </div>
      <QuickAdd isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </div>
  );
}
