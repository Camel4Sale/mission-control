'use client';

import { useState } from 'react';
import ProjectsScreen from '@/screens/ProjectsScreen';
import { initialProjects } from '@/lib/data';

export default function ProjectsPage() {
  const [projects] = useState(initialProjects);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-sm text-[var(--text-muted)]">Projektübersicht</p>
      </div>
      <ProjectsScreen />
    </div>
  );
}
