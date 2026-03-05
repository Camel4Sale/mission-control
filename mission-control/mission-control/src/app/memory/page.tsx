'use client';

import { useState } from 'react';
import MemoryScreen from '@/screens/MemoryScreen';
import { initialMemoryEntries, initialLongTermMemory } from '@/lib/data';

export default function MemoryPage() {
  const [memoryEntries] = useState(initialMemoryEntries);
  const [longTermMemory] = useState(initialLongTermMemory);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Memory</h1>
        <p className="text-sm text-[var(--text-muted)]">Langzeitgedächtnis</p>
      </div>
      <MemoryScreen />
    </div>
  );
}
