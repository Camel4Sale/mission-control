'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface TaskData {
  date: string
  completed: number
  total: number
  avgTime: number
}

export function TaskMetrics() {
  const [data, setData] = useState<TaskData[]>([])

  useEffect(() => {
    // Mock data for last 7 days
    const mockData: TaskData[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return {
        date: date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
        completed: Math.floor(Math.random() * 50) + 20,
        total: Math.floor(Math.random() * 60) + 30,
        avgTime: Math.floor(Math.random() * 300) + 60,
      }
    }).reverse()

    setData(mockData)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Completed vs Total */}
          <div>
            <h3 className="text-sm font-medium mb-4">Tasks Completed (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                <Bar dataKey="total" fill="#3b82f6" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Avg Time Trend */}
          <div>
            <h3 className="text-sm font-medium mb-4">Average Task Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgTime" stroke="#f59e0b" strokeWidth={2} name="Avg Time (s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
