'use client';

import CalendarScreen from '@/screens/CalendarScreen';

export default function CalendarPage() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <p className="text-sm text-[var(--text-muted)]">Kalender & Termine</p>
      </div>
      <CalendarScreen />
    </div>
  );
}
