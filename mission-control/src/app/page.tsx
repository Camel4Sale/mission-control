'use client';

import { useState } from 'react';
import Sidebar, { Screen } from '@/components/Sidebar';
import TaskBoard from '@/screens/TaskBoard';
import CalendarScreen from '@/screens/CalendarScreen';
import ProjectsScreen from '@/screens/ProjectsScreen';
import MemoryScreen from '@/screens/MemoryScreen';
import DocsScreen from '@/screens/DocsScreen';
import TeamScreen from '@/screens/TeamScreen';
import OfficeScreen from '@/screens/OfficeScreen';
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

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<Screen>('tasks');

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
      default:
        return <TaskBoard tasks={initialTasks} />;
    }
  };

  return (
    <div className="h-screen flex bg-[var(--bg-primary)]">
      <Sidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} />
      <main className="flex-1 p-6 overflow-hidden">
        {renderScreen()}
      </main>
    </div>
  );
}
