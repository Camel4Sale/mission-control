'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { Plus, GripVertical, MoreHorizontal, Calendar, Flag } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate?: (task: Task) => void;
}

const columns = [
  { id: 'backlog', label: 'Backlog', color: '#6e6e73' },
  { id: 'todo', label: 'To Do', color: '#fbbf24' },
  { id: 'in-progress', label: 'In Progress', color: '#5e6ad2' },
  { id: 'done', label: 'Done', color: '#34d399' },
] as const;

export default function TaskBoard({ tasks: initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getTasksByStatus = (status: Task['status']) => 
    tasks.filter(t => t.status === status);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task['status']) => {
    if (!draggedTask) return;
    setTasks(tasks.map(t => 
      t.id === draggedTask ? { ...t, status, updatedAt: new Date().toISOString().split('T')[0] } : t
    ));
    setDraggedTask(null);
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'backlog',
      priority: 'medium',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-[#f87171]';
      case 'medium': return 'text-[#fbbf24]';
      case 'low': return 'text-[#34d399]';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="text-sm text-[var(--text-secondary)]">Kanban Board</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Neue Aufgabe..."
            className="linear-input w-64"
          />
          <button onClick={addTask} className="linear-btn flex items-center gap-2">
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="kanban-column flex flex-col"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div 
              className="kanban-column-header flex items-center justify-between"
              style={{ borderLeftColor: column.color, borderLeftWidth: 3 }}
            >
              <span className="flex items-center gap-2">
                {column.label}
                <span className="text-[var(--text-muted)] text-xs">
                  {getTasksByStatus(column.id).length}
                </span>
              </span>
              <button className="p-1 hover:bg-[var(--bg-hover)] rounded">
                <Plus size={14} />
              </button>
            </div>
            
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {getTasksByStatus(column.id).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  className="card card-hover cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical size={14} className="text-[var(--text-muted)] mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                          <Flag size={10} fill="currentColor" />
                          {task.priority}
                        </span>
                        {task.assignee && (
                          <span className="text-xs text-[var(--text-muted)]">
                            {task.assignee}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="p-1 hover:bg-[var(--bg-hover)] rounded text-[var(--text-muted)]">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
