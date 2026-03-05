'use client';

import { useState } from 'react';
import TaskBoard from '@/screens/TaskBoard';
import { initialTasks } from '@/lib/data';
import { Task } from '@/types';

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-sm text-[var(--text-muted)]">Task Board</p>
      </div>
      <TaskBoard />
    </div>
  );
}
