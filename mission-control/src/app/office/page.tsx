'use client';

import { useState } from 'react';
import OfficeScreen from '@/screens/OfficeScreen';

export default function OfficePage() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Office</h1>
        <p className="text-sm text-[var(--text-muted)]">Tools & Utilities</p>
      </div>
      <OfficeScreen />
    </div>
  );
}
