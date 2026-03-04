'use client';

import { useState } from 'react';
import DocsScreen from '@/screens/DocsScreen';
import { initialDocuments } from '@/lib/data';

export default function DocsPage() {
  const [docs] = useState(initialDocuments);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Docs</h1>
        <p className="text-sm text-[var(--text-muted)]">Dokumentation</p>
      </div>
      <DocsScreen />
    </div>
  );
}
