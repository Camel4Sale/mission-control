'use client';

import { useState } from 'react';
import CalendarScreen from '@/screens/CalendarScreen';
import { initialCronJobs } from '@/lib/data';

export default function CalendarPage() {
  const [jobs] = useState(initialCronJobs);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <p className="text-sm text-[var(--text-muted)]">Kalender & Termine</p>
      </div>
      <CalendarScreen cronJobs={jobs} />
    </div>
  );
}
