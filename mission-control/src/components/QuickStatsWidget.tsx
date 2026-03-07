'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TaskDistribution {
  name: string;
  value: number;
  color: string;
}

export default function QuickStatsWidget() {
  const [distribution, setDistribution] = useState<TaskDistribution[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    // Load tasks from localStorage
    const stored = localStorage.getItem('mc_tasks');
    if (stored) {
      const tasks = JSON.parse(stored);
      setTotalTasks(tasks.length);
      
      // Calculate distribution
      const statusCount: Record<string, number> = {
        backlog: 0,
        todo: 0,
        'in-progress': 0,
        done: 0,
      };
      
      tasks.forEach((task: any) => {
        statusCount[task.status] = (statusCount[task.status] || 0) + 1;
      });
      
      setDistribution([
        { name: 'Backlog', value: statusCount.backlog, color: '#6e6e73' },
        { name: 'To Do', value: statusCount.todo, color: '#fbbf24' },
        { name: 'In Progress', value: statusCount['in-progress'], color: '#5e6ad2' },
        { name: 'Done', value: statusCount.done, color: '#34d399' },
      ].filter(d => d.value > 0));
    }
  }, []);

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base">Task Verteilung</h3>
          <p className="text-xs text-[var(--text-muted)]">{totalTasks} Tasks insgesamt</p>
        </div>
      </div>

      {/* Pie Chart */}
      {distribution.length > 0 ? (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center text-[var(--text-muted)] text-sm">
          Keine Tasks vorhanden
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {distribution.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-[var(--text-secondary)]">{item.name}</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
