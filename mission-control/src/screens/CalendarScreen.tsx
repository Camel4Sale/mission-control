'use client';

import { useState } from 'react';
import { CronJob } from '@/types';
import { ChevronLeft, ChevronRight, Clock, Play, Pause, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { de } from 'date-fns/locale';

interface CalendarScreenProps {
  cronJobs: CronJob[];
}

export default function CalendarScreen({ cronJobs }: CalendarScreenProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad days to start on Monday
  const startDay = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
  const paddedDays = Array(startDay).fill(null).concat(days);

  const getJobsForDate = (date: Date) => {
    return cronJobs.filter(job => {
      const nextRun = new Date(job.nextRun);
      return isSameDay(nextRun, date);
    });
  };

  const selectedDateJobs = getJobsForDate(selectedDate);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Kalender</h1>
          <p className="text-sm text-[var(--text-secondary)]">Cron Jobs & geplante Aufgaben</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-md"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: de })}
          </span>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-md"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Calendar Grid */}
        <div className="flex-1 card">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-[var(--text-muted)] py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {paddedDays.map((day, i) => {
              if (!day) {
                return <div key={`empty-${i}`} className="h-20" />;
              }
              
              const dayJobs = getJobsForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`h-20 p-2 rounded-md text-left transition-colors relative ${
                    isSelected 
                      ? 'bg-[var(--accent-muted)] border border-[var(--accent)]' 
                      : 'hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <span className={`text-sm ${isToday ? 'text-[var(--accent)] font-bold' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayJobs.length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2">
                      {dayJobs.slice(0, 2).map(job => (
                        <div 
                          key={job.id}
                          className="text-[10px] truncate bg-[var(--bg-tertiary)] px-1 py-0.5 rounded mb-1"
                        >
                          {job.name}
                        </div>
                      ))}
                      {dayJobs.length > 2 && (
                        <div className="text-[10px] text-[var(--text-muted)]">
                          +{dayJobs.length - 2} mehr
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Selected Date Details */}
        <div className="w-80 card">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon size={18} className="text-[var(--accent)]" />
            <h2 className="font-medium">
              {format(selectedDate, 'EEEE, d. MMMM', { locale: de })}
            </h2>
          </div>

          {selectedDateJobs.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">Keine geplanten Aufgaben</p>
          ) : (
            <div className="space-y-3">
              {selectedDateJobs.map(job => (
                <div key={job.id} className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{job.name}</span>
                    <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Clock size={12} />
                    <span>{job.schedule}</span>
                  </div>
                  {job.description && (
                    <p className="text-xs text-[var(--text-muted)] mt-2">{job.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* All Cron Jobs List */}
          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <h3 className="text-sm font-medium mb-3">Alle Cron Jobs</h3>
            <div className="space-y-2">
              {cronJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-2 hover:bg-[var(--bg-hover)] rounded">
                  <div className="flex items-center gap-2">
                    {job.status === 'active' ? (
                      <Play size={12} className="text-[var(--success)]" />
                    ) : (
                      <Pause size={12} className="text-[var(--warning)]" />
                    )}
                    <span className="text-sm">{job.name}</span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-mono">{job.schedule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
