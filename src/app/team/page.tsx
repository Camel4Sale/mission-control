'use client';

import { useState } from 'react';
import TeamScreen from '@/screens/TeamScreen';
import { initialAgents, missionStatement } from '@/lib/data';

export default function TeamPage() {
  const [agents] = useState(initialAgents);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Team</h1>
        <p className="text-sm text-[var(--text-muted)]">Agenten & Tools</p>
      </div>
      <TeamScreen agents={agents} missionStatement={missionStatement} />
    </div>
  );
}
