'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
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
import { 
  initialTasks, 
  initialCronJobs, 
  initialProjects, 
  initialMemoryEntries, 
  initialLongTermMemory,
  initialDocuments,
  initialAgents,
  missionStatement 
} from '@/lib/data';

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
    // Map path to screen
    const screenMap: Record<string, Screen> = {
      '/tasks': 'tasks',
      '/calendar': 'calendar',
      '/projects': 'projects',
      '/memory': 'memory',
      '/docs': 'docs',
      '/team': 'team',
      '/office': 'office',
      '/molty': 'molty',
    };
    
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
        return <TaskBoard tasks={initialTasks} />;
      case 'calendar':
        return <CalendarScreen cronJobs={initialCronJobs} />;
      case 'projects':
        return <ProjectsScreen projects={initialProjects} />;
      case 'memory':
        return <MemoryScreen memoryEntries={initialMemoryEntries} longTermMemory={initialLongTermMemory} />;
      case 'docs':
        return <DocsScreen documents={initialDocuments} />;
      case 'team':
        return <TeamScreen agents={initialAgents} missionStatement={missionStatement} />;
      case 'office':
        return <OfficeScreen agents={initialAgents} />;
      case 'molty':
        return <MoltyPanel />;
      case 'openclaw':
        return <OpenClawPage />;
      default:
        return <TaskBoard tasks={initialTasks} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)]">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 p-6 overflow-hidden">
            {renderScreen()}
          </main>
        </div>
        <CommandPalette onNavigate={handleNavigate} />
        <button
          onClick={() => setQuickAddOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--accent)] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
          title="Quick Add (⌘N)"
        >
          <Plus size={24} />
        </button>
      </div>
      <QuickAdd isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </div>
  );
}
